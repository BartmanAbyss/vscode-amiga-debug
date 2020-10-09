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

__stdargs LONG printf( CONST_STRPTR fmt, ... );
__stdargs LONG sprintf( CONST_STRPTR buffer, CONST_STRPTR fmt, ... );
__stdargs LONG fclose( LONG stream );
__stdargs LONG fgetc( LONG stream );
__stdargs LONG fprintf( LONG stream, CONST_STRPTR fmt, ... );
__stdargs LONG fputc( LONG c, LONG stream );
__stdargs LONG fputs( CONST_STRPTR s, LONG stream );
__stdargs LONG getchar( VOID );
__stdargs LONG putchar( ULONG c );
__stdargs LONG puts( CONST_STRPTR s );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_ALIB_STDIO_PROTOS_H */
