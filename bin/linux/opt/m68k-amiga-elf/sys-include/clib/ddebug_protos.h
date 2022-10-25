#ifndef  CLIB_DDEBUG_PROTOS_H
#define  CLIB_DDEBUG_PROTOS_H

/*
**	$VER: ddebug_protos.h 40.1 (17.5.1996)
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
VOID DDoFmt( CONST_STRPTR formatString, CONST APTR dataStream, CONST APTR putChProc, APTR putChData );
LONG DGetChar( VOID );
LONG dgetchar( VOID );
LONG dgetch( VOID );
LONG dgetc( VOID );
LONG DGetNum( VOID );
LONG dgetnum( VOID );
LONG DMayGetChar( VOID );
LONG DMayGetCh( VOID );
VOID DPutChar( LONG ch );
VOID dputchar( LONG ch );
VOID dputch( LONG ch );
VOID dputc( LONG ch );
VOID DPutCh( LONG ch );
VOID DPutFmt( CONST_STRPTR formatString, CONST APTR values );
VOID DVPrintF( CONST_STRPTR formatString, CONST APTR values );
VOID DPrintF( CONST_STRPTR formatString, ... );
VOID dprintf( CONST_STRPTR formatString, ... );
VOID DPutStr( CONST_STRPTR string );
VOID dputstr( CONST_STRPTR string );
VOID dputs( CONST_STRPTR string );
VOID DPutS( CONST_STRPTR string );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_DDEBUG_PROTOS_H */
