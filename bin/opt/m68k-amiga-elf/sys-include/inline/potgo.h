/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_POTGO_H
#define _INLINE_POTGO_H

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

#ifndef POTGO_BASE_NAME
#define POTGO_BASE_NAME PotgoBase
#endif /* !POTGO_BASE_NAME */

#define AllocPotBits(___bits) \
      LP1(0x6, UWORD, AllocPotBits , UWORD, ___bits, d0,\
      , POTGO_BASE_NAME)

#define FreePotBits(___bits) \
      LP1NR(0xc, FreePotBits , UWORD, ___bits, d0,\
      , POTGO_BASE_NAME)

#define WritePotgo(___word, ___mask) \
      LP2NR(0x12, WritePotgo , UWORD, ___word, d0, UWORD, ___mask, d1,\
      , POTGO_BASE_NAME)

#endif /* !_INLINE_POTGO_H */
