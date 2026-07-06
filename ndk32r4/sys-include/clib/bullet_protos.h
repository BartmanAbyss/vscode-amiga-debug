/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_BULLET_PROTOS_H
#define CLIB_BULLET_PROTOS_H

/*
**   $VER: bullet_protos.h $VER: bullet_lib.sfd 47.1 (30.11.2021) $VER: bullet_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <utility/tagitem.h>
#include <diskfont/glyph.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "bullet.library" */
struct GlyphEngine *OpenEngine(void);
VOID CloseEngine(struct GlyphEngine *glyphEngine);
ULONG SetInfoA(struct GlyphEngine *glyphEngine, CONST struct TagItem *tagList);
ULONG SetInfo(struct GlyphEngine *glyphEngine, Tag _tag1, ...);
ULONG ObtainInfoA(struct GlyphEngine *glyphEngine, CONST struct TagItem *tagList);
ULONG ObtainInfo(struct GlyphEngine *glyphEngine, Tag _tag1, ...);
ULONG ReleaseInfoA(struct GlyphEngine *glyphEngine, CONST struct TagItem *tagList);
ULONG ReleaseInfo(struct GlyphEngine *glyphEngine, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_BULLET_PROTOS_H */
