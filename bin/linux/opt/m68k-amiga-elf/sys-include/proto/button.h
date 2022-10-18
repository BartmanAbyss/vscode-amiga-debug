/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_BUTTON_H
#define PROTO_BUTTON_H

#include <clib/button_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/button.h>
#  else
#   include <inline/button.h>
#  endif
# else
#  include <pragmas/button_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/button.h>
# ifndef __NOGLOBALIFACE__
   extern struct ButtonIFace *IButton;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ButtonBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_BUTTON_H */
