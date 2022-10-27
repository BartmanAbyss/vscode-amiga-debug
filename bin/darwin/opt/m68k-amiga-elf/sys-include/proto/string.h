/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_STRING_H
#define PROTO_STRING_H

#include <clib/string_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/string.h>
#  else
#   include <inline/string.h>
#  endif
# else
#  include <pragmas/string_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/string.h>
# ifndef __NOGLOBALIFACE__
   extern struct StringIFace *IString;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  StringBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_STRING_H */
