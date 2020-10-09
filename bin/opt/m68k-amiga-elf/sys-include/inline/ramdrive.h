/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_RAMDRIVE_H
#define _INLINE_RAMDRIVE_H

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

#ifndef RAMDRIVE_BASE_NAME
#define RAMDRIVE_BASE_NAME RamdriveDevice
#endif /* !RAMDRIVE_BASE_NAME */

#define KillRAD0() \
      LP0(0x2a, STRPTR, KillRAD0 ,\
      , RAMDRIVE_BASE_NAME)

#define KillRAD(___unit) \
      LP1(0x30, STRPTR, KillRAD , ULONG, ___unit, d0,\
      , RAMDRIVE_BASE_NAME)

#endif /* !_INLINE_RAMDRIVE_H */
