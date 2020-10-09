#ifndef	HARDWARE_CUSTOM_H
#define	HARDWARE_CUSTOM_H
/*
**	$VER: custom.h 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	Offsets of Amiga custom chip registers
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif /* EXEC_TYPES_H */



/*
 * do this to get base of custom registers:
 * extern struct Custom custom;
 */


struct Custom {
    volatile UWORD   bltddat;
    volatile UWORD   dmaconr;
    union {
    	volatile ULONG vpos32;
    	struct {
    		union {
    			volatile UWORD   vposr;
    			struct {
        			volatile UBYTE  vposr_h;
        			volatile UBYTE  vposr_l;
    			};
    		};
    		union {
    			volatile UWORD   vhposr;
    			struct {
        			volatile UBYTE  vhposr_h;
        			volatile UBYTE  vhposr_l;
    			};
    		};
    	};
    };
    volatile UWORD   dskdatr;
    volatile UWORD   joy0dat;
    volatile UWORD   joy1dat;
    volatile UWORD   clxdat;
    volatile UWORD   adkconr;
    volatile UWORD   pot0dat;
    volatile UWORD   pot1dat;
    volatile UWORD   potinp;
    volatile UWORD   serdatr;
    volatile UWORD   dskbytr;
    volatile UWORD   intenar;
    volatile UWORD   intreqr;
    volatile APTR    dskpt;
    volatile UWORD   dsklen;
    volatile UWORD   dskdat;
    volatile UWORD   refptr;
    volatile UWORD   vposw;
    volatile UWORD   vhposw;
    volatile UWORD   copcon;
    volatile UWORD   serdat;
    volatile UWORD   serper;
    volatile UWORD   potgo;
    volatile UWORD   joytest;
    volatile UWORD   strequ;
    volatile UWORD   strvbl;
    volatile UWORD   strhor;
    volatile UWORD   strlong;
    volatile UWORD   bltcon0;
    volatile UWORD   bltcon1;
    volatile UWORD   bltafwm;
    volatile UWORD   bltalwm;
    volatile APTR    bltcpt;
    volatile APTR    bltbpt;
    volatile APTR    bltapt;
    volatile APTR    bltdpt;
    volatile UWORD   bltsize;
    volatile UBYTE   pad2d;
    volatile UBYTE   bltcon0l;	/* low 8 bits of bltcon0, write only */
    volatile UWORD   bltsizv;
    volatile UWORD   bltsizh;	/* 5e */
    volatile UWORD   bltcmod;
    volatile UWORD   bltbmod;
    volatile UWORD   bltamod;
    volatile UWORD   bltdmod;
    volatile UWORD   pad34[4];
    volatile UWORD   bltcdat;
    volatile UWORD   bltbdat;
    volatile UWORD   bltadat;
    volatile UWORD   pad3b[3];
    volatile UWORD   deniseid;	/* 7c */
    volatile UWORD   dsksync;
    volatile ULONG   cop1lc;
    volatile ULONG   cop2lc;
    volatile UWORD   copjmp1;
    volatile UWORD   copjmp2;
    volatile UWORD   copins;
    volatile UWORD   diwstrt;
    volatile UWORD   diwstop;
    volatile UWORD   ddfstrt;
    volatile UWORD   ddfstop;
    volatile UWORD   dmacon;
    volatile UWORD   clxcon;
    volatile UWORD   intena;
    volatile UWORD   intreq;
    volatile UWORD   adkcon;
    struct  AudChannel {
      volatile UWORD *ac_ptr; /* ptr to start of waveform data */
      volatile UWORD ac_len;	/* length of waveform in words */
      volatile UWORD ac_per;	/* sample period */
      volatile UWORD ac_vol;	/* volume */
      volatile UWORD ac_dat;	/* sample pair */
      volatile UWORD ac_pad[2];	/* unused */
    } aud[4];
    volatile APTR    bplpt[8];
    volatile UWORD   bplcon0;
    volatile UWORD   bplcon1;
    volatile UWORD   bplcon2;
    volatile UWORD   bplcon3;
    volatile UWORD   bpl1mod;
    volatile UWORD   bpl2mod;
    volatile UWORD   bplcon4;
    volatile UWORD   clxcon2;
    volatile UWORD   bpldat[8];
    volatile APTR    sprpt[8];
    struct  SpriteDef {
      volatile UWORD pos;
      volatile UWORD ctl;
      volatile UWORD dataa;
      volatile UWORD datab;
    } spr[8];
    volatile UWORD   color[32];
    volatile UWORD htotal;
    volatile UWORD hsstop;
    volatile UWORD hbstrt;
    volatile UWORD hbstop;
    volatile UWORD vtotal;
    volatile UWORD vsstop;
    volatile UWORD vbstrt;
    volatile UWORD vbstop;
    volatile UWORD sprhstrt;
    volatile UWORD sprhstop;
    volatile UWORD bplhstrt;
    volatile UWORD bplhstop;
    volatile UWORD hhposw;
    volatile UWORD hhposr;
    volatile UWORD beamcon0;
    volatile UWORD hsstrt;
    volatile UWORD vsstrt;
    volatile UWORD hcenter;
    volatile UWORD diwhigh;	/* 1e4 */
    volatile UWORD padf3[11];
    volatile UWORD fmode;
};

#ifdef ECS_SPECIFIC

/* defines for beamcon register */
#define VARVBLANK	0x1000	/* Variable vertical blank enable */
#define LOLDIS		0x0800	/* long line disable */
#define CSCBLANKEN	0x0400	/* redirect composite sync */
#define VARVSYNC	0x0200	/* Variable vertical sync enable */
#define VARHSYNC	0x0100	/* Variable horizontal sync enable */
#define VARBEAM	0x0080	/* variable beam counter enable */
#define DISPLAYDUAL	0x0040	/* use UHRES pointer and standard pointers */
#define DISPLAYPAL	0x0020	/* set decodes to generate PAL display */
#define VARCSYNC	0x0010	/* Variable composite sync enable */
#define CSBLANK	0x0008	/* Composite blank out to CSY* pin */
#define CSYNCTRUE	0x0004	/* composite sync true signal */
#define VSYNCTRUE	0x0002	/* vertical sync true */
#define HSYNCTRUE	0x0001	/* horizontal sync true */

/* new defines for bplcon0 */
#define USE_BPLCON3	1

/* new defines for bplcon2 */
#define BPLCON2_ZDCTEN		(1<<10) /* colormapped genlock bit */
#define BPLCON2_ZDBPEN		(1<<11) /* use bitplane as genlock bits */
#define BPLCON2_ZDBPSEL0	(1<<12) /* three bits to select one */
#define BPLCON2_ZDBPSEL1	(1<<13) /* of 8 bitplanes in */
#define BPLCON2_ZDBPSEL2	(1<<14) /* ZDBPEN genlock mode */

/* defines for bplcon3 register */
#define BPLCON3_EXTBLNKEN	(1<<0)	/* external blank enable */
#define BPLCON3_EXTBLKZD	(1<<1)	/* external blank ored into trnsprncy */
#define BPLCON3_ZDCLKEN	(1<<2)	/* zd pin outputs a 14mhz clock*/
#define BPLCON3_BRDNTRAN	(1<<4)	/* border is opaque */
#define BPLCON3_BRDNBLNK	(1<<5)	/* border is opaque */

#endif	/* ECS_SPECIFIC */

#endif	/* HARDWARE_CUSTOM_H */
