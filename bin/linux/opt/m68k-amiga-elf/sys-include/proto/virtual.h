/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_VIRTUAL_H
#define PROTO_VIRTUAL_H

#include <clib/virtual_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/virtual.h>
#  else
#   include <inline/virtual.h>
#  endif
# else
#  include <pragmas/virtual_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/virtual.h>
# ifndef __NOGLOBALIFACE__
   extern struct VirtualIFace *IVirtual;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  VirtualBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_VIRTUAL_H */
