/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_TIMER_H
#define PROTO_TIMER_H

#include <clib/timer_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/timer.h>
#  else
#   include <inline/timer.h>
#  endif
# else
#  include <pragmas/timer_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/timer.h>
# ifndef __NOGLOBALIFACE__
   extern struct TimerIFace *ITimer;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Device *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  TimerBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_TIMER_H */
