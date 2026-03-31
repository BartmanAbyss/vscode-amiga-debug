/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_CONSOLE_PROTOS_H
#define CLIB_CONSOLE_PROTOS_H

/*
**   $VER: console_protos.h $VER: console_lib.sfd 47.1 (30.11.2021) $VER: console_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/devices.h>
#include <devices/inputevent.h>
#include <devices/keymap.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "console.device" */
struct InputEvent *CDInputHandler(CONST struct InputEvent *events, struct Library *consoleDevice);
LONG RawKeyConvert(CONST struct InputEvent *events, STRPTR buffer, LONG length, CONST struct KeyMap *keyMap);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_CONSOLE_PROTOS_H */
