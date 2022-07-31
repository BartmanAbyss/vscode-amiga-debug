import { FunctionComponent, JSX } from 'preact';
import { useEffect, useMemo, useRef, useState, useCallback, StateUpdater } from 'preact/hooks';
import { ToggleButton } from '../toggle-button';
import { Toolbar } from '../filter';
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
import { NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, dmaTypes, CpuCyclesToDmaCycles, GetMemoryAfterDma, GetRgbaColorCss, DmaTypes, DmaSubTypes } from '../dma';
declare const MODELS: IProfileModel[];

export const MemoryView: FunctionComponent<{
	frame: number;
	time: number;
	memoryAddr: number;
	setMemoryAddr: StateUpdater<number>;
}> = ({ frame, time, memoryAddr, setMemoryAddr }) => {
	const chipCanvas = useRef<HTMLCanvasElement>();
	const bogoCanvas = useRef<HTMLCanvasElement>();

	const memInfo = MODELS[0].memory;
	
	const canvasWidth = 256;
	const chipCanvasHeight = memInfo.chipMem.length / (8 * canvasWidth);
	const bogoCanvasHeight = memInfo.bogoMem.length / (8 * canvasWidth);

	const detailWidth = 16;
	const detailHeight = 32;

	const [persistence, setPersistence] = useState(10000); // in DMA cycles
	const [showReads, setShowReads] = useState(true);
	const [showWrites, setShowWrites] = useState(true);
	const [trackCpuData, setTrackCpuData] = useState(false);
	const memory = useMemo(() => GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, CpuCyclesToDmaCycles(time)), [time, frame]);

	useMemo(() => {
		if(!trackCpuData)
			return;

		const dmaRecord = MODELS[frame].amiga.dmaRecords[CpuCyclesToDmaCycles(time)];
		if(dmaRecord.type === DmaTypes.CPU && dmaRecord.extra === DmaSubTypes.CPU_DATA) { // only CPU data
			const read = ((dmaRecord.reg & 0x1100) === 0x1100) ? false : true;
			if((read && showReads) || (!read && showWrites)) { // Only read/write
				setMemoryAddr(dmaRecord.addr);
			}
		}
	}, [time, trackCpuData, setMemoryAddr]);

	const detailMem = useMemo((): Uint8Array => {
		if(memoryAddr >= memInfo.chipMemAddr && memoryAddr < memInfo.chipMemAddr + memInfo.chipMem.length)
			return memory.chipMem.slice(memoryAddr - memInfo.chipMemAddr, memoryAddr - memInfo.chipMemAddr + detailWidth * detailHeight);
		else if(memoryAddr >= memInfo.bogoMemAddr && memoryAddr < memInfo.bogoMemAddr + memInfo.bogoMem.length)
			return memory.bogoMem.slice(memoryAddr - memInfo.bogoMemAddr, memoryAddr - memInfo.bogoMemAddr + detailWidth * detailHeight);
		else
			return null;
	}, [memory, memoryAddr]);

	const [chipPixels, bogoPixels, detailPixels] = useMemo((): [Uint32Array, Uint32Array, Uint32Array] => { // screen (chip, bogo)
		const chipPixels = new Uint32Array(canvasWidth * chipCanvasHeight);
		const bogoPixels = bogoCanvasHeight ? new Uint32Array(canvasWidth * bogoCanvasHeight) : null;
		const detailPixels = new Uint32Array(detailWidth * detailHeight);
		chipPixels.fill(0xff000000); // black
		bogoPixels?.fill(0xff000000); // black
		detailPixels.fill(0xff000000); // black

		const maxCycle = CpuCyclesToDmaCycles(time);
		
		for(let i = 0; i < maxCycle; i++) {
			const dmaRecord = MODELS[frame].amiga.dmaRecords[i];
			if(dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)
				continue;
			const dmaType = dmaRecord.type || 0;
			const dmaSubtype = (Object.keys(dmaTypes[dmaType].subtypes).length === 1) ? 0 : (dmaRecord.extra || 0);
			if(dmaType >= dmaTypes.length || !dmaTypes[dmaType].subtypes[dmaSubtype])
				continue;
			const dmaColor = dmaTypes[dmaType].subtypes[dmaSubtype].color;
			const alpha = (1 - Math.min(Math.max((maxCycle - i) / persistence, 0), 1)) * 255;

			let read = true;
			let len = 2;
			if((dmaRecord.reg & 0x1100) === 0x1100) // CPU write
				read = false;
			if(dmaRecord.reg === 0) // Blitter write
				read = false;
			if(dmaRecord.reg & 0x1000)
				len = dmaRecord.reg & 0xff;

			if((read && showReads) || (!read && showWrites)) {
				if(dmaRecord.addr >= memInfo.chipMemAddr && dmaRecord.addr < memInfo.chipMemAddr + memInfo.chipMem.length)
					chipPixels[(dmaRecord.addr - memInfo.chipMemAddr) >>> 3] = (dmaColor & 0xffffff) | (alpha << 24);
				else if(dmaRecord.addr >= memInfo.bogoMemAddr && dmaRecord.addr < memInfo.bogoMemAddr + memInfo.bogoMem.length)
					bogoPixels[(dmaRecord.addr - memInfo.bogoMemAddr) >>> 3] = (dmaColor & 0xffffff) | (alpha << 24);
				if(dmaRecord.addr >= memoryAddr && dmaRecord.addr < memoryAddr + detailWidth * detailHeight) {
					for(let i = 0; i < len; i++)
						detailPixels[dmaRecord.addr - memoryAddr + i] = (dmaColor & 0xffffff) | (alpha << 24);
				}
			}
		}
		return [chipPixels, bogoPixels, detailPixels];
	}, [frame, time, persistence, showReads, showWrites, memoryAddr]);

	useEffect(() => { // screen -> canvas (chip)
		const context = chipCanvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, chipCanvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		data.set(chipPixels);
		context.putImageData(imgData, 0, 0);
	}, [chipCanvas.current, chipPixels]);

	useEffect(() => { // screen -> canvas (bogo)
		if(!bogoPixels || !bogoCanvas.current)
			return;
		const context = bogoCanvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, bogoCanvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		data.set(bogoPixels);
		context.putImageData(imgData, 0, 0);
	}, [bogoCanvas.current, bogoPixels]);

	const onClickChip = useCallback((evt: MouseEvent) => {
		const addr = memInfo.chipMemAddr + evt.offsetY * canvasWidth * 8 + evt.offsetX * 8;
		setMemoryAddr(addr);
		const onMove = (evt: MouseEvent) => {
			const rc = chipCanvas.current.getBoundingClientRect();
			const x = Math.max(0, Math.min(rc.width, evt.clientX - rc.left)) | 0;
			const y = Math.max(0, Math.min(rc.height, evt.clientY - rc.top)) | 0;
			const addr = Math.max(memInfo.chipMemAddr, Math.min(memInfo.chipMemAddr + memInfo.chipMem.length - detailHeight * detailWidth, memInfo.chipMemAddr + y * canvasWidth * 8 + x * 8));
			setMemoryAddr(addr);
		};
		const onUp = (evt: MouseEvent) => {
			document.removeEventListener('mousemove', onMove);
		};
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		evt.preventDefault();
		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
		};
	}, [setMemoryAddr, chipCanvas.current, memInfo, canvasWidth]);

	const onClickBogo = useCallback((evt: MouseEvent) => {
		const addr = memInfo.bogoMemAddr + evt.offsetY * canvasWidth * 8 + evt.offsetX * 8;
		setMemoryAddr(addr);
		const onMove = (evt: MouseEvent) => {
			const rc = bogoCanvas.current.getBoundingClientRect();
			const x = Math.max(0, Math.min(rc.width, evt.clientX - rc.left)) | 0;
			const y = Math.max(0, Math.min(rc.height, evt.clientY - rc.top)) | 0;
			const addr = Math.max(memInfo.bogoMemAddr, Math.min(memInfo.bogoMemAddr + memInfo.bogoMem.length - detailHeight * detailWidth, memInfo.bogoMemAddr + y * canvasWidth * 8 + x * 8));
			setMemoryAddr(addr);
		};
		const onUp = (evt: MouseEvent) => {
			document.removeEventListener('mousemove', onMove);
		};
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		evt.preventDefault();
		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
		};
	}, [setMemoryAddr, bogoCanvas.current, memInfo, canvasWidth]);

	return <>
		<div style={{ flexGrow: 0 }}>
			<Toolbar>
				<div>Persistence</div>
				<div><input style={{verticalAlign: 'bottom'}} type="range" min="1" max={NR_DMA_REC_HPOS * NR_DMA_REC_VPOS} value={persistence} class="slider" onInput={({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => setPersistence(parseInt(currentTarget.value))} /></div>
				<ToggleButton icon="Reads" label="Show Memory Reads" checked={showReads} onChange={setShowReads} />
				<ToggleButton icon="Writes" label="Show Memory Writes" checked={showWrites} onChange={setShowWrites} />
				<ToggleButton icon="Track CPU Data" label="Track CPU Data" checked={trackCpuData} onChange={setTrackCpuData} />
			</Toolbar>
		</div>
		<div class={styles.memory_container}>
			{memInfo.chipMem.length && <div class={styles.memory_float}> {/*chipmem*/}
				<div>{memInfo.chipMem.length >>> 10}kb Chip Mem</div>
				<div class={styles.memory}>
					<canvas ref={chipCanvas} class={styles.memory_canvas} width={canvasWidth} height={chipCanvasHeight} onMouseDown={onClickChip} />
					{[...Array(memInfo.chipMem.length / 0x10000 + 1).keys()].map((i) => <div class={styles.memory_legend} style={{ top: i * 32 }}>${(memInfo.chipMemAddr + i * 0x10_000).toString(16).padStart(6, '0')}</div>)}
				</div>
			</div>}
			{memInfo.bogoMem.length && <div class={styles.memory_float}>
				<div>{memInfo.bogoMem.length >>> 10}kb Slow Mem</div>
				<div class={styles.memory}>
					<canvas ref={bogoCanvas} class={styles.memory_canvas} width={canvasWidth} height={bogoCanvasHeight} onMouseDown={onClickBogo} />
					{[...Array(memInfo.bogoMem.length / 0x10000 + 1).keys()].map((i) => <div class={styles.memory_legend} style={{ top: i * 32 }}>${(memInfo.bogoMemAddr + i * 0x10_000).toString(16).padStart(6, '0')}</div>)}
				</div>
			</div>}
		</div>
		<div class={styles.memory_fixed}> {/*memory values*/}
			{[...Array(detailHeight).keys()].map((i) => <div>
				{'$' + (memoryAddr + i * detailWidth).toString(16).padStart(8, '0') + ': '}
				{[...detailMem.slice(i * detailWidth, (i + 1) * detailWidth)].map((v: number, x: number) => 
					<span class={styles.memory_span} style={{backgroundColor: GetRgbaColorCss(detailPixels[i * detailWidth + x]) }}>{v.toString(16).padStart(2, '0')}
					</span>
				)}
			</div>)}
		</div>
	</>;
};
