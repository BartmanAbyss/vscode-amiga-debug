/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_REXXSYSLIB_H
#define PROTO_REXXSYSLIB_H

#include <clib/rexxsyslib_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/rexxsyslib.h>
#  else
#   include <inline/rexxsyslib.h>
#  endif
# else
#  include <pragmas/rexxsyslib_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/rexxsyslib.h>
# ifndef __NOGLOBALIFACE__
   extern struct RexxSysIFace *IRexxSys;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct RxsLib *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  RexxSysBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_REXXSYSLIB_H */
