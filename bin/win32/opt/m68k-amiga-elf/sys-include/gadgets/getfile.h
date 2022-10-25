#ifndef GADGETS_GETFILE_H
#define GADGETS_GETFILE_H
/*
**	$VER: getfile.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the getfile.gadget BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_GADGETCLASS_H
#include <intuition/gadgetclass.h>
#endif

/*****************************************************************************/

/* Attributes defined by the getfile.gadget class
 */
#define GETFILE_Dummy			(REACTION_Dummy + 0x60000)

#define GETFILE_TitleText		(GETFILE_Dummy+1)
	/* (STRPTR) Requester title text (default: None) (OM_NEW, OM_SET) */

#define GETFILE_LeftEdge		(GETFILE_Dummy+2)
#define GETFILE_TopEdge			(GETFILE_Dummy+3)
	/* (WORD) Requester coordinates  (default leftedge: 30, topedge: 20) (OM_NEW, OM_SET, OM_GET) */

#define GETFILE_Width			(GETFILE_Dummy+4)
#define GETFILE_Height			(GETFILE_Dummy+5)
	/* (WORD) Requester dimensions (default height: 200, width: 300) (OM_NEW, OM_SET, OM_GET) */

#define GETFILE_File			(GETFILE_Dummy+6)
	/* (STRPTR) Contents of File gadget (default: None) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define GETFILE_Drawer			(GETFILE_Dummy+7)
	/* (STRPTR) Contents of Drawer gadget (default: None) (OM_NEW, OM_SET, OM_GET, OM_NOTIFY) */

#define GETFILE_FullFile		(GETFILE_Dummy+8)
	/* (STRPTR) Complete file name. Replaces GETFILE_Drawer and GETFILE_File (default: None)
			(OM_NEW, OM_SET, OM_GET, OM_NOTIFY)
	*/

#define GETFILE_FullFileExpand	(GETFILE_Dummy+9)
	/* (BOOL) GETFILE_FullFile will give complete file name(s) expanded with NameFromLock() to
			remove relative paths. (default: TRUE) (OM_NEW, OM_SET)
	*/

#define GETFILE_Pattern			(GETFILE_Dummy+10)
	/* (STRPTR) Contents of Pattern gadget (default: "#?") (OM_NEW, OM_SET, OM_GET) */

#define GETFILE_DoSaveMode		(GETFILE_Dummy+11)
	/* (BOOL) Being used for saving? (default: FALSE) (OM_NEW, OM_SET) */

#define GETFILE_DoMultiSelect	(GETFILE_Dummy+12)
	/* (BOOL) Do multi-select? (default: FALSE) (OM_NEW, OM_SET) */

#define GETFILE_DoPatterns		(GETFILE_Dummy+13)
	/* (BOOL) Display a Pattern gadget? (default: FALSE) (OM_NEW, OM_SET) */

#define GETFILE_DrawersOnly		(GETFILE_Dummy+14)
	/* (BOOL) Don't display files? (default: FALSE) (OM_NEW, OM_SET) */

#define GETFILE_FilterFunc		(GETFILE_Dummy+15)
	/* (struct Hook *) Function to filter files (default: None) (OM_NEW, OM_SET)  */

#define GETFILE_RejectIcons		(GETFILE_Dummy+16)
	/* (BOOL) Display .info files? (default: FALSE) (OM_NEW, OM_SET)  */

#define GETFILE_RejectPattern	(GETFILE_Dummy+17)
	/* (UBYTE *) Don't display files matching pattern (default: None) (OM_NEW, OM_SET) */

#define GETFILE_AcceptPattern	(GETFILE_Dummy+18)
	/* (UBYTE *) Accept only files matching pattern (default: None) (OM_NEW, OM_SET) */

#define GETFILE_FilterDrawers	(GETFILE_Dummy+19)
	/* (BOOL) Also filter drawers with pattern (default: FALSE) (OM_NEW, OM_SET) */

#define GETFILE_Filelist		(GETFILE_Dummy+20)
	/* (struct List *) If the GETFILE_DoMultiSelect tags was used, you can get a pointer
			to the list of selected files/drawers using this tag. The ln_Name part of
			each node will contain the filename/drawername for each selected file with
			a fully qualified path, even if you didn't use the GETFILE_FullFileExpand.
			In single-selected mode, the list will contain the single selected file for
			notification purposes. Don't forget to free the list using the GFILE_FREELIST
			method! (OM_GET, OM_NOTIFY) */

#define GETFILE_LBNodeStructs	(GETFILE_Dummy+21)
	/* (BOOL) GETFILE_Filelist will give a list with ListBrowserNodes instead of normal
			struct Node node structures (default: FALSE) (OM_NEW) */

#define GETFILE_ReadOnly		(GETFILE_Dummy+22)
	/* (BOOL) If TRUE, a read-only recessed button gadget is used to present the
			file/drawer information. If FALSE, an editable string gadget is used.
			(default: TRUE) (OM_NEW) */

#define GETFILE_FilePartOnly	(GETFILE_Dummy+23)
	/* (BOOL) display file part only - valid ONLY in readonly mode!
	 */

/*****************************************************************************/

/*
 * getfile.gadget methods
 */
#define GFILE_REQUEST	(0x620001L)
#define GFILE_FREELIST	(0x620002L)

/* The GFILE_REQUEST method should be called whenever you want to open
 * a file/dir requester.
 */

struct gfileRequest
{
	ULONG MethodID;					/* GFILE_REQUEST */
	struct Window *gfile_Window;	/* The window that will be locked when the requester is active. MUST be provided! */
};

/* The GFILE_FREELIST method SHOULD be called when you are done doing a multiselect
 * a file/dir select using the tag GETFILE_DoMultiSelect and have processed the result.
 * This method will free the list of struct Node structures.  If you do not free this
 * list using this method, the list will not be freed until you dispose the class.
 */

struct gfileFreelist
{
	ULONG MethodID;					/* GFILE_FREELIST */
	struct List *gfile_Filelist;	/* The list of struct Node obtained using the GETFILE_Filelist tag in OM_GET.
										Can be NULL, in which case this method will do nothing. */
};

/* macros for calling the methods easily */

#define gfRequestFile(obj, win)		DoMethod(obj, GFILE_REQUEST, win)
#define gfRequestDir(obj, win)		DoMethod(obj, GFILE_REQUEST, win)
#define gfFreeFilelist(obj, list)	DoMethod(obj, GFILE_FREELIST, list)

#endif /* GADGETS_GETFILE_H */
