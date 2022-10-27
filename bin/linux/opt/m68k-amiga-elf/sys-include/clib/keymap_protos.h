#ifndef  CLIB_KEYMAP_PROTOS_H
#define  CLIB_KEYMAP_PROTOS_H

/*
**	$VER: keymap_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  DEVICES_INPUTEVENT_H
#include <devices/inputevent.h>
#endif
#ifndef  DEVICES_KEYMAP_H
#include <devices/keymap.h>
#endif
/*--- functions in V36 or higher (Release 2.0) ---*/
VOID SetKeyMapDefault( CONST struct KeyMap *keyMap );
struct KeyMap *AskKeyMapDefault( VOID );
WORD MapRawKey( CONST struct InputEvent *event, STRPTR buffer, LONG length, CONST struct KeyMap *keyMap );
LONG MapANSI( CONST_STRPTR string, LONG count, STRPTR buffer, LONG length, CONST struct KeyMap *keyMap );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_KEYMAP_PROTOS_H */
