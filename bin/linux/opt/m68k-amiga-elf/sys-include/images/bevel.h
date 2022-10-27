#ifndef IMAGES_BEVEL_H
#define IMAGES_BEVEL_H
/*
**	$VER: bevel.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the bevel.image BOOPSI class
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

#define BEVEL_Dummy			(REACTION_Dummy + 0x16000)

#define BEVEL_Style			(BEVEL_Dummy+1)
	/* (USHORT) Selected bevel style, see BEVEL_* defines below */

#define BEVEL_Label			(BEVEL_Dummy+3)
	/* (UBYTE *) Label text, usually for button or group box labels */

#define BEVEL_LabelImage	(BEVEL_Dummy+4)
	/* (struct Image *) Unsupported label image */

#define BEVEL_LabelPlace	(BEVEL_Dummy+5)
	/* (UBYTE) Label placement, see BVJ_* defines below */

#define BEVEL_InnerTop		(BEVEL_Dummy+6)
	/* (ULONG) (OM_GET) - render offset not included */

#define BEVEL_InnerLeft		(BEVEL_Dummy+7)
	/* (ULONG) (OM_GET) - render offset not included */

#define BEVEL_InnerWidth	(BEVEL_Dummy+8)
	/* (ULONG) (OM_GET) - inner bevel area size */

#define BEVEL_InnerHeight	(BEVEL_Dummy+9)
	/* (ULONG) (OM_GET) - inner bevel area size */

#define BEVEL_HorizSize		(BEVEL_Dummy+10)
	/* (ULONG) (OM_GET) - bevel line thickness */
#define BEVEL_HorzSize  BEVEL_HorizSize
	/* OBSOLETE, use BEVEL_HorizSize instead */

#define BEVEL_VertSize		(BEVEL_Dummy+11)
	/* (ULONG) (OM_GET) - bevel line thickness */

#define BEVEL_FillPen		(BEVEL_Dummy+12)
	/* (WORD) (OM_NEW/OM_SET) - optional inner bevel fill */

#define BEVEL_FillPattern	(BEVEL_Dummy+13)
	/* (UWORD *) (OM_NEW/OM_SET) - optional fill pattern for inner fill/disable */

#define BEVEL_TextPen		(BEVEL_Dummy+14)
	/* (WORD) (OM_NEW/OM_SET) - optional text pen color */

#define BEVEL_Transparent	(BEVEL_Dummy+15)
	/* (WORD) (OM_NEW/OM_SET) - disable inner bevel fill/erase modes */

#define BEVEL_SoftStyle		(BEVEL_Dummy+16)
	/* (WORD) (OM_NEW/OM_SET) - Text SoftStyle */

#define BEVEL_ColorMap		(BEVEL_Dummy+17)
#define BEVEL_ColourMap	BEVEL_ColorMap
	/* (struct ColorMap *) (OM_NEW/OM_SET) - Screen ViewPort ColorMap
	 * This required tag is for proper BVS_BUTTON xen shadow pen selection */

#define BEVEL_Flags			(BEVEL_Dummy+18)
	/* (UWORD) (OM_NEW/OM_SET) Intentionally left undocumented! */

/*****************************************************************************/

/* Bevel Box Styles for BEVEL_Style
 */
#define BVS_THIN		0	/* Thin (usually 1 pixel) bevel. */
#define BVS_BUTTON		1	/* Standard button bevel. */
#define BVS_GROUP		2	/* Group box bevel. */
#define BVS_FIELD		3	/* String/integer/text field bevel. */
#define BVS_NONE		4	/* No not render any bevel. */
#define BVS_DROPBOX		5	/* Drop box area. */
/*
 * You may think it is very stupid to name the vertical bar BVS_SBAR_HORIZ
 * and the horizontal bar BVS_SBAR_VERT. The reason for this is:
 * The vertical bar is mostly used as a seperator in horizontal groups and the
 * horizontal bar is used as a seperator in vertical groups.
 *
 * Another explanation: It was simply a mistake when defining the names the
 * first time.
 */
#define BVS_SBAR_HORIZ	6	/* Vertical bar. */
#define BVS_SBAR_VERT	7	/* Horizontal bar. */
#define BVS_BOX			8	/* Typically, thin black border. */
#define BVS_STANDARD	11	/* Same as BVS_BUTTON but will not support XEN */

#define BVS_SBAR_HORZ	BVS_SBAR_HORIZ	/* OBSOLETE SPELLING */

/* The following bevel types are not implemented yet
 */
#define BVS_FOCUS		9	/* Typically, the border for drag&drop target. */
#define BVS_RADIOBUTTON 10  /* (not implemented) radiobutton bevel. */

/* BEVEL_Flags - CURRENTLY PRIVATE!!
 */
#define BFLG_XENFILL	0x01
#define BFLG_TRANS		0x02

/* Bevel Box Locations for BEVEL_LabelPlace.  Typically used to label a group
 * box, or to be utilized via a button or status gadgets.
 */
#define BVJ_TOP_CENTER	0
#define BVJ_TOP_LEFT	1
#define BVJ_TOP_RIGHT	2
#define BVJ_IN_CENTER	3
#define BVJ_IN_LEFT		4
#define BVJ_IN_RIGHT	5
#define BVJ_BOT_CENTER	6
#define BVJ_BOT_LEFT	7
#define BVJ_BOT_RIGHT	8

#endif /* IMAGES_BEVEL_H */
