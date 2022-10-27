#ifndef	GRAPHICS_DISPLAY_H
#define	GRAPHICS_DISPLAY_H
/*
**	$VER: display.h 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	include define file for display control registers
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/* bplcon0 defines */
#define MODE_640    0x8000
#define PLNCNTMSK   0x7	    /* how many bit planes? */
				    /* 0 = none, 1->6 = 1->6, 7 = reserved */
#define PLNCNTSHFT  12		    /* bits to shift for bplcon0 */
#define PF2PRI	    0x40	    /* bplcon2 bit */
#define COLORON     0x0200	    /* disable color burst */
#define DBLPF	    0x400
#define HOLDNMODIFY 0x800
#define INTERLACE   4		    /* interlace mode for 400 */

/* bplcon1 defines */
#define PFA_FINE_SCROLL       0xF
#define PFB_FINE_SCROLL_SHIFT 4
#define PF_FINE_SCROLL_MASK   0xF

/* display window start and stop defines */
#define DIW_HORIZ_POS	0x7F	   /* horizontal start/stop */
#define DIW_VRTCL_POS	0x1FF	   /* vertical start/stop */
#define DIW_VRTCL_POS_SHIFT 7

/* Data fetch start/stop horizontal position */
#define DFTCH_MASK	0xFF

/* vposr bits */
#define VPOSRLOF	0x8000

#endif	/* GRAPHICS_DISPLAY_H */
