/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_DTCLASS_H
#define PROTO_DTCLASS_H

#include <clib/dtclass_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/dtclass.h>
#  else
#   include <inline/dtclass.h>
#  endif
# else
#  include <pragmas/dtclass_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/dtclass.h>
# ifndef __NOGLOBALIFACE__
   extern struct DTClassIFace *IDTClass;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  DTClassBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_DTCLASS_H */
