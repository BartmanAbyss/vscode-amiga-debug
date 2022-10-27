#ifndef INTUITION_IOBSOLETE_H
#define INTUITION_IOBSOLETE_H

/*
**  $VER: iobsolete.h 38.1 (22.1.1992)
**  Includes Release 45.1
**
**  Obsolete identifiers for Intuition.  Use the new ones instead!
**
**  (C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/


/* This file contains:
 *
 * 1.  The traditional identifiers for gadget Flags, Activation, and Type,
 * and for window Flags and IDCMP classes.  They are defined in terms
 * of their new versions, which serve to prevent confusion between
 * similar-sounding but different identifiers (like IDCMP_WINDOWACTIVE
 * and WFLG_ACTIVATE).
 *
 * 2.  Some tag names and constants whose labels were adjusted after V36.
 *
 * By default, 1 and 2 are enabled.
 *
 * #define INTUI_V36_NAMES_ONLY to exclude the traditional identifiers and
 * the original V36 names of some identifiers.
 *
 */


#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

/* #define INTUI_V36_NAMES_ONLY to remove these older names */

#ifndef INTUI_V36_NAMES_ONLY


/* V34-style Gadget->Flags names: */

#define GADGHIGHBITS	GFLG_GADGHIGHBITS
#define GADGHCOMP	GFLG_GADGHCOMP
#define GADGHBOX	GFLG_GADGHBOX
#define GADGHIMAGE	GFLG_GADGHIMAGE
#define GADGHNONE	GFLG_GADGHNONE
#define GADGIMAGE	GFLG_GADGIMAGE
#define GRELBOTTOM	GFLG_RELBOTTOM
#define GRELRIGHT	GFLG_RELRIGHT
#define GRELWIDTH	GFLG_RELWIDTH
#define GRELHEIGHT	GFLG_RELHEIGHT
#define SELECTED	GFLG_SELECTED
#define GADGDISABLED	GFLG_DISABLED
#define LABELMASK	GFLG_LABELMASK
#define LABELITEXT	GFLG_LABELITEXT
#define	LABELSTRING	GFLG_LABELSTRING
#define LABELIMAGE	GFLG_LABELIMAGE


/* V34-style Gadget->Activation flag names: */

#define RELVERIFY	GACT_RELVERIFY
#define GADGIMMEDIATE	GACT_IMMEDIATE
#define ENDGADGET	GACT_ENDGADGET
#define FOLLOWMOUSE	GACT_FOLLOWMOUSE
#define RIGHTBORDER	GACT_RIGHTBORDER
#define LEFTBORDER	GACT_LEFTBORDER
#define TOPBORDER	GACT_TOPBORDER
#define BOTTOMBORDER	GACT_BOTTOMBORDER
#define BORDERSNIFF	GACT_BORDERSNIFF
#define TOGGLESELECT	GACT_TOGGLESELECT
#define BOOLEXTEND	GACT_BOOLEXTEND
#define STRINGLEFT	GACT_STRINGLEFT
#define STRINGCENTER	GACT_STRINGCENTER
#define STRINGRIGHT	GACT_STRINGRIGHT
#define LONGINT		GACT_LONGINT
#define ALTKEYMAP	GACT_ALTKEYMAP
#define STRINGEXTEND	GACT_STRINGEXTEND
#define ACTIVEGADGET	GACT_ACTIVEGADGET


/* V34-style Gadget->Type names: */

#define GADGETTYPE	GTYP_GADGETTYPE
#define SYSGADGET	GTYP_SYSGADGET
#define SCRGADGET	GTYP_SCRGADGET
#define GZZGADGET	GTYP_GZZGADGET
#define REQGADGET	GTYP_REQGADGET
#define SIZING		GTYP_SIZING
#define WDRAGGING	GTYP_WDRAGGING
#define SDRAGGING	GTYP_SDRAGGING
#define WUPFRONT	GTYP_WUPFRONT
#define SUPFRONT	GTYP_SUPFRONT
#define WDOWNBACK	GTYP_WDOWNBACK
#define SDOWNBACK	GTYP_SDOWNBACK
#define CLOSE		GTYP_CLOSE
#define BOOLGADGET	GTYP_BOOLGADGET
#define GADGET0002	GTYP_GADGET0002
#define PROPGADGET	GTYP_PROPGADGET
#define STRGADGET	GTYP_STRGADGET
#define CUSTOMGADGET	GTYP_CUSTOMGADGET
#define GTYPEMASK	GTYP_GTYPEMASK


/* V34-style IDCMP class names: */

#define SIZEVERIFY	IDCMP_SIZEVERIFY
#define NEWSIZE		IDCMP_NEWSIZE
#define REFRESHWINDOW	IDCMP_REFRESHWINDOW
#define MOUSEBUTTONS	IDCMP_MOUSEBUTTONS
#define MOUSEMOVE	IDCMP_MOUSEMOVE
#define GADGETDOWN	IDCMP_GADGETDOWN
#define GADGETUP	IDCMP_GADGETUP
#define REQSET		IDCMP_REQSET
#define MENUPICK	IDCMP_MENUPICK
#define CLOSEWINDOW	IDCMP_CLOSEWINDOW
#define RAWKEY		IDCMP_RAWKEY
#define REQVERIFY	IDCMP_REQVERIFY
#define REQCLEAR	IDCMP_REQCLEAR
#define MENUVERIFY	IDCMP_MENUVERIFY
#define NEWPREFS	IDCMP_NEWPREFS
#define DISKINSERTED	IDCMP_DISKINSERTED
#define DISKREMOVED	IDCMP_DISKREMOVED
#define WBENCHMESSAGE	IDCMP_WBENCHMESSAGE
#define ACTIVEWINDOW	IDCMP_ACTIVEWINDOW
#define INACTIVEWINDOW	IDCMP_INACTIVEWINDOW
#define DELTAMOVE	IDCMP_DELTAMOVE
#define VANILLAKEY	IDCMP_VANILLAKEY
#define INTUITICKS	IDCMP_INTUITICKS
#define IDCMPUPDATE	IDCMP_IDCMPUPDATE
#define MENUHELP	IDCMP_MENUHELP
#define CHANGEWINDOW	IDCMP_CHANGEWINDOW
#define LONELYMESSAGE	IDCMP_LONELYMESSAGE


/* V34-style Window->Flags names: */

#define WINDOWSIZING	WFLG_SIZEGADGET
#define WINDOWDRAG	WFLG_DRAGBAR
#define WINDOWDEPTH	WFLG_DEPTHGADGET
#define WINDOWCLOSE	WFLG_CLOSEGADGET
#define SIZEBRIGHT	WFLG_SIZEBRIGHT
#define SIZEBBOTTOM	WFLG_SIZEBBOTTOM
#define REFRESHBITS	WFLG_REFRESHBITS
#define SMART_REFRESH	WFLG_SMART_REFRESH
#define SIMPLE_REFRESH	WFLG_SIMPLE_REFRESH
#define SUPER_BITMAP	WFLG_SUPER_BITMAP
#define OTHER_REFRESH	WFLG_OTHER_REFRESH
#define BACKDROP	WFLG_BACKDROP
#define REPORTMOUSE	WFLG_REPORTMOUSE
#define GIMMEZEROZERO	WFLG_GIMMEZEROZERO
#define BORDERLESS	WFLG_BORDERLESS
#define ACTIVATE	WFLG_ACTIVATE
#define WINDOWACTIVE	WFLG_WINDOWACTIVE
#define INREQUEST	WFLG_INREQUEST
#define MENUSTATE	WFLG_MENUSTATE
#define RMBTRAP		WFLG_RMBTRAP
#define NOCAREREFRESH	WFLG_NOCAREREFRESH
#define WINDOWREFRESH	WFLG_WINDOWREFRESH
#define WBENCHWINDOW	WFLG_WBENCHWINDOW
#define WINDOWTICKED	WFLG_WINDOWTICKED
#define NW_EXTENDED	WFLG_NW_EXTENDED
#define VISITOR		WFLG_VISITOR
#define ZOOMED		WFLG_ZOOMED
#define HASZOOM		WFLG_HASZOOM


/* These are the obsolete tag names for general gadgets, proportional gadgets,
 * and string gadgets.	Use the mixed-case equivalents from gadgetclass.h
 * instead.
 */

#define GA_LEFT			GA_Left
#define GA_RELRIGHT		GA_RelRight
#define GA_TOP			GA_Top
#define GA_RELBOTTOM		GA_RelBottom
#define GA_WIDTH		GA_Width
#define GA_RELWIDTH		GA_RelWidth
#define GA_HEIGHT		GA_Height
#define GA_RELHEIGHT		GA_RelHeight
#define GA_TEXT			GA_Text
#define GA_IMAGE		GA_Image
#define GA_BORDER		GA_Border
#define GA_SELECTRENDER		GA_SelectRender
#define GA_HIGHLIGHT		GA_Highlight
#define GA_DISABLED		GA_Disabled
#define GA_GZZGADGET		GA_GZZGadget
#define GA_USERDATA		GA_UserData
#define GA_SPECIALINFO		GA_SpecialInfo
#define GA_SELECTED		GA_Selected
#define GA_ENDGADGET		GA_EndGadget
#define GA_IMMEDIATE		GA_Immediate
#define GA_RELVERIFY		GA_RelVerify
#define GA_FOLLOWMOUSE		GA_FollowMouse
#define GA_RIGHTBORDER		GA_RightBorder
#define GA_LEFTBORDER		GA_LeftBorder
#define GA_TOPBORDER		GA_TopBorder
#define GA_BOTTOMBORDER		GA_BottomBorder
#define GA_TOGGLESELECT		GA_ToggleSelect
#define GA_SYSGADGET		GA_SysGadget
#define GA_SYSGTYPE		GA_SysGType
#define GA_PREVIOUS		GA_Previous
#define GA_NEXT			GA_Next
#define GA_DRAWINFO		GA_DrawInfo
#define GA_INTUITEXT		GA_IntuiText
#define GA_LABELIMAGE		GA_LabelImage

#define PGA_FREEDOM		PGA_Freedom
#define PGA_BORDERLESS		PGA_Borderless
#define PGA_HORIZPOT		PGA_HorizPot
#define PGA_HORIZBODY		PGA_HorizBody
#define PGA_VERTPOT		PGA_VertPot
#define PGA_VERTBODY		PGA_VertBody
#define PGA_TOTAL		PGA_Total
#define PGA_VISIBLE		PGA_Visible
#define PGA_TOP			PGA_Top

#define LAYOUTA_LAYOUTOBJ	LAYOUTA_LayoutObj
#define LAYOUTA_SPACING		LAYOUTA_Spacing
#define LAYOUTA_ORIENTATION	LAYOUTA_Orientation


/* These are the obsolete tag names for image attributes.
 * Use the mixed-case equivalents from imageclass.h instead.
 */

#define IMAGE_ATTRIBUTES	(IA_Dummy)
#define IA_LEFT			IA_Left
#define IA_TOP			IA_Top
#define IA_WIDTH		IA_Width
#define IA_HEIGHT		IA_Height
#define IA_FGPEN		IA_FGPen
#define IA_BGPEN		IA_BGPen
#define IA_DATA			IA_Data
#define IA_LINEWIDTH		IA_LineWidth
#define IA_PENS			IA_Pens
#define IA_RESOLUTION		IA_Resolution
#define IA_APATTERN		IA_APattern
#define IA_APATSIZE		IA_APatSize
#define IA_MODE			IA_Mode
#define IA_FONT			IA_Font
#define IA_OUTLINE		IA_Outline
#define IA_RECESSED		IA_Recessed
#define IA_DOUBLEEMBOSS		IA_DoubleEmboss
#define IA_EDGESONLY		IA_EdgesOnly
#define IA_SHADOWPEN		IA_ShadowPen
#define IA_HIGHLIGHTPEN		IA_HighlightPen


/* These are the obsolete identifiers for the various DrawInfo pens.
 * Use the uppercase versions in screens.h instead.
 */

#define detailPen	DETAILPEN
#define blockPen	BLOCKPEN
#define textPen		TEXTPEN
#define shinePen	SHINEPEN
#define shadowPen	SHADOWPEN
#define hifillPen	FILLPEN
#define hifilltextPen	FILLTEXTPEN
#define backgroundPen	BACKGROUNDPEN
#define hilighttextPen	HIGHLIGHTTEXTPEN
#define numDrIPens	NUMDRIPENS


#endif /* !INTUI_V36_NAMES_ONLY */

#endif /* INTUITION_IOBSOLETE_H */
