/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_DOS_H
#define PROTO_DOS_H

#include <clib/dos_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/dos.h>
#  else
#   include <inline/dos.h>
#  endif
# else
#  include <pragmas/dos_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/dos.h>
# ifndef __NOGLOBALIFACE__
   extern struct DOSIFace *IDOS;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct DosLibrary *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  DOSBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_DOS_H */
