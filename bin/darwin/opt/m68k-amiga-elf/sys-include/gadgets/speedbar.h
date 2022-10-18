#ifndef GADGETS_SPEEDBAR_H
#define GADGETS_SPEEDBAR_H
/*
**	$VER: speedbar.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the speedbar.gadget BOOPSI class
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

/* Defines for the speedbar node attributes.
 */
#define SBNA_Dummy		(TAG_USER+0x010000)

#define SBNA_Left		(SBNA_Dummy+1)
	/* (WORD) left offset of button. */

#define SBNA_Top		(SBNA_Dummy+2)
	/* (WORD) top offset of button. */

#define SBNA_Width		(SBNA_Dummy+3)
	/* (WORD) width of button. */

#define SBNA_Height		(SBNA_Dummy+4)
	/* (WORD) height of button. */

#define SBNA_UserData	(SBNA_Dummy+5)
	/* (APTR) user data, have a blast. */

#define SBNA_Enabled	(SBNA_Dummy+6)
	/* (BOOL) Is this button enabled?. */

#define SBNA_Spacing	(SBNA_Dummy+7)
	/* (WORD) spacing from last button. */

#define SBNA_Highlight	(SBNA_Dummy+8)
	/* (WORD) highlight mode (see below). */

#define SBNA_Image		(SBNA_Dummy+9)
	/* (strcut Image *) render image pointer. */

#define SBNA_SelImage	(SBNA_Dummy+10)
	/* (strcut Image *) select image pointer. */

#define SBNA_Help		(SBNA_Dummy+11)
	/* (UBYTE *) optional help text message pointer. */

#define SBNA_Toggle		(SBNA_Dummy+12)
	/* (BOOL) Make button a toggle button */

#define SBNA_Selected	(SBNA_Dummy+13)
	/* (BOOL) Sets state of a toggle button */

#define SBNA_MXGroup	(SBNA_Dummy+14)
	/* (BOOL) Mutual Exclusion Group Button, implies SBNA_Toggle */

#define SBNA_Disabled	(SBNA_Dummy+15)
	/* (BOOL) Disable this button, ghost pattern to be rendered */

/* Possible highlight modes.
 */
#define SBH_NONE		0
#define SBH_BACKFILL	1
#define SBH_RECESS		2
#define SBH_IMAGE		3

/*****************************************************************************/

/* Additional attributes defined by the speedbar.gadget class
 */
#define SPEEDBAR_Dummy			(REACTION_Dummy + 0x13000)

#define	SPEEDBAR_Buttons		(SPEEDBAR_Dummy+1)
	/* (struct List *) button list */

#define	SPEEDBAR_Orientation	(SPEEDBAR_Dummy+2)
	/* (WORD) Horizontal/vertical mode */

#define	SPEEDBAR_Background		(SPEEDBAR_Dummy+3)
	/* (UWORD) SpeedBar Background color */

#define	SPEEDBAR_Window			(SPEEDBAR_Dummy+4)
	/* (struct Window *) Window for WindowBar help */

#define SPEEDBAR_StrumBar		(SPEEDBAR_Dummy+5)
	/* (BOOL) Allow struming of button bar */

#define	SPEEDBAR_OnButton		(SPEEDBAR_Dummy+6)
	/* (WORD) Turn on a button by id# */

#define	SPEEDBAR_OffButton		(SPEEDBAR_Dummy+7)
	/* (WORD) Turn off a button by id# */

#define	SPEEDBAR_ScrollLeft		(SPEEDBAR_Dummy+8)
	/* (WORD) Scroll buttons left */

#define	SPEEDBAR_ScrollRight	(SPEEDBAR_Dummy+9)
	/* (WORD) Scroll buttons right */

#define	SPEEDBAR_Top			(SPEEDBAR_Dummy+10)
	/* (WORD) First visible */

#define	SPEEDBAR_Visible		(SPEEDBAR_Dummy+11)
	/* (WORD) Number visible */

#define	SPEEDBAR_Total			(SPEEDBAR_Dummy+12)
	/* (WORD) Total in list */

#define SPEEDBAR_Help			(SPEEDBAR_Dummy+13)
	/* (STRPTR) Window/Screen Help Text */

#define SPEEDBAR_BevelStyle		(SPEEDBAR_Dummy+14)
	/* (WORD) Bevel box style (BVS_BUTTON,BVS_THIN,BVS_NONE) */

#define SPEEDBAR_Selected			(SPEEDBAR_Dummy+15)
	/* (STRPTR) last selected speedbar node number */

#define SPEEDBAR_SelectedNode	(SPEEDBAR_Dummy+16)
	/* (STRPTR) last selected speedbar node pointer */

#define SPEEDBAR_EvenSize	(SPEEDBAR_Dummy+17)
	/* (BOOL) size all buttons in bar evenly, using the largest image */

/*****************************************************************************/

/* SPEEDBAR_Orientation Modes
 */
#define SBORIENT_HORIZ	0
#define SBORIENT_VERT	1

/* OBSOLETE DO NOT USE.
 */
#define SPEEDBAR_HORIZONTAL	SBORIENT_HORIZ
#define SPEEDBAR_VERTICAL	SBORIENT_VERT

#endif /* GADGETS_SPEEDBAR_H */
