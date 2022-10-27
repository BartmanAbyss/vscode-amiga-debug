	IFND	WORKBENCH_WORKBENCH_I
WORKBENCH_WORKBENCH_I	EQU	1
**
**	$VER: workbench.i 45.6 (23.11.2000)
**	Includes Release 45.1
**
**	workbench.library general definitions
**
**	Copyright © 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC

	IFND	EXEC_NODES_I
	INCLUDE	"exec/nodes.i"
	ENDC

	IFND	EXEC_LISTS_I
	INCLUDE	"exec/lists.i"
	ENDC

	IFND	EXEC_TASKS_I
	INCLUDE	"exec/tasks.i"
	ENDC

	IFND	DOS_DOS_I
	INCLUDE	"dos/dos.i"
	ENDC

	IFND	INTUITION_INTUITION_I
	INCLUDE	"intuition/intuition.i"
	ENDC


; the Workbench object types
WBDISK		EQU	1
WBDRAWER	EQU	2
WBTOOL		EQU	3
WBPROJECT	EQU	4
WBGARBAGE	EQU	5
WBDEVICE	EQU	6
WBKICK		EQU	7
WBAPPICON	EQU	8

; the main workbench object structure
 STRUCTURE DrawerData,0
    STRUCT	dd_NewWindow,nw_SIZE	; args to open window
    LONG	dd_CurrentX		; current x coordinate of origin
    LONG	dd_CurrentY		; current y coordinate of origin
    LABEL	OldDrawerData_SIZEOF	; pre V36 size
; the amount of OldDrawerData actually written to disk
OLDDRAWERDATAFILESIZE	EQU (OldDrawerData_SIZEOF)
    ULONG	dd_Flags		; flags for drawer
    UWORD	dd_ViewModes		; view mode for drawer
    LABEL	DrawerData_SIZEOF
; the amount of DrawerData actually written to disk
DRAWERDATAFILESIZE	EQU (DrawerData_SIZEOF)

; definitions for dd_ViewModes
DDVM_BYDEFAULT		equ 0	; default (inherit parent's view mode)
DDVM_BYICON		equ 1	; view as icons
DDVM_BYNAME		equ 2	; view as text, sorted by name
DDVM_BYDATE		equ 3	; view as text, sorted by date
DDVM_BYSIZE		equ 4	; view as text, sorted by size
DDVM_BYTYPE		equ 5	; view as text, sorted by type

; definitions for dd_Flags
DDFLAGS_SHOWDEFAULT	equ 0	; default (show only icons)
DDFLAGS_SHOWICONS	equ 1	; show only icons
DDFLAGS_SHOWALL		equ 2	; show all files

 STRUCTURE DiskObject,0
    UWORD	do_Magic		; a magic num at the start of the file
    UWORD	do_Version		; a version number, so we can change it
    STRUCT	do_Gadget,gg_SIZEOF	; a copy of in core gadget
    UBYTE	do_Type
    UBYTE	do_PAD_BYTE		; Pad it out to the next word boundry
    APTR	do_DefaultTool
    APTR	do_ToolTypes
    LONG	do_CurrentX
    LONG	do_CurrentY
    APTR	do_DrawerData
    APTR	do_ToolWindow		; only applies to tools
    LONG	do_StackSize		; applies to tools and projects
    LABEL	do_SIZEOF

WB_DISKMAGIC	EQU	$e310	; a magic number, not easily impersonated
WB_DISKVERSION	EQU	1	; our current version number
WB_DISKREVISION	EQU	1	; out current revision number
; I only use the lower 8 bits of Gadget.UserData for the revision #
WB_DISKREVISIONMASK	EQU	$ff

 STRUCTURE FreeList,0
    WORD	fl_NumFree
    STRUCT	fl_MemList,LH_SIZE
    ; weird name to avoid conflicts with FileLocks
    LABEL	FreeList_SIZEOF



; workbench does different complement modes for its gadgets.
; It supports separate images, complement mode, and backfill mode.
; The first two are identical to intuitions GFLG_GADGIMAGE and GFLG_GADGHCOMP.
; backfill is similar to GFLG_GADGHCOMP, but the region outside of the
; image (which normally would be color three when complemented)
; is flood-filled to color zero.

GFLG_GADGBACKFILL	EQU	$0001
GADGBACKFILL		EQU	$0001	; an old synonym

; if an icon does not really live anywhere, set its current position
; to here

NO_ICON_POSITION	EQU	($80000000)


; workbench now is a library.  this is it's name
WORKBENCH_NAME	MACRO
		dc.b		'workbench.library',0
		ds.w		0
		ENDM

; If you find am_Version >= AM_VERSION, you now this structure has
; at least the fields defined in this version of the include file
AM_VERSION	EQU	1

 STRUCTURE AppMessage,0
	STRUCT am_Message,MN_SIZE	; standard message structure
	UWORD am_Type			; message type
	ULONG am_UserData		; application specific
	ULONG am_ID			; application definable ID
	LONG am_NumArgs			; # of elements in arglist
	APTR am_ArgList			; the arguements themselves
	UWORD am_Version		; will be AM_VERSION
	UWORD am_Class			; message class
	WORD am_MouseX			; mouse x position of event
	WORD am_MouseY			; mount y position of event
	ULONG am_Seconds		; current system clock time
	ULONG am_Micros			; current system clock time
	STRUCT am_Reserved,8		; avoid recompilation
	LABEL AppMessage_SIZEOF

; types of app messages
AMTYPE_APPWINDOW	EQU	7	; app window message
AMTYPE_APPICON		EQU	8	; app icon message
AMTYPE_APPMENUITEM	EQU	9	; app menu item message
AMTYPE_APPWINDOWZONE	EQU	10	; app window drop zone message

; Classes of AppIcon messages (V44)
AMCLASSICON_Open	equ	0	; The "Open" menu item was invoked,
					; the icon got double-clicked or an
					; icon got dropped on it.
AMCLASSICON_Copy	equ	1	; The "Copy" menu item was invoked
AMCLASSICON_Rename	equ	2	; The "Rename" menu item was invoked
AMCLASSICON_Information	equ	3	; The "Information" menu item was invoked
AMCLASSICON_Snapshot	equ	4	; The "Snapshot" menu item was invoked
AMCLASSICON_UnSnapshot	equ	5	; The "UnSnapshot" menu item was invoked
AMCLASSICON_LeaveOut	equ	6	; The "Leave Out" menu item was invoked
AMCLASSICON_PutAway	equ	7	; The "Put Away" menu item was invoked
AMCLASSICON_Delete	equ	8	; The "Delete" menu item was invoked
AMCLASSICON_FormatDisk	equ	9	; The "Format Disk" menu item was invoked
AMCLASSICON_EmptyTrash	equ	10	; The "Empty Trash" menu item was invoked

AMCLASSICON_Selected	equ	11	; The icon is now selected
AMCLASSICON_Unselected	equ	12	; The icon is now unselected

; The following structures are private.  These are just stub
; structures for code compatibility...

 STRUCTURE AppWindow,0
	STRUCT aw_PRIVATE,0
	LABEL AppWindow_SIZEOF

 STRUCTURE AppWindowDropZone,0
	STRUCT awdz_PRIVATE,0
	LABEL AppWindowDropZone_SIZEOF

 STRUCTURE AppIcon,0
 	STRUCT ai_PRIVATE,0
	LABEL AppIcon_SIZEOF

 STRUCTURE AppMenuItem,0
	STRUCT ami_PRIVATE,0
	LABEL AppMenuItem_SIZEOF

 STRUCTURE AppMenu,0
	STRUCT am_PRIVATE,0
	LABEL AppMenu_SIZEOF

;----------------------------------------------------------------------------

WBA_Dummy equ	(TAG_USER+$A000)

;----------------------------------------------------------------------------

; Tags for use with AddAppIconA()

; AppIcon responds to the "Open" menu item (BOOL).
WBAPPICONA_SupportsOpen		equ	(WBA_Dummy+1)

; AppIcon responds to the "Copy" menu item (BOOL).
WBAPPICONA_SupportsCopy		equ	(WBA_Dummy+2)

; AppIcon responds to the "Rename" menu item (BOOL).
WBAPPICONA_SupportsRename	equ	(WBA_Dummy+3)

; AppIcon responds to the "Information" menu item (BOOL).
WBAPPICONA_SupportsInformation	equ	(WBA_Dummy+4)

; AppIcon responds to the "Snapshot" menu item (BOOL).
WBAPPICONA_SupportsSnapshot	equ	(WBA_Dummy+5)

; AppIcon responds to the "UnSnapshot" menu item (BOOL).
WBAPPICONA_SupportsUnSnapshot	equ	(WBA_Dummy+6)

; AppIcon responds to the "LeaveOut" menu item (BOOL).
WBAPPICONA_SupportsLeaveOut	equ	(WBA_Dummy+7)

; AppIcon responds to the "PutAway" menu item (BOOL).
WBAPPICONA_SupportsPutAway	equ	(WBA_Dummy+8)

; AppIcon responds to the "Delete" menu item (BOOL).
WBAPPICONA_SupportsDelete	equ	(WBA_Dummy+9)

; AppIcon responds to the "FormatDisk" menu item (BOOL).
WBAPPICONA_SupportsFormatDisk	equ	(WBA_Dummy+10)

; AppIcon responds to the "EmptyTrash" menu item (BOOL).
WBAPPICONA_SupportsEmptyTrash	equ	(WBA_Dummy+11)

; AppIcon position should be propagated back to original DiskObject (BOOL).
WBAPPICONA_PropagatePosition	equ	(WBA_Dummy+12)

; Callback hook to be invoked when rendering this icon (struct Hook *).
WBAPPICONA_RenderHook		equ	(WBA_Dummy+13)

; AppIcon wants to be notified when its select state changes (BOOL).
WBAPPICONA_NotifySelectState	equ	(WBA_Dummy+14)

;------------------------------------------------------------------------------

; Tags for use with AddAppMenuA()

; Command key string for this AppMenu (STRPTR).
WBAPPMENUA_CommandKeyString	equ	(WBA_Dummy+15)

; Item to be added should get sub menu items attached to; make room for it,
; then return the key to use later for attaching the items (ULONG *).
WBAPPMENUA_GetKey		equ	(WBA_Dummy+65)

; This item should be attached to a sub menu; the key provided refers to
; the sub menu it should be attached to (ULONG).
WBAPPMENUA_UseKey		equ	(WBA_Dummy+66)

; Item to be added is in fact a new menu title; make room for it, then
; return the key to use later for attaching the items (ULONG *).
WBAPPMENUA_GetTitleKey		equ	(WBA_Dummy+77)

;------------------------------------------------------------------------------

; Tags for use with OpenWorkbenchObjectA()

; Corresponds to the wa_Lock member of a struct WBArg
WBOPENA_ArgLock			equ	(WBA_Dummy+16)

; Corresponds to the wa_Name member of a struct WBArg
WBOPENA_ArgName			equ	(WBA_Dummy+17)

; When opening a drawer, show all files or only icons?
; This must be one out of DDFLAGS_SHOWICONS,
; or DDFLAGS_SHOWALL; (UBYTE); (V45)
WBOPENA_Show			equ	(WBA_Dummy+75)

; When opening a drawer, view the contents by icon, name,
; date, size or type? This must be one out of DDVM_BYICON,
; DDVM_BYNAME, DDVM_BYDATE, DDVM_BYSIZE or DDVM_BYTYPE;
; (UBYTE); (V45)
WBOPENA_ViewBy			equ	(WBA_Dummy+76)

;------------------------------------------------------------------------------

; Tags for use with WorkbenchControlA()

; Check if the named drawer is currently open (LONG *).
WBCTRLA_IsOpen			equ	(WBA_Dummy+18)

; Create a duplicate of the Workbench private search path list (BPTR *).
WBCTRLA_DuplicateSearchPath	equ	(WBA_Dummy+19)

; Free the duplicated search path list (BPTR).
WBCTRLA_FreeSearchPath		equ	(WBA_Dummy+20)

; Get the default stack size for launching programs with (ULONG *).
WBCTRLA_GetDefaultStackSize	equ	(WBA_Dummy+21)

; Set the default stack size for launching programs with (ULONG).
WBCTRLA_SetDefaultStackSize	equ	(WBA_Dummy+22)

; Cause an AppIcon to be redrawn (struct AppIcon *).
WBCTRLA_RedrawAppIcon		equ	(WBA_Dummy+23)

; Get a list of currently running Workbench programs (struct List **).
WBCTRLA_GetProgramList		equ	(WBA_Dummy+24)

; Release the list of currently running Workbench programs (struct List *).
WBCTRLA_FreeProgramList		equ	(WBA_Dummy+25)

; Get a list of currently selected icons (struct List **).
WBCTRLA_GetSelectedIconList	equ	(WBA_Dummy+36)

; Release the list of currently selected icons (struct List *).
WBCTRLA_FreeSelectedIconList	equ	(WBA_Dummy+37)

; Get a list of currently open drawers (struct List **).
WBCTRLA_GetOpenDrawerList	equ	(WBA_Dummy+38)

; Release the list of currently open icons (struct List *).
WBCTRLA_FreeOpenDrawerList	equ	(WBA_Dummy+39)

; Get the list of hidden devices (struct List **).
WBCTRLA_GetHiddenDeviceList	equ	(WBA_Dummy+42)

; Release the list of hidden devices (struct List *).
WBCTRLA_FreeHiddenDeviceList	equ	(WBA_Dummy+43)

; Add the name of a device which Workbench should never try to
; read a disk icon from (STRPTR).
WBCTRLA_AddHiddenDeviceName	equ	(WBA_Dummy+44)

; Remove a name from list of hidden devices (STRPTR).
WBCTRLA_RemoveHiddenDeviceName	equ	(WBA_Dummy+45)

; Get the number of seconds that have to pass before typing
; the next character in a drawer window will restart
; with a new file name (ULONG *).
WBCTRLA_GetTypeRestartTime	equ	(WBA_Dummy+47)

; Set the number of seconds that have to pass before typing
; the next character in a drawer window will restart
; with a new file name (ULONG).
WBCTRLA_SetTypeRestartTime	equ	(WBA_Dummy+48)

; Obtain the hook that will be invoked when Workbench starts
; to copy files and data (struct Hook **); (V45)
WBCTRLA_GetCopyHook		equ	(WBA_Dummy+69)

; Install the hook that will be invoked when Workbench starts
; to copy files and data (struct Hook *); (V45)
WBCTRLA_SetCopyHook		equ	(WBA_Dummy+70)

; Obtain the hook that will be invoked when Workbench discards
; files and drawers or empties the trashcan (struct Hook **);
; (V45).
WBCTRLA_GetDeleteHook		equ	(WBA_Dummy+71)

; Install the hook that will be invoked when Workbench discards
; files and drawers or empties the trashcan (struct Hook *);
; (V45).
WBCTRLA_SetDeleteHook		equ	(WBA_Dummy+72)

; Obtain the hook that will be invoked when Workbench requests
; that the user enters text, such as when a file is to be renamed
; or a new drawer is to be created (struct Hook **); (V45)
WBCTRLA_GetTextInputHook	equ	(WBA_Dummy+73)

; Install the hook that will be invoked when Workbench requests
; that the user enters text, such as when a file is to be renamed
; or a new drawer is to be created (struct Hook *); (V45)
WBCTRLA_SetTextInputHook	equ	(WBA_Dummy+74)

; Add a hook that will be invoked when Workbench is about 
; to shut down (cleanup), and when Workbench has returned
; to operational state (setup) (struct Hook *); (V45)
WBCTRLA_AddSetupCleanupHook	equ	(WBA_Dummy+78)

; Remove a hook that has been installed with the
; WBCTRLA_AddSetupCleanupHook tag (struct Hook *); (V45)
WBCTRLA_RemSetupCleanupHook	equ	(WBA_Dummy+79)

;------------------------------------------------------------------------------

; The message your setup/cleanup hook gets invoked with.
    STRUCTURE SetupCleanupHookMsg,0
        ULONG   schm_Length		; Size of this data structure (in bytes).
	LONG	schm_State		; See below for definitions.
    LABEL SetupCleanupHookMsg_SIZEOF

SCHMSTATE_TryCleanup	equ	0	; Workbench will attempt to shut down now.
SCHMSTATE_Cleanup	equ	1	; Workbench will really shut down now.
SCHMSTATE_Setup		equ	2	; Workbench is operational again or
					; could not be shut down.

;------------------------------------------------------------------------------

; Tags for use with AddAppWindowDropZoneA()

; Zone left edge (WORD)
WBDZA_Left	equ	(WBA_Dummy+26)

; Zone left edge, if relative to the right edge of the window (WORD)
WBDZA_RelRight	equ	(WBA_Dummy+27)

; Zone top edge (WORD)
WBDZA_Top	equ	(WBA_Dummy+28)

; Zone top edge, if relative to the bottom edge of the window (WORD)
WBDZA_RelBottom	equ	(WBA_Dummy+29)

; Zone width (WORD)
WBDZA_Width	equ	(WBA_Dummy+30)

; Zone width, if relative to the window width (WORD)
WBDZA_RelWidth	equ	(WBA_Dummy+31)

; Zone height (WORD)
WBDZA_Height	equ	(WBA_Dummy+32)

; Zone height, if relative to the window height (WORD)
WBDZA_RelHeight	equ	(WBA_Dummy+33)

; Zone position and size (struct IBox *).
WBDZA_Box	equ	(WBA_Dummy+34)

; Hook to invoke when the mouse enters or leave a drop zone (struct Hook *).
WBDZA_Hook	equ	(WBA_Dummy+35)

;------------------------------------------------------------------------------

; The message your AppIcon rendering hook gets invoked with.
    STRUCTURE AppIconRenderMsg,0
	APTR	arm_RastPort	; RastPort to render into
	APTR	arm_Icon	; The icon to be rendered
	APTR	arm_Label	; The icon label txt
	APTR	arm_Tags	; Further tags to be passed on
						; to DrawIconStateA().

	WORD	arm_Left	; \ Rendering origin, not taking the
	WORD	arm_Top		; / button border into account.

	WORD	arm_Width	; \ Limit your rendering to
	WORD	arm_Height	; / this area.

	ULONG	arm_State	; IDS_SELECTED, IDS_NORMAL, etc.
    LABEL AppIconRenderMsg_SIZEOF

;----------------------------------------------------------------------------

; The message your drop zone hook gets invoked with.
    STRUCTURE AppWindowDropZoneMsg,0
    	APTR	adzm_RastPort			; RastPort to render into.
	STRUCT	adzm_DropZoneBox,ibox_SIZEOF	; Limit your rendering to this area.
	ULONG	adzm_ID				; \ These come from straight
	ULONG	adzm_UserData			; / from AddAppWindowDropZoneA().
	LONG	adzm_Action			; See below for a list of actions.
    LABEL AppWindowDropZoneMsg_SIZEOF

ADZMACTION_Enter	equ (0)
ADZMACTION_Leave	equ (1)

;----------------------------------------------------------------------------

; The message your icon selection change hook is invoked with.
    STRUCTURE IconSelectMsg,0
        ULONG	ism_Length		; Size of this data structure
					; (in bytes).
        BPTR	ism_Drawer		; Lock on the drawer this object
					; resides in, NULL for Workbench
					; backdrop (devices).
	APTR	ism_Name		; Name of the object in question.
	UWORD	ism_Type		; One of WBDISK, WBDRAWER, WBTOOL,
					; WBPROJECT, WBGARBAGE, WBDEVICE,
					; WBKICK or WBAPPICON.
	BOOL	ism_Selected		; TRUE if currently selected,
					; FALSE otherwise.
	APTR	ism_Tags		; Pointer to the list of tag items
					; passed to
	APTR	ism_DrawerWindow	; Pointer to the window attached
					; to this icon, if the icon is
					; a drawer-like object.
	APTR	ism_ParentWindow	; Pointer to the window the icon
					; resides in
	WORD	ism_Left		; Position and size of the icon;
	WORD	ism_Top			; note that the icon may not entirely
	WORD	ism_Width		; visible bounds of the parent window.
	WORD	ism_Height
    LABEL IconSelectMsg_SIZEOF

; These are the values your hook code can return
ISMACTION_Unselect	equ	(0)	; Unselect the icon
ISMACTION_Select	equ	(1)	; Select the icon
ISMACTION_Ignore	equ	(2)	; Do not change the selection state.
ISMACTION_Stop		equ	(3)	; Do not invoke the hook code again,
					; leave the icon as it is.

;----------------------------------------------------------------------------

; The messages your copy hook is invoked with.
    STRUCTURE CopyBeginMsg,0
        ULONG	cbm_Length		; Size of this data structure in bytes.
	LONG	cbm_Action		; Will be set to CPACTION_Begin (see below).
	BPTR	cbm_SourceDrawer	; A lock on the source drawer.
	BPTR	cbm_DestinationDrawer	; A lock on the destination drawer.
    LABEL CopyBeginMsg_SIZEOF

    STRUCTURE CopyDataMsg,0
	ULONG	cdm_Length		; Size of this data structure in bytes.
	LONG	cdm_Action		; Will be set to CPACTION_Copy (see below).

	BPTR	cdm_SourceLock		; A lock on the parent directory of the
					; source file/drawer.
	APTR	cdm_SourceName		; The name of the source file or drawer.

	BPTR	cdm_DestinationLock	; A lock on the parent directory of the
					; destination file/drawer.
	APTR	cdm_DestinationName	; The name of the destination file/drawer.
					; This may or may not match the name of
					; the source file/drawer in case the
					; data is to be copied under a different
					; name. For example, this is the case
					; with the Workbench "Copy" command which
					; creates duplicates of file/drawers by
					; prefixing the duplicate's name with
					; "Copy_XXX_of".
	LONG	cdm_DestinationX	; When the icon corresponding to the
					; destination is written to disk, this
					; is the position (put into its
					; DiskObject->do_CurrentX/DiskObject->do_CurrentY
					; fields) it should be placed at.
	LONG	cdm_DestinationY
    LABEL CopyDataMsg_SIZEOF

    STRUCTURE CopyEndMsg,0
	ULONG	cem_Length	; Size of this data structure in bytes.
	LONG	cem_Action	; Will be set to CPACTION_End (see below).
    LABEL CopyEndMsg_SIZEOF

CPACTION_Begin	equ	(0)	; This message arrives when the copying
				; process is started.
CPACTION_Copy	equ	(1)	; This message arrives for each file or
				; drawer to be copied.
CPACTION_End	equ	(2)	; This message arrives when all files/drawers
				; have been copied.
                
;----------------------------------------------------------------------------
                		
; The messages your delete hook is invoked with.
    STRUCTURE DeleteBeginMsg,0
	ULONG	dbm_Length	; Size of this data structure in bytes.
	LONG	dbm_Action	; Will be set to either DLACTION_BeginDiscard
				; or DLACTION_BeginEmptyTrash (see below).
    LABEL DeleteBeginMsg_SIZEOF

    STRUCTURE DeleteDataMsg,0
	ULONG	ddm_Length	; Size of this data structure in bytes.
	LONG	ddm_Action	; Will be set to either DLACTION_DeleteContents
				; or DLACTION_DeleteObject (see below).
	BPTR	ddm_Lock	; A Lock on the parent directory of the object
				; whose contents or which itself should be
				; deleted.
	APTR	ddm_Name	; The name of the object whose contents or
				; which itself should be deleted.
    LABEL DeleteDataMsg_SIZEOF

    STRUCTURE DeleteEndMsg,0
	ULONG	dem_Length	; Size of this data structure in bytes.
	LONG	dem_Action	; Will be set to DLACTION_End (see below).
    LABEL DeleteEndMsg_SIZEOF

DLACTION_BeginDiscard		equ	(0)	; This indicates that a number of
						; files and drawers should be
						; discarded; note that you will
						; receive a different kind of message
						; if the trashcan is to be emptied
						; (see below).
DLACTION_BeginEmptyTrash	equ	(1)	; This indicates that the following
						; delete operations are intended to
						; empty the trashcan.
DLACTION_DeleteContents		equ	(3)	; This indicates that the object
						; described by lock and name refers
						; to a drawer; you should empty its
						; contents but *DO NOT* delete the
						; drawer itself!
DLACTION_DeleteObject		equ	(4)	; This indicates that the object
						; described by lock and name should
						; be deleted; this could be a file
						; or an empty drawer.
DLACTION_End			equ	(5)	; This indicates that the
						; deletion process is finished.

;----------------------------------------------------------------------------

; The messages your text input hook is invoked with.
    STRUCTURE TextInputMsg,0
	ULONG	tim_Length	; Size of this data structure
				; in bytes.
	LONG	tim_Action	; One of the TIACTION_...
				; values listed below.
	APTR	tim_Prompt	; The Workbench suggested
				; result, depending on what
				; kind of input is requested
				; (as indicated by the
				; tim_Action member).
    LABEL TextInputMsg_SIZEOF

TIACTION_Rename		equ	(0)	; A file or drawer is to be
					; renamed.
TIACTION_RelabelVolume	equ	(1)	; A volume is to be relabeled.
TIACTION_NewDrawer	equ	(2)	; A new drawer is to be created.
TIACTION_Execute	equ	(3)	; A program or script is to be
					; executed.

;----------------------------------------------------------------------------

; Parameters for the UpdateWorkbench() function.

UPDATEWB_ObjectRemoved	equ	(0)	; Object has been deleted.
UPDATEWB_ObjectAdded	eqz	(1)	; Object is new or has changed.

;----------------------------------------------------------------------------

	ENDC	; WORKBENCH_WORKBENCH_I
