/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_TRANSLATOR_H
#define PROTO_TRANSLATOR_H

#include <clib/translator_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/translator.h>
#  else
#   include <inline/translator.h>
#  endif
# else
#  include <pragmas/translator_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/translator.h>
# ifndef __NOGLOBALIFACE__
   extern struct TranslatorIFace *ITranslator;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  TranslatorBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_TRANSLATOR_H */
