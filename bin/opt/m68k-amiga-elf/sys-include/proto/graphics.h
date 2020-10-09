/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_GRAPHICS_H
#define PROTO_GRAPHICS_H

#include <clib/graphics_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/graphics.h>
#  else
#   include <inline/graphics.h>
#  endif
# else
#  include <pragmas/graphics_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/graphics.h>
# ifndef __NOGLOBALIFACE__
   extern struct GfxIFace *IGfx;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct GfxBase *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  GfxBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_GRAPHICS_H */
