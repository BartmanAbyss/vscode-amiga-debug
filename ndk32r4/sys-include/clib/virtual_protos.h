/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_VIRTUAL_PROTOS_H
#define CLIB_VIRTUAL_PROTOS_H

/*
**   $VER: virtual_protos.h $VER: virtual_lib.sfd 47.1 (30.11.2021) $VER: virtual_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <intuition/intuition.h>
#include <intuition/classes.h>
#include <gadgets/layout.h>
#include <gadgets/virtual.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "virtual.gadget" */
Class *VIRTUAL_GetClass(void);
VOID RefreshVirtualGadget(struct Gadget *gadget, Object *obj, struct Window *window, struct Requester *requester);
BOOL RethinkVirtualSize(Object *virt_obj, Object *rootlayout, struct TextFont *font, struct Screen *screen, struct LayoutLimits *layoutlimits);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_VIRTUAL_PROTOS_H */
