#ifndef  CLIB_IFFPARSE_PROTOS_H
#define  CLIB_IFFPARSE_PROTOS_H

/*
**	$VER: iffparse_protos.h 40.2 (6.6.1998)
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
#ifndef  LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif
#ifndef  UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif
/*--- functions in V36 or higher (Release 2.0) ---*/

/* Basic functions */

struct IFFHandle *AllocIFF( VOID );
LONG OpenIFF( struct IFFHandle *iff, LONG rwMode );
LONG ParseIFF( struct IFFHandle *iff, LONG control );
VOID CloseIFF( struct IFFHandle *iff );
VOID FreeIFF( struct IFFHandle *iff );

/* Read/Write functions */

LONG ReadChunkBytes( struct IFFHandle *iff, APTR buf, LONG numBytes );
LONG WriteChunkBytes( struct IFFHandle *iff, CONST APTR buf, LONG numBytes );
LONG ReadChunkRecords( struct IFFHandle *iff, APTR buf, LONG bytesPerRecord, LONG numRecords );
LONG WriteChunkRecords( struct IFFHandle *iff, CONST APTR buf, LONG bytesPerRecord, LONG numRecords );

/* Context entry/exit */

LONG PushChunk( struct IFFHandle *iff, LONG type, LONG id, LONG size );
LONG PopChunk( struct IFFHandle *iff );

/* Low-level handler installation */

LONG EntryHandler( struct IFFHandle *iff, LONG type, LONG id, LONG position, struct Hook *handler, APTR object );
LONG ExitHandler( struct IFFHandle *iff, LONG type, LONG id, LONG position, struct Hook *handler, APTR object );

/* Built-in chunk/property handlers */

LONG PropChunk( struct IFFHandle *iff, LONG type, LONG id );
LONG PropChunks( struct IFFHandle *iff, CONST LONG *propArray, LONG numPairs );
LONG StopChunk( struct IFFHandle *iff, LONG type, LONG id );
LONG StopChunks( struct IFFHandle *iff, CONST LONG *propArray, LONG numPairs );
LONG CollectionChunk( struct IFFHandle *iff, LONG type, LONG id );
LONG CollectionChunks( struct IFFHandle *iff, CONST LONG *propArray, LONG numPairs );
LONG StopOnExit( struct IFFHandle *iff, LONG type, LONG id );

/* Context utilities */

struct StoredProperty *FindProp( CONST struct IFFHandle *iff, LONG type, LONG id );
struct CollectionItem *FindCollection( CONST struct IFFHandle *iff, LONG type, LONG id );
struct ContextNode *FindPropContext( CONST struct IFFHandle *iff );
struct ContextNode *CurrentChunk( CONST struct IFFHandle *iff );
struct ContextNode *ParentChunk( CONST struct ContextNode *contextNode );

/* LocalContextItem support functions */

struct LocalContextItem *AllocLocalItem( LONG type, LONG id, LONG ident, LONG dataSize );
APTR LocalItemData( CONST struct LocalContextItem *localItem );
VOID SetLocalItemPurge( struct LocalContextItem *localItem, CONST struct Hook *purgeHook );
VOID FreeLocalItem( struct LocalContextItem *localItem );
struct LocalContextItem *FindLocalItem( CONST struct IFFHandle *iff, LONG type, LONG id, LONG ident );
LONG StoreLocalItem( struct IFFHandle *iff, struct LocalContextItem *localItem, LONG position );
VOID StoreItemInContext( struct IFFHandle *iff, struct LocalContextItem *localItem, struct ContextNode *contextNode );

/* IFFHandle initialization */

VOID InitIFF( struct IFFHandle *iff, LONG flags, CONST struct Hook *streamHook );
VOID InitIFFasDOS( struct IFFHandle *iff );
VOID InitIFFasClip( struct IFFHandle *iff );

/* Internal clipboard support */

struct ClipboardHandle *OpenClipboard( LONG unitNumber );
VOID CloseClipboard( struct ClipboardHandle *clipHandle );

/* Miscellaneous */

LONG GoodID( LONG id );
LONG GoodType( LONG type );
STRPTR IDtoStr( LONG id, STRPTR buf );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_IFFPARSE_PROTOS_H */
