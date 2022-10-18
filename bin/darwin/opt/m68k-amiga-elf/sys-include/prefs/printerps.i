	IFND	PREFS_PRINTERPS_I
PREFS_PRINTERPS_I	SET	1
**
**	$VER: printerps.i 38.6 (6.5.1993)
**	Includes Release 45.1
**
**	File format for PostScript printer preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

;---------------------------------------------------------------------------

ID_POST equ "PSPD"


   STRUCTURE PrinterPSPrefs,0
	STRUCT ps_Reserved,4*4		; System reserved

	; Global printing attributes
	UBYTE  ps_DriverMode
	UBYTE  ps_PaperFormat
	STRUCT ps_Reserved1,2
	LONG   ps_Copies
	LONG   ps_PaperWidth
	LONG   ps_PaperHeight
	LONG   ps_HorizontalDPI
	LONG   ps_VerticalDPI

	; Text Options
	UBYTE  ps_Font;
	UBYTE  ps_Pitch
	UBYTE  ps_Orientation
	UBYTE  ps_Tab
	STRUCT ps_Reserved2,8

	; Text Dimensions
	LONG   ps_LeftMargin
	LONG   ps_RightMargin
	LONG   ps_TopMargin
	LONG   ps_BottomMargin
	LONG   ps_FontPointSize
	LONG   ps_Leading
	STRUCT ps_Reserved3,8

	; Graphics Options
	LONG   ps_LeftEdge
	LONG   ps_TopEdge
	LONG   ps_Width
	LONG   ps_Height
	UBYTE  ps_Image
	UBYTE  ps_Shading
	UBYTE  ps_Dithering
	STRUCT ps_Reserved4,9

	UBYTE  ps_Aspect
	UBYTE  ps_ScalingType
	UBYTE  ps_Reversed5
	UBYTE  ps_Centering
	STRUCT ps_Reserved6,8
   LABEL PrinterPSPrefs_SIZEOF

; All measurements are in Millipoints which is 1/1000 of a point, or
; in other words 1/72000 of an inch
;

; constants for PrinterPSPrefs.ps_DriverMode
DM_POSTSCRIPT  equ 0
DM_PASSTHROUGH equ 1

; constants for PrinterPSPrefs.ps_PaperFormat
PF_USLETTER equ 0
PF_USLEGAL  equ 1
PF_A4	    equ 2
PF_CUSTOM   equ 3

; constants for PrinterPSPrefs.ps_Font
FONT_COURIER	  equ 0
FONT_TIMES	  equ 1
FONT_HELVETICA	  equ 2
FONT_HELV_NARROW  equ 3
FONT_AVANTGARDE   equ 4
FONT_BOOKMAN	  equ 5
FONT_NEWCENT	  equ 6
FONT_PALATINO	  equ 7
FONT_ZAPFCHANCERY equ 8

; constants for PrinterPSPrefs.ps_Pitch
PITCH_NORMAL	 equ 0
PITCH_COMPRESSED equ 1
PITCH_EXPANDED	 equ 2

; constants for PrinterPSPrefs.ps_Orientation
ORIENT_PORTRAIT  equ 0
ORIENT_LANDSCAPE equ 1

; constants for PrinterPSPrefs.ps_Tab
TAB_4	  equ 0
TAB_8	  equ 1
TAB_QUART equ 2
TAB_HALF  equ 3
TAB_INCH  equ 4

; constants for PrinterPSPrefs.ps_Image
IM_POSITIVE equ 0
IM_NEGATIVE equ 1

; constants for PrinterPSPrefs.ps_Shading
SHAD_BW        equ 0
SHAD_GREYSCALE equ 1
SHAD_COLOR     equ 2

; constants for PrinterPSPrefs.ps_Dithering
DITH_DEFAULT equ 0
DITH_DOTTY   equ 1
DITH_VERT    equ 2
DITH_HORIZ   equ 3
DITH_DIAG    equ 4

; constants for PrinterPSPrefs.ps_Aspect
ASP_HORIZ equ 0
ASP_VERT  equ 1

; constants for PrinterPSPrefs.ps_ScalingType
ST_ASPECT_ASIS	  equ 0
ST_ASPECT_WIDE	  equ 1
ST_ASPECT_TALL	  equ 2
ST_ASPECT_BOTH	  equ 3
ST_FITS_WIDE	  equ 4
ST_FITS_TALL	  equ 5
ST_FITS_BOTH	  equ 6

; constants for PrinterPSPrefs.ps_Centering
CENT_NONE  equ 0
CENT_HORIZ equ 1
CENT_VERT  equ 2
CENT_BOTH  equ 3

;---------------------------------------------------------------------------

	ENDC	; PREFS_PRINTERPS_I
