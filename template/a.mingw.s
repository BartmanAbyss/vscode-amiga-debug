
a.mingw.elf:     file format elf32-m68k


Disassembly of section .text:

00000000 <_start>:


int main();

__attribute__((used)) __attribute__((section(".text.unlikely"))) void _start() {
	main();
   0:	4ef9 0000 0006 	jmp 6 <main>

00000006 <main>:
	hw->intreq=(1<<INTB_VERTB); hw->intreq=(1<<INTB_VERTB); //reset vbl req. twice for a4000 bug.

	bgcolor++;
}

int main() {
   6:	4fef fff4      	lea -12(sp),sp
   a:	48e7 3132      	movem.l d2-d3/d7/a2-a3/a6,-(sp)
	SysBase = *((struct ExecBase**)4UL);
   e:	2c78 0004      	movea.l 4 <_start+0x4>,a6
  12:	23ce 0000 282c 	move.l a6,282c <SysBase>
	hw = (struct Custom*)0xdff000;
  18:	23fc 00df f000 	move.l #14675968,2828 <hw>
  1e:	0000 2828 

	// We will use the graphics library only to locate and restore the system copper list once we are through.
	GfxBase = (struct GfxBase *)OpenLibrary("graphics.library",0);
  22:	43f9 0000 07c0 	lea 7c0 <PutChar+0x4c>,a1
  28:	7000           	moveq #0,d0
  2a:	4eae fdd8      	jsr -552(a6)
  2e:	23c0 0000 2824 	move.l d0,2824 <GfxBase>
	if (!GfxBase)
  34:	6700 02ca      	beq.w 300 <main+0x2fa>
		Exit(0);

	// used for printing
	DOSBase = (struct DosLibrary*)OpenLibrary("dos.library", 0);
  38:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
  3e:	43f9 0000 07d1 	lea 7d1 <PutChar+0x5d>,a1
  44:	7000           	moveq #0,d0
  46:	4eae fdd8      	jsr -552(a6)
  4a:	23c0 0000 2820 	move.l d0,2820 <DOSBase>
	if (!DOSBase)
  50:	6700 02a2      	beq.w 2f4 <main+0x2ee>
		Exit(0);

	KPrintF("Hello debugger from Amiga!\n");
  54:	4879 0000 07dd 	pea 7dd <PutChar+0x69>
  5a:	4eb9 0000 041a 	jsr 41a <KPrintF>
	Write(Output(), "Hello console!\n", 15);
  60:	2c79 0000 2820 	movea.l 2820 <DOSBase>,a6
  66:	4eae ffc4      	jsr -60(a6)
  6a:	2c79 0000 2820 	movea.l 2820 <DOSBase>,a6
  70:	2200           	move.l d0,d1
  72:	243c 0000 07f9 	move.l #2041,d2
  78:	760f           	moveq #15,d3
  7a:	4eae ffd0      	jsr -48(a6)
	Delay(50);
  7e:	2c79 0000 2820 	movea.l 2820 <DOSBase>,a6
  84:	7232           	moveq #50,d1
  86:	4eae ff3a      	jsr -198(a6)

void warpmode(int on) 
{ // bool
	long(*UaeConf)(long mode, int index, const char* param, int param_len, char* outbuf, int outbuf_len);
	UaeConf = (void *)0xf0ff60;
	if(*((ULONG *)UaeConf)) {
  8a:	247c 00f0 ff60 	movea.l #15794016,a2
  90:	588f           	addq.l #4,sp
  92:	4a92           	tst.l (a2)
  94:	6718           	beq.s ae <main+0xa8>
  96:	4878 0001      	pea 1 <_start+0x1>
  9a:	47f9 0000 0378 	lea 378 <warpmode.part.0>,a3
  a0:	4e93           	jsr (a3)
  a2:	588f           	addq.l #4,sp
  a4:	4a92           	tst.l (a2)
  a6:	6706           	beq.s ae <main+0xa8>
  a8:	42a7           	clr.l -(sp)
  aa:	4e93           	jsr (a3)
  ac:	588f           	addq.l #4,sp
	ActiView=GfxBase->ActiView; //store current view
  ae:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
  b4:	23ee 0022 0000 	move.l 34(a6),280c <_edata>
  ba:	280c 
	OwnBlitter();
  bc:	4eae fe38      	jsr -456(a6)
	WaitBlit();	
  c0:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
  c6:	4eae ff1c      	jsr -228(a6)
	Disable();
  ca:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
  d0:	4eae ff88      	jsr -120(a6)
	SystemADKCON=hw->adkconr;
  d4:	2479 0000 2828 	movea.l 2828 <hw>,a2
  da:	302a 0010      	move.w 16(a2),d0
  de:	33c0 0000 2810 	move.w d0,2810 <SystemADKCON>
	SystemInts=hw->intenar;
  e4:	302a 001c      	move.w 28(a2),d0
  e8:	33c0 0000 2814 	move.w d0,2814 <SystemInts>
	SystemDMA=hw->dmaconr;
  ee:	302a 0002      	move.w 2(a2),d0
  f2:	33c0 0000 2812 	move.w d0,2812 <SystemDMA>
	hw->intena=0x7fff;//disable all interrupts
  f8:	357c 7fff 009a 	move.w #32767,154(a2)
	hw->intreq=0x7fff;//Clear any interrupts that were pending
  fe:	357c 7fff 009c 	move.w #32767,156(a2)
	WaitVbl();
 104:	47f9 0000 04ac 	lea 4ac <WaitVbl>,a3
 10a:	4e93           	jsr (a3)
	WaitVbl();
 10c:	4e93           	jsr (a3)
	hw->dmacon=0x7fff;//Clear all DMA channels
 10e:	357c 7fff 0096 	move.w #32767,150(a2)
	for(int a=0;a<32;a++)
 114:	7200           	moveq #0,d1
		hw->color[a]=0;
 116:	2001           	move.l d1,d0
 118:	0680 0000 00c0 	addi.l #192,d0
 11e:	d080           	add.l d0,d0
 120:	35bc 0000 0800 	move.w #0,(0,a2,d0.l)
	for(int a=0;a<32;a++)
 126:	5281           	addq.l #1,d1
 128:	7020           	moveq #32,d0
 12a:	b081           	cmp.l d1,d0
 12c:	66e8           	bne.s 116 <main+0x110>
	LoadView(0);
 12e:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 134:	93c9           	suba.l a1,a1
 136:	4eae ff22      	jsr -222(a6)
	WaitTOF();
 13a:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 140:	4eae fef2      	jsr -270(a6)
	WaitTOF();
 144:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 14a:	4eae fef2      	jsr -270(a6)
	WaitVbl();
 14e:	4e93           	jsr (a3)
	WaitVbl();
 150:	4e93           	jsr (a3)
	UWORD getvbr[] = { 0x4e7a, 0x0801, 0x4e73 }; // MOVEC.L VBR,D0 RTE
 152:	3f7c 4e7a 001e 	move.w #20090,30(sp)
 158:	3f7c 0801 0020 	move.w #2049,32(sp)
 15e:	3f7c 4e73 0022 	move.w #20083,34(sp)
	if (SysBase->AttnFlags & AFF_68010) 
 164:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 16a:	082e 0000 0129 	btst #0,297(a6)
 170:	6700 01b8      	beq.w 32a <main+0x324>
		vbr = (APTR)Supervisor((void*)getvbr);
 174:	7e1e           	moveq #30,d7
 176:	de8f           	add.l sp,d7
 178:	cf8d           	exg d7,a5
 17a:	4eae ffe2      	jsr -30(a6)
 17e:	cf8d           	exg d7,a5
	VBR=GetVBR();
 180:	23c0 0000 281c 	move.l d0,281c <VBR>
	return *(volatile APTR*)(((UBYTE*)VBR)+0x6c);
 186:	2079 0000 281c 	movea.l 281c <VBR>,a0
 18c:	2428 006c      	move.l 108(a0),d2
	SystemIrq=GetInterruptHandler(); //store interrupt register
 190:	23c2 0000 2816 	move.l d2,2816 <SystemIrq>
	warpmode(1);
	// TODO: precalc stuff here
	warpmode(0);

	TakeSystem();
	WaitVbl();
 196:	4e93           	jsr (a3)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 198:	2079 0000 281c 	movea.l 281c <VBR>,a0
 19e:	217c 0000 0482 	move.l #1154,108(a0)
 1a4:	006c 

	// DEMO
	SetInterruptHandler((APTR)interruptHandler);
	hw->intena=(1<<INTB_SETCLR)|(1<<INTB_INTEN)|(1<<INTB_VERTB);
 1a6:	2479 0000 2828 	movea.l 2828 <hw>,a2
 1ac:	357c c020 009a 	move.w #-16352,154(a2)
	hw->intreq=1<<INTB_VERTB;//reset vbl req
 1b2:	357c 0020 009c 	move.w #32,156(a2)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 1b8:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.da39cb95+0xbfa298>,d0

	while(!MouseLeft()) {
 1be:	0800 0006      	btst #6,d0
 1c2:	675a           	beq.s 21e <main+0x218>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 1c4:	202a 0004      	move.l 4(a2),d0
 1c8:	2f40 001e      	move.l d0,30(sp)
		vpos&=0x1ff00;
 1cc:	202f 001e      	move.l 30(sp),d0
 1d0:	0280 0001 ff00 	andi.l #130816,d0
 1d6:	2f40 001e      	move.l d0,30(sp)
		if (vpos!=(311<<8))
 1da:	202f 001e      	move.l 30(sp),d0
 1de:	0c80 0001 3700 	cmpi.l #79616,d0
 1e4:	67de           	beq.s 1c4 <main+0x1be>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 1e6:	202a 0004      	move.l 4(a2),d0
 1ea:	2f40 001a      	move.l d0,26(sp)
		vpos&=0x1ff00;
 1ee:	202f 001a      	move.l 26(sp),d0
 1f2:	0280 0001 ff00 	andi.l #130816,d0
 1f8:	2f40 001a      	move.l d0,26(sp)
		if (vpos==(311<<8))
 1fc:	202f 001a      	move.l 26(sp),d0
 200:	0c80 0001 3700 	cmpi.l #79616,d0
 206:	66de           	bne.s 1e6 <main+0x1e0>
		WaitVbl();
		hw->color[0] = bgcolor;
 208:	3039 0000 281a 	move.w 281a <bgcolor>,d0
 20e:	3540 0180      	move.w d0,384(a2)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 212:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.da39cb95+0xbfa298>,d0
	while(!MouseLeft()) {
 218:	0800 0006      	btst #6,d0
 21c:	66a6           	bne.s 1c4 <main+0x1be>
	WaitVbl();
 21e:	4e93           	jsr (a3)
	UWORD tst=*(volatile UWORD*)&hw->dmaconr; //for compatiblity a1000
 220:	302a 0002      	move.w 2(a2),d0
	while (*(volatile UWORD*)&hw->dmaconr&(1<<14)) {} //blitter busy wait
 224:	302a 0002      	move.w 2(a2),d0
 228:	0800 000e      	btst #14,d0
 22c:	66f6           	bne.s 224 <main+0x21e>
	hw->intena=0x7fff;//disable all interrupts
 22e:	357c 7fff 009a 	move.w #32767,154(a2)
	hw->intreq=0x7fff;//Clear any interrupts that were pending
 234:	357c 7fff 009c 	move.w #32767,156(a2)
	hw->dmacon=0x7fff;//Clear all DMA channels
 23a:	357c 7fff 0096 	move.w #32767,150(a2)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 240:	2079 0000 281c 	movea.l 281c <VBR>,a0
 246:	2142 006c      	move.l d2,108(a0)
	hw->cop1lc=(ULONG)GfxBase->copinit;
 24a:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 250:	256e 0026 0080 	move.l 38(a6),128(a2)
	hw->cop2lc=(ULONG)GfxBase->LOFlist;
 256:	256e 0032 0084 	move.l 50(a6),132(a2)
	hw->copjmp1=0x7fff; //start coppper
 25c:	357c 7fff 0088 	move.w #32767,136(a2)
	hw->intena=SystemInts|0x8000;
 262:	3039 0000 2814 	move.w 2814 <SystemInts>,d0
 268:	0040 8000      	ori.w #-32768,d0
 26c:	3540 009a      	move.w d0,154(a2)
	hw->dmacon=SystemDMA|0x8000;
 270:	3039 0000 2812 	move.w 2812 <SystemDMA>,d0
 276:	0040 8000      	ori.w #-32768,d0
 27a:	3540 0096      	move.w d0,150(a2)
	hw->adkcon=SystemADKCON|0x8000;
 27e:	3039 0000 2810 	move.w 2810 <SystemADKCON>,d0
 284:	0040 8000      	ori.w #-32768,d0
 288:	3540 009e      	move.w d0,158(a2)
	LoadView(ActiView);
 28c:	2279 0000 280c 	movea.l 280c <_edata>,a1
 292:	4eae ff22      	jsr -222(a6)
	WaitTOF();
 296:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 29c:	4eae fef2      	jsr -270(a6)
	WaitTOF();
 2a0:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 2a6:	4eae fef2      	jsr -270(a6)
	WaitBlit();	
 2aa:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 2b0:	4eae ff1c      	jsr -228(a6)
	DisownBlitter();
 2b4:	2c79 0000 2824 	movea.l 2824 <GfxBase>,a6
 2ba:	4eae fe32      	jsr -462(a6)
	Enable();
 2be:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 2c4:	4eae ff82      	jsr -126(a6)
	}

	// END
	FreeSystem();

	CloseLibrary((struct Library*)DOSBase);
 2c8:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 2ce:	2279 0000 2820 	movea.l 2820 <DOSBase>,a1
 2d4:	4eae fe62      	jsr -414(a6)
	CloseLibrary((struct Library*)GfxBase);
 2d8:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 2de:	2279 0000 2824 	movea.l 2824 <GfxBase>,a1
 2e4:	4eae fe62      	jsr -414(a6)
}
 2e8:	7000           	moveq #0,d0
 2ea:	4cdf 4c8c      	movem.l (sp)+,d2-d3/d7/a2-a3/a6
 2ee:	4fef 000c      	lea 12(sp),sp
 2f2:	4e75           	rts
		Exit(0);
 2f4:	9dce           	suba.l a6,a6
 2f6:	7200           	moveq #0,d1
 2f8:	4eae ff70      	jsr -144(a6)
 2fc:	6000 fd56      	bra.w 54 <main+0x4e>
		Exit(0);
 300:	2c79 0000 2820 	movea.l 2820 <DOSBase>,a6
 306:	7200           	moveq #0,d1
 308:	4eae ff70      	jsr -144(a6)
	DOSBase = (struct DosLibrary*)OpenLibrary("dos.library", 0);
 30c:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 312:	43f9 0000 07d1 	lea 7d1 <PutChar+0x5d>,a1
 318:	7000           	moveq #0,d0
 31a:	4eae fdd8      	jsr -552(a6)
 31e:	23c0 0000 2820 	move.l d0,2820 <DOSBase>
	if (!DOSBase)
 324:	6600 fd2e      	bne.w 54 <main+0x4e>
 328:	60ca           	bra.s 2f4 <main+0x2ee>
	APTR vbr = 0;
 32a:	7000           	moveq #0,d0
	VBR=GetVBR();
 32c:	23c0 0000 281c 	move.l d0,281c <VBR>
	return *(volatile APTR*)(((UBYTE*)VBR)+0x6c);
 332:	2079 0000 281c 	movea.l 281c <VBR>,a0
 338:	2428 006c      	move.l 108(a0),d2
	SystemIrq=GetInterruptHandler(); //store interrupt register
 33c:	23c2 0000 2816 	move.l d2,2816 <SystemIrq>
	WaitVbl();
 342:	4e93           	jsr (a3)
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
 344:	2079 0000 281c 	movea.l 281c <VBR>,a0
 34a:	217c 0000 0482 	move.l #1154,108(a0)
 350:	006c 
	hw->intena=(1<<INTB_SETCLR)|(1<<INTB_INTEN)|(1<<INTB_VERTB);
 352:	2479 0000 2828 	movea.l 2828 <hw>,a2
 358:	357c c020 009a 	move.w #-16352,154(a2)
	hw->intreq=1<<INTB_VERTB;//reset vbl req
 35e:	357c 0020 009c 	move.w #32,156(a2)
inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
 364:	1039 00bf e001 	move.b bfe001 <gcc8_c_support.c.da39cb95+0xbfa298>,d0
	while(!MouseLeft()) {
 36a:	0800 0006      	btst #6,d0
 36e:	6600 fe54      	bne.w 1c4 <main+0x1be>
 372:	6000 feaa      	bra.w 21e <main+0x218>
 376:	4e71           	nop

00000378 <warpmode.part.0>:
void warpmode(int on) 
 378:	598f           	subq.l #4,sp
 37a:	2f02           	move.l d2,-(sp)
		char outbuf;
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
 37c:	4aaf 000c      	tst.l 12(sp)
 380:	674c           	beq.s 3ce <warpmode.part.0+0x56>
 382:	4878 0001      	pea 1 <_start+0x1>
 386:	740b           	moveq #11,d2
 388:	d48f           	add.l sp,d2
 38a:	2f02           	move.l d2,-(sp)
 38c:	42a7           	clr.l -(sp)
 38e:	4879 0000 07ab 	pea 7ab <PutChar+0x37>
 394:	4878 ffff      	pea ffffffff <gcc8_c_support.c.da39cb95+0xffffc296>
 398:	4878 0052      	pea 52 <main+0x4c>
 39c:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.da39cb95+0xf0c1f7>
 3a2:	4fef 0018      	lea 24(sp),sp
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
 3a6:	203c 0000 0791 	move.l #1937,d0
 3ac:	4878 0001      	pea 1 <_start+0x1>
 3b0:	2f02           	move.l d2,-(sp)
 3b2:	42a7           	clr.l -(sp)
 3b4:	2f00           	move.l d0,-(sp)
 3b6:	4878 ffff      	pea ffffffff <gcc8_c_support.c.da39cb95+0xffffc296>
 3ba:	4878 0052      	pea 52 <main+0x4c>
 3be:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.da39cb95+0xf0c1f7>
	}
}
 3c4:	4fef 0018      	lea 24(sp),sp
 3c8:	241f           	move.l (sp)+,d2
 3ca:	588f           	addq.l #4,sp
 3cc:	4e75           	rts
		UaeConf(82, -1, on ? "warp true" : "warp false", 0, &outbuf, 1);
 3ce:	4878 0001      	pea 1 <_start+0x1>
 3d2:	740b           	moveq #11,d2
 3d4:	d48f           	add.l sp,d2
 3d6:	2f02           	move.l d2,-(sp)
 3d8:	42a7           	clr.l -(sp)
 3da:	4879 0000 07b5 	pea 7b5 <PutChar+0x41>
 3e0:	4878 ffff      	pea ffffffff <gcc8_c_support.c.da39cb95+0xffffc296>
 3e4:	4878 0052      	pea 52 <main+0x4c>
 3e8:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.da39cb95+0xf0c1f7>
 3ee:	4fef 0018      	lea 24(sp),sp
		UaeConf(82, -1, on ? "blitter_cycle_exact false" : "blitter_cycle_exact true", 0, &outbuf, 1);
 3f2:	203c 0000 0778 	move.l #1912,d0
 3f8:	4878 0001      	pea 1 <_start+0x1>
 3fc:	2f02           	move.l d2,-(sp)
 3fe:	42a7           	clr.l -(sp)
 400:	2f00           	move.l d0,-(sp)
 402:	4878 ffff      	pea ffffffff <gcc8_c_support.c.da39cb95+0xffffc296>
 406:	4878 0052      	pea 52 <main+0x4c>
 40a:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.da39cb95+0xf0c1f7>
}
 410:	4fef 0018      	lea 24(sp),sp
 414:	241f           	move.l (sp)+,d2
 416:	588f           	addq.l #4,sp
 418:	4e75           	rts

0000041a <KPrintF>:
{
 41a:	4fef ff80      	lea -128(sp),sp
 41e:	48e7 0032      	movem.l a2-a3/a6,-(sp)
    if(*((ULONG *)UaeDbgLog)) {
 422:	4ab9 00f0 ff60 	tst.l f0ff60 <gcc8_c_support.c.da39cb95+0xf0c1f7>
 428:	6734           	beq.s 45e <KPrintF+0x44>
		RawDoFmt(fmt, vl, PutChar, temp);
 42a:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 430:	206f 0090      	movea.l 144(sp),a0
 434:	43ef 0094      	lea 148(sp),a1
 438:	45f9 0000 0774 	lea 774 <PutChar>,a2
 43e:	47ef 000c      	lea 12(sp),a3
 442:	4eae fdf6      	jsr -522(a6)
		UaeDbgLog(86, temp);
 446:	2f0b           	move.l a3,-(sp)
 448:	4878 0056      	pea 56 <main+0x50>
 44c:	4eb9 00f0 ff60 	jsr f0ff60 <gcc8_c_support.c.da39cb95+0xf0c1f7>
 452:	508f           	addq.l #8,sp
}
 454:	4cdf 4c00      	movem.l (sp)+,a2-a3/a6
 458:	4fef 0080      	lea 128(sp),sp
 45c:	4e75           	rts
		RawDoFmt(fmt, vl, KPutCharX, 0);
 45e:	2c79 0000 282c 	movea.l 282c <SysBase>,a6
 464:	206f 0090      	movea.l 144(sp),a0
 468:	43ef 0094      	lea 148(sp),a1
 46c:	45f9 0000 0766 	lea 766 <KPutCharX>,a2
 472:	97cb           	suba.l a3,a3
 474:	4eae fdf6      	jsr -522(a6)
}
 478:	4cdf 4c00      	movem.l (sp)+,a2-a3/a6
 47c:	4fef 0080      	lea 128(sp),sp
 480:	4e75           	rts

00000482 <interruptHandler>:
static __attribute__((interrupt)) void interruptHandler() {
 482:	2f08           	move.l a0,-(sp)
 484:	2f00           	move.l d0,-(sp)
	hw->intreq=(1<<INTB_VERTB); hw->intreq=(1<<INTB_VERTB); //reset vbl req. twice for a4000 bug.
 486:	2079 0000 2828 	movea.l 2828 <hw>,a0
 48c:	317c 0020 009c 	move.w #32,156(a0)
 492:	317c 0020 009c 	move.w #32,156(a0)
	bgcolor++;
 498:	3039 0000 281a 	move.w 281a <bgcolor>,d0
 49e:	5240           	addq.w #1,d0
 4a0:	33c0 0000 281a 	move.w d0,281a <bgcolor>
}
 4a6:	201f           	move.l (sp)+,d0
 4a8:	205f           	movea.l (sp)+,a0
 4aa:	4e73           	rte

000004ac <WaitVbl>:
void WaitVbl() {
 4ac:	518f           	subq.l #8,sp
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 4ae:	2079 0000 2828 	movea.l 2828 <hw>,a0
 4b4:	2028 0004      	move.l 4(a0),d0
 4b8:	2e80           	move.l d0,(sp)
		vpos&=0x1ff00;
 4ba:	2017           	move.l (sp),d0
 4bc:	0280 0001 ff00 	andi.l #130816,d0
 4c2:	2e80           	move.l d0,(sp)
		if (vpos!=(311<<8))
 4c4:	2017           	move.l (sp),d0
 4c6:	0c80 0001 3700 	cmpi.l #79616,d0
 4cc:	67e6           	beq.s 4b4 <WaitVbl+0x8>
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
 4ce:	2028 0004      	move.l 4(a0),d0
 4d2:	2f40 0004      	move.l d0,4(sp)
		vpos&=0x1ff00;
 4d6:	202f 0004      	move.l 4(sp),d0
 4da:	0280 0001 ff00 	andi.l #130816,d0
 4e0:	2f40 0004      	move.l d0,4(sp)
		if (vpos==(311<<8))
 4e4:	202f 0004      	move.l 4(sp),d0
 4e8:	0c80 0001 3700 	cmpi.l #79616,d0
 4ee:	66de           	bne.s 4ce <WaitVbl+0x22>
}
 4f0:	508f           	addq.l #8,sp
 4f2:	4e75           	rts

000004f4 <memcpy>:
{
 4f4:	48e7 3820      	movem.l d2-d4/a2,-(sp)
 4f8:	202f 0014      	move.l 20(sp),d0
 4fc:	226f 0018      	movea.l 24(sp),a1
 500:	222f 001c      	move.l 28(sp),d1
	while(len--)
 504:	2601           	move.l d1,d3
 506:	5383           	subq.l #1,d3
 508:	4a81           	tst.l d1
 50a:	6762           	beq.s 56e <memcpy+0x7a>
 50c:	2040           	movea.l d0,a0
 50e:	5888           	addq.l #4,a0
 510:	b1c9           	cmpa.l a1,a0
 512:	53c2           	sl.s d2
 514:	4402           	neg.b d2
 516:	41e9 0004      	lea 4(a1),a0
 51a:	b1c0           	cmpa.l d0,a0
 51c:	53c4           	sl.s d4
 51e:	4404           	neg.b d4
 520:	8404           	or.b d4,d2
 522:	7808           	moveq #8,d4
 524:	b883           	cmp.l d3,d4
 526:	55c4           	sc.s d4
 528:	4404           	neg.b d4
 52a:	c404           	and.b d4,d2
 52c:	6746           	beq.s 574 <memcpy+0x80>
 52e:	2409           	move.l a1,d2
 530:	8480           	or.l d0,d2
 532:	7803           	moveq #3,d4
 534:	c484           	and.l d4,d2
 536:	663c           	bne.s 574 <memcpy+0x80>
 538:	2049           	movea.l a1,a0
 53a:	2440           	movea.l d0,a2
 53c:	74fc           	moveq #-4,d2
 53e:	c481           	and.l d1,d2
 540:	d489           	add.l a1,d2
		*d++ = *s++;
 542:	24d8           	move.l (a0)+,(a2)+
 544:	b488           	cmp.l a0,d2
 546:	66fa           	bne.s 542 <memcpy+0x4e>
 548:	74fc           	moveq #-4,d2
 54a:	c481           	and.l d1,d2
 54c:	2040           	movea.l d0,a0
 54e:	d1c2           	adda.l d2,a0
 550:	d3c2           	adda.l d2,a1
 552:	9682           	sub.l d2,d3
 554:	b481           	cmp.l d1,d2
 556:	6716           	beq.s 56e <memcpy+0x7a>
 558:	1091           	move.b (a1),(a0)
	while(len--)
 55a:	4a83           	tst.l d3
 55c:	6710           	beq.s 56e <memcpy+0x7a>
		*d++ = *s++;
 55e:	1169 0001 0001 	move.b 1(a1),1(a0)
	while(len--)
 564:	5383           	subq.l #1,d3
 566:	6706           	beq.s 56e <memcpy+0x7a>
		*d++ = *s++;
 568:	1169 0002 0002 	move.b 2(a1),2(a0)
}
 56e:	4cdf 041c      	movem.l (sp)+,d2-d4/a2
 572:	4e75           	rts
 574:	2040           	movea.l d0,a0
 576:	d289           	add.l a1,d1
		*d++ = *s++;
 578:	10d9           	move.b (a1)+,(a0)+
	while(len--)
 57a:	b289           	cmp.l a1,d1
 57c:	67f0           	beq.s 56e <memcpy+0x7a>
		*d++ = *s++;
 57e:	10d9           	move.b (a1)+,(a0)+
	while(len--)
 580:	b289           	cmp.l a1,d1
 582:	66f4           	bne.s 578 <memcpy+0x84>
 584:	60e8           	bra.s 56e <memcpy+0x7a>

00000586 <memset>:
{
 586:	48e7 3f30      	movem.l d2-d7/a2-a3,-(sp)
 58a:	202f 0024      	move.l 36(sp),d0
 58e:	2a2f 0028      	move.l 40(sp),d5
 592:	226f 002c      	movea.l 44(sp),a1
	while(len-- > 0)
 596:	2809           	move.l a1,d4
 598:	5384           	subq.l #1,d4
 59a:	b2fc 0000      	cmpa.w #0,a1
 59e:	6f00 00b0      	ble.w 650 <memset+0xca>
 5a2:	1e05           	move.b d5,d7
 5a4:	2200           	move.l d0,d1
 5a6:	4481           	neg.l d1
 5a8:	7403           	moveq #3,d2
 5aa:	c282           	and.l d2,d1
 5ac:	7c05           	moveq #5,d6
		*ptr++ = val;
 5ae:	2440           	movea.l d0,a2
 5b0:	bc84           	cmp.l d4,d6
 5b2:	646a           	bcc.s 61e <memset+0x98>
 5b4:	4a81           	tst.l d1
 5b6:	6724           	beq.s 5dc <memset+0x56>
 5b8:	14c5           	move.b d5,(a2)+
	while(len-- > 0)
 5ba:	5384           	subq.l #1,d4
 5bc:	7401           	moveq #1,d2
 5be:	b481           	cmp.l d1,d2
 5c0:	671a           	beq.s 5dc <memset+0x56>
		*ptr++ = val;
 5c2:	2440           	movea.l d0,a2
 5c4:	548a           	addq.l #2,a2
 5c6:	2040           	movea.l d0,a0
 5c8:	1145 0001      	move.b d5,1(a0)
	while(len-- > 0)
 5cc:	5384           	subq.l #1,d4
 5ce:	7403           	moveq #3,d2
 5d0:	b481           	cmp.l d1,d2
 5d2:	6608           	bne.s 5dc <memset+0x56>
		*ptr++ = val;
 5d4:	528a           	addq.l #1,a2
 5d6:	1145 0002      	move.b d5,2(a0)
	while(len-- > 0)
 5da:	5384           	subq.l #1,d4
 5dc:	2609           	move.l a1,d3
 5de:	9681           	sub.l d1,d3
 5e0:	7c00           	moveq #0,d6
 5e2:	1c05           	move.b d5,d6
 5e4:	2406           	move.l d6,d2
 5e6:	4842           	swap d2
 5e8:	4242           	clr.w d2
 5ea:	2042           	movea.l d2,a0
 5ec:	2406           	move.l d6,d2
 5ee:	e14a           	lsl.w #8,d2
 5f0:	4842           	swap d2
 5f2:	4242           	clr.w d2
 5f4:	e18e           	lsl.l #8,d6
 5f6:	2646           	movea.l d6,a3
 5f8:	2c08           	move.l a0,d6
 5fa:	8486           	or.l d6,d2
 5fc:	2c0b           	move.l a3,d6
 5fe:	8486           	or.l d6,d2
 600:	1407           	move.b d7,d2
 602:	2040           	movea.l d0,a0
 604:	d1c1           	adda.l d1,a0
 606:	72fc           	moveq #-4,d1
 608:	c283           	and.l d3,d1
 60a:	d288           	add.l a0,d1
		*ptr++ = val;
 60c:	20c2           	move.l d2,(a0)+
 60e:	b1c1           	cmpa.l d1,a0
 610:	66fa           	bne.s 60c <memset+0x86>
 612:	72fc           	moveq #-4,d1
 614:	c283           	and.l d3,d1
 616:	d5c1           	adda.l d1,a2
 618:	9881           	sub.l d1,d4
 61a:	b283           	cmp.l d3,d1
 61c:	6732           	beq.s 650 <memset+0xca>
 61e:	1485           	move.b d5,(a2)
	while(len-- > 0)
 620:	4a84           	tst.l d4
 622:	6f2c           	ble.s 650 <memset+0xca>
		*ptr++ = val;
 624:	1545 0001      	move.b d5,1(a2)
	while(len-- > 0)
 628:	7201           	moveq #1,d1
 62a:	b284           	cmp.l d4,d1
 62c:	6c22           	bge.s 650 <memset+0xca>
		*ptr++ = val;
 62e:	1545 0002      	move.b d5,2(a2)
	while(len-- > 0)
 632:	7402           	moveq #2,d2
 634:	b484           	cmp.l d4,d2
 636:	6c18           	bge.s 650 <memset+0xca>
		*ptr++ = val;
 638:	1545 0003      	move.b d5,3(a2)
	while(len-- > 0)
 63c:	7c03           	moveq #3,d6
 63e:	bc84           	cmp.l d4,d6
 640:	6c0e           	bge.s 650 <memset+0xca>
		*ptr++ = val;
 642:	1545 0004      	move.b d5,4(a2)
	while(len-- > 0)
 646:	7204           	moveq #4,d1
 648:	b284           	cmp.l d4,d1
 64a:	6c04           	bge.s 650 <memset+0xca>
		*ptr++ = val;
 64c:	1545 0005      	move.b d5,5(a2)
}
 650:	4cdf 0cfc      	movem.l (sp)+,d2-d7/a2-a3
 654:	4e75           	rts

00000656 <strlen>:
{
 656:	206f 0004      	movea.l 4(sp),a0
	unsigned long t=0;
 65a:	7000           	moveq #0,d0
	while(*s++)
 65c:	4a10           	tst.b (a0)
 65e:	6708           	beq.s 668 <strlen+0x12>
		t++;
 660:	5280           	addq.l #1,d0
	while(*s++)
 662:	4a30 0800      	tst.b (0,a0,d0.l)
 666:	66f8           	bne.s 660 <strlen+0xa>
}
 668:	4e75           	rts
 66a:	4e71           	nop

0000066c <__mulsi3>:
 
	.text
	FUNC(__mulsi3)
	.globl	SYM (__mulsi3)
SYM (__mulsi3):
	movew	sp@(4), d0	/* x0 -> d0 */
 66c:	302f 0004      	move.w 4(sp),d0
	muluw	sp@(10), d0	/* x0*y1 */
 670:	c0ef 000a      	mulu.w 10(sp),d0
	movew	sp@(6), d1	/* x1 -> d1 */
 674:	322f 0006      	move.w 6(sp),d1
	muluw	sp@(8), d1	/* x1*y0 */
 678:	c2ef 0008      	mulu.w 8(sp),d1
	addw	d1, d0
 67c:	d041           	add.w d1,d0
	swap	d0
 67e:	4840           	swap d0
	clrw	d0
 680:	4240           	clr.w d0
	movew	sp@(6), d1	/* x1 -> d1 */
 682:	322f 0006      	move.w 6(sp),d1
	muluw	sp@(10), d1	/* x1*y1 */
 686:	c2ef 000a      	mulu.w 10(sp),d1
	addl	d1, d0
 68a:	d081           	add.l d1,d0

	rts
 68c:	4e75           	rts

0000068e <__udivsi3>:

	.text
	FUNC(__udivsi3)
	.globl	SYM (__udivsi3)
SYM (__udivsi3):
	movel	d2, sp@-
 68e:	2f02           	move.l d2,-(sp)
	movel	sp@(12), d1	/* d1 = divisor */
 690:	222f 000c      	move.l 12(sp),d1
	movel	sp@(8), d0	/* d0 = dividend */
 694:	202f 0008      	move.l 8(sp),d0

	cmpl	IMM (0x10000), d1 /* divisor >= 2 ^ 16 ?   */
 698:	0c81 0001 0000 	cmpi.l #65536,d1
	jcc	3f		/* then try next algorithm */
 69e:	6416           	bcc.s 6b6 <__udivsi3+0x28>
	movel	d0, d2
 6a0:	2400           	move.l d0,d2
	clrw	d2
 6a2:	4242           	clr.w d2
	swap	d2
 6a4:	4842           	swap d2
	divu	d1, d2          /* high quotient in lower word */
 6a6:	84c1           	divu.w d1,d2
	movew	d2, d0		/* save high quotient */
 6a8:	3002           	move.w d2,d0
	swap	d0
 6aa:	4840           	swap d0
	movew	sp@(10), d2	/* get low dividend + high rest */
 6ac:	342f 000a      	move.w 10(sp),d2
	divu	d1, d2		/* low quotient */
 6b0:	84c1           	divu.w d1,d2
	movew	d2, d0
 6b2:	3002           	move.w d2,d0
	jra	6f
 6b4:	6030           	bra.s 6e6 <__udivsi3+0x58>

3:	movel	d1, d2		/* use d2 as divisor backup */
 6b6:	2401           	move.l d1,d2
4:	lsrl	IMM (1), d1	/* shift divisor */
 6b8:	e289           	lsr.l #1,d1
	lsrl	IMM (1), d0	/* shift dividend */
 6ba:	e288           	lsr.l #1,d0
	cmpl	IMM (0x10000), d1 /* still divisor >= 2 ^ 16 ?  */
 6bc:	0c81 0001 0000 	cmpi.l #65536,d1
	jcc	4b
 6c2:	64f4           	bcc.s 6b8 <__udivsi3+0x2a>
	divu	d1, d0		/* now we have 16-bit divisor */
 6c4:	80c1           	divu.w d1,d0
	andl	IMM (0xffff), d0 /* mask out divisor, ignore remainder */
 6c6:	0280 0000 ffff 	andi.l #65535,d0

/* Multiply the 16-bit tentative quotient with the 32-bit divisor.  Because of
   the operand ranges, this might give a 33-bit product.  If this product is
   greater than the dividend, the tentative quotient was too large. */
	movel	d2, d1
 6cc:	2202           	move.l d2,d1
	mulu	d0, d1		/* low part, 32 bits */
 6ce:	c2c0           	mulu.w d0,d1
	swap	d2
 6d0:	4842           	swap d2
	mulu	d0, d2		/* high part, at most 17 bits */
 6d2:	c4c0           	mulu.w d0,d2
	swap	d2		/* align high part with low part */
 6d4:	4842           	swap d2
	tstw	d2		/* high part 17 bits? */
 6d6:	4a42           	tst.w d2
	jne	5f		/* if 17 bits, quotient was too large */
 6d8:	660a           	bne.s 6e4 <__udivsi3+0x56>
	addl	d2, d1		/* add parts */
 6da:	d282           	add.l d2,d1
	jcs	5f		/* if sum is 33 bits, quotient was too large */
 6dc:	6506           	bcs.s 6e4 <__udivsi3+0x56>
	cmpl	sp@(8), d1	/* compare the sum with the dividend */
 6de:	b2af 0008      	cmp.l 8(sp),d1
	jls	6f		/* if sum > dividend, quotient was too large */
 6e2:	6302           	bls.s 6e6 <__udivsi3+0x58>
5:	subql	IMM (1), d0	/* adjust quotient */
 6e4:	5380           	subq.l #1,d0

6:	movel	sp@+, d2
 6e6:	241f           	move.l (sp)+,d2
	rts
 6e8:	4e75           	rts

000006ea <__divsi3>:

	.text
	FUNC(__divsi3)
	.globl	SYM (__divsi3)
SYM (__divsi3):
	movel	d2, sp@-
 6ea:	2f02           	move.l d2,-(sp)

	moveq	IMM (1), d2	/* sign of result stored in d2 (=1 or =-1) */
 6ec:	7401           	moveq #1,d2
	movel	sp@(12), d1	/* d1 = divisor */
 6ee:	222f 000c      	move.l 12(sp),d1
	jpl	1f
 6f2:	6a04           	bpl.s 6f8 <__divsi3+0xe>
	negl	d1
 6f4:	4481           	neg.l d1
	negb	d2		/* change sign because divisor <0  */
 6f6:	4402           	neg.b d2
1:	movel	sp@(8), d0	/* d0 = dividend */
 6f8:	202f 0008      	move.l 8(sp),d0
	jpl	2f
 6fc:	6a04           	bpl.s 702 <__divsi3+0x18>
	negl	d0
 6fe:	4480           	neg.l d0
	negb	d2
 700:	4402           	neg.b d2

2:	movel	d1, sp@-
 702:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 704:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__udivsi3)	/* divide abs(dividend) by abs(divisor) */
 706:	6186           	bsr.s 68e <__udivsi3>
	addql	IMM (8), sp
 708:	508f           	addq.l #8,sp

	tstb	d2
 70a:	4a02           	tst.b d2
	jpl	3f
 70c:	6a02           	bpl.s 710 <__divsi3+0x26>
	negl	d0
 70e:	4480           	neg.l d0

3:	movel	sp@+, d2
 710:	241f           	move.l (sp)+,d2
	rts
 712:	4e75           	rts

00000714 <__modsi3>:

	.text
	FUNC(__modsi3)
	.globl	SYM (__modsi3)
SYM (__modsi3):
	movel	sp@(8), d1	/* d1 = divisor */
 714:	222f 0008      	move.l 8(sp),d1
	movel	sp@(4), d0	/* d0 = dividend */
 718:	202f 0004      	move.l 4(sp),d0
	movel	d1, sp@-
 71c:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 71e:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__divsi3)
 720:	61c8           	bsr.s 6ea <__divsi3>
	addql	IMM (8), sp
 722:	508f           	addq.l #8,sp
	movel	sp@(8), d1	/* d1 = divisor */
 724:	222f 0008      	move.l 8(sp),d1
	movel	d1, sp@-
 728:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 72a:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
 72c:	6100 ff3e      	bsr.w 66c <__mulsi3>
	addql	IMM (8), sp
 730:	508f           	addq.l #8,sp
	movel	sp@(4), d1	/* d1 = dividend */
 732:	222f 0004      	move.l 4(sp),d1
	subl	d0, d1		/* d1 = a - (a/b)*b */
 736:	9280           	sub.l d0,d1
	movel	d1, d0
 738:	2001           	move.l d1,d0
	rts
 73a:	4e75           	rts

0000073c <__umodsi3>:

	.text
	FUNC(__umodsi3)
	.globl	SYM (__umodsi3)
SYM (__umodsi3):
	movel	sp@(8), d1	/* d1 = divisor */
 73c:	222f 0008      	move.l 8(sp),d1
	movel	sp@(4), d0	/* d0 = dividend */
 740:	202f 0004      	move.l 4(sp),d0
	movel	d1, sp@-
 744:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 746:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__udivsi3)
 748:	6100 ff44      	bsr.w 68e <__udivsi3>
	addql	IMM (8), sp
 74c:	508f           	addq.l #8,sp
	movel	sp@(8), d1	/* d1 = divisor */
 74e:	222f 0008      	move.l 8(sp),d1
	movel	d1, sp@-
 752:	2f01           	move.l d1,-(sp)
	movel	d0, sp@-
 754:	2f00           	move.l d0,-(sp)
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
 756:	6100 ff14      	bsr.w 66c <__mulsi3>
	addql	IMM (8), sp
 75a:	508f           	addq.l #8,sp
	movel	sp@(4), d1	/* d1 = dividend */
 75c:	222f 0004      	move.l 4(sp),d1
	subl	d0, d1		/* d1 = a - (a/b)*b */
 760:	9280           	sub.l d0,d1
	movel	d1, d0
 762:	2001           	move.l d1,d0
	rts
 764:	4e75           	rts

00000766 <KPutCharX>:
	.text
	FUNC(KPutCharX)
	.globl	SYM (KPutCharX)

SYM(KPutCharX):
    move.l  a6, -(sp)
 766:	2f0e           	move.l a6,-(sp)
    move.l  4.w, a6
 768:	2c78 0004      	movea.l 4 <_start+0x4>,a6
    jsr     -0x204(a6)
 76c:	4eae fdfc      	jsr -516(a6)
    movea.l (sp)+, a6
 770:	2c5f           	movea.l (sp)+,a6
    rts
 772:	4e75           	rts

00000774 <PutChar>:
	.text
	FUNC(PutChar)
	.globl	SYM (PutChar)

SYM(PutChar):
	move.b d0, (a3)+
 774:	16c0           	move.b d0,(a3)+
	rts
 776:	4e75           	rts
