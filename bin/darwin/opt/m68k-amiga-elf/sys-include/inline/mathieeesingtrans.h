/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MATHIEEESINGTRANS_H
#define _INLINE_MATHIEEESINGTRANS_H

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

#ifndef MATHIEEESINGTRANS_BASE_NAME
#define MATHIEEESINGTRANS_BASE_NAME MathIeeeSingTransBase
#endif /* !MATHIEEESINGTRANS_BASE_NAME */

#define IEEESPAtan(___parm) \
      LP1(0x1e, FLOAT, IEEESPAtan , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPSin(___parm) \
      LP1(0x24, FLOAT, IEEESPSin , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPCos(___parm) \
      LP1(0x2a, FLOAT, IEEESPCos , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPTan(___parm) \
      LP1(0x30, FLOAT, IEEESPTan , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPSincos(___cosptr, ___parm) \
      LP2(0x36, FLOAT, IEEESPSincos , FLOAT *, ___cosptr, a0, FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPSinh(___parm) \
      LP1(0x3c, FLOAT, IEEESPSinh , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPCosh(___parm) \
      LP1(0x42, FLOAT, IEEESPCosh , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPTanh(___parm) \
      LP1(0x48, FLOAT, IEEESPTanh , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPExp(___parm) \
      LP1(0x4e, FLOAT, IEEESPExp , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPLog(___parm) \
      LP1(0x54, FLOAT, IEEESPLog , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPPow(___exp, ___arg) \
      LP2(0x5a, FLOAT, IEEESPPow , FLOAT, ___exp, d1, FLOAT, ___arg, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPSqrt(___parm) \
      LP1(0x60, FLOAT, IEEESPSqrt , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPTieee(___parm) \
      LP1(0x66, FLOAT, IEEESPTieee , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPFieee(___parm) \
      LP1(0x6c, FLOAT, IEEESPFieee , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPAsin(___parm) \
      LP1(0x72, FLOAT, IEEESPAsin , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPAcos(___parm) \
      LP1(0x78, FLOAT, IEEESPAcos , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#define IEEESPLog10(___parm) \
      LP1(0x7e, FLOAT, IEEESPLog10 , FLOAT, ___parm, d0,\
      , MATHIEEESINGTRANS_BASE_NAME)

#endif /* !_INLINE_MATHIEEESINGTRANS_H */
