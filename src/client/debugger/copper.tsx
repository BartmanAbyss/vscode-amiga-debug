import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { CopperDisassembler } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper, GetChipMemAfterDma, GetPaletteFromCustomRegs, IScreen, GetScreenFromCopper, GetPaletteFromChipMem, GetPaletteFromCopper } from '../dma';
import { GfxResourceType, GfxResource, GfxResourceFlags } from '../../backend/profile_types';
import { createPortal } from 'preact/compat';

import { ReactDropdown } from '../dropdown';
import '../dropdown.css';

export const Screen: FunctionComponent<{
	model: IProfileModel;
	screen: IScreen;
	mask?: IScreen;
	palette: number[];
	scale: number;
}> = ({ model, screen, mask, palette, scale }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasScale = scale;
	const canvasWidth = screen.width * canvasScale;
	const canvasHeight = screen.height * canvasScale;

	const zoomDiv = useRef<HTMLDivElement>();
	const zoomCanvas = useRef<HTMLCanvasElement>();
	const zoomCanvasScale = 8;
	const zoomCanvasWidth = 144;
	const zoomCanvasHeight = 144;

	interface ZoomInfo {
		x?: number;
		y?: number;
		color?: number;
		mask?: number;
	}
	const [zoomInfo, setZoomInfo] = useState<ZoomInfo>({});

	const chipMem = model.chipMemCache;//GetChipMemAfterDma(model.chipMemCache, model.dmaRecords, 0xffffffff); // end-of-frame for now

	const getPixel = (scr: IScreen, x: number, y: number): number => {
		let pixel = 0;
		for(let p = 0; p < scr.planes.length; p++) {
			const addr = scr.planes[p] + y * (scr.width / 8 + scr.modulos[p & 1]) + Math.floor(x / 8);
			const raw = chipMem[addr];
			if(raw & (1 << (7 - (x & 7))))
				pixel |= 1 << p;
		}
		return pixel;
	};

	useEffect(() => {
		const context = canvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		const putPixel = (x: number, y: number, color: number) => {
			for(let yy = 0; yy < canvasScale; yy++) {
				for(let xx = 0; xx < canvasScale; xx++) {
					const offset = (((y * canvasScale + yy) * canvasWidth) + x * canvasScale + xx);
					data[offset] = color;
				}
			}
		};
		const planes = [...screen.planes];
		const maskPlanes = [...mask?.planes ?? []];
		for(let y = 0; y < screen.height; y++) {
			for(let x = 0; x < screen.width / 16; x++) {
				for(let i = 0; i < 16; i++) {
					let pixel = 0;
					let pixelMask = 0xffff;
					for(let p = 0; p < planes.length; p++) {
						const addr = planes[p] + x * 2;
						const raw = (chipMem[addr] << 8) | chipMem[addr + 1];
						if((raw & (1 << (15 - i))))
							pixel |= 1 << p;
					}
					if(mask) {
						for(let p = 0; p < maskPlanes.length; p++) {
							const addr = maskPlanes[p] + x * 2;
							const raw = (chipMem[addr] << 8) | chipMem[addr + 1];
							if((raw & (1 << (15 - i))))
								pixelMask |= 1 << p;
						}
						pixel &= pixelMask;
						putPixel(x * 16 + i, y, pixel ? palette[pixel] : 0); // color 0 is transparent
					} else {
						putPixel(x * 16 + i, y, palette[pixel]);
					}
				}
			}
			for(let p = 0; p < planes.length; p++) {
				planes[p] += screen.width / 8 + screen.modulos[p & 1];
			}
			if(mask) {
				for(let p = 0; p < maskPlanes.length; p++) {
					maskPlanes[p] += mask.width / 8 + mask.modulos[p & 1];
				}
			}
		}
		context.putImageData(imgData, 0, 0);
	}, [canvas.current, scale, screen, mask]);

	const onMouseMove = useCallback(
		(evt: MouseEvent) => {
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
			zoomDiv.current.style.top = snap(evt.pageY) + 10 + "px";
			zoomDiv.current.style.left = snap(evt.pageX) + 10 + "px";
			zoomDiv.current.style.display = 'block';
		}, [canvas.current, zoomCanvas.current, scale, screen, mask]);

	const onMouseLeave = (evt: MouseEvent) => {
		zoomDiv.current.style.display = 'none';
	};

	return (
		<Fragment>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} class={styles.screen} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
			{createPortal(<div ref={zoomDiv} class={styles.zoom} style={{ display: 'none' }}>
				<canvas ref={zoomCanvas} width={zoomCanvasWidth} height={zoomCanvasHeight} />
				{zoomInfo.color !== undefined && (<div>
					<dl>
						<dt>Pos</dt>
						<dd>X:{zoomInfo.x} Y:{zoomInfo.y}</dd>
						<dt>Color</dt>
						<dd>{zoomInfo.color} ${zoomInfo.color.toString(16).padStart(2, '0')} %{zoomInfo.color.toString(2).padStart(screen.planes.length, '0')}</dd>
						{zoomInfo.mask !== undefined && (<Fragment>
							<dt>Mask</dt>
							<dd>{zoomInfo.mask} ${zoomInfo.mask.toString(16).padStart(2, '0')} %{zoomInfo.mask.toString(2).padStart(mask.planes.length, '0')}</dd>
						</Fragment>)}
					</dl>
				</div>
				)}
			</div>, document.body)}
		</Fragment>
	);
};

const Blabla: FunctionComponent<{}> = () => {
	return (
		<span class="Dropdown-arrow">Hallo!</span>
	);
};

export const CopperList: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	//const customRegs = new Uint16Array(model.customRegs);
	//const customRegL = (reg: number) => (customRegs[(reg - 0xdff000) >>> 1] << 16) | customRegs[(reg + 2 - 0xdff000) >>> 1];
	//const regCOP1LC = CustomRegisters.getCustomAddress("COP1LC");
	//const COP1LC = customRegL(regCOP1LC);
	//const copper1 = new CopperDisassembler(chipMem, COP1LC);

	const copper = GetCopper(model.chipMemCache, model.amiga.dmaRecords);
	const [bitmap, setBitmap] = useState<string>("copper");
	const [palette, setPalette] = useState<string>("copper");

	let screen: IScreen;
	let mask: IScreen;
	if(typeof bitmap === 'string' && bitmap === "copper") {
		screen = GetScreenFromCopper(copper);
	} else {
		const resource = JSON.parse(bitmap) as GfxResource;
		const width = resource.bitmap.width;
		const height = resource.bitmap.height;
		const modulos = [];
		const planes = [];
		if(resource.flags & GfxResourceFlags.bitmap_interleaved) {
			const moduloScale = (resource.flags & GfxResourceFlags.bitmap_masked) ? 2 : 1;
			for(let p = 0; p < resource.bitmap.numPlanes; p++)
				planes.push(resource.address + p * width / 8 * moduloScale);
			const modulo = (width / 8) * (resource.bitmap.numPlanes * moduloScale - 1);
			modulos.push(modulo, modulo);
		} else {
			for(let p = 0; p < resource.bitmap.numPlanes; p++)
				planes.push(resource.address + p * width / 8 * height);
			modulos.push(0, 0);
		}
		screen = { width, height, planes, modulos };
		if(resource.flags & GfxResourceFlags.bitmap_masked) {
			const maskPlanes = [...planes];
			if(resource.flags & GfxResourceFlags.bitmap_interleaved) {
				for(let p = 0; p < resource.bitmap.numPlanes; p++)
					maskPlanes[p] += width / 8;
			} else {
				// ??? does this make sense ?? not tested
				for(let p = 0; p < resource.bitmap.numPlanes; p++)
					maskPlanes[p] += width / 8 * height;
			}
			mask = { width, height, planes: maskPlanes, modulos };
		}
	}

	let screenPalette: number[];
	if(typeof palette === 'string' && palette === "copper") {
		screenPalette = GetPaletteFromCopper(copper);
	} else if(typeof palette === 'string' && palette === "customRegs") {
		const customRegs = new Uint16Array(model.amiga.customRegs);
		screenPalette = GetPaletteFromCustomRegs(customRegs);
	} else {
		const resource = JSON.parse(palette) as GfxResource;
		screenPalette = GetPaletteFromChipMem(model.chipMemCache, resource.address, resource.palette.numEntries);
	}

	const onChangeBitmap = (event: any) => {
		setBitmap(event.target.value as string);
	};

	const onChangePalette = (event: any) => {
		setPalette(event.target.value as string);
	};

	const options = [
		'one', 'two', 'three'
	  ];
	const defaultOption = options[0];

	return (
		<Fragment>
			<div class={styles.container}>
				<ReactDropdown options={options} value={defaultOption} arrowOpen={Blabla} arrowClosed={Blabla} placeholder="Select an option" />
				Bitmap:
				<select class="select" alt="Bitmap" aria-label="Bitmap" value={bitmap} onChange={onChangeBitmap}>
					<option value="copper">*Copper*</option>
					{model.amiga.gfxResources.filter((r) => r.type === GfxResourceType.bitmap).sort((a, b) => a.name.localeCompare(b.name)).map((r) => (
						<option value={JSON.stringify(r)}>{r.name}</option>
					))}
				</select>&nbsp;
				Palette:
				<select class="select" alt="Palette" aria-label="Palette" value={palette} onChange={onChangePalette}>
					<option value="customRegs">*Custom Registers*</option>
					<option value="copper">*Copper*</option>
					{model.amiga.gfxResources.filter((r) => r.type === GfxResourceType.palette).sort((a, b) => a.name.localeCompare(b.name)).map((r) => (
						<option value={JSON.stringify(r)}>{r.name}</option>
					))}
				</select><br/>
				<Screen model={model} screen={screen} mask={mask} palette={screenPalette} scale={2} /><br/>
				{copper.map((c) => 'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ' $' + c.address.toString(16).padStart(8, '0') + ': ' + c.insn.toString()).join('\n')}
			</div>
		</Fragment>
	);
};
