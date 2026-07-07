/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_UTILITY_PROTOS_H
#define CLIB_UTILITY_PROTOS_H

/*
**   $VER: utility_protos.h $VER: utility_lib.sfd 47.1 (30.11.2021) $VER: utility_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <exec/ports.h>
#include <utility/tagitem.h>
#include <utility/date.h>
#include <utility/hooks.h>
#include <utility/name.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "utility.library" */
/*
 Tag item functions
*/

struct TagItem *FindTagItem(Tag tagVal, CONST struct TagItem *tagList);
ULONG GetTagData(Tag tagValue, ULONG defaultVal, CONST struct TagItem *tagList);
ULONG PackBoolTags(ULONG initialFlags, CONST struct TagItem *tagList, CONST struct TagItem *boolMap);
struct TagItem *NextTagItem(struct TagItem **tagListPtr);
VOID FilterTagChanges(struct TagItem *changeList, struct TagItem *originalList, ULONG apply);
VOID MapTags(struct TagItem *tagList, CONST struct TagItem *mapList, ULONG mapType);
struct TagItem *AllocateTagItems(ULONG numTags);
struct TagItem *CloneTagItems(CONST struct TagItem *tagList);
VOID FreeTagItems(struct TagItem *tagList);
VOID RefreshTagItemClones(struct TagItem *clone, CONST struct TagItem *original);
BOOL TagInArray(Tag tagValue, CONST Tag *tagArray);
ULONG FilterTagItems(struct TagItem *tagList, CONST Tag *filterArray, ULONG logic);

/* Hook functions */

ULONG CallHookPkt(struct Hook *hook, APTR object, APTR paramPacket);

/* Date functions */

VOID Amiga2Date(ULONG seconds, struct ClockData *result);
ULONG Date2Amiga(CONST struct ClockData *date);
ULONG CheckDate(CONST struct ClockData *date);

/* 32 bit integer muliply functions */

LONG SMult32(LONG arg1, LONG arg2);
ULONG UMult32(ULONG arg1, ULONG arg2);

/* 32 bit integer division funtions. The quotient and the remainder are */
/* returned respectively in d0 and d1 */

LONG SDivMod32(LONG dividend, LONG divisor);
ULONG UDivMod32(ULONG dividend, ULONG divisor);

/*--- functions in V37 or higher ---*/

/* International string routines */

LONG Stricmp(CONST_STRPTR string1, CONST_STRPTR string2);
LONG Strnicmp(CONST_STRPTR string1, CONST_STRPTR string2, LONG length);
UBYTE ToUpper(UBYTE character);
UBYTE ToLower(UBYTE character);

/*--- functions in V39 or higher ---*/

/* More tag Item functions */

VOID ApplyTagChanges(struct TagItem *list, CONST struct TagItem *changeList);

/* 64 bit integer muliply functions. The results are 64 bit quantities */
/* returned in D0 and D1 */

LONG SMult64(LONG arg1, LONG arg2);
ULONG UMult64(ULONG arg1, ULONG arg2);

/* Structure to Tag and Tag to Structure support routines */

ULONG PackStructureTags(APTR pack, CONST ULONG *packTable, CONST struct TagItem *tagList);
ULONG UnpackStructureTags(CONST_APTR pack, CONST ULONG * packTable, struct TagItem *tagList);

/* New, object-oriented NameSpaces */

BOOL AddNamedObject(struct NamedObject *nameSpace, struct NamedObject *object);
struct NamedObject *AllocNamedObjectA(CONST_STRPTR name, CONST struct TagItem *tagList);
struct NamedObject *AllocNamedObject(CONST_STRPTR name, Tag _tag1, ...);
LONG AttemptRemNamedObject(struct NamedObject *object);
struct NamedObject *FindNamedObject(struct NamedObject *nameSpace, CONST_STRPTR name, CONST struct NamedObject *lastObject);
VOID FreeNamedObject(struct NamedObject *object);
STRPTR NamedObjectName(struct NamedObject *object);
VOID ReleaseNamedObject(struct NamedObject *object);
VOID RemNamedObject(struct NamedObject *object, struct Message *message);

/* Unique ID generator */

ULONG GetUniqueID(void);

/*--- functions in V47 or higher ---*/

/* Reserved vectors for Os4, not populated. */

LONG VSNPrintf(STRPTR buffer, ULONG bufsize, CONST_STRPTR fmt, CONST_APTR data);
LONG SNPrintf(STRPTR buffer, ULONG bufsize, CONST_STRPTR fmt, ...);

/* Reserved vectors for Os4, not populated. */
/*
 Reserved vector for internal use.
*/

STRPTR Strncpy(STRPTR dst, CONST_STRPTR src, ULONG size);
STRPTR Strncat(STRPTR dst, CONST_STRPTR src, ULONG size);

/* 64 bit integer division functions. The input is a 64 bit dividiend in d1:d0 */
/* with top 32 bits in 32 and a divisor in d2. Results are the quotient in d0 */
/* and a remainder in d1 */

LONG SDivMod64(LONG hi, LONG lo, LONG divisor);
ULONG UDivMod64(ULONG hi, ULONG lo, ULONG divisor);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_UTILITY_PROTOS_H */
