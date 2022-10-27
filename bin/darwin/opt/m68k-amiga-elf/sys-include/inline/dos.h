/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_DOS_H
#define _INLINE_DOS_H

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

#ifndef DOS_BASE_NAME
#define DOS_BASE_NAME DOSBase
#endif /* !DOS_BASE_NAME */

#define Open(___name, ___accessMode) \
      LP2(0x1e, BPTR, Open , CONST_STRPTR, ___name, d1, LONG, ___accessMode, d2,\
      , DOS_BASE_NAME)

#define Close(___file) \
      LP1(0x24, LONG, Close , BPTR, ___file, d1,\
      , DOS_BASE_NAME)

#define Read(___file, ___buffer, ___length) \
      LP3(0x2a, LONG, Read , BPTR, ___file, d1, APTR, ___buffer, d2, LONG, ___length, d3,\
      , DOS_BASE_NAME)

#define Write(___file, ___buffer, ___length) \
      LP3(0x30, LONG, Write , BPTR, ___file, d1, const APTR, ___buffer, d2, LONG, ___length, d3,\
      , DOS_BASE_NAME)

#define Input() \
      LP0(0x36, BPTR, Input ,\
      , DOS_BASE_NAME)

#define Output() \
      LP0(0x3c, BPTR, Output ,\
      , DOS_BASE_NAME)

#define Seek(___file, ___position, ___offset) \
      LP3(0x42, LONG, Seek , BPTR, ___file, d1, LONG, ___position, d2, LONG, ___offset, d3,\
      , DOS_BASE_NAME)

#define DeleteFile(___name) \
      LP1(0x48, LONG, DeleteFile , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define Rename(___oldName, ___newName) \
      LP2(0x4e, LONG, Rename , CONST_STRPTR, ___oldName, d1, CONST_STRPTR, ___newName, d2,\
      , DOS_BASE_NAME)

#define Lock(___name, ___type) \
      LP2(0x54, BPTR, Lock , CONST_STRPTR, ___name, d1, LONG, ___type, d2,\
      , DOS_BASE_NAME)

#define UnLock(___lock) \
      LP1NR(0x5a, UnLock , BPTR, ___lock, d1,\
      , DOS_BASE_NAME)

#define DupLock(___lock) \
      LP1(0x60, BPTR, DupLock , BPTR, ___lock, d1,\
      , DOS_BASE_NAME)

#define Examine(___lock, ___fileInfoBlock) \
      LP2(0x66, LONG, Examine , BPTR, ___lock, d1, struct FileInfoBlock *, ___fileInfoBlock, d2,\
      , DOS_BASE_NAME)

#define ExNext(___lock, ___fileInfoBlock) \
      LP2(0x6c, LONG, ExNext , BPTR, ___lock, d1, struct FileInfoBlock *, ___fileInfoBlock, d2,\
      , DOS_BASE_NAME)

#define Info(___lock, ___parameterBlock) \
      LP2(0x72, LONG, Info , BPTR, ___lock, d1, struct InfoData *, ___parameterBlock, d2,\
      , DOS_BASE_NAME)

#define CreateDir(___name) \
      LP1(0x78, BPTR, CreateDir , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define CurrentDir(___lock) \
      LP1(0x7e, BPTR, CurrentDir , BPTR, ___lock, d1,\
      , DOS_BASE_NAME)

#define IoErr() \
      LP0(0x84, LONG, IoErr ,\
      , DOS_BASE_NAME)

#define CreateProc(___name, ___pri, ___segList, ___stackSize) \
      LP4(0x8a, struct MsgPort *, CreateProc , CONST_STRPTR, ___name, d1, LONG, ___pri, d2, BPTR, ___segList, d3, LONG, ___stackSize, d4,\
      , DOS_BASE_NAME)

#define Exit(___returnCode) \
      LP1NR(0x90, Exit , LONG, ___returnCode, d1,\
      , DOS_BASE_NAME)

#define LoadSeg(___name) \
      LP1(0x96, BPTR, LoadSeg , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define UnLoadSeg(___seglist) \
      LP1NR(0x9c, UnLoadSeg , BPTR, ___seglist, d1,\
      , DOS_BASE_NAME)

#define DeviceProc(___name) \
      LP1(0xae, struct MsgPort *, DeviceProc , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define SetComment(___name, ___comment) \
      LP2(0xb4, LONG, SetComment , CONST_STRPTR, ___name, d1, CONST_STRPTR, ___comment, d2,\
      , DOS_BASE_NAME)

#define SetProtection(___name, ___protect) \
      LP2(0xba, LONG, SetProtection , CONST_STRPTR, ___name, d1, LONG, ___protect, d2,\
      , DOS_BASE_NAME)

#define DateStamp(___date) \
      LP1(0xc0, struct DateStamp *, DateStamp , struct DateStamp *, ___date, d1,\
      , DOS_BASE_NAME)

#define Delay(___timeout) \
      LP1NR(0xc6, Delay , LONG, ___timeout, d1,\
      , DOS_BASE_NAME)

#define WaitForChar(___file, ___timeout) \
      LP2(0xcc, LONG, WaitForChar , BPTR, ___file, d1, LONG, ___timeout, d2,\
      , DOS_BASE_NAME)

#define ParentDir(___lock) \
      LP1(0xd2, BPTR, ParentDir , BPTR, ___lock, d1,\
      , DOS_BASE_NAME)

#define IsInteractive(___file) \
      LP1(0xd8, LONG, IsInteractive , BPTR, ___file, d1,\
      , DOS_BASE_NAME)

#define Execute(___string, ___file, ___file2) \
      LP3(0xde, LONG, Execute , CONST_STRPTR, ___string, d1, BPTR, ___file, d2, BPTR, ___file2, d3,\
      , DOS_BASE_NAME)

#define AllocDosObject(___type, ___tags) \
      LP2(0xe4, APTR, AllocDosObject , ULONG, ___type, d1, const struct TagItem *, ___tags, d2,\
      , DOS_BASE_NAME)

#define AllocDosObjectTagList(___type, ___tags) \
      LP2(0xe4, APTR, AllocDosObjectTagList , ULONG, ___type, d1, const struct TagItem *, ___tags, d2,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocDosObjectTags(___type, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; AllocDosObjectTagList((___type), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeDosObject(___type, ___ptr) \
      LP2NR(0xea, FreeDosObject , ULONG, ___type, d1, APTR, ___ptr, d2,\
      , DOS_BASE_NAME)

#define DoPkt(___port, ___action, ___arg1, ___arg2, ___arg3, ___arg4, ___arg5) \
      LP7(0xf0, LONG, DoPkt , struct MsgPort *, ___port, d1, LONG, ___action, d2, LONG, ___arg1, d3, LONG, ___arg2, d4, LONG, ___arg3, d5, LONG, ___arg4, d6, LONG, ___arg5, d7,\
      , DOS_BASE_NAME)

#define DoPkt0(___port, ___action) \
      LP2(0xf0, LONG, DoPkt0 , struct MsgPort *, ___port, d1, LONG, ___action, d2,\
      , DOS_BASE_NAME)

#define DoPkt1(___port, ___action, ___arg1) \
      LP3(0xf0, LONG, DoPkt1 , struct MsgPort *, ___port, d1, LONG, ___action, d2, LONG, ___arg1, d3,\
      , DOS_BASE_NAME)

#define DoPkt2(___port, ___action, ___arg1, ___arg2) \
      LP4(0xf0, LONG, DoPkt2 , struct MsgPort *, ___port, d1, LONG, ___action, d2, LONG, ___arg1, d3, LONG, ___arg2, d4,\
      , DOS_BASE_NAME)

#define DoPkt3(___port, ___action, ___arg1, ___arg2, ___arg3) \
      LP5(0xf0, LONG, DoPkt3 , struct MsgPort *, ___port, d1, LONG, ___action, d2, LONG, ___arg1, d3, LONG, ___arg2, d4, LONG, ___arg3, d5,\
      , DOS_BASE_NAME)

#define DoPkt4(___port, ___action, ___arg1, ___arg2, ___arg3, ___arg4) \
      LP6(0xf0, LONG, DoPkt4 , struct MsgPort *, ___port, d1, LONG, ___action, d2, LONG, ___arg1, d3, LONG, ___arg2, d4, LONG, ___arg3, d5, LONG, ___arg4, d6,\
      , DOS_BASE_NAME)

#define SendPkt(___dp, ___port, ___replyport) \
      LP3NR(0xf6, SendPkt , struct DosPacket *, ___dp, d1, struct MsgPort *, ___port, d2, struct MsgPort *, ___replyport, d3,\
      , DOS_BASE_NAME)

#define WaitPkt() \
      LP0(0xfc, struct DosPacket *, WaitPkt ,\
      , DOS_BASE_NAME)

#define ReplyPkt(___dp, ___res1, ___res2) \
      LP3NR(0x102, ReplyPkt , struct DosPacket *, ___dp, d1, LONG, ___res1, d2, LONG, ___res2, d3,\
      , DOS_BASE_NAME)

#define AbortPkt(___port, ___pkt) \
      LP2NR(0x108, AbortPkt , struct MsgPort *, ___port, d1, struct DosPacket *, ___pkt, d2,\
      , DOS_BASE_NAME)

#define LockRecord(___fh, ___offset, ___length, ___mode, ___timeout) \
      LP5(0x10e, BOOL, LockRecord , BPTR, ___fh, d1, ULONG, ___offset, d2, ULONG, ___length, d3, ULONG, ___mode, d4, ULONG, ___timeout, d5,\
      , DOS_BASE_NAME)

#define LockRecords(___recArray, ___timeout) \
      LP2(0x114, BOOL, LockRecords , struct RecordLock *, ___recArray, d1, ULONG, ___timeout, d2,\
      , DOS_BASE_NAME)

#define UnLockRecord(___fh, ___offset, ___length) \
      LP3(0x11a, BOOL, UnLockRecord , BPTR, ___fh, d1, ULONG, ___offset, d2, ULONG, ___length, d3,\
      , DOS_BASE_NAME)

#define UnLockRecords(___recArray) \
      LP1(0x120, BOOL, UnLockRecords , struct RecordLock *, ___recArray, d1,\
      , DOS_BASE_NAME)

#define SelectInput(___fh) \
      LP1(0x126, BPTR, SelectInput , BPTR, ___fh, d1,\
      , DOS_BASE_NAME)

#define SelectOutput(___fh) \
      LP1(0x12c, BPTR, SelectOutput , BPTR, ___fh, d1,\
      , DOS_BASE_NAME)

#define FGetC(___fh) \
      LP1(0x132, LONG, FGetC , BPTR, ___fh, d1,\
      , DOS_BASE_NAME)

#define FPutC(___fh, ___ch) \
      LP2(0x138, LONG, FPutC , BPTR, ___fh, d1, LONG, ___ch, d2,\
      , DOS_BASE_NAME)

#define UnGetC(___fh, ___character) \
      LP2(0x13e, LONG, UnGetC , BPTR, ___fh, d1, LONG, ___character, d2,\
      , DOS_BASE_NAME)

#define FRead(___fh, ___block, ___blocklen, ___number) \
      LP4(0x144, LONG, FRead , BPTR, ___fh, d1, APTR, ___block, d2, ULONG, ___blocklen, d3, ULONG, ___number, d4,\
      , DOS_BASE_NAME)

#define FWrite(___fh, ___block, ___blocklen, ___number) \
      LP4(0x14a, LONG, FWrite , BPTR, ___fh, d1, const APTR, ___block, d2, ULONG, ___blocklen, d3, ULONG, ___number, d4,\
      , DOS_BASE_NAME)

#define FGets(___fh, ___buf, ___buflen) \
      LP3(0x150, STRPTR, FGets , BPTR, ___fh, d1, STRPTR, ___buf, d2, ULONG, ___buflen, d3,\
      , DOS_BASE_NAME)

#define FPuts(___fh, ___str) \
      LP2(0x156, LONG, FPuts , BPTR, ___fh, d1, CONST_STRPTR, ___str, d2,\
      , DOS_BASE_NAME)

#define VFWritef(___fh, ___format, ___argarray) \
      LP3NR(0x15c, VFWritef , BPTR, ___fh, d1, CONST_STRPTR, ___format, d2, const LONG *, ___argarray, d3,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define FWritef(___fh, ___format, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; VFWritef((___fh), (___format), (const LONG *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define VFPrintf(___fh, ___format, ___argarray) \
      LP3(0x162, LONG, VFPrintf , BPTR, ___fh, d1, CONST_STRPTR, ___format, d2, const APTR, ___argarray, d3,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define FPrintf(___fh, ___format, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; VFPrintf((___fh), (___format), (const APTR) _args); })
#endif /* !NO_INLINE_VARARGS */

#define Flush(___fh) \
      LP1(0x168, LONG, Flush , BPTR, ___fh, d1,\
      , DOS_BASE_NAME)

#define SetVBuf(___fh, ___buff, ___type, ___size) \
      LP4(0x16e, LONG, SetVBuf , BPTR, ___fh, d1, STRPTR, ___buff, d2, LONG, ___type, d3, LONG, ___size, d4,\
      , DOS_BASE_NAME)

#define DupLockFromFH(___fh) \
      LP1(0x174, BPTR, DupLockFromFH , BPTR, ___fh, d1,\
      , DOS_BASE_NAME)

#define OpenFromLock(___lock) \
      LP1(0x17a, BPTR, OpenFromLock , BPTR, ___lock, d1,\
      , DOS_BASE_NAME)

#define ParentOfFH(___fh) \
      LP1(0x180, BPTR, ParentOfFH , BPTR, ___fh, d1,\
      , DOS_BASE_NAME)

#define ExamineFH(___fh, ___fib) \
      LP2(0x186, BOOL, ExamineFH , BPTR, ___fh, d1, struct FileInfoBlock *, ___fib, d2,\
      , DOS_BASE_NAME)

#define SetFileDate(___name, ___date) \
      LP2(0x18c, LONG, SetFileDate , CONST_STRPTR, ___name, d1, const struct DateStamp *, ___date, d2,\
      , DOS_BASE_NAME)

#define NameFromLock(___lock, ___buffer, ___len) \
      LP3(0x192, LONG, NameFromLock , BPTR, ___lock, d1, STRPTR, ___buffer, d2, LONG, ___len, d3,\
      , DOS_BASE_NAME)

#define NameFromFH(___fh, ___buffer, ___len) \
      LP3(0x198, LONG, NameFromFH , BPTR, ___fh, d1, STRPTR, ___buffer, d2, LONG, ___len, d3,\
      , DOS_BASE_NAME)

#define SplitName(___name, ___separator, ___buf, ___oldpos, ___size) \
      LP5(0x19e, WORD, SplitName , CONST_STRPTR, ___name, d1, UBYTE, ___separator, d2, STRPTR, ___buf, d3, WORD, ___oldpos, d4, LONG, ___size, d5,\
      , DOS_BASE_NAME)

#define SameLock(___lock1, ___lock2) \
      LP2(0x1a4, LONG, SameLock , BPTR, ___lock1, d1, BPTR, ___lock2, d2,\
      , DOS_BASE_NAME)

#define SetMode(___fh, ___mode) \
      LP2(0x1aa, LONG, SetMode , BPTR, ___fh, d1, LONG, ___mode, d2,\
      , DOS_BASE_NAME)

#define ExAll(___lock, ___buffer, ___size, ___data, ___control) \
      LP5(0x1b0, LONG, ExAll , BPTR, ___lock, d1, struct ExAllData *, ___buffer, d2, LONG, ___size, d3, LONG, ___data, d4, struct ExAllControl *, ___control, d5,\
      , DOS_BASE_NAME)

#define ReadLink(___port, ___lock, ___path, ___buffer, ___size) \
      LP5(0x1b6, LONG, ReadLink , struct MsgPort *, ___port, d1, BPTR, ___lock, d2, CONST_STRPTR, ___path, d3, STRPTR, ___buffer, d4, ULONG, ___size, d5,\
      , DOS_BASE_NAME)

#define MakeLink(___name, ___dest, ___soft) \
      LP3(0x1bc, LONG, MakeLink , CONST_STRPTR, ___name, d1, LONG, ___dest, d2, LONG, ___soft, d3,\
      , DOS_BASE_NAME)

#define ChangeMode(___type, ___fh, ___newmode) \
      LP3(0x1c2, LONG, ChangeMode , LONG, ___type, d1, BPTR, ___fh, d2, LONG, ___newmode, d3,\
      , DOS_BASE_NAME)

#define SetFileSize(___fh, ___pos, ___mode) \
      LP3(0x1c8, LONG, SetFileSize , BPTR, ___fh, d1, LONG, ___pos, d2, LONG, ___mode, d3,\
      , DOS_BASE_NAME)

#define SetIoErr(___result) \
      LP1(0x1ce, LONG, SetIoErr , LONG, ___result, d1,\
      , DOS_BASE_NAME)

#define Fault(___code, ___header, ___buffer, ___len) \
      LP4(0x1d4, BOOL, Fault , LONG, ___code, d1, STRPTR, ___header, d2, STRPTR, ___buffer, d3, LONG, ___len, d4,\
      , DOS_BASE_NAME)

#define PrintFault(___code, ___header) \
      LP2(0x1da, BOOL, PrintFault , LONG, ___code, d1, CONST_STRPTR, ___header, d2,\
      , DOS_BASE_NAME)

#define ErrorReport(___code, ___type, ___arg1, ___device) \
      LP4(0x1e0, LONG, ErrorReport , LONG, ___code, d1, LONG, ___type, d2, ULONG, ___arg1, d3, struct MsgPort *, ___device, d4,\
      , DOS_BASE_NAME)

#define Cli() \
      LP0(0x1ec, struct CommandLineInterface *, Cli ,\
      , DOS_BASE_NAME)

#define CreateNewProc(___tags) \
      LP1(0x1f2, struct Process *, CreateNewProc , const struct TagItem *, ___tags, d1,\
      , DOS_BASE_NAME)

#define CreateNewProcTagList(___tags) \
      LP1(0x1f2, struct Process *, CreateNewProcTagList , const struct TagItem *, ___tags, d1,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateNewProcTags(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; CreateNewProcTagList((const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RunCommand(___seg, ___stack, ___paramptr, ___paramlen) \
      LP4(0x1f8, LONG, RunCommand , BPTR, ___seg, d1, LONG, ___stack, d2, CONST_STRPTR, ___paramptr, d3, LONG, ___paramlen, d4,\
      , DOS_BASE_NAME)

#define GetConsoleTask() \
      LP0(0x1fe, struct MsgPort *, GetConsoleTask ,\
      , DOS_BASE_NAME)

#define SetConsoleTask(___task) \
      LP1(0x204, struct MsgPort *, SetConsoleTask , const struct MsgPort *, ___task, d1,\
      , DOS_BASE_NAME)

#define GetFileSysTask() \
      LP0(0x20a, struct MsgPort *, GetFileSysTask ,\
      , DOS_BASE_NAME)

#define SetFileSysTask(___task) \
      LP1(0x210, struct MsgPort *, SetFileSysTask , const struct MsgPort *, ___task, d1,\
      , DOS_BASE_NAME)

#define GetArgStr() \
      LP0(0x216, STRPTR, GetArgStr ,\
      , DOS_BASE_NAME)

#define SetArgStr(___string) \
      LP1(0x21c, BOOL, SetArgStr , CONST_STRPTR, ___string, d1,\
      , DOS_BASE_NAME)

#define FindCliProc(___num) \
      LP1(0x222, struct Process *, FindCliProc , ULONG, ___num, d1,\
      , DOS_BASE_NAME)

#define MaxCli() \
      LP0(0x228, ULONG, MaxCli ,\
      , DOS_BASE_NAME)

#define SetCurrentDirName(___name) \
      LP1(0x22e, BOOL, SetCurrentDirName , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define GetCurrentDirName(___buf, ___len) \
      LP2(0x234, BOOL, GetCurrentDirName , STRPTR, ___buf, d1, LONG, ___len, d2,\
      , DOS_BASE_NAME)

#define SetProgramName(___name) \
      LP1(0x23a, BOOL, SetProgramName , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define GetProgramName(___buf, ___len) \
      LP2(0x240, BOOL, GetProgramName , STRPTR, ___buf, d1, LONG, ___len, d2,\
      , DOS_BASE_NAME)

#define SetPrompt(___name) \
      LP1(0x246, BOOL, SetPrompt , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define GetPrompt(___buf, ___len) \
      LP2(0x24c, BOOL, GetPrompt , STRPTR, ___buf, d1, LONG, ___len, d2,\
      , DOS_BASE_NAME)

#define SetProgramDir(___lock) \
      LP1(0x252, BPTR, SetProgramDir , BPTR, ___lock, d1,\
      , DOS_BASE_NAME)

#define GetProgramDir() \
      LP0(0x258, BPTR, GetProgramDir ,\
      , DOS_BASE_NAME)

#define SystemTagList(___command, ___tags) \
      LP2(0x25e, LONG, SystemTagList , CONST_STRPTR, ___command, d1, const struct TagItem *, ___tags, d2,\
      , DOS_BASE_NAME)

#define System(___command, ___tags) \
      LP2(0x25e, LONG, System , CONST_STRPTR, ___command, d1, const struct TagItem *, ___tags, d2,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SystemTags(___command, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; System((___command), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AssignLock(___name, ___lock) \
      LP2(0x264, LONG, AssignLock , CONST_STRPTR, ___name, d1, BPTR, ___lock, d2,\
      , DOS_BASE_NAME)

#define AssignLate(___name, ___path) \
      LP2(0x26a, BOOL, AssignLate , CONST_STRPTR, ___name, d1, CONST_STRPTR, ___path, d2,\
      , DOS_BASE_NAME)

#define AssignPath(___name, ___path) \
      LP2(0x270, BOOL, AssignPath , CONST_STRPTR, ___name, d1, CONST_STRPTR, ___path, d2,\
      , DOS_BASE_NAME)

#define AssignAdd(___name, ___lock) \
      LP2(0x276, BOOL, AssignAdd , CONST_STRPTR, ___name, d1, BPTR, ___lock, d2,\
      , DOS_BASE_NAME)

#define RemAssignList(___name, ___lock) \
      LP2(0x27c, LONG, RemAssignList , CONST_STRPTR, ___name, d1, BPTR, ___lock, d2,\
      , DOS_BASE_NAME)

#define GetDeviceProc(___name, ___dp) \
      LP2(0x282, struct DevProc *, GetDeviceProc , CONST_STRPTR, ___name, d1, struct DevProc *, ___dp, d2,\
      , DOS_BASE_NAME)

#define FreeDeviceProc(___dp) \
      LP1NR(0x288, FreeDeviceProc , struct DevProc *, ___dp, d1,\
      , DOS_BASE_NAME)

#define LockDosList(___flags) \
      LP1(0x28e, struct DosList *, LockDosList , ULONG, ___flags, d1,\
      , DOS_BASE_NAME)

#define UnLockDosList(___flags) \
      LP1NR(0x294, UnLockDosList , ULONG, ___flags, d1,\
      , DOS_BASE_NAME)

#define AttemptLockDosList(___flags) \
      LP1(0x29a, struct DosList *, AttemptLockDosList , ULONG, ___flags, d1,\
      , DOS_BASE_NAME)

#define RemDosEntry(___dlist) \
      LP1(0x2a0, BOOL, RemDosEntry , struct DosList *, ___dlist, d1,\
      , DOS_BASE_NAME)

#define AddDosEntry(___dlist) \
      LP1(0x2a6, LONG, AddDosEntry , struct DosList *, ___dlist, d1,\
      , DOS_BASE_NAME)

#define FindDosEntry(___dlist, ___name, ___flags) \
      LP3(0x2ac, struct DosList *, FindDosEntry , const struct DosList *, ___dlist, d1, CONST_STRPTR, ___name, d2, ULONG, ___flags, d3,\
      , DOS_BASE_NAME)

#define NextDosEntry(___dlist, ___flags) \
      LP2(0x2b2, struct DosList *, NextDosEntry , const struct DosList *, ___dlist, d1, ULONG, ___flags, d2,\
      , DOS_BASE_NAME)

#define MakeDosEntry(___name, ___type) \
      LP2(0x2b8, struct DosList *, MakeDosEntry , CONST_STRPTR, ___name, d1, LONG, ___type, d2,\
      , DOS_BASE_NAME)

#define FreeDosEntry(___dlist) \
      LP1NR(0x2be, FreeDosEntry , struct DosList *, ___dlist, d1,\
      , DOS_BASE_NAME)

#define IsFileSystem(___name) \
      LP1(0x2c4, BOOL, IsFileSystem , CONST_STRPTR, ___name, d1,\
      , DOS_BASE_NAME)

#define Format(___filesystem, ___volumename, ___dostype) \
      LP3(0x2ca, BOOL, Format , CONST_STRPTR, ___filesystem, d1, CONST_STRPTR, ___volumename, d2, ULONG, ___dostype, d3,\
      , DOS_BASE_NAME)

#define Relabel(___drive, ___newname) \
      LP2(0x2d0, LONG, Relabel , CONST_STRPTR, ___drive, d1, CONST_STRPTR, ___newname, d2,\
      , DOS_BASE_NAME)

#define Inhibit(___name, ___onoff) \
      LP2(0x2d6, LONG, Inhibit , CONST_STRPTR, ___name, d1, LONG, ___onoff, d2,\
      , DOS_BASE_NAME)

#define AddBuffers(___name, ___number) \
      LP2(0x2dc, LONG, AddBuffers , CONST_STRPTR, ___name, d1, LONG, ___number, d2,\
      , DOS_BASE_NAME)

#define CompareDates(___date1, ___date2) \
      LP2(0x2e2, LONG, CompareDates , const struct DateStamp *, ___date1, d1, const struct DateStamp *, ___date2, d2,\
      , DOS_BASE_NAME)

#define DateToStr(___datetime) \
      LP1(0x2e8, LONG, DateToStr , struct DateTime *, ___datetime, d1,\
      , DOS_BASE_NAME)

#define StrToDate(___datetime) \
      LP1(0x2ee, LONG, StrToDate , struct DateTime *, ___datetime, d1,\
      , DOS_BASE_NAME)

#define InternalLoadSeg(___fh, ___table, ___funcarray, ___stack) \
      LP4(0x2f4, BPTR, InternalLoadSeg , BPTR, ___fh, d0, BPTR, ___table, a0, const LONG *, ___funcarray, a1, LONG *, ___stack, a2,\
      , DOS_BASE_NAME)

#define InternalUnLoadSeg(___seglist, ___freefunc) \
      LP2FP(0x2fa, BOOL, InternalUnLoadSeg , BPTR, ___seglist, d1, __fpt, ___freefunc, a1,\
      , DOS_BASE_NAME, VOID (*__fpt)())

#define NewLoadSeg(___file, ___tags) \
      LP2(0x300, BPTR, NewLoadSeg , CONST_STRPTR, ___file, d1, const struct TagItem *, ___tags, d2,\
      , DOS_BASE_NAME)

#define NewLoadSegTagList(___file, ___tags) \
      LP2(0x300, BPTR, NewLoadSegTagList , CONST_STRPTR, ___file, d1, const struct TagItem *, ___tags, d2,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define NewLoadSegTags(___file, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; NewLoadSegTagList((___file), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AddSegment(___name, ___seg, ___system) \
      LP3(0x306, LONG, AddSegment , CONST_STRPTR, ___name, d1, BPTR, ___seg, d2, LONG, ___system, d3,\
      , DOS_BASE_NAME)

#define FindSegment(___name, ___seg, ___system) \
      LP3(0x30c, struct Segment *, FindSegment , CONST_STRPTR, ___name, d1, const struct Segment *, ___seg, d2, LONG, ___system, d3,\
      , DOS_BASE_NAME)

#define RemSegment(___seg) \
      LP1(0x312, LONG, RemSegment , struct Segment *, ___seg, d1,\
      , DOS_BASE_NAME)

#define CheckSignal(___mask) \
      LP1(0x318, LONG, CheckSignal , LONG, ___mask, d1,\
      , DOS_BASE_NAME)

#define ReadArgs(___arg_template, ___array, ___args) \
      LP3(0x31e, struct RDArgs *, ReadArgs , CONST_STRPTR, ___arg_template, d1, LONG *, ___array, d2, struct RDArgs *, ___args, d3,\
      , DOS_BASE_NAME)

#define FindArg(___keyword, ___arg_template) \
      LP2(0x324, LONG, FindArg , CONST_STRPTR, ___keyword, d1, CONST_STRPTR, ___arg_template, d2,\
      , DOS_BASE_NAME)

#define ReadItem(___name, ___maxchars, ___cSource) \
      LP3(0x32a, LONG, ReadItem , CONST_STRPTR, ___name, d1, LONG, ___maxchars, d2, struct CSource *, ___cSource, d3,\
      , DOS_BASE_NAME)

#define StrToLong(___string, ___value) \
      LP2(0x330, LONG, StrToLong , CONST_STRPTR, ___string, d1, LONG *, ___value, d2,\
      , DOS_BASE_NAME)

#define MatchFirst(___pat, ___anchor) \
      LP2(0x336, LONG, MatchFirst , CONST_STRPTR, ___pat, d1, struct AnchorPath *, ___anchor, d2,\
      , DOS_BASE_NAME)

#define MatchNext(___anchor) \
      LP1(0x33c, LONG, MatchNext , struct AnchorPath *, ___anchor, d1,\
      , DOS_BASE_NAME)

#define MatchEnd(___anchor) \
      LP1NR(0x342, MatchEnd , struct AnchorPath *, ___anchor, d1,\
      , DOS_BASE_NAME)

#define ParsePattern(___pat, ___buf, ___buflen) \
      LP3(0x348, LONG, ParsePattern , CONST_STRPTR, ___pat, d1, STRPTR, ___buf, d2, LONG, ___buflen, d3,\
      , DOS_BASE_NAME)

#define MatchPattern(___pat, ___str) \
      LP2(0x34e, BOOL, MatchPattern , CONST_STRPTR, ___pat, d1, STRPTR, ___str, d2,\
      , DOS_BASE_NAME)

#define FreeArgs(___args) \
      LP1NR(0x35a, FreeArgs , struct RDArgs *, ___args, d1,\
      , DOS_BASE_NAME)

#define FilePart(___path) \
      LP1(0x366, STRPTR, FilePart , CONST_STRPTR, ___path, d1,\
      , DOS_BASE_NAME)

#define PathPart(___path) \
      LP1(0x36c, STRPTR, PathPart , CONST_STRPTR, ___path, d1,\
      , DOS_BASE_NAME)

#define AddPart(___dirname, ___filename, ___size) \
      LP3(0x372, BOOL, AddPart , STRPTR, ___dirname, d1, CONST_STRPTR, ___filename, d2, ULONG, ___size, d3,\
      , DOS_BASE_NAME)

#define StartNotify(___notify) \
      LP1(0x378, BOOL, StartNotify , struct NotifyRequest *, ___notify, d1,\
      , DOS_BASE_NAME)

#define EndNotify(___notify) \
      LP1NR(0x37e, EndNotify , struct NotifyRequest *, ___notify, d1,\
      , DOS_BASE_NAME)

#define SetVar(___name, ___buffer, ___size, ___flags) \
      LP4(0x384, BOOL, SetVar , CONST_STRPTR, ___name, d1, CONST_STRPTR, ___buffer, d2, LONG, ___size, d3, LONG, ___flags, d4,\
      , DOS_BASE_NAME)

#define GetVar(___name, ___buffer, ___size, ___flags) \
      LP4(0x38a, LONG, GetVar , CONST_STRPTR, ___name, d1, STRPTR, ___buffer, d2, LONG, ___size, d3, LONG, ___flags, d4,\
      , DOS_BASE_NAME)

#define DeleteVar(___name, ___flags) \
      LP2(0x390, LONG, DeleteVar , CONST_STRPTR, ___name, d1, ULONG, ___flags, d2,\
      , DOS_BASE_NAME)

#define FindVar(___name, ___type) \
      LP2(0x396, struct LocalVar *, FindVar , CONST_STRPTR, ___name, d1, ULONG, ___type, d2,\
      , DOS_BASE_NAME)

#define CliInitNewcli(___dp) \
      LP1(0x3a2, LONG, CliInitNewcli , struct DosPacket *, ___dp, a0,\
      , DOS_BASE_NAME)

#define CliInitRun(___dp) \
      LP1(0x3a8, LONG, CliInitRun , struct DosPacket *, ___dp, a0,\
      , DOS_BASE_NAME)

#define WriteChars(___buf, ___buflen) \
      LP2(0x3ae, LONG, WriteChars , CONST_STRPTR, ___buf, d1, ULONG, ___buflen, d2,\
      , DOS_BASE_NAME)

#define PutStr(___str) \
      LP1(0x3b4, LONG, PutStr , CONST_STRPTR, ___str, d1,\
      , DOS_BASE_NAME)

#define VPrintf(___format, ___argarray) \
      LP2(0x3ba, LONG, VPrintf , CONST_STRPTR, ___format, d1, const APTR, ___argarray, d2,\
      , DOS_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define Printf(___format, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; VPrintf((___format), (const APTR) _args); })
#endif /* !NO_INLINE_VARARGS */

#define ParsePatternNoCase(___pat, ___buf, ___buflen) \
      LP3(0x3c6, LONG, ParsePatternNoCase , CONST_STRPTR, ___pat, d1, UBYTE *, ___buf, d2, LONG, ___buflen, d3,\
      , DOS_BASE_NAME)

#define MatchPatternNoCase(___pat, ___str) \
      LP2(0x3cc, BOOL, MatchPatternNoCase , CONST_STRPTR, ___pat, d1, STRPTR, ___str, d2,\
      , DOS_BASE_NAME)

#define SameDevice(___lock1, ___lock2) \
      LP2(0x3d8, BOOL, SameDevice , BPTR, ___lock1, d1, BPTR, ___lock2, d2,\
      , DOS_BASE_NAME)

#define ExAllEnd(___lock, ___buffer, ___size, ___data, ___control) \
      LP5NR(0x3de, ExAllEnd , BPTR, ___lock, d1, struct ExAllData *, ___buffer, d2, LONG, ___size, d3, LONG, ___data, d4, struct ExAllControl *, ___control, d5,\
      , DOS_BASE_NAME)

#define SetOwner(___name, ___owner_info) \
      LP2(0x3e4, BOOL, SetOwner , CONST_STRPTR, ___name, d1, LONG, ___owner_info, d2,\
      , DOS_BASE_NAME)

#endif /* !_INLINE_DOS_H */
