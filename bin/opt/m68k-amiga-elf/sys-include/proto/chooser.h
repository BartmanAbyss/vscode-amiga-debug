/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_CHOOSER_H
#define PROTO_CHOOSER_H

#include <clib/chooser_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/chooser.h>
#  else
#   include <inline/chooser.h>
#  endif
# else
#  include <pragmas/chooser_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/chooser.h>
# ifndef __NOGLOBALIFACE__
   extern struct ChooserIFace *IChooser;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ChooserBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_CHOOSER_H */
