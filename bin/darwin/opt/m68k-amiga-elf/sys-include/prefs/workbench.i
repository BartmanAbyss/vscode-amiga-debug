	IFND	PREFS_WORKBENCH_I
PREFS_WORKBENCH_I	SET	1
**
**	$VER: workbench.i 45.1 (17.11.2000)
**	Includes Release 45.1
**
**	Workbench preferences file definitions
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

	IFND GRAPHICS_GFX_I
	INCLUDE "graphics/gfx.i"
	ENDC

;---------------------------------------------------------------------------

ID_WBNC		equ	'WBNC'

;---------------------------------------------------------------------------

    STRUCTURE WorkbenchPrefs,0
	ULONG	wbp_DefaultStackSize		; in bytes
	ULONG	wbp_TypeRestartTime		; in seconds
	ULONG	wbp_IconPrecision		; PRECISION_#? values
	STRUCT	wbp_EmbossRect,ra_SIZEOF
	BOOL	wbp_Borderless
	LONG	wbp_MaxNameLength
	BOOL	wbp_NewIconsSupport
	BOOL	wbp_ColorIconSupport
	ULONG	wbp_ImageMemType
	BOOL	wbp_LockPens
	BOOL	wbp_NoTitleBar
	BOOL	wbp_NoGauge
    LABEL WorkbenchPrefs_SIZEOF

;---------------------------------------------------------------------------

ID_WBHD		equ	'WBHD'

;---------------------------------------------------------------------------

    STRUCTURE WorkbenchHiddenDevicePrefs,0
	UBYTE	whdp_Name			; first char of C String including NULL char
    LABEL WorkbenchHiddenDevicePrefs_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_WORKBENCH_I
