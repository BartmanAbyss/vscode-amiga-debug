#ifndef GADGETS_CHOOSER_H
#define GADGETS_CHOOSER_H

/*
**	$VER: chooser.h 45.1 (10.03.2001)
**	Includes Release 45.1
**
**	Definitions for the Chooser BOOPSI class
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

/* Predefined Minimum dimensions for safe operation.
 */
#define CHOOSER_MinWidth           36
#define CHOOSER_MinHeight          10

/*****************************************************************************/

/* Chooser node attributes.
 */
#define CNA_Dummy			(TAG_USER+0x5001500)

#define CNA_Text			(CNA_Dummy+1)
	/* (STRPTR) Text for the node. */

#define CNA_Image			(CNA_Dummy+2)
	/* (strcut Image *) normal image for node. */

#define CNA_SelImage		(CNA_Dummy+3)
	/* (strcut Image *) select image for node. */

#define CNA_UserData		(CNA_Dummy+4)
	/* (APRR) user data, use as desired. */

#define CNA_Separator		(CNA_Dummy+5)
	/* (BOOL) Render a separator bar. */

#define CNA_Disabled		(CNA_Dummy+6)
	/* (BOOL) Disabled entry... */

#define CNA_BGPen			(CNA_Dummy+7)
	/* (WORD) Background Pen. (not implemented) */

#define CNA_FGPen			(CNA_Dummy+8)
	/* (WORD) Foreground Pen. (not implemented) */

#define CNA_ReadOnly		(CNA_Dummy+9)
	/* (BOOL) Non-selectable entry... */

/*****************************************************************************/

/* Additional attributes defined by the Chooser class
 */
#define CHOOSER_Dummy		(REACTION_Dummy+0x0001000)

#define CHOOSER_PopUp		(CHOOSER_Dummy+1)
	/* (BOOL) Make it a popup menu.  Default to TRUE. */

#define CHOOSER_DropDown	(CHOOSER_Dummy+2)
	/* (BOOL) Make it a dropdown menu.  Defaults to FALSE. */

#define CHOOSER_Title		(CHOOSER_Dummy+3)
	/* (STRPTR) Title for the DropDown.  Defaults to NULL. */

#define CHOOSER_Labels		(CHOOSER_Dummy+4)
	/* (struct List *) Exec List of labels, required. */

#define CHOOSER_Active		(CHOOSER_Dummy+5)
	/* (WORD) Active label in the list.  Defaults to 0. */
#define CHOOSER_Selected	(CHOOSER_Active)
	/* A more logical NEW NAME for the above. */

#define CHOOSER_Width		(CHOOSER_Dummy+6)
	/* (WORD) The width of the popup menu. Defaults to the width of the
	 * gadget. */

#define CHOOSER_AutoFit		(CHOOSER_Dummy+7)
	/* (BOOL) Make the menu automatically fit its labels. Defaults to FALSE. */

#define CHOOSER_MaxLabels	(CHOOSER_Dummy+9)
	/* (WORD) Maximum number of labels to be shown in the menu regardless
	 * of how many are in the CHOOSER_Labels list.   Defaults to 12.*/

#define CHOOSER_Offset		(CHOOSER_Dummy+10)
	/* (WORD) Add a fixed value offset to the CHOOSE_Selected value
	 * for notification methods. This is useful in connecting a Chooser
	 * with item id's 0 thru 11 to a Calendar's month which is 1 thru 12.
	 * In that situation, a CHOOSER_Offset of 1 would be used to match
	 * the starting offsets of the respective tags.
	 * Defaults to 0.  (V41) */

#define CHOOSER_Hidden		(CHOOSER_Dummy+11)
	/* (BOOL) If set, the chooser will not render its main body, and you
	 * may call the Show/HideChooser functions to popup the chooser under
	 * under the mouse pointer.
	 * Defaults to FALSE.  (V42 prelease - V41.101 or later) */
	 
#define CHOOSER_LabelArray	(CHOOSER_Dummy+12)
	/* (STRPTR *) A null terminated array of strings to use as labels. Use
	   ~0 as string to add separator bar to the list. New for v45.2 */
	   
#define CHOOSER_Justification	(CHOOSER_Dummy+13)
	/* (WORD) How to align the labels. New for v45.3 */
	
/*	Possible values for CHOOSER_Justification
 */	
#define CHJ_LEFT		0 /* default */
#define CHJ_CENTER		1
#define CHJ_RIGHT		2

#endif /* GADGETS_CHOOSER_H */
