#ifndef  CLIB_BATTCLOCK_PROTOS_H
#define  CLIB_BATTCLOCK_PROTOS_H

/*
**	$VER: battclock_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
VOID ResetBattClock( VOID );
ULONG ReadBattClock( VOID );
VOID WriteBattClock( ULONG time );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_BATTCLOCK_PROTOS_H */
