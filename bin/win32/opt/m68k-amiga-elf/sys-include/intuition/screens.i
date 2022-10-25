	IFND  INTUITION_SCREENS_I
INTUITION_SCREENS_I	SET  1
**
**	$VER: screens.i 38.25 (15.2.1993)
**	Includes Release 45.1
**
**	The Screen and NewScreen structures and attributes
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**
	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND GRAPHICS_GFX_I
	INCLUDE "graphics/gfx.i"
	ENDC

	IFND GRAPHICS_CLIP_I
	INCLUDE "graphics/clip.i"
	ENDC

	IFND GRAPHICS_VIEW_I
	INCLUDE "graphics/view.i"
	ENDC

	IFND GRAPHICS_RASTPORT_I
	INCLUDE "graphics/rastport.i"
	ENDC

	IFND GRAPHICS_LAYERS_I
	INCLUDE "graphics/layers.i"
	ENDC

	IFND UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

*
* NOTE:  intuition/iobsolete.i is included at the END of this file!
*

; ========================================================================
; === DrawInfo =========================================================
; ========================================================================

* This is a packet of information for graphics rendering.  It originates
* with a Screen, and is gotten using GetScreenDrawInfo( screen );

* You can use the Intuition version number to tell which fields are
* present in this structure.
*
* DRI_VERSION of 1 corresponds to V37 release.
* DRI_VERSION of 2 corresponds to V39, and includes three new pens
*	and the dri_CheckMark and dri_AmigaKey fields.
*
* Note that sometimes applications need to create their own DrawInfo
* structures, in which case the DRI_VERSION won't correspond exactly
* to the OS version!!!

DRI_VERSION	EQU	2

 STRUCTURE DrawInfo,0
    UWORD	dri_Version	 ; will be  DRI_VERSION
    UWORD	dri_NumPens	 ; guaranteed to be >= 9
    APTR	dri_Pens	 ; pointer to pen array
    APTR	dri_Font	 ; screen default font
    UWORD	dri_Depth	 ; (initial) depth of screen bitmap
    ; from DisplayInfo database for initial display mode
    UWORD	dri_ResolutionX
    UWORD	dri_ResolutionY
    ULONG	dri_Flags
    ; New for V39: dri_CheckMark, dri_AmigaKey
    APTR	dri_CheckMark    ; pointer to scaled checkmark image
				 ; Will be NULL if DRI_VERSION < 2
    APTR	dri_AmigaKey     ; pointer to scaled Amiga-key image
				 ; Will be NULL if DRI_VERSION < 2
   STRUCT   	dri_longreserved,20

DRIF_NEWLOOK	EQU	$00000001 ; specified SA_Pens, full treatment
DRIB_NEWLOOK	EQU	0

    ; rendering pen number indexes into DrawInfo.dri_Pens[]
    ENUM
    EITEM	DETAILPEN	; compatible Intuition rendering pens
    EITEM	BLOCKPEN,
    EITEM	TEXTPEN		; text on background (pen = 0)
    EITEM	SHINEPEN	; bright edge on bas-relief
    EITEM	SHADOWPEN	; dark edge
    EITEM	FILLPEN		; active window fill
    EITEM	FILLTEXTPEN	; text over FILLPEN
    EITEM	BACKGROUNDPEN	; may not always be color 0
    EITEM	HIGHLIGHTTEXTPEN  ; highlighted text, against BACKGROUNDPEN
; New for V39, only present if DRI_VERSION >= 2:
    EITEM	BARDETAILPEN	; text/detail in screen-bar/menus
    EITEM	BARBLOCKPEN	; screen-bar/menus fill
    EITEM	BARTRIMPEN	; trim under menu-bar

    EITEM	NUMDRIPENS

* New for V39:  It is sometimes useful to specify that a pen value
* is to be the complement of color zero to three.  The "magic" numbers
* serve that purpose:

PEN_C3		EQU	$FEFC		; Complement of color 3
PEN_C2		EQU	$FEFD		; Complement of color 2
PEN_C1		EQU	$FEFE		; Complement of color 1
PEN_C0		EQU	$FEFF		; Complement of color 0

; ======================================================================== 
; === Screen ============================================================= 
; ======================================================================== 

* VERY IMPORTANT NOTE ABOUT Screen->BitMap.  In the future, bitmaps
* will need to grow.  The embedded instance of a bitmap in the screen
* will no longer be large enough to hold the whole description of
* the bitmap.
*
* YOU ARE STRONGLY URGED to use Screen->RastPort.BitMap in place of
* &Screen->BitMap whenever and whereever possible.

 STRUCTURE Screen,0

    APTR sc_NextScreen		; linked list of screens
    APTR sc_FirstWindow		; linked list Screen's Windows

    WORD sc_LeftEdge		; parameters of the screen
    WORD sc_TopEdge		; parameters of the screen

    WORD sc_Width
    WORD sc_Height

    WORD sc_MouseY		; position relative to upper-left
    WORD sc_MouseX		; position relative to upper-left

    WORD sc_Flags		; see definitions below

    APTR sc_Title		; null-terminated Title text
    APTR sc_DefaultTitle	; for Windows without ScreenTitle

    ; Bar sizes for this Screen and all Window's in this Screen
    BYTE sc_BarHeight
    BYTE sc_BarVBorder
    BYTE sc_BarHBorder
    BYTE sc_MenuVBorder
    BYTE sc_MenuHBorder
    BYTE sc_WBorTop
    BYTE sc_WBorLeft
    BYTE sc_WBorRight
    BYTE sc_WBorBottom

    BYTE sc_KludgeFill00	; This is strictly for word-alignment 

    ; the display data structures for this Screen
    APTR sc_Font			; this screen's default font
    STRUCT sc_ViewPort,vp_SIZEOF	; describing the Screen's display
    STRUCT sc_RastPort,rp_SIZEOF	; describing Screen rendering
    STRUCT sc_BitMap,bm_SIZEOF		; SEE WARNING ABOVE!
    STRUCT sc_LayerInfo,li_SIZEOF	; each screen gets a LayerInfo

    APTR sc_FirstGadget

    BYTE sc_DetailPen		; for bar/border/gadget rendering
    BYTE sc_BlockPen		; for bar/border/gadget rendering

    ; the following variable(s) are maintained by Intuition to support the
    ; DisplayBeep() color flashing technique
    WORD sc_SaveColor0

    ; This layer is for the Screen and Menu bars
    APTR sc_BarLayer 		; was "BarLayer"

    APTR sc_ExtData

    APTR sc_UserData		; general-purpose pointer to User data 

    LABEL sc_SIZEOF	; actually, you have no business talking about
			; or relying on the size of a screen structure


; --- FLAGS SET BY INTUITION -------------------------------------------------
; The SCREENTYPE bits are reserved for describing various Screen types
; available under Intuition.  
SCREENTYPE	EQU	$000F	; all the screens types available 
; --- the definitions for the Screen Type ------------------------------------
WBENCHSCREEN	EQU	$0001	; identifies the Workbench screen
PUBLICSCREEN	EQU	$0002	; public shared (custom) screen
CUSTOMSCREEN	EQU	$000F	; for that special look

SHOWTITLE	EQU	$0010	; this gets set by a call to ShowTitle() 

BEEPING    	EQU	$0020	; set when Screen is beeping 

CUSTOMBITMAP	EQU	$0040	; if you are supplying your own BitMap

SCREENBEHIND	EQU	$0080	; if you want your screen to open behind
				; already open screens

SCREENQUIET	EQU	$0100	; if you do not want Intuition to render
				; into your screen (gadgets, title)

SCREENHIRES	EQU	$0200	; do not use lowres gadgets (set by intuition)

STDSCREENHEIGHT	EQU	-1	; supply in NewScreen.Height
STDSCREENWIDTH	EQU	-1	; supply in NewScreen.Width

NS_EXTENDED	EQU	$1000	; means ns_Extenion is valid
AUTOSCROLL	EQU	$4000	; automatic scrolling of large raster

* New for V39:
PENSHARED	EQU	$0400	; Screen opener set {SA_SharePens,TRUE}

* Screen attribute tag ID's.  These are used in the ti_Tag field of
* TagItem arrays passed to OpenScreenTagList() (or in the
* ExtNewScreen.Extension field).

* Screen attribute tags.  Please use these versions, not those in
* iobsolete.h.

 ENUM TAG_USER+33
*
*   these items specify items equivalent to fields in NewScreen
    EITEM SA_Left	; traditional screen positions	and dimensions
    EITEM SA_Top
    EITEM SA_Width
    EITEM SA_Height
    EITEM SA_Depth	; screen bitmap depth
    EITEM SA_DetailPen	; serves as default for windows, too
    EITEM SA_BlockPen
    EITEM SA_Title	; default screen title

    EITEM SA_Colors	; ti_Data is an array of struct ColorSpec,
			; terminated by ColorIndex = -1.  Specifies
			; initial screen palette colors.
			; Also see SA_Colors32 for use under V39.

    EITEM SA_ErrorCode	; ti_Data points to LONG error code (values below)
    EITEM SA_Font	; equiv. to NewScreen.Font
    EITEM SA_SysFont	; Selects one of the preferences system fonts:
			;	0 - old DefaultFont, fixed-width
			;	1 - WB Screen preferred font


    EITEM SA_Type	; ti_Data is PUBLICSCREEN or CUSTOMSCREEN.  For other
			; fields of NewScreen.Type, see individual tags,
			; eg. SA_Behind, SA_Quiet.

    EITEM SA_BitMap	; ti_Data is pointer to custom BitMap.	This
			; implies type of CUSTOMBITMAP

    EITEM SA_PubName	; presence of this tag means that the screen
			; is to be a public screen.  Please specify
			; BEFORE the two tags below

    EITEM SA_PubSig
    EITEM SA_PubTask	; Task ID and signal for being notified that
			; the last window has closed on a public screen.


    EITEM SA_DisplayID	; ti_Data is new extended display ID from
			; <graphics/displayinfo.i> (V37) or from
			; <graphics/modeid.i> (V39 and up)

    EITEM SA_DClip	; ti_Data points to a rectangle which defines
			; screen display clip region

    EITEM SA_Overscan	; Set to one of the OSCAN_
			; specifiers below to get a system standard
			; overscan region for your display clip,
			; screen dimensions (unless otherwise specified),
			; and automatically centered position (partial
			; support only so far).

    EITEM SA_Obsolete1	; obsolete S_MONITORNAME

*   booleans *
    EITEM SA_ShowTitle	; boolean equivalent to flag SHOWTITLE
    EITEM SA_Behind	; boolean equivalent to flag SCREENBEHIND
    EITEM SA_Quiet	; boolean equivalent to flag SCREENQUIET
    EITEM SA_AutoScroll	; boolean equivalent to flag AUTOSCROLL
    EITEM SA_Pens	; array as in DrawInfo, terminated by -1
    EITEM SA_FullPalette ; boolean: initialize color table to entire
			 ;  preferences palette (32 for V36), rather
			 ; than compatible pens 0-3, 17-19, with
			 ; remaining palette as returned by GetColorMap()


    EITEM SA_ColorMapEntries ; New for V39:
			; Allows you to override the number of entries
			; in the ColorMap for your screen.  Intuition
			; normally allocates (1<<depth) or 32, whichever
			; is more, but you may require even more if you
			; use certain V39 graphics.library features
			; (eg. palette-banking).

    EITEM SA_Parent	; New for V39:
			; ti_Data is a pointer to a "parent" screen to
			; attach this one to.  Attached screens slide
			; and depth-arrange together.

    EITEM SA_Draggable	; New for V39:
			; Boolean tag allowing non-draggable screens.
			; Do not use without good reason!
			; (Defaults to TRUE).

    EITEM SA_Exclusive	; New for V39:
			; Boolean tag allowing screens that won't share
			; the display.  Use sparingly!  Starting with 3.01,
			; attached screens may be SA_Exclusive.  Setting
			; SA_Exclusive for each screen will produce an
			; exclusive family.   (Defaults to FALSE).

    EITEM SA_SharePens	; New for V39:
			; For those pens in the screen's DrawInfo->dri_Pens,
			; Intuition obtains them in shared mode (see
			; graphics.library/ObtainPen()).  For compatibility,
			; Intuition obtains the other pens of a public
			; screen as PEN_EXCLUSIVE.  Screens that wish to
			; manage the pens themselves should generally set
			; this tag to TRUE.  This instructs Intuition to
			; leave the other pens unallocated.

    EITEM SA_BackFill	; New for V39:
			; provides a "backfill hook" for your screen's
			; Layer_Info.
			; See layers.library/InstallLayerInfoHook()

    EITEM SA_Interleaved	; New for V39:
			; Boolean tag requesting that the bitmap
			; allocated for you be interleaved.
			; (Defaults to FALSE).

    EITEM SA_Colors32	; New for V39:
			; Tag to set the screen's initial palette colors
			; at 32 bits-per-gun.  ti_Data is a pointer
			; to a table to be passed to the
			; graphics.library/LoadRGB32() function.
			; This format supports both runs of color
			; registers and sparse registers.  See the
			; autodoc for that function for full details.
			; Any color set here has precedence over
			; the same register set by SA_Colors.

    EITEM SA_VideoControl	; New for V39:
			; ti_Data is a pointer to a taglist that Intuition
			; will pass to graphics.library/VideoControl(),
			; upon opening the screen.

    EITEM SA_FrontChild	; New for V39:
			; ti_Data is a pointer to an already open screen
			; that is to be the child of the screen being
			; opened.  The child screen will be moved to the
			; front of its family.

    EITEM SA_BackChild	; New for V39:
			; ti_Data is a pointer to an already open screen
			; that is to be the child of the screen being
			; opened.  The child screen will be moved to the
			; back of its family.

    EITEM SA_LikeWorkbench ; New for V39:
			; Set ti_Data to 1 to request a screen which
			; is just like the Workbench.  This gives
			; you the same screen mode, depth, size,
			; colors, etc., as the Workbench screen.

    EITEM SA_Reserved	; Reserved for private Intuition use

    EITEM SA_MinimizeISG ; New for V40:
			; For compatibility, Intuition always ensures
			; that the inter-screen gap is at least three
			; non-interlaced lines.  If your application
			; would look best with the smallest possible
			; inter-screen gap, set ti_Data to TRUE.
			; If you use the new graphics VideoControl()
			; VC_NoColorPaletteLoad tag for your screen's
			; ViewPort, you should also set this tag.



* OpenScreen error codes, which are returned in the (optional) LONG
* pointed to by ti_Data for the SA_ErrorCode tag item

OSERR_NOMONITOR		EQU (1)	; named monitor spec not available
OSERR_NOCHIPS		EQU (2)	; you need newer custom chips	
OSERR_NOMEM		EQU (3)	; couldn't get normal memory
OSERR_NOCHIPMEM		EQU (4)	; couldn't get chipmem
OSERR_PUBNOTUNIQUE	EQU (5)	; public screen name already used
OSERR_UNKNOWNMODE	EQU (6)	; don't recognize mode asked for
OSERR_TOODEEP		EQU (7)	; Screen deeper than HW supports
OSERR_ATTACHFAIL	EQU (8)	; Failed to attach screens
OSERR_NOTAVAILABLE	EQU (9) ; Mode not available for other reason

; ========================================================================
; === NewScreen ==========================================================
; ========================================================================
; NOTE: to use Extension field, you need to use ExtNewScreen, below
 STRUCTURE NewScreen,0

    WORD ns_LeftEdge		; initial Screen dimensions
    WORD ns_TopEdge		; initial Screen dimensions
    WORD ns_Width		; initial Screen dimensions
    WORD ns_Height		; initial Screen dimensions
    WORD ns_Depth		; initial Screen dimensions

    BYTE ns_DetailPen		; default rendering pens (for Windows too)
    BYTE ns_BlockPen		; default rendering pens (for Windows too)

    WORD ns_ViewModes		; display "modes" for this Screen

    WORD ns_Type		; Intuition Screen Type specifier

    APTR ns_Font		; default font for Screen and Windows

    APTR ns_DefaultTitle	; Title when Window doesn't care

    APTR ns_Gadgets		; UNUSED:  Leave this NULL

    ; if you are opening a CUSTOMSCREEN and already have a BitMap 
    ; that you want used for your Screen, you set the flags CUSTOMBITMAP in
    ; the Types variable and you set this variable to point to your BitMap
    ; structure.  The structure will be copied into your Screen structure,
    ; after which you may discard your own BitMap if you want
    APTR ns_CustomBitMap
 LABEL    ns_SIZEOF

; For compatibility reasons, we need a new structure for extending
; NewScreen.  Use this structure is you need to use the new Extension
; field.
; NOTE WELL: this structure may be extended again in the future.
;Writing code which depends on its size is not allowed.

 STRUCTURE ExtNewScreen,ns_SIZEOF

    APTR ens_Extension		; struct TagItem *
				; more specification data, scanned if
				; NS_EXTENDED is set in ns_Type

 LABEL    ens_SIZEOF

* === Overscan Types ===
OSCAN_TEXT	EQU	1	; entirely visible
OSCAN_STANDARD	EQU	2	; just past edges
OSCAN_MAX	EQU	3	; as much as possible
OSCAN_VIDEO	EQU	4	; even more than is possible


* === Public Shared Screen Node ===

* This is the representative of a public shared screen.
* This is an internal data structure, but some functions may
* present a copy of it to the calling application.  In that case,
* be aware that the screen pointer of the structure can NOT be
* used safely, since there is no guarantee that the referenced
* screen will remain open and a valid data structure.

 STRUCTURE PubScreenNode,LN_SIZE
    APTR	psn_Screen	; pointer to screen itself
    UWORD	psn_Flags	; below
    WORD	psn_Size	; includes name buffer size
    WORD	psn_VisitorCount ; how many visitor windows
    APTR	psn_SigTask	; who to signal when visitors gone
    UBYTE	psn_SigBit	; which signal
    UBYTE	psn_Pad1	; word align
 LABEL		psn_SIZEOF

* psn_Flags values
PSNF_PRIVATE	EQU	$0001

* NOTE: Due to a bug in NextPubScreen(), make sure your buffer
* actually has MAXPUBSCREENNAME+1 characters in it!

MAXPUBSCREENNAME EQU	139	; names no longer, please

; pub screen modes
SHANGHAI	EQU	$0001	; put workbench windows on pub screen
POPPUBSCREEN	EQU	$0002	; pop pub screen to front when visitor opens

* New for V39:  Intuition has new screen depth-arrangement and movement
* functions called ScreenDepth() and ScreenPosition() respectively.
* These functions permit the old behavior of ScreenToFront(),
* ScreenToBack(), and MoveScreen().  ScreenDepth() also allows
* independent depth control of attached screens.  ScreenPosition()
* optionally allows positioning screens even though they were opened
* {SA_Draggable,FALSE}.

* For ScreenDepth(), specify one of SDEPTH_TOFRONT or SDEPTH_TOBACK,
* and optionally also SDEPTH_INFAMILY.
*
* NOTE: ONLY THE OWNER OF THE SCREEN should ever specify
* SDEPTH_INFAMILY.  Commodities, "input helper" programs,
* or any other program that did not open a screen should never 
* use that flag.  (Note that this is a style-behavior
* requirement;  there is no technical requirement that the
* task calling this function need be the task which opened
* the screen).

SDEPTH_TOFRONT 		EQU	0	; Bring screen to front
SDEPTH_TOBACK		EQU	1	; Send screen to back
SDEPTH_INFAMILY		EQU	2	; Move an attached screen with
					; respect to other screens of
					; its family

* Here's an obsolete name equivalent to SDEPTH_INFAMILY:
SDEPTH_CHILDONLY	EQU	SDEPTH_INFAMILY


* For ScreenPosition(), specify one of SPOS_RELATIVE, SPOS_ABSOLUTE,
* or SPOS_MAKEVISIBLE to describe the kind of screen positioning you
* wish to perform:
*
* SPOS_RELATIVE: The x1 and y1 parameters to ScreenPosition() describe
*	the offset in coordinates you wish to move the screen by.
* SPOS_ABSOLUTE: The x1 and y1 parameters to ScreenPosition() describe
*	the absolute coordinates you wish to move the screen to.
* SPOS_MAKEVISIBLE: (x1,y1)-(x2,y2) describes a rectangle on the
*	screen which you would like autoscrolled into view.
*
* You may additionally set SPOS_FORCEDRAG along with any of the
* above.  Set this if you wish to reposition an {SA_Draggable,FALSE}
* screen that you opened.
*
* NOTE: ONLY THE OWNER OF THE SCREEN should ever specify
* SPOS_FORCEDRAG.  Commodities, "input helper" programs,
* or any other program that did not open a screen should never
* use that flag.

SPOS_RELATIVE		EQU	0	; Coordinates are relative

SPOS_ABSOLUTE		EQU	1	; Coordinates are expressed as
					; absolutes, not relatives.

SPOS_MAKEVISIBLE	EQU	2	; Coordinates describe a box on
					; the screen you wish to be
					; made visible by autoscrolling

SPOS_FORCEDRAG		EQU	4	; Move non-draggable screen

* New for V39: Intuition supports double-buffering in screens,
* with friendly interaction with menus and certain gadgets.
* For each buffer, you need to get one of these structures
* from the AllocScreenBuffer() call.  Never allocate your
* own ScreenBuffer structures!
*
* The sb_DBufInfo field is for your use.  See the graphics.library
* AllocDBufInfo() autodoc for details.

 STRUCTURE ScreenBuffer,0
    APTR sb_BitMap		; BitMap of this buffer
    APTR sb_DBufInfo		; DBufInfo for this buffer
 LABEL sb_SIZEOF


* These are the flags that may be passed to AllocScreenBuffer().

SB_SCREEN_BITMAP	EQU	1
SB_COPY_BITMAP		EQU	2

* Include obsolete identifiers:
	IFND	INTUITION_IOBSOLETE_I
	INCLUDE "intuition/iobsolete.i"
	ENDC

	ENDC
