#ifndef  CLIB_DATATYPES_PROTOS_H
#define  CLIB_DATATYPES_PROTOS_H

/*
**	$VER: datatypes_protos.h 44.2 (21.4.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  EXEC_LISTS_H
#include <exec/lists.h>
#endif
#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif
#ifndef  INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif
#ifndef  INTUITION_GADGETCLASS_H
#include <intuition/gadgetclass.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef  DATATYPES_DATATYPESCLASS_H
#include <datatypes/datatypesclass.h>
#endif
#ifndef  DATATYPES_DATATYPES_H
#include <datatypes/datatypes.h>
#endif
#ifndef  REXX_STORAGE_H
#include <rexx/storage.h>
#endif
/*--- functions in V40 or higher (Release 3.1) ---*/

/* Public entries */

struct DataType *ObtainDataTypeA( ULONG type, APTR handle, struct TagItem *attrs );
struct DataType *ObtainDataType( ULONG type, APTR handle, Tag tag1, ... );
VOID ReleaseDataType( struct DataType *dt );
Object *NewDTObjectA( APTR name, struct TagItem *attrs );
Object *NewDTObject( APTR name, Tag tag1, ... );
VOID DisposeDTObject( Object *o );
ULONG SetDTAttrsA( Object *o, struct Window *win, struct Requester *req, struct TagItem *attrs );
ULONG SetDTAttrs( Object *o, struct Window *win, struct Requester *req, Tag tag1, ... );
ULONG GetDTAttrsA( Object *o, struct TagItem *attrs );
ULONG GetDTAttrs( Object *o, Tag tag1, ... );
LONG AddDTObject( struct Window *win, struct Requester *req, Object *o, LONG pos );
VOID RefreshDTObjectA( Object *o, struct Window *win, struct Requester *req, struct TagItem *attrs );
VOID RefreshDTObjects( Object *o, struct Window *win, struct Requester *req, Tag tag1, ... );
VOID RefreshDTObject( Object *o, struct Window *win, struct Requester *req, Tag tag1, ... );
ULONG DoAsyncLayout( Object *o, struct gpLayout *gpl );
ULONG DoDTMethodA( Object *o, struct Window *win, struct Requester *req, Msg msg );
ULONG DoDTMethod( Object *o, struct Window *win, struct Requester *req, ULONG data, ... );
LONG RemoveDTObject( struct Window *win, Object *o );
ULONG *GetDTMethods( Object *object );
struct DTMethods *GetDTTriggerMethods( Object *object );
ULONG PrintDTObjectA( Object *o, struct Window *w, struct Requester *r, struct dtPrint *msg );
ULONG PrintDTObject( Object *o, struct Window *w, struct Requester *r, ULONG data, ... );
APTR ObtainDTDrawInfoA( Object *o, struct TagItem *attrs );
APTR ObtainDTDrawInfo( Object *o, Tag tag1, ... );
LONG DrawDTObjectA( struct RastPort *rp, Object *o, LONG x, LONG y, LONG w, LONG h, LONG th, LONG tv, struct TagItem *attrs );
LONG DrawDTObject( struct RastPort *rp, Object *o, LONG x, LONG y, LONG w, LONG h, LONG th, LONG tv, Tag tag1, ... );
VOID ReleaseDTDrawInfo( Object *o, APTR handle );
STRPTR GetDTString( ULONG id );
/* Just in case, make sure we reserve space for datatypes.library V45 */

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_DATATYPES_PROTOS_H */
