#ifndef GADGETS_INTEGER_H
#define GADGETS_INTEGER_H
/*
**	$VER: integer.h 45.1 (07.11.2000)
**	Includes Release 45.1
**
**	Definitions for the integer.gadget BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
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

/* Additional attributes defined by the Integer class
 */
#define INTEGER_Dummy		(REACTION_Dummy+0x0002000)

#define INTEGER_Number		(INTEGER_Dummy+1)
	/* (LONG) The value in the gadget.  Defaults to 0. */

#define INTEGER_MaxChars	(INTEGER_Dummy+2)
	/* (WORD) Maximum number of characters for the numer (including
	 * negative sign.  Defaults to 10. */

#define INTEGER_Minimum		(INTEGER_Dummy+3)
	/* (LONG) Minimum value for the number. */

#define INTEGER_Maximum		(INTEGER_Dummy+4)
	/* (LONG) Maximum value for the number. */

#define INTEGER_Arrows		(INTEGER_Dummy+5)
	/* (BOOL) Should arrows be available.  Defaults to TRUE. */

#define INTEGER_MinVisible	(INTEGER_Dummy+6)
	/* (BOOL) Minimum number of digits to be visible.  Defaults to 0. (V41) */
	
#define INTEGER_SkipVal	(INTEGER_Dummy+7)
	/* (BOOL) In-/decrease the number by the given value when user presses
	 * the arrows, defaults to 1. (V45) 
	 */

#endif /* GADGETS_INTEGER_H */
