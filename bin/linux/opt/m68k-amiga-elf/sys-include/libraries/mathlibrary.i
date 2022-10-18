	IFND	LIBRARIES_MATHLIBRARY_I
LIBRARIES_MATHLIBRARY_I	SET	1
**
**	$VER: mathlibrary.i 36.4 (13.7.1990)
**	Includes Release 45.1
**
**	Data structure returned by OpenLibrary of:
**	mathieeedoubbas.library,mathieeedoubtrans.library
**	mathieeesingbas.library,mathieeesingtrans.library
**
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
**

	ifnd EXEC_LIBRARIES_I
	include "exec/libraries.i"
	endc

	STRUCTURE MathIEEEBase,0
		STRUCT	MathIEEEBase_LibNode,LIB_SIZE
		STRUCT	MathIEEEBase_reserved,18
		APTR	MathIEEEBase_TaskOpenLib	; hook
		APTR	MathIEEEBase_TaskCloseLib	; hook
*	This structure may be extended in the future */
	LABEL	MathIEEEBase_SIZE

;	Math resources may need to know when a program opens or closes this
;	library. The functions TaskOpenLib and TaskCloseLib are called when
;	a task opens or closes this library. The yare initialized to point
;	local initialization pertaining to 68881 stuff if 68881 resources
;	are found. To override the default the vendor must provide appropriate
;	hooks in the MathIEEEResource. If specified, these will be called
;	when the library initializes.

	ENDC	; LIBRARIES_MATHLIBRARY_I
