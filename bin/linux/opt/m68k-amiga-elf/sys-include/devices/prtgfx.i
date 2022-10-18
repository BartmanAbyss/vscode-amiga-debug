	IFND	DEVICES_PRTGFX_I
DEVICES_PRTGFX_I	SET	1
**
**	$VER: prtgfx.i 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	printer.device structure definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND  EXEC_TYPES_I
    INCLUDE  "exec/types.i"
    ENDC

PCMYELLOW	EQU	0		; byte index for yellow
PCMMAGENTA	EQU	1		; byte index for magenta
PCMCYAN		EQU	2		; byte index for cyan
PCMBLACK	EQU	3		; byte index for black
PCMBLUE		EQU	PCMYELLOW	; byte index for blue
PCMGREEN	EQU	PCMMAGENTA	; byte index for green
PCMRED		EQU	PCMCYAN		; byte index for red
PCMWHITE	EQU	PCMBLACK	; byte index for white

	STRUCTURE	colorEntry,0
		LABEL	colorLong	; quick access to all of YMCB
		LABEL	colorSByte	; 1 entry for each of YMCB
		STRUCT	colorByte,4	; ditto (except signed)
		LABEL	ce_SIZEOF

	STRUCTURE	PrtInfo,0
		APTR	pi_render	; PRIVATE - DO NOT USE!
		APTR	pi_rp		; PRIVATE - DO NOT USE!
		APTR	pi_temprp	; PRIVATE - DO NOT USE!
		APTR	pi_RowBuf	; PRIVATE - DO NOT USE!
		APTR	pi_HamBuf	; PRIVATE - DO NOT USE!
		APTR	pi_ColorMap	; PRIVATE - DO NOT USE!
		APTR	pi_ColorInt	; color intensities for entire row
		APTR	pi_HamInt	; PRIVATE - DO NOT USE!
		APTR	pi_Dest1Int	; PRIVATE - DO NOT USE!
		APTR	pi_Dest2Int	; PRIVATE - DO NOT USE!
		APTR	pi_ScaleX	; array of scale values for X
		APTR	pi_ScaleXAlt	; PRIVATE - DO NOT USE!
		APTR	pi_dmatrix	; pointer to dither matrix
		APTR	pi_TopBuf	; PRIVATE - DO NOT USE!
		APTR	pi_BotBuf	; PRIVATE - DO NOT USE!

		UWORD	pi_RowBufSize	; PRIVATE - DO NOT USE!
		UWORD	pi_HamBufSize	; PRIVATE - DO NOT USE!
		UWORD	pi_ColorMapSize	; PRIVATE - DO NOT USE!
		UWORD	pi_ColorIntSize	; PRIVATE - DO NOT USE!
		UWORD	pi_HamIntSize	; PRIVATE - DO NOT USE!
		UWORD	pi_Dest1IntSize	; PRIVATE - DO NOT USE!
		UWORD	pi_Dest2IntSize	; PRIVATE - DO NOT USE!
		UWORD	pi_ScaleXSize	; PRIVATE - DO NOT USE!
		UWORD	pi_ScaleXAltSize ; PRIVATE - DO NOT USE!

		UWORD	pi_PrefsFlags	; PRIVATE - DO NOT USE!
		ULONG	pi_special	; PRIVATE - DO NOT USE!
		UWORD	pi_xstart	; PRIVATE - DO NOT USE!
		UWORD	pi_ystart	; PRIVATE - DO NOT USE!
		UWORD	pi_width	; source width (in pixels)
		UWORD	pi_height	; PRIVATE - DO NOT USE!
		ULONG	pi_pc		; PRIVATE - DO NOT USE!
		ULONG	pi_pr		; PRIVATE - DO NOT USE!
		UWORD	pi_ymult	; PRIVATE - DO NOT USE!
		UWORD	pi_ymod		; PRIVATE - DO NOT USE!
		UWORD	pi_ety		; PRIVATE - DO NOT USE!
		UWORD	pi_xpos		; offset to start printing from
		UWORD	pi_threshold	; copy of threshold value (from prefs)
		UWORD	pi_tempwidth	; PRIVATE - DO NOT USE!
		UWORD	pi_flags	; PRIVATE - DO NOT USE!
		; V44
		APTR    pi_ReduceBuf    ; PRIVATE
		UWORD   pi_ReduceBufSize ; PRIVATE
		APTR    pi_SourceHook   ; PRIVATE
		APTR    pi_InvertHookBuf ; RESERVED
		LABEL	prtinfo_SIZEOF

	ENDC	; DEVICES_PRTGFX_I
