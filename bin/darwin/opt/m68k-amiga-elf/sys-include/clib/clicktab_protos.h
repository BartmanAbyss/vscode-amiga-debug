#ifndef  CLIB_CLICKTAB_PROTOS_H
#define  CLIB_CLICKTAB_PROTOS_H

/*
**	$VER: clicktab_protos.h 1.1 (6.10.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif
Class *CLICKTAB_GetClass( VOID );
struct Node *AllocClickTabNodeA( struct TagItem *tags );
struct Node *AllocClickTabNode( Tag firstTag, ... );
VOID FreeClickTabNode( struct Node *node );
VOID SetClickTabNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID SetClickTabNodeAttrs( struct Node *node, ... );
VOID GetClickTabNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID GetClickTabNodeAttrs( struct Node *node, ... );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_CLICKTAB_PROTOS_H */
