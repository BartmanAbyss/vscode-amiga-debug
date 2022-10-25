/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_UTILITY_H
#define PROTO_UTILITY_H

#include <clib/utility_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/utility.h>
#  else
#   include <inline/utility.h>
#  endif
# else
#  include <pragmas/utility_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/utility.h>
# ifndef __NOGLOBALIFACE__
   extern struct UtilityIFace *IUtility;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct UtilityBase *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  UtilityBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_UTILITY_H */
