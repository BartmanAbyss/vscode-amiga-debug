/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef _INLINE_REXXSYSLIB_H
#define _INLINE_REXXSYSLIB_H

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

#ifndef REXXSYSLIB_BASE_NAME
#define REXXSYSLIB_BASE_NAME RexxSysBase
#endif /* !REXXSYSLIB_BASE_NAME */

#define CreateArgstring(___string, ___length) \
      LP2(0x7e, UBYTE, *CreateArgstring , CONST_STRPTR, ___string, a0, ULONG, ___length, d0,\
      , REXXSYSLIB_BASE_NAME)

#define DeleteArgstring(___argstring) \
      LP1NR(0x84, DeleteArgstring , UBYTE *, ___argstring, a0,\
      , REXXSYSLIB_BASE_NAME)

#define LengthArgstring(___argstring) \
      LP1(0x8a, ULONG, LengthArgstring , CONST UBYTE *, ___argstring, a0,\
      , REXXSYSLIB_BASE_NAME)

#define CreateRexxMsg(___port, ___extension, ___host) \
      LP3(0x90, struct RexxMsg, *CreateRexxMsg , struct MsgPort *, ___port, a0, CONST_STRPTR, ___extension, a1, CONST_STRPTR, ___host, d0,\
      , REXXSYSLIB_BASE_NAME)

#define DeleteRexxMsg(___packet) \
      LP1NR(0x96, DeleteRexxMsg , struct RexxMsg *, ___packet, a0,\
      , REXXSYSLIB_BASE_NAME)

#define ClearRexxMsg(___msgptr, ___count) \
      LP2NR(0x9c, ClearRexxMsg , struct RexxMsg *, ___msgptr, a0, ULONG, ___count, d0,\
      , REXXSYSLIB_BASE_NAME)

#define FillRexxMsg(___msgptr, ___count, ___mask) \
      LP3(0xa2, BOOL, FillRexxMsg , struct RexxMsg *, ___msgptr, a0, ULONG, ___count, d0, ULONG, ___mask, d1,\
      , REXXSYSLIB_BASE_NAME)

#define IsRexxMsg(___msgptr) \
      LP1(0xa8, BOOL, IsRexxMsg , CONST struct RexxMsg *, ___msgptr, a0,\
      , REXXSYSLIB_BASE_NAME)

#define LockRexxBase(___resource) \
      LP1NR(0x1c2, LockRexxBase , ULONG, ___resource, d0,\
      , REXXSYSLIB_BASE_NAME)

#define UnlockRexxBase(___resource) \
      LP1NR(0x1c8, UnlockRexxBase , ULONG, ___resource, d0,\
      , REXXSYSLIB_BASE_NAME)

#define CreateRexxHostPort(___basename) \
      LP1(0x1e0, struct MsgPort, *CreateRexxHostPort , CONST_STRPTR, ___basename, a0,\
      , REXXSYSLIB_BASE_NAME)

#define DeleteRexxHostPort(___port) \
      LP1NR(0x1e6, DeleteRexxHostPort , struct MsgPort *, ___port, a0,\
      , REXXSYSLIB_BASE_NAME)

#define GetRexxVarFromMsg(___var, ___msgptr, ___value) \
      LP3(0x1ec, LONG, GetRexxVarFromMsg , CONST_STRPTR, ___var, a0, CONST struct RexxMsg *, ___msgptr, a2, STRPTR, ___value, a1,\
      , REXXSYSLIB_BASE_NAME)

#define SetRexxVarFromMsg(___var, ___msgptr, ___value) \
      LP3(0x1f2, LONG, SetRexxVarFromMsg , CONST_STRPTR, ___var, a0, struct RexxMsg *, ___msgptr, a2, CONST_STRPTR, ___value, a1,\
      , REXXSYSLIB_BASE_NAME)

#define LaunchRexxScript(___script, ___replyport, ___extension, ___input, ___output) \
      LP5(0x1f8, struct RexxMsg, *LaunchRexxScript , CONST_STRPTR, ___script, a0, struct MsgPort *, ___replyport, a1, CONST_STRPTR, ___extension, a2, BPTR, ___input, d1, BPTR, ___output, d2,\
      , REXXSYSLIB_BASE_NAME)

#define FreeRexxMsg(___msgptr) \
      LP1NR(0x1fe, FreeRexxMsg , struct RexxMsg *, ___msgptr, a0,\
      , REXXSYSLIB_BASE_NAME)

#define GetRexxBufferFromMsg(___var, ___msgptr, ___buffer, ___buffer_size) \
      LP4(0x204, LONG, GetRexxBufferFromMsg , CONST_STRPTR, ___var, a0, CONST struct RexxMsg *, ___msgptr, a2, STRPTR, ___buffer, a1, ULONG, ___buffer_size, d0,\
      , REXXSYSLIB_BASE_NAME)

#endif /* !_INLINE_REXXSYSLIB_H */
