import { Fragment, FunctionComponent, JSX, h } from 'preact';
import { StateUpdater, useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
import { ICpuProfileRaw } from '../types';
import { CustomReadWrite, CustomRegisters } from '../customRegisters';
import { DmaCyclesToCpuCycles, GetAmigaColor, GetAmigaColorEhb, NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, displayHeight, displayLeft, displayTop, displayWidth, dmaTypes, CpuCyclesToDmaCycles } from '../dma';
declare let PROFILES: ICpuProfileRaw[];
declare const MODELS: IProfileModel[];

export const MemoryView: FunctionComponent<{
	frame: number;
	time: number;
}> = ({ frame, time }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasWidth = 256;
	const canvasHeight = 256;

	const [persistence, setPersistence] = useState(10000); // in DMA cycles

	const [pixels] = useMemo((): [Uint32Array] => { // screen
		const pixels = new Uint32Array(canvasWidth * canvasHeight);
		pixels.fill(0xff000000); // black

		const maxCycle = CpuCyclesToDmaCycles(time);

		for(let i = 0; i < maxCycle; i++) {
			const dmaRecord = MODELS[frame].amiga.dmaRecords[i];
			if(!(dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)) {
				if(dmaRecord.addr >= 0x00000 && dmaRecord.addr < 0x80000) {
					const dmaType = dmaRecord.type || 0;
					const dmaSubtype = (Object.keys(dmaTypes[dmaType].subtypes).length === 1) ? 0 : (dmaRecord.extra || 0);
					if(dmaType >= dmaTypes.length || !dmaTypes[dmaType].subtypes[dmaSubtype])
						continue;
					const dmaColor = dmaTypes[dmaType].subtypes[dmaSubtype].color;
					const alpha = (1 - Math.min(Math.max((maxCycle - i) / persistence, 0), 1)) * 255;
					pixels[dmaRecord.addr >>> 3] = (dmaColor & 0xffffff) | (alpha << 24);
				}
			}
		}

		return [pixels];
	}, [frame, time, persistence]);

	useEffect(() => {
		const context = canvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		data.set(pixels);
		context.putImageData(imgData, 0, 0);
	}, [canvas.current, pixels]);

	return <>
		<div style={{ flexGrow: 0 }}>
			<div>Persistence</div><div><input style={{verticalAlign: 'bottom'}} type="range" min="1" max={NR_DMA_REC_HPOS * NR_DMA_REC_VPOS} value={persistence} class="slider" onInput={({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => setPersistence(parseInt(currentTarget.value))} />
		</div>
		</div>
		<div style={{ /*overflow: 'auto'*/ }}>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} style={{background: '#000'}} />
		</div>
	</>;
};
