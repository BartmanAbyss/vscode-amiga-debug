/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_POTGO_PROTOS_H
#define CLIB_POTGO_PROTOS_H

/*
**   $VER: potgo_protos.h $VER: potgo_lib.sfd 47.1 (30.11.2021) $VER: potgo_lib.sfd 47.1 (30.11.2021)
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


/* "potgo.resource" */
UWORD AllocPotBits(UWORD bits);
VOID FreePotBits(UWORD bits);
VOID WritePotgo(UWORD word, UWORD mask);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_POTGO_PROTOS_H */
