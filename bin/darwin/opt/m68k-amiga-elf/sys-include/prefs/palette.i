	IFND	PREFS_PALETTE_I
PREFS_PALETTE_I	SET	1
**
**	$VER: palette.i 39.2 (15.6.1992)
**	Includes Release 45.1
**
**	File format for palette preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND INTUITION_INTUITION_I
    INCLUDE "intuition/intuition.i"
    ENDC

;---------------------------------------------------------------------------

ID_PALT equ "PALT"

   STRUCTURE PalettePrefs,0
	STRUCT pap_Reserved,4*4		; System reserved
	STRUCT pap_4ColorPens,32*2
	STRUCT pap_8ColorPens,32*2
	STRUCT pap_Colors,32*cs_SIZEOF	; Used as full 16-bit RGB values
   LABEL PalettePrefs_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_PALETTE_I
