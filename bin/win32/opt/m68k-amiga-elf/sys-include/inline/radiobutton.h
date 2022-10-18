/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_RADIOBUTTON_H
#define _INLINE_RADIOBUTTON_H

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

#ifndef RADIOBUTTON_BASE_NAME
#define RADIOBUTTON_BASE_NAME RadioButtonBase
#endif /* !RADIOBUTTON_BASE_NAME */

#define RADIOBUTTON_GetClass() \
      LP0(0x1e, Class *, RADIOBUTTON_GetClass ,\
      , RADIOBUTTON_BASE_NAME)

#define AllocRadioButtonNodeA(___columns, ___tags) \
      LP2(0x24, struct Node *, AllocRadioButtonNodeA , UWORD, ___columns, d0, struct TagItem *, ___tags, a0,\
      , RADIOBUTTON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocRadioButtonNode(___columns, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; AllocRadioButtonNodeA((___columns), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeRadioButtonNode(___node) \
      LP1NR(0x2a, FreeRadioButtonNode , struct Node *, ___node, a0,\
      , RADIOBUTTON_BASE_NAME)

#define SetRadioButtonNodeAttrsA(___node, ___tags) \
      LP2NR(0x30, SetRadioButtonNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , RADIOBUTTON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetRadioButtonNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetRadioButtonNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetRadioButtonNodeAttrsA(___node, ___tags) \
      LP2NR(0x36, GetRadioButtonNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , RADIOBUTTON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetRadioButtonNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetRadioButtonNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_RADIOBUTTON_H */
