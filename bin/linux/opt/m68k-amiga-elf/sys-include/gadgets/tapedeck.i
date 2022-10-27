	IFND GADGETS_TAPEDECK_I
GADGETS_TAPEDECK_I	SET	1
**
**	$VER: tapedeck.i 40.1 (12.3.1993)
**	Includes Release 45.1
**
**	Definitions for the gradientslider BOOPSI class
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

;*****************************************************************************

TDECK_Dummy	equ	(TAG_USER+$05000000)
TDECK_Mode	equ	(TDECK_Dummy+1)
TDECK_Paused	equ	(TDECK_Dummy+2)

TDECK_Tape	equ	(TDECK_Dummy+3)
	; (BOOL) Indicate whether tapedeck or animation controls.  Defaults
	; to FALSE.

TDECK_Frames	equ	(TDECK_Dummy+11)
	; (LONG) Number of frames in animation.  Only valid when using
	; animation controls.

TDECK_CurrentFrame	equ	(TDECK_Dummy+12)
	; (LONG) Current frame.  Only valid when using animation controls.

;*****************************************************************************

;* Possible values for TDECK_Mode
BUT_REWIND	equ	0
BUT_PLAY	equ	1
BUT_FORWARD	equ	2
BUT_STOP	equ	3
BUT_PAUSE	equ	4
BUT_BEGIN	equ	5
BUT_FRAME	equ	6
BUT_END		equ	7

;*****************************************************************************

	ENDC	; GADGETS_TAPEDECK_I
