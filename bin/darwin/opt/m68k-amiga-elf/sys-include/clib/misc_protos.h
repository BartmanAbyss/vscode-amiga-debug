#ifndef  CLIB_MISC_PROTOS_H
#define  CLIB_MISC_PROTOS_H

/*
**	$VER: misc_protos.h 40.1 (17.5.1996)
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
UBYTE *AllocMiscResource( ULONG unitNum, CONST_STRPTR name );
VOID FreeMiscResource( ULONG unitNum );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_MISC_PROTOS_H */
