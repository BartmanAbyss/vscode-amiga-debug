#ifndef RESOURCES_MISC_H
#define RESOURCES_MISC_H
/*
**	$VER: misc.h 36.13 (6.5.1990)
**	Includes Release 45.1
**
**	Unit number definitions for "misc.resource"
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif	/* EXEC_TYPES_H */

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif	/* EXEC_LIBRARIES_H */

/*
 * Unit number definitions.  Ownership of a resource grants low-level
 * bit access to the hardware registers.  You are still obligated to follow
 * the rules for shared access of the interrupt system (see
 * exec.library/SetIntVector or cia.resource as appropriate).
 */
#define	MR_SERIALPORT	0 /* Amiga custom chip serial port registers
			     (SERDAT,SERDATR,SERPER,ADKCON, and interrupts) */
#define	MR_SERIALBITS	1 /* Serial control bits (DTR,CTS, etc.) */
#define	MR_PARALLELPORT	2 /* The 8 bit parallel data port
			     (CIAAPRA & CIAADDRA only!) */
#define	MR_PARALLELBITS	3 /* All other parallel bits & interrupts
			     (BUSY,ACK,etc.) */

/*
 * Library vector offset definitions
 */
#define	MR_ALLOCMISCRESOURCE	(LIB_BASE)		/* -6 */
#define MR_FREEMISCRESOURCE	(LIB_BASE-LIB_VECTSIZE)	/* -12 */

#define MISCNAME "misc.resource"

#endif	/* RESOURCES_MISC_H */
