/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_CHOOSER_PROTOS_H
#define CLIB_CHOOSER_PROTOS_H

/*
**   $VER: chooser_protos.h $VER: chooser_lib.sfd 47.1 (30.11.2021) $VER: chooser_lib.sfd 47.1 (30.11.2021)
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
#include <gadgets/chooser.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "chooser.gadget" */
Class *CHOOSER_GetClass(void);
struct Node *AllocChooserNodeA(struct TagItem *tags);
struct Node *AllocChooserNode(Tag firstTag, ...);
VOID FreeChooserNode(struct Node *node);
VOID SetChooserNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID SetChooserNodeAttrs(struct Node *node, Tag _tag1, ...);
VOID GetChooserNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID GetChooserNodeAttrs(struct Node *node, Tag _tag1, ...);
ULONG ShowChooser(Object *o, struct Window *w, ULONG xpos, ULONG ypos);
VOID HideChooser(Object *o, struct Window *w);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_CHOOSER_PROTOS_H */
