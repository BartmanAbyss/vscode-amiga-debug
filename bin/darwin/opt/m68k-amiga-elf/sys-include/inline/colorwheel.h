/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_COLORWHEEL_H
#define _INLINE_COLORWHEEL_H

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

#ifndef COLORWHEEL_BASE_NAME
#define COLORWHEEL_BASE_NAME ColorWheelBase
#endif /* !COLORWHEEL_BASE_NAME */

#define ConvertHSBToRGB(___hsb, ___rgb) \
      LP2NR(0x1e, ConvertHSBToRGB , struct ColorWheelHSB *, ___hsb, a0, struct ColorWheelRGB *, ___rgb, a1,\
      , COLORWHEEL_BASE_NAME)

#define ConvertRGBToHSB(___rgb, ___hsb) \
      LP2NR(0x24, ConvertRGBToHSB , struct ColorWheelRGB *, ___rgb, a0, struct ColorWheelHSB *, ___hsb, a1,\
      , COLORWHEEL_BASE_NAME)

#endif /* !_INLINE_COLORWHEEL_H */
