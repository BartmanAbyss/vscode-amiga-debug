/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_LAYERS_H
#define PROTO_LAYERS_H

#include <clib/layers_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/layers.h>
#  else
#   include <inline/layers.h>
#  endif
# else
#  include <pragmas/layers_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/layers.h>
# ifndef __NOGLOBALIFACE__
   extern struct LayersIFace *ILayers;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  LayersBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_LAYERS_H */
