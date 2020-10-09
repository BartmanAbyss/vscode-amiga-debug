/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_BATTMEM_H
#define PROTO_BATTMEM_H

#include <clib/battmem_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/battmem.h>
#  else
#   include <inline/battmem.h>
#  endif
# else
#  include <pragmas/battmem_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/battmem.h>
# ifndef __NOGLOBALIFACE__
   extern struct BattMemIFace *IBattMem;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  BattMemBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_BATTMEM_H */
