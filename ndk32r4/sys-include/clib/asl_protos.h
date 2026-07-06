/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_ASL_PROTOS_H
#define CLIB_ASL_PROTOS_H

/*
**   $VER: asl_protos.h $VER: asl_lib.sfd 47.1 (30.11.2021) $VER: asl_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <utility/tagitem.h>
#include <libraries/asl.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "asl.library" */
/*
 OBSOLETE -- Please use the generic requester functions instead
*/

struct FileRequester *AllocFileRequest(void);
VOID FreeFileRequest(struct FileRequester *fileReq);
BOOL RequestFile(struct FileRequester *fileReq);
APTR AllocAslRequest(ULONG reqType, CONST struct TagItem *tagList);
APTR AllocAslRequestTags(ULONG reqType, Tag _tag1, ...);
VOID FreeAslRequest(APTR requester);
BOOL AslRequest(APTR requester, CONST struct TagItem *tagList);
BOOL AslRequestTags(APTR requester, Tag _tag1, ...);
VOID AbortAslRequest(APTR requester);
VOID ActivateAslRequest(APTR requester);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_ASL_PROTOS_H */
