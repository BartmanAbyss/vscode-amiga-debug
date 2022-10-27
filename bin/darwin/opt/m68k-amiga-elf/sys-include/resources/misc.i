	IFND	RESOURCES_MISC_I
RESOURCES_MISC_I	SET	1
**
**	$VER: misc.i 36.12 (6.5.1990)
**	Includes Release 45.1
**
**	Unit number definitions for "misc.resource"
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC	!EXEC_TYPES_I

	IFND	EXEC_LIBRARIES_I
	INCLUDE "exec/libraries.i"
	ENDC	!EXEC_LIBRARIES_I

*
* Unit number definitions.  Ownership of a resource grants low-level
* bit access to the hardware registers.  You are still obligated to follow
* the rules for shared access of the interrupt system.	(see
* exec.library/SetIntVector or cia.resource as appropriate).
*
MR_SERIALPORT	EQU 0	;Amiga custom chip serial port registers & interrupts
			;(SERDAT,SERDATR,SERPER,ADKCON, and interrupts)
MR_SERIALBITS	EQU 1	;Serial control bits (DTR,CTS, etc.)
MR_PARALLELPORT	EQU 2	;The 8 bit parallel data port
			;(CIAAPRA & CIAADDRA only!)
MR_PARALLELBITS	EQU 3	;All other parallel bits & interrupts (BUSY,ACK,etc.)

*
* Library vector offset definitions
*
	LIBINIT LIB_BASE
	LIBDEF	MR_ALLOCMISCRESOURCE	;-6
	LIBDEF	MR_FREEMISCRESOURCE	;-12

*
* Name of misc.resource
*
MISCNAME	MACRO
		DC.B	'misc.resource',0
		CNOP	0,2
		ENDM

	ENDC	;RESOURCE_MISC_I
