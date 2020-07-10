import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CustomRegisters } from '../customRegisters';
import { GetCopper, GetMemoryAfterDma, GetPaletteFromCustomRegs, IScreen, GetScreenFromCopper, GetPaletteFromMemory as GetPaletteFromMemory, GetPaletteFromCopper, BlitterChannel, NR_DMA_REC_VPOS, NR_DMA_REC_HPOS, GetCustomRegsAfterDma } from '../dma';
import { GfxResourceType, GfxResource, GfxResourceFlags } from '../../backend/profile_types';
import { createPortal } from 'preact/compat';

import { DropdownComponent, DropdownOptionProps } from '../dropdown';
import '../dropdown.css';

// https://stackoverflow.com/a/54014428
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsl2rgb(h: number, s: number, l: number) {
	const a = s * Math.min(l, 1 - l);
	const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [f(0), f(8), f(4)];
}

export const Screen: FunctionComponent<{
	screen: IScreen;
	mask?: IScreen;
	palette: number[];
	scale?: number;
	useZoom?: boolean;
	time: number;
	overlay?: string;
	frame: number;
}> = ({ screen, mask, palette, scale = 2, useZoom = true, time, overlay = '', frame }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasScale = scale;
	const canvasWidth = screen.width * canvasScale;
	const canvasHeight = screen.height * canvasScale;

	const zoomDiv = useRef<HTMLDivElement>();
	const zoomCanvas = useRef<HTMLCanvasElement>();
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

	interface ZoomInfo {
		x?: number;
		y?: number;
		color?: number;
		mask?: number;
	}
	const [zoomInfo, setZoomInfo] = useState<ZoomInfo>({});

	const memory = useMemo(() => GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, time >> 1), [time, frame]);

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

	useEffect(() => {
		const context = canvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		const putPixel = (x: number, y: number, color: number) => {
			for (let yy = 0; yy < canvasScale; yy++) {
				for (let xx = 0; xx < canvasScale; xx++) {
					const offset = (((y * canvasScale + yy) * canvasWidth) + x * canvasScale + xx);
					data[offset] = color;
				}
			}
		};
		const planes = [...screen.planes];
		const maskPlanes = [...mask?.planes ?? []];
		for (let y = 0; y < screen.height; y++) {
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
						putPixel(x * 16 + i, y, pixel ? palette[pixel] : 0); // color 0 is transparent
					} else {
						putPixel(x * 16 + i, y, palette[pixel]);
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
	}, [canvas.current, scale, screen, mask, time]);

	useEffect(() => {
		if (overlay !== 'overdraw')
			return;

		const context = overdrawCanvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);

		const overdrawWidth = screen.width / 8;
		const overdrawHeight = screen.height;
		const overdraw = new Uint16Array(overdrawWidth * overdrawHeight);
		let i = 0;
		for (let cycleY = 0; cycleY < NR_DMA_REC_VPOS && i < time >> 1; cycleY++) {
			for (let cycleX = 0; cycleX < NR_DMA_REC_HPOS && i < time >> 1; cycleX++, i++) {
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
			for (let yy = 0; yy < canvasScale; yy++) {
				for (let xx = 0; xx < canvasScale * 8; xx++) {
					const offset = (((y * canvasScale + yy) * canvasWidth) + x * canvasScale + xx);
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
	}, [overdrawCanvas.current, scale, screen, time, overlay]);

	const blitRects = useMemo(() => {
		const blitRects: BlitRect[] = [];

		if (overlay !== 'blitrects')
			return blitRects;

		for (const blit of MODELS[frame].blits) {
			if (blit.cycleStart > time >> 1)
				break;

			// is this blit affecting our screen?
			const dest = blit.BLTxPT[BlitterChannel.D];
			// get top-left corner of blit
			const [x, y] = (() => {
				for (let p = 0; p < screen.planes.length; p++) {
					const plane = screen.planes[p];
					const screenLineSize = screen.width / 8 + screen.modulos[p & 1];
					if (dest >= plane && dest < plane + screen.height * screenLineSize) {
						const y = Math.floor((dest - plane) / screenLineSize);
						const x = Math.floor((dest - plane) % screenLineSize) * 8;
						return [x, y];
					}
					return [-1, -1];
				}
			})();
			if (x === -1 || y === -1)
				continue;

			blitRects.push({ left: x, top: y, width: blit.BLTSIZH * 16, height: Math.floor(blit.BLTSIZV / screen.planes.length), active: blit.cycleEnd > time >> 1 });
		}
		return blitRects;
	}, [screen, time, frame, overlay]);

	const onMouseMove = useCallback(
		(evt: MouseEvent) => {
			if (!useZoom)
				return;
			const snap = (p: number) => Math.floor(p / canvasScale) * canvasScale;
			const context = zoomCanvas.current?.getContext('2d');
			context.imageSmoothingEnabled = false;
			context.clearRect(0, 0, zoomCanvasWidth, zoomCanvasHeight);
			const srcWidth = zoomCanvasWidth / zoomCanvasScale;
			const srcHeight = zoomCanvasHeight / zoomCanvasScale;
			context.drawImage(canvas.current, snap(evt.offsetX) - srcWidth / 2, snap(evt.offsetY) - srcHeight / 2, srcWidth, srcHeight, 0, 0, zoomCanvasWidth, zoomCanvasHeight);
			context.lineWidth = 2;
			context.strokeStyle = 'rgba(0,0,0,1)';
			context.strokeRect((zoomCanvasWidth - zoomCanvasScale * canvasScale) / 2 + zoomCanvasScale, (zoomCanvasHeight - zoomCanvasScale * canvasScale) / 2 + zoomCanvasScale, zoomCanvasScale * canvasScale, zoomCanvasScale * canvasScale);
			context.strokeStyle = 'rgba(255,255,255,1)';
			context.strokeRect((zoomCanvasWidth - zoomCanvasScale * canvasScale) / 2 + zoomCanvasScale - 2, (zoomCanvasHeight - zoomCanvasScale * canvasScale) / 2 + zoomCanvasScale - 2, zoomCanvasScale * canvasScale + 4, zoomCanvasScale * canvasScale + 4);
			const srcX = Math.floor(evt.offsetX / canvasScale);
			const srcY = Math.floor(evt.offsetY / canvasScale);
			setZoomInfo({ x: srcX, y: srcY, color: getPixel(screen, srcX, srcY), mask: mask ? getPixel(mask, srcX, srcY) : undefined });

			// position zoomCanvas
			zoomDiv.current.style.top = snap(evt.offsetY) + 10 + "px";
			zoomDiv.current.style.left = snap(evt.offsetX) + 10 + "px";
			zoomDiv.current.style.display = 'block';
		}, [canvas.current, zoomCanvas.current, scale, screen, mask, useZoom, time]);

	const onMouseLeave = useCallback((evt: MouseEvent) => {
		if (!useZoom)
			return;
		zoomDiv.current.style.display = 'none';
	}, [useZoom, zoomDiv.current]);

	return (
		<div class={styles.screen}>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} class={styles.screen_canvas} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
			{overlay === 'overdraw' && <canvas class={styles.overdraw_canvas} ref={overdrawCanvas} width={canvasWidth} height={canvasHeight} />}
			{blitRects.map((blitRect) =>
				<div class={blitRect.active ? styles.blitrect_active : styles.blitrect}
					style={{ left: blitRect.left * scale, top: blitRect.top * scale, width: blitRect.width * scale, height: blitRect.height * scale }} />
			)}
			{useZoom && <div ref={zoomDiv} class={styles.zoom} style={{ display: 'none' }}>
				<canvas ref={zoomCanvas} width={zoomCanvasWidth} height={zoomCanvasHeight} />
				{zoomInfo.color !== undefined && (<div>
					<dl>
						<dt>Pos</dt>
						<dd>X:{zoomInfo.x} Y:{zoomInfo.y}</dd>
						<dt>Color</dt>
						<dd>{zoomInfo.color} ${zoomInfo.color.toString(16).padStart(2, '0')} %{zoomInfo.color.toString(2).padStart(screen.planes.length, '0')}</dd>
						{mask !== undefined && zoomInfo.mask !== undefined && (<Fragment>
							<dt>Mask</dt>
							<dd>{zoomInfo.mask} ${zoomInfo.mask.toString(16).padStart(2, '0')} %{zoomInfo.mask.toString(2).padStart(mask.planes.length, '0')}</dd>
						</Fragment>)}
					</dl>
				</div>)}
			</div>}
		</div>
	);
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

	const [hover, setHover] = useState<{ x: number, y: number }>({ x: -1, y: -1 });

	const onMouseEnter = (evt: JSX.TargetedMouseEvent<HTMLDivElement>) => {
		const rect = evt.currentTarget.getBoundingClientRect();
		setHover({ x: rect.right + 10, y: rect.top });
	};
	const onMouseLeave = () => {
		setHover({ x: -1, y: -1 });
	};

	return (<Fragment>
		<div class={placeholder ? styles.gfxresource_brief : styles.gfxresource} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<dt>{resource.name}</dt>
			<dd>
				{resource.type === GfxResourceType.bitmap && (<Fragment>
					{resource.bitmap.width}x{resource.bitmap.height}x{resource.bitmap.numPlanes}
					&nbsp;
					{resource.flags & GfxResourceFlags.bitmap_interleaved ? 'I' : ''}
					{resource.flags & GfxResourceFlags.bitmap_masked ? 'M' : ''}
				</Fragment>)}
				{resource.type === GfxResourceType.palette && (<Fragment>
					<div class={styles.palette}>
						{option.palette.map((p) => <div style={{ backgroundColor: `#${(p & 0xffffff).toString(16).padStart(6, '0')}` }} />)}
					</div>
				</Fragment>)}
			</dd>
			<dd class={styles.right}>{resource.size ? (resource.size.toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'b') : ''}</dd>
			<dd class={styles.fixed}>{resource.address ? ('$' + resource.address.toString(16).padStart(8, '0')) : ''}</dd>
		</div>
		{(!placeholder && hover.x >= 0 && resource.type === GfxResourceType.bitmap) && createPortal(<div class={styles.tooltip} style={{ lineHeight: 0, left: hover.x, top: hover.y, bottom: 'initial' }}>
			<Screen screen={option.screen} palette={GetPaletteFromCustomRegs(new Uint16Array(MODELS[option.frame].amiga.customRegs))} scale={1} useZoom={false} time={0} frame={option.frame} />
		</div>, document.body)}
	</Fragment>);
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
const Context = createContext<IState>({});

export const GfxResourcesView: FunctionComponent<{
	frame: number,
	time: number
}> = ({ frame, time }) => {
	const copper = useMemo(() => GetCopper(MODELS[frame].memory.chipMem, MODELS[frame].amiga.dmaRecords), [frame]);
	const bitmaps = useMemo(() => {
		const bitmaps: GfxResourceWithPayload[] = [];
		MODELS[frame].amiga.gfxResources.filter((r) => r.type === GfxResourceType.bitmap).sort((a, b) => a.name.localeCompare(b.name)).forEach((resource) => {
			const width = resource.bitmap.width;
			const height = resource.bitmap.height;
			const modulos = [];
			const planes = [];
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
			const screen: IScreen = { width, height, planes, modulos };
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
				mask = { width, height, planes: maskPlanes, modulos };
			}
			bitmaps.push({ resource, frame, screen, mask });
		});
		const copperScreen = GetScreenFromCopper(copper);
		const copperResource: GfxResource = {
			address: copperScreen.planes[0],
			size: 0,
			name: '*Copper*',
			type: GfxResourceType.bitmap,
			flags: 0,
			bitmap: {
				width: copperScreen.width,
				height: copperScreen.height,
				numPlanes: copperScreen.planes.length
			}
		};
		bitmaps.unshift({ resource: copperResource, frame, screen: copperScreen });
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
				numEntries: copperPalette.length
			}
		};
		palettes.push({ resource: copperResource, frame, palette: copperPalette });

		const customRegs = GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmaRecords, time >> 1);
		const customRegsPalette = GetPaletteFromCustomRegs(new Uint16Array(customRegs));
		const customRegsResource: GfxResource = {
			address: CustomRegisters.getCustomAddress("COLOR00"),
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

	const state = useContext<IState>(Context);
	if (state.bitmap === undefined)
		state.bitmap = bitmaps[0];
	if (state.palette === undefined)
		state.palette = palettes[0];
	if (state.overlay === undefined)
		state.overlay = "";

	const [bitmap, setBitmap] = useState<GfxResourceWithPayload>(state.bitmap);
	const [palette, setPalette] = useState<GfxResourceWithPayload>(state.palette);
	// update custom registers palette on time change
	if(palette.resource.address === CustomRegisters.getCustomAddress("COLOR00"))
		palette.palette = palettes.find((p) => p.resource.address === CustomRegisters.getCustomAddress("COLOR00")).palette;
	const onChangeBitmap = (selected: GfxResourceWithPayload) => { state.bitmap = selected; setBitmap(selected); };
	const onChangePalette = (selected: GfxResourceWithPayload) => { state.palette = selected; setPalette(selected); };

	const [overlay, setOverlay] = useState(state.overlay);
	const onChangeOverlay = (event) => { const overlay = event.target.value as string; state.overlay = overlay; setOverlay(overlay); };

	return (<Fragment>
		<div style={{ fontSize: 'var(--vscode-editor-font-size)', marginBottom: '5px' }}>
			Bitmap:&nbsp;
			<GfxResourceDropdown options={bitmaps} value={bitmap} onChange={onChangeBitmap} />
			&nbsp;
			Palette:&nbsp;
			<GfxResourceDropdown options={palettes} value={palette} onChange={onChangePalette} />
			&nbsp;
			Overlay:&nbsp;
			<select className="select" alt="Overlay" aria-label="Overlay" value={overlay} onChange={onChangeOverlay}>
				<option value="">None</option>
				<option value="blitrects">Blit Rects</option>
				<option value="overdraw">Overdraw</option>
			</select>
		</div>
		<div style={{overflow: 'auto'}}>
			<Screen frame={frame} screen={bitmap.screen} mask={bitmap.mask} palette={palette.palette} time={time} overlay={overlay} />
		</div>
	</Fragment>);
};
