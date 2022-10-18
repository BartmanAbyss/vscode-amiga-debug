#ifndef  CLIB_DATEBROWSER_PROTOS_H
#define  CLIB_DATEBROWSER_PROTOS_H

/*
**	$VER: datebrowser_protos.h 1.1 (6.10.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif
Class *DATEBROWSER_GetClass( VOID );
UWORD JulianWeekDay( ULONG day, ULONG month, LONG year );
UWORD JulianMonthDays( ULONG month, LONG year );
BOOL JulianLeapYear( LONG year );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_DATEBROWSER_PROTOS_H */
