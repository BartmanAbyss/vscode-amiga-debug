/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MATHIEEESINGBAS_H
#define _INLINE_MATHIEEESINGBAS_H

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

#ifndef MATHIEEESINGBAS_BASE_NAME
#define MATHIEEESINGBAS_BASE_NAME MathIeeeSingBasBase
#endif /* !MATHIEEESINGBAS_BASE_NAME */

#define IEEESPFix(___parm) \
      LP1(0x1e, LONG, IEEESPFix , FLOAT, ___parm, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPFlt(___integer) \
      LP1(0x24, FLOAT, IEEESPFlt , LONG, ___integer, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPCmp(___leftParm, ___rightParm) \
      LP2(0x2a, LONG, IEEESPCmp , FLOAT, ___leftParm, d0, FLOAT, ___rightParm, d1,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPTst(___parm) \
      LP1(0x30, LONG, IEEESPTst , FLOAT, ___parm, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPAbs(___parm) \
      LP1(0x36, FLOAT, IEEESPAbs , FLOAT, ___parm, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPNeg(___parm) \
      LP1(0x3c, FLOAT, IEEESPNeg , FLOAT, ___parm, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPAdd(___leftParm, ___rightParm) \
      LP2(0x42, FLOAT, IEEESPAdd , FLOAT, ___leftParm, d0, FLOAT, ___rightParm, d1,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPSub(___leftParm, ___rightParm) \
      LP2(0x48, FLOAT, IEEESPSub , FLOAT, ___leftParm, d0, FLOAT, ___rightParm, d1,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPMul(___leftParm, ___rightParm) \
      LP2(0x4e, FLOAT, IEEESPMul , FLOAT, ___leftParm, d0, FLOAT, ___rightParm, d1,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPDiv(___dividend, ___divisor) \
      LP2(0x54, FLOAT, IEEESPDiv , FLOAT, ___dividend, d0, FLOAT, ___divisor, d1,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPFloor(___parm) \
      LP1(0x5a, FLOAT, IEEESPFloor , FLOAT, ___parm, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#define IEEESPCeil(___parm) \
      LP1(0x60, FLOAT, IEEESPCeil , FLOAT, ___parm, d0,\
      , MATHIEEESINGBAS_BASE_NAME)

#endif /* !_INLINE_MATHIEEESINGBAS_H */
