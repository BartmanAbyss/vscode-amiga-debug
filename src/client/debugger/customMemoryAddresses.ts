/**
 * Memory Labels extracted from UAE emulator
 * UAE - The Un*x Amiga Emulator
 * Routines for labelling amiga internals.
 */

export interface MemoryLabel {
	name: string;
	adr: number;
}

export interface CustomData {
	name: string;
	adr: number;
	rw?: number;
	special?: number;
}

export class MemoryLabelsRegistry {
	/* This table was generated from the list of AGA chip names in
	* AGA.guide available on aminet. It could well have errors in it. */

	public static readonly customData: CustomData[] = [
		{ name: "BLTDDAT", adr: 0xdff000 }, /* Blitter dest. early read (dummy address) */
		{ name: "DMACONR", adr: 0xdff002, rw: 1 }, /* Dma control (and blitter status) read */
		{ name: "VPOSR", adr: 0xdff004, rw: 1 }, /* Read vert most sig. bits (and frame flop */
		{ name: "VHPOSR", adr: 0xdff006, rw: 1 }, /* Read vert and horiz position of beam */
		{ name: "DSKDATR", adr: 0xdff008 }, /* Disk data early read (dummy address) */
		{ name: "JOY0DAT", adr: 0xdff00A, rw: 1 }, /* Joystick-mouse 0 data (vert,horiz) */
		{ name: "JOT1DAT", adr: 0xdff00C, rw: 1 }, /* Joystick-mouse 1 data (vert,horiz) */
		{ name: "CLXDAT", adr: 0xdff00E, rw: 1 }, /* Collision data reg. (read and clear) */
		{ name: "ADKCONR", adr: 0xdff010, rw: 1 }, /* Audio,disk control register read */
		{ name: "POT0DAT", adr: 0xdff012, rw: 1 }, /* Pot counter pair 0 data (vert,horiz) */
		{ name: "POT1DAT", adr: 0xdff014, rw: 1 }, /* Pot counter pair 1 data (vert,horiz) */
		{ name: "POTGOR", adr: 0xdff016, rw: 1 }, /* Pot pin data read */
		{ name: "SERDATR", adr: 0xdff018, rw: 1 }, /* Serial port data and status read */
		{ name: "DSKBYTR", adr: 0xdff01A, rw: 1 }, /* Disk data byte and status read */
		{ name: "INTENAR", adr: 0xdff01C, rw: 1 }, /* Interrupt enable bits read */
		{ name: "INTREQR", adr: 0xdff01E, rw: 1 }, /* Interrupt request bits read */
		{ name: "DSKPTH", adr: 0xdff020, rw: 2, special: 1 }, /* Disk pointer (high 5 bits) */
		{ name: "DSKPTL", adr: 0xdff022, rw: 2, special: 2 }, /* Disk pointer (low 15 bits) */
		{ name: "DSKLEN", adr: 0xdff024, rw: 2, special: 0 }, /* Disk length */
		{ name: "DSKDAT", adr: 0xdff026 }, /* Disk DMA data write */
		{ name: "REFPTR", adr: 0xdff028 }, /* Refresh pointer */
		{ name: "VPOSW", adr: 0xdff02A, rw: 2, special: 0 }, /* Write vert most sig. bits(and frame flop) */
		{ name: "VHPOSW", adr: 0xdff02C, rw: 2, special: 0 }, /* Write vert and horiz pos of beam */
		{ name: "COPCON", adr: 0xdff02e, rw: 2, special: 0 }, /* Coprocessor control reg (CDANG) */
		{ name: "SERDAT", adr: 0xdff030, rw: 2, special: 0 }, /* Serial port data and stop bits write */
		{ name: "SERPER", adr: 0xdff032, rw: 2, special: 0 }, /* Serial port period and control */
		{ name: "POTGO", adr: 0xdff034, rw: 2, special: 0 }, /* Pot count start,pot pin drive enable data */
		{ name: "JOYTEST", adr: 0xdff036, rw: 2, special: 0 }, /* Write to all 4 joystick-mouse counters at once */
		{ name: "STREQU", adr: 0xdff038, rw: 2, special: 0 }, /* Strobe for horiz sync with VB and EQU */
		{ name: "STRVBL", adr: 0xdff03A, rw: 2, special: 0 }, /* Strobe for horiz sync with VB (vert blank) */
		{ name: "STRHOR", adr: 0xdff03C, rw: 2, special: 0 }, /* Strobe for horiz sync */
		{ name: "STRLONG", adr: 0xdff03E, rw: 2, special: 0 }, /* Strobe for identification of long horiz line */
		{ name: "BLTCON0", adr: 0xdff040, rw: 2, special: 0 }, /* Blitter control reg 0 */
		{ name: "BLTCON1", adr: 0xdff042, rw: 2, special: 0 }, /* Blitter control reg 1 */
		{ name: "BLTAFWM", adr: 0xdff044, rw: 2, special: 0 }, /* Blitter first word mask for source A */
		{ name: "BLTALWM", adr: 0xdff046, rw: 2, special: 0 }, /* Blitter last word mask for source A */
		{ name: "BLTCPTH", adr: 0xdff048, rw: 2, special: 1 }, /* Blitter pointer to source C (high 5 bits) */
		{ name: "BLTCPTL", adr: 0xdff04A, rw: 2, special: 2 }, /* Blitter pointer to source C (low 15 bits) */
		{ name: "BLTBPTH", adr: 0xdff04C, rw: 2, special: 1 }, /* Blitter pointer to source B (high 5 bits) */
		{ name: "BLTBPTL", adr: 0xdff04E, rw: 2, special: 2 }, /* Blitter pointer to source B (low 15 bits) */
		{ name: "BLTAPTH", adr: 0xdff050, rw: 2, special: 1 }, /* Blitter pointer to source A (high 5 bits) */
		{ name: "BLTAPTL", adr: 0xdff052, rw: 2, special: 2 }, /* Blitter pointer to source A (low 15 bits) */
		{ name: "BPTDPTH", adr: 0xdff054, rw: 2, special: 1 }, /* Blitter pointer to destn  D (high 5 bits) */
		{ name: "BLTDPTL", adr: 0xdff056, rw: 2, special: 2 }, /* Blitter pointer to destn  D (low 15 bits) */
		{ name: "BLTSIZE", adr: 0xdff058, rw: 2, special: 0 }, /* Blitter start and size (win/width,height) */
		{ name: "BLTCON0L", adr: 0xdff05A, rw: 2, special: 4 }, /* Blitter control 0 lower 8 bits (minterms) */
		{ name: "BLTSIZV", adr: 0xdff05C, rw: 2, special: 4 }, /* Blitter V size (for 15 bit vert size) */
		{ name: "BLTSIZH", adr: 0xdff05E, rw: 2, special: 4 }, /* Blitter H size & start (for 11 bit H size) */
		{ name: "BLTCMOD", adr: 0xdff060, rw: 2, special: 0 }, /* Blitter modulo for source C */
		{ name: "BLTBMOD", adr: 0xdff062, rw: 2, special: 0 }, /* Blitter modulo for source B */
		{ name: "BLTAMOD", adr: 0xdff064, rw: 2, special: 0 }, /* Blitter modulo for source A */
		{ name: "BLTDMOD", adr: 0xdff066, rw: 2, special: 0 }, /* Blitter modulo for destn  D */
		{ name: "Unknown", adr: 0xdff068 }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff06a }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff06c }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff06e }, /* Unknown or Unused */
		{ name: "BLTCDAT", adr: 0xdff070, rw: 2, special: 0 }, /* Blitter source C data reg */
		{ name: "BLTBDAT", adr: 0xdff072, rw: 2, special: 0 }, /* Blitter source B data reg */
		{ name: "BLTADAT", adr: 0xdff074, rw: 2, special: 0 }, /* Blitter source A data reg */
		{ name: "BLTDDAT", adr: 0xdff076, rw: 2, special: 0 }, /* Blitter destination reg */
		{ name: "SPRHDAT", adr: 0xdff078 }, /* Ext logic UHRES sprite pointer and data identifier */
		{ name: "BPLHDAT", adr: 0xdff07A }, /* Ext logic UHRES bit plane identifier */
		{ name: "LISAID", adr: 0xdff07C, rw: 1, special: 8 }, /* Chip revision level for Denise/Lisa */
		{ name: "DSKSYNC", adr: 0xdff07E, rw: 2 }, /* Disk sync pattern reg for disk read */
		{ name: "COP1LCH", adr: 0xdff080, rw: 2, special: 1 }, /* Coprocessor first location reg (high 5 bits) */
		{ name: "COP1LCL", adr: 0xdff082, rw: 2, special: 2 }, /* Coprocessor first location reg (low 15 bits) */
		{ name: "COP2LCH", adr: 0xdff084, rw: 2, special: 1 }, /* Coprocessor second reg (high 5 bits) */
		{ name: "COP2LCL", adr: 0xdff086, rw: 2, special: 2 }, /* Coprocessor second reg (low 15 bits) */
		{ name: "COPJMP1", adr: 0xdff088, rw: 2 }, /* Coprocessor restart at first location */
		{ name: "COPJMP2", adr: 0xdff08A, rw: 2 }, /* Coprocessor restart at second location */
		{ name: "COPINS", adr: 0xdff08C }, /* Coprocessor inst fetch identify */
		{ name: "DIWSTRT", adr: 0xdff08E, rw: 2 }, /* Display window start (upper left vert-hor pos) */
		{ name: "DIWSTOP", adr: 0xdff090, rw: 2 }, /* Display window stop (lower right vert-hor pos) */
		{ name: "DDFSTRT", adr: 0xdff092, rw: 2 }, /* Display bit plane data fetch start.hor pos */
		{ name: "DDFSTOP", adr: 0xdff094, rw: 2 }, /* Display bit plane data fetch stop.hor pos */
		{ name: "DMACON", adr: 0xdff096, rw: 2 }, /* DMA control write (clear or set) */
		{ name: "CLXCON", adr: 0xdff098, rw: 2 }, /* Collision control */
		{ name: "INTENA", adr: 0xdff09A, rw: 2 }, /* Interrupt enable bits (clear or set bits) */
		{ name: "INTREQ", adr: 0xdff09C, rw: 2 }, /* Interrupt request bits (clear or set bits) */
		{ name: "ADKCON", adr: 0xdff09E, rw: 2 }, /* Audio,disk,UART,control */
		{ name: "AUD0LCH", adr: 0xdff0A0, rw: 2, special: 1 }, /* Audio channel 0 location (high 5 bits) */
		{ name: "AUD0LCL", adr: 0xdff0A2, rw: 2, special: 2 }, /* Audio channel 0 location (low 15 bits) */
		{ name: "AUD0LEN", adr: 0xdff0A4, rw: 2 }, /* Audio channel 0 length */
		{ name: "AUD0PER", adr: 0xdff0A6, rw: 2 }, /* Audio channel 0 period */
		{ name: "AUD0VOL", adr: 0xdff0A8, rw: 2 }, /* Audio channel 0 volume */
		{ name: "AUD0DAT", adr: 0xdff0AA, rw: 2 }, /* Audio channel 0 data */
		{ name: "Unknown", adr: 0xdff0AC }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff0AE }, /* Unknown or Unused */
		{ name: "AUD1LCH", adr: 0xdff0B0, rw: 2, special: 1 }, /* Audio channel 1 location (high 5 bits) */
		{ name: "AUD1LCL", adr: 0xdff0B2, rw: 2, special: 2 }, /* Audio channel 1 location (low 15 bits) */
		{ name: "AUD1LEN", adr: 0xdff0B4, rw: 2 }, /* Audio channel 1 length */
		{ name: "AUD1PER", adr: 0xdff0B6, rw: 2 }, /* Audio channel 1 period */
		{ name: "AUD1VOL", adr: 0xdff0B8, rw: 2 }, /* Audio channel 1 volume */
		{ name: "AUD1DAT", adr: 0xdff0BA, rw: 2 }, /* Audio channel 1 data */
		{ name: "Unknown", adr: 0xdff0BC }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff0BE }, /* Unknown or Unused */
		{ name: "AUD2LCH", adr: 0xdff0C0, rw: 2, special: 1 }, /* Audio channel 2 location (high 5 bits) */
		{ name: "AUD2LCL", adr: 0xdff0C2, rw: 2, special: 2 }, /* Audio channel 2 location (low 15 bits) */
		{ name: "AUD2LEN", adr: 0xdff0C4, rw: 2 }, /* Audio channel 2 length */
		{ name: "AUD2PER", adr: 0xdff0C6, rw: 2 }, /* Audio channel 2 period */
		{ name: "AUD2VOL", adr: 0xdff0C8, rw: 2 }, /* Audio channel 2 volume */
		{ name: "AUD2DAT", adr: 0xdff0CA, rw: 2 }, /* Audio channel 2 data */
		{ name: "Unknown", adr: 0xdff0CC }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff0CE }, /* Unknown or Unused */
		{ name: "AUD3LCH", adr: 0xdff0D0, rw: 2, special: 1 }, /* Audio channel 3 location (high 5 bits) */
		{ name: "AUD3LCL", adr: 0xdff0D2, rw: 2, special: 2 }, /* Audio channel 3 location (low 15 bits) */
		{ name: "AUD3LEN", adr: 0xdff0D4, rw: 2 }, /* Audio channel 3 length */
		{ name: "AUD3PER", adr: 0xdff0D6, rw: 2 }, /* Audio channel 3 period */
		{ name: "AUD3VOL", adr: 0xdff0D8, rw: 2 }, /* Audio channel 3 volume */
		{ name: "AUD3DAT", adr: 0xdff0DA, rw: 2 }, /* Audio channel 3 data */
		{ name: "Unknown", adr: 0xdff0DC }, /* Unknown or Unused */
		{ name: "Unknown", adr: 0xdff0DE }, /* Unknown or Unused */
		{ name: "BPL1PTH", adr: 0xdff0E0, rw: 2, special: 1 }, /* Bit plane pointer 1 (high 5 bits) */
		{ name: "BPL1PTL", adr: 0xdff0E2, rw: 2, special: 2 }, /* Bit plane pointer 1 (low 15 bits) */
		{ name: "BPL2PTH", adr: 0xdff0E4, rw: 2, special: 1 }, /* Bit plane pointer 2 (high 5 bits) */
		{ name: "BPL2PTL", adr: 0xdff0E6, rw: 2, special: 2 }, /* Bit plane pointer 2 (low 15 bits) */
		{ name: "BPL3PTH", adr: 0xdff0E8, rw: 2, special: 1 }, /* Bit plane pointer 3 (high 5 bits) */
		{ name: "BPL3PTL", adr: 0xdff0EA, rw: 2, special: 2 }, /* Bit plane pointer 3 (low 15 bits) */
		{ name: "BPL4PTH", adr: 0xdff0EC, rw: 2, special: 1 }, /* Bit plane pointer 4 (high 5 bits) */
		{ name: "BPL4PTL", adr: 0xdff0EE, rw: 2, special: 2 }, /* Bit plane pointer 4 (low 15 bits) */
		{ name: "BPL5PTH", adr: 0xdff0F0, rw: 2, special: 1 }, /* Bit plane pointer 5 (high 5 bits) */
		{ name: "BPL5PTL", adr: 0xdff0F2, rw: 2, special: 2 }, /* Bit plane pointer 5 (low 15 bits) */
		{ name: "BPL6PTH", adr: 0xdff0F4, rw: 2, special: 1 | 8 }, /* Bit plane pointer 6 (high 5 bits) */
		{ name: "BPL6PTL", adr: 0xdff0F6, rw: 2, special: 2 | 8 }, /* Bit plane pointer 6 (low 15 bits) */
		{ name: "BPL7PTH", adr: 0xdff0F8, rw: 2, special: 1 | 8 }, /* Bit plane pointer 7 (high 5 bits) */
		{ name: "BPL7PTL", adr: 0xdff0FA, rw: 2, special: 2 | 8 }, /* Bit plane pointer 7 (low 15 bits) */
		{ name: "BPL8PTH", adr: 0xdff0FC, rw: 2, special: 1 | 8 }, /* Bit plane pointer 8 (high 5 bits) */
		{ name: "BPL8PTL", adr: 0xdff0FE, rw: 2, special: 2 | 8 }, /* Bit plane pointer 8 (low 15 bits) */
		{ name: "BPLCON0", adr: 0xdff100, rw: 2 }, /* Bit plane control reg (misc control bits) */
		{ name: "BPLCON1", adr: 0xdff102, rw: 2 }, /* Bit plane control reg (scroll val PF1,PF2) */
		{ name: "BPLCON2", adr: 0xdff104, rw: 2 }, /* Bit plane control reg (priority control) */
		{ name: "BPLCON3", adr: 0xdff106, rw: 2 | 8 }, /* Bit plane control reg (enhanced features) */
		{ name: "BPL1MOD", adr: 0xdff108, rw: 2 }, /* Bit plane modulo (odd planes,or active- fetch lines if bitplane scan-doubling is enabled */
		{ name: "BPL2MOD", adr: 0xdff10A, rw: 2 }, /* Bit plane modulo (even planes or inactive- fetch lines if bitplane scan-doubling is enabled */
		{ name: "BPLCON4", adr: 0xdff10C, rw: 2 | 8 }, /* Bit plane control reg (bitplane and sprite masks) */
		{ name: "CLXCON2", adr: 0xdff10e, rw: 2 | 8 }, /* Extended collision control reg */
		{ name: "BPL1DAT", adr: 0xdff110, rw: 2 }, /* Bit plane 1 data (parallel to serial con- vert) */
		{ name: "BPL2DAT", adr: 0xdff112, rw: 2 }, /* Bit plane 2 data (parallel to serial con- vert) */
		{ name: "BPL3DAT", adr: 0xdff114, rw: 2 }, /* Bit plane 3 data (parallel to serial con- vert) */
		{ name: "BPL4DAT", adr: 0xdff116, rw: 2 }, /* Bit plane 4 data (parallel to serial con- vert) */
		{ name: "BPL5DAT", adr: 0xdff118, rw: 2 }, /* Bit plane 5 data (parallel to serial con- vert) */
		{ name: "BPL6DAT", adr: 0xdff11a, rw: 2 }, /* Bit plane 6 data (parallel to serial con- vert) */
		{ name: "BPL7DAT", adr: 0xdff11c, rw: 2 | 8 }, /* Bit plane 7 data (parallel to serial con- vert) */
		{ name: "BPL8DAT", adr: 0xdff11e, rw: 2 | 8 }, /* Bit plane 8 data (parallel to serial con- vert) */
		{ name: "SPR0PTH", adr: 0xdff120, rw: 2, special: 1 }, /* Sprite 0 pointer (high 5 bits) */
		{ name: "SPR0PTL", adr: 0xdff122, rw: 2, special: 2 }, /* Sprite 0 pointer (low 15 bits) */
		{ name: "SPR1PTH", adr: 0xdff124, rw: 2, special: 1 }, /* Sprite 1 pointer (high 5 bits) */
		{ name: "SPR1PTL", adr: 0xdff126, rw: 2, special: 2 }, /* Sprite 1 pointer (low 15 bits) */
		{ name: "SPR2PTH", adr: 0xdff128, rw: 2, special: 1 }, /* Sprite 2 pointer (high 5 bits) */
		{ name: "SPR2PTL", adr: 0xdff12A, rw: 2, special: 2 }, /* Sprite 2 pointer (low 15 bits) */
		{ name: "SPR3PTH", adr: 0xdff12C, rw: 2, special: 1 }, /* Sprite 3 pointer (high 5 bits) */
		{ name: "SPR3PTL", adr: 0xdff12E, rw: 2, special: 2 }, /* Sprite 3 pointer (low 15 bits) */
		{ name: "SPR4PTH", adr: 0xdff130, rw: 2, special: 1 }, /* Sprite 4 pointer (high 5 bits) */
		{ name: "SPR4PTL", adr: 0xdff132, rw: 2, special: 2 }, /* Sprite 4 pointer (low 15 bits) */
		{ name: "SPR5PTH", adr: 0xdff134, rw: 2, special: 1 }, /* Sprite 5 pointer (high 5 bits) */
		{ name: "SPR5PTL", adr: 0xdff136, rw: 2, special: 2 }, /* Sprite 5 pointer (low 15 bits) */
		{ name: "SPR6PTH", adr: 0xdff138, rw: 2, special: 1 }, /* Sprite 6 pointer (high 5 bits) */
		{ name: "SPR6PTL", adr: 0xdff13A, rw: 2, special: 2 }, /* Sprite 6 pointer (low 15 bits) */
		{ name: "SPR7PTH", adr: 0xdff13C, rw: 2, special: 1 }, /* Sprite 7 pointer (high 5 bits) */
		{ name: "SPR7PTL", adr: 0xdff13E, rw: 2, special: 2 }, /* Sprite 7 pointer (low 15 bits) */
		{ name: "SPR0POS", adr: 0xdff140, rw: 2 }, /* Sprite 0 vert-horiz start pos data */
		{ name: "SPR0CTL", adr: 0xdff142, rw: 2 }, /* Sprite 0 position and control data */
		{ name: "SPR0DATA", adr: 0xdff144, rw: 2 }, /* Sprite 0 image data register A */
		{ name: "SPR0DATB", adr: 0xdff146, rw: 2 }, /* Sprite 0 image data register B */
		{ name: "SPR1POS", adr: 0xdff148, rw: 2 }, /* Sprite 1 vert-horiz start pos data */
		{ name: "SPR1CTL", adr: 0xdff14A, rw: 2 }, /* Sprite 1 position and control data */
		{ name: "SPR1DATA", adr: 0xdff14C, rw: 2 }, /* Sprite 1 image data register A */
		{ name: "SPR1DATB", adr: 0xdff14E, rw: 2 }, /* Sprite 1 image data register B */
		{ name: "SPR2POS", adr: 0xdff150, rw: 2 }, /* Sprite 2 vert-horiz start pos data */
		{ name: "SPR2CTL", adr: 0xdff152, rw: 2 }, /* Sprite 2 position and control data */
		{ name: "SPR2DATA", adr: 0xdff154, rw: 2 }, /* Sprite 2 image data register A */
		{ name: "SPR2DATB", adr: 0xdff156, rw: 2 }, /* Sprite 2 image data register B */
		{ name: "SPR3POS", adr: 0xdff158, rw: 2 }, /* Sprite 3 vert-horiz start pos data */
		{ name: "SPR3CTL", adr: 0xdff15A, rw: 2 }, /* Sprite 3 position and control data */
		{ name: "SPR3DATA", adr: 0xdff15C, rw: 2 }, /* Sprite 3 image data register A */
		{ name: "SPR3DATB", adr: 0xdff15E, rw: 2 }, /* Sprite 3 image data register B */
		{ name: "SPR4POS", adr: 0xdff160, rw: 2 }, /* Sprite 4 vert-horiz start pos data */
		{ name: "SPR4CTL", adr: 0xdff162, rw: 2 }, /* Sprite 4 position and control data */
		{ name: "SPR4DATA", adr: 0xdff164, rw: 2 }, /* Sprite 4 image data register A */
		{ name: "SPR4DATB", adr: 0xdff166, rw: 2 }, /* Sprite 4 image data register B */
		{ name: "SPR5POS", adr: 0xdff168, rw: 2 }, /* Sprite 5 vert-horiz start pos data */
		{ name: "SPR5CTL", adr: 0xdff16A, rw: 2 }, /* Sprite 5 position and control data */
		{ name: "SPR5DATA", adr: 0xdff16C, rw: 2 }, /* Sprite 5 image data register A */
		{ name: "SPR5DATB", adr: 0xdff16E, rw: 2 }, /* Sprite 5 image data register B */
		{ name: "SPR6POS", adr: 0xdff170, rw: 2 }, /* Sprite 6 vert-horiz start pos data */
		{ name: "SPR6CTL", adr: 0xdff172, rw: 2 }, /* Sprite 6 position and control data */
		{ name: "SPR6DATA", adr: 0xdff174, rw: 2 }, /* Sprite 6 image data register A */
		{ name: "SPR6DATB", adr: 0xdff176, rw: 2 }, /* Sprite 6 image data register B */
		{ name: "SPR7POS", adr: 0xdff178, rw: 2 }, /* Sprite 7 vert-horiz start pos data */
		{ name: "SPR7CTL", adr: 0xdff17A, rw: 2 }, /* Sprite 7 position and control data */
		{ name: "SPR7DATA", adr: 0xdff17C, rw: 2 }, /* Sprite 7 image data register A */
		{ name: "SPR7DATB", adr: 0xdff17E, rw: 2 }, /* Sprite 7 image data register B */
		{ name: "COLOR00", adr: 0xdff180, rw: 2 }, /* Color table 00 */
		{ name: "COLOR01", adr: 0xdff182, rw: 2 }, /* Color table 01 */
		{ name: "COLOR02", adr: 0xdff184, rw: 2 }, /* Color table 02 */
		{ name: "COLOR03", adr: 0xdff186, rw: 2 }, /* Color table 03 */
		{ name: "COLOR04", adr: 0xdff188, rw: 2 }, /* Color table 04 */
		{ name: "COLOR05", adr: 0xdff18A, rw: 2 }, /* Color table 05 */
		{ name: "COLOR06", adr: 0xdff18C, rw: 2 }, /* Color table 06 */
		{ name: "COLOR07", adr: 0xdff18E, rw: 2 }, /* Color table 07 */
		{ name: "COLOR08", adr: 0xdff190, rw: 2 }, /* Color table 08 */
		{ name: "COLOR09", adr: 0xdff192, rw: 2 }, /* Color table 09 */
		{ name: "COLOR10", adr: 0xdff194, rw: 2 }, /* Color table 10 */
		{ name: "COLOR11", adr: 0xdff196, rw: 2 }, /* Color table 11 */
		{ name: "COLOR12", adr: 0xdff198, rw: 2 }, /* Color table 12 */
		{ name: "COLOR13", adr: 0xdff19A, rw: 2 }, /* Color table 13 */
		{ name: "COLOR14", adr: 0xdff19C, rw: 2 }, /* Color table 14 */
		{ name: "COLOR15", adr: 0xdff19E, rw: 2 }, /* Color table 15 */
		{ name: "COLOR16", adr: 0xdff1A0, rw: 2 }, /* Color table 16 */
		{ name: "COLOR17", adr: 0xdff1A2, rw: 2 }, /* Color table 17 */
		{ name: "COLOR18", adr: 0xdff1A4, rw: 2 }, /* Color table 18 */
		{ name: "COLOR19", adr: 0xdff1A6, rw: 2 }, /* Color table 19 */
		{ name: "COLOR20", adr: 0xdff1A8, rw: 2 }, /* Color table 20 */
		{ name: "COLOR21", adr: 0xdff1AA, rw: 2 }, /* Color table 21 */
		{ name: "COLOR22", adr: 0xdff1AC, rw: 2 }, /* Color table 22 */
		{ name: "COLOR23", adr: 0xdff1AE, rw: 2 }, /* Color table 23 */
		{ name: "COLOR24", adr: 0xdff1B0, rw: 2 }, /* Color table 24 */
		{ name: "COLOR25", adr: 0xdff1B2, rw: 2 }, /* Color table 25 */
		{ name: "COLOR26", adr: 0xdff1B4, rw: 2 }, /* Color table 26 */
		{ name: "COLOR27", adr: 0xdff1B6, rw: 2 }, /* Color table 27 */
		{ name: "COLOR28", adr: 0xdff1B8, rw: 2 }, /* Color table 28 */
		{ name: "COLOR29", adr: 0xdff1BA, rw: 2 }, /* Color table 29 */
		{ name: "COLOR30", adr: 0xdff1BC, rw: 2 }, /* Color table 30 */
		{ name: "COLOR31", adr: 0xdff1BE, rw: 2 }, /* Color table 31 */
		{ name: "HTOTAL", adr: 0xdff1C0, rw: 2 | 4 }, /* Highest number count in horiz line (VARBEAMEN = 1) */
		{ name: "HSSTOP", adr: 0xdff1C2, rw: 2 | 4 }, /* Horiz line pos for HSYNC stop */
		{ name: "HBSTRT", adr: 0xdff1C4, rw: 2 | 4 }, /* Horiz line pos for HBLANK start */
		{ name: "HBSTOP", adr: 0xdff1C6, rw: 2 | 4 }, /* Horiz line pos for HBLANK stop */
		{ name: "VTOTAL", adr: 0xdff1C8, rw: 2 | 4 }, /* Highest numbered vertical line (VARBEAMEN = 1) */
		{ name: "VSSTOP", adr: 0xdff1CA, rw: 2 | 4 }, /* Vert line for VBLANK start */
		{ name: "VBSTRT", adr: 0xdff1CC, rw: 2 | 4 }, /* Vert line for VBLANK start */
		{ name: "VBSTOP", adr: 0xdff1CE, rw: 2 | 4 }, /* Vert line for VBLANK stop */
		{ name: "SPRHSTRT", adr: 0xdff1D0 }, /* UHRES sprite vertical start */
		{ name: "SPRHSTOP", adr: 0xdff1D2 }, /* UHRES sprite vertical stop */
		{ name: "BPLHSTRT", adr: 0xdff1D4 }, /* UHRES bit plane vertical stop */
		{ name: "BPLHSTOP", adr: 0xdff1D6 }, /* UHRES bit plane vertical stop */
		{ name: "HHPOSW", adr: 0xdff1D8 }, /* DUAL mode hires H beam counter write */
		{ name: "HHPOSR", adr: 0xdff1DA }, /* DUAL mode hires H beam counter read */
		{ name: "BEAMCON0", adr: 0xdff1DC, rw: 2 | 4 }, /* Beam counter control register (SHRES,UHRES,PAL) */
		{ name: "HSSTRT", adr: 0xdff1DE, rw: 2 | 4 }, /* Horizontal sync start (VARHSY) */
		{ name: "VSSTRT", adr: 0xdff1E0, rw: 2 | 4 }, /* Vertical sync start (VARVSY) */
		{ name: "HCENTER", adr: 0xdff1E2, rw: 2 | 4 }, /* Horizontal pos for vsync on interlace */
		{ name: "DIWHIGH", adr: 0xdff1E4, rw: 2 | 4 }, /* Display window upper bits for start/stop */
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
		{ name: "FMODE", adr: 0xdff1FC, rw: 2 | 8 }, /* Fetch mode register */
		{ name: "NO-OP(NULL)", adr: 0xdff1FE }   /*   Can also indicate last 2 or 3 refresh cycles or the restart of the COPPER after lockup.*/
	];

	private static customMap: Map<string, CustomData> | undefined;
	private static customMapByAddr: Map<number, CustomData> | undefined;

	private static prepareCustomMap() {
		if (MemoryLabelsRegistry.customMap === undefined) {
			MemoryLabelsRegistry.customMap = new Map<string, CustomData>();
			MemoryLabelsRegistry.customMapByAddr = new Map<number, CustomData>();
			for (const d of MemoryLabelsRegistry.customData) {
				MemoryLabelsRegistry.customMap.set(d.name, d);
				MemoryLabelsRegistry.customMapByAddr.set(d.adr, d);
			}
		}
	}
	public static getCustomAddress(name: string): number | undefined {
		MemoryLabelsRegistry.prepareCustomMap();
		if (MemoryLabelsRegistry.customMap) {
			let d = MemoryLabelsRegistry.customMap.get(name);
			if (d === undefined) {
				// Maybe a double value - lets try with the high position
				d = MemoryLabelsRegistry.customMap.get(name + 'H');
				if (d !== undefined) {
					return d.adr;
				}
			} else {
				return d.adr;
			}
		}
		return undefined;
	}
	public static getCustomName(address: number): string | undefined {
		MemoryLabelsRegistry.prepareCustomMap();
		if (MemoryLabelsRegistry.customMapByAddr) {
			const d = MemoryLabelsRegistry.customMapByAddr.get(address);
			if (d) {
				return d.name;
			}
		}
		return undefined;
	}
}
