/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_SPACE_H
#define PROTO_SPACE_H

#include <clib/space_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/space.h>
#  else
#   include <inline/space.h>
#  endif
# else
#  include <pragmas/space_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/space.h>
# ifndef __NOGLOBALIFACE__
   extern struct SpaceIFace *ISpace;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  SpaceBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_SPACE_H */
