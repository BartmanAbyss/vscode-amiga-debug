#ifndef  CLIB_UTILITY_PROTOS_H
#define  CLIB_UTILITY_PROTOS_H

/*
**	$VER: utility_protos.h 40.1 (17.5.1996)
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
#ifndef  EXEC_PORTS_H
#include <exec/ports.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef  UTILITY_DATE_H
#include <utility/date.h>
#endif
#ifndef  UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif
#ifndef  UTILITY_NAME_H
#include <utility/name.h>
#endif
/*--- functions in V36 or higher (Release 2.0) ---*/

/* Tag item functions */

struct TagItem *FindTagItem( Tag tagVal, CONST struct TagItem *tagList );
ULONG GetTagData( Tag tagValue, ULONG defaultVal, CONST struct TagItem *tagList );
ULONG PackBoolTags( ULONG initialFlags, CONST struct TagItem *tagList, CONST struct TagItem *boolMap );
struct TagItem *NextTagItem( struct TagItem **tagListPtr );
VOID FilterTagChanges( struct TagItem *changeList, struct TagItem *originalList, ULONG apply );
VOID MapTags( struct TagItem *tagList, CONST struct TagItem *mapList, ULONG mapType );
struct TagItem *AllocateTagItems( ULONG numTags );
struct TagItem *CloneTagItems( CONST struct TagItem *tagList );
VOID FreeTagItems( struct TagItem *tagList );
VOID RefreshTagItemClones( struct TagItem *clone, CONST struct TagItem *original );
BOOL TagInArray( Tag tagValue, CONST Tag *tagArray );
ULONG FilterTagItems( struct TagItem *tagList, CONST Tag *filterArray, ULONG logic );

/* Hook functions */

ULONG CallHookPkt( struct Hook *hook, APTR object, APTR paramPacket );

/* Date functions */

VOID Amiga2Date( ULONG seconds, struct ClockData *result );
ULONG Date2Amiga( CONST struct ClockData *date );
ULONG CheckDate( CONST struct ClockData *date );

/* 32 bit integer muliply functions */

LONG SMult32( LONG arg1, LONG arg2 );
ULONG UMult32( ULONG arg1, ULONG arg2 );

/* 32 bit integer division funtions. The quotient and the remainder are */
/* returned respectively in d0 and d1 */

LONG SDivMod32( LONG dividend, LONG divisor );
ULONG UDivMod32( ULONG dividend, ULONG divisor );
/*--- functions in V37 or higher (Release 2.04) ---*/

/* International string routines */

LONG Stricmp( CONST_STRPTR string1, CONST_STRPTR string2 );
LONG Strnicmp( CONST_STRPTR string1, CONST_STRPTR string2, LONG length );
UBYTE ToUpper( ULONG character );
UBYTE ToLower( ULONG character );
/*--- functions in V39 or higher (Release 3) ---*/

/* More tag Item functions */

VOID ApplyTagChanges( struct TagItem *list, CONST struct TagItem *changeList );

/* 64 bit integer muliply functions. The results are 64 bit quantities */
/* returned in D0 and D1 */

LONG SMult64( LONG arg1, LONG arg2 );
ULONG UMult64( ULONG arg1, ULONG arg2 );

/* Structure to Tag and Tag to Structure support routines */

ULONG PackStructureTags( APTR pack, CONST ULONG *packTable, CONST struct TagItem *tagList );
ULONG UnpackStructureTags( CONST APTR pack, CONST ULONG *packTable, struct TagItem *tagList );

/* New, object-oriented NameSpaces */

BOOL AddNamedObject( struct NamedObject *nameSpace, struct NamedObject *object );
struct NamedObject *AllocNamedObjectA( CONST_STRPTR name, CONST struct TagItem *tagList );
struct NamedObject *AllocNamedObject( CONST_STRPTR name, Tag tag1, ... );
LONG AttemptRemNamedObject( struct NamedObject *object );
struct NamedObject *FindNamedObject( struct NamedObject *nameSpace, CONST_STRPTR name, struct NamedObject *lastObject );
VOID FreeNamedObject( struct NamedObject *object );
STRPTR NamedObjectName( struct NamedObject *object );
VOID ReleaseNamedObject( struct NamedObject *object );
VOID RemNamedObject( struct NamedObject *object, struct Message *message );

/* Unique ID generator */

ULONG GetUniqueID( VOID );



#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_UTILITY_PROTOS_H */
