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
