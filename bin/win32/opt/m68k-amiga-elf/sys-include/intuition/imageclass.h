#ifndef INTUITION_IMAGECLASS_H
#define INTUITION_IMAGECLASS_H
/*
**	$VER: imageclass.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	definitions for the system image classes
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/******************************************************/

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

/*
 * NOTE:  <intuition/iobsolete.h> is included at the END of this file!
 */

#define CUSTOMIMAGEDEPTH	(-1)
/* if image.Depth is this, it's a new Image class object */

/* some convenient macros and casts */
#define GADGET_BOX( g )	( (struct IBox *) &((struct Gadget *)(g))->LeftEdge )
#define IM_BOX( im )	( (struct IBox *) &((struct Image *)(im))->LeftEdge )
#define IM_FGPEN( im )	( (im)->PlanePick )
#define IM_BGPEN( im )	( (im)->PlaneOnOff )

/******************************************************/
#define IA_Dummy		(TAG_USER + 0x20000)
#define IA_Left			(IA_Dummy + 0x01)
#define IA_Top			(IA_Dummy + 0x02)
#define IA_Width		(IA_Dummy + 0x03)
#define IA_Height		(IA_Dummy + 0x04)
#define IA_FGPen		(IA_Dummy + 0x05)
		    /* IA_FGPen also means "PlanePick"	*/
#define IA_BGPen		(IA_Dummy + 0x06)
		    /* IA_BGPen also means "PlaneOnOff"	*/
#define IA_Data			(IA_Dummy + 0x07)
		    /* bitplanes, for classic image,
		     * other image classes may use it for other things
		     */
#define IA_LineWidth		(IA_Dummy + 0x08)
#define IA_Pens			(IA_Dummy + 0x0E)
		    /* pointer to UWORD pens[],
		     * ala DrawInfo.Pens, MUST be
		     * terminated by ~0.  Some classes can
		     * choose to have this, or SYSIA_DrawInfo,
		     * or both.
		     */
#define IA_Resolution		(IA_Dummy + 0x0F)
		    /* packed uwords for x/y resolution into a longword
		     * ala DrawInfo.Resolution
		     */

/**** see class documentation to learn which	*****/
/**** classes recognize these			*****/
#define IA_APattern		(IA_Dummy + 0x10)
#define IA_APatSize		(IA_Dummy + 0x11)
#define IA_Mode			(IA_Dummy + 0x12)
#define IA_Font			(IA_Dummy + 0x13)
#define IA_Outline		(IA_Dummy + 0x14)
#define IA_Recessed		(IA_Dummy + 0x15)
#define IA_DoubleEmboss		(IA_Dummy + 0x16)
#define IA_EdgesOnly		(IA_Dummy + 0x17)

/**** "sysiclass" attributes			*****/
#define SYSIA_Size		(IA_Dummy + 0x0B)
		    /* #define's below		*/
#define SYSIA_Depth		(IA_Dummy + 0x0C)
		    /* this is unused by Intuition.  SYSIA_DrawInfo
		     * is used instead for V36
		     */
#define SYSIA_Which		(IA_Dummy + 0x0D)
		    /* see #define's below	*/
#define SYSIA_DrawInfo		(IA_Dummy + 0x18)
		    /* pass to sysiclass, please */

/*****	obsolete: don't use these, use IA_Pens	*****/
#define SYSIA_Pens		IA_Pens
#define IA_ShadowPen		(IA_Dummy + 0x09)
#define IA_HighlightPen		(IA_Dummy + 0x0A)

/* New for V39: */
#define SYSIA_ReferenceFont	(IA_Dummy + 0x19)
		    /* Font to use as reference for scaling
		     * certain sysiclass images
		     */
#define IA_SupportsDisable	(IA_Dummy + 0x1a)
		    /* By default, Intuition ghosts gadgets itself,
		     * instead of relying on IDS_DISABLED or
		     * IDS_SELECTEDDISABLED.  An imageclass that
		     * supports these states should return this attribute
		     * as TRUE.  You cannot set or clear this attribute,
		     * however.
		     */

#define IA_FrameType		(IA_Dummy + 0x1b)
		    /* Starting with V39, FrameIClass recognizes
		     * several standard types of frame.  Use one
		     * of the FRAME_ specifiers below.	Defaults
		     * to FRAME_DEFAULT.
		     */

#define IA_Underscore		(IA_Dummy + 0x1c)
		    /* V44, Indicate underscore keyboard shortcut for image labels.
		     * (UBYTE) Defaults to '_'
		     */

#define IA_Scalable			(IA_Dummy + 0x1d)
		    /* V44, Attribute indicates this image is allowed
			 * to/can scale its rendering.
		     * (BOOL) Defaults to FALSE.
		     */

#define IA_ActivateKey			(IA_Dummy + 0x1e)
		    /* V44, Used to get an underscored label shortcut.
		     * Useful for labels attached to string gadgets.
		     * (UBYTE) Defaults to NULL.
		     */

#define IA_Screen			(IA_Dummy + 0x1f)
		    /* V44 Screen pointer, may be useful/required by certain classes.
		     * (struct Screen *)
		     */

#define IA_Precision			(IA_Dummy + 0x20)
		    /* V44 Precision value, typically pen precision but may be
		     * used for similar custom purposes.
		     * (ULONG)
		     */

/** next attribute: (IA_Dummy + 0x21)	**/
/*************************************************/

/* data values for SYSIA_Size	*/
#define SYSISIZE_MEDRES	(0)
#define SYSISIZE_LOWRES	(1)
#define SYSISIZE_HIRES	(2)

/*
 * SYSIA_Which tag data values:
 * Specifies which system gadget you want an image for.
 * Some numbers correspond to internal Intuition #defines
 */
#define DEPTHIMAGE	(0x00L)	/* Window depth gadget image */
#define ZOOMIMAGE	(0x01L)	/* Window zoom gadget image */
#define SIZEIMAGE	(0x02L)	/* Window sizing gadget image */
#define CLOSEIMAGE	(0x03L)	/* Window close gadget image */
#define SDEPTHIMAGE	(0x05L)	/* Screen depth gadget image */
#define LEFTIMAGE	(0x0AL)	/* Left-arrow gadget image */
#define UPIMAGE		(0x0BL)	/* Up-arrow gadget image */
#define RIGHTIMAGE	(0x0CL)	/* Right-arrow gadget image */
#define DOWNIMAGE	(0x0DL)	/* Down-arrow gadget image */
#define CHECKIMAGE	(0x0EL)	/* GadTools checkbox image */
#define MXIMAGE		(0x0FL)	/* GadTools mutual exclude "button" image */
/* New for V39: */
#define	MENUCHECK	(0x10L)	/* Menu checkmark image */
#define AMIGAKEY	(0x11L)	/* Menu Amiga-key image */

/* Data values for IA_FrameType (recognized by FrameIClass)
 *
 * FRAME_DEFAULT:  The standard V37-type frame, which has
 *	thin edges.
 * FRAME_BUTTON:  Standard button gadget frames, having thicker
 *	sides and nicely edged corners.
 * FRAME_RIDGE:  A ridge such as used by standard string gadgets.
 *	You can recess the ridge to get a groove image.
 * FRAME_ICONDROPBOX: A broad ridge which is the standard imagery
 *	for areas in AppWindows where icons may be dropped.
 */

#define FRAME_DEFAULT		0
#define FRAME_BUTTON		1
#define FRAME_RIDGE		2
#define FRAME_ICONDROPBOX	3


/* image message id's	*/
#define    IM_DRAW	0x202L	/* draw yourself, with "state" */
#define    IM_HITTEST	0x203L	/* return TRUE if click hits image	*/
#define    IM_ERASE	0x204L	/* erase yourself */
#define    IM_MOVE	0x205L	/* draw new and erase old, smoothly	*/

#define    IM_DRAWFRAME	0x206L	/* draw with specified dimensions */
#define    IM_FRAMEBOX	0x207L	/* get recommended frame around some box*/
#define    IM_HITFRAME	0x208L	/* hittest with dimensions */
#define    IM_ERASEFRAME 0x209L	/* erase with dimensions */
#define    IM_DOMAINFRAME	0x20AL  /* query image for its domain info (V44) */


/* image draw states or styles, for IM_DRAW */
/* Note that they have no bitwise meanings (unfortunately) */
#define    IDS_NORMAL		(0L)
#define    IDS_SELECTED		(1L)	/* for selected gadgets	    */
#define    IDS_DISABLED		(2L)	/* for disabled gadgets	    */
#define	   IDS_BUSY		(3L)	/* for future functionality */
#define    IDS_INDETERMINATE	(4L)	/* for future functionality */
#define    IDS_INACTIVENORMAL	(5L)	/* normal, in inactive window border */
#define    IDS_INACTIVESELECTED	(6L)	/* selected, in inactive border */
#define    IDS_INACTIVEDISABLED	(7L)	/* disabled, in inactive border */
#define	   IDS_SELECTEDDISABLED (8L)	/* disabled and selected    */

/* oops, please forgive spelling error by jimm */
#define IDS_INDETERMINANT IDS_INDETERMINATE

/* IM_FRAMEBOX	*/
struct impFrameBox {
    ULONG		MethodID;
    struct IBox	*imp_ContentsBox;	/* input: relative box of contents */
    struct IBox	*imp_FrameBox;		/* output: rel. box of encl frame  */
    struct DrawInfo	*imp_DrInfo;	/* NB: May be NULL */
    ULONG	imp_FrameFlags;
};

#define FRAMEF_SPECIFY	(1<<0)	/* Make do with the dimensions of FrameBox
				 * provided.
				 */

/* IM_DRAW, IM_DRAWFRAME	*/
struct impDraw
{
    ULONG		MethodID;
    struct RastPort	*imp_RPort;
    struct
    {
	WORD	X;
	WORD	Y;
    }			imp_Offset;

    ULONG		imp_State;
    struct DrawInfo	*imp_DrInfo;	/* NB: May be NULL */

    /* these parameters only valid for IM_DRAWFRAME */
    struct
    {
	WORD	Width;
	WORD	Height;
    }			imp_Dimensions;
};

/* IM_ERASE, IM_ERASEFRAME	*/
/* NOTE: This is a subset of impDraw	*/
struct impErase
{
    ULONG		MethodID;
    struct RastPort	*imp_RPort;
    struct
    {
	WORD	X;
	WORD	Y;
    }			imp_Offset;

    /* these parameters only valid for IM_ERASEFRAME */
    struct
    {
	WORD	Width;
	WORD	Height;
    }			imp_Dimensions;
};

/* IM_HITTEST, IM_HITFRAME	*/
struct impHitTest
{
    ULONG		MethodID;
    struct
    {
	WORD	X;
	WORD	Y;
    }			imp_Point;

    /* these parameters only valid for IM_HITFRAME */
    struct
    {
	WORD	Width;
	WORD	Height;
    }			imp_Dimensions;
};


/* The IM_DOMAINFRAME method is used to obtain the sizing
 * requirements of an image object within a layout group.
 */

/* IM_DOMAINFRAME */
struct impDomainFrame
{
    ULONG		 MethodID;
    struct DrawInfo	*imp_DrInfo;	/* DrawInfo */
    struct RastPort	*imp_RPort;	/* RastPort to layout for */
    LONG	 	 imp_Which;	/* what size - min/nominal/max */
    struct IBox		 imp_Domain;	/* Resulting domain */
    struct TagItem	*imp_Attrs;	/* Additional attributes */
};

/* Accepted vales for imp_Which.
 */
#define IDOMAIN_MINIMUM		(0)
#define IDOMAIN_NOMINAL		(1)
#define IDOMAIN_MAXIMUM		(2)

/* Include obsolete identifiers: */
#ifndef INTUITION_IOBSOLETE_H
#include <intuition/iobsolete.h>
#endif

#endif
