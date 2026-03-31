/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef _INLINE_LOWLEVEL_H
#define _INLINE_LOWLEVEL_H

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

#ifndef LOWLEVEL_BASE_NAME
#define LOWLEVEL_BASE_NAME LowLevelBase
#endif /* !LOWLEVEL_BASE_NAME */

#define ReadJoyPort(___port) \
      LP1(0x1e, ULONG, ReadJoyPort , ULONG, ___port, d0,\
      , LOWLEVEL_BASE_NAME)

#define GetLanguageSelection() \
      LP0(0x24, UBYTE, GetLanguageSelection ,\
      , LOWLEVEL_BASE_NAME)

#define GetKey() \
      LP0(0x30, ULONG, GetKey ,\
      , LOWLEVEL_BASE_NAME)

#define QueryKeys(___queryArray, ___arraySize) \
      LP2NR(0x36, QueryKeys , struct KeyQuery *, ___queryArray, a0, LONG, ___arraySize, d1,\
      , LOWLEVEL_BASE_NAME)

#define AddKBInt(___intRoutine, ___intData) \
      LP2(0x3c, APTR, AddKBInt , APTR, ___intRoutine, a0, APTR, ___intData, a1,\
      , LOWLEVEL_BASE_NAME)

#define RemKBInt(___intHandle) \
      LP1NR(0x42, RemKBInt , APTR, ___intHandle, a1,\
      , LOWLEVEL_BASE_NAME)

#define SystemControlA(___tagList) \
      LP1(0x48, ULONG, SystemControlA , CONST struct TagItem *, ___tagList, a1,\
      , LOWLEVEL_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SystemControl(___firstTag, ...) \
    ({_sfdc_vararg _tags[] = { ___firstTag, __VA_ARGS__ }; SystemControlA((CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AddTimerInt(___intRoutine, ___intData) \
      LP2(0x4e, APTR, AddTimerInt , APTR, ___intRoutine, a0, APTR, ___intData, a1,\
      , LOWLEVEL_BASE_NAME)

#define RemTimerInt(___intHandle) \
      LP1NR(0x54, RemTimerInt , APTR, ___intHandle, a1,\
      , LOWLEVEL_BASE_NAME)

#define StopTimerInt(___intHandle) \
      LP1NR(0x5a, StopTimerInt , APTR, ___intHandle, a1,\
      , LOWLEVEL_BASE_NAME)

#define StartTimerInt(___intHandle, ___timeInterval, ___continuous) \
      LP3NR(0x60, StartTimerInt , APTR, ___intHandle, a1, ULONG, ___timeInterval, d0, BOOL, ___continuous, d1,\
      , LOWLEVEL_BASE_NAME)

#define ElapsedTime(___context) \
      LP1(0x66, ULONG, ElapsedTime , struct EClockVal *, ___context, a0,\
      , LOWLEVEL_BASE_NAME)

#define AddVBlankInt(___intRoutine, ___intData) \
      LP2(0x6c, APTR, AddVBlankInt , APTR, ___intRoutine, a0, APTR, ___intData, a1,\
      , LOWLEVEL_BASE_NAME)

#define RemVBlankInt(___intHandle) \
      LP1NR(0x72, RemVBlankInt , APTR, ___intHandle, a1,\
      , LOWLEVEL_BASE_NAME)

#define SetJoyPortAttrsA(___portNumber, ___tagList) \
      LP2(0x84, BOOL, SetJoyPortAttrsA , ULONG, ___portNumber, d0, CONST struct TagItem *, ___tagList, a1,\
      , LOWLEVEL_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetJoyPortAttrs(___portNumber, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetJoyPortAttrsA((___portNumber), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_LOWLEVEL_H */
