	IFND	INTUITION_INTUITION_I
INTUITION_INTUITION_I	SET	1
**
**	$VER: intuition.i 38.26 (11.8.1993)
**	Includes Release 45.1
**
**	Interface definitions for Intuition applications
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND	GRAPHICS_GFX_I
	INCLUDE	"graphics/gfx.i"
	ENDC

	IFND	GRAPHICS_CLIP_I
	INCLUDE	"graphics/clip.i"
	ENDC

	IFND	GRAPHICS_VIEW_I
	INCLUDE	"graphics/view.i"
	ENDC

	IFND	GRAPHICS_RASTPORT_I
	INCLUDE	"graphics/rastport.i"
	ENDC

	IFND	GRAPHICS_LAYERS_I
	INCLUDE	"graphics/layers.i"
	ENDC

	IFND	GRAPHICS_TEXT_I
	INCLUDE "graphics/text.i"
	ENDC

	IFND EXEC_PORTS_I
	INCLUDE "exec/ports.i"
	ENDC

	IFND	DEVICES_TIMER_I
	INCLUDE	"devices/timer.i"
	ENDC

	IFND	DEVICES_INPUTEVENT_I
	INCLUDE "devices/inputevent.i"
	ENDC

	IFND UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

*
* NOTE:  intuition/iobsolete.i is included at the END of this file!
*


; ========================================================================;
; === Menu ===============================================================;
; ========================================================================;
 STRUCTURE Menu,0

    APTR  mu_NextMenu	; menu pointer, same level
    WORD mu_LeftEdge	; position of the select box
    WORD mu_TopEdge	; position of the select box
    WORD mu_Width	; dimensions of the select box
    WORD mu_Height	; dimensions of the select box
    WORD mu_Flags	; see flag definitions below
    APTR mu_MenuName	; text for this Menu Header
    APTR  mu_FirstItem	; pointer to first in chain

    ; these mysteriously-named variables are for internal use only
    WORD mu_JazzX
    WORD mu_JazzY
    WORD mu_BeatX
    WORD mu_BeatY

    LABEL mu_SIZEOF

;*** FLAGS SET BY BOTH THE APPLIPROG AND INTUITION ***
MENUENABLED EQU $0001	; whether or not this menu is enabled

;*** FLAGS SET BY INTUITION ***
MIDRAWN EQU $0100	; this menu's items are currently drawn

; ========================================================================;
; === MenuItem ===========================================================;
; ========================================================================;
 STRUCTURE MenuItem,0

    APTR mi_NextItem	; pointer to next in chained list
    WORD mi_LeftEdge	; position of the select box
    WORD mi_TopEdge	; position of the select box
    WORD mi_Width	; dimensions of the select box
    WORD mi_Height	; dimensions of the select box
    WORD mi_Flags	; see the defines below

    LONG mi_MutualExclude ; set bits mean this item excludes that item

    APTR mi_ItemFill	; points to Image, IntuiText, or NULL

    ; when this item is pointed to by the cursor and the items highlight
    ; mode HIGHIMAGE is selected, this alternate image will be displayed
    APTR mi_SelectFill	; points to Image, IntuiText, or NULL

    BYTE mi_Command	; only if appliprog sets the COMMSEQ flag

    BYTE mi_KludgeFill00 ; This is strictly for word-alignment

    APTR mi_SubItem	; if non-zero, points to MenuItem for submenu

   ; The NextSelect field represents the menu number of next selected 
   ; item (when user has drag-selected several items)
    WORD mi_NextSelect

    LABEL  mi_SIZEOF

; --- FLAGS SET BY THE APPLIPROG --------------------------------------------
CHECKIT		EQU $0001	; set to indicate checkmarkable item
ITEMTEXT	EQU $0002	; set if textual, clear if graphical item
COMMSEQ		EQU $0004	; set if there's an command sequence
MENUTOGGLE	EQU $0008	; set for toggling checks (else mut. exclude)
ITEMENABLED	EQU $0010	; set if this item is enabled

; these are the SPECIAL HIGHLIGHT FLAG state meanings
HIGHFLAGS	EQU $00C0	; see definitions below for these bits
HIGHIMAGE	EQU $0000	; use the user's "select image"
HIGHCOMP	EQU $0040	; highlight by complementing the select box
HIGHBOX		EQU $0080	; highlight by drawing a box around the image
HIGHNONE	EQU $00C0	; don't highlight

; --- FLAGS SET BY BOTH APPLIPROG AND INTUITION -----------------------------
CHECKED	EQU $0100	; state of the checkmark


; --- FLAGS SET BY INTUITION ------------------------------------------------
ISDRAWN		EQU $1000	; this item's subs are currently drawn
HIGHITEM	EQU $2000	; this item is currently highlighted
MENUTOGGLED	EQU $4000	; this item was already toggled 






; ========================================================================
; === Requester ==========================================================
; ========================================================================
 STRUCTURE Requester,0

    APTR  rq_OlderRequest
    WORD rq_LeftEdge		; dimensions of the entire box
    WORD rq_TopEdge		; dimensions of the entire box
    WORD rq_Width		; dimensions of the entire box
    WORD rq_Height		; dimensions of the entire box

    WORD rq_RelLeft		; get POINTREL Pointer relativity offsets
    WORD rq_RelTop		; get POINTREL Pointer relativity offsets

    APTR  rq_ReqGadget     	; pointer to the first of a list of gadgets
    APTR  rq_ReqBorder		; the box's border
    APTR  rq_ReqText		; the box's text

    WORD  rq_Flags		; see definitions below

    UBYTE rq_BackFill		; pen number for back-plane fill before draws

    BYTE rq_KludgeFill00	; This is strictly for word-alignment

    APTR rq_ReqLayer		; layer in which requester rendered
    STRUCT rq_ReqPad1,32	; for backwards compatibility (reserved)

    ; If the BitMap plane pointers are non-zero, this tells the system 
    ; that the image comes pre-drawn (if the appliprog wants to define 
    ; its own box, in any shape or size it wants!); this is OK by 
    ; Intuition as long as there's a good correspondence between the image
    ; and the specified Gadgets
    APTR  rq_ImageBMap		; points to the BitMap of PREDRAWN imagery

    APTR  rq_RWindow		; points back to requester's window
    APTR  rq_ReqImage		; new for V36: drawn if USEREQIMAGE set
    STRUCT rq_ReqPad2,32	; for backwards compatibility (reserved)

    LABEL rq_SIZEOF

; FLAGS SET BY THE APPLIPROG
POINTREL	EQU $0001  ; if POINTREL set, TopLeft is relative to pointer
			   ; for DMRequester, relative to window center
			   ; for Request().
PREDRAWN	EQU $0002  ; if ReqBMap points to predrawn Requester imagery
NOISYREQ 	EQU $0004  ; if you don't want requester to filter input

; New for V36
SIMPLEREQ	EQU $0010  ; to use SIMPLEREFRESH layer (recommended)
USEREQIMAGE	EQU $0020  ; render linked list ReqImage after BackFill
			   ; but before gadgets and text
NOREQBACKFILL	EQU $0040  ; don't bother filling with Requester.BackFill


; FLAGS SET BY INTUITION;
REQOFFWINDOW	EQU $1000	; part of one of the Gadgets was offwindow
REQACTIVE	EQU $2000	; this requester is active
SYSREQUEST	EQU $4000	; (unused) this requester caused by system
DEFERREFRESH	EQU $8000	; this Requester stops a Refresh broadcast





; ========================================================================
; === Gadget =============================================================
; ========================================================================
 STRUCTURE Gadget,0

    APTR gg_NextGadget		; next gadget in the list

    WORD gg_LeftEdge		; "hit box" of gadget
    WORD gg_TopEdge		; "hit box" of gadget
    WORD gg_Width		; "hit box" of gadget
    WORD gg_Height		; "hit box" of gadget

    WORD gg_Flags 		; see below for list of defines

    WORD gg_Activation		; see below for list of defines

    WORD gg_GadgetType		; see below for defines

    ; appliprog can specify that the Gadget be rendered as either as Border
    ; or an Image.  This variable points to which (or equals NULL if there's
    ; nothing to be rendered about this Gadget)
    APTR gg_GadgetRender

    ; appliprog can specify "highlighted" imagery rather than algorithmic
    ; this can point to either Border or Image data
    APTR gg_SelectRender

    APTR gg_GadgetText		; text for this gadget;

    ; MutualExclude, never implemented, is now declared obsolete.
    ; There are published examples of implementing a more general
    ; and practical exclusion in your applications.
    ;
    ; Starting V36, this field is used to point to a hook
    ; for a custom gadget.
    ;
    ; Programs using this field for their own processing will
    ; continue to work, as long as they don't try the
    ; trick with custom gadgets
    LONG gg_MutualExclude 	; obsolete

    ; pointer to a structure of special data required by Proportional, String 
    ; and Integer Gadgets
    APTR gg_SpecialInfo

    WORD gg_GadgetID	; user-definable ID field
    APTR  gg_UserData	; ptr to general purpose User data (ignored by Intuit)

    LABEL gg_SIZEOF

 STRUCTURE ExtGadget,0

    ; The first fields match struct Gadget exactly
    APTR egg_NextGadget		; Matches struct Gadget
    WORD egg_LeftEdge		; Matches struct Gadget
    WORD egg_TopEdge		; Matches struct Gadget
    WORD egg_Width		; Matches struct Gadget
    WORD egg_Height		; Matches struct Gadget
    WORD egg_Flags 		; Matches struct Gadget
    WORD egg_Activation		; Matches struct Gadget
    WORD egg_GadgetType		; Matches struct Gadget
    APTR egg_GadgetRender	; Matches struct Gadget
    APTR egg_SelectRender	; Matches struct Gadget
    APTR egg_GadgetText		; Matches struct Gadget
    LONG egg_MutualExclude 	; Matches struct Gadget
    APTR egg_SpecialInfo	; Matches struct Gadget
    WORD egg_GadgetID		; Matches struct Gadget
    APTR egg_UserData		; Matches struct Gadget

    ; These fields only exist under V39 and only if GFLG_EXTENDED is set
    ULONG egg_MoreFlags		; see GMORE_ flags below
    WORD egg_BoundsLeftEdge	; Bounding extent for gadget, valid
    WORD egg_BoundsTopEdge	; only if GMORE_BOUNDS is set.  The
    WORD egg_BoundsWidth	; GFLG_RELxxx flags affect these
    WORD egg_BoundsHeight	; coordinates as well.

    LABEL egg_SIZEOF

; --- Gadget.Flags values ---
; combinations in these bits describe the highlight technique to be used
GFLG_GADGHIGHBITS	EQU $0003
GFLG_GADGHCOMP		EQU $0000	; Complement the select box
GFLG_GADGHBOX		EQU $0001	; Draw a box around the image
GFLG_GADGHIMAGE		EQU $0002	; Blast in this alternate image
GFLG_GADGHNONE		EQU $0003	; don't highlight

; set this flag if the GadgetRender and SelectRender point to Image imagery,
; clear if it's a Border 
GFLG_GADGIMAGE		EQU $0004

; combinations in these next two bits specify to which corner the gadget's
; Left & Top coordinates are relative.	If relative to Top/Left,
; these are "normal" coordinates (everything is relative to something in
; this universe)
GFLG_RELBOTTOM		EQU $0008	; set if rel to bottom, clear if to top
GFLG_RELRIGHT		EQU $0010	; set if rel to right, clear if to left
; set the GFLG_RELWIDTH bit to spec that Width is relative to width of screen
GFLG_RELWIDTH		EQU $0020
; set the GFLG_RELHEIGHT bit to spec that Height is rel to height of screen
GFLG_RELHEIGHT		EQU $0040

; New for V39: GFLG_RELSPECIAL allows custom gadget implementors to
; make gadgets whose position and size depend in an arbitrary way
; on their window's dimensions.  The GM_LAYOUT method will be invoked
; for such a gadget (or any other GREL_xxx gadget) at suitable times,
; such as when the window opens or the window's size changes.
GFLG_RELSPECIAL		EQU $4000 ; custom gadget has special relativity.
				  ; Gadget box values are absolutes, but
				  ; can be changed via the GM_LAYOUT method.

; the GFLG_SELECTED flag is initialized by you and set by Intuition.  It
; specifies whether or not this Gadget is currently selected/highlighted
GFLG_SELECTED		EQU $0080


; the GFLG_DISABLED flag is initialized by you and later set by Intuition
; according to your calls to On/OffGadget().  It specifies whether or not
; this Gadget is currently disabled from being selected
GFLG_DISABLED		EQU $0100

* These flags specify the type of text field that Gadget.GadgetText
* points to.  In all normal (pre-V36) gadgets which you initialize
* this field should always be zero.  Some types of gadget objects
* created from classes will use these fields to keep track of
* types of labels/contents that different from IntuiText, but are
* stashed in GadgetText.

GFLG_LABELMASK		EQU	$3000
GFLG_LABELITEXT		EQU	$0000	; GadgetText points to IntuiText
GFLG_LABELSTRING	EQU	$1000	; GadgetText points to (UBYTE *)
GFLG_LABELIMAGE		EQU	$2000	; GadgetText points to Image (object)
; New for V37: GFLG_TABCYCLE
GFLG_TABCYCLE		EQU	$0200	; (string or custom) gadget
				; participates in cycling activation with
				; Tab or Shift-Tab

; New for V37: GFLG_STRINGEXTEND.  We discovered that V34 doesn't properly
; ignore the value we had chosen for the Gadget->Activation flag
; GACT_STRINGEXTEND.  NEVER SET THAT FLAG WHEN RUNNING UNDER V34.
; The Gadget->Flags bit GFLG_STRINGEXTEND is provided as a synonym which is
; safe under V34, and equivalent to GACT_STRINGEXTEND under V37.
; (Note that the two flags are not numerically equal)
GFLG_STRINGEXTEND	EQU	$0400  ; this String Gadget has StringExtend

; New for V39: GFLG_IMAGEDISABLE.  This flag is automatically set if
; the custom image of this gadget knows how to do disabled rendering
; (more specifically, if its IA_SupportsDisable attribute is TRUE).
; Intuition uses this to defer the ghosting to the image-class,
; instead of doing it itself (the old compatible way).
; Do not set this flag yourself - Intuition will do it for you.

GFLG_IMAGEDISABLE 	EQU	$0800  ; Gadget's image knows how to do disabled
				       ; rendering

; New for V39:	If set, this bit means that the Gadget is actually
; a struct ExtGadget, with new fields and flags.  All V39 boopsi
; gadgets are ExtGadgets.  Never ever attempt to read the extended
; fields of a gadget if this flag is not set.

GFLG_EXTENDED		EQU	$8000  ; Gadget is extended



; --- These are the Activation flag bits ----------------------------------
; GACT_RELVERIFY is set if you want to verify that the pointer was still over
; the gadget when the select button was released.  Will cause
; an IDCMP_GADGETUP message to be sent if so.
GACT_RELVERIFY		EQU $0001

; the flag GACT_IMMEDIATE, when set, informs the caller that the gadget
; was activated when it was activated.	this flag works in conjunction with
; the GACT_RELVERIFY flag
GACT_IMMEDIATE		EQU $0002

; the flag GACT_ENDGADGET, when set, tells the system that this gadget, when
; selected, causes the Requester or AbsMessage to be ended.  Requesters or
; AbsMessages that are ended are erased and unlinked from the system
GACT_ENDGADGET		EQU $0004

; the GACT_FOLLOWMOUSE flag, when set, specifies that you want to receive
; reports on mouse movements while this gadget is active.
; You probably want to set the GACT_IMMEDIATE flag when using
; GACT_FOLLOWMOUSE, since that's the only reasonable way you have of learning
; why Intuition is suddenly sending you a stream of mouse movement events.
; If you don't set GACT_RELVERIFY, you'll get at least one Mouse Position
; event.
; Note: boolean FOLLOWMOUSE gadgets require GACT_RELVERIFY to get
; _any_ mouse movement events (this unusual behavior is a compatibility
; hold-over from the old days).

GACT_FOLLOWMOUSE	EQU $0008

; if any of the BORDER flags are set in a Gadget that's included in the
; Gadget list when a Window is opened, the corresponding Border will
; be adjusted to make room for the Gadget
GACT_RIGHTBORDER	EQU $0010
GACT_LEFTBORDER		EQU $0020
GACT_TOPBORDER		EQU $0040
GACT_BOTTOMBORDER	EQU $0080
GACT_BORDERSNIFF	EQU $8000	; neither set nor rely on this bit

GACT_TOGGLESELECT	EQU $0100	; this bit for toggle-select mode
GACT_BOOLEXTEND		EQU $2000	; This Boolean Gadget has a BoolInfo

; should properly be in StringInfo, but aren't
GACT_STRINGLEFT		EQU $0000	; NOTE WELL: that this has value zero
GACT_STRINGCENTER	EQU $0200	; center the String
GACT_STRINGRIGHT	EQU $0400	; right-justify the String
GACT_LONGINT		EQU $0800	; This String Gadget is a Long Integer
GACT_ALTKEYMAP		EQU $1000	; has an alternate keymapping
GACT_STRINGEXTEND	EQU $2000	; this String Gadget has an extension
					; NOTE: NEVER SET GACT_STRINGEXTEND
					; IF YOU ARE RUNNING ON LESS THAN V36!
					; SEE GFLG_STRINGEXTEND (ABOVE) INSTEAD

GACT_ACTIVEGADGET	EQU $4000	; this gadget is "active".  This flag
				; is maintained by Intuition, and you
				; cannot count on its value persisting
				; while you do something on your program's
				; task.  It can only be trusted by
				; people implementing custom gadgets

* note $8000 is used above (GACT_BORDERSNIFF); all Activation flags defined



; --- GADGET TYPES -----------------------------------------------------------
; These are the Gaget Type definitions for the variable GadgetType.
; Gadget number type MUST start from one.  NO TYPES OF ZERO ALLOWED.
; first comes the mask for Gadget flags reserved for Gadget typing
GTYP_GADGETTYPE		EQU $FC00	; all Gadget Global Type flags
					; (padded)
GTYP_SCRGADGET		EQU $4000	; 1 = ScreenGadget, 0 = WindowGadget
GTYP_GZZGADGET		EQU $2000	; 1 = Gadget for WFLG_GIMMEZEROZERO
					;     borders
GTYP_REQGADGET		EQU $1000	; 1 = this is a Requester Gadget

; GTYP_SYSGADGET means that Intuition ALLOCATED the gadget.
; GTYP_SYSTYPEMASK is the mask you can apply to tell what type of
; system-gadget it is.	The possible types follow.
GTYP_SYSGADGET		EQU $8000
GTYP_SYSTYPEMASK	EQU $00F0

; These definitions describe system gadgets in V36 and higher:
GTYP_SIZING		EQU $0010		; Window sizing gadget
GTYP_WDRAGGING		EQU $0020		; Window drag bar
GTYP_SDRAGGING		EQU $0030		; Screen drag bar
GTYP_WDEPTH		EQU $0040		; Window depth gadget
GTYP_SDEPTH		EQU $0050		; Screen depth gadget
GTYP_WZOOM		EQU $0060		; Window zoom gadget
GTYP_SUNUSED		EQU $0070		; Unused screen gadget
GTYP_CLOSE		EQU $0080		; Window close gadget

; These definitions describe system gadgets prior to V36:
GTYP_WUPFRONT		EQU GTYP_WDEPTH		; Window to-front gadget
GTYP_SUPFRONT		EQU GTYP_SDEPTH		; Screen to-front gadget
GTYP_WDOWNBACK		EQU GTYP_WZOOM		; Window to-back gadget
GTYP_SDOWNBACK		EQU GTYP_SUNUSED	; Screen to-back gadget

; GTYP_GTYPEMASK is a mask you can apply to tell what class
; of gadget this is.  The possible classes follow.
GTYP_GTYPEMASK		EQU $0007

GTYP_BOOLGADGET		EQU $0001
GTYP_GADGET0002		EQU $0002
GTYP_PROPGADGET		EQU $0003
GTYP_STRGADGET		EQU $0004
GTYP_CUSTOMGADGET	EQU $0005

; New for V39.	Gadgets which have the GFLG_EXTENDED flag set are
; actually ExtGadgets, which have more flags.  The GMORE_xxx
; identifiers describe those flags.  For GMORE_SCROLLRASTER, see
; important information in the ScrollWindowRaster() autodoc.
; NB: GMORE_SCROLLRASTER must be set before the gadget is
; added to a window.

GMORE_BOUNDS		EQU $00000001 ; ExtGadget has valid Bounds
GMORE_GADGETHELP	EQU $00000002 ; This gadget responds to gadget help
GMORE_SCROLLRASTER	EQU $00000004 ; This (custom) gadget uses ScrollRaster



; ========================================================================
; === BoolInfo============================================================
; ========================================================================
; This is the special data needed by an Extended Boolean Gadget
; Typically this structure will be pointed to by the Gadget field SpecialInfo

 STRUCTURE BoolInfo,0

    WORD    bi_Flags	; defined below
    APTR    bi_Mask	; bit mask for highlighting and selecting
			; mask must follow the same rules as an Image
			; plane.  Its width and height are determined
			; by the width and height of the gadget's 
			; select box. (i.e. Gadget.Width and .Height).
    LONG    bi_Reserved	; set to 0

    LABEL   bi_SIZEOF

; set BoolInfo.Flags to this flag bit.
; in the future, additional bits might mean more stuff hanging
; off of BoolInfo.Reserved.

BOOLMASK	EQU	$0001	; extension is for masked gadget

; ========================================================================
; === PropInfo ===========================================================
; ========================================================================
; this is the special data required by the proportional Gadget
; typically, this data will be pointed to by the Gadget variable SpecialInfo
 STRUCTURE PropInfo,0

    WORD pi_Flags	; general purpose flag bits (see defines below)

    ; You initialize the Pot variables before the Gadget is added to 
    ; the system.  Then you can look here for the current settings 
    ; any time, even while User is playing with this Gadget.  To 
    ; adjust these after the Gadget is added to the System, use 
    ; ModifyProp(); The Pots are the actual proportional settings, 
    ; where a value of zero means zero and a value of MAXPOT means 
    ; that the Gadget is set to its maximum setting.
    WORD pi_HorizPot	; 16-bit FixedPoint horizontal quantity percentage;
    WORD pi_VertPot	; 16-bit FixedPoint vertical quantity percentage;

    ; the 16-bit FixedPoint Body variables describe what percentage 
    ; of the entire body of stuff referred to by this Gadget is 
    ; actually shown at one time.  This is used with the AUTOKNOB 
    ; routines, to adjust the size of the AUTOKNOB according to how 
    ; much of the data can be seen.  This is also used to decide how 
    ; far to advance the Pots when User hits the Container of the Gadget.  
    ; For instance, if you were controlling the display of a 5-line 
    ; Window of text with this Gadget, and there was a total of 15 
    ; lines that could be displayed, you would set the VertBody value to 
    ;    (MAXBODY / (TotalLines / DisplayLines)) = MAXBODY / 3.
    ; Therefore, the AUTOKNOB would fill 1/3 of the container, and if 
    ; User hits the Cotainer outside of the knob, the pot would advance 
    ; 1/3 (plus or minus) If there's no body to show, or the total
    ; amount of displayable info is less than the display area, set the
    ; Body variables to the MAX.  To adjust these after the Gadget is
    ; added to the System, use ModifyProp().
    WORD pi_HorizBody	; horizontal Body
    WORD pi_VertBody	; vertical Body

    ; these are the variables that Intuition sets and maintains
    WORD pi_CWidth	; Container width (with any relativity absoluted)
    WORD pi_CHeight	; Container height (with any relativity absoluted)
    WORD pi_HPotRes	; pot increments
    WORD pi_VPotRes	; pot increments
    WORD pi_LeftBorder	; Container borders
    WORD pi_TopBorder	; Container borders
    LABEL  pi_SIZEOF

; --- FLAG BITS --------------------------------------------------------------
AUTOKNOB	EQU $0001	; this flag sez:  gimme that old auto-knob
FREEHORIZ	EQU $0002	; if set, the knob can move horizontally
FREEVERT	EQU $0004	; if set, the knob can move vertically
PROPBORDERLESS	EQU $0008	; if set, no border will be rendered
KNOBHIT		EQU $0100	; set when this Knob is hit
PROPNEWLOOK	EQU $0010	; set this if you want to get the new
				; V36 look

KNOBHMIN	EQU 6		; minimum horizontal size of the knob
KNOBVMIN	EQU 4		; minimum vertical size of the knob
MAXBODY		EQU $FFFF	; maximum body value
MAXPOT			EQU $FFFF	; maximum pot value


; ========================================================================
; === StringInfo =========================================================
; ========================================================================
; this is the special data required by the string Gadget
; typically, this data will be pointed to by the Gadget variable SpecialInfo
 STRUCTURE StringInfo,0

    ; you initialize these variables, and then Intuition maintains them
    APTR  si_Buffer	; the buffer containing the start and final string
    APTR  si_UndoBuffer	; optional buffer for undoing current entry
    WORD si_BufferPos	; character position in Buffer
    WORD si_MaxChars	; max number of chars in Buffer (including NULL)
    WORD si_DispPos	; Buffer position of first displayed character

    ; Intuition initializes and maintains these variables for you
    WORD si_UndoPos	; character position in the undo buffer
    WORD si_NumChars	; number of characters currently in Buffer
    WORD si_DispCount	; number of whole characters visible in Container
    WORD si_CLeft	; topleft offset of the container
    WORD si_CTop	; topleft offset of the container

    ; unused field is changed to allow extended specification
    ; of string gadget parameters.  It is ignored unless the flag
    ; GACT_STRINGEXTEND is set in the Gadget's Activation field
    ; or the GFLG_STRINGEXTEND flag is set in the Gadget Flags field.
    ; (See GFLG_STRINGEXTEND for an important note)
    ;APTR  si_LayerPtr	; --- obsolete ---
    APTR  si_Extension

    ; you can initialize this variable before the gadget is submitted to
    ; Intuition, and then examine it later to discover what integer 
    ; the user has entered (if the user never plays with the gadget, 
    ; the value will be unchanged from your initial setting)
    LONG  si_LongInt	; the LONG return value of a GACT_LONGINT String Gad.

    ; If you want this Gadget to use your own Console keymapping, you
    ; set the GACT_ALTKEYMAP bit in the Activation flags of the Gadget, and
    ; then set this variable to point to your keymap.  If you don't set the
    ; GACT_ALTKEYMAP, you'll get the standard ASCII keymapping.
    APTR si_AltKeyMap

    LABEL si_SIZEOF




; ========================================================================
; === IntuiText ==========================================================
; ========================================================================
; IntuiText is a series of strings that start with a location
; (always relative to the upper-left corner of something) and then the
; text of the string.  The text is null-terminated.
 STRUCTURE IntuiText,0

    BYTE it_FrontPen		; the pens for rendering the text
    BYTE it_BackPen		; the pens for rendering the text

    BYTE it_DrawMode		; the mode for rendering the text

    BYTE it_KludgeFill00 	; This is strictly for word-alignment 

    WORD it_LeftEdge		; relative start location for the text
    WORD it_TopEdge		; relative start location for the text

    APTR  it_ITextFont		; if NULL, you accept the defaults

    APTR it_IText		; pointer to null-terminated text

    APTR  it_NextText		; pointer to another IntuiText to render

    LABEL it_SIZEOF





; ========================================================================
; === Border =============================================================
; ========================================================================
; Data type Border, used for drawing a series of lines which is intended for
; use as a border drawing, but which may, in fact, be used to render any
; arbitrary vector shape.
; The routine DrawBorder sets up the RastPort with the appropriate
; variables, then does a Move to the first coordinate, then does Draws
; to the subsequent coordinates.
; After all the Draws are done, if NextBorder is non-zero we call DrawBorder
; on NextBorder
 STRUCTURE Border,0

    WORD  bd_LeftEdge		; initial offsets from the origin
    WORD  bd_TopEdge		; initial offsets from the origin
    BYTE  bd_FrontPen		; pen number for rendering 
    BYTE  bd_BackPen		; pen number for rendering 
    BYTE  bd_DrawMode		; mode for rendering 
    BYTE  bd_Count		; number of XY pairs
    APTR  bd_XY			; vector coordinate pairs rel to LeftTop
    APTR  bd_NextBorder		; pointer to any other Border too

    LABEL bd_SIZEOF


; ======================================================================== 
; === Image ============================================================== 
; ======================================================================== 
; This is a brief image structure for very simple transfers of 
; image data to a RastPort
 STRUCTURE Image,0

    WORD ig_LeftEdge		; starting offset relative to something 
    WORD ig_TopEdge		; starting offset relative to something 
    WORD ig_Width		; pixel size (though data is word-aligned)
    WORD ig_Height		; pixel size 
    WORD ig_Depth		; pixel size 
    APTR ig_ImageData		; pointer to the actual image bits

    ; the PlanePick and PlaneOnOff variables work much the same way as the
    ; equivalent GELS Bob variables.  It's a space-saving
    ; mechanism for image data.  Rather than defining the image data
    ; for every plane of the RastPort, you need define data only for planes
    ; that are not entirely zero or one.  As you define your Imagery, you will
    ; often find that most of the planes ARE just as color selectors.  For
    ; instance, if you're designing a two-color Gadget to use colors two and
    ; three, and the Gadget will reside in a five-plane display, plane zero
    ; of your imagery would be all ones, bit plane one would have data that
    ; describes the imagery, and bit planes two through four would be
    ; all zeroes.  Using these flags allows you to avoid wasting all that 
    ; memory in this way:  
    ; first, you specify which planes you want your data to appear 
    ; in using the PlanePick variable.  For each bit set in the variable, the 
    ; next "plane" of your image data is blitted to the display.  For each bit
    ; clear in this variable, the corresponding bit in PlaneOnOff is examined.
    ; If that bit is clear, a "plane" of zeroes will be used.  If the bit is 
    ; set, ones will go out instead.  So, for our example:
    ;   Gadget.PlanePick = 0x02;
    ;   Gadget.PlaneOnOff = 0x01;
    ; Note that this also allows for generic Gadgets, like the System Gadgets,
    ; which will work in any number of bit planes
    ; Note also that if you want an Image that is only a filled rectangle,
    ; you can get this by setting PlanePick to zero (pick no planes of data)
    ; and set PlaneOnOff to describe the pen color of the rectangle.
    ;
    ; NOTE:  Intuition relies on PlanePick to know how many planes
    ; of data are found in ImageData.  There should be no more
    ; '1'-bits in PlanePick than there are planes in ImageData.
    BYTE ig_PlanePick
    BYTE ig_PlaneOnOff

    ; if the NextImage variable is not NULL, Intuition presumes that 
    ; it points to another Image structure with another Image to be 
    ; rendered
    APTR ig_NextImage


    LABEL ig_SIZEOF




; ======================================================================== 
; === IntuiMessage ======================================================= 
; ======================================================================== 
 STRUCTURE IntuiMessage,0

    STRUCT im_ExecMessage,MN_SIZE

    ; the Class bits correspond directly with the IDCMP Flags, except for the
    ; special bit IDCMP_LONELYMESSAGE (defined below)
    LONG im_Class

    ; the Code field is for special values like MENU number 
    WORD im_Code

    ; the Qualifier field is a copy of the current InputEvent's Qualifier
    WORD im_Qualifier

    ; IAddress contains particular addresses for Intuition functions, like
    ; the pointer to the Gadget or the Screen
    APTR im_IAddress

    ; when getting mouse movement reports, any event you get will have the
    ; the mouse coordinates in these variables.  the coordinates are relative
    ; to the upper-left corner of your Window (WFLG_GIMMEZEROZERO
    ; notwithstanding)
    ; If the DELTAMOVE IDCMP flag is set, these values will be deltas from
    ; the last reported position.
    WORD im_MouseX
    WORD im_MouseY

    ; the time values are copies of the current system clock time.  Micros
    ; are in units of microseconds, Seconds in seconds.
    LONG im_Seconds
    LONG im_Micros

    ; the IDCMPWindow variable will always have the address of the Window of
    ; this IDCMP
    APTR im_IDCMPWindow

    ; system-use variable
    APTR im_SpecialLink

    LABEL  im_SIZEOF

* New for V39:
* All IntuiMessages are now slightly extended.	The ExtIntuiMessage
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

 STRUCTURE ExtIntuiMessage,0

    STRUCT eim_IntuiMessage,im_SIZEOF
    APTR eim_TabletData


; --- IDCMP Classes ------------------------------------------------------
; Please refer to the Autodoc for OpenWindow() and to the Rom Kernel
; Manual for full details on the IDCMP classes.

IDCMP_SIZEVERIFY	EQU	$00000001
IDCMP_NEWSIZE		EQU	$00000002
IDCMP_REFRESHWINDOW	EQU	$00000004
IDCMP_MOUSEBUTTONS	EQU	$00000008
IDCMP_MOUSEMOVE		EQU	$00000010
IDCMP_GADGETDOWN	EQU	$00000020
IDCMP_GADGETUP		EQU	$00000040
IDCMP_REQSET		EQU	$00000080
IDCMP_MENUPICK		EQU	$00000100
IDCMP_CLOSEWINDOW	EQU	$00000200
IDCMP_RAWKEY		EQU	$00000400
IDCMP_REQVERIFY		EQU	$00000800
IDCMP_REQCLEAR		EQU	$00001000
IDCMP_MENUVERIFY	EQU	$00002000
IDCMP_NEWPREFS		EQU	$00004000
IDCMP_DISKINSERTED	EQU	$00008000
IDCMP_DISKREMOVED	EQU	$00010000
IDCMP_WBENCHMESSAGE	EQU	$00020000	; System use only
IDCMP_ACTIVEWINDOW	EQU	$00040000
IDCMP_INACTIVEWINDOW	EQU	$00080000
IDCMP_DELTAMOVE		EQU	$00100000
IDCMP_VANILLAKEY	EQU	$00200000
IDCMP_INTUITICKS	EQU	$00400000
;  for notifications from "boopsi" gadgets:
IDCMP_IDCMPUPDATE	EQU	$00800000	; new for V36
; for getting help key report during menu session:
IDCMP_MENUHELP		EQU	$01000000	; new for V36
; for notification of any move/size/zoom/change window:
IDCMP_CHANGEWINDOW	EQU	$02000000	; new for V36
IDCMP_GADGETHELP	EQU	$04000000	; new for V39

; NOTEZ-BIEN:		$80000000 is reserved for internal use by IDCMP

; the IDCMP Flags do not use this special bit, which is cleared when
; Intuition sends its special message to the Task, and set when Intuition
; gets its Message back from the Task.	Therefore, I can check here to
; find out fast whether or not this Message is available for me to send
IDCMP_LONELYMESSAGE	EQU	$80000000



; --- IDCMP Codes --------------------------------------------------------
; This group of codes is for the IDCMP_CHANGEWINDOW message
CWCODE_MOVESIZE	EQU	$0000	; Window was moved and/or sized
CWCODE_DEPTH	EQU	$0001	; Window was depth-arranged (new for V39)

; This group of codes is for the IDCMP_MENUVERIFY message
MENUHOT		EQU	$0001	; IntuiWants verification or MENUCANCEL
MENUCANCEL	EQU	$0002	; HOT Reply of this cancels Menu operation
MENUWAITING	EQU	$0003	; Intuition simply wants a ReplyMsg() ASAP

; These are internal tokens to represent state of verification attempts
; shown here as a clue.
OKOK		EQU	MENUHOT		; guy didn't care
OKABORT		EQU	$0004		; window rendered question moot
OKCANCEL 	EQU	MENUCANCEL 	; window sent cancel reply

; This group of codes is for the IDCMP_WBENCHMESSAGE messages
WBENCHOPEN	EQU $0001
WBENCHCLOSE	EQU $0002

; A data structure common in V36 Intuition processing

 STRUCTURE	IBox,0
    WORD	ibox_Left
    WORD	ibox_Top
    WORD	ibox_Width
    WORD	ibox_Height
 LABEL	ibox_SIZEOF


; ======================================================================== 
; === Window ============================================================= 
; ======================================================================== 
 STRUCTURE Window,0

    APTR wd_NextWindow		; for the linked list of a Screen

    WORD wd_LeftEdge		; screen dimensions
    WORD wd_TopEdge		; screen dimensions
    WORD wd_Width		; screen dimensions
    WORD wd_Height		; screen dimensions

    WORD wd_MouseY		; relative top top-left corner 
    WORD wd_MouseX		; relative top top-left corner 

    WORD wd_MinWidth		; minimum sizes
    WORD wd_MinHeight		; minimum sizes
    WORD wd_MaxWidth		; maximum sizes
    WORD wd_MaxHeight		; maximum sizes

    LONG wd_Flags		; see below for definitions

    APTR wd_MenuStrip		; first in a list of menu headers

    APTR wd_Title		; title text for the Window

    APTR wd_FirstRequest	; first in linked list of active Requesters 
    APTR wd_DMRequest		; the double-menu Requester 
    WORD wd_ReqCount		; number of Requesters blocking this Window
    APTR wd_WScreen		; this Window's Screen
    APTR wd_RPort		; this Window's very own RastPort

    ; the border variables describe the window border.  If you specify
    ; WFLG_GIMMEZEROZERO when you open the window, then the upper-left of the
    ; ClipRect for this window will be upper-left of the BitMap (with correct
    ; offsets when in SuperBitMap mode; you MUST select WFLG_GIMMEZEROZERO
    ; when using SuperBitMap).  If you don't specify ZeroZero, then you save
    ; memory (no allocation of RastPort, Layer, ClipRect and associated
    ; Bitmaps), but you also must offset all your writes by BorderTop,
    ; BorderLeft and do your own mini-clipping to prevent writing over the
    ; system gadgets
    BYTE wd_BorderLeft
    BYTE wd_BorderTop
    BYTE wd_BorderRight
    BYTE wd_BorderBottom
    APTR wd_BorderRPort

    ; You supply a linked-list of gadget that you want for your Window.
    ; This list DOES NOT include system Gadgets.  You get the standard
    ; window system Gadgets by setting flag-bits in the variable Flags (see
    ; the bit definitions below)
    APTR wd_FirstGadget

    ; these are for opening/closing the windows
    APTR wd_Parent
    APTR wd_Descendant

    ; sprite data information for your own Pointer
    ; set these AFTER you Open the Window by calling SetPointer()
    APTR wd_Pointer
    BYTE wd_PtrHeight
    BYTE wd_PtrWidth
    BYTE wd_XOffset
    BYTE wd_YOffset

    ; the IDCMP Flags and User's and Intuition's Message Ports
    ULONG wd_IDCMPFlags
    APTR wd_UserPort
    APTR wd_WindowPort
    APTR wd_MessageKey

    BYTE wd_DetailPen
    BYTE wd_BlockPen

    ; the CheckMark is a pointer to the imagery that will be used when
    ; rendering MenuItems of this Window that want to be checkmarked
    ; if this is equal to NULL, you'll get the default imagery
    APTR wd_CheckMark

    ; if non-null, Screen title when Window is active 
    APTR wd_ScreenTitle

    ; These variables have the mouse coordinates relative to the 
    ; inner-Window of WFLG_GIMMEZEROZERO Windows.  This is compared with the
    ; MouseX and MouseY variables, which contain the mouse coordinates
    ; relative to the upper-left corner of the Window, WFLG_GIMMEZEROZERO
    ; notwithstanding
    WORD wd_GZZMouseX
    WORD wd_GZZMouseY
    ; these variables contain the width and height of the inner-Window of
    ; WFLG_GIMMEZEROZERO Windows
    WORD wd_GZZWidth
    WORD wd_GZZHeight

    APTR wd_ExtData

    ; general-purpose pointer to User data extension 
    APTR wd_UserData
    APTR wd_WLayer	; stash of Window.RPort->Layer

    ; NEW 1.2: need to keep track of the font that OpenWindow opened,
    ; in case user SetFont's into RastPort
    APTR  wd_IFont

    ; (V36) another flag word (the Flags field is used up).
    ; At present, all flag values are system private.
    ; Until further notice, you may not change nor use this field.
    ULONG wd_MoreFlags

    ; ----- subsequent fields are INTUITION PRIVATE ---

    LABEL wd_Size
    LABEL wd_SIZEOF	; you should never use this: only Intuition allocates

; --- Flags requested at OpenWindow() time by the application -------------
WFLG_SIZEGADGET	EQU $0001	; include sizing system-gadget?
WFLG_DRAGBAR		EQU $0002	; include dragging system-gadget?
WFLG_DEPTHGADGET	EQU $0004	; include depth arrangement gadget?
WFLG_CLOSEGADGET	EQU $0008	; include close-box system-gadget?

WFLG_SIZEBRIGHT		EQU $0010	; size gadget uses right border
WFLG_SIZEBBOTTOM	EQU $0020	; size gadget uses bottom border

; --- refresh modes ----------------------------------------------------------
; combinations of the WFLG_REFRESHBITS select the refresh type
WFLG_REFRESHBITS	EQU $00C0
WFLG_SMART_REFRESH	EQU $0000
WFLG_SIMPLE_REFRESH	EQU $0040
WFLG_SUPER_BITMAP	EQU $0080
WFLG_OTHER_REFRESH	EQU $00C0

WFLG_BACKDROP		EQU $0100	; this is a backdrop window

WFLG_REPORTMOUSE	EQU $0200	; set this to hear every mouse move

WFLG_GIMMEZEROZERO	EQU $0400	; make extra border stuff

WFLG_BORDERLESS		EQU $0800	; set this to get a Window sans border

WFLG_ACTIVATE		EQU $1000	; when Window opens, it's the Active
					; one 

; --- Other User Flags -------------------------------------------------------
WFLG_RMBTRAP    	EQU $00010000	; Catch RMB events for your own 
WFLG_NOCAREREFRESH	EQU $00020000	; not to be bothered with REFRESH

; - V36 new Flags which the programmer may specify in NewScreen.Flags 
WFLG_NW_EXTENDED	EQU $00040000	; extension data provided
					; see ExtNewWindow structure
; - V39 new Flags which the programmer may specify in NewScreen.Flags 
WFLG_NEWLOOKMENUS	EQU $00200000	; window has NewLook menus


; These flags are set only by Intuition.  YOU MAY NOT SET THEM YOURSELF!
WFLG_WINDOWACTIVE	EQU $2000	; this window is the active one 
WFLG_INREQUEST    	EQU $4000	; this window is in request mode 
WFLG_MENUSTATE    	EQU $8000	; this Window is active with its
					; Menus on 
WFLG_WINDOWREFRESH	EQU $01000000	; Window is currently refreshing
WFLG_WBENCHWINDOW	EQU $02000000	; WorkBench Window
WFLG_WINDOWTICKED	EQU $04000000	; only one timer tick at a time

; V36 and higher flags to be set only by Intuition:
WFLG_VISITOR		EQU $08000000	; visitor window (see autodoc for OpenWindow)
WFLG_ZOOMED		EQU $10000000	; identifies "zoom state"
WFLG_HASZOOM		EQU $20000000	; window has a zoom gadget


SUPER_UNUSED	EQU $FCFC0000	; OBSOLETE (was bits of Flag unused yet)


; --- Other Window Values ---------------------------------------------- 
DEFAULTMOUSEQUEUE	EQU 5	 ; no more mouse messages


; --- see struct IntuiMessage for the IDCMP Flag definitions -----------------


; ======================================================================== 
; === NewWindow ========================================================== 
; ======================================================================== 
; NOTE: to use the new features of V36, you may need to use the
; ExtNewWindow structure, below.
 STRUCTURE NewWindow,0

    WORD nw_LeftEdge		; initial Window dimensions
    WORD nw_TopEdge		; initial Window dimensions
    WORD nw_Width		; initial Window dimensions
    WORD nw_Height		; initial Window dimensions

    BYTE nw_DetailPen		; for rendering the detail bits of the Window
    BYTE nw_BlockPen		; for rendering the block-fill bits 

    LONG nw_IDCMPFlags		; initial IDCMP state

    LONG nw_Flags		; see the Flag definition under Window

    ; You supply a linked-list of Gadgets for your Window.
    ; This list DOES NOT include system Gadgets.  You get the standard
    ; system Window Gadgets by setting flag-bits in the variable Flags (see
    ; the bit definitions under the Window structure definition)
    APTR	nw_FirstGadget

    ; the CheckMark is a pointer to the imagery that will be used when 
    ; rendering MenuItems of this Window that want to be checkmarked
    ; if this is equal to NULL, you'll get the default imagery
    APTR nw_CheckMark

    APTR nw_Title		; title text for the Window

    ; the Screen pointer is used only if you've defined a CUSTOMSCREEN and
    ; want this Window to open in it.  If so, you pass the address of the
    ; Custom Screen structure in this variable.  Otherwise, this variable
    ; is ignored and doesn't have to be initialized.
    APTR nw_Screen

    ; WFLG_SUPER_BITMAP Window?  If so, put the address of your BitMap
    ; structure in this variable.  If not, this variable is ignored and
    ; doesn't have to be initialized
    APTR nw_BitMap

    ; the values describe the minimum and maximum sizes of your Windows.
    ; these matter only if you've chosen the WFLG_SIZEGADGET Gadget option,
    ; which means that you want to let the User to change the size of
    ; this Window.  You describe the minimum and maximum sizes that the
    ; Window can grow by setting these variables.  You can initialize
    ; any one these to zero, which will mean that you want to duplicate
    ; the setting for that dimension (if MinWidth == 0, MinWidth will be
    ; set to the opening Width of the Window).
    ; You can change these settings later using SetWindowLimits().
    ; If you haven't asked for a GTYP_SIZING Gadget, you don't have to
    ; initialize any of these variables.
    WORD nw_MinWidth
    WORD nw_MinHeight
    WORD nw_MaxWidth
    WORD nw_MaxHeight

    ; the type variable describes the Screen in which you want this Window to
    ; open.  The type value can either be CUSTOMSCREEN or one of the
    ; system standard Screen Types such as WBENCHSCREEN.  See the
    ; type definitions under the Screen structure
    ; A new possible value for this field is PUBLICSCREEN, which
    ; defines the window as a 'visitor' window.  See below for
    ; additional information provided.
    WORD nw_Type

    LABEL nw_SIZE
    LABEL nw_SIZEOF

; ExtNewWindow -- NewWindow plus extension fields.
; This structure may be extended again, so programs depending on its
; size are incorrect.

 STRUCTURE ExtNewWindow,nw_SIZE

    ; extensions for V36
    ; if the NewWindow Flag WFLG_NW_EXTENDED is set, then
    ; this field is assumed to point to an array (or chain of arrays)
    ; of TagItem structures.  See also ExtNewScreen for another
    ; use of TagItems to pass optional data.
    ;
    ; see below for tag values and the corresponding data

    APTR	enw_Extension	; pointer to TagItem array
    LABEL enw_SIZEOF

* The TagItem ID's (ti_Tag values) for OpenWindowTagList() follow.
* They are values in a TagItem array passed as extension/replacement
* values for the data in NewWindow.  OpenWindowTagList() can actually
* work well with a NULL NewWindow pointer.

    ENUM TAG_USER+100

    ; these tags simply override NewWindow parameters
    EITEM WA_Left
    EITEM WA_Top
    EITEM WA_Width
    EITEM WA_Height
    EITEM WA_DetailPen
    EITEM WA_BlockPen
    EITEM WA_IDCMP
    EITEM WA_Flags	; not implemented at present
    EITEM WA_Gadgets
    EITEM WA_Checkmark
    EITEM WA_Title
    EITEM WA_ScreenTitle	; means you don't have to call SetWindowTitles
				; after you open your window

    EITEM WA_CustomScreen
    EITEM WA_SuperBitMap	; also implies WFLG_SUPER_BITMAP property
    EITEM WA_MinWidth
    EITEM WA_MinHeight
    EITEM WA_MaxWidth
    EITEM WA_MaxHeight

    ; The following are specifications for new features

    EITEM WA_InnerWidth
    EITEM WA_InnerHeight ; You can specify the dimensions of the interior
			 ; region of your window, independent of what
			 ; the border widths will be.  You probably want
			 ; to also specify WA_AutoAdjust to allow
			 ; Intuition to move your window or even
			 ; shrink it so that it is completely on screen.

    EITEM WA_PubScreenName	; declares that you want the window to open as
			 ; a visitor on the public screen whose name is
			 ; pointed to by (UBYTE *) ti_Data

    EITEM WA_PubScreen	; open as a visitor window on the public screen
			; whose address is in (struct Screen *) ti_Data.
			; To ensure that this screen remains open, you
			; should either be the screen's owner, have a
			; window open on the screen, or use LockPubScreen().

    EITEM WA_PubScreenFallBack	; A Boolean, specifies whether a visitor window
			 ; should "fall back" to the default public screen
			 ; (or Workbench) if the named public screen isn't
			 ; available

    EITEM WA_WindowName	; not implemented
    EITEM WA_Colors	; a ColorSpec array for colors to be set
			; when this window is active.  This is not
			; implemented, and may not be, since the default
			; values to restore would be hard to track.
			; We'd like to at least support per-window colors
			; for the mouse pointer sprite.

    EITEM WA_Zoom	; ti_Data points to an array of four WORD's,
			; the initial Left/Top/Width/Height values of
			; the "alternate" zoom position/dimensions.
			; It also specifies that you want a Zoom gadget
			; for your window, whether or not you have a
			; sizing gadget.

    EITEM WA_MouseQueue	; ti_Data contains initial value for the mouse
			; message backlog limit for this window.

    EITEM WA_BackFill	; provides a "backfill hook" for your window's Layer.
			; See layers.library/CreateUpfrontHookLayer().

    EITEM WA_RptQueue	; initial value of repeat key backlog limit

    ; These Boolean tag items are alternatives to the NewWindow.Flags
    ; boolean flags with similar names.

    EITEM WA_SizeGadget
    EITEM WA_DragBar
    EITEM WA_DepthGadget
    EITEM WA_CloseGadget
    EITEM WA_Backdrop
    EITEM WA_ReportMouse
    EITEM WA_NoCareRefresh
    EITEM WA_Borderless
    EITEM WA_Activate
    EITEM WA_RMBTrap
    EITEM WA_WBenchWindow	; PRIVATE!!
    EITEM WA_SimpleRefresh	; only specify if TRUE
    EITEM WA_SmartRefresh	; only specify if TRUE
    EITEM WA_SizeBRight
    EITEM WA_SizeBBottom

    ; New Boolean properties
    EITEM WA_AutoAdjust	; shift or squeeze the window's position and
			; dimensions to fit it on screen.

    EITEM WA_GimmeZeroZero	; equiv. to NewWindow.Flags WFLG_GIMMEZEROZERO

    ; New for V37: WA_MenuHelp (ignored by V36)
    EITEM WA_MenuHelp	; Enables IDCMP_MENUHELP:  Pressing HELP during menus
			; will return IDCMP_MENUHELP IDCMP message.

    ; New for V39:  (ignored by V37 and earlier)
    EITEM WA_NewLookMenus
			; Set to TRUE if you want NewLook menus

    EITEM WA_AmigaKey	; Pointer to image for Amiga-key equiv in menus

    EITEM WA_NotifyDepth
			; Requests IDCMP_CHANGEWINDOW message when
			; window is depth arranged
			; (imsg->Code = CWCODE_DEPTH)

    EITEM WA_Obsolete

    EITEM WA_Pointer
			; Allows you to specify a custom pointer
			; for your window.  ti_Data points to a
			; pointer object you obtained via
			; "pointerclass". NULL signifies the
			; default pointer.
			; This tag may be passed to OpenWindowTags()
			; or SetWindowPointer().

    EITEM WA_BusyPointer
			; ti_Data is boolean.  Set to TRUE to
			; request the standard busy pointer.
			; This tag may be passed to OpenWindowTags()
			; or SetWindowPointer().

    EITEM WA_PointerDelay
			; ti_Data is boolean.  Set to TRUE to
			; request that the changing of the
			; pointer be slightly delayed.	The change
			; will be called off if you call NewSetPointer()
			; before the delay expires.  This allows
			; you to post a busy-pointer even if you think
			; the busy-time may be very short, without
			; fear of a flashing pointer.
			; This tag may be passed to OpenWindowTags()
			; or SetWindowPointer().

    EITEM WA_TabletMessages
			; ti_Data is a boolean.  Set to TRUE to
			; request that tablet information be included
			; in IntuiMessages sent to your window.
			; Requires that something (i.e. a tablet driver)
			; feed IESUBCLASS_NEWTABLET InputEvents into
			; the system.  For a pointer to the TabletData,
			; examine the ExtIntuiMessage->eim_TabletData
			; field.  It is UNSAFE to check this field
			; when running on pre-V39 systems.  It's always
			; safe to check this field under V39 and up,
			; though it may be NULL.

    EITEM WA_HelpGroup
			; When the active window has gadget help enabled,
			; other windows of the same HelpGroup number
			; will also get GadgetHelp.  This allows GadgetHelp
			; to work for multi-windowed applications.
			; Use GetGroupID() to get an ID number.  Pass
			; this number as ti_Data to all your windows.
			; See also the HelpControl() function.

    EITEM WA_HelpGroupWindow
			; When the active window has gadget help enabled,
			; other windows of the same HelpGroup will also get
			; GadgetHelp.  This allows GadgetHelp to work
			; for multi-windowed applications.  As an alternative
			; to WA_HelpGroup, you can pass a pointer to any
			; other window of the same group to join its help
			; group.  Defaults to NULL, which has no effect.
			; See also the HelpControl() function.


*** End of Window attribute enumeration ***


* HelpControl() flags:
*
* HC_GADGETHELP - Set this flag to enable Gadget-Help for one or more
* windows.

HC_GADGETHELP	EQU	1


	IFND INTUITION_SCREENS_I
	INCLUDE "intuition/screens.i"
	ENDC

	IFND INTUITION_PREFERENCES_I
	INCLUDE "intuition/preferences.i"
	ENDC

; ========================================================================
; === Remember ===========================================================
; ========================================================================
; this structure is used for remembering what memory has been allocated to
; date by a given routine, so that a premature abort or systematic exit
; can deallocate memory cleanly, easily, and completely
 STRUCTURE Remember,0

    APTR rm_NextRemember
    LONG rm_RememberSize
    APTR rm_Memory

 LABEL    rm_SIZEOF

* How to tell Intuition about RGB values for a color table entry.
* NOTE:  The way the structure was defined, the color value was
* right-justified within each UWORD.  This poses problems for
* extensibility to more bits-per-gun.  The SA_Colors32 tag to
* OpenScreenTags() provides an alternate way to specify colors
* with greater precision.

 STRUCTURE ColorSpec,0

    WORD cs_ColorIndex	; -1 terminates an array of ColorSpec
    UWORD cs_Red	; only the _bottom_ 4 bits recognized
    UWORD cs_Green	; only the _bottom_ 4 bits recognized
    UWORD cs_Blue	; only the _bottom_ 4 bits recognized
 LABEL	cs_SIZEOF

* === Easy Requester Specification ======================================= *
* see also autodocs for EasyRequest and BuildEasyRequest
* NOTE: This structure may grow in size in the future

 STRUCTURE EasyStruct,0

    ULONG es_StructSize		; should be EasyStruct_SIZEOF
    ULONG es_Flags		; should be 0 for now
    APTR  es_Title		; title of requester window
    APTR  es_TextFormat		; 'printf' style formatting string
    APTR  es_GadgetFormat	; 'printf' style formatting string
 LABEL	EasyStruct_SIZEOF	; was es_SIZEOF, but we renamed it due
 				; to an unfortunate collision with
 				; graphics ExtSprite's es_SIZEOF



; ========================================================================
; === Miscellaneous ======================================================
; ========================================================================

; = MACROS ==============================================================
;#define MENUNUM(n) (n & 0x1F)
;#define ITEMNUM(n) ((n >> 5) & 0x003F)
;#define SUBNUM(n) ((n >> 11) & 0x001F)
;
;#define SHIFTMENU(n) (n & 0x1F)
;#define SHIFTITEM(n) ((n & 0x3F) << 5)
;#define SHIFTSUB(n) ((n & 0x1F) << 11)
;
;#define SRBNUM(n)  (0x08 - (n >> 4))  /* SerRWBits -> read bits per char */
;#define SWBNUM(n)  (0x08 - (n & 0x0F))/* SerRWBits -> write bits per chr */
;#define SSBNUM(n)  (0x01 + (n >> 4))  /* SerStopBuf -> stop bits per chr */
;#define SPARNUM(n) (n >> 4)	       /* SerParShk -> parity setting	 */
;#define SHAKNUM(n) (n & 0x0F)	       /* SerParShk -> handshake mode	 */
;
; = MENU STUFF ===========================================================
NOMENU EQU	$001F
NOITEM EQU	$003F
NOSUB  EQU	$001F
MENUNULL EQU	$FFFF


; = =RJ='s peculiarities ================================================= 
;#define FOREVER for(;;)
;#define SIGN(x) ( ((x) > 0) - ((x) < 0) )


; these defines are for the COMMSEQ and CHECKIT menu stuff.  If CHECKIT,
; I'll use a generic Width (for all resolutions) for the CheckMark.
; If COMMSEQ, likewise I'll use this generic stuff
CHECKWIDTH	EQU	19
COMMWIDTH	EQU	27
LOWCHECKWIDTH	EQU	13
LOWCOMMWIDTH	EQU	16


; these are the AlertNumber defines.  if you are calling DisplayAlert()
; the AlertNumber you supply must have the ALERT_TYPE bits set to one
; of these patterns
ALERT_TYPE	EQU	$80000000
RECOVERY_ALERT	EQU	$00000000	; the system can recover from this 
DEADEND_ALERT 	EQU	$80000000	; no recovery possible, this is it 


; When you're defining IntuiText for the Positive and Negative Gadgets
; created by a call to AutoRequest(), these defines will get you
; reasonable-looking text.  The only field without a define is the IText
; field; you decide what text goes with the Gadget
AUTOFRONTPEN	EQU	0
AUTOBACKPEN	EQU	1
AUTODRAWMODE	EQU	RP_JAM2
AUTOLEFTEDGE	EQU	6
AUTOTOPEDGE	EQU	3
AUTOITEXTFONT	EQU	0
AUTONEXTTEXT	EQU	0



;* --- RAWMOUSE Codes and Qualifiers (Console OR IDCMP) -------------------
SELECTUP	EQU	(IECODE_LBUTTON+IECODE_UP_PREFIX)
SELECTDOWN	EQU	(IECODE_LBUTTON)
MENUUP		EQU	(IECODE_RBUTTON+IECODE_UP_PREFIX)
MENUDOWN	EQU	(IECODE_RBUTTON)
MIDDLEUP	EQU	(IECODE_MBUTTON+IECODE_UP_PREFIX)
MIDDLEDOWN	EQU	(IECODE_MBUTTON)
ALTLEFT		EQU	(IEQUALIFIER_LALT)
ALTRIGHT	EQU	(IEQUALIFIER_RALT)
AMIGALEFT	EQU	(IEQUALIFIER_LCOMMAND)
AMIGARIGHT	EQU	(IEQUALIFIER_RCOMMAND)
AMIGAKEYS	EQU	(AMIGALEFT+AMIGARIGHT)

CURSORUP	EQU	$4C
CURSORLEFT	EQU	$4F
CURSORRIGHT	EQU	$4E
CURSORDOWN	EQU	$4D
KEYCODE_Q	EQU	$10
KEYCODE_Z	EQU	$31
KEYCODE_X	EQU	$32
KEYCODE_V	EQU	$34
KEYCODE_B	EQU	$35
KEYCODE_N	EQU	$36
KEYCODE_M	EQU	$37
KEYCODE_LESS	EQU	$38
KEYCODE_GREATER	EQU	$39



* New for V39, Intuition supports the IESUBCLASS_NEWTABLET subclass
* of the IECLASS_NEWPOINTERPOS event.  The ie_EventAddress of such
* an event points to a TabletData structure (see <devices/inputevent.i>
* for the definition.)
*
* The TabletData structure contains certain elements including a taglist.
* The taglist can be used for special tablet parameters.  A tablet driver
* should include only those tag-items the tablet supports.  An application
* can listen for any tag-items that interest it.  Note: an application
* must set the WA_TabletMessages attribute to TRUE to receive this
* extended information in its IntuiMessages.
*
* The definitions given here MUST be followed.	Pay careful attention
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
* should be normalized to fill a signed long integer.  Typical devices
* won't generate negative pressure, but the possibility is not precluded.
* The pressure threshold which is considered to cause a button-click is
* expected to be set in a Preferences program supplied by the tablet
* vendor.  The tablet driver would send IECODE_LBUTTON-type events as
* the pressure crossed that threshold.
*
* TABLETA_ButtonBits:  ti_Data is a long integer whose bits are to
* be interpreted at the state of the first 32 buttons of the tablet.
*
* TABLETA_InProximity:  ti_Data is a boolean.  For tablets that support
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

TABLETA_Dummy		EQU	TAG_USER+$3A000
TABLETA_TabletZ		EQU	TABLETA_Dummy+$01
TABLETA_RangeZ		EQU	TABLETA_Dummy+$02
TABLETA_AngleX		EQU	TABLETA_Dummy+$03
TABLETA_AngleY		EQU	TABLETA_Dummy+$04
TABLETA_AngleZ		EQU	TABLETA_Dummy+$05
TABLETA_Pressure	EQU	TABLETA_Dummy+$06
TABLETA_ButtonBits	EQU	TABLETA_Dummy+$07
TABLETA_InProximity	EQU	TABLETA_Dummy+$08
TABLETA_ResolutionX	EQU	TABLETA_Dummy+$09
TABLETA_ResolutionY	EQU	TABLETA_Dummy+$0A


* If your window sets WA_TabletMessages to TRUE, then it will receive
* extended IntuiMessages (struct ExtIntuiMessage) whose eim_TabletData
* field points at a TabletData structure.  This structure contains
* additional information about the input event.

 STRUCTURE TabletData,0
    ; Sub-pixel position of tablet, in screen coordinates,
    ; scaled to fill a UWORD fraction:
    UWORD td_XFraction
    UWORD td_YFraction

    ; Current tablet coordinates along each axis:
    ULONG td_TabletX
    ULONG td_TabletY

    ; Tablet range along each axis.  For example, if td_TabletX
    ; can take values 0-999, td_RangeX should be 1000.
    ULONG td_RangeX
    ULONG td_RangeY

    ; Pointer to tag-list of additional tablet attributes.
    ; See <intuition/intuition.i> for the tag values.
    APTR td_TagList

    LABEL td_SIZEOF

* If a tablet driver supplies a hook for ient_CallBack, it will be
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
* The tablet hook must currently return NULL.  This is the only
* acceptable return-value under V39.

 STRUCTURE TabletHookData,0

    ; Pointer to the active screen:
    ; Note: if there are no open screens, thd_Screen will be NULL.
    ; thd_Width and thd_Height will then describe an NTSC 640x400
    ; screen.  Please scale accordingly.
    APTR thd_Screen

    ; The width and height (measured in pixels of the active screen)
    ; that your are to scale to:
    ULONG thd_Width
    ULONG thd_Height

    ; Non-zero if the screen or something about the screen
    ; changed since the last time you were invoked:
    LONG thd_ScreenChanged

    LABEL thd_SIZEOF

	IFND	INTUITION_INTUITIONBASE_I
	INCLUDE	"intuition/intuitionbase.i"
	ENDC

* Include obsolete identifiers:
	IFND	INTUITION_IOBSOLETE_I
	INCLUDE "intuition/iobsolete.i"
	ENDC

	ENDC
