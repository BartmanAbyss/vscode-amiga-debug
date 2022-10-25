/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_LABEL_H
#define PROTO_LABEL_H

#include <clib/label_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/label.h>
#  else
#   include <inline/label.h>
#  endif
# else
#  include <pragmas/label_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/label.h>
# ifndef __NOGLOBALIFACE__
   extern struct LabelIFace *ILabel;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  LabelBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_LABEL_H */
