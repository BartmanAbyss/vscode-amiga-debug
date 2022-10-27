/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_INTUITION_H
#define PROTO_INTUITION_H

#include <clib/intuition_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/intuition.h>
#  else
#   include <inline/intuition.h>
#  endif
# else
#  include <pragmas/intuition_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/intuition.h>
# ifndef __NOGLOBALIFACE__
   extern struct IntuitionIFace *IIntuition;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct IntuitionBase *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  IntuitionBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_INTUITION_H */
