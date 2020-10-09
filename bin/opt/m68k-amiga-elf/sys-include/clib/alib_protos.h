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

__stdargs VOID BeginIO( struct IORequest *ioReq );
__stdargs struct IORequest *CreateExtIO( CONST struct MsgPort *port, LONG ioSize );
__stdargs struct MsgPort *CreatePort( CONST_STRPTR name, LONG pri );
__stdargs struct IOStdReq *CreateStdIO( CONST struct MsgPort *port );
__stdargs struct Task *CreateTask( CONST_STRPTR name, LONG pri, CONST APTR initPC, ULONG stackSize );
__stdargs VOID DeleteExtIO( struct IORequest *ioReq );
__stdargs VOID DeletePort( struct MsgPort *ioReq );
__stdargs VOID DeleteStdIO( struct IOStdReq *ioReq );
__stdargs VOID DeleteTask( struct Task *task );
__stdargs VOID NewList( struct List *list );
__stdargs APTR LibAllocPooled( APTR poolHeader, ULONG memSize );
__stdargs APTR LibCreatePool( ULONG memFlags, ULONG puddleSize, ULONG threshSize );
__stdargs VOID LibDeletePool( APTR poolHeader );
__stdargs VOID LibFreePooled( APTR poolHeader, APTR memory, ULONG memSize );

/* Assorted functions in amiga.lib */

__stdargs ULONG FastRand( ULONG seed );
__stdargs UWORD RangeRand( ULONG maxValue );

/* Graphics support functions in amiga.lib */

__stdargs VOID AddTOF( struct Isrvstr *i, LONG (*p)(APTR args), APTR a );
__stdargs VOID RemTOF( struct Isrvstr *i );
__stdargs VOID waitbeam( LONG b );

/* math support functions in amiga.lib */

__stdargs FLOAT afp( CONST_STRPTR string );
__stdargs VOID arnd( LONG place, LONG exp, STRPTR string );
__stdargs FLOAT dbf( ULONG exp, ULONG mant );
__stdargs LONG fpa( FLOAT fnum, BYTE *string );
__stdargs VOID fpbcd( FLOAT fnum, BYTE *string );

/* Timer support functions in amiga.lib (V36 and higher only) */

__stdargs LONG TimeDelay( LONG unit, ULONG secs, ULONG microsecs );
__stdargs LONG DoTimer( struct timeval *, LONG unit, LONG command );

/*  Commodities functions in amiga.lib (V36 and higher only) */

__stdargs VOID ArgArrayDone( VOID );
__stdargs STRPTR *ArgArrayInit( LONG argc, CONST_STRPTR *argv );
__stdargs LONG ArgInt( CONST_STRPTR *tt, CONST_STRPTR entry, LONG defaultval );
__stdargs STRPTR ArgString( CONST_STRPTR *tt, CONST_STRPTR entry, CONST_STRPTR defaultstring );
__stdargs CxObj *HotKey( CONST_STRPTR description, struct MsgPort *port, LONG id );
__stdargs struct InputEvent *InvertString( CONST_STRPTR str, CONST struct KeyMap *km );
__stdargs VOID FreeIEvents( struct InputEvent *events );

/* Commodities Macros */

/* CxObj *CxCustom(LONG(*)(),LONG id)(A0,D0) */
/* CxObj *CxDebug(LONG id)(D0) */
/* CxObj *CxFilter(STRPTR description)(A0) */
/* CxObj *CxSender(struct MsgPort *port,LONG id)(A0,D0) */
/* CxObj *CxSignal(struct Task *task,LONG signal)(A0,D0) */
/* CxObj *CxTranslate(struct InputEvent *ie)(A0) */

/*  ARexx support functions in amiga.lib */

__stdargs BOOL CheckRexxMsg( CONST struct RexxMsg *rexxmsg );
__stdargs LONG GetRexxVar( CONST struct RexxMsg *rexxmsg, CONST_STRPTR name, STRPTR *result );
__stdargs LONG SetRexxVar( struct RexxMsg *rexxmsg, CONST_STRPTR name, CONST_STRPTR value, LONG length );

/*  Intuition hook and boopsi support functions in amiga.lib. */
/*  These functions do not require any particular ROM revision */
/*  to operate correctly, though they deal with concepts first introduced */
/*  in V36.  These functions would work with compatibly-implemented */
/*  hooks or objects under V34. */

__stdargs ULONG CallHookA( struct Hook *hookPtr, Object *obj, APTR message );
__stdargs ULONG CallHook( struct Hook *hookPtr, Object *obj, ... );
__stdargs ULONG DoMethodA( Object *obj, Msg message );
__stdargs ULONG DoMethod( Object *obj, ULONG methodID, ... );
__stdargs ULONG DoSuperMethodA( struct IClass *cl, Object *obj, Msg message );
__stdargs ULONG DoSuperMethod( struct IClass *cl, Object *obj, ULONG methodID, ... );
__stdargs ULONG CoerceMethodA( struct IClass *cl, Object *obj, Msg message );
__stdargs ULONG CoerceMethod( struct IClass *cl, Object *obj, ULONG methodID, ... );
__stdargs ULONG HookEntry( struct Hook *hookPtr, Object *obj, APTR message );
__stdargs ULONG SetSuperAttrs( struct IClass *cl, Object *obj, ULONG tag1, ... );

/*  Network-support functions in amiga.lib. */
/*  ACrypt() first appeared in later V39 versions of amiga.lib, but */
/*  operates correctly under V37 and up. */

__stdargs STRPTR ACrypt( STRPTR buffer, CONST_STRPTR password, CONST_STRPTR username );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_ALIB_PROTOS_H */
