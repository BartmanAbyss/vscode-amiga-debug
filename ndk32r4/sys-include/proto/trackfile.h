/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef PROTO_TRACKFILE_H
#define PROTO_TRACKFILE_H

#include <clib/trackfile_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/trackfile.h>
#  else
#   include <inline/trackfile.h>
#  endif
# else
#  include <pragmas/trackfile_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/trackfile.h>
# ifndef __NOGLOBALIFACE__
   extern struct TrackFileIFace *ITrackFile;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Device *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  TrackFileBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_TRACKFILE_H */
