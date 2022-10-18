#ifndef GADGETS_GETSCREENMODE_H
#define GADGETS_GETSCREENMODE_H
/*
**	$VER: getscreenmode.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the getscreenmode.gadget BOOPSI class
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

/* Attributes defined by the getfont.gadget class
 */
#define GETSCREENMODE_Dummy				(REACTION_Dummy + 0x41000)

#define	GETSCREENMODE_TitleText			(GETSCREENMODE_Dummy+1)
	/* (STRPTR) Title of the screenmode requester (default: None) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_Height			(GETSCREENMODE_Dummy+2)
	/* (WORD) Height of the screenmode requester (default: 200) (OM_NEW, OM_SET, OM_GET) */

#define	GETSCREENMODE_Width				(GETSCREENMODE_Dummy+3)
	/* (WORD) Width of the screenmode requester (default: 300) (OM_NEW, OM_SET, OM_GET) */

#define	GETSCREENMODE_LeftEdge			(GETSCREENMODE_Dummy+4)
	/* (WORD) Left edge of the screenmode requester (default: 30) (OM_NEW, OM_SET, OM_GET) */

#define	GETSCREENMODE_TopEdge			(GETSCREENMODE_Dummy+5)
	/* (WORD) Top edge of the screenmode requester (default: 20) (OM_NEW, OM_SET, OM_GET) */

#define	GETSCREENMODE_DisplayID			(GETSCREENMODE_Dummy+6)
	/* (ULONG) display id of screenmode (default: 0 (LORES_KEY)) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETSCREENMODE_DisplayWidth		(GETSCREENMODE_Dummy+7)
	/* (ULONG) Display width (default: 640) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETSCREENMODE_DisplayHeight		(GETSCREENMODE_Dummy+8)
	/* (ULONG) Display height (default: 200) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETSCREENMODE_DisplayDepth		(GETSCREENMODE_Dummy+9)
	/* (UWORD) Display depth (default: 2) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETSCREENMODE_OverscanType		(GETSCREENMODE_Dummy+10)
	/* (UWORD) Type of overscan (default: OSCAN_TEXT) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETSCREENMODE_AutoScroll		(GETSCREENMODE_Dummy+11)
	/* (BOOL) Autoscroll setting(default: TRUE) (OM_NEW, OM_SET, OM_NOTIFY) */

#define	GETSCREENMODE_InfoOpened		(GETSCREENMODE_Dummy+12)
	/* (BOOL) Info window initially opened?(default: FALSE) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_InfoLeftEdge		(GETSCREENMODE_Dummy+13)
	/* (WORD) Info window left edge (default: 30) (OM_NEW, OM_SET, OM_GET) */

#define	GETSCREENMODE_InfoTopEdge		(GETSCREENMODE_Dummy+14)
	/* (WORD) Info window top edge (default: 20) (OM_NEW, OM_SET, OM_GET) */

#define	GETSCREENMODE_DoWidth			(GETSCREENMODE_Dummy+15)
	/* (BOOL) Display Width gadget? (default: FALSE) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_DoHeight			(GETSCREENMODE_Dummy+16)
	/* (BOOL) Display Height gadget? (default: FALSE) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_DoDepth			(GETSCREENMODE_Dummy+17)
	/* (BOOL) Display Depth gadget? (default: FALSE) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_DoOverscanType	(GETSCREENMODE_Dummy+18)
	/* (BOOL) Display Overscan Type gadget? (default: FALSE) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_DoAutoScroll		(GETSCREENMODE_Dummy+19)
	/* (BOOL) Display AutoScroll gadget? (default: FALSE) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_PropertyFlags		(GETSCREENMODE_Dummy+20)
	/* (ULONG) Must have these Property flags (default: DIPF_IS_WB) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_PropertyMask		(GETSCREENMODE_Dummy+21)
	/* (ULONG) Only these should be looked at (default: DIPF_IS_WB) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_MinWidth			(GETSCREENMODE_Dummy+22)
	/* (ULONG) Minimum display width to allow (default: 16) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_MaxWidth			(GETSCREENMODE_Dummy+23)
	/* (ULONG) Maximum display width to allow (default: 16368) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_MinHeight			(GETSCREENMODE_Dummy+24)
	/* (ULONG) Minimum display height to allow (default: 16) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_MaxHeight			(GETSCREENMODE_Dummy+25)
	/* (ULONG) Maximum display height to allow (default: 16368) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_MinDepth			(GETSCREENMODE_Dummy+26)
	/* (ULONG) Minimum display depth to allow (default: 1) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_MaxDepth			(GETSCREENMODE_Dummy+27)
	/* (ULONG) Maximum display depth to allow (default: 24) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_FilterFunc		(GETSCREENMODE_Dummy+28)
	/* (struct Hook *) Function to filter mode id's (default: None) (OM_NEW, OM_SET) */

#define	GETSCREENMODE_CustomSMList		(GETSCREENMODE_Dummy+29)
	/* (struct List *) Exec list of struct DisplayMode (default: None) (OM_NEW, OM_SET) */

/*****************************************************************************/

/*
 * getfont.gadget methods
 */
#define GSM_REQUEST	(0x610001L)

/* The GSM_REQUEST method should be called whenever you want to open
 * a screenmode requester.
 */

struct gsmRequest
{
	ULONG MethodID;				/* GSM_REQUEST */
	struct Window *gsmr_Window;	/* The window that will be locked when the requester is active.
								If not provided, no window will be locked and no visual updating
								of any gadgets will take place. This should be the window the gadget
								resides in. */
};

#define RequestScreenMode(obj, win)	DoMethod(obj, GSM_REQUEST, win)

#endif /* GADGETS_GETSCREENMODE_H */
