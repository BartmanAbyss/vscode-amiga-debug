#ifndef  CLIB_REALTIME_PROTOS_H
#define  CLIB_REALTIME_PROTOS_H

/*
**	$VER: realtime_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  LIBRARIES_REALTIME_H
#include <libraries/realtime.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
/*--- functions in V37 or higher (Release 2.04) ---*/

/* Locks */

APTR LockRealTime( ULONG lockType );
VOID UnlockRealTime( APTR lock );

/* Conductor */

struct Player *CreatePlayerA( CONST struct TagItem *tagList );
struct Player *CreatePlayer( Tag tag1, ... );
VOID DeletePlayer( struct Player *player );
BOOL SetPlayerAttrsA( struct Player *player, CONST struct TagItem *tagList );
BOOL SetPlayerAttrs( struct Player *player, Tag tag1, ... );
LONG SetConductorState( struct Player *player, ULONG state, LONG time );
BOOL ExternalSync( struct Player *player, LONG minTime, LONG maxTime );
struct Conductor *NextConductor( CONST struct Conductor *previousConductor );
struct Conductor *FindConductor( CONST_STRPTR name );
ULONG GetPlayerAttrsA( CONST struct Player *player, CONST struct TagItem *tagList );
ULONG GetPlayerAttrs( CONST struct Player *player, Tag tag1, ... );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_REALTIME_PROTOS_H */
