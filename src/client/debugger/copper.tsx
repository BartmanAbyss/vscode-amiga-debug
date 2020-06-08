import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { CopperDisassembler } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper, GetChipMemAfterDma, GetPalette, IScreen, GetScreen } from '../dma';

export const Screen: FunctionComponent<{
	model: IProfileModel;
	screen: IScreen;
	scale: number;
}> = ({ model, screen, scale }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasScale = scale;
	const canvasWidth = screen.width * canvasScale;
	const canvasHeight = screen.height * canvasScale;

	const chipMem = model.chipMemCache;//GetChipMemAfterDma(model.chipMemCache, model.dmaRecords, 0xffffffff); // end-of-frame for now
	const customRegs = new Uint16Array(model.customRegs);
	const palette = GetPalette(customRegs);

	useEffect(() => {
		const context = canvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const putPixel = (x: number, y: number, color: number[]) => {
			for(let yy = 0; yy < canvasScale; yy++) {
				for(let xx = 0; xx < canvasScale; xx++) {
					const offset = (((y * canvasScale + yy) * canvasWidth) + x * canvasScale + xx) * 4;
					imgData.data[offset] = color[0];
					imgData.data[offset + 1] = color[1];
					imgData.data[offset + 2] = color[2];
					imgData.data[offset + 3] = 0xff; // alpha
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

	const copper = GetCopper(model.chipMemCache, model.dmaRecords);
	const screen = GetScreen(copper);

	return (
		<Fragment>
			<div class={styles.container}>
				<Screen model={model} screen={screen} scale={2} /><br/>
				{copper.map((c) => 'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ' $' + c.address.toString(16).padStart(8, '0') + ': ' + c.insn.toString()).join('\n')}
			</div>
		</Fragment>
	);
};
