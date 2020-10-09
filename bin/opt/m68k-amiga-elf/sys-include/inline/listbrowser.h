/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_LISTBROWSER_H
#define _INLINE_LISTBROWSER_H

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

#ifndef LISTBROWSER_BASE_NAME
#define LISTBROWSER_BASE_NAME ListBrowserBase
#endif /* !LISTBROWSER_BASE_NAME */

#define LISTBROWSER_GetClass() \
      LP0(0x1e, struct IClass *, LISTBROWSER_GetClass ,\
      , LISTBROWSER_BASE_NAME)

#define AllocListBrowserNodeA(___columns, ___tags) \
      LP2(0x24, struct Node *, AllocListBrowserNodeA , UWORD, ___columns, d0, struct TagItem *, ___tags, a0,\
      , LISTBROWSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocListBrowserNode(___columns, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; AllocListBrowserNodeA((___columns), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeListBrowserNode(___node) \
      LP1NR(0x2a, FreeListBrowserNode , struct Node *, ___node, a0,\
      , LISTBROWSER_BASE_NAME)

#define SetListBrowserNodeAttrsA(___node, ___tags) \
      LP2NR(0x30, SetListBrowserNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , LISTBROWSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetListBrowserNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetListBrowserNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetListBrowserNodeAttrsA(___node, ___tags) \
      LP2NR(0x36, GetListBrowserNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , LISTBROWSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetListBrowserNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetListBrowserNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ListBrowserSelectAll(___list) \
      LP1NR(0x3c, ListBrowserSelectAll , struct List *, ___list, a0,\
      , LISTBROWSER_BASE_NAME)

#define ShowListBrowserNodeChildren(___node, ___depth) \
      LP2NR(0x42, ShowListBrowserNodeChildren , struct Node *, ___node, a0, WORD, ___depth, d0,\
      , LISTBROWSER_BASE_NAME)

#define HideListBrowserNodeChildren(___node) \
      LP1NR(0x48, HideListBrowserNodeChildren , struct Node *, ___node, a0,\
      , LISTBROWSER_BASE_NAME)

#define ShowAllListBrowserChildren(___list) \
      LP1NR(0x4e, ShowAllListBrowserChildren , struct List *, ___list, a0,\
      , LISTBROWSER_BASE_NAME)

#define HideAllListBrowserChildren(___list) \
      LP1NR(0x54, HideAllListBrowserChildren , struct List *, ___list, a0,\
      , LISTBROWSER_BASE_NAME)

#define FreeListBrowserList(___list) \
      LP1NR(0x5a, FreeListBrowserList , struct List *, ___list, a0,\
      , LISTBROWSER_BASE_NAME)

#define AllocLBColumnInfoA(___columns, ___tags) \
      LP2(0x60, struct ColumnInfo *, AllocLBColumnInfoA , UWORD, ___columns, d0, struct TagItem *, ___tags, a0,\
      , LISTBROWSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocLBColumnInfo(___columns, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; AllocLBColumnInfoA((___columns), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetLBColumnInfoAttrsA(___columninfo, ___tags) \
      LP2(0x66, LONG, SetLBColumnInfoAttrsA , struct ColumnInfo *, ___columninfo, a1, struct TagItem *, ___tags, a0,\
      , LISTBROWSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetLBColumnInfoAttrs(___columninfo, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetLBColumnInfoAttrsA((___columninfo), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetLBColumnInfoAttrsA(___columninfo, ___tags) \
      LP2(0x6c, LONG, GetLBColumnInfoAttrsA , struct ColumnInfo *, ___columninfo, a1, struct TagItem *, ___tags, a0,\
      , LISTBROWSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetLBColumnInfoAttrs(___columninfo, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetLBColumnInfoAttrsA((___columninfo), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeLBColumnInfo(___columninfo) \
      LP1NR(0x72, FreeLBColumnInfo , struct ColumnInfo *, ___columninfo, a0,\
      , LISTBROWSER_BASE_NAME)

#define ListBrowserClearAll(___list) \
      LP1NR(0x78, ListBrowserClearAll , struct List *, ___list, a0,\
      , LISTBROWSER_BASE_NAME)

#endif /* !_INLINE_LISTBROWSER_H */
