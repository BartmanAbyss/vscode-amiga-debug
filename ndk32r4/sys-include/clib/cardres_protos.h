/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_CARD_PROTOS_H
#define CLIB_CARD_PROTOS_H

/*
**   $VER: card_protos.h $VER: cardres_lib.sfd 47.1 (30.11.2021) $VER: cardres_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <exec/resident.h>
#include <resources/card.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "card.resource" */
struct CardHandle *OwnCard(struct CardHandle *handle);
VOID ReleaseCard(struct CardHandle *handle, ULONG flags);
struct CardMemoryMap *GetCardMap(void);
BOOL BeginCardAccess(struct CardHandle *handle);
BOOL EndCardAccess(struct CardHandle *handle);
UBYTE ReadCardStatus(void);
BOOL CardResetRemove(struct CardHandle *handle, ULONG flag);
UBYTE CardMiscControl(struct CardHandle *handle, UBYTE control_bits);
ULONG CardAccessSpeed(struct CardHandle *handle, ULONG nanoseconds);
LONG CardProgramVoltage(struct CardHandle *handle, ULONG voltage);
BOOL CardResetCard(struct CardHandle *handle);
BOOL CopyTuple(struct CardHandle *handle, UBYTE *buffer, ULONG tuplecode, ULONG size);
ULONG DeviceTuple(CONST UBYTE *tuple_data, struct DeviceTData *storage);
struct Resident *IfAmigaXIP(struct CardHandle *handle);
BOOL CardForceChange(void);
ULONG CardChangeCount(void);
ULONG CardInterface(void);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_CARD_PROTOS_H */
