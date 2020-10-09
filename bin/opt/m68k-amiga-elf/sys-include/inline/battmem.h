/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_BATTMEM_H
#define _INLINE_BATTMEM_H

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

#ifndef BATTMEM_BASE_NAME
#define BATTMEM_BASE_NAME BattMemBase
#endif /* !BATTMEM_BASE_NAME */

#define ObtainBattSemaphore() \
      LP0NR(0x6, ObtainBattSemaphore ,\
      , BATTMEM_BASE_NAME)

#define ReleaseBattSemaphore() \
      LP0NR(0xc, ReleaseBattSemaphore ,\
      , BATTMEM_BASE_NAME)

#define ReadBattMem(___buffer, ___offset, ___length) \
      LP3(0x12, ULONG, ReadBattMem , APTR, ___buffer, a0, ULONG, ___offset, d0, ULONG, ___length, d1,\
      , BATTMEM_BASE_NAME)

#define WriteBattMem(___buffer, ___offset, ___length) \
      LP3(0x18, ULONG, WriteBattMem , const APTR, ___buffer, a0, ULONG, ___offset, d0, ULONG, ___length, d1,\
      , BATTMEM_BASE_NAME)

#endif /* !_INLINE_BATTMEM_H */
