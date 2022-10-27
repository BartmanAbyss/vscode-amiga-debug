/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_CONSOLE_H
#define _INLINE_CONSOLE_H

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

#ifndef CONSOLE_BASE_NAME
#define CONSOLE_BASE_NAME ConsoleDevice
#endif /* !CONSOLE_BASE_NAME */

#define CDInputHandler(___events, ___consoleDevice) \
      LP2(0x2a, struct InputEvent *, CDInputHandler , const struct InputEvent *, ___events, a0, struct Library *, ___consoleDevice, a1,\
      , CONSOLE_BASE_NAME)

#define RawKeyConvert(___events, ___buffer, ___length, ___keyMap) \
      LP4(0x30, LONG, RawKeyConvert , const struct InputEvent *, ___events, a0, STRPTR, ___buffer, a1, LONG, ___length, d1, const struct KeyMap *, ___keyMap, a2,\
      , CONSOLE_BASE_NAME)

#endif /* !_INLINE_CONSOLE_H */
