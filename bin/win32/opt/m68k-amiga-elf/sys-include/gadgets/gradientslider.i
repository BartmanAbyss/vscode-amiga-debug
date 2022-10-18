	IFND GADGETS_GRADIENTSLIDER_I
GADGETS_GRADIENTSLIDER_I	SET	1

**	$VER: gradientslider.i 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the gradientslider BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved

;---------------------------------------------------------------------------

    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

;---------------------------------------------------------------------------

GRAD_Dummy	 equ (TAG_USER+$05000000)
GRAD_MaxVal	 equ (GRAD_Dummy+1)	; max value of slider
GRAD_CurVal	 equ (GRAD_Dummy+2)	; current value of slider
GRAD_SkipVal	 equ (GRAD_Dummy+3)	; "body click" move amount
GRAD_KnobPixels  equ (GRAD_Dummy+4)	; size of knob in pixels
GRAD_PenArray	 equ (GRAD_Dummy+5)	; pen colors				   */

;---------------------------------------------------------------------------

	ENDC	; GADGETS_GRADIENTSLIDER_I
