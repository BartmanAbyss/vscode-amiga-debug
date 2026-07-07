/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_LAYOUT_PROTOS_H
#define CLIB_LAYOUT_PROTOS_H

/*
**   $VER: layout_protos.h $VER: layout_lib.sfd 47.1 (30.11.2021) $VER: layout_lib.sfd 47.1 (30.11.2021)
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
#include <gadgets/layout.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "layout.gadget" */
Class *LAYOUT_GetClass(void);
BOOL ActivateLayoutGadget(struct Gadget *gadget, struct Window *window, struct Requester *requester, ULONG object);
VOID FlushLayoutDomainCache(struct Gadget *gadget);
BOOL RethinkLayout(struct Gadget *gadget, struct Window *window, struct Requester *requester, LONG refresh);
VOID LayoutLimits(struct Gadget *gadget, struct LayoutLimits *limits, struct TextFont *font, struct Screen *screen);
Class *PAGE_GetClass(void);
ULONG SetPageGadgetAttrsA(struct Gadget *gadget, Object *object, struct Window *window, struct Requester *requester, struct TagItem *tags);
ULONG SetPageGadgetAttrs(struct Gadget *gadget, Object *object, struct Window *window, struct Requester *requester, Tag _tag1, ...);
VOID RefreshPageGadget(struct Gadget *gadget, Object *object, struct Window *window, struct Requester *requester);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_LAYOUT_PROTOS_H */
