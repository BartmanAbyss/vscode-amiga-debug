/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_TRANSLATOR_PROTOS_H
#define CLIB_TRANSLATOR_PROTOS_H

/*
**   $VER: translator_protos.h $VER: translator_lib.sfd 47.1 (30.11.2021) $VER: translator_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/types.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "translator.library" */
LONG Translate(CONST_STRPTR inputString, LONG inputLength, STRPTR outputBuffer, LONG bufferSize);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_TRANSLATOR_PROTOS_H */
