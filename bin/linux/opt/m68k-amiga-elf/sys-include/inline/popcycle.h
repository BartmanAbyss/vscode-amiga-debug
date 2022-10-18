/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_POPCYCLE_H
#define _INLINE_POPCYCLE_H

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

#ifndef POPCYCLE_BASE_NAME
#define POPCYCLE_BASE_NAME PopCycleBase
#endif /* !POPCYCLE_BASE_NAME */

#define POPCYCLE_GetClass() \
      LP0(0x1e, Class *, POPCYCLE_GetClass ,\
      , POPCYCLE_BASE_NAME)

#define AllocPopCycleNodeA(___tags) \
      LP1(0x24, struct Node *, AllocPopCycleNodeA , struct TagItem *, ___tags, a0,\
      , POPCYCLE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocPopCycleNode(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; AllocPopCycleNodeA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreePopCycleNode(___node) \
      LP1NR(0x2a, FreePopCycleNode , struct Node *, ___node, a0,\
      , POPCYCLE_BASE_NAME)

#define SetPopCycleNodeAttrsA(___node, ___tags) \
      LP2NR(0x30, SetPopCycleNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , POPCYCLE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetPopCycleNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetPopCycleNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetPopCycleNodeAttrsA(___node, ___tags) \
      LP2NR(0x36, GetPopCycleNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , POPCYCLE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetPopCycleNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetPopCycleNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_POPCYCLE_H */
