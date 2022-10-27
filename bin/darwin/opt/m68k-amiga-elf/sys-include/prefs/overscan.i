	IFND	PREFS_OVERSCAN_I
PREFS_OVERSCAN_I	SET	1
**
**	$VER: overscan.i 38.4 (22.10.1992)
**	Includes Release 45.1
**
**	File format for overscan preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND GRAPHICS_GFX_I
    INCLUDE "graphics/gfx.i"
    ENDC

;---------------------------------------------------------------------------

ID_OSCN      equ "OSCN"

OSCAN_MAGIC  equ $FEDCBA89

   STRUCTURE OverscanPrefs,0
	ULONG  os_Reserved
	ULONG  os_Magic
	UWORD  os_HStart
	UWORD  os_HStop
	UWORD  os_VStart
	UWORD  os_VStop
	ULONG  os_DisplayID
	STRUCT os_ViewPos,tpt_SIZEOF
	STRUCT os_Text,tpt_SIZEOF
	STRUCT os_Standard,ra_SIZEOF
   LABEL OverscanPrefs_SIZEOF

;* os_HStart, os_HStop, os_VStart, os_VStop can only be looked at if
;* os_Magic equals OSCAN_MAGIC. If os_Magic is set to any other value,
;* these four fields are undefined
;*

;---------------------------------------------------------------------------

	ENDC	; PREFS_OVERSCAN_I
