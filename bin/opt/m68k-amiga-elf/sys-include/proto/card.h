/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_CARD_H
#define PROTO_CARD_H

#include <clib/card_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/card.h>
#  else
#   include <inline/card.h>
#  endif
# else
#  include <pragmas/card_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/card.h>
# ifndef __NOGLOBALIFACE__
   extern struct CardResourceIFace *ICardResource;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  CardResource;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_CARD_H */
