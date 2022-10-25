#ifndef REACTION_REACTION_CLASS_H
#define REACTION_REACTION_CLASS_H
/*
**	$VER: reaction_class.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	reaction class author definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef INTUITION_CGHOOKS_H
#include <intuition/cghooks.h>
#endif

/*
 * PRIVATE!
 */
struct SpecialPens
{
	WORD sp_Version;	/* Currently 0 */
	LONG sp_DarkPen;	/* XEN/Thick extended locked pen */
	LONG sp_LightPen;	/* XEN/Thick extended locked pen */
	/* NOTE: This structure may grow! */
};

/*****************************************************************************
 * Custom method defined and supported by some Reaction Gadgets
 * When this method is supported by more (all?) Reaction Gadgets
 * this structure may move to intuition/gadgetclass.h
 */
#define GM_CLIPRECT  (0x550001L)

/* The GM_CLIPRECT method is used to pass a gadget a cliprect
 * it should install before rendering to ObtainGIRPort() rastports
 * to support proper usage within virtual groups.
 */

struct gpClipRect
{
	ULONG                MethodID;       /* GM_CLIPRECT              */
	struct GadgetInfo   *gpc_GInfo;      /* GadgetInfo               */
	struct Rectangle    *gpc_ClipRect;   /* Rectangle To Clip To     */
	ULONG                gpc_Flags;      /* Flags                    */
};

/* Possible return values from GM_CLIPRECT
 */
#define GMC_VISIBLE			2
#define GMC_PARTIAL			1
#define GMC_INVISIBLE		0

/**************************************************************************/

#endif /* REACTION_REACTION_CLASS_H */
