#ifndef  CLIB_WB_PROTOS_H
#define  CLIB_WB_PROTOS_H

/*
**	$VER: wb_protos.h 44.5 (21.6.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/*--- functions in V36 or higher (Release 2.0) ---*/
#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  DOS_DOS_H
#include <dos/dos.h>
#endif
#ifndef  WORKBENCH_WORKBENCH_H
#include <workbench/workbench.h>
#endif
#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

struct AppWindow *AddAppWindowA( ULONG id, ULONG userdata, struct Window *window, struct MsgPort *msgport, struct TagItem *taglist );
struct AppWindow *AddAppWindow( ULONG id, ULONG userdata, struct Window *window, struct MsgPort *msgport, Tag tag1, ... );

BOOL RemoveAppWindow( struct AppWindow *appWindow );

struct AppIcon *AddAppIconA( ULONG id, ULONG userdata, UBYTE *text, struct MsgPort *msgport, BPTR lock, struct DiskObject *diskobj, struct TagItem *taglist );
struct AppIcon *AddAppIcon( ULONG id, ULONG userdata, UBYTE *text, struct MsgPort *msgport, BPTR lock, struct DiskObject *diskobj, Tag tag1, ... );

BOOL RemoveAppIcon( struct AppIcon *appIcon );

struct AppMenuItem *AddAppMenuItemA( ULONG id, ULONG userdata, UBYTE *text, struct MsgPort *msgport, struct TagItem *taglist );
struct AppMenuItem *AddAppMenuItem( ULONG id, ULONG userdata, UBYTE *text, struct MsgPort *msgport, Tag tag1, ... );

BOOL RemoveAppMenuItem( struct AppMenuItem *appMenuItem );

/*--- functions in V39 or higher (Release 3) ---*/


VOID WBInfo( BPTR lock, STRPTR name, struct Screen *screen );

/*--- functions in V44 or higher (Release 3.5) ---*/
BOOL OpenWorkbenchObjectA( STRPTR name, struct TagItem *tags );
BOOL OpenWorkbenchObject( STRPTR name, ... );
BOOL CloseWorkbenchObjectA( STRPTR name, struct TagItem *tags );
BOOL CloseWorkbenchObject( STRPTR name, ... );
BOOL WorkbenchControlA( STRPTR name, struct TagItem *tags );
BOOL WorkbenchControl( STRPTR name, ... );
struct AppWindowDropZone *AddAppWindowDropZoneA( struct AppWindow *aw, ULONG id, ULONG userdata, struct TagItem *tags );
struct AppWindowDropZone *AddAppWindowDropZone( struct AppWindow *aw, ULONG id, ULONG userdata, ... );
BOOL RemoveAppWindowDropZone( struct AppWindow *aw, struct AppWindowDropZone *dropZone );
BOOL ChangeWorkbenchSelectionA( STRPTR name, struct Hook *hook, struct TagItem *tags );
BOOL ChangeWorkbenchSelection( STRPTR name, struct Hook *hook, ... );
BOOL MakeWorkbenchObjectVisibleA( STRPTR name, struct TagItem *tags );
BOOL MakeWorkbenchObjectVisible( STRPTR name, ... );


#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_WB_PROTOS_H */
