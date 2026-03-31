/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_REXXSYSLIB_PROTOS_H
#define CLIB_REXXSYSLIB_PROTOS_H

/*
**   $VER: rexxsyslib_protos.h $VER: rexxsyslib_lib.sfd 47.1 (30.11.2021) $VER: rexxsyslib_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <rexx/rxslib.h>
#include <rexx/rexxio.h>
#include <dos/dos.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V33 or higher ---*/

/* "rexxsyslib.library" */
/*

*/
UBYTE *CreateArgstring(CONST_STRPTR string, ULONG length);
VOID DeleteArgstring(UBYTE *argstring);
ULONG LengthArgstring(CONST UBYTE *argstring);
struct RexxMsg *CreateRexxMsg(struct MsgPort *port, CONST_STRPTR extension, CONST_STRPTR host);
VOID DeleteRexxMsg(struct RexxMsg *packet);
VOID ClearRexxMsg(struct RexxMsg *msgptr, ULONG count);
BOOL FillRexxMsg(struct RexxMsg *msgptr, ULONG count, ULONG mask);
BOOL IsRexxMsg(CONST struct RexxMsg *msgptr);
VOID LockRexxBase(ULONG resource);
VOID UnlockRexxBase(ULONG resource);

/*--- function in V45 or higher (Release 3.9) ---*/

struct MsgPort *CreateRexxHostPort(CONST_STRPTR basename);
VOID DeleteRexxHostPort(struct MsgPort *port);
LONG GetRexxVarFromMsg(CONST_STRPTR var, CONST struct RexxMsg *msgptr, STRPTR value);
LONG SetRexxVarFromMsg(CONST_STRPTR var, struct RexxMsg *msgptr, CONST_STRPTR value);
struct RexxMsg *LaunchRexxScript(CONST_STRPTR script, struct MsgPort *replyport, CONST_STRPTR extension, BPTR input, BPTR output);
VOID FreeRexxMsg(struct RexxMsg *msgptr);

/*--- function in V47 or higher (Release 3.2) ---*/

LONG GetRexxBufferFromMsg(CONST_STRPTR var, CONST struct RexxMsg *msgptr, STRPTR buffer, ULONG buffer_size);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_REXXSYSLIB_PROTOS_H */
