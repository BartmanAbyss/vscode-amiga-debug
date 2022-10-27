#ifndef INTUITION_GADGETCLASS_H
#define INTUITION_GADGETCLASS_H
/*
**	$VER: gadgetclass.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Custom and 'boopsi' gadget class interface
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/*****************************************************************************/

/* NOTE:  <intuition/iobsolete.h> is included at the END of this file! */

/*****************************************************************************/

/* Gadget class attributes */
#define	GA_Dummy 		(TAG_USER+0x30000)

#define	GA_Left			(GA_Dummy+1)
    /* (LONG) Left edge of the gadget relative to the left edge of
     * the window */

#define	GA_RelRight		(GA_Dummy+2)
    /* (LONG) Left edge of the gadget relative to the right edge of
     * the window */

#define	GA_Top			(GA_Dummy+3)
    /* (LONG) Top edge of the gadget relative to the top edge of
     * the window */

#define	GA_RelBottom		(GA_Dummy+4)
    /* (LONG) Top edge of the gadget relative to the bottom edge
     * of the window */

#define	GA_Width		(GA_Dummy+5)
    /* (LONG) Width of the gadget */

#define	GA_RelWidth		(GA_Dummy+6)
    /* (LONG) Width of the gadget relative to the width of the
     * window */

#define	GA_Height		(GA_Dummy+7)
    /* (LONG) Height of the gadget */

#define	GA_RelHeight		(GA_Dummy+8)
    /* (LONG) Height of the gadget relative to the height of
     * the window */

#define	GA_Text			(GA_Dummy+9)
    /* (STRPTR) Gadget imagry is NULL terminated string */

#define	GA_Image		(GA_Dummy+10)
    /* (struct Image *) Gadget imagry is an image */

#define	GA_Border		(GA_Dummy+11)
    /* (struct Border *) Gadget imagry is a border */

#define	GA_SelectRender		(GA_Dummy+12)
    /* (struct Image *) Selected gadget imagry */

#define	GA_Highlight		(GA_Dummy+13)
    /* (UWORD) One of GFLG_GADGHNONE, GFLG_GADGHBOX, GFLG_GADGHCOMP,
     * or GFLG_GADGHIMAGE */

#define	GA_Disabled		(GA_Dummy+14)
    /* (BOOL) Indicate whether gadget is disabled or not.
     * Defaults to FALSE. */

#define	GA_GZZGadget		(GA_Dummy+15)
    /* (BOOL) Indicate whether the gadget is for
     * WFLG_GIMMEZEROZERO window borders or not.  Defaults
     * to FALSE. */

#define	GA_ID			(GA_Dummy+16)
    /* (UWORD) Gadget ID assigned by the application */

#define	GA_UserData		(GA_Dummy+17)
    /* (APTR) Application specific data */

#define	GA_SpecialInfo		(GA_Dummy+18)
    /* (APTR) Gadget specific data */

#define	GA_Selected		(GA_Dummy+19)
    /* (BOOL) Indicate whether the gadget is selected or not.
     * Defaults to FALSE */

#define	GA_EndGadget		(GA_Dummy+20)
    /* (BOOL) When set tells the system that when this gadget
     * is selected causes the requester that it is in to be
     * ended.  Defaults to FALSE. */

#define	GA_Immediate		(GA_Dummy+21)
    /* (BOOL) When set indicates that the gadget is to
     * notify the application when it becomes active.  Defaults
     * to FALSE. */

#define	GA_RelVerify		(GA_Dummy+22)
    /* (BOOL) When set indicates that the application wants to
     * verify that the pointer was still over the gadget when
     * the select button is released.  Defaults to FALSE. */

#define	GA_FollowMouse		(GA_Dummy+23)
    /* (BOOL) When set indicates that the application wants to
     * be notified of mouse movements while the gadget is active.
     * It is recommmended that GA_Immediate and GA_RelVerify are
     * also used so that the active gadget can be tracked by the
     * application.  Defaults to FALSE. */

#define	GA_RightBorder		(GA_Dummy+24)
    /* (BOOL) Indicate whether the gadget is in the right border
     * or not.  Defaults to FALSE. */

#define	GA_LeftBorder		(GA_Dummy+25)
    /* (BOOL) Indicate whether the gadget is in the left border
     * or not.  Defaults to FALSE. */

#define	GA_TopBorder		(GA_Dummy+26)
    /* (BOOL) Indicate whether the gadget is in the top border
     * or not.  Defaults to FALSE. */

#define	GA_BottomBorder		(GA_Dummy+27)
    /* (BOOL) Indicate whether the gadget is in the bottom border
     * or not.  Defaults to FALSE. */

#define	GA_ToggleSelect		(GA_Dummy+28)
    /* (BOOL) Indicate whether the gadget is toggle-selected
     * or not.  Defaults to FALSE. */

#define	GA_SysGadget		(GA_Dummy+29)
    /* (BOOL) Reserved for system use to indicate that the
     * gadget belongs to the system.  Defaults to FALSE. */

#define	GA_SysGType		(GA_Dummy+30)
    /* (UWORD) Reserved for system use to indicate the
     * gadget type. */

#define	GA_Previous		(GA_Dummy+31)
    /* (struct Gadget *) Previous gadget in the linked list.
     * NOTE: This attribute CANNOT be used to link new gadgets
     * into the gadget list of an open window or requester.
     * You must use AddGList(). */

#define	GA_Next			(GA_Dummy+32)
    /* (struct Gadget *) Next gadget in the linked list. */

#define	GA_DrawInfo		(GA_Dummy+33)
    /* (struct DrawInfo *) Some gadgets need a DrawInfo at creation time */

/* You should use at most ONE of GA_Text, GA_IntuiText, and GA_LabelImage */
#define GA_IntuiText		(GA_Dummy+34)
    /* (struct IntuiText *) Label is an IntuiText. */

#define GA_LabelImage		(GA_Dummy+35)
    /* (Object *) Label is an image object. */

#define GA_TabCycle		(GA_Dummy+36)
    /* (BOOL) Indicate whether gadget is part of TAB/SHIFT-TAB cycle
     * activation.  Defaults to FALSE.  New for V37. */

#define GA_GadgetHelp		(GA_Dummy+37)
    /* (BOOL) Indicate whether gadget is to send IDCMP_GADGETHELP.
     * Defaults to FALSE.  New for V39. */

#define GA_Bounds		(GA_Dummy+38)
    /* (struct IBox *) Copied into the extended gadget's bounds.
     * New for V39. */

#define GA_RelSpecial		(GA_Dummy+39)
    /* (BOOL) Indicate whether gadget has special relativity.  Defaults to
     * FALSE.  New for V39. */

#define	GA_TextAttr		(GA_Dummy+40)
    /* (struct TextAttr *) Indicate the font to use for the gadget.
     * New for V42. */

#define	GA_ReadOnly		(GA_Dummy+41)
    /* (BOOL) Indicate that the gadget is read-only (non-selectable).
     * Defaults to FALSE. New for V42. */

#define	GA_Underscore		(GA_Dummy+42)
    /* (UBYTE) Underscore/escape character for keyboard shortcuts.
     * Defaults to '_' . New for V44. */

#define	GA_ActivateKey		(GA_Dummy+43)
    /* (STRPTR) Set/Get the gadgets shortcut/activation key(s)
     * Defaults to NULL. New for V44. */

#define	GA_BackFill		(GA_Dummy+44)
    /* (struct Hook *) Backfill pattern hook.
     * Defaults to NULL. New for V44. */

#define	GA_GadgetHelpText		(GA_Dummy+45)
    /* (STRPTR) **RESERVERD/PRIVATE DO NOT USE**
     * Defaults to NULL. New for V44. */

#define	GA_UserInput		(GA_Dummy+46)
	/* (BOOL) Notification tag indicates this notification is from the activite
	 * gadget receiving user input - an attempt to make IDCMPUPDATE more efficient.
     * Defaults to FALSE. New for V44. */

/*****************************************************************************/

/* PROPGCLASS attributes */
#define PGA_Dummy	(TAG_USER+0x31000)
#define PGA_Freedom	(PGA_Dummy+0x0001)
	/* only one of FREEVERT or FREEHORIZ */
#define PGA_Borderless	(PGA_Dummy+0x0002)
#define PGA_HorizPot	(PGA_Dummy+0x0003)
#define PGA_HorizBody	(PGA_Dummy+0x0004)
#define PGA_VertPot	(PGA_Dummy+0x0005)
#define PGA_VertBody	(PGA_Dummy+0x0006)
#define PGA_Total	(PGA_Dummy+0x0007)
#define PGA_Visible	(PGA_Dummy+0x0008)
#define PGA_Top		(PGA_Dummy+0x0009)
/* New for V37: */
#define PGA_NewLook	(PGA_Dummy+0x000A)

/*****************************************************************************/

/* STRGCLASS attributes */
#define STRINGA_Dummy  		(TAG_USER     +0x32000)
#define STRINGA_MaxChars	(STRINGA_Dummy+0x0001)
/* Note:  There is a minor problem with Intuition when using boopsi integer
 * gadgets (which are requested by using STRINGA_LongInt).  Such gadgets
 * must not have a STRINGA_MaxChars to be bigger than 15.  Setting
 * STRINGA_MaxChars for a boopsi integer gadget will cause a mismatched
 * FreeMem() to occur.
 */

#define STRINGA_Buffer		(STRINGA_Dummy+0x0002)
#define STRINGA_UndoBuffer	(STRINGA_Dummy+0x0003)
#define STRINGA_WorkBuffer	(STRINGA_Dummy+0x0004)
#define STRINGA_BufferPos	(STRINGA_Dummy+0x0005)
#define STRINGA_DispPos		(STRINGA_Dummy+0x0006)
#define STRINGA_AltKeyMap	(STRINGA_Dummy+0x0007)
#define STRINGA_Font		(STRINGA_Dummy+0x0008)
#define STRINGA_Pens		(STRINGA_Dummy+0x0009)
#define STRINGA_ActivePens	(STRINGA_Dummy+0x000A)
#define STRINGA_EditHook	(STRINGA_Dummy+0x000B)
#define STRINGA_EditModes	(STRINGA_Dummy+0x000C)

/* booleans */
#define STRINGA_ReplaceMode	(STRINGA_Dummy+0x000D)
#define STRINGA_FixedFieldMode	(STRINGA_Dummy+0x000E)
#define STRINGA_NoFilterMode	(STRINGA_Dummy+0x000F)

#define STRINGA_Justification	(STRINGA_Dummy+0x0010)
	/* GACT_STRINGCENTER, GACT_STRINGLEFT, GACT_STRINGRIGHT */
#define STRINGA_LongVal		(STRINGA_Dummy+0x0011)
#define STRINGA_TextVal		(STRINGA_Dummy+0x0012)

#define STRINGA_ExitHelp	(STRINGA_Dummy+0x0013)
	/* STRINGA_ExitHelp is new for V37, and ignored by V36.
	 * Set this if you want the gadget to exit when Help is
	 * pressed.  Look for a code of 0x5F, the rawkey code for Help */

#define SG_DEFAULTMAXCHARS	(128)

/*****************************************************************************/

/* Gadget layout related attributes */
#define	LAYOUTA_Dummy 		(TAG_USER+0x38000)
#define LAYOUTA_LayoutObj	(LAYOUTA_Dummy+0x0001)
#define LAYOUTA_Spacing		(LAYOUTA_Dummy+0x0002)
#define LAYOUTA_Orientation	(LAYOUTA_Dummy+0x0003)

#define	LAYOUTA_ChildMaxWidth	(LAYOUTA_Dummy+0x0004)
    /* (BOOL) Child objects are of equal width.  Should default to TRUE for
     * gadgets with a horizontal orientation.  New for V42. */
#define	LAYOUTA_ChildMaxHeight	(LAYOUTA_Dummy+0x0005)
    /* (BOOL) Child objects are of equal height.  Should default to TRUE for
     * gadgets with a vertical orientation.  New for V42. */

/* orientation values */
#define LORIENT_NONE	0
#define LORIENT_HORIZ	1
#define LORIENT_VERT	2

/*****************************************************************************/

/* Gadget Method ID's */
#define GM_Dummy	(-1)
    /* not used for anything */

#define GM_HITTEST	(0)
    /* return GMR_GADGETHIT if you are clicked on (whether or not you
     * are disabled). */

#define GM_RENDER	(1)
    /* draw yourself, in the appropriate state */

#define GM_GOACTIVE	(2)
    /* you are now going to be fed input */

#define GM_HANDLEINPUT	(3)
    /* handle that input */

#define GM_GOINACTIVE	(4)
    /* whether or not by choice, you are done */

#define GM_HELPTEST	(5)
    /* Will you send gadget help if the mouse is at the specified coordinates?
     * See below for possible GMR_ values. */

#define GM_LAYOUT	(6)
    /* re-evaluate your size based on the GadgetInfo domain.
     * Do NOT re-render yourself yet, you will be called when it is
     * time... */

#define GM_DOMAIN	(7)
    /* Used to obtain the sizing requirements of an object.  Does not
     * require an object. */

#define GM_KEYTEST	(8)
    /* return GMR_GADGETHIT if you activation key matches (whether or not you
     * are disabled). */

#define GM_KEYGOACTIVE	(9)

#define GM_KEYGOINACTIVE	(10)

/*****************************************************************************/

/* Parameter "Messages" passed to gadget class methods	*/

/* GM_HITTEST and GM_HELPTEST send this message.
 * For GM_HITTEST, gpht_Mouse are coordinates relative to the gadget
 * select box.  For GM_HELPTEST, the coordinates are relative to
 * the gadget bounding box (which defaults to the select box).
 */
struct gpHitTest
{
    ULONG		MethodID;
    struct GadgetInfo	*gpht_GInfo;
    struct
    {
	WORD	X;
	WORD	Y;
    }			gpht_Mouse;
};

/* For GM_HITTEST, return GMR_GADGETHIT if you were indeed hit,
 * otherwise return zero.
 *
 * For GM_HELPTEST, return GMR_NOHELPHIT (zero) if you were not hit.
 * Typically, return GMR_HELPHIT if you were hit.
 * It is possible to pass a UWORD to the application via the Code field
 * of the IDCMP_GADGETHELP message.  Return GMR_HELPCODE or'd with
 * the UWORD-sized result you wish to return.
 *
 * GMR_HELPHIT yields a Code value of ((UWORD) ~0), which should
 * mean "nothing particular" to the application.
 */

#define GMR_GADGETHIT	(0x00000004)	/* GM_HITTEST hit */

#define GMR_NOHELPHIT	(0x00000000)	/* GM_HELPTEST didn't hit */
#define GMR_HELPHIT	(0xFFFFFFFF)	/* GM_HELPTEST hit, return code = ~0 */
#define GMR_HELPCODE	(0x00010000)	/* GM_HELPTEST hit, return low word as code */

/*****************************************************************************/

/* GM_RENDER	*/
struct gpRender
{
    ULONG		MethodID;
    struct GadgetInfo	*gpr_GInfo;	/* gadget context		*/
    struct RastPort	*gpr_RPort;	/* all ready for use		*/
    LONG		gpr_Redraw;	/* might be a "highlight pass"	*/
};

/* values of gpr_Redraw	*/
#define GREDRAW_UPDATE	(2)	/* incremental update, e.g. prop slider	*/
#define GREDRAW_REDRAW	(1)	/* redraw gadget	*/
#define GREDRAW_TOGGLE	(0)	/* toggle highlight, if applicable	*/

/*****************************************************************************/

/* GM_GOACTIVE, GM_HANDLEINPUT	*/
struct gpInput
{
    ULONG		MethodID;
    struct GadgetInfo	*gpi_GInfo;
    struct InputEvent	*gpi_IEvent;
    LONG		*gpi_Termination;
    struct
    {
	WORD	X;
	WORD	Y;
    }			gpi_Mouse;

    /* (V39) Pointer to TabletData structure, if this event originated
     * from a tablet which sends IESUBCLASS_NEWTABLET events, or NULL if
     * not.
     *
     * DO NOT ATTEMPT TO READ THIS FIELD UNDER INTUITION PRIOR TO V39!
     * IT WILL BE INVALID!
     */
    struct TabletData	*gpi_TabletData;
};

/* GM_HANDLEINPUT and GM_GOACTIVE  return code flags	*/
/* return GMR_MEACTIVE (0) alone if you want more input.
 * Otherwise, return ONE of GMR_NOREUSE and GMR_REUSE, and optionally
 * GMR_VERIFY.
 */
#define GMR_MEACTIVE	(0)
#define GMR_NOREUSE	(1 << 1)
#define GMR_REUSE	(1 << 2)
#define GMR_VERIFY	(1 << 3)	/* you MUST set gpi_Termination */

/* New for V37:
 * You can end activation with one of GMR_NEXTACTIVE and GMR_PREVACTIVE,
 * which instructs Intuition to activate the next or previous gadget
 * that has GFLG_TABCYCLE set.
 */
#define GMR_NEXTACTIVE	(1 << 4)
#define GMR_PREVACTIVE	(1 << 5)

/*****************************************************************************/

/* GM_GOINACTIVE */
struct gpGoInactive
{
    ULONG		MethodID;
    struct GadgetInfo	*gpgi_GInfo;

    /* V37 field only!  DO NOT attempt to read under V36! */
    ULONG		gpgi_Abort;	/* gpgi_Abort=1 if gadget was aborted
					 * by Intuition and 0 if gadget went
					 * inactive at its own request
					 */
};

/*****************************************************************************/

/* New for V39: Intuition sends GM_LAYOUT to any GREL_ gadget when
 * the gadget is added to the window (or when the window opens, if
 * the gadget was part of the NewWindow.FirstGadget or the WA_Gadgets
 * list), or when the window is resized.  Your gadget can set the
 * GA_RelSpecial property to get GM_LAYOUT events without Intuition
 * changing the interpretation of your gadget select box.  This
 * allows for completely arbitrary resizing/repositioning based on
 * window size.
 */
/* GM_LAYOUT */
struct gpLayout
{
    ULONG		MethodID;
    struct GadgetInfo	*gpl_GInfo;
    ULONG		gpl_Initial;	/* non-zero if this method was invoked
					 * during AddGList() or OpenWindow()
					 * time.  zero if this method was invoked
					 * during window resizing. */
};

/*****************************************************************************/

/* The GM_DOMAIN method is used to obtain the sizing requirements of an
 * object for a class before ever creating an object. */

/* GM_DOMAIN */
struct gpDomain
{
    ULONG		 MethodID;
    struct GadgetInfo	*gpd_GInfo;
    struct RastPort	*gpd_RPort;	/* RastPort to layout for */
    LONG		 gpd_Which;
    struct IBox		 gpd_Domain;	/* Resulting domain */
    struct TagItem	*gpd_Attrs;	/* Additional attributes */
};

#define	GDOMAIN_MINIMUM		(0)
    /* Minimum size */

#define	GDOMAIN_NOMINAL		(1)
    /* Nominal size */

#define	GDOMAIN_MAXIMUM		(2)
    /* Maximum size */


/*****************************************************************************/

/* The GM_KEYTEST method is used to determin if a key press matches an
 * object's activation key(s). */

/* GM_KEYTEST send this message.
 */
struct gpKeyTest
{
    ULONG		 MethodID;
    struct GadgetInfo	*gpkt_GInfo;
    struct IntuiMessage *gpkt_IMsg;	/* The IntuiMessage that triggered this */
    ULONG		 gpkt_VanillaKey;
};

/*****************************************************************************/

/* The GM_KEYGOACTIVE method is called to "simulate" a gadget going down.
 * A gadget should render itself in a selected state when receiving
 * this message. If the class supports this method, it must return
 * GMR_KEYACTIVE.
 *
 * If a gadget returns zero for this method, it will subsequently be
 * activated via ActivateGadget() with a NULL IEvent.
 */

struct gpKeyInput
{
    ULONG MethodID;			/* GM_KEYGOACTIVE */
    struct GadgetInfo	*gpk_GInfo;
    struct InputEvent	*gpk_IEvent;
    LONG		*gpk_Termination;
};

#define GMR_KEYACTIVE	(1 << 4)
#define GMR_KEYVERIFY	(1 << 5)	/* you MUST set gpk_Termination */

/* The GM_KEYGOINACTIVE method is called to simulate the gadget release.
 * Upon receiving this message, the gadget should do everything a
 * normal gadget release would do.
 */

struct gpKeyGoInactive
{
    ULONG MethodID;			/* GM_KEYGOINACTIVE */
    struct GadgetInfo *gpki_GInfo;
    ULONG gpki_Abort;			/* TRUE if input was aborted */
};

/*****************************************************************************/

/* Include obsolete identifiers: */
#ifndef INTUITION_IOBSOLETE_H
#include <intuition/iobsolete.h>
#endif

/*****************************************************************************/

#endif
