/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_DATATYPES_PROTOS_H
#define CLIB_DATATYPES_PROTOS_H

/*
**   $VER: datatypes_protos.h $VER: datatypes_lib.sfd 47.1 (30.11.2021) $VER: datatypes_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <exec/lists.h>
#include <intuition/intuition.h>
#include <intuition/classes.h>
#include <intuition/classusr.h>
#include <intuition/gadgetclass.h>
#include <utility/tagitem.h>
#include <datatypes/datatypes.h>
#include <datatypes/datatypesclass.h>
#include <rexx/storage.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* Public entries */

struct DataType *ObtainDataTypeA(ULONG type, APTR handle, CONST struct TagItem *attrs);
struct DataType *ObtainDataType(ULONG type, APTR handle, Tag _tag1, ...);
VOID ReleaseDataType(struct DataType *dt);
Object *NewDTObjectA(CONST_STRPTR name, CONST struct TagItem *attrs);
Object *NewDTObject(CONST_STRPTR name, Tag _tag1, ...);
VOID DisposeDTObject(Object *o);
ULONG SetDTAttrsA(Object *o, struct Window *win, struct Requester *req, CONST struct TagItem *attrs);
ULONG SetDTAttrs(Object *o, struct Window *win, struct Requester *req, Tag _tag1, ...);
ULONG GetDTAttrsA(Object *o, CONST struct TagItem *attrs);
ULONG GetDTAttrs(Object *o, Tag _tag1, ...);
LONG AddDTObject(struct Window *win, struct Requester *req, Object *o, LONG pos);
VOID RefreshDTObjectA(Object *o, struct Window *win, struct Requester *req, CONST struct TagItem *attrs);
VOID RefreshDTObjects(Object *o, struct Window *win, struct Requester *req, Tag _tag1, ...);
VOID RefreshDTObject(Object *o, struct Window *win, struct Requester *req, Tag _tag1, ...);
ULONG DoAsyncLayout(Object *o, struct gpLayout *gpl);
ULONG DoDTMethodA(Object *o, struct Window *win, struct Requester *req, Msg msg);
ULONG DoDTMethod(Object *o, struct Window *win, struct Requester *req, ULONG data, ...);
LONG RemoveDTObject(struct Window *win, Object *o);
ULONG *GetDTMethods(CONST Object *object);
struct DTMethods *GetDTTriggerMethods(Object *object);
ULONG PrintDTObjectA(Object *o, struct Window *w, struct Requester *r, struct dtPrint *msg);
ULONG PrintDTObject(Object *o, struct Window *w, struct Requester *r, ULONG data, ...);
STRPTR GetDTString(ULONG id);

/*--- functions in V45 or higher ---*/
ULONG *FindMethod(CONST ULONG *methods, ULONG searchmethodid);
struct DTMethod *FindTriggerMethod(CONST struct DTMethod *dtm, CONST_STRPTR command, ULONG method);
ULONG *CopyDTMethods(CONST ULONG *methods, CONST ULONG *include, CONST ULONG *exclude);
struct DTMethod *CopyDTTriggerMethods(CONST struct DTMethod *methods, CONST struct DTMethod *include, CONST struct DTMethod *exclude);
VOID *FreeDTMethods(APTR methods);
ULONG GetDTTriggerMethodDataFlags(ULONG triggermethod);
ULONG SaveDTObjectA(Object *o, struct Window *win, struct Requester *req, CONST_STRPTR file, ULONG mode, LONG saveicon, struct TagItem *attrs);
ULONG SaveDTObject(Object *o, struct Window *win, struct Requester *req, CONST_STRPTR file, ULONG mode, LONG saveicon, Tag _tag1, ...);
ULONG StartDragSelect(Object *o);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_DATATYPES_PROTOS_H */
