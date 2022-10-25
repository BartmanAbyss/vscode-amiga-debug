	IFND UTILITY_UTILITY_I
UTILITY_UTILITY_I SET 1
**
**	$VER: utility.i 39.6 (12.8.1993)
**	Includes Release 45.1
**
**	utility.library include file
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

	IFND EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC

	IFND EXEC_LIBRARIES_I
	INCLUDE	"exec/libraries.i"
	ENDC

;---------------------------------------------------------------------------

UTILITYNAME MACRO
	DC.B 'utility.library',0
	ENDM

   STRUCTURE UtilityBase,LIB_SIZE
	UBYTE ub_Language
	UBYTE ub_Reserved

;---------------------------------------------------------------------------

	ENDC	; UTILITY_UTILITY_I
