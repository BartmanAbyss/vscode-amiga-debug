#ifndef WORKBENCH_WORKBENCH_H
#define WORKBENCH_WORKBENCH_H
/*
**	$VER: workbench.h 45.6 (23.11.2000)
**	Includes Release 45.1
**
**	workbench.library general definitions
**
**	Copyright © 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TASKS_H
#include <exec/tasks.h>
#endif

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

#define	WBDISK		1
#define	WBDRAWER	2
#define	WBTOOL		3
#define	WBPROJECT	4
#define	WBGARBAGE	5
#define	WBDEVICE	6
#define	WBKICK		7
#define WBAPPICON	8

struct OldDrawerData { /* pre V36 definition */
    struct NewWindow	dd_NewWindow;	/* args to open window */
    LONG		dd_CurrentX;	/* current x coordinate of origin */
    LONG		dd_CurrentY;	/* current y coordinate of origin */
};
/* the amount of DrawerData actually written to disk */
#define OLDDRAWERDATAFILESIZE	(sizeof(struct OldDrawerData))

struct DrawerData {
    struct NewWindow	dd_NewWindow;	/* args to open window */
    LONG		dd_CurrentX;	/* current x coordinate of origin */
    LONG		dd_CurrentY;	/* current y coordinate of origin */
    ULONG		dd_Flags;	/* flags for drawer */
    UWORD		dd_ViewModes;	/* view mode for drawer */
};
/* the amount of DrawerData actually written to disk */
#define DRAWERDATAFILESIZE	(sizeof(struct DrawerData))

/* definitions for dd_ViewModes */
#define DDVM_BYDEFAULT		0	/* default (inherit parent's view mode) */
#define DDVM_BYICON		1	/* view as icons */
#define DDVM_BYNAME		2	/* view as text, sorted by name */
#define DDVM_BYDATE		3	/* view as text, sorted by date */
#define DDVM_BYSIZE		4	/* view as text, sorted by size */
#define DDVM_BYTYPE		5	/* view as text, sorted by type */

/* definitions for dd_Flags */
#define	DDFLAGS_SHOWDEFAULT	0	/* default (show only icons) */
#define	DDFLAGS_SHOWICONS	1	/* show only icons */
#define	DDFLAGS_SHOWALL		2	/* show all files */

struct DiskObject {
    UWORD		do_Magic; /* a magic number at the start of the file */
    UWORD		do_Version; /* a version number, so we can change it */
    struct Gadget 	do_Gadget;	/* a copy of in core gadget */
    UBYTE		do_Type;
    STRPTR		do_DefaultTool;
    STRPTR *		do_ToolTypes;
    LONG		do_CurrentX;
    LONG		do_CurrentY;
    struct DrawerData *	do_DrawerData;
    STRPTR		do_ToolWindow;	/* only applies to tools */
    LONG		do_StackSize;	/* only applies to tools */

};

#define WB_DISKMAGIC	0xe310	/* a magic number, not easily impersonated */
#define WB_DISKVERSION	1	/* our current version number */
#define WB_DISKREVISION	1	/* our current revision number */
/* I only use the lower 8 bits of Gadget.UserData for the revision # */
#define WB_DISKREVISIONMASK	255

struct FreeList {
    WORD		fl_NumFree;
    struct List		fl_MemList;
};

/* workbench does different complement modes for its gadgets.
** It supports separate images, complement mode, and backfill mode.
** The first two are identical to intuitions GFLG_GADGIMAGE and GFLG_GADGHCOMP.
** backfill is similar to GFLG_GADGHCOMP, but the region outside of the
** image (which normally would be color three when complemented)
** is flood-filled to color zero.
*/
#define GFLG_GADGBACKFILL 0x0001
#define GADGBACKFILL	  0x0001    /* an old synonym */

/* if an icon does not really live anywhere, set its current position
** to here
*/
#define NO_ICON_POSITION	(0x80000000)

/* workbench now is a library.  this is it's name */
#define WORKBENCH_NAME		"workbench.library"

/****************************************************************************/

/* If you find am_Version >= AM_VERSION, you know this structure has
 * at least the fields defined in this version of the include file
 */
#define	AM_VERSION	1

struct AppMessage {
    struct Message am_Message;	/* standard message structure */
    UWORD am_Type;		/* message type */
    ULONG am_UserData;		/* application specific */
    ULONG am_ID;		/* application definable ID */
    LONG am_NumArgs;		/* # of elements in arglist */
    struct WBArg *am_ArgList;	/* the arguments themselves */
    UWORD am_Version;		/* will be >= AM_VERSION */
    UWORD am_Class;		/* message class */
    WORD am_MouseX;		/* mouse x position of event */
    WORD am_MouseY;		/* mouse y position of event */
    ULONG am_Seconds;		/* current system clock time */
    ULONG am_Micros;		/* current system clock time */
    ULONG am_Reserved[8];	/* avoid recompilation */
};

/* types of app messages */
#define AMTYPE_APPWINDOW        7	/* app window message    */
#define AMTYPE_APPICON	        8	/* app icon message      */
#define AMTYPE_APPMENUITEM      9	/* app menu item message */
#define AMTYPE_APPWINDOWZONE   10	/* app window drop zone message    */

/* Classes of AppIcon messages (V44) */
#define AMCLASSICON_Open	0	/* The "Open" menu item was invoked,
					 * the icon got double-clicked or an
					 * icon got dropped on it.
					 */
#define AMCLASSICON_Copy	1	/* The "Copy" menu item was invoked */
#define AMCLASSICON_Rename	2	/* The "Rename" menu item was invoked */
#define AMCLASSICON_Information	3	/* The "Information" menu item was invoked */
#define AMCLASSICON_Snapshot	4	/* The "Snapshot" menu item was invoked */
#define AMCLASSICON_UnSnapshot	5	/* The "UnSnapshot" menu item was invoked */
#define AMCLASSICON_LeaveOut	6	/* The "Leave Out" menu item was invoked */
#define AMCLASSICON_PutAway	7	/* The "Put Away" menu item was invoked */
#define AMCLASSICON_Delete	8	/* The "Delete" menu item was invoked */
#define AMCLASSICON_FormatDisk	9	/* The "Format Disk" menu item was invoked */
#define AMCLASSICON_EmptyTrash	10	/* The "Empty Trash" menu item was invoked */

#define AMCLASSICON_Selected	11	/* The icon is now selected */
#define AMCLASSICON_Unselected	12	/* The icon is now unselected */

/*
 * The following structures are private.  These are just stub
 * structures for code compatibility...
 */
struct AppWindow		{ void * aw_PRIVATE;   };
struct AppWindowDropZone	{ void * awdz_PRIVATE; };
struct AppIcon			{ void * ai_PRIVATE;   };
struct AppMenuItem		{ void * ami_PRIVATE;  };
struct AppMenu			{ void * am_PRIVATE;  };

/****************************************************************************/

#define	WBA_Dummy (TAG_USER+0xA000)

/****************************************************************************/

/* Tags for use with AddAppIconA() */

/* AppIcon responds to the "Open" menu item (BOOL). */
#define WBAPPICONA_SupportsOpen		(WBA_Dummy+1)

/* AppIcon responds to the "Copy" menu item (BOOL). */
#define WBAPPICONA_SupportsCopy		(WBA_Dummy+2)

/* AppIcon responds to the "Rename" menu item (BOOL). */
#define WBAPPICONA_SupportsRename	(WBA_Dummy+3)

/* AppIcon responds to the "Information" menu item (BOOL). */
#define WBAPPICONA_SupportsInformation	(WBA_Dummy+4)

/* AppIcon responds to the "Snapshot" menu item (BOOL). */
#define WBAPPICONA_SupportsSnapshot	(WBA_Dummy+5)

/* AppIcon responds to the "UnSnapshot" menu item (BOOL). */
#define WBAPPICONA_SupportsUnSnapshot	(WBA_Dummy+6)

/* AppIcon responds to the "LeaveOut" menu item (BOOL). */
#define WBAPPICONA_SupportsLeaveOut	(WBA_Dummy+7)

/* AppIcon responds to the "PutAway" menu item (BOOL). */
#define WBAPPICONA_SupportsPutAway	(WBA_Dummy+8)

/* AppIcon responds to the "Delete" menu item (BOOL). */
#define WBAPPICONA_SupportsDelete	(WBA_Dummy+9)

/* AppIcon responds to the "FormatDisk" menu item (BOOL). */
#define WBAPPICONA_SupportsFormatDisk	(WBA_Dummy+10)

/* AppIcon responds to the "EmptyTrash" menu item (BOOL). */
#define WBAPPICONA_SupportsEmptyTrash	(WBA_Dummy+11)

/* AppIcon position should be propagated back to original DiskObject (BOOL). */
#define WBAPPICONA_PropagatePosition	(WBA_Dummy+12)

/* Callback hook to be invoked when rendering this icon (struct Hook *). */
#define WBAPPICONA_RenderHook		(WBA_Dummy+13)

/* AppIcon wants to be notified when its select state changes (BOOL). */
#define	WBAPPICONA_NotifySelectState	(WBA_Dummy+14)

/****************************************************************************/

/* Tags for use with AddAppMenuA() */

/* Command key string for this AppMenu (STRPTR). */
#define	WBAPPMENUA_CommandKeyString	 (WBA_Dummy+15)

/* Item to be added should get sub menu items attached to; make room for it,
 * then return the key to use later for attaching the items (ULONG *).
 */
#define	WBAPPMENUA_GetKey		(WBA_Dummy+65)

/* This item should be attached to a sub menu; the key provided refers to
 * the sub menu it should be attached to (ULONG).
 */
#define	WBAPPMENUA_UseKey		(WBA_Dummy+66)

/* Item to be added is in fact a new menu title; make room for it, then
 * return the key to use later for attaching the items (ULONG *).
 */
#define	WBAPPMENUA_GetTitleKey		(WBA_Dummy+77)

/****************************************************************************/

/* Tags for use with OpenWorkbenchObjectA() */

/* Corresponds to the wa_Lock member of a struct WBArg */
#define WBOPENA_ArgLock			(WBA_Dummy+16)

/* Corresponds to the wa_Name member of a struct WBArg */
#define WBOPENA_ArgName			(WBA_Dummy+17)

/* When opening a drawer, show all files or only icons?
 * This must be one out of DDFLAGS_SHOWICONS,
 * or DDFLAGS_SHOWALL; (UBYTE); (V45)
 */
#define	WBOPENA_Show			(WBA_Dummy+75)

/* When opening a drawer, view the contents by icon, name,
 * date, size or type? This must be one out of DDVM_BYICON,
 * DDVM_BYNAME, DDVM_BYDATE, DDVM_BYSIZE or DDVM_BYTYPE;
 * (UBYTE); (V45)
 */
#define	WBOPENA_ViewBy			(WBA_Dummy+76)

/****************************************************************************/

/* Tags for use with WorkbenchControlA() */

/* Check if the named drawer is currently open (LONG *). */
#define WBCTRLA_IsOpen			(WBA_Dummy+18)

/* Create a duplicate of the Workbench private search path list (BPTR *). */
#define WBCTRLA_DuplicateSearchPath	(WBA_Dummy+19)

/* Free the duplicated search path list (BPTR). */
#define WBCTRLA_FreeSearchPath		(WBA_Dummy+20)

/* Get the default stack size for launching programs with (ULONG *). */
#define WBCTRLA_GetDefaultStackSize	(WBA_Dummy+21)

/* Set the default stack size for launching programs with (ULONG). */
#define WBCTRLA_SetDefaultStackSize	(WBA_Dummy+22)

/* Cause an AppIcon to be redrawn (struct AppIcon *). */
#define WBCTRLA_RedrawAppIcon		(WBA_Dummy+23)

/* Get a list of currently running Workbench programs (struct List **). */
#define WBCTRLA_GetProgramList		(WBA_Dummy+24)

/* Release the list of currently running Workbench programs (struct List *). */
#define WBCTRLA_FreeProgramList		(WBA_Dummy+25)

/* Get a list of currently selected icons (struct List **). */
#define	WBCTRLA_GetSelectedIconList	(WBA_Dummy+36)

/* Release the list of currently selected icons (struct List *). */
#define	WBCTRLA_FreeSelectedIconList	(WBA_Dummy+37)

/* Get a list of currently open drawers (struct List **). */
#define	WBCTRLA_GetOpenDrawerList	(WBA_Dummy+38)

/* Release the list of currently open icons (struct List *). */
#define	WBCTRLA_FreeOpenDrawerList	(WBA_Dummy+39)

/* Get the list of hidden devices (struct List **). */
#define	WBCTRLA_GetHiddenDeviceList	(WBA_Dummy+42)

/* Release the list of hidden devices (struct List *). */
#define	WBCTRLA_FreeHiddenDeviceList	(WBA_Dummy+43)

/* Add the name of a device which Workbench should never try to
 * read a disk icon from (STRPTR).
 */
#define	WBCTRLA_AddHiddenDeviceName	(WBA_Dummy+44)

/* Remove a name from list of hidden devices (STRPTR). */
#define	WBCTRLA_RemoveHiddenDeviceName	(WBA_Dummy+45)

/* Get the number of seconds that have to pass before typing
 * the next character in a drawer window will restart
 * with a new file name (ULONG *).
 */
#define	WBCTRLA_GetTypeRestartTime	(WBA_Dummy+47)

/* Set the number of seconds that have to pass before typing
 * the next character in a drawer window will restart
 * with a new file name (ULONG).
 */
#define	WBCTRLA_SetTypeRestartTime	(WBA_Dummy+48)

/* Obtain the hook that will be invoked when Workbench starts
 * to copy files and data (struct Hook **); (V45)
 */
#define WBCTRLA_GetCopyHook		(WBA_Dummy+69)

/* Install the hook that will be invoked when Workbench starts
 * to copy files and data (struct Hook *); (V45)
 */
#define WBCTRLA_SetCopyHook		(WBA_Dummy+70)

/* Obtain the hook that will be invoked when Workbench discards
 * files and drawers or empties the trashcan (struct Hook **);
 * (V45).
 */
#define WBCTRLA_GetDeleteHook		(WBA_Dummy+71)

/* Install the hook that will be invoked when Workbench discards
 * files and drawers or empties the trashcan (struct Hook *);
 * (V45).
 */
#define WBCTRLA_SetDeleteHook		(WBA_Dummy+72)

/* Obtain the hook that will be invoked when Workbench requests
 * that the user enters text, such as when a file is to be renamed
 * or a new drawer is to be created (struct Hook **); (V45)
 */
#define WBCTRLA_GetTextInputHook	(WBA_Dummy+73)

/* Install the hook that will be invoked when Workbench requests
 * that the user enters text, such as when a file is to be renamed
 * or a new drawer is to be created (struct Hook *); (V45)
 */
#define WBCTRLA_SetTextInputHook	(WBA_Dummy+74)

/* Add a hook that will be invoked when Workbench is about 
 * to shut down (cleanup), and when Workbench has returned
 * to operational state (setup) (struct Hook *); (V45)
 */
#define	WBCTRLA_AddSetupCleanupHook	(WBA_Dummy+78)

/* Remove a hook that has been installed with the
 * WBCTRLA_AddSetupCleanupHook tag (struct Hook *); (V45)
 */
#define	WBCTRLA_RemSetupCleanupHook	(WBA_Dummy+79)

/****************************************************************************/

/* The message your setup/cleanup hook gets invoked with. */
struct SetupCleanupHookMsg
{
	ULONG	schm_Length;	/* Size of this data structure (in bytes). */
	LONG	schm_State;	/* See below for definitions. */
};

#define SCHMSTATE_TryCleanup	0	/* Workbench will attempt to shut down now. */
#define SCHMSTATE_Cleanup	1	/* Workbench will really shut down now. */
#define SCHMSTATE_Setup		2	/* Workbench is operational again or
					 * could not be shut down.
					 */

/****************************************************************************/

/* Tags for use with AddAppWindowDropZoneA() */

/* Zone left edge (WORD) */
#define WBDZA_Left	(WBA_Dummy+26)

/* Zone left edge, if relative to the right edge of the window (WORD) */
#define WBDZA_RelRight	(WBA_Dummy+27)

/* Zone top edge (WORD) */
#define WBDZA_Top	(WBA_Dummy+28)

/* Zone top edge, if relative to the bottom edge of the window (WORD) */
#define WBDZA_RelBottom	(WBA_Dummy+29)

/* Zone width (WORD) */
#define WBDZA_Width	(WBA_Dummy+30)

/* Zone width, if relative to the window width (WORD) */
#define WBDZA_RelWidth	(WBA_Dummy+31)

/* Zone height (WORD) */
#define WBDZA_Height	(WBA_Dummy+32)

/* Zone height, if relative to the window height (WORD) */
#define WBDZA_RelHeight	(WBA_Dummy+33)

/* Zone position and size (struct IBox *). */
#define WBDZA_Box	(WBA_Dummy+34)

/* Hook to invoke when the mouse enters or leave a drop zone (struct Hook *). */
#define WBDZA_Hook	(WBA_Dummy+35)

/****************************************************************************/

/* Reserved tags; don't use! */
#define	WBA_Reserved1	(WBA_Dummy+40)
#define	WBA_Reserved2	(WBA_Dummy+41)
#define	WBA_Reserved3	(WBA_Dummy+46)
#define	WBA_Reserved4	(WBA_Dummy+49)
#define	WBA_Reserved5	(WBA_Dummy+50)
#define	WBA_Reserved6	(WBA_Dummy+51)
#define	WBA_Reserved7	(WBA_Dummy+52)
#define	WBA_Reserved8	(WBA_Dummy+53)
#define	WBA_Reserved9	(WBA_Dummy+54)
#define	WBA_Reserved10	(WBA_Dummy+55)
#define	WBA_Reserved11	(WBA_Dummy+56)
#define	WBA_Reserved12	(WBA_Dummy+57)
#define	WBA_Reserved13	(WBA_Dummy+58)
#define	WBA_Reserved14	(WBA_Dummy+59)
#define	WBA_Reserved15	(WBA_Dummy+60)
#define	WBA_Reserved16	(WBA_Dummy+61)
#define	WBA_Reserved17	(WBA_Dummy+62)
#define	WBA_Reserved18	(WBA_Dummy+63)
#define	WBA_Reserved19	(WBA_Dummy+64)
#define	WBA_Reserved20	(WBA_Dummy+67)
#define	WBA_Reserved21	(WBA_Dummy+68)

/****************************************************************************/

#define	WBA_LAST_TAG (WBA_Dummy+79)

/****************************************************************************/

/* The message your AppIcon rendering hook gets invoked with. */
struct AppIconRenderMsg
{
	struct RastPort *	arm_RastPort;	/* RastPort to render into */
	struct DiskObject *	arm_Icon;	/* The icon to be rendered */
	STRPTR			arm_Label;	/* The icon label txt */
	struct TagItem *	arm_Tags;	/* Further tags to be passed on
						 * to DrawIconStateA().
						 */

	WORD			arm_Left;	/* \ Rendering origin, not taking the */
	WORD			arm_Top;	/* / button border into account. */

	WORD			arm_Width;	/* \ Limit your rendering to */
	WORD			arm_Height;	/* / this area. */

	ULONG			arm_State;	/* IDS_SELECTED, IDS_NORMAL, etc. */
};

/****************************************************************************/

/* The message your drop zone hook gets invoked with. */
struct AppWindowDropZoneMsg
{
	struct RastPort *	adzm_RastPort;		/* RastPort to render into. */
	struct IBox		adzm_DropZoneBox;	/* Limit your rendering to this area. */
	ULONG			adzm_ID;		/* \ These come from straight */
	ULONG			adzm_UserData;		/* / from AddAppWindowDropZoneA(). */
	LONG			adzm_Action;		/* See below for a list of actions. */
};

#define ADZMACTION_Enter	(0)
#define ADZMACTION_Leave	(1)

/****************************************************************************/

/* The message your icon selection change hook is invoked with. */
struct IconSelectMsg
{
	/* Size of this data structure (in bytes). */
	ULONG			ism_Length;

	/* Lock on the drawer this object resides in,
	 * NULL for Workbench backdrop (devices).
	 */
	BPTR			ism_Drawer;

	/* Name of the object in question. */
	STRPTR			ism_Name;

	/* One of WBDISK, WBDRAWER, WBTOOL, WBPROJECT,
	 * WBGARBAGE, WBDEVICE, WBKICK or WBAPPICON.
	 */
	UWORD			ism_Type;

	/* TRUE if currently selected, FALSE otherwise. */
	BOOL			ism_Selected;

	/* Pointer to the list of tag items passed to
	 * ChangeWorkbenchSelectionA().
	 */
	struct TagItem *	ism_Tags;

	/* Pointer to the window attached to this icon,
	 * if the icon is a drawer-like object.
	 */
	struct Window *		ism_DrawerWindow;

	/* Pointer to the window the icon resides in. */
	struct Window *		ism_ParentWindow;

	/* Position and size of the icon; note that the
	 * icon may not entirely reside within the visible
	 * bounds of the parent window.
	 */
	WORD			ism_Left;
	WORD			ism_Top;
	WORD			ism_Width;
	WORD			ism_Height;
};

/* These are the values your hook code can return. */
#define ISMACTION_Unselect	(0)	/* Unselect the icon */
#define ISMACTION_Select	(1)	/* Select the icon */
#define ISMACTION_Ignore	(2)	/* Do not change the selection state. */
#define ISMACTION_Stop		(3)	/* Do not invoke the hook code again,
					 * leave the icon as it is.
					 */

/****************************************************************************/

/* The messages your copy hook is invoked with. */
struct CopyBeginMsg
{
	ULONG	cbm_Length;		/* Size of this data structure in bytes. */
	LONG	cbm_Action;		/* Will be set to CPACTION_Begin (see below). */
	BPTR	cbm_SourceDrawer;	/* A lock on the source drawer. */
	BPTR	cbm_DestinationDrawer;	/* A lock on the destination drawer. */
};

struct CopyDataMsg
{
	ULONG	cdm_Length;		/* Size of this data structure in bytes. */
	LONG	cdm_Action;		/* Will be set to CPACTION_Copy (see below). */

	BPTR	cdm_SourceLock;		/* A lock on the parent directory of the
					 * source file/drawer.
					 */
	STRPTR	cdm_SourceName;		/* The name of the source file or drawer. */

	BPTR	cdm_DestinationLock;	/* A lock on the parent directory of the
					 * destination file/drawer.
					 */
	STRPTR	cdm_DestinationName;	/* The name of the destination file/drawer.
					 * This may or may not match the name of
					 * the source file/drawer in case the
					 * data is to be copied under a different
					 * name. For example, this is the case
					 * with the Workbench "Copy" command which
					 * creates duplicates of file/drawers by
					 * prefixing the duplicate's name with
					 * "Copy_XXX_of".
					 */
	LONG	cdm_DestinationX;	/* When the icon corresponding to the
					 * destination is written to disk, this
					 * is the position (put into its
					 * DiskObject->do_CurrentX/DiskObject->do_CurrentY
					 * fields) it should be placed at.
					 */
	LONG	cdm_DestinationY;
};

struct CopyEndMsg
{
	ULONG	cem_Length;		/* Size of this data structure in bytes. */
	LONG	cem_Action;		/* Will be set to CPACTION_End (see below). */
};

#define CPACTION_Begin		(0)	/* This message arrives when the copying
					 * process is started.
					 */
#define CPACTION_Copy		(1)	/* This message arrives for each file or
					 * drawer to be copied.
					 */
#define CPACTION_End		(2)	/* This message arrives when all files/drawers
					 * have been copied.
					 */

/****************************************************************************/

/* The messages your delete hook is invoked with. */
struct DeleteBeginMsg
{
	ULONG	dbm_Length;		/* Size of this data structure in bytes. */
	LONG	dbm_Action;		/* Will be set to either DLACTION_BeginDiscard
					 * or DLACTION_BeginEmptyTrash (see below).
					 */
};

struct DeleteDataMsg
{
	ULONG	ddm_Length;		/* Size of this data structure in bytes. */
	LONG	ddm_Action;		/* Will be set to either DLACTION_DeleteContents
					 * or DLACTION_DeleteObject (see below).
					 */
	BPTR	ddm_Lock;		/* A Lock on the parent directory of the object
					 * whose contents or which itself should be
					 * deleted.
					 */
	STRPTR	ddm_Name;		/* The name of the object whose contents or
					 * which itself should be deleted.
					 */
};

struct DeleteEndMsg
{
	ULONG	dem_Length;		/* Size of this data structure in bytes. */
	LONG	dem_Action;		/* Will be set to DLACTION_End (see below). */
};

#define DLACTION_BeginDiscard		(0)	/* This indicates that a number of
						 * files and drawers should be
						 * discarded; note that you will
						 * receive a different kind of message
						 * if the trashcan is to be emptied
						 * (see below).
						 */
#define DLACTION_BeginEmptyTrash	(1)	/* This indicates that the following
						 * delete operations are intended to
						 * empty the trashcan.
						 */
#define DLACTION_DeleteContents		(3)	/* This indicates that the object
						 * described by lock and name refers
						 * to a drawer; you should empty its
						 * contents but *DO NOT* delete the
						 * drawer itself!
						 */
#define DLACTION_DeleteObject		(4)	/* This indicates that the object
						 * described by lock and name should
						 * be deleted; this could be a file
						 * or an empty drawer.
						 */
#define DLACTION_End			(5)	/* This indicates that the
						 * deletion process is finished.
						 */

/****************************************************************************/

/* The messages your text input hook is invoked with. */
struct TextInputMsg
{
	ULONG	tim_Length;			/* Size of this data structure
						 * in bytes.
						 */
	LONG	tim_Action;			/* One of the TIACTION_...
						 * values listed below.
						 */
	STRPTR	tim_Prompt;			/* The Workbench suggested
						 * result, depending on what
						 * kind of input is requested
						 * (as indicated by the
						 * tim_Action member).
						 */
};

#define TIACTION_Rename		(0)		/* A file or drawer is to be
						 * renamed.
						 */
#define TIACTION_RelabelVolume	(1)		/* A volume is to be relabeled. */
#define TIACTION_NewDrawer	(2)		/* A new drawer is to be created. */
#define TIACTION_Execute	(3)		/* A program or script is to be
						 * executed.
						 */

/****************************************************************************/

/* Parameters for the UpdateWorkbench() function. */

#define UPDATEWB_ObjectRemoved	(0)	/* Object has been deleted. */
#define UPDATEWB_ObjectAdded	(1)	/* Object is new or has changed. */

/****************************************************************************/

#endif  /* !WORKBENCH_WORKBENCH_H */
