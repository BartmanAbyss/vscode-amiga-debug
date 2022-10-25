#ifndef  CLIB_POPCYCLE_PROTOS_H
#define  CLIB_POPCYCLE_PROTOS_H

/*
**	$VER: popcycle_protos.h 1.1 (6.10.1999)
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
Class *POPCYCLE_GetClass( VOID );
struct Node *AllocPopCycleNodeA( struct TagItem *tags );
struct Node *AllocPopCycleNode( Tag firstTag, ... );
VOID FreePopCycleNode( struct Node *node );
VOID SetPopCycleNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID SetPopCycleNodeAttrs( struct Node *node, ... );
VOID GetPopCycleNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID GetPopCycleNodeAttrs( struct Node *node, ... );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_POPCYCLE_PROTOS_H */
