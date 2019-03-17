#ifndef  CLIB_ALIB_PROTOS_H
#define  CLIB_ALIB_PROTOS_H

/*
**	$VER: alib_protos.h 40.1 (6.6.1998)
**	Includes Release 45.1
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
#ifndef  DEVICES_TIMER_H
#include <devices/timer.h>
#endif
#ifndef  DEVICES_KEYMAP_H
#include <devices/keymap.h>
#endif
#ifndef  LIBRARIES_COMMODITIES_H
#include <libraries/commodities.h>
#endif
#ifndef  UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif
#ifndef  INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif
#ifndef  INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif
#ifndef  GRAPHICS_GRAPHINT_H
#include <graphics/graphint.h>
#endif
#ifndef  REXX_STORAGE_H
#include <rexx/storage.h>
#endif

/*  Exec support functions */

VOID BeginIO( struct IORequest *ioReq );
struct IORequest *CreateExtIO( CONST struct MsgPort *port, LONG ioSize );
struct MsgPort *CreatePort( CONST_STRPTR name, LONG pri );
struct IOStdReq *CreateStdIO( CONST struct MsgPort *port );
struct Task *CreateTask( CONST_STRPTR name, LONG pri, CONST APTR initPC, ULONG stackSize );
VOID DeleteExtIO( struct IORequest *ioReq );
VOID DeletePort( struct MsgPort *ioReq );
VOID DeleteStdIO( struct IOStdReq *ioReq );
VOID DeleteTask( struct Task *task );
VOID NewList( struct List *list );
APTR LibAllocPooled( APTR poolHeader, ULONG memSize );
APTR LibCreatePool( ULONG memFlags, ULONG puddleSize, ULONG threshSize );
VOID LibDeletePool( APTR poolHeader );
VOID LibFreePooled( APTR poolHeader, APTR memory, ULONG memSize );

/* Assorted functions in amiga.lib */

ULONG FastRand( ULONG seed );
UWORD RangeRand( ULONG maxValue );

/* Graphics support functions in amiga.lib */

VOID AddTOF( struct Isrvstr *i, LONG (*p)(APTR args), APTR a );
VOID RemTOF( struct Isrvstr *i );
VOID waitbeam( LONG b );

/* math support functions in amiga.lib */

FLOAT afp( CONST_STRPTR string );
VOID arnd( LONG place, LONG exp, STRPTR string );
FLOAT dbf( ULONG exp, ULONG mant );
LONG fpa( FLOAT fnum, BYTE *string );
VOID fpbcd( FLOAT fnum, BYTE *string );

/* Timer support functions in amiga.lib (V36 and higher only) */

LONG TimeDelay( LONG unit, ULONG secs, ULONG microsecs );
LONG DoTimer( struct timeval *, LONG unit, LONG command );

/*  Commodities functions in amiga.lib (V36 and higher only) */

VOID ArgArrayDone( VOID );
STRPTR *ArgArrayInit( LONG argc, CONST_STRPTR *argv );
LONG ArgInt( CONST_STRPTR *tt, CONST_STRPTR entry, LONG defaultval );
STRPTR ArgString( CONST_STRPTR *tt, CONST_STRPTR entry, CONST_STRPTR defaultstring );
CxObj *HotKey( CONST_STRPTR description, struct MsgPort *port, LONG id );
struct InputEvent *InvertString( CONST_STRPTR str, CONST struct KeyMap *km );
VOID FreeIEvents( struct InputEvent *events );

/* Commodities Macros */

/* CxObj *CxCustom(LONG(*)(),LONG id)(A0,D0) */
/* CxObj *CxDebug(LONG id)(D0) */
/* CxObj *CxFilter(STRPTR description)(A0) */
/* CxObj *CxSender(struct MsgPort *port,LONG id)(A0,D0) */
/* CxObj *CxSignal(struct Task *task,LONG signal)(A0,D0) */
/* CxObj *CxTranslate(struct InputEvent *ie)(A0) */

/*  ARexx support functions in amiga.lib */

BOOL CheckRexxMsg( CONST struct RexxMsg *rexxmsg );
LONG GetRexxVar( CONST struct RexxMsg *rexxmsg, CONST_STRPTR name, STRPTR *result );
LONG SetRexxVar( struct RexxMsg *rexxmsg, CONST_STRPTR name, CONST_STRPTR value, LONG length );

/*  Intuition hook and boopsi support functions in amiga.lib. */
/*  These functions do not require any particular ROM revision */
/*  to operate correctly, though they deal with concepts first introduced */
/*  in V36.  These functions would work with compatibly-implemented */
/*  hooks or objects under V34. */

ULONG CallHookA( struct Hook *hookPtr, Object *obj, APTR message );
ULONG CallHook( struct Hook *hookPtr, Object *obj, ... );
ULONG DoMethodA( Object *obj, Msg message );
ULONG DoMethod( Object *obj, ULONG methodID, ... );
ULONG DoSuperMethodA( struct IClass *cl, Object *obj, Msg message );
ULONG DoSuperMethod( struct IClass *cl, Object *obj, ULONG methodID, ... );
ULONG CoerceMethodA( struct IClass *cl, Object *obj, Msg message );
ULONG CoerceMethod( struct IClass *cl, Object *obj, ULONG methodID, ... );
ULONG HookEntry( struct Hook *hookPtr, Object *obj, APTR message );
ULONG SetSuperAttrs( struct IClass *cl, Object *obj, ULONG tag1, ... );

/*  Network-support functions in amiga.lib. */
/*  ACrypt() first appeared in later V39 versions of amiga.lib, but */
/*  operates correctly under V37 and up. */

STRPTR ACrypt( STRPTR buffer, CONST_STRPTR password, CONST_STRPTR username );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_ALIB_PROTOS_H */
