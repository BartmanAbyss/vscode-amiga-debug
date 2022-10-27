	IFND PREFS_POINTER_I
PREFS_POINTER_I		SET	1
**
**	$VER: pointer.i 39.2 (9.6.1992)
**	Includes Release 45.1
**
**	File format for pointer preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND LIBRARIES_IFFPARSE_I
	INCLUDE "libraries/iffparse.i"
	ENDC

;---------------------------------------------------------------------------

ID_PNTR		equ	'PNTR'

;---------------------------------------------------------------------------

    STRUCTURE PointerPrefs,0
	STRUCT	pp_Reserved,4*4
	UWORD	pp_Which				; 0=NORMAL, 1=BUSY
	UWORD	pp_Size					; see "intuition/pointerclass.i"
	UWORD	pp_Width				; Width in pixels
	UWORD	pp_Ieight				; Height in pixels
	UWORD	pp_Depth				; Depth
	UWORD	pp_YSize				; YSize
	UWORD	pp_X, pp_Y				; Hotspot

	; Color Table:	numEntries = (1 << pp_Depth) - 1
	; Sprite data follows

    LABEL PointerPrefs_SIZEOF

;---------------------------------------------------------------------------

; constants for PointerPrefs.pp_Which
WBP_NORMAL	equ	0
WBP_BUSY	equ	1

;---------------------------------------------------------------------------

    STRUCTURE RGBTable,0
	UBYTE	rgbt_Red
	UBYTE	rgbt_Green
	UBYTE	rgbt_Blue
    LABEL RGBTable_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_POINTER_I
