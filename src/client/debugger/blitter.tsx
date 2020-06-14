import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { Blit, GetBlits, GetMemoryAfterDma, GetPaletteFromCustomRegs } from '../dma';
import ReactJson from 'react-json-view'; // DEBUG only
import { CustomRegisters } from '../customRegisters';

export const BlitterVis: FunctionComponent<{
	model: IProfileModel;
	blit: Blit;
}> = ({ model, blit }) => {
	const memoryBefore = GetMemoryAfterDma(model.memory, model.amiga.dmaRecords, blit.cycleStart);
	const memoryAfter = GetMemoryAfterDma(model.memory, model.amiga.dmaRecords, blit.cycleEnd || 0xffffffff);
	const customRegs = new Uint16Array(model.amiga.customRegs);
	const palette = GetPaletteFromCustomRegs(customRegs);

	const numPlanes = 5;
	const canvasScale = 2;
	const canvasWidth = blit.BLTSIZH * 16 * canvasScale;
	const canvasHeight = blit.BLTSIZV / numPlanes * canvasScale;
	const canvas = [
		useRef<HTMLCanvasElement>(),
		useRef<HTMLCanvasElement>(),
		useRef<HTMLCanvasElement>(),
		useRef<HTMLCanvasElement>()
	];
	useEffect(() => {
		for(let channel = 0; channel < 4; channel++) {
			if(!(blit.BLTCON0 & (1 << (11 - channel))))
				continue;
			const context = canvas[channel].current?.getContext('2d');
			const imgData = context.createImageData(canvasWidth, canvasHeight);
			const data = new Uint32Array(imgData.data.buffer);
			let BLTxPT = blit.BLTxPT[channel];
			let shift = 0;
			if(channel === 0)
				shift = (blit.BLTCON0 >>> 12) & 0xf;
			else if(channel === 1)
				shift = (blit.BLTCON1 >>> 12) & 0xf;
			const putPixel = (x: number, y: number, color: number) => {
				x += shift;
				for(let yy = 0; yy < canvasScale; yy++) {
					for(let xx = 0; xx < canvasScale; xx++) {
						if(x >= canvasWidth)
							continue;
						const offset = (((y * canvasScale + yy) * canvasWidth) + x * canvasScale + xx);
						data[offset] = color;
					}
				}
			};
			for(let y = 0; y < blit.BLTSIZV / numPlanes; y++) {
				for(let x = 0; x < blit.BLTSIZH; x++) {
					const BLTxDAT = [];
					for(let p = 0; p < numPlanes; p++) {
						const addr = BLTxPT + x * 2 + p * (blit.BLTSIZH * 2 + blit.BLTxMOD[channel]);
						let raw = (channel < 3) ? memoryBefore.readWord(addr) : memoryAfter.readWord(addr);
						if(channel === 0) {
							if(x === 0)
								raw &= blit.BLTAFWM;
							else if(x === blit.BLTSIZH - 1)
								raw &= blit.BLTALWM;
						}
						BLTxDAT.push(raw);
					}
					for(let i = 0; i < 16; i++) {
						let pixel = 0;
						for(let p = 0; p < numPlanes; p++) {
							if((BLTxDAT[p] & (1 << (15 - i))))
								pixel |= 1 << p;
						}
						putPixel(x * 16 + i, y, palette[pixel]);
					}
				}
				BLTxPT += numPlanes * (blit.BLTSIZH * 2 + blit.BLTxMOD[channel]);
			}
			context.putImageData(imgData, 0, 0);
		}
	}, [canvas[0].current, canvas[1].current, canvas[2].current, canvas[3].current]);

	return (
		<Fragment>
			L{blit.vposStart.toString().padStart(3, '0')}C{blit.hposStart.toString().padStart(3, '0')}:
			<span style={{ opacity: (blit.BLTCON0 & (1 << 11)) ? 1.0 : 0.2, paddingLeft: '20px' }}>A</span> <canvas ref={canvas[0]} width={canvasWidth} height={canvasHeight} />
			<span style={{ opacity: (blit.BLTCON0 & (1 << 10)) ? 1.0 : 0.2, paddingLeft: '20px' }}>B</span> <canvas ref={canvas[1]} width={canvasWidth} height={canvasHeight} />
			<span style={{ opacity: (blit.BLTCON0 & (1 <<  9)) ? 1.0 : 0.2, paddingLeft: '20px' }}>C</span> <canvas ref={canvas[2]} width={canvasWidth} height={canvasHeight} />
			<span style={{ opacity: (blit.BLTCON0 & (1 <<  8)) ? 1.0 : 0.2, paddingLeft: '20px' }}>D</span> <canvas ref={canvas[3]} width={canvasWidth} height={canvasHeight} />
		</Fragment>
	);
};

export const BlitterList: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	const blits = useMemo(() => {
		const customRegs = new Uint16Array(model.amiga.customRegs);
		return GetBlits(customRegs, model.amiga.dmaRecords);
	}, [model]);

	// <ReactJson src={blits} name="blits" theme="monokai" enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />

	return (
		<Fragment>
			<div class={styles.container}>
				{blits.map((b) => <div><BlitterVis model={model} blit={b} /></div>)}
			</div>
		</Fragment>
	);
};
