#ifndef GADGETS_PALETTE_H
#define GADGETS_PALETTE_H
/*
**	$VER: palette.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the Palette BOOPSI class
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

/* Additional attributes defined by the Palette class
 */
#define PALETTE_Dummy			(REACTION_Dummy+0x0004000)

#define PALETTE_Colour			(PALETTE_Dummy+1)
	/* (UWORD) The value in the gadget.  Defaults to 0. */

#define PALETTE_ColourOffset	(PALETTE_Dummy+2)
	/* (UWORD) Maximum number of characters for the numer (including
	 * negative sign.  Defaults to 10. */

#define PALETTE_ColourTable		(PALETTE_Dummy+3)
	/* (UWORD *) Minimum value for the number. */

#define PALETTE_NumColours		(PALETTE_Dummy+4)
	/* (UWORD) Maximum value for the number. */

/* American spellings.
 */
#define PALETTE_Color PALETTE_Colour
#define PALETTE_ColorOffset PALETTE_ColourOffset
#define PALETTE_ColorTable PALETTE_ColourTable
#define PALETTE_NumColors PALETTE_NumColours

#endif /* GADGETS_PALETTE_H */
