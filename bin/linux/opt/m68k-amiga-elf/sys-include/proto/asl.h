/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_ASL_H
#define PROTO_ASL_H

#include <clib/asl_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/asl.h>
#  else
#   include <inline/asl.h>
#  endif
# else
#  include <pragmas/asl_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/asl.h>
# ifndef __NOGLOBALIFACE__
   extern struct AslIFace *IAsl;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  AslBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_ASL_H */
