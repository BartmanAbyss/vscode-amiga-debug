#ifndef  CLIB_ALIB_STDIO_PROTOS_H
#define  CLIB_ALIB_STDIO_PROTOS_H

/*
**	$VER: alib_stdio_protos.h 40.1 (20.7.1996)
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

/* stdio functions that duplicate those in a typical C library */

LONG printf( CONST_STRPTR fmt, ... );
LONG sprintf( CONST_STRPTR buffer, CONST_STRPTR fmt, ... );
LONG fclose( LONG stream );
LONG fgetc( LONG stream );
LONG fprintf( LONG stream, CONST_STRPTR fmt, ... );
LONG fputc( LONG c, LONG stream );
LONG fputs( CONST_STRPTR s, LONG stream );
LONG getchar( VOID );
LONG putchar( ULONG c );
LONG puts( CONST_STRPTR s );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_ALIB_STDIO_PROTOS_H */
