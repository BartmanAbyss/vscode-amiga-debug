/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_WB_H
#define PROTO_WB_H

#include <clib/wb_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/wb.h>
#  else
#   include <inline/wb.h>
#  endif
# else
#  include <pragmas/wb_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/wb.h>
# ifndef __NOGLOBALIFACE__
   extern struct WorkbenchIFace *IWorkbench;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  WorkbenchBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_WB_H */
