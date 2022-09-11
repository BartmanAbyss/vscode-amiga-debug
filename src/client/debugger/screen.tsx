import { FunctionComponent, JSX } from 'preact';
import { StateUpdater, useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { ToggleButton } from '../toggle-button';
import { Toolbar } from '../filter';
import { IZoomProps, ZoomCanvas } from "./zoomcanvas";
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
import { ICpuProfileRaw } from '../types';
import { BPLCON0Flags, BPLCON2Flags, CustomReadWrite, CustomRegisters, DMACONFlags, FMODEFlags } from '../customRegisters';
import { DmaCyclesToCpuCycles, GetAmigaColor, GetAmigaColorEhb, NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, displayLeft, displayTop, dmaTypes, CpuCyclesToDmaCycles, GetCustomRegsAfterDma, DmaTypes, DmaSubTypes, ChipsetFlags, GetAmigaColorCss, Memory } from '../dma';
declare let PROFILES: ICpuProfileRaw[];
declare const MODELS: IProfileModel[];

interface DeniseState {
	screenshot: boolean;
	window: boolean;
	planes: boolean[];
	sprites: boolean[];
}

const DefaultDeniseState: DeniseState = {
	screenshot: false,
	window: true,
	planes: [true, true, true, true, true, true, true, true],
	sprites: [true, true, true, true, true, true, true, true],
};

enum PixelSource {
	unknown, // 0
	background,
	playfield1,
	playfield2,
	sprite0,
	sprite1,
	sprite2,
	sprite3,
	sprite4,
	sprite5,
	sprite6,
	sprite7,
	sprite01,
	sprite23,
	sprite45,
	sprite67,
	noPlanes,
	outsideWindow,
}

const swizzle = (src: number, bitFrom: number, bitTo: number): number => {
	return ((src >>> bitFrom) & 1) << bitTo;
};

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

		const regDMACON = CustomRegisters.getCustomAddress("DMACON") - 0xdff000;
		const regBPLCON0 = CustomRegisters.getCustomAddress("BPLCON0") - 0xdff000;
		const regBPLCON1 = CustomRegisters.getCustomAddress("BPLCON1") - 0xdff000;
		const regBPLCON2 = CustomRegisters.getCustomAddress("BPLCON2") - 0xdff000;
		const regFMODE = CustomRegisters.getCustomAddress("FMODE") - 0xdff000; // ECS
		const regCOLOR00 = CustomRegisters.getCustomAddress("COLOR00") - 0xdff000;
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

	const [pixelSources, pixelPtrs, pixels, pixelsRgb, pixelsDma] = useMemo((): [Uint8Array, Uint32Array, Uint8Array, Uint32Array, Uint32Array] => { // screen
		const pixelSources = new Uint8Array(NR_DMA_REC_HPOS * 4 * NR_DMA_REC_VPOS);
		const pixelPtrs = new Uint32Array(NR_DMA_REC_HPOS * NR_DMA_REC_VPOS * 8); // 8 = max planes
		const pixels = new Uint8Array(NR_DMA_REC_HPOS * 4 * NR_DMA_REC_VPOS);
		const pixelsRgb = new Uint32Array(canvasWidth * canvasHeight);
		const pixelsDma = new Uint32Array(canvasWidth * canvasHeight);
		const putDma = (x: number, y: number, rgb: number) => {
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX * 4; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX * 4 + xx);
					pixelsDma[offset] = rgb;
				}
			}
		};

		const putPixel = (x: number, y: number, color: number, rgb: number, source: PixelSource) => {
			pixelSources[x + y * NR_DMA_REC_HPOS * 4] = source;
			pixels[x + y * NR_DMA_REC_HPOS * 4] = color;
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX + xx);
					pixelsRgb[offset] = rgb;
				}
			}
		};
		// TODO: this is not time dependent, could be faster during scrubbing!

		// Dual playfield sample: http://www.powerprograms.nl/downloads/download-dplfb.html

		console.time('denise');

		// Denise emulator - see https://github.com/MiSTer-devel/Minimig-AGA_MiSTer/blob/MiSTer/rtl/denise.v
		const bplDat        = [0, 0, 0, 0, 0, 0, 0, 0];
		const bplDatHi      = [0, 0, 0, 0, 0, 0, 0, 0];
		const bplPtr        = [0, 0, 0, 0, 0, 0, 0, 0];
		const bplShifter    = [0, 0, 0, 0, 0, 0, 0, 0];
		const bplShifterHi  = [0, 0, 0, 0, 0, 0, 0, 0];
		const bplScroller   = [0, 0, 0, 0, 0, 0, 0, 0];
		const bplScrollerHi = [0, 0, 0, 0, 0, 0, 0, 0];
		const regDMACON  = CustomRegisters.getCustomAddress("DMACON") - 0xdff000;
		const regCOPJMP1 = CustomRegisters.getCustomAddress("COPJMP1") - 0xdff000;
		const regCOPJMP2 = CustomRegisters.getCustomAddress("COPJMP2") - 0xdff000;
		const regBPLCON0 = CustomRegisters.getCustomAddress("BPLCON0") - 0xdff000;
		const regBPLCON1 = CustomRegisters.getCustomAddress("BPLCON1") - 0xdff000;
		const regBPLCON2 = CustomRegisters.getCustomAddress("BPLCON2") - 0xdff000;
		const regBPL1DAT = CustomRegisters.getCustomAddress("BPL1DAT") - 0xdff000;
		const regBPL8DAT = CustomRegisters.getCustomAddress("BPL8DAT") - 0xdff000;
		const bplStride = CustomRegisters.getCustomAddress("BPL2DAT") - CustomRegisters.getCustomAddress("BPL1DAT");
		const regCOLOR00 = CustomRegisters.getCustomAddress("COLOR00") - 0xdff000;
		const regSTRHOR = CustomRegisters.getCustomAddress("STRHOR") - 0xdff000; // line 24-311
		const regSTRLONG = CustomRegisters.getCustomAddress("STRLONG") - 0xdff000; // probably only interlace
		const regSTREQU = CustomRegisters.getCustomAddress("STREQU") - 0xdff000; // line 0-7
		const regSTRVBL = CustomRegisters.getCustomAddress("STRVBL") - 0xdff000; // line 8-23, 312
		const regDIWSTRT = CustomRegisters.getCustomAddress("DIWSTRT") - 0xdff000;
		const regDIWSTOP = CustomRegisters.getCustomAddress("DIWSTOP") - 0xdff000;
		const regDIWHIGH = CustomRegisters.getCustomAddress("DIWHIGH") - 0xdff000; // ECS
		const regFMODE = CustomRegisters.getCustomAddress("FMODE") - 0xdff000; // ECS

		const regSPR0POS = CustomRegisters.getCustomAddress("SPR0POS") - 0xdff000;
		const regSPR0CTL = CustomRegisters.getCustomAddress("SPR0CTL") - 0xdff000;
		const regSPR0DATA = CustomRegisters.getCustomAddress("SPR0DATA") - 0xdff000;
		const regSPR0DATB = CustomRegisters.getCustomAddress("SPR0DATB") - 0xdff000;
		const spriteStride = CustomRegisters.getCustomAddress("SPR1POS") - CustomRegisters.getCustomAddress("SPR0POS");

		interface Sprite {
			armed: boolean;
			hstart: number;
			attach: boolean;
			data: number;
			datb: number;
			shifta: number;
			shiftb: number;
		}

		const createSprite = (): Sprite => {
			return {
				armed: false,
				hstart: 0,
				attach: false,
				data: 0,
				datb: 0,
				shifta: 0,
				shiftb: 0
			};
		};

		const sprites = [createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite()];
		const customRegs = MODELS[frame].amiga.customRegs.slice(); // initial copy
		const memory = new Memory(MODELS[frame].memory.chipMem.slice(), new Uint8Array());
	
		let vpos = -1;
		let hpos = 0;
		let hdiwstrt = customRegs[regDIWSTRT >>> 1] & 0xff;
		let hdiwstop = (customRegs[regDIWSTOP >>> 1] & 0xff) | 0x100;
		let scroll = [0, 0];
		let window = false;
		let prevColor = 0xff000000; // HAM
		let ignoreCopper = 0;
		for (let cycleY = 0; cycleY < NR_DMA_REC_VPOS; cycleY++) {
			for (let cycleX = 0; cycleX < NR_DMA_REC_HPOS; cycleX++) {
				// this is per 2 lores pixels
				const dmaRecord = MODELS[frame].amiga.dmaRecords[cycleY * NR_DMA_REC_HPOS + cycleX];
				// see dma.ts@GetCustomRegsAfterDma
				if(!(dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)) {
					// skip 2 fake instructions after copper jump
					if(dmaRecord.type === DmaTypes.COPPER && dmaRecord.extra === DmaSubTypes.COPPER) {
						if(ignoreCopper > 0) {
							ignoreCopper--;
							continue;
						}
						if(dmaRecord.reg === regCOPJMP1 || dmaRecord.reg === regCOPJMP2)
							ignoreCopper = 2;
					} 
					// see dma.ts@GetMemoryAfterDma
					if((dmaRecord.reg & 0x1100) === 0x1100) { // CPU write
						switch(dmaRecord.reg & 0xff) {
							case 1: memory.writeByte(dmaRecord.addr, dmaRecord.dat); break;
							case 2: memory.writeWord(dmaRecord.addr, dmaRecord.dat); break;
							case 4: memory.writeLong(dmaRecord.addr, dmaRecord.dat); break;
						}
					} else if(dmaRecord.reg === 0) { // Blitter write
						memory.writeWord(dmaRecord.addr, dmaRecord.dat);
					} else if(dmaRecord.reg === regDMACON) {
						if(dmaRecord.dat & DMACONFlags.SETCLR)
							customRegs[regDMACON >>> 1] |= dmaRecord.dat & 0x7FFF;
						else
							customRegs[regDMACON >>> 1] &= ~dmaRecord.dat;
					} else if(CustomRegisters.getCustomReadWrite(0xdff000 + dmaRecord.reg) & CustomReadWrite.write) {
						customRegs[dmaRecord.reg >>> 1] = dmaRecord.dat;
					}

					const dmaType = dmaRecord.type || 0;
					const dmaSubtype = (Object.keys(dmaTypes[dmaType].subtypes).length === 1) ? 0 : (dmaRecord.extra || 0);
					if(dmaType >= dmaTypes.length || !dmaTypes[dmaType].subtypes[dmaSubtype])
						continue;
					const dmaColor = dmaTypes[dmaType].subtypes[dmaSubtype].color;
					putDma(cycleX, cycleY, dmaColor);
				}
				// vpos, hpos - https://www.techtravels.org/2012/04/progress-on-amiga-vsc-made-this-weekend-vsync-problem-persists/ 
				// HPOS counter in Denise counts from 2 to 456, it uses clock CDAC#, when STRLONG is received, it stops counting during two CDAC# cycles.
				// HBLANK occurs between HPOS = 19 and HPOS = 97. HSYNC occurs between HPOS = 32 and HPOS = 65.
				if(dmaRecord.reg === regSTRHOR || dmaRecord.reg === regSTRVBL || dmaRecord.reg === regSTREQU) {
					hpos = 2;
					vpos++;
					window = false; // safety
					prevColor = 0xff000000; // HAM
				}

				// bpldat
				if(dmaRecord.reg >= regBPL1DAT && dmaRecord.reg <= regBPL8DAT) {
					const i = (dmaRecord.reg - regBPL1DAT) / bplStride;
					if(!(dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)) {
						bplPtr[i] = dmaRecord.addr;
						switch(customRegs[regFMODE >>> 1] & (FMODEFlags.BPL32 | FMODEFlags.BPAGEM)) {
						case 0: // 16 bit
							bplDatHi[i] = 0;
							bplDat[i] = memory.readWord(bplPtr[i]);
							break;
						case 1: 
						case 2: // 32 bit
							bplDatHi[i] = 0;
							bplDat[i] = memory.readLong(bplPtr[i]);
							break;
						case 3: // 64 bit
							bplDatHi[i] = memory.readLong(bplPtr[i]);
							bplDat[i] = memory.readLong(bplPtr[i] + 4);
							break;
						}
					} else {
						bplPtr[i] = 0;
						bplDat[i] = dmaRecord.dat;
						bplDatHi[i] = dmaRecord.datHi;
					}
				}

				for(let i = 0; i < 8; i++)
					pixelPtrs[(cycleY * NR_DMA_REC_HPOS + cycleX) * 8 + i] = bplPtr[i];

				// BPL1DAT triggers serial->parallel conversion
				if(dmaRecord.reg === regBPL1DAT) {
					switch(customRegs[regFMODE >>> 1] & (FMODEFlags.BPL32 | FMODEFlags.BPAGEM)) {
					case 0: // 16 bit
						for(let i = 0; i < 8; i++) {
							bplShifterHi[i] = (bplDat[i] & 0xffff) << 16;
							bplShifter[i] = 0;
						}
						break;
					case 1: 
					case 2: // 32 bit
						for(let i = 0; i < 8; i++) {
							bplShifterHi[i] = bplDat[i];
							bplShifter[i] = 0;
						}
						break;
					case 3: // 64 bit
						for(let i = 0; i < 8; i++) {
							bplShifterHi[i] = bplDatHi[i];
							bplShifter[i] = bplDat[i];
						}
						break;
					}
					//if(cycleY === 100) console.log(` **** load scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')}`);
				}

				// sprites
				for(let i = 0; i < 8; i++) {
					if(dmaRecord.reg === regSPR0CTL + i * spriteStride) {
						sprites[i].armed = false;
						sprites[i].hstart = (dmaRecord.dat & 1) | (sprites[i].hstart & ~1);
						sprites[i].attach = (dmaRecord.dat & (1 << 7)) ? true : false;
					} else if(dmaRecord.reg === regSPR0POS + i * spriteStride) {
						sprites[i].hstart = ((dmaRecord.dat & 0xff) << 1) | (sprites[i].hstart & 1);
					} else if(dmaRecord.reg === regSPR0DATA + i * spriteStride) {
						sprites[i].armed = true;
						sprites[i].data = dmaRecord.dat;
					} else if(dmaRecord.reg === regSPR0DATB + i * spriteStride) {
						sprites[i].datb = dmaRecord.dat;
					}
				}

				// hdiwstrt
				if(dmaRecord.reg === regDIWSTRT)
					hdiwstrt = dmaRecord.dat & 0xff;
				if(dmaRecord.reg === regDIWSTOP)
					hdiwstop = (dmaRecord.dat & 0xff) | 0x100;
				if(dmaRecord.reg === regDIWHIGH) {
					hdiwstrt = (hdiwstrt & 0xff) | (dmaRecord.dat >>> 5) << 8;
					hdiwstop = (hdiwstop & 0xff) | (dmaRecord.dat >>> 13) << 8;
				}

				if(dmaRecord.reg === regBPLCON1)
					scroll = [dmaRecord.dat & 0xf, (dmaRecord.dat >>> 4) & 0xf];

				//const displayStart = 0x2c;
				//const lineStart = 29; // minimig: first visible line on PAL is 26
				const hires = (customRegs[regBPLCON0 >>> 1] & (1 << 15)) ? true : false;
				const numPlanes = (customRegs[regBPLCON0 >>> 1] >>> 12) & 0b111;
				const ham = (customRegs[regBPLCON0 >>> 1] & (1 << 11)) ? true : false;
				const dualPlayfield = (customRegs[regBPLCON0 >>> 1] & (1 << 10)) ? true : false;
				const ehb = numPlanes === 6 && !ham && !dualPlayfield;
				const playfield2Priority = (customRegs[regBPLCON2 >>> 1] & (1 << 6)) ? true : false;
				const scroll2 = hires ? [scroll[0] << 1, scroll[1] << 1] : scroll;

				// per pixel stuff in here!
				for(let q = 0; q < 2; q++) {
					// window
					if(hpos === hdiwstrt)
						window = true;
					if(hpos - 1 === hdiwstop)
						window = false;

					//if(cycleY === 100) console.log(`hpos:${hpos} cycleX:${cycleX} hdiwstrt:${hdiwstrt} hdiwstop:${hdiwstop} window: ${window} scroll_delayed: ${scroll_delayed[0]} ${scroll_delayed[1]}`);

					// shift sprites
					for(let i = 0; i < 8; i++) {
						if(sprites[i].armed && sprites[i].hstart === hpos) {
							sprites[i].shifta = sprites[i].data;
							sprites[i].shiftb = sprites[i].datb;
						} else {
							sprites[i].shifta = (sprites[i].shifta << 1) & 0xffff;
							sprites[i].shiftb = (sprites[i].shiftb << 1) & 0xffff;
						}
					}

					let sprsource = PixelSource.unknown;

					// sprite data
					const nsprite = [0, 0, 0, 0, 0, 0, 0, 0];
					for(let i = 0; i < 8; i++)
						nsprite[i] = ((sprites[i].shiftb & (1 << 15)) >>> 14) | ((sprites[i].shifta & (1 << 15)) >>> 15);
					// sprite priority
					let sprdata = 0;
					let sprcode = 7;
					let sprattach = false;
					for(let i = 0; i < 8; i += 2) {
						if(nsprite[i] || nsprite[i + 1]) {
							if(sprites[i].attach || sprites[i + 1].attach) {
								if(state.sprites[i])
									sprdata |= nsprite[i];
								if(state.sprites[i + 1])
									sprdata |= (nsprite[i + 1] << 2);
								if(sprdata)
									sprsource = PixelSource.sprite01 + (i >> 1);
								sprattach = true;
							} else if(nsprite[i] && state.sprites[i]) {
								sprdata = nsprite[i];
								if(sprdata)
									sprsource = PixelSource.sprite0 + i;
							} else if(state.sprites[i + 1]) {
								sprdata = nsprite[i + 1];
								if(sprdata)
									sprsource = PixelSource.sprite1 + i;
							}
							if(sprdata)
								sprcode = (i >> 1) + 1;
							break;
						}
					}
					const pf1front = sprcode > ( customRegs[regBPLCON2 >>> 1]        & 0b111) ? true : false;
					const pf2front = sprcode > ((customRegs[regBPLCON2 >>> 1] >>> 3) & 0b111) ? true : false;

					// per hires pixel
					for(let i = 0; i < 2; i++) {
						if(hires || i === 0) {
							// shift bitplanes
							for(let p = 0; p < 8; p++) {
								bplScrollerHi[p] = (bplScrollerHi[p] << 1) | (bplScroller[p] >>> 31);
								bplScroller[p] = (bplScroller[p] << 1) | (bplShifterHi[p] >>> 31);
								bplShifterHi[p] = (bplShifterHi[p] << 1) | (bplShifter[p] >>> 31);
								bplShifter[p] = bplShifter[p] << 1;
							}
							//if(cycleY === 100) console.log(`     shift scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')}`);
						}

						//if(cycleY===100)console.log(`      draw scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')} ***${scroller[1] & (1 << scroll_delayed[0]) ? '1' : '0'}`);

						let bpldata = 0;
						for(let p = 0; p < numPlanes; p++) {
							if((bplScroller[p] & (1 << scroll2[p & 1])) && state.planes[p])
								bpldata |= 1 << p;
						}

						let playfieldsource = PixelSource.unknown;
						let nplayfield = [false, false];
						if(dualPlayfield) {
							const playfield1 = (bpldata & 0b01010101) ? true : false;
							const playfield2 = (bpldata & 0b10101010) ? true : false;
							const pfdata = [
								swizzle(bpldata, 6, 3) | swizzle(bpldata, 4, 2) | swizzle(bpldata, 2, 1) | swizzle(bpldata, 0, 0), 
								swizzle(bpldata, 7, 2) | swizzle(bpldata, 5, 2) | swizzle(bpldata, 3, 1) | swizzle(bpldata, 1, 0)
							];
							nplayfield = [pfdata[0] ? true : false, pfdata[1] ? true : false];
							if(playfield2Priority) {
								if(playfield2) {
									bpldata = 0b1000 | pfdata[1];
									playfieldsource = PixelSource.playfield2;
								} else if(playfield1) {
									bpldata = pfdata[0];
									playfieldsource = PixelSource.playfield1;
								} else {
									bpldata = 0;
								}
							} else {
								if(playfield1) {
									bpldata = pfdata[0];
									playfieldsource = PixelSource.playfield1;
								} else if(playfield2) {
									bpldata = 0b1000 | pfdata[1];
									playfieldsource = PixelSource.playfield2;
								} else {
									bpldata = 0;
								}
							}
						} else {
							nplayfield = [false, bpldata ? true : false];
							playfieldsource = bpldata ? PixelSource.playfield2 : PixelSource.background;
						}

						// sprite<->playfields priority
						let sprsel = false;
						if(sprcode === 7)
							sprsel = false;
						else if(pf1front && nplayfield[0])
							sprsel = false;
						else if(pf2front && nplayfield[1])
							sprsel = false;
						else
							sprsel = true;

						if(sprsel) {
							if(sprattach)
								bpldata = 16 + sprdata;
							else
								bpldata = 16 + (sprcode - 1) * 4 + sprdata;
						}

						let color = GetAmigaColor(customRegs[(regCOLOR00 >>> 1)]); // 0xAABBGGRR
						if(ham && !sprsel) {
							// TODO: HAM8
							switch(bpldata >> 4) {
							case 0: // set
								color = 0xff000000 | GetAmigaColor(customRegs[(regCOLOR00 >>> 1) + (bpldata & 0xf)]);
								break;
							case 1: // modify blue
								color = (prevColor & ~0xff0000) | ((((bpldata & 0xf) << 4) | (bpldata & 0xf)) << 16);
								break;
							case 3: // modify green
								color = (prevColor & ~0x00ff00) | ((((bpldata & 0xf) << 4) | (bpldata & 0xf)) << 8);
								break;
							case 2: // modify red
								color = (prevColor & ~0x0000ff) | ((((bpldata & 0xf) << 4) | (bpldata & 0xf)) << 0);
								break;
							}
							prevColor = color;
						} else {
							if(ehb && (bpldata & (1 << 5)))
								color = GetAmigaColorEhb(customRegs[(regCOLOR00 >>> 1) + (bpldata & 0x1f)]); // no AGA yet
							else
								color = GetAmigaColor(customRegs[(regCOLOR00 >>> 1) + (bpldata & 0x1f)]); // no AGA yet
						}

						if(hpos - 2 >= displayLeft && vpos >= displayTop) {
							if((window || !state.window) && numPlanes)
								putPixel((hpos - 2) * 2 + i,         vpos, bpldata, color, sprsel ? sprsource : playfieldsource);
							else
								putPixel((hpos - 2) * 2 + i,         vpos, bpldata, 0, !window ? PixelSource.outsideWindow : PixelSource.noPlanes);
						}
					}
					hpos++;
				}
			}
		}
		console.timeEnd('denise');
		return [pixelSources, pixelPtrs, pixels, pixelsRgb, pixelsDma];
	}, [scale, frame/*, time*/, state]);

	useEffect(() => { // screen canvas
		const context = canvas.current?.getContext('2d');
		if(state.screenshot && PROFILES[frame].$amiga.screenshot) {
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
			img.src = PROFILES[frame].$amiga.screenshot;
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
			<ZoomCanvas canvas={canvas} scale={zoomCanvasScale} width={zoomCanvasWidth} height={zoomCanvasHeight} infoWidth={310} infoHeight={325} ZoomInfo={DeniseZoomInfo} zoomExtraProps={{ pixelSources, pixelPtrs, pixels, frame }} onClick={zoomClick} />
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
			{PROFILES[frame].$amiga.screenshot?.length > 22 && <ToggleButton icon="Reference Screenshot" label="Show Reference Screenshot" checked={state.screenshot} onChange={(checked) => setState((prev: DeniseState) => ({ ...prev, screenshot: checked }))} />}
		</Toolbar>
		</div>
		<div style={{ overflow: 'auto' }}>
			<DeniseScreen frame={frame} time={time} setTime={setTime} state={state} dmaOpacity={dmaOpacity} />
		</div>
	</>);
};
