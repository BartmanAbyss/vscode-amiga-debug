/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_LAYOUT_H
#define PROTO_LAYOUT_H

#include <clib/layout_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/layout.h>
#  else
#   include <inline/layout.h>
#  endif
# else
#  include <pragmas/layout_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/layout.h>
# ifndef __NOGLOBALIFACE__
   extern struct LayoutIFace *ILayout;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  LayoutBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_LAYOUT_H */
