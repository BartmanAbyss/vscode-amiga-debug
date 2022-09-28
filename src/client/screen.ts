import { swizzle } from "../utils";
import { CustomReadWrite, Custom, DMACONFlags, FMODEFlags } from "./custom";
import { CpuCyclesToDmaCycles, displayLeft, displayTop, DmaSubTypes, dmaTypes, DmaTypes, GetAmigaColor, GetAmigaColorEhb, GetMemoryAfterDma, Memory, NR_DMA_REC_HPOS, NR_DMA_REC_VPOS } from "./dma";
import { IProfileModel } from "./model";

export interface DeniseState {
	freeze: number;
	screenshot: boolean;
	window: boolean;
	planes: boolean[];
	sprites: boolean[];
	persistence: number;
}

export const DefaultDeniseState: DeniseState = {
	freeze: -1,
	screenshot: false,
	window: true,
	planes: [true, true, true, true, true, true, true, true],
	sprites: [true, true, true, true, true, true, true, true],
	persistence: 10_000,
};

export enum PixelSource {
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

export function getScreen(scale: number, model: IProfileModel, freezeModel: IProfileModel, time: number, state: DeniseState): [Uint8Array, Uint32Array, Uint8Array, Uint32Array, Uint32Array] {
	const canvasScaleX = scale / 2;
	const canvasScaleY = scale;
	const canvasWidth = NR_DMA_REC_HPOS * 4 * canvasScaleX;
	const canvasHeight = NR_DMA_REC_VPOS * canvasScaleY;

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
	const regDMACON  = Custom.ByName("DMACON") .adr - 0xdff000;
	const regCOPJMP1 = Custom.ByName("COPJMP1").adr - 0xdff000;
	const regCOPJMP2 = Custom.ByName("COPJMP2").adr - 0xdff000;
	const regBPLCON0 = Custom.ByName("BPLCON0").adr - 0xdff000;
	const regBPLCON1 = Custom.ByName("BPLCON1").adr - 0xdff000;
	const regBPLCON2 = Custom.ByName("BPLCON2").adr - 0xdff000;
	const regBPL1DAT = Custom.ByName("BPL1DAT").adr - 0xdff000;
	const regBPL8DAT = Custom.ByName("BPL8DAT").adr - 0xdff000;
	const bplStride  = Custom.ByName("BPL2DAT").adr - Custom.ByName("BPL1DAT").adr;
	const regCOLOR00 = Custom.ByName("COLOR00").adr - 0xdff000;
	const regSTRHOR  = Custom.ByName("STRHOR") .adr - 0xdff000; // line 24-311
	const regSTRLONG = Custom.ByName("STRLONG").adr - 0xdff000; // probably only interlace
	const regSTREQU  = Custom.ByName("STREQU") .adr - 0xdff000; // line 0-7
	const regSTRVBL  = Custom.ByName("STRVBL") .adr - 0xdff000; // line 8-23, 312
	const regDIWSTRT = Custom.ByName("DIWSTRT").adr - 0xdff000;
	const regDIWSTOP = Custom.ByName("DIWSTOP").adr - 0xdff000;
	const regDIWHIGH = Custom.ByName("DIWHIGH").adr - 0xdff000; // ECS
	const regFMODE   = Custom.ByName("FMODE")  .adr - 0xdff000; // ECS

	const regSPR0POS   = Custom.ByName("SPR0POS") .adr- 0xdff000;
	const regSPR0CTL   = Custom.ByName("SPR0CTL") .adr- 0xdff000;
	const regSPR0DATA  = Custom.ByName("SPR0DATA").adr - 0xdff000;
	const regSPR0DATB  = Custom.ByName("SPR0DATB").adr - 0xdff000;
	const regSPR7DATB  = Custom.ByName("SPR7DATB").adr - 0xdff000;
	const spriteStride = Custom.ByName("SPR1POS") .adr- Custom.ByName("SPR0POS").adr;

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

	const freeze = state.freeze !== -1;
	const sprites = [createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite()];
	const customRegs = freezeModel.amiga.customRegs.slice(); // initial copy
	const memory = new Memory(model.memory.chipMem.slice(), new Uint8Array()); // initial copy
	const lastUpdate = new Uint32Array(memory.chipMem.byteLength);

	let vpos = -1;
	let hpos = 0;
	let hdiwstrt = customRegs[regDIWSTRT >>> 1] & 0xff;
	let hdiwstop = (customRegs[regDIWSTOP >>> 1] & 0xff) | 0x100;
	let scroll = [0, 0];
	let window = false;
	let prevColor = 0xff000000; // HAM
	let ignoreCopper = 0;
	// process real memory
	if(freeze) {
		const maxCycle = CpuCyclesToDmaCycles(time);
		for(let cycle = 0; cycle < maxCycle; cycle++) {
			const dmaRecord = model.amiga.dmaRecords[cycle];
			if(dmaRecord.addr >= 0 && dmaRecord.addr < lastUpdate.byteLength) {
				if((dmaRecord.reg & 0x1100) === 0x1100) { // CPU write
					const color = dmaTypes.get(DmaTypes.CPU).subtypes.get(DmaSubTypes.CPU_DATA).color;
					const alpha = (1 - Math.min(Math.max((maxCycle - cycle) / state.persistence, 0), 1)) * 255;
					const len = dmaRecord.reg & 0xff;
					switch(dmaRecord.reg & 0xff) {
						case 1: 
							memory.writeByte(dmaRecord.addr, dmaRecord.dat); 
							lastUpdate[dmaRecord.addr] = (color & 0xffffff) | (alpha << 24);
							break;
						case 2: 
							memory.writeWord(dmaRecord.addr, dmaRecord.dat); 
							lastUpdate[dmaRecord.addr] = lastUpdate[dmaRecord.addr + 1] = (color & 0xffffff) | (alpha << 24);
							break;
						case 4: 
							memory.writeLong(dmaRecord.addr, dmaRecord.dat); 
							lastUpdate[dmaRecord.addr] = lastUpdate[dmaRecord.addr + 1] = 
							lastUpdate[dmaRecord.addr + 2] = lastUpdate[dmaRecord.addr + 3] = (color & 0xffffff) | (alpha << 24);
							break;
					}
				} else if(dmaRecord.reg === 0) { // Blitter write
					const color = dmaTypes.get(DmaTypes.BLITTER).subtypes.get(dmaRecord.extra).color;
					const alpha = (1 - Math.min(Math.max((maxCycle - cycle) / state.persistence, 0), 1)) * 255;
					lastUpdate[dmaRecord.addr] = lastUpdate[dmaRecord.addr + 1] = (color & 0xffffff) | (alpha << 24);
					memory.writeWord(dmaRecord.addr, dmaRecord.dat);
				}
			}
		}
	}
	
	// process frozen memory
	for(let cycleY = 0; cycleY < NR_DMA_REC_VPOS; cycleY++) {
		for(let cycleX = 0; cycleX < NR_DMA_REC_HPOS; cycleX++) {
			// this is per 2 lores pixels
			const dmaRecord = freezeModel.amiga.dmaRecords[cycleY * NR_DMA_REC_HPOS + cycleX];
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
					if(!freeze) {
						switch(dmaRecord.reg & 0xff) {
						case 1: memory.writeByte(dmaRecord.addr, dmaRecord.dat); break;
						case 2: memory.writeWord(dmaRecord.addr, dmaRecord.dat); break;
						case 4: memory.writeLong(dmaRecord.addr, dmaRecord.dat); break;
						}
					}
				} else if(dmaRecord.reg === 0) { // Blitter write
					if(!freeze)
						memory.writeWord(dmaRecord.addr, dmaRecord.dat);
				} else if(dmaRecord.reg === regDMACON) {
					if(dmaRecord.dat & DMACONFlags.SETCLR)
						customRegs[regDMACON >>> 1] |= dmaRecord.dat & 0x7FFF;
					else
						customRegs[regDMACON >>> 1] &= ~dmaRecord.dat;
				} else if(Custom.ByOffs(dmaRecord.reg)?.rw & CustomReadWrite.write) {
					customRegs[dmaRecord.reg >>> 1] = dmaRecord.dat;
				}
				if(!freeze) {
					const dmaType = dmaTypes.get(dmaRecord.type ?? 0);
					if(!dmaType)
						continue;
					const dmaSubtype = dmaType.subtypes.get(dmaRecord.extra) ?? dmaType.subtypes.get(0);
					if(!dmaSubtype)
						continue;
					const dmaColor = dmaSubtype.color;
					putDma(cycleX, cycleY, dmaColor);
				}
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

			if(freeze) {
				const color = lastUpdate[bplPtr[0]] | lastUpdate[bplPtr[1]] | lastUpdate[bplPtr[2]] | lastUpdate[bplPtr[3]] 
				            | lastUpdate[bplPtr[4]] | lastUpdate[bplPtr[5]] | lastUpdate[bplPtr[6]] | lastUpdate[bplPtr[7]];
				putDma(cycleX, cycleY, color);
			}

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
			if(dmaRecord.reg >= regSPR0POS && dmaRecord.reg <= regSPR7DATB) {
				const i = ((dmaRecord.reg - regSPR0POS) / spriteStride) | 0;
				const r = dmaRecord.reg - i * spriteStride;
				if(r === regSPR0CTL) {
					sprites[i].armed = false;
					sprites[i].hstart = (dmaRecord.dat & 1) | (sprites[i].hstart & ~1);
					sprites[i].attach = (dmaRecord.dat & (1 << 7)) ? true : false;
				} else if(r === regSPR0POS) {
					sprites[i].hstart = ((dmaRecord.dat & 0xff) << 1) | (sprites[i].hstart & 1);
				} else if(r === regSPR0DATA) {
					sprites[i].armed = true;
					sprites[i].data = dmaRecord.dat;
				} else if(r === regSPR0DATB) {
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

				// shift sprites **3ms**
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
				for(let i = 0; i < 8; i += 2) { // **1ms**
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
}
