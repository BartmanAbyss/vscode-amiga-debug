/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_MISC_PROTOS_H
#define CLIB_MISC_PROTOS_H

/*
**   $VER: misc_protos.h $VER: misc_lib.sfd 47.1 (30.11.2021) $VER: misc_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

UBYTE *AllocMiscResource(ULONG unitNum, CONST_STRPTR name);
VOID FreeMiscResource(ULONG unitNum);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_MISC_PROTOS_H */
