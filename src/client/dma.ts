import { DmaRecord } from "../backend/profile";
import { CustomRegisters } from './customRegisters';

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
						BLTxMOD.push(regBLTxMOD[channel]);
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
					blits[blits.length - 1].cycleEnd = i;
					blits[blits.length - 1].vposEnd = y;
					blits[blits.length - 1].hposEnd = x;
				}
				BlitTrace += `Line ${y.toString().padStart(3, ' ')} Cycle ${x.toString().padStart(3, ' ')}: BLITIRQ\n`;
			}
		}
	}
	return blits;
}