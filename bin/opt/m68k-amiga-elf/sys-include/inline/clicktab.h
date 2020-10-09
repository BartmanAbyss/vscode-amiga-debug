/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_CLICKTAB_H
#define _INLINE_CLICKTAB_H

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

#ifndef CLICKTAB_BASE_NAME
#define CLICKTAB_BASE_NAME ClickTabBase
#endif /* !CLICKTAB_BASE_NAME */

#define CLICKTAB_GetClass() \
      LP0(0x1e, Class *, CLICKTAB_GetClass ,\
      , CLICKTAB_BASE_NAME)

#define AllocClickTabNodeA(___tags) \
      LP1(0x24, struct Node *, AllocClickTabNodeA , struct TagItem *, ___tags, a0,\
      , CLICKTAB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocClickTabNode(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; AllocClickTabNodeA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeClickTabNode(___node) \
      LP1NR(0x2a, FreeClickTabNode , struct Node *, ___node, a0,\
      , CLICKTAB_BASE_NAME)

#define SetClickTabNodeAttrsA(___node, ___tags) \
      LP2NR(0x30, SetClickTabNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , CLICKTAB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetClickTabNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetClickTabNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetClickTabNodeAttrsA(___node, ___tags) \
      LP2NR(0x36, GetClickTabNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , CLICKTAB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetClickTabNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetClickTabNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_CLICKTAB_H */
