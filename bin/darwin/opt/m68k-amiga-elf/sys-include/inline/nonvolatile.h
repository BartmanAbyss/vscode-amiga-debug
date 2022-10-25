/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_NONVOLATILE_H
#define _INLINE_NONVOLATILE_H

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

#ifndef NONVOLATILE_BASE_NAME
#define NONVOLATILE_BASE_NAME NVBase
#endif /* !NONVOLATILE_BASE_NAME */

#define GetCopyNV(___appName, ___itemName, ___killRequesters) \
      LP3(0x1e, APTR, GetCopyNV , CONST_STRPTR, ___appName, a0, CONST_STRPTR, ___itemName, a1, BOOL, ___killRequesters, d1,\
      , NONVOLATILE_BASE_NAME)

#define FreeNVData(___data) \
      LP1NR(0x24, FreeNVData , APTR, ___data, a0,\
      , NONVOLATILE_BASE_NAME)

#define StoreNV(___appName, ___itemName, ___data, ___length, ___killRequesters) \
      LP5(0x2a, UWORD, StoreNV , CONST_STRPTR, ___appName, a0, CONST_STRPTR, ___itemName, a1, const APTR, ___data, a2, ULONG, ___length, d0, BOOL, ___killRequesters, d1,\
      , NONVOLATILE_BASE_NAME)

#define DeleteNV(___appName, ___itemName, ___killRequesters) \
      LP3(0x30, BOOL, DeleteNV , CONST_STRPTR, ___appName, a0, CONST_STRPTR, ___itemName, a1, BOOL, ___killRequesters, d1,\
      , NONVOLATILE_BASE_NAME)

#define GetNVInfo(___killRequesters) \
      LP1(0x36, struct NVInfo *, GetNVInfo , BOOL, ___killRequesters, d1,\
      , NONVOLATILE_BASE_NAME)

#define GetNVList(___appName, ___killRequesters) \
      LP2(0x3c, struct MinList *, GetNVList , CONST_STRPTR, ___appName, a0, BOOL, ___killRequesters, d1,\
      , NONVOLATILE_BASE_NAME)

#define SetNVProtection(___appName, ___itemName, ___mask, ___killRequesters) \
      LP4(0x42, BOOL, SetNVProtection , CONST_STRPTR, ___appName, a0, CONST_STRPTR, ___itemName, a1, LONG, ___mask, d2, BOOL, ___killRequesters, d1,\
      , NONVOLATILE_BASE_NAME)

#endif /* !_INLINE_NONVOLATILE_H */
