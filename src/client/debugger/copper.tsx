import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { CopperDisassembler } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper, GetChipMemAfterDma, GetPaletteFromCustomRegs, IScreen, GetScreenFromCopper, GetPaletteFromChipMem, GetPaletteFromCopper } from '../dma';
import { GfxResourceType, GfxResource, GfxResourceFlags } from '../../backend/profile_types';

export const Screen: FunctionComponent<{
	model: IProfileModel;
	screen: IScreen;
	palette: number[];
	scale: number;
}> = ({ model, screen, palette, scale }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasScale = scale;
	const canvasWidth = screen.width * canvasScale;
	const canvasHeight = screen.height * canvasScale;

	const chipMem = model.chipMemCache;//GetChipMemAfterDma(model.chipMemCache, model.dmaRecords, 0xffffffff); // end-of-frame for now

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
		for(let y = 0; y < screen.height; y++) {
			for(let x = 0; x < screen.width / 16; x++) {
				for(let i = 0; i < 16; i++) {
					let pixel = 0;
					for(let p = 0; p < planes.length; p++) {
						const addr = planes[p] + x * 2;
						const raw = (chipMem[addr] << 8) | chipMem[addr + 1];
						if((raw & (1 << (15 - i))))
							pixel |= 1 << p;
					}
					putPixel(x * 16 + i, y, palette[pixel]);
				}
			}
			for(let p = 0; p < planes.length; p++) {
				planes[p] += screen.width / 8 + screen.modulos[p & 1];
			}
		}
		context.putImageData(imgData, 0, 0);
	}, [canvas.current, scale, screen]);

	return (
		<canvas ref={canvas} width={canvasWidth} height={canvasHeight} />
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
	if(typeof bitmap === 'string' && bitmap === "copper") {
		screen = GetScreenFromCopper(copper);
	} else {
		const resource = JSON.parse(bitmap) as GfxResource;
		const width = resource.bitmap.width;
		const height = resource.bitmap.height;
		const modulos = [];
		const planes = [];
		if(resource.flags & GfxResourceFlags.bitmap_interleaved) {
			for(let p = 0; p < resource.bitmap.numPlanes; p++)
				planes.push(resource.address + p * width / 8);
			const modulo = (width / 8) * (resource.bitmap.numPlanes - 1);
			modulos.push(modulo, modulo);
		} else {
			for(let p = 0; p < resource.bitmap.numPlanes; p++)
				planes.push(resource.address + p * width / 8 * height);
			modulos.push(0, 0);
		}
		screen = { width, height, planes, modulos };
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

	return (
		<Fragment>
			<div class={styles.container}>
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
				<Screen model={model} screen={screen} palette={screenPalette} scale={2} /><br/>
				{copper.map((c) => 'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ' $' + c.address.toString(16).padStart(8, '0') + ': ' + c.insn.toString()).join('\n')}
			</div>
		</Fragment>
	);
};
