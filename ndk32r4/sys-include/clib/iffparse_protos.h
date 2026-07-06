/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_IFFPARSE_PROTOS_H
#define CLIB_IFFPARSE_PROTOS_H

/*
**   $VER: iffparse_protos.h $VER: iffparse_lib.sfd 47.1 (30.11.2021) $VER: iffparse_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <libraries/iffparse.h>
#include <utility/hooks.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "iffparse.library" */
/*
 Basic functions
*/

struct IFFHandle *AllocIFF(void);
LONG OpenIFF(struct IFFHandle *iff, LONG rwMode);
LONG ParseIFF(struct IFFHandle *iff, LONG control);
VOID CloseIFF(struct IFFHandle *iff);
VOID FreeIFF(struct IFFHandle *iff);

/* Read/Write functions */

LONG ReadChunkBytes(struct IFFHandle *iff, APTR buf, LONG numBytes);
LONG WriteChunkBytes(struct IFFHandle *iff, CONST_APTR buf, LONG numBytes);
LONG ReadChunkRecords(struct IFFHandle *iff, APTR buf, LONG bytesPerRecord, LONG numRecords);
LONG WriteChunkRecords(struct IFFHandle *iff, CONST_APTR buf, LONG bytesPerRecord, LONG numRecords);

/* Context entry/exit */

LONG PushChunk(struct IFFHandle *iff, LONG type, LONG id, LONG size);
LONG PopChunk(struct IFFHandle *iff);

/* Low-level handler installation */

LONG EntryHandler(struct IFFHandle *iff, LONG type, LONG id, LONG position, struct Hook *handler, APTR object);
LONG ExitHandler(struct IFFHandle *iff, LONG type, LONG id, LONG position, struct Hook *handler, APTR object);

/* Built-in chunk/property handlers */

LONG PropChunk(struct IFFHandle *iff, LONG type, LONG id);
LONG PropChunks(struct IFFHandle *iff, CONST LONG *propArray, LONG numPairs);
LONG StopChunk(struct IFFHandle *iff, LONG type, LONG id);
LONG StopChunks(struct IFFHandle *iff, CONST LONG *propArray, LONG numPairs);
LONG CollectionChunk(struct IFFHandle *iff, LONG type, LONG id);
LONG CollectionChunks(struct IFFHandle *iff, CONST LONG *propArray, LONG numPairs);
LONG StopOnExit(struct IFFHandle *iff, LONG type, LONG id);

/* Context utilities */

struct StoredProperty *FindProp(struct IFFHandle *iff, LONG type, LONG id);
struct CollectionItem *FindCollection(struct IFFHandle *iff, LONG type, LONG id);
struct ContextNode *FindPropContext(struct IFFHandle *iff);
struct ContextNode *CurrentChunk(struct IFFHandle *iff);
struct ContextNode *ParentChunk(struct ContextNode *contextNode);

/* LocalContextItem support functions */

struct LocalContextItem *AllocLocalItem(LONG type, LONG id, LONG ident, LONG dataSize);
APTR LocalItemData(struct LocalContextItem *localItem);
VOID SetLocalItemPurge(struct LocalContextItem *localItem, struct Hook *purgeHook);
VOID FreeLocalItem(struct LocalContextItem *localItem);
struct LocalContextItem *FindLocalItem(struct IFFHandle *iff, LONG type, LONG id, LONG ident);
LONG StoreLocalItem(struct IFFHandle *iff, struct LocalContextItem *localItem, LONG position);
VOID StoreItemInContext(struct IFFHandle *iff, struct LocalContextItem *localItem, struct ContextNode *contextNode);

/* IFFHandle initialization */

VOID InitIFF(struct IFFHandle *iff, LONG flags, struct Hook *streamHook);
VOID InitIFFasDOS(struct IFFHandle *iff);
VOID InitIFFasClip(struct IFFHandle *iff);

/* Internal clipboard support */

struct ClipboardHandle *OpenClipboard(LONG unitNumber);
VOID CloseClipboard(struct ClipboardHandle *clipHandle);

/* Miscellaneous */

LONG GoodID(LONG id);
LONG GoodType(LONG type);
STRPTR IDtoStr(LONG id, STRPTR buf);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_IFFPARSE_PROTOS_H */
