/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_SCROLLER_H
#define PROTO_SCROLLER_H

#include <clib/scroller_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/scroller.h>
#  else
#   include <inline/scroller.h>
#  endif
# else
#  include <pragmas/scroller_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/scroller.h>
# ifndef __NOGLOBALIFACE__
   extern struct ScrollerIFace *IScroller;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ScrollerBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_SCROLLER_H */
