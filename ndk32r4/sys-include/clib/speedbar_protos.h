/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_SPEEDBAR_PROTOS_H
#define CLIB_SPEEDBAR_PROTOS_H

/*
**   $VER: speedbar_protos.h $VER: speedbar_lib.sfd 47.1 (30.11.2021) $VER: speedbar_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <intuition/intuition.h>
#include <intuition/classes.h>
#include <utility/tagitem.h>
#include <gadgets/speedbar.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "speedbar.gadget" */
Class *SPEEDBAR_GetClass(void);
struct Node *AllocSpeedButtonNodeA(ULONG number, struct TagItem *tags);
struct Node *AllocSpeedButtonNode(ULONG number, Tag _tag1, ...);
VOID FreeSpeedButtonNode(struct Node *node);
VOID SetSpeedButtonNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID SetSpeedButtonNodeAttrs(struct Node *node, Tag _tag1, ...);
VOID GetSpeedButtonNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID GetSpeedButtonNodeAttrs(struct Node *node, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_SPEEDBAR_PROTOS_H */
