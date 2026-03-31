/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef _INLINE_TIMER_H
#define _INLINE_TIMER_H

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

#ifndef TIMER_BASE_NAME
#define TIMER_BASE_NAME TimerBase
#endif /* !TIMER_BASE_NAME */

#define AddTime(___dest, ___src) \
      LP2NR(0x2a, AddTime , TimeVal_Type *, ___dest, a0, CONST TimeVal_Type *, ___src, a1,\
      , TIMER_BASE_NAME)

#define SubTime(___dest, ___src) \
      LP2NR(0x30, SubTime , TimeVal_Type *, ___dest, a0, CONST TimeVal_Type *, ___src, a1,\
      , TIMER_BASE_NAME)

#define CmpTime(___dest, ___src) \
      LP2(0x36, LONG, CmpTime , CONST TimeVal_Type *, ___dest, a0, CONST TimeVal_Type *, ___src, a1,\
      , TIMER_BASE_NAME)

#define ReadEClock(___dest) \
      LP1(0x3c, ULONG, ReadEClock , struct EClockVal *, ___dest, a0,\
      , TIMER_BASE_NAME)

#define GetSysTime(___dest) \
      LP1NR(0x42, GetSysTime , TimeVal_Type *, ___dest, a0,\
      , TIMER_BASE_NAME)

#endif /* !_INLINE_TIMER_H */
