/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_ICON_H
#define PROTO_ICON_H

#include <clib/icon_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/icon.h>
#  else
#   include <inline/icon.h>
#  endif
# else
#  include <pragmas/icon_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/icon.h>
# ifndef __NOGLOBALIFACE__
   extern struct IconIFace *IIcon;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  IconBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_ICON_H */
