/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_TEXTEDITOR_PROTOS_H
#define CLIB_TEXTEDITOR_PROTOS_H

/*
**   $VER: texteditor_protos.h $VER: texteditor_lib.sfd 47.1 (30.11.2021) $VER: texteditor_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <intuition/intuition.h>
#include <intuition/classes.h>
#include <gadgets/texteditor.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "texteditor.gadget" */
/* NOTE: The library base name is "TextFieldBase" and not "TextEditorBase". */
Class *TEXTEDITOR_GetClass(void);

/*--- functions in V47 or higher ---*/
VOID HighlightSetFormat(APTR object, ULONG pos, ULONG end, UWORD style);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_TEXTEDITOR_PROTOS_H */
