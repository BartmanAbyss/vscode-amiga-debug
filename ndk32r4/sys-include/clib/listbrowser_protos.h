/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_LISTBROWSER_PROTOS_H
#define CLIB_LISTBROWSER_PROTOS_H

/*
**   $VER: listbrowser_protos.h $VER: listbrowser_lib.sfd 47.1 (30.11.2021) $VER: listbrowser_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <intuition/intuition.h>
#include <intuition/classes.h>
#include <utility/tagitem.h>
#include <gadgets/listbrowser.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* "listbrowser.gadget" */
Class *LISTBROWSER_GetClass(void);
struct Node *AllocListBrowserNodeA(ULONG columns, struct TagItem *tags);
struct Node *AllocListBrowserNode(ULONG columns, Tag _tag1, ...);
VOID FreeListBrowserNode(struct Node *node);
VOID SetListBrowserNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID SetListBrowserNodeAttrs(struct Node *node, Tag _tag1, ...);
VOID GetListBrowserNodeAttrsA(struct Node *node, struct TagItem *tags);
VOID GetListBrowserNodeAttrs(struct Node *node, Tag _tag1, ...);
VOID ListBrowserSelectAll(struct List *list);
VOID ShowListBrowserNodeChildren(struct Node *node, LONG depth);
VOID HideListBrowserNodeChildren(struct Node *node);
VOID ShowAllListBrowserChildren(struct List *list);
VOID HideAllListBrowserChildren(struct List *list);
VOID FreeListBrowserList(struct List *list);

/*--- functions in V45 or higher ---*/
struct ColumnInfo *AllocLBColumnInfoA(ULONG columns, struct TagItem *tags);
struct ColumnInfo *AllocLBColumnInfo(ULONG columns, Tag _tag1, ...);
LONG SetLBColumnInfoAttrsA(struct ColumnInfo *columninfo, struct TagItem *tags);
LONG SetLBColumnInfoAttrs(struct ColumnInfo *columninfo, Tag _tag1, ...);
LONG GetLBColumnInfoAttrsA(struct ColumnInfo *columninfo, struct TagItem *tags);
LONG GetLBColumnInfoAttrs(struct ColumnInfo *columninfo, Tag _tag1, ...);
VOID FreeLBColumnInfo(struct ColumnInfo *columninfo);
VOID ListBrowserClearAll(struct List *list);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_LISTBROWSER_PROTOS_H */
