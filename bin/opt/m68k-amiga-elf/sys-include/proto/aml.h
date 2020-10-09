/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_AML_H
#define PROTO_AML_H

#include <clib/aml_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/aml.h>
#  else
#   include <inline/aml.h>
#  endif
# else
#  include <pragmas/aml_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/aml.h>
# ifndef __NOGLOBALIFACE__
   extern struct AmlIFace *IAml;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  AmlBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_AML_H */
