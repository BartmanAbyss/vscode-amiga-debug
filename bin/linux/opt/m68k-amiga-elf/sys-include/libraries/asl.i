	IFND LIBRARIES_ASL_I
LIBRARIES_ASL_I	SET	1
**
**	$VER: asl.i 45.2 (18.11.2000)
**	Includes Release 45.1
**
**	ASL library structures and constants
**
**	Copyright © 1989-2001 Amiga, Inc.
**	Copyright © 1989-1990 Charlie Heath
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC

    IFND EXEC_SEMAPHORES_I
    INCLUDE "exec/semaphores.i"
    ENDC

    IFND GRAPHICS_TEXT_I
    INCLUDE "graphics/text.i"
    ENDC

    IFND GRAPHICS_DISPLAYINFO_I
    INCLUDE "graphics/displayinfo.i"
    ENDC

;---------------------------------------------------------------------------

AslName	MACRO
	DC.B 'asl.library',0
	ENDM
ASL_TB	equ (TAG_USER+$80000)

;---------------------------------------------------------------------------

; Types of requesters known to ASL, used as arguments to AllocAslRequest()
ASL_FileRequest	      equ 0
ASL_FontRequest	      equ 1
ASL_ScreenModeRequest equ 2

;---------------------------------------------------------------------------
;*
;* ASL File Requester data structures and constants
;*
;* This structure must only be allocated by asl.library amd is READ-ONLY!
;* Control of the various fields is provided via tags when the requester
;* is created with AllocAslRequest() and when it is displayed via
;* AslRequest()
;*
   STRUCTURE FileRequester,4
	APTR	fr_File		  ; Contents of File gadget on exit
	APTR	fr_Drawer	  ; Contents of Drawer gadget on exit
	STRUCT	fr_Reserved1,10
	WORD	fr_LeftEdge	  ; Coordinates of requester on exit
	WORD	fr_TopEdge
	WORD	fr_Width
	WORD	fr_Height
	STRUCT	fr_Reserved2,2
	LONG	fr_NumArgs	  ; Number of files selected
	APTR	fr_ArgList	  ; List of files selected
	APTR	fr_UserData	  ; You can store your own data here
	STRUCT	fr_Reserved3,8
	APTR	fr_Pattern	  ; Contents of Pattern gadget on exit

; File requester tag values, used by AllocAslRequest() and AslRequest()

; Window control
ASLFR_Window	      equ ASL_TB+2   ; Parent window
ASLFR_Screen	      equ ASL_TB+40  ; Screen to open on if no window
ASLFR_PubScreenName   equ ASL_TB+41  ; Name of public screen
ASLFR_PrivateIDCMP    equ ASL_TB+42  ; Allocate private IDCMP?
ASLFR_IntuiMsgFunc    equ ASL_TB+70  ; Function to handle IntuiMessages
ASLFR_SleepWindow     equ ASL_TB+43  ; Block input in ASLFR_Window?
ASLFR_UserData	      equ ASL_TB+52  ; What to put in fr_UserData
ASLFR_PopToFront      equ ASL_TB+131 ; Make the requester window visible
                                     ; when it opens (V44)
ASLFR_Activate        equ ASL_TB+132 ; Activate the requester window when
                                     ; it opens (V45).

; Text display
ASLFR_TextAttr	      equ ASL_TB+51  ; Text font to use for gadget text
ASLFR_Locale	      equ ASL_TB+50  ; Locale ASL should use for text
ASLFR_TitleText       equ ASL_TB+1   ; Title of requester
ASLFR_PositiveText    equ ASL_TB+18  ; Positive gadget text
ASLFR_NegativeText    equ ASL_TB+19  ; Negative gadget text

; Initial settings
ASLFR_InitialLeftEdge equ ASL_TB+3   ; Initial requester coordinates
ASLFR_InitialTopEdge  equ ASL_TB+4
ASLFR_InitialWidth    equ ASL_TB+5   ; Initial requester dimensions
ASLFR_InitialHeight   equ ASL_TB+6
ASLFR_InitialFile     equ ASL_TB+8   ; Initial contents of File gadget
ASLFR_InitialDrawer   equ ASL_TB+9   ; Initial contents of Drawer gadget
ASLFR_InitialPattern  equ ASL_TB+10  ; Initial contents of Pattern gadget
ASLFR_InitialShowVolumes equ ASL_TB+130 ; Initially, show the volume list

; Options
ASLFR_Flags1	      equ ASL_TB+20  ; Option flags
ASLFR_Flags2	      equ ASL_TB+22  ; Additional option flags
ASLFR_DoSaveMode      equ ASL_TB+44  ; Being used for saving?
ASLFR_DoMultiSelect   equ ASL_TB+45  ; Do multi-select?
ASLFR_DoPatterns      equ ASL_TB+46  ; Display a Pattern gadget?

; Filtering
ASLFR_DrawersOnly     equ ASL_TB+47  ; Don't display files?
ASLFR_FilterFunc      equ ASL_TB+49  ; Function to filter files
ASLFR_RejectIcons     equ ASL_TB+60  ; Display .info files?
ASLFR_RejectPattern   equ ASL_TB+61  ; Don't display files matching pattern
ASLFR_AcceptPattern   equ ASL_TB+62  ; Accept only files matching pattern
ASLFR_FilterDrawers   equ ASL_TB+63  ; Also filter drawers with patterns
ASLFR_HookFunc	      equ ASL_TB+7   ; Combined callback function

; Sorting
ASLFR_SetSortBy       equ ASL_TB+124 ; Sort criteria (name, date, size)
ASLFR_GetSortBy       equ ASL_TB+125
ASLFR_SetSortDrawers  equ ASL_TB+126 ; Placement of drawers in the list
ASLFR_GetSortDrawers  equ ASL_TB+127
ASLFR_SetSortOrder    equ ASL_TB+128 ; Order (ascending or descending)
ASLFR_GetSortOrder    equ ASL_TB+129

; Flag bits for the ASLFR_Flags1 tag
	BITDEF FR,DOWILDFUNC,7
	BITDEF FR,DOMSGFUNC,6
	BITDEF FR,DOSAVEMODE,5
	BITDEF FR,PRIVATEIDCMP,4
	BITDEF FR,DOMULTISELECT,3
	BITDEF FR,DOPATTERNS,0

; Flag bits for the ASLFR_Flags2 tag
	BITDEF FR,DRAWERSONLY,0
	BITDEF FR,FILTERDRAWERS,1
	BITDEF FR,REJECTICONS,2

; Sort criteria for the ASLFR_SetSortBy/ASLFR_GetSortBy tags
ASLFRSORTBY_Name   equ 0
ASLFRSORTBY_Date   equ 1
ASLFRSORTBY_Size   equ 2

; Drawer placement for the ASLFR_SetSortDrawers/ASLFR_GetSortDrawers tags
ASLFRSORTDRAWERS_First  equ 0
ASLFRSORTDRAWERS_Mix    equ 1
ASLFRSORTDRAWERS_Last   equ 2

; Sort order for the ASLFR_SetSortOrder/ASLFR_GetSortOrder tags
ASLFRSORTORDER_Ascend   equ 0
ASLFRSORTORDER_Descend  equ 1

;---------------------------------------------------------------------------
;*
;* ASL Font Requester data structures and constants
;*
;* This structure must only be allocated by asl.library amd is READ-ONLY!
;* Control of the various fields is provided via tags when the requester
;* is created with AllocAslRequest() and when it is displayed via
;* AslRequest()
;*
   STRUCTURE FontRequester,8
	STRUCT	fo_Attr,ta_SIZEOF    ; Returned TextAttr
	UBYTE	fo_FrontPen	     ; Returned front pen
	UBYTE	fo_BackPen	     ; Returned back pen
	UBYTE	fo_DrawMode	     ; Returned drawing mode
	UBYTE	fo_Reserved1
	APTR	fo_UserData	     ; You can store your own data here
	WORD	fo_LeftEdge	     ; Coordinates of requester on exit
	WORD	fo_TopEdge
	WORD	fo_Width
	WORD	fo_Height
	STRUCT	fo_TAttr,tta_SIZEOF  ; Returned TTextAttr

; Font requester tag values, used by AllocAslRequest() and AslRequest()

; Window control
ASLFO_Window	      equ ASL_TB+2   ; Parent window
ASLFO_Screen	      equ ASL_TB+40  ; Screen to open on if no window
ASLFO_PubScreenName   equ ASL_TB+41  ; Name of public screen
ASLFO_PrivateIDCMP    equ ASL_TB+42  ; Allocate private IDCMP?
ASLFO_IntuiMsgFunc    equ ASL_TB+70  ; Function to handle IntuiMessages
ASLFO_SleepWindow     equ ASL_TB+43  ; Block input in ASLFO_Window?
ASLFO_UserData	      equ ASL_TB+52  ; What to put in fo_UserData
ASLFO_PopToFront      equ ASL_TB+131 ; Make the requester window visible
                                     ; when it opens (V44)
ASLFO_Activate        equ ASL_TB+132 ; Activate the requester window when
                                     ; it opens (V45).

; Text display
ASLFO_TextAttr	      equ ASL_TB+51  ; Text font to use for gadget text
ASLFO_Locale	      equ ASL_TB+50  ; Locale ASL should use for text
ASLFO_TitleText       equ ASL_TB+1   ; Title of requester
ASLFO_PositiveText    equ ASL_TB+18  ; Positive gadget text
ASLFO_NegativeText    equ ASL_TB+19  ; Negative gadget text

; Initial settings
ASLFO_InitialLeftEdge equ ASL_TB+3   ; Initial requester coordinates
ASLFO_InitialTopEdge  equ ASL_TB+4
ASLFO_InitialWidth    equ ASL_TB+5   ; Initial requester dimensions
ASLFO_InitialHeight   equ ASL_TB+6
ASLFO_InitialName     equ ASL_TB+10  ; Initial contents of Name gadget
ASLFO_InitialSize     equ ASL_TB+11  ; Initial contents of Size gadget
ASLFO_InitialStyle    equ ASL_TB+12  ; Initial font style
ASLFO_InitialFlags    equ ASL_TB+13  ; Initial font flags for TextAttr
ASLFO_InitialFrontPen equ ASL_TB+14  ; Initial front pen
ASLFO_InitialBackPen  equ ASL_TB+15  ; Initial back pen
ASLFO_InitialDrawMode equ ASL_TB+59  ; Initial draw mode

; Options
ASLFO_Flags	      equ ASL_TB+20  ; Option flags
ASLFO_DoFrontPen      equ ASL_TB+44  ; Display Front color selector?
ASLFO_DoBackPen       equ ASL_TB+45  ; Display Back color selector?
ASLFO_DoStyle	      equ ASL_TB+46  ; Display Style checkboxes?
ASLFO_DoDrawMode      equ ASL_TB+47  ; Display DrawMode cycle gadget?
ASLFO_SampleText      equ ASL_TB+133 ; Text to display in font sample area (V45)

; Filtering
ASLFO_FixedWidthOnly  equ ASL_TB+48  ; Only allow fixed-width fonts?
ASLFO_MinHeight       equ ASL_TB+16  ; Minimum font height to display
ASLFO_MaxHeight       equ ASL_TB+17  ; Maximum font height to display
ASLFO_FilterFunc      equ ASL_TB+49  ; Function to filter fonts
ASLFO_HookFunc	      equ ASL_TB+7   ; Combined callback function
ASLFO_MaxFrontPen     equ ASL_TB+66  ; Max # of colors in front palette
ASLFO_MaxBackPen      equ ASL_TB+67  ; Max # of colors in back palette

; Custom additions
ASLFO_ModeList	      equ ASL_TB+21  ; Substitute list for drawmodes
ASLFO_FrontColors     equ ASL_TB+64  ; Color table for front pen palette
ASLFO_BackColors      equ ASL_TB+65  ; Color table for back pen palette

; Flag bits for ASLFO_Flags tag
	BITDEF FO,DOFRONTPEN,0
	BITDEF FO,DOBACKPEN,1
	BITDEF FO,DOFONTSTYLE,2
	BITDEF FO,DODRAWMODE,3
	BITDEF FO,FIXEDWIDTHONLY,4
	BITDEF FO,PRIVATE,5
	BITDEF FO,DOMSGFUNC,6
	BITDEF FO,DOWILDFUNC,7

;---------------------------------------------------------------------------
;*
;* ASL ScreenMode Requester data structures and constants
;*
;* This structure must only be allocated by asl.library and is READ-ONLY!
;* Control of the various fields is provided via tags when the requester
;* is created with AllocAslRequest() and when it is displayed via
;* AslRequest()
;*
   STRUCTURE ScreenModeRequester,0
	ULONG sm_DisplayID	; Display mode ID
	ULONG sm_DisplayWidth	; Width of display in pixels
	ULONG sm_DisplayHeight	; Height of display in pixels
	UWORD sm_DisplayDepth	; Number of bit-planes of display
	UWORD sm_OverscanType	; Type of overscan of display
	UWORD sm_AutoScroll	; Display should auto-scroll?

	ULONG sm_BitMapWidth	; Used to create your own BitMap
	ULONG sm_BitMapHeight

	WORD  sm_LeftEdge	; Coordinates of requester on exit
	WORD  sm_TopEdge
	WORD  sm_Width
	WORD  sm_Height

	BOOL  sm_InfoOpened	; Info window opened on exit?
	WORD  sm_InfoLeftEdge	; Last coordinates of Info window
	WORD  sm_InfoTopEdge
	WORD  sm_InfoWidth
	WORD  sm_InfoHeight

	APTR  sm_UserData	; You can store your own data here

;* An Exec list of custom modes can be added to the list of available modes.
;* The DimensionInfo structure must be completely initialized, including the
;* Header. See <graphics/displayinfo.h>. Custom mode ID's must be in the range
;* 0xFFFF0000..0xFFFFFFFF. Regular properties which apply to your custom modes
;* can be added in the dn_PropertyFlags field. Custom properties are not
;* allowed.
;*
   STRUCTURE DisplayMode,LN_SIZE                ; see ln_Name
	STRUCT dm_DimensionInfo,dim_SIZEOF	; mode description
	ULONG  dm_PropertyFlags			; applicable properties
   LABEL DisplayMode_SIZEOF

; ScreenMode requester tag values, used by AllocAslRequest() and AslRequest()

; Window control
ASLSM_Window          equ ASL_TB+2   ; Parent window
ASLSM_Screen          equ ASL_TB+40  ; Screen to open on if no window
ASLSM_PubScreenName   equ ASL_TB+41  ; Name of public screen
ASLSM_PrivateIDCMP    equ ASL_TB+42  ; Allocate private IDCMP?
ASLSM_IntuiMsgFunc    equ ASL_TB+70  ; Function to handle IntuiMessages
ASLSM_SleepWindow     equ ASL_TB+43  ; Block input in ASLSM_Window?
ASLSM_UserData        equ ASL_TB+52  ; What to put in sm_UserData
ASLSM_PopToFront      equ ASL_TB+131 ; Make the requester window visible
                                     ; when it opens (V44)
ASLSM_Activate        equ ASL_TB+132 ; Activate the requester window when
                                     ; it opens (V45).

; Text display
ASLSM_TextAttr        equ ASL_TB+51  ; Text font to use for gadget text
ASLSM_Locale          equ ASL_TB+50  ; Locale ASL should use for text
ASLSM_TitleText       equ ASL_TB+1   ; Title of requester
ASLSM_PositiveText    equ ASL_TB+18  ; Positive gadget text
ASLSM_NegativeText    equ ASL_TB+19  ; Negative gadget text

; Initial settings
ASLSM_InitialLeftEdge equ ASL_TB+3   ; Initial requester coordinates
ASLSM_InitialTopEdge  equ ASL_TB+4
ASLSM_InitialWidth    equ ASL_TB+5   ; Initial requester dimensions
ASLSM_InitialHeight   equ ASL_TB+6
ASLSM_InitialDisplayID     equ ASL_TB+100 ; Initial display mode id
ASLSM_InitialDisplayWidth  equ ASL_TB+101 ; Initial display width
ASLSM_InitialDisplayHeight equ ASL_TB+102 ; Initial display height
ASLSM_InitialDisplayDepth  equ ASL_TB+103 ; Initial display depth
ASLSM_InitialOverscanType  equ ASL_TB+104 ; Initial type of overscan
ASLSM_InitialAutoScroll    equ ASL_TB+105 ; Initial autoscroll setting
ASLSM_InitialInfoOpened    equ ASL_TB+106 ; Info wndw initially opened?
ASLSM_InitialInfoLeftEdge  equ ASL_TB+107 ; Initial Info window coords.
ASLSM_InitialInfoTopEdge   equ ASL_TB+108

; Options
ASLSM_DoWidth         equ ASL_TB+109  ; Display Width gadget?
ASLSM_DoHeight        equ ASL_TB+110  ; Display Height gadget?
ASLSM_DoDepth         equ ASL_TB+111  ; Display Depth gadget?
ASLSM_DoOverscanType  equ ASL_TB+112  ; Display Overscan Type gadget?
ASLSM_DoAutoScroll    equ ASL_TB+113  ; Display AutoScroll gadget?

; Filtering
ASLSM_PropertyFlags   equ ASL_TB+114  ; Must have these Property flags
ASLSM_PropertyMask    equ ASL_TB+115  ; Only these should be looked at
ASLSM_MinWidth        equ ASL_TB+116  ; Minimum display width to allow
ASLSM_MaxWidth        equ ASL_TB+117  ; Maximum display width to allow
ASLSM_MinHeight       equ ASL_TB+118  ; Minimum display height to allow
ASLSM_MaxHeight       equ ASL_TB+119  ; Maximum display height to allow
ASLSM_MinDepth        equ ASL_TB+120  ; Minimum display depth
ASLSM_MaxDepth        equ ASL_TB+121  ; Maximum display depth
ASLSM_FilterFunc      equ ASL_TB+122  ; Function to filter mode id's

; Custom additions
ASLSM_CustomSMList    equ ASL_TB+123  ; Exec list of struct DisplayMode

;---------------------------------------------------------------------------

; This defines the rendezvous data for setting and querying asl.library's
; defaults for the window size and the file requester sort order. The name
; of the semaphore is given below; it exists only with asl.library V45 and
; IPrefs V45 and beyond.
ASL_SEMAPHORE_NAME macro
	DC.B 'asl.library',0
	ENDM

   STRUCTURE	AslSemaphore
	STRUCT	as_Semaphore,SS_SIZE
	UWORD	as_Version		; Must be >= 45
	ULONG	as_Size			; Size of this data structure.

	UBYTE	as_SortBy		; File requester defaults; name, date or size
	UBYTE	as_SortDrawers		; File requester defaults; first, mix or last
	UBYTE	as_SortOrder		; File requester defaults; ascending or descending

	UBYTE	as_SizePosition		; See below

	WORD	as_RelativeLeft		; Window position offset
	WORD	as_RelativeTop

	UBYTE	as_RelativeWidth	; Window size factor; this is
					; a percentage of the parent
					; window/screen width.
	UBYTE	as_RelativeHeight
   LABEL AslSemaphore_SIZEOF

; Default position of the ASL window
ASLPOS_DefaultPosition	EQU	0	; Position is calculated according to the builtin rules.
ASLPOS_CenterWindow	EQU	1	; Centred within the bounds of the parent window.
ASLPOS_CenterScreen	EQU	2	; Centred within the bounds of the parent screen.
ASLPOS_WindowPosition	EQU	3	; Relative to the top left corner of the parent window,
					; using the offset values provided in the
					; as_RelativeLeft/as_RelativeTop members.
ASLPOS_ScreenPosition	EQU	4	; Relative to the top left corner of the parent screen,
					; using the offset values provided in the
					; as_RelativeLeft/as_RelativeTop members.
ASLPOS_CenterMouse	EQU	5	; Directly below the mouse pointer.

ASLPOS_MASK		EQU	$0F

; Default size of the ASL window.
ASLSIZE_DefaultSize	EQU	$00	; Size is calculated according to the builtin rules.
ASLSIZE_RelativeSize	EQU	$10	; Size is relative to the size of the parent
					; window or screen, using the values provided in
					; the as_RelativeWidth/as_RelativeHeight members.
					; The as_RelativeWidth/as_RelativeHeight values are
					; taken as percentage, i.e. a value of "50" stands for
					; 50% of the width/height of the parent window/screen.

ASLSIZE_MASK		EQU	$30

; Other options.
ASLOPTION_ASLOverrides	EQU	$40	; ASL determines placement and size of requester
					; windows; application's choice is ignored.

;---------------------------------------------------------------------------
; Obsolete ASL definitions, here for source code compatibility only.
; Please do NOT use in new code.
;
; Set ASL_V38_NAMES_ONLY to remove these older names
;
	IFND ASL_V38_NAMES_ONLY
rf_File		equ	fr_File
rf_Dir		equ	fr_Drawer
rf_LeftEdge	equ	fr_LeftEdge
rf_TopEdge	equ	fr_TopEdge
rf_Width	equ	fr_Width
rf_Height	equ	fr_Height
rf_NumArgs	equ	fr_NumArgs
rf_ArgList	equ	fr_ArgList
rf_UserData	equ	fr_UserData
rf_Pat		equ	fr_Pattern
ASL_Dummy	equ	TAG_USER+$80000
ASL_Hail	equ	ASL_Dummy+1
ASL_Window	equ	ASL_Dummy+2
ASL_LeftEdge	equ	ASL_Dummy+3
ASL_TopEdge	equ	ASL_Dummy+4
ASL_Width	equ	ASL_Dummy+5
ASL_Height	equ	ASL_Dummy+6
ASL_HookFunc	equ	ASL_Dummy+7
ASL_File	equ	ASL_Dummy+8
ASL_Dir		equ	ASL_Dummy+9
ASL_Pattern	equ	ASL_Dummy+10
ASL_FontName	equ	ASL_Dummy+10
ASL_FontHeight	equ	ASL_Dummy+11
ASL_FontStyles	equ	ASL_Dummy+12
ASL_FontFlags	equ	ASL_Dummy+13
ASL_FrontPen	equ	ASL_Dummy+14
ASL_BackPen	equ	ASL_Dummy+15
ASL_MinHeight	equ	ASL_Dummy+16
ASL_MaxHeight	equ	ASL_Dummy+17
ASL_OKText	equ	ASL_Dummy+18
ASL_CancelText	equ	ASL_Dummy+19
ASL_FuncFlags	equ	ASL_Dummy+20
ASL_ModeList	equ	ASL_Dummy+21
ASL_ExtFlags1	equ	ASL_Dummy+22
; remember what I said up there? Do not use these anymore!
	BITDEF	FIL,PATGAD,0
	BITDEF	FIL,MULTISELECT,3
	BITDEF	FIL,NEWIDCMP,4
	BITDEF	FIL,SAVE,5
	BITDEF	FIL,DOMSGFUNC,6
	BITDEF	FIL,DOWILDFUNC,7
	BITDEF	FIL1,NOFILES,0
	BITDEF	FIL1,MATCHDIRS,1
	BITDEF	RF,DOWILDFUNC,7
	BITDEF	RF,DOMSGFUNC,6
	BITDEF	RF,DOCOLOR,5
	BITDEF	RF,NEWIDCMP,4
	BITDEF	RF,MULTISELECT,3
	BITDEF	RF,PATGAD,0
	BITDEF	FON,FRONTCOLOR,0
	BITDEF	FON,BACKCOLOR,1
	BITDEF	FON,STYLES,2
	BITDEF	FON,DRAWMODE,3
	BITDEF	FON,FIXEDWIDTH,4
	BITDEF	FON,NEWIDCMP,5
	BITDEF	FON,DOMSGFUNC,6
	BITDEF	FON,DOWILDFUNC,7
	ENDC

;---------------------------------------------------------------------------

	ENDC	; LIBRARIES_ASL_I
