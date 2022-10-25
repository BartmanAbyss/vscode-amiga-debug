/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MATHFFP_H
#define _INLINE_MATHFFP_H

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

#ifndef MATHFFP_BASE_NAME
#define MATHFFP_BASE_NAME MathBase
#endif /* !MATHFFP_BASE_NAME */

#define SPFix(___parm) \
      LP1(0x1e, LONG, SPFix , FLOAT, ___parm, d0,\
      , MATHFFP_BASE_NAME)

#define SPFlt(___integer) \
      LP1(0x24, FLOAT, SPFlt , LONG, ___integer, d0,\
      , MATHFFP_BASE_NAME)

#define SPCmp(___leftParm, ___rightParm) \
      LP2(0x2a, LONG, SPCmp , FLOAT, ___leftParm, d1, FLOAT, ___rightParm, d0,\
      , MATHFFP_BASE_NAME)

#define SPTst(___parm) \
      LP1(0x30, LONG, SPTst , FLOAT, ___parm, d1,\
      , MATHFFP_BASE_NAME)

#define SPAbs(___parm) \
      LP1(0x36, FLOAT, SPAbs , FLOAT, ___parm, d0,\
      , MATHFFP_BASE_NAME)

#define SPNeg(___parm) \
      LP1(0x3c, FLOAT, SPNeg , FLOAT, ___parm, d0,\
      , MATHFFP_BASE_NAME)

#define SPAdd(___leftParm, ___rightParm) \
      LP2(0x42, FLOAT, SPAdd , FLOAT, ___leftParm, d1, FLOAT, ___rightParm, d0,\
      , MATHFFP_BASE_NAME)

#define SPSub(___leftParm, ___rightParm) \
      LP2(0x48, FLOAT, SPSub , FLOAT, ___leftParm, d1, FLOAT, ___rightParm, d0,\
      , MATHFFP_BASE_NAME)

#define SPMul(___leftParm, ___rightParm) \
      LP2(0x4e, FLOAT, SPMul , FLOAT, ___leftParm, d1, FLOAT, ___rightParm, d0,\
      , MATHFFP_BASE_NAME)

#define SPDiv(___leftParm, ___rightParm) \
      LP2(0x54, FLOAT, SPDiv , FLOAT, ___leftParm, d1, FLOAT, ___rightParm, d0,\
      , MATHFFP_BASE_NAME)

#define SPFloor(___parm) \
      LP1(0x5a, FLOAT, SPFloor , FLOAT, ___parm, d0,\
      , MATHFFP_BASE_NAME)

#define SPCeil(___parm) \
      LP1(0x60, FLOAT, SPCeil , FLOAT, ___parm, d0,\
      , MATHFFP_BASE_NAME)

#endif /* !_INLINE_MATHFFP_H */
