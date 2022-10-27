#ifndef GADGETS_BUTTON_H
#define GADGETS_BUTTON_H
/*
**	$VER: button.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	button.gadget definitions
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

#ifndef IMAGES_BEVEL_H
#include <images/bevel.h>
#endif

/*****************************************************************************/

/* Additional attributes defined by the button.gadget class
 * Our class supports most functions of C= button developer release,
 * however we support many additional options as noted below.
 */

#define BUTTON_Dummy			(TAG_USER+0x04000000)

#define	BUTTON_PushButton		(BUTTON_Dummy+1)
	/* (BOOL) Indicate whether button stays depressed when clicked */

#define	BUTTON_Glyph			(BUTTON_Dummy+2)
	/* (struct Image *) Indicate that image is to be drawn using
	 * BltTemplate. Note this tag is only partial support, only single
	 * plane glyphs are rendered correctly.
	 */

#define	BUTTON_TextPen			(BUTTON_Dummy+5)
	/* (LONG) Pen to use for text (-1 uses TEXTPEN) */

#define	BUTTON_FillPen			(BUTTON_Dummy+6)
	/* (LONG) Pen to use for fill (-1 uses FILLPEN) */

#define	BUTTON_FillTextPen		(BUTTON_Dummy+7)
	/* (LONG) Pen to use for fill (-1 uses FILLTEXTPEN) */

#define	BUTTON_BackgroundPen	(BUTTON_Dummy+8)
	/* (LONG) Pen to use for fill (-1 uses BACKGROUNDPEN) */

#define BUTTON_RenderImage		GA_Image
#define BUTTON_SelectImage		GA_SelectRender

#define	BUTTON_BevelStyle		(BUTTON_Dummy+13)
	/* Bevel Box Style */

#define BUTTON_Transparent		(BUTTON_Dummy+15)
	/* Button is transparent, EraseRect fill pattern used (if any)
	 * to render button background.
	 */

#define BUTTON_Justification	(BUTTON_Dummy+16)
	/* LEFT/RIGHT/CENTER jutification of GA_Text text */

#define BUTTON_SoftStyle		(BUTTON_Dummy+17)
	/* Sets Font SoftStyle, ie, Bold, Italics, etc */

#define BUTTON_AutoButton		(BUTTON_Dummy+18)
	/* Automatically creates a button with standard scaled glyphs */

#define BUTTON_VarArgs			(BUTTON_Dummy+19)
	/* Argument array for GA_Text varargs string */

#define BUTTON_DomainString		(BUTTON_Dummy+20)
	/* (STRPTR) default string used for domain calculation */

#define BUTTON_Integer			(BUTTON_Dummy+21)
	/* (int) integer value to display a numeric string.
	 * Useful with notifications from sliders, scrollers, etc
	 */

#define BUTTON_BitMap			(BUTTON_Dummy+22)
	/* (struct BitMap *) BitMap to render in button, rather than an image... */

#define BUTTON_AnimButton		(BUTTON_Dummy+50)
	/* (BOOl) Is button animatable?  Use to turn animating on or off */

#define BUTTON_AnimImages		(BUTTON_Dummy+51)
	/* (struct Image *) Sets an array of struct Images for animation */

#define BUTTON_SelAnimImages	(BUTTON_Dummy+52)
	/* (struct Image *) sets an array of alternate images for a selected
	 * state if used, must contain an equal number of images as the
	 * array used for BUTTON_AnimImages.  It's wise to use the
	 * same sized images too
	 */

#define BUTTON_MaxAnimImages	(BUTTON_Dummy+53)
	/* (LONG) Number of images available in the arrays */

#define BUTTON_AnimImageNumber 	(BUTTON_Dummy+54)
	/* (LONG) Current image number in the array(s) to use
	 * the range of available frames is 0..MaxAnimImages-1
	 */

#define BUTTON_AddAnimImageNumber (BUTTON_Dummy+55)
	/* (ULONG) Value to be added to the current image number counter
	 * the counter will wrap around at MaxAnimImages
	 */

#define BUTTON_SubAnimImageNumber (BUTTON_Dummy+56)
	/* (ULONG) Value to be subtracted from the current image number counter
	 * the counter will wrap around when less than 0
	 */

/****************************************************************************/

/* Justification modes for BUTTON_Justification.
 */
#define BCJ_LEFT	0
#define BCJ_CENTER	1		/* default - center text */
#define BCJ_RIGHT	2

#define BCJ_CENTRE BCJ_CENTER

/* Built-in button glyphs for BUTTON_AutoButton.
 */

#define BAG_POPFILE		1	/* popup file req */
#define BAG_POPDRAWER	2	/* popup drawer req */
#define BAG_POPFONT		3	/* popup font req */
#define BAG_CHECKBOX	4	/* check glyph button */
#define BAG_CANCELBOX	5	/* cancel glyph button */
#define BAG_UPARROW		6	/* up arrow */
#define BAG_DNARROW		7	/* down arrow */
#define BAG_RTARROW		8	/* right arrow */
#define BAG_LFARROW		9	/* left arrow */
#define BAG_POPTIME		10	/* popup time glyph */
#define BAG_POPSCREEN	11	/* popup screen mode glyph */
#define BAG_POPUP		12	/* generic popup */

/*****************************************************************************/

#endif /* GADGETS_BUTTON_H */
