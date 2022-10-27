#ifndef  CLIB_DOS_PROTOS_H
#define  CLIB_DOS_PROTOS_H

/*
**	$VER: dos_protos.h 40.2 (6.6.1998)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  DOS_DOS_H
#include <dos/dos.h>
#endif
#ifndef  DOS_DOSEXTENS_H
#include <dos/dosextens.h>
#endif
#ifndef  DOS_RECORD_H
#include <dos/record.h>
#endif
#ifndef  DOS_RDARGS_H
#include <dos/rdargs.h>
#endif
#ifndef  DOS_DOSASL_H
#include <dos/dosasl.h>
#endif
#ifndef  DOS_VAR_H
#include <dos/var.h>
#endif
#ifndef  DOS_NOTIFY_H
#include <dos/notify.h>
#endif
#ifndef  DOS_DATETIME_H
#include <dos/datetime.h>
#endif
#ifndef  DOS_EXALL_H
#include <dos/exall.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
BPTR Open( CONST_STRPTR name, LONG accessMode );
LONG Close( BPTR file );
LONG Read( BPTR file, APTR buffer, LONG length );
LONG Write( BPTR file, CONST APTR buffer, LONG length );
BPTR Input( VOID );
BPTR Output( VOID );
LONG Seek( BPTR file, LONG position, LONG offset );
LONG DeleteFile( CONST_STRPTR name );
LONG Rename( CONST_STRPTR oldName, CONST_STRPTR newName );
BPTR Lock( CONST_STRPTR name, LONG type );
VOID UnLock( BPTR lock );
BPTR DupLock( BPTR lock );
LONG Examine( BPTR lock, struct FileInfoBlock *fileInfoBlock );
LONG ExNext( BPTR lock, struct FileInfoBlock *fileInfoBlock );
LONG Info( BPTR lock, struct InfoData *parameterBlock );
BPTR CreateDir( CONST_STRPTR name );
BPTR CurrentDir( BPTR lock );
LONG IoErr( VOID );
struct MsgPort *CreateProc( CONST_STRPTR name, LONG pri, BPTR segList, LONG stackSize );
VOID Exit( LONG returnCode );
BPTR LoadSeg( CONST_STRPTR name );
VOID UnLoadSeg( BPTR seglist );
struct MsgPort *DeviceProc( CONST_STRPTR name );
LONG SetComment( CONST_STRPTR name, CONST_STRPTR comment );
LONG SetProtection( CONST_STRPTR name, LONG protect );
struct DateStamp *DateStamp( struct DateStamp *date );
VOID Delay( LONG timeout );
LONG WaitForChar( BPTR file, LONG timeout );
BPTR ParentDir( BPTR lock );
LONG IsInteractive( BPTR file );
LONG Execute( CONST_STRPTR string, BPTR file, BPTR file2 );
/*--- functions in V36 or higher (Release 2.0) ---*/
/*	DOS Object creation/deletion */
APTR AllocDosObject( ULONG type, CONST struct TagItem *tags );
APTR AllocDosObjectTagList( ULONG type, CONST struct TagItem *tags );
APTR AllocDosObjectTags( ULONG type, ULONG tag1type, ... );
VOID FreeDosObject( ULONG type, APTR ptr );
/*	Packet Level routines */
LONG DoPkt( struct MsgPort *port, LONG action, LONG arg1, LONG arg2, LONG arg3, LONG arg4, LONG arg5 );
LONG DoPkt0( struct MsgPort *port, LONG action );
LONG DoPkt1( struct MsgPort *port, LONG action, LONG arg1 );
LONG DoPkt2( struct MsgPort *port, LONG action, LONG arg1, LONG arg2 );
LONG DoPkt3( struct MsgPort *port, LONG action, LONG arg1, LONG arg2, LONG arg3 );
LONG DoPkt4( struct MsgPort *port, LONG action, LONG arg1, LONG arg2, LONG arg3, LONG arg4 );
VOID SendPkt( struct DosPacket *dp, struct MsgPort *port, struct MsgPort *replyport );
struct DosPacket *WaitPkt( VOID );
VOID ReplyPkt( struct DosPacket *dp, LONG res1, LONG res2 );
VOID AbortPkt( struct MsgPort *port, struct DosPacket *pkt );
/*	Record Locking */
BOOL LockRecord( BPTR fh, ULONG offset, ULONG length, ULONG mode, ULONG timeout );
BOOL LockRecords( struct RecordLock *recArray, ULONG timeout );
BOOL UnLockRecord( BPTR fh, ULONG offset, ULONG length );
BOOL UnLockRecords( struct RecordLock *recArray );
/*	Buffered File I/O */
BPTR SelectInput( BPTR fh );
BPTR SelectOutput( BPTR fh );
LONG FGetC( BPTR fh );
LONG FPutC( BPTR fh, LONG ch );
LONG UnGetC( BPTR fh, LONG character );
LONG FRead( BPTR fh, APTR block, ULONG blocklen, ULONG number );
LONG FWrite( BPTR fh, CONST APTR block, ULONG blocklen, ULONG number );
STRPTR FGets( BPTR fh, STRPTR buf, ULONG buflen );
LONG FPuts( BPTR fh, CONST_STRPTR str );
VOID VFWritef( BPTR fh, CONST_STRPTR format, CONST LONG *argarray );
VOID FWritef( BPTR fh, CONST_STRPTR format, ... );
LONG VFPrintf( BPTR fh, CONST_STRPTR format, CONST APTR argarray );
LONG FPrintf( BPTR fh, CONST_STRPTR format, ... );
LONG Flush( BPTR fh );
LONG SetVBuf( BPTR fh, STRPTR buff, LONG type, LONG size );
/*	DOS Object Management */
BPTR DupLockFromFH( BPTR fh );
BPTR OpenFromLock( BPTR lock );
BPTR ParentOfFH( BPTR fh );
BOOL ExamineFH( BPTR fh, struct FileInfoBlock *fib );
LONG SetFileDate( CONST_STRPTR name, CONST struct DateStamp *date );
LONG NameFromLock( BPTR lock, STRPTR buffer, LONG len );
LONG NameFromFH( BPTR fh, STRPTR buffer, LONG len );
WORD SplitName( CONST_STRPTR name, ULONG separator, STRPTR buf, LONG oldpos, LONG size );
LONG SameLock( BPTR lock1, BPTR lock2 );
LONG SetMode( BPTR fh, LONG mode );
LONG ExAll( BPTR lock, struct ExAllData *buffer, LONG size, LONG data, struct ExAllControl *control );
LONG ReadLink( struct MsgPort *port, BPTR lock, CONST_STRPTR path, STRPTR buffer, ULONG size );
LONG MakeLink( CONST_STRPTR name, LONG dest, LONG soft );
LONG ChangeMode( LONG type, BPTR fh, LONG newmode );
LONG SetFileSize( BPTR fh, LONG pos, LONG mode );
/*	Error Handling */
LONG SetIoErr( LONG result );
BOOL Fault( LONG code, STRPTR header, STRPTR buffer, LONG len );
BOOL PrintFault( LONG code, CONST_STRPTR header );
LONG ErrorReport( LONG code, LONG type, ULONG arg1, struct MsgPort *device );
/*	Process Management */
struct CommandLineInterface *Cli( VOID );
struct Process *CreateNewProc( CONST struct TagItem *tags );
struct Process *CreateNewProcTagList( CONST struct TagItem *tags );
struct Process *CreateNewProcTags( ULONG tag1type, ... );
LONG RunCommand( BPTR seg, LONG stack, CONST_STRPTR paramptr, LONG paramlen );
struct MsgPort *GetConsoleTask( VOID );
struct MsgPort *SetConsoleTask( CONST struct MsgPort *task );
struct MsgPort *GetFileSysTask( VOID );
struct MsgPort *SetFileSysTask( CONST struct MsgPort *task );
STRPTR GetArgStr( VOID );
BOOL SetArgStr( CONST_STRPTR string );
struct Process *FindCliProc( ULONG num );
ULONG MaxCli( VOID );
BOOL SetCurrentDirName( CONST_STRPTR name );
BOOL GetCurrentDirName( STRPTR buf, LONG len );
BOOL SetProgramName( CONST_STRPTR name );
BOOL GetProgramName( STRPTR buf, LONG len );
BOOL SetPrompt( CONST_STRPTR name );
BOOL GetPrompt( STRPTR buf, LONG len );
BPTR SetProgramDir( BPTR lock );
BPTR GetProgramDir( VOID );
/*	Device List Management */
LONG SystemTagList( CONST_STRPTR command, CONST struct TagItem *tags );
LONG System( CONST_STRPTR command, CONST struct TagItem *tags );
LONG SystemTags( CONST_STRPTR command, ULONG tag1type, ... );
LONG AssignLock( CONST_STRPTR name, BPTR lock );
BOOL AssignLate( CONST_STRPTR name, CONST_STRPTR path );
BOOL AssignPath( CONST_STRPTR name, CONST_STRPTR path );
BOOL AssignAdd( CONST_STRPTR name, BPTR lock );
LONG RemAssignList( CONST_STRPTR name, BPTR lock );
struct DevProc *GetDeviceProc( CONST_STRPTR name, struct DevProc *dp );
VOID FreeDeviceProc( struct DevProc *dp );
struct DosList *LockDosList( ULONG flags );
VOID UnLockDosList( ULONG flags );
struct DosList *AttemptLockDosList( ULONG flags );
BOOL RemDosEntry( struct DosList *dlist );
LONG AddDosEntry( struct DosList *dlist );
struct DosList *FindDosEntry( CONST struct DosList *dlist, CONST_STRPTR name, ULONG flags );
struct DosList *NextDosEntry( CONST struct DosList *dlist, ULONG flags );
struct DosList *MakeDosEntry( CONST_STRPTR name, LONG type );
VOID FreeDosEntry( struct DosList *dlist );
BOOL IsFileSystem( CONST_STRPTR name );
/*	Handler Interface */
BOOL Format( CONST_STRPTR filesystem, CONST_STRPTR volumename, ULONG dostype );
LONG Relabel( CONST_STRPTR drive, CONST_STRPTR newname );
LONG Inhibit( CONST_STRPTR name, LONG onoff );
LONG AddBuffers( CONST_STRPTR name, LONG number );
/*	Date, Time Routines */
LONG CompareDates( CONST struct DateStamp *date1, CONST struct DateStamp *date2 );
LONG DateToStr( struct DateTime *datetime );
LONG StrToDate( struct DateTime *datetime );
/*	Image Management */
BPTR InternalLoadSeg( BPTR fh, BPTR table, CONST LONG *funcarray, LONG *stack );
BOOL InternalUnLoadSeg( BPTR seglist, VOID (*CONST freefunc)() );
BPTR NewLoadSeg( CONST_STRPTR file, CONST struct TagItem *tags );
BPTR NewLoadSegTagList( CONST_STRPTR file, CONST struct TagItem *tags );
BPTR NewLoadSegTags( CONST_STRPTR file, ULONG tag1type, ... );
LONG AddSegment( CONST_STRPTR name, BPTR seg, LONG system );
struct Segment *FindSegment( CONST_STRPTR name, CONST struct Segment *seg, LONG system );
LONG RemSegment( struct Segment *seg );
/*	Command Support */
LONG CheckSignal( LONG mask );
struct RDArgs *ReadArgs( CONST_STRPTR arg_template, LONG *array, struct RDArgs *args );
LONG FindArg( CONST_STRPTR keyword, CONST_STRPTR arg_template );
LONG ReadItem( CONST_STRPTR name, LONG maxchars, struct CSource *cSource );
LONG StrToLong( CONST_STRPTR string, LONG *value );
LONG MatchFirst( CONST_STRPTR pat, struct AnchorPath *anchor );
LONG MatchNext( struct AnchorPath *anchor );
VOID MatchEnd( struct AnchorPath *anchor );
LONG ParsePattern( CONST_STRPTR pat, STRPTR buf, LONG buflen );
BOOL MatchPattern( CONST_STRPTR pat, STRPTR str );
VOID FreeArgs( struct RDArgs *args );
STRPTR FilePart( CONST_STRPTR path );
STRPTR PathPart( CONST_STRPTR path );
BOOL AddPart( STRPTR dirname, CONST_STRPTR filename, ULONG size );
/*	Notification */
BOOL StartNotify( struct NotifyRequest *notify );
VOID EndNotify( struct NotifyRequest *notify );
/*	Environment Variable functions */
BOOL SetVar( CONST_STRPTR name, CONST_STRPTR buffer, LONG size, LONG flags );
LONG GetVar( CONST_STRPTR name, STRPTR buffer, LONG size, LONG flags );
LONG DeleteVar( CONST_STRPTR name, ULONG flags );
struct LocalVar *FindVar( CONST_STRPTR name, ULONG type );
LONG CliInitNewcli( struct DosPacket *dp );
LONG CliInitRun( struct DosPacket *dp );
LONG WriteChars( CONST_STRPTR buf, ULONG buflen );
LONG PutStr( CONST_STRPTR str );
LONG VPrintf( CONST_STRPTR format, CONST APTR argarray );
LONG Printf( CONST_STRPTR format, ... );
/* these were unimplemented until dos 36.147 */
LONG ParsePatternNoCase( CONST_STRPTR pat, UBYTE *buf, LONG buflen );
BOOL MatchPatternNoCase( CONST_STRPTR pat, STRPTR str );
/* this was added for V37 dos, returned 0 before then. */
BOOL SameDevice( BPTR lock1, BPTR lock2 );

/* NOTE: the following entries did NOT exist before ks 36.303 (2.02) */
/* If you are going to use them, open dos.library with version 37 */

/* These calls were added for V39 dos: */
VOID ExAllEnd( BPTR lock, struct ExAllData *buffer, LONG size, LONG data, struct ExAllControl *control );
BOOL SetOwner( CONST_STRPTR name, LONG owner_info );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_DOS_PROTOS_H */
