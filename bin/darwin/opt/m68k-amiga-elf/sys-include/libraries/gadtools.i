	IFND LIBRARIES_GADTOOLS_I
LIBRARIES_GADTOOLS_I	SET	1
**
**	$VER: gadtools.i 39.12 (24.8.1993)
**	Includes Release 45.1
**
**	gadtools.library definitions
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	All Rights Reserved.
**

*------------------------------------------------------------------------*

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

	IFND INTUITION_INTUITION_I
	INCLUDE "intuition/intuition.i"
	ENDC

	IFND INTUITION_GADGETCLASS_I
	INCLUDE "intuition/gadgetclass.i"
	ENDC

*------------------------------------------------------------------------*

* The kinds (almost classes) of gadgets that GadTools supports.
* Use these identifiers when calling CreateGadgetA()

GENERIC_KIND	EQU	0
BUTTON_KIND	EQU	1
CHECKBOX_KIND	EQU	2
INTEGER_KIND	EQU	3
LISTVIEW_KIND	EQU	4
MX_KIND		EQU	5
NUMBER_KIND	EQU	6
CYCLE_KIND	EQU	7
PALETTE_KIND	EQU	8
SCROLLER_KIND	EQU	9
* Kind number 10 is reserved
SLIDER_KIND	EQU	11
STRING_KIND	EQU	12
TEXT_KIND	EQU	13

NUM_KINDS	EQU	14

*------------------------------------------------------------------------*

* 'Or' the appropriate set together for your Window IDCMPFlags: *

ARROWIDCMP	EQU	IDCMP_GADGETUP!IDCMP_GADGETDOWN!IDCMP_INTUITICKS!IDCMP_MOUSEBUTTONS

BUTTONIDCMP	EQU	IDCMP_GADGETUP
CHECKBOXIDCMP	EQU	IDCMP_GADGETUP
INTEGERIDCMP	EQU	IDCMP_GADGETUP
LISTVIEWIDCMP	EQU	IDCMP_GADGETUP!IDCMP_GADGETDOWN!IDCMP_MOUSEMOVE!ARROWIDCMP

MXIDCMP		EQU	IDCMP_GADGETDOWN
NUMBERIDCMP	EQU	0
CYCLEIDCMP	EQU	IDCMP_GADGETUP
PALETTEIDCMP	EQU	IDCMP_GADGETUP

* Use ARROWIDCMP!SCROLLERIDCMP if your scrollers have arrows: *
SCROLLERIDCMP	EQU	IDCMP_GADGETUP!IDCMP_GADGETDOWN!IDCMP_MOUSEMOVE
SLIDERIDCMP	EQU	IDCMP_GADGETUP!IDCMP_GADGETDOWN!IDCMP_MOUSEMOVE
STRINGIDCMP	EQU	IDCMP_GADGETUP

TEXTIDCMP	EQU	0

*------------------------------------------------------------------------*

* Generic NewGadget used by several of the gadget classes: *

    STRUCTURE NewGadget,0

	WORD	gng_LeftEdge
	WORD	gng_TopEdge	; gadget position
	WORD	gng_Width
	WORD	gng_Height	; gadget size
	APTR	gng_GadgetText	; gadget label
	APTR	gng_TextAttr	; desired font for gadget label
	UWORD	gng_GadgetID	; gadget ID
	ULONG	gng_Flags	; see below
	APTR	gng_VisualInfo	; Set to retval of GetVisualInfo()
	APTR	gng_UserData	; gadget UserData

	LABEL	gng_SIZEOF

* ng_Flags control certain aspects of the gadget.  The first five control
* the placement of the descriptive text.  Each gadget kind has its default,
* which is usually PLACETEXT_LEFT.  Consult the autodocs for details.

PLACETEXT_LEFT	EQU	$0001	* Right-align text on left side
PLACETEXT_RIGHT	EQU	$0002	* Left-align text on right side
PLACETEXT_ABOVE	EQU	$0004	* Center text above
PLACETEXT_BELOW	EQU	$0008	* Center text below
PLACETEXT_IN	EQU	$0010	* Center text on

NG_HIGHLABEL	EQU	$0020	* Highlight the label

*------------------------------------------------------------------------*

* Fill out an array of these and pass that to CreateMenus():

    STRUCTURE NewMenu,0

	UBYTE	gnm_Type		; See below
	UBYTE	gnm_Pad			; alignment padding
	APTR	gnm_Label		; Menu's label
	APTR	gnm_CommKey		; MenuItem Command Key Equiv
	UWORD	gnm_Flags		; Menu or MenuItem flags (see note)
	LONG	gnm_MutualExclude	; MenuItem MutualExclude word
	APTR	gnm_UserData		; For your own use, see note

	LABEL	gnm_SIZEOF

* Needed only by inside IM_ definitions below */
MENU_IMAGE	EQU	128

* nm_Type determines what each NewMenu structure corresponds to.
* for the NM_TITLE, NM_ITEM, and NM_SUB values, nm_Label should
* be a text string to use for that menu title, item, or sub-item.
* For IM_ITEM or IM_SUB, set nm_Label to point at the Image structure
* you wish to use for this item or sub-item.
* NOTE: At present, you may only use conventional images.
* Custom images created from Intuition image-classes do not work.
NM_TITLE	EQU	1	* Menu header
NM_ITEM		EQU	2	* Textual menu item
NM_SUB		EQU	3	* Textual menu sub-item

IM_ITEM		EQU	NM_ITEM!MENU_IMAGE	* Graphical menu item
IM_SUB		EQU	NM_SUB!MENU_IMAGE	* Graphical menu sub-item

* The NewMenu array should be terminated with a NewMenu whose
* nm_Type equals NM_END.
NM_END		EQU	0	* End of NewMenu array

* Starting with V39, GadTools will skip any NewMenu entries whose
* nm_Type field has the NM_IGNORE bit set.
NM_IGNORE	EQU	64


* nm_Label should be a text string for textual items, a pointer
* to an Image structure for graphical menu items, or the special
* constant NM_BARLABEL, to get a separator bar.
NM_BARLABEL	EQU	-1


* The nm_Flags field is used to fill out either the Menu->Flags or
* MenuItem->Flags field.  Note that the sense of the MENUENABLED or
* ITEMENABLED bit is inverted between this use and Intuition's use,
* in other words, NewMenus are enabled by default.  The following
* labels are provided to disable them:
NM_MENUDISABLED		EQU	MENUENABLED
NM_ITEMDISABLED		EQU	ITEMENABLED

* New for V39:	NM_COMMANDSTRING.  For a textual MenuItem or SubItem,
* point nm_CommKey at an arbitrary string, and set the NM_COMMANDSTRING
* flag.
NM_COMMANDSTRING	EQU	COMMSEQ

* The following are pre-cleared (COMMSEQ, ITEMTEXT, and HIGHxxx are set
* later as appropriate):
* Under V39, the COMMSEQ flag bit is not cleared, since it now has
* meaning.
NM_FLAGMASK		EQU	~(COMMSEQ!ITEMTEXT!HIGHFLAGS)
NM_FLAGMASK_V39		EQU	~(ITEMTEXT!HIGHFLAGS)

* You may choose among CHECKIT, MENUTOGGLE, and CHECKED.
* Toggle-select menuitems are of type CHECKIT!MENUTOGGLE, along
* with CHECKED if currently selected.  Mutually exclusive ones
* are of type CHECKIT, and possibly CHECKED too.  The nm_MutualExclude
* is a bit-wise representation of the items excluded by this one,
* so in the simplest case (choose 1 among n), these flags would be
* ~1, ~2, ~4, ~8, ~16, etc.  See the Intuition Menus chapter.

* A UserData pointer can be associated with each Menu and MenuItem structure.
* The CreateMenus() call allocates space for a UserData after each
* Menu or MenuItem (header, item or sub-item).	You should use the
* GTMENU_USERDATA or GTMENUITEM_USERDATA macro to extract it. */

GTMENU_USERDATA	MACRO
		move.l	mu_SIZEOF(\1),\2
		ENDM

GTMENUITEM_USERDATA	MACRO
		move.l	mi_SIZEOF(\1),\2
		ENDM

* Here is an old one for compatibility.  Do not use in new code!
MENU_USERDATA	MACRO
		move.l	mi_SIZEOF(\1),\2
		ENDM


* These return codes can be obtained through the GTMN_SecondaryError tag:
GTMENU_TRIMMED	EQU	$00000001	; Too many menus, items, or subitems,
					; menu has been trimmed down
GTMENU_INVALID	EQU	$00000002	; Invalid NewMenu array
GTMENU_NOMEM	EQU	$00000003	; Out of memory


*------------------------------------------------------------------------*

* Starting with V39, checkboxes and mx gadgets can be scaled to your
* specified gadget width/height.  Use the new GTCB_Scaled or GTMX_Scaled
* tags, respectively.  Under V37, and by default in V39, the imagery
* is of the following fixed size:

* MX gadget default dimensions:
MX_WIDTH	EQU	17
MX_HEIGHT	EQU	9

* Checkbox default dimensions:
CHECKBOX_WIDTH	EQU	26
CHECKBOX_HEIGHT	EQU	11

*------------------------------------------------------------------------*

* Tags for GadTools functions:

GT_TagBase	EQU	TAG_USER+$80000 ; Begin counting tags

GTVI_NewWindow	EQU	GT_TagBase+1	; NewWindow struct for GetVisualInfo
GTVI_NWTags	EQU	GT_TagBase+2	; NWTags for GetVisualInfo

GT_Private0	EQU	GT_TagBase+3	; (private)

GTCB_Checked	EQU	GT_TagBase+4	; State of checkbox

GTLV_Top	EQU	GT_TagBase+5	; Top visible one in listview
GTLV_Labels	EQU	GT_TagBase+6	; List to display in listview
GTLV_ReadOnly	EQU	GT_TagBase+7	; TRUE if listview is to be read-only
GTLV_ScrollWidth	EQU	GT_TagBase+8	; Width of scrollbar

GTMX_Labels	EQU	GT_TagBase+9	; NULL-terminated array of labels
GTMX_Active	EQU	GT_TagBase+10	; Active one in mx gadget

GTTX_Text	EQU	GT_TagBase+11	; Text to display
GTTX_CopyText	EQU	GT_TagBase+12	; Copy text label instead of referencing it

GTNM_Number	EQU	GT_TagBase+13	; Number to display

GTCY_Labels	EQU	GT_TagBase+14	; NULL-terminated array of labels
GTCY_Active	EQU	GT_TagBase+15	; The active one in the cycle gad

GTPA_Depth	EQU	GT_TagBase+16	; Number of bitplanes in palette
GTPA_Color	EQU	GT_TagBase+17	; Palette color
GTPA_ColorOffset	EQU	GT_TagBase+18	; First color to use in palette
GTPA_IndicatorWidth	EQU	GT_TagBase+19	; Width of current-color indicator
GTPA_IndicatorHeight	EQU	GT_TagBase+20	; Height of current-color indicator

GTSC_Top	EQU	GT_TagBase+21	; Top visible in scroller
GTSC_Total	EQU	GT_TagBase+22	; Total in scroller area
GTSC_Visible	EQU	GT_TagBase+23	; Number visible in scroller
GTSC_Overlap	EQU	GT_TagBase+24	; Unused

* GT_TagBase+25 through GT_TagBase+37 are reserved

GTSL_Min	EQU	GT_TagBase+38	; Slider min value
GTSL_Max	EQU	GT_TagBase+39	; Slider max value
GTSL_Level	EQU	GT_TagBase+40	; Slider level
GTSL_MaxLevelLen	EQU	GT_TagBase+41	; Max length of printed level
GTSL_LevelFormat	EQU	GT_TagBase+42	; Format string for level
GTSL_LevelPlace	EQU	GT_TagBase+43	; Where level should be placed
GTSL_DispFunc	EQU	GT_TagBase+44	; Callback for number calculation before display

GTST_String	EQU	GT_TagBase+45	; String gadget's displayed string
GTST_MaxChars	EQU	GT_TagBase+46	; Max length of string

GTIN_Number	EQU	GT_TagBase+47	; Number in integer gadget
GTIN_MaxChars	EQU	GT_TagBase+48	; Max number of digits

GTMN_TextAttr	EQU	GT_TagBase+49	; MenuItem font TextAttr
GTMN_FrontPen	EQU	GT_TagBase+50	; MenuItem text pen color

GTBB_Recessed	EQU	GT_TagBase+51	; Make BevelBox recessed

GT_VisualInfo	EQU	GT_TagBase+52	; result of VisualInfo call

GTLV_ShowSelected	EQU	GT_TagBase+53	; show selected entry beneath listview,
		 	; set tag data = NULL for display-only, or pointer
			; to a string gadget you've created
GTLV_Selected	EQU	GT_TagBase+54	; Set ordinal number of selected entry in the list
GT_Reserved1	EQU	GT_TagBase+56	; Reserved for future use

GTTX_Border	EQU	GT_TagBase+57	; Put a border around Text-display gadgets
GTNM_Border	EQU	GT_TagBase+58	; Put a border around Number-display gadgets

GTSC_Arrows	EQU	GT_TagBase+59	; Specify size of arrows for scroller
GTMN_Menu	EQU	GT_TagBase+60	; Pointer to Menu for use by
			; LayoutMenuItems()
GTMX_Spacing	EQU	GT_TagBase+61	; Added to font height to
			; figure spacing between mx choices.  Use this
			; instead of LAYOUTA_SPACING for mx gadgets.

* New to V37 GadTools.	Ignored by GadTools V36.
GTMN_FullMenu	EQU	GT_TagBase+62  ; Asks CreateMenus() to
		; validate that this is a complete menu structure
GTMN_SecondaryError	EQU	GT_TagBase+63  ; ti_Data is a pointer
		; to a ULONG to receive error reports from CreateMenus()
GT_Underscore	EQU	GT_TagBase+64	; ti_Data points to the symbol
		; that preceeds the character you'd like to underline in a
		; gadget label
GTST_EditHook	EQU	GT_TagBase+55	; String EditHook
GTIN_EditHook	EQU	GTST_EditHook	; Same thing, different name,
		; just to round out INTEGER_KIND gadgets


* New to V39 GadTools.  Ignored by GadTools V36 and V37
GTMN_Checkmark	EQU	GT_TagBase+65	; ti_Data is checkmark img to use
GTMN_AmigaKey	EQU	GT_TagBase+66	; ti_Data is Amiga-key img to use
GTMN_NewLookMenus	EQU	GT_TagBase+67 ; ti_Data is boolean

* New to V39 GadTools.  Ignored by GadTools V36 and V37.
* Set to TRUE if you want the checkbox or mx image scaled to
* the gadget width/height you specify.  Defaults to FALSE,
* for compatibility.
GTCB_Scaled	EQU	GT_TagBase+68	; ti_Data is boolean
GTMX_Scaled	EQU	GT_TagBase+69	; ti_Data is boolean

GTPA_NumColors	EQU	GT_TagBase+70	; Number of colors in palette

GTMX_TitlePlace      EQU GT_TagBase+71      ; Where to put the title

GTTX_FrontPen        EQU GT_TagBase+72      ; Text color in TEXT_KIND gad
GTTX_BackPen         EQU GT_TagBase+73      ; Bgrnd color in TEXT_KIND gad
GTTX_Justification   EQU GT_TagBase+74      ; See GTJ_#? constants

GTNM_FrontPen        EQU GT_TagBase+72      ; Text color in NUMBER_KIND gad
GTNM_BackPen         EQU GT_TagBase+73      ; Bgrnd color in NUMBER_KIND gad
GTNM_Justification   EQU GT_TagBase+74      ; See GTJ_#? constants
GTNM_Format          EQU GT_TagBase+75      ; Formatting string for number
GTNM_MaxNumberLen    EQU GT_TagBase+76      ; Maximum length of number

GTBB_FrameType       EQU GT_TagBase+77      ; defines what kind of boxes
                                            ; DrawBevelBox() renders. See
                                            ; the BBFT_#? constants for
                                            ; possible values

GTLV_MakeVisible     EQU GT_TagBase+78      ; Make this item visible

GTSL_MaxPixelLen     EQU GT_TagBase+80      ; Max pixel size of level display
GTSL_Justification   EQU GT_TagBase+81      ; how should the level be displayed

GTPA_ColorTable      EQU GT_TagBase+82      ; colors to use in palette

GTTX_Clipped         EQU GT_TagBase+85 	    ; make a TEXT_KIND clip text
GTNM_Clipped         EQU GT_TagBase+85 	    ; make a NUMBER_KIND clip text

* Old definition, now obsolete:
GT_Reserved0	EQU	GTST_EditHook

*------------------------------------------------------------------------*

* Justification types for GTTX_Justification and GTNM_Justification tags *
GTJ_LEFT   EQU 0
GTJ_RIGHT  EQU 1
GTJ_CENTER EQU 2

*------------------------------------------------------------------------*

* Bevel box frame types for GTBB_FrameType tag
BBFT_BUTTON	 EQU 1  * Standard button gadget box
BBFT_RIDGE	 EQU 2  * Standard string gadget box
BBFT_ICONDROPBOX EQU 3  * Standard icon drop box

*------------------------------------------------------------------------*

* Typical suggested spacing between "elements": *
INTERWIDTH	EQU	8
INTERHEIGHT	EQU	4

*------------------------------------------------------------------------*

* "NWay" is an old synonym for cycle gadgets

NWAY_KIND	EQU	CYCLE_KIND
NWAYIDCMP	EQU	CYCLEIDCMP

GTNW_Labels	EQU	GTCY_Labels
GTNW_Active	EQU	GTCY_Active

*------------------------------------------------------------------------*

* These two definitions are obsolete, but are here for backwards
* compatibility.  You never need to worry about these:
GADTOOLBIT	EQU	$8000

* Use this mask to isolate the user part: *
GADTOOLMASK	EQU	~GADTOOLBIT

*------------------------------------------------------------------------*

* These definitions are for the GTLV_CallBack tag

* The different types of messages that a listview callback hook can see
LV_DRAW		     equ $202	; draw yourself, with state

* Possible return values from a callback hook
LVCB_OK              equ 0	; callback understands this message type
LVCB_UNKNOWN         equ 1	; callback does not understand this message

* states for LVDrawMsg.lvdm_State
LVR_NORMAL	     equ 0  	; the usual
LVR_SELECTED	     equ 1	; for selected gadgets
LVR_NORMALDISABLED   equ 2	; for disabled gadgets
LVR_SELECTEDDISABLED equ 8	; disabled and selected

* structure of LV_DRAW messages, object is a (struct Node *)
   STRUCTURE LVDrawMsg,0
	ULONG	lvdm_MethodID		; LV_DRAW
	APTR	lvdm_RastPort		; where to render to
	APTR	lvdm_DrawInfo		; useful to have around
	STRUCT  lvdm_Bounds,ra_SIZEOF   ; limits of where to render
	ULONG	lvdm_State		; how to render

*------------------------------------------------------------------------*

	ENDC
