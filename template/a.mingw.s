
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
   4:	263c 0000 28ba 	move.l #10426,d3
   a:	0483 0000 28ba 	subi.l #10426,d3
  10:	e483           	asr.l #2,d3
	for (i = 0; i < count; i++)
  12:	6712           	beq.s 26 <_start+0x26>
  14:	45f9 0000 28ba 	lea 28ba <__fini_array_end>,a2
  1a:	7400           	moveq #0,d2
		__preinit_array_start[i]();
  1c:	205a           	movea.l (a2)+,a0
  1e:	4e90           	jsr (a0)
	for (i = 0; i < count; i++)
  20:	5282           	addq.l #1,d2
  22:	b483           	cmp.l d3,d2
  24:	66f6           	bne.s 1c <_start+0x1c>

	count = __init_array_end - __init_array_start;
  26:	263c 0000 28ba 	move.l #10426,d3
  2c:	0483 0000 28ba 	subi.l #10426,d3
  32:	e483           	asr.l #2,d3
	for (i = 0; i < count; i++)
  34:	6712           	beq.s 48 <_start+0x48>
  36:	45f9 0000 28ba 	lea 28ba <__fini_array_end>,a2
  3c:	7400           	moveq #0,d2
		__init_array_start[i]();
  3e:	205a           	movea.l (a2)+,a0
  40:	4e90           	jsr (a0)
	for (i = 0; i < count; i++)
  42:	5282           	addq.l #1,d2
  44:	b483           	cmp.l d3,d2
  46:	66f6           	bne.s 3e <_start+0x3e>

	main();
  48:	4eb9 0000 0074 	jsr 74 <main>

	// call dtors
	count = __fini_array_end - __fini_array_start;
  4e:	243c 0000 28ba 	move.l #10426,d2
  54:	0482 0000 28ba 	subi.l #10426,d2
  5a:	e482           	asr.l #2,d2
	for (i = count; i > 0; i--)
  5c:	6710           	beq.s 6e <_start+0x6e>
  5e:	45f9 0000 28ba 	lea 28ba <__fini_array_end>,a2
		__fini_array_start[i - 1]();
  64:	5382           	subq.l #1,d2
  66:	2062           	movea.l -(a2),a0
  68:	4e90           	jsr (a0)
	for (i = count; i > 0; i--)
  6a:	4a82           	tst.l d2
  6c:	66f6           	bne.s 64 <_start+0x64>
}
  6e:	4cdf 040c      	movem.l (sp)+,d2-d3/a2
  72:	4e75           	rts

00000074 <main>:
	};

	TestClass staticClass(4);
#endif

int main() {
  74:	4fef fff4      	lea -12(sp),sp
  78:	48e7 3132      	movem.l d2-d3/d7/a2-a3/a6,-(sp)
	SysBase = *((struct ExecBase**)4UL);
  7c:	2c78 0004      	movea.l 4 <_start+0x4>,a6
  80:	23ce 0000 28d6 	move.l a6,28d6 <SysBase>
	hw = (struct Custom*)0xdff000;
  86:	23fc 00df f000 	move.l #14675968,28de <hw>
  8c:	0000 28de 

	// We will use the graphics library only to locate and restore the system copper list once we are through.
	GfxBase = (struct GfxBase *)OpenLibrary("graphics.library",0);
  90:	43f9 0000 0871 	lea 871 <incbin_colors_end+0x49>,a1
  96:	7000           	moveq #0,d0
  98:	4eae fdd8      	jsr -552(a6)
  9c:	23c0 0000 28d2 	move.l d0,28d2 <GfxBase>
	if (!GfxBase)
  a2:	6700 02e0      	beq.w 384 <main+0x310>
		Exit(0);

	// used for printing
	DOSBase = (struct DosLibrary*)OpenLibrary("dos.library", 0);
  a6:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
  ac:	43f9 0000 0882 	lea 882 <incbin_colors_end+0x5a>,a1
  b2:	7000           	moveq #0,d0
  b4:	4eae fdd8      	jsr -552(a6)
  b8:	23c0 0000 28ce 	move.l d0,28ce <DOSBase>
	if (!DOSBase)
  be:	6700 02b8      	beq.w 378 <main+0x304>
		Exit(0);

#ifdef __cplusplus
	KPrintF("Hello debugger from Amiga: %ld!\n", staticClass.i);
#else
	KPrintF("Hello debugger from Amiga!\n");
  c2:	4879 0000 088e 	pea 88e <incbin_colors_end+0x66>
  c8:	4eb9 0000 0424 	jsr 424 <KPrintF>
#endif
	Write(Output(), (APTR)"Hello console!\n", 15);
  ce:	2c79 0000 28ce 	movea.l 28ce <DOSBase>,a6
  d4:	4eae ffc4      	jsr -60(a6)
  d8:	2c79 0000 28ce 	movea.l 28ce <DOSBase>,a6
  de:	2200           	move.l d0,d1
  e0:	243c 0000 08aa 	move.l #2218,d2
  e6:	760f           	moveq #15,d3
  e8:	4eae ffd0      	jsr -48(a6)
	Delay(50);
  ec:	2c79 0000 28ce 	movea.l 28ce <DOSBase>,a6
  f2:	7232           	moveq #50,d1
  f4:	4eae ff3a      	jsr -198(a6)

void warpmode(int on) // bool
{
	long(*UaeConf)(long mode, int index, const char* param, int param_len, char* outbuf, int outbuf_len);
	UaeConf = (long(*)(long, int, const char*, int, char*, int))0xf0ff60;
	if(*((ULONG *)UaeConf)) {
  f8:	588f           	addq.l #4,sp
  fa:	4ab9 00f0 ff60 	tst.l f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
 100:	671c           	beq.s 11e <main+0xaa>
 102:	4878 0001      	pea 1 <_start+0x1>
 106:	45f9 0000 048c 	lea 48c <warpmode.part.0>,a2
 10c:	4e92           	jsr (a2)
 10e:	588f           	addq.l #4,sp
 110:	4ab9 00f0 ff60 	tst.l f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
 116:	6706           	beq.s 11e <main+0xaa>
 118:	42a7           	clr.l -(sp)
 11a:	4e92           	jsr (a2)
 11c:	588f           	addq.l #4,sp
	ActiView=GfxBase->ActiView; //store current view
 11e:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 124:	23ee 0022 0000 	move.l 34(a6),28bc <ActiView>
 12a:	28bc 
	OwnBlitter();
 12c:	4eae fe38      	jsr -456(a6)
	WaitBlit();	
 130:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 136:	4eae ff1c      	jsr -228(a6)
	Disable();
 13a:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 140:	4eae ff88      	jsr -120(a6)
	SystemADKCON=hw->adkconr;
 144:	2679 0000 28de 	movea.l 28de <hw>,a3
 14a:	302b 0010      	move.w 16(a3),d0
 14e:	33c0 0000 28c0 	move.w d0,28c0 <SystemADKCON>
	SystemInts=hw->intenar;
 154:	302b 001c      	move.w 28(a3),d0
 158:	33c0 0000 28c4 	move.w d0,28c4 <SystemInts>
	SystemDMA=hw->dmaconr;
 15e:	302b 0002      	move.w 2(a3),d0
 162:	33c0 0000 28c2 	move.w d0,28c2 <SystemDMA>
	hw->intena=0x7fff;//disable all interrupts
 168:	377c 7fff 009a 	move.w #32767,154(a3)
	hw->intreq=0x7fff;//Clear any interrupts that were pending
 16e:	377c 7fff 009c 	move.w #32767,156(a3)
	WaitVbl();
 174:	45f9 0000 03b4 	lea 3b4 <WaitVbl>,a2
 17a:	4e92           	jsr (a2)
	WaitVbl();
 17c:	4e92           	jsr (a2)
	hw->dmacon=0x7fff;//Clear all DMA channels
 17e:	377c 7fff 0096 	move.w #32767,150(a3)
	for(int a=0;a<32;a++)
 184:	7200           	moveq #0,d1
		hw->color[a]=0;
 186:	2001           	move.l d1,d0
 188:	0680 0000 00c0 	addi.l #192,d0
 18e:	d080           	add.l d0,d0
 190:	37bc 0000 0800 	move.w #0,(0,a3,d0.l)
	for(int a=0;a<32;a++)
 196:	5281           	addq.l #1,d1
 198:	7020           	moveq #32,d0
 19a:	b081           	cmp.l d1,d0
 19c:	66e8           	bne.s 186 <main+0x112>
	LoadView(0);
 19e:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 1a4:	93c9           	suba.l a1,a1
 1a6:	4eae ff22      	jsr -222(a6)
	WaitTOF();
 1aa:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 1b0:	4eae fef2      	jsr -270(a6)
	WaitTOF();
 1b4:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 1ba:	4eae fef2      	jsr -270(a6)
	WaitVbl();
 1be:	4e92           	jsr (a2)
	WaitVbl();
 1c0:	4e92           	jsr (a2)
	UWORD getvbr[] = { 0x4e7a, 0x0801, 0x4e73 }; // MOVEC.L VBR,D0 RTE
 1c2:	3f7c 4e7a 001e 	move.w #20090,30(sp)
 1c8:	3f7c 0801 0020 	move.w #2049,32(sp)
 1ce:	3f7c 4e73 0022 	move.w #20083,34(sp)
	if (SysBase->AttnFlags & AFF_68010) 
 1d4:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 1da:	082e 0000 0129 	btst #0,297(a6)
 1e0:	6700 01cc      	beq.w 3ae <main+0x33a>
		vbr = (APTR)Supervisor((ULONG (*)())getvbr);
 1e4:	7e1e           	moveq #30,d7
 1e6:	de8f           	add.l sp,d7
 1e8:	cf8d           	exg d7,a5
 1ea:	4eae ffe2      	jsr -30(a6)
 1ee:	cf8d           	exg d7,a5
	VBR=GetVBR();
 1f0:	23c0 0000 28ca 	move.l d0,28ca <VBR>
	return *(volatile APTR*)(((UBYTE*)VBR)+0x6c);
 1f6:	2079 0000 28ca 	movea.l 28ca <VBR>,a0
 1fc:	2428 006c      	move.l 108(a0),d2
	SystemIrq=GetInterruptHandler(); //store interrupt register
 200:	23c2 0000 28c6 	move.l d2,28c6 <SystemIrq>
	warpmode(1);
	// TODO: precalc stuff here
	warpmode(0);

	TakeSystem();
	WaitVbl();
 206:	4e92           	jsr (a2)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 208:	2079 0000 28ca 	movea.l 28ca <VBR>,a0
 20e:	217c 0000 03fa 	move.l #1018,108(a0)
 214:	006c 

	// DEMO
	SetInterruptHandler((APTR)interruptHandler);
	hw->intena=(1<<INTB_SETCLR)|(1<<INTB_INTEN)|(1<<INTB_VERTB);
 216:	2679 0000 28de 	movea.l 28de <hw>,a3
 21c:	377c c020 009a 	move.w #-16352,154(a3)
	hw->intreq=1<<INTB_VERTB;//reset vbl req
 222:	377c 0020 009c 	move.w #32,156(a3)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 228:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.90f89dfa+0xbf95ac>,d0

	while(!MouseLeft()) {
 22e:	0800 0006      	btst #6,d0
 232:	676e           	beq.s 2a2 <main+0x22e>
 234:	41f9 0000 07a8 	lea 7a8 <incbin_colors_start>,a0
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 23a:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.90f89dfa+0xdfa5af>,d0
 240:	2f40 001e      	move.l d0,30(sp)
		vpos&=0x1ff00;
 244:	202f 001e      	move.l 30(sp),d0
 248:	0280 0001 ff00 	andi.l #130816,d0
 24e:	2f40 001e      	move.l d0,30(sp)
		if (vpos!=(311<<8))
 252:	202f 001e      	move.l 30(sp),d0
 256:	0c80 0001 3700 	cmpi.l #79616,d0
 25c:	67dc           	beq.s 23a <main+0x1c6>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 25e:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.90f89dfa+0xdfa5af>,d0
 264:	2f40 001a      	move.l d0,26(sp)
		vpos&=0x1ff00;
 268:	202f 001a      	move.l 26(sp),d0
 26c:	0280 0001 ff00 	andi.l #130816,d0
 272:	2f40 001a      	move.l d0,26(sp)
		if (vpos==(311<<8))
 276:	202f 001a      	move.l 26(sp),d0
 27a:	0c80 0001 3700 	cmpi.l #79616,d0
 280:	66dc           	bne.s 25e <main+0x1ea>
		WaitVbl();
		// DEMO - set colors from INCBIN (contains 64 colors)
		hw->color[0] = ((UWORD*)colors)[frameCounter & 63];
 282:	2039 0000 28da 	move.l 28da <frameCounter>,d0
 288:	723f           	moveq #63,d1
 28a:	c081           	and.l d1,d0
 28c:	d080           	add.l d0,d0
 28e:	3030 0800      	move.w (0,a0,d0.l),d0
 292:	3740 0180      	move.w d0,384(a3)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 296:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.90f89dfa+0xbf95ac>,d0
	while(!MouseLeft()) {
 29c:	0800 0006      	btst #6,d0
 2a0:	6698           	bne.s 23a <main+0x1c6>
	WaitVbl();
 2a2:	4e92           	jsr (a2)
	UWORD tst=*(volatile UWORD*)&hw->dmaconr; //for compatiblity a1000
 2a4:	302b 0002      	move.w 2(a3),d0
	while (*(volatile UWORD*)&hw->dmaconr&(1<<14)) {} //blitter busy wait
 2a8:	302b 0002      	move.w 2(a3),d0
 2ac:	0800 000e      	btst #14,d0
 2b0:	66f6           	bne.s 2a8 <main+0x234>
	hw->intena=0x7fff;//disable all interrupts
 2b2:	377c 7fff 009a 	move.w #32767,154(a3)
	hw->intreq=0x7fff;//Clear any interrupts that were pending
 2b8:	377c 7fff 009c 	move.w #32767,156(a3)
	hw->dmacon=0x7fff;//Clear all DMA channels
 2be:	377c 7fff 0096 	move.w #32767,150(a3)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 2c4:	2079 0000 28ca 	movea.l 28ca <VBR>,a0
 2ca:	2142 006c      	move.l d2,108(a0)
	hw->cop1lc=(ULONG)GfxBase->copinit;
 2ce:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 2d4:	276e 0026 0080 	move.l 38(a6),128(a3)
	hw->cop2lc=(ULONG)GfxBase->LOFlist;
 2da:	276e 0032 0084 	move.l 50(a6),132(a3)
	hw->copjmp1=0x7fff; //start coppper
 2e0:	377c 7fff 0088 	move.w #32767,136(a3)
	hw->intena=SystemInts|0x8000;
 2e6:	3039 0000 28c4 	move.w 28c4 <SystemInts>,d0
 2ec:	0040 8000      	ori.w #-32768,d0
 2f0:	3740 009a      	move.w d0,154(a3)
	hw->dmacon=SystemDMA|0x8000;
 2f4:	3039 0000 28c2 	move.w 28c2 <SystemDMA>,d0
 2fa:	0040 8000      	ori.w #-32768,d0
 2fe:	3740 0096      	move.w d0,150(a3)
	hw->adkcon=SystemADKCON|0x8000;
 302:	3039 0000 28c0 	move.w 28c0 <SystemADKCON>,d0
 308:	0040 8000      	ori.w #-32768,d0
 30c:	3740 009e      	move.w d0,158(a3)
	LoadView(ActiView);
 310:	2279 0000 28bc 	movea.l 28bc <ActiView>,a1
 316:	4eae ff22      	jsr -222(a6)
	WaitTOF();
 31a:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 320:	4eae fef2      	jsr -270(a6)
	WaitTOF();
 324:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 32a:	4eae fef2      	jsr -270(a6)
	WaitBlit();	
 32e:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 334:	4eae ff1c      	jsr -228(a6)
	DisownBlitter();
 338:	2c79 0000 28d2 	movea.l 28d2 <GfxBase>,a6
 33e:	4eae fe32      	jsr -462(a6)
	Enable();
 342:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 348:	4eae ff82      	jsr -126(a6)
	}

	// END
	FreeSystem();

	CloseLibrary((struct Library*)DOSBase);
 34c:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 352:	2279 0000 28ce 	movea.l 28ce <DOSBase>,a1
 358:	4eae fe62      	jsr -414(a6)
	CloseLibrary((struct Library*)GfxBase);
 35c:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 362:	2279 0000 28d2 	movea.l 28d2 <GfxBase>,a1
 368:	4eae fe62      	jsr -414(a6)
}
 36c:	7000           	moveq #0,d0
 36e:	4cdf 4c8c      	movem.l (sp)+,d2-d3/d7/a2-a3/a6
 372:	4fef 000c      	lea 12(sp),sp
 376:	4e75           	rts
		Exit(0);
 378:	9dce           	suba.l a6,a6
 37a:	7200           	moveq #0,d1
 37c:	4eae ff70      	jsr -144(a6)
 380:	6000 fd40      	bra.w c2 <main+0x4e>
		Exit(0);
 384:	2c79 0000 28ce 	movea.l 28ce <DOSBase>,a6
 38a:	7200           	moveq #0,d1
 38c:	4eae ff70      	jsr -144(a6)
	DOSBase = (struct DosLibrary*)OpenLibrary("dos.library", 0);
 390:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 396:	43f9 0000 0882 	lea 882 <incbin_colors_end+0x5a>,a1
 39c:	7000           	moveq #0,d0
 39e:	4eae fdd8      	jsr -552(a6)
 3a2:	23c0 0000 28ce 	move.l d0,28ce <DOSBase>
	if (!DOSBase)
 3a8:	6600 fd18      	bne.w c2 <main+0x4e>
 3ac:	60ca           	bra.s 378 <main+0x304>
	APTR vbr = 0;
 3ae:	7000           	moveq #0,d0
 3b0:	6000 fe3e      	bra.w 1f0 <main+0x17c>

000003b4 <WaitVbl>:
void WaitVbl() {
 3b4:	518f           	subq.l #8,sp
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 3b6:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.90f89dfa+0xdfa5af>,d0
 3bc:	2e80           	move.l d0,(sp)
		vpos&=0x1ff00;
 3be:	2017           	move.l (sp),d0
 3c0:	0280 0001 ff00 	andi.l #130816,d0
 3c6:	2e80           	move.l d0,(sp)
		if (vpos!=(311<<8))
 3c8:	2017           	move.l (sp),d0
 3ca:	0c80 0001 3700 	cmpi.l #79616,d0
 3d0:	67e4           	beq.s 3b6 <WaitVbl+0x2>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 3d2:	2039 00df f004 	move.l dff004 <gcc8_c_support.c.90f89dfa+0xdfa5af>,d0
 3d8:	2f40 0004      	move.l d0,4(sp)
		vpos&=0x1ff00;
 3dc:	202f 0004      	move.l 4(sp),d0
 3e0:	0280 0001 ff00 	andi.l #130816,d0
 3e6:	2f40 0004      	move.l d0,4(sp)
		if (vpos==(311<<8))
 3ea:	202f 0004      	move.l 4(sp),d0
 3ee:	0c80 0001 3700 	cmpi.l #79616,d0
 3f4:	66dc           	bne.s 3d2 <WaitVbl+0x1e>
}
 3f6:	508f           	addq.l #8,sp
 3f8:	4e75           	rts

000003fa <interruptHandler>:
static __attribute__((interrupt)) void interruptHandler() {
 3fa:	2f08           	move.l a0,-(sp)
 3fc:	2f00           	move.l d0,-(sp)
	hw->intreq=(1<<INTB_VERTB); hw->intreq=(1<<INTB_VERTB); //reset vbl req. twice for a4000 bug.
 3fe:	2079 0000 28de 	movea.l 28de <hw>,a0
 404:	317c 0020 009c 	move.w #32,156(a0)
 40a:	317c 0020 009c 	move.w #32,156(a0)
	frameCounter++;
 410:	2039 0000 28da 	move.l 28da <frameCounter>,d0
 416:	5280           	addq.l #1,d0
 418:	23c0 0000 28da 	move.l d0,28da <frameCounter>
}
 41e:	201f           	move.l (sp)+,d0
 420:	205f           	movea.l (sp)+,a0
 422:	4e73           	rte

00000424 <KPrintF>:
{
 424:	4fef ff80      	lea -128(sp),sp
 428:	48e7 0032      	movem.l a2-a3/a6,-(sp)
    if(*((ULONG *)UaeDbgLog)) {
 42c:	4ab9 00f0 ff60 	tst.l f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
 432:	6734           	beq.s 468 <KPrintF+0x44>
		RawDoFmt((CONST_STRPTR)fmt, vl, PutChar, temp);
 434:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 43a:	206f 0090      	movea.l 144(sp),a0
 43e:	43ef 0094      	lea 148(sp),a1
 442:	45f9 0000 07a4 	lea 7a4 <PutChar>,a2
 448:	47ef 000c      	lea 12(sp),a3
 44c:	4eae fdf6      	jsr -522(a6)
		UaeDbgLog(86, temp);
 450:	2f0b           	move.l a3,-(sp)
 452:	4878 0056      	pea 56 <_start+0x56>
 456:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
 45c:	508f           	addq.l #8,sp
}
 45e:	4cdf 4c00      	movem.l (sp)+,a2-a3/a6
 462:	4fef 0080      	lea 128(sp),sp
 466:	4e75           	rts
		RawDoFmt((CONST_STRPTR)fmt, vl, KPutCharX, 0);
 468:	2c79 0000 28d6 	movea.l 28d6 <SysBase>,a6
 46e:	206f 0090      	movea.l 144(sp),a0
 472:	43ef 0094      	lea 148(sp),a1
 476:	45f9 0000 0796 	lea 796 <KPutCharX>,a2
 47c:	97cb           	suba.l a3,a3
 47e:	4eae fdf6      	jsr -522(a6)
}
 482:	4cdf 4c00      	movem.l (sp)+,a2-a3/a6
 486:	4fef 0080      	lea 128(sp),sp
 48a:	4e75           	rts

0000048c <warpmode.part.0>:
void warpmode(int on) // bool
 48c:	598f           	subq.l #4,sp
 48e:	2f02           	move.l d2,-(sp)
		char outbuf;
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
 490:	4aaf 000c      	tst.l 12(sp)
 494:	674c           	beq.s 4e2 <warpmode.part.0+0x56>
 496:	4878 0001      	pea 1 <_start+0x1>
 49a:	740b           	moveq #11,d2
 49c:	d48f           	add.l sp,d2
 49e:	2f02           	move.l d2,-(sp)
 4a0:	42a7           	clr.l -(sp)
 4a2:	4879 0000 085c 	pea 85c <incbin_colors_end+0x34>
 4a8:	4878 ffff      	pea ffffffff <gcc8_c_support.c.90f89dfa+0xffffb5aa>
 4ac:	4878 0052      	pea 52 <_start+0x52>
 4b0:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
 4b6:	4fef 0018      	lea 24(sp),sp
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
 4ba:	203c 0000 0829 	move.l #2089,d0
 4c0:	4878 0001      	pea 1 <_start+0x1>
 4c4:	2f02           	move.l d2,-(sp)
 4c6:	42a7           	clr.l -(sp)
 4c8:	2f00           	move.l d0,-(sp)
 4ca:	4878 ffff      	pea ffffffff <gcc8_c_support.c.90f89dfa+0xffffb5aa>
 4ce:	4878 0052      	pea 52 <_start+0x52>
 4d2:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
	}
}
 4d8:	4fef 0018      	lea 24(sp),sp
 4dc:	241f           	move.l (sp)+,d2
 4de:	588f           	addq.l #4,sp
 4e0:	4e75           	rts
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
 4e2:	4878 0001      	pea 1 <_start+0x1>
 4e6:	740b           	moveq #11,d2
 4e8:	d48f           	add.l sp,d2
 4ea:	2f02           	move.l d2,-(sp)
 4ec:	42a7           	clr.l -(sp)
 4ee:	4879 0000 0866 	pea 866 <incbin_colors_end+0x3e>
 4f4:	4878 ffff      	pea ffffffff <gcc8_c_support.c.90f89dfa+0xffffb5aa>
 4f8:	4878 0052      	pea 52 <_start+0x52>
 4fc:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
 502:	4fef 0018      	lea 24(sp),sp
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
 506:	203c 0000 0843 	move.l #2115,d0
 50c:	4878 0001      	pea 1 <_start+0x1>
 510:	2f02           	move.l d2,-(sp)
 512:	42a7           	clr.l -(sp)
 514:	2f00           	move.l d0,-(sp)
 516:	4878 ffff      	pea ffffffff <gcc8_c_support.c.90f89dfa+0xffffb5aa>
 51a:	4878 0052      	pea 52 <_start+0x52>
 51e:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.90f89dfa+0xf0b50b>
}
 524:	4fef 0018      	lea 24(sp),sp
 528:	241f           	move.l (sp)+,d2
 52a:	588f           	addq.l #4,sp
 52c:	4e75           	rts

0000052e <strlen>:
{
 52e:	206f 0004      	movea.l 4(sp),a0
	unsigned long t=0;
 532:	7000           	moveq #0,d0
	while(*s++)
 534:	4a10           	tst.b (a0)
 536:	6708           	beq.s 540 <strlen+0x12>
		t++;
 538:	5280           	addq.l #1,d0
	while(*s++)
 53a:	4a30 0800      	tst.b (0,a0,d0.l)
 53e:	66f8           	bne.s 538 <strlen+0xa>
}
 540:	4e75           	rts

00000542 <memset>:
{
 542:	48e7 3f30      	movem.l d2-d7/a2-a3,-(sp)
 546:	202f 0024      	move.l 36(sp),d0
 54a:	282f 0028      	move.l 40(sp),d4
 54e:	226f 002c      	movea.l 44(sp),a1
	while(len-- > 0)
 552:	2a09           	move.l a1,d5
 554:	5385           	subq.l #1,d5
 556:	b2fc 0000      	cmpa.w #0,a1
 55a:	6700 00ae      	beq.w 60a <memset+0xc8>
		*ptr++ = val;
 55e:	1e04           	move.b d4,d7
 560:	2200           	move.l d0,d1
 562:	4481           	neg.l d1
 564:	7403           	moveq #3,d2
 566:	c282           	and.l d2,d1
 568:	7c05           	moveq #5,d6
 56a:	2440           	movea.l d0,a2
 56c:	bc85           	cmp.l d5,d6
 56e:	646a           	bcc.s 5da <memset+0x98>
 570:	4a81           	tst.l d1
 572:	6724           	beq.s 598 <memset+0x56>
 574:	14c4           	move.b d4,(a2)+
	while(len-- > 0)
 576:	5385           	subq.l #1,d5
 578:	7401           	moveq #1,d2
 57a:	b481           	cmp.l d1,d2
 57c:	671a           	beq.s 598 <memset+0x56>
		*ptr++ = val;
 57e:	2440           	movea.l d0,a2
 580:	548a           	addq.l #2,a2
 582:	2040           	movea.l d0,a0
 584:	1144 0001      	move.b d4,1(a0)
	while(len-- > 0)
 588:	5385           	subq.l #1,d5
 58a:	7403           	moveq #3,d2
 58c:	b481           	cmp.l d1,d2
 58e:	6608           	bne.s 598 <memset+0x56>
		*ptr++ = val;
 590:	528a           	addq.l #1,a2
 592:	1144 0002      	move.b d4,2(a0)
	while(len-- > 0)
 596:	5385           	subq.l #1,d5
 598:	2609           	move.l a1,d3
 59a:	9681           	sub.l d1,d3
 59c:	7c00           	moveq #0,d6
 59e:	1c04           	move.b d4,d6
 5a0:	2406           	move.l d6,d2
 5a2:	4842           	swap d2
 5a4:	4242           	clr.w d2
 5a6:	2042           	movea.l d2,a0
 5a8:	2404           	move.l d4,d2
 5aa:	e14a           	lsl.w #8,d2
 5ac:	4842           	swap d2
 5ae:	4242           	clr.w d2
 5b0:	e18e           	lsl.l #8,d6
 5b2:	2646           	movea.l d6,a3
 5b4:	2c08           	move.l a0,d6
 5b6:	8486           	or.l d6,d2
 5b8:	2c0b           	move.l a3,d6
 5ba:	8486           	or.l d6,d2
 5bc:	1407           	move.b d7,d2
 5be:	2040           	movea.l d0,a0
 5c0:	d1c1           	adda.l d1,a0
 5c2:	72fc           	moveq #-4,d1
 5c4:	c283           	and.l d3,d1
 5c6:	d288           	add.l a0,d1
		*ptr++ = val;
 5c8:	20c2           	move.l d2,(a0)+
	while(len-- > 0)
 5ca:	b1c1           	cmpa.l d1,a0
 5cc:	66fa           	bne.s 5c8 <memset+0x86>
 5ce:	72fc           	moveq #-4,d1
 5d0:	c283           	and.l d3,d1
 5d2:	d5c1           	adda.l d1,a2
 5d4:	9a81           	sub.l d1,d5
 5d6:	b283           	cmp.l d3,d1
 5d8:	6730           	beq.s 60a <memset+0xc8>
		*ptr++ = val;
 5da:	1484           	move.b d4,(a2)
	while(len-- > 0)
 5dc:	4a85           	tst.l d5
 5de:	672a           	beq.s 60a <memset+0xc8>
		*ptr++ = val;
 5e0:	1544 0001      	move.b d4,1(a2)
	while(len-- > 0)
 5e4:	7201           	moveq #1,d1
 5e6:	b285           	cmp.l d5,d1
 5e8:	6720           	beq.s 60a <memset+0xc8>
		*ptr++ = val;
 5ea:	1544 0002      	move.b d4,2(a2)
	while(len-- > 0)
 5ee:	7402           	moveq #2,d2
 5f0:	b485           	cmp.l d5,d2
 5f2:	6716           	beq.s 60a <memset+0xc8>
		*ptr++ = val;
 5f4:	1544 0003      	move.b d4,3(a2)
	while(len-- > 0)
 5f8:	7c03           	moveq #3,d6
 5fa:	bc85           	cmp.l d5,d6
 5fc:	670c           	beq.s 60a <memset+0xc8>
		*ptr++ = val;
 5fe:	1544 0004      	move.b d4,4(a2)
	while(len-- > 0)
 602:	5985           	subq.l #4,d5
 604:	6704           	beq.s 60a <memset+0xc8>
		*ptr++ = val;
 606:	1544 0005      	move.b d4,5(a2)
}
 60a:	4cdf 0cfc      	movem.l (sp)+,d2-d7/a2-a3
 60e:	4e75           	rts

00000610 <memcpy>:
{
 610:	48e7 3e00      	movem.l d2-d6,-(sp)
 614:	202f 0018      	move.l 24(sp),d0
 618:	222f 001c      	move.l 28(sp),d1
 61c:	262f 0020      	move.l 32(sp),d3
	while(len--)
 620:	2803           	move.l d3,d4
 622:	5384           	subq.l #1,d4
 624:	4a83           	tst.l d3
 626:	675e           	beq.s 686 <memcpy+0x76>
 628:	2041           	movea.l d1,a0
 62a:	5288           	addq.l #1,a0
 62c:	2400           	move.l d0,d2
 62e:	9488           	sub.l a0,d2
 630:	7a02           	moveq #2,d5
 632:	ba82           	cmp.l d2,d5
 634:	55c2           	sc.s d2
 636:	4402           	neg.b d2
 638:	7c08           	moveq #8,d6
 63a:	bc84           	cmp.l d4,d6
 63c:	55c5           	sc.s d5
 63e:	4405           	neg.b d5
 640:	c405           	and.b d5,d2
 642:	6748           	beq.s 68c <memcpy+0x7c>
 644:	2400           	move.l d0,d2
 646:	8481           	or.l d1,d2
 648:	7a03           	moveq #3,d5
 64a:	c485           	and.l d5,d2
 64c:	663e           	bne.s 68c <memcpy+0x7c>
 64e:	2041           	movea.l d1,a0
 650:	2240           	movea.l d0,a1
 652:	74fc           	moveq #-4,d2
 654:	c483           	and.l d3,d2
 656:	d481           	add.l d1,d2
		*d++ = *s++;
 658:	22d8           	move.l (a0)+,(a1)+
	while(len--)
 65a:	b488           	cmp.l a0,d2
 65c:	66fa           	bne.s 658 <memcpy+0x48>
 65e:	74fc           	moveq #-4,d2
 660:	c483           	and.l d3,d2
 662:	2040           	movea.l d0,a0
 664:	d1c2           	adda.l d2,a0
 666:	d282           	add.l d2,d1
 668:	9882           	sub.l d2,d4
 66a:	b483           	cmp.l d3,d2
 66c:	6718           	beq.s 686 <memcpy+0x76>
		*d++ = *s++;
 66e:	2241           	movea.l d1,a1
 670:	1091           	move.b (a1),(a0)
	while(len--)
 672:	4a84           	tst.l d4
 674:	6710           	beq.s 686 <memcpy+0x76>
		*d++ = *s++;
 676:	1169 0001 0001 	move.b 1(a1),1(a0)
	while(len--)
 67c:	5384           	subq.l #1,d4
 67e:	6706           	beq.s 686 <memcpy+0x76>
		*d++ = *s++;
 680:	1169 0002 0002 	move.b 2(a1),2(a0)
}
 686:	4cdf 007c      	movem.l (sp)+,d2-d6
 68a:	4e75           	rts
 68c:	2240           	movea.l d0,a1
 68e:	d283           	add.l d3,d1
		*d++ = *s++;
 690:	12e8 ffff      	move.b -1(a0),(a1)+
	while(len--)
 694:	b288           	cmp.l a0,d1
 696:	67ee           	beq.s 686 <memcpy+0x76>
 698:	5288           	addq.l #1,a0
 69a:	60f4           	bra.s 690 <memcpy+0x80>

0000069c <__mulsi3>:
 
	.text
	FUNC(__mulsi3)
	.globl	SYM (__mulsi3)
SYM (__mulsi3):
	movew	sp@(4), d0	/* x0 -> d0 */
 69c:	302f 0004      	move.w 4(sp),d0
	muluw	sp@(10), d0	/* x0*y1 */
 6a0:	c0ef 000a      	mulu.w 10(sp),d0
	movew	sp@(6), d1	/* x1 -> d1 */
 6a4:	322f 0006      	move.w 6(sp),d1
	muluw	sp@(8), d1	/* x1*y0 */
 6a8:	c2ef 0008      	mulu.w 8(sp),d1
	addw	d1, d0
 6ac:	d041           	add.w d1,d0
	swap	d0
 6ae:	4840           	swap d0
	clrw	d0
 6b0:	4240           	clr.w d0
	movew	sp@(6), d1	/* x1 -> d1 */
 6b2:	322f 0006      	move.w 6(sp),d1
	muluw	sp@(10), d1	/* x1*y1 */
 6b6:	c2ef 000a      	mulu.w 10(sp),d1
	addl	d1, d0
 6ba:	d081           	add.l d1,d0

	rts
 6bc:	4e75           	rts

000006be <__udivsi3>:

	.text
	FUNC(__udivsi3)
	.globl	SYM (__udivsi3)
SYM (__udivsi3):
	movel	d2, sp@-
 6be:	2f02           	move.l d2,-(sp)
	movel	sp@(12), d1	/* d1 = divisor */
 6c0:	222f 000c      	move.l 12(sp),d1
	movel	sp@(8), d0	/* d0 = dividend */
 6c4:	202f 0008      	move.l 8(sp),d0

	cmpl	IMM (0x10000), d1 /* divisor >= 2 ^ 16 ?   */
 6c8:	0c81 0001 0000 	cmpi.l #65536,d1
	jcc	3f		/* then try next algorithm */
 6ce:	6416           	bcc.s 6e6 <__udivsi3+0x28>
	movel	d0, d2
 6d0:	2400           	move.l d0,d2
	clrw	d2
 6d2:	4242           	clr.w d2
	swap	d2
 6d4:	4842           	swap d2
	divu	d1, d2          /* high quotient in lower word */
 6d6:	84c1           	divu.w d1,d2
	movew	d2, d0		/* save high quotient */
 6d8:	3002           	move.w d2,d0
	swap	d0
 6da:	4840           	swap d0
	movew	sp@(10), d2	/* get low dividend + high rest */
 6dc:	342f 000a      	move.w 10(sp),d2
	divu	d1, d2		/* low quotient */
 6e0:	84c1           	divu.w d1,d2
	movew	d2, d0
 6e2:	3002           	move.w d2,d0
	jra	6f
 6e4:	6030           	bra.s 716 <__udivsi3+0x58>

3:	movel	d1, d2		/* use d2 as divisor backup */
 6e6:	2401           	move.l d1,d2
4:	lsrl	IMM (1), d1	/* shift divisor */
 6e8:	e289           	lsr.l #1,d1
	lsrl	IMM (1), d0	/* shift dividend */
 6ea:	e288           	lsr.l #1,d0
	cmpl	IMM (0x10000), d1 /* still divisor >= 2 ^ 16 ?  */
 6ec:	0c81 0001 0000 	cmpi.l #65536,d1
	jcc	4b
 6f2:	64f4           	bcc.s 6e8 <__udivsi3+0x2a>
	divu	d1, d0		/* now we have 16-bit divisor */
 6f4:	80c1           	divu.w d1,d0
	andl	IMM (0xffff), d0 /* mask out divisor, ignore remainder */
 6f6:	0280 0000 ffff 	andi.l #65535,d0

/* Multiply the 16-bit tentative quotient with the 32-bit divisor.  Because of
   the operand ranges, this might give a 33-bit product.  If this product is
   greater than the dividend, the tentative quotient was too large. */
	movel	d2, d1
 6fc:	2202           	move.l d2,d1
	mulu	d0, d1		/* low part, 32 bits */
 6fe:	c2c0           	mulu.w d0,d1
	swap	d2
 700:	4842           	swap d2
	mulu	d0, d2		/* high part, at most 17 bits */
 702:	c4c0           	mulu.w d0,d2
	swap	d2		/* align high part with low part */
 704:	4842           	swap d2
	tstw	d2		/* high part 17 bits? */
 706:	4a42           	tst.w d2
	jne	5f		/* if 17 bits, quotient was too large */
 708:	660a           	bne.s 714 <__udivsi3+0x56>
	addl	d2, d1		/* add parts */
 70a:	d282           	add.l d2,d1
	jcs	5f		/* if sum is 33 bits, quotient was too large */
 70c:	6506           	bcs.s 714 <__udivsi3+0x56>
	cmpl	sp@(8), d1	/* compare the sum with the dividend */
 70e:	b2af 0008      	cmp.l 8(sp),d1
	jls	6f		/* if sum > dividend, quotient was too large */
 712:	6302           	bls.s 716 <__udivsi3+0x58>
5:	subql	IMM (1), d0	/* adjust quotient */
 714:	5380           	subq.l #1,d0

6:	movel	sp@+, d2
 716:	241f           	move.l (sp)+,d2
	rts
 718:	4e75           	rts

0000071a <__divsi3>:

	.text
	FUNC(__divsi3)
	.globl	SYM (__divsi3)
SYM (__divsi3):
	movel	d2, sp@-
 71a:	2f02           	move.l d2,-(sp)

	moveq	IMM (1), d2	/* sign of result stored in d2 (=1 or =-1) */
 71c:	7401           	moveq #1,d2
	movel	sp@(12), d1	/* d1 = divisor */
 71e:	222f 000c      	move.l 12(sp),d1
	jpl	1f
 722:	6a04           	bpl.s 728 <__divsi3+0xe>
	negl	d1
 724:	4481           	neg.l d1
	negb	d2		/* change sign because divisor <0  */
 726:	4402           	neg.b d2
1:	movel	sp@(8), d0	/* d0 = dividend */
 728:	202f 0008      	move.l 8(sp),d0
	jpl	2f
 72c:	6a04           	bpl.s 732 <__divsi3+0x18>
	negl	d0
 72e:	4480           	neg.l d0
	negb	d2
 730:	4402           	neg.b d2

2:	movel	d1, sp@-
 732:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 734:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__udivsi3)	/* divide abs(dividend) by abs(divisor) */
 736:	6186           	bsr.s 6be <__udivsi3>
	addql	IMM (8), sp
 738:	508f           	addq.l #8,sp

	tstb	d2
 73a:	4a02           	tst.b d2
	jpl	3f
 73c:	6a02           	bpl.s 740 <__divsi3+0x26>
	negl	d0
 73e:	4480           	neg.l d0

3:	movel	sp@+, d2
 740:	241f           	move.l (sp)+,d2
	rts
 742:	4e75           	rts

00000744 <__modsi3>:

	.text
	FUNC(__modsi3)
	.globl	SYM (__modsi3)
SYM (__modsi3):
	movel	sp@(8), d1	/* d1 = divisor */
 744:	222f 0008      	move.l 8(sp),d1
	movel	sp@(4), d0	/* d0 = dividend */
 748:	202f 0004      	move.l 4(sp),d0
	movel	d1, sp@-
 74c:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 74e:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__divsi3)
 750:	61c8           	bsr.s 71a <__divsi3>
	addql	IMM (8), sp
 752:	508f           	addq.l #8,sp
	movel	sp@(8), d1	/* d1 = divisor */
 754:	222f 0008      	move.l 8(sp),d1
	movel	d1, sp@-
 758:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 75a:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
 75c:	6100 ff3e      	bsr.w 69c <__mulsi3>
	addql	IMM (8), sp
 760:	508f           	addq.l #8,sp
	movel	sp@(4), d1	/* d1 = dividend */
 762:	222f 0004      	move.l 4(sp),d1
	subl	d0, d1		/* d1 = a - (a/b)*b */
 766:	9280           	sub.l d0,d1
	movel	d1, d0
 768:	2001           	move.l d1,d0
	rts
 76a:	4e75           	rts

0000076c <__umodsi3>:

	.text
	FUNC(__umodsi3)
	.globl	SYM (__umodsi3)
SYM (__umodsi3):
	movel	sp@(8), d1	/* d1 = divisor */
 76c:	222f 0008      	move.l 8(sp),d1
	movel	sp@(4), d0	/* d0 = dividend */
 770:	202f 0004      	move.l 4(sp),d0
	movel	d1, sp@-
 774:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 776:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__udivsi3)
 778:	6100 ff44      	bsr.w 6be <__udivsi3>
	addql	IMM (8), sp
 77c:	508f           	addq.l #8,sp
	movel	sp@(8), d1	/* d1 = divisor */
 77e:	222f 0008      	move.l 8(sp),d1
	movel	d1, sp@-
 782:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 784:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
 786:	6100 ff14      	bsr.w 69c <__mulsi3>
	addql	IMM (8), sp
 78a:	508f           	addq.l #8,sp
	movel	sp@(4), d1	/* d1 = dividend */
 78c:	222f 0004      	move.l 4(sp),d1
	subl	d0, d1		/* d1 = a - (a/b)*b */
 790:	9280           	sub.l d0,d1
	movel	d1, d0
 792:	2001           	move.l d1,d0
	rts
 794:	4e75           	rts

00000796 <KPutCharX>:
	.text
	FUNC(KPutCharX)
	.globl	SYM (KPutCharX)

SYM(KPutCharX):
    move.l  a6, -(sp)
 796:	2f0e           	move.l a6,-(sp)
    move.l  4.w, a6
 798:	2c78 0004      	movea.l 4 <_start+0x4>,a6
    jsr     -0x204(a6)
 79c:	4eae fdfc      	jsr -516(a6)
    movea.l (sp)+, a6
 7a0:	2c5f           	movea.l (sp)+,a6
    rts
 7a2:	4e75           	rts

000007a4 <PutChar>:
	.text
	FUNC(PutChar)
	.globl	SYM (PutChar)

SYM(PutChar):
	move.b d0, (a3)+
 7a4:	16c0           	move.b d0,(a3)+
	rts
 7a6:	4e75           	rts
