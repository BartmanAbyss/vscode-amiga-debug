/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_KEYMAP_H
#define _INLINE_KEYMAP_H

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

#ifndef KEYMAP_BASE_NAME
#define KEYMAP_BASE_NAME KeymapBase
#endif /* !KEYMAP_BASE_NAME */

#define SetKeyMapDefault(___keyMap) \
      LP1NR(0x1e, SetKeyMapDefault , const struct KeyMap *, ___keyMap, a0,\
      , KEYMAP_BASE_NAME)

#define AskKeyMapDefault() \
      LP0(0x24, struct KeyMap *, AskKeyMapDefault ,\
      , KEYMAP_BASE_NAME)

#define MapRawKey(___event, ___buffer, ___length, ___keyMap) \
      LP4(0x2a, WORD, MapRawKey , const struct InputEvent *, ___event, a0, STRPTR, ___buffer, a1, WORD, ___length, d1, const struct KeyMap *, ___keyMap, a2,\
      , KEYMAP_BASE_NAME)

#define MapANSI(___string, ___count, ___buffer, ___length, ___keyMap) \
      LP5(0x30, LONG, MapANSI , CONST_STRPTR, ___string, a0, LONG, ___count, d0, STRPTR, ___buffer, a1, LONG, ___length, d1, const struct KeyMap *, ___keyMap, a2,\
      , KEYMAP_BASE_NAME)

#endif /* !_INLINE_KEYMAP_H */
