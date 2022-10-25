#ifndef LIBRARIES_GADTOOLS_H
#define LIBRARIES_GADTOOLS_H
/*
**	$VER: gadtools.h 39.9 (19.8.1992)
**	Includes Release 45.1
**
**	gadtools.library definitions
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*------------------------------------------------------------------------*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

#ifndef INTUITION_GADGETCLASS_H
#include <intuition/gadgetclass.h>
#endif

/*------------------------------------------------------------------------*/

/* The kinds (almost classes) of gadgets that GadTools supports.
 * Use these identifiers when calling CreateGadgetA()
 */

#define GENERIC_KIND	0
#define BUTTON_KIND	1
#define CHECKBOX_KIND	2
#define INTEGER_KIND	3
#define LISTVIEW_KIND	4
#define MX_KIND		5
#define NUMBER_KIND	6
#define CYCLE_KIND	7
#define PALETTE_KIND	8
#define SCROLLER_KIND	9
/* Kind number 10 is reserved */
#define SLIDER_KIND	11
#define STRING_KIND	12
#define TEXT_KIND	13

#define NUM_KINDS	14

/*------------------------------------------------------------------------*/

/* 'Or' the appropriate set together for your Window IDCMPFlags: */

#define ARROWIDCMP	(IDCMP_GADGETUP | IDCMP_GADGETDOWN |\
	IDCMP_INTUITICKS | IDCMP_MOUSEBUTTONS)

#define BUTTONIDCMP	(IDCMP_GADGETUP)
#define CHECKBOXIDCMP	(IDCMP_GADGETUP)
#define INTEGERIDCMP	(IDCMP_GADGETUP)
#define LISTVIEWIDCMP	(IDCMP_GADGETUP | IDCMP_GADGETDOWN |\
	IDCMP_MOUSEMOVE | ARROWIDCMP)

#define MXIDCMP		(IDCMP_GADGETDOWN)
#define NUMBERIDCMP	(0L)
#define CYCLEIDCMP	(IDCMP_GADGETUP)
#define PALETTEIDCMP	(IDCMP_GADGETUP)

/* Use ARROWIDCMP|SCROLLERIDCMP if your scrollers have arrows: */
#define SCROLLERIDCMP	(IDCMP_GADGETUP | IDCMP_GADGETDOWN | IDCMP_MOUSEMOVE)
#define SLIDERIDCMP	(IDCMP_GADGETUP | IDCMP_GADGETDOWN | IDCMP_MOUSEMOVE)
#define STRINGIDCMP	(IDCMP_GADGETUP)

#define TEXTIDCMP	(0L)

/*------------------------------------------------------------------------*/

/* Generic NewGadget used by several of the gadget classes: */

struct NewGadget
{
    WORD ng_LeftEdge, ng_TopEdge;	/* gadget position */
    WORD ng_Width, ng_Height;		/* gadget size */
    UBYTE *ng_GadgetText;		/* gadget label */
    struct TextAttr *ng_TextAttr;	/* desired font for gadget label */
    UWORD ng_GadgetID;			/* gadget ID */
    ULONG ng_Flags;			/* see below */
    APTR ng_VisualInfo;			/* Set to retval of GetVisualInfo() */
    APTR ng_UserData;			/* gadget UserData */
};


/* ng_Flags control certain aspects of the gadget.  The first five control
 * the placement of the descriptive text.  Each gadget kind has its default,
 * which is usually PLACETEXT_LEFT.  Consult the autodocs for details.
 */

#define PLACETEXT_LEFT	0x0001	/* Right-align text on left side */
#define PLACETEXT_RIGHT	0x0002	/* Left-align text on right side */
#define PLACETEXT_ABOVE	0x0004	/* Center text above */
#define PLACETEXT_BELOW	0x0008	/* Center text below */
#define PLACETEXT_IN	0x0010	/* Center text on */

#define NG_HIGHLABEL	0x0020	/* Highlight the label */


/*------------------------------------------------------------------------*/

/* Fill out an array of these and pass that to CreateMenus(): */

struct NewMenu
{
    UBYTE nm_Type;		/* See below */
    /* Compiler inserts a PAD byte here */
    STRPTR nm_Label;		/* Menu's label */
    STRPTR nm_CommKey;		/* MenuItem Command Key Equiv */
    UWORD nm_Flags;		/* Menu or MenuItem flags (see note) */
    LONG nm_MutualExclude;	/* MenuItem MutualExclude word */
    APTR nm_UserData;		/* For your own use, see note */
};

/* Needed only by inside IM_ definitions below */
#define MENU_IMAGE	128

/* nm_Type determines what each NewMenu structure corresponds to.
 * for the NM_TITLE, NM_ITEM, and NM_SUB values, nm_Label should
 * be a text string to use for that menu title, item, or sub-item.
 * For IM_ITEM or IM_SUB, set nm_Label to point at the Image structure
 * you wish to use for this item or sub-item.
 * NOTE: At present, you may only use conventional images.
 * Custom images created from Intuition image-classes do not work.
 */
#define NM_TITLE	1	/* Menu header */
#define NM_ITEM		2	/* Textual menu item */
#define NM_SUB		3	/* Textual menu sub-item */

#define IM_ITEM		(NM_ITEM|MENU_IMAGE)	/* Graphical menu item */
#define IM_SUB		(NM_SUB|MENU_IMAGE)	/* Graphical menu sub-item */

/* The NewMenu array should be terminated with a NewMenu whose
 * nm_Type equals NM_END.
 */
#define NM_END		0	/* End of NewMenu array */

/* Starting with V39, GadTools will skip any NewMenu entries whose
 * nm_Type field has the NM_IGNORE bit set.
 */
#define NM_IGNORE	64


/* nm_Label should be a text string for textual items, a pointer
 * to an Image structure for graphical menu items, or the special
 * constant NM_BARLABEL, to get a separator bar.
 */
#define NM_BARLABEL	((STRPTR)-1)

/* The nm_Flags field is used to fill out either the Menu->Flags or
 * MenuItem->Flags field.  Note that the sense of the MENUENABLED or
 * ITEMENABLED bit is inverted between this use and Intuition's use,
 * in other words, NewMenus are enabled by default.  The following
 * labels are provided to disable them:
 */
#define NM_MENUDISABLED	MENUENABLED
#define NM_ITEMDISABLED	ITEMENABLED

/* New for V39:  NM_COMMANDSTRING.  For a textual MenuItem or SubItem,
 * point nm_CommKey at an arbitrary string, and set the NM_COMMANDSTRING
 * flag.
 */
#define NM_COMMANDSTRING COMMSEQ

/* The following are pre-cleared (COMMSEQ, ITEMTEXT, and HIGHxxx are set
 * later as appropriate):
 * Under V39, the COMMSEQ flag bit is not cleared, since it now has
 * meaning.
 */
#define NM_FLAGMASK	(~(COMMSEQ | ITEMTEXT | HIGHFLAGS))
#define NM_FLAGMASK_V39	(~(ITEMTEXT | HIGHFLAGS))

/* You may choose among CHECKIT, MENUTOGGLE, and CHECKED.
 * Toggle-select menuitems are of type CHECKIT|MENUTOGGLE, along
 * with CHECKED if currently selected.	Mutually exclusive ones
 * are of type CHECKIT, and possibly CHECKED too.  The nm_MutualExclude
 * is a bit-wise representation of the items excluded by this one,
 * so in the simplest case (choose 1 among n), these flags would be
 * ~1, ~2, ~4, ~8, ~16, etc.  See the Intuition Menus chapter.
 */

/* A UserData pointer can be associated with each Menu and MenuItem structure.
 * The CreateMenus() call allocates space for a UserData after each
 * Menu or MenuItem (header, item or sub-item).  You should use the
 * GTMENU_USERDATA() or GTMENUITEM_USERDATA() macro to extract it.
 */

#define GTMENU_USERDATA(menu) (* ( (APTR *)(((struct Menu *)menu)+1) ) )
#define GTMENUITEM_USERDATA(menuitem) (* ( (APTR *)(((struct MenuItem *)menuitem)+1) ) )

/* Here is an old one for compatibility.  Do not use in new code! */
#define MENU_USERDATA(menuitem) (* ( (APTR *)(menuitem+1) ) )

/* These return codes can be obtained through the GTMN_SecondaryError tag */
#define GTMENU_TRIMMED	0x00000001	/* Too many menus, items, or subitems,
					 * menu has been trimmed down
					 */
#define GTMENU_INVALID	0x00000002	/* Invalid NewMenu array */
#define GTMENU_NOMEM	0x00000003	/* Out of memory */

/*------------------------------------------------------------------------*/

/* Starting with V39, checkboxes and mx gadgets can be scaled to your
 * specified gadget width/height.  Use the new GTCB_Scaled or GTMX_Scaled
 * tags, respectively.	Under V37, and by default in V39, the imagery
 * is of the following fixed size:
 */

/* MX gadget default dimensions: */
#define MX_WIDTH	17
#define MX_HEIGHT	9

/* Checkbox default dimensions: */
#define CHECKBOX_WIDTH	26
#define CHECKBOX_HEIGHT	11

/*------------------------------------------------------------------------*/

/* Tags for GadTools functions: */

#define GT_TagBase	     TAG_USER + 0x80000

#define GTVI_NewWindow	     GT_TagBase+1  /* Unused */
#define GTVI_NWTags	     GT_TagBase+2  /* Unused */

#define GT_Private0	     GT_TagBase+3  /* (private) */

#define GTCB_Checked	     GT_TagBase+4  /* State of checkbox */

#define GTLV_Top	     GT_TagBase+5  /* Top visible one in listview */
#define GTLV_Labels	     GT_TagBase+6  /* List to display in listview */
#define GTLV_ReadOnly	     GT_TagBase+7  /* TRUE if listview is to be
					    * read-only
					    */
#define GTLV_ScrollWidth     GT_TagBase+8  /* Width of scrollbar */

#define GTMX_Labels	     GT_TagBase+9  /* NULL-terminated array of labels */
#define GTMX_Active	     GT_TagBase+10 /* Active one in mx gadget */

#define GTTX_Text	     GT_TagBase+11 /* Text to display */
#define GTTX_CopyText	     GT_TagBase+12 /* Copy text label instead of
					    * referencing it
					    */

#define GTNM_Number	     GT_TagBase+13 /* Number to display */

#define GTCY_Labels	     GT_TagBase+14 /* NULL-terminated array of labels */
#define GTCY_Active	     GT_TagBase+15 /* The active one in the cycle gad */

#define GTPA_Depth	     GT_TagBase+16 /* Number of bitplanes in palette */
#define GTPA_Color	     GT_TagBase+17 /* Palette color */
#define GTPA_ColorOffset     GT_TagBase+18 /* First color to use in palette */
#define GTPA_IndicatorWidth  GT_TagBase+19 /* Width of current-color indicator */
#define GTPA_IndicatorHeight GT_TagBase+20 /* Height of current-color indicator */

#define GTSC_Top	     GT_TagBase+21 /* Top visible in scroller */
#define GTSC_Total	     GT_TagBase+22 /* Total in scroller area */
#define GTSC_Visible	     GT_TagBase+23 /* Number visible in scroller */
#define GTSC_Overlap	     GT_TagBase+24 /* Unused */

/*  GT_TagBase+25 through GT_TagBase+37 are reserved */

#define GTSL_Min	     GT_TagBase+38 /* Slider min value */
#define GTSL_Max	     GT_TagBase+39 /* Slider max value */
#define GTSL_Level	     GT_TagBase+40 /* Slider level */
#define GTSL_MaxLevelLen     GT_TagBase+41 /* Max length of printed level */
#define GTSL_LevelFormat     GT_TagBase+42 /* Format string for level */
#define GTSL_LevelPlace      GT_TagBase+43 /* Where level should be placed */
#define GTSL_DispFunc	     GT_TagBase+44 /* Callback for number calculation
					    * before display
					    */

#define GTST_String	     GT_TagBase+45 /* String gadget's displayed string */
#define GTST_MaxChars	     GT_TagBase+46 /* Max length of string */

#define GTIN_Number	     GT_TagBase+47 /* Number in integer gadget */
#define GTIN_MaxChars	     GT_TagBase+48 /* Max number of digits */

#define GTMN_TextAttr	     GT_TagBase+49 /* MenuItem font TextAttr */
#define GTMN_FrontPen	     GT_TagBase+50 /* MenuItem text pen color */

#define GTBB_Recessed	     GT_TagBase+51 /* Make BevelBox recessed */

#define GT_VisualInfo	     GT_TagBase+52 /* result of VisualInfo call */

#define GTLV_ShowSelected    GT_TagBase+53 /* show selected entry beneath
		* listview, set tag data = NULL for display-only, or pointer
		* to a string gadget you've created
		*/
#define GTLV_Selected	     GT_TagBase+54 /* Set ordinal number of selected
					    * entry in the list
					    */
#define GT_Reserved1	     GT_TagBase+56 /* Reserved for future use */

#define GTTX_Border	     GT_TagBase+57 /* Put a border around
					    * Text-display gadgets
					    */
#define GTNM_Border	     GT_TagBase+58 /* Put a border around
					    * Number-display gadgets
					    */

#define GTSC_Arrows	     GT_TagBase+59 /* Specify size of arrows for
					    * scroller
					    */

#define GTMN_Menu	     GT_TagBase+60 /* Pointer to Menu for use by
					    * LayoutMenuItems()
					    */
#define GTMX_Spacing	     GT_TagBase+61 /* Added to font height to
		* figure spacing between mx choices.  Use this instead
		* of LAYOUTA_SPACING for mx gadgets.
		*/

/* New to V37 GadTools.  Ignored by GadTools V36 */
#define GTMN_FullMenu	     GT_TagBase+62 /* Asks CreateMenus() to
		* validate that this is a complete menu structure
		*/
#define GTMN_SecondaryError  GT_TagBase+63 /* ti_Data is a pointer
		* to a ULONG to receive error reports from CreateMenus()
		*/
#define GT_Underscore	     GT_TagBase+64 /* ti_Data points to the symbol
		* that preceeds the character you'd like to underline in a
		* gadget label
		*/
#define GTST_EditHook	     GT_TagBase+55 /* String EditHook */
#define GTIN_EditHook	     GTST_EditHook /* Same thing, different name,
		* just to round out INTEGER_KIND gadgets
		*/

/* New to V39 GadTools.  Ignored by GadTools V36 and V37 */
#define GTMN_Checkmark	     GT_TagBase+65 /* ti_Data is checkmark img to use */
#define GTMN_AmigaKey	     GT_TagBase+66 /* ti_Data is Amiga-key img to use */
#define GTMN_NewLookMenus    GT_TagBase+67 /* ti_Data is boolean */

/* New to V39 GadTools.  Ignored by GadTools V36 and V37.
 * Set to TRUE if you want the checkbox or mx image scaled to
 * the gadget width/height you specify.  Defaults to FALSE,
 * for compatibility.
 */
#define GTCB_Scaled	     GT_TagBase+68 /* ti_Data is boolean */
#define GTMX_Scaled	     GT_TagBase+69 /* ti_Data is boolean */

#define GTPA_NumColors	     GT_TagBase+70 /* Number of colors in palette */

#define GTMX_TitlePlace      GT_TagBase+71 /* Where to put the title */

#define GTTX_FrontPen	     GT_TagBase+72 /* Text color in TEXT_KIND gad */
#define GTTX_BackPen	     GT_TagBase+73 /* Bgrnd color in TEXT_KIND gad */
#define GTTX_Justification   GT_TagBase+74 /* See GTJ_#? constants */

#define GTNM_FrontPen	     GT_TagBase+72 /* Text color in NUMBER_KIND gad */
#define GTNM_BackPen	     GT_TagBase+73 /* Bgrnd color in NUMBER_KIND gad */
#define GTNM_Justification   GT_TagBase+74 /* See GTJ_#? constants */
#define GTNM_Format	     GT_TagBase+75 /* Formatting string for number */
#define GTNM_MaxNumberLen    GT_TagBase+76 /* Maximum length of number */

#define GTBB_FrameType	     GT_TagBase+77 /* defines what kind of boxes
					    * DrawBevelBox() renders. See
					    * the BBFT_#? constants for
					    * possible values
					    */

#define GTLV_MakeVisible     GT_TagBase+78 /* Make this item visible */
#define GTLV_ItemHeight      GT_TagBase+79 /* Height of an individual item */

#define GTSL_MaxPixelLen     GT_TagBase+80 /* Max pixel size of level display */
#define GTSL_Justification   GT_TagBase+81 /* how should the level be displayed */

#define GTPA_ColorTable      GT_TagBase+82 /* colors to use in palette */

#define GTLV_CallBack	     GT_TagBase+83 /* general-purpose listview call back */
#define GTLV_MaxPen	     GT_TagBase+84 /* maximum pen number used by call back */

#define GTTX_Clipped	     GT_TagBase+85 /* make a TEXT_KIND clip text */
#define GTNM_Clipped	     GT_TagBase+85 /* make a NUMBER_KIND clip text */

/* Old definition, now obsolete: */
#define GT_Reserved0	     GTST_EditHook

/*------------------------------------------------------------------------*/

/* Justification types for GTTX_Justification and GTNM_Justification tags */
#define GTJ_LEFT   0
#define GTJ_RIGHT  1
#define GTJ_CENTER 2

/*------------------------------------------------------------------------*/

/* Bevel box frame types for GTBB_FrameType tag */
#define BBFT_BUTTON	 1  /* Standard button gadget box */
#define BBFT_RIDGE	 2  /* Standard string gadget box */
#define BBFT_ICONDROPBOX 3  /* Standard icon drop box	  */

/*------------------------------------------------------------------------*/

/* Typical suggested spacing between "elements": */
#define INTERWIDTH	8
#define INTERHEIGHT	4

/*------------------------------------------------------------------------*/

/* "NWay" is an old synonym for cycle gadgets */
#define NWAY_KIND	CYCLE_KIND
#define NWAYIDCMP	CYCLEIDCMP
#define GTNW_Labels	GTCY_Labels
#define GTNW_Active	GTCY_Active

/*------------------------------------------------------------------------*/

/* These two definitions are obsolete, but are here for backwards
 * compatibility.  You never need to worry about these:
 */
#define GADTOOLBIT	(0x8000)
/* Use this mask to isolate the user part: */
#define GADTOOLMASK	(~GADTOOLBIT)

/*------------------------------------------------------------------------*/

/* These definitions are for the GTLV_CallBack tag */

/* The different types of messages that a listview callback hook can see */
#define LV_DRAW       0x202L	/* draw yourself, with state */

/* Possible return values from a callback hook */
#define LVCB_OK       0		/* callback understands this message type    */
#define LVCB_UNKNOWN  1		/* callback does not understand this message */

/* states for LVDrawMsg.lvdm_State */
#define LVR_NORMAL	      0	/* the usual		     */
#define LVR_SELECTED	      1	/* for selected gadgets	     */
#define LVR_NORMALDISABLED    2		/* for disabled gadgets	     */
#define	LVR_SELECTEDDISABLED  8		/* disabled and selected     */

/* structure of LV_DRAW messages, object is a (struct Node *) */
struct LVDrawMsg
{
    ULONG	      lvdm_MethodID;   /* LV_DRAW		    */
    struct RastPort  *lvdm_RastPort;   /* where to render to	    */
    struct DrawInfo  *lvdm_DrawInfo;   /* useful to have around     */
    struct Rectangle  lvdm_Bounds;     /* limits of where to render */
    ULONG	      lvdm_State;      /* how to render	    */
};

/*------------------------------------------------------------------------*/

#endif /* LIBRARIES_GADTOOLS_H */
