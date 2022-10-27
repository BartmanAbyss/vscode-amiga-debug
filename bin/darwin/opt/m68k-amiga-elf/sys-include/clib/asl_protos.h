#ifndef  CLIB_ASL_PROTOS_H
#define  CLIB_ASL_PROTOS_H

/*
**	$VER: asl_protos.h 38.3 (19.3.1992)
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
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef  LIBRARIES_ASL_H
#include <libraries/asl.h>
#endif
/*--- functions in V36 or higher (Release 2.0) ---*/

/* OBSOLETE -- Please use the generic requester functions instead */

struct FileRequester *AllocFileRequest( VOID );
VOID FreeFileRequest( struct FileRequester *fileReq );
BOOL RequestFile( struct FileRequester *fileReq );
APTR AllocAslRequest( ULONG reqType, struct TagItem *tagList );
APTR AllocAslRequestTags( ULONG reqType, Tag tag1, ... );
VOID FreeAslRequest( APTR requester );
BOOL AslRequest( APTR requester, struct TagItem *tagList );
BOOL AslRequestTags( APTR requester, Tag tag1, ... );
VOID AbortAslRequest( APTR requester );
VOID ActivateAslRequest( APTR requester );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_ASL_PROTOS_H */
