/* Automatically generated header (sfdc 1.11)! Do not edit! */

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
      LP2(0x7e, UBYTE *, CreateArgstring , const STRPTR, ___string, a0, ULONG, ___length, d0,\
      , REXXSYSLIB_BASE_NAME)

#define DeleteArgstring(___argstring) \
      LP1NR(0x84, DeleteArgstring , UBYTE *, ___argstring, a0,\
      , REXXSYSLIB_BASE_NAME)

#define LengthArgstring(___argstring) \
      LP1(0x8a, ULONG, LengthArgstring , const UBYTE *, ___argstring, a0,\
      , REXXSYSLIB_BASE_NAME)

#define CreateRexxMsg(___port, ___extension, ___host) \
      LP3(0x90, struct RexxMsg *, CreateRexxMsg , const struct MsgPort *, ___port, a0, CONST_STRPTR, ___extension, a1, CONST_STRPTR, ___host, d0,\
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
      LP1(0xa8, BOOL, IsRexxMsg , const struct RexxMsg *, ___msgptr, a0,\
      , REXXSYSLIB_BASE_NAME)

#define LockRexxBase(___resource) \
      LP1NR(0x1c2, LockRexxBase , ULONG, ___resource, d0,\
      , REXXSYSLIB_BASE_NAME)

#define UnlockRexxBase(___resource) \
      LP1NR(0x1c8, UnlockRexxBase , ULONG, ___resource, d0,\
      , REXXSYSLIB_BASE_NAME)

#endif /* !_INLINE_REXXSYSLIB_H */
