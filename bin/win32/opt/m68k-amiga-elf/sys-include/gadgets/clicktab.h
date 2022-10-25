#ifndef GADGETS_CLICKTAB_H
#define GADGETS_CLICKTAB_H
/*
**	$VER: clicktab.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the clicktab.gadget BOOPSI class
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

/* Defines for the clicktab node attributes.
 */
#define TNA_Dummy		(TAG_USER+0x010000)

#define TNA_UserData	(TNA_Dummy+1)
	/* (APTR) user data, have a blast. */

#define TNA_Enabled		(TNA_Dummy+2)	/* was never implemented, now obsolete! */
#define TNA_Spacing		(TNA_Dummy+3)	/* obsolete! */
#define TNA_Highlight	(TNA_Dummy+4)	/* obsolete! */

#define TNA_Image		(TNA_Dummy+5)
	/* (strcut Image *) render image pointer. */

#define TNA_SelImage	(TNA_Dummy+6)
	/* (struct Image *) select image pointer. */

#define TNA_Text		(TNA_Dummy+7)
	/* (STRPTR) tab text label string pointer. */

#define TNA_Number		(TNA_Dummy+8)
	/* (WORD) numeric ID assignment for tab. */

#define TNA_TextPen		(TNA_Dummy+9)
	/* (WORD) Text pen ID to render tab text. */

#define TNA_Disabled		(TNA_Dummy+10)
	/* (BOOL) Is this button disabled?. (V42) */

/*****************************************************************************/

/* Additional attributes defined by the clicktab.gadget class
 */
#define CLICKTAB_Dummy				(REACTION_Dummy + 0x27000)

#define	CLICKTAB_Labels				(CLICKTAB_Dummy+1)
	/* (struct List *) button list */

#define	CLICKTAB_Current			(CLICKTAB_Dummy+2)
	/* (WORD) Currently selected tab id# */

#define	CLICKTAB_CurrentNode		(CLICKTAB_Dummy+3)
	/* (struct TabNode *) Currently selected tab node */

#define	CLICKTAB_Orientation		(CLICKTAB_Dummy+4)
	/* (WORD) Horizontal/Vertical/Flip mode - **Not Implemented!** */

#define	CLICKTAB_PageGroup			(CLICKTAB_Dummy+5)
	/* (Object *) Embedded PageObject child pointer. (V42) */

#define CLICKTAB_PageGroupBackFill	(CLICKTAB_Dummy+6)
	/* (Object *) Embedded PageObject + selected ClickTab backfill pointer. (V42) */

/*****************************************************************************/

/* CLICKTAB_Orientation Modes
 */
#define CTORIENT_HORIZ		0
#define CTORIENT_VERT		1
#define CTORIENT_HORIZFLIP	2
#define CTORIENT_VERTFLIP	3

#endif /* GADGETS_CLICKTAB_H */
