#ifndef  CLIB_REXXSYSLIB_PROTOS_H
#define  CLIB_REXXSYSLIB_PROTOS_H

/*
**	$VER: rexxsyslib_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/*--- functions in V33 or higher (Release 1.2) ---*/
#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  REXX_RXSLIB_H
#include <rexx/rxslib.h>
#endif
#ifndef  REXX_REXXIO_H
#include <rexx/rexxio.h>
#endif

UBYTE *CreateArgstring( CONST STRPTR string, ULONG length );
VOID DeleteArgstring( UBYTE *argstring );
ULONG LengthArgstring( CONST UBYTE *argstring );
struct RexxMsg *CreateRexxMsg( CONST struct MsgPort *port, CONST_STRPTR extension, CONST_STRPTR host );
VOID DeleteRexxMsg( struct RexxMsg *packet );
VOID ClearRexxMsg( struct RexxMsg *msgptr, ULONG count );
BOOL FillRexxMsg( struct RexxMsg *msgptr, ULONG count, ULONG mask );
BOOL IsRexxMsg( CONST struct RexxMsg *msgptr );


VOID LockRexxBase( ULONG resource );
VOID UnlockRexxBase( ULONG resource );


#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_REXXSYSLIB_PROTOS_H */
