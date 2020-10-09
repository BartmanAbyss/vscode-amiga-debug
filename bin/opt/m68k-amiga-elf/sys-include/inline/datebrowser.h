/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_DATEBROWSER_H
#define _INLINE_DATEBROWSER_H

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

#ifndef DATEBROWSER_BASE_NAME
#define DATEBROWSER_BASE_NAME DateBrowserBase
#endif /* !DATEBROWSER_BASE_NAME */

#define DATEBROWSER_GetClass() \
      LP0(0x1e, Class *, DATEBROWSER_GetClass ,\
      , DATEBROWSER_BASE_NAME)

#define JulianWeekDay(___day, ___month, ___year) \
      LP3(0x24, UWORD, JulianWeekDay , UWORD, ___day, d0, UWORD, ___month, d1, LONG, ___year, d2,\
      , DATEBROWSER_BASE_NAME)

#define JulianMonthDays(___month, ___year) \
      LP2(0x2a, UWORD, JulianMonthDays , UWORD, ___month, d0, LONG, ___year, d1,\
      , DATEBROWSER_BASE_NAME)

#define JulianLeapYear(___year) \
      LP1(0x30, BOOL, JulianLeapYear , LONG, ___year, d0,\
      , DATEBROWSER_BASE_NAME)

#endif /* !_INLINE_DATEBROWSER_H */
