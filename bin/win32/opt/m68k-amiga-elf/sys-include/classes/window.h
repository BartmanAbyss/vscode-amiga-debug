#ifndef CLASSES_WINDOW_H
#define CLASSES_WINDOW_H
/*
**	$VER: window.h 45.2 (01.09.2001)
**	Includes Release 45.1
**
**	window.class definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/****************************************************************************/

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

/****************************************************************************/

/*
** Attributes specific to window.class
*/

#define WINDOW_Dummy			(REACTION_Dummy + 0x25000)

#define WINDOW_Window        (WINDOW_Dummy + 1)
    /* (struct Window *) Return the pointer to the real      */
    /*                   Intuition window structure.         */

#define WINDOW_SigMask       (WINDOW_Dummy + 2)
    /* (ULONG) Return the signal bit that you must wait for  */
    /*         this window to know if the window as received */
    /*         any input.                                    */
    /* Defaults to 0.                                        */

#define WINDOW_MenuStrip     (WINDOW_Dummy + 4)
    /* (struct MenuStrip *) A list of Menu structure that will */
    /*                 be used as the menu of this window    */
    /*                 when open.                            */
    /* Defaults to NULL.                                     */

#define WINDOW_Layout	(WINDOW_Dummy + 5)
#define WINDOW_ParentLayout   	WINDOW_Layout
#define WINDOW_ParentGroup		WINDOW_Layout
    /* (Object *)        Layout group object for the window  */
    /* Defaults to NULL.                                     */

#define WINDOW_UserData      (WINDOW_Dummy + 6)
    /* (APTR) A value that will be stored in the Window      */
    /*        Object structure.                              */
    /* Defaults to NULL.                                     */

#define WINDOW_SharedPort    (WINDOW_Dummy + 7)
    /* (struct MsgPort *) A port that will be used for this  */
    /*                    window.  The port will not be      */
    /*                    closed at dispose time.            */
    /* Defaults to NULL.                                     */

#define WINDOW_Zoom          (WINDOW_Dummy + 8)
    /* When TRUE, it will act as a click on the zoom button. */

#define WINDOW_FrontBack     (WINDOW_Dummy + 9)
    /* (UWORD) Only WT_FRONT and WT_BACK can be used here.   */
    /*         This put the window in front or in back of    */
    /*         others windows                                */

#define WINDOW_Activate      (WINDOW_Dummy +10)
    /* (BOOL) Activate the window (and its master group) if  */
    /*        set to TRUE and the                            */
    /*        window is open.                                */

#define WINDOW_LockWidth     (WINDOW_Dummy +11)
    /* (BOOL) Lock the window from resize in width.          */
    /* Defaults to FALSE.                                    */

#define WINDOW_LockHeight    (WINDOW_Dummy +12)
    /* (BOOL) Lock the window from resize in height.         */
    /* Defaults to FALSE.                                    */

#define WINDOW_AppPort       (WINDOW_Dummy +13)
	/* (struct MsgPort *) A shared message port for appmessages */
	/* 	You must pass this to be able to iconify the window. */
    /* Defaults to NULL.                                     */

#define WINDOW_Position		 (WINDOW_Dummy +14)
	/* (ULONG) The initial position to open at.				 */

#define WINDOW_IDCMPHook     (WINDOW_Dummy +15)
    /* (struct Hook *) Defaults to NULL.                     */

#define WINDOW_IDCMPHookBits (WINDOW_Dummy +16)
    /* (ULONG) Defaults to 0L.                               */

#define WINDOW_GadgetUserData	(WINDOW_Dummy +17)
#define WINDOW_InterpretUserData	WINDOW_GadgetUserData
	/* (UWORD) How Gadget.UserData is interpreted.           */
	/* Defaults to WGUD_IGNORE */

#define WINDOW_MenuUserData	(WINDOW_Dummy +25)
	/* (UWORD) How GTMENUITEM_USERDATA is interpreted.		*/

#define WGUD_HOOK 0		/* Gadget/MenuItem UserData points to a Hook */
#define WGUD_FUNC 1		/* Points to a function */
#define WGUD_IGNORE 2	/* App private, don't touch it */

#define WINDOW_IconTitle	 (WINDOW_Dummy +18)
	/* (STRPTR) Title of the iconified window.               */

#define WINDOW_AppMsgHook	 (WINDOW_Dummy +19)
	/* (struct Hook *) Defaults to NULL.                     */

#define WINDOW_Icon			 (WINDOW_Dummy +20)
	/* (struct DiskObject *) Custom icon for the window.     */

#define WINDOW_AppWindow	 (WINDOW_Dummy +21)
	/* (BOOL) Make the window a Workbench AppWindow. */

#define WINDOW_GadgetHelp	 (WINDOW_Dummy +22)
	/* (BOOL) Set gadget-help on/off. */

#define WINDOW_IconifyGadget (WINDOW_Dummy +23)
	/* (BOOL) Add an iconification gadget to window title bar. */

#define WINDOW_TextAttr		 (WINDOW_Dummy +24)
	/* (struct TextAttr *)Default font for window. If not set, use screen font. */

#define WINDOW_BackFillName	 (WINDOW_Dummy +26)
	/* (STRPTR) replaces the default backfill pattern with this file,
	 * loaded through datatypes.
	 */

#define WINDOW_RefWindow	 (WINDOW_Dummy +41)
	/* (struct Window *) Causes WINDOW_Position to be relative to
	 * to this window vs the screen. (V42)
	 */

#define WINDOW_InputEvent	 (WINDOW_Dummy +42)
	/* (struct InputEvent *) returns a pointer to an inputevent
	 * which will be current *ONLY* after a WHMI_RAWKEY. (V42)
	 */

#define WINDOW_HintInfo		 (WINDOW_Dummy +43)
	/* (struct HintInfo *) Static Array of help hints.
 	 *      Pointer to a gadget HintInfo array. This is similar in concept
     *      to Apple's bubble help or Microsoft's help tips. By providing
     *      this array of helpinfo, and setting WINDOW_GadgetHelp, TRUE,
     *      window class will transparently manage the help hints.
	 */

#define WINDOW_KillWindow		(WINDOW_Dummy +44)
#define WINDOW_Application		(WINDOW_Dummy +45)
	/* ** PRIVATE TAGS SET/GET BY APPLICATION CLASS! ** (V43 BETA)
	 */

#define WINDOW_InterpretIDCMPHook	(WINDOW_Dummy +46)
	/* Interpret IDCMPHook results. (V43 BETA)
	 */

#define WINDOW_Parent			(WINDOW_Dummy +47)
	/* ** PRIVATE TAGS SET/GET BY APPLICATION CLASS! ** (V43 BETA)
	 */

#define WINDOW_PreRefreshHook	(WINDOW_Dummy +48)
	/* (struct Hook *) window.class calls this hook BEFORE RefreshGList() */

#define WINDOW_PostRefreshHook	(WINDOW_Dummy +49)
	/* (struct Hook *) window.class calls this hook AFTER RefreshGList() */

#define WINDOW_AppWindowPtr	(WINDOW_Dummy +50)
	/* (struct AppWindow *) GetAttr()'able pointer to AddAppWindow() result.*/

/*** PRIVATE ***/

#define WINDOW_VertProp		(WINDOW_Dummy +27)
	/* (BOOL) Enable vertical border scroller if true. v45 */

#define WINDOW_VertObject	(WINDOW_Dummy +28)
	/* (Object *) OM_GET the vertical scroller object pointer. v45 */

#define WINDOW_HorizProp	(WINDOW_Dummy +29)
	/* (BOOL) Enable horizontal border scroller if true. v45 */

#define WINDOW_HorizObject	(WINDOW_Dummy +30)
	/* (Object *) OM_GET the horizontal scroller object pointer. v45 */


/****************************************************************************/

/* Pre-defined WM_HANDLEINPUT return codes.
 */
#define WMHI_LASTMSG               (0L)	/* No more messages                 */
#define WMHI_IGNORE               (~0L)	/* Ignore                           */
#define WMHI_GADGETMASK		   (0xffff) /* Gadget ID mask value             */
#define WMHI_MENUMASK		   (0xffff)	/* Menu ID mask value               */
#define WMHI_KEYMASK			   (0xff)   /* Key code mask value              */
#define WMHI_CLASSMASK 	   (0xffff0000)	/* Event class mask value			*/
#define WMHI_CLOSEWINDOW        (1<<16) /* The close gadget was clicked     */
                                        /* or a hook function trigged close */
#define WMHI_GADGETUP			(2<<16)	/* A gadget was released			*/
#define WMHI_INACTIVE           (3<<16) /* The window was de-activated      */
#define WMHI_ACTIVE             (4<<16) /* The window was activated         */
#define WMHI_NEWSIZE			(5<<16) /* The window was resized           */
#define WMHI_MENUPICK			(6<<16)	/* A menu item was picked			*/
#define WMHI_MENUHELP			(7<<16) /* Help was hit in a menu			*/
#define WMHI_GADGETHELP			(8<<16)	/* A gadget returns a help code		*/
#define WMHI_ICONIFY			(9<<16) /* Window requests to be iconified  */
#define WMHI_UNICONIFY		   (10<<16)	/* Window was uniconified           */
#define WMHI_RAWKEY            (11<<16) /* Raw key codes                    */
#define WMHI_VANILLAKEY        (12<<16) /* Vanilla key codes                */
#define WMHI_CHANGEWINDOW	   (13<<16) /* Window moved (or depth arranged) */
#define WMHI_INTUITICK         (14<<16) /* IDCMP intuitick (maximum 10 per second) */
#define WMHI_MOUSEMOVE         (15<<16) /* IDCMP mouse move */
#define WMHI_MOUSEBUTTONS      (16<<16) /* IDCMP mouse buttons */
#define WMHI_DISPOSEDWINDOW	   (17<<16) /* hook function triggered disposal */

/****************************************************************************/

#define WMF_ZOOMED			   (0x0001) /* Window is in zoomed state		*/
#define WMF_ZIPWINDOW		   (0x0002) /* This resize toggled zoom state	*/

/****************************************************************************/

/* Possible WINDOW_FrontBack values
 */
#define WT_FRONT   TRUE
#define WT_BACK    FALSE

/* Possible WINDOW_Position values
 */
#define WPOS_CENTERSCREEN        (1L)   /* Center on the screen             */
#define WPOS_CENTERMOUSE         (2L)   /* Center under the mouse           */
#define WPOS_TOPLEFT             (3L)   /* Top-left of the screen           */
#define WPOS_CENTERWINDOW        (4L)   /* Center in another window         */
#define WPOS_FULLSCREEN          (5L)   /* Top-left of, and fill the screen */

/****************************************************************************/

/*
 * Window Methods
 */
#define WM_HANDLEINPUT	(0x570001L)

/* The WM_HANDLEINPUT method should be called by for each received
 * IDCMP message.
 * If the message could be linked to a gadget in the window, the WORD
 * pointed to by wmh_Code will be set to the gadget's return code.
 */

struct wmHandle
{
	ULONG MethodID;						/* WM_HANDLEINPUT */
	WORD *wmh_Code;						/* The code from the gadget */
};

#define WM_OPEN			(0x570002L)
#define WM_CLOSE		(0x570003L)
#define WM_NEWPREFS		(0x570004L)
#define WM_ICONIFY		(0x570005L)
#define WM_RETHINK		(0x570006L)

/****************************************************************************/

struct HintInfo
{
	WORD hi_GadgetID;	/* Gadget ID this hint belongs to, -1 indicates end. */
	WORD hi_Code;		/* Code required for this gadget, or -1 if it doesn't matter. */
	STRPTR hi_Text;		/* The text of the hint.. */
	ULONG hi_Flags;		/* Flags, currently unsupported and must be set to 0L. */
};

#endif /* CLASSES_WINDOW_H */
