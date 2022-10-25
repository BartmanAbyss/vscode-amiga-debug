#ifndef CLIB_REACTION_LIB_PROTOS_H
#define CLIB_REACTION_LIB_PROTOS_H
/*
**	$VER: reaction_lib_protos.h 45.1 (17.12.2001)
**	Includes Release 45.1
**
**	C prototypes. For use with 32 bit integers only.
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

struct List *ChooserLabelsA( STRPTR * );
struct List *ChooserLabels( STRPTR, ... );
void FreeChooserLabels( struct List * );
struct List *RadioButtonsA( STRPTR * );
struct List *RadioButtons( STRPTR, ... );
void FreeRadioButtons( struct List * );
struct Window *OpenLayoutWindowTagList( struct Gadget *, struct Screen *, struct TagItem * );
struct Window *OpenLayoutWindowTags( struct Gadget *, struct Screen *, Tag, ... );
UWORD GetCode( struct IntuiMessage * );
struct ClassLibrary *OpenClass(STRPTR, ULONG);
STRPTR OpenLibs(APTR);
void CloseLibs(APTR);
ULONG LibDoGadgetMethodA( struct Gadget *, struct Window *, struct Requester *, Msg );
ULONG LibDoGadgetMethod( struct Gadget *, struct Window *, struct Requester *, Tag, ... );
ULONG GetAttrsA( Object *o, struct TagItem *t );
ULONG GetAttrs( Object *o, Tag t, ... );
struct List *BrowserNodesA( STRPTR * );
struct List *BrowserNodes( STRPTR, ... );
void FreeBrowserNodes( struct List * );
struct List *ClickTabsA( STRPTR * );
struct List *ClickTabs( STRPTR, ... );
void FreeClickTabs( struct List * );
struct Node *LBAddNodeA( struct Gadget *, struct Window *, struct Requester *, struct Node *, struct TagItem * );
ULONG LBEditNodeA( struct Gadget *, struct Window *, struct Requester *, struct Node *, struct TagItem * );
struct Node *LBAddNode( struct Gadget *lb, struct Window *w, struct Requester *r, struct Node *n, ULONG tag, ... );
ULONG LBEditNode( struct Gadget *lb, struct Window *w, struct Requester *r, struct Node *n, ULONG tag, ... );
ULONG LBRemNode( struct Gadget *, struct Window *, struct Requester *, struct Node * );

#ifdef __cplusplus
}
#endif

#endif /* CLIB_REACTION_LIB_PROTOS_H */
