#ifndef  CLIB_EXEC_PROTOS_H
#define  CLIB_EXEC_PROTOS_H

/*
**	$VER: exec_protos.h 45.2 (6.6.1998)
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
#ifndef  EXEC_TASKS_H
#include <exec/tasks.h>
#endif
#ifndef  EXEC_MEMORY_H
#include <exec/memory.h>
#endif
#ifndef  EXEC_PORTS_H
#include <exec/ports.h>
#endif
#ifndef  EXEC_DEVICES_H
#include <exec/devices.h>
#endif
#ifndef  EXEC_IO_H
#include <exec/io.h>
#endif
#ifndef  EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif
#ifndef  EXEC_AVL_H
#include <exec/avl.h>
#endif
/*------ misc ---------------------------------------------------------*/
ULONG Supervisor( ULONG (*CONST userFunction)() );
/*------ special patchable hooks to internal exec activity ------------*/
/*------ module creation ----------------------------------------------*/
VOID InitCode( ULONG startClass, ULONG version );
VOID InitStruct( CONST APTR initTable, APTR memory, ULONG size );
struct Library *MakeLibrary( CONST APTR funcInit, CONST APTR structInit, ULONG (*CONST libInit)(), ULONG dataSize, ULONG segList );
VOID MakeFunctions( APTR target, CONST APTR functionArray, CONST APTR funcDispBase );
struct Resident *FindResident( CONST_STRPTR name );
APTR InitResident( CONST struct Resident *resident, ULONG segList );
/*------ diagnostics --------------------------------------------------*/
VOID Alert( ULONG alertNum );
VOID Debug( ULONG flags );
/*------ interrupts ---------------------------------------------------*/
VOID Disable( VOID );
VOID Enable( VOID );
VOID Forbid( VOID );
VOID Permit( VOID );
ULONG SetSR( ULONG newSR, ULONG mask );
APTR SuperState( VOID );
VOID UserState( APTR sysStack );
struct Interrupt *SetIntVector( LONG intNumber, CONST struct Interrupt *interrupt );
VOID AddIntServer( LONG intNumber, struct Interrupt *interrupt );
VOID RemIntServer( LONG intNumber, struct Interrupt *interrupt );
VOID Cause( struct Interrupt *interrupt );
/*------ memory allocation --------------------------------------------*/
APTR Allocate( struct MemHeader *freeList, ULONG byteSize );
VOID Deallocate( struct MemHeader *freeList, APTR memoryBlock, ULONG byteSize );
APTR AllocMem( ULONG byteSize, ULONG requirements );
APTR AllocAbs( ULONG byteSize, APTR location );
VOID FreeMem( APTR memoryBlock, ULONG byteSize );
ULONG AvailMem( ULONG requirements );
struct MemList *AllocEntry( struct MemList *entry );
VOID FreeEntry( struct MemList *entry );
/*------ lists --------------------------------------------------------*/
VOID Insert( struct List *list, struct Node *node, struct Node *pred );
VOID AddHead( struct List *list, struct Node *node );
VOID AddTail( struct List *list, struct Node *node );
VOID Remove( struct Node *node );
struct Node *RemHead( struct List *list );
struct Node *RemTail( struct List *list );
VOID Enqueue( struct List *list, struct Node *node );
struct Node *FindName( struct List *list, CONST_STRPTR name );
/*------ tasks --------------------------------------------------------*/
APTR AddTask( struct Task *task, CONST APTR initPC, CONST APTR finalPC );
VOID RemTask( struct Task *task );
struct Task *FindTask( CONST_STRPTR name );
BYTE SetTaskPri( struct Task *task, LONG priority );
ULONG SetSignal( ULONG newSignals, ULONG signalSet );
ULONG SetExcept( ULONG newSignals, ULONG signalSet );
ULONG Wait( ULONG signalSet );
VOID Signal( struct Task *task, ULONG signalSet );
BYTE AllocSignal( LONG signalNum );
VOID FreeSignal( LONG signalNum );
LONG AllocTrap( LONG trapNum );
VOID FreeTrap( LONG trapNum );
/*------ messages -----------------------------------------------------*/
VOID AddPort( struct MsgPort *port );
VOID RemPort( struct MsgPort *port );
VOID PutMsg( struct MsgPort *port, struct Message *message );
struct Message *GetMsg( struct MsgPort *port );
VOID ReplyMsg( struct Message *message );
struct Message *WaitPort( struct MsgPort *port );
struct MsgPort *FindPort( CONST_STRPTR name );
/*------ libraries ----------------------------------------------------*/
VOID AddLibrary( struct Library *library );
VOID RemLibrary( struct Library *library );
struct Library *OldOpenLibrary( CONST_STRPTR libName );
VOID CloseLibrary( struct Library *library );
APTR SetFunction( struct Library *library, LONG funcOffset, ULONG (*CONST newFunction)() );
VOID SumLibrary( struct Library *library );
/*------ devices ------------------------------------------------------*/
VOID AddDevice( struct Device *device );
VOID RemDevice( struct Device *device );
BYTE OpenDevice( CONST_STRPTR devName, ULONG unit, struct IORequest *ioRequest, ULONG flags );
VOID CloseDevice( struct IORequest *ioRequest );
BYTE DoIO( struct IORequest *ioRequest );
VOID SendIO( struct IORequest *ioRequest );
struct IORequest *CheckIO( struct IORequest *ioRequest );
BYTE WaitIO( struct IORequest *ioRequest );
VOID AbortIO( struct IORequest *ioRequest );
/*------ resources ----------------------------------------------------*/
VOID AddResource( APTR resource );
VOID RemResource( APTR resource );
APTR OpenResource( CONST_STRPTR resName );
/*------ private diagnostic support -----------------------------------*/
/*------ misc ---------------------------------------------------------*/
APTR RawDoFmt( CONST_STRPTR formatString, CONST APTR dataStream, VOID (*CONST putChProc)(), APTR putChData );
ULONG GetCC( VOID );
ULONG TypeOfMem( CONST APTR address );
ULONG Procure( struct SignalSemaphore *sigSem, struct SemaphoreMessage *bidMsg );
VOID Vacate( struct SignalSemaphore *sigSem, struct SemaphoreMessage *bidMsg );
struct Library *OpenLibrary( CONST_STRPTR libName, ULONG version );
/*--- functions in V33 or higher (Release 1.2) ---*/
/*------ signal semaphores (note funny registers)----------------------*/
VOID InitSemaphore( struct SignalSemaphore *sigSem );
VOID ObtainSemaphore( struct SignalSemaphore *sigSem );
VOID ReleaseSemaphore( struct SignalSemaphore *sigSem );
ULONG AttemptSemaphore( struct SignalSemaphore *sigSem );
VOID ObtainSemaphoreList( struct List *sigSem );
VOID ReleaseSemaphoreList( struct List *sigSem );
struct SignalSemaphore *FindSemaphore( STRPTR name );
VOID AddSemaphore( struct SignalSemaphore *sigSem );
VOID RemSemaphore( struct SignalSemaphore *sigSem );
/*------ kickmem support ----------------------------------------------*/
ULONG SumKickData( VOID );
/*------ more memory support ------------------------------------------*/
VOID AddMemList( ULONG size, ULONG attributes, LONG pri, APTR base, CONST_STRPTR name );
VOID CopyMem( CONST APTR source, APTR dest, ULONG size );
VOID CopyMemQuick( CONST APTR source, APTR dest, ULONG size );
/*------ cache --------------------------------------------------------*/
/*--- functions in V36 or higher (Release 2.0) ---*/
VOID CacheClearU( VOID );
VOID CacheClearE( APTR address, ULONG length, ULONG caches );
ULONG CacheControl( ULONG cacheBits, ULONG cacheMask );
/*------ misc ---------------------------------------------------------*/
APTR CreateIORequest( CONST struct MsgPort *port, ULONG size );
VOID DeleteIORequest( APTR iorequest );
struct MsgPort *CreateMsgPort( VOID );
VOID DeleteMsgPort( struct MsgPort *port );
VOID ObtainSemaphoreShared( struct SignalSemaphore *sigSem );
/*------ even more memory support -------------------------------------*/
APTR AllocVec( ULONG byteSize, ULONG requirements );
VOID FreeVec( APTR memoryBlock );
/*------ V39 Pool LVOs...*/
APTR CreatePool( ULONG requirements, ULONG puddleSize, ULONG threshSize );
VOID DeletePool( APTR poolHeader );
APTR AllocPooled( APTR poolHeader, ULONG memSize );
VOID FreePooled( APTR poolHeader, APTR memory, ULONG memSize );
/*------ misc ---------------------------------------------------------*/
ULONG AttemptSemaphoreShared( struct SignalSemaphore *sigSem );
VOID ColdReboot( VOID );
VOID StackSwap( struct StackSwapStruct *newStack );
/*------ future expansion ---------------------------------------------*/
APTR CachePreDMA( CONST APTR address, ULONG *length, ULONG flags );
VOID CachePostDMA( CONST APTR address, ULONG *length, ULONG flags );
/*------ New, for V39*/
/*--- functions in V39 or higher (Release 3) ---*/
/*------ Low memory handler functions*/
VOID AddMemHandler( struct Interrupt *memhand );
VOID RemMemHandler( struct Interrupt *memhand );
/*------ Function to attempt to obtain a Quick Interrupt Vector...*/
ULONG ObtainQuickVector( APTR interruptCode );
/*--- functions in V45 or higher ---*/
/*------ Finally the list functions are complete*/
VOID NewMinList( struct MinList *minlist );
/*------ New AVL tree support for V45. Yes, this is intentionally part of Exec!*/
struct AVLNode *AVL_AddNode( struct AVLNode **root, struct AVLNode *node, APTR func );
struct AVLNode *AVL_RemNodeByAddress( struct AVLNode **root, struct AVLNode *node );
struct AVLNode *AVL_RemNodeByKey( struct AVLNode **root, AVLKey key, APTR func );
struct AVLNode *AVL_FindNode( CONST struct AVLNode *root, AVLKey key, APTR func );
struct AVLNode *AVL_FindPrevNodeByAddress( CONST struct AVLNode *node );
struct AVLNode *AVL_FindPrevNodeByKey( CONST struct AVLNode *root, AVLKey key, APTR func );
struct AVLNode *AVL_FindNextNodeByAddress( CONST struct AVLNode *node );
struct AVLNode *AVL_FindNextNodeByKey( CONST struct AVLNode *root, AVLKey key, APTR func );
struct AVLNode *AVL_FindFirstNode( CONST struct AVLNode *root );
struct AVLNode *AVL_FindLastNode( CONST struct AVLNode *root );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_EXEC_PROTOS_H */
