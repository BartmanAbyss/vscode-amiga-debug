/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_REALTIME_PROTOS_H
#define CLIB_REALTIME_PROTOS_H

/*
**   $VER: realtime_protos.h $VER: realtime_lib.sfd 47.1 (30.11.2021) $VER: realtime_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <libraries/realtime.h>
#include <utility/tagitem.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V37 or higher ---*/

/* "realtime.library" */
/*
 Locks
*/

APTR LockRealTime(ULONG lockType);
VOID UnlockRealTime(APTR lock);

/* Conductor */

struct Player *CreatePlayerA(CONST struct TagItem *tagList);
struct Player *CreatePlayer(Tag tag1, ...);
VOID DeletePlayer(struct Player *player);
BOOL SetPlayerAttrsA(struct Player *player, CONST struct TagItem *tagList);
BOOL SetPlayerAttrs(struct Player *player, Tag _tag1, ...);
LONG SetConductorState(struct Player *player, ULONG state, LONG time);
BOOL ExternalSync(struct Player *player, LONG minTime, LONG maxTime);
struct Conductor *NextConductor(CONST struct Conductor *previousConductor);
struct Conductor *FindConductor(CONST_STRPTR name);
ULONG GetPlayerAttrsA(struct Player *player, CONST struct TagItem *tagList);
ULONG GetPlayerAttrs(struct Player *player, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_REALTIME_PROTOS_H */
