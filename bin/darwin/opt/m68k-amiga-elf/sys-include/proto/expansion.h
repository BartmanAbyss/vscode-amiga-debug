/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_EXPANSION_H
#define PROTO_EXPANSION_H

#include <clib/expansion_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/expansion.h>
#  else
#   include <inline/expansion.h>
#  endif
# else
#  include <pragmas/expansion_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/expansion.h>
# ifndef __NOGLOBALIFACE__
   extern struct ExpansionIFace *IExpansion;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct ExpansionBase *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ExpansionBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_EXPANSION_H */
