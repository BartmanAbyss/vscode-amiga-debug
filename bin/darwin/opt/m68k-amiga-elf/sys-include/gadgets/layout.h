#ifndef GADGETS_LAYOUT_H
#define GADGETS_LAYOUT_H
/*
**	$VER: layout.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the layout.gadget BOOPSI class
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

struct WeightObject	/* filled in by layout.gadget for weighbar */
{
	ULONG wb_SuccHeight;
	ULONG wb_PredHeight;
	ULONG wb_Reserved1;	// currently unused.

	ULONG wb_SuccWidth;
 	ULONG wb_PredWidth;
	ULONG wb_Reserved2;	// currently unused.
};

/*****************************************************************************/

struct LayoutLimits	/* filled by the LayoutLimits() call */
{
	UWORD MinWidth;
	UWORD MinHeight;
	UWORD MaxWidth;
	UWORD MaxHeight;
};

/*****************************************************************************/

#define LAYOUT_Dummy			(REACTION_Dummy+0x7000)

#define LAYOUT_Orientation		(LAYOUT_Dummy+1)
	/* (ULONG) Orientation of group, LAYOUT_ORIENT_HORIZ or
	 * LAYOUT_ORIENT_VERT.  Defaults to LAYOUT_ORIENT_HORIZ. */

#define LAYOUT_FixedHoriz		(LAYOUT_Dummy+2)
#define LAYOUT_FixedVert		(LAYOUT_Dummy+3)
	/* (BOOL) TRUE for fixed-size group, false to force that direction to its
	 * smallest possible size. */

#define LAYOUT_HorizAlignment	(LAYOUT_Dummy+4)
	/* (ULONG) Align to left, right, or center of group space, defaults to
	 * LAYOUT_ALIGN_LEFT. */

#define LAYOUT_VertAlignment	(LAYOUT_Dummy+5)
	/* (ULONG) Align to top, bottom, or center of group space, defaults to
	 * LAYOUT_ALIGN_TOP. */

#define LAYOUT_ShrinkWrap		(LAYOUT_Dummy+6)
	/* (BOOL) Shrink out all extra space between gadgets. Default FALSE. */

#define LAYOUT_EvenSize			(LAYOUT_Dummy+7)
	/* (BOOL) Use the minimum size of the largest child for all children.
	 * Default FALSE. */

#define LAYOUT_InnerSpacing		(LAYOUT_Dummy+9)
	/* (ULONG) Spacing between objects. Defaults to INTERSPACING.
	 */

#define LAYOUT_HorizSpacing LAYOUT_InnerSpacing	/* OBSOLETE */
#define LAYOUT_VertSpacing LAYOUT_InnerSpacing

#define INTERSPACING 4		/* virtual pixels */
#define INTERSPACE INTERSPACING

#define LAYOUT_TopSpacing       (LAYOUT_Dummy+10)
	/* (ULONG) The minimum space between the top of the group, and the top of
	 * the objects inside it. */

#define LAYOUT_BottomSpacing    (LAYOUT_Dummy+11)
	/* (ULONG) The minimum space between the bottom of the group, and the
	 * bottom of the objects inside it. */

#define LAYOUT_LeftSpacing      (LAYOUT_Dummy+12)
	/* (ULONG) The minimum space between the left side of the group, and the
	 * left side of the objects inside it. */

#define LAYOUT_RightSpacing     (LAYOUT_Dummy+13)
	/* (ULONG) The minimum space between the right side of the group, and the
	 * right side of the object inside it. */

#define LAYOUT_BevelState       (LAYOUT_Dummy+14)
	/* (ULONG) Either IDS_SELECTED for recessed, or IDS_NORMAL for raised. */

#define LAYOUT_BevelStyle       (LAYOUT_Dummy+15)
	/* (ULONG) See images/bevel.h */

#define LAYOUT_Label            (LAYOUT_Dummy+16)
	/* (UBYTE *) The bevel label, as specified by a text string. */

#define LAYOUT_LabelImage       (LAYOUT_Dummy+17)
	/* (struct Image *) The bevel label, as specified by an Image. */

#define LAYOUT_LabelPlace       (LAYOUT_Dummy+18)
	/* (ULONG) Where to put the label: BVJ_TOP_CENTER, BVJ_TOP_LEFT,
	 * BVJ_TOP_RIGHT, BVJ_IN_CENTER, BVJ_IN_LEFT, BVJ_IN_RIGHT */

/* The child functions.
 * After one of these functions is called, any CHILD_ tag may be used; it will apply
 * to whichever gadget was the last gadget to be altered by AddGadget/ModifyChild.
 */
#define LAYOUT_RemoveChild      (LAYOUT_Dummy+19)
	/* (Object *) The BOOPSI gadget to be removed.  This will destroy the
	 * object, as well. */

#define LAYOUT_AddChild         (LAYOUT_Dummy+20)
	/* (Object *) The BOOPSI gadget to be added. */

#define LAYOUT_AddImage         (LAYOUT_Dummy+21)
	/* (Object *) like LAYOUT_AddChild, except for images instead of
	 * gadgets. */

#define LAYOUT_ModifyChild      (LAYOUT_Dummy+22)
	/* (Object *) The BOOPSI gadget to be modified. */

/* The following two tags, together with GA_ID, are sent in a notification
 * message when a gadget informs of a release verify.
 */
#define LAYOUT_RelVerify		(LAYOUT_Dummy+23)
	/* (BOOL) Gadget release verify notification tag */

#define LAYOUT_RelCode			(LAYOUT_Dummy+24)
	/* (UWORD) Copy of the IntuiMessage.Code from the release verify */

#define LAYOUT_Parent			(LAYOUT_Dummy+25)
	/* (Object *) Set the parent layout of a sublayout. Layout will set this
	 * automatically for all children (thus any object added to a layout
	 * hierarchy will receive this tag in OM_SET). */

#define LAYOUT_DeferLayout		(LAYOUT_Dummy+26)
	/* (BOOL) Setting this tag for a top layout will make it defer GM_LAYOUT
	 * and GM_RENDER from input.device context and request the application to
	 * do them. */

#define LAYOUT_RequestLayout	(LAYOUT_Dummy+27)
	/* (Object *) When this tag is received in OM_UPDATE or IDCMP_IDCMPUPDATE,
	 * the layout instance in question should be relayouted with the GM_LAYOUT
	 * method (or by calling RethinkLayout).  Setting LAYOUT_DeferLayout will
	 * make these notifications appear. */

#define LAYOUT_RequestRefresh	(LAYOUT_Dummy+28)
	/* (Object *) When this tag is received in OM_UPDATE or IDCMP_IDCMPUPDATE,
	 * the layout instance in question should be refreshed with the GM_RENDER
	 * method (or by calling RefreshGList).  Setting LAYOUT_DeferLayout will
	 * make these notifications appear. */

#define LAYOUT_TextPen			(LAYOUT_Dummy+29)
	/* (WORD) Optional text pen color for group label */

#define LAYOUT_FillPen			(LAYOUT_Dummy+30)
	/* (WORD) Optional backfill pen color */

#define LAYOUT_FillPattern		(LAYOUT_Dummy+31)
	/* (UWORD *) Optional backfill pattern */

#define LAYOUT_PageBackFill		(LAYOUT_Dummy+32)
	/* (struct Hook *) !PRIVATE! backfill hook */

#define LAYOUT_BackFill			GA_BackFill
	/* (struct Hook *) Optional backfill hook */

#define LAYOUT_TabVerify		(LAYOUT_Dummy+33)
	/* (BOOL) TRUE if this release verify was triggered with tabcycling and
	 * another gadget has been activated */

#define LAYOUT_LabelColumn		(LAYOUT_Dummy+34)
	/* (ULONG) LABELTEXT_LEFT or LABELTEXT_RIGHT, the side where object
	 * labels are placed in a vertical group. */

#define LAYOUT_LabelWidth		(LAYOUT_Dummy+35)
	/* (ULONG) Width of the the gadget label column. This attribute
	 * can be used to justify several layout groups. */

#define LAYOUT_AlignLabels		(LAYOUT_Dummy+36)
	/* (Object *) Pointer to another layout object this group should
	 * align labels width. Set a cyclic pointer between all the objects
	 * and they will automatically make their label columns the same
	 * width. These tags should be set as soon as possible, preferably
	 * during OM_NEW (One will have to be set afterwards). */

#define LAYOUT_SpaceInner		(LAYOUT_Dummy+37)
#define LAYOUT_SpaceOuter 	(LAYOUT_Dummy+38)
	/* (BOOL) Whether or not this group should have space around/between
	 * objects. For normal layouts, you should use these tags instead
	 * of the direct-control LAYOUT_Top/Bottom/Right/Left/InnerSpacing,
	 * since these can be automatically adjusted to the resolution
	 * for you. */

#define LAYOUT_RelAddress		(LAYOUT_Dummy+39)
	/* (struct Gadget *) The address of the gadget that sent a release
	 * verify. */

#define LAYOUT_HelpHit			(LAYOUT_Dummy+40)
	/* (UWORD) HelpTest return code.
	 */

#define LAYOUT_HelpGadget		(LAYOUT_Dummy+41)
	/* (struct Gadget *) HelpTest gadget pointer notified with HelpHit! (V44)
	 * (OM_NOTIFY)
	 */

#define LAYOUT_DisposeLabels (LAYOUT_Dummy) /* Was +41!! */
	/* (BOOL) Dispose Labels on exit (OBSOLETE!)
	 * (OM_SET/OM_UPDATE)
	 */

#define LAYOUT_Inverted     (LAYOUT_Dummy+42)
	/* (BOOL) Add group children via AddHead() rather than AddTail()
	 * A very simple means to flip a layout group placement (42.25+)
     * Its also highly useful for dynamic layout, inserting the
     * child on the head, or tail (left/right, top/bottom). Changing
     * this tag only effects children added afterward.
	 */

#define LAYOUT_WeightBar    (LAYOUT_Dummy+43)
	/* (BOOL) Place a user adjustable weighting bar here (ie; balance group bar)
	 *  ClassAct 2.1 - V43.1
	 */

/* Child tags!
 */
#define CHILD_Dummy				(LAYOUT_Dummy+0x100)

#define CHILD_MinWidth          (CHILD_Dummy+1)
	/* (ULONG) The minimum width, in pixels, of the object.  Leave blank if
	 * you want the minimum size to be calced by the gadget as the smallest
	 * possible, or use ~0.  Defaults to ~0. */

#define CHILD_MinHeight         (CHILD_Dummy+2)
	/* (ULONG) The minimum height, in pixels, of the object.  Leave blank if
	 * you want the minimum size to be calced by the gadget as the smallest
	 * possible, or use ~0.  Defaults to ~0. */

#define CHILD_NominalSize		(CHILD_Dummy+11)
	/* (BOOL) Use GDOMAIN_NOMINAL instead of GDOMAIN_MINIMUM to request
	 * minimum size.  Defaults to FALSE. */

#define CHILD_MaxWidth			(CHILD_Dummy+3)
	/* (ULONG) The maximum width, in pixels, of the object.  Leave blank if
	 * you want the maximum size to be calced by the gadget as the largest
	 * possible, or use ~0. */

#define CHILD_MaxHeight         (CHILD_Dummy+4)
	/* (ULONG) The maximum height, in pixels, of the object.  Leave blank if
	 * you want the maximum size to be calced by the gadget as the smallest
	 * possible, or use ~0. */

#define CHILD_WeightedWidth     (CHILD_Dummy+5)
	/* (ULONG) See CHILD_WeightedHeight. */

#define CHILD_WeightedHeight    (CHILD_Dummy+6)
	/* (ULONG) The weighted width or height is a number between 0 and 100;
	 * it determines how much space, in relation to the other objects in the
	 * group, this particular object should be allowed.  When the width/height
	 * for the group is calculated, the allowable space is divided up between
	 * the gadgets based on this, and the min/max values.  For instance, if
	 * you had two objects, one with a weight of 100 and another with a weight
	 * of 50, and the group was 150 pixels wide, 100 would be offered to the
	 * first, and 50 to the second; how much space it actually takes depends
	 * on whether that particular value exceeds the maximum, the minimum, or
	 * the gadget's internal calculations of its minimum or maximum possible
	 * width or height.  Both CHILD_WeightedWidth and CHILD_WeightedHeight
	 * default to 100.  A value of 0 locks it at the CHILD_MinWidth or
	 * CHILD_MinHeight value, respectively. */

#define CHILD_ReplaceObject       (CHILD_Dummy+7)
	/* (Object *) The BOOPSI gadget to replace the object with.  The original
	 * object is destroyed. */

#define CHILD_ReplaceImage        (LAYOUT_Dummy+8)
	/* (Object *) Like CHILD_ReplaceObject, except the replacement object is
	 * an image, not a gadget. */

#define CHILD_CacheDomain         (CHILD_Dummy+9)
	/* (BOOL) Whether GM_DOMAIN results can be cached to improve performance.
	 * Set this to FALSE if you use weird gadgets that can change size on
	 * their own. Defaults to TRUE. */

#define CHILD_WeightMinimum		(CHILD_Dummy+10)
	/* (BOOL) Makes layout set the weighted size to the values returned by
	 * minimum GM_DOMAIN. */

#define CHILD_Label				(CHILD_Dummy+12)
	/* (Object *) A label.image to use as the label for this gadget */

#define CHILD_NoDispose			(CHILD_Dummy+13)
	/* (BOOL) Set this to true if you don't want layout to automatically
	 * dispose the object. */

#define CHILD_ScaleHeight       (CHILD_Dummy+14)
	/* (UWORD) Scales min domain size larger by this percentage (0 thru 100). */

#define CHILD_ScaleWidth        (CHILD_Dummy+15)
	/* (UWORD See CHILD_ScaleHeight. */

#define CHILD_DataType          (CHILD_Dummy+16)
	/* (BOOL) This is a datatype, layout will use DTM_PROCLAYOUT,
	 * SetDTAttrs and RefreshDTObject so waiting for DTA_Sync is not
	 * required. (V43 BETA) */

/*****************************************************************************/

/* Special "empty label" value for CHILD_Label
 */
#define LCLABEL_NOLABEL		((Object *)1)

/* Possible values for LAYOUT_Orientation.
 */
#define LAYOUT_HORIZONTAL	0
#define LAYOUT_VERTICAL		1

#define LAYOUT_ORIENT_HORIZ	LAYOUT_HORIZONTAL
#define LAYOUT_ORIENT_VERT	LAYOUT_VERTICAL

/* Possible values for LAYOUT_HorizAlignment.
 */
#define LALIGN_LEFT		0
#define LALIGN_RIGHT	1
#define LALIGN_CENTER	2
#define LALIGN_CENTRE	LALIGN_CENTER

#define LAYOUT_ALIGN_LEFT	LALIGN_LEFT
#define LAYOUT_ALIGN_RIGHT	LALIGN_RIGHT
#define LAYOUT_ALIGN_CENTER	LALIGN_CENTER

/* Possible values for LAYOUT_VertAlignment.
 */
#define LALIGN_TOP		0
#define LALIGN_BOTTOM	1
#define LALIGN_CENTER	2
#define LALIGN_CENTRE	LALIGN_CENTER

#define LAYOUT_ALIGN_TOP	LALIGN_TOP
#define LAYOUT_ALIGN_BOTTOM	LALIGN_BOTTOM
#define LAYOUT_ALIGN_CENTER	LALIGN_CENTER

/*****************************************************************************/

/* Page Class tags  */

#define PAGE_Dummy				(LAYOUT_Dummy+0x200)

#define PAGE_Add				(PAGE_Dummy+1)
	/* (Object *) Add a page to the end of a page group */

#define PAGE_Remove				(PAGE_Dummy+2)
	/* (Object *) Remove a page from the page group */

#define PAGE_Current			(PAGE_Dummy+3)
	/* (ULONG) Make the n'th page visible. */

#define PAGE_FixedVert			(PAGE_Dummy+4)
#define PAGE_FixedHoriz			(PAGE_Dummy+5)
	/* (BOOL) Like the Layout class tags. */

#define PAGE_Transparent		(PAGE_Dummy+6)
	/* (BOOL) PRIVATE */

#endif  /* GADGETS_LAYOUT_H */
