/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_RAMDRIVE_H
#define PROTO_RAMDRIVE_H

#include <clib/ramdrive_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/ramdrive.h>
#  else
#   include <inline/ramdrive.h>
#  endif
# else
#  include <pragmas/ramdrive_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/ramdrive.h>
# ifndef __NOGLOBALIFACE__
   extern struct RamdriveDeviceIFace *IRamdriveDevice;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Device *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  RamdriveDevice;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_RAMDRIVE_H */
