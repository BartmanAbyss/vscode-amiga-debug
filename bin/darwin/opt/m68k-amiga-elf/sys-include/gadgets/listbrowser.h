#ifndef GADGETS_LISTBROWSER_H
#define GADGETS_LISTBROWSER_H
/*
**	$VER: listbrowser.h 45.1 (07.03.2001)
**	Includes Release 45.1
**
**	Definitions for the ListBrowser BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_GADGETCLASS_H
#include <intuition/gadgetclass.h>
#endif

/*****************************************************************************/

/* LBM_ADDNODE creates a listbrowser node and inserts it to the currently
 * attached list. The number of columns is automatically set according to the
 * object's column number. If the node would become visible, it is automatically
 * rendered. This method returns the address of the new node. (V41)
 */
#define LBM_ADDNODE (0x580001L)

struct lbAddNode
{
    ULONG MethodID;					/* LBM_ADDNODE */
    struct GadgetInfo *lba_GInfo;	/* to provide rendering info */
    struct Node *lba_Node;      	/* Insert() after this node */
    struct TagItem *lba_NodeAttrs;	/* LBNA taglist */
};


/* LBM_REMNODE removes and frees the chosen node. If the node was visible, the
 * display is updated. The method returns 1 if the operation was successful.
 * (V41)
 */
#define LBM_REMNODE (0x580002L)

struct lbRemNode
{
    ULONG MethodID;					/* LBM_REMNODE */
    struct GadgetInfo *lbr_GInfo;	/* to provide rendering info */
    struct Node *lbr_Node;			/* Remove() this node */
};


/* LBM_EDITNODE changes the chosen node's attributes and renders the
 * changes. The method returns 1 if the operation was successful. (V41)
 */
#define LBM_EDITNODE (0x580003L)

struct lbEditNode
{
    ULONG MethodID;					/* LBM_EDITNODE */
    struct GadgetInfo *lbe_GInfo;	/* to provide rendering info */
    struct Node *lbe_Node;			/* modify this node */
    struct TagItem *lbe_NodeAttrs;	/* according to this taglist */
};


/* LBM_SORT
 */
#define LBM_SORT (0x580004L)

struct lbSort
{
	ULONG MethodID;					/* LBM_SORT */
	struct GadgetInfo *lbs_GInfo;	/* to provide rendering info */
	ULONG lbs_Column;				/* Column to sort by */
	ULONG lbs_Reverse;				/* Reverse sort */
	struct Hook *lbs_CompareHook;	/* Optional hook to compare items */
};


/* LBM_SHOWCHILDREN
 */
#define LBM_SHOWCHILDREN (0x580005L)

struct lbShowChildren
{
	ULONG MethodID;					/* LBM_SHOWCHILDREN */
	struct GadgetInfo *lbsc_GInfo;	/* to provide rendering info */
	struct Node *lbsc_Node;			/* Starting ParentNode, NULL means start at root. */
	WORD lbsc_Depth;				/* Depth to Show */
};


/* LBM_HIDECHILDREN
 */
#define LBM_HIDECHILDREN (0x580006L)

struct lbHideChildren
{
	ULONG MethodID;					/* LBM_HIDECHILDREN */
	struct GadgetInfo *lbhc_GInfo;	/* to provide rendering info */
	struct Node *lbhc_Node;			/* Starting ParentNode, NULL means start at root. */
	WORD lbhc_Depth;				/* Depth to Hide */
};


/*****************************************************************************/

/* ListBrowser Node attributes.
 */
#define LBNA_Dummy			(TAG_USER+0x5003500)

#define	LBNA_Selected		(LBNA_Dummy+1)
	/* (BOOL) If the node is to be selected.  Defaults to FALSE. */

#define	LBNA_Flags			(LBNA_Dummy+2)
	/* (ULONG) Flags for the node.  Defaults to 0. */

#define	LBNA_UserData		(LBNA_Dummy+3)
	/* (ULONG) User data.  Defaults to NULL. */

#define	LBNA_Column			(LBNA_Dummy+4)
	/* (WORD) Column in the node that the attributes below effect.   Defaults
	 * to 0.*/

#define	LBNCA_Text			(LBNA_Dummy+5)
	/* (STRPTR) Text to display in the column.  Defaults to NULL. */

#define	LBNCA_Integer		(LBNA_Dummy+6)
	/* (LONG *) Pointer to an integer to display in the column.  Defaults to NULL. */

#define	LBNCA_FGPen			(LBNA_Dummy+7)
	/* (WORD) Column foreground pen. */

#define	LBNCA_BGPen			(LBNA_Dummy+8)
	/* (WORD) Column background pen. */

#define	LBNCA_Image			(LBNA_Dummy+9)
	/* (struct Image *) Image to display in the column.  Defaults to NULL. */

#define	LBNCA_SelImage		(LBNA_Dummy+10)
	/* (struct Image *) Image to display in column when selected.  Defaults
	 * to NULL. */

#define	LBNCA_HorizJustify	(LBNA_Dummy+11)
#define LBNCA_Justification	LBNCA_HorizJustify
	/* (ULONG) Column justification.  Defaults to LCJ_LEFT. */

#define	LBNA_Generation		(LBNA_Dummy+12)
	/* Node generation.  Defaults to 0. */

#define	LBNCA_Editable		(LBNA_Dummy+13)
	/* (BOOL) If this column is editable.  Requires LBNCA_CopyText. Defaults
	 * to FALSE. */

#define	LBNCA_MaxChars		(LBNA_Dummy+14)
	/* (WORD) Maximum characters in an editable entry.  Required when using
	 * LBNCA_Editable. */

#define	LBNCA_CopyText		(LBNA_Dummy+15)
	/* Copy the LBNCA_Text contents to an internal buffer. */

#define	LBNA_CheckBox		(LBNA_Dummy+16)
	/* (BOOL) this is a checkbox node */

#define	LBNA_Checked		(LBNA_Dummy+17)
	/* (BOOL) is checked if true */

#define	LBNA_NodeSize		(LBNA_Dummy+18)
	/* (ULONG) size of custom node and optimzie mempool puddles */

#define	LBNCA_EditTags		(LBNA_Dummy+19)
	/* (struct TagItem *) taglist sent to editable string */

#define	LBNCA_RenderHook	(LBNA_Dummy+20)
	/* (struct Hook *) effectivly the same as gadtools listview hook */

#define	LBNCA_HookHeight	(LBNA_Dummy+22)
	/* (WORD) height in pixels of the hook function rendering */

#define	LBNA_MemPool	(LBNA_Dummy+23)
	/* (APTR) exec memory pool to use */

#define	LBNA_NumColumns	(LBNA_Dummy+24)
	/* (WORD) for GetListBrowserNodeAttrs() only! */

#define	LBNA_Priority	(LBNA_Dummy+25)
	/* (UBYTE) Sets the exec node->ln_Pri */

#define	LBNCA_CopyInteger	(LBNA_Dummy+26)
	/* (BOOL) AllocListBrowserNodeAttrs() or SetListBrowserNodeAttrs() only! */

#define	LBNCA_WordWrap		(LBNA_Dummy+27)
	/* (BOOL) WordWrap this node's LBNCA_Text data */

#define	LBNCA_VertJustify	(LBNA_Dummy+28)
	/* (ULONG) Row justification.  Defaults to LRJ_BOTTOM. */


/* Flags for the LBNA_Flags node attribute.
 */
#define LBFLG_READONLY 1
#define LBFLG_CUSTOMPENS 2
#define LBFLG_HASCHILDREN 4
#define LBFLG_SHOWCHILDREN 8
#define LBFLG_HIDDEN 16


/* Justification modes for the LBNA_HorizJustify node column attribute.
 */
#define LCJ_LEFT 0
#define LCJ_CENTER 1
#define LCJ_RIGHT 2

#define LCJ_CENTRE LCJ_CENTER


/* Justification modes for the LBNA_VertJustify node column attribute.
 */
#define LRJ_BOTTOM 0
#define LRJ_CENTER 1
#define LRJ_TOP 2

#define LRJ_CENTRE LRJ_CENTER


/* These definitions are for the LBNCA_RenderHook tag.
 */

/* The different types of messages that a listview callback hook can see.
 */
#define LB_DRAW 0x202L					/* Draw yourself, with state */

/* Possible return values from a render hook.
 */
#define LBCB_OK 0						/* callback understands this message type */
#define LBCB_UNKNOWN 1					/* callback does not understand this message */

/* States for LBDrawMsg.lbdm_State.
 */
#define LBR_NORMAL 0					/* The usual */
#define LBR_SELECTED 1					/* For selected gadgets	*/

/* Structure of LB_DRAW messages, object is a (struct Node *).
 */
struct LBDrawMsg
{
    ULONG lbdm_MethodID;				/* LV_DRAW */
    struct RastPort *lbdm_RastPort;		/* Where to render to */
    struct DrawInfo *lbdm_DrawInfo;		/* Useful to have around */
    struct Rectangle lbdm_Bounds;		/* Limits of where to render */
    ULONG lbdm_State;					/* How to render */
};


/* Sort Hook Data Structure.
 */
struct LBSortMsg
{
	ULONG lbsm_TypeA;
	union
	{
		LONG Integer;
		STRPTR Text;
	} lbsm_DataA;
	APTR lbsm_UserDataA;

	ULONG lbsm_TypeB;
	union
	{
		LONG Integer;
		STRPTR Text;
	} lbsm_DataB;
	APTR lbsm_UserDataB;
};



/*****************************************************************************/

/* Information for columns of the list browser.
 */
struct ColumnInfo
{
	WORD ci_Width;
	STRPTR ci_Title;
	ULONG ci_Flags;
};

/* Possible ColumnInfo Flags
 */
#define CIF_WEIGHTED 0	/* weighted width column */
#define CIF_FIXED 1		/* fixed pixel width column */
#define CIF_DRAGGABLE 2
#define CIF_NOSEPARATORS 4
#define CIF_SORTABLE 8

/* v45 AllocLBColumnInfo(), SetLBColumnInfo(), GetLBColumnInfo()
 * attributes.
 */

#define LBCIA_MemPool	(LBNA_Dummy+50)
	/* (APTR) (V45) MemPool for ColumnInfo */

#define LBCIA_Column	(LBNA_Dummy+51)

#define LBCIA_Title		(LBNA_Dummy+52)

#define LBCIA_Weight	(LBNA_Dummy+53)

#define LBCIA_Width		(LBNA_Dummy+54)

#define LBCIA_Flags		(LBNA_Dummy+55)

/*****************************************************************************/

/* Additional attributes defined by the List Browser class
 */
#define LISTBROWSER_Dummy			(REACTION_Dummy+0x0003000)

#define	LISTBROWSER_Top				(LISTBROWSER_Dummy+1)
	/* (LONG) Top position node. Defauts to 0. */

#define	LISTBROWSER_Reserved1		(LISTBROWSER_Dummy+2)
	/* RESERVED */

#define	LISTBROWSER_Labels			(LISTBROWSER_Dummy+3)
	/* (struct List *) Defaults to ~0. */

#define	LISTBROWSER_Selected		(LISTBROWSER_Dummy+4)
	/* (LONG) numeric index of node currently selected; Defaults to -1. */

#define	LISTBROWSER_SelectedNode	(LISTBROWSER_Dummy+5)
	/* (struct Node *) node currently seleted */

#define	LISTBROWSER_MultiSelect		(LISTBROWSER_Dummy+6)
	/* (BOOL) Defaults to FALSE. */

#define LISTBROWSER_VertSeparators	(LISTBROWSER_Dummy+7)
#define LISTBROWSER_Separators		LISTBROWSER_VertSeparators
	/* (BOOL) Render column separators. Defaults to TRUE. */

#define LISTBROWSER_ColumnInfo		(LISTBROWSER_Dummy+8)
	/* (struct ColumnInfo *) Defaults to NULL. */

#define LISTBROWSER_MakeVisible		(LISTBROWSER_Dummy+9)
	/* (LONG) Defaults to 0. */

#define LISTBROWSER_VirtualWidth	(LISTBROWSER_Dummy+10)
	/* (WORD) Defaults to 0. */

#define LISTBROWSER_Borderless		(LISTBROWSER_Dummy+11)
	/* (BOOL) Defaults to FALSE. */

#define LISTBROWSER_VerticalProp	(LISTBROWSER_Dummy+12)
	/* (BOOL) Defaults to TRUE. */

#define LISTBROWSER_HorizontalProp	(LISTBROWSER_Dummy+13)
	/* (BOOL) Defaults to FALSE. */

#define	LISTBROWSER_Left			(LISTBROWSER_Dummy+14)
	/* (WORD) Defaults to 0. */

#define	LISTBROWSER_Reserved2		(LISTBROWSER_Dummy+15)
	/* RESERVED */

#define	LISTBROWSER_AutoFit			(LISTBROWSER_Dummy+16)
	/* (BOOL) Defaults to FALSE. */

#define	LISTBROWSER_ColumnTitles	(LISTBROWSER_Dummy+17)
	/* (BOOL) Defaults to FALSE. */

#define	LISTBROWSER_ShowSelected	(LISTBROWSER_Dummy+18)
	/* (BOOL) Defaults to FALSE. */

#define	LISTBROWSER_VPropTotal		(LISTBROWSER_Dummy+19)
#define	LISTBROWSER_VPropTop		(LISTBROWSER_Dummy+20)
#define	LISTBROWSER_VPropVisible	(LISTBROWSER_Dummy+21)
	/* State of the vertical prop gadget (if any). */

#define	LISTBROWSER_HPropTotal		(LISTBROWSER_Dummy+22)
#define	LISTBROWSER_HPropTop		(LISTBROWSER_Dummy+23)
#define	LISTBROWSER_HPropVisible	(LISTBROWSER_Dummy+24)
	/* State of the horizontal prop gadget (if any). */

#define	LISTBROWSER_MouseX			(LISTBROWSER_Dummy+25)
#define	LISTBROWSER_MouseY			(LISTBROWSER_Dummy+26)
	/* (WORD) Returns position of mouse release. */

#define	LISTBROWSER_Hierarchical	(LISTBROWSER_Dummy+27)
	/* (BOOL) Enables ListTree mode. Defaults to FALSE. */

#define	LISTBROWSER_ShowImage		(LISTBROWSER_Dummy+28)
	/* (struct Image *) ListTree expanded branchh custom image. Defaults to NULL. */

#define	LISTBROWSER_HideImage		(LISTBROWSER_Dummy+29)
	/* (struct Image *) ListTree colapsed branch custom image. Defaults to NULL. */

#define	LISTBROWSER_LeafImage		(LISTBROWSER_Dummy+30)
	/* (struct Image *) ListTree branch item custom image. Defaults to NULL. */

#define	LISTBROWSER_ScrollRaster	(LISTBROWSER_Dummy+31)
	/* (BOOL) See autodocs for Intuition V37 bug.  Defaults to TRUE. */

#define	LISTBROWSER_Spacing			(LISTBROWSER_Dummy+32)
	/* (WORD) Defaults to 0. */

#define	LISTBROWSER_Editable		(LISTBROWSER_Dummy+33)
	/* (WORD) Defaults to FALSE. */

#define	LISTBROWSER_EditNode		(LISTBROWSER_Dummy+35)
	/* (LONG) Specify a node to edit. */

#define	LISTBROWSER_EditColumn		(LISTBROWSER_Dummy+36)
	/* (WORD) Specify a column to edit */

#define	LISTBROWSER_EditTags		(LISTBROWSER_Dummy+39)
	/* (struct TagItem *) Taglist passed to editible node string gadget.
	   Defaults to NULL. */

#define	LISTBROWSER_Position		(LISTBROWSER_Dummy+34)
	/* (ULONG) See possible values below. */

#define	LISTBROWSER_RelEvent		(LISTBROWSER_Dummy+37)
	/* (ULONG) See possible values below. */

#define	LISTBROWSER_NumSelected		(LISTBROWSER_Dummy+38)
	/* (LONG) Number of selected nodes. */

#define	LISTBROWSER_RelColumn		(LISTBROWSER_Dummy+40)
	/* (WORD) Column number clicked on. */

#define	LISTBROWSER_HorizSeparators	(LISTBROWSER_Dummy+41)
	/* (BOOL) Show horizontal node separators */

#define	LISTBROWSER_CheckImage		(LISTBROWSER_Dummy+42)
	/* (struct Image *) Custom checkbox image, Checked state. */

#define	LISTBROWSER_UncheckedImage	(LISTBROWSER_Dummy+43)
	/* (struct Image *) Custom checkbox image, UnChecked state. */

#define	LISTBROWSER_TotalNodes		(LISTBROWSER_Dummy+44)
	/* (LONG) Total node count. */

#define	LISTBROWSER_MinNodeSize		(LISTBROWSER_Dummy+45)
	/* (LONG) Minimum Node size for custom MemPool custom node optimization */

#define	LISTBROWSER_TitleClickable	(LISTBROWSER_Dummy+46)
	/* (BOOL) Allow column-title bar clicking. */

#define	LISTBROWSER_MinVisible		(LISTBROWSER_Dummy+47)
	/* (LONG) Minimum visible node count. This is a causes the
	 * minimum domain to be large enough to hold the specified number of
	 * nodes using the the estimated average node height. Note, ESTIMATED,
	 * this is not garanteed results. The result may be slightly more or
	 * less than specified, and potentially alot greater if other objects
	 * within the layout group cause the listbrowser to layout larger
	 * than its minimum domain.
	 */

#define	LISTBROWSER_Reserved6		(LISTBROWSER_Dummy+48)
	/* RESERVED */

#define	LISTBROWSER_Reserved7		(LISTBROWSER_Dummy+49)
	/* RESERVED */

#define	LISTBROWSER_PersistSelect	(LISTBROWSER_Dummy+50)
	/* (LONG) When set TRUE, SHIFT key is NOT required for multi-select. */

#define	LISTBROWSER_CursorSelect	(LISTBROWSER_Dummy+51)
	/* (LONG) Keyboard Cursor Selected Node Number */

#define	LISTBROWSER_CursorNode		(LISTBROWSER_Dummy+52)
	/* (struct Node *) Keyboard Cursor Selected Node */

#define	LISTBROWSER_FastRender		(LISTBROWSER_Dummy+53)
	/* (BOOL) Causes use of mask planes, and turns off custom pen support */
	/* The improvement with deep ECS or AGA display is *HUGE*. */

#define	LISTBROWSER_TotalVisibleNodes	(LISTBROWSER_Dummy+54)
	/* (LONG) Total visible node count. */

#define	LISTBROWSER_WrapText	(LISTBROWSER_Dummy+55)
	/* (BOOL) Enable word wrap of text nodes */


/* Possible values for LISTBROWSER_Position.
 */
#define LBP_LINEUP 1
#define LBP_LINEDOWN 2
#define LBP_PAGEUP 3
#define LBP_PAGEDOWN 4
#define LBP_TOP 5
#define LBP_BOTTOM 6
#define LBP_SHIFTLEFT 10
#define LBP_SHIFTRIGHT 11
#define LBP_LEFTEDGE 12
#define LBP_RIGHTEDGE 13

/* Possible values for LISTBROWSER_RelEvent.
 */
#define LBRE_NORMAL 1
#define LBRE_HIDECHILDREN 2
#define LBRE_SHOWCHILDREN 4
#define LBRE_EDIT 8
#define LBRE_DOUBLECLICK 16
#define LBRE_CHECKED 32
#define LBRE_UNCHECKED 64
#define LBRE_TITLECLICK 128
#define LBRE_COLUMNADJUST 256

/*****************************************************************************/

#endif /* GADGETS_LISTBROWSER_H */
