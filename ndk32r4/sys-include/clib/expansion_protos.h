/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_EXPANSION_PROTOS_H
#define CLIB_EXPANSION_PROTOS_H

/*
**   $VER: expansion_protos.h $VER: expansion_lib.sfd 47.1 (30.11.2021) $VER: expansion_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <libraries/expansionbase.h>
#include <dos/filehandler.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V33 or higher ---*/

/* "expansion.library" */
VOID AddConfigDev(struct ConfigDev *configDev);

/*--- functions in V36 or higher ---*/
BOOL AddBootNode(LONG bootPri, ULONG flags, struct DeviceNode *deviceNode, struct ConfigDev *configDev);

/*--- functions in V33 or higher ---*/
VOID AllocBoardMem(ULONG slotSpec);
struct ConfigDev *AllocConfigDev(void);
APTR AllocExpansionMem(ULONG numSlots, ULONG slotAlign);
VOID ConfigBoard(APTR board, struct ConfigDev *configDev);
VOID ConfigChain(APTR baseAddr);
struct ConfigDev *FindConfigDev(CONST struct ConfigDev *oldConfigDev, LONG manufacturer, LONG product);
VOID FreeBoardMem(ULONG startSlot, ULONG slotSpec);
VOID FreeConfigDev(struct ConfigDev *configDev);
VOID FreeExpansionMem(ULONG startSlot, ULONG numSlots);
UBYTE ReadExpansionByte(CONST_APTR board, ULONG offset);
VOID ReadExpansionRom(CONST_APTR board, struct ConfigDev *configDev);
VOID RemConfigDev(struct ConfigDev *configDev);
VOID WriteExpansionByte(APTR board, ULONG offset, UBYTE byte);
VOID ObtainConfigBinding(void);
VOID ReleaseConfigBinding(void);
VOID SetCurrentBinding(struct CurrentBinding *currentBinding, ULONG bindingSize);
ULONG GetCurrentBinding(CONST struct CurrentBinding *currentBinding, ULONG bindingSize);
struct DeviceNode *MakeDosNode(CONST_APTR parmPacket);
BOOL AddDosNode(LONG bootPri, ULONG flags, struct DeviceNode *deviceNode);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_EXPANSION_PROTOS_H */
