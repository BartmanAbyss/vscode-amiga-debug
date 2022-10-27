/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_BATTCLOCK_H
#define PROTO_BATTCLOCK_H

#include <clib/battclock_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/battclock.h>
#  else
#   include <inline/battclock.h>
#  endif
# else
#  include <pragmas/battclock_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/battclock.h>
# ifndef __NOGLOBALIFACE__
   extern struct BattClockIFace *IBattClock;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  BattClockBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_BATTCLOCK_H */
