/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_CLICKTAB_PROTOS_H
#define CLIB_CLICKTAB_PROTOS_H

/*
**   $VER: clicktab_protos.h $VER: clicktab_lib.sfd 47.1 (30.11.2021) $VER: clicktab_lib.sfd 47.1 (30.11.2021)
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
#include <gadgets/clicktab.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "clicktab.gadget" */
Class *CLICKTAB_GetClass(void);
struct Node *AllocClickTabNodeA(struct TagItem *tags);
struct Node *AllocClickTabNode(Tag firstTag, ...);
VOID FreeClickTabNode(struct Node *node);
VOID SetClickTabNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID SetClickTabNodeAttrs(struct Node *node, Tag _tag1, ...);
VOID GetClickTabNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID GetClickTabNodeAttrs(struct Node *node, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_CLICKTAB_PROTOS_H */
