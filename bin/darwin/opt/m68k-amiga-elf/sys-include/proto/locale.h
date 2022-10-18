/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_LOCALE_H
#define PROTO_LOCALE_H

#include <clib/locale_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/locale.h>
#  else
#   include <inline/locale.h>
#  endif
# else
#  include <pragmas/locale_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/locale.h>
# ifndef __NOGLOBALIFACE__
   extern struct LocaleIFace *ILocale;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct LocaleBase *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  LocaleBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_LOCALE_H */
