import { DmaRecord } from "../backend/profile_types";
import { CustomRegisters, CustomReadWrite } from './customRegisters';
import { CopperInstruction, CopperMove, CopperInstructionType } from "./copperDisassembler";
import { IAmigaProfileExtra, ICpuProfileRaw } from "./types";

declare let PROFILES: ICpuProfileRaw[];

export function CpuCyclesToDmaCycles(cpuCycles: number) {
	return (cpuCycles * PROFILES[0].$amiga.cpuCycleUnit / 512) | 0;
}

export function DmaCyclesToCpuCycles(dmaCycles: number) {
	return (dmaCycles * 512 / PROFILES[0].$amiga.cpuCycleUnit) | 0;
}

export class Memory {
	private chipMemAddr = 0x00000000;
	private bogoMemAddr = 0x00c00000;

	constructor(public chipMem: Uint8Array, public bogoMem: Uint8Array) {
	}

	public readByte(addr: number): number {
		if(addr >= this.chipMemAddr && addr < this.chipMemAddr + this.chipMem.byteLength)
			return this.chipMem[addr - this.chipMemAddr];
		if(addr >= this.bogoMemAddr && addr < this.bogoMemAddr + this.bogoMem.byteLength)
			return this.bogoMem[addr - this.bogoMemAddr];
		return 0;
	}
	public readWord(addr: number): number {
		return (this.readByte(addr) << 8) | (this.readByte(addr + 1));

	}
	public readLong(addr: number): number {
		return (this.readWord(addr) << 16) | (this.readWord(addr + 2));
	}

	public writeByte(addr: number, dat: number) {
		if(addr >= this.chipMemAddr && addr < this.chipMemAddr + this.chipMem.byteLength)
			this.chipMem[addr - this.chipMemAddr] = dat & 0xff;
		if(addr >= this.bogoMemAddr && addr < this.bogoMemAddr + this.bogoMem.byteLength)
			this.bogoMem[addr - this.bogoMemAddr] = dat & 0xff;
	}
	public writeWord(addr: number, dat: number) {
		this.writeByte(addr, dat >>> 8);
		this.writeByte(addr + 1, dat);
	}
	public writeLong(addr: number, dat: number) {
		this.writeWord(addr, dat >>> 16);
		this.writeWord(addr + 2, dat);
	}
}

export interface DmaSubtype {
	color: number; 	// 0xAABBGGRR
	name?: string;
}
export interface DmaType {
	name: string;
	subtypes: DmaSubtype[];
}

export const NR_DMA_REC_HPOS = 227;
export const NR_DMA_REC_VPOS = 313;

export namespace DmaEvents {
	export const BLITIRQ = 1;
	export const BLITNASTY = 2;
	export const BLITSTARTFINISH = 4;
	export const BPLFETCHUPDATE = 8;
	export const COPPERWAKE = 16;
	export const CPUIRQ = 32;
	export const INTREQ = 64;
	export const COPPERWANTED = 128;
	export const NOONEGETS = 256;
	export const SPECIAL = 32768;
}

export namespace DmaTypes {
	export const REFRESH = 1;
	export const CPU = 2;
	export const COPPER = 3;
	export const AUDIO = 4;
	export const BLITTER = 5;
	export const BITPLANE = 6;
	export const SPRITE = 7;
	export const DISK = 8;
}

export namespace DmaSubTypes {
	export const CPU_CODE = 0;
	export const CPU_DATA = 1;
	export const COPPER = 0;
	export const COPPER_WAIT = 1;
	export const COPPER_SPECIAL = 2;
	export const BLITTER = 0;
	export const BLITTER_FILL = 1;
	export const BLITTER_LINE = 2;
}

export const dmaTypes: DmaType[] = [
	{ // 0
		name: "-",
		subtypes: [ { color: 0xff222222 } ]
	},
	{ // DMARECORD_REFRESH 1
		name: 'Refresh',
		subtypes: [ { color: 0xff444444 } ]
	},
	{ // DMARECORD_CPU 2
		name: 'CPU',
		subtypes: [
			{ color: 0xff4253a2, name: 'Code' },
			{ color: 0xffd698ad, name: 'Data' }
		]
	},
	{ // DMARECORD_COPPER 3
		name: 'Copper',
		subtypes: [
			{ color: 0xff00eeee },
			{ color: 0xff22aaaa, name: 'Wait' },
			{ color: 0xff446666, name: 'Special' }
		]
	},
	{ // DMARECORD_AUDIO 4
		name: 'Audio',
		subtypes: [ 
			{ color: 0xff0000ff, name: 'Channel 0' },
			{ color: 0xff0000ee, name: 'Channel 1' },
			{ color: 0xff0000dd, name: 'Channel 2' },
			{ color: 0xff0000cc, name: 'Channel 3' },
		]
	},
	{ // DMARECORD_BLITTER 5
		name: 'Blitter',
		subtypes: [
			{ color: 0xff888800 },
			{ color: 0xffff8800, name: 'Fill' },
			{ color: 0xff00ff00, name: 'Line' }
		]
	},
	{ // DMARECORD_BITPLANE 6
		name: 'Bitplane',
		subtypes: [ 
			{ color: 0xffff0000, name: 'Plane 1' },
			{ color: 0xffee0000, name: 'Plane 2' },
			{ color: 0xffdd0000, name: 'Plane 3' },
			{ color: 0xffcc0000, name: 'Plane 4' },
			{ color: 0xffbb0000, name: 'Plane 5' },
			{ color: 0xffaa0000, name: 'Plane 6' },
			{ color: 0xff990000, name: 'Plane 7' },
			{ color: 0xff880000, name: 'Plane 8' },
		]
	},
	{ // DMARECORD_SPRITE 7
		name: 'Sprite',
		subtypes: [ 
			{ color: 0xffff00ff, name: 'Sprite 0' },
			{ color: 0xffee00ee, name: 'Sprite 1' },
			{ color: 0xffdd00dd, name: 'Sprite 2' },
			{ color: 0xffcc00cc, name: 'Sprite 3' },
			{ color: 0xffbb00bb, name: 'Sprite 4' },
			{ color: 0xffaa00aa, name: 'Sprite 5' },
			{ color: 0xff990099, name: 'Sprite 6' },
			{ color: 0xff880088, name: 'Sprite 7' },
		]
	},
	{ // DMARECORD_DISK 8
		name: 'Disk',
		subtypes: [ { color: 0xffffffff } ]
	},
];

export enum BlitterChannel {
	A, B, C, D
}

export interface Blit {
	cycleStart: number; // DMA cycles
	vposStart: number;
	hposStart: number;
	cycleEnd?: number; // DMA cycles
	vposEnd?: number;
	hposEnd?: number;
	BLTSIZH: number;
	BLTSIZV: number;
	BLTCON0: number;
	BLTCON1: number;
	BLTAFWM: number;
	BLTALWM: number;
	BLTxPT: number[]; // A-D
	BLTxMOD: number[]; // A-D
}

export interface Copper {
	cycle: number;
	vpos: number;
	hpos: number;
	address: number;
	insn: CopperInstruction;
}

// blits are sorted
export function GetBlits(customRegs: Uint16Array, dmaRecords: DmaRecord[]): Blit[] {
	const customReg = (reg: number) => customRegs[(reg - 0xdff000) >>> 1];
	const customRegL = (reg: number) => (customRegs[(reg - 0xdff000) >>> 1] << 16) | customRegs[(reg + 2 - 0xdff000) >>> 1];
	const regBLTxPT = [
		CustomRegisters.getCustomAddress("BLTAPT"),
		CustomRegisters.getCustomAddress("BLTBPT"),
		CustomRegisters.getCustomAddress("BLTCPT"),
		CustomRegisters.getCustomAddress("BLTDPT")
	];
	const regBLTxMOD = [
		CustomRegisters.getCustomAddress("BLTAMOD"),
		CustomRegisters.getCustomAddress("BLTBMOD"),
		CustomRegisters.getCustomAddress("BLTCMOD"),
		CustomRegisters.getCustomAddress("BLTDMOD")
	];
	const regBLTCON0 = CustomRegisters.getCustomAddress("BLTCON0");
	const regBLTCON1 = CustomRegisters.getCustomAddress("BLTCON1");
	const regBLTAFWM = CustomRegisters.getCustomAddress("BLTAFWM");
	const regBLTALWM = CustomRegisters.getCustomAddress("BLTALWM");
	const regBLTSIZE = CustomRegisters.getCustomAddress("BLTSIZE");
	const regBLTSIZV = CustomRegisters.getCustomAddress("BLTSIZV");
	const regBLTSIZH = CustomRegisters.getCustomAddress("BLTSIZH");
	let BlitTrace = "";

	const blits: Blit[] = [];

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if((dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) || (dmaRecord.addr !== undefined && dmaRecord.addr >= 0xdff000 && dmaRecord.addr < 0xdff200)) {
				const reg = (dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) ? dmaRecord.reg : (dmaRecord.addr - 0xdff000);
				customRegs[reg >>> 1] = dmaRecord.dat;
				const isBlitStart = (reg === regBLTSIZE - 0xdff000) || (reg === regBLTSIZH - 0xdff000);
				if(isBlitStart) {
					let BLTSIZH = 0;
					let BLTSIZV = 0;
					if(reg === regBLTSIZE - 0xdff000) { // OCS
						BLTSIZH = dmaRecord.dat & 0x3f;
						BLTSIZV = dmaRecord.dat >>> 6;
						if(BLTSIZH === 0)
							BLTSIZH = 64;
						if(BLTSIZV === 0)
							BLTSIZV = 1024;
					}
					if(reg === regBLTSIZH - 0xdff000) { // ECS
						BLTSIZH = dmaRecord.dat & 0x7ff;
						BLTSIZV = customReg(regBLTSIZV) & 0x7fff;
						if(BLTSIZH === 0)
							BLTSIZH = 2048;
						if(BLTSIZV === 0)
							BLTSIZV = 32768;
					}
					const BLTCON0 = customReg(regBLTCON0);
					const BLTCON1 = customReg(regBLTCON1);
					const BLTAFWM = customReg(regBLTAFWM);
					const BLTALWM = customReg(regBLTALWM);
					const BLTxPT = [];
					const BLTxMOD = [];
					let channels = '';
					const addresses: string[] = [];
					for(let channel = 0; channel < 4; channel++) {
						const adr = customRegL(regBLTxPT[channel]) & 0x1ffffe; // ECS=0x1ffffe, OCS=0x7fffe;
						BLTxPT.push(adr);
						BLTxMOD.push(customReg(regBLTxMOD[channel]));
						if(BLTCON0 & (1 << (11 - channel))) {
							channels += 'ABCD'[channel];
							addresses.push('ABCD'[channel] + ' = $' + adr.toString(16).padStart(8, '0'));
						} else {
							channels += '-';
							addresses.push('             ');
						}
					}
					blits.push({
						cycleStart: i,
						vposStart: y,
						hposStart: x,
						BLTSIZH,
						BLTSIZV,
						BLTCON0,
						BLTCON1,
						BLTAFWM,
						BLTALWM,
						BLTxPT,
						BLTxMOD
					});
					BlitTrace += `Line ${y.toString().padStart(3, ' ')} Cycle ${x.toString().padStart(3, ' ')}: BLTSIZE = ${(BLTSIZH * 16).toString().padStart(4, ' ')}x${BLTSIZV.toString().padStart(4, ' ')}; ${channels} ${addresses.join(' ')}\n`;
				}
			}
			if(dmaRecord.evt & DmaEvents.BLITIRQ) {
				if(blits.length && blits[blits.length - 1].vposEnd === undefined) {
					blits[blits.length - 1].cycleEnd = i + 8; // why +8? if not, blitter is not finished
					blits[blits.length - 1].vposEnd = y; // TODO: auch irgendwie +8
					blits[blits.length - 1].hposEnd = x;
				}
				BlitTrace += `Line ${y.toString().padStart(3, ' ')} Cycle ${x.toString().padStart(3, ' ')}: BLITIRQ\n`;
			}
		}
	}
	return blits;
}

export function GetBlitCycles(dmaRecords: DmaRecord[]): number {
	const regBLTSIZE = CustomRegisters.getCustomAddress("BLTSIZE");
	const regBLTSIZH = CustomRegisters.getCustomAddress("BLTSIZH");

	let cycles = 0;
	let i = 0;
	let lastStart = -1;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			const reg = (dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) ? dmaRecord.reg : (dmaRecord.addr - 0xdff000);
			const isBlitStart = (reg === regBLTSIZE - 0xdff000) || (reg === regBLTSIZH - 0xdff000);
			if(isBlitStart) {
				lastStart = i;
			}
			if(dmaRecord.evt & DmaEvents.BLITIRQ) {
				if(lastStart !== -1) {
					cycles += i + 8 - lastStart;
					lastStart = -1;
				}
			}
		}
	}
	return cycles;
}

export function GetCopper(chipMem: Uint8Array, dmaRecords: DmaRecord[]): Copper[] {
	const insns: Copper[] = [];
	const regCOPINS = CustomRegisters.getCustomAddress("COPINS");

	let i = 0;
	let lastinsn: CopperInstruction = null;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.type === DmaTypes.COPPER && dmaRecord.extra === DmaSubTypes.COPPER && dmaRecord.reg === regCOPINS - 0xdff000) {
				const first  = (chipMem[dmaRecord.addr + 0] << 8) | chipMem[dmaRecord.addr + 1];
				const second = (chipMem[dmaRecord.addr + 2] << 8) | chipMem[dmaRecord.addr + 3];
				const insn = CopperInstruction.parse(first, second);
				// skip fake instruction after copper jump
				if(!(lastinsn && lastinsn.instructionType === CopperInstructionType.MOVE && (lastinsn as CopperMove).label.startsWith("COPJMP"))) {
					insns.push({
						cycle: i,
						vpos: y,
						hpos: x,
						address: dmaRecord.addr,
						insn
					});
				}
				lastinsn = insn;
			}
		}
	}

	return insns;
}

export interface IScreen {
	width: number;
	height: number;
	planes: number[];
	modulos: number[]; // always [2]
}

export function GetScreenFromCopper(copper: Copper[]): IScreen {
	let planes = [0, 0, 0, 0, 0];
	const modulos = [0, 0];

	let BPLCON0 = 0;
	let DDFSTRT = 0;
	let DDFSTOP = 0;
	let DIWSTRT = 0;
	let DIWSTOP = 0;

	const regBPLCON0 = CustomRegisters.getCustomAddress("BPLCON0");
	const regBPL1MOD = CustomRegisters.getCustomAddress("BPL1MOD");
	const regBPL2MOD = CustomRegisters.getCustomAddress("BPL2MOD");
	const regBPL1PTH = CustomRegisters.getCustomAddress("BPL1PTH");
	const regBPL1PTL = CustomRegisters.getCustomAddress("BPL1PTL");
	const regBPL2PTH = CustomRegisters.getCustomAddress("BPL2PTH");
	const regBPL2PTL = CustomRegisters.getCustomAddress("BPL2PTL");
	const regBPL3PTH = CustomRegisters.getCustomAddress("BPL3PTH");
	const regBPL3PTL = CustomRegisters.getCustomAddress("BPL3PTL");
	const regBPL4PTH = CustomRegisters.getCustomAddress("BPL4PTH");
	const regBPL4PTL = CustomRegisters.getCustomAddress("BPL4PTL");
	const regBPL5PTH = CustomRegisters.getCustomAddress("BPL5PTH");
	const regBPL5PTL = CustomRegisters.getCustomAddress("BPL5PTL");
	const regDDFSTRT = CustomRegisters.getCustomAddress("DDFSTRT");
	const regDDFSTOP = CustomRegisters.getCustomAddress("DDFSTOP");
	const regDIWSTRT = CustomRegisters.getCustomAddress("DIWSTRT");
	const regDIWSTOP = CustomRegisters.getCustomAddress("DIWSTOP");

	for(const c of copper) {
		if(c.insn instanceof CopperMove) {
			switch(c.insn.DA + 0xdff000) {
			case regBPLCON0: BPLCON0 = c.insn.RD; break;
			case regBPL1MOD: modulos[0] = c.insn.RD; break;
			case regBPL2MOD: modulos[1] = c.insn.RD; break;
			case regBPL1PTH: planes[0] = (planes[0] & 0x0000ffff) | (c.insn.RD << 16); break;
			case regBPL1PTL: planes[0] = (planes[0] & 0xffff0000) |  c.insn.RD; break;
			case regBPL2PTH: planes[1] = (planes[1] & 0x0000ffff) | (c.insn.RD << 16); break;
			case regBPL2PTL: planes[1] = (planes[1] & 0xffff0000) |  c.insn.RD; break;
			case regBPL3PTH: planes[2] = (planes[2] & 0x0000ffff) | (c.insn.RD << 16); break;
			case regBPL3PTL: planes[2] = (planes[2] & 0xffff0000) |  c.insn.RD; break;
			case regBPL4PTH: planes[3] = (planes[3] & 0x0000ffff) | (c.insn.RD << 16); break;
			case regBPL4PTL: planes[3] = (planes[3] & 0xffff0000) |  c.insn.RD; break;
			case regBPL5PTH: planes[4] = (planes[4] & 0x0000ffff) | (c.insn.RD << 16); break;
			case regBPL5PTL: planes[4] = (planes[4] & 0xffff0000) |  c.insn.RD; break;
			case regDDFSTRT: DDFSTRT = c.insn.RD; break;
			case regDDFSTOP: DDFSTOP = c.insn.RD; break;
			case regDIWSTRT: DIWSTRT = c.insn.RD; break;
			case regDIWSTOP: DIWSTOP = c.insn.RD; break;
			}
		}
	}

	const width = (((DDFSTOP - DDFSTRT) >>> 3) + 1) << 4;
	const height = ((DIWSTOP >>> 8) + 256 - (DIWSTRT >>> 8));

	planes = planes.slice(0, (BPLCON0 >>> 12) & 7);

	return { width, height, planes, modulos };
}

export function GetScreenFromBlit(blit: Blit): IScreen {
	const numPlanes = 5;
	const channel = BlitterChannel.D; // visualize D channel
	const width = blit.BLTSIZH * 16;
	const height = blit.BLTSIZV / numPlanes;
	const planes = [];
	const modulos = [];

	for(let p = 0; p < numPlanes; p++)
		planes.push(blit.BLTxPT[channel] + p * (blit.BLTSIZH * 2 + blit.BLTxMOD[channel]));

	const modulo = blit.BLTxMOD[channel] + (numPlanes - 1) * (blit.BLTSIZH * 2 + blit.BLTxMOD[channel]);
	modulos.push(modulo, modulo);

	return { width, height, planes, modulos };
}

// returs chipMem after DMA requests up to endCycle
// currently only CPU and blitter writes implemented
export function GetMemoryAfterDma(memory: Memory, dmaRecords: DmaRecord[], endCycle: number): Memory {
	const memoryAfter = new Memory(new Uint8Array(memory.chipMem), new Uint8Array(memory.bogoMem));

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS && i < endCycle; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS && i < endCycle; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.addr === undefined)
				continue;

			if((dmaRecord.reg & 0x1100) === 0x1100) { // CPU write
				switch(dmaRecord.reg & 0xff) {
				case 1: memoryAfter.writeByte(dmaRecord.addr, dmaRecord.dat); break;
				case 2: memoryAfter.writeWord(dmaRecord.addr, dmaRecord.dat); break;
				case 4: memoryAfter.writeLong(dmaRecord.addr, dmaRecord.dat); break;
				}
			} else if(dmaRecord.reg === 0) { // Blitter write
				memoryAfter.writeWord(dmaRecord.addr, dmaRecord.dat);
			}
		}
	}

	return memoryAfter;
}

// returs custom registers after DMA requests up to endCycle
export function GetCustomRegsAfterDma(customRegs: number[], dmacon: number, dmaRecords: DmaRecord[], endCycle: number): number[] {
	const regDMACON = CustomRegisters.getCustomAddress("DMACON") - 0xdff000;

	const customRegsAfter = customRegs.slice(); // initial copy
	customRegsAfter[regDMACON >>> 1] = dmacon;

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS && i <= endCycle; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS && i <= endCycle; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.reg === undefined)
				continue;

			if(dmaRecord.reg === regDMACON) {
				if (dmaRecord.dat & 0x8000)
					customRegsAfter[regDMACON >>> 1] |= dmaRecord.dat & 0x7FFF;
				else
					customRegsAfter[regDMACON >>> 1] &= ~dmaRecord.dat;
			} else if(CustomRegisters.getCustomReadWrite(0xdff000 + dmaRecord.reg) & CustomReadWrite.write)
				customRegsAfter[dmaRecord.reg >>> 1] = dmaRecord.dat;
		}
	}

	return customRegsAfter;
}

export function GetPrevCustomRegWriteTime(index: number, cycle: number, dmaRecords: DmaRecord[]): number | undefined {
	let i = 0;
	let prevCycle: number | undefined;

	for(let y = 0; y < NR_DMA_REC_VPOS && i < cycle; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS && i < cycle; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.reg === (index << 1))
				prevCycle = i;
		}
	}
	return prevCycle;
}

export function GetNextCustomRegWriteTime(index: number, cycle: number, dmaRecords: DmaRecord[]): number | undefined {
	let i = 0;

	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(i > cycle && dmaRecord.reg === (index << 1))
				return i;
		}
	}
	return undefined;
}

function GetAmigaColor(color: number): number {
	return (((((color >>> 8) & 0xf) << 4) | ((color >>> 8) & 0xf)) << 0) |
		(((((color >>> 4) & 0xf) << 4) | ((color >>> 4) & 0xf)) << 8) |
		(((((color >>> 0) & 0xf) << 4) | ((color >>> 0) & 0xf)) << 16) |
		0xff000000;
}

// returns 32-element array of 3-element array (R, G, B) (0x00-0xff)
export function GetPaletteFromCustomRegs(customRegs: Uint16Array): number[] {
	const customReg = (reg: number) => customRegs[(reg - 0xdff000) >>> 1];
	const regCOLOR = CustomRegisters.getCustomAddress("COLOR00");
	const palette = [];
	for(let i = 0; i < 32; i++) {
		const color = customReg(regCOLOR + i * 2);
		palette.push(GetAmigaColor(color));
	}
	return palette;
}

export function GetPaletteFromMemory(memory: Memory, addr: number, numEntries: number): number[] {
	const palette = [];
	for(let i = 0; i < 32; i++) {
		if(i < numEntries) {
			const color = memory.readWord(addr + i * 2);
			palette.push(GetAmigaColor(color));
		} else {
			palette.push([0, 0, 0]);
		}
	}
	return palette;
}

export function GetPaletteFromCopper(copper: Copper[]): number[] {
	const regCOLOR00 = CustomRegisters.getCustomAddress("COLOR00") - 0xdff000;
	const palette = new Array(32).fill([]);
	for(const c of copper) {
		if(c.insn instanceof CopperMove && c.insn.DA >= regCOLOR00 && c.insn.DA < regCOLOR00 + 32 * 2) {
			const idx = (c.insn.DA - regCOLOR00) >>> 1;
			if(palette[idx].length === 0) // don't overwrite color
				palette[idx] = GetAmigaColor(c.insn.RD);
		}
	}
	return palette;
}

export function SymbolizeAddress(address: number, amiga: IAmigaProfileExtra) {
	const addressString = `\$${address.toString(16).padStart(8, '0')}`;

	if(address !== 0) {
		if(address >= amiga.systemStackLower && address < amiga.systemStackUpper)
			return `SYSSTACK-\$${(amiga.systemStackUpper - address).toString(16)} (${addressString})`;
		if(address >= amiga.stackLower && address < amiga.stackUpper)
			return `STACK-\$${(amiga.stackUpper - address).toString(16)} (${addressString})`;

		const resource = amiga.gfxResources.find((r) => address >= r.address && address < r.address + r.size);
		if(resource)
			return `${resource.name}+\$${(address - resource.address).toString(16)} (${addressString})`;

		const section = amiga.sections.find((r) => address >= r.address && address < r.address + r.size);
		if(section) {
			if(section.name === '.text') {
				const offset = address - section.address;
				const callFrame = amiga.uniqueCallFrames[amiga.callFrames[offset >> 1]];
				return `${callFrame.frames.map((fr) => fr.func).join(">")} (${section.name}+\$${offset.toString(16)}) (${addressString})`;
			}
			const symbol = amiga.symbols.find((r) => address >= r.address + r.base && address < r.address + r.base + r.size);
			if(symbol)
				return `${symbol.name}+\$${(address - symbol.address - symbol.base).toString(16)} (${section.name}+\$${symbol.address.toString(16)}) (${addressString})`;
			return `${section.name}+\$${(address - section.address).toString(16)} (${addressString})`;
		}

		const customReg = CustomRegisters.getCustomName(address);
		if(customReg)
			return `${customReg} (${addressString})`;
	}

	return addressString;
}
