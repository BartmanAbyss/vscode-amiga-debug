/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_VIRTUAL_H
#define _INLINE_VIRTUAL_H

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

#ifndef VIRTUAL_BASE_NAME
#define VIRTUAL_BASE_NAME VirtualBase
#endif /* !VIRTUAL_BASE_NAME */

#define VIRTUAL_GetClass() \
      LP0(0x1e, Class *, VIRTUAL_GetClass ,\
      , VIRTUAL_BASE_NAME)

#define RefreshVirtualGadget(___gadget, ___obj, ___window, ___requester) \
      LP4NR(0x24, RefreshVirtualGadget , struct Gadget *, ___gadget, a0, Object *, ___obj, a1, struct Window *, ___window, a2, struct Requester *, ___requester, a3,\
      , VIRTUAL_BASE_NAME)

#define RethinkVirtualSize(___virt_obj, ___rootlayout, ___font, ___screen, ___layoutlimits) \
      LP5(0x2a, BOOL, RethinkVirtualSize , Object *, ___virt_obj, a0, Object *, ___rootlayout, a1, struct TextFont *, ___font, a2, struct Screen *, ___screen, a3, struct LayoutLimits *, ___layoutlimits, d0,\
      , VIRTUAL_BASE_NAME)

#endif /* !_INLINE_VIRTUAL_H */
