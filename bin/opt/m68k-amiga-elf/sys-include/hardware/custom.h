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
    UWORD   bltddat;
    UWORD   dmaconr;
    UWORD   vposr;
    UWORD   vhposr;
    UWORD   dskdatr;
    UWORD   joy0dat;
    UWORD   joy1dat;
    UWORD   clxdat;
    UWORD   adkconr;
    UWORD   pot0dat;
    UWORD   pot1dat;
    UWORD   potinp;
    UWORD   serdatr;
    UWORD   dskbytr;
    UWORD   intenar;
    UWORD   intreqr;
    APTR    dskpt;
    UWORD   dsklen;
    UWORD   dskdat;
    UWORD   refptr;
    UWORD   vposw;
    UWORD   vhposw;
    UWORD   copcon;
    UWORD   serdat;
    UWORD   serper;
    UWORD   potgo;
    UWORD   joytest;
    UWORD   strequ;
    UWORD   strvbl;
    UWORD   strhor;
    UWORD   strlong;
    UWORD   bltcon0;
    UWORD   bltcon1;
    UWORD   bltafwm;
    UWORD   bltalwm;
    APTR    bltcpt;
    APTR    bltbpt;
    APTR    bltapt;
    APTR    bltdpt;
    UWORD   bltsize;
    UBYTE   pad2d;
    UBYTE   bltcon0l;	/* low 8 bits of bltcon0, write only */
    UWORD   bltsizv;
    UWORD   bltsizh;	/* 5e */
    UWORD   bltcmod;
    UWORD   bltbmod;
    UWORD   bltamod;
    UWORD   bltdmod;
    UWORD   pad34[4];
    UWORD   bltcdat;
    UWORD   bltbdat;
    UWORD   bltadat;
    UWORD   pad3b[3];
    UWORD   deniseid;	/* 7c */
    UWORD   dsksync;
    ULONG   cop1lc;
    ULONG   cop2lc;
    UWORD   copjmp1;
    UWORD   copjmp2;
    UWORD   copins;
    UWORD   diwstrt;
    UWORD   diwstop;
    UWORD   ddfstrt;
    UWORD   ddfstop;
    UWORD   dmacon;
    UWORD   clxcon;
    UWORD   intena;
    UWORD   intreq;
    UWORD   adkcon;
    struct  AudChannel {
      UWORD *ac_ptr; /* ptr to start of waveform data */
      UWORD ac_len;	/* length of waveform in words */
      UWORD ac_per;	/* sample period */
      UWORD ac_vol;	/* volume */
      UWORD ac_dat;	/* sample pair */
      UWORD ac_pad[2];	/* unused */
    } aud[4];
    APTR    bplpt[8];
    UWORD   bplcon0;
    UWORD   bplcon1;
    UWORD   bplcon2;
    UWORD   bplcon3;
    UWORD   bpl1mod;
    UWORD   bpl2mod;
    UWORD   bplcon4;
    UWORD   clxcon2;
    UWORD   bpldat[8];
    APTR    sprpt[8];
    struct  SpriteDef {
      UWORD pos;
      UWORD ctl;
      UWORD dataa;
      UWORD datab;
    } spr[8];
    UWORD   color[32];
    UWORD htotal;
    UWORD hsstop;
    UWORD hbstrt;
    UWORD hbstop;
    UWORD vtotal;
    UWORD vsstop;
    UWORD vbstrt;
    UWORD vbstop;
    UWORD sprhstrt;
    UWORD sprhstop;
    UWORD bplhstrt;
    UWORD bplhstop;
    UWORD hhposw;
    UWORD hhposr;
    UWORD beamcon0;
    UWORD hsstrt;
    UWORD vsstrt;
    UWORD hcenter;
    UWORD diwhigh;	/* 1e4 */
    UWORD padf3[11];
    UWORD fmode;
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
