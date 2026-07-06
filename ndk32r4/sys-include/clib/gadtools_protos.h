/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_GADTOOLS_PROTOS_H
#define CLIB_GADTOOLS_PROTOS_H

/*
**   $VER: gadtools_protos.h $VER: gadtools_lib.sfd 47.1 (30.11.2021) $VER: gadtools_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <intuition/intuition.h>
#include <utility/tagitem.h>
#include <libraries/gadtools.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "gadtools.library" */
/*

*//*
 Gadget Functions
*/

struct Gadget *CreateGadgetA(ULONG kind, struct Gadget *gad, struct NewGadget *ng, CONST struct TagItem *taglist);
struct Gadget *CreateGadget(ULONG kind, struct Gadget *gad, struct NewGadget *ng, Tag _tag1, ...);
VOID FreeGadgets(struct Gadget *gad);
VOID GT_SetGadgetAttrsA(struct Gadget *gad, struct Window *win, struct Requester *req, CONST struct TagItem *taglist);
VOID GT_SetGadgetAttrs(struct Gadget *gad, struct Window *win, struct Requester *req, Tag _tag1, ...);

/* Menu functions */

struct Menu *CreateMenusA(CONST struct NewMenu *newmenu, struct TagItem *taglist);
struct Menu *CreateMenus(CONST struct NewMenu *newmenu, Tag _tag1, ...);
VOID FreeMenus(struct Menu *menu);
BOOL LayoutMenuItemsA(struct MenuItem *firstitem, APTR vi, CONST struct TagItem *taglist);
BOOL LayoutMenuItems(struct MenuItem *firstitem, APTR vi, Tag _tag1, ...);
BOOL LayoutMenusA(struct Menu *firstmenu, APTR vi, CONST struct TagItem *taglist);
BOOL LayoutMenus(struct Menu *firstmenu, APTR vi, Tag _tag1, ...);

/* Misc Event-Handling Functions */

struct IntuiMessage *GT_GetIMsg(struct MsgPort *iport);
VOID GT_ReplyIMsg(struct IntuiMessage *imsg);
VOID GT_RefreshWindow(struct Window *win, struct Requester *req);
VOID GT_BeginRefresh(struct Window *win);
VOID GT_EndRefresh(struct Window *win, BOOL complete);
struct IntuiMessage *GT_FilterIMsg(CONST struct IntuiMessage *imsg);
struct IntuiMessage *GT_PostFilterIMsg(struct IntuiMessage *imsg);
struct Gadget *CreateContext(struct Gadget **glistptr);

/* Rendering Functions */

VOID DrawBevelBoxA(struct RastPort *rport, WORD left, WORD top, WORD width, WORD height, CONST struct TagItem *taglist);
VOID DrawBevelBox(struct RastPort *rport, WORD left, WORD top, WORD width, WORD height, Tag _tag1, ...);

/* Visuals Functions */

APTR GetVisualInfoA(struct Screen *screen, CONST struct TagItem *taglist);
APTR GetVisualInfo(struct Screen *screen, Tag _tag1, ...);
VOID FreeVisualInfo(APTR vi);

/*--- functions in V47 or higher ---*/

/* New in V47 */

LONG SetDesignFontA(APTR vi, struct TextAttr *tattr, CONST struct TagItem *tags);
LONG SetDesignFont(APTR vi, struct TextAttr *tattr, Tag _tag1, ...);
LONG ScaleGadgetRectA(struct NewGadget *ng, CONST struct TagItem *tags);
LONG ScaleGadgetRect(struct NewGadget *ng, Tag _tag1, ...);

/*--- functions in V39 or higher ---*/
LONG GT_GetGadgetAttrsA(struct Gadget *gad, struct Window *win, struct Requester *req, CONST struct TagItem *taglist);
LONG GT_GetGadgetAttrs(struct Gadget *gad, struct Window *win, struct Requester *req, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_GADTOOLS_PROTOS_H */
