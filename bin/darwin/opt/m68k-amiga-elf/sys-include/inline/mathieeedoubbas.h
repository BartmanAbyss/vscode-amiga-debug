/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MATHIEEEDOUBBAS_H
#define _INLINE_MATHIEEEDOUBBAS_H

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

#ifndef MATHIEEEDOUBBAS_BASE_NAME
#define MATHIEEEDOUBBAS_BASE_NAME MathIeeeDoubBasBase
#endif /* !MATHIEEEDOUBBAS_BASE_NAME */

#define IEEEDPFix(___parm) \
      LP1(0x1e, LONG, IEEEDPFix , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPFlt(___integer) \
      LP1(0x24, DOUBLE, IEEEDPFlt , LONG, ___integer, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPCmp(___leftParm, ___rightParm) \
      LP2(0x2a, LONG, IEEEDPCmp , DOUBLE, ___leftParm, d0, DOUBLE, ___rightParm, d2,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPTst(___parm) \
      LP1(0x30, LONG, IEEEDPTst , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPAbs(___parm) \
      LP1(0x36, DOUBLE, IEEEDPAbs , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPNeg(___parm) \
      LP1(0x3c, DOUBLE, IEEEDPNeg , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPAdd(___leftParm, ___rightParm) \
      LP2(0x42, DOUBLE, IEEEDPAdd , DOUBLE, ___leftParm, d0, DOUBLE, ___rightParm, d2,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPSub(___leftParm, ___rightParm) \
      LP2(0x48, DOUBLE, IEEEDPSub , DOUBLE, ___leftParm, d0, DOUBLE, ___rightParm, d2,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPMul(___factor1, ___factor2) \
      LP2(0x4e, DOUBLE, IEEEDPMul , DOUBLE, ___factor1, d0, DOUBLE, ___factor2, d2,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPDiv(___dividend, ___divisor) \
      LP2(0x54, DOUBLE, IEEEDPDiv , DOUBLE, ___dividend, d0, DOUBLE, ___divisor, d2,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPFloor(___parm) \
      LP1(0x5a, DOUBLE, IEEEDPFloor , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#define IEEEDPCeil(___parm) \
      LP1(0x60, DOUBLE, IEEEDPCeil , DOUBLE, ___parm, d0,\
      , MATHIEEEDOUBBAS_BASE_NAME)

#endif /* !_INLINE_MATHIEEEDOUBBAS_H */
