#ifndef  CLIB_RESOURCE_PROTOS_H
#define  CLIB_RESOURCE_PROTOS_H

/*
**	$VER: resource_protos.h 44.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  LIBRARIES_RESOURCE_H
#include <libraries/resource.h>
#endif
#ifndef  INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif
#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  LIBRARIES_LOCALE_H
#include <libraries/locale.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
RESOURCEFILE RL_OpenResource( APTR resource, struct Screen *screen, struct Catalog *catalog );
VOID RL_CloseResource( RESOURCEFILE resfile );
Object *RL_NewObjectA( RESOURCEFILE resfile, RESOURCEID resid, struct TagItem *tags );
Object *RL_NewObject( RESOURCEFILE resfile, RESOURCEID resid, ... );
VOID RL_DisposeObject( RESOURCEFILE resfile, Object *obj );
Object **RL_NewGroupA( RESOURCEFILE resfile, RESOURCEID id, struct TagItem *taglist );
Object **RL_NewGroup( RESOURCEFILE resfile, RESOURCEID id, ... );
VOID RL_DisposeGroup( RESOURCEFILE resfile, Object **obj );
Object **RL_GetObjectArray( RESOURCEFILE resfile, Object *obj, RESOURCEID id );
BOOL RL_SetResourceScreen( RESOURCEFILE resfile, struct Screen *screen );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_RESOURCE_PROTOS_H */
