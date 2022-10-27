#ifndef  CLIB_CONSOLE_PROTOS_H
#define  CLIB_CONSOLE_PROTOS_H

/*
**	$VER: console_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif
#ifndef  DEVICES_INPUTEVENT_H
#include <devices/inputevent.h>
#endif
#ifndef  DEVICES_KEYMAP_H
#include <devices/keymap.h>
#endif
struct InputEvent *CDInputHandler( CONST struct InputEvent *events, struct Library *consoleDevice );
LONG RawKeyConvert( CONST struct InputEvent *events, STRPTR buffer, LONG length, CONST struct KeyMap *keyMap );
/*--- functions in V36 or higher (Release 2.0) ---*/

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_CONSOLE_PROTOS_H */
