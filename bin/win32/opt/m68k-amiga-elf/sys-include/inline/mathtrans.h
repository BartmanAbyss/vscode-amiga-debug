/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MATHTRANS_H
#define _INLINE_MATHTRANS_H

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

#ifndef MATHTRANS_BASE_NAME
#define MATHTRANS_BASE_NAME MathTransBase
#endif /* !MATHTRANS_BASE_NAME */

#define SPAtan(___parm) \
      LP1(0x1e, FLOAT, SPAtan , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPSin(___parm) \
      LP1(0x24, FLOAT, SPSin , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPCos(___parm) \
      LP1(0x2a, FLOAT, SPCos , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPTan(___parm) \
      LP1(0x30, FLOAT, SPTan , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPSincos(___cosResult, ___parm) \
      LP2(0x36, FLOAT, SPSincos , FLOAT *, ___cosResult, d1, FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPSinh(___parm) \
      LP1(0x3c, FLOAT, SPSinh , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPCosh(___parm) \
      LP1(0x42, FLOAT, SPCosh , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPTanh(___parm) \
      LP1(0x48, FLOAT, SPTanh , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPExp(___parm) \
      LP1(0x4e, FLOAT, SPExp , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPLog(___parm) \
      LP1(0x54, FLOAT, SPLog , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPPow(___power, ___arg) \
      LP2(0x5a, FLOAT, SPPow , FLOAT, ___power, d1, FLOAT, ___arg, d0,\
      , MATHTRANS_BASE_NAME)

#define SPSqrt(___parm) \
      LP1(0x60, FLOAT, SPSqrt , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPTieee(___parm) \
      LP1(0x66, FLOAT, SPTieee , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPFieee(___parm) \
      LP1(0x6c, FLOAT, SPFieee , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPAsin(___parm) \
      LP1(0x72, FLOAT, SPAsin , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPAcos(___parm) \
      LP1(0x78, FLOAT, SPAcos , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#define SPLog10(___parm) \
      LP1(0x7e, FLOAT, SPLog10 , FLOAT, ___parm, d0,\
      , MATHTRANS_BASE_NAME)

#endif /* !_INLINE_MATHTRANS_H */
