/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_SPEEDBAR_H
#define _INLINE_SPEEDBAR_H

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

#ifndef SPEEDBAR_BASE_NAME
#define SPEEDBAR_BASE_NAME SpeedBarBase
#endif /* !SPEEDBAR_BASE_NAME */

#define SPEEDBAR_GetClass() \
      LP0(0x1e, Class *, SPEEDBAR_GetClass ,\
      , SPEEDBAR_BASE_NAME)

#define AllocSpeedButtonNodeA(___number, ___tags) \
      LP2(0x24, struct Node *, AllocSpeedButtonNodeA , UWORD, ___number, d0, struct TagItem *, ___tags, a0,\
      , SPEEDBAR_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocSpeedButtonNode(___number, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; AllocSpeedButtonNodeA((___number), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeSpeedButtonNode(___node) \
      LP1NR(0x2a, FreeSpeedButtonNode , struct Node *, ___node, a0,\
      , SPEEDBAR_BASE_NAME)

#define SetSpeedButtonNodeAttrsA(___node, ___tags) \
      LP2NR(0x30, SetSpeedButtonNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , SPEEDBAR_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetSpeedButtonNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetSpeedButtonNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetSpeedButtonNodeAttrsA(___node, ___tags) \
      LP2NR(0x36, GetSpeedButtonNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , SPEEDBAR_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetSpeedButtonNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetSpeedButtonNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_SPEEDBAR_H */
