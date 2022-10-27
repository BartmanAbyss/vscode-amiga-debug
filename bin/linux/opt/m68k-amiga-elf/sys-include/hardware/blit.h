#ifndef	HARDWARE_BLIT_H
#define	HARDWARE_BLIT_H
/*
**	$VER: blit.h 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	Defines for direct hardware use of the blitter.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#define HSIZEBITS 6
#define VSIZEBITS 16-HSIZEBITS
#define HSIZEMASK 0x3f	      /* 2^6 -- 1 */
#define VSIZEMASK 0x3FF       /* 2^10 - 1 */

/* all agnii support horizontal blit of at least 1024 bits (128 bytes) wide */
/* some agnii support horizontal blit of up to 32768 bits (4096 bytes) wide */

#ifndef	 NO_BIG_BLITS
#define  MINBYTESPERROW 128
#define  MAXBYTESPERROW 4096
#else
#define  MAXBYTESPERROW 128
#endif

/* definitions for blitter control register 0 */

#define ABC    0x80
#define ABNC   0x40
#define ANBC   0x20
#define ANBNC  0x10
#define NABC   0x8
#define NABNC  0x4
#define NANBC  0x2
#define NANBNC 0x1

/* some commonly used operations */
#define A_OR_B	  ABC|ANBC|NABC | ABNC|ANBNC|NABNC
#define A_OR_C	  ABC|NABC|ABNC | ANBC|NANBC|ANBNC
#define A_XOR_C   NABC|ABNC   | NANBC|ANBNC
#define A_TO_D	  ABC|ANBC|ABNC|ANBNC

#define BC0B_DEST 8
#define BC0B_SRCC 9
#define BC0B_SRCB   10
#define BC0B_SRCA 11
#define BC0F_DEST 0x100
#define BC0F_SRCC 0x200
#define BC0F_SRCB 0x400
#define BC0F_SRCA 0x800

#define BC1F_DESC   2	      /* blitter descend direction */

#define DEST 0x100
#define SRCC 0x200
#define SRCB 0x400
#define SRCA 0x800

#define ASHIFTSHIFT  12       /* bits to right align ashift value */
#define BSHIFTSHIFT  12       /* bits to right align bshift value */

/* definations for blitter control register 1 */
#define LINEMODE     0x1
#define FILL_OR      0x8
#define FILL_XOR     0x10
#define FILL_CARRYIN 0x4
#define ONEDOT	     0x2      /* one dot per horizontal line */
#define OVFLAG	     0x20
#define SIGNFLAG     0x40
#define BLITREVERSE  0x2

#define SUD	     0x10
#define SUL	     0x8
#define AUL	     0x4

#define OCTANT8   24
#define OCTANT7   4
#define OCTANT6   12
#define OCTANT5   28
#define OCTANT4   20
#define OCTANT3   8
#define OCTANT2   0
#define OCTANT1   16

/* stuff for blit qeuer */
struct bltnode
{
    struct  bltnode *n;
    int     (*function)();
    char    stat;
    short   blitsize;
    short   beamsync;
    int     (*cleanup)();
};

/* defined bits for bltstat */
#define CLEANUP 0x40
#define CLEANME CLEANUP

#endif	/* HARDWARE_BLIT_H */
