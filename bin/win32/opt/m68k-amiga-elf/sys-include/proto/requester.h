/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_REQUESTER_H
#define PROTO_REQUESTER_H

#include <clib/requester_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/requester.h>
#  else
#   include <inline/requester.h>
#  endif
# else
#  include <pragmas/requester_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/requester.h>
# ifndef __NOGLOBALIFACE__
   extern struct RequesterIFace *IRequester;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  RequesterBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_REQUESTER_H */
