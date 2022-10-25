	IFND	PREF_ASL_I
PREF_ASL_I	SET	1
**
**	$VER: asl.i 45.1 (27.10.2000)
**	Includes Release 45.1
**
**	File format for ASL ("application support library") preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND LIBRARIES_ASL_I
    INCLUDE "libraries/asl.i"
    ENDC

;---------------------------------------------------------------------------

ID_ASL equ "ASL "

   STRUCTURE AslPrefs,0
      STRUCT ap_Reserved,4*4

	; These members correspond directly to the associated
	; members of the 'AslSemaphore' data structure defined
	; in the <libraries/asl.h> header file by the same names.

	UBYTE	ap_SortBy
	UBYTE	ap_SortDrawers
	UBYTE	ap_SortOrder

	UBYTE	ap_SizePosition

	WORD	ap_RelativeLeft
	WORD	ap_RelativeTop

	UBYTE	ap_RelativeWidth
	UBYTE	ap_RelativeHeight

   LABEL AslPrefs_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_ASL_I
