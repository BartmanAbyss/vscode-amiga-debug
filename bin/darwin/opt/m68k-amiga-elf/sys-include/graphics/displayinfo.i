	IFND	GRAPHICS_DISPLAYINFO_I
GRAPHICS_DISPLAYINFO_I	SET	1
**
**	$VER: displayinfo.i 39.15 (31.5.1993)
**	Includes Release 45.1
**
**	include define file for display control registers
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND	EXEC_TYPES_I
    include 'exec/types.i'
    ENDC

    IFND	GRAPHICS_GFX_I
    include 'graphics/gfx.i'
    ENDC


* 'graphics/modeid.i' is included at the end of the file.

    IFND	UTILITY_TAGITEM_I
    include 'utility/tagitem.i'
    ENDC

* datachunk type identifiers

DTAG_DISP	equ		  $80000000
DTAG_DIMS	equ		  $80001000
DTAG_MNTR	equ		  $80002000
DTAG_NAME	equ		  $80003000
DTAG_VEC	equ		  $80004000	; internal use only


    STRUCTURE	QueryHeader,0
	ULONG	qh_StructID	; datachunk type identifier
	ULONG	qh_DisplayID	; copy of display record key
	ULONG	qh_SkipID	; TAG_SKIP -- see tagitems.h
	ULONG	qh_Length	; length of data in double-longwords
    LABEL qh_SIZEOF

    STRUCTURE	DisplayInfo,qh_SIZEOF
	UWORD	dis_NotAvailable	  ; if NULL available, else see defines
	ULONG	dis_PropertyFlags	  ; Properties of this mode see defines
	STRUCT	dis_Resolution,tpt_SIZEOF ; ticks-per-pixel X/Y
	UWORD	dis_PixelSpeed		  ; aproximation in nanoseconds
	UWORD	dis_NumStdSprites	  ; number of standard amiga sprites
	UWORD	dis_PaletteRange	  ; distinguishable shades available
	STRUCT	dis_SpriteResolution,tpt_SIZEOF ; sprite ticks-per-pixel X/Y
	STRUCT	dis_pad,4
	UBYTE	RedBits			   ; number of Red bits this display supports (V39)
	UBYTE	GreenBits;		   ; number of Green bits this display supports (V39)
	UBYTE	BlueBits;		   ; number of Blue bits this display supports (V39)
	STRUCT dis_pad2,5
	STRUCT dis_reserved,8
    LABEL dis_SIZEOF

* availability

DI_AVAIL_NOCHIPS		equ	$0001
DI_AVAIL_NOMONITOR		equ	$0002
DI_AVAIL_NOTWITHGENLOCK		equ	$0004

* mode properties

DIPF_IS_LACE			equ	$00000001
DIPF_IS_DUALPF			equ	$00000002
DIPF_IS_PF2PRI			equ	$00000004
DIPF_IS_HAM			equ	$00000008

DIPF_IS_ECS			equ	$00000010  ; note: ECS modes (SHIRES, VGA, and
						   ; PRODUCTIVITY) do not support
						   ; attached sprites.

DIPF_IS_AA			equ	$00010000
DIPF_IS_PAL			equ	$00000020
DIPF_IS_SPRITES			equ	$00000040
DIPF_IS_GENLOCK			equ	$00000080

DIPF_IS_WB			equ	$00000100
DIPF_IS_DRAGGABLE		equ	$00000200
DIPF_IS_PANELLED		equ	$00000400
DIPF_IS_BEAMSYNC		equ	$00000800
DIPF_IS_EXTRAHALFBRITE		equ	$00001000

; The following DIPF_IS_... flags are new for V39
DIPF_IS_SPRITES_ATT		equ	$00002000	; supports attached sprites
DIPF_IS_SPRITES_CHNG_RES	equ	$00004000	; supports variable sprite resolution
DIPF_IS_SPRITES_BORDER		equ	$00008000	; sprites can be displayed in borders
DIPF_IS_SCANDBL			equ	$00020000	; scan-doubled?
DIPF_IS_SPRITES_CHNG_BASE	equ	$00040000	; can change the sprite base color
DIPF_IS_SPRITES_CHNG_PRI	equ	$00080000	; can change sprite priority
DIPF_IS_DBUFFER			equ	$00100000	; can support double buffering
DIPF_IS_PROGBEAM		equ	$00200000	; programmed beam-sync mode
DIPF_IS_FOREIGN			equ	$80000000	; non-amiga mode?


    STRUCTURE DimensionInfo,qh_SIZEOF
	UWORD	dim_MaxDepth		; log2( max number of colors
	UWORD	dim_MinRasterWidth	; minimum width in pixels
	UWORD	dim_MinRasterHeight	; minimum height in pixels
	UWORD	dim_MaxRasterWidth	; maximum width in pixels
	UWORD	dim_MaxRasterHeight	; maximum height in pixels
	STRUCT	dim_Nominal,ra_SIZEOF	; "standard" dimensions
	STRUCT	dim_MaxOScan,ra_SIZEOF	; fixed, hardware dependent
	STRUCT	dim_VideoOScan,ra_SIZEOF ; fixed, hardware dependent
	STRUCT	dim_TxtOScan,ra_SIZEOF	; editable via preferences
	STRUCT	dim_StdOScan,ra_SIZEOF	; editable via preferences
	STRUCT	dim_pad,14
	STRUCT	dim_reserved,8		; terminator
    LABEL dim_SIZEOF

    STRUCTURE MonitorInfo,qh_SIZEOF
	APTR	mtr_Mspc		; pointer to monitor specification
	STRUCT	mtr_ViewPosition,tpt_SIZEOF	; editable via preferences
	STRUCT	mtr_ViewResolution,tpt_SIZEOF	; monitor ticks-per-pixel
	STRUCT	mtr_ViewPositionRange,ra_SIZEOF	; fixed, hardware dependent
	UWORD	mtr_TotalRows		; display height in scanlines
	UWORD	mtr_TotalColorClocks	; scanline width in 280 ns units
	UWORD	mtr_MinRow		; absolute minimum active scanline
	WORD	mtr_Compatibility	; how this coexists with others
	STRUCT	mtr_pad,32
	STRUCT	mtr_MouseTicks,tpt_SIZEOF
	STRUCT	mtr_DefaultViewPosition,tpt_SIZEOF	; original, never changes
	ULONG	mtr_PreferredModeID				; for preferences
	STRUCT	mtr_reserved,8		; terminator
    LABEL mtr_SIZEOF

* monitor compatibility

MCOMPAT_MIXED		equ  0	; can share display with other MCOMPAT_MIXED
MCOMPAT_SELF		equ  1	; can share only within same monitor
MCOMPAT_NOBODY		equ -1	; only one viewport at a time

DISPLAYNAMELEN		equ 32

    STRUCTURE NameInfo,qh_SIZEOF
	STRUCT	nif_Name,DISPLAYNAMELEN
	STRUCT	nif_reserved,8		; terminator
    LABEL nif_SIZEOF


; The following VecInfo structure is PRIVATE, for our use only
; Touch these, and burn! (V39)
;

    STRUCTURE VecInfo,qh_SIZEOF
	APTR	vec_Vec
	APTR	vec_Data
	UWORD	vec_Type
	STRUCT	vec_pad,6
	STRUCT	vec_reserved,8
    LABEL vec_SIZEOF

    IFND	GRAPHICS_MODEID_I
    include 'graphics/modeid.i'
    ENDC

    ENDC	; GRAPHICS_DISPLAYINFO_I
