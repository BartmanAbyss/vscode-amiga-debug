#ifndef GADGETS_TEXTEDITOR_H
#define GADGETS_TEXTEDITOR_H
/*
**	$VER: texteditor.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for texteditor.gadget BOOPSI class
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

#ifndef IMAGES_BEVEL_H
#include <images/bevel.h>
#endif

/*****************************************************************************/

#define   TEXTEDITOR_Dummy   (REACTION_Dummy + 0x26000)

#define   GA_TEXTEDITOR_AreaMarked        (TEXTEDITOR_Dummy + 0x14)
#define   GA_TEXTEDITOR_ColorMap          (TEXTEDITOR_Dummy + 0x2f)
#define   GA_TEXTEDITOR_Contents          (TEXTEDITOR_Dummy + 0x02)
#define   GA_TEXTEDITOR_CursorX           (TEXTEDITOR_Dummy + 0x04)
#define   GA_TEXTEDITOR_CursorY           (TEXTEDITOR_Dummy + 0x05)
#define   GA_TEXTEDITOR_DoubleClickHook   (TEXTEDITOR_Dummy + 0x06)
#define   GA_TEXTEDITOR_ExportHook        (TEXTEDITOR_Dummy + 0x08)
#define   GA_TEXTEDITOR_ExportWrap        (TEXTEDITOR_Dummy + 0x09)
#define   GA_TEXTEDITOR_FixedFont         (TEXTEDITOR_Dummy + 0x0a)
#define   GA_TEXTEDITOR_Flow              (TEXTEDITOR_Dummy + 0x0b)
#define   GA_TEXTEDITOR_HasChanged        (TEXTEDITOR_Dummy + 0x0c)
#define   GA_TEXTEDITOR_HorizontalScroll  (TEXTEDITOR_Dummy + 0x2d) /* Private and experimental! */
#define   GA_TEXTEDITOR_ImportHook        (TEXTEDITOR_Dummy + 0x0e)
#define   GA_TEXTEDITOR_ImportWrap        (TEXTEDITOR_Dummy + 0x10)
#define   GA_TEXTEDITOR_InsertMode        (TEXTEDITOR_Dummy + 0x0f)
#define   GA_TEXTEDITOR_KeyBindings       (TEXTEDITOR_Dummy + 0x11)
#define   GA_TEXTEDITOR_NumLock           (TEXTEDITOR_Dummy + 0x18)
#define   GA_TEXTEDITOR_Pen               (TEXTEDITOR_Dummy + 0x2e)
#define   GA_TEXTEDITOR_PopWindow_Open    (TEXTEDITOR_Dummy + 0x03) /* Private!!! */
#define   GA_TEXTEDITOR_Prop_DeltaFactor  (TEXTEDITOR_Dummy + 0x0d)
#define   GA_TEXTEDITOR_Prop_Entries      (TEXTEDITOR_Dummy + 0x15)
#define   GA_TEXTEDITOR_Prop_First        (TEXTEDITOR_Dummy + 0x20)
#define   GA_TEXTEDITOR_Prop_Release      (TEXTEDITOR_Dummy + 0x01) /* Private!!! */
#define   GA_TEXTEDITOR_Prop_Visible      (TEXTEDITOR_Dummy + 0x16)
#define   GA_TEXTEDITOR_Quiet             (TEXTEDITOR_Dummy + 0x17)
#define   GA_TEXTEDITOR_ReadOnly          (TEXTEDITOR_Dummy + 0x19)
#define   GA_TEXTEDITOR_RedoAvailable     (TEXTEDITOR_Dummy + 0x13)
#define   GA_TEXTEDITOR_Separator         (TEXTEDITOR_Dummy + 0x2c)
#define   GA_TEXTEDITOR_StyleBold         (TEXTEDITOR_Dummy + 0x1c)
#define   GA_TEXTEDITOR_StyleItalic       (TEXTEDITOR_Dummy + 0x1d)
#define   GA_TEXTEDITOR_StyleUnderline    (TEXTEDITOR_Dummy + 0x1e)
#define   GA_TEXTEDITOR_TypeAndSpell      (TEXTEDITOR_Dummy + 0x07)
#define   GA_TEXTEDITOR_UndoAvailable     (TEXTEDITOR_Dummy + 0x12)
#define   GA_TEXTEDITOR_WrapBorder        (TEXTEDITOR_Dummy + 0x21)

#undef    TEXTEDITOR_Dummy
#define   TEXTEDITOR_Dummy   (0x45000)

#define   GM_TEXTEDITOR_AddKeyBindings    (TEXTEDITOR_Dummy + 0x22)
#define   GM_TEXTEDITOR_ARexxCmd          (TEXTEDITOR_Dummy + 0x23)
#define   GM_TEXTEDITOR_BlockInfo         (TEXTEDITOR_Dummy + 0x30)
#define   GM_TEXTEDITOR_ClearText         (TEXTEDITOR_Dummy + 0x24)
#define   GM_TEXTEDITOR_ExportText        (TEXTEDITOR_Dummy + 0x25)
#define   GM_TEXTEDITOR_HandleError       (TEXTEDITOR_Dummy + 0x1f)
#define   GM_TEXTEDITOR_InsertText        (TEXTEDITOR_Dummy + 0x26)
#define   GM_TEXTEDITOR_MacroBegin        (TEXTEDITOR_Dummy + 0x27)
#define   GM_TEXTEDITOR_MacroEnd          (TEXTEDITOR_Dummy + 0x28)
#define   GM_TEXTEDITOR_MacroExecute      (TEXTEDITOR_Dummy + 0x29)
#define   GM_TEXTEDITOR_MarkText          (TEXTEDITOR_Dummy + 0x2c)
#define   GM_TEXTEDITOR_Replace           (TEXTEDITOR_Dummy + 0x2a)
#define   GM_TEXTEDITOR_Search            (TEXTEDITOR_Dummy + 0x2b)
struct    GP_TEXTEDITOR_ARexxCmd          { ULONG MethodID; struct GadgetInfo *GInfo; STRPTR command; };
struct    GP_TEXTEDITOR_BlockInfo         { ULONG MethodID; struct GadgetInfo *GInfo; ULONG *startx; ULONG *starty; ULONG *stopx; ULONG *stopy; };
struct    GP_TEXTEDITOR_ClearText         { ULONG MethodID; struct GadgetInfo *GInfo; };
struct    GP_TEXTEDITOR_ExportText        { ULONG MethodID; struct GadgetInfo *GInfo; };
struct    GP_TEXTEDITOR_HandleError       { ULONG MethodID; ULONG errorcode; }; /* See below for error codes */
struct    GP_TEXTEDITOR_InsertText        { ULONG MethodID; struct GadgetInfo *GInfo; STRPTR text; LONG pos; }; /* See below for positions */
struct    GP_TEXTEDITOR_MarkText          { ULONG MethodID; struct GadgetInfo *GInfo; ULONG start_crsr_x; ULONG start_crsr_y; ULONG stop_crsr_x; ULONG stop_crsr_y; };
struct    GP_TEXTEDITOR_Replace           { ULONG MethodID; struct GadgetInfo *GInfo; STRPTR newstring; ULONG flags; };
struct    GP_TEXTEDITOR_Search            { ULONG MethodID; struct GadgetInfo *GInfo; STRPTR string; ULONG flags; }; /* See below for flags */

#define   GV_TEXTEDITOR_ExportHook_Plain       0x00000000
#define   GV_TEXTEDITOR_ExportHook_EMail       0x00000001

#define   GV_TEXTEDITOR_Flow_Left              0x00000000
#define   GV_TEXTEDITOR_Flow_Center            0x00000001
#define   GV_TEXTEDITOR_Flow_Right             0x00000002
#define   GV_TEXTEDITOR_Flow_Justified         0x00000003

#define   GV_TEXTEDITOR_ImportHook_Plain       0x00000000
#define   GV_TEXTEDITOR_ImportHook_EMail       0x00000002
#define   GV_TEXTEDITOR_ImportHook_MIME        0x00000003
#define   GV_TEXTEDITOR_ImportHook_MIMEQuoted  0x00000004

#define   GV_TEXTEDITOR_InsertText_Cursor      0x00000000
#define   GV_TEXTEDITOR_InsertText_Top         0x00000001
#define   GV_TEXTEDITOR_InsertText_Bottom      0x00000002

#define   GV_TEXTEDITOR_LengthHook_Plain       0x00000000
#define   GV_TEXTEDITOR_LengthHook_ANSI        0x00000001
#define   GV_TEXTEDITOR_LengthHook_HTML        0x00000002
#define   GV_TEXTEDITOR_LengthHook_MAIL        0x00000003

#define   GF_TEXTEDITOR_Search_FromTop       (1 << 0)
#define   GF_TEXTEDITOR_Search_Next          (1 << 1)
#define   GF_TEXTEDITOR_Search_CaseSensitive (1 << 2)
#define   GF_TEXTEDITOR_Search_DOSPattern    (1 << 3)
#define   GF_TEXTEDITOR_Search_Backwards     (1 << 4)

/* Error codes given as argument to GM_TEXTEDITOR_HandleError */
#define   Error_ClipboardIsEmpty         0x01
#define   Error_ClipboardIsNotFTXT       0x02
#define   Error_MacroBufferIsFull        0x03
#define   Error_MemoryAllocationFailed   0x04
#define   Error_NoAreaMarked             0x05
#define   Error_NoMacroDefined           0x06
#define   Error_NothingToRedo            0x07
#define   Error_NothingToUndo            0x08
#define   Error_NotEnoughUndoMem         0x09 /* This will cause all the stored undos to be freed */
#define   Error_StringNotFound           0x0a
#define   Error_NoBookmarkInstalled      0x0b
#define   Error_BookmarkHasBeenLost      0x0c

struct ClickMessage
{
   STRPTR  LineContents;  /* This field is ReadOnly!!! */
   ULONG   ClickPosition;
};

/* Definitions for Separator type */

#define LNSB_Top             0 /* Mutual exclude: */
#define LNSB_Middle          1 /* Placement of    */
#define LNSB_Bottom          2 /*  the separator  */
#define LNSB_StrikeThru      3 /* Let separator go thru the textfont */
#define LNSB_Thick           4 /* Extra thick separator */

#define LNSF_Top             (1<<LNSB_Top)
#define LNSF_Middle          (1<<LNSB_Middle)
#define LNSF_Bottom          (1<<LNSB_Bottom)
#define LNSF_StrikeThru      (1<<LNSB_StrikeThru)
#define LNSF_Thick           (1<<LNSB_Thick)

#endif /* GADGETS_TEXTEDITOR_H */
