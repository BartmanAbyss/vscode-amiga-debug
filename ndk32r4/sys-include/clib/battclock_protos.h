/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_BATTCLOCK_PROTOS_H
#define CLIB_BATTCLOCK_PROTOS_H

/*
**   $VER: battclock_protos.h $VER: battclock_lib.sfd 47.1 (30.11.2021) $VER: battclock_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "battclock.resource" */
VOID ResetBattClock(void);
ULONG ReadBattClock(void);
VOID WriteBattClock(ULONG time);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_BATTCLOCK_PROTOS_H */
