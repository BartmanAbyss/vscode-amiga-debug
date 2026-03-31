/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_EXEC_PROTOS_H
#define CLIB_EXEC_PROTOS_H

/*
**   $VER: exec_protos.h $VER: exec_lib.sfd 47.5 (30.11.2021) $VER: exec_lib.sfd 47.5 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/execbase.h>
#include <exec/tasks.h>
#include <exec/memory.h>
#include <exec/ports.h>
#include <exec/devices.h>
#include <exec/io.h>
#include <exec/semaphores.h>
#include <exec/resident.h>
#include <exec/interrupts.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "exec.library" */
/*------ misc ---------------------------------------------------------*/
ULONG Supervisor(ULONG (*userFunction)());

/*------ module creation ----------------------------------------------*/
VOID InitCode(ULONG startClass, ULONG version);
VOID InitStruct(CONST_APTR initTable, APTR memory, ULONG size);
struct Library *MakeLibrary(CONST_APTR funcInit, CONST_APTR structInit, ULONG (*libInit)(), ULONG dataSize, ULONG segList);
VOID MakeFunctions(APTR target, CONST_APTR functionArray, ULONG funcDispBase);
struct Resident *FindResident(CONST_STRPTR name);
APTR InitResident(CONST struct Resident *resident, ULONG segList);

/*------ diagnostics --------------------------------------------------*/
VOID Alert(ULONG alertNum);
VOID Debug(ULONG flags);

/*------ interrupts ---------------------------------------------------*/
VOID Disable(void);
VOID Enable(void);
VOID Forbid(void);
VOID Permit(void);
ULONG SetSR(ULONG newSR, ULONG mask);
APTR SuperState(void);
VOID UserState(APTR sysStack);
struct Interrupt *SetIntVector(LONG intNumber, struct Interrupt *interrupt);
VOID AddIntServer(LONG intNumber, struct Interrupt *interrupt);
VOID RemIntServer(LONG intNumber, struct Interrupt *interrupt);
VOID Cause(CONST struct Interrupt *interrupt);

/*------ memory allocation --------------------------------------------*/
APTR Allocate(struct MemHeader *freeList, ULONG byteSize);
VOID Deallocate(struct MemHeader *freeList, APTR memoryBlock, ULONG byteSize);
APTR AllocMem(ULONG byteSize, ULONG requirements);
APTR AllocAbs(ULONG byteSize, APTR location);
VOID FreeMem(APTR memoryBlock, ULONG byteSize);
ULONG AvailMem(ULONG requirements);
struct MemList *AllocEntry(CONST struct MemList *entry);
VOID FreeEntry(struct MemList *entry);

/*------ lists --------------------------------------------------------*/
VOID Insert(struct List *list, struct Node *node, struct Node *pred);
VOID InsertMinNode(struct MinList *minlist, struct MinNode *minnode, struct MinNode *minpred);
VOID AddHead(struct List *list, struct Node *node);
VOID AddHeadMinList(struct MinList *minlist, struct MinNode *minnode);
VOID AddTail(struct List *list, struct Node *node);
VOID AddTailMinList(struct MinList *minlist, struct MinNode *minnode);
VOID Remove(struct Node *node);
VOID RemoveMinNode(struct MinNode *minnode);
struct Node *RemHead(struct List *list);
struct MinNode * RemHeadMinList(struct MinList *minlist);
struct Node *RemTail(struct List *list);
struct MinNode * RemTailMinList(struct MinList *minlist);
VOID Enqueue(struct List *list, struct Node *node);
struct Node *FindName(struct List *list, CONST_STRPTR name);

/*------ tasks --------------------------------------------------------*/
APTR AddTask(struct Task *task, APTR initPC, APTR finalPC);
VOID RemTask(struct Task *task);
struct Task *FindTask(CONST_STRPTR name);
BYTE SetTaskPri(struct Task *task, LONG priority);
ULONG SetSignal(ULONG newSignals, ULONG signalSet);
ULONG SetExcept(ULONG newSignals, ULONG signalSet);
ULONG Wait(ULONG signalSet);
VOID Signal(struct Task *task, ULONG signalSet);
BYTE AllocSignal(BYTE signalNum);
VOID FreeSignal(BYTE signalNum);
LONG AllocTrap(LONG trapNum);
VOID FreeTrap(LONG trapNum);

/*------ messages -----------------------------------------------------*/
VOID AddPort(struct MsgPort *port);
VOID RemPort(struct MsgPort *port);
VOID PutMsg(struct MsgPort *port, struct Message *message);
struct Message *GetMsg(struct MsgPort *port);
VOID ReplyMsg(struct Message *message);
struct Message *WaitPort(struct MsgPort *port);
struct MsgPort *FindPort(CONST_STRPTR name);

/*------ libraries ----------------------------------------------------*/
VOID AddLibrary(struct Library *library);
VOID RemLibrary(struct Library *library);
struct Library *OldOpenLibrary(CONST_STRPTR libName);
VOID CloseLibrary(struct Library *library);
APTR SetFunction(struct Library *library, LONG funcOffset, ULONG (*newFunction)());
VOID SumLibrary(struct Library *library);

/*------ devices ------------------------------------------------------*/
VOID AddDevice(struct Device *device);
VOID RemDevice(struct Device *device);
BYTE OpenDevice(CONST_STRPTR devName, ULONG unit, struct IORequest *ioRequest, ULONG flags);
VOID CloseDevice(struct IORequest *ioRequest);
BYTE DoIO(struct IORequest *ioRequest);
VOID SendIO(struct IORequest *ioRequest);
struct IORequest *CheckIO(CONST struct IORequest *ioRequest);
BYTE WaitIO(struct IORequest *ioRequest);
VOID AbortIO(struct IORequest *ioRequest);

/*------ resources ----------------------------------------------------*/
VOID AddResource(APTR resource);
VOID RemResource(APTR resource);
APTR OpenResource(CONST_STRPTR resName);

/*------ misc ---------------------------------------------------------*/
APTR RawDoFmt(CONST_STRPTR formatString, APTR dataStream, VOID (*putChProc)(), APTR putChData);
ULONG GetCC(void);
ULONG TypeOfMem(CONST_APTR address);
ULONG Procure(struct SignalSemaphore *sigSem, struct SemaphoreMessage *bidMsg);
VOID Vacate(struct SignalSemaphore *sigSem, struct SemaphoreMessage *bidMsg);
struct Library *OpenLibrary(CONST_STRPTR libName, ULONG version);

/*--- functions in V33 or higher ---*/

/*------ signal semaphores (note funny registers)----------------------*/
VOID InitSemaphore(struct SignalSemaphore *sigSem);
VOID ObtainSemaphore(struct SignalSemaphore *sigSem);
VOID ReleaseSemaphore(struct SignalSemaphore *sigSem);
ULONG AttemptSemaphore(struct SignalSemaphore *sigSem);
VOID ObtainSemaphoreList(struct List *sigSem);
VOID ReleaseSemaphoreList(struct List *sigSem);
struct SignalSemaphore *FindSemaphore(CONST_STRPTR name);
VOID AddSemaphore(struct SignalSemaphore *sigSem);
VOID RemSemaphore(struct SignalSemaphore *sigSem);

/*------ kickmem support ----------------------------------------------*/
ULONG SumKickData(void);

/*------ more memory support ------------------------------------------*/
VOID AddMemList(ULONG size, ULONG attributes, LONG pri, APTR base, STRPTR name);
VOID CopyMem(CONST_APTR source, APTR dest, ULONG size);
VOID CopyMemQuick(CONST_APTR source, APTR dest, ULONG size);

/*--- functions in V36 or higher ---*/

/*------ cache --------------------------------------------------------*/
VOID CacheClearU(void);
VOID CacheClearE(APTR address, ULONG length, ULONG caches);
ULONG CacheControl(ULONG cacheBits, ULONG cacheMask);

/*------ misc ---------------------------------------------------------*/
APTR CreateIORequest(struct MsgPort *port, ULONG size);
VOID DeleteIORequest(APTR iorequest);
struct MsgPort *CreateMsgPort(void);
VOID DeleteMsgPort(struct MsgPort *port);
VOID ObtainSemaphoreShared(struct SignalSemaphore *sigSem);

/*------ even more memory support -------------------------------------*/
APTR AllocVec(ULONG byteSize, ULONG requirements);
VOID FreeVec(APTR memoryBlock);

/*------ V39 Pool LVOs...*/
APTR CreatePool(ULONG requirements, ULONG puddleSize, ULONG threshSize);
VOID DeletePool(APTR poolHeader);
APTR AllocPooled(APTR poolHeader, ULONG memSize);
VOID FreePooled(APTR poolHeader, APTR memory, ULONG memSize);

/*------ misc ---------------------------------------------------------*/
ULONG AttemptSemaphoreShared(struct SignalSemaphore *sigSem);
VOID ColdReboot(void);
VOID StackSwap(struct StackSwapStruct *newStack);

/*------ future expansion ---------------------------------------------*/
APTR CachePreDMA(CONST_APTR address, ULONG *length, ULONG flags);
VOID CachePostDMA(CONST_APTR address, ULONG *length, ULONG flags);

/*--- functions in V39 or higher ---*/

/*------ New, for V39*/
/*------ Low memory handler functions*/
VOID AddMemHandler(struct Interrupt *memhand);
VOID RemMemHandler(struct Interrupt *memhand);

/*------ Function to attempt to obtain a Quick Interrupt Vector...*/
ULONG ObtainQuickVector(APTR interruptCode);

/*--- functions in V45 or higher ---*/

/*------ Finally the list functions are complete*/
VOID NewMinList(struct MinList *minlist);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_EXEC_PROTOS_H */
