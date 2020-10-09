/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_GRAPHICS_H
#define _INLINE_GRAPHICS_H

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

#ifndef GRAPHICS_BASE_NAME
#define GRAPHICS_BASE_NAME GfxBase
#endif /* !GRAPHICS_BASE_NAME */

#define BltBitMap(___srcBitMap, ___xSrc, ___ySrc, ___destBitMap, ___xDest, ___yDest, ___xSize, ___ySize, ___minterm, ___mask, ___tempA) \
      LP11(0x1e, LONG, BltBitMap , CONST struct BitMap *, ___srcBitMap, a0, LONG, ___xSrc, d0, LONG, ___ySrc, d1, struct BitMap *, ___destBitMap, a1, LONG, ___xDest, d2, LONG, ___yDest, d3, LONG, ___xSize, d4, LONG, ___ySize, d5, ULONG, ___minterm, d6, ULONG, ___mask, d7, PLANEPTR, ___tempA, a2,\
      , GRAPHICS_BASE_NAME)

#define BltTemplate(___source, ___xSrc, ___srcMod, ___destRP, ___xDest, ___yDest, ___xSize, ___ySize) \
      LP8NR(0x24, BltTemplate , CONST PLANEPTR, ___source, a0, LONG, ___xSrc, d0, LONG, ___srcMod, d1, struct RastPort *, ___destRP, a1, LONG, ___xDest, d2, LONG, ___yDest, d3, LONG, ___xSize, d4, LONG, ___ySize, d5,\
      , GRAPHICS_BASE_NAME)

#define ClearEOL(___rp) \
      LP1NR(0x2a, ClearEOL , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define ClearScreen(___rp) \
      LP1NR(0x30, ClearScreen , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define TextLength(___rp, ___string, ___count) \
      LP3(0x36, WORD, TextLength , struct RastPort *, ___rp, a1, CONST_STRPTR, ___string, a0, ULONG, ___count, d0,\
      , GRAPHICS_BASE_NAME)

#define Text(___rp, ___string, ___count) \
      LP3(0x3c, LONG, Text , struct RastPort *, ___rp, a1, CONST_STRPTR, ___string, a0, ULONG, ___count, d0,\
      , GRAPHICS_BASE_NAME)

#define SetFont(___rp, ___textFont) \
      LP2(0x42, LONG, SetFont , struct RastPort *, ___rp, a1, CONST struct TextFont *, ___textFont, a0,\
      , GRAPHICS_BASE_NAME)

#define OpenFont(___textAttr) \
      LP1(0x48, struct TextFont *, OpenFont , struct TextAttr *, ___textAttr, a0,\
      , GRAPHICS_BASE_NAME)

#define CloseFont(___textFont) \
      LP1NR(0x4e, CloseFont , struct TextFont *, ___textFont, a1,\
      , GRAPHICS_BASE_NAME)

#define AskSoftStyle(___rp) \
      LP1(0x54, ULONG, AskSoftStyle , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define SetSoftStyle(___rp, ___style, ___enable) \
      LP3(0x5a, ULONG, SetSoftStyle , struct RastPort *, ___rp, a1, ULONG, ___style, d0, ULONG, ___enable, d1,\
      , GRAPHICS_BASE_NAME)

#define AddBob(___bob, ___rp) \
      LP2NR(0x60, AddBob , struct Bob *, ___bob, a0, struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define AddVSprite(___vSprite, ___rp) \
      LP2NR(0x66, AddVSprite , struct VSprite *, ___vSprite, a0, struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define DoCollision(___rp) \
      LP1NR(0x6c, DoCollision , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define DrawGList(___rp, ___vp) \
      LP2NR(0x72, DrawGList , struct RastPort *, ___rp, a1, struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define InitGels(___head, ___tail, ___gelsInfo) \
      LP3NR(0x78, InitGels , struct VSprite *, ___head, a0, struct VSprite *, ___tail, a1, struct GelsInfo *, ___gelsInfo, a2,\
      , GRAPHICS_BASE_NAME)

#define InitMasks(___vSprite) \
      LP1NR(0x7e, InitMasks , struct VSprite *, ___vSprite, a0,\
      , GRAPHICS_BASE_NAME)

#define RemIBob(___bob, ___rp, ___vp) \
      LP3NR(0x84, RemIBob , struct Bob *, ___bob, a0, struct RastPort *, ___rp, a1, struct ViewPort *, ___vp, a2,\
      , GRAPHICS_BASE_NAME)

#define RemVSprite(___vSprite) \
      LP1NR(0x8a, RemVSprite , struct VSprite *, ___vSprite, a0,\
      , GRAPHICS_BASE_NAME)

#define SetCollision(___num, ___routine, ___gelsInfo) \
      LP3NRFP(0x90, SetCollision , ULONG, ___num, d0, __fpt, ___routine, a0, struct GelsInfo *, ___gelsInfo, a1,\
      , GRAPHICS_BASE_NAME, VOID (*__fpt)(struct VSprite *gelA,struct VSprite *gelB))

#define SortGList(___rp) \
      LP1NR(0x96, SortGList , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define AddAnimOb(___anOb, ___anKey, ___rp) \
      LP3NR(0x9c, AddAnimOb , struct AnimOb *, ___anOb, a0, struct AnimOb **, ___anKey, a1, struct RastPort *, ___rp, a2,\
      , GRAPHICS_BASE_NAME)

#define Animate(___anKey, ___rp) \
      LP2NR(0xa2, Animate , struct AnimOb **, ___anKey, a0, struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define GetGBuffers(___anOb, ___rp, ___flag) \
      LP3(0xa8, BOOL, GetGBuffers , struct AnimOb *, ___anOb, a0, struct RastPort *, ___rp, a1, LONG, ___flag, d0,\
      , GRAPHICS_BASE_NAME)

#define InitGMasks(___anOb) \
      LP1NR(0xae, InitGMasks , struct AnimOb *, ___anOb, a0,\
      , GRAPHICS_BASE_NAME)

#define DrawEllipse(___rp, ___xCenter, ___yCenter, ___a, ___b) \
      LP5NR(0xb4, DrawEllipse , struct RastPort *, ___rp, a1, LONG, ___xCenter, d0, LONG, ___yCenter, d1, LONG, ___a, d2, LONG, ___b, d3,\
      , GRAPHICS_BASE_NAME)

#define AreaEllipse(___rp, ___xCenter, ___yCenter, ___a, ___b) \
      LP5(0xba, LONG, AreaEllipse , struct RastPort *, ___rp, a1, LONG, ___xCenter, d0, LONG, ___yCenter, d1, LONG, ___a, d2, LONG, ___b, d3,\
      , GRAPHICS_BASE_NAME)

#define LoadRGB4(___vp, ___colors, ___count) \
      LP3NR(0xc0, LoadRGB4 , struct ViewPort *, ___vp, a0, CONST UWORD *, ___colors, a1, LONG, ___count, d0,\
      , GRAPHICS_BASE_NAME)

#define InitRastPort(___rp) \
      LP1NR(0xc6, InitRastPort , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define InitVPort(___vp) \
      LP1NR(0xcc, InitVPort , struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define MrgCop(___view) \
      LP1(0xd2, ULONG, MrgCop , struct View *, ___view, a1,\
      , GRAPHICS_BASE_NAME)

#define MakeVPort(___view, ___vp) \
      LP2(0xd8, ULONG, MakeVPort , struct View *, ___view, a0, struct ViewPort *, ___vp, a1,\
      , GRAPHICS_BASE_NAME)

#define LoadView(___view) \
      LP1NR(0xde, LoadView , struct View *, ___view, a1,\
      , GRAPHICS_BASE_NAME)

#define WaitBlit() \
      LP0NR(0xe4, WaitBlit ,\
      , GRAPHICS_BASE_NAME)

#define SetRast(___rp, ___pen) \
      LP2NR(0xea, SetRast , struct RastPort *, ___rp, a1, ULONG, ___pen, d0,\
      , GRAPHICS_BASE_NAME)

#define Move(___rp, ___x, ___y) \
      LP3NR(0xf0, Move , struct RastPort *, ___rp, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define Draw(___rp, ___x, ___y) \
      LP3NR(0xf6, Draw , struct RastPort *, ___rp, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define AreaMove(___rp, ___x, ___y) \
      LP3(0xfc, LONG, AreaMove , struct RastPort *, ___rp, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define AreaDraw(___rp, ___x, ___y) \
      LP3(0x102, LONG, AreaDraw , struct RastPort *, ___rp, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define AreaEnd(___rp) \
      LP1(0x108, LONG, AreaEnd , struct RastPort *, ___rp, a1,\
      , GRAPHICS_BASE_NAME)

#define WaitTOF() \
      LP0NR(0x10e, WaitTOF ,\
      , GRAPHICS_BASE_NAME)

#define QBlit(___blit) \
      LP1NR(0x114, QBlit , struct bltnode *, ___blit, a1,\
      , GRAPHICS_BASE_NAME)

#define InitArea(___areaInfo, ___vectorBuffer, ___maxVectors) \
      LP3NR(0x11a, InitArea , struct AreaInfo *, ___areaInfo, a0, APTR, ___vectorBuffer, a1, LONG, ___maxVectors, d0,\
      , GRAPHICS_BASE_NAME)

#define SetRGB4(___vp, ___index, ___red, ___green, ___blue) \
      LP5NR(0x120, SetRGB4 , struct ViewPort *, ___vp, a0, LONG, ___index, d0, ULONG, ___red, d1, ULONG, ___green, d2, ULONG, ___blue, d3,\
      , GRAPHICS_BASE_NAME)

#define QBSBlit(___blit) \
      LP1NR(0x126, QBSBlit , struct bltnode *, ___blit, a1,\
      , GRAPHICS_BASE_NAME)

#define BltClear(___memBlock, ___byteCount, ___flags) \
      LP3NR(0x12c, BltClear , PLANEPTR, ___memBlock, a1, ULONG, ___byteCount, d0, ULONG, ___flags, d1,\
      , GRAPHICS_BASE_NAME)

#define RectFill(___rp, ___xMin, ___yMin, ___xMax, ___yMax) \
      LP5NR(0x132, RectFill , struct RastPort *, ___rp, a1, LONG, ___xMin, d0, LONG, ___yMin, d1, LONG, ___xMax, d2, LONG, ___yMax, d3,\
      , GRAPHICS_BASE_NAME)

#define BltPattern(___rp, ___mask, ___xMin, ___yMin, ___xMax, ___yMax, ___maskBPR) \
      LP7NR(0x138, BltPattern , struct RastPort *, ___rp, a1, CONST PLANEPTR, ___mask, a0, LONG, ___xMin, d0, LONG, ___yMin, d1, LONG, ___xMax, d2, LONG, ___yMax, d3, ULONG, ___maskBPR, d4,\
      , GRAPHICS_BASE_NAME)

#define ReadPixel(___rp, ___x, ___y) \
      LP3(0x13e, ULONG, ReadPixel , struct RastPort *, ___rp, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define WritePixel(___rp, ___x, ___y) \
      LP3(0x144, LONG, WritePixel , struct RastPort *, ___rp, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define Flood(___rp, ___mode, ___x, ___y) \
      LP4(0x14a, BOOL, Flood , struct RastPort *, ___rp, a1, ULONG, ___mode, d2, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define PolyDraw(___rp, ___count, ___polyTable) \
      LP3NR(0x150, PolyDraw , struct RastPort *, ___rp, a1, LONG, ___count, d0, CONST WORD *, ___polyTable, a0,\
      , GRAPHICS_BASE_NAME)

#define SetAPen(___rp, ___pen) \
      LP2NR(0x156, SetAPen , struct RastPort *, ___rp, a1, ULONG, ___pen, d0,\
      , GRAPHICS_BASE_NAME)

#define SetBPen(___rp, ___pen) \
      LP2NR(0x15c, SetBPen , struct RastPort *, ___rp, a1, ULONG, ___pen, d0,\
      , GRAPHICS_BASE_NAME)

#define SetDrMd(___rp, ___drawMode) \
      LP2NR(0x162, SetDrMd , struct RastPort *, ___rp, a1, ULONG, ___drawMode, d0,\
      , GRAPHICS_BASE_NAME)

#define InitView(___view) \
      LP1NR(0x168, InitView , struct View *, ___view, a1,\
      , GRAPHICS_BASE_NAME)

#define CBump(___copList) \
      LP1NR(0x16e, CBump , struct UCopList *, ___copList, a1,\
      , GRAPHICS_BASE_NAME)

#define CMove(___copList, ___destination, ___data) \
      LP3NR(0x174, CMove , struct UCopList *, ___copList, a1, APTR, ___destination, d0, LONG, ___data, d1,\
      , GRAPHICS_BASE_NAME)

#define CWait(___copList, ___v, ___h) \
      LP3NR(0x17a, CWait , struct UCopList *, ___copList, a1, LONG, ___v, d0, LONG, ___h, d1,\
      , GRAPHICS_BASE_NAME)

#define VBeamPos() \
      LP0(0x180, LONG, VBeamPos ,\
      , GRAPHICS_BASE_NAME)

#define InitBitMap(___bitMap, ___depth, ___width, ___height) \
      LP4NR(0x186, InitBitMap , struct BitMap *, ___bitMap, a0, LONG, ___depth, d0, LONG, ___width, d1, LONG, ___height, d2,\
      , GRAPHICS_BASE_NAME)

#define ScrollRaster(___rp, ___dx, ___dy, ___xMin, ___yMin, ___xMax, ___yMax) \
      LP7NR(0x18c, ScrollRaster , struct RastPort *, ___rp, a1, LONG, ___dx, d0, LONG, ___dy, d1, LONG, ___xMin, d2, LONG, ___yMin, d3, LONG, ___xMax, d4, LONG, ___yMax, d5,\
      , GRAPHICS_BASE_NAME)

#define WaitBOVP(___vp) \
      LP1NR(0x192, WaitBOVP , struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define GetSprite(___sprite, ___num) \
      LP2(0x198, WORD, GetSprite , struct SimpleSprite *, ___sprite, a0, LONG, ___num, d0,\
      , GRAPHICS_BASE_NAME)

#define FreeSprite(___num) \
      LP1NR(0x19e, FreeSprite , LONG, ___num, d0,\
      , GRAPHICS_BASE_NAME)

#define ChangeSprite(___vp, ___sprite, ___newData) \
      LP3NR(0x1a4, ChangeSprite , struct ViewPort *, ___vp, a0, struct SimpleSprite *, ___sprite, a1, UWORD *, ___newData, a2,\
      , GRAPHICS_BASE_NAME)

#define MoveSprite(___vp, ___sprite, ___x, ___y) \
      LP4NR(0x1aa, MoveSprite , struct ViewPort *, ___vp, a0, struct SimpleSprite *, ___sprite, a1, LONG, ___x, d0, LONG, ___y, d1,\
      , GRAPHICS_BASE_NAME)

#define LockLayerRom(___layer) \
      LP1NRA5(0x1b0, LockLayerRom , struct Layer *, ___layer, d7,\
      , GRAPHICS_BASE_NAME)

#define UnlockLayerRom(___layer) \
      LP1NRA5(0x1b6, UnlockLayerRom , struct Layer *, ___layer, d7,\
      , GRAPHICS_BASE_NAME)

#define SyncSBitMap(___layer) \
      LP1NR(0x1bc, SyncSBitMap , struct Layer *, ___layer, a0,\
      , GRAPHICS_BASE_NAME)

#define CopySBitMap(___layer) \
      LP1NR(0x1c2, CopySBitMap , struct Layer *, ___layer, a0,\
      , GRAPHICS_BASE_NAME)

#define OwnBlitter() \
      LP0NR(0x1c8, OwnBlitter ,\
      , GRAPHICS_BASE_NAME)

#define DisownBlitter() \
      LP0NR(0x1ce, DisownBlitter ,\
      , GRAPHICS_BASE_NAME)

#define InitTmpRas(___tmpRas, ___buffer, ___size) \
      LP3(0x1d4, struct TmpRas *, InitTmpRas , struct TmpRas *, ___tmpRas, a0, PLANEPTR, ___buffer, a1, LONG, ___size, d0,\
      , GRAPHICS_BASE_NAME)

#define AskFont(___rp, ___textAttr) \
      LP2NR(0x1da, AskFont , struct RastPort *, ___rp, a1, struct TextAttr *, ___textAttr, a0,\
      , GRAPHICS_BASE_NAME)

#define AddFont(___textFont) \
      LP1NR(0x1e0, AddFont , struct TextFont *, ___textFont, a1,\
      , GRAPHICS_BASE_NAME)

#define RemFont(___textFont) \
      LP1NR(0x1e6, RemFont , struct TextFont *, ___textFont, a1,\
      , GRAPHICS_BASE_NAME)

#define AllocRaster(___width, ___height) \
      LP2(0x1ec, PLANEPTR, AllocRaster , ULONG, ___width, d0, ULONG, ___height, d1,\
      , GRAPHICS_BASE_NAME)

#define FreeRaster(___p, ___width, ___height) \
      LP3NR(0x1f2, FreeRaster , PLANEPTR, ___p, a0, ULONG, ___width, d0, ULONG, ___height, d1,\
      , GRAPHICS_BASE_NAME)

#define AndRectRegion(___region, ___rectangle) \
      LP2NR(0x1f8, AndRectRegion , struct Region *, ___region, a0, CONST struct Rectangle *, ___rectangle, a1,\
      , GRAPHICS_BASE_NAME)

#define OrRectRegion(___region, ___rectangle) \
      LP2(0x1fe, BOOL, OrRectRegion , struct Region *, ___region, a0, CONST struct Rectangle *, ___rectangle, a1,\
      , GRAPHICS_BASE_NAME)

#define NewRegion() \
      LP0(0x204, struct Region *, NewRegion ,\
      , GRAPHICS_BASE_NAME)

#define ClearRectRegion(___region, ___rectangle) \
      LP2(0x20a, BOOL, ClearRectRegion , struct Region *, ___region, a0, CONST struct Rectangle *, ___rectangle, a1,\
      , GRAPHICS_BASE_NAME)

#define ClearRegion(___region) \
      LP1NR(0x210, ClearRegion , struct Region *, ___region, a0,\
      , GRAPHICS_BASE_NAME)

#define DisposeRegion(___region) \
      LP1NR(0x216, DisposeRegion , struct Region *, ___region, a0,\
      , GRAPHICS_BASE_NAME)

#define FreeVPortCopLists(___vp) \
      LP1NR(0x21c, FreeVPortCopLists , struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define FreeCopList(___copList) \
      LP1NR(0x222, FreeCopList , struct CopList *, ___copList, a0,\
      , GRAPHICS_BASE_NAME)

#define ClipBlit(___srcRP, ___xSrc, ___ySrc, ___destRP, ___xDest, ___yDest, ___xSize, ___ySize, ___minterm) \
      LP9NR(0x228, ClipBlit , struct RastPort *, ___srcRP, a0, LONG, ___xSrc, d0, LONG, ___ySrc, d1, struct RastPort *, ___destRP, a1, LONG, ___xDest, d2, LONG, ___yDest, d3, LONG, ___xSize, d4, LONG, ___ySize, d5, ULONG, ___minterm, d6,\
      , GRAPHICS_BASE_NAME)

#define XorRectRegion(___region, ___rectangle) \
      LP2(0x22e, BOOL, XorRectRegion , struct Region *, ___region, a0, CONST struct Rectangle *, ___rectangle, a1,\
      , GRAPHICS_BASE_NAME)

#define FreeCprList(___cprList) \
      LP1NR(0x234, FreeCprList , struct cprlist *, ___cprList, a0,\
      , GRAPHICS_BASE_NAME)

#define GetColorMap(___entries) \
      LP1(0x23a, struct ColorMap *, GetColorMap , LONG, ___entries, d0,\
      , GRAPHICS_BASE_NAME)

#define FreeColorMap(___colorMap) \
      LP1NR(0x240, FreeColorMap , struct ColorMap *, ___colorMap, a0,\
      , GRAPHICS_BASE_NAME)

#define GetRGB4(___colorMap, ___entry) \
      LP2(0x246, ULONG, GetRGB4 , struct ColorMap *, ___colorMap, a0, LONG, ___entry, d0,\
      , GRAPHICS_BASE_NAME)

#define ScrollVPort(___vp) \
      LP1NR(0x24c, ScrollVPort , struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define UCopperListInit(___uCopList, ___n) \
      LP2(0x252, struct CopList *, UCopperListInit , struct UCopList *, ___uCopList, a0, LONG, ___n, d0,\
      , GRAPHICS_BASE_NAME)

#define FreeGBuffers(___anOb, ___rp, ___flag) \
      LP3NR(0x258, FreeGBuffers , struct AnimOb *, ___anOb, a0, struct RastPort *, ___rp, a1, LONG, ___flag, d0,\
      , GRAPHICS_BASE_NAME)

#define BltBitMapRastPort(___srcBitMap, ___xSrc, ___ySrc, ___destRP, ___xDest, ___yDest, ___xSize, ___ySize, ___minterm) \
      LP9NR(0x25e, BltBitMapRastPort , CONST struct BitMap *, ___srcBitMap, a0, LONG, ___xSrc, d0, LONG, ___ySrc, d1, struct RastPort *, ___destRP, a1, LONG, ___xDest, d2, LONG, ___yDest, d3, LONG, ___xSize, d4, LONG, ___ySize, d5, ULONG, ___minterm, d6,\
      , GRAPHICS_BASE_NAME)

#define OrRegionRegion(___srcRegion, ___destRegion) \
      LP2(0x264, BOOL, OrRegionRegion , CONST struct Region *, ___srcRegion, a0, struct Region *, ___destRegion, a1,\
      , GRAPHICS_BASE_NAME)

#define XorRegionRegion(___srcRegion, ___destRegion) \
      LP2(0x26a, BOOL, XorRegionRegion , CONST struct Region *, ___srcRegion, a0, struct Region *, ___destRegion, a1,\
      , GRAPHICS_BASE_NAME)

#define AndRegionRegion(___srcRegion, ___destRegion) \
      LP2(0x270, BOOL, AndRegionRegion , CONST struct Region *, ___srcRegion, a0, struct Region *, ___destRegion, a1,\
      , GRAPHICS_BASE_NAME)

#define SetRGB4CM(___colorMap, ___index, ___red, ___green, ___blue) \
      LP5NR(0x276, SetRGB4CM , struct ColorMap *, ___colorMap, a0, LONG, ___index, d0, ULONG, ___red, d1, ULONG, ___green, d2, ULONG, ___blue, d3,\
      , GRAPHICS_BASE_NAME)

#define BltMaskBitMapRastPort(___srcBitMap, ___xSrc, ___ySrc, ___destRP, ___xDest, ___yDest, ___xSize, ___ySize, ___minterm, ___bltMask) \
      LP10NR(0x27c, BltMaskBitMapRastPort , CONST struct BitMap *, ___srcBitMap, a0, LONG, ___xSrc, d0, LONG, ___ySrc, d1, struct RastPort *, ___destRP, a1, LONG, ___xDest, d2, LONG, ___yDest, d3, LONG, ___xSize, d4, LONG, ___ySize, d5, ULONG, ___minterm, d6, CONST PLANEPTR, ___bltMask, a2,\
      , GRAPHICS_BASE_NAME)

#define AttemptLockLayerRom(___layer) \
      LP1A5(0x28e, BOOL, AttemptLockLayerRom , struct Layer *, ___layer, d7,\
      , GRAPHICS_BASE_NAME)

#define GfxNew(___gfxNodeType) \
      LP1(0x294, APTR, GfxNew , ULONG, ___gfxNodeType, d0,\
      , GRAPHICS_BASE_NAME)

#define GfxFree(___gfxNodePtr) \
      LP1NR(0x29a, GfxFree , APTR, ___gfxNodePtr, a0,\
      , GRAPHICS_BASE_NAME)

#define GfxAssociate(___associateNode, ___gfxNodePtr) \
      LP2NR(0x2a0, GfxAssociate , CONST APTR, ___associateNode, a0, APTR, ___gfxNodePtr, a1,\
      , GRAPHICS_BASE_NAME)

#define BitMapScale(___bitScaleArgs) \
      LP1NR(0x2a6, BitMapScale , struct BitScaleArgs *, ___bitScaleArgs, a0,\
      , GRAPHICS_BASE_NAME)

#define ScalerDiv(___factor, ___numerator, ___denominator) \
      LP3(0x2ac, UWORD, ScalerDiv , ULONG, ___factor, d0, ULONG, ___numerator, d1, ULONG, ___denominator, d2,\
      , GRAPHICS_BASE_NAME)

#define TextExtent(___rp, ___string, ___count, ___textExtent) \
      LP4(0x2b2, WORD, TextExtent , struct RastPort *, ___rp, a1, CONST_STRPTR, ___string, a0, LONG, ___count, d0, struct TextExtent *, ___textExtent, a2,\
      , GRAPHICS_BASE_NAME)

#define TextFit(___rp, ___string, ___strLen, ___textExtent, ___constrainingExtent, ___strDirection, ___constrainingBitWidth, ___constrainingBitHeight) \
      LP8(0x2b8, ULONG, TextFit , struct RastPort *, ___rp, a1, CONST_STRPTR, ___string, a0, ULONG, ___strLen, d0, CONST struct TextExtent *, ___textExtent, a2, CONST struct TextExtent *, ___constrainingExtent, a3, LONG, ___strDirection, d1, ULONG, ___constrainingBitWidth, d2, ULONG, ___constrainingBitHeight, d3,\
      , GRAPHICS_BASE_NAME)

#define GfxLookUp(___associateNode) \
      LP1(0x2be, APTR, GfxLookUp , CONST APTR, ___associateNode, a0,\
      , GRAPHICS_BASE_NAME)

#define VideoControl(___colorMap, ___tagarray) \
      LP2(0x2c4, BOOL, VideoControl , struct ColorMap *, ___colorMap, a0, struct TagItem *, ___tagarray, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define VideoControlTags(___colorMap, ___tagarray, ...) \
    ({_sfdc_vararg _tags[] = { ___tagarray, __VA_ARGS__ }; VideoControl((___colorMap), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define OpenMonitor(___monitorName, ___displayID) \
      LP2(0x2ca, struct MonitorSpec *, OpenMonitor , CONST_STRPTR, ___monitorName, a1, ULONG, ___displayID, d0,\
      , GRAPHICS_BASE_NAME)

#define CloseMonitor(___monitorSpec) \
      LP1(0x2d0, BOOL, CloseMonitor , struct MonitorSpec *, ___monitorSpec, a0,\
      , GRAPHICS_BASE_NAME)

#define FindDisplayInfo(___displayID) \
      LP1(0x2d6, DisplayInfoHandle, FindDisplayInfo , ULONG, ___displayID, d0,\
      , GRAPHICS_BASE_NAME)

#define NextDisplayInfo(___displayID) \
      LP1(0x2dc, ULONG, NextDisplayInfo , ULONG, ___displayID, d0,\
      , GRAPHICS_BASE_NAME)

#define GetDisplayInfoData(___handle, ___buf, ___size, ___tagID, ___displayID) \
      LP5(0x2f4, ULONG, GetDisplayInfoData , CONST DisplayInfoHandle, ___handle, a0, APTR, ___buf, a1, ULONG, ___size, d0, ULONG, ___tagID, d1, ULONG, ___displayID, d2,\
      , GRAPHICS_BASE_NAME)

#define FontExtent(___font, ___fontExtent) \
      LP2NR(0x2fa, FontExtent , CONST struct TextFont *, ___font, a0, struct TextExtent *, ___fontExtent, a1,\
      , GRAPHICS_BASE_NAME)

#define ReadPixelLine8(___rp, ___xstart, ___ystart, ___width, ___array, ___tempRP) \
      LP6(0x300, LONG, ReadPixelLine8 , struct RastPort *, ___rp, a0, ULONG, ___xstart, d0, ULONG, ___ystart, d1, ULONG, ___width, d2, UBYTE *, ___array, a2, struct RastPort *, ___tempRP, a1,\
      , GRAPHICS_BASE_NAME)

#define WritePixelLine8(___rp, ___xstart, ___ystart, ___width, ___array, ___tempRP) \
      LP6(0x306, LONG, WritePixelLine8 , struct RastPort *, ___rp, a0, ULONG, ___xstart, d0, ULONG, ___ystart, d1, ULONG, ___width, d2, UBYTE *, ___array, a2, struct RastPort *, ___tempRP, a1,\
      , GRAPHICS_BASE_NAME)

#define ReadPixelArray8(___rp, ___xstart, ___ystart, ___xstop, ___ystop, ___array, ___temprp) \
      LP7(0x30c, LONG, ReadPixelArray8 , struct RastPort *, ___rp, a0, ULONG, ___xstart, d0, ULONG, ___ystart, d1, ULONG, ___xstop, d2, ULONG, ___ystop, d3, UBYTE *, ___array, a2, struct RastPort *, ___temprp, a1,\
      , GRAPHICS_BASE_NAME)

#define WritePixelArray8(___rp, ___xstart, ___ystart, ___xstop, ___ystop, ___array, ___temprp) \
      LP7(0x312, LONG, WritePixelArray8 , struct RastPort *, ___rp, a0, ULONG, ___xstart, d0, ULONG, ___ystart, d1, ULONG, ___xstop, d2, ULONG, ___ystop, d3, UBYTE *, ___array, a2, struct RastPort *, ___temprp, a1,\
      , GRAPHICS_BASE_NAME)

#define GetVPModeID(___vp) \
      LP1(0x318, LONG, GetVPModeID , CONST struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define ModeNotAvailable(___modeID) \
      LP1(0x31e, LONG, ModeNotAvailable , ULONG, ___modeID, d0,\
      , GRAPHICS_BASE_NAME)

#define EraseRect(___rp, ___xMin, ___yMin, ___xMax, ___yMax) \
      LP5NR(0x32a, EraseRect , struct RastPort *, ___rp, a1, LONG, ___xMin, d0, LONG, ___yMin, d1, LONG, ___xMax, d2, LONG, ___yMax, d3,\
      , GRAPHICS_BASE_NAME)

#define ExtendFont(___font, ___fontTags) \
      LP2(0x330, ULONG, ExtendFont , struct TextFont *, ___font, a0, CONST struct TagItem *, ___fontTags, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ExtendFontTags(___font, ___fontTags, ...) \
    ({_sfdc_vararg _tags[] = { ___fontTags, __VA_ARGS__ }; ExtendFont((___font), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define StripFont(___font) \
      LP1NR(0x336, StripFont , struct TextFont *, ___font, a0,\
      , GRAPHICS_BASE_NAME)

#define CalcIVG(___v, ___vp) \
      LP2(0x33c, UWORD, CalcIVG , struct View *, ___v, a0, struct ViewPort *, ___vp, a1,\
      , GRAPHICS_BASE_NAME)

#define AttachPalExtra(___cm, ___vp) \
      LP2(0x342, LONG, AttachPalExtra , struct ColorMap *, ___cm, a0, struct ViewPort *, ___vp, a1,\
      , GRAPHICS_BASE_NAME)

#define ObtainBestPenA(___cm, ___r, ___g, ___b, ___tags) \
      LP5(0x348, LONG, ObtainBestPenA , struct ColorMap *, ___cm, a0, ULONG, ___r, d1, ULONG, ___g, d2, ULONG, ___b, d3, CONST struct TagItem *, ___tags, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ObtainBestPen(___cm, ___r, ___g, ___b, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; ObtainBestPenA((___cm), (___r), (___g), (___b), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetRGB32(___vp, ___n, ___r, ___g, ___b) \
      LP5NR(0x354, SetRGB32 , struct ViewPort *, ___vp, a0, ULONG, ___n, d0, ULONG, ___r, d1, ULONG, ___g, d2, ULONG, ___b, d3,\
      , GRAPHICS_BASE_NAME)

#define GetAPen(___rp) \
      LP1(0x35a, ULONG, GetAPen , struct RastPort *, ___rp, a0,\
      , GRAPHICS_BASE_NAME)

#define GetBPen(___rp) \
      LP1(0x360, ULONG, GetBPen , struct RastPort *, ___rp, a0,\
      , GRAPHICS_BASE_NAME)

#define GetDrMd(___rp) \
      LP1(0x366, ULONG, GetDrMd , struct RastPort *, ___rp, a0,\
      , GRAPHICS_BASE_NAME)

#define GetOutlinePen(___rp) \
      LP1(0x36c, ULONG, GetOutlinePen , struct RastPort *, ___rp, a0,\
      , GRAPHICS_BASE_NAME)

#define LoadRGB32(___vp, ___table) \
      LP2NR(0x372, LoadRGB32 , struct ViewPort *, ___vp, a0, CONST ULONG *, ___table, a1,\
      , GRAPHICS_BASE_NAME)

#define SetChipRev(___want) \
      LP1(0x378, ULONG, SetChipRev , ULONG, ___want, d0,\
      , GRAPHICS_BASE_NAME)

#define SetABPenDrMd(___rp, ___apen, ___bpen, ___drawmode) \
      LP4NR(0x37e, SetABPenDrMd , struct RastPort *, ___rp, a1, ULONG, ___apen, d0, ULONG, ___bpen, d1, ULONG, ___drawmode, d2,\
      , GRAPHICS_BASE_NAME)

#define GetRGB32(___cm, ___firstcolor, ___ncolors, ___table) \
      LP4NR(0x384, GetRGB32 , CONST struct ColorMap *, ___cm, a0, ULONG, ___firstcolor, d0, ULONG, ___ncolors, d1, ULONG *, ___table, a1,\
      , GRAPHICS_BASE_NAME)

#define AllocBitMap(___sizex, ___sizey, ___depth, ___flags, ___friend_bitmap) \
      LP5(0x396, struct BitMap *, AllocBitMap , ULONG, ___sizex, d0, ULONG, ___sizey, d1, ULONG, ___depth, d2, ULONG, ___flags, d3, const struct BitMap *, ___friend_bitmap, a0,\
      , GRAPHICS_BASE_NAME)

#define FreeBitMap(___bm) \
      LP1NR(0x39c, FreeBitMap , struct BitMap *, ___bm, a0,\
      , GRAPHICS_BASE_NAME)

#define GetExtSpriteA(___ss, ___tags) \
      LP2(0x3a2, LONG, GetExtSpriteA , struct ExtSprite *, ___ss, a2, CONST struct TagItem *, ___tags, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetExtSprite(___ss, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; GetExtSpriteA((___ss), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define CoerceMode(___vp, ___monitorid, ___flags) \
      LP3(0x3a8, ULONG, CoerceMode , struct ViewPort *, ___vp, a0, ULONG, ___monitorid, d0, ULONG, ___flags, d1,\
      , GRAPHICS_BASE_NAME)

#define ChangeVPBitMap(___vp, ___bm, ___db) \
      LP3NR(0x3ae, ChangeVPBitMap , struct ViewPort *, ___vp, a0, struct BitMap *, ___bm, a1, struct DBufInfo *, ___db, a2,\
      , GRAPHICS_BASE_NAME)

#define ReleasePen(___cm, ___n) \
      LP2NR(0x3b4, ReleasePen , struct ColorMap *, ___cm, a0, ULONG, ___n, d0,\
      , GRAPHICS_BASE_NAME)

#define ObtainPen(___cm, ___n, ___r, ___g, ___b, ___f) \
      LP6(0x3ba, ULONG, ObtainPen , struct ColorMap *, ___cm, a0, ULONG, ___n, d0, ULONG, ___r, d1, ULONG, ___g, d2, ULONG, ___b, d3, LONG, ___f, d4,\
      , GRAPHICS_BASE_NAME)

#define GetBitMapAttr(___bm, ___attrnum) \
      LP2(0x3c0, ULONG, GetBitMapAttr , CONST struct BitMap *, ___bm, a0, ULONG, ___attrnum, d1,\
      , GRAPHICS_BASE_NAME)

#define AllocDBufInfo(___vp) \
      LP1(0x3c6, struct DBufInfo *, AllocDBufInfo , struct ViewPort *, ___vp, a0,\
      , GRAPHICS_BASE_NAME)

#define FreeDBufInfo(___dbi) \
      LP1NR(0x3cc, FreeDBufInfo , struct DBufInfo *, ___dbi, a1,\
      , GRAPHICS_BASE_NAME)

#define SetOutlinePen(___rp, ___pen) \
      LP2(0x3d2, ULONG, SetOutlinePen , struct RastPort *, ___rp, a0, ULONG, ___pen, d0,\
      , GRAPHICS_BASE_NAME)

#define SetWriteMask(___rp, ___msk) \
      LP2(0x3d8, ULONG, SetWriteMask , struct RastPort *, ___rp, a0, ULONG, ___msk, d0,\
      , GRAPHICS_BASE_NAME)

#define SetMaxPen(___rp, ___maxpen) \
      LP2NR(0x3de, SetMaxPen , struct RastPort *, ___rp, a0, ULONG, ___maxpen, d0,\
      , GRAPHICS_BASE_NAME)

#define SetRGB32CM(___cm, ___n, ___r, ___g, ___b) \
      LP5NR(0x3e4, SetRGB32CM , struct ColorMap *, ___cm, a0, ULONG, ___n, d0, ULONG, ___r, d1, ULONG, ___g, d2, ULONG, ___b, d3,\
      , GRAPHICS_BASE_NAME)

#define ScrollRasterBF(___rp, ___dx, ___dy, ___xMin, ___yMin, ___xMax, ___yMax) \
      LP7NR(0x3ea, ScrollRasterBF , struct RastPort *, ___rp, a1, LONG, ___dx, d0, LONG, ___dy, d1, LONG, ___xMin, d2, LONG, ___yMin, d3, LONG, ___xMax, d4, LONG, ___yMax, d5,\
      , GRAPHICS_BASE_NAME)

#define FindColor(___cm, ___r, ___g, ___b, ___maxcolor) \
      LP5(0x3f0, LONG, FindColor , struct ColorMap *, ___cm, a3, ULONG, ___r, d1, ULONG, ___g, d2, ULONG, ___b, d3, LONG, ___maxcolor, d4,\
      , GRAPHICS_BASE_NAME)

#define AllocSpriteDataA(___bm, ___tags) \
      LP2(0x3fc, struct ExtSprite *, AllocSpriteDataA , CONST struct BitMap *, ___bm, a2, CONST struct TagItem *, ___tags, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocSpriteData(___bm, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; AllocSpriteDataA((___bm), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ChangeExtSpriteA(___vp, ___oldsprite, ___newsprite, ___tags) \
      LP4(0x402, LONG, ChangeExtSpriteA , struct ViewPort *, ___vp, a0, struct ExtSprite *, ___oldsprite, a1, struct ExtSprite *, ___newsprite, a2, CONST struct TagItem *, ___tags, a3,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ChangeExtSprite(___vp, ___oldsprite, ___newsprite, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; ChangeExtSpriteA((___vp), (___oldsprite), (___newsprite), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeSpriteData(___sp) \
      LP1NR(0x408, FreeSpriteData , struct ExtSprite *, ___sp, a2,\
      , GRAPHICS_BASE_NAME)

#define SetRPAttrsA(___rp, ___tags) \
      LP2NR(0x40e, SetRPAttrsA , struct RastPort *, ___rp, a0, CONST struct TagItem *, ___tags, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetRPAttrs(___rp, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; SetRPAttrsA((___rp), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetRPAttrsA(___rp, ___tags) \
      LP2NR(0x414, GetRPAttrsA , CONST struct RastPort *, ___rp, a0, CONST struct TagItem *, ___tags, a1,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetRPAttrs(___rp, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; GetRPAttrsA((___rp), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define BestModeIDA(___tags) \
      LP1(0x41a, ULONG, BestModeIDA , CONST struct TagItem *, ___tags, a0,\
      , GRAPHICS_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define BestModeID(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; BestModeIDA((CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define WriteChunkyPixels(___rp, ___xstart, ___ystart, ___xstop, ___ystop, ___array, ___bytesperrow) \
      LP7NR(0x420, WriteChunkyPixels , struct RastPort *, ___rp, a0, ULONG, ___xstart, d0, ULONG, ___ystart, d1, ULONG, ___xstop, d2, ULONG, ___ystop, d3, CONST UBYTE *, ___array, a2, LONG, ___bytesperrow, d4,\
      , GRAPHICS_BASE_NAME)

#endif /* !_INLINE_GRAPHICS_H */
