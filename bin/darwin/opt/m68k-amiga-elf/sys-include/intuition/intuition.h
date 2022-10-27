#ifndef INTUITION_INTUITION_H
#define INTUITION_INTUITION_H TRUE
/*
**  $VER: intuition.h 38.26 (15.2.1993)
**  Includes Release 45.1
**
**  Interface definitions for Intuition applications.
**
**  (C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif

#ifndef GRAPHICS_CLIP_H
#include <graphics/clip.h>
#endif

#ifndef GRAPHICS_VIEW_H
#include <graphics/view.h>
#endif

#ifndef GRAPHICS_RASTPORT_H
#include <graphics/rastport.h>
#endif

#ifndef GRAPHICS_LAYERS_H
#include <graphics/layers.h>
#endif

#ifndef GRAPHICS_TEXT_H
#include <graphics/text.h>
#endif

#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef DEVICES_INPUTEVENT_H
#include <devices/inputevent.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/*
 * NOTE:  intuition/iobsolete.h is included at the END of this file!
 */

/* ======================================================================== */
/* === Menu =============================================================== */
/* ======================================================================== */
struct Menu
{
    struct Menu *NextMenu;	/* same level */
    WORD LeftEdge, TopEdge;	/* position of the select box */
    WORD Width, Height;	/* dimensions of the select box */
    UWORD Flags;		/* see flag definitions below */
    BYTE *MenuName;		/* text for this Menu Header */
    struct MenuItem *FirstItem; /* pointer to first in chain */

    /* these mysteriously-named variables are for internal use only */
    WORD JazzX, JazzY, BeatX, BeatY;
};


/* FLAGS SET BY BOTH THE APPLIPROG AND INTUITION */
#define MENUENABLED 0x0001	/* whether or not this menu is enabled */

/* FLAGS SET BY INTUITION */
#define MIDRAWN 0x0100		/* this menu's items are currently drawn */






/* ======================================================================== */
/* === MenuItem =========================================================== */
/* ======================================================================== */
struct MenuItem
{
    struct MenuItem *NextItem;	/* pointer to next in chained list */
    WORD LeftEdge, TopEdge;	/* position of the select box */
    WORD Width, Height;		/* dimensions of the select box */
    UWORD Flags;		/* see the defines below */

    LONG MutualExclude;		/* set bits mean this item excludes that */

    APTR ItemFill;		/* points to Image, IntuiText, or NULL */

    /* when this item is pointed to by the cursor and the items highlight
     *	mode HIGHIMAGE is selected, this alternate image will be displayed
     */
    APTR SelectFill;		/* points to Image, IntuiText, or NULL */

    BYTE Command;		/* only if appliprog sets the COMMSEQ flag */

    struct MenuItem *SubItem;	/* if non-zero, points to MenuItem for submenu */

    /* The NextSelect field represents the menu number of next selected
     *	item (when user has drag-selected several items)
     */
    UWORD NextSelect;
};


/* FLAGS SET BY THE APPLIPROG */
#define CHECKIT		0x0001	/* set to indicate checkmarkable item */
#define ITEMTEXT	0x0002	/* set if textual, clear if graphical item */
#define COMMSEQ		0x0004	/* set if there's an command sequence */
#define MENUTOGGLE	0x0008	/* set for toggling checks (else mut. exclude) */
#define ITEMENABLED	0x0010	/* set if this item is enabled */

/* these are the SPECIAL HIGHLIGHT FLAG state meanings */
#define HIGHFLAGS	0x00C0	/* see definitions below for these bits */
#define HIGHIMAGE	0x0000	/* use the user's "select image" */
#define HIGHCOMP	0x0040	/* highlight by complementing the selectbox */
#define HIGHBOX		0x0080	/* highlight by "boxing" the selectbox */
#define HIGHNONE	0x00C0	/* don't highlight */

/* FLAGS SET BY BOTH APPLIPROG AND INTUITION */
#define CHECKED	0x0100	/* state of the checkmark */

/* FLAGS SET BY INTUITION */
#define ISDRAWN		0x1000	/* this item's subs are currently drawn */
#define HIGHITEM	0x2000	/* this item is currently highlighted */
#define MENUTOGGLED	0x4000	/* this item was already toggled */





/* ======================================================================== */
/* === Requester ========================================================== */
/* ======================================================================== */
struct Requester
{
    struct Requester *OlderRequest;
    WORD LeftEdge, TopEdge;		/* dimensions of the entire box */
    WORD Width, Height;			/* dimensions of the entire box */
    WORD RelLeft, RelTop;		/* for Pointer relativity offsets */

    struct Gadget *ReqGadget;		/* pointer to a list of Gadgets */
    struct Border *ReqBorder;		/* the box's border */
    struct IntuiText *ReqText;		/* the box's text */
    UWORD Flags;			/* see definitions below */

    /* pen number for back-plane fill before draws */
    UBYTE BackFill;
    /* Layer in place of clip rect	*/
    struct Layer *ReqLayer;

    UBYTE ReqPad1[32];

    /* If the BitMap plane pointers are non-zero, this tells the system
     * that the image comes pre-drawn (if the appliprog wants to define
     * its own box, in any shape or size it wants!);  this is OK by
     * Intuition as long as there's a good correspondence between
     * the image and the specified Gadgets
     */
    struct BitMap *ImageBMap;	/* points to the BitMap of PREDRAWN imagery */
    struct Window *RWindow;	/* added.  points back to Window */

    struct Image  *ReqImage;	/* new for V36: drawn if USEREQIMAGE set */

    UBYTE ReqPad2[32];
};


/* FLAGS SET BY THE APPLIPROG */
#define POINTREL	0x0001
			  /* if POINTREL set, TopLeft is relative to pointer
			   * for DMRequester, relative to window center
			   * for Request().
			   */
#define PREDRAWN	0x0002
	/* set if Requester.ImageBMap points to predrawn Requester imagery */
#define NOISYREQ	0x0004
	/* if you don't want requester to filter input	   */
#define SIMPLEREQ	0x0010
	/* to use SIMPLEREFRESH layer (recommended)	*/

/* New for V36		*/
#define USEREQIMAGE	0x0020
	/*  render linked list ReqImage after BackFill
	 * but before gadgets and text
	 */
#define NOREQBACKFILL	0x0040
	/* don't bother filling requester with Requester.BackFill pen	*/


/* FLAGS SET BY INTUITION */
#define REQOFFWINDOW	0x1000	/* part of one of the Gadgets was offwindow */
#define REQACTIVE	0x2000	/* this requester is active */
#define SYSREQUEST	0x4000	/* (unused) this requester caused by system */
#define DEFERREFRESH	0x8000	/* this Requester stops a Refresh broadcast */






/* ======================================================================== */
/* === Gadget ============================================================= */
/* ======================================================================== */
struct Gadget
{
    struct Gadget *NextGadget;	/* next gadget in the list */

    WORD LeftEdge, TopEdge;	/* "hit box" of gadget */
    WORD Width, Height;		/* "hit box" of gadget */

    UWORD Flags;		/* see below for list of defines */

    UWORD Activation;		/* see below for list of defines */

    UWORD GadgetType;		/* see below for defines */

    /* appliprog can specify that the Gadget be rendered as either as Border
     * or an Image.  This variable points to which (or equals NULL if there's
     * nothing to be rendered about this Gadget)
     */
    APTR GadgetRender;

    /* appliprog can specify "highlighted" imagery rather than algorithmic
     * this can point to either Border or Image data
     */
    APTR SelectRender;

    struct IntuiText *GadgetText;   /* text for this gadget */

    /* MutualExclude, never implemented, is now declared obsolete.
     * There are published examples of implementing a more general
     * and practical exclusion in your applications.
     *
     * Starting with V36, this field is used to point to a hook
     * for a custom gadget.
     *
     * Programs using this field for their own processing will
     * continue to work, as long as they don't try the
     * trick with custom gadgets.
     */
    LONG MutualExclude;  /* obsolete */

    /* pointer to a structure of special data required by Proportional,
     * String and Integer Gadgets
     */
    APTR SpecialInfo;

    UWORD GadgetID;	/* user-definable ID field */
    APTR UserData;	/* ptr to general purpose User data (ignored by In) */
};


struct ExtGadget
{
    /* The first fields match struct Gadget exactly */
    struct ExtGadget *NextGadget; /* Matches struct Gadget */
    WORD LeftEdge, TopEdge;	  /* Matches struct Gadget */
    WORD Width, Height;		  /* Matches struct Gadget */
    UWORD Flags;		  /* Matches struct Gadget */
    UWORD Activation;		  /* Matches struct Gadget */
    UWORD GadgetType;		  /* Matches struct Gadget */
    APTR GadgetRender;		  /* Matches struct Gadget */
    APTR SelectRender;		  /* Matches struct Gadget */
    struct IntuiText *GadgetText; /* Matches struct Gadget */
    LONG MutualExclude;		  /* Matches struct Gadget */
    APTR SpecialInfo;		  /* Matches struct Gadget */
    UWORD GadgetID;		  /* Matches struct Gadget */
    APTR UserData;		  /* Matches struct Gadget */

    /* These fields only exist under V39 and only if GFLG_EXTENDED is set */
    ULONG MoreFlags;		/* see GMORE_ flags below */
    WORD BoundsLeftEdge;	/* Bounding extent for gadget, valid   */
    WORD BoundsTopEdge;		/* only if GMORE_BOUNDS is set.  The   */
    WORD BoundsWidth;		/* GFLG_RELxxx flags affect these      */
    WORD BoundsHeight;		/* coordinates as well.	       */
};


/* --- Gadget.Flags values	--- */
/* combinations in these bits describe the highlight technique to be used */
#define GFLG_GADGHIGHBITS 0x0003
#define GFLG_GADGHCOMP	  0x0000  /* Complement the select box */
#define GFLG_GADGHBOX	  0x0001  /* Draw a box around the image */
#define GFLG_GADGHIMAGE	  0x0002  /* Blast in this alternate image */
#define GFLG_GADGHNONE	  0x0003  /* don't highlight */

#define GFLG_GADGIMAGE		  0x0004  /* set if GadgetRender and SelectRender
				   * point to an Image structure, clear
				   * if they point to Border structures
				   */

/* combinations in these next two bits specify to which corner the gadget's
 *  Left & Top coordinates are relative.  If relative to Top/Left,
 *  these are "normal" coordinates (everything is relative to something in
 *  this universe).
 *
 * Gadget positions and dimensions are relative to the window or
 * requester which contains the gadget
 */
#define GFLG_RELBOTTOM	  0x0008  /* vert. pos. is relative to bottom edge */
#define GFLG_RELRIGHT	  0x0010  /* horiz. pos. is relative to right edge */
#define GFLG_RELWIDTH	  0x0020  /* width is relative to req/window	*/
#define GFLG_RELHEIGHT	  0x0040  /* height is relative to req/window	*/

/* New for V39: GFLG_RELSPECIAL allows custom gadget implementors to
 * make gadgets whose position and size depend in an arbitrary way
 * on their window's dimensions.  The GM_LAYOUT method will be invoked
 * for such a gadget (or any other GREL_xxx gadget) at suitable times,
 * such as when the window opens or the window's size changes.
 */
#define GFLG_RELSPECIAL	  0x4000  /* custom gadget has special relativity.
				   * Gadget box values are absolutes, but
				   * can be changed via the GM_LAYOUT method.
				   */
#define GFLG_SELECTED	  0x0080  /* you may initialize and look at this	*/

/* the GFLG_DISABLED flag is initialized by you and later set by Intuition
 * according to your calls to On/OffGadget().  It specifies whether or not
 * this Gadget is currently disabled from being selected
 */
#define GFLG_DISABLED	  0x0100

/* These flags specify the type of text field that Gadget.GadgetText
 * points to.  In all normal (pre-V36) gadgets which you initialize
 * this field should always be zero.  Some types of gadget objects
 * created from classes will use these fields to keep track of
 * types of labels/contents that different from IntuiText, but are
 * stashed in GadgetText.
 */

#define GFLG_LABELMASK	  0x3000
#define GFLG_LABELITEXT	  0x0000  /* GadgetText points to IntuiText	*/
#define	GFLG_LABELSTRING  0x1000  /* GadgetText points to (UBYTE *)	*/
#define GFLG_LABELIMAGE	  0x2000  /* GadgetText points to Image (object)	*/

/* New for V37: GFLG_TABCYCLE */
#define GFLG_TABCYCLE	  0x0200  /* (string or custom) gadget participates in
				   * cycling activation with Tab or Shift-Tab
				   */
/* New for V37: GFLG_STRINGEXTEND.  We discovered that V34 doesn't properly
 * ignore the value we had chosen for the Gadget->Activation flag
 * GACT_STRINGEXTEND.  NEVER SET THAT FLAG WHEN RUNNING UNDER V34.
 * The Gadget->Flags bit GFLG_STRINGEXTEND is provided as a synonym which is
 * safe under V34, and equivalent to GACT_STRINGEXTEND under V37.
 * (Note that the two flags are not numerically equal)
 */
#define GFLG_STRINGEXTEND 0x0400  /* this String Gadget has StringExtend	*/

/* New for V39: GFLG_IMAGEDISABLE.  This flag is automatically set if
 * the custom image of this gadget knows how to do disabled rendering
 * (more specifically, if its IA_SupportsDisable attribute is TRUE).
 * Intuition uses this to defer the ghosting to the image-class,
 * instead of doing it itself (the old compatible way).
 * Do not set this flag yourself - Intuition will do it for you.
 */

#define GFLG_IMAGEDISABLE 0x0800  /* Gadget's image knows how to do disabled
				   * rendering
				   */

/* New for V39:  If set, this bit means that the Gadget is actually
 * a struct ExtGadget, with new fields and flags.  All V39 boopsi
 * gadgets are ExtGadgets.  Never ever attempt to read the extended
 * fields of a gadget if this flag is not set.
 */
#define GFLG_EXTENDED	  0x8000  /* Gadget is extended */

/* ---	Gadget.Activation flag values	--- */
/* Set GACT_RELVERIFY if you want to verify that the pointer was still over
 * the gadget when the select button was released.  Will cause
 * an IDCMP_GADGETUP message to be sent if so.
 */
#define GACT_RELVERIFY	  0x0001

/* the flag GACT_IMMEDIATE, when set, informs the caller that the gadget
 *  was activated when it was activated.  This flag works in conjunction with
 *  the GACT_RELVERIFY flag
 */
#define GACT_IMMEDIATE	  0x0002

/* the flag GACT_ENDGADGET, when set, tells the system that this gadget,
 * when selected, causes the Requester to be ended.  Requesters
 * that are ended are erased and unlinked from the system.
 */
#define GACT_ENDGADGET	  0x0004

/* the GACT_FOLLOWMOUSE flag, when set, specifies that you want to receive
 * reports on mouse movements while this gadget is active.
 * You probably want to set the GACT_IMMEDIATE flag when using
 * GACT_FOLLOWMOUSE, since that's the only reasonable way you have of
 * learning why Intuition is suddenly sending you a stream of mouse
 * movement events.  If you don't set GACT_RELVERIFY, you'll get at
 * least one Mouse Position event.
 * Note: boolean FOLLOWMOUSE gadgets require GACT_RELVERIFY to get
 * _any_ mouse movement events (this unusual behavior is a compatibility
 * hold-over from the old days).
 */
#define GACT_FOLLOWMOUSE  0x0008

/* if any of the BORDER flags are set in a Gadget that's included in the
 * Gadget list when a Window is opened, the corresponding Border will
 * be adjusted to make room for the Gadget
 */
#define GACT_RIGHTBORDER  0x0010
#define GACT_LEFTBORDER	  0x0020
#define GACT_TOPBORDER	  0x0040
#define GACT_BOTTOMBORDER 0x0080
#define GACT_BORDERSNIFF  0x8000  /* neither set nor rely on this bit	*/

#define GACT_TOGGLESELECT 0x0100  /* this bit for toggle-select mode */
#define GACT_BOOLEXTEND	  0x2000  /* this Boolean Gadget has a BoolInfo	*/

/* should properly be in StringInfo, but aren't	*/
#define GACT_STRINGLEFT	  0x0000  /* NOTE WELL: that this has value zero	*/
#define GACT_STRINGCENTER 0x0200
#define GACT_STRINGRIGHT  0x0400
#define GACT_LONGINT	  0x0800  /* this String Gadget is for Long Ints	*/
#define GACT_ALTKEYMAP	  0x1000  /* this String has an alternate keymap	*/
#define GACT_STRINGEXTEND 0x2000  /* this String Gadget has StringExtend	*/
				  /* NOTE: NEVER SET GACT_STRINGEXTEND IF YOU
				   * ARE RUNNING ON LESS THAN V36!  SEE
				   * GFLG_STRINGEXTEND (ABOVE) INSTEAD
				   */

#define GACT_ACTIVEGADGET 0x4000  /* this gadget is "active".  This flag
				   * is maintained by Intuition, and you
				   * cannot count on its value persisting
				   * while you do something on your program's
				   * task.  It can only be trusted by
				   * people implementing custom gadgets
				   */

/* note 0x8000 is used above (GACT_BORDERSNIFF);
 * all Activation flags defined */

/* --- GADGET TYPES ------------------------------------------------------- */
/* These are the Gadget Type definitions for the variable GadgetType
 * gadget number type MUST start from one.  NO TYPES OF ZERO ALLOWED.
 * first comes the mask for Gadget flags reserved for Gadget typing
 */
#define GTYP_GADGETTYPE	0xFC00	/* all Gadget Global Type flags (padded) */

#define GTYP_SCRGADGET		0x4000	/* 1 = ScreenGadget, 0 = WindowGadget */
#define GTYP_GZZGADGET		0x2000	/* 1 = for WFLG_GIMMEZEROZERO borders */
#define GTYP_REQGADGET		0x1000	/* 1 = this is a Requester Gadget */

/* GTYP_SYSGADGET means that Intuition ALLOCATED the gadget.
 * GTYP_SYSTYPEMASK is the mask you can apply to tell what type of
 * system-gadget it is.  The possible types follow.
 */
#define GTYP_SYSGADGET		0x8000
#define GTYP_SYSTYPEMASK	0x00F0

/* These definitions describe system gadgets in V36 and higher: */
#define GTYP_SIZING		0x0010	/* Window sizing gadget */
#define GTYP_WDRAGGING		0x0020	/* Window drag bar */
#define GTYP_SDRAGGING		0x0030	/* Screen drag bar */
#define GTYP_WDEPTH		0x0040	/* Window depth gadget */
#define GTYP_SDEPTH		0x0050	/* Screen depth gadget */
#define GTYP_WZOOM		0x0060	/* Window zoom gadget */
#define GTYP_SUNUSED		0x0070	/* Unused screen gadget */
#define GTYP_CLOSE		0x0080	/* Window close gadget */

/* These definitions describe system gadgets prior to V36: */
#define GTYP_WUPFRONT		GTYP_WDEPTH	/* Window to-front gadget */
#define GTYP_SUPFRONT		GTYP_SDEPTH	/* Screen to-front gadget */
#define GTYP_WDOWNBACK		GTYP_WZOOM	/* Window to-back gadget */
#define GTYP_SDOWNBACK		GTYP_SUNUSED	/* Screen to-back gadget */

/* GTYP_GTYPEMASK is a mask you can apply to tell what class
 * of gadget this is.  The possible classes follow.
 */
#define GTYP_GTYPEMASK		0x0007

#define GTYP_BOOLGADGET		0x0001
#define GTYP_GADGET0002		0x0002
#define GTYP_PROPGADGET		0x0003
#define GTYP_STRGADGET		0x0004
#define GTYP_CUSTOMGADGET	0x0005

/* This bit in GadgetType is reserved for undocumented internal use
 * by the Gadget Toolkit, and cannot be used nor relied on by
 * applications:	0x0100
 */

/* New for V39.  Gadgets which have the GFLG_EXTENDED flag set are
 * actually ExtGadgets, which have more flags.	The GMORE_xxx
 * identifiers describe those flags.  For GMORE_SCROLLRASTER, see
 * important information in the ScrollWindowRaster() autodoc.
 * NB: GMORE_SCROLLRASTER must be set before the gadget is
 * added to a window.
 */
#define GMORE_BOUNDS	   0x00000001L /* ExtGadget has valid Bounds */
#define GMORE_GADGETHELP   0x00000002L /* This gadget responds to gadget help */
#define GMORE_SCROLLRASTER 0x00000004L /* This (custom) gadget uses ScrollRaster */


/* ======================================================================== */
/* === BoolInfo======================================================= */
/* ======================================================================== */
/* This is the special data needed by an Extended Boolean Gadget
 * Typically this structure will be pointed to by the Gadget field SpecialInfo
 */
struct BoolInfo
{
    UWORD  Flags;	/* defined below */
    UWORD  *Mask;	/* bit mask for highlighting and selecting
			 * mask must follow the same rules as an Image
			 * plane.  Its width and height are determined
			 * by the width and height of the gadget's
			 * select box. (i.e. Gadget.Width and .Height).
			 */
    ULONG  Reserved;	/* set to 0	*/
};

/* set BoolInfo.Flags to this flag bit.
 * in the future, additional bits might mean more stuff hanging
 * off of BoolInfo.Reserved.
 */
#define BOOLMASK	0x0001	/* extension is for masked gadget */

/* ======================================================================== */
/* === PropInfo =========================================================== */
/* ======================================================================== */
/* this is the special data required by the proportional Gadget
 * typically, this data will be pointed to by the Gadget variable SpecialInfo
 */
struct PropInfo
{
    UWORD Flags;	/* general purpose flag bits (see defines below) */

    /* You initialize the Pot variables before the Gadget is added to
     * the system.  Then you can look here for the current settings
     * any time, even while User is playing with this Gadget.  To
     * adjust these after the Gadget is added to the System, use
     * ModifyProp();  The Pots are the actual proportional settings,
     * where a value of zero means zero and a value of MAXPOT means
     * that the Gadget is set to its maximum setting.
     */
    UWORD HorizPot;	/* 16-bit FixedPoint horizontal quantity percentage */
    UWORD VertPot;	/* 16-bit FixedPoint vertical quantity percentage */

    /* the 16-bit FixedPoint Body variables describe what percentage of
     * the entire body of stuff referred to by this Gadget is actually
     * shown at one time.  This is used with the AUTOKNOB routines,
     * to adjust the size of the AUTOKNOB according to how much of
     * the data can be seen.  This is also used to decide how far
     * to advance the Pots when User hits the Container of the Gadget.
     * For instance, if you were controlling the display of a 5-line
     * Window of text with this Gadget, and there was a total of 15
     * lines that could be displayed, you would set the VertBody value to
     *	   (MAXBODY / (TotalLines / DisplayLines)) = MAXBODY / 3.
     * Therefore, the AUTOKNOB would fill 1/3 of the container, and
     * if User hits the Cotainer outside of the knob, the pot would
     * advance 1/3 (plus or minus) If there's no body to show, or
     * the total amount of displayable info is less than the display area,
     * set the Body variables to the MAX.  To adjust these after the
     * Gadget is added to the System, use ModifyProp();
     */
    UWORD HorizBody;		/* horizontal Body */
    UWORD VertBody;		/* vertical Body */

    /* these are the variables that Intuition sets and maintains */
    UWORD CWidth;	/* Container width (with any relativity absoluted) */
    UWORD CHeight;	/* Container height (with any relativity absoluted) */
    UWORD HPotRes, VPotRes;	/* pot increments */
    UWORD LeftBorder;		/* Container borders */
    UWORD TopBorder;		/* Container borders */
};


/* --- FLAG BITS ---------------------------------------------------------- */
#define AUTOKNOB	0x0001	/* this flag sez:  gimme that old auto-knob */
/* NOTE: if you do not use an AUTOKNOB for a proportional gadget,
 * you are currently limited to using a single Image of your own
 * design: Intuition won't handle a linked list of images as
 * a proportional gadget knob.
 */

#define FREEHORIZ	0x0002	/* if set, the knob can move horizontally */
#define FREEVERT	0x0004	/* if set, the knob can move vertically */
#define PROPBORDERLESS	0x0008	/* if set, no border will be rendered */
#define KNOBHIT		0x0100	/* set when this Knob is hit */
#define PROPNEWLOOK	0x0010	/* set this if you want to get the new
				 * V36 look
				 */

#define KNOBHMIN	6	/* minimum horizontal size of the Knob */
#define KNOBVMIN	4	/* minimum vertical size of the Knob */
#define MAXBODY		0xFFFF	/* maximum body value */
#define MAXPOT			0xFFFF	/* maximum pot value */


/* ======================================================================== */
/* === StringInfo ========================================================= */
/* ======================================================================== */
/* this is the special data required by the string Gadget
 * typically, this data will be pointed to by the Gadget variable SpecialInfo
 */
struct StringInfo
{
    /* you initialize these variables, and then Intuition maintains them */
    UBYTE *Buffer;	/* the buffer containing the start and final string */
    UBYTE *UndoBuffer;	/* optional buffer for undoing current entry */
    WORD BufferPos;	/* character position in Buffer */
    WORD MaxChars;	/* max number of chars in Buffer (including NULL) */
    WORD DispPos;	/* Buffer position of first displayed character */

    /* Intuition initializes and maintains these variables for you */
    WORD UndoPos;	/* character position in the undo buffer */
    WORD NumChars;	/* number of characters currently in Buffer */
    WORD DispCount;	/* number of whole characters visible in Container */
    WORD CLeft, CTop;	/* topleft offset of the container */

    /* This unused field is changed to allow extended specification
     * of string gadget parameters.  It is ignored unless the flag
     * GACT_STRINGEXTEND is set in the Gadget's Activation field
     * or the GFLG_STRINGEXTEND flag is set in the Gadget Flags field.
     * (See GFLG_STRINGEXTEND for an important note)
     */
    /* struct Layer *LayerPtr;	--- obsolete --- */
    struct StringExtend *Extension;

    /* you can initialize this variable before the gadget is submitted to
     * Intuition, and then examine it later to discover what integer
     * the user has entered (if the user never plays with the gadget,
     * the value will be unchanged from your initial setting)
     */
    LONG LongInt;

    /* If you want this Gadget to use your own Console keymapping, you
     * set the GACT_ALTKEYMAP bit in the Activation flags of the Gadget,
     * and then set this variable to point to your keymap.  If you don't
     * set the GACT_ALTKEYMAP, you'll get the standard ASCII keymapping.
     */
    struct KeyMap *AltKeyMap;
};

/* ======================================================================== */
/* === IntuiText ========================================================== */
/* ======================================================================== */
/* IntuiText is a series of strings that start with a location
 *  (always relative to the upper-left corner of something) and then the
 *  text of the string.  The text is null-terminated.
 */
struct IntuiText
{
    UBYTE FrontPen, BackPen;	/* the pen numbers for the rendering */
    UBYTE DrawMode;		/* the mode for rendering the text */
    WORD LeftEdge;		/* relative start location for the text */
    WORD TopEdge;		/* relative start location for the text */
    struct TextAttr *ITextFont;	/* if NULL, you accept the default */
    UBYTE *IText;		/* pointer to null-terminated text */
    struct IntuiText *NextText; /* pointer to another IntuiText to render */
};






/* ======================================================================== */
/* === Border ============================================================= */
/* ======================================================================== */
/* Data type Border, used for drawing a series of lines which is intended for
 *  use as a border drawing, but which may, in fact, be used to render any
 *  arbitrary vector shape.
 *  The routine DrawBorder sets up the RastPort with the appropriate
 *  variables, then does a Move to the first coordinate, then does Draws
 *  to the subsequent coordinates.
 *  After all the Draws are done, if NextBorder is non-zero we call DrawBorder
 *  on NextBorder
 */
struct Border
{
    WORD LeftEdge, TopEdge;	/* initial offsets from the origin */
    UBYTE FrontPen, BackPen;	/* pens numbers for rendering */
    UBYTE DrawMode;		/* mode for rendering */
    BYTE Count;			/* number of XY pairs */
    WORD *XY;			/* vector coordinate pairs rel to LeftTop */
    struct Border *NextBorder;	/* pointer to any other Border too */
};






/* ======================================================================== */
/* === Image ============================================================== */
/* ======================================================================== */
/* This is a brief image structure for very simple transfers of
 * image data to a RastPort
 */
struct Image
{
    WORD LeftEdge;		/* starting offset relative to some origin */
    WORD TopEdge;		/* starting offsets relative to some origin */
    WORD Width;			/* pixel size (though data is word-aligned) */
    WORD Height;
    WORD Depth;			/* >= 0, for images you create		*/
    UWORD *ImageData;		/* pointer to the actual word-aligned bits */

    /* the PlanePick and PlaneOnOff variables work much the same way as the
     * equivalent GELS Bob variables.  It's a space-saving
     * mechanism for image data.  Rather than defining the image data
     * for every plane of the RastPort, you need define data only
     * for the planes that are not entirely zero or one.  As you
     * define your Imagery, you will often find that most of the planes
     * ARE just as color selectors.  For instance, if you're designing
     * a two-color Gadget to use colors one and three, and the Gadget
     * will reside in a five-plane display, bit plane zero of your
     * imagery would be all ones, bit plane one would have data that
     * describes the imagery, and bit planes two through four would be
     * all zeroes.  Using these flags avoids wasting all
     * that memory in this way:  first, you specify which planes you
     * want your data to appear in using the PlanePick variable.  For
     * each bit set in the variable, the next "plane" of your image
     * data is blitted to the display.	For each bit clear in this
     * variable, the corresponding bit in PlaneOnOff is examined.
     * If that bit is clear, a "plane" of zeroes will be used.
     * If the bit is set, ones will go out instead.  So, for our example:
     *	 Gadget.PlanePick = 0x02;
     *	 Gadget.PlaneOnOff = 0x01;
     * Note that this also allows for generic Gadgets, like the
     * System Gadgets, which will work in any number of bit planes.
     * Note also that if you want an Image that is only a filled
     * rectangle, you can get this by setting PlanePick to zero
     * (pick no planes of data) and set PlaneOnOff to describe the pen
     * color of the rectangle.
     *
     * NOTE:  Intuition relies on PlanePick to know how many planes
     * of data are found in ImageData.	There should be no more
     * '1'-bits in PlanePick than there are planes in ImageData.
     */
    UBYTE PlanePick, PlaneOnOff;

    /* if the NextImage variable is not NULL, Intuition presumes that
     * it points to another Image structure with another Image to be
     * rendered
     */
    struct Image *NextImage;
};






/* ======================================================================== */
/* === IntuiMessage ======================================================= */
/* ======================================================================== */
struct IntuiMessage
{
    struct Message ExecMessage;

    /* the Class bits correspond directly with the IDCMP Flags, except for the
     * special bit IDCMP_LONELYMESSAGE (defined below)
     */
    ULONG Class;

    /* the Code field is for special values like MENU number */
    UWORD Code;

    /* the Qualifier field is a copy of the current InputEvent's Qualifier */
    UWORD Qualifier;

    /* IAddress contains particular addresses for Intuition functions, like
     * the pointer to the Gadget or the Screen
     */
    APTR IAddress;

    /* when getting mouse movement reports, any event you get will have the
     * the mouse coordinates in these variables.  the coordinates are relative
     * to the upper-left corner of your Window (WFLG_GIMMEZEROZERO
     * notwithstanding).  If IDCMP_DELTAMOVE is set, these values will
     * be deltas from the last reported position.
     */
    WORD MouseX, MouseY;

    /* the time values are copies of the current system clock time.  Micros
     * are in units of microseconds, Seconds in seconds.
     */
    ULONG Seconds, Micros;

    /* the IDCMPWindow variable will always have the address of the Window of
     * this IDCMP
     */
    struct Window *IDCMPWindow;

    /* system-use variable */
    struct IntuiMessage *SpecialLink;
};

/* New for V39:
 * All IntuiMessages are now slightly extended.  The ExtIntuiMessage
 * structure has an additional field for tablet data, which is usually
 * NULL.  If a tablet driver which is sending IESUBCLASS_NEWTABLET
 * events is installed in the system, windows with the WA_TabletMessages
 * property set will find that eim_TabletData points to the TabletData
 * structure.  Applications must first check that this field is non-NULL;
 * it will be NULL for certain kinds of message, including mouse activity
 * generated from other than the tablet (i.e. the keyboard equivalents
 * or the mouse itself).
 *
 * NEVER EVER examine any extended fields when running under pre-V39!
 *
 * NOTE: This structure is subject to grow in the future.  Making
 * assumptions about its size is A BAD IDEA.
 */

struct ExtIntuiMessage
{
    struct IntuiMessage eim_IntuiMessage;
    struct TabletData *eim_TabletData;
};

/* --- IDCMP Classes ------------------------------------------------------ */
/* Please refer to the Autodoc for OpenWindow() and to the Rom Kernel
 * Manual for full details on the IDCMP classes.
 */
#define IDCMP_SIZEVERIFY	0x00000001L
#define IDCMP_NEWSIZE		0x00000002L
#define IDCMP_REFRESHWINDOW	0x00000004L
#define IDCMP_MOUSEBUTTONS	0x00000008L
#define IDCMP_MOUSEMOVE		0x00000010L
#define IDCMP_GADGETDOWN	0x00000020L
#define IDCMP_GADGETUP		0x00000040L
#define IDCMP_REQSET		0x00000080L
#define IDCMP_MENUPICK		0x00000100L
#define IDCMP_CLOSEWINDOW	0x00000200L
#define IDCMP_RAWKEY		0x00000400L
#define IDCMP_REQVERIFY		0x00000800L
#define IDCMP_REQCLEAR		0x00001000L
#define IDCMP_MENUVERIFY	0x00002000L
#define IDCMP_NEWPREFS		0x00004000L
#define IDCMP_DISKINSERTED	0x00008000L
#define IDCMP_DISKREMOVED	0x00010000L
#define IDCMP_WBENCHMESSAGE	0x00020000L  /*	System use only		*/
#define IDCMP_ACTIVEWINDOW	0x00040000L
#define IDCMP_INACTIVEWINDOW	0x00080000L
#define IDCMP_DELTAMOVE		0x00100000L
#define IDCMP_VANILLAKEY	0x00200000L
#define IDCMP_INTUITICKS	0x00400000L
/*  for notifications from "boopsi" gadgets	*/
#define IDCMP_IDCMPUPDATE	0x00800000L  /* new for V36	*/
/* for getting help key report during menu session	*/
#define IDCMP_MENUHELP		0x01000000L  /* new for V36	*/
/* for notification of any move/size/zoom/change window		*/
#define IDCMP_CHANGEWINDOW	0x02000000L  /* new for V36	*/
#define IDCMP_GADGETHELP	0x04000000L  /* new for V39	*/

/* NOTEZ-BIEN:				0x80000000 is reserved for internal use   */

/* the IDCMP Flags do not use this special bit, which is cleared when
 * Intuition sends its special message to the Task, and set when Intuition
 * gets its Message back from the Task.  Therefore, I can check here to
 * find out fast whether or not this Message is available for me to send
 */
#define IDCMP_LONELYMESSAGE	0x80000000L


/* --- IDCMP Codes -------------------------------------------------------- */
/* This group of codes is for the IDCMP_CHANGEWINDOW message */
#define CWCODE_MOVESIZE	0x0000	/* Window was moved and/or sized */
#define CWCODE_DEPTH	0x0001	/* Window was depth-arranged (new for V39) */

/* This group of codes is for the IDCMP_MENUVERIFY message */
#define MENUHOT		0x0001	/* IntuiWants verification or MENUCANCEL    */
#define MENUCANCEL	0x0002	/* HOT Reply of this cancels Menu operation */
#define MENUWAITING	0x0003	/* Intuition simply wants a ReplyMsg() ASAP */

/* These are internal tokens to represent state of verification attempts
 * shown here as a clue.
 */
#define OKOK		MENUHOT	/* guy didn't care			*/
#define OKABORT		0x0004	/* window rendered question moot	*/
#define OKCANCEL	MENUCANCEL /* window sent cancel reply		*/

/* This group of codes is for the IDCMP_WBENCHMESSAGE messages */
#define WBENCHOPEN	0x0001
#define WBENCHCLOSE	0x0002


/* A data structure common in V36 Intuition processing	*/
struct IBox
{
    WORD Left;
    WORD Top;
    WORD Width;
    WORD Height;
};



/* ======================================================================== */
/* === Window ============================================================= */
/* ======================================================================== */
struct Window
{
    struct Window *NextWindow;		/* for the linked list in a screen */

    WORD LeftEdge, TopEdge;		/* screen dimensions of window */
    WORD Width, Height;			/* screen dimensions of window */

    WORD MouseY, MouseX;		/* relative to upper-left of window */

    WORD MinWidth, MinHeight;		/* minimum sizes */
    UWORD MaxWidth, MaxHeight;		/* maximum sizes */

    ULONG Flags;			/* see below for defines */

    struct Menu *MenuStrip;		/* the strip of Menu headers */

    UBYTE *Title;			/* the title text for this window */

    struct Requester *FirstRequest;	/* all active Requesters */

    struct Requester *DMRequest;	/* double-click Requester */

    WORD ReqCount;			/* count of reqs blocking Window */

    struct Screen *WScreen;		/* this Window's Screen */
    struct RastPort *RPort;		/* this Window's very own RastPort */

    /* the border variables describe the window border.  If you specify
     * WFLG_GIMMEZEROZERO when you open the window, then the upper-left of
     * the ClipRect for this window will be upper-left of the BitMap (with
     * correct offsets when in SuperBitMap mode; you MUST select
     * WFLG_GIMMEZEROZERO when using SuperBitMap).  If you don't specify
     * ZeroZero, then you save memory (no allocation of RastPort, Layer,
     * ClipRect and associated Bitmaps), but you also must offset all your
     * writes by BorderTop, BorderLeft and do your own mini-clipping to
     * prevent writing over the system gadgets
     */
    BYTE BorderLeft, BorderTop, BorderRight, BorderBottom;
    struct RastPort *BorderRPort;


    /* You supply a linked-list of Gadgets for your Window.
     * This list DOES NOT include system gadgets.  You get the standard
     * window system gadgets by setting flag-bits in the variable Flags (see
     * the bit definitions below)
     */
    struct Gadget *FirstGadget;

    /* these are for opening/closing the windows */
    struct Window *Parent, *Descendant;

    /* sprite data information for your own Pointer
     * set these AFTER you Open the Window by calling SetPointer()
     */
    UWORD *Pointer;	/* sprite data */
    BYTE PtrHeight;	/* sprite height (not including sprite padding) */
    BYTE PtrWidth;	/* sprite width (must be less than or equal to 16) */
    BYTE XOffset, YOffset;	/* sprite offsets */

    /* the IDCMP Flags and User's and Intuition's Message Ports */
    ULONG IDCMPFlags;	/* User-selected flags */
    struct MsgPort *UserPort, *WindowPort;
    struct IntuiMessage *MessageKey;

    UBYTE DetailPen, BlockPen;	/* for bar/border/gadget rendering */

    /* the CheckMark is a pointer to the imagery that will be used when
     * rendering MenuItems of this Window that want to be checkmarked
     * if this is equal to NULL, you'll get the default imagery
     */
    struct Image *CheckMark;

    UBYTE *ScreenTitle;	/* if non-null, Screen title when Window is active */

    /* These variables have the mouse coordinates relative to the
     * inner-Window of WFLG_GIMMEZEROZERO Windows.  This is compared with the
     * MouseX and MouseY variables, which contain the mouse coordinates
     * relative to the upper-left corner of the Window, WFLG_GIMMEZEROZERO
     * notwithstanding
     */
    WORD GZZMouseX;
    WORD GZZMouseY;
    /* these variables contain the width and height of the inner-Window of
     * WFLG_GIMMEZEROZERO Windows
     */
    WORD GZZWidth;
    WORD GZZHeight;

    UBYTE *ExtData;

    BYTE *UserData;	/* general-purpose pointer to User data extension */

    /** 11/18/85: this pointer keeps a duplicate of what
     * Window.RPort->Layer is _supposed_ to be pointing at
     */
    struct Layer *WLayer;

    /* NEW 1.2: need to keep track of the font that
     * OpenWindow opened, in case user SetFont's into RastPort
     */
    struct TextFont *IFont;

    /* (V36) another flag word (the Flags field is used up).
     * At present, all flag values are system private.
     * Until further notice, you may not change nor use this field.
     */
    ULONG	MoreFlags;

    /**** Data beyond this point are Intuition Private.  DO NOT USE ****/
};


/* --- Flags requested at OpenWindow() time by the application --------- */
#define WFLG_SIZEGADGET	    0x00000001L	/* include sizing system-gadget? */
#define WFLG_DRAGBAR	    0x00000002L	/* include dragging system-gadget? */
#define WFLG_DEPTHGADGET    0x00000004L	/* include depth arrangement gadget? */
#define WFLG_CLOSEGADGET    0x00000008L	/* include close-box system-gadget? */

#define WFLG_SIZEBRIGHT	    0x00000010L	/* size gadget uses right border */
#define WFLG_SIZEBBOTTOM    0x00000020L	/* size gadget uses bottom border */

/* --- refresh modes ------------------------------------------------------ */
/* combinations of the WFLG_REFRESHBITS select the refresh type */
#define WFLG_REFRESHBITS    0x000000C0L
#define WFLG_SMART_REFRESH  0x00000000L
#define WFLG_SIMPLE_REFRESH 0x00000040L
#define WFLG_SUPER_BITMAP   0x00000080L
#define WFLG_OTHER_REFRESH  0x000000C0L

#define WFLG_BACKDROP	    0x00000100L	/* this is a backdrop window */

#define WFLG_REPORTMOUSE    0x00000200L	/* to hear about every mouse move */

#define WFLG_GIMMEZEROZERO  0x00000400L	/* a GimmeZeroZero window	*/

#define WFLG_BORDERLESS	    0x00000800L	/* to get a Window sans border */

#define WFLG_ACTIVATE	    0x00001000L	/* when Window opens, it's Active */

/* --- Other User Flags --------------------------------------------------- */
#define WFLG_RMBTRAP	    0x00010000L	/* Catch RMB events for your own */
#define WFLG_NOCAREREFRESH  0x00020000L	/* not to be bothered with REFRESH */

/* - V36 new Flags which the programmer may specify in NewWindow.Flags	*/
#define WFLG_NW_EXTENDED    0x00040000L	/* extension data provided	*/
					/* see struct ExtNewWindow	*/

/* - V39 new Flags which the programmer may specify in NewWindow.Flags	*/
#define WFLG_NEWLOOKMENUS   0x00200000L	/* window has NewLook menus	*/


/* These flags are set only by Intuition.  YOU MAY NOT SET THEM YOURSELF! */
#define WFLG_WINDOWACTIVE   0x00002000L	/* this window is the active one */
#define WFLG_INREQUEST	    0x00004000L	/* this window is in request mode */
#define WFLG_MENUSTATE	    0x00008000L	/* Window is active with Menus on */
#define WFLG_WINDOWREFRESH  0x01000000L	/* Window is currently refreshing */
#define WFLG_WBENCHWINDOW   0x02000000L	/* WorkBench tool ONLY Window */
#define WFLG_WINDOWTICKED   0x04000000L	/* only one timer tick at a time */

/* V36 and higher flags to be set only by Intuition: */
#define WFLG_VISITOR	    0x08000000L	/* visitor window		*/
#define WFLG_ZOOMED	    0x10000000L	/* identifies "zoom state"	*/
#define WFLG_HASZOOM	    0x20000000L	/* window has a zoom gadget	*/


/* --- Other Window Values ---------------------------------------------- */
#define DEFAULTMOUSEQUEUE	(5)	/* no more mouse messages	*/

/* --- see struct IntuiMessage for the IDCMP Flag definitions ------------- */


/* ======================================================================== */
/* === NewWindow ========================================================== */
/* ======================================================================== */
/*
 * Note that the new extension fields have been removed.  Use ExtNewWindow
 * structure below to make use of these fields
 */
struct NewWindow
{
    WORD LeftEdge, TopEdge;		/* screen dimensions of window */
    WORD Width, Height;			/* screen dimensions of window */

    UBYTE DetailPen, BlockPen;		/* for bar/border/gadget rendering */

    ULONG IDCMPFlags;			/* User-selected IDCMP flags */

    ULONG Flags;			/* see Window struct for defines */

    /* You supply a linked-list of Gadgets for your Window.
     *	This list DOES NOT include system Gadgets.  You get the standard
     *	system Window Gadgets by setting flag-bits in the variable Flags (see
     *	the bit definitions under the Window structure definition)
     */
    struct Gadget *FirstGadget;

    /* the CheckMark is a pointer to the imagery that will be used when
     * rendering MenuItems of this Window that want to be checkmarked
     * if this is equal to NULL, you'll get the default imagery
     */
    struct Image *CheckMark;

    UBYTE *Title;			  /* the title text for this window */

    /* the Screen pointer is used only if you've defined a CUSTOMSCREEN and
     * want this Window to open in it.	If so, you pass the address of the
     * Custom Screen structure in this variable.  Otherwise, this variable
     * is ignored and doesn't have to be initialized.
     */
    struct Screen *Screen;

    /* WFLG_SUPER_BITMAP Window?  If so, put the address of your BitMap
     * structure in this variable.  If not, this variable is ignored and
     * doesn't have to be initialized
     */
    struct BitMap *BitMap;

    /* the values describe the minimum and maximum sizes of your Windows.
     * these matter only if you've chosen the WFLG_SIZEGADGET option,
     * which means that you want to let the User to change the size of
     * this Window.  You describe the minimum and maximum sizes that the
     * Window can grow by setting these variables.  You can initialize
     * any one these to zero, which will mean that you want to duplicate
     * the setting for that dimension (if MinWidth == 0, MinWidth will be
     * set to the opening Width of the Window).
     * You can change these settings later using SetWindowLimits().
     * If you haven't asked for a SIZING Gadget, you don't have to
     * initialize any of these variables.
     */
    WORD MinWidth, MinHeight;	    /* minimums */
    UWORD MaxWidth, MaxHeight;	     /* maximums */

    /* the type variable describes the Screen in which you want this Window to
     * open.  The type value can either be CUSTOMSCREEN or one of the
     * system standard Screen Types such as WBENCHSCREEN.  See the
     * type definitions under the Screen structure.
     */
    UWORD Type;

};

/* The following structure is the future NewWindow.  Compatibility
 * issues require that the size of NewWindow not change.
 * Data in the common part (NewWindow) indicates the the extension
 * fields are being used.
 * NOTE WELL: This structure may be subject to future extension.
 * Writing code depending on its size is not allowed.
 */
struct ExtNewWindow
{
    WORD LeftEdge, TopEdge;
    WORD Width, Height;

    UBYTE DetailPen, BlockPen;
    ULONG IDCMPFlags;
    ULONG Flags;
    struct Gadget *FirstGadget;

    struct Image *CheckMark;

    UBYTE *Title;
    struct Screen *Screen;
    struct BitMap *BitMap;

    WORD MinWidth, MinHeight;
    UWORD MaxWidth, MaxHeight;

    /* the type variable describes the Screen in which you want this Window to
     * open.  The type value can either be CUSTOMSCREEN or one of the
     * system standard Screen Types such as WBENCHSCREEN.  See the
     * type definitions under the Screen structure.
     * A new possible value for this field is PUBLICSCREEN, which
     * defines the window as a 'visitor' window.  See below for
     * additional information provided.
     */
    UWORD Type;

    /* ------------------------------------------------------- *
     * extensions for V36
     * if the NewWindow Flag value WFLG_NW_EXTENDED is set, then
     * this field is assumed to point to an array ( or chain of arrays)
     * of TagItem structures.  See also ExtNewScreen for another
     * use of TagItems to pass optional data.
     *
     * see below for tag values and the corresponding data.
     */
    struct TagItem	*Extension;
};

/*
 * The TagItem ID's (ti_Tag values) for OpenWindowTagList() follow.
 * They are values in a TagItem array passed as extension/replacement
 * values for the data in NewWindow.  OpenWindowTagList() can actually
 * work well with a NULL NewWindow pointer.
 */

#define WA_Dummy	(TAG_USER + 99)	/* 0x80000063	*/

/* these tags simply override NewWindow parameters */
#define WA_Left			(WA_Dummy + 0x01)
#define WA_Top			(WA_Dummy + 0x02)
#define WA_Width		(WA_Dummy + 0x03)
#define WA_Height		(WA_Dummy + 0x04)
#define WA_DetailPen		(WA_Dummy + 0x05)
#define WA_BlockPen		(WA_Dummy + 0x06)
#define WA_IDCMP		(WA_Dummy + 0x07)
			/* "bulk" initialization of NewWindow.Flags */
#define WA_Flags		(WA_Dummy + 0x08)
#define WA_Gadgets		(WA_Dummy + 0x09)
#define WA_Checkmark		(WA_Dummy + 0x0A)
#define WA_Title		(WA_Dummy + 0x0B)
			/* means you don't have to call SetWindowTitles
			 * after you open your window
			 */
#define WA_ScreenTitle		(WA_Dummy + 0x0C)
#define WA_CustomScreen		(WA_Dummy + 0x0D)
#define WA_SuperBitMap		(WA_Dummy + 0x0E)
			/* also implies WFLG_SUPER_BITMAP property	*/
#define WA_MinWidth		(WA_Dummy + 0x0F)
#define WA_MinHeight		(WA_Dummy + 0x10)
#define WA_MaxWidth		(WA_Dummy + 0x11)
#define WA_MaxHeight		(WA_Dummy + 0x12)

/* The following are specifications for new features	*/

#define WA_InnerWidth		(WA_Dummy + 0x13)
#define WA_InnerHeight		(WA_Dummy + 0x14)
			/* You can specify the dimensions of the interior
			 * region of your window, independent of what
			 * the border widths will be.  You probably want
			 * to also specify WA_AutoAdjust to allow
			 * Intuition to move your window or even
			 * shrink it so that it is completely on screen.
			 */

#define WA_PubScreenName	(WA_Dummy + 0x15)
			/* declares that you want the window to open as
			 * a visitor on the public screen whose name is
			 * pointed to by (UBYTE *) ti_Data
			 */
#define WA_PubScreen		(WA_Dummy + 0x16)
			/* open as a visitor window on the public screen
			 * whose address is in (struct Screen *) ti_Data.
			 * To ensure that this screen remains open, you
			 * should either be the screen's owner, have a
			 * window open on the screen, or use LockPubScreen().
			 */
#define WA_PubScreenFallBack	(WA_Dummy + 0x17)
			/* A Boolean, specifies whether a visitor window
			 * should "fall back" to the default public screen
			 * (or Workbench) if the named public screen isn't
			 * available
			 */
#define WA_WindowName		(WA_Dummy + 0x18)
			/* not implemented	*/
#define WA_Colors		(WA_Dummy + 0x19)
			/* a ColorSpec array for colors to be set
			 * when this window is active.	This is not
			 * implemented, and may not be, since the default
			 * values to restore would be hard to track.
			 * We'd like to at least support per-window colors
			 * for the mouse pointer sprite.
			 */
#define WA_Zoom		(WA_Dummy + 0x1A)
			/* ti_Data points to an array of four WORD's,
			 * the initial Left/Top/Width/Height values of
			 * the "alternate" zoom position/dimensions.
			 * It also specifies that you want a Zoom gadget
			 * for your window, whether or not you have a
			 * sizing gadget.
			 */
#define WA_MouseQueue		(WA_Dummy + 0x1B)
			/* ti_Data contains initial value for the mouse
			 * message backlog limit for this window.
			 */
#define WA_BackFill		(WA_Dummy + 0x1C)
			/* provides a "backfill hook" for your window's Layer.
			 * See layers.library/CreateUpfrontHookLayer().
			 */
#define WA_RptQueue		(WA_Dummy + 0x1D)
			/* initial value of repeat key backlog limit	*/

    /* These Boolean tag items are alternatives to the NewWindow.Flags
     * boolean flags with similar names.
     */
#define WA_SizeGadget		(WA_Dummy + 0x1E)
#define WA_DragBar		(WA_Dummy + 0x1F)
#define WA_DepthGadget		(WA_Dummy + 0x20)
#define WA_CloseGadget		(WA_Dummy + 0x21)
#define WA_Backdrop		(WA_Dummy + 0x22)
#define WA_ReportMouse		(WA_Dummy + 0x23)
#define WA_NoCareRefresh	(WA_Dummy + 0x24)
#define WA_Borderless		(WA_Dummy + 0x25)
#define WA_Activate		(WA_Dummy + 0x26)
#define WA_RMBTrap		(WA_Dummy + 0x27)
#define WA_WBenchWindow		(WA_Dummy + 0x28)	/* PRIVATE!! */
#define WA_SimpleRefresh	(WA_Dummy + 0x29)
			/* only specify if TRUE	*/
#define WA_SmartRefresh		(WA_Dummy + 0x2A)
			/* only specify if TRUE	*/
#define WA_SizeBRight		(WA_Dummy + 0x2B)
#define WA_SizeBBottom		(WA_Dummy + 0x2C)

    /* New Boolean properties	*/
#define WA_AutoAdjust		(WA_Dummy + 0x2D)
			/* shift or squeeze the window's position and
			 * dimensions to fit it on screen.
			 */

#define WA_GimmeZeroZero	(WA_Dummy + 0x2E)
			/* equiv. to NewWindow.Flags WFLG_GIMMEZEROZERO	*/

/* New for V37: WA_MenuHelp (ignored by V36) */
#define WA_MenuHelp		(WA_Dummy + 0x2F)
			/* Enables IDCMP_MENUHELP:  Pressing HELP during menus
			 * will return IDCMP_MENUHELP message.
			 */

/* New for V39:  (ignored by V37 and earlier) */
#define WA_NewLookMenus		(WA_Dummy + 0x30)
			/* Set to TRUE if you want NewLook menus */
#define WA_AmigaKey		(WA_Dummy + 0x31)
			/* Pointer to image for Amiga-key equiv in menus */
#define WA_NotifyDepth		(WA_Dummy + 0x32)
			/* Requests IDCMP_CHANGEWINDOW message when
			 * window is depth arranged
			 * (imsg->Code = CWCODE_DEPTH)
			 */

/* WA_Dummy + 0x33 is obsolete */

#define WA_Pointer		(WA_Dummy + 0x34)
			/* Allows you to specify a custom pointer
			 * for your window.  ti_Data points to a
			 * pointer object you obtained via
			 * "pointerclass". NULL signifies the
			 * default pointer.
			 * This tag may be passed to OpenWindowTags()
			 * or SetWindowPointer().
			 */

#define WA_BusyPointer		(WA_Dummy + 0x35)
			/* ti_Data is boolean.	Set to TRUE to
			 * request the standard busy pointer.
			 * This tag may be passed to OpenWindowTags()
			 * or SetWindowPointer().
			 */

#define WA_PointerDelay		(WA_Dummy + 0x36)
			/* ti_Data is boolean.	Set to TRUE to
			 * request that the changing of the
			 * pointer be slightly delayed.  The change
			 * will be called off if you call NewSetPointer()
			 * before the delay expires.  This allows
			 * you to post a busy-pointer even if you think
			 * the busy-time may be very short, without
			 * fear of a flashing pointer.
			 * This tag may be passed to OpenWindowTags()
			 * or SetWindowPointer().
			 */

#define WA_TabletMessages	(WA_Dummy + 0x37)
			/* ti_Data is a boolean.  Set to TRUE to
			 * request that tablet information be included
			 * in IntuiMessages sent to your window.
			 * Requires that something (i.e. a tablet driver)
			 * feed IESUBCLASS_NEWTABLET InputEvents into
			 * the system.	For a pointer to the TabletData,
			 * examine the ExtIntuiMessage->eim_TabletData
			 * field.  It is UNSAFE to check this field
			 * when running on pre-V39 systems.  It's always
			 * safe to check this field under V39 and up,
			 * though it may be NULL.
			 */

#define WA_HelpGroup		(WA_Dummy + 0x38)
			/* When the active window has gadget help enabled,
			 * other windows of the same HelpGroup number
			 * will also get GadgetHelp.  This allows GadgetHelp
			 * to work for multi-windowed applications.
			 * Use GetGroupID() to get an ID number.  Pass
			 * this number as ti_Data to all your windows.
			 * See also the HelpControl() function.
			 */

#define WA_HelpGroupWindow	(WA_Dummy + 0x39)
			/* When the active window has gadget help enabled,
			 * other windows of the same HelpGroup will also get
			 * GadgetHelp.	This allows GadgetHelp to work
			 * for multi-windowed applications.  As an alternative
			 * to WA_HelpGroup, you can pass a pointer to any
			 * other window of the same group to join its help
			 * group.  Defaults to NULL, which has no effect.
			 * See also the HelpControl() function.
			 */


/* HelpControl() flags:
 *
 * HC_GADGETHELP - Set this flag to enable Gadget-Help for one or more
 * windows.
 */

#define HC_GADGETHELP	(1)


#ifndef INTUITION_SCREENS_H
#include <intuition/screens.h>
#endif

#ifndef INTUITION_PREFERENCES_H
#include <intuition/preferences.h>
#endif

/* ======================================================================== */
/* === Remember =========================================================== */
/* ======================================================================== */
/* this structure is used for remembering what memory has been allocated to
 * date by a given routine, so that a premature abort or systematic exit
 * can deallocate memory cleanly, easily, and completely
 */
struct Remember
{
    struct Remember *NextRemember;
    ULONG RememberSize;
    UBYTE *Memory;
};


/* === Color Spec ====================================================== */
/* How to tell Intuition about RGB values for a color table entry.
 * NOTE:  The way the structure was defined, the color value was
 * right-justified within each UWORD.  This poses problems for
 * extensibility to more bits-per-gun.	The SA_Colors32 tag to
 * OpenScreenTags() provides an alternate way to specify colors
 * with greater precision.
 */
struct ColorSpec
{
    WORD	ColorIndex;	/* -1 terminates an array of ColorSpec	*/
    UWORD	Red;	/* only the _bottom_ 4 bits recognized */
    UWORD	Green;	/* only the _bottom_ 4 bits recognized */
    UWORD	Blue;	/* only the _bottom_ 4 bits recognized */
};

/* === Easy Requester Specification ======================================= */
/* see also autodocs for EasyRequest and BuildEasyRequest	*/
/* NOTE: This structure may grow in size in the future		*/
struct EasyStruct {
    ULONG	es_StructSize;	/* should be sizeof (struct EasyStruct )*/
    ULONG	es_Flags;	/* should be 0 for now			*/
    UBYTE	*es_Title;	/* title of requester window		*/
    UBYTE	*es_TextFormat;	/* 'printf' style formatting string	*/
    UBYTE	*es_GadgetFormat; /* 'printf' style formatting string	*/
};



/* ======================================================================== */
/* === Miscellaneous ====================================================== */
/* ======================================================================== */

/* = MACROS ============================================================== */
#define MENUNUM(n) (n & 0x1F)
#define ITEMNUM(n) ((n >> 5) & 0x003F)
#define SUBNUM(n) ((n >> 11) & 0x001F)

#define SHIFTMENU(n) (n & 0x1F)
#define SHIFTITEM(n) ((n & 0x3F) << 5)
#define SHIFTSUB(n) ((n & 0x1F) << 11)

#define FULLMENUNUM( menu, item, sub )	\
	( SHIFTSUB(sub) | SHIFTITEM(item) | SHIFTMENU(menu) )

#define SRBNUM(n)    (0x08 - (n >> 4))	/* SerRWBits -> read bits per char */
#define SWBNUM(n)    (0x08 - (n & 0x0F))/* SerRWBits -> write bits per chr */
#define SSBNUM(n)    (0x01 + (n >> 4))	/* SerStopBuf -> stop bits per chr */
#define SPARNUM(n)   (n >> 4)		/* SerParShk -> parity setting	  */
#define SHAKNUM(n)   (n & 0x0F)	/* SerParShk -> handshake mode	  */


/* = MENU STUFF =========================================================== */
#define NOMENU 0x001F
#define NOITEM 0x003F
#define NOSUB  0x001F
#define MENUNULL 0xFFFF


/* = =RJ='s peculiarities ================================================= */
#define FOREVER for(;;)
#define SIGN(x) ( ((x) > 0) - ((x) < 0) )
#define NOT !

/* these defines are for the COMMSEQ and CHECKIT menu stuff.  If CHECKIT,
 * I'll use a generic Width (for all resolutions) for the CheckMark.
 * If COMMSEQ, likewise I'll use this generic stuff
 */
#define CHECKWIDTH	19
#define COMMWIDTH	27
#define LOWCHECKWIDTH	13
#define LOWCOMMWIDTH	16


/* these are the AlertNumber defines.  if you are calling DisplayAlert()
 * the AlertNumber you supply must have the ALERT_TYPE bits set to one
 * of these patterns
 */
#define ALERT_TYPE	0x80000000L
#define RECOVERY_ALERT	0x00000000L	/* the system can recover from this */
#define DEADEND_ALERT	0x80000000L	/* no recovery possible, this is it */


/* When you're defining IntuiText for the Positive and Negative Gadgets
 * created by a call to AutoRequest(), these defines will get you
 * reasonable-looking text.  The only field without a define is the IText
 * field; you decide what text goes with the Gadget
 */
#define AUTOFRONTPEN	0
#define AUTOBACKPEN	1
#define AUTODRAWMODE	JAM2
#define AUTOLEFTEDGE	6
#define AUTOTOPEDGE	3
#define AUTOITEXTFONT	NULL
#define AUTONEXTTEXT	NULL


/* --- RAWMOUSE Codes and Qualifiers (Console OR IDCMP) ------------------- */
#define SELECTUP	(IECODE_LBUTTON | IECODE_UP_PREFIX)
#define SELECTDOWN	(IECODE_LBUTTON)
#define MENUUP		(IECODE_RBUTTON | IECODE_UP_PREFIX)
#define MENUDOWN	(IECODE_RBUTTON)
#define MIDDLEUP	(IECODE_MBUTTON | IECODE_UP_PREFIX)
#define MIDDLEDOWN	(IECODE_MBUTTON)
#define ALTLEFT		(IEQUALIFIER_LALT)
#define ALTRIGHT	(IEQUALIFIER_RALT)
#define AMIGALEFT	(IEQUALIFIER_LCOMMAND)
#define AMIGARIGHT	(IEQUALIFIER_RCOMMAND)
#define AMIGAKEYS	(AMIGALEFT | AMIGARIGHT)

#define CURSORUP	0x4C
#define CURSORLEFT	0x4F
#define CURSORRIGHT	0x4E
#define CURSORDOWN	0x4D
#define KEYCODE_Q	0x10
#define KEYCODE_Z	0x31
#define KEYCODE_X	0x32
#define KEYCODE_V	0x34
#define KEYCODE_B	0x35
#define KEYCODE_N	0x36
#define KEYCODE_M	0x37
#define KEYCODE_LESS	0x38
#define KEYCODE_GREATER 0x39



/* New for V39, Intuition supports the IESUBCLASS_NEWTABLET subclass
 * of the IECLASS_NEWPOINTERPOS event.	The ie_EventAddress of such
 * an event points to a TabletData structure (see below).
 *
 * The TabletData structure contains certain elements including a taglist.
 * The taglist can be used for special tablet parameters.  A tablet driver
 * should include only those tag-items the tablet supports.  An application
 * can listen for any tag-items that interest it.  Note: an application
 * must set the WA_TabletMessages attribute to TRUE to receive this
 * extended information in its IntuiMessages.
 *
 * The definitions given here MUST be followed.  Pay careful attention
 * to normalization and the interpretation of signs.
 *
 * TABLETA_TabletZ:  the current value of the tablet in the Z direction.
 * This unsigned value should typically be in the natural units of the
 * tablet.  You should also provide TABLETA_RangeZ.
 *
 * TABLETA_RangeZ:  the maximum value of the tablet in the Z direction.
 * Normally specified along with TABLETA_TabletZ, this allows the
 * application to scale the actual Z value across its range.
 *
 * TABLETA_AngleX:  the angle of rotation or tilt about the X-axis.  This
 * number should be normalized to fill a signed long integer.  Positive
 * values imply a clockwise rotation about the X-axis when viewing
 * from +X towards the origin.
 *
 * TABLETA_AngleY:  the angle of rotation or tilt about the Y-axis.  This
 * number should be normalized to fill a signed long integer.  Positive
 * values imply a clockwise rotation about the Y-axis when viewing
 * from +Y towards the origin.
 *
 * TABLETA_AngleZ:  the angle of rotation or tilt about the Z axis.  This
 * number should be normalized to fill a signed long integer.  Positive
 * values imply a clockwise rotation about the Z-axis when viewing
 * from +Z towards the origin.
 *
 *	Note: a stylus that supports tilt should use the TABLETA_AngleX
 *	and TABLETA_AngleY attributes.	Tilting the stylus so the tip
 *	points towards increasing or decreasing X is actually a rotation
 *	around the Y-axis.  Thus, if the stylus tip points towards
 *	positive X, then that tilt is represented as a negative
 *	TABLETA_AngleY.  Likewise, if the stylus tip points towards
 *	positive Y, that tilt is represented by positive TABLETA_AngleX.
 *
 * TABLETA_Pressure:  the pressure reading of the stylus.  The pressure
 * should be normalized to fill a signed long integer.	Typical devices
 * won't generate negative pressure, but the possibility is not precluded.
 * The pressure threshold which is considered to cause a button-click is
 * expected to be set in a Preferences program supplied by the tablet
 * vendor.  The tablet driver would send IECODE_LBUTTON-type events as
 * the pressure crossed that threshold.
 *
 * TABLETA_ButtonBits:	ti_Data is a long integer whose bits are to
 * be interpreted at the state of the first 32 buttons of the tablet.
 *
 * TABLETA_InProximity:  ti_Data is a boolean.	For tablets that support
 * proximity, they should send the {TABLETA_InProximity,FALSE} tag item
 * when the stylus is out of proximity.  One possible use we can forsee
 * is a mouse-blanking commodity which keys off this to blank the
 * mouse.  When this tag is absent, the stylus is assumed to be
 * in proximity.
 *
 * TABLETA_ResolutionX:  ti_Data is an unsigned long integer which
 * is the x-axis resolution in dots per inch.
 *
 * TABLETA_ResolutionY:  ti_Data is an unsigned long integer which
 * is the y-axis resolution in dots per inch.
 */

#define TABLETA_Dummy		(TAG_USER + 0x3A000)
#define TABLETA_TabletZ		(TABLETA_Dummy + 0x01)
#define TABLETA_RangeZ		(TABLETA_Dummy + 0x02)
#define TABLETA_AngleX		(TABLETA_Dummy + 0x03)
#define TABLETA_AngleY		(TABLETA_Dummy + 0x04)
#define TABLETA_AngleZ		(TABLETA_Dummy + 0x05)
#define TABLETA_Pressure	(TABLETA_Dummy + 0x06)
#define TABLETA_ButtonBits	(TABLETA_Dummy + 0x07)
#define TABLETA_InProximity	(TABLETA_Dummy + 0x08)
#define TABLETA_ResolutionX	(TABLETA_Dummy + 0x09)
#define TABLETA_ResolutionY	(TABLETA_Dummy + 0x0A)

/* If your window sets WA_TabletMessages to TRUE, then it will receive
 * extended IntuiMessages (struct ExtIntuiMessage) whose eim_TabletData
 * field points at a TabletData structure.  This structure contains
 * additional information about the input event.
 */

struct TabletData
{
    /* Sub-pixel position of tablet, in screen coordinates,
     * scaled to fill a UWORD fraction:
     */
    UWORD td_XFraction, td_YFraction;

    /* Current tablet coordinates along each axis: */
    ULONG td_TabletX, td_TabletY;

    /* Tablet range along each axis.  For example, if td_TabletX
     * can take values 0-999, td_RangeX should be 1000.
     */
    ULONG td_RangeX, td_RangeY;

    /* Pointer to tag-list of additional tablet attributes.
     * See <intuition/intuition.h> for the tag values.
     */
    struct TagItem *td_TagList;
};

/* If a tablet driver supplies a hook for ient_CallBack, it will be
 * invoked in the standard hook manner.  A0 will point to the Hook
 * itself, A2 will point to the InputEvent that was sent, and
 * A1 will point to a TabletHookData structure.  The InputEvent's
 * ie_EventAddress field points at the IENewTablet structure that
 * the driver supplied.
 *
 * Based on the thd_Screen, thd_Width, and thd_Height fields, the driver
 * should scale the ient_TabletX and ient_TabletY fields and store the
 * result in ient_ScaledX, ient_ScaledY, ient_ScaledXFraction, and
 * ient_ScaledYFraction.
 *
 * The tablet hook must currently return NULL.	This is the only
 * acceptable return-value under V39.
 */

struct TabletHookData
{
    /* Pointer to the active screen:
     * Note: if there are no open screens, thd_Screen will be NULL.
     * thd_Width and thd_Height will then describe an NTSC 640x400
     * screen.	Please scale accordingly.
     */
    struct Screen *thd_Screen;

    /* The width and height (measured in pixels of the active screen)
     * that your are to scale to:
     */
    ULONG thd_Width;
    ULONG thd_Height;

    /* Non-zero if the screen or something about the screen
     * changed since the last time you were invoked:
     */
    LONG thd_ScreenChanged;
};

/* Include obsolete identifiers: */
#ifndef INTUITION_IOBSOLETE_H
#include <intuition/iobsolete.h>
#endif

#endif
