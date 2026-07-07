/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_GRAPHICS_PROTOS_H
#define CLIB_GRAPHICS_PROTOS_H

/*
**   $VER: graphics_protos.h $VER: graphics_lib.sfd 47.2 (30.11.2021) $VER: graphics_lib.sfd 47.2 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <graphics/gfxbase.h>
#include <graphics/gfx.h>
#include <graphics/displayinfo.h>
#include <graphics/gels.h>
#include <graphics/rastport.h>
#include <graphics/view.h>
#include <graphics/copper.h>
#include <graphics/clip.h>
#include <graphics/regions.h>
#include <graphics/sprite.h>
#include <graphics/text.h>
#include <hardware/blit.h>
#include <graphics/scale.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "graphics.library" */
/*------ BitMap primitives ------*/
LONG BltBitMap(CONST struct BitMap *srcBitMap, WORD xSrc, WORD ySrc, struct BitMap *destBitMap, WORD xDest, WORD yDest, WORD xSize, WORD ySize, UBYTE minterm, UBYTE mask, PLANEPTR tempA);
VOID BltTemplate(CONST PLANEPTR source, WORD xSrc, WORD srcMod, struct RastPort *destRP, WORD xDest, WORD yDest, WORD xSize, WORD ySize);

/*------ Text routines ------*/
VOID ClearEOL(struct RastPort *rp);
VOID ClearScreen(struct RastPort *rp);
WORD TextLength(struct RastPort *rp, CONST_STRPTR string, UWORD count);
LONG Text(struct RastPort *rp, CONST_STRPTR string, UWORD count);
LONG SetFont(struct RastPort *rp, struct TextFont *textFont);
struct TextFont *OpenFont(CONST struct TextAttr *textAttr);
VOID CloseFont(struct TextFont *textFont);
ULONG AskSoftStyle(struct RastPort *rp);
ULONG SetSoftStyle(struct RastPort *rp, ULONG style, ULONG enable);

/*------	Gels routines ------*/
VOID AddBob(struct Bob *bob, struct RastPort *rp);
VOID AddVSprite(struct VSprite *vSprite, struct RastPort *rp);
VOID DoCollision(struct RastPort *rp);
VOID DrawGList(struct RastPort *rp, struct ViewPort *vp);
VOID InitGels(struct VSprite *head, struct VSprite *tail, struct GelsInfo *gelsInfo);
VOID InitMasks(struct VSprite *vSprite);
VOID RemIBob(struct Bob *bob, struct RastPort *rp, struct ViewPort *vp);
VOID RemVSprite(struct VSprite *vSprite);
VOID SetCollision(ULONG num, VOID (*routine)(struct VSprite *gelA,struct VSprite *gelB), struct GelsInfo *gelsInfo);
VOID SortGList(struct RastPort *rp);
VOID AddAnimOb(struct AnimOb *anOb, struct AnimOb **anKey, struct RastPort *rp);
VOID Animate(struct AnimOb **anKey, struct RastPort *rp);
BOOL GetGBuffers(struct AnimOb *anOb, struct RastPort *rp, BOOL flag);
VOID InitGMasks(struct AnimOb *anOb);

/*------	General graphics routines ------*/
VOID DrawEllipse(struct RastPort *rp, WORD xCenter, WORD yCenter, WORD a, WORD b);
LONG AreaEllipse(struct RastPort *rp, WORD xCenter, WORD yCenter, WORD a, WORD b);
VOID LoadRGB4(struct ViewPort *vp, CONST UWORD *colors, WORD count);
VOID InitRastPort(struct RastPort *rp);
VOID InitVPort(struct ViewPort *vp);
ULONG MrgCop(struct View *view);
ULONG MakeVPort(struct View *view, struct ViewPort *vp);
VOID LoadView(struct View *view);
VOID WaitBlit(void);
VOID SetRast(struct RastPort *rp, UBYTE pen);
VOID Move(struct RastPort *rp, WORD x, WORD y);
VOID Draw(struct RastPort *rp, WORD x, WORD y);
LONG AreaMove(struct RastPort *rp, WORD x, WORD y);
LONG AreaDraw(struct RastPort *rp, WORD x, WORD y);
LONG AreaEnd(struct RastPort *rp);
VOID WaitTOF(void);
VOID QBlit(struct bltnode *blit);
VOID InitArea(struct AreaInfo *areaInfo, APTR vectorBuffer, WORD maxVectors);
VOID SetRGB4(struct ViewPort *vp, WORD index, UBYTE red, UBYTE green, UBYTE blue);
VOID QBSBlit(struct bltnode *blit);
VOID BltClear(PLANEPTR memBlock, ULONG byteCount, ULONG flags);
VOID RectFill(struct RastPort *rp, WORD xMin, WORD yMin, WORD xMax, WORD yMax);
VOID BltPattern(struct RastPort *rp, CONST PLANEPTR mask, WORD xMin, WORD yMin, WORD xMax, WORD yMax, UWORD maskBPR);
ULONG ReadPixel(struct RastPort *rp, WORD x, WORD y);
LONG WritePixel(struct RastPort *rp, WORD x, WORD y);
BOOL Flood(struct RastPort *rp, ULONG mode, WORD x, WORD y);
VOID PolyDraw(struct RastPort *rp, WORD count, CONST WORD *polyTable);
VOID SetAPen(struct RastPort *rp, UBYTE pen);
VOID SetBPen(struct RastPort *rp, UBYTE pen);
VOID SetDrMd(struct RastPort *rp, UBYTE drawMode);
VOID InitView(struct View *view);
VOID CBump(struct UCopList *copList);
LONG CMove(struct UCopList *copList, APTR destination, WORD data);
LONG CWait(struct UCopList *copList, WORD v, WORD h);
LONG VBeamPos(void);
VOID InitBitMap(struct BitMap *bitMap, BYTE depth, WORD width, WORD height);
VOID ScrollRaster(struct RastPort *rp, WORD dx, WORD dy, WORD xMin, WORD yMin, WORD xMax, WORD yMax);
VOID WaitBOVP(struct ViewPort *vp);
WORD GetSprite(struct SimpleSprite *sprite, WORD num);
VOID FreeSprite(WORD num);
VOID ChangeSprite(struct ViewPort *vp, struct SimpleSprite *sprite, UWORD * newData);
VOID MoveSprite(struct ViewPort *vp, struct SimpleSprite *sprite, WORD x, WORD y);
VOID LockLayerRom(struct Layer *layer);
VOID UnlockLayerRom(struct Layer *layer);
VOID SyncSBitMap(struct Layer *layer);
VOID CopySBitMap(struct Layer *layer);
VOID OwnBlitter(void);
VOID DisownBlitter(void);
struct TmpRas *InitTmpRas(struct TmpRas *tmpRas, PLANEPTR buffer, LONG size);
VOID AskFont(struct RastPort *rp, struct TextAttr *textAttr);
VOID AddFont(struct TextFont *textFont);
VOID RemFont(struct TextFont *textFont);
PLANEPTR AllocRaster(UWORD width, UWORD height);
VOID FreeRaster(PLANEPTR p, UWORD width, UWORD height);
VOID AndRectRegion(struct Region *region, CONST struct Rectangle *rectangle);
BOOL OrRectRegion(struct Region *region, CONST struct Rectangle *rectangle);
struct Region *NewRegion(void);
BOOL ClearRectRegion(struct Region *region, CONST struct Rectangle *rectangle);
VOID ClearRegion(struct Region *region);
VOID DisposeRegion(struct Region *region);
VOID FreeVPortCopLists(struct ViewPort *vp);
VOID FreeCopList(struct CopList *copList);
VOID ClipBlit(struct RastPort *srcRP, WORD xSrc, WORD ySrc, struct RastPort *destRP, WORD xDest, WORD yDest, WORD xSize, WORD ySize, UBYTE minterm);
BOOL XorRectRegion(struct Region *region, CONST struct Rectangle *rectangle);
VOID FreeCprList(struct cprlist *cprList);
struct ColorMap *GetColorMap(LONG entries);
VOID FreeColorMap(struct ColorMap *colorMap);
ULONG GetRGB4(struct ColorMap *colorMap, LONG entry);
VOID ScrollVPort(struct ViewPort *vp);
struct CopList *UCopperListInit(struct UCopList *uCopList, WORD n);
VOID FreeGBuffers(struct AnimOb *anOb, struct RastPort *rp, BOOL flag);
VOID BltBitMapRastPort(CONST struct BitMap *srcBitMap, WORD xSrc, WORD ySrc, struct RastPort *destRP, WORD xDest, WORD yDest, WORD xSize, WORD ySize, UBYTE minterm);
BOOL OrRegionRegion(CONST struct Region *srcRegion, struct Region *destRegion);
BOOL XorRegionRegion(CONST struct Region *srcRegion, struct Region *destRegion);
BOOL AndRegionRegion(CONST struct Region *srcRegion, struct Region *destRegion);
VOID SetRGB4CM(struct ColorMap *colorMap, WORD index, UBYTE red, UBYTE green, UBYTE blue);
VOID BltMaskBitMapRastPort(CONST struct BitMap *srcBitMap, WORD xSrc, WORD ySrc, struct RastPort *destRP, WORD xDest, WORD yDest, WORD xSize, WORD ySize, UBYTE minterm, CONST PLANEPTR bltMask);
BOOL AttemptLockLayerRom(struct Layer *layer);

/*--- functions in V36 or higher ---*/
APTR GfxNew(ULONG gfxNodeType);
VOID GfxFree(APTR gfxNodePtr);
VOID GfxAssociate(APTR associateNode, APTR gfxNodePtr);
VOID BitMapScale(struct BitScaleArgs *bitScaleArgs);
UWORD ScalerDiv(UWORD factor, UWORD numerator, UWORD denominator);
WORD TextExtent(struct RastPort *rp, CONST_STRPTR string, WORD count, struct TextExtent *textExtent);
ULONG TextFit(struct RastPort *rp, CONST_STRPTR string, UWORD strLen, CONST struct TextExtent *textExtent, CONST struct TextExtent *constrainingExtent, WORD strDirection, UWORD constrainingBitWidth, UWORD constrainingBitHeight);
APTR GfxLookUp(CONST_APTR associateNode);
BOOL VideoControl(struct ColorMap *colorMap, struct TagItem *tagarray);
BOOL VideoControlTags(struct ColorMap *colorMap, ULONG tag1Type, ...);
struct MonitorSpec *OpenMonitor(CONST_STRPTR monitorName, ULONG displayID);
BOOL CloseMonitor(struct MonitorSpec *monitorSpec);
DisplayInfoHandle FindDisplayInfo(ULONG displayID);
ULONG NextDisplayInfo(ULONG displayID);
ULONG GetDisplayInfoData(DisplayInfoHandle handle, APTR buf, ULONG size, ULONG tagID, ULONG displayID);
VOID FontExtent(CONST struct TextFont *font, struct TextExtent *fontExtent);
LONG ReadPixelLine8(struct RastPort *rp, UWORD xstart, UWORD ystart, UWORD width, UBYTE *array, struct RastPort *tempRP);
LONG WritePixelLine8(struct RastPort *rp, UWORD xstart, UWORD ystart, UWORD width, UBYTE *array, struct RastPort *tempRP);
LONG ReadPixelArray8(struct RastPort *rp, UWORD xstart, UWORD ystart, UWORD xstop, UWORD ystop, UBYTE *array, struct RastPort *temprp);
LONG WritePixelArray8(struct RastPort *rp, UWORD xstart, UWORD ystart, UWORD xstop, UWORD ystop, UBYTE *array, struct RastPort *temprp);
LONG GetVPModeID(CONST struct ViewPort *vp);
LONG ModeNotAvailable(ULONG modeID);
WORD WeighTAMatch(CONST struct TextAttr *reqTextAttr, CONST struct TextAttr *targetTextAttr, CONST struct TagItem *targetTags);
WORD WeighTAMatchTags(CONST struct TextAttr *reqTextAttr, CONST struct TextAttr *targetTextAttr, ULONG tag1Type, ...);
VOID EraseRect(struct RastPort *rp, WORD xMin, WORD yMin, WORD xMax, WORD yMax);
ULONG ExtendFont(struct TextFont *font, CONST struct TagItem *fontTags);
ULONG ExtendFontTags(struct TextFont *font, ULONG tag1Type, ...);
VOID StripFont(struct TextFont *font);

/*--- functions in V39 or higher ---*/
UWORD CalcIVG(struct View *v, struct ViewPort *vp);
LONG AttachPalExtra(struct ColorMap *cm, struct ViewPort *vp);
LONG ObtainBestPenA(struct ColorMap *cm, ULONG r, ULONG g, ULONG b, CONST struct TagItem *tags);
LONG ObtainBestPen(struct ColorMap *cm, ULONG r, ULONG g, ULONG b, ULONG tag1Type, ...);
VOID SetRGB32(struct ViewPort *vp, ULONG n, ULONG r, ULONG g, ULONG b);
ULONG GetAPen(struct RastPort *rp);
ULONG GetBPen(struct RastPort *rp);
ULONG GetDrMd(struct RastPort *rp);
ULONG GetOutlinePen(struct RastPort *rp);
VOID LoadRGB32(struct ViewPort *vp, CONST ULONG *table);
ULONG SetChipRev(ULONG want);
VOID SetABPenDrMd(struct RastPort *rp, ULONG apen, ULONG bpen, ULONG drawmode);
VOID GetRGB32(CONST struct ColorMap *cm, ULONG firstcolor, ULONG ncolors, ULONG *table);
struct BitMap *AllocBitMap(ULONG sizex, ULONG sizey, ULONG depth, ULONG flags, CONST struct BitMap *friend_bitmap);
VOID FreeBitMap(struct BitMap *bm);
LONG GetExtSpriteA(struct ExtSprite *ss, CONST struct TagItem *tags);
LONG GetExtSprite(struct ExtSprite *ss, ULONG tag1Type, ...);
ULONG CoerceMode(struct ViewPort *vp, ULONG monitorid, ULONG flags);
VOID ChangeVPBitMap(struct ViewPort *vp, struct BitMap *bm, struct DBufInfo *db);
VOID ReleasePen(struct ColorMap *cm, ULONG n);
ULONG ObtainPen(struct ColorMap *cm, ULONG n, ULONG r, ULONG g, ULONG b, LONG f);
ULONG GetBitMapAttr(CONST struct BitMap *bm, ULONG attrnum);
struct DBufInfo *AllocDBufInfo(struct ViewPort *vp);
VOID FreeDBufInfo(struct DBufInfo *dbi);
ULONG SetOutlinePen(struct RastPort *rp, ULONG pen);
ULONG SetWriteMask(struct RastPort *rp, ULONG msk);
VOID SetMaxPen(struct RastPort *rp, ULONG maxpen);
VOID SetRGB32CM(struct ColorMap *cm, ULONG n, ULONG r, ULONG g, ULONG b);
VOID ScrollRasterBF(struct RastPort *rp, WORD dx, WORD dy, WORD xMin, WORD yMin, WORD xMax, WORD yMax);
LONG FindColor(struct ColorMap *cm, ULONG r, ULONG g, ULONG b, LONG maxcolor);
struct ExtSprite *AllocSpriteDataA(CONST struct BitMap *bm, CONST struct TagItem *tags);
struct ExtSprite *AllocSpriteData(CONST struct BitMap *bm, ULONG tag1Type, ...);
LONG ChangeExtSpriteA(struct ViewPort *vp, struct ExtSprite *oldsprite, struct ExtSprite *newsprite, CONST struct TagItem *tags);
LONG ChangeExtSprite(struct ViewPort *vp, struct ExtSprite *oldsprite, struct ExtSprite *newsprite, ULONG tag1Type, ...);
VOID FreeSpriteData(struct ExtSprite *sp);
VOID SetRPAttrsA(struct RastPort *rp, CONST struct TagItem *tags);
VOID SetRPAttrs(struct RastPort *rp, ULONG tag1Type, ...);
VOID GetRPAttrsA(struct RastPort *rp, CONST struct TagItem *tags);
VOID GetRPAttrs(struct RastPort *rp, ULONG tag1Type, ...);
ULONG BestModeIDA(CONST struct TagItem *tags);
ULONG BestModeID(ULONG tag1Type, ...);

/*--- functions in V40 or higher ---*/
VOID WriteChunkyPixels(struct RastPort *rp, UWORD xstart, UWORD ystart, UWORD xstop, UWORD ystop, UBYTE *array, LONG bytesperrow);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_GRAPHICS_PROTOS_H */
