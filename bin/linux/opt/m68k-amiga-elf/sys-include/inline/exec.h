/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_EXEC_H
#define _INLINE_EXEC_H

#ifndef _SFDC_VARARG_DEFINED
#define _SFDC_VARARG_DEFINED
#ifdef __HAVE_IPTR_ATTR__
typedef APTR _sfdc_vararg __attribute__((iptr));
#else
typedef ULONG _sfdc_vararg;
#endif /* __HAVE_IPTR_ATTR__ */
#endif /* _SFDC_VARARG_DEFINED */

#ifndef __INLINE_MACROS_H
#include <inline/macros.h>
#endif /* !__INLINE_MACROS_H */

#ifndef EXEC_BASE_NAME
#define EXEC_BASE_NAME SysBase
#endif /* !EXEC_BASE_NAME */

#define Supervisor(___userFunction) \
      LP1A5FP(0x1e, ULONG, Supervisor , __fpt, ___userFunction, d7,\
      , EXEC_BASE_NAME, ULONG (*__fpt)())

#define InitCode(___startClass, ___version) \
      LP2NR(0x48, InitCode , ULONG, ___startClass, d0, ULONG, ___version, d1,\
      , EXEC_BASE_NAME)

#define InitStruct(___initTable, ___memory, ___size) \
      LP3NR(0x4e, InitStruct , const APTR, ___initTable, a1, APTR, ___memory, a2, ULONG, ___size, d0,\
      , EXEC_BASE_NAME)

#define MakeLibrary(___funcInit, ___structInit, ___libInit, ___dataSize, ___segList) \
      LP5FP(0x54, struct Library *, MakeLibrary , const APTR, ___funcInit, a0, const APTR, ___structInit, a1, __fpt, ___libInit, a2, ULONG, ___dataSize, d0, ULONG, ___segList, d1,\
      , EXEC_BASE_NAME, ULONG (*__fpt)())

#define MakeFunctions(___target, ___functionArray, ___funcDispBase) \
      LP3NR(0x5a, MakeFunctions , APTR, ___target, a0, const APTR, ___functionArray, a1, const APTR, ___funcDispBase, a2,\
      , EXEC_BASE_NAME)

#define FindResident(___name) \
      LP1(0x60, struct Resident *, FindResident , CONST_STRPTR, ___name, a1,\
      , EXEC_BASE_NAME)

#define InitResident(___resident, ___segList) \
      LP2(0x66, APTR, InitResident , const struct Resident *, ___resident, a1, ULONG, ___segList, d1,\
      , EXEC_BASE_NAME)

#define Alert(___alertNum) \
      LP1NR(0x6c, Alert , ULONG, ___alertNum, d7,\
      , EXEC_BASE_NAME)

#define Debug(___flags) \
      LP1NR(0x72, Debug , ULONG, ___flags, d0,\
      , EXEC_BASE_NAME)

#define Disable() \
      LP0NR(0x78, Disable ,\
      , EXEC_BASE_NAME)

#define Enable() \
      LP0NR(0x7e, Enable ,\
      , EXEC_BASE_NAME)

#define Forbid() \
      LP0NR(0x84, Forbid ,\
      , EXEC_BASE_NAME)

#define Permit() \
      LP0NR(0x8a, Permit ,\
      , EXEC_BASE_NAME)

#define SetSR(___newSR, ___mask) \
      LP2(0x90, ULONG, SetSR , ULONG, ___newSR, d0, ULONG, ___mask, d1,\
      , EXEC_BASE_NAME)

#define SuperState() \
      LP0(0x96, APTR, SuperState ,\
      , EXEC_BASE_NAME)

#define UserState(___sysStack) \
      LP1NR(0x9c, UserState , APTR, ___sysStack, d0,\
      , EXEC_BASE_NAME)

#define SetIntVector(___intNumber, ___interrupt) \
      LP2(0xa2, struct Interrupt *, SetIntVector , LONG, ___intNumber, d0, const struct Interrupt *, ___interrupt, a1,\
      , EXEC_BASE_NAME)

#define AddIntServer(___intNumber, ___interrupt) \
      LP2NR(0xa8, AddIntServer , LONG, ___intNumber, d0, struct Interrupt *, ___interrupt, a1,\
      , EXEC_BASE_NAME)

#define RemIntServer(___intNumber, ___interrupt) \
      LP2NR(0xae, RemIntServer , LONG, ___intNumber, d0, struct Interrupt *, ___interrupt, a1,\
      , EXEC_BASE_NAME)

#define Cause(___interrupt) \
      LP1NR(0xb4, Cause , struct Interrupt *, ___interrupt, a1,\
      , EXEC_BASE_NAME)

#define Allocate(___freeList, ___byteSize) \
      LP2(0xba, APTR, Allocate , struct MemHeader *, ___freeList, a0, ULONG, ___byteSize, d0,\
      , EXEC_BASE_NAME)

#define Deallocate(___freeList, ___memoryBlock, ___byteSize) \
      LP3NR(0xc0, Deallocate , struct MemHeader *, ___freeList, a0, APTR, ___memoryBlock, a1, ULONG, ___byteSize, d0,\
      , EXEC_BASE_NAME)

#define AllocMem(___byteSize, ___requirements) \
      LP2(0xc6, APTR, AllocMem , ULONG, ___byteSize, d0, ULONG, ___requirements, d1,\
      , EXEC_BASE_NAME)

#define AllocAbs(___byteSize, ___location) \
      LP2(0xcc, APTR, AllocAbs , ULONG, ___byteSize, d0, APTR, ___location, a1,\
      , EXEC_BASE_NAME)

#define FreeMem(___memoryBlock, ___byteSize) \
      LP2NR(0xd2, FreeMem , APTR, ___memoryBlock, a1, ULONG, ___byteSize, d0,\
      , EXEC_BASE_NAME)

#define AvailMem(___requirements) \
      LP1(0xd8, ULONG, AvailMem , ULONG, ___requirements, d1,\
      , EXEC_BASE_NAME)

#define AllocEntry(___entry) \
      LP1(0xde, struct MemList *, AllocEntry , struct MemList *, ___entry, a0,\
      , EXEC_BASE_NAME)

#define FreeEntry(___entry) \
      LP1NR(0xe4, FreeEntry , struct MemList *, ___entry, a0,\
      , EXEC_BASE_NAME)

#define Insert(___list, ___node, ___pred) \
      LP3NR(0xea, Insert , struct List *, ___list, a0, struct Node *, ___node, a1, struct Node *, ___pred, a2,\
      , EXEC_BASE_NAME)

#define AddHead(___list, ___node) \
      LP2NR(0xf0, AddHead , struct List *, ___list, a0, struct Node *, ___node, a1,\
      , EXEC_BASE_NAME)

#define AddTail(___list, ___node) \
      LP2NR(0xf6, AddTail , struct List *, ___list, a0, struct Node *, ___node, a1,\
      , EXEC_BASE_NAME)

#define Remove(___node) \
      LP1NR(0xfc, Remove , struct Node *, ___node, a1,\
      , EXEC_BASE_NAME)

#define RemHead(___list) \
      LP1(0x102, struct Node *, RemHead , struct List *, ___list, a0,\
      , EXEC_BASE_NAME)

#define RemTail(___list) \
      LP1(0x108, struct Node *, RemTail , struct List *, ___list, a0,\
      , EXEC_BASE_NAME)

#define Enqueue(___list, ___node) \
      LP2NR(0x10e, Enqueue , struct List *, ___list, a0, struct Node *, ___node, a1,\
      , EXEC_BASE_NAME)

#define FindName(___list, ___name) \
      LP2(0x114, struct Node *, FindName , struct List *, ___list, a0, CONST_STRPTR, ___name, a1,\
      , EXEC_BASE_NAME)

#define AddTask(___task, ___initPC, ___finalPC) \
      LP3(0x11a, APTR, AddTask , struct Task *, ___task, a1, const APTR, ___initPC, a2, const APTR, ___finalPC, a3,\
      , EXEC_BASE_NAME)

#define RemTask(___task) \
      LP1NR(0x120, RemTask , struct Task *, ___task, a1,\
      , EXEC_BASE_NAME)

#define FindTask(___name) \
      LP1(0x126, struct Task *, FindTask , CONST_STRPTR, ___name, a1,\
      , EXEC_BASE_NAME)

#define SetTaskPri(___task, ___priority) \
      LP2(0x12c, BYTE, SetTaskPri , struct Task *, ___task, a1, LONG, ___priority, d0,\
      , EXEC_BASE_NAME)

#define SetSignal(___newSignals, ___signalSet) \
      LP2(0x132, ULONG, SetSignal , ULONG, ___newSignals, d0, ULONG, ___signalSet, d1,\
      , EXEC_BASE_NAME)

#define SetExcept(___newSignals, ___signalSet) \
      LP2(0x138, ULONG, SetExcept , ULONG, ___newSignals, d0, ULONG, ___signalSet, d1,\
      , EXEC_BASE_NAME)

#define Wait(___signalSet) \
      LP1(0x13e, ULONG, Wait , ULONG, ___signalSet, d0,\
      , EXEC_BASE_NAME)

#define Signal(___task, ___signalSet) \
      LP2NR(0x144, Signal , struct Task *, ___task, a1, ULONG, ___signalSet, d0,\
      , EXEC_BASE_NAME)

#define AllocSignal(___signalNum) \
      LP1(0x14a, BYTE, AllocSignal , BYTE, ___signalNum, d0,\
      , EXEC_BASE_NAME)

#define FreeSignal(___signalNum) \
      LP1NR(0x150, FreeSignal , BYTE, ___signalNum, d0,\
      , EXEC_BASE_NAME)

#define AllocTrap(___trapNum) \
      LP1(0x156, LONG, AllocTrap , LONG, ___trapNum, d0,\
      , EXEC_BASE_NAME)

#define FreeTrap(___trapNum) \
      LP1NR(0x15c, FreeTrap , LONG, ___trapNum, d0,\
      , EXEC_BASE_NAME)

#define AddPort(___port) \
      LP1NR(0x162, AddPort , struct MsgPort *, ___port, a1,\
      , EXEC_BASE_NAME)

#define RemPort(___port) \
      LP1NR(0x168, RemPort , struct MsgPort *, ___port, a1,\
      , EXEC_BASE_NAME)

#define PutMsg(___port, ___message) \
      LP2NR(0x16e, PutMsg , struct MsgPort *, ___port, a0, struct Message *, ___message, a1,\
      , EXEC_BASE_NAME)

#define GetMsg(___port) \
      LP1(0x174, struct Message *, GetMsg , struct MsgPort *, ___port, a0,\
      , EXEC_BASE_NAME)

#define ReplyMsg(___message) \
      LP1NR(0x17a, ReplyMsg , struct Message *, ___message, a1,\
      , EXEC_BASE_NAME)

#define WaitPort(___port) \
      LP1(0x180, struct Message *, WaitPort , struct MsgPort *, ___port, a0,\
      , EXEC_BASE_NAME)

#define FindPort(___name) \
      LP1(0x186, struct MsgPort *, FindPort , CONST_STRPTR, ___name, a1,\
      , EXEC_BASE_NAME)

#define AddLibrary(___library) \
      LP1NR(0x18c, AddLibrary , struct Library *, ___library, a1,\
      , EXEC_BASE_NAME)

#define RemLibrary(___library) \
      LP1NR(0x192, RemLibrary , struct Library *, ___library, a1,\
      , EXEC_BASE_NAME)

#define OldOpenLibrary(___libName) \
      LP1(0x198, struct Library *, OldOpenLibrary , CONST_STRPTR, ___libName, a1,\
      , EXEC_BASE_NAME)

#define CloseLibrary(___library) \
      LP1NR(0x19e, CloseLibrary , struct Library *, ___library, a1,\
      , EXEC_BASE_NAME)

#define SetFunction(___library, ___funcOffset, ___newFunction) \
      LP3FP(0x1a4, APTR, SetFunction , struct Library *, ___library, a1, LONG, ___funcOffset, a0, __fpt, ___newFunction, d0,\
      , EXEC_BASE_NAME, ULONG (*__fpt)())

#define SumLibrary(___library) \
      LP1NR(0x1aa, SumLibrary , struct Library *, ___library, a1,\
      , EXEC_BASE_NAME)

#define AddDevice(___device) \
      LP1NR(0x1b0, AddDevice , struct Device *, ___device, a1,\
      , EXEC_BASE_NAME)

#define RemDevice(___device) \
      LP1NR(0x1b6, RemDevice , struct Device *, ___device, a1,\
      , EXEC_BASE_NAME)

#define OpenDevice(___devName, ___unit, ___ioRequest, ___flags) \
      LP4(0x1bc, BYTE, OpenDevice , CONST_STRPTR, ___devName, a0, ULONG, ___unit, d0, struct IORequest *, ___ioRequest, a1, ULONG, ___flags, d1,\
      , EXEC_BASE_NAME)

#define CloseDevice(___ioRequest) \
      LP1NR(0x1c2, CloseDevice , struct IORequest *, ___ioRequest, a1,\
      , EXEC_BASE_NAME)

#define DoIO(___ioRequest) \
      LP1(0x1c8, BYTE, DoIO , struct IORequest *, ___ioRequest, a1,\
      , EXEC_BASE_NAME)

#define SendIO(___ioRequest) \
      LP1NR(0x1ce, SendIO , struct IORequest *, ___ioRequest, a1,\
      , EXEC_BASE_NAME)

#define CheckIO(___ioRequest) \
      LP1(0x1d4, struct IORequest *, CheckIO , struct IORequest *, ___ioRequest, a1,\
      , EXEC_BASE_NAME)

#define WaitIO(___ioRequest) \
      LP1(0x1da, BYTE, WaitIO , struct IORequest *, ___ioRequest, a1,\
      , EXEC_BASE_NAME)

#define AbortIO(___ioRequest) \
      LP1NR(0x1e0, AbortIO , struct IORequest *, ___ioRequest, a1,\
      , EXEC_BASE_NAME)

#define AddResource(___resource) \
      LP1NR(0x1e6, AddResource , APTR, ___resource, a1,\
      , EXEC_BASE_NAME)

#define RemResource(___resource) \
      LP1NR(0x1ec, RemResource , APTR, ___resource, a1,\
      , EXEC_BASE_NAME)

#define OpenResource(___resName) \
      LP1(0x1f2, APTR, OpenResource , CONST_STRPTR, ___resName, a1,\
      , EXEC_BASE_NAME)

#define RawDoFmt(___formatString, ___dataStream, ___putChProc, ___putChData) \
      LP4FP(0x20a, APTR, RawDoFmt , CONST_STRPTR, ___formatString, a0, const APTR, ___dataStream, a1, __fpt, ___putChProc, a2, APTR, ___putChData, a3,\
      , EXEC_BASE_NAME, VOID (*__fpt)())

#define GetCC() \
      LP0(0x210, ULONG, GetCC ,\
      , EXEC_BASE_NAME)

#define TypeOfMem(___address) \
      LP1(0x216, ULONG, TypeOfMem , const APTR, ___address, a1,\
      , EXEC_BASE_NAME)

#define Procure(___sigSem, ___bidMsg) \
      LP2(0x21c, ULONG, Procure , struct SignalSemaphore *, ___sigSem, a0, struct SemaphoreMessage *, ___bidMsg, a1,\
      , EXEC_BASE_NAME)

#define Vacate(___sigSem, ___bidMsg) \
      LP2NR(0x222, Vacate , struct SignalSemaphore *, ___sigSem, a0, struct SemaphoreMessage *, ___bidMsg, a1,\
      , EXEC_BASE_NAME)

#define OpenLibrary(___libName, ___version) \
      LP2(0x228, struct Library *, OpenLibrary , CONST_STRPTR, ___libName, a1, ULONG, ___version, d0,\
      , EXEC_BASE_NAME)

#define InitSemaphore(___sigSem) \
      LP1NR(0x22e, InitSemaphore , struct SignalSemaphore *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define ObtainSemaphore(___sigSem) \
      LP1NR(0x234, ObtainSemaphore , struct SignalSemaphore *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define ReleaseSemaphore(___sigSem) \
      LP1NR(0x23a, ReleaseSemaphore , struct SignalSemaphore *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define AttemptSemaphore(___sigSem) \
      LP1(0x240, ULONG, AttemptSemaphore , struct SignalSemaphore *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define ObtainSemaphoreList(___sigSem) \
      LP1NR(0x246, ObtainSemaphoreList , struct List *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define ReleaseSemaphoreList(___sigSem) \
      LP1NR(0x24c, ReleaseSemaphoreList , struct List *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define FindSemaphore(___name) \
      LP1(0x252, struct SignalSemaphore *, FindSemaphore , STRPTR, ___name, a1,\
      , EXEC_BASE_NAME)

#define AddSemaphore(___sigSem) \
      LP1NR(0x258, AddSemaphore , struct SignalSemaphore *, ___sigSem, a1,\
      , EXEC_BASE_NAME)

#define RemSemaphore(___sigSem) \
      LP1NR(0x25e, RemSemaphore , struct SignalSemaphore *, ___sigSem, a1,\
      , EXEC_BASE_NAME)

#define SumKickData() \
      LP0(0x264, ULONG, SumKickData ,\
      , EXEC_BASE_NAME)

#define AddMemList(___size, ___attributes, ___pri, ___base, ___name) \
      LP5NR(0x26a, AddMemList , ULONG, ___size, d0, ULONG, ___attributes, d1, LONG, ___pri, d2, APTR, ___base, a0, CONST_STRPTR, ___name, a1,\
      , EXEC_BASE_NAME)

#define CopyMem(___source, ___dest, ___size) \
      LP3NR(0x270, CopyMem , const APTR, ___source, a0, APTR, ___dest, a1, ULONG, ___size, d0,\
      , EXEC_BASE_NAME)

#define CopyMemQuick(___source, ___dest, ___size) \
      LP3NR(0x276, CopyMemQuick , const APTR, ___source, a0, APTR, ___dest, a1, ULONG, ___size, d0,\
      , EXEC_BASE_NAME)

#define CacheClearU() \
      LP0NR(0x27c, CacheClearU ,\
      , EXEC_BASE_NAME)

#define CacheClearE(___address, ___length, ___caches) \
      LP3NR(0x282, CacheClearE , APTR, ___address, a0, ULONG, ___length, d0, ULONG, ___caches, d1,\
      , EXEC_BASE_NAME)

#define CacheControl(___cacheBits, ___cacheMask) \
      LP2(0x288, ULONG, CacheControl , ULONG, ___cacheBits, d0, ULONG, ___cacheMask, d1,\
      , EXEC_BASE_NAME)

#define CreateIORequest(___port, ___size) \
      LP2(0x28e, APTR, CreateIORequest , const struct MsgPort *, ___port, a0, ULONG, ___size, d0,\
      , EXEC_BASE_NAME)

#define DeleteIORequest(___iorequest) \
      LP1NR(0x294, DeleteIORequest , APTR, ___iorequest, a0,\
      , EXEC_BASE_NAME)

#define CreateMsgPort() \
      LP0(0x29a, struct MsgPort *, CreateMsgPort ,\
      , EXEC_BASE_NAME)

#define DeleteMsgPort(___port) \
      LP1NR(0x2a0, DeleteMsgPort , struct MsgPort *, ___port, a0,\
      , EXEC_BASE_NAME)

#define ObtainSemaphoreShared(___sigSem) \
      LP1NR(0x2a6, ObtainSemaphoreShared , struct SignalSemaphore *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define AllocVec(___byteSize, ___requirements) \
      LP2(0x2ac, APTR, AllocVec , ULONG, ___byteSize, d0, ULONG, ___requirements, d1,\
      , EXEC_BASE_NAME)

#define FreeVec(___memoryBlock) \
      LP1NR(0x2b2, FreeVec , APTR, ___memoryBlock, a1,\
      , EXEC_BASE_NAME)

#define CreatePool(___requirements, ___puddleSize, ___threshSize) \
      LP3(0x2b8, APTR, CreatePool , ULONG, ___requirements, d0, ULONG, ___puddleSize, d1, ULONG, ___threshSize, d2,\
      , EXEC_BASE_NAME)

#define DeletePool(___poolHeader) \
      LP1NR(0x2be, DeletePool , APTR, ___poolHeader, a0,\
      , EXEC_BASE_NAME)

#define AllocPooled(___poolHeader, ___memSize) \
      LP2(0x2c4, APTR, AllocPooled , APTR, ___poolHeader, a0, ULONG, ___memSize, d0,\
      , EXEC_BASE_NAME)

#define FreePooled(___poolHeader, ___memory, ___memSize) \
      LP3NR(0x2ca, FreePooled , APTR, ___poolHeader, a0, APTR, ___memory, a1, ULONG, ___memSize, d0,\
      , EXEC_BASE_NAME)

#define AttemptSemaphoreShared(___sigSem) \
      LP1(0x2d0, ULONG, AttemptSemaphoreShared , struct SignalSemaphore *, ___sigSem, a0,\
      , EXEC_BASE_NAME)

#define ColdReboot() \
      LP0NR(0x2d6, ColdReboot ,\
      , EXEC_BASE_NAME)

#define StackSwap(___newStack) \
      LP1NR(0x2dc, StackSwap , struct StackSwapStruct *, ___newStack, a0,\
      , EXEC_BASE_NAME)

#define CachePreDMA(___address, ___length, ___flags) \
      LP3(0x2fa, APTR, CachePreDMA , const APTR, ___address, a0, ULONG *, ___length, a1, ULONG, ___flags, d0,\
      , EXEC_BASE_NAME)

#define CachePostDMA(___address, ___length, ___flags) \
      LP3NR(0x300, CachePostDMA , const APTR, ___address, a0, ULONG *, ___length, a1, ULONG, ___flags, d0,\
      , EXEC_BASE_NAME)

#define AddMemHandler(___memhand) \
      LP1NR(0x306, AddMemHandler , struct Interrupt *, ___memhand, a1,\
      , EXEC_BASE_NAME)

#define RemMemHandler(___memhand) \
      LP1NR(0x30c, RemMemHandler , struct Interrupt *, ___memhand, a1,\
      , EXEC_BASE_NAME)

#define ObtainQuickVector(___interruptCode) \
      LP1(0x312, ULONG, ObtainQuickVector , APTR, ___interruptCode, a0,\
      , EXEC_BASE_NAME)

#define NewMinList(___minlist) \
      LP1NR(0x33c, NewMinList , struct MinList *, ___minlist, a0,\
      , EXEC_BASE_NAME)

#define AVL_AddNode(___root, ___node, ___func) \
      LP3(0x354, struct AVLNode *, AVL_AddNode , struct AVLNode **, ___root, a0, struct AVLNode *, ___node, a1, APTR, ___func, a2,\
      , EXEC_BASE_NAME)

#define AVL_RemNodeByAddress(___root, ___node) \
      LP2(0x35a, struct AVLNode *, AVL_RemNodeByAddress , struct AVLNode **, ___root, a0, struct AVLNode *, ___node, a1,\
      , EXEC_BASE_NAME)

#define AVL_RemNodeByKey(___root, ___key, ___func) \
      LP3(0x360, struct AVLNode *, AVL_RemNodeByKey , struct AVLNode **, ___root, a0, APTR, ___key, a1, APTR, ___func, a2,\
      , EXEC_BASE_NAME)

#define AVL_FindNode(___root, ___key, ___func) \
      LP3(0x366, struct AVLNode *, AVL_FindNode , CONST struct AVLNode *, ___root, a0, APTR, ___key, a1, APTR, ___func, a2,\
      , EXEC_BASE_NAME)

#define AVL_FindPrevNodeByAddress(___node) \
      LP1(0x36c, struct AVLNode *, AVL_FindPrevNodeByAddress , CONST struct AVLNode *, ___node, a0,\
      , EXEC_BASE_NAME)

#define AVL_FindPrevNodeByKey(___root, ___key, ___func) \
      LP3(0x372, struct AVLNode *, AVL_FindPrevNodeByKey , CONST struct AVLNode *, ___root, a0, APTR, ___key, a1, APTR, ___func, a2,\
      , EXEC_BASE_NAME)

#define AVL_FindNextNodeByAddress(___node) \
      LP1(0x378, struct AVLNode *, AVL_FindNextNodeByAddress , CONST struct AVLNode *, ___node, a0,\
      , EXEC_BASE_NAME)

#define AVL_FindNextNodeByKey(___root, ___key, ___func) \
      LP3(0x37e, struct AVLNode *, AVL_FindNextNodeByKey , CONST struct AVLNode *, ___root, a0, APTR, ___key, a1, APTR, ___func, a2,\
      , EXEC_BASE_NAME)

#define AVL_FindFirstNode(___root) \
      LP1(0x384, struct AVLNode *, AVL_FindFirstNode , CONST struct AVLNode *, ___root, a0,\
      , EXEC_BASE_NAME)

#define AVL_FindLastNode(___root) \
      LP1(0x38a, struct AVLNode *, AVL_FindLastNode , CONST struct AVLNode *, ___root, a0,\
      , EXEC_BASE_NAME)

#endif /* !_INLINE_EXEC_H */
