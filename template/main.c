#include "support/gcc8_c_support.h"
#include <proto/exec.h>
#include <proto/dos.h>
#include <proto/graphics.h>
#include <graphics/gfxbase.h>
#include <graphics/view.h>
#include <exec/execbase.h>
#include <graphics/gfxmacros.h>
#include <hardware/custom.h>
#include <hardware/dmabits.h>
#include <hardware/intbits.h>

struct ExecBase *SysBase;
volatile struct Custom *custom;
struct DosLibrary *DOSBase;
struct GfxBase *GfxBase;

//backup
static UWORD SystemInts;
static UWORD SystemDMA;
static UWORD SystemADKCON;
static volatile APTR VBR=0;
static APTR SystemIrq;
 
struct View *ActiView;

static APTR GetVBR(void) {
	APTR vbr = 0;
	UWORD getvbr[] = { 0x4e7a, 0x0801, 0x4e73 }; // MOVEC.L VBR,D0 RTE

	if (SysBase->AttnFlags & AFF_68010) 
		vbr = (APTR)Supervisor((ULONG (*)())getvbr);

	return vbr;
}

void SetInterruptHandler(APTR interrupt) {
	*(volatile APTR*)(((UBYTE*)VBR)+0x6c) = interrupt;
}

APTR GetInterruptHandler() {
	return *(volatile APTR*)(((UBYTE*)VBR)+0x6c);
}

//vblank begins at vpos 312 hpos 1 and ends at vpos 25 hpos 1
//vsync begins at line 2 hpos 132 and ends at vpos 5 hpos 18 
void WaitVbl() {
	debug_start_idle();
	while (1) {
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
		vpos&=0x1ff00;
		if (vpos!=(311<<8))
			break;
	}
	while (1) {
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
		vpos&=0x1ff00;
		if (vpos==(311<<8))
			break;
	}
	debug_stop_idle();
}

void WaitLine(USHORT line) {
	while (1) {
		volatile ULONG vpos=*(volatile ULONG*)0xDFF004;
		if(((vpos >> 8) & 511) == line)
			break;
	}
}

inline void WaitBlt() {
	UWORD tst=*(volatile UWORD*)&custom->dmaconr; //for compatiblity a1000
	(void)tst;
	while (*(volatile UWORD*)&custom->dmaconr&(1<<14)) {} //blitter busy wait
}

void TakeSystem() {
	ActiView=GfxBase->ActiView; //store current view
	OwnBlitter();
	WaitBlit();	
	Disable();
	
	//Save current interrupts and DMA settings so we can restore them upon exit. 
	SystemADKCON=custom->adkconr;
	SystemInts=custom->intenar;
	SystemDMA=custom->dmaconr;
	custom->intena=0x7fff;//disable all interrupts
	custom->intreq=0x7fff;//Clear any interrupts that were pending
	
	WaitVbl();
	WaitVbl();
	custom->dmacon=0x7fff;//Clear all DMA channels

	//set all colors black
	for(int a=0;a<32;a++)
		custom->color[a]=0;

	LoadView(0);
	WaitTOF();
	WaitTOF();

	WaitVbl();
	WaitVbl();

	VBR=GetVBR();
	SystemIrq=GetInterruptHandler(); //store interrupt register
}

void FreeSystem() { 
	WaitVbl();
	WaitBlt();
	custom->intena=0x7fff;//disable all interrupts
	custom->intreq=0x7fff;//Clear any interrupts that were pending
	custom->dmacon=0x7fff;//Clear all DMA channels

	//restore interrupts
	SetInterruptHandler(SystemIrq);

	/*Restore system copper list(s). */
	custom->cop1lc=(ULONG)GfxBase->copinit;
	custom->cop2lc=(ULONG)GfxBase->LOFlist;
	custom->copjmp1=0x7fff; //start coppper

	/*Restore all interrupts and DMA settings. */
	custom->intena=SystemInts|0x8000;
	custom->dmacon=SystemDMA|0x8000;
	custom->adkcon=SystemADKCON|0x8000;

	LoadView(ActiView);
	WaitTOF();
	WaitTOF();
	WaitBlit();	
	DisownBlitter();
	Enable();
}

inline short MouseLeft(){return !((*(volatile UBYTE*)0xbfe001)&64);}	
inline short MouseRight(){return !((*(volatile UWORD*)0xdff016)&(1<<10));}

// DEMO - INCBIN
volatile short frameCounter = 0;
INCBIN(colors, "image.pal")
INCBIN_CHIP(image, "image.bpl") // load image into chipmem so we can use it without copying

// put copperlist into chip mem so we can use it without copying
const UWORD copper2[] __attribute__((section (".MEMF_CHIP"))) = {
	0xe001, 0xff00, offsetof(struct Custom, color[29]), 0x0eee, // line 0xe0
	0xe101, 0xff00, offsetof(struct Custom, color[29]), 0x0ddd, // line 0xe1
	0xe201, 0xff00, offsetof(struct Custom, color[29]), 0x0ccc, // line 0xe2
	0xe301, 0xff00, offsetof(struct Custom, color[29]), 0x0bbb, // line 0xe3
	0xe401, 0xff00, offsetof(struct Custom, color[29]), 0x0aaa, // line 0xe4
	0xe501, 0xff00, offsetof(struct Custom, color[29]), 0x0999, // line 0xe5
	0xe601, 0xff00, offsetof(struct Custom, color[29]), 0x0888, // line 0xe6
	0xe701, 0xff00, offsetof(struct Custom, color[29]), 0x0777, // line 0xe7
	0xe801, 0xff00, offsetof(struct Custom, color[29]), 0x0666, // line 0xe8
	0xe901, 0xff00, offsetof(struct Custom, color[29]), 0x0555, // line 0xe9
	0xea01, 0xff00, offsetof(struct Custom, color[29]), 0x0444, // line 0xea
	0xeb01, 0xff00, offsetof(struct Custom, color[29]), 0x0333, // line 0xeb
	0xec01, 0xff00, offsetof(struct Custom, color[29]), 0x0222, // line 0xec
	0xed01, 0xff00, offsetof(struct Custom, color[29]), 0x0111, // line 0xed
	0xee01, 0xff00, offsetof(struct Custom, color[29]), 0x0000, // line 0xee
	0xffff, 0xfffe // end copper list
};

// Demo - Module Player - ThePlayer 6.1a: https://www.pouet.net/prod.php?which=19922
// The Player® 6.1A: Copyright © 1992-95 Jarno Paananen
// P61.testmod - Module by Skylord/Sector 7 
INCBIN(player, "player610.6.no_cia.bin")
INCBIN_CHIP(module, "testmod.p61")

void* doynaxdepack(const void* input, void* output) { // returns end of output data, input needs to be 16-bit aligned!
	register volatile const void* _a0 __asm("a0") = input;
	register volatile       void* _a1 __asm("a1") = output;
	__asm volatile (
		"movem.l %%d0-%%d7/%%a2-%%a6,-(%%sp)\n"
		"jsr _doynaxdepack_asm\n"
		"movem.l (%%sp)+,%%d0-%%d7/%%a2-%%a6"
	: "+rf"(_a0), "+rf"(_a1)
	:
	: "cc", "memory");
	return (void*)_a1;
}

int p61Init(const void* module) { // returns 0 if success, non-zero otherwise
	register volatile const void* _a0 __asm("a0") = module;
	register volatile const void* _a1 __asm("a1") = NULL;
	register volatile const void* _a2 __asm("a2") = NULL;
	register volatile const void* _a3 __asm("a3") = player;
	         register int         _d0 __asm("d0"); // return value
	__asm volatile (
		"movem.l %%d1-%%d7/%%a4-%%a6,-(%%sp)\n"
		"jsr 0(%%a3)\n"
		"movem.l (%%sp)+,%%d1-%%d7/%%a4-%%a6"
	: "=r" (_d0), "+rf"(_a0), "+rf"(_a1), "+rf"(_a2), "+rf"(_a3)
	:
	: "cc", "memory");
	return _d0;
}

void p61Music() {
	register volatile const void* _a3 __asm("a3") = player;
	register volatile const void* _a6 __asm("a6") = (void*)0xdff000;
	__asm volatile (
		"movem.l %%d0-%%d7/%%a0-%%a2/%%a4-%%a5,-(%%sp)\n"
		"jsr 4(%%a3)\n"
		"movem.l (%%sp)+,%%d0-%%d7/%%a0-%%a2/%%a4-%%a5"
	: "+rf"(_a3), "+rf"(_a6)
	:
	: "cc", "memory");
}

void p61End() {
	register volatile const void* _a3 __asm("a3") = player;
	register volatile const void* _a6 __asm("a6") = (void*)0xdff000;
	__asm volatile (
		"movem.l %%d0-%%d1/%%a0-%%a1,-(%%sp)\n"
		"jsr 8(%%a3)\n"
		"movem.l (%%sp)+,%%d0-%%d1/%%a0-%%a1"
	: "+rf"(_a3), "+rf"(_a6)
	:
	: "cc", "memory");
}

inline USHORT* copSetPlanes(UBYTE bplPtrStart,USHORT* copListEnd,const UBYTE **planes,int numPlanes) {
	for (USHORT i=0;i<numPlanes;i++) {
		ULONG addr=(ULONG)planes[i];
		*copListEnd++=offsetof(struct Custom, bplpt[i + bplPtrStart]);
		*copListEnd++=(UWORD)(addr>>16);
		*copListEnd++=offsetof(struct Custom, bplpt[i + bplPtrStart])+2;
		*copListEnd++=(UWORD)addr;
	}
	return copListEnd;
}

inline USHORT* copWaitXY(USHORT *copListEnd,USHORT x,USHORT i) {
	*copListEnd++=(i<<8)|(x<<1)|1;	//bit 1 means wait. waits for vertical position x<<8, first raster stop position outside the left 
	*copListEnd++=0xfffe;
	return copListEnd;
}

inline USHORT* copWaitY(USHORT* copListEnd,USHORT i) {
	*copListEnd++=(i<<8)|4|1;	//bit 1 means wait. waits for vertical position x<<8, first raster stop position outside the left 
	*copListEnd++=0xfffe;
	return copListEnd;
}

inline USHORT* copSetColor(USHORT* copListCurrent,USHORT index,USHORT color) {
	*copListCurrent++=offsetof(struct Custom, color[index]);
	*copListCurrent++=color;
	return copListCurrent;
}

UWORD* scroll = NULL;

static const UBYTE sinus[] = { 
	8,8,9,10,10,11,12,12,
	13,13,14,14,14,15,15,15,
	15,15,15,15,14,14,14,13,
	13,12,12,11,10,10,9,8,
	8,7,6,5,5,4,3,3,
	2,2,1,1,1,0,0,0,
	0,0,0,0,1,1,1,2,
	2,3,3,4,5,5,6,7, 
};

static __attribute__((interrupt)) void interruptHandler() {
	custom->intreq=(1<<INTB_VERTB); custom->intreq=(1<<INTB_VERTB); //reset vbl req. twice for a4000 bug.

	// modify scrolling in copper list
	if(scroll) {
		int sin = sinus[frameCounter & 63];
		*scroll = sin | (sin << 4);
	}

	// DEMO - ThePlayer
	p61Music();
	// DEMO - increment frameCounter
	frameCounter++;
}

#ifdef __cplusplus
	class TestClass {
	public:
		TestClass(int y) {
			static int x = 7;
			i = y + x;
		}

		int i;
	};

	TestClass staticClass(4);
#endif

// set up a 320x256 lowres display
inline USHORT* screenScanDefault(USHORT* copListEnd) {
	const USHORT x=129;
	const USHORT width=320;
	const USHORT height=256;
	const USHORT y=44;
	const USHORT RES=8; //8=lowres,4=hires
	USHORT xstop = x+width;
	USHORT ystop = y+height;
	USHORT fw=(x>>1)-RES;

	*copListEnd++ = offsetof(struct Custom, ddfstrt);
	*copListEnd++ = fw;
	*copListEnd++ = offsetof(struct Custom, ddfstop);
	*copListEnd++ = fw+(((width>>4)-1)<<3);
	*copListEnd++ = offsetof(struct Custom, diwstrt);
	*copListEnd++ = x+(y<<8);
	*copListEnd++ = offsetof(struct Custom, diwstop);
	*copListEnd++ = (xstop-256)+((ystop-256)<<8);
	return copListEnd;
}

static void Wait10() { WaitLine(0x10); }
static void Wait11() { WaitLine(0x11); }
static void Wait12() { WaitLine(0x12); }
static void Wait13() { WaitLine(0x13); }

int main() {
	SysBase = *((struct ExecBase**)4UL);
	custom = (struct Custom*)0xdff000;

	// We will use the graphics library only to locate and restore the system copper list once we are through.
	GfxBase = (struct GfxBase *)OpenLibrary((CONST_STRPTR)"graphics.library",0);
	if (!GfxBase)
		Exit(0);

	// used for printing
	DOSBase = (struct DosLibrary*)OpenLibrary((CONST_STRPTR)"dos.library", 0);
	if (!DOSBase)
		Exit(0);

#ifdef __cplusplus
	KPrintF("Hello debugger from Amiga: %ld!\n", staticClass.i);
#else
	KPrintF("Hello debugger from Amiga!\n");
#endif
	Write(Output(), (APTR)"Hello console!\n", 15);
	Delay(50);

	warpmode(1);
	// TODO: precalc stuff here
	if(p61Init(module) != 0)
		KPrintF("p61Init failed!\n");
	warpmode(0);

	TakeSystem();
	WaitVbl();

	USHORT* copper1 = AllocMem(1024, MEMF_CHIP);
	USHORT* copPtr = copper1;

	// register graphics resources with WinUAE for nicer gfx debugger experience
	debug_register_bitmap(image, "image.bpl", 320, 256, 5, 0);
	debug_register_palette(colors, "image.pal", 32, 0);
	debug_register_copperlist(copper1, "copper1", 1024, 0);
	debug_register_copperlist(copper2, "copper2", sizeof(copper2), 0);

	copPtr = screenScanDefault(copPtr);
	//enable bitplanes	
	*copPtr++ = offsetof(struct Custom, bplcon0);
	*copPtr++ = (0<<10)/*dual pf*/|(1<<9)/*color*/|((5)<<12)/*num bitplanes*/;
	*copPtr++ = offsetof(struct Custom, bplcon1);	//scrolling
	scroll = copPtr;
	*copPtr++ = 0;
	*copPtr++ = offsetof(struct Custom, bplcon2);	//playfied priority
	*copPtr++ = 1<<6;//0x24;			//Sprites have priority over playfields

	//set bitplane modulo
	*copPtr++=offsetof(struct Custom, bpl1mod); //odd planes   1,3,5
	*copPtr++=0;
	*copPtr++=offsetof(struct Custom, bpl2mod); //even  planes 2,4
	*copPtr++=0;

	// set bitplane pointers
	const USHORT planeSize=320/8*256;
	const UBYTE* planes[5];
	for(int a=0;a<5;a++)
		planes[a]=image + planeSize * a;
	copPtr = copSetPlanes(0, copPtr, planes, 5);

	// set colors
	for(int a=0; a < 32; a++)
		copPtr = copSetColor(copPtr, a, ((USHORT*)colors)[a]);

	// jump to copper2
	*copPtr++ = offsetof(struct Custom, copjmp2);
	*copPtr++ = 0x7fff;

	custom->cop1lc = (ULONG)copper1;
	custom->cop2lc = (ULONG)copper2;
	custom->dmacon = DMAF_BLITTER;//disable blitter dma for copjmp bug
	custom->copjmp1 = 0x7fff; //start coppper
	custom->dmacon = DMAF_SETCLR | DMAF_MASTER | DMAF_RASTER | DMAF_COPPER | DMAF_BLITTER;

	// DEMO
	SetInterruptHandler((APTR)interruptHandler);
	custom->intena=(1<<INTB_SETCLR)|(1<<INTB_INTEN)|(1<<INTB_VERTB)|(1<<INTB_EXTER); // ThePlayer needs INTB_EXTER
	custom->intreq=(1<<INTB_VERTB);//reset vbl req

	while(!MouseLeft()) {
		WaitVbl();
		int f = frameCounter & 255;

		Wait10();
		Wait11();
		Wait12();
		Wait13();

		// WinUAE debug overlay test
		debug_clear();
		debug_filled_rect(f + 100, 200*2, f + 400, 220*2, 0x0000ff00); // 0x00RRGGBB
		debug_rect(f + 90, 190*2, f + 400, 220*2, 0x000000ff); // 0x00RRGGBB
		debug_text(f+ 130, 209*2, "This is a WinUAE debug overlay", 0x00ff00ff);
	}

	p61End();

	// END
	FreeSystem();

	CloseLibrary((struct Library*)DOSBase);
	CloseLibrary((struct Library*)GfxBase);
}
