/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_WB_PROTOS_H
#define CLIB_WB_PROTOS_H

/*
**   $VER: wb_protos.h $VER: wb_lib.sfd 47.1 (30.11.2021) $VER: wb_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <dos/dos.h>
#include <workbench/workbench.h>
#include <intuition/intuition.h>
#include <utility/tagitem.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "workbench.library" */
/*

*/
VOID UpdateWorkbench(CONST_STRPTR name, BPTR lock, LONG action);
struct AppWindow *AddAppWindowA(ULONG id, ULONG userdata, struct Window *window, struct MsgPort *msgport, CONST struct TagItem *taglist);
struct AppWindow *AddAppWindow(ULONG id, ULONG userdata, struct Window *window, struct MsgPort *msgport, Tag _tag1, ...);
BOOL RemoveAppWindow(struct AppWindow *appWindow);
struct AppIcon *AddAppIconA(ULONG id, ULONG userdata, CONST_STRPTR text, struct MsgPort *msgport, BPTR lock, struct DiskObject *diskobj, CONST struct TagItem *taglist);
struct AppIcon *AddAppIcon(ULONG id, ULONG userdata, CONST_STRPTR text, struct MsgPort *msgport, BPTR lock, struct DiskObject *diskobj, Tag _tag1, ...);
BOOL RemoveAppIcon(struct AppIcon *appIcon);
struct AppMenuItem *AddAppMenuItemA(ULONG id, ULONG userdata, CONST_STRPTR text, struct MsgPort *msgport, CONST struct TagItem *taglist);
struct AppMenuItem *AddAppMenuItem(ULONG id, ULONG userdata, CONST_STRPTR text, struct MsgPort *msgport, Tag _tag1, ...);
BOOL RemoveAppMenuItem(struct AppMenuItem *appMenuItem);

/*--- functions in V39 or higher ---*/
ULONG WBInfo(BPTR lock, CONST_STRPTR name, struct Screen *screen);

/*--- functions in V44 or higher ---*/
BOOL OpenWorkbenchObjectA(CONST_STRPTR name, CONST struct TagItem *tags);
BOOL OpenWorkbenchObject(CONST_STRPTR name, Tag _tag1, ...);
BOOL CloseWorkbenchObjectA(CONST_STRPTR name, CONST struct TagItem *tags);
BOOL CloseWorkbenchObject(CONST_STRPTR name, Tag _tag1, ...);
BOOL WorkbenchControlA(CONST_STRPTR name, CONST struct TagItem *tags);
BOOL WorkbenchControl(CONST_STRPTR name, Tag _tag1, ...);
struct AppWindowDropZone * AddAppWindowDropZoneA(struct AppWindow *aw, ULONG id, ULONG userdata, CONST struct TagItem *tags);
struct AppWindowDropZone * AddAppWindowDropZone(struct AppWindow *aw, ULONG id, ULONG userdata, Tag _tag1, ...);
BOOL RemoveAppWindowDropZone(struct AppWindow *aw, struct AppWindowDropZone *dropZone);
BOOL ChangeWorkbenchSelectionA(CONST_STRPTR name, struct Hook * hook, CONST struct TagItem * tags);
BOOL ChangeWorkbenchSelection(CONST_STRPTR name, struct Hook * hook, Tag _tag1, ...);
BOOL MakeWorkbenchObjectVisibleA(CONST_STRPTR name, CONST struct TagItem * tags);
BOOL MakeWorkbenchObjectVisible(CONST_STRPTR name, Tag _tag1, ...);

/*--- functions in V47 or higher ---*/
ULONG WhichWorkbenchObjectA(struct Window *window, LONG x, LONG y, CONST struct TagItem *tags);
ULONG WhichWorkbenchObject(struct Window *window, LONG x, LONG y, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_WB_PROTOS_H */
