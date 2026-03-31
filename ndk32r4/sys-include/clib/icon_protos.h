/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_ICON_PROTOS_H
#define CLIB_ICON_PROTOS_H

/*
**   $VER: icon_protos.h $VER: icon_lib.sfd 47.1 (30.11.2021) $VER: icon_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <workbench/workbench.h>
#include <datatypes/pictureclass.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

VOID FreeFreeList(struct FreeList *freelist);
BOOL AddFreeList(struct FreeList *freelist, CONST_APTR mem, ULONG size);
struct DiskObject *GetDiskObject(CONST_STRPTR name);
BOOL PutDiskObject(CONST_STRPTR name, CONST struct DiskObject *diskobj);
VOID FreeDiskObject(struct DiskObject *diskobj);
UBYTE *FindToolType(CONST_STRPTR *toolTypeArray, CONST_STRPTR typeName);
BOOL MatchToolValue(CONST_STRPTR typeString, CONST_STRPTR value);
STRPTR BumpRevision(STRPTR newname, CONST_STRPTR oldname);
APTR FreeAlloc(struct FreeList *free, ULONG len, ULONG type);

/*--- functions in V36 or higher ---*/
struct DiskObject *GetDefDiskObject(LONG type);
BOOL PutDefDiskObject(CONST struct DiskObject *diskObject);
struct DiskObject *GetDiskObjectNew(CONST_STRPTR name);

/*--- functions in V37 or higher ---*/
BOOL DeleteDiskObject(CONST_STRPTR name);

/*--- functions in V44 or higher ---*/
VOID FreeFree(struct FreeList *fl, APTR address);
struct DiskObject * DupDiskObjectA(CONST struct DiskObject *diskObject, CONST struct TagItem *tags);
struct DiskObject * DupDiskObject(CONST struct DiskObject *diskObject, Tag _tag1, ...);
ULONG IconControlA(struct DiskObject *icon, CONST struct TagItem *tags);
ULONG IconControl(struct DiskObject *icon, Tag _tag1, ...);
VOID DrawIconStateA(struct RastPort *rp, CONST struct DiskObject *icon, CONST_STRPTR label, LONG leftOffset, LONG topOffset, ULONG state, CONST struct TagItem *tags);
VOID DrawIconState(struct RastPort *rp, CONST struct DiskObject *icon, CONST_STRPTR label, LONG leftOffset, LONG topOffset, ULONG state, Tag _tag1, ...);
BOOL GetIconRectangleA(struct RastPort *rp, CONST struct DiskObject *icon, CONST_STRPTR label, struct Rectangle *rect, CONST struct TagItem *tags);
BOOL GetIconRectangle(struct RastPort *rp, CONST struct DiskObject *icon, CONST_STRPTR label, struct Rectangle *rect, Tag _tag1, ...);
struct DiskObject *NewDiskObject(LONG type);
struct DiskObject *GetIconTagList(CONST_STRPTR name, CONST struct TagItem *tags);
struct DiskObject *GetIconTags(CONST_STRPTR name, Tag _tag1, ...);
BOOL PutIconTagList(CONST_STRPTR name, CONST struct DiskObject *icon, CONST struct TagItem *tags);
BOOL PutIconTags(CONST_STRPTR name, CONST struct DiskObject *icon, Tag _tag1, ...);
BOOL LayoutIconA(struct DiskObject *icon, struct Screen *screen, struct TagItem *tags);
BOOL LayoutIcon(struct DiskObject *icon, struct Screen *screen, Tag _tag1, ...);
VOID ChangeToSelectedIconColor(struct ColorRegister *cr);
STRPTR BumpRevisionLength(STRPTR newname, CONST_STRPTR oldname, ULONG maxLength);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_ICON_PROTOS_H */
