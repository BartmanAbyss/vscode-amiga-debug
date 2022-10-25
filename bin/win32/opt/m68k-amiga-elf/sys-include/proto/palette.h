/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_PALETTE_H
#define PROTO_PALETTE_H

#include <clib/palette_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/palette.h>
#  else
#   include <inline/palette.h>
#  endif
# else
#  include <pragmas/palette_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/palette.h>
# ifndef __NOGLOBALIFACE__
   extern struct PaletteIFace *IPalette;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  PaletteBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_PALETTE_H */
