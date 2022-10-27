/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_MISC_H
#define PROTO_MISC_H

#include <clib/misc_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/misc.h>
#  else
#   include <inline/misc.h>
#  endif
# else
#  include <pragmas/misc_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/misc.h>
# ifndef __NOGLOBALIFACE__
   extern struct MiscIFace *IMisc;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  MiscBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_MISC_H */
