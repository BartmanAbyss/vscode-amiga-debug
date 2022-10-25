#ifndef  CLIB_DISK_PROTOS_H
#define  CLIB_DISK_PROTOS_H

/*
**	$VER: disk_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  RESOURCES_DISK_H
#include <resources/disk.h>
#endif
BOOL AllocUnit( LONG unitNum );
VOID FreeUnit( LONG unitNum );
struct DiscResourceUnit *GetUnit( struct DiscResourceUnit *unitPointer );
VOID GiveUnit( VOID );
LONG GetUnitID( LONG unitNum );
/*------ new for V37 ------*/
LONG ReadUnitID( LONG unitNum );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_DISK_PROTOS_H */
