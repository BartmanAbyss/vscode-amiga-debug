/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_BITMAP_H
#define PROTO_BITMAP_H

#include <clib/bitmap_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/bitmap.h>
#  else
#   include <inline/bitmap.h>
#  endif
# else
#  include <pragmas/bitmap_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/bitmap.h>
# ifndef __NOGLOBALIFACE__
   extern struct BitMapIFace *IBitMap;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  BitMapBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_BITMAP_H */
