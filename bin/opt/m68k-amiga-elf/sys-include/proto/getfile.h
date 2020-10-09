/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_GETFILE_H
#define PROTO_GETFILE_H

#include <clib/getfile_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/getfile.h>
#  else
#   include <inline/getfile.h>
#  endif
# else
#  include <pragmas/getfile_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/getfile.h>
# ifndef __NOGLOBALIFACE__
   extern struct GetFileIFace *IGetFile;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  GetFileBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_GETFILE_H */
