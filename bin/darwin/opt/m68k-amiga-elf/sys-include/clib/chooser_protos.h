#ifndef  CLIB_CHOOSER_PROTOS_H
#define  CLIB_CHOOSER_PROTOS_H

/*
**	$VER: chooser_protos.h 1.1 (6.10.1999)
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
Class *CHOOSER_GetClass( VOID );
struct Node *AllocChooserNodeA( struct TagItem *tags );
struct Node *AllocChooserNode( Tag firstTag, ... );
VOID FreeChooserNode( struct Node *node );
VOID SetChooserNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID SetChooserNodeAttrs( struct Node *node, ... );
VOID GetChooserNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID GetChooserNodeAttrs( struct Node *node, ... );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_CHOOSER_PROTOS_H */
