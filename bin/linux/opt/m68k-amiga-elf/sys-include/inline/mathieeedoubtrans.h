/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MATHIEEEDOUBTRANS_H
#define _INLINE_MATHIEEEDOUBTRANS_H

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

#ifndef MATHIEEEDOUBTRANS_BASE_NAME
#define MATHIEEEDOUBTRANS_BASE_NAME MathIeeeDoubTransBase
#endif /* !MATHIEEEDOUBTRANS_BASE_NAME */

#define IEEEDPAtan(___parm) \
      LP1(0x1e, DOUBLE, IEEEDPAtan , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPSin(___parm) \
      LP1(0x24, DOUBLE, IEEEDPSin , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPCos(___parm) \
      LP1(0x2a, DOUBLE, IEEEDPCos , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPTan(___parm) \
      LP1(0x30, DOUBLE, IEEEDPTan , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPSincos(___pf2, ___parm) \
      LP2(0x36, DOUBLE, IEEEDPSincos , DOUBLE *, ___pf2, a0, DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPSinh(___parm) \
      LP1(0x3c, DOUBLE, IEEEDPSinh , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPCosh(___parm) \
      LP1(0x42, DOUBLE, IEEEDPCosh , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPTanh(___parm) \
      LP1(0x48, DOUBLE, IEEEDPTanh , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPExp(___parm) \
      LP1(0x4e, DOUBLE, IEEEDPExp , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPLog(___parm) \
      LP1(0x54, DOUBLE, IEEEDPLog , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPPow(___exp, ___arg) \
      LP2(0x5a, DOUBLE, IEEEDPPow , DOUBLE, ___exp, d2, DOUBLE, ___arg, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPSqrt(___parm) \
      LP1(0x60, DOUBLE, IEEEDPSqrt , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPTieee(___parm) \
      LP1(0x66, FLOAT, IEEEDPTieee , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPFieee(___single) \
      LP1(0x6c, DOUBLE, IEEEDPFieee , FLOAT, ___single, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPAsin(___parm) \
      LP1(0x72, DOUBLE, IEEEDPAsin , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPAcos(___parm) \
      LP1(0x78, DOUBLE, IEEEDPAcos , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#define IEEEDPLog10(___parm) \
      LP1(0x7e, DOUBLE, IEEEDPLog10 , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBTRANS_BASE_NAME)

#endif /* !_INLINE_MATHIEEEDOUBTRANS_H */
