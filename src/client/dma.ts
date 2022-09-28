import { DmaRecord } from "../backend/profile_types";
import { Custom, CustomReadWrite, DMACONFlags, FMODEFlags, BPLCON0Flags } from './custom';
import { CopperInstruction, CopperMove, CopperInstructionType } from "./copperDisassembler";
import { IAmigaProfileBase, IAmigaProfileExtra, ICpuProfileRaw } from "./types";

declare let PROFILES: ICpuProfileRaw[];

// COERCE: make signed
const COERCE16 = (x: number) => (x ^ 0x8000) - 0x8000;

export const CpuCyclesToDmaCycles = (cpuCycles: number) => (cpuCycles * PROFILES[0].$base.cpuCycleUnit / 512) | 0;

export const DmaCyclesToCpuCycles = (dmaCycles: number) => (dmaCycles * 512 / PROFILES[0].$base.cpuCycleUnit) | 0;

export class Memory {
	public chipMemAddr = 0x00000000;
	public bogoMemAddr = 0x00c00000;

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
	subtypes: Map<number, DmaSubtype>;
}

export const NR_DMA_REC_HPOS = 227;
export const NR_DMA_REC_VPOS = 313;

// measured in resource viewer
export const displayLeft = 92;
export const displayTop = 28;
export const displayWidth = NR_DMA_REC_HPOS * 4 - displayLeft * 2;
export const displayHeight = NR_DMA_REC_VPOS - 1 - displayTop;

// WinUAE: include/debug.h
export namespace DmaEvents {
	export const BLITIRQ = 1;
	export const BLIFINALD = 2;
	export const BLITSTARTFINISH = 4;
	export const BPLFETCHUPDATE = 8;
	export const COPPERWAKE = 16;
	export const CPUIRQ = 32;
	export const INTREQ = 64;
	export const COPPERWANTED = 128;
	export const NOONEGETS = 256;
	export const CPUBLITTERSTEAL = 512;
	export const CPUBLITTERSTOLEN = 1024;
	export const COPPERSKIP = 2048;
	export const DDFSTRT = 4096;
	export const DDFSTOP = 8192;
	export const DDFSTOP2 = 16384;
	export const SPECIAL = 32768;
	export const VB = 0x10000;
	export const VS = 0x20000;
	export const LOF = 0x40000;
	export const LOL = 0x80000;
	export const HBS = 0x100000;
	export const HBE = 0x200000;
	export const HDIWS = 0x400000;
	export const HDIWE = 0x800000;
	export const VDIW = 0x1000000;
	export const HSS = 0x2000000;
	export const HSE = 0x4000000;
	export const DMA_EVENT_CIAA_IRQ	= 0x08000000;
	export const DMA_EVENT_CIAB_IRQ	= 0x10000000;
	export const DMA_EVENT_CPUSTOP = 0x20000000;
	export const DMA_EVENT_CPUSTOPIPL = 0x40000000;
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
	export const DMARECORD_CONFLICT = 9;
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

export const dmaTypes: Map<number, DmaType> = new Map([
	[0, {
		name: "-",
		subtypes: new Map([ 
			[0, { color: 0xff222222 }] 
		])
	}],
	[DmaTypes.REFRESH, {
		name: 'Refresh',
		subtypes: new Map([ 
			[0, { color: 0xff444444 }] 
		])
	}],
	[DmaTypes.CPU, {
		name: 'CPU',
		subtypes: new Map([
			[DmaSubTypes.CPU_CODE, { color: 0xff4253a2, name: 'Code' }],
			[DmaSubTypes.CPU_DATA, { color: 0xffd698ad, name: 'Data' }]
		])
	}],
	[DmaTypes.COPPER, {
		name: 'Copper',
		subtypes: new Map([
			[DmaSubTypes.COPPER, { color: 0xff00eeee }],
			[DmaSubTypes.COPPER_WAIT, { color: 0xff22aaaa, name: 'Wait' }],
			[DmaSubTypes.COPPER_SPECIAL, { color: 0xff446666, name: 'Special' }]
		])
	}],
	[DmaTypes.AUDIO, {
		name: 'Audio',
		subtypes: new Map([
			[0, { color: 0xff0000ff, name: 'Channel 0' }],
			[1, { color: 0xff0000ee, name: 'Channel 1' }],
			[2, { color: 0xff0000dd, name: 'Channel 2' }],
			[3, { color: 0xff0000cc, name: 'Channel 3' }],
		])
	}],
	[DmaTypes.BLITTER, {
		name: 'Blitter',
		subtypes: new Map([
			[0x00, { color: 0xff888800, name: 'A-Blit' }],
			[0x01, { color: 0xee888800, name: 'B-Blit' }],
			[0x02, { color: 0xdd888800, name: 'C-Blit' }],
			[0x03, { color: 0xcc888800, name: 'D-Blit' }],
			[0x10, { color: 0xffff8800, name: 'A-Fill' }],
			[0x11, { color: 0xeeff8800, name: 'B-Fill' }],
			[0x12, { color: 0xddff8800, name: 'C-Fill' }],
			[0x13, { color: 0xccff8800, name: 'D-Fill' }],
			[0x20, { color: 0xff00ff00, name: 'A-Line' }],
			[0x21, { color: 0xee00ff00, name: 'B-Line' }],
			[0x22, { color: 0xdd00ff00, name: 'C-Line' }],
			[0x23, { color: 0xcc00ff00, name: 'D-Line' }],
		])
	}],
	[DmaTypes.BITPLANE, {
		name: 'Bitplane',
		subtypes: new Map([
			[0, { color: 0xffff0000, name: 'Plane 1' }],
			[1, { color: 0xffee0000, name: 'Plane 2' }],
			[2, { color: 0xffdd0000, name: 'Plane 3' }],
			[3, { color: 0xffcc0000, name: 'Plane 4' }],
			[4, { color: 0xffbb0000, name: 'Plane 5' }],
			[5, { color: 0xffaa0000, name: 'Plane 6' }],
			[6, { color: 0xff990000, name: 'Plane 7' }],
			[7, { color: 0xff880000, name: 'Plane 8' }],
		])
	}],
	[DmaTypes.SPRITE, {
		name: 'Sprite',
		subtypes: new Map([
			[0, { color: 0xffff00ff, name: 'Sprite 0' }],
			[1, { color: 0xffee00ee, name: 'Sprite 1' }],
			[2, { color: 0xffdd00dd, name: 'Sprite 2' }],
			[3, { color: 0xffcc00cc, name: 'Sprite 3' }],
			[4, { color: 0xffbb00bb, name: 'Sprite 4' }],
			[5, { color: 0xffaa00aa, name: 'Sprite 5' }],
			[6, { color: 0xff990099, name: 'Sprite 6' }],
			[7, { color: 0xff880088, name: 'Sprite 7' }],
		])
	}],
	[DmaTypes.DISK, {
		name: 'Disk',
		subtypes: new Map([
			[0, { color: 0xffffffff }]
		])
	}],
]);

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
	BLTxDAT: number[]; // A-D
	BLTxMOD: number[]; // A-D
}

export interface Copper {
	cycle: number;
	vpos: number;
	hpos: number;
	address: number;
	insn: CopperInstruction;
}

export enum ChipsetFlags {
	OCS = 0,
	ECSAgnus = 1,
	ECSDenise = 2,
	AGA = 4
}

// blits are sorted
export function GetBlits(customRegs: Uint16Array, dmaRecords: DmaRecord[]): Blit[] {
	const customReg = (reg: number) => customRegs[reg >>> 1];
	const customRegL = (reg: number) => (customRegs[reg >>> 1] << 16) | customRegs[(reg + 2) >>> 1];
	const regBLTxPT = [
		Custom.ByName("BLTAPTH").adr - 0xdff000,
		Custom.ByName("BLTBPTH").adr - 0xdff000,
		Custom.ByName("BLTCPTH").adr - 0xdff000,
		Custom.ByName("BLTDPTH").adr - 0xdff000
	];
	const regBLTxDAT = [
		Custom.ByName("BLTADAT").adr - 0xdff000,
		Custom.ByName("BLTBDAT").adr - 0xdff000,
		Custom.ByName("BLTCDAT").adr - 0xdff000,
		Custom.ByName("BLTDDAT").adr - 0xdff000
	];
	const regBLTxMOD = [
		Custom.ByName("BLTAMOD").adr - 0xdff000,
		Custom.ByName("BLTBMOD").adr - 0xdff000,
		Custom.ByName("BLTCMOD").adr - 0xdff000,
		Custom.ByName("BLTDMOD").adr - 0xdff000
	];
	const regBLTCON0 = Custom.ByName("BLTCON0").adr - 0xdff000;
	const regBLTCON1 = Custom.ByName("BLTCON1").adr - 0xdff000;
	const regBLTAFWM = Custom.ByName("BLTAFWM").adr - 0xdff000;
	const regBLTALWM = Custom.ByName("BLTALWM").adr - 0xdff000;
	const regBLTSIZE = Custom.ByName("BLTSIZE").adr - 0xdff000;
	const regBLTSIZV = Custom.ByName("BLTSIZV").adr - 0xdff000;
	const regBLTSIZH = Custom.ByName("BLTSIZH").adr - 0xdff000;
	let BlitTrace = "";

	const blits: Blit[] = [];

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if((dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) || (dmaRecord.addr !== undefined && dmaRecord.addr >= 0xdff000 && dmaRecord.addr < 0xdff200)) {
				const reg = (dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) ? dmaRecord.reg : (dmaRecord.addr - 0xdff000);
				customRegs[reg >>> 1] = dmaRecord.dat;
				const isBlitStart = (reg === regBLTSIZE) || (reg === regBLTSIZH);
				if(isBlitStart) {
					let BLTSIZH = 0;
					let BLTSIZV = 0;
					if(reg === regBLTSIZE) { // OCS
						BLTSIZH = dmaRecord.dat & 0x3f;
						BLTSIZV = (dmaRecord.dat >>> 6) & 0x3ff;
						if(BLTSIZH === 0)
							BLTSIZH = 64;
						if(BLTSIZV === 0)
							BLTSIZV = 1024;
					}
					if(reg === regBLTSIZH) { // ECS
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
					const BLTxDAT = [];
					const BLTxMOD = [];
					let channels = '';
					const addresses: string[] = [];
					for(let channel = 0; channel < 4; channel++) {
						const adr = customRegL(regBLTxPT[channel]) & 0x1ffffe; // ECS=0x1ffffe, OCS=0x7fffe;
						BLTxPT.push(adr);
						BLTxDAT.push(customReg(regBLTxDAT[channel]));
						BLTxMOD.push(COERCE16(customReg(regBLTxMOD[channel])));
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
						BLTxDAT,
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

	//console.log(BlitTrace);

	return blits;
}

export function GetBlitCycles(dmaRecords: DmaRecord[]): number {
	const regBLTSIZE = Custom.ByName("BLTSIZE").adr - 0xdff000;
	const regBLTSIZH = Custom.ByName("BLTSIZH").adr - 0xdff000;

	let cycles = 0;
	let i = 0;
	let lastStart = -1;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			const reg = (dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) ? dmaRecord.reg : (dmaRecord.addr - 0xdff000);
			const isBlitStart = reg === regBLTSIZE || reg === regBLTSIZH;
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
	const regCOPINS = Custom.ByName("COPINS").adr - 0xdff000;

	let i = 0;
	let lastinsn: CopperInstruction = null;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.type === DmaTypes.COPPER && dmaRecord.extra === DmaSubTypes.COPPER && dmaRecord.reg === regCOPINS) {
				const first = (chipMem[dmaRecord.addr + 0] << 8) | chipMem[dmaRecord.addr + 1];
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

export enum ScreenType {
	normal,
	copper,
	sprite,
}

export interface IScreen {
	type: ScreenType;
	width: number;
	height: number;
	planes: number[];
	modulos: number[]; // always [2]
	hires: boolean;
	ham: boolean;
}

export function GetScreenFromCopper(copper: Copper[], chipsetFlags: number): IScreen {
	let planes = [0, 0, 0, 0, 0, 0, 0, 0];
	const modulos = [0, 0];

	let BPLCON0 = 0;
	let DDFSTRT = 0;
	let DDFSTOP = 0;
	let DIWSTRT = 0;
	let DIWSTOP = 0;
	let DIWHIGH = 0;
	let useDIWHIGH = false;
	let FMODE = 0;

	const regBPLCON0 = Custom.ByName("BPLCON0").adr;
	const regBPL1MOD = Custom.ByName("BPL1MOD").adr;
	const regBPL2MOD = Custom.ByName("BPL2MOD").adr;
	const regBPL1PTH = Custom.ByName("BPL1PTH").adr;
	const regBPL1PTL = Custom.ByName("BPL1PTL").adr;
	const regBPL2PTH = Custom.ByName("BPL2PTH").adr;
	const regBPL2PTL = Custom.ByName("BPL2PTL").adr;
	const regBPL3PTH = Custom.ByName("BPL3PTH").adr;
	const regBPL3PTL = Custom.ByName("BPL3PTL").adr;
	const regBPL4PTH = Custom.ByName("BPL4PTH").adr;
	const regBPL4PTL = Custom.ByName("BPL4PTL").adr;
	const regBPL5PTH = Custom.ByName("BPL5PTH").adr;
	const regBPL5PTL = Custom.ByName("BPL5PTL").adr;
	const regBPL6PTH = Custom.ByName("BPL6PTH").adr;
	const regBPL6PTL = Custom.ByName("BPL6PTL").adr;
	const regBPL7PTH = Custom.ByName("BPL7PTH").adr;
	const regBPL7PTL = Custom.ByName("BPL7PTL").adr;
	const regBPL8PTH = Custom.ByName("BPL8PTH").adr;
	const regBPL8PTL = Custom.ByName("BPL8PTL").adr;
	const regDDFSTRT = Custom.ByName("DDFSTRT").adr;
	const regDDFSTOP = Custom.ByName("DDFSTOP").adr;
	const regDIWSTRT = Custom.ByName("DIWSTRT").adr;
	const regDIWSTOP = Custom.ByName("DIWSTOP").adr;
	const regDIWHIGH = Custom.ByName("DIWHIGH").adr; // ECS
	const regFMODE   = Custom.ByName("FMODE").adr; // ECS

	for(const c of copper) {
		if(c.vpos >= 200) // ignore bottom-of-screen HUD
			continue;
		if(c.insn instanceof CopperMove) {
			switch(c.insn.DA + 0xdff000) {
				case regBPLCON0: if((c.insn.RD >>> 12) & 7) BPLCON0 = c.insn.RD; break; // ignore switching off all planes
				case regBPL1MOD: modulos[0] = COERCE16(c.insn.RD); break;
				case regBPL2MOD: modulos[1] = COERCE16(c.insn.RD); break;
				case regBPL1PTH: planes[0] = (planes[0] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL1PTL: planes[0] = (planes[0] & 0xffff0000) | c.insn.RD; break;
				case regBPL2PTH: planes[1] = (planes[1] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL2PTL: planes[1] = (planes[1] & 0xffff0000) | c.insn.RD; break;
				case regBPL3PTH: planes[2] = (planes[2] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL3PTL: planes[2] = (planes[2] & 0xffff0000) | c.insn.RD; break;
				case regBPL4PTH: planes[3] = (planes[3] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL4PTL: planes[3] = (planes[3] & 0xffff0000) | c.insn.RD; break;
				case regBPL5PTH: planes[4] = (planes[4] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL5PTL: planes[4] = (planes[4] & 0xffff0000) | c.insn.RD; break;
				case regBPL6PTH: planes[5] = (planes[5] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL6PTL: planes[5] = (planes[5] & 0xffff0000) | c.insn.RD; break;
				case regBPL7PTH: planes[6] = (planes[6] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL7PTL: planes[6] = (planes[6] & 0xffff0000) | c.insn.RD; break;
				case regBPL8PTH: planes[7] = (planes[7] & 0x0000ffff) | (c.insn.RD << 16); break;
				case regBPL8PTL: planes[7] = (planes[7] & 0xffff0000) | c.insn.RD; break;
				case regDDFSTRT: DDFSTRT = c.insn.RD; break;
				case regDDFSTOP: DDFSTOP = c.insn.RD; break;
				case regDIWSTRT: DIWSTRT = c.insn.RD; break;
				case regDIWSTOP: DIWSTOP = c.insn.RD; break;
				case regDIWHIGH: DIWHIGH = c.insn.RD; useDIWHIGH = true; break;
				case regFMODE: FMODE = c.insn.RD; break;
			}
		}
	}

	// workbench 1.3 (A500)
	//	DDF: 3c d0 DDF: 581 40c1
	//	   fetchWidth: 640 displayWidth: 640
	//	   modulos: 0  0
	//	=> modulos: 0  0

	// workbench 2.0 (A500+, interlace)
	// 	DDF: 38 d8 DDF: 2c81 2cc1
	//    fetchWidth: 672 displayWidth: 640
	//    modulos: 76  76
	// => modulos: 78  78
	// 44,63: 2cc6e
	// 45,61: 2cd0e +160

	// workbench 2.0 (690 px overscan)
	// 	DDF: 30 d8 DDF: 2c6e 2cc7
	//    fetchWidth: 704 displayWidth: 690
	//    modulos: 88  88
	// => modulos: 88  88	

	let displayStart = (DIWSTRT & 0xff) << 2;
	let displayStop = ((DIWSTOP & 0xff) + 256) << 2;
	if(useDIWHIGH) {
		displayStart |= (DIWHIGH >> 3) & 0b11;
		displayStart |= (DIWHIGH & 0b111) << 8;
		displayStop |= (DIWHIGH >> 11) & 0b11;
		displayStop &= ~(1 << 10);
		displayStop |= (DIWHIGH >> 13) << 10;
	}

	const hires = (BPLCON0 & BPLCON0Flags.HIRES) ? true : false;
	const ham = (BPLCON0 & BPLCON0Flags.HAM) ? true : false;
	//let fetchWidth = hires ? ((((DDFSTOP - DDFSTRT) >>> 2) + 2) << 4) : ((((DDFSTOP - DDFSTRT) >>> 3) + 1) << 4); // hires/lores
	//if(hires)

	// https://eab.abime.net/showpost.php?p=1556113&postcount=14

	// validate bits
	const res = hires ? 1 : 0;
	FMODE &= FMODEFlags.BPL32 | FMODEFlags.BPAGEM;
	DDFSTRT &= chipsetFlags ? 0xfe : 0xfc;
	DDFSTOP &= chipsetFlags ? 0xfe : 0xfc;

	// fetch=log2(fetch_width)-4; fetch_width=16,32,64
	const fetch = (chipsetFlags & ChipsetFlags.AGA) ? ((FMODE <= 1) ? FMODE : FMODE - 1) : 0;
	// sub-block (OCS/ECS) and large-block (AGA) stop pad
	const pad = (fetch > res) ? (8 << (fetch - res)) - 1 : 8 - 1;
	// OCS/ECS/(AGA) sub-block
	const sub = (res > fetch) ? res - fetch : 0;
	// AGA large-block
	const large = (fetch > res) ? fetch - res : 0;
	// DMA fetched blocks
	const blocks = ((DDFSTOP - DDFSTRT + pad) >> (3 + large)) + 1;
	// 16 pixels per fetch_width per sub-block per block
	const fetchWidth = blocks << (4 + fetch + sub);

	//const fetchWidth = (((DDFSTOP & 0xfc) - (DDFSTRT & 0xfc) + 0xc) & 0xf8) << (hires ? 2 : 1);
	let displayWidth = displayStop - displayStart;
	// no support for superhires
	if(hires)
		displayWidth >>>= 1;
	else
		displayWidth >>>= 2;
	const displayHeight = ((DIWSTOP >>> 8) + 256 - (DIWSTRT >>> 8));
	console.log(`DDF: ${DDFSTRT.toString(16)} ${DDFSTOP.toString(16)} DIW: ${DIWSTRT.toString(16)} ${DIWSTOP.toString(16)} ${DIWHIGH.toString(16)}`);
	console.log(`   fetchWidth: ${fetchWidth} displayStart: ${displayStart} displayStop: ${displayStop} displayWidth: ${displayWidth}`);
	console.log(`   modulos: ${modulos[0]}  ${modulos[1]}`);

	planes = planes.slice(0, (BPLCON0 >>> 12) & 7);

	return { type: ScreenType.copper, width: fetchWidth, height: displayHeight, planes, modulos, hires, ham };
}

export function GetScreenFromBlit(blit: Blit, amiga: IAmigaProfileExtra): IScreen {
	const channel = BlitterChannel.D; // visualize D channel

	// try to get number of planes from registered bitmap resource
	let numPlanes = 5; // default
	const resource = amiga.gfxResources.find((r) => blit.BLTxPT[channel] >= r.address && blit.BLTxPT[channel] < r.address + r.size);
	if(resource && resource.bitmap)
		numPlanes = resource.bitmap.numPlanes;

	const width = blit.BLTSIZH * 16;
	const height = blit.BLTSIZV / numPlanes;
	const planes = [];
	const modulos = [];

	for(let p = 0; p < numPlanes; p++)
		planes.push(blit.BLTxPT[channel] + p * (blit.BLTSIZH * 2 + blit.BLTxMOD[channel]));

	const modulo = blit.BLTxMOD[channel] + (numPlanes - 1) * (blit.BLTSIZH * 2 + blit.BLTxMOD[channel]);
	modulos.push(modulo, modulo);

	return { type: ScreenType.normal, width, height, planes, modulos, hires: false, ham: false };
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
export function GetCustomRegsAfterDma(customRegs: number[], dmaRecords: DmaRecord[], endCycle: number): number[] {
	const regDMACON  = Custom.ByName("DMACON") .adr - 0xdff000;
	const regCOPJMP1 = Custom.ByName("COPJMP1").adr  - 0xdff000;
	const regCOPJMP2 = Custom.ByName("COPJMP2").adr  - 0xdff000;
	const customRegsAfter = customRegs.slice(); // initial copy

	let i = 0;
	let ignoreCopper = 0;

	for(let y = 0; y < NR_DMA_REC_VPOS && i <= endCycle; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS && i <= endCycle; x++, i++) {
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.reg === undefined)
				continue;

			// fix fake instructions after copper jump
			if(dmaRecord.type === DmaTypes.COPPER && dmaRecord.extra === DmaSubTypes.COPPER) {
				if(ignoreCopper > 0) {
					ignoreCopper--;
					continue;
				}
				if(dmaRecord.reg === regCOPJMP1 || dmaRecord.reg === regCOPJMP2)
					ignoreCopper = 2;
			}

			if(dmaRecord.reg === regDMACON) {
				if(dmaRecord.dat & DMACONFlags.SETCLR)
					customRegsAfter[regDMACON >>> 1] |= dmaRecord.dat & 0x7FFF;
				else
					customRegsAfter[regDMACON >>> 1] &= ~dmaRecord.dat;
			} else if(Custom.ByOffs(dmaRecord.reg)?.rw & CustomReadWrite.write)
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

// AABBGGRR
export const GetAmigaColor = (color: number): number => 
	((((((color >>> 8) & 0xf) << 4) | ((color >>> 8) & 0xf)) << 0) | // RR
	 (((((color >>> 4) & 0xf) << 4) | ((color >>> 4) & 0xf)) << 8) | // GG
	 (((((color >>> 0) & 0xf) << 4) | ((color >>> 0) & 0xf)) << 16) | // BB
	 0xff000000) >>> 0; // AA;

// AABBGGRR <-> AARRGGBB
const ColorSwap = (color: number): number => (((color >>> 16) & 0xff) | (((color >>> 0) & 0xff) << 16) | (color & 0xff00ff00)) >>> 0;

// AABBGGRR
export const GetColorCss = (color: number): string => '#' + (ColorSwap(color) & 0xffffff).toString(16).padStart(6, '0');
export const GetRgbaColorCss = (color: number): string => `rgba(${color & 0xff}, ${(color >>> 8) & 0xff}, ${(color >>> 16) & 0xff}, ${((color >>> 24) & 0xff) / 255})`;

// 0RGB
export const GetAmigaColorCss = (color: number): string => '#' + (ColorSwap(GetAmigaColor(color)) & 0xffffff).toString(16).padStart(6, '0');

export const GetAmigaColorEhb = (color: number): number => GetAmigaColor((color & 0xeee) >>> 1);

// returns 64-element array of 32-bit ABGR colors (0x00-0xff)
export function GetPaletteFromCustomRegs(customRegs: Uint16Array): number[] {
	const customReg = (reg: number) => customRegs[(reg - 0xdff000) >>> 1];
	const regCOLOR = Custom.ByName("COLOR00").adr;
	const palette: number[] = [], ehbPalette: number[] = [];
	for(let i = 0; i < 32; i++) {
		const color = customReg(regCOLOR + i * 2);
		palette.push(GetAmigaColor(color));
		ehbPalette.push(GetAmigaColorEhb(color));
	}
	return [...palette, ...ehbPalette];
}

export function GetPaletteFromMemory(memory: Memory, addr: number, numEntries: number): number[] {
	const palette: number[] = [], ehbPalette: number[] = [];
	for(let i = 0; i < 32; i++) {
		if(i < numEntries) {
			const color = memory.readWord(addr + i * 2);
			palette.push(GetAmigaColor(color));
			ehbPalette.push(GetAmigaColorEhb(color));
		} else {
			palette.push(0);
			ehbPalette.push(0);
		}
	}
	return [...palette, ...ehbPalette];
}

export function GetPaletteFromCopper(copper: Copper[]): number[] {
	const regCOLOR00 = Custom.ByName("COLOR00").adr - 0xdff000;
	const palette = new Array<number>(64).fill(0);
	for(const c of copper) {
		if(c.insn instanceof CopperMove && c.insn.DA >= regCOLOR00 && c.insn.DA < regCOLOR00 + 32 * 2) {
			const idx = (c.insn.DA - regCOLOR00) >>> 1;
			if(palette[idx] === 0) { // don't overwrite color
				palette[idx] = GetAmigaColor(c.insn.RD);
				palette[idx + 32] = GetAmigaColorEhb(c.insn.RD);
			}
		}
	}
	return palette;
}

export function SymbolizeAddress(address: number, amiga: IAmigaProfileExtra, base: IAmigaProfileBase) {
	const addressString = `$${address.toString(16).padStart(8, '0')}`;

	if(address !== 0) {
		if(address >= base.systemStackLower && address < base.systemStackUpper)
			return `SYSSTACK-$${(base.systemStackUpper - address).toString(16)} (${addressString})`;
		if(address >= base.stackLower && address < base.stackUpper)
			return `STACK-$${(base.stackUpper - address).toString(16)} (${addressString})`;

		const resource = amiga.gfxResources.find((r) => address >= r.address && address < r.address + r.size);
		if(resource)
			return `${resource.name}+$${(address - resource.address).toString(16)} (${addressString})`;

		const section = base.sections.find((r) => address >= r.address && address < r.address + r.size);
		if(section) {
			if(section.name === '.text') {
				const offset = address - section.address;
				const callFrame = amiga.uniqueCallFrames[amiga.callFrames[offset >> 1]];
				return `${callFrame.frames.map((fr) => fr.func).join(">")} (${section.name}+$${offset.toString(16)}) (${addressString})`;
			}
			const symbol = base.symbols.find((r) => address >= r.address + r.base && address < r.address + r.base + r.size);
			if(symbol)
				return `${symbol.name}+$${(address - symbol.address - symbol.base).toString(16)} (${section.name}+$${symbol.address.toString(16)}) (${addressString})`;
			return `${section.name}+$${(address - section.address).toString(16)} (${addressString})`;
		}

		const customReg = Custom.ByAddr(address);
		if(customReg)
			return `${customReg.name} (${addressString})`;
	}

	return addressString;
}
