/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_UTILITY_H
#define _INLINE_UTILITY_H

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

#ifndef UTILITY_BASE_NAME
#define UTILITY_BASE_NAME UtilityBase
#endif /* !UTILITY_BASE_NAME */

#define FindTagItem(___tagVal, ___tagList) \
      LP2(0x1e, struct TagItem *, FindTagItem , Tag, ___tagVal, d0, const struct TagItem *, ___tagList, a0,\
      , UTILITY_BASE_NAME)

#define GetTagData(___tagValue, ___defaultVal, ___tagList) \
      LP3(0x24, ULONG, GetTagData , Tag, ___tagValue, d0, ULONG, ___defaultVal, d1, const struct TagItem *, ___tagList, a0,\
      , UTILITY_BASE_NAME)

#define PackBoolTags(___initialFlags, ___tagList, ___boolMap) \
      LP3(0x2a, ULONG, PackBoolTags , ULONG, ___initialFlags, d0, const struct TagItem *, ___tagList, a0, const struct TagItem *, ___boolMap, a1,\
      , UTILITY_BASE_NAME)

#define NextTagItem(___tagListPtr) \
      LP1(0x30, struct TagItem *, NextTagItem , struct TagItem **, ___tagListPtr, a0,\
      , UTILITY_BASE_NAME)

#define FilterTagChanges(___changeList, ___originalList, ___apply) \
      LP3NR(0x36, FilterTagChanges , struct TagItem *, ___changeList, a0, struct TagItem *, ___originalList, a1, ULONG, ___apply, d0,\
      , UTILITY_BASE_NAME)

#define MapTags(___tagList, ___mapList, ___mapType) \
      LP3NR(0x3c, MapTags , struct TagItem *, ___tagList, a0, const struct TagItem *, ___mapList, a1, ULONG, ___mapType, d0,\
      , UTILITY_BASE_NAME)

#define AllocateTagItems(___numTags) \
      LP1(0x42, struct TagItem *, AllocateTagItems , ULONG, ___numTags, d0,\
      , UTILITY_BASE_NAME)

#define CloneTagItems(___tagList) \
      LP1(0x48, struct TagItem *, CloneTagItems , const struct TagItem *, ___tagList, a0,\
      , UTILITY_BASE_NAME)

#define FreeTagItems(___tagList) \
      LP1NR(0x4e, FreeTagItems , struct TagItem *, ___tagList, a0,\
      , UTILITY_BASE_NAME)

#define RefreshTagItemClones(___clone, ___original) \
      LP2NR(0x54, RefreshTagItemClones , struct TagItem *, ___clone, a0, const struct TagItem *, ___original, a1,\
      , UTILITY_BASE_NAME)

#define TagInArray(___tagValue, ___tagArray) \
      LP2(0x5a, BOOL, TagInArray , Tag, ___tagValue, d0, const Tag *, ___tagArray, a0,\
      , UTILITY_BASE_NAME)

#define FilterTagItems(___tagList, ___filterArray, ___logic) \
      LP3(0x60, ULONG, FilterTagItems , struct TagItem *, ___tagList, a0, const Tag *, ___filterArray, a1, ULONG, ___logic, d0,\
      , UTILITY_BASE_NAME)

#define CallHookPkt(___hook, ___object, ___paramPacket) \
      LP3(0x66, ULONG, CallHookPkt , struct Hook *, ___hook, a0, APTR, ___object, a2, APTR, ___paramPacket, a1,\
      , UTILITY_BASE_NAME)

#define Amiga2Date(___seconds, ___result) \
      LP2NR(0x78, Amiga2Date , ULONG, ___seconds, d0, struct ClockData *, ___result, a0,\
      , UTILITY_BASE_NAME)

#define Date2Amiga(___date) \
      LP1(0x7e, ULONG, Date2Amiga , const struct ClockData *, ___date, a0,\
      , UTILITY_BASE_NAME)

#define CheckDate(___date) \
      LP1(0x84, ULONG, CheckDate , const struct ClockData *, ___date, a0,\
      , UTILITY_BASE_NAME)

#define SMult32(___arg1, ___arg2) \
      LP2(0x8a, LONG, SMult32 , LONG, ___arg1, d0, LONG, ___arg2, d1,\
      , UTILITY_BASE_NAME)

#define UMult32(___arg1, ___arg2) \
      LP2(0x90, ULONG, UMult32 , ULONG, ___arg1, d0, ULONG, ___arg2, d1,\
      , UTILITY_BASE_NAME)

#define SDivMod32(___dividend, ___divisor) \
      LP2(0x96, LONG, SDivMod32 , LONG, ___dividend, d0, LONG, ___divisor, d1,\
      , UTILITY_BASE_NAME)

#define UDivMod32(___dividend, ___divisor) \
      LP2(0x9c, ULONG, UDivMod32 , ULONG, ___dividend, d0, ULONG, ___divisor, d1,\
      , UTILITY_BASE_NAME)

#define Stricmp(___string1, ___string2) \
      LP2(0xa2, LONG, Stricmp , CONST_STRPTR, ___string1, a0, CONST_STRPTR, ___string2, a1,\
      , UTILITY_BASE_NAME)

#define Strnicmp(___string1, ___string2, ___length) \
      LP3(0xa8, LONG, Strnicmp , CONST_STRPTR, ___string1, a0, CONST_STRPTR, ___string2, a1, LONG, ___length, d0,\
      , UTILITY_BASE_NAME)

#define ToUpper(___character) \
      LP1(0xae, UBYTE, ToUpper , UBYTE, ___character, d0,\
      , UTILITY_BASE_NAME)

#define ToLower(___character) \
      LP1(0xb4, UBYTE, ToLower , UBYTE, ___character, d0,\
      , UTILITY_BASE_NAME)

#define ApplyTagChanges(___list, ___changeList) \
      LP2NR(0xba, ApplyTagChanges , struct TagItem *, ___list, a0, const struct TagItem *, ___changeList, a1,\
      , UTILITY_BASE_NAME)

#define SMult64(___arg1, ___arg2) \
      LP2(0xc6, LONG, SMult64 , LONG, ___arg1, d0, LONG, ___arg2, d1,\
      , UTILITY_BASE_NAME)

#define UMult64(___arg1, ___arg2) \
      LP2(0xcc, ULONG, UMult64 , ULONG, ___arg1, d0, ULONG, ___arg2, d1,\
      , UTILITY_BASE_NAME)

#define PackStructureTags(___pack, ___packTable, ___tagList) \
      LP3(0xd2, ULONG, PackStructureTags , APTR, ___pack, a0, const ULONG *, ___packTable, a1, const struct TagItem *, ___tagList, a2,\
      , UTILITY_BASE_NAME)

#define UnpackStructureTags(___pack, ___packTable, ___tagList) \
      LP3(0xd8, ULONG, UnpackStructureTags , const APTR, ___pack, a0, const ULONG *, ___packTable, a1, struct TagItem *, ___tagList, a2,\
      , UTILITY_BASE_NAME)

#define AddNamedObject(___nameSpace, ___object) \
      LP2(0xde, BOOL, AddNamedObject , struct NamedObject *, ___nameSpace, a0, struct NamedObject *, ___object, a1,\
      , UTILITY_BASE_NAME)

#define AllocNamedObjectA(___name, ___tagList) \
      LP2(0xe4, struct NamedObject *, AllocNamedObjectA , CONST_STRPTR, ___name, a0, const struct TagItem *, ___tagList, a1,\
      , UTILITY_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocNamedObject(___name, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; AllocNamedObjectA((___name), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AttemptRemNamedObject(___object) \
      LP1(0xea, LONG, AttemptRemNamedObject , struct NamedObject *, ___object, a0,\
      , UTILITY_BASE_NAME)

#define FindNamedObject(___nameSpace, ___name, ___lastObject) \
      LP3(0xf0, struct NamedObject *, FindNamedObject , struct NamedObject *, ___nameSpace, a0, CONST_STRPTR, ___name, a1, struct NamedObject *, ___lastObject, a2,\
      , UTILITY_BASE_NAME)

#define FreeNamedObject(___object) \
      LP1NR(0xf6, FreeNamedObject , struct NamedObject *, ___object, a0,\
      , UTILITY_BASE_NAME)

#define NamedObjectName(___object) \
      LP1(0xfc, STRPTR, NamedObjectName , struct NamedObject *, ___object, a0,\
      , UTILITY_BASE_NAME)

#define ReleaseNamedObject(___object) \
      LP1NR(0x102, ReleaseNamedObject , struct NamedObject *, ___object, a0,\
      , UTILITY_BASE_NAME)

#define RemNamedObject(___object, ___message) \
      LP2NR(0x108, RemNamedObject , struct NamedObject *, ___object, a0, struct Message *, ___message, a1,\
      , UTILITY_BASE_NAME)

#define GetUniqueID() \
      LP0(0x10e, ULONG, GetUniqueID ,\
      , UTILITY_BASE_NAME)

#endif /* !_INLINE_UTILITY_H */
