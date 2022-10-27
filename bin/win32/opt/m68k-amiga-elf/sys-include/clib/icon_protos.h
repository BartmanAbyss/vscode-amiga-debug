#ifndef  CLIB_ICON_PROTOS_H
#define  CLIB_ICON_PROTOS_H

/*
**	$VER: icon_protos.h 44.17 (15.7.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  WORKBENCH_WORKBENCH_H
#include <workbench/workbench.h>
#endif
#ifndef  DATATYPES_PICTURECLASS_H
#include <datatypes/pictureclass.h>
#endif
VOID FreeFreeList( struct FreeList *freelist );
BOOL AddFreeList( struct FreeList *freelist, CONST APTR mem, ULONG size );
struct DiskObject *GetDiskObject( CONST STRPTR name );
BOOL PutDiskObject( CONST STRPTR name, CONST struct DiskObject *diskobj );
VOID FreeDiskObject( struct DiskObject *diskobj );
UBYTE *FindToolType( CONST STRPTR *toolTypeArray, CONST STRPTR typeName );
BOOL MatchToolValue( CONST STRPTR typeString, CONST STRPTR value );
STRPTR BumpRevision( STRPTR newname, CONST STRPTR oldname );
/*--- functions in V36 or higher (Release 2.0) ---*/
struct DiskObject *GetDefDiskObject( LONG type );
BOOL PutDefDiskObject( CONST struct DiskObject *diskObject );
struct DiskObject *GetDiskObjectNew( CONST STRPTR name );
/*--- functions in V37 or higher (Release 2.04) ---*/
BOOL DeleteDiskObject( CONST STRPTR name );
/*--- functions in V44 or higher (Release 3.5) ---*/
struct DiskObject *DupDiskObjectA( CONST struct DiskObject *diskObject, CONST struct TagItem *tags );
struct DiskObject *DupDiskObject( CONST struct DiskObject *diskObject, ... );
ULONG IconControlA( struct DiskObject *icon, CONST struct TagItem *tags );
ULONG IconControl( struct DiskObject *icon, ... );
VOID DrawIconStateA( struct RastPort *rp, CONST struct DiskObject *icon, CONST STRPTR label, LONG leftOffset, LONG topOffset, ULONG state, CONST struct TagItem *tags );
VOID DrawIconState( struct RastPort *rp, CONST struct DiskObject *icon, CONST STRPTR label, LONG leftOffset, LONG topOffset, ULONG state, ... );
BOOL GetIconRectangleA( struct RastPort *rp, CONST struct DiskObject *icon, CONST STRPTR label, struct Rectangle *rect, CONST struct TagItem *tags );
BOOL GetIconRectangle( struct RastPort *rp, CONST struct DiskObject *icon, CONST STRPTR label, struct Rectangle *rect, ... );
struct DiskObject *NewDiskObject( LONG type );
struct DiskObject *GetIconTagList( CONST STRPTR name, CONST struct TagItem *tags );
struct DiskObject *GetIconTags( CONST STRPTR name, ... );
BOOL PutIconTagList( CONST STRPTR name, CONST struct DiskObject *icon, CONST struct TagItem *tags );
BOOL PutIconTags( CONST STRPTR name, CONST struct DiskObject *icon, ... );
BOOL LayoutIconA( struct DiskObject *icon, struct Screen *screen, struct TagItem *tags );
BOOL LayoutIcon( struct DiskObject *icon, struct Screen *screen, ... );
VOID ChangeToSelectedIconColor( struct ColorRegister *cr );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_ICON_PROTOS_H */
