
a.mingw.elf:     file format elf32-m68k


Disassembly of section .text:

00000000 <_start>:
extern void (*__init_array_start[])() __attribute__((weak));
extern void (*__init_array_end[])() __attribute__((weak));
extern void (*__fini_array_start[])() __attribute__((weak));
extern void (*__fini_array_end[])() __attribute__((weak));

__attribute__((used)) __attribute__((section(".text.unlikely"))) void _start() {
   0:	48e7 3020      	movem.l d2-d3/a2,-(sp)
	// initialize globals, ctors etc.
	unsigned long count;
	unsigned long i;

	count = __preinit_array_end - __preinit_array_start;
   4:	263c 0000 2896 	move.l #10390,d3
   a:	0483 0000 2896 	subi.l #10390,d3
  10:	e483           	asr.l #2,d3
	for (i = 0; i < count; i++)
  12:	6712           	beq.s 26 <_start+0x26>
  14:	45f9 0000 2896 	lea 2896 <__preinit_array_end>,a2
  1a:	7400           	moveq #0,d2
		__preinit_array_start[i]();
  1c:	205a           	movea.l (a2)+,a0
  1e:	4e90           	jsr (a0)
	for (i = 0; i < count; i++)
  20:	5282           	addq.l #1,d2
  22:	b483           	cmp.l d3,d2
  24:	66f6           	bne.s 1c <_start+0x1c>

	count = __init_array_end - __init_array_start;
  26:	263c 0000 289c 	move.l #10396,d3
  2c:	0483 0000 2898 	subi.l #10392,d3
  32:	e483           	asr.l #2,d3
	for (i = 0; i < count; i++)
  34:	6712           	beq.s 48 <_start+0x48>
  36:	45f9 0000 2898 	lea 2898 <__init_array_start>,a2
  3c:	7400           	moveq #0,d2
		__init_array_start[i]();
  3e:	205a           	movea.l (a2)+,a0
  40:	4e90           	jsr (a0)
	for (i = 0; i < count; i++)
  42:	5282           	addq.l #1,d2
  44:	b483           	cmp.l d3,d2
  46:	66f6           	bne.s 3e <_start+0x3e>

	main();
  48:	4eb9 0000 008a 	jsr 8a <main>

	// call dtors
	count = __fini_array_end - __fini_array_start;
  4e:	243c 0000 289c 	move.l #10396,d2
  54:	0482 0000 289c 	subi.l #10396,d2
  5a:	e482           	asr.l #2,d2
	for (i = count; i > 0; i--)
  5c:	6716           	beq.s 74 <_start+0x74>
  5e:	2002           	move.l d2,d0
  60:	e588           	lsl.l #2,d0
  62:	2440           	movea.l d0,a2
  64:	d5fc 0000 289c 	adda.l #10396,a2
		__fini_array_start[i - 1]();
  6a:	5382           	subq.l #1,d2
  6c:	2062           	movea.l -(a2),a0
  6e:	4e90           	jsr (a0)
	for (i = count; i > 0; i--)
  70:	4a82           	tst.l d2
  72:	66f6           	bne.s 6a <_start+0x6a>
}
  74:	4cdf 040c      	movem.l (sp)+,d2-d3/a2
  78:	4e75           	rts

0000007a <_GLOBAL__sub_I_SysBase>:
#ifdef __cplusplus
	class TestClass {
	public:
		TestClass(int y) {
			static int x = 7;
			i = y + x;
  7a:	2039 0000 289c 	move.l 289c <__init_array_end>,d0
  80:	5880           	addq.l #4,d0
  82:	23c0 0000 28c0 	move.l d0,28c0 <staticClass>
	// END
	FreeSystem();

	CloseLibrary((struct Library*)DOSBase);
	CloseLibrary((struct Library*)GfxBase);
}
  88:	4e75           	rts

0000008a <main>:
int main() {
  8a:	4fef fff4      	lea -12(sp),sp
  8e:	48e7 3132      	movem.l d2-d3/d7/a2-a3/a6,-(sp)
	SysBase = *((struct ExecBase**)4UL);
  92:	2c78 0004      	movea.l 4 <_start+0x4>,a6
  96:	23ce 0000 28c4 	move.l a6,28c4 <SysBase>
	hw = (struct Custom*)0xdff000;
  9c:	23fc 00df f000 	move.l #14675968,28bc <hw>
  a2:	0000 28bc 
	GfxBase = (struct GfxBase *)OpenLibrary("graphics.library",0);
  a6:	43f9 0000 0848 	lea 848 <PutChar+0x4c>,a1
  ac:	7000           	moveq #0,d0
  ae:	4eae fdd8      	jsr -552(a6)
  b2:	23c0 0000 28b8 	move.l d0,28b8 <GfxBase>
	if (!GfxBase)
  b8:	6700 02d4      	beq.w 38e <main+0x304>
	DOSBase = (struct DosLibrary*)OpenLibrary("dos.library", 0);
  bc:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
  c2:	43f9 0000 0859 	lea 859 <PutChar+0x5d>,a1
  c8:	7000           	moveq #0,d0
  ca:	4eae fdd8      	jsr -552(a6)
  ce:	23c0 0000 28b4 	move.l d0,28b4 <DOSBase>
	if (!DOSBase)
  d4:	6700 02ac      	beq.w 382 <main+0x2f8>
	KPrintF("Hello debugger from Amiga: %ld!\n", staticClass.i);
  d8:	2f39 0000 28c0 	move.l 28c0 <staticClass>,-(sp)
  de:	4879 0000 0865 	pea 865 <PutChar+0x69>
  e4:	4eb9 0000 04a6 	jsr 4a6 <KPrintF>
	Write(Output(), (APTR)"Hello console!\n", 15);
  ea:	2c79 0000 28b4 	movea.l 28b4 <DOSBase>,a6
  f0:	4eae ffc4      	jsr -60(a6)
  f4:	2c79 0000 28b4 	movea.l 28b4 <DOSBase>,a6
  fa:	2200           	move.l d0,d1
  fc:	243c 0000 0886 	move.l #2182,d2
 102:	760f           	moveq #15,d3
 104:	4eae ffd0      	jsr -48(a6)
	Delay(50);
 108:	2c79 0000 28b4 	movea.l 28b4 <DOSBase>,a6
 10e:	7232           	moveq #50,d1
 110:	4eae ff3a      	jsr -198(a6)

void warpmode(int on) // bool
{
	long(*UaeConf)(long mode, int index, const char* param, int param_len, char* outbuf, int outbuf_len);
	UaeConf = (long(*)(long, int, const char*, int, char*, int))0xf0ff60;
	if(*((ULONG *)UaeConf)) {
 114:	247c 00f0 ff60 	movea.l #15794016,a2
 11a:	508f           	addq.l #8,sp
 11c:	4a92           	tst.l (a2)
 11e:	6718           	beq.s 138 <main+0xae>
 120:	4878 0001      	pea 1 <_start+0x1>
 124:	47f9 0000 0404 	lea 404 <warpmode.part.0>,a3
 12a:	4e93           	jsr (a3)
 12c:	588f           	addq.l #4,sp
 12e:	4a92           	tst.l (a2)
 130:	6706           	beq.s 138 <main+0xae>
 132:	42a7           	clr.l -(sp)
 134:	4e93           	jsr (a3)
 136:	588f           	addq.l #4,sp
	ActiView=GfxBase->ActiView; //store current view
 138:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 13e:	23ee 0022 0000 	move.l 34(a6),28a0 <_edata>
 144:	28a0 
	OwnBlitter();
 146:	4eae fe38      	jsr -456(a6)
	WaitBlit();	
 14a:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 150:	4eae ff1c      	jsr -228(a6)
	Disable();
 154:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 15a:	4eae ff88      	jsr -120(a6)
	SystemADKCON=hw->adkconr;
 15e:	2479 0000 28bc 	movea.l 28bc <hw>,a2
 164:	302a 0010      	move.w 16(a2),d0
 168:	33c0 0000 28a4 	move.w d0,28a4 <_ZL12SystemADKCON>
	SystemInts=hw->intenar;
 16e:	302a 001c      	move.w 28(a2),d0
 172:	33c0 0000 28a8 	move.w d0,28a8 <_ZL10SystemInts>
	SystemDMA=hw->dmaconr;
 178:	302a 0002      	move.w 2(a2),d0
 17c:	33c0 0000 28a6 	move.w d0,28a6 <_ZL9SystemDMA>
	hw->intena=0x7fff;//disable all interrupts
 182:	357c 7fff 009a 	move.w #32767,154(a2)
	hw->intreq=0x7fff;//Clear any interrupts that were pending
 188:	357c 7fff 009c 	move.w #32767,156(a2)
	WaitVbl();
 18e:	47f9 0000 0538 	lea 538 <_Z7WaitVblv>,a3
 194:	4e93           	jsr (a3)
	WaitVbl();
 196:	4e93           	jsr (a3)
	hw->dmacon=0x7fff;//Clear all DMA channels
 198:	357c 7fff 0096 	move.w #32767,150(a2)
	for(int a=0;a<32;a++)
 19e:	7200           	moveq #0,d1
		hw->color[a]=0;
 1a0:	2001           	move.l d1,d0
 1a2:	0680 0000 00c0 	addi.l #192,d0
 1a8:	d080           	add.l d0,d0
 1aa:	35bc 0000 0800 	move.w #0,(0,a2,d0.l)
	for(int a=0;a<32;a++)
 1b0:	5281           	addq.l #1,d1
 1b2:	7020           	moveq #32,d0
 1b4:	b081           	cmp.l d1,d0
 1b6:	66e8           	bne.s 1a0 <main+0x116>
	LoadView(0);
 1b8:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 1be:	93c9           	suba.l a1,a1
 1c0:	4eae ff22      	jsr -222(a6)
	WaitTOF();
 1c4:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 1ca:	4eae fef2      	jsr -270(a6)
	WaitTOF();
 1ce:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 1d4:	4eae fef2      	jsr -270(a6)
	WaitVbl();
 1d8:	4e93           	jsr (a3)
	WaitVbl();
 1da:	4e93           	jsr (a3)
	UWORD getvbr[] = { 0x4e7a, 0x0801, 0x4e73 }; // MOVEC.L VBR,D0 RTE
 1dc:	3f7c 4e7a 001e 	move.w #20090,30(sp)
 1e2:	3f7c 0801 0020 	move.w #2049,32(sp)
 1e8:	3f7c 4e73 0022 	move.w #20083,34(sp)
	if (SysBase->AttnFlags & AFF_68010) 
 1ee:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 1f4:	082e 0000 0129 	btst #0,297(a6)
 1fa:	6700 01bc      	beq.w 3b8 <main+0x32e>
		vbr = (APTR)Supervisor((ULONG (*)())getvbr);
 1fe:	7e1e           	moveq #30,d7
 200:	de8f           	add.l sp,d7
 202:	cf8d           	exg d7,a5
 204:	4eae ffe2      	jsr -30(a6)
 208:	cf8d           	exg d7,a5
	VBR=GetVBR();
 20a:	23c0 0000 28b0 	move.l d0,28b0 <_ZL3VBR>
	return *(volatile APTR*)(((UBYTE*)VBR)+0x6c);
 210:	2079 0000 28b0 	movea.l 28b0 <_ZL3VBR>,a0
 216:	2428 006c      	move.l 108(a0),d2
	SystemIrq=GetInterruptHandler(); //store interrupt register
 21a:	23c2 0000 28aa 	move.l d2,28aa <_ZL9SystemIrq>
	WaitVbl();
 220:	4e93           	jsr (a3)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 222:	2079 0000 28b0 	movea.l 28b0 <_ZL3VBR>,a0
 228:	217c 0000 050e 	move.l #1294,108(a0)
 22e:	006c 
	hw->intena=(1<<INTB_SETCLR)|(1<<INTB_INTEN)|(1<<INTB_VERTB);
 230:	2479 0000 28bc 	movea.l 28bc <hw>,a2
 236:	357c c020 009a 	move.w #-16352,154(a2)
	hw->intreq=1<<INTB_VERTB;//reset vbl req
 23c:	357c 0020 009c 	move.w #32,156(a2)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 242:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.fc12646f+0xbfa0bb>,d0
	while(!MouseLeft()) {
 248:	0800 0006      	btst #6,d0
 24c:	675e           	beq.s 2ac <main+0x222>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 24e:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.fc12646f+0xdfb0be>,d0
 254:	2f40 001e      	move.l d0,30(sp)
		vpos&=0x1ff00;
 258:	202f 001e      	move.l 30(sp),d0
 25c:	0280 0001 ff00 	andi.l #130816,d0
 262:	2f40 001e      	move.l d0,30(sp)
		if (vpos!=(311<<8))
 266:	202f 001e      	move.l 30(sp),d0
 26a:	0c80 0001 3700 	cmpi.l #79616,d0
 270:	67dc           	beq.s 24e <main+0x1c4>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 272:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.fc12646f+0xdfb0be>,d0
 278:	2f40 001a      	move.l d0,26(sp)
		vpos&=0x1ff00;
 27c:	202f 001a      	move.l 26(sp),d0
 280:	0280 0001 ff00 	andi.l #130816,d0
 286:	2f40 001a      	move.l d0,26(sp)
		if (vpos==(311<<8))
 28a:	202f 001a      	move.l 26(sp),d0
 28e:	0c80 0001 3700 	cmpi.l #79616,d0
 294:	66dc           	bne.s 272 <main+0x1e8>
		hw->color[0] = bgcolor;
 296:	3039 0000 28ae 	move.w 28ae <bgcolor>,d0
 29c:	3540 0180      	move.w d0,384(a2)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 2a0:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.fc12646f+0xbfa0bb>,d0
	while(!MouseLeft()) {
 2a6:	0800 0006      	btst #6,d0
 2aa:	66a2           	bne.s 24e <main+0x1c4>
	WaitVbl();
 2ac:	4e93           	jsr (a3)
	UWORD tst=*(volatile UWORD*)&hw->dmaconr; //for compatiblity a1000
 2ae:	302a 0002      	move.w 2(a2),d0
	while (*(volatile UWORD*)&hw->dmaconr&(1<<14)) {} //blitter busy wait
 2b2:	302a 0002      	move.w 2(a2),d0
 2b6:	0800 000e      	btst #14,d0
 2ba:	66f6           	bne.s 2b2 <main+0x228>
	hw->intena=0x7fff;//disable all interrupts
 2bc:	357c 7fff 009a 	move.w #32767,154(a2)
	hw->intreq=0x7fff;//Clear any interrupts that were pending
 2c2:	357c 7fff 009c 	move.w #32767,156(a2)
	hw->dmacon=0x7fff;//Clear all DMA channels
 2c8:	357c 7fff 0096 	move.w #32767,150(a2)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 2ce:	2079 0000 28b0 	movea.l 28b0 <_ZL3VBR>,a0
 2d4:	2142 006c      	move.l d2,108(a0)
	hw->cop1lc=(ULONG)GfxBase->copinit;
 2d8:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 2de:	256e 0026 0080 	move.l 38(a6),128(a2)
	hw->cop2lc=(ULONG)GfxBase->LOFlist;
 2e4:	256e 0032 0084 	move.l 50(a6),132(a2)
	hw->copjmp1=0x7fff; //start coppper
 2ea:	357c 7fff 0088 	move.w #32767,136(a2)
	hw->intena=SystemInts|0x8000;
 2f0:	3039 0000 28a8 	move.w 28a8 <_ZL10SystemInts>,d0
 2f6:	0040 8000      	ori.w #-32768,d0
 2fa:	3540 009a      	move.w d0,154(a2)
	hw->dmacon=SystemDMA|0x8000;
 2fe:	3039 0000 28a6 	move.w 28a6 <_ZL9SystemDMA>,d0
 304:	0040 8000      	ori.w #-32768,d0
 308:	3540 0096      	move.w d0,150(a2)
	hw->adkcon=SystemADKCON|0x8000;
 30c:	3039 0000 28a4 	move.w 28a4 <_ZL12SystemADKCON>,d0
 312:	0040 8000      	ori.w #-32768,d0
 316:	3540 009e      	move.w d0,158(a2)
	LoadView(ActiView);
 31a:	2279 0000 28a0 	movea.l 28a0 <_edata>,a1
 320:	4eae ff22      	jsr -222(a6)
	WaitTOF();
 324:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 32a:	4eae fef2      	jsr -270(a6)
	WaitTOF();
 32e:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 334:	4eae fef2      	jsr -270(a6)
	WaitBlit();	
 338:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 33e:	4eae ff1c      	jsr -228(a6)
	DisownBlitter();
 342:	2c79 0000 28b8 	movea.l 28b8 <GfxBase>,a6
 348:	4eae fe32      	jsr -462(a6)
	Enable();
 34c:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 352:	4eae ff82      	jsr -126(a6)
	CloseLibrary((struct Library*)DOSBase);
 356:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 35c:	2279 0000 28b4 	movea.l 28b4 <DOSBase>,a1
 362:	4eae fe62      	jsr -414(a6)
	CloseLibrary((struct Library*)GfxBase);
 366:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 36c:	2279 0000 28b8 	movea.l 28b8 <GfxBase>,a1
 372:	4eae fe62      	jsr -414(a6)
}
 376:	7000           	moveq #0,d0
 378:	4cdf 4c8c      	movem.l (sp)+,d2-d3/d7/a2-a3/a6
 37c:	4fef 000c      	lea 12(sp),sp
 380:	4e75           	rts
		Exit(0);
 382:	9dce           	suba.l a6,a6
 384:	7200           	moveq #0,d1
 386:	4eae ff70      	jsr -144(a6)
 38a:	6000 fd4c      	bra.w d8 <main+0x4e>
		Exit(0);
 38e:	2c79 0000 28b4 	movea.l 28b4 <DOSBase>,a6
 394:	7200           	moveq #0,d1
 396:	4eae ff70      	jsr -144(a6)
	DOSBase = (struct DosLibrary*)OpenLibrary("dos.library", 0);
 39a:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 3a0:	43f9 0000 0859 	lea 859 <PutChar+0x5d>,a1
 3a6:	7000           	moveq #0,d0
 3a8:	4eae fdd8      	jsr -552(a6)
 3ac:	23c0 0000 28b4 	move.l d0,28b4 <DOSBase>
	if (!DOSBase)
 3b2:	6600 fd24      	bne.w d8 <main+0x4e>
 3b6:	60ca           	bra.s 382 <main+0x2f8>
	APTR vbr = 0;
 3b8:	7000           	moveq #0,d0
	VBR=GetVBR();
 3ba:	23c0 0000 28b0 	move.l d0,28b0 <_ZL3VBR>
	return *(volatile APTR*)(((UBYTE*)VBR)+0x6c);
 3c0:	2079 0000 28b0 	movea.l 28b0 <_ZL3VBR>,a0
 3c6:	2428 006c      	move.l 108(a0),d2
	SystemIrq=GetInterruptHandler(); //store interrupt register
 3ca:	23c2 0000 28aa 	move.l d2,28aa <_ZL9SystemIrq>
	WaitVbl();
 3d0:	4e93           	jsr (a3)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 3d2:	2079 0000 28b0 	movea.l 28b0 <_ZL3VBR>,a0
 3d8:	217c 0000 050e 	move.l #1294,108(a0)
 3de:	006c 
	hw->intena=(1<<INTB_SETCLR)|(1<<INTB_INTEN)|(1<<INTB_VERTB);
 3e0:	2479 0000 28bc 	movea.l 28bc <hw>,a2
 3e6:	357c c020 009a 	move.w #-16352,154(a2)
	hw->intreq=1<<INTB_VERTB;//reset vbl req
 3ec:	357c 0020 009c 	move.w #32,156(a2)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 3f2:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.fc12646f+0xbfa0bb>,d0
	while(!MouseLeft()) {
 3f8:	0800 0006      	btst #6,d0
 3fc:	6600 fe50      	bne.w 24e <main+0x1c4>
 400:	6000 feaa      	bra.w 2ac <main+0x222>

00000404 <warpmode.part.0>:
void warpmode(int on) // bool
 404:	598f           	subq.l #4,sp
 406:	2f02           	move.l d2,-(sp)
		char outbuf;
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
 408:	4aaf 000c      	tst.l 12(sp)
 40c:	674c           	beq.s 45a <warpmode.part.0+0x56>
 40e:	4878 0001      	pea 1 <_start+0x1>
 412:	740b           	moveq #11,d2
 414:	d48f           	add.l sp,d2
 416:	2f02           	move.l d2,-(sp)
 418:	42a7           	clr.l -(sp)
 41a:	4879 0000 0833 	pea 833 <PutChar+0x37>
 420:	4878 ffff      	pea ffffffff <gcc8_c_support.c.fc12646f+0xffffc0b9>
 424:	4878 0052      	pea 52 <_start+0x52>
 428:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.fc12646f+0xf0c01a>
 42e:	4fef 0018      	lea 24(sp),sp
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
 432:	203c 0000 0819 	move.l #2073,d0
 438:	4878 0001      	pea 1 <_start+0x1>
 43c:	2f02           	move.l d2,-(sp)
 43e:	42a7           	clr.l -(sp)
 440:	2f00           	move.l d0,-(sp)
 442:	4878 ffff      	pea ffffffff <gcc8_c_support.c.fc12646f+0xffffc0b9>
 446:	4878 0052      	pea 52 <_start+0x52>
 44a:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.fc12646f+0xf0c01a>
	}
}
 450:	4fef 0018      	lea 24(sp),sp
 454:	241f           	move.l (sp)+,d2
 456:	588f           	addq.l #4,sp
 458:	4e75           	rts
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
 45a:	4878 0001      	pea 1 <_start+0x1>
 45e:	740b           	moveq #11,d2
 460:	d48f           	add.l sp,d2
 462:	2f02           	move.l d2,-(sp)
 464:	42a7           	clr.l -(sp)
 466:	4879 0000 083d 	pea 83d <PutChar+0x41>
 46c:	4878 ffff      	pea ffffffff <gcc8_c_support.c.fc12646f+0xffffc0b9>
 470:	4878 0052      	pea 52 <_start+0x52>
 474:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.fc12646f+0xf0c01a>
 47a:	4fef 0018      	lea 24(sp),sp
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
 47e:	203c 0000 0800 	move.l #2048,d0
 484:	4878 0001      	pea 1 <_start+0x1>
 488:	2f02           	move.l d2,-(sp)
 48a:	42a7           	clr.l -(sp)
 48c:	2f00           	move.l d0,-(sp)
 48e:	4878 ffff      	pea ffffffff <gcc8_c_support.c.fc12646f+0xffffc0b9>
 492:	4878 0052      	pea 52 <_start+0x52>
 496:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.fc12646f+0xf0c01a>
}
 49c:	4fef 0018      	lea 24(sp),sp
 4a0:	241f           	move.l (sp)+,d2
 4a2:	588f           	addq.l #4,sp
 4a4:	4e75           	rts

000004a6 <KPrintF>:
{
 4a6:	4fef ff80      	lea -128(sp),sp
 4aa:	48e7 0032      	movem.l a2-a3/a6,-(sp)
    if(*((ULONG *)UaeDbgLog)) {
 4ae:	4ab9 00f0 ff60 	tst.l f0ff60 <gcc8_c_support.c.fc12646f+0xf0c01a>
 4b4:	6734           	beq.s 4ea <KPrintF+0x44>
		RawDoFmt((CONST_STRPTR)fmt, vl, PutChar, temp);
 4b6:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 4bc:	206f 0090      	movea.l 144(sp),a0
 4c0:	43ef 0094      	lea 148(sp),a1
 4c4:	45f9 0000 07fc 	lea 7fc <PutChar>,a2
 4ca:	47ef 000c      	lea 12(sp),a3
 4ce:	4eae fdf6      	jsr -522(a6)
		UaeDbgLog(86, temp);
 4d2:	2f0b           	move.l a3,-(sp)
 4d4:	4878 0056      	pea 56 <_start+0x56>
 4d8:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.fc12646f+0xf0c01a>
 4de:	508f           	addq.l #8,sp
}
 4e0:	4cdf 4c00      	movem.l (sp)+,a2-a3/a6
 4e4:	4fef 0080      	lea 128(sp),sp
 4e8:	4e75           	rts
		RawDoFmt((CONST_STRPTR)fmt, vl, KPutCharX, 0);
 4ea:	2c79 0000 28c4 	movea.l 28c4 <SysBase>,a6
 4f0:	206f 0090      	movea.l 144(sp),a0
 4f4:	43ef 0094      	lea 148(sp),a1
 4f8:	45f9 0000 07ee 	lea 7ee <KPutCharX>,a2
 4fe:	97cb           	suba.l a3,a3
 500:	4eae fdf6      	jsr -522(a6)
}
 504:	4cdf 4c00      	movem.l (sp)+,a2-a3/a6
 508:	4fef 0080      	lea 128(sp),sp
 50c:	4e75           	rts

0000050e <_ZL16interruptHandlerv>:
static __attribute__((interrupt)) void interruptHandler() {
 50e:	2f08           	move.l a0,-(sp)
 510:	2f00           	move.l d0,-(sp)
	hw->intreq=(1<<INTB_VERTB); hw->intreq=(1<<INTB_VERTB); //reset vbl req. twice for a4000 bug.
 512:	2079 0000 28bc 	movea.l 28bc <hw>,a0
 518:	317c 0020 009c 	move.w #32,156(a0)
 51e:	317c 0020 009c 	move.w #32,156(a0)
	bgcolor++;
 524:	3039 0000 28ae 	move.w 28ae <bgcolor>,d0
 52a:	5240           	addq.w #1,d0
 52c:	33c0 0000 28ae 	move.w d0,28ae <bgcolor>
}
 532:	201f           	move.l (sp)+,d0
 534:	205f           	movea.l (sp)+,a0
 536:	4e73           	rte

00000538 <_Z7WaitVblv>:
void WaitVbl() {
 538:	518f           	subq.l #8,sp
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 53a:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.fc12646f+0xdfb0be>,d0
 540:	2e80           	move.l d0,(sp)
		vpos&=0x1ff00;
 542:	2017           	move.l (sp),d0
 544:	0280 0001 ff00 	andi.l #130816,d0
 54a:	2e80           	move.l d0,(sp)
		if (vpos!=(311<<8))
 54c:	2017           	move.l (sp),d0
 54e:	0c80 0001 3700 	cmpi.l #79616,d0
 554:	67e4           	beq.s 53a <_Z7WaitVblv+0x2>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 556:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.fc12646f+0xdfb0be>,d0
 55c:	2f40 0004      	move.l d0,4(sp)
		vpos&=0x1ff00;
 560:	202f 0004      	move.l 4(sp),d0
 564:	0280 0001 ff00 	andi.l #130816,d0
 56a:	2f40 0004      	move.l d0,4(sp)
		if (vpos==(311<<8))
 56e:	202f 0004      	move.l 4(sp),d0
 572:	0c80 0001 3700 	cmpi.l #79616,d0
 578:	66dc           	bne.s 556 <_Z7WaitVblv+0x1e>
}
 57a:	508f           	addq.l #8,sp
 57c:	4e75           	rts

0000057e <memcpy>:
{
 57e:	48e7 3820      	movem.l d2-d4/a2,-(sp)
 582:	202f 0014      	move.l 20(sp),d0
 586:	226f 0018      	movea.l 24(sp),a1
 58a:	222f 001c      	move.l 28(sp),d1
	while(len--)
 58e:	2601           	move.l d1,d3
 590:	5383           	subq.l #1,d3
 592:	4a81           	tst.l d1
 594:	6762           	beq.s 5f8 <memcpy+0x7a>
 596:	2040           	movea.l d0,a0
 598:	5888           	addq.l #4,a0
 59a:	b1c9           	cmpa.l a1,a0
 59c:	53c2           	sl.s d2
 59e:	4402           	neg.b d2
 5a0:	41e9 0004      	lea 4(a1),a0
 5a4:	b1c0           	cmpa.l d0,a0
 5a6:	53c4           	sl.s d4
 5a8:	4404           	neg.b d4
 5aa:	8404           	or.b d4,d2
 5ac:	7808           	moveq #8,d4
 5ae:	b883           	cmp.l d3,d4
 5b0:	55c4           	sc.s d4
 5b2:	4404           	neg.b d4
 5b4:	c404           	and.b d4,d2
 5b6:	6746           	beq.s 5fe <memcpy+0x80>
 5b8:	2409           	move.l a1,d2
 5ba:	8480           	or.l d0,d2
 5bc:	7803           	moveq #3,d4
 5be:	c484           	and.l d4,d2
 5c0:	663c           	bne.s 5fe <memcpy+0x80>
 5c2:	2049           	movea.l a1,a0
 5c4:	2440           	movea.l d0,a2
 5c6:	74fc           	moveq #-4,d2
 5c8:	c481           	and.l d1,d2
 5ca:	d489           	add.l a1,d2
		*d++ = *s++;
 5cc:	24d8           	move.l (a0)+,(a2)+
 5ce:	b488           	cmp.l a0,d2
 5d0:	66fa           	bne.s 5cc <memcpy+0x4e>
 5d2:	74fc           	moveq #-4,d2
 5d4:	c481           	and.l d1,d2
 5d6:	2040           	movea.l d0,a0
 5d8:	d1c2           	adda.l d2,a0
 5da:	d3c2           	adda.l d2,a1
 5dc:	9682           	sub.l d2,d3
 5de:	b481           	cmp.l d1,d2
 5e0:	6716           	beq.s 5f8 <memcpy+0x7a>
 5e2:	1091           	move.b (a1),(a0)
	while(len--)
 5e4:	4a83           	tst.l d3
 5e6:	6710           	beq.s 5f8 <memcpy+0x7a>
		*d++ = *s++;
 5e8:	1169 0001 0001 	move.b 1(a1),1(a0)
	while(len--)
 5ee:	5383           	subq.l #1,d3
 5f0:	6706           	beq.s 5f8 <memcpy+0x7a>
		*d++ = *s++;
 5f2:	1169 0002 0002 	move.b 2(a1),2(a0)
}
 5f8:	4cdf 041c      	movem.l (sp)+,d2-d4/a2
 5fc:	4e75           	rts
 5fe:	2040           	movea.l d0,a0
 600:	d289           	add.l a1,d1
		*d++ = *s++;
 602:	10d9           	move.b (a1)+,(a0)+
	while(len--)
 604:	b289           	cmp.l a1,d1
 606:	67f0           	beq.s 5f8 <memcpy+0x7a>
		*d++ = *s++;
 608:	10d9           	move.b (a1)+,(a0)+
	while(len--)
 60a:	b289           	cmp.l a1,d1
 60c:	66f4           	bne.s 602 <memcpy+0x84>
 60e:	60e8           	bra.s 5f8 <memcpy+0x7a>

00000610 <memset>:
{
 610:	48e7 3f30      	movem.l d2-d7/a2-a3,-(sp)
 614:	202f 0024      	move.l 36(sp),d0
 618:	2a2f 0028      	move.l 40(sp),d5
 61c:	226f 002c      	movea.l 44(sp),a1
	while(len-- > 0)
 620:	2809           	move.l a1,d4
 622:	5384           	subq.l #1,d4
 624:	b2fc 0000      	cmpa.w #0,a1
 628:	6700 00ae      	beq.w 6d8 <memset+0xc8>
 62c:	1e05           	move.b d5,d7
 62e:	2200           	move.l d0,d1
 630:	4481           	neg.l d1
 632:	7403           	moveq #3,d2
 634:	c282           	and.l d2,d1
 636:	7c05           	moveq #5,d6
		*ptr++ = val;
 638:	2440           	movea.l d0,a2
 63a:	bc84           	cmp.l d4,d6
 63c:	646a           	bcc.s 6a8 <memset+0x98>
 63e:	4a81           	tst.l d1
 640:	6724           	beq.s 666 <memset+0x56>
 642:	14c5           	move.b d5,(a2)+
	while(len-- > 0)
 644:	5384           	subq.l #1,d4
 646:	7401           	moveq #1,d2
 648:	b481           	cmp.l d1,d2
 64a:	671a           	beq.s 666 <memset+0x56>
		*ptr++ = val;
 64c:	2440           	movea.l d0,a2
 64e:	548a           	addq.l #2,a2
 650:	2040           	movea.l d0,a0
 652:	1145 0001      	move.b d5,1(a0)
	while(len-- > 0)
 656:	5384           	subq.l #1,d4
 658:	7403           	moveq #3,d2
 65a:	b481           	cmp.l d1,d2
 65c:	6608           	bne.s 666 <memset+0x56>
		*ptr++ = val;
 65e:	528a           	addq.l #1,a2
 660:	1145 0002      	move.b d5,2(a0)
	while(len-- > 0)
 664:	5384           	subq.l #1,d4
 666:	2609           	move.l a1,d3
 668:	9681           	sub.l d1,d3
 66a:	7c00           	moveq #0,d6
 66c:	1c05           	move.b d5,d6
 66e:	2406           	move.l d6,d2
 670:	4842           	swap d2
 672:	4242           	clr.w d2
 674:	2042           	movea.l d2,a0
 676:	2406           	move.l d6,d2
 678:	e14a           	lsl.w #8,d2
 67a:	4842           	swap d2
 67c:	4242           	clr.w d2
 67e:	e18e           	lsl.l #8,d6
 680:	2646           	movea.l d6,a3
 682:	2c08           	move.l a0,d6
 684:	8486           	or.l d6,d2
 686:	2c0b           	move.l a3,d6
 688:	8486           	or.l d6,d2
 68a:	1407           	move.b d7,d2
 68c:	2040           	movea.l d0,a0
 68e:	d1c1           	adda.l d1,a0
 690:	72fc           	moveq #-4,d1
 692:	c283           	and.l d3,d1
 694:	d288           	add.l a0,d1
		*ptr++ = val;
 696:	20c2           	move.l d2,(a0)+
 698:	b1c1           	cmpa.l d1,a0
 69a:	66fa           	bne.s 696 <memset+0x86>
 69c:	72fc           	moveq #-4,d1
 69e:	c283           	and.l d3,d1
 6a0:	d5c1           	adda.l d1,a2
 6a2:	9881           	sub.l d1,d4
 6a4:	b283           	cmp.l d3,d1
 6a6:	6730           	beq.s 6d8 <memset+0xc8>
 6a8:	1485           	move.b d5,(a2)
	while(len-- > 0)
 6aa:	4a84           	tst.l d4
 6ac:	672a           	beq.s 6d8 <memset+0xc8>
		*ptr++ = val;
 6ae:	1545 0001      	move.b d5,1(a2)
	while(len-- > 0)
 6b2:	7201           	moveq #1,d1
 6b4:	b284           	cmp.l d4,d1
 6b6:	6720           	beq.s 6d8 <memset+0xc8>
		*ptr++ = val;
 6b8:	1545 0002      	move.b d5,2(a2)
	while(len-- > 0)
 6bc:	7402           	moveq #2,d2
 6be:	b484           	cmp.l d4,d2
 6c0:	6716           	beq.s 6d8 <memset+0xc8>
		*ptr++ = val;
 6c2:	1545 0003      	move.b d5,3(a2)
	while(len-- > 0)
 6c6:	7c03           	moveq #3,d6
 6c8:	bc84           	cmp.l d4,d6
 6ca:	670c           	beq.s 6d8 <memset+0xc8>
		*ptr++ = val;
 6cc:	1545 0004      	move.b d5,4(a2)
	while(len-- > 0)
 6d0:	5984           	subq.l #4,d4
 6d2:	6704           	beq.s 6d8 <memset+0xc8>
		*ptr++ = val;
 6d4:	1545 0005      	move.b d5,5(a2)
}
 6d8:	4cdf 0cfc      	movem.l (sp)+,d2-d7/a2-a3
 6dc:	4e75           	rts

000006de <strlen>:
{
 6de:	206f 0004      	movea.l 4(sp),a0
	unsigned long t=0;
 6e2:	7000           	moveq #0,d0
	while(*s++)
 6e4:	4a10           	tst.b (a0)
 6e6:	6708           	beq.s 6f0 <strlen+0x12>
		t++;
 6e8:	5280           	addq.l #1,d0
	while(*s++)
 6ea:	4a30 0800      	tst.b (0,a0,d0.l)
 6ee:	66f8           	bne.s 6e8 <strlen+0xa>
}
 6f0:	4e75           	rts
 6f2:	4e71           	nop

000006f4 <__mulsi3>:
 
	.text
	FUNC(__mulsi3)
	.globl	SYM (__mulsi3)
SYM (__mulsi3):
	movew	sp@(4), d0	/* x0 -> d0 */
 6f4:	302f 0004      	move.w 4(sp),d0
	muluw	sp@(10), d0	/* x0*y1 */
 6f8:	c0ef 000a      	mulu.w 10(sp),d0
	movew	sp@(6), d1	/* x1 -> d1 */
 6fc:	322f 0006      	move.w 6(sp),d1
	muluw	sp@(8), d1	/* x1*y0 */
 700:	c2ef 0008      	mulu.w 8(sp),d1
	addw	d1, d0
 704:	d041           	add.w d1,d0
	swap	d0
 706:	4840           	swap d0
	clrw	d0
 708:	4240           	clr.w d0
	movew	sp@(6), d1	/* x1 -> d1 */
 70a:	322f 0006      	move.w 6(sp),d1
	muluw	sp@(10), d1	/* x1*y1 */
 70e:	c2ef 000a      	mulu.w 10(sp),d1
	addl	d1, d0
 712:	d081           	add.l d1,d0

	rts
 714:	4e75           	rts

00000716 <__udivsi3>:

	.text
	FUNC(__udivsi3)
	.globl	SYM (__udivsi3)
SYM (__udivsi3):
	movel	d2, sp@-
 716:	2f02           	move.l d2,-(sp)
	movel	sp@(12), d1	/* d1 = divisor */
 718:	222f 000c      	move.l 12(sp),d1
	movel	sp@(8), d0	/* d0 = dividend */
 71c:	202f 0008      	move.l 8(sp),d0

	cmpl	IMM (0x10000), d1 /* divisor >= 2 ^ 16 ?   */
 720:	0c81 0001 0000 	cmpi.l #65536,d1
	jcc	3f		/* then try next algorithm */
 726:	6416           	bcc.s 73e <__udivsi3+0x28>
	movel	d0, d2
 728:	2400           	move.l d0,d2
	clrw	d2
 72a:	4242           	clr.w d2
	swap	d2
 72c:	4842           	swap d2
	divu	d1, d2          /* high quotient in lower word */
 72e:	84c1           	divu.w d1,d2
	movew	d2, d0		/* save high quotient */
 730:	3002           	move.w d2,d0
	swap	d0
 732:	4840           	swap d0
	movew	sp@(10), d2	/* get low dividend + high rest */
 734:	342f 000a      	move.w 10(sp),d2
	divu	d1, d2		/* low quotient */
 738:	84c1           	divu.w d1,d2
	movew	d2, d0
 73a:	3002           	move.w d2,d0
	jra	6f
 73c:	6030           	bra.s 76e <__udivsi3+0x58>

3:	movel	d1, d2		/* use d2 as divisor backup */
 73e:	2401           	move.l d1,d2
4:	lsrl	IMM (1), d1	/* shift divisor */
 740:	e289           	lsr.l #1,d1
	lsrl	IMM (1), d0	/* shift dividend */
 742:	e288           	lsr.l #1,d0
	cmpl	IMM (0x10000), d1 /* still divisor >= 2 ^ 16 ?  */
 744:	0c81 0001 0000 	cmpi.l #65536,d1
	jcc	4b
 74a:	64f4           	bcc.s 740 <__udivsi3+0x2a>
	divu	d1, d0		/* now we have 16-bit divisor */
 74c:	80c1           	divu.w d1,d0
	andl	IMM (0xffff), d0 /* mask out divisor, ignore remainder */
 74e:	0280 0000 ffff 	andi.l #65535,d0

/* Multiply the 16-bit tentative quotient with the 32-bit divisor.  Because of
   the operand ranges, this might give a 33-bit product.  If this product is
   greater than the dividend, the tentative quotient was too large. */
	movel	d2, d1
 754:	2202           	move.l d2,d1
	mulu	d0, d1		/* low part, 32 bits */
 756:	c2c0           	mulu.w d0,d1
	swap	d2
 758:	4842           	swap d2
	mulu	d0, d2		/* high part, at most 17 bits */
 75a:	c4c0           	mulu.w d0,d2
	swap	d2		/* align high part with low part */
 75c:	4842           	swap d2
	tstw	d2		/* high part 17 bits? */
 75e:	4a42           	tst.w d2
	jne	5f		/* if 17 bits, quotient was too large */
 760:	660a           	bne.s 76c <__udivsi3+0x56>
	addl	d2, d1		/* add parts */
 762:	d282           	add.l d2,d1
	jcs	5f		/* if sum is 33 bits, quotient was too large */
 764:	6506           	bcs.s 76c <__udivsi3+0x56>
	cmpl	sp@(8), d1	/* compare the sum with the dividend */
 766:	b2af 0008      	cmp.l 8(sp),d1
	jls	6f		/* if sum > dividend, quotient was too large */
 76a:	6302           	bls.s 76e <__udivsi3+0x58>
5:	subql	IMM (1), d0	/* adjust quotient */
 76c:	5380           	subq.l #1,d0

6:	movel	sp@+, d2
 76e:	241f           	move.l (sp)+,d2
	rts
 770:	4e75           	rts

00000772 <__divsi3>:

	.text
	FUNC(__divsi3)
	.globl	SYM (__divsi3)
SYM (__divsi3):
	movel	d2, sp@-
 772:	2f02           	move.l d2,-(sp)

	moveq	IMM (1), d2	/* sign of result stored in d2 (=1 or =-1) */
 774:	7401           	moveq #1,d2
	movel	sp@(12), d1	/* d1 = divisor */
 776:	222f 000c      	move.l 12(sp),d1
	jpl	1f
 77a:	6a04           	bpl.s 780 <__divsi3+0xe>
	negl	d1
 77c:	4481           	neg.l d1
	negb	d2		/* change sign because divisor <0  */
 77e:	4402           	neg.b d2
1:	movel	sp@(8), d0	/* d0 = dividend */
 780:	202f 0008      	move.l 8(sp),d0
	jpl	2f
 784:	6a04           	bpl.s 78a <__divsi3+0x18>
	negl	d0
 786:	4480           	neg.l d0
	negb	d2
 788:	4402           	neg.b d2

2:	movel	d1, sp@-
 78a:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 78c:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__udivsi3)	/* divide abs(dividend) by abs(divisor) */
 78e:	6186           	bsr.s 716 <__udivsi3>
	addql	IMM (8), sp
 790:	508f           	addq.l #8,sp

	tstb	d2
 792:	4a02           	tst.b d2
	jpl	3f
 794:	6a02           	bpl.s 798 <__divsi3+0x26>
	negl	d0
 796:	4480           	neg.l d0

3:	movel	sp@+, d2
 798:	241f           	move.l (sp)+,d2
	rts
 79a:	4e75           	rts

0000079c <__modsi3>:

	.text
	FUNC(__modsi3)
	.globl	SYM (__modsi3)
SYM (__modsi3):
	movel	sp@(8), d1	/* d1 = divisor */
 79c:	222f 0008      	move.l 8(sp),d1
	movel	sp@(4), d0	/* d0 = dividend */
 7a0:	202f 0004      	move.l 4(sp),d0
	movel	d1, sp@-
 7a4:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 7a6:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__divsi3)
 7a8:	61c8           	bsr.s 772 <__divsi3>
	addql	IMM (8), sp
 7aa:	508f           	addq.l #8,sp
	movel	sp@(8), d1	/* d1 = divisor */
 7ac:	222f 0008      	move.l 8(sp),d1
	movel	d1, sp@-
 7b0:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 7b2:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
 7b4:	6100 ff3e      	bsr.w 6f4 <__mulsi3>
	addql	IMM (8), sp
 7b8:	508f           	addq.l #8,sp
	movel	sp@(4), d1	/* d1 = dividend */
 7ba:	222f 0004      	move.l 4(sp),d1
	subl	d0, d1		/* d1 = a - (a/b)*b */
 7be:	9280           	sub.l d0,d1
	movel	d1, d0
 7c0:	2001           	move.l d1,d0
	rts
 7c2:	4e75           	rts

000007c4 <__umodsi3>:

	.text
	FUNC(__umodsi3)
	.globl	SYM (__umodsi3)
SYM (__umodsi3):
	movel	sp@(8), d1	/* d1 = divisor */
 7c4:	222f 0008      	move.l 8(sp),d1
	movel	sp@(4), d0	/* d0 = dividend */
 7c8:	202f 0004      	move.l 4(sp),d0
	movel	d1, sp@-
 7cc:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 7ce:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__udivsi3)
 7d0:	6100 ff44      	bsr.w 716 <__udivsi3>
	addql	IMM (8), sp
 7d4:	508f           	addq.l #8,sp
	movel	sp@(8), d1	/* d1 = divisor */
 7d6:	222f 0008      	move.l 8(sp),d1
	movel	d1, sp@-
 7da:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 7dc:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
 7de:	6100 ff14      	bsr.w 6f4 <__mulsi3>
	addql	IMM (8), sp
 7e2:	508f           	addq.l #8,sp
	movel	sp@(4), d1	/* d1 = dividend */
 7e4:	222f 0004      	move.l 4(sp),d1
	subl	d0, d1		/* d1 = a - (a/b)*b */
 7e8:	9280           	sub.l d0,d1
	movel	d1, d0
 7ea:	2001           	move.l d1,d0
	rts
 7ec:	4e75           	rts

000007ee <KPutCharX>:
	.text
	FUNC(KPutCharX)
	.globl	SYM (KPutCharX)

SYM(KPutCharX):
    move.l  a6, -(sp)
 7ee:	2f0e           	move.l a6,-(sp)
    move.l  4.w, a6
 7f0:	2c78 0004      	movea.l 4 <_start+0x4>,a6
    jsr     -0x204(a6)
 7f4:	4eae fdfc      	jsr -516(a6)
    movea.l (sp)+, a6
 7f8:	2c5f           	movea.l (sp)+,a6
    rts
 7fa:	4e75           	rts

000007fc <PutChar>:
	.text
	FUNC(PutChar)
	.globl	SYM (PutChar)

SYM(PutChar):
	move.b d0, (a3)+
 7fc:	16c0           	move.b d0,(a3)+
	rts
 7fe:	4e75           	rts
