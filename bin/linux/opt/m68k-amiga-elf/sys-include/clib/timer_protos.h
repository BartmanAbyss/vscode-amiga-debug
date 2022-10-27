#ifndef  CLIB_TIMER_PROTOS_H
#define  CLIB_TIMER_PROTOS_H

/*
**	$VER: timer_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  DEVICES_TIMER_H
#include <devices/timer.h>
#endif
VOID AddTime( struct timeval *dest, CONST struct timeval *src );
VOID SubTime( struct timeval *dest, CONST struct timeval *src );
LONG CmpTime( CONST struct timeval *dest, CONST struct timeval *src );
ULONG ReadEClock( struct EClockVal *dest );
VOID GetSysTime( struct timeval *dest );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_TIMER_PROTOS_H */
