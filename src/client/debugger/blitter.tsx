import { Fragment, FunctionComponent, h, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './blitter.module.css';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { Blit, GetMemoryAfterDma, GetPaletteFromCustomRegs, Memory } from '../dma';

import 'pubsub-js';

// store state because component will get unmounted when tab switches
/*interface IState {
	blit?: Blit;
}
// when BlitterList is not mounted, just update state!
const Context = createContext<IState>({});
//PubSub.subscribe('showBlit', (msg, data: Blit) => (Context as any).__['blit'] = data); // somehow _defaultValue gets converted to __ (webpack?)
*/
export const BlitterVis: FunctionComponent<{
	blit: Blit;
	frame: number;
	time: number;
}> = ({ blit, frame, time }) => {
	const memories = useMemo(() => {
		if(time === -1) {
			return [
				GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, blit.cycleStart),
				GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, blit.cycleEnd || 0xffffffff)
			];
		} else {
			const memory = GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, time >> 1);
			return [memory, memory];
		}
	}, [blit, time, frame]);

	const customRegs = new Uint16Array(MODELS[frame].amiga.customRegs);
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
						let raw = (channel < 3) ? memories[0].readWord(addr) : memories[1].readWord(addr);
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
	}, [blit, time, frame, canvas[0].current, canvas[1].current, canvas[2].current, canvas[3].current]);

	return (
		<Fragment>
			L{blit.vposStart.toString().padStart(3, '0')}C{blit.hposStart.toString().padStart(3, '0')}:
			<span style={{ display: (blit.BLTCON0 & (1 << 11)) ? 'inline' : 'none', paddingLeft: '20px' }}>A <canvas ref={canvas[0]} width={canvasWidth} height={canvasHeight} style={{ paddingTop: '2px' }} /></span>
			<span style={{ display: (blit.BLTCON0 & (1 << 10)) ? 'inline' : 'none', paddingLeft: '20px' }}>B <canvas ref={canvas[1]} width={canvasWidth} height={canvasHeight} style={{ paddingTop: '2px' }} /></span>
			<span style={{ display: (blit.BLTCON0 & (1 <<  9)) ? 'inline' : 'none', paddingLeft: '20px' }}>C <canvas ref={canvas[2]} width={canvasWidth} height={canvasHeight} style={{ paddingTop: '2px' }} /></span>
			<span style={{ display: (blit.BLTCON0 & (1 <<  8)) ? 'inline' : 'none', paddingLeft: '20px' }}>D <canvas ref={canvas[3]} width={canvasWidth} height={canvasHeight} style={{ paddingTop: '2px' }} /></span>
		</Fragment>
	);
};

export const BlitterList: FunctionComponent<{
	frame: number;
	time: number;
}> = ({ frame, time }) => {
	const blits = MODELS[frame].blits;
	const containerRef = useRef<HTMLDivElement>();

	//{MODEL.blits.map((b) => <div><BlitterVis blit={b} /></div>)}
	//const state = useContext<IState>(Context);

	/*const [blit, setBlit] = useState<Blit>(state.blit);
	useEffect(() => {
		const token = PubSub.subscribe('showBlit', (msg, data: Blit) => { state.blit = data; setBlit(data); });
		return () => PubSub.unsubscribe(token);
	}, []);*/

	// get blit that is executing at 'time'
	let curBlit = -1;
	for(let i = 0; i < blits.length; i++) {
		if(blits[i].cycleStart <= (time >> 1) && blits[i].cycleEnd > (time >> 1)) {
			curBlit = i;
			break;
		}
	}

	useEffect(() => {
		if(blits.length === 0 || !containerRef.current || curBlit === -1)
			return;

		// no smooth scrolling here, 2 at the same time don't work (copper is also smooth scrolling)
		containerRef.current.children[Math.max(0, curBlit)].scrollIntoView({ behavior: 'auto', block: 'center' });
	}, [curBlit, containerRef.current]);

	return (<div ref={containerRef} class={styles.container}>
		{blits.map((blit, i) => <div class={i === curBlit ? styles.cur : (blit.cycleEnd < (time >> 1) ? styles.past : styles.future)}>
			<BlitterVis blit={blit} frame={frame} time={/*i === curBlit ? */time/* : -1*/} />
		</div>)}
	</div>);
};
