#ifndef GADGETS_CHECKBOX_H
#define GADGETS_CHECKBOX_H
/*
**	$VER: checkbox.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the checkbox.gadget BOOPSI class
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

/* Additional attributes defined by the checkbox.gadget class */
#define CHECKBOX_Dummy			(REACTION_Dummy + 0x11000)

#define	CHECKBOX_TextPen		(CHECKBOX_Dummy+1)
	/* (WORD) Pen to use for text (~0 uses TEXTPEN). */

#define	CHECKBOX_FillTextPen	(CHECKBOX_Dummy+2)
	/* (WORD) Pen to use for fill (~0 uses FILLTEXTPEN). */

#define	CHECKBOX_BackgroundPen	(CHECKBOX_Dummy+3)
	/* (WORD) Pen to use for background (~0 uses BACKGROUNDPEN) */

#define	CHECKBOX_BevelStyle		(CHECKBOX_Dummy+4)
	/* (WORD) Optional outer bevel style - OBSOLETE */

#define	CHECKBOX_TextPlace		(CHECKBOX_Dummy+5)
	/* (LONG) Gadget Text Location (PLACETEXT_LEFT or PLACETEXT_RIGHT). */

#define	CHECKBOX_Checked		GA_Selected
	/* (BOOL) Checkmark state. */

/*****************************************************************************/

#endif /* GADGETS_CHECKBOX_H */
