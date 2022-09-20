/**
 * Memory Labels extracted from UAE emulator
 * UAE - The Un*x Amiga Emulator
 * Routines for labelling amiga internals.
 */

export enum DMACONFlags {
	SETCLR  = 1 << 15,
	BBUSY   = 1 << 14,
	BZERO   = 1 << 13,
	BLTPRI  = 1 << 10,
	DMAEN   = 1 <<  9, 
	BPLEN   = 1 <<  8,
	COPEN   = 1 <<  7,
	BLTEN   = 1 <<  6,
	SPREN   = 1 <<  5,
	DSKEN   = 1 <<  4,
	AUD3EN  = 1 <<  3,
	AUD2EN  = 1 <<  2,
	AUD1EN  = 1 <<  1,
	AUD0EN  = 1 <<  0,
}

export enum BLTCON0Flags {
	USEA    = 1 << 11,
	USEB    = 1 << 10,
	USEC    = 1 <<  9,
	USED    = 1 <<  8,
	LF7     = 1 <<  7,
	LF6     = 1 <<  6,
	LF5     = 1 <<  5,
	LF4     = 1 <<  4,
	LF3     = 1 <<  3,
	LF2     = 1 <<  2,
	LF1     = 1 <<  1,
	LF0     = 1 <<  0,
}

export enum BLTCON1Flags {
	DOFF    = 1 << 7,
	EFE     = 1 << 4,
	IFE     = 1 << 3,
	FCI     = 1 << 2,
	DESC    = 1 << 1,
	LINE    = 1 << 0,
	// for line mode
	SIGN    = 1 << 6,
	SUD     = 1 << 4,
	SUL     = 1 << 3,
	AUL     = 1 << 2,
	SING    = 1 << 1,
}

export enum BPLCON0Flags {
	HIRES   = 1 << 15,
	BPU2    = 1 << 14,
	BPU1    = 1 << 13,
	BPU0    = 1 << 12,
	HAM     = 1 << 11,
	DPF     = 1 << 10,
	COLOR   = 1 <<  9,
	GAUD    = 1 <<  8,
	UHRES   = 1 <<  7,
	SHRES   = 1 <<  6,
	BYPASS  = 1 <<  5,
	BPU3    = 1 <<  4,
	LPEN    = 1 <<  3,
	LACE    = 1 <<  2,
	ERSY    = 1 <<  1,
	ECSENA  = 1 <<  0,
}

export enum BPLCON1Flags {
	PF2H7   = 1 << 15,
	PF2H6   = 1 << 14,
	PF2H1   = 1 << 13,
	PF2H0   = 1 << 12,
	PF1H7   = 1 << 11,
	PF1H6   = 1 << 10,
	PF1H1   = 1 <<  9,
	PF1H0   = 1 <<  8,
	PF2H5   = 1 <<  7,
	PF2H4   = 1 <<  6,
	PF2H3   = 1 <<  5,
	PF2H2   = 1 <<  4,
	PF1H5   = 1 <<  3,
	PF1H4   = 1 <<  2,
	PF1H3   = 1 <<  1,
	PF1H2   = 1 <<  0,
}

export enum BPLCON2Flags {
	ZDBSEL2 = 1 << 14,
	ZDBSEL1 = 1 << 13,
	ZDBSEL0 = 1 << 12,
	ZDBPEN  = 1 << 11,
	ZDCTEN  = 1 << 10,
	KILLEHB = 1 <<  9,
	RDRAM   = 1 <<  8,
	SOGEN   = 1 <<  7,
	PF2PRI  = 1 <<  6,
	PF2P2   = 1 <<  5,
	PF2P1   = 1 <<  4,
	PF2P0   = 1 <<  3,
	PF1P2   = 1 <<  2,
	PF1P1   = 1 <<  1,
	PF1P0   = 1 <<  0,
}

export enum FMODEFlags {
	SSCAN2  = 1 << 15,
	BSCAN2  = 1 << 14,
	SPAGEM  = 1 <<  3,
	SPR32   = 1 <<  2,
	BPAGEM  = 1 <<  1,
	BPL32   = 1 <<  0,
}

export enum CustomReadWrite {
	read = 1,
	write = 2,
	ecs = 4,
	aga = 8
}

export enum CustomSpecial {
	pth = 1,
	ptl = 2,
	ecs = 4,
	aga = 8
}

export interface CustomData {
	name: string;
	adr: number;
	rw?: CustomReadWrite;
	special?: CustomSpecial;
}

export const BlitOp: { [x: number]: string } = {
	// manual
	0x00: 'CLEAR',
	0xff: 'FILL',
	0x3c: 'A^B',
	0x5a: 'A^C',
/*
	// from http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node011D.html
	0xf0: 'A',
	0x0f: '[A]',
	0xcc: 'B',
	0x33: '[B]',
	0xaa: 'C',
	0x55: '[C]',
	0xa0: 'A&C',
	0x50: 'A&[C]',
	0x0a: '[A]&C',
	0x05: '[A&C]',
	0xfc: 'A|B',
	0xcf: '[A]|B',
	0xfa: 'A|C',
	0xaf: '[A]|C',
	0xee: 'B|C',
	0xbb: '[B]|C',
	0xc0: 'A&B',
	0x30: 'A&[B]',
	0x0c: '[A]&B',
	0x03: '[A&B]',
	0x88: 'B&C',
	0x44: 'B&[C]',
	0x22: '[B]&C',
	0x11: '[B&C]',
	0xf3: 'A|[B]',
	0x3f: '[A|B]',
	0xf5: 'A|[C]',
	0x5f: '[A|C]',
	0xdd: 'B|[C]',
	0x77: '[B|C]',
	0xca: 'A&B | [A]&C',
	0xac: 'A&[B] | A&C'
*/	

	// from blitter_minterm.c
	0x01: '[A][B][C]',
	0x02: '[A][B]C',
	0x03: '[A][B]',
	0x04: '[A]B[C]',
	0x05: '[A][C]',
	0x06: '[A]B[C]|[A][B]C',
	0x07: '[A][C]|[A][B]',
	0x08: '[A]BC',
	0x09: '[A]BC|[A][B][C]',
	0x0a: '[A]C',
	0x0b: '[A]C|[A][B]',
	0x0c: '[A]B',
	0x0d: '[A]B|[A][C]',
	0x0e: '[A]B|[A]C',
	0x0f: '[A]',
	0x10: 'A[B][C]',
	0x11: '[B][C]',
	0x12: 'A[B][C]|[A][B]C',
	0x13: '[B][C]|[A][B]',
	0x14: 'A[B][C]|[A]B[C]',
	0x15: '[B][C]|[A][C]',
	0x16: 'A[B][C]|[A]B[C]|[A][B]C',
	0x17: '[B][C]|[A][C]|[A][B]',
	0x18: 'A[B][C]|[A]BC',
	0x19: '[A]BC|[B][C]',
	0x1a: 'A[B][C]|[A]C',
	0x1b: '[B][C]|[A]C',
	0x1c: 'A[B][C]|[A]B',
	0x1d: '[B][C]|[A]B',
	0x1e: 'A[B][C]|[A]B|[A]C',
	0x1f: '[B][C]|[A]',
	0x20: 'A[B]C',
	0x21: 'A[B]C|[A][B][C]',
	0x22: '[B]C',
	0x23: '[B]C|[A][B]',
	0x24: 'A[B]C|[A]B[C]',
	0x25: 'A[B]C|[A][C]',
	0x26: '[A]B[C]|[B]C',
	0x27: '[B]C|[A][C]',
	0x28: 'A[B]C|[A]BC',
	0x29: 'A[B]C|[A]BC|[A][B][C]',
	0x2a: '[B]C|[A]C',
	0x2b: '[B]C|[A]C|[A][B]',
	0x2c: 'A[B]C|[A]B',
	0x2d: 'A[B]C|[A]B|[A][C]',
	0x2e: '[B]C|[A]B',
	0x2f: '[B]C|[A]',
	0x30: 'A[B]',
	0x31: 'A[B]|[B][C]',
	0x32: 'A[B]|[B]C',
	0x33: '[B]',
	0x34: '[A]B[C]|A[B]',
	0x35: 'A[B]|[A][C]',
	0x36: '[A]B[C]|A[B]|[B]C',
	0x37: '[A][C]|[B]',
	0x38: '[A]BC|A[B]',
	0x39: '[A]BC|A[B]|[B][C]',
	0x3a: 'A[B]|[A]C',
	0x3b: '[A]C|[B]',
	0x3d: 'A[B]|[A]B|[A][C]',
	0x3e: 'A[B]|[A]B|[A]C',
	0x3f: '[B]|[A]',
	0x40: 'AB[C]',
	0x41: 'AB[C]|[A][B][C]',
	0x42: 'AB[C]|[A][B]C',
	0x43: 'AB[C]|[A][B]',
	0x44: 'B[C]',
	0x45: 'B[C]|[A][C]',
	0x46: '[A][B]C|B[C]',
	0x47: 'B[C]|[A][B]',
	0x48: 'AB[C]|[A]BC',
	0x49: 'AB[C]|[A]BC|[A][B][C]',
	0x4a: 'AB[C]|[A]C',
	0x4b: 'AB[C]|[A]C|[A][B]',
	0x4c: 'B[C]|[A]B',
	0x4d: 'B[C]|[A]B|[A][C]',
	0x4e: 'B[C]|[A]C',
	0x4f: 'B[C]|[A]',
	0x50: 'A[C]',
	0x51: 'A[C]|[B][C]',
	0x52: '[A][B]C|A[C]',
	0x53: 'A[C]|[A][B]',
	0x54: 'A[C]|B[C]',
	0x55: '[C]',
	0x56: '[A][B]C|A[C]|B[C]',
	0x57: '[A][B]|[C]',
	0x58: '[A]BC|A[C]',
	0x59: '[A]BC|A[C]|[B][C]',
	0x5b: 'A[C]|[A]C|[A][B]',
	0x5c: 'A[C]|[A]B',
	0x5d: '[A]B|[C]',
	0x5e: 'A[C]|[A]B|[A]C',
	0x5f: '[C]|[A]',
	0x60: 'AB[C]|A[B]C',
	0x61: 'AB[C]|A[B]C|[A][B][C]',
	0x62: 'AB[C]|[B]C',
	0x63: 'AB[C]|[B]C|[A][B]',
	0x64: 'A[B]C|B[C]',
	0x65: 'A[B]C|B[C]|[A][C]',
	0x66: 'B[C]|[B]C',
	0x67: 'B[C]|[B]C|[A][B]',
	0x68: 'AB[C]|A[B]C|[A]BC',
	0x69: 'AB[C]|A[B]C|[A]BC|[A][B][C]',
	0x6a: 'AB[C]|[B]C|[A]C',
	0x6b: 'AB[C]|[B]C|[A]C|[A][B]',
	0x6c: 'A[B]C|B[C]|[A]B',
	0x6d: 'A[B]C|B[C]|[A]B|[A][C]',
	0x6e: 'B[C]|[B]C|[A]C',
	0x6f: 'B[C]|[B]C|[A]',
	0x70: 'A[C]|A[B]',
	0x71: 'A[C]|A[B]|[B][C]',
	0x72: 'A[C]|[B]C',
	0x73: 'A[C]|[B]',
	0x74: 'B[C]|A[B]',
	0x75: 'A[B]|[C]',
	0x76: 'B[C]|A[B]|[B]C',
	0x77: '[C]|[B]',
	0x78: '[A]BC|A[C]|A[B]',
	0x79: '[A]BC|A[C]|A[B]|[B][C]',
	0x7a: 'A[C]|[B]C|[A]C',
	0x7b: 'A[C]|[A]C|[B]',
	0x7c: 'B[C]|A[B]|[A]B',
	0x7d: 'A[B]|[A]B|[C]',
	0x7e: 'B[C]|A[B]|[A]C',
	0x7f: '[C]|[B]|[A]',
	0x80: 'ABC',
	0x81: 'ABC|[A][B][C]',
	0x82: 'ABC|[A][B]C',
	0x83: 'ABC|[A][B]',
	0x84: 'ABC|[A]B[C]',
	0x85: 'ABC|[A][C]',
	0x86: 'ABC|[A]B[C]|[A][B]C',
	0x87: 'ABC|[A][C]|[A][B]',
	0x88: 'BC',
	0x89: '[A][B][C]|BC',
	0x8a: 'BC|[A]C',
	0x8b: 'BC|[A][B]',
	0x8c: 'BC|[A]B',
	0x8d: 'BC|[A][C]',
	0x8e: 'BC|[A]B|[A]C',
	0x8f: 'BC|[A]',
	0x90: 'ABC|A[B][C]',
	0x91: 'ABC|[B][C]',
	0x92: 'ABC|A[B][C]|[A][B]C',
	0x93: 'ABC|[B][C]|[A][B]',
	0x94: 'ABC|A[B][C]|[A]B[C]',
	0x95: 'ABC|[B][C]|[A][C]',
	0x96: 'ABC|A[B][C]|[A]B[C]|[A][B]C',
	0x97: 'ABC|[B][C]|[A][C]|[A][B]',
	0x98: 'A[B][C]|BC',
	0x99: 'BC|[B][C]',
	0x9a: 'A[B][C]|BC|[A]C',
	0x9b: 'BC|[B][C]|[A][B]',
	0x9c: 'A[B][C]|BC|[A]B',
	0x9d: 'BC|[B][C]|[A][C]',
	0x9e: 'A[B][C]|BC|[A]B|[A]C',
	0x9f: 'BC|[B][C]|[A]',
	0xa0: 'AC',
	0xa1: '[A][B][C]|AC',
	0xa2: 'AC|[B]C',
	0xa3: 'AC|[A][B]',
	0xa4: '[A]B[C]|AC',
	0xa5: 'AC|[A][C]',
	0xa6: '[A]B[C]|AC|[B]C',
	0xa7: 'AC|[A][C]|[A][B]',
	0xa8: 'AC|BC',
	0xa9: '[A][B][C]|AC|BC',
	0xaa: 'C',
	0xab: '[A][B]|C',
	0xac: 'AC|[A]B',
	0xad: 'AC|[A]B|[A][C]',
	0xae: '[A]B|C',
	0xaf: 'C|[A]',
	0xb0: 'AC|A[B]',
	0xb1: 'AC|[B][C]',
	0xb2: 'AC|A[B]|[B]C',
	0xb3: 'AC|[B]',
	0xb4: '[A]B[C]|AC|A[B]',
	0xb5: 'AC|[B][C]|[A][C]',
	0xb6: '[A]B[C]|AC|A[B]|[B]C',
	0xb7: 'AC|[A][C]|[B]',
	0xb8: 'BC|A[B]',
	0xb9: 'BC|A[B]|[B][C]',
	0xba: 'A[B]|C',
	0xbb: 'C|[B]',
	0xbc: 'BC|A[B]|[A]B',
	0xbd: 'BC|A[B]|[A][C]',
	0xbe: 'A[B]|[A]B|C',
	0xbf: 'C|[B]|[A]',
	0xc0: 'AB',
	0xc1: '[A][B][C]|AB',
	0xc2: '[A][B]C|AB',
	0xc3: 'AB|[A][B]',
	0xc4: 'AB|B[C]',
	0xc5: 'AB|[A][C]',
	0xc6: '[A][B]C|AB|B[C]',
	0xc7: 'AB|[A][C]|[A][B]',
	0xc8: 'AB|BC',
	0xc9: '[A][B][C]|AB|BC',
	0xca: 'AB|[A]C',
	0xcb: 'AB|[A]C|[A][B]',
	0xcc: 'B',
	0xcd: '[A][C]|B',
	0xce: '[A]C|B',
	0xcf: 'B|[A]',
	0xd0: 'AB|A[C]',
	0xd1: 'AB|[B][C]',
	0xd2: '[A][B]C|AB|A[C]',
	0xd3: 'AB|[B][C]|[A][B]',
	0xd4: 'AB|A[C]|B[C]',
	0xd5: 'AB|[C]',
	0xd6: '[A][B]C|AB|A[C]|B[C]',
	0xd7: 'AB|[A][B]|[C]',
	0xd8: 'BC|A[C]',
	0xd9: 'BC|A[C]|[B][C]',
	0xda: 'BC|A[C]|[A]C',
	0xdb: 'BC|A[C]|[A][B]',
	0xdc: 'A[C]|B',
	0xdd: 'B|[C]',
	0xde: 'A[C]|[A]C|B',
	0xdf: 'B|[C]|[A]',
	0xe0: 'AB|AC',
	0xe1: '[A][B][C]|AB|AC',
	0xe2: 'AB|[B]C',
	0xe3: 'AB|[B]C|[A][B]',
	0xe4: 'AC|B[C]',
	0xe5: 'AC|B[C]|[A][C]',
	0xe6: 'AC|B[C]|[B]C',
	0xe7: 'AC|B[C]|[A][B]',
	0xe8: 'AB|AC|BC',
	0xe9: '[A][B][C]|AB|AC|BC',
	0xea: 'AB|C',
	0xeb: 'AB|[A][B]|C',
	0xec: 'AC|B',
	0xed: 'AC|[A][C]|B',
	0xee: 'B|C',
	0xef: 'B|C|[A]',
	0xf0: 'A',
	0xf1: '[B][C]|A',
	0xf2: '[B]C|A',
	0xf3: 'A|[B]',
	0xf4: 'B[C]|A',
	0xf5: 'A|[C]',
	0xf6: 'B[C]|[B]C|A',
	0xf7: 'A|[C]|[B]',
	0xf8: 'BC|A',
	0xf9: 'BC|[B][C]|A',
	0xfa: 'A|C',
	0xfb: 'A|C|[B]',
	0xfc: 'A|B',
	0xfd: 'A|B|[C]',
	0xfe: 'A|B|C',
};

/* This table was generated from the list of AGA chip names in
* AGA.guide available on aminet. It could well have errors in it. */
const customData: CustomData[] = [
	{ name: "BLTDDAT", adr: 0xdff000 }, /* Blitter dest. early read (dummy address) */
	{ name: "DMACONR", adr: 0xdff002, rw: CustomReadWrite.read }, /* Dma control (and blitter status) read */
	{ name: "VPOSR", adr: 0xdff004, rw: CustomReadWrite.read }, /* Read vert most sig. bits (and frame flop */
	{ name: "VHPOSR", adr: 0xdff006, rw: CustomReadWrite.read }, /* Read vert and horiz position of beam */
	{ name: "DSKDATR", adr: 0xdff008 }, /* Disk data early read (dummy address) */
	{ name: "JOY0DAT", adr: 0xdff00A, rw: CustomReadWrite.read }, /* Joystick-mouse 0 data (vert,horiz) */
	{ name: "JOT1DAT", adr: 0xdff00C, rw: CustomReadWrite.read }, /* Joystick-mouse 1 data (vert,horiz) */
	{ name: "CLXDAT", adr: 0xdff00E, rw: CustomReadWrite.read }, /* Collision data reg. (read and clear) */
	{ name: "ADKCONR", adr: 0xdff010, rw: CustomReadWrite.read }, /* Audio,disk control register read */
	{ name: "POT0DAT", adr: 0xdff012, rw: CustomReadWrite.read }, /* Pot counter pair 0 data (vert,horiz) */
	{ name: "POT1DAT", adr: 0xdff014, rw: CustomReadWrite.read }, /* Pot counter pair 1 data (vert,horiz) */
	{ name: "POTGOR", adr: 0xdff016, rw: CustomReadWrite.read }, /* Pot pin data read */
	{ name: "SERDATR", adr: 0xdff018, rw: CustomReadWrite.read }, /* Serial port data and status read */
	{ name: "DSKBYTR", adr: 0xdff01A, rw: CustomReadWrite.read }, /* Disk data byte and status read */
	{ name: "INTENAR", adr: 0xdff01C, rw: CustomReadWrite.read }, /* Interrupt enable bits read */
	{ name: "INTREQR", adr: 0xdff01E, rw: CustomReadWrite.read }, /* Interrupt request bits read */
	{ name: "DSKPTH", adr: 0xdff020, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Disk pointer (high 5 bits) */
	{ name: "DSKPTL", adr: 0xdff022, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Disk pointer (low 15 bits) */
	{ name: "DSKLEN", adr: 0xdff024, rw: CustomReadWrite.write, special: 0 }, /* Disk length */
	{ name: "DSKDAT", adr: 0xdff026 }, /* Disk DMA data write */
	{ name: "REFPTR", adr: 0xdff028 }, /* Refresh pointer */
	{ name: "VPOSW", adr: 0xdff02A, rw: CustomReadWrite.write, special: 0 }, /* Write vert most sig. bits(and frame flop) */
	{ name: "VHPOSW", adr: 0xdff02C, rw: CustomReadWrite.write, special: 0 }, /* Write vert and horiz pos of beam */
	{ name: "COPCON", adr: 0xdff02e, rw: CustomReadWrite.write, special: 0 }, /* Coprocessor control reg (CDANG) */
	{ name: "SERDAT", adr: 0xdff030, rw: CustomReadWrite.write, special: 0 }, /* Serial port data and stop bits write */
	{ name: "SERPER", adr: 0xdff032, rw: CustomReadWrite.write, special: 0 }, /* Serial port period and control */
	{ name: "POTGO", adr: 0xdff034, rw: CustomReadWrite.write, special: 0 }, /* Pot count start,pot pin drive enable data */
	{ name: "JOYTEST", adr: 0xdff036, rw: CustomReadWrite.write, special: 0 }, /* Write to all 4 joystick-mouse counters at once */
	{ name: "STREQU", adr: 0xdff038, rw: CustomReadWrite.write, special: 0 }, /* Strobe for horiz sync with VB and EQU */
	{ name: "STRVBL", adr: 0xdff03A, rw: CustomReadWrite.write, special: 0 }, /* Strobe for horiz sync with VB (vert blank) */
	{ name: "STRHOR", adr: 0xdff03C, rw: CustomReadWrite.write, special: 0 }, /* Strobe for horiz sync */
	{ name: "STRLONG", adr: 0xdff03E, rw: CustomReadWrite.write, special: 0 }, /* Strobe for identification of long horiz line */
	{ name: "BLTCON0", adr: 0xdff040, rw: CustomReadWrite.write, special: 0 }, /* Blitter control reg 0 */
	{ name: "BLTCON1", adr: 0xdff042, rw: CustomReadWrite.write, special: 0 }, /* Blitter control reg 1 */
	{ name: "BLTAFWM", adr: 0xdff044, rw: CustomReadWrite.write, special: 0 }, /* Blitter first word mask for source A */
	{ name: "BLTALWM", adr: 0xdff046, rw: CustomReadWrite.write, special: 0 }, /* Blitter last word mask for source A */
	{ name: "BLTCPTH", adr: 0xdff048, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Blitter pointer to source C (high 5 bits) */
	{ name: "BLTCPTL", adr: 0xdff04A, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Blitter pointer to source C (low 15 bits) */
	{ name: "BLTBPTH", adr: 0xdff04C, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Blitter pointer to source B (high 5 bits) */
	{ name: "BLTBPTL", adr: 0xdff04E, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Blitter pointer to source B (low 15 bits) */
	{ name: "BLTAPTH", adr: 0xdff050, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Blitter pointer to source A (high 5 bits) */
	{ name: "BLTAPTL", adr: 0xdff052, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Blitter pointer to source A (low 15 bits) */
	{ name: "BLTDPTH", adr: 0xdff054, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Blitter pointer to destn  D (high 5 bits) */
	{ name: "BLTDPTL", adr: 0xdff056, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Blitter pointer to destn  D (low 15 bits) */
	{ name: "BLTSIZE", adr: 0xdff058, rw: CustomReadWrite.write, special: 0 }, /* Blitter start and size (win/width,height) */
	{ name: "BLTCON0L", adr: 0xdff05A, rw: CustomReadWrite.write, special: CustomSpecial.ecs }, /* Blitter control 0 lower 8 bits (minterms) */
	{ name: "BLTSIZV", adr: 0xdff05C, rw: CustomReadWrite.write, special: CustomSpecial.ecs }, /* Blitter V size (for 15 bit vert size) */
	{ name: "BLTSIZH", adr: 0xdff05E, rw: CustomReadWrite.write, special: CustomSpecial.ecs }, /* Blitter H size & start (for 11 bit H size) */
	{ name: "BLTCMOD", adr: 0xdff060, rw: CustomReadWrite.write, special: 0 }, /* Blitter modulo for source C */
	{ name: "BLTBMOD", adr: 0xdff062, rw: CustomReadWrite.write, special: 0 }, /* Blitter modulo for source B */
	{ name: "BLTAMOD", adr: 0xdff064, rw: CustomReadWrite.write, special: 0 }, /* Blitter modulo for source A */
	{ name: "BLTDMOD", adr: 0xdff066, rw: CustomReadWrite.write, special: 0 }, /* Blitter modulo for destn  D */
	{ name: "-", adr: 0xdff068 }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff06a }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff06c }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff06e }, /* Unknown or Unused */
	{ name: "BLTCDAT", adr: 0xdff070, rw: CustomReadWrite.write, special: 0 }, /* Blitter source C data reg */
	{ name: "BLTBDAT", adr: 0xdff072, rw: CustomReadWrite.write, special: 0 }, /* Blitter source B data reg */
	{ name: "BLTADAT", adr: 0xdff074, rw: CustomReadWrite.write, special: 0 }, /* Blitter source A data reg */
	{ name: "-", adr: 0xdff076 }, /* Unknown or Unused */
	{ name: "SPRHDAT", adr: 0xdff078 }, /* Ext logic UHRES sprite pointer and data identifier */
	{ name: "BPLHDAT", adr: 0xdff07A }, /* Ext logic UHRES bit plane identifier */
	{ name: "LISAID", adr: 0xdff07C, rw: CustomReadWrite.read, special: CustomSpecial.aga }, /* Chip revision level for Denise/Lisa */
	{ name: "DSKSYNC", adr: 0xdff07E, rw: CustomReadWrite.write }, /* Disk sync pattern reg for disk read */
	{ name: "COP1LCH", adr: 0xdff080, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Coprocessor first location reg (high 5 bits) */
	{ name: "COP1LCL", adr: 0xdff082, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Coprocessor first location reg (low 15 bits) */
	{ name: "COP2LCH", adr: 0xdff084, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Coprocessor second reg (high 5 bits) */
	{ name: "COP2LCL", adr: 0xdff086, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Coprocessor second reg (low 15 bits) */
	{ name: "COPJMP1", adr: 0xdff088, rw: CustomReadWrite.write }, /* Coprocessor restart at first location */
	{ name: "COPJMP2", adr: 0xdff08A, rw: CustomReadWrite.write }, /* Coprocessor restart at second location */
	{ name: "COPINS", adr: 0xdff08C }, /* Coprocessor inst fetch identify */
	{ name: "DIWSTRT", adr: 0xdff08E, rw: CustomReadWrite.write }, /* Display window start (upper left vert-hor pos) */
	{ name: "DIWSTOP", adr: 0xdff090, rw: CustomReadWrite.write }, /* Display window stop (lower right vert-hor pos) */
	{ name: "DDFSTRT", adr: 0xdff092, rw: CustomReadWrite.write }, /* Display bit plane data fetch start.hor pos */
	{ name: "DDFSTOP", adr: 0xdff094, rw: CustomReadWrite.write }, /* Display bit plane data fetch stop.hor pos */
	{ name: "DMACON", adr: 0xdff096, rw: CustomReadWrite.write }, /* DMA control write (clear or set) */
	{ name: "CLXCON", adr: 0xdff098, rw: CustomReadWrite.write }, /* Collision control */
	{ name: "INTENA", adr: 0xdff09A, rw: CustomReadWrite.write }, /* Interrupt enable bits (clear or set bits) */
	{ name: "INTREQ", adr: 0xdff09C, rw: CustomReadWrite.write }, /* Interrupt request bits (clear or set bits) */
	{ name: "ADKCON", adr: 0xdff09E, rw: CustomReadWrite.write }, /* Audio,disk,UART,control */
	{ name: "AUD0LCH", adr: 0xdff0A0, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Audio channel 0 location (high 5 bits) */
	{ name: "AUD0LCL", adr: 0xdff0A2, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Audio channel 0 location (low 15 bits) */
	{ name: "AUD0LEN", adr: 0xdff0A4, rw: CustomReadWrite.write }, /* Audio channel 0 length */
	{ name: "AUD0PER", adr: 0xdff0A6, rw: CustomReadWrite.write }, /* Audio channel 0 period */
	{ name: "AUD0VOL", adr: 0xdff0A8, rw: CustomReadWrite.write }, /* Audio channel 0 volume */
	{ name: "AUD0DAT", adr: 0xdff0AA, rw: CustomReadWrite.write }, /* Audio channel 0 data */
	{ name: "-", adr: 0xdff0AC }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff0AE }, /* Unknown or Unused */
	{ name: "AUD1LCH", adr: 0xdff0B0, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Audio channel 1 location (high 5 bits) */
	{ name: "AUD1LCL", adr: 0xdff0B2, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Audio channel 1 location (low 15 bits) */
	{ name: "AUD1LEN", adr: 0xdff0B4, rw: CustomReadWrite.write }, /* Audio channel 1 length */
	{ name: "AUD1PER", adr: 0xdff0B6, rw: CustomReadWrite.write }, /* Audio channel 1 period */
	{ name: "AUD1VOL", adr: 0xdff0B8, rw: CustomReadWrite.write }, /* Audio channel 1 volume */
	{ name: "AUD1DAT", adr: 0xdff0BA, rw: CustomReadWrite.write }, /* Audio channel 1 data */
	{ name: "-", adr: 0xdff0BC }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff0BE }, /* Unknown or Unused */
	{ name: "AUD2LCH", adr: 0xdff0C0, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Audio channel 2 location (high 5 bits) */
	{ name: "AUD2LCL", adr: 0xdff0C2, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Audio channel 2 location (low 15 bits) */
	{ name: "AUD2LEN", adr: 0xdff0C4, rw: CustomReadWrite.write }, /* Audio channel 2 length */
	{ name: "AUD2PER", adr: 0xdff0C6, rw: CustomReadWrite.write }, /* Audio channel 2 period */
	{ name: "AUD2VOL", adr: 0xdff0C8, rw: CustomReadWrite.write }, /* Audio channel 2 volume */
	{ name: "AUD2DAT", adr: 0xdff0CA, rw: CustomReadWrite.write }, /* Audio channel 2 data */
	{ name: "-", adr: 0xdff0CC }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff0CE }, /* Unknown or Unused */
	{ name: "AUD3LCH", adr: 0xdff0D0, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Audio channel 3 location (high 5 bits) */
	{ name: "AUD3LCL", adr: 0xdff0D2, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Audio channel 3 location (low 15 bits) */
	{ name: "AUD3LEN", adr: 0xdff0D4, rw: CustomReadWrite.write }, /* Audio channel 3 length */
	{ name: "AUD3PER", adr: 0xdff0D6, rw: CustomReadWrite.write }, /* Audio channel 3 period */
	{ name: "AUD3VOL", adr: 0xdff0D8, rw: CustomReadWrite.write }, /* Audio channel 3 volume */
	{ name: "AUD3DAT", adr: 0xdff0DA, rw: CustomReadWrite.write }, /* Audio channel 3 data */
	{ name: "-", adr: 0xdff0DC }, /* Unknown or Unused */
	{ name: "-", adr: 0xdff0DE }, /* Unknown or Unused */
	{ name: "BPL1PTH", adr: 0xdff0E0, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Bit plane pointer 1 (high 5 bits) */
	{ name: "BPL1PTL", adr: 0xdff0E2, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Bit plane pointer 1 (low 15 bits) */
	{ name: "BPL2PTH", adr: 0xdff0E4, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Bit plane pointer 2 (high 5 bits) */
	{ name: "BPL2PTL", adr: 0xdff0E6, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Bit plane pointer 2 (low 15 bits) */
	{ name: "BPL3PTH", adr: 0xdff0E8, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Bit plane pointer 3 (high 5 bits) */
	{ name: "BPL3PTL", adr: 0xdff0EA, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Bit plane pointer 3 (low 15 bits) */
	{ name: "BPL4PTH", adr: 0xdff0EC, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Bit plane pointer 4 (high 5 bits) */
	{ name: "BPL4PTL", adr: 0xdff0EE, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Bit plane pointer 4 (low 15 bits) */
	{ name: "BPL5PTH", adr: 0xdff0F0, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Bit plane pointer 5 (high 5 bits) */
	{ name: "BPL5PTL", adr: 0xdff0F2, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Bit plane pointer 5 (low 15 bits) */
	{ name: "BPL6PTH", adr: 0xdff0F4, rw: CustomReadWrite.write, special: CustomSpecial.pth | CustomSpecial.aga }, /* Bit plane pointer 6 (high 5 bits) */
	{ name: "BPL6PTL", adr: 0xdff0F6, rw: CustomReadWrite.write, special: CustomSpecial.ptl | CustomSpecial.aga }, /* Bit plane pointer 6 (low 15 bits) */
	{ name: "BPL7PTH", adr: 0xdff0F8, rw: CustomReadWrite.write, special: CustomSpecial.pth | CustomSpecial.aga }, /* Bit plane pointer 7 (high 5 bits) */
	{ name: "BPL7PTL", adr: 0xdff0FA, rw: CustomReadWrite.write, special: CustomSpecial.ptl | CustomSpecial.aga }, /* Bit plane pointer 7 (low 15 bits) */
	{ name: "BPL8PTH", adr: 0xdff0FC, rw: CustomReadWrite.write, special: CustomSpecial.pth | CustomSpecial.aga }, /* Bit plane pointer 8 (high 5 bits) */
	{ name: "BPL8PTL", adr: 0xdff0FE, rw: CustomReadWrite.write, special: CustomSpecial.ptl | CustomSpecial.aga }, /* Bit plane pointer 8 (low 15 bits) */
	{ name: "BPLCON0", adr: 0xdff100, rw: CustomReadWrite.write }, /* Bit plane control reg (misc control bits) */
	{ name: "BPLCON1", adr: 0xdff102, rw: CustomReadWrite.write }, /* Bit plane control reg (scroll val PF1,PF2) */
	{ name: "BPLCON2", adr: 0xdff104, rw: CustomReadWrite.write }, /* Bit plane control reg (priority control) */
	{ name: "BPLCON3", adr: 0xdff106, rw: CustomReadWrite.write | CustomReadWrite.aga }, /* Bit plane control reg (enhanced features) */
	{ name: "BPL1MOD", adr: 0xdff108, rw: CustomReadWrite.write }, /* Bit plane modulo (odd planes,or active- fetch lines if bitplane scan-doubling is enabled */
	{ name: "BPL2MOD", adr: 0xdff10A, rw: CustomReadWrite.write }, /* Bit plane modulo (even planes or inactive- fetch lines if bitplane scan-doubling is enabled */
	{ name: "BPLCON4", adr: 0xdff10C, rw: CustomReadWrite.write | CustomReadWrite.aga }, /* Bit plane control reg (bitplane and sprite masks) */
	{ name: "CLXCON2", adr: 0xdff10e, rw: CustomReadWrite.write | CustomReadWrite.aga }, /* Extended collision control reg */
	{ name: "BPL1DAT", adr: 0xdff110, rw: CustomReadWrite.write }, /* Bit plane 1 data (parallel to serial convert) */
	{ name: "BPL2DAT", adr: 0xdff112, rw: CustomReadWrite.write }, /* Bit plane 2 data (parallel to serial convert) */
	{ name: "BPL3DAT", adr: 0xdff114, rw: CustomReadWrite.write }, /* Bit plane 3 data (parallel to serial convert) */
	{ name: "BPL4DAT", adr: 0xdff116, rw: CustomReadWrite.write }, /* Bit plane 4 data (parallel to serial convert) */
	{ name: "BPL5DAT", adr: 0xdff118, rw: CustomReadWrite.write }, /* Bit plane 5 data (parallel to serial convert) */
	{ name: "BPL6DAT", adr: 0xdff11a, rw: CustomReadWrite.write }, /* Bit plane 6 data (parallel to serial convert) */
	{ name: "BPL7DAT", adr: 0xdff11c, rw: CustomReadWrite.write | CustomReadWrite.aga }, /* Bit plane 7 data (parallel to serial convert) */
	{ name: "BPL8DAT", adr: 0xdff11e, rw: CustomReadWrite.write | CustomReadWrite.aga }, /* Bit plane 8 data (parallel to serial convert) */
	{ name: "SPR0PTH", adr: 0xdff120, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 0 pointer (high 5 bits) */
	{ name: "SPR0PTL", adr: 0xdff122, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 0 pointer (low 15 bits) */
	{ name: "SPR1PTH", adr: 0xdff124, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 1 pointer (high 5 bits) */
	{ name: "SPR1PTL", adr: 0xdff126, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 1 pointer (low 15 bits) */
	{ name: "SPR2PTH", adr: 0xdff128, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 2 pointer (high 5 bits) */
	{ name: "SPR2PTL", adr: 0xdff12A, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 2 pointer (low 15 bits) */
	{ name: "SPR3PTH", adr: 0xdff12C, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 3 pointer (high 5 bits) */
	{ name: "SPR3PTL", adr: 0xdff12E, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 3 pointer (low 15 bits) */
	{ name: "SPR4PTH", adr: 0xdff130, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 4 pointer (high 5 bits) */
	{ name: "SPR4PTL", adr: 0xdff132, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 4 pointer (low 15 bits) */
	{ name: "SPR5PTH", adr: 0xdff134, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 5 pointer (high 5 bits) */
	{ name: "SPR5PTL", adr: 0xdff136, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 5 pointer (low 15 bits) */
	{ name: "SPR6PTH", adr: 0xdff138, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 6 pointer (high 5 bits) */
	{ name: "SPR6PTL", adr: 0xdff13A, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 6 pointer (low 15 bits) */
	{ name: "SPR7PTH", adr: 0xdff13C, rw: CustomReadWrite.write, special: CustomSpecial.pth }, /* Sprite 7 pointer (high 5 bits) */
	{ name: "SPR7PTL", adr: 0xdff13E, rw: CustomReadWrite.write, special: CustomSpecial.ptl }, /* Sprite 7 pointer (low 15 bits) */
	{ name: "SPR0POS", adr: 0xdff140, rw: CustomReadWrite.write }, /* Sprite 0 vert-horiz start pos data */
	{ name: "SPR0CTL", adr: 0xdff142, rw: CustomReadWrite.write }, /* Sprite 0 position and control data */
	{ name: "SPR0DATA", adr: 0xdff144, rw: CustomReadWrite.write }, /* Sprite 0 image data register A */
	{ name: "SPR0DATB", adr: 0xdff146, rw: CustomReadWrite.write }, /* Sprite 0 image data register B */
	{ name: "SPR1POS", adr: 0xdff148, rw: CustomReadWrite.write }, /* Sprite 1 vert-horiz start pos data */
	{ name: "SPR1CTL", adr: 0xdff14A, rw: CustomReadWrite.write }, /* Sprite 1 position and control data */
	{ name: "SPR1DATA", adr: 0xdff14C, rw: CustomReadWrite.write }, /* Sprite 1 image data register A */
	{ name: "SPR1DATB", adr: 0xdff14E, rw: CustomReadWrite.write }, /* Sprite 1 image data register B */
	{ name: "SPR2POS", adr: 0xdff150, rw: CustomReadWrite.write }, /* Sprite 2 vert-horiz start pos data */
	{ name: "SPR2CTL", adr: 0xdff152, rw: CustomReadWrite.write }, /* Sprite 2 position and control data */
	{ name: "SPR2DATA", adr: 0xdff154, rw: CustomReadWrite.write }, /* Sprite 2 image data register A */
	{ name: "SPR2DATB", adr: 0xdff156, rw: CustomReadWrite.write }, /* Sprite 2 image data register B */
	{ name: "SPR3POS", adr: 0xdff158, rw: CustomReadWrite.write }, /* Sprite 3 vert-horiz start pos data */
	{ name: "SPR3CTL", adr: 0xdff15A, rw: CustomReadWrite.write }, /* Sprite 3 position and control data */
	{ name: "SPR3DATA", adr: 0xdff15C, rw: CustomReadWrite.write }, /* Sprite 3 image data register A */
	{ name: "SPR3DATB", adr: 0xdff15E, rw: CustomReadWrite.write }, /* Sprite 3 image data register B */
	{ name: "SPR4POS", adr: 0xdff160, rw: CustomReadWrite.write }, /* Sprite 4 vert-horiz start pos data */
	{ name: "SPR4CTL", adr: 0xdff162, rw: CustomReadWrite.write }, /* Sprite 4 position and control data */
	{ name: "SPR4DATA", adr: 0xdff164, rw: CustomReadWrite.write }, /* Sprite 4 image data register A */
	{ name: "SPR4DATB", adr: 0xdff166, rw: CustomReadWrite.write }, /* Sprite 4 image data register B */
	{ name: "SPR5POS", adr: 0xdff168, rw: CustomReadWrite.write }, /* Sprite 5 vert-horiz start pos data */
	{ name: "SPR5CTL", adr: 0xdff16A, rw: CustomReadWrite.write }, /* Sprite 5 position and control data */
	{ name: "SPR5DATA", adr: 0xdff16C, rw: CustomReadWrite.write }, /* Sprite 5 image data register A */
	{ name: "SPR5DATB", adr: 0xdff16E, rw: CustomReadWrite.write }, /* Sprite 5 image data register B */
	{ name: "SPR6POS", adr: 0xdff170, rw: CustomReadWrite.write }, /* Sprite 6 vert-horiz start pos data */
	{ name: "SPR6CTL", adr: 0xdff172, rw: CustomReadWrite.write }, /* Sprite 6 position and control data */
	{ name: "SPR6DATA", adr: 0xdff174, rw: CustomReadWrite.write }, /* Sprite 6 image data register A */
	{ name: "SPR6DATB", adr: 0xdff176, rw: CustomReadWrite.write }, /* Sprite 6 image data register B */
	{ name: "SPR7POS", adr: 0xdff178, rw: CustomReadWrite.write }, /* Sprite 7 vert-horiz start pos data */
	{ name: "SPR7CTL", adr: 0xdff17A, rw: CustomReadWrite.write }, /* Sprite 7 position and control data */
	{ name: "SPR7DATA", adr: 0xdff17C, rw: CustomReadWrite.write }, /* Sprite 7 image data register A */
	{ name: "SPR7DATB", adr: 0xdff17E, rw: CustomReadWrite.write }, /* Sprite 7 image data register B */
	{ name: "COLOR00", adr: 0xdff180, rw: CustomReadWrite.write }, /* Color table 00 */
	{ name: "COLOR01", adr: 0xdff182, rw: CustomReadWrite.write }, /* Color table 01 */
	{ name: "COLOR02", adr: 0xdff184, rw: CustomReadWrite.write }, /* Color table 02 */
	{ name: "COLOR03", adr: 0xdff186, rw: CustomReadWrite.write }, /* Color table 03 */
	{ name: "COLOR04", adr: 0xdff188, rw: CustomReadWrite.write }, /* Color table 04 */
	{ name: "COLOR05", adr: 0xdff18A, rw: CustomReadWrite.write }, /* Color table 05 */
	{ name: "COLOR06", adr: 0xdff18C, rw: CustomReadWrite.write }, /* Color table 06 */
	{ name: "COLOR07", adr: 0xdff18E, rw: CustomReadWrite.write }, /* Color table 07 */
	{ name: "COLOR08", adr: 0xdff190, rw: CustomReadWrite.write }, /* Color table 08 */
	{ name: "COLOR09", adr: 0xdff192, rw: CustomReadWrite.write }, /* Color table 09 */
	{ name: "COLOR10", adr: 0xdff194, rw: CustomReadWrite.write }, /* Color table 10 */
	{ name: "COLOR11", adr: 0xdff196, rw: CustomReadWrite.write }, /* Color table 11 */
	{ name: "COLOR12", adr: 0xdff198, rw: CustomReadWrite.write }, /* Color table 12 */
	{ name: "COLOR13", adr: 0xdff19A, rw: CustomReadWrite.write }, /* Color table 13 */
	{ name: "COLOR14", adr: 0xdff19C, rw: CustomReadWrite.write }, /* Color table 14 */
	{ name: "COLOR15", adr: 0xdff19E, rw: CustomReadWrite.write }, /* Color table 15 */
	{ name: "COLOR16", adr: 0xdff1A0, rw: CustomReadWrite.write }, /* Color table 16 */
	{ name: "COLOR17", adr: 0xdff1A2, rw: CustomReadWrite.write }, /* Color table 17 */
	{ name: "COLOR18", adr: 0xdff1A4, rw: CustomReadWrite.write }, /* Color table 18 */
	{ name: "COLOR19", adr: 0xdff1A6, rw: CustomReadWrite.write }, /* Color table 19 */
	{ name: "COLOR20", adr: 0xdff1A8, rw: CustomReadWrite.write }, /* Color table 20 */
	{ name: "COLOR21", adr: 0xdff1AA, rw: CustomReadWrite.write }, /* Color table 21 */
	{ name: "COLOR22", adr: 0xdff1AC, rw: CustomReadWrite.write }, /* Color table 22 */
	{ name: "COLOR23", adr: 0xdff1AE, rw: CustomReadWrite.write }, /* Color table 23 */
	{ name: "COLOR24", adr: 0xdff1B0, rw: CustomReadWrite.write }, /* Color table 24 */
	{ name: "COLOR25", adr: 0xdff1B2, rw: CustomReadWrite.write }, /* Color table 25 */
	{ name: "COLOR26", adr: 0xdff1B4, rw: CustomReadWrite.write }, /* Color table 26 */
	{ name: "COLOR27", adr: 0xdff1B6, rw: CustomReadWrite.write }, /* Color table 27 */
	{ name: "COLOR28", adr: 0xdff1B8, rw: CustomReadWrite.write }, /* Color table 28 */
	{ name: "COLOR29", adr: 0xdff1BA, rw: CustomReadWrite.write }, /* Color table 29 */
	{ name: "COLOR30", adr: 0xdff1BC, rw: CustomReadWrite.write }, /* Color table 30 */
	{ name: "COLOR31", adr: 0xdff1BE, rw: CustomReadWrite.write }, /* Color table 31 */
	{ name: "HTOTAL", adr: 0xdff1C0, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Highest number count in horiz line (VARBEAMEN = 1) */
	{ name: "HSSTOP", adr: 0xdff1C2, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Horiz line pos for HSYNC stop */
	{ name: "HBSTRT", adr: 0xdff1C4, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Horiz line pos for HBLANK start */
	{ name: "HBSTOP", adr: 0xdff1C6, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Horiz line pos for HBLANK stop */
	{ name: "VTOTAL", adr: 0xdff1C8, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Highest numbered vertical line (VARBEAMEN = 1) */
	{ name: "VSSTOP", adr: 0xdff1CA, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Vert line for VBLANK start */
	{ name: "VBSTRT", adr: 0xdff1CC, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Vert line for VBLANK start */
	{ name: "VBSTOP", adr: 0xdff1CE, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Vert line for VBLANK stop */
	{ name: "SPRHSTRT", adr: 0xdff1D0 }, /* UHRES sprite vertical start */
	{ name: "SPRHSTOP", adr: 0xdff1D2 }, /* UHRES sprite vertical stop */
	{ name: "BPLHSTRT", adr: 0xdff1D4 }, /* UHRES bit plane vertical stop */
	{ name: "BPLHSTOP", adr: 0xdff1D6 }, /* UHRES bit plane vertical stop */
	{ name: "HHPOSW", adr: 0xdff1D8 }, /* DUAL mode hires H beam counter write */
	{ name: "HHPOSR", adr: 0xdff1DA }, /* DUAL mode hires H beam counter read */
	{ name: "BEAMCON0", adr: 0xdff1DC, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Beam counter control register (SHRES,UHRES,PAL) */
	{ name: "HSSTRT", adr: 0xdff1DE, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Horizontal sync start (VARHSY) */
	{ name: "VSSTRT", adr: 0xdff1E0, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Vertical sync start (VARVSY) */
	{ name: "HCENTER", adr: 0xdff1E2, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Horizontal pos for vsync on interlace */
	{ name: "DIWHIGH", adr: 0xdff1E4, rw: CustomReadWrite.write | CustomReadWrite.ecs }, /* Display window upper bits for start/stop */
	{ name: "BPLHMOD", adr: 0xdff1E6 }, /* UHRES bit plane modulo */
	{ name: "SPRHPTH", adr: 0xdff1E8 }, /* UHRES sprite pointer (high 5 bits) */
	{ name: "SPRHPTL", adr: 0xdff1EA }, /* UHRES sprite pointer (low 15 bits) */
	{ name: "BPLHPTH", adr: 0xdff1EC }, /* VRam (UHRES) bitplane pointer (hi 5 bits) */
	{ name: "BPLHPTL", adr: 0xdff1EE }, /* VRam (UHRES) bitplane pointer (lo 15 bits) */
	{ name: "RESERVED", adr: 0xdff1F0 }, /* Reserved (forever i guess!) */
	{ name: "RESERVED", adr: 0xdff1F2 }, /* Reserved (forever i guess!) */
	{ name: "RESERVED", adr: 0xdff1F4 }, /* Reserved (forever i guess!) */
	{ name: "RESERVED", adr: 0xdff1F6 }, /* Reserved (forever i guess!) */
	{ name: "RESERVED", adr: 0xdff1F8 }, /* Reserved (forever i guess!) */
	{ name: "RESERVED", adr: 0xdff1Fa }, /* Reserved (forever i guess!) */
	{ name: "FMODE", adr: 0xdff1FC, rw: CustomReadWrite.write | CustomReadWrite.aga }, /* Fetch mode register */
	{ name: "NO-OP", adr: 0xdff1FE }   /*   Can also indicate last 2 or 3 refresh cycles or the restart of the COPPER after lockup.*/
];

const customByName: Map<string, CustomData> = new Map(customData.map((c) => [ c.name, c]));
const customByAddr: Map<number, CustomData> = new Map(customData.map((c) => [ c.adr, c]));
const customByOffs: Map<number, CustomData> = new Map(customData.map((c) => [ c.adr - 0xdff000, c]));

export namespace Custom {
	export const ByName = (name: string) => customByName.get(name);
	export const ByAddr = (addr: number) => customByAddr.get(addr);
	export const ByOffs = (offs: number) => customByOffs.get(offs);
	export const ByIndex = (index: number) => customByOffs.get(index << 1);
}

// from 68k-dis.ts; make signed
const COERCE16 = (x: number) => (x ^ 0x8000) - 0x8000;
export const FormatCustomRegData = (regName: string, dat: number) => {
	if(regName.match(/BPL.MOD/)) {
		let prefix = ' ';
		if(dat & 0x8000) {
			prefix = '-';
			dat = Math.abs(COERCE16(dat));
		}
		return prefix + dat.toString(10);
	}
	return ' $' + dat.toString(16).padStart(4, '0');
};
