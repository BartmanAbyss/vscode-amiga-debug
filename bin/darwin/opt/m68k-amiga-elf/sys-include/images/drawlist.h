#ifndef IMAGES_DRAWLIST_H
#define IMAGES_DRAWLIST_H
/*
**	$VER: drawlist.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the drawlist.image BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTRION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_IMAGECLASS_H
#include <intuition/imageclass.h>
#endif

/*****************************************************************************/

#define DRAWLIST_Dummy		(REACTION_Dummy + 0x17000)

#define DRAWLIST_Directives	(DRAWLIST_Dummy+1)
	/* (struct DrawList *) Pointer to drawlist directive array. */

#define DRAWLIST_RefHeight	(DRAWLIST_Dummy+2)
	/* (WORD) Reference height of drawlist. */

#define DRAWLIST_RefWidth	(DRAWLIST_Dummy+3)
	/* (WORD) Reference width of drawlist. */

#define DRAWLIST_DrawInfo	(DRAWLIST_Dummy+4)
	/* Obsolete!! Do not use. */

/*****************************************************************************/

/* DrawList Primitive Directives
 */

#define DLST_END		0

#define DLST_LINE		1
#define DLST_RECT		2
#define DLST_FILL		3
#define DLST_ELLIPSE	4
#define DLST_CIRCLE		5
#define DLST_LINEPAT	6
#define DLST_FILLPAT	7
#define DLST_AMOVE		8
#define DLST_ADRAW		9
#define DLST_AFILL		10
#define DLST_BEVELBOX	11
#define DLST_ARC		12
#define DLST_START		13
#define DLST_BOUNDS		13
#define DLST_LINESIZE	14

/*****************************************************************************/

/* Pass an array of these via DRAWLIST_Directives.
 * Last entry must be DLST_END!
 */

struct DrawList
{
	WORD dl_Directive;
	UWORD dl_X1, dl_Y1;
	UWORD dl_X2, dl_Y2;
	WORD dl_Pen;
};

#endif /* IMAGES_DRAWLIST_H */
