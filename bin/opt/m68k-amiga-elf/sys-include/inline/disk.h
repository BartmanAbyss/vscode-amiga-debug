/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_DISK_H
#define _INLINE_DISK_H

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

#ifndef DISK_BASE_NAME
#define DISK_BASE_NAME DiskBase
#endif /* !DISK_BASE_NAME */

#define AllocUnit(___unitNum) \
      LP1(0x6, BOOL, AllocUnit , LONG, ___unitNum, d0,\
      , DISK_BASE_NAME)

#define FreeUnit(___unitNum) \
      LP1NR(0xc, FreeUnit , LONG, ___unitNum, d0,\
      , DISK_BASE_NAME)

#define GetUnit(___unitPointer) \
      LP1(0x12, struct DiscResourceUnit *, GetUnit , struct DiscResourceUnit *, ___unitPointer, a1,\
      , DISK_BASE_NAME)

#define GiveUnit() \
      LP0NR(0x18, GiveUnit ,\
      , DISK_BASE_NAME)

#define GetUnitID(___unitNum) \
      LP1(0x1e, LONG, GetUnitID , LONG, ___unitNum, d0,\
      , DISK_BASE_NAME)

#define ReadUnitID(___unitNum) \
      LP1(0x24, LONG, ReadUnitID , LONG, ___unitNum, d0,\
      , DISK_BASE_NAME)

#endif /* !_INLINE_DISK_H */
