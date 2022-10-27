#ifndef GADGETS_GETFONT_H
#define GADGETS_GETFONT_H
/*
**	$VER: getfont.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the getfont.gadget BOOPSI class
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
#define GETFONT_Dummy			(REACTION_Dummy + 0x40000)

#define	GETFONT_TextAttr		(GETFONT_Dummy+1)
	/* (struct TextAttr *) Font to show in the gadget (default: None)
				(OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETFONT_DoFrontPen		(GETFONT_Dummy+2)
	/* (BOOL) Do front pen (default: FALSE) (OM_NEW, OM_SET) */

#define	GETFONT_DoBackPen		(GETFONT_Dummy+3)
	/* (BOOL) Do back pen (default: FALSE) (OM_NEW, OM_SET) */

#define	GETFONT_DoStyle			(GETFONT_Dummy+4)
	/* (BOOL) Do style (default: FALSE) (OM_NEW, OM_SET) */

#define	GETFONT_DoDrawMode		(GETFONT_Dummy+5)
	/* (BOOL) Do draw mode (default: FALSE) (OM_NEW, OM_SET) */

#define	GETFONT_MinHeight		(GETFONT_Dummy+6)
	/* (UWORD) Minimum font height (default: 6) (OM_NEW, OM_SET) */

#define	GETFONT_MaxHeight		(GETFONT_Dummy+7)
	/* (UWORD) Maximum font height (default: 20) (OM_NEW, OM_SET) */

#define	GETFONT_FixedWidthOnly	(GETFONT_Dummy+8)
	/* (BOOL) Only show fixed width fonts (default: FALSE) (OM_NEW, OM_SET) */

#define	GETFONT_TitleText		(GETFONT_Dummy+9)
	/* (STRPTR) Title of the ASL font requester (default: None) (OM_NEW, OM_SET) */

#define	GETFONT_Height			(GETFONT_Dummy+10)
	/* (WORD) Height of the ASL font requester (default: 200) (OM_NEW, OM_SET, OM_GET) (ASL V38) */

#define	GETFONT_Width			(GETFONT_Dummy+11)
	/* (WORD) Width of the ASL font requester (default: 300) (OM_NEW, OM_SET, OM_GET) (ASL V38) */

#define	GETFONT_LeftEdge		(GETFONT_Dummy+12)
	/* (WORD) Left edge of the ASL font requester (default: 30) (OM_NEW, OM_SET, OM_GET) */

#define	GETFONT_TopEdge			(GETFONT_Dummy+13)
	/* (WORD) Top edge of the ASL font requester (default: 20) (OM_NEW, OM_SET, OM_GET) */

#define	GETFONT_FrontPen		(GETFONT_Dummy+14)
	/* (UBYTE) Front pen (default: 1) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETFONT_BackPen			(GETFONT_Dummy+15)
	/* (UBYTE) Back pen (default: 0) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETFONT_DrawMode		(GETFONT_Dummy+16)
	/* (UBYTE) Draw mode (default: JAM1) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define	GETFONT_MaxFrontPen		(GETFONT_Dummy+17)
	/* (UBYTE) Max number of colors in front palette (default: 255) (OM_NEW, OM_SET) (ASL V40) */

#define	GETFONT_MaxBackPen		(GETFONT_Dummy+18)
	/* (UBYTE) Max number of colors in back palette (default: 255) (OM_NEW, OM_SET) (ASL V40) */

#define	GETFONT_ModeList		(GETFONT_Dummy+19)
	/* (STRPTR *) Substitute list for drawmodes (default: None) (OM_NEW, OM_SET) */

#define	GETFONT_FrontPens		(GETFONT_Dummy+20)
	/* (UBYTE *) Color table for front pen palette (default: None) (OM_NEW, OM_SET) (ASL V40) */

#define	GETFONT_BackPens		(GETFONT_Dummy+21)
	/* (UBYTE *) Color table for back pen palette (default: None) (OM_NEW, OM_SET) (ASL V40) */

#define	GETFONT_SoftStyle		(GETFONT_Dummy+22)
	/* (UBYTE) SoftStyle, provided only for making mapping to button.gadget easier (OM_GET, OM_NOTIFY)
			textattr.ta_Style in the GETFONT_TextAttr attribute will provide the style in other
			cases.
	*/

/*****************************************************************************/

/*
 * getfont.gadget methods
 */
#define GFONT_REQUEST	(0x600001L)

/* The GFONT_REQUEST method should be called whenever you want to open
 * a font requester.
 */

struct gfRequest
{
	ULONG MethodID;				/* GFONT_REQUEST */
	struct Window *gfr_Window;	/* The window that will be locked when the requester is active. MUST be provided! */
};

#define gfRequestFont(obj, win)	DoMethod(obj, GFONT_REQUEST, win)

#endif /* GADGETS_GETFONT_H */
