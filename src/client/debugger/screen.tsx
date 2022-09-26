import { FunctionComponent, JSX } from 'preact';
import { StateUpdater, useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { ToggleButton } from '../toggle-button';
import { Toolbar } from '../filter';
import { IZoomProps, ZoomCanvas } from "./zoomcanvas";
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
import { ICpuProfileRaw } from '../types';
import { getScreen, PixelSource, DeniseState, DefaultDeniseState } from '../screen';
import { BPLCON0Flags, BPLCON2Flags, Custom, DMACONFlags, FMODEFlags } from '../custom';
import { DmaCyclesToCpuCycles, NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, CpuCyclesToDmaCycles, GetCustomRegsAfterDma, ChipsetFlags, GetAmigaColorCss } from '../dma';
import { swizzle } from '../../utils';
declare let PROFILES: ICpuProfileRaw[];
declare const MODELS: IProfileModel[];

interface DeniseZoomProps extends IZoomProps {
	pixelSources: Uint8Array;
	pixelPtrs: Uint32Array;
	pixels: Uint8Array;
	frame: number;
}

const DeniseZoomInfo: FunctionComponent<IZoomProps> = (props: DeniseZoomProps) => {
	if(props.x !== undefined && props.y !== undefined) {
		const hpos = (props.x >> 1) + 2;
		const vpos = props.y;
		const line = props.y;
		const cck = (props.x >> 2);
		const color = props.pixels?.at(props.y * NR_DMA_REC_HPOS * 4 + props.x);

		const dmaTime = (props.x >> 1) + props.y * NR_DMA_REC_HPOS;
		const customRegs = GetCustomRegsAfterDma(MODELS[props.frame].amiga.customRegs, MODELS[props.frame].amiga.dmaRecords, dmaTime);

		const regDMACON = Custom.ByName("DMACON").adr - 0xdff000;
		const regBPLCON0 = Custom.ByName("BPLCON0").adr - 0xdff000;
		const regBPLCON1 = Custom.ByName("BPLCON1").adr - 0xdff000;
		const regBPLCON2 = Custom.ByName("BPLCON2").adr - 0xdff000;
		const regFMODE = Custom.ByName("FMODE").adr - 0xdff000; // ECS
		const regCOLOR00 = Custom.ByName("COLOR00").adr - 0xdff000;
		const colorRgb = customRegs[(regCOLOR00 >>> 1) + color];

		interface Bit {
			name: string;
			enabled: boolean;
		}
		// DMACON
		const dmacon = customRegs[regDMACON >>> 1];
		const dmaconBits: Bit[] = [];
		if(dmacon & DMACONFlags.DMAEN) {
			dmaconBits.push({ name: "Master", enabled: true });
			dmaconBits.push({ name: "Raster", enabled: !!(dmacon & DMACONFlags.BPLEN) });
			dmaconBits.push({ name: "Copper", enabled: !!(dmacon & DMACONFlags.COPEN) });
			dmaconBits.push({ name: "Blitter", enabled: !!(dmacon & DMACONFlags.BLTEN) });
			dmaconBits.push({ name: "BltPri", enabled: !!(dmacon & DMACONFlags.BLTPRI) });
			dmaconBits.push({ name: "Sprite", enabled: !!(dmacon & DMACONFlags.SPREN) });
		} else {
			dmaconBits.push({ name: "Master", enabled: false });
		}

		// BPLCON0
		const bplcon0 = customRegs[regBPLCON0 >>> 1];
		const bplcon0Bits: Bit[] = [];
		const bpu = swizzle(bplcon0, 12, 0) | swizzle(bplcon0, 13, 1) | swizzle(bplcon0, 14, 2) | swizzle(bplcon0, 4, 3);
		bplcon0Bits.push({ name: `BPU: ${bpu}`, enabled: bpu > 0 });
		bplcon0Bits.push({ name: "Hires", enabled: !!(bplcon0 & BPLCON0Flags.HIRES) });
		bplcon0Bits.push({ name: "HAM", enabled: !!(bplcon0 & BPLCON0Flags.HAM) });
		bplcon0Bits.push({ name: "DPF", enabled: !!(bplcon0 & BPLCON0Flags.DPF) });
		bplcon0Bits.push({ name: "ECSENA", enabled: !!(bplcon0 & BPLCON0Flags.ECSENA) });

		// BPLCON1
		const bplcon1 = customRegs[regBPLCON1 >>> 1];
		const bplcon1Bits: Bit[] = [];
		const pf1h = bplcon1 & 0xf;
		const pf2h = (bplcon1 >>> 4) & 0xf;
		bplcon1Bits.push({ name: `PF2H: ${pf2h}`, enabled: pf2h > 0 });
		bplcon1Bits.push({ name: `PF1H: ${pf1h}`, enabled: pf1h > 0 });

		// BPLCON2
		const bplcon2 = customRegs[regBPLCON2 >>> 1];
		const bplcon2Bits: Bit[] = [];
		const pf1p = bplcon2 & 0x7;
		const pf2p = (bplcon2 >>> 3) & 0x7;
		//bplcon2Bits.push({ name: "KillEHB", enabled: !!(bplcon2 & BPLCON2Flags.KILLEHB) });
		bplcon2Bits.push({ name: "PF2PRI", enabled: !!(bplcon2 & BPLCON2Flags.PF2PRI) });
		bplcon2Bits.push({ name: `PF2P: ${pf2p}`, enabled: pf2p > 0 });
		bplcon2Bits.push({ name: `PF1P: ${pf1p}`, enabled: pf1p > 0 });

		// FMODE
		const fmode = customRegs[regFMODE >>> 1];
		const fmodeBits: Bit[] = [];
		fmodeBits.push({ name: "SPAGEM", enabled: !!(fmode & FMODEFlags.SPAGEM) });
		fmodeBits.push({ name: "SPR32", enabled: !!(fmode & FMODEFlags.SPR32) });
		fmodeBits.push({ name: "BPAGEM", enabled: !!(fmode & FMODEFlags.BPAGEM) });
		fmodeBits.push({ name: "BPL32", enabled: !!(fmode & FMODEFlags.BPL32) });

		const ecsAga = (MODELS[0].amiga.chipsetFlags & (ChipsetFlags.AGA | ChipsetFlags.ECSDenise)) !== 0;

		return <div>
			<dl>
				{props.pixelSources && <>
					<dt>Source</dt>
					<dd>{PixelSource[props.pixelSources.at(props.y * NR_DMA_REC_HPOS * 4 + props.x)]}</dd>
				</>}
				{props.pixelPtrs && <>
					<dt>Pointers</dt>
					<dd class={styles.container}>{[0, 1, 2, 3, 4, 5, 6, 7].filter((pl) => ecsAga ? true : pl < 6).map((i) => <span class={bpu > i ? styles.bplptr_on : styles.bplptr_off}>
						${props.pixelPtrs.at((line * NR_DMA_REC_HPOS + cck) * 8 + i).toString(16).padStart(6, '0')}
					</span>)}</dd>
				</>}
				{color !== undefined && <>
					<dt>Color</dt>
					<dd class={styles.container}>{color.toString().padStart(2, '0')} ${color.toString(16).padStart(2, '0')} %{color.toString(2).padStart(8/*TODO*/, '0')} ${(colorRgb & 0xfff).toString(16).padStart(3, '0')}<span style={{marginLeft: 4, background: GetAmigaColorCss(colorRgb)}}>&nbsp;&nbsp;</span></dd>
				</>}
				<dt>Denise</dt>
				<dd>H:{hpos} V:{vpos}</dd>
				<dt>Agnus</dt>
				<dd>Line:{line} CCK:{cck}</dd>
				<dt>DMACON</dt>
				<dd>{dmaconBits.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
				<dt>BPLCON0</dt>
				<dd>{bplcon0Bits.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
				<dt>BPLCON1</dt>
				<dd>{bplcon1Bits.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
				<dt>BPLCON2</dt>
				<dd>{bplcon2Bits.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
				{ecsAga && <>
					<dt>FMODE</dt>
					<dd>{fmodeBits.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
				</>}
			</dl>
		</div>;
	}
	return <div />;
};

const DeniseScreen: FunctionComponent<{
	scale?: number;
	frame: number;
	time: number;
	setTime?: StateUpdater<number>;
	state: DeniseState;
	dmaOpacity: number;
}> = ({ scale = 2, frame, time, setTime, state, dmaOpacity }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const dmaCanvas = useRef<HTMLCanvasElement>();
	const timeCanvas = useRef<HTMLCanvasElement>();
	const canvasScaleX = scale / 2;
	const canvasScaleY = scale;
	const canvasWidth = NR_DMA_REC_HPOS * 4 * canvasScaleX;
	const canvasHeight = NR_DMA_REC_VPOS * canvasScaleY;

	const zoomCanvasScale = 8;
	const zoomCanvasWidth = 144*2;
	const zoomCanvasHeight = 144;

	const [pixelSources, pixelPtrs, pixels, pixelsRgb, pixelsDma] = useMemo(() => getScreen(scale, MODELS[frame], state), [scale, frame/*, time*/, state]);

	useEffect(() => { // screen canvas
		const context = canvas.current?.getContext('2d');
		if(state.screenshot && PROFILES[frame].screenshot) {
			//MAXVPOS_PAL=312
			//752x574: Overscan
			//784x578: Overscan+
			//820x580: Extreme
			//908x628: Ultra extreme debug; maxhpos_display = AMIGA_WIDTH_MAX (754 / 2 = 377) + EXTRAWIDTH_ULTRA (77) = 908
			const img = new Image();
			img.onload = () => {
				console.log(`screenshot: ${img.width}x${img.height}`);
				context.clearRect(0, 0, canvas.current.width, canvas.current.height);

				// these values are to bring WinUAE reference screenshots into our Denise space, which is probably still wrong...
				const [x, y] = (img.width === 908 && img.height === 628) ? [30, 2] // Ultra extreme debug
				             : (img.width === 820 && img.height === 580) ? [166, 50] // Extreme
				             : (img.width === 784 && img.height === 578) ? [150, 50] // Overscan+
				             : (img.width === 752 && img.height === 574) ? [182, 52] // Overscan
				             : [0, 0];
				context.drawImage(img, x, y, img.width * canvasScaleX, img.height * canvasScaleY / 2);
			};
			img.src = PROFILES[frame].screenshot;
			return null;
		}

		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		data.set(pixelsRgb);
		context.putImageData(imgData, 0, 0);
	}, [canvas.current, pixelsRgb]);

	useEffect(() => { // DMA overlay canvas
		if(pixelsDma && dmaOpacity > 0) {
			const context = dmaCanvas.current?.getContext('2d');
			const imgData = context.createImageData(canvasWidth, canvasHeight);
			const data = new Uint32Array(imgData.data.buffer);
			data.set(pixelsDma);
			context.putImageData(imgData, 0, 0);
		}
	}, [dmaCanvas.current, pixelsDma]);

	useEffect(() => { // time overlay canvas
		const context = timeCanvas.current?.getContext('2d');
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		if(!state.screenshot) {
			context.fillStyle = 'white';
			const cyc = CpuCyclesToDmaCycles(time);
			context.fillRect((cyc % NR_DMA_REC_HPOS) * 4 * canvasScaleX, 0, 1, canvasHeight);
			context.fillRect(0, ((cyc / NR_DMA_REC_HPOS) |0) * canvasScaleY, canvasWidth, 1);
		}
	}, [timeCanvas.current, time, state.screenshot]);

	const zoomClick = useCallback((x: number, y: number) => {
		const line = y;
		const cck = (x >> 2);
		const time = line * NR_DMA_REC_HPOS + cck;
		setTime(DmaCyclesToCpuCycles(time));
	}, [setTime]);

	return <>
		<div class={styles.screen}>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} class={styles.screen_canvas} data-canvasScaleX={canvasScaleX} data-canvasScaleY={canvasScaleY} />
			{dmaOpacity > 0 && <canvas class={styles.overdraw_canvas} style={{opacity: dmaOpacity}} ref={dmaCanvas} width={canvasWidth} height={canvasHeight} />}
			<canvas class={styles.overdraw_canvas} ref={timeCanvas} width={canvasWidth} height={canvasHeight} />
			<ZoomCanvas canvas={canvas} scale={zoomCanvasScale} width={zoomCanvasWidth} height={zoomCanvasHeight} infoWidth={310} infoHeight={370} ZoomInfo={DeniseZoomInfo} zoomExtraProps={{ pixelSources, pixelPtrs, pixels, frame }} onClick={zoomClick} />
		</div>
	</>;
};

export const DeniseView: FunctionComponent<{
	frame: number;
	time: number;
	setTime?: StateUpdater<number>;
}> = ({ frame, time, setTime }) => {
	const [state, setState] = useState<DeniseState>(DefaultDeniseState);

	const showAllPlanes = useCallback((checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.planes = [checked, checked, checked, checked, checked, checked, checked, checked];
			return neu;
		});
	}, [setState]);
	const showPlane = useCallback((index: number, checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.planes[index] = checked;
			return neu;
		});
	}, [setState]);

	const showAllSprites = useCallback((checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.sprites = [checked, checked, checked, checked, checked, checked, checked, checked];
			return neu;
		});
	}, [setState]);
	const showSprite = useCallback((index: number, checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.sprites[index] = checked;
			return neu;
		});
	}, [setState]);

	const [dmaOpacity, setDmaOpacity] = useState(0);

	return (<>
		<div style={{ flexGrow: 0 }}>
		<Toolbar>
			<div>
				DMA&nbsp;Overlay</div><div><input style={{verticalAlign: 'bottom'}} type="range" min="0" max="100" value={dmaOpacity * 100} class="slider" onInput={({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => setDmaOpacity(parseInt(currentTarget.value) / 100)} />
			</div>
			<ToggleButton icon="Window" label="Show Display Window" checked={state.window} onChange={(checked) => setState((prev: DeniseState) => ({ ...prev, window: checked }))} />
			<ToggleButton icon="Bitplanes" label="Show Bitplanes" checked={state.planes.some((v) => v)} onChange={showAllPlanes} />
			{state.planes.map((value, index) => <ToggleButton icon={`${index + 1}`} label={`Show Bitplane ${index + 1}`} checked={value} onChange={(checked) => showPlane(index, checked)} />)}
			<span style={{ width: '1em' }}></span>
			<ToggleButton icon="Sprites" label="Show Sprites" checked={state.sprites.some((v) => v)} onChange={showAllSprites} />
			{state.sprites.map((value, index) => <ToggleButton icon={`${index}`} label={`Show Sprite ${index}`} checked={value} onChange={(checked) => showSprite(index, checked)} />)}
			<span style={{ width: '1em' }}></span>
			{PROFILES[frame].screenshot?.length > 22 && <ToggleButton icon="Reference Screenshot" label="Show Reference Screenshot" checked={state.screenshot} onChange={(checked) => setState((prev: DeniseState) => ({ ...prev, screenshot: checked }))} />}
		</Toolbar>
		</div>
		<div style={{ overflow: 'auto' }}>
			<DeniseScreen frame={frame} time={time} setTime={setTime} state={state} dmaOpacity={dmaOpacity} />
		</div>
	</>);
};
