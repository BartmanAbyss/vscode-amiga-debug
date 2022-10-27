/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_BATTCLOCK_H
#define _INLINE_BATTCLOCK_H

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

#ifndef BATTCLOCK_BASE_NAME
#define BATTCLOCK_BASE_NAME BattClockBase
#endif /* !BATTCLOCK_BASE_NAME */

#define ResetBattClock() \
      LP0NR(0x6, ResetBattClock ,\
      , BATTCLOCK_BASE_NAME)

#define ReadBattClock() \
      LP0(0xc, ULONG, ReadBattClock ,\
      , BATTCLOCK_BASE_NAME)

#define WriteBattClock(___time) \
      LP1NR(0x12, WriteBattClock , ULONG, ___time, d0,\
      , BATTCLOCK_BASE_NAME)

#endif /* !_INLINE_BATTCLOCK_H */
