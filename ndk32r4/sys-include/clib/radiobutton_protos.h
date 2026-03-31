/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_RADIOBUTTON_PROTOS_H
#define CLIB_RADIOBUTTON_PROTOS_H

/*
**   $VER: radiobutton_protos.h $VER: radiobutton_lib.sfd 47.1 (30.11.2021) $VER: radiobutton_lib.sfd 47.1 (30.11.2021)
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
#include <gadgets/radiobutton.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "radiobutton.gadget" */
Class *RADIOBUTTON_GetClass(void);
struct Node *AllocRadioButtonNodeA(ULONG columns, struct TagItem *tags);
struct Node *AllocRadioButtonNode(ULONG columns, Tag _tag1, ...);
VOID FreeRadioButtonNode(struct Node *node);
VOID SetRadioButtonNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID SetRadioButtonNodeAttrs(struct Node *node, Tag _tag1, ...);
VOID GetRadioButtonNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID GetRadioButtonNodeAttrs(struct Node *node, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_RADIOBUTTON_PROTOS_H */
