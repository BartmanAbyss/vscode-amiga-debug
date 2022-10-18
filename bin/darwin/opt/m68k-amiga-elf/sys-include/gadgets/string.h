#ifndef GADGETS_STRING_H
#define GADGETS_STRING_H
/*
**	$VER: string.h 45.1 (07.03.2001)
**	Includes Release 45.1
**
**	Definitions for the string.gadget BOOPSI class
**
**	(C) Copyright 2000-2001 Amiga, Inc. 
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_GADGETCLASS_H
#include <intuition/gadgetclass.h>
#endif

/*****************************************************************************/

/* string.gadget accepts the same tag parameters as the ROM strgclass
 * in addition to those listed below.
 */

#define STRINGA_MinVisible		(REACTION_Dummy+0x0055000) 
    /* (UWORD) Minimum character length to domain min size on. [ISG]
     *         In a layout, a nominal domain would be 2 times this value.
     */

#define STRINGA_HookType		(REACTION_Dummy+0x0055001)
	/* (UWORD) Use which built-in hook function? [I]
	 */

/* The following tags are new for v45 
*/
	 
#define STRINGA_GetBlockPos		(REACTION_Dummy+0x0055010)
	/* (ULONG) Returns the position of the first and last character
	 * of the marked block. The upper 16bit (WORD) of the long-word contain
	 * the start position and the lower 16bit (WORD) the end position.
	 * When nothing is marked both values will be -1. [G]
	 */

#define STRINGA_Mark			(REACTION_Dummy+0x0055011)
	/* (ULONG) Mark the given block. The upper 16bit of the longword contain
	 * the start position and the lower one the end position. If one or both
	 * values are -1, the current block will be unmarked. [ISU]
	 */
	 
#define STRINGA_AllowMarking	(REACTION_Dummy+0x0055012) 
	/* (BOOL) Enable/disable marking, defaults to TRUE. [ISUG]
	 */


/* Support hook types for STRINGA_HookType
 */
#define SHK_CUSTOM		0
#define SHK_PASSWORD	1
#define SHK_IPADDRESS	2
#define SHK_FLOAT		3
#define SHK_HEXIDECIMAL	4
#define SHK_TELEPHONE	5
#define SHK_POSTALCODE	6
#define SHK_AMOUNT		7
#define SHK_UPPERCASE	8
#define SHK_HOTKEY		9	/* new for v45 */

#define SHK_HEXADECIMAL SHK_HEXIDECIMAL

#endif /* GADGETS_STRING_H */
