/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_KEYMAP_PROTOS_H
#define CLIB_KEYMAP_PROTOS_H

/*
**   $VER: keymap_protos.h $VER: keymap_lib.sfd 47.1 (30.11.2021) $VER: keymap_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <devices/inputevent.h>
#include <devices/keymap.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "keymap.library" */
VOID SetKeyMapDefault(struct KeyMap *keyMap);
struct KeyMap *AskKeyMapDefault(void);
WORD MapRawKey(CONST struct InputEvent *event, STRPTR buffer, WORD length, CONST struct KeyMap *keyMap);
LONG MapANSI(CONST_STRPTR string, LONG count, STRPTR buffer, LONG length, CONST struct KeyMap *keyMap);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_KEYMAP_PROTOS_H */
