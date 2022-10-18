/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_CONSOLE_H
#define PROTO_CONSOLE_H

#include <clib/console_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/console.h>
#  else
#   include <inline/console.h>
#  endif
# else
#  include <pragmas/console_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/console.h>
# ifndef __NOGLOBALIFACE__
   extern struct ConsoleDeviceIFace *IConsoleDevice;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Device *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ConsoleDevice;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_CONSOLE_H */
