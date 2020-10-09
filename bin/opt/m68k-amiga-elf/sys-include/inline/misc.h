/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_MISC_H
#define _INLINE_MISC_H

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

#ifndef MISC_BASE_NAME
#define MISC_BASE_NAME MiscBase
#endif /* !MISC_BASE_NAME */

#define AllocMiscResource(___unitNum, ___name) \
      LP2(0x6, UBYTE *, AllocMiscResource , ULONG, ___unitNum, d0, CONST_STRPTR, ___name, a1,\
      , MISC_BASE_NAME)

#define FreeMiscResource(___unitNum) \
      LP1NR(0xc, FreeMiscResource , ULONG, ___unitNum, d0,\
      , MISC_BASE_NAME)

#endif /* !_INLINE_MISC_H */
