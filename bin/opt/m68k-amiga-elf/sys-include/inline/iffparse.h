/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_IFFPARSE_H
#define _INLINE_IFFPARSE_H

#ifndef _SFDC_VARARG_DEFINED
#define _SFDC_VARARG_DEFINED
#ifdef __HAVE_IPTR_ATTR__
typedef APTR _sfdc_vararg __attribute__((iptr));
#else
typedef ULONG _sfdc_vararg;
#endif /* __HAVE_IPTR_ATTR__ */
#endif /* _SFDC_VARARG_DEFINED */

#ifndef __INLINE_MACROS_H
#include <inline/macros.h>
#endif /* !__INLINE_MACROS_H */

#ifndef IFFPARSE_BASE_NAME
#define IFFPARSE_BASE_NAME IFFParseBase
#endif /* !IFFPARSE_BASE_NAME */

#define AllocIFF() \
      LP0(0x1e, struct IFFHandle *, AllocIFF ,\
      , IFFPARSE_BASE_NAME)

#define OpenIFF(___iff, ___rwMode) \
      LP2(0x24, LONG, OpenIFF , struct IFFHandle *, ___iff, a0, LONG, ___rwMode, d0,\
      , IFFPARSE_BASE_NAME)

#define ParseIFF(___iff, ___control) \
      LP2(0x2a, LONG, ParseIFF , struct IFFHandle *, ___iff, a0, LONG, ___control, d0,\
      , IFFPARSE_BASE_NAME)

#define CloseIFF(___iff) \
      LP1NR(0x30, CloseIFF , struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define FreeIFF(___iff) \
      LP1NR(0x36, FreeIFF , struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define ReadChunkBytes(___iff, ___buf, ___numBytes) \
      LP3(0x3c, LONG, ReadChunkBytes , struct IFFHandle *, ___iff, a0, APTR, ___buf, a1, LONG, ___numBytes, d0,\
      , IFFPARSE_BASE_NAME)

#define WriteChunkBytes(___iff, ___buf, ___numBytes) \
      LP3(0x42, LONG, WriteChunkBytes , struct IFFHandle *, ___iff, a0, const APTR, ___buf, a1, LONG, ___numBytes, d0,\
      , IFFPARSE_BASE_NAME)

#define ReadChunkRecords(___iff, ___buf, ___bytesPerRecord, ___numRecords) \
      LP4(0x48, LONG, ReadChunkRecords , struct IFFHandle *, ___iff, a0, APTR, ___buf, a1, LONG, ___bytesPerRecord, d0, LONG, ___numRecords, d1,\
      , IFFPARSE_BASE_NAME)

#define WriteChunkRecords(___iff, ___buf, ___bytesPerRecord, ___numRecords) \
      LP4(0x4e, LONG, WriteChunkRecords , struct IFFHandle *, ___iff, a0, const APTR, ___buf, a1, LONG, ___bytesPerRecord, d0, LONG, ___numRecords, d1,\
      , IFFPARSE_BASE_NAME)

#define PushChunk(___iff, ___type, ___id, ___size) \
      LP4(0x54, LONG, PushChunk , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1, LONG, ___size, d2,\
      , IFFPARSE_BASE_NAME)

#define PopChunk(___iff) \
      LP1(0x5a, LONG, PopChunk , struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define EntryHandler(___iff, ___type, ___id, ___position, ___handler, ___object) \
      LP6(0x66, LONG, EntryHandler , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1, LONG, ___position, d2, struct Hook *, ___handler, a1, APTR, ___object, a2,\
      , IFFPARSE_BASE_NAME)

#define ExitHandler(___iff, ___type, ___id, ___position, ___handler, ___object) \
      LP6(0x6c, LONG, ExitHandler , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1, LONG, ___position, d2, struct Hook *, ___handler, a1, APTR, ___object, a2,\
      , IFFPARSE_BASE_NAME)

#define PropChunk(___iff, ___type, ___id) \
      LP3(0x72, LONG, PropChunk , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1,\
      , IFFPARSE_BASE_NAME)

#define PropChunks(___iff, ___propArray, ___numPairs) \
      LP3(0x78, LONG, PropChunks , struct IFFHandle *, ___iff, a0, const LONG *, ___propArray, a1, LONG, ___numPairs, d0,\
      , IFFPARSE_BASE_NAME)

#define StopChunk(___iff, ___type, ___id) \
      LP3(0x7e, LONG, StopChunk , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1,\
      , IFFPARSE_BASE_NAME)

#define StopChunks(___iff, ___propArray, ___numPairs) \
      LP3(0x84, LONG, StopChunks , struct IFFHandle *, ___iff, a0, const LONG *, ___propArray, a1, LONG, ___numPairs, d0,\
      , IFFPARSE_BASE_NAME)

#define CollectionChunk(___iff, ___type, ___id) \
      LP3(0x8a, LONG, CollectionChunk , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1,\
      , IFFPARSE_BASE_NAME)

#define CollectionChunks(___iff, ___propArray, ___numPairs) \
      LP3(0x90, LONG, CollectionChunks , struct IFFHandle *, ___iff, a0, const LONG *, ___propArray, a1, LONG, ___numPairs, d0,\
      , IFFPARSE_BASE_NAME)

#define StopOnExit(___iff, ___type, ___id) \
      LP3(0x96, LONG, StopOnExit , struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1,\
      , IFFPARSE_BASE_NAME)

#define FindProp(___iff, ___type, ___id) \
      LP3(0x9c, struct StoredProperty *, FindProp , const struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1,\
      , IFFPARSE_BASE_NAME)

#define FindCollection(___iff, ___type, ___id) \
      LP3(0xa2, struct CollectionItem *, FindCollection , const struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1,\
      , IFFPARSE_BASE_NAME)

#define FindPropContext(___iff) \
      LP1(0xa8, struct ContextNode *, FindPropContext , const struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define CurrentChunk(___iff) \
      LP1(0xae, struct ContextNode *, CurrentChunk , const struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define ParentChunk(___contextNode) \
      LP1(0xb4, struct ContextNode *, ParentChunk , const struct ContextNode *, ___contextNode, a0,\
      , IFFPARSE_BASE_NAME)

#define AllocLocalItem(___type, ___id, ___ident, ___dataSize) \
      LP4(0xba, struct LocalContextItem *, AllocLocalItem , LONG, ___type, d0, LONG, ___id, d1, LONG, ___ident, d2, LONG, ___dataSize, d3,\
      , IFFPARSE_BASE_NAME)

#define LocalItemData(___localItem) \
      LP1(0xc0, APTR, LocalItemData , const struct LocalContextItem *, ___localItem, a0,\
      , IFFPARSE_BASE_NAME)

#define SetLocalItemPurge(___localItem, ___purgeHook) \
      LP2NR(0xc6, SetLocalItemPurge , struct LocalContextItem *, ___localItem, a0, const struct Hook *, ___purgeHook, a1,\
      , IFFPARSE_BASE_NAME)

#define FreeLocalItem(___localItem) \
      LP1NR(0xcc, FreeLocalItem , struct LocalContextItem *, ___localItem, a0,\
      , IFFPARSE_BASE_NAME)

#define FindLocalItem(___iff, ___type, ___id, ___ident) \
      LP4(0xd2, struct LocalContextItem *, FindLocalItem , const struct IFFHandle *, ___iff, a0, LONG, ___type, d0, LONG, ___id, d1, LONG, ___ident, d2,\
      , IFFPARSE_BASE_NAME)

#define StoreLocalItem(___iff, ___localItem, ___position) \
      LP3(0xd8, LONG, StoreLocalItem , struct IFFHandle *, ___iff, a0, struct LocalContextItem *, ___localItem, a1, LONG, ___position, d0,\
      , IFFPARSE_BASE_NAME)

#define StoreItemInContext(___iff, ___localItem, ___contextNode) \
      LP3NR(0xde, StoreItemInContext , struct IFFHandle *, ___iff, a0, struct LocalContextItem *, ___localItem, a1, struct ContextNode *, ___contextNode, a2,\
      , IFFPARSE_BASE_NAME)

#define InitIFF(___iff, ___flags, ___streamHook) \
      LP3NR(0xe4, InitIFF , struct IFFHandle *, ___iff, a0, LONG, ___flags, d0, const struct Hook *, ___streamHook, a1,\
      , IFFPARSE_BASE_NAME)

#define InitIFFasDOS(___iff) \
      LP1NR(0xea, InitIFFasDOS , struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define InitIFFasClip(___iff) \
      LP1NR(0xf0, InitIFFasClip , struct IFFHandle *, ___iff, a0,\
      , IFFPARSE_BASE_NAME)

#define OpenClipboard(___unitNumber) \
      LP1(0xf6, struct ClipboardHandle *, OpenClipboard , LONG, ___unitNumber, d0,\
      , IFFPARSE_BASE_NAME)

#define CloseClipboard(___clipHandle) \
      LP1NR(0xfc, CloseClipboard , struct ClipboardHandle *, ___clipHandle, a0,\
      , IFFPARSE_BASE_NAME)

#define GoodID(___id) \
      LP1(0x102, LONG, GoodID , LONG, ___id, d0,\
      , IFFPARSE_BASE_NAME)

#define GoodType(___type) \
      LP1(0x108, LONG, GoodType , LONG, ___type, d0,\
      , IFFPARSE_BASE_NAME)

#define IDtoStr(___id, ___buf) \
      LP2(0x10e, STRPTR, IDtoStr , LONG, ___id, d0, STRPTR, ___buf, a0,\
      , IFFPARSE_BASE_NAME)

#endif /* !_INLINE_IFFPARSE_H */
