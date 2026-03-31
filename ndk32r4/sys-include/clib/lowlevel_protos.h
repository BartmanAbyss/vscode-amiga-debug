/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_LOWLEVEL_PROTOS_H
#define CLIB_LOWLEVEL_PROTOS_H

/*
**   $VER: lowlevel_protos.h $VER: lowlevel_lib.sfd 47.1 (30.11.2021) $VER: lowlevel_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <exec/interrupts.h>
#include <utility/tagitem.h>
#include <devices/timer.h>
#include <libraries/lowlevel.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "lowlevel.library" */
/*
 CONTROLLER HANDLING
*/

ULONG ReadJoyPort(ULONG port);

/* LANGUAGE HANDLING */

UBYTE GetLanguageSelection(void);

/* KEYBOARD HANDLING */

ULONG GetKey(void);
VOID QueryKeys(struct KeyQuery *queryArray, LONG arraySize);
APTR AddKBInt(APTR intRoutine, APTR intData);
VOID RemKBInt(APTR intHandle);

/* SYSTEM HANDLING */

ULONG SystemControlA(CONST struct TagItem *tagList);
ULONG SystemControl(Tag firstTag, ...);

/* TIMER HANDLING */

APTR AddTimerInt(APTR intRoutine, APTR intData);
VOID RemTimerInt(APTR intHandle);
VOID StopTimerInt(APTR intHandle);
VOID StartTimerInt(APTR intHandle, ULONG timeInterval, BOOL continuous);
ULONG ElapsedTime(struct EClockVal *context);

/* VBLANK HANDLING */

APTR AddVBlankInt(APTR intRoutine, APTR intData);
VOID RemVBlankInt(APTR intHandle);

/* MORE CONTROLLER HANDLING */

BOOL SetJoyPortAttrsA(ULONG portNumber, CONST struct TagItem *tagList);
BOOL SetJoyPortAttrs(ULONG portNumber, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_LOWLEVEL_PROTOS_H */
