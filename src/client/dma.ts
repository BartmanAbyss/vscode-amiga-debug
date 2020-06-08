import { DmaRecord } from "../backend/profile";
import { CustomRegisters } from './customRegisters';
import { CopperInstruction } from "./copperDisassembler";

export interface DmaSubtype {
	color: number; 	// 0xAABBGGRR
	name?: string;
}
export interface DmaType {
	name: string;
	subtypes: DmaSubtype[];
}

export const NR_DMA_REC_HPOS = 228;
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
		subtypes: [ { color: 0xff0000ff } ]
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
		subtypes: [ { color: 0xffff0000 } ]
	},
	{ // DMARECORD_SPRITE 7
		name: 'Sprite',
		subtypes: [ { color: 0xffff00ff } ]
	},
	{ // DMARECORD_DISK 8
		name: 'Disk',
		subtypes: [ { color: 0xffffffff } ]
	},
];

export interface Blit {
	cycleStart: number;
	vposStart: number;
	hposStart: number;
	cycleEnd?: number;
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
		for(let x = 0; x < NR_DMA_REC_HPOS - ((y % 2) ? 1 : 0); x++, i++) { // long and short lines alternate
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) {
				customRegs[dmaRecord.reg >>> 1] = dmaRecord.dat;
				const isBlitStart = (dmaRecord.reg === regBLTSIZE - 0xdff000) || (dmaRecord.reg === regBLTSIZH - 0xdff000);
				if(isBlitStart) {
					let BLTSIZH = 0;
					let BLTSIZV = 0;
					if(dmaRecord.reg === regBLTSIZE - 0xdff000) { // OCS
						BLTSIZH = dmaRecord.dat & 0x3f;
						BLTSIZV = dmaRecord.dat >>> 6;
					}
					if(dmaRecord.reg === regBLTSIZH - 0xdff000) { // ECS
						BLTSIZH = dmaRecord.dat & 0x7ff;
						BLTSIZV = customReg(regBLTSIZV) & 0x7fff;
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

export function GetCopper(chipMem: Uint8Array, dmaRecords: DmaRecord[]): Copper[] {
	const insns: Copper[] = [];
	const regCOPINS = CustomRegisters.getCustomAddress("COPINS");

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS - ((y % 2) ? 1 : 0); x++, i++) { // long and short lines alternate
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.type === DmaTypes.COPPER && dmaRecord.extra === DmaSubTypes.COPPER && dmaRecord.reg === regCOPINS - 0xdff000) {
				const first  = (chipMem[dmaRecord.addr + 0] << 8) | chipMem[dmaRecord.addr + 1];
				const second = (chipMem[dmaRecord.addr + 2] << 8) | chipMem[dmaRecord.addr + 3];
				const insn = CopperInstruction.parse(first, second);
				insns.push({
					cycle: i,
					vpos: y,
					hpos: x,
					address: dmaRecord.addr,
					insn
				});
			}
		}
	}

	return insns;
}

// returs chipMem after DMA requests up to endCycle
// currently only CPU and blitter writes implemented
export function GetChipMemAfterDma(chipMem: Uint8Array, dmaRecords: DmaRecord[], endCycle: number): Uint8Array {
	const chipMemAfter = new Uint8Array(chipMem);

	const writeByte = (addr: number, dat: number) => {
		chipMemAfter[addr + 0] = dat;
	};
	const writeWord = (addr: number, dat: number) => {
		chipMemAfter[addr + 0] = (dat >>> 8) & 0xff;
		chipMemAfter[addr + 1] = dat & 0xff;
	};
	const writeLong = (addr: number, dat: number) => {
		chipMemAfter[addr + 0] = (dat >>> 24) & 0xff;
		chipMemAfter[addr + 1] = (dat >>> 16) & 0xff;
		chipMemAfter[addr + 2] = (dat >>> 8) & 0xff;
		chipMemAfter[addr + 3] = dat & 0xff;
	};

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS && i < endCycle; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS - ((y % 2) ? 1 : 0) && i < endCycle; x++, i++) { // long and short lines alternate
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.addr === undefined || dmaRecord.addr >= chipMem.byteLength)
				continue;

			if((dmaRecord.reg & 0x1100) === 0x1100) { // CPU write
				switch(dmaRecord.reg & 0xff) {
				case 1: writeByte(dmaRecord.addr, dmaRecord.dat); break;
				case 2: writeWord(dmaRecord.addr, dmaRecord.dat); break;
				case 4: writeLong(dmaRecord.addr, dmaRecord.dat); break;
				}
			} else if(dmaRecord.reg === 0) { // Blitter write
				writeWord(dmaRecord.addr, dmaRecord.dat);
			}
		}
	}

	return chipMemAfter;
}

// returns 32-element array of 3-element array (R, G, B) (0x00-0xff)
export function GetPalette(customRegs: Uint16Array): number[][] {
	const customReg = (reg: number) => customRegs[(reg - 0xdff000) >>> 1];
	const regCOLOR = CustomRegisters.getCustomAddress("COLOR00");
	const palette = [];
	for(let i = 0; i < 32; i++) {
		const color = customReg(regCOLOR + i * 2);
		palette.push([
			(((color >>> 8) & 0xf) << 4) | ((color >>> 8) & 0xf),
			(((color >>> 4) & 0xf) << 4) | ((color >>> 4) & 0xf),
			(((color >>> 0) & 0xf) << 4) | ((color >>> 0) & 0xf)
		]);
	}
	return palette;
}
