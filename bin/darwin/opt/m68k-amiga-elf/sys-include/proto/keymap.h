/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_KEYMAP_H
#define PROTO_KEYMAP_H

#include <clib/keymap_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/keymap.h>
#  else
#   include <inline/keymap.h>
#  endif
# else
#  include <pragmas/keymap_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/keymap.h>
# ifndef __NOGLOBALIFACE__
   extern struct KeymapIFace *IKeymap;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  KeymapBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_KEYMAP_H */
