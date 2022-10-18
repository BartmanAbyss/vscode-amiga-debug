#ifndef  CLIB_NONVOLATILE_PROTOS_H
#define  CLIB_NONVOLATILE_PROTOS_H

/*
**	$VER: nonvolatile_protos.h 40.1 (17.5.1996)
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
#ifndef  EXEC_LISTS_H
#include <exec/lists.h>
#endif
#ifndef  LIBRARIES_NONVOLATILE_H
#include <libraries/nonvolatile.h>
#endif
/*--- functions in V40 or higher (Release 3.1) ---*/
APTR GetCopyNV( CONST_STRPTR appName, CONST_STRPTR itemName, LONG killRequesters );
VOID FreeNVData( APTR data );
UWORD StoreNV( CONST_STRPTR appName, CONST_STRPTR itemName, CONST APTR data, ULONG length, LONG killRequesters );
BOOL DeleteNV( CONST_STRPTR appName, CONST_STRPTR itemName, LONG killRequesters );
struct NVInfo *GetNVInfo( LONG killRequesters );
struct MinList *GetNVList( CONST_STRPTR appName, LONG killRequesters );
BOOL SetNVProtection( CONST_STRPTR appName, CONST_STRPTR itemName, LONG mask, LONG killRequesters );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_NONVOLATILE_PROTOS_H */
