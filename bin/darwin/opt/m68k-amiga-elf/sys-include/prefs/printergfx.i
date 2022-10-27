	IFND	PREFS_PRINTERGFX_I
PREFS_PRINTERGFX_I	SET	1
**
**	$VER: printergfx.i 38.3 (25.6.1992)
**	Includes Release 45.1
**
**	File format for graphics printer preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

;---------------------------------------------------------------------------

ID_PGFX equ "PGFX"


   STRUCTURE PrinterGfxPrefs,0
	STRUCT pg_Reserved,4*4
	UWORD  pg_Aspect
	UWORD  pg_Shade
	UWORD  pg_Image
	WORD   pg_Threshold
	UBYTE  pg_ColorCorrect
	UBYTE  pg_Dimensions
	UBYTE  pg_Dithering
	UWORD  pg_GraphicFlags
	UBYTE  pg_PrintDensity		; Print density 1 - 7
	UWORD  pg_PrintMaxWidth
	UWORD  pg_PrintMaxHeight
	UBYTE  pg_PrintXOffset
	UBYTE  pg_PrintYOffset
   LABEL PrinterGfxPref_SIZEOF

; constants for PrinterGfxPrefs.pg_Aspect
PA_HORIZONTAL equ 0
PA_VERTICAL   equ 1

; constants for PrinterGfxPrefs.pg_Shade
PS_BW		equ 0
PS_GREYSCALE	equ 1
PS_COLOR	equ 2
PS_GREY_SCALE2	equ 3

; constants for PrinterGfxPrefs.pg_Image
PI_POSITIVE equ 0
PI_NEGATIVE equ 1

; flags for PrinterGfxPrefs.pg_ColorCorrect
	BITDEF PCC,RED,0	; color correct red shades
	BITDEF PCC,GREEN,1	; color correct green shades
	BITDEF PCC,BLUE,2	; color correct blue shades

; constants for PrinterGfxPrefs.pg_Dimensions
PD_IGNORE   equ 0  ; ignore max width/height settings
PD_BOUNDED  equ 1  ; use max w/h as boundaries
PD_ABSOLUTE equ 2  ; use max w/h as absolutes
PD_PIXEL    equ 3  ; use max w/h as prt pixels
PD_MULTIPLY equ 4  ; use max w/h as multipliers

; constants for PrinterGfxPrefs.pg_Dithering
PD_ORDERED  equ	0  ; ordered dithering
PD_HALFTONE equ	1  ; halftone dithering
PD_FLOYD    equ	2  ; Floyd-Steinberg dithering

; flags for PrinterGfxPrefs.pg_GraphicsFlags */
	BITDEF PGF,CENTER_IMAGE,0	; center image on paper
	BITDEF PGF,INTEGER_SCALING,1	; force integer scaling
	BITDEF PGF,ANTI_ALIAS,2		; anti-alias image

;---------------------------------------------------------------------------

	ENDC	; PREFS_PRINTERGFX_I
