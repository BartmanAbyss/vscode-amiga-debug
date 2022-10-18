#ifndef  CLIB_RADIOBUTTON_PROTOS_H
#define  CLIB_RADIOBUTTON_PROTOS_H

/*
**	$VER: radiobutton_protos.h 1.1 (6.10.1999)
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
Class *RADIOBUTTON_GetClass( VOID );
struct Node *AllocRadioButtonNodeA( ULONG columns, struct TagItem *tags );
struct Node *AllocRadioButtonNode( ULONG columns, Tag firstTag, ... );
VOID FreeRadioButtonNode( struct Node *node );
VOID SetRadioButtonNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID SetRadioButtonNodeAttrs( struct Node *node, ... );
VOID GetRadioButtonNodeAttrsA( struct Node *node, struct TagItem *tags );
VOID GetRadioButtonNodeAttrs( struct Node *node, ... );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_RADIOBUTTON_PROTOS_H */
