/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_RESOURCE_H
#define PROTO_RESOURCE_H

#include <clib/resource_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/resource.h>
#  else
#   include <inline/resource.h>
#  endif
# else
#  include <pragmas/resource_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/resource.h>
# ifndef __NOGLOBALIFACE__
   extern struct ResourceIFace *IResource;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ResourceBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_RESOURCE_H */
