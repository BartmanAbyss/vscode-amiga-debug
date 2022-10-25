/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_DRAWLIST_H
#define PROTO_DRAWLIST_H

#include <clib/drawlist_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/drawlist.h>
#  else
#   include <inline/drawlist.h>
#  endif
# else
#  include <pragmas/drawlist_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/drawlist.h>
# ifndef __NOGLOBALIFACE__
   extern struct DrawListIFace *IDrawList;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  DrawListBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_DRAWLIST_H */
