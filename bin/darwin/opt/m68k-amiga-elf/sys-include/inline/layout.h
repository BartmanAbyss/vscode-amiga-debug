/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_LAYOUT_H
#define _INLINE_LAYOUT_H

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

#ifndef LAYOUT_BASE_NAME
#define LAYOUT_BASE_NAME LayoutBase
#endif /* !LAYOUT_BASE_NAME */

#define LAYOUT_GetClass() \
      LP0(0x1e, Class *, LAYOUT_GetClass ,\
      , LAYOUT_BASE_NAME)

#define ActivateLayoutGadget(___gadget, ___window, ___requester, ___object) \
      LP4(0x24, BOOL, ActivateLayoutGadget , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2, ULONG, ___object, d0,\
      , LAYOUT_BASE_NAME)

#define FlushLayoutDomainCache(___gadget) \
      LP1NR(0x2a, FlushLayoutDomainCache , struct Gadget *, ___gadget, a0,\
      , LAYOUT_BASE_NAME)

#define RethinkLayout(___gadget, ___window, ___requester, ___refresh) \
      LP4(0x30, BOOL, RethinkLayout , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2, BOOL, ___refresh, d0,\
      , LAYOUT_BASE_NAME)

#define LayoutLimits(___gadget, ___limits, ___font, ___screen) \
      LP4NR(0x36, LayoutLimits , struct Gadget *, ___gadget, a0, struct LayoutLimits *, ___limits, a1, struct TextFont *, ___font, a2, struct Screen *, ___screen, a3,\
      , LAYOUT_BASE_NAME)

#define PAGE_GetClass() \
      LP0(0x3c, Class *, PAGE_GetClass ,\
      , LAYOUT_BASE_NAME)

#define SetPageGadgetAttrsA(___gadget, ___object, ___window, ___requester, ___tags) \
      LP5A4(0x42, ULONG, SetPageGadgetAttrsA , struct Gadget *, ___gadget, a0, Object *, ___object, a1, struct Window *, ___window, a2, struct Requester *, ___requester, a3, struct TagItem *, ___tags, d7,\
      , LAYOUT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetPageGadgetAttrs(___gadget, ___object, ___window, ___requester, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetPageGadgetAttrsA((___gadget), (___object), (___window), (___requester), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RefreshPageGadget(___gadget, ___object, ___window, ___requester) \
      LP4NR(0x48, RefreshPageGadget , struct Gadget *, ___gadget, a0, Object *, ___object, a1, struct Window *, ___window, a2, struct Requester *, ___requester, a3,\
      , LAYOUT_BASE_NAME)

#endif /* !_INLINE_LAYOUT_H */
