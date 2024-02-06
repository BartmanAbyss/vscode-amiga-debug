import { FunctionComponent, JSX } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { Custom } from '../custom';
import { GetMemoryAfterDma, GetPaletteFromCustomRegs, IScreen, GetScreenFromCopper, GetPaletteFromMemory, GetPaletteFromCopper, BlitterChannel, NR_DMA_REC_VPOS, NR_DMA_REC_HPOS, GetCustomRegsAfterDma, CpuCyclesToDmaCycles, GetColorCss, ScreenType, displayLeft, displayTop, ColorSwap } from '../dma';
import { GfxResourceType, GfxResource, GfxResourceFlags } from '../../backend/profile_types';
import { createPortal } from 'preact/compat';

import { DropdownComponent, DropdownOptionProps } from '../dropdown';
import '../dropdown.css';

import { IZoomProps, ZoomCanvas } from './zoomcanvas';
import create from 'zustand';

// https://stackoverflow.com/a/54014428
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsl2rgb(h: number, s: number, l: number) {
	const a = s * Math.min(l, 1 - l);
	const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [f(0), f(8), f(4)];
}

interface ScreenZoomProps extends IZoomProps {
	screen: IScreen;
	mask?: IScreen;
	getPixel: (scr: IScreen, x: number, y: number) => number;
}

const ScreenZoomInfo: FunctionComponent<ScreenZoomProps> = (props: ScreenZoomProps) => {
	if(props.x !== undefined && props.y !== undefined) {
		const color = props.getPixel(props.screen, props.x, props.y);
		const mask = props.mask ? props.getPixel(props.mask, props.x, props.y) : undefined;
		return <div>
			<dl>
				<dt>Pos</dt>
				<dd>X:{props.x} Y:{props.y}</dd>
				{color !== undefined && <>
					<dt>Color</dt>
					<dd>{color} ${color.toString(16).padStart(2, '0')} %{color.toString(2).padStart(props.screen.planes.length, '0')}</dd>
					{mask !== undefined && <>
						<dt>Mask</dt>
						<dd>{mask} ${mask.toString(16).padStart(2, '0')} %{mask.toString(2).padStart(props.mask.planes.length, '0')}</dd>
					</>}
				</>}
			</dl>
		</div>;
	}
	return <div />;
};

export const Screen: FunctionComponent<{
	screen: IScreen;
	mask?: IScreen;
	palette?: number[];
	flags?: GfxResourceFlags;
	scale?: number;
	useZoom?: boolean;
	frame: number;
	time: number;
	overlay?: string;
}> = ({ screen, mask, palette, flags = 0, scale = 2, useZoom = true, frame, time, overlay = '' }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasScaleX = screen.hires ? scale / 2 : scale;
	const canvasScaleY = scale;
	const canvasWidth = screen.width * canvasScaleX;
	const canvasHeight = screen.height * canvasScaleY;

	const zoomCanvasScale = 8;
	const zoomCanvasWidth = 144;
	const zoomCanvasHeight = 144;

	const overdrawCanvas = useRef<HTMLCanvasElement>();

	interface BlitRect {
		left: number;
		top: number;
		width: number;
		height: number;
		active: boolean;
	}

	const memory = useMemo(() => GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, CpuCyclesToDmaCycles(time)), [time, frame]);

	const getPixel = useMemo(() => (scr: IScreen, x: number, y: number): number => {
		let pixel = 0;
		for (let p = 0; p < scr.planes.length; p++) {
			const addr = scr.planes[p] + y * (scr.width / 8 + scr.modulos[p & 1]) + Math.floor(x / 8);
			const raw = memory.readByte(addr);
			if (raw & (1 << (7 - (x & 7))))
				pixel |= 1 << p;
		}
		return pixel;
	}, [memory]);

	useEffect(() => { // screen
		const context = canvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		const putPixel = (x: number, y: number, color: number) => {
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX + xx);
					data[offset] = color;
				}
			}
		};
		if(screen.type === ScreenType.sprite) {
			let addr = screen.planes[0];
			for(let i = 0; i < 256; i++) { // safety limit
				const pos = memory.readWord(addr); addr += 2;
				const ctl = memory.readWord(addr); addr += 2;
				//console.log(`pos:${pos.toString(16).padStart(4, '0')} ctl:${ctl.toString(16).padStart(4, '0')}`);
				if(pos === 0 && ctl === 0)
					break;

				const vstart = (pos >>> 8) | ((ctl & (1 << 2)) << (8 - 2));
				const vstop  = (ctl >>> 8) | ((ctl & (1 << 1)) << (8 - 1));
				const hstart = ((pos & 0xff) << 1) | (ctl & (1 << 0));
				//console.log(`x:${hstart} y:${vstart}-${vstop} h:${vstop-vstart+1}`);

				for(let y = vstart; y <= vstop; y++) { // why <= ??
					let data = memory.readWord(addr); addr += 2;
					let datb = memory.readWord(addr); addr += 2;
					//console.log(`  y:${y} a:${data.toString(16).padStart(4, '0')} b:${datb.toString(16).padStart(4, '0')}`);
					for(let x = 0; x < 16; x++) {
						const pixel = (data >>> 15 & 0b01) | ((datb >>> 15) << 1);
						putPixel(hstart + x - displayLeft, y - displayTop, pixel ? ColorSwap(palette[16 + pixel]) : 0);
						data = (data << 1) & 0xffff;
						datb = (datb << 1) & 0xffff;
					}
				}
			}
			context.putImageData(imgData, 0, 0);
		} else {
			const planes = [...screen.planes];
			const maskPlanes = [...mask?.planes ?? []];
			for (let y = 0; y < screen.height; y++) {
				let prevColor = 0xff000000; // 0xAABBGGRR
				for (let x = 0; x < screen.width / 16; x++) {
					for (let i = 0; i < 16; i++) {
						let pixel = 0;
						let pixelMask = 0xffff;
						for (let p = 0; p < planes.length; p++) {
							const addr = planes[p] + x * 2;
							const raw = memory.readWord(addr);
							if ((raw & (1 << (15 - i))))
								pixel |= 1 << p;
						}
						if (mask) {
							for (let p = 0; p < maskPlanes.length; p++) {
								const addr = maskPlanes[p] + x * 2;
								const raw = memory.readWord(addr);
								if ((raw & (1 << (15 - i))))
									pixelMask |= 1 << p;
							}
							pixel &= pixelMask;
							putPixel(x * 16 + i, y, pixel ? ColorSwap(palette[pixel]) : 0); // color 0 is transparent
						} else {
							if(flags & GfxResourceFlags.bitmap_ham) {
								let color = palette[0]; // 0xAABBGGRR
								switch(pixel >> 4) {
								case 0: // set
									color = palette[pixel & 0xf];
									break;
								case 1: // modify blue
									color = (prevColor & ~0xff0000) | ((((pixel & 0xf) << 4) | (pixel & 0xf)) << 16);
									break;
								case 3: // modify green
									color = (prevColor & ~0x00ff00) | ((((pixel & 0xf) << 4) | (pixel & 0xf)) << 8);
									break;
								case 2: // modify red
									color = (prevColor & ~0x0000ff) | ((((pixel & 0xf) << 4) | (pixel & 0xf)) << 0);
									break;
								}
								putPixel(x * 16 + i, y, color);
								prevColor = color;
							} else {
								putPixel(x * 16 + i, y, ColorSwap(palette[pixel]));
							}
						}
					}
				}
				for (let p = 0; p < planes.length; p++) {
					planes[p] += screen.width / 8 + screen.modulos[p & 1];
				}
				if (mask) {
					for (let p = 0; p < maskPlanes.length; p++) {
						maskPlanes[p] += mask.width / 8 + mask.modulos[p & 1];
					}
				}
			}
			context.putImageData(imgData, 0, 0);
		}
	}, [canvas.current, scale, screen, palette, mask, frame, time]);

	useEffect(() => { // overdraw
		if(overlay !== 'overdraw')
			return;

		const context = overdrawCanvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);

		const overdrawWidth = screen.width / 8;
		const overdrawHeight = screen.height;
		const overdraw = new Uint16Array(overdrawWidth * overdrawHeight);
		let i = 0;
		const dmaTime = CpuCyclesToDmaCycles(time);
		for (let cycleY = 0; cycleY < NR_DMA_REC_VPOS && i < dmaTime; cycleY++) {
			for (let cycleX = 0; cycleX < NR_DMA_REC_HPOS && i < dmaTime; cycleX++, i++) {
				const dmaRecord = MODELS[frame].amiga.dmaRecords[cycleY * NR_DMA_REC_HPOS + cycleX];
				if (dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)
					continue;

				const [x, y] = (() => {
					for (let p = 0; p < screen.planes.length; p++) {
						const plane = screen.planes[p];
						const screenLineSize = screen.width / 8 + screen.modulos[p & 1];
						for (let y = 0; y < screen.height; y++) {
							if (dmaRecord.addr >= plane + y * screenLineSize && dmaRecord.addr < plane + y * screenLineSize + screen.width / 8) {
								const x = Math.floor((dmaRecord.addr - plane) % screenLineSize);
								return [x, y];
							}
						}
						return [-1, -1];
					}
				})();
				if (x === -1 || y === -1)
					continue;

				let numBytes = 0;
				if ((dmaRecord.reg & 0x1100) === 0x1100) { // CPU write
					switch (dmaRecord.reg & 0xff) {
					case 1: numBytes = 1; break;
					case 2: numBytes = 2; break;
					case 4: numBytes = 4; break;
					}
				} else if (dmaRecord.reg === 0) { // Blitter write
					numBytes = 2;
				}

				for (let q = 0; q < numBytes; q++)
					overdraw[y * overdrawWidth + x + q]++;
			}
		}
		const put8Pixels = (x: number, y: number, color: number) => {
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX * 8; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX + xx);
					data[offset] = color;
				}
			}
		};

		const overdrawPalette: number[] = [0];
		for (let i = 1; i <= 240; i++) {
			const color = hsl2rgb(240 - i, 1, 0.5);
			overdrawPalette.push(0xa0000000 | ((color[2] * 255) << 16) | ((color[1] * 255) << 8) | ((color[0] * 255) << 0)); // 0xAABBGGRR
		}

		for (let y = 0; y < overdrawHeight; y++) {
			for (let x = 0; x < overdrawWidth; x++) {
				const idx = Math.max(0, Math.min(240, overdraw[y * overdrawWidth + x] * 48));
				put8Pixels(x * 8, y, overdrawPalette[idx]);
			}
		}

		context.putImageData(imgData, 0, 0);
	}, [overdrawCanvas.current, scale, screen, frame, time, overlay]);

	const blitRects = useMemo(() => { // blitter rects
		const blitRects: BlitRect[] = [];

		if(overlay !== 'blitrects')
			return blitRects;

		const dmaTime = CpuCyclesToDmaCycles(time);
		for(const blit of MODELS[frame].blits) {
			if (blit.cycleStart > dmaTime)
				break;

			// is this blit affecting our screen?
			const dest = blit.BLTxPT[BlitterChannel.D];
			// get top-left corner of blit
			const [x, y] = (() => {
				for (let p = 0; p < screen.planes.length; p++) {
					let plane = screen.planes[p];
					const screenLineSize = screen.width / 8 + screen.modulos[p & 1];
					for(let yy = 0; yy < screen.height; yy++) {
						// hmm.. this code is not detecting bits that start outside our screen but then intersect the screen
						if (dest >= plane && dest < plane + screen.width / 8) {
							const x = (dest - plane) * 8;
							return [x, yy];
						}
						plane += screenLineSize;
					}
				}
				return [-1, -1];
			})();
			if (x === -1 || y === -1)
				continue;

			blitRects.push({ left: x, top: y, width: blit.BLTSIZH * 16, height: Math.floor(blit.BLTSIZV / screen.planes.length), active: blit.cycleEnd > dmaTime });
		}
		return blitRects;
	}, [screen, frame, time, overlay]);

	return <>
		<div class={styles.screen}>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} class={styles.screen_canvas} data-canvasScaleX={canvasScaleX} data-canvasScaleY={canvasScaleY} />
			{overlay === 'overdraw' && <canvas class={styles.overdraw_canvas} ref={overdrawCanvas} width={canvasWidth} height={canvasHeight} />}
			{blitRects.map((blitRect) =>
				<div class={blitRect.active ? styles.blitrect_active : styles.blitrect}
					style={{ left: blitRect.left * canvasScaleX, top: blitRect.top * canvasScaleY, width: blitRect.width * canvasScaleX, height: blitRect.height * canvasScaleY }} />
			)}
			{useZoom && <ZoomCanvas canvas={canvas} scale={zoomCanvasScale} width={zoomCanvasWidth} height={zoomCanvasHeight} infoWidth={150} infoHeight={190} ZoomInfo={ScreenZoomInfo} zoomExtraProps={{ screen, mask, getPixel }} />}
		</div>
	</>;
};

interface GfxResourceWithPayload {
	resource: GfxResource;
	frame: number;
	screen?: IScreen;
	mask?: IScreen;
	palette?: number[];
}

const GfxResourceItem: FunctionComponent<DropdownOptionProps<GfxResourceWithPayload>> = ({ option, placeholder }) => {
	const resource = option.resource;

	const [hover, setHover] = useState<{ x: number; y: number }>({ x: -1, y: -1 });

	const onMouseEnter = (evt: JSX.TargetedMouseEvent<HTMLDivElement>) => {
		const rect = evt.currentTarget.parentElement.parentElement.getBoundingClientRect();
		setHover({ x: rect.right + 5, y: rect.top + 5 });
	};
	const onMouseLeave = () => {
		setHover({ x: -1, y: -1 });
	};

	return (<>
		<div class={placeholder ? styles.gfxresource_brief : styles.gfxresource} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<dt>{resource.name}</dt>
			<dd>
				{resource.type === GfxResourceType.bitmap && (<>
					{resource.bitmap.width}x{resource.bitmap.height}x{resource.bitmap.numPlanes}
					&nbsp;
					{resource.flags & GfxResourceFlags.bitmap_interleaved ? 'I' : ''}
					{resource.flags & GfxResourceFlags.bitmap_masked ? 'M' : ''}
					{resource.flags & GfxResourceFlags.bitmap_ham ? 'H' : ''}
				</>)}
				{resource.type === GfxResourceType.palette && (<>
					<div class={styles.palette}>
						{option.palette.slice(0, option.palette.length >>> 1).map((p) => <div style={{ backgroundColor: GetColorCss(p) }} />)}
					</div>
				</>)}
			</dd>
			<dd class={styles.right}>{resource.size ? (resource.size.toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'b') : ''}</dd>
			<dd class={styles.fixed}>{resource.address ? ('$' + resource.address.toString(16).padStart(8, '0')) : ''}</dd>
		</div>
		{(!placeholder && hover.x >= 0 && resource.type === GfxResourceType.bitmap) && createPortal(<div class={styles.tooltip} style={{ lineHeight: 0, left: hover.x, top: hover.y, bottom: 'initial' }}>
			<Screen screen={option.screen} palette={GetPaletteFromCustomRegs(new Uint16Array(MODELS[option.frame].amiga.customRegs))} flags={option.resource.flags} scale={1} useZoom={false} time={0} frame={option.frame} />
		</div>, document.body)}
	</>);
};

// do not move into 'CopperList' otherwise the Dropdown will be recreated on every render
class GfxResourceDropdown extends DropdownComponent<GfxResourceWithPayload> {
	public static defaultProps = { optionComponent: GfxResourceItem, menuClassName: styles.gfxresource_menu, ...DropdownComponent.defaultProps };
}

// store state because component will get unmounted when tab switches
interface IState {
	bitmap?: GfxResourceWithPayload;
	palette?: GfxResourceWithPayload;
	overlay?: string;
}
const useStore = create<IState>(() => ({}));

export const GfxResourcesView: FunctionComponent<{
	frame: number;
	time: number;
}> = ({ frame, time }) => {
	const copper = MODELS[frame].copper;
	const bitmaps = useMemo(() => {
		const bitmaps: GfxResourceWithPayload[] = [];
		MODELS[frame].amiga.gfxResources.filter((r) => r.type === GfxResourceType.bitmap).sort((a, b) => a.name.localeCompare(b.name)).forEach((resource) => {
			const width = resource.bitmap.width;
			const height = resource.bitmap.height;
			const modulos = [];
			const planes: number[] = [];
			if (resource.flags & GfxResourceFlags.bitmap_interleaved) {
				const moduloScale = (resource.flags & GfxResourceFlags.bitmap_masked) ? 2 : 1;
				for (let p = 0; p < resource.bitmap.numPlanes; p++)
					planes.push(resource.address + p * width / 8 * moduloScale);
				const modulo = (width / 8) * (resource.bitmap.numPlanes * moduloScale - 1);
				modulos.push(modulo, modulo);
			} else {
				for (let p = 0; p < resource.bitmap.numPlanes; p++)
					planes.push(resource.address + p * width / 8 * height);
				modulos.push(0, 0);
			}
			const screen: IScreen = { type: ScreenType.normal, width, height, planes, modulos, hires: false, ham: false };
			let mask: IScreen;
			if (resource.flags & GfxResourceFlags.bitmap_masked) {
				const maskPlanes = [...planes];
				if (resource.flags & GfxResourceFlags.bitmap_interleaved) {
					for (let p = 0; p < resource.bitmap.numPlanes; p++)
						maskPlanes[p] += width / 8;
				} else {
					// ??? does this make sense ?? not tested
					for (let p = 0; p < resource.bitmap.numPlanes; p++)
						maskPlanes[p] += width / 8 * height;
				}
				mask = { type: ScreenType.normal, width, height, planes: maskPlanes, modulos, hires: false, ham: false };
			}
			bitmaps.push({ resource, frame, screen, mask });
		});
		const copperScreens: { screen: IScreen; frames: number[] }[] = [];
		// dupecheck copper screens from all frames
		for(let i = 0; i < MODELS.length; i++) {
			if(MODELS[i].copper) {
				const copperScreen = GetScreenFromCopper(MODELS[i].copper, MODELS[0].amiga.chipsetFlags);
				const dupe = copperScreens.findIndex((cs) => JSON.stringify(cs.screen) === JSON.stringify(copperScreen));
				if(dupe === -1)
					copperScreens.push({ screen: copperScreen, frames: [i + 1] });
				else
					copperScreens[dupe].frames.push(i + 1);
			}
		}

		for(const cs of copperScreens) {
			const copperResource: GfxResource = {
				address: cs.screen.planes[0],
				size: 0,
				name: `*Copper (fr. ${cs.frames.join(', ')})*`,
				type: GfxResourceType.bitmap,
				flags: cs.screen.ham ? GfxResourceFlags.bitmap_ham : 0,
				bitmap: {
					width: cs.screen.width,
					height: cs.screen.height,
					numPlanes: cs.screen.planes.length
				}
			};
			bitmaps.unshift({ resource: copperResource, frame, screen: cs.screen });
		}

		// TEST: sprite 
		if(process.env.NODE_ENV === 'development') {
			const spriteResource: GfxResource = {
				address: 0xb164,
				size: 0,
				name: `*Sprite*`,
				type: GfxResourceType.sprite,
				flags: 0,
				sprite: {
					index: 0
				}
			};
			const spriteScreen: IScreen = {
				type: ScreenType.sprite, 
				width: 384,
				height: 286,
				planes: [spriteResource.address],
				modulos: [],
				hires: false,
				ham: false
			};
			bitmaps.unshift({ resource: spriteResource, frame, screen: spriteScreen });
		}

		return bitmaps;
	}, [frame]);

	const palettes = useMemo(() => {
		const palettes: GfxResourceWithPayload[] = [];

		const copperPalette = GetPaletteFromCopper(copper);
		const copperResource: GfxResource = {
			address: 0, // TODO
			size: 32 * 2,
			name: '*Copper*',
			type: GfxResourceType.palette,
			flags: 0,
			palette: {
				numEntries: copperPalette.length >>> 1
			}
		};
		palettes.push({ resource: copperResource, frame, palette: copperPalette });

		const customRegs = GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmaRecords, CpuCyclesToDmaCycles(time));
		const customRegsPalette = GetPaletteFromCustomRegs(new Uint16Array(customRegs));
		const customRegsResource: GfxResource = {
			address: Custom.ByName("COLOR00").adr,
			size: 32 * 2,
			name: '*Custom Registers*',
			type: GfxResourceType.palette,
			flags: 0,
			palette: {
				numEntries: 32
			}
		};
		palettes.push({ resource: customRegsResource, frame, palette: customRegsPalette });

		MODELS[frame].amiga.gfxResources.filter((r) => r.type === GfxResourceType.palette).sort((a, b) => a.name.localeCompare(b.name)).forEach((resource) => {
			const palette = GetPaletteFromMemory(MODELS[frame].memory, resource.address, resource.palette.numEntries);
			palettes.push({ resource, frame, palette });
		});

		return palettes;
	}, [frame, time]);

	const [state, setState] = [useStore(), useStore.setState];
	if (state.bitmap === undefined)
		state.bitmap = bitmaps[0];
	if (state.palette === undefined)
		state.palette = palettes[0];
	if (state.overlay === undefined)
		state.overlay = "";

	// update custom registers palette on time change
	if(state.palette.resource.address === Custom.ByName("COLOR00").adr)
		state.palette.palette = palettes.find((p) => p.resource.address === Custom.ByName("COLOR00").adr).palette;
	const onChangeBitmap = (selected: GfxResourceWithPayload) => { setState({ bitmap: selected }); };
	const onChangePalette = (selected: GfxResourceWithPayload) => { setState({ palette: selected }); };

	const onChangeOverlay = ({currentTarget}: JSX.TargetedEvent<HTMLSelectElement, Event>) => { setState({ overlay: currentTarget.value }); };

	return <>
		<div style={{ fontSize: 'var(--vscode-editor-font-size)', marginBottom: '5px' }}>
			Bitmap:&nbsp;
			<GfxResourceDropdown options={bitmaps} value={state.bitmap} onChange={onChangeBitmap} />
			&nbsp;
			Palette:&nbsp;
			<GfxResourceDropdown options={palettes} value={state.palette} onChange={onChangePalette} />
			&nbsp;
			Overlay:&nbsp;
			<select className="select" alt="Overlay" aria-label="Overlay" value={state.overlay} onInput={onChangeOverlay}>
				<option value="">None</option>
				<option value="blitrects">Blit Rects</option>
				<option value="overdraw">Overdraw</option>
			</select>
		</div>
		<div style={{ overflow: 'auto' }}>
			<Screen frame={frame} time={time} screen={state.bitmap.screen} mask={state.bitmap.mask} palette={state.palette.palette} flags={state.bitmap.resource.flags} overlay={state.overlay} />
		</div>
	</>;
};
