/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_AREXX_H
#define PROTO_AREXX_H

#include <clib/arexx_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/arexx.h>
#  else
#   include <inline/arexx.h>
#  endif
# else
#  include <pragmas/arexx_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/arexx.h>
# ifndef __NOGLOBALIFACE__
   extern struct ARexxIFace *IARexx;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ARexxBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_AREXX_H */
