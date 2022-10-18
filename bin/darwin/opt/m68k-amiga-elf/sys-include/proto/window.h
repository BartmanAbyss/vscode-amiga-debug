/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_WINDOW_H
#define PROTO_WINDOW_H

#include <clib/window_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/window.h>
#  else
#   include <inline/window.h>
#  endif
# else
#  include <pragmas/window_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/window.h>
# ifndef __NOGLOBALIFACE__
   extern struct WindowIFace *IWindow;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  WindowBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_WINDOW_H */
