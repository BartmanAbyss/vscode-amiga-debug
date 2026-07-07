/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_DISKFONT_PROTOS_H
#define CLIB_DISKFONT_PROTOS_H

/*
**   $VER: diskfont_protos.h $VER: diskfont_lib.sfd 47.1 (30.11.2021) $VER: diskfont_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <dos/dos.h>
#include <diskfont/diskfont.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "diskfont.library" */
struct TextFont *OpenDiskFont(struct TextAttr *textAttr);
LONG AvailFonts(struct AvailFontsHeader *buffer, LONG bufBytes, ULONG flags);

/*--- functions in V34 or higher ---*/
struct FontContentsHeader *NewFontContents(BPTR fontsLock, CONST_STRPTR fontName);
VOID DisposeFontContents(struct FontContentsHeader *fontContentsHeader);

/*--- functions in V36 or higher ---*/
struct DiskFont *NewScaledDiskFont(struct TextFont *sourceFont, struct TextAttr *destTextAttr);

/*--- functions in V45 or higher ---*/
LONG GetDiskFontCtrl(LONG tagid);
VOID SetDiskFontCtrlA(CONST struct TagItem * taglist);
VOID SetDiskFontCtrl(Tag tag1, ...);

/*--- functions in V47 or higher ---*/
LONG EOpenEngine(struct EGlyphEngine *EEngine);
VOID ECloseEngine(struct EGlyphEngine *EEngine);
ULONG ESetInfoA(struct EGlyphEngine *EEngine, CONST struct TagItem *taglist);
ULONG ESetInfo(struct EGlyphEngine *EEngine, Tag _tag1, ...);
ULONG EObtainInfoA(struct EGlyphEngine *EEngine, CONST struct TagItem *taglist);
ULONG EObtainInfo(struct EGlyphEngine *EEngine, Tag _tag1, ...);
ULONG EReleaseInfoA(struct EGlyphEngine *EEngine, CONST struct TagItem *taglist);
ULONG EReleaseInfo(struct EGlyphEngine *EEngine, Tag _tag1, ...);
struct OutlineFont *OpenOutlineFont(CONST_STRPTR name, struct List *list, ULONG flags);
VOID CloseOutlineFont(struct OutlineFont *olf, struct List *list);
LONG WriteFontContents(BPTR fontsLock, CONST_STRPTR fontName, CONST struct FontContentsHeader *fontContentsHeader);
LONG WriteDiskFontHeaderA(CONST struct TextFont *font, CONST_STRPTR fileName, CONST struct TagItem *tagList);
LONG WriteDiskFontHeader(CONST struct TextFont *font, CONST_STRPTR fileName, Tag _tag1, ...);
ULONG ObtainCharsetInfo(ULONG knownTag, ULONG knownValue, ULONG wantedTag);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_DISKFONT_PROTOS_H */
