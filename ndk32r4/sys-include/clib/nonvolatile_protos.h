/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_NONVOLATILE_PROTOS_H
#define CLIB_NONVOLATILE_PROTOS_H

/*
**   $VER: nonvolatile_protos.h $VER: nonvolatile_lib.sfd 47.1 (30.11.2021) $VER: nonvolatile_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <exec/lists.h>
#include <libraries/nonvolatile.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "nonvolatile.library" */
APTR GetCopyNV(CONST_STRPTR appName, CONST_STRPTR itemName, BOOL killRequesters);
VOID FreeNVData(APTR data);
UWORD StoreNV(CONST_STRPTR appName, CONST_STRPTR itemName, CONST_APTR data, ULONG length, BOOL killRequesters);
BOOL DeleteNV(CONST_STRPTR appName, CONST_STRPTR itemName, BOOL killRequesters);
struct NVInfo *GetNVInfo(BOOL killRequesters);
struct MinList *GetNVList(CONST_STRPTR appName, BOOL killRequesters);
BOOL SetNVProtection(CONST_STRPTR appName, CONST_STRPTR itemName, LONG mask, BOOL killRequesters);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_NONVOLATILE_PROTOS_H */
