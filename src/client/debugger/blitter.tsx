import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { Blit, GetBlits, GetChipMemAfterDma } from '../dma';
import ReactJson from 'react-json-view'; // DEBUG only

export const BlitterVis: FunctionComponent<{
	model: IProfileModel;
	blit: Blit;
}> = ({ model, blit }) => {
	const chipMem = Uint8Array.from(atob(model.chipMem), (c) => c.charCodeAt(0));
	const chipMemAfter = GetChipMemAfterDma(chipMem, model.dmaRecords, blit.cycleEnd || 0xffffffff);

	const canvasScale = 2;
	const canvasWidth = blit.BLTSIZH * 16 * canvasScale;
	const canvasHeight = blit.BLTSIZV * canvasScale;
	const canvasRef = useRef<HTMLCanvasElement>();
	useEffect(() => {
		const context = canvasRef.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		let BLTDPT = blit.BLTxPT[3];
		const putPixel = (x: number, y: number, color: number) => {
			for(let yy = 0; yy < canvasScale; yy++) {
				for(let xx = 0; xx < canvasScale; xx++) {
					const offset = (((y * canvasScale + yy) * canvasWidth) + x * canvasScale + xx) * 4;
					imgData.data[offset] = imgData.data[offset + 1] = imgData.data[offset + 2] = color;
					imgData.data[offset + 3] = 0xff; // alpha
				}
			}
		};
		for(let y = 0; y < blit.BLTSIZV; y++) {
			for(let x = 0; x < blit.BLTSIZH; x++) {
				let BLTDDAT = (chipMem[BLTDPT] << 8) | chipMem[BLTDPT + 1];
				if(x === 0)
					BLTDDAT &= blit.BLTAFWM;
				else if(x === blit.BLTSIZH - 1)
					BLTDDAT &= blit.BLTALWM;
				for(let i = 0; i < 16; i++) {
					const pixel = (BLTDDAT & (1 << (15 - i))) ? 0xff : 0x00;
					putPixel(x * 16 + i, y, pixel);
				}
				BLTDPT += 2;
			}
			BLTDPT += blit.BLTxMOD[3];
		}
		context.putImageData(imgData, 0, 0);
	}, [canvasRef.current]);

	return (
		<canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
	);
};

export const BlitterList: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	const blits = useMemo(() => {
		const customRegs = new Uint16Array(model.customRegs);
		return GetBlits(customRegs, model.dmaRecords);
	}, [model]);

	return (
		<Fragment>
			<div class={styles.container}>
				<BlitterVis model={model} blit={blits[0]} />
				<ReactJson src={blits} name="blits" theme="monokai" enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
			</div>
		</Fragment>
	);
};
