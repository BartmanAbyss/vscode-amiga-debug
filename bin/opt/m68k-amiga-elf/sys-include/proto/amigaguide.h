/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_AMIGAGUIDE_H
#define PROTO_AMIGAGUIDE_H

#include <clib/amigaguide_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/amigaguide.h>
#  else
#   include <inline/amigaguide.h>
#  endif
# else
#  include <pragmas/amigaguide_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/amigaguide.h>
# ifndef __NOGLOBALIFACE__
   extern struct AmigaGuideIFace *IAmigaGuide;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  AmigaGuideBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_AMIGAGUIDE_H */
