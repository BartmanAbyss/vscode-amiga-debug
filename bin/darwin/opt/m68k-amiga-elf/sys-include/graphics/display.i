	IFND	GRAPHICS_DISPLAY_I
GRAPHICS_DISPLAY_I	SET	1
**
**	$VER: display.i 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	include define file for display control registers
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

* bplcon0 defines
MODE_640    equ   $8000
PLNCNTMSK   equ   $7		    * how many bit planes?
*				    * 0 = none, 1->6 = 1->6, 7 = reserved
PLNCNTSHFT  equ   12		    * bits to shift for bplcon0
PF2PRI	    equ   $40		    * bplcon2 bit
COLORON     equ   $0200	    * disable color burst
DBLPF	    equ   $400
HOLDNMODIFY equ   $800
INTERLACE   equ   4		    * interlace mode for 400

* bplcon1 defines
PFA_FINE_SCROLL       equ   $F
PFB_FINE_SCROLL_SHIFT equ   4
PF_FINE_SCROLL_MASK   equ   $F

* display window start and stop defines
DIW_HORIZ_POS	      equ   $7F     * horizontal start/stop
DIW_VRTCL_POS	      equ   $1FF    * vertical start/stop
DIW_VRTCL_POS_SHIFT   equ   7

* Data fetch start/stop horizontal position
DFTCH_MASK	      equ   $FF

* vposr bits
VPOSRLOF	      equ   $8000

	ENDC	; GRAPHICS_DISPLAY_I
