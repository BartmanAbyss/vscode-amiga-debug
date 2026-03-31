/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_DISK_PROTOS_H
#define CLIB_DISK_PROTOS_H

/*
**   $VER: disk_protos.h $VER: disk_lib.sfd 47.1 (30.11.2021) $VER: disk_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <resources/disk.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "disk.resource" */
BOOL AllocUnit(LONG unitNum);
VOID FreeUnit(LONG unitNum);
struct DiskResourceUnit *GetUnit(struct DiskResourceUnit *unitPointer);
VOID GiveUnit(void);
LONG GetUnitID(LONG unitNum);

/*--- functions in V37 or higher ---*/

/*------ new for V37 ------*/
LONG ReadUnitID(LONG unitNum);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_DISK_PROTOS_H */
