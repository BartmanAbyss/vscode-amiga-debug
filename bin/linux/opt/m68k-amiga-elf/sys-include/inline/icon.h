/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_ICON_H
#define _INLINE_ICON_H

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

#ifndef ICON_BASE_NAME
#define ICON_BASE_NAME IconBase
#endif /* !ICON_BASE_NAME */

#define FreeFreeList(___freelist) \
      LP1NR(0x36, FreeFreeList , struct FreeList *, ___freelist, a0,\
      , ICON_BASE_NAME)

#define AddFreeList(___freelist, ___mem, ___size) \
      LP3(0x48, BOOL, AddFreeList , struct FreeList *, ___freelist, a0, const APTR, ___mem, a1, ULONG, ___size, a2,\
      , ICON_BASE_NAME)

#define GetDiskObject(___name) \
      LP1(0x4e, struct DiskObject *, GetDiskObject , const STRPTR, ___name, a0,\
      , ICON_BASE_NAME)

#define PutDiskObject(___name, ___diskobj) \
      LP2(0x54, BOOL, PutDiskObject , const STRPTR, ___name, a0, const struct DiskObject *, ___diskobj, a1,\
      , ICON_BASE_NAME)

#define FreeDiskObject(___diskobj) \
      LP1NR(0x5a, FreeDiskObject , struct DiskObject *, ___diskobj, a0,\
      , ICON_BASE_NAME)

#define FindToolType(___toolTypeArray, ___typeName) \
      LP2(0x60, UBYTE *, FindToolType , const STRPTR *, ___toolTypeArray, a0, const STRPTR, ___typeName, a1,\
      , ICON_BASE_NAME)

#define MatchToolValue(___typeString, ___value) \
      LP2(0x66, BOOL, MatchToolValue , const STRPTR, ___typeString, a0, const STRPTR, ___value, a1,\
      , ICON_BASE_NAME)

#define BumpRevision(___newname, ___oldname) \
      LP2(0x6c, STRPTR, BumpRevision , STRPTR, ___newname, a0, const STRPTR, ___oldname, a1,\
      , ICON_BASE_NAME)

#define GetDefDiskObject(___type) \
      LP1(0x78, struct DiskObject *, GetDefDiskObject , LONG, ___type, d0,\
      , ICON_BASE_NAME)

#define PutDefDiskObject(___diskObject) \
      LP1(0x7e, BOOL, PutDefDiskObject , const struct DiskObject *, ___diskObject, a0,\
      , ICON_BASE_NAME)

#define GetDiskObjectNew(___name) \
      LP1(0x84, struct DiskObject *, GetDiskObjectNew , const STRPTR, ___name, a0,\
      , ICON_BASE_NAME)

#define DeleteDiskObject(___name) \
      LP1(0x8a, BOOL, DeleteDiskObject , const STRPTR, ___name, a0,\
      , ICON_BASE_NAME)

#define DupDiskObjectA(___diskObject, ___tags) \
      LP2(0x96, struct DiskObject *, DupDiskObjectA , const struct DiskObject *, ___diskObject, a0, const struct TagItem *, ___tags, a1,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define DupDiskObject(___diskObject, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; DupDiskObjectA((___diskObject), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define IconControlA(___icon, ___tags) \
      LP2(0x9c, ULONG, IconControlA , struct DiskObject *, ___icon, a0, const struct TagItem *, ___tags, a1,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define IconControl(___icon, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; IconControlA((___icon), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DrawIconStateA(___rp, ___icon, ___label, ___leftOffset, ___topOffset, ___state, ___tags) \
      LP7NR(0xa2, DrawIconStateA , struct RastPort *, ___rp, a0, const struct DiskObject *, ___icon, a1, const STRPTR, ___label, a2, LONG, ___leftOffset, d0, LONG, ___topOffset, d1, ULONG, ___state, d2, const struct TagItem *, ___tags, a3,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define DrawIconState(___rp, ___icon, ___label, ___leftOffset, ___topOffset, ___state, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; DrawIconStateA((___rp), (___icon), (___label), (___leftOffset), (___topOffset), (___state), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetIconRectangleA(___rp, ___icon, ___label, ___rect, ___tags) \
      LP5A4(0xa8, BOOL, GetIconRectangleA , struct RastPort *, ___rp, a0, const struct DiskObject *, ___icon, a1, const STRPTR, ___label, a2, struct Rectangle *, ___rect, a3, const struct TagItem *, ___tags, d7,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetIconRectangle(___rp, ___icon, ___label, ___rect, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetIconRectangleA((___rp), (___icon), (___label), (___rect), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define NewDiskObject(___type) \
      LP1(0xae, struct DiskObject *, NewDiskObject , LONG, ___type, d0,\
      , ICON_BASE_NAME)

#define GetIconTagList(___name, ___tags) \
      LP2(0xb4, struct DiskObject *, GetIconTagList , const STRPTR, ___name, a0, const struct TagItem *, ___tags, a1,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetIconTags(___name, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetIconTagList((___name), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define PutIconTagList(___name, ___icon, ___tags) \
      LP3(0xba, BOOL, PutIconTagList , const STRPTR, ___name, a0, const struct DiskObject *, ___icon, a1, const struct TagItem *, ___tags, a2,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define PutIconTags(___name, ___icon, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; PutIconTagList((___name), (___icon), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define LayoutIconA(___icon, ___screen, ___tags) \
      LP3(0xc0, BOOL, LayoutIconA , struct DiskObject *, ___icon, a0, struct Screen *, ___screen, a1, struct TagItem *, ___tags, a2,\
      , ICON_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define LayoutIcon(___icon, ___screen, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; LayoutIconA((___icon), (___screen), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ChangeToSelectedIconColor(___cr) \
      LP1NR(0xc6, ChangeToSelectedIconColor , struct ColorRegister *, ___cr, a0,\
      , ICON_BASE_NAME)

#endif /* !_INLINE_ICON_H */
