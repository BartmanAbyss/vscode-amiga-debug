/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_BATTMEM_PROTOS_H
#define CLIB_BATTMEM_PROTOS_H

/*
**   $VER: battmem_protos.h $VER: battmem_lib.sfd 47.1 (30.11.2021) $VER: battmem_lib.sfd 47.1 (30.11.2021)
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


/* "battmem.resource" */
VOID ObtainBattSemaphore(void);
VOID ReleaseBattSemaphore(void);
ULONG ReadBattMem(APTR buffer, ULONG offset, ULONG length);
ULONG WriteBattMem(CONST_APTR buffer, ULONG offset, ULONG length);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_BATTMEM_PROTOS_H */
