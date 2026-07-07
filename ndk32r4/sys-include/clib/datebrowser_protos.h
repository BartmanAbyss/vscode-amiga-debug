/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_DATEBROWSER_PROTOS_H
#define CLIB_DATEBROWSER_PROTOS_H

/*
**   $VER: datebrowser_protos.h $VER: datebrowser_lib.sfd 47.1 (30.11.2021) $VER: datebrowser_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <intuition/intuition.h>
#include <intuition/classes.h>
#include <gadgets/datebrowser.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "datebrowser.gadget" */
Class *DATEBROWSER_GetClass(void);
UWORD JulianWeekDay(ULONG day, ULONG month, LONG year);
UWORD JulianMonthDays(ULONG month, LONG year);
BOOL JulianLeapYear(LONG year);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_DATEBROWSER_PROTOS_H */
