/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_EXEC_H
#define PROTO_EXEC_H

#include <clib/exec_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/exec.h>
#  else
#   include <inline/exec.h>
#  endif
# else
#  include <pragmas/exec_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/exec.h>
# ifndef __NOGLOBALIFACE__
   extern struct SysIFace *ISys;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct ExecBase *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  SysBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_EXEC_H */
