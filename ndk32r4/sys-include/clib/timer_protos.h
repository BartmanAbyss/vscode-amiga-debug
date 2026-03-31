/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_TIMER_PROTOS_H
#define CLIB_TIMER_PROTOS_H

/*
**   $VER: timer_protos.h $VER: timer_lib.sfd 47.1 (30.11.2021) $VER: timer_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/devices.h>
#include <devices/timer.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "Timer.Device" */
VOID AddTime(TimeVal_Type *dest, CONST TimeVal_Type *src);
VOID SubTime(TimeVal_Type *dest, CONST TimeVal_Type *src);
LONG CmpTime(CONST TimeVal_Type *dest, CONST TimeVal_Type *src);
ULONG ReadEClock(struct EClockVal *dest);
VOID GetSysTime(TimeVal_Type *dest);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_TIMER_PROTOS_H */
