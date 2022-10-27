#ifndef  CLIB_EXPANSION_PROTOS_H
#define  CLIB_EXPANSION_PROTOS_H

/*
**	$VER: expansion_protos.h 40.2 (6.6.1998)
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
#ifndef  LIBRARIES_CONFIGVARS_H
#include <libraries/configvars.h>
#endif
#ifndef  DOS_FILEHANDLER_H
#include <dos/filehandler.h>
#endif
/*--- functions in V33 or higher (Release 1.2) ---*/
VOID AddConfigDev( struct ConfigDev *configDev );
/*--- functions in V36 or higher (Release 2.0) ---*/
BOOL AddBootNode( LONG bootPri, ULONG flags, struct DeviceNode *deviceNode, struct ConfigDev *configDev );
/*--- functions in V33 or higher (Release 1.2) ---*/
VOID AllocBoardMem( ULONG slotSpec );
struct ConfigDev *AllocConfigDev( VOID );
APTR AllocExpansionMem( ULONG numSlots, ULONG slotAlign );
VOID ConfigBoard( APTR board, struct ConfigDev *configDev );
VOID ConfigChain( APTR baseAddr );
struct ConfigDev *FindConfigDev( CONST struct ConfigDev *oldConfigDev, LONG manufacturer, LONG product );
VOID FreeBoardMem( ULONG startSlot, ULONG slotSpec );
VOID FreeConfigDev( struct ConfigDev *configDev );
VOID FreeExpansionMem( ULONG startSlot, ULONG numSlots );
UBYTE ReadExpansionByte( CONST APTR board, ULONG offset );
VOID ReadExpansionRom( CONST APTR board, struct ConfigDev *configDev );
VOID RemConfigDev( struct ConfigDev *configDev );
VOID WriteExpansionByte( APTR board, ULONG offset, ULONG byte );
VOID ObtainConfigBinding( VOID );
VOID ReleaseConfigBinding( VOID );
VOID SetCurrentBinding( struct CurrentBinding *currentBinding, ULONG bindingSize );
ULONG GetCurrentBinding( CONST struct CurrentBinding *currentBinding, ULONG bindingSize );
struct DeviceNode *MakeDosNode( CONST APTR parmPacket );
BOOL AddDosNode( LONG bootPri, ULONG flags, struct DeviceNode *deviceNode );
/*--- functions in V36 or higher (Release 2.0) ---*/

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_EXPANSION_PROTOS_H */
