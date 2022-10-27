/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_GADTOOLS_H
#define _INLINE_GADTOOLS_H

#ifndef _SFDC_VARARG_DEFINED
#define _SFDC_VARARG_DEFINED
#ifdef __HAVE_IPTR_ATTR__
typedef APTR _sfdc_vararg __attribute__((iptr));
#else
typedef ULONG _sfdc_vararg;
#endif /* __HAVE_IPTR_ATTR__ */
#endif /* _SFDC_VARARG_DEFINED */

#ifndef __INLINE_MACROS_H
#include <inline/macros.h>
#endif /* !__INLINE_MACROS_H */

#ifndef GADTOOLS_BASE_NAME
#define GADTOOLS_BASE_NAME GadToolsBase
#endif /* !GADTOOLS_BASE_NAME */

#define CreateGadgetA(___kind, ___gad, ___ng, ___taglist) \
      LP4(0x1e, struct Gadget *, CreateGadgetA , ULONG, ___kind, d0, struct Gadget *, ___gad, a0, const struct NewGadget *, ___ng, a1, const struct TagItem *, ___taglist, a2,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateGadget(___kind, ___gad, ___ng, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; CreateGadgetA((___kind), (___gad), (___ng), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeGadgets(___gad) \
      LP1NR(0x24, FreeGadgets , struct Gadget *, ___gad, a0,\
      , GADTOOLS_BASE_NAME)

#define GT_SetGadgetAttrsA(___gad, ___win, ___req, ___taglist) \
      LP4NR(0x2a, GT_SetGadgetAttrsA , struct Gadget *, ___gad, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, const struct TagItem *, ___taglist, a3,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GT_SetGadgetAttrs(___gad, ___win, ___req, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; GT_SetGadgetAttrsA((___gad), (___win), (___req), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define CreateMenusA(___newmenu, ___taglist) \
      LP2(0x30, struct Menu *, CreateMenusA , const struct NewMenu *, ___newmenu, a0, const struct TagItem *, ___taglist, a1,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateMenus(___newmenu, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; CreateMenusA((___newmenu), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeMenus(___menu) \
      LP1NR(0x36, FreeMenus , struct Menu *, ___menu, a0,\
      , GADTOOLS_BASE_NAME)

#define LayoutMenuItemsA(___firstitem, ___vi, ___taglist) \
      LP3(0x3c, BOOL, LayoutMenuItemsA , struct MenuItem *, ___firstitem, a0, APTR, ___vi, a1, const struct TagItem *, ___taglist, a2,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define LayoutMenuItems(___firstitem, ___vi, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; LayoutMenuItemsA((___firstitem), (___vi), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define LayoutMenusA(___firstmenu, ___vi, ___taglist) \
      LP3(0x42, BOOL, LayoutMenusA , struct Menu *, ___firstmenu, a0, APTR, ___vi, a1, const struct TagItem *, ___taglist, a2,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define LayoutMenus(___firstmenu, ___vi, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; LayoutMenusA((___firstmenu), (___vi), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GT_GetIMsg(___iport) \
      LP1(0x48, struct IntuiMessage *, GT_GetIMsg , struct MsgPort *, ___iport, a0,\
      , GADTOOLS_BASE_NAME)

#define GT_ReplyIMsg(___imsg) \
      LP1NR(0x4e, GT_ReplyIMsg , struct IntuiMessage *, ___imsg, a1,\
      , GADTOOLS_BASE_NAME)

#define GT_RefreshWindow(___win, ___req) \
      LP2NR(0x54, GT_RefreshWindow , struct Window *, ___win, a0, struct Requester *, ___req, a1,\
      , GADTOOLS_BASE_NAME)

#define GT_BeginRefresh(___win) \
      LP1NR(0x5a, GT_BeginRefresh , struct Window *, ___win, a0,\
      , GADTOOLS_BASE_NAME)

#define GT_EndRefresh(___win, ___complete) \
      LP2NR(0x60, GT_EndRefresh , struct Window *, ___win, a0, BOOL, ___complete, d0,\
      , GADTOOLS_BASE_NAME)

#define GT_FilterIMsg(___imsg) \
      LP1(0x66, struct IntuiMessage *, GT_FilterIMsg , const struct IntuiMessage *, ___imsg, a1,\
      , GADTOOLS_BASE_NAME)

#define GT_PostFilterIMsg(___imsg) \
      LP1(0x6c, struct IntuiMessage *, GT_PostFilterIMsg , struct IntuiMessage *, ___imsg, a1,\
      , GADTOOLS_BASE_NAME)

#define CreateContext(___glistptr) \
      LP1(0x72, struct Gadget *, CreateContext , struct Gadget **, ___glistptr, a0,\
      , GADTOOLS_BASE_NAME)

#define DrawBevelBoxA(___rport, ___left, ___top, ___width, ___height, ___taglist) \
      LP6NR(0x78, DrawBevelBoxA , struct RastPort *, ___rport, a0, WORD, ___left, d0, WORD, ___top, d1, WORD, ___width, d2, WORD, ___height, d3, const struct TagItem *, ___taglist, a1,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define DrawBevelBox(___rport, ___left, ___top, ___width, ___height, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; DrawBevelBoxA((___rport), (___left), (___top), (___width), (___height), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetVisualInfoA(___screen, ___taglist) \
      LP2(0x7e, APTR, GetVisualInfoA , struct Screen *, ___screen, a0, const struct TagItem *, ___taglist, a1,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetVisualInfo(___screen, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; GetVisualInfoA((___screen), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeVisualInfo(___vi) \
      LP1NR(0x84, FreeVisualInfo , APTR, ___vi, a0,\
      , GADTOOLS_BASE_NAME)

#define GT_GetGadgetAttrsA(___gad, ___win, ___req, ___taglist) \
      LP4(0xae, LONG, GT_GetGadgetAttrsA , struct Gadget *, ___gad, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, const struct TagItem *, ___taglist, a3,\
      , GADTOOLS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GT_GetGadgetAttrs(___gad, ___win, ___req, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; GT_GetGadgetAttrsA((___gad), (___win), (___req), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_GADTOOLS_H */
