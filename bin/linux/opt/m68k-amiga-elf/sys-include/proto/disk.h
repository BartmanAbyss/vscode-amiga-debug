/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_DISK_H
#define PROTO_DISK_H

#include <clib/disk_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/disk.h>
#  else
#   include <inline/disk.h>
#  endif
# else
#  include <pragmas/disk_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/disk.h>
# ifndef __NOGLOBALIFACE__
   extern struct DiskIFace *IDisk;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct DiskResource *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  DiskBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_DISK_H */
