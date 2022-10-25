#ifndef  CLIB_SPEEDBAR_PROTOS_H
#define  CLIB_SPEEDBAR_PROTOS_H

/*
**	$VER: speedbar_protos.h 1.1 (6.10.1999)
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
Class *SPEEDBAR_GetClass( VOID );
struct Node *AllocSpeedButtonNodeA( ULONG number, struct TagItem *tags );
struct Node *AllocSpeedButtonNode( ULONG number, Tag firstTag, ... );
VOID FreeSpeedButtonNode( struct Node *node );
VOID SetSpeedButtonNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID SetSpeedButtonNodeAttrs( struct Node *node, ... );
VOID GetSpeedButtonNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID GetSpeedButtonNodeAttrs( struct Node *node, ... );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_SPEEDBAR_PROTOS_H */
