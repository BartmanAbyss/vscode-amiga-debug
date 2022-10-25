#ifndef  CLIB_RAMDRIVE_PROTOS_H
#define  CLIB_RAMDRIVE_PROTOS_H

/*
**	$VER: ramdrive_protos.h 40.1 (17.5.1996)
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
/*--- functions in V34 or higher (Release 1.3) ---*/
STRPTR KillRAD0( VOID );
/*--- functions in V36 or higher (Release 2.0) ---*/
STRPTR KillRAD( ULONG unit );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_RAMDRIVE_PROTOS_H */
