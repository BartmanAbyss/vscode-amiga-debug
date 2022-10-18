#ifndef  CLIB_GRAPHICS_PROTOS_H
#define  CLIB_GRAPHICS_PROTOS_H

/*
**	$VER: graphics_protos.h 40.2 (6.6.1998)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif
#ifndef  GRAPHICS_DISPLAYINFO_H
#include <graphics/displayinfo.h>
#endif
#ifndef  GRAPHICS_GELS_H
#include <graphics/gels.h>
#endif
#ifndef  GRAPHICS_RASTPORT_H
#include <graphics/rastport.h>
#endif
#ifndef  GRAPHICS_VIEW_H
#include <graphics/view.h>
#endif
#ifndef  GRAPHICS_COPPER_H
#include <graphics/copper.h>
#endif
#ifndef  GRAPHICS_CLIP_H
#include <graphics/clip.h>
#endif
#ifndef  GRAPHICS_REGIONS_H
#include <graphics/regions.h>
#endif
#ifndef  GRAPHICS_SPRITE_H
#include <graphics/sprite.h>
#endif
#ifndef  GRAPHICS_TEXT_H
#include <graphics/text.h>
#endif
#ifndef  GRAPHICS_SCALE_H
#include <graphics/scale.h>
#endif
#ifndef  HARDWARE_BLIT_H
#include <hardware/blit.h>
#endif
/*------ BitMap primitives ------*/
LONG BltBitMap( CONST struct BitMap *srcBitMap, LONG xSrc, LONG ySrc, struct BitMap *destBitMap, LONG xDest, LONG yDest, LONG xSize, LONG ySize, ULONG minterm, ULONG mask, PLANEPTR tempA );
VOID BltTemplate( CONST PLANEPTR source, LONG xSrc, LONG srcMod, struct RastPort *destRP, LONG xDest, LONG yDest, LONG xSize, LONG ySize );
/*------ Text routines ------*/
VOID ClearEOL( struct RastPort *rp );
VOID ClearScreen( struct RastPort *rp );
WORD TextLength( struct RastPort *rp, CONST_STRPTR string, ULONG count );
LONG Text( struct RastPort *rp, CONST_STRPTR string, ULONG count );
LONG SetFont( struct RastPort *rp, CONST struct TextFont *textFont );
struct TextFont *OpenFont( struct TextAttr *textAttr );
VOID CloseFont( struct TextFont *textFont );
ULONG AskSoftStyle( struct RastPort *rp );
ULONG SetSoftStyle( struct RastPort *rp, ULONG style, ULONG enable );
/*------	Gels routines ------*/
VOID AddBob( struct Bob *bob, struct RastPort *rp );
VOID AddVSprite( struct VSprite *vSprite, struct RastPort *rp );
VOID DoCollision( struct RastPort *rp );
VOID DrawGList( struct RastPort *rp, struct ViewPort *vp );
VOID InitGels( struct VSprite *head, struct VSprite *tail, struct GelsInfo *gelsInfo );
VOID InitMasks( struct VSprite *vSprite );
VOID RemIBob( struct Bob *bob, struct RastPort *rp, struct ViewPort *vp );
VOID RemVSprite( struct VSprite *vSprite );
VOID SetCollision( ULONG num, VOID (*routine)(struct VSprite *gelA, struct VSprite *gelB), struct GelsInfo *gelsInfo );
VOID SortGList( struct RastPort *rp );
VOID AddAnimOb( struct AnimOb *anOb, struct AnimOb **anKey, struct RastPort *rp );
VOID Animate( struct AnimOb **anKey, struct RastPort *rp );
BOOL GetGBuffers( struct AnimOb *anOb, struct RastPort *rp, LONG flag );
VOID InitGMasks( struct AnimOb *anOb );
/*------	General graphics routines ------*/
VOID DrawEllipse( struct RastPort *rp, LONG xCenter, LONG yCenter, LONG a, LONG b );
LONG AreaEllipse( struct RastPort *rp, LONG xCenter, LONG yCenter, LONG a, LONG b );
VOID LoadRGB4( struct ViewPort *vp, CONST UWORD *colors, LONG count );
VOID InitRastPort( struct RastPort *rp );
VOID InitVPort( struct ViewPort *vp );
ULONG MrgCop( struct View *view );
ULONG MakeVPort( struct View *view, struct ViewPort *vp );
VOID LoadView( struct View *view );
VOID WaitBlit( VOID );
VOID SetRast( struct RastPort *rp, ULONG pen );
VOID Move( struct RastPort *rp, LONG x, LONG y );
VOID Draw( struct RastPort *rp, LONG x, LONG y );
LONG AreaMove( struct RastPort *rp, LONG x, LONG y );
LONG AreaDraw( struct RastPort *rp, LONG x, LONG y );
LONG AreaEnd( struct RastPort *rp );
VOID WaitTOF( VOID );
VOID QBlit( struct bltnode *blit );
VOID InitArea( struct AreaInfo *areaInfo, APTR vectorBuffer, LONG maxVectors );
VOID SetRGB4( struct ViewPort *vp, LONG index, ULONG red, ULONG green, ULONG blue );
VOID QBSBlit( struct bltnode *blit );
VOID BltClear( PLANEPTR memBlock, ULONG byteCount, ULONG flags );
VOID RectFill( struct RastPort *rp, LONG xMin, LONG yMin, LONG xMax, LONG yMax );
VOID BltPattern( struct RastPort *rp, CONST PLANEPTR mask, LONG xMin, LONG yMin, LONG xMax, LONG yMax, ULONG maskBPR );
ULONG ReadPixel( struct RastPort *rp, LONG x, LONG y );
LONG WritePixel( struct RastPort *rp, LONG x, LONG y );
BOOL Flood( struct RastPort *rp, ULONG mode, LONG x, LONG y );
VOID PolyDraw( struct RastPort *rp, LONG count, CONST WORD *polyTable );
VOID SetAPen( struct RastPort *rp, ULONG pen );
VOID SetBPen( struct RastPort *rp, ULONG pen );
VOID SetDrMd( struct RastPort *rp, ULONG drawMode );
VOID InitView( struct View *view );
VOID CBump( struct UCopList *copList );
VOID CMove( struct UCopList *copList, APTR destination, LONG data );
VOID CWait( struct UCopList *copList, LONG v, LONG h );
LONG VBeamPos( VOID );
VOID InitBitMap( struct BitMap *bitMap, LONG depth, LONG width, LONG height );
VOID ScrollRaster( struct RastPort *rp, LONG dx, LONG dy, LONG xMin, LONG yMin, LONG xMax, LONG yMax );
VOID WaitBOVP( struct ViewPort *vp );
WORD GetSprite( struct SimpleSprite *sprite, LONG num );
VOID FreeSprite( LONG num );
VOID ChangeSprite( struct ViewPort *vp, struct SimpleSprite *sprite, UWORD *newData );
VOID MoveSprite( struct ViewPort *vp, struct SimpleSprite *sprite, LONG x, LONG y );
VOID LockLayerRom( struct Layer *layer );
VOID UnlockLayerRom( struct Layer *layer );
VOID SyncSBitMap( struct Layer *layer );
VOID CopySBitMap( struct Layer *layer );
VOID OwnBlitter( VOID );
VOID DisownBlitter( VOID );
struct TmpRas *InitTmpRas( struct TmpRas *tmpRas, PLANEPTR buffer, LONG size );
VOID AskFont( struct RastPort *rp, struct TextAttr *textAttr );
VOID AddFont( struct TextFont *textFont );
VOID RemFont( struct TextFont *textFont );
PLANEPTR AllocRaster( ULONG width, ULONG height );
VOID FreeRaster( PLANEPTR p, ULONG width, ULONG height );
VOID AndRectRegion( struct Region *region, CONST struct Rectangle *rectangle );
BOOL OrRectRegion( struct Region *region, CONST struct Rectangle *rectangle );
struct Region *NewRegion( VOID );
BOOL ClearRectRegion( struct Region *region, CONST struct Rectangle *rectangle );
VOID ClearRegion( struct Region *region );
VOID DisposeRegion( struct Region *region );
VOID FreeVPortCopLists( struct ViewPort *vp );
VOID FreeCopList( struct CopList *copList );
VOID ClipBlit( struct RastPort *srcRP, LONG xSrc, LONG ySrc, struct RastPort *destRP, LONG xDest, LONG yDest, LONG xSize, LONG ySize, ULONG minterm );
BOOL XorRectRegion( struct Region *region, CONST struct Rectangle *rectangle );
VOID FreeCprList( struct cprlist *cprList );
struct ColorMap *GetColorMap( LONG entries );
VOID FreeColorMap( struct ColorMap *colorMap );
ULONG GetRGB4( struct ColorMap *colorMap, LONG entry );
VOID ScrollVPort( struct ViewPort *vp );
struct CopList *UCopperListInit( struct UCopList *uCopList, LONG n );
VOID FreeGBuffers( struct AnimOb *anOb, struct RastPort *rp, LONG flag );
VOID BltBitMapRastPort( CONST struct BitMap *srcBitMap, LONG xSrc, LONG ySrc, struct RastPort *destRP, LONG xDest, LONG yDest, LONG xSize, LONG ySize, ULONG minterm );
BOOL OrRegionRegion( CONST struct Region *srcRegion, struct Region *destRegion );
BOOL XorRegionRegion( CONST struct Region *srcRegion, struct Region *destRegion );
BOOL AndRegionRegion( CONST struct Region *srcRegion, struct Region *destRegion );
VOID SetRGB4CM( struct ColorMap *colorMap, LONG index, ULONG red, ULONG green, ULONG blue );
VOID BltMaskBitMapRastPort( CONST struct BitMap *srcBitMap, LONG xSrc, LONG ySrc, struct RastPort *destRP, LONG xDest, LONG yDest, LONG xSize, LONG ySize, ULONG minterm, CONST PLANEPTR bltMask );
BOOL AttemptLockLayerRom( struct Layer *layer );
/*--- functions in V36 or higher (Release 2.0) ---*/
APTR GfxNew( ULONG gfxNodeType );
VOID GfxFree( APTR gfxNodePtr );
VOID GfxAssociate( CONST APTR associateNode, APTR gfxNodePtr );
VOID BitMapScale( struct BitScaleArgs *bitScaleArgs );
UWORD ScalerDiv( ULONG factor, ULONG numerator, ULONG denominator );
WORD TextExtent( struct RastPort *rp, CONST_STRPTR string, LONG count, struct TextExtent *textExtent );
ULONG TextFit( struct RastPort *rp, CONST_STRPTR string, ULONG strLen, CONST struct TextExtent *textExtent, CONST struct TextExtent *constrainingExtent, LONG strDirection, ULONG constrainingBitWidth, ULONG constrainingBitHeight );
APTR GfxLookUp( CONST APTR associateNode );
BOOL VideoControl( struct ColorMap *colorMap, struct TagItem *tagarray );
BOOL VideoControlTags( struct ColorMap *colorMap, ULONG tag1Type, ... );
struct MonitorSpec *OpenMonitor( CONST_STRPTR monitorName, ULONG displayID );
BOOL CloseMonitor( struct MonitorSpec *monitorSpec );
DisplayInfoHandle FindDisplayInfo( ULONG displayID );
ULONG NextDisplayInfo( ULONG displayID );
ULONG GetDisplayInfoData( CONST DisplayInfoHandle handle, APTR buf, ULONG size, ULONG tagID, ULONG displayID );
VOID FontExtent( CONST struct TextFont *font, struct TextExtent *fontExtent );
LONG ReadPixelLine8( struct RastPort *rp, ULONG xstart, ULONG ystart, ULONG width, UBYTE *array, struct RastPort *tempRP );
LONG WritePixelLine8( struct RastPort *rp, ULONG xstart, ULONG ystart, ULONG width, UBYTE *array, struct RastPort *tempRP );
LONG ReadPixelArray8( struct RastPort *rp, ULONG xstart, ULONG ystart, ULONG xstop, ULONG ystop, UBYTE *array, struct RastPort *temprp );
LONG WritePixelArray8( struct RastPort *rp, ULONG xstart, ULONG ystart, ULONG xstop, ULONG ystop, UBYTE *array, struct RastPort *temprp );
LONG GetVPModeID( CONST struct ViewPort *vp );
LONG ModeNotAvailable( ULONG modeID );
VOID EraseRect( struct RastPort *rp, LONG xMin, LONG yMin, LONG xMax, LONG yMax );
ULONG ExtendFont( struct TextFont *font, CONST struct TagItem *fontTags );
ULONG ExtendFontTags( struct TextFont *font, ULONG tag1Type, ... );
VOID StripFont( struct TextFont *font );
/*--- functions in V39 or higher (Release 3) ---*/
UWORD CalcIVG( struct View *v, struct ViewPort *vp );
LONG AttachPalExtra( struct ColorMap *cm, struct ViewPort *vp );
LONG ObtainBestPenA( struct ColorMap *cm, ULONG r, ULONG g, ULONG b, CONST struct TagItem *tags );
LONG ObtainBestPen( struct ColorMap *cm, ULONG r, ULONG g, ULONG b, ULONG tag1Type, ... );
VOID SetRGB32( struct ViewPort *vp, ULONG n, ULONG r, ULONG g, ULONG b );
ULONG GetAPen( struct RastPort *rp );
ULONG GetBPen( struct RastPort *rp );
ULONG GetDrMd( struct RastPort *rp );
ULONG GetOutlinePen( struct RastPort *rp );
VOID LoadRGB32( struct ViewPort *vp, CONST ULONG *table );
ULONG SetChipRev( ULONG want );
VOID SetABPenDrMd( struct RastPort *rp, ULONG apen, ULONG bpen, ULONG drawmode );
VOID GetRGB32( CONST struct ColorMap *cm, ULONG firstcolor, ULONG ncolors, ULONG *table );
struct BitMap *AllocBitMap( ULONG sizex, ULONG sizey, ULONG depth, ULONG flags, CONST struct BitMap *friend_bitmap );
VOID FreeBitMap( struct BitMap *bm );
LONG GetExtSpriteA( struct ExtSprite *ss, CONST struct TagItem *tags );
LONG GetExtSprite( struct ExtSprite *ss, ULONG tag1Type, ... );
ULONG CoerceMode( struct ViewPort *vp, ULONG monitorid, ULONG flags );
VOID ChangeVPBitMap( struct ViewPort *vp, struct BitMap *bm, struct DBufInfo *db );
VOID ReleasePen( struct ColorMap *cm, ULONG n );
ULONG ObtainPen( struct ColorMap *cm, ULONG n, ULONG r, ULONG g, ULONG b, LONG f );
ULONG GetBitMapAttr( CONST struct BitMap *bm, ULONG attrnum );
struct DBufInfo *AllocDBufInfo( struct ViewPort *vp );
VOID FreeDBufInfo( struct DBufInfo *dbi );
ULONG SetOutlinePen( struct RastPort *rp, ULONG pen );
ULONG SetWriteMask( struct RastPort *rp, ULONG msk );
VOID SetMaxPen( struct RastPort *rp, ULONG maxpen );
VOID SetRGB32CM( struct ColorMap *cm, ULONG n, ULONG r, ULONG g, ULONG b );
VOID ScrollRasterBF( struct RastPort *rp, LONG dx, LONG dy, LONG xMin, LONG yMin, LONG xMax, LONG yMax );
LONG FindColor( struct ColorMap *cm, ULONG r, ULONG g, ULONG b, LONG maxcolor );
struct ExtSprite *AllocSpriteDataA( CONST struct BitMap *bm, CONST struct TagItem *tags );
struct ExtSprite *AllocSpriteData( CONST struct BitMap *bm, ULONG tag1Type, ... );
LONG ChangeExtSpriteA( struct ViewPort *vp, struct ExtSprite *oldsprite, struct ExtSprite *newsprite, CONST struct TagItem *tags );
LONG ChangeExtSprite( struct ViewPort *vp, struct ExtSprite *oldsprite, struct ExtSprite *newsprite, ULONG tag1Type, ... );
VOID FreeSpriteData( struct ExtSprite *sp );
VOID SetRPAttrsA( struct RastPort *rp, CONST struct TagItem *tags );
VOID SetRPAttrs( struct RastPort *rp, ULONG tag1Type, ... );
VOID GetRPAttrsA( CONST struct RastPort *rp, CONST struct TagItem *tags );
VOID GetRPAttrs( CONST struct RastPort *rp, ULONG tag1Type, ... );
ULONG BestModeIDA( CONST struct TagItem *tags );
ULONG BestModeID( ULONG tag1Type, ... );
/*--- functions in V40 or higher (Release 3.1) ---*/
VOID WriteChunkyPixels( struct RastPort *rp, ULONG xstart, ULONG ystart, ULONG xstop, ULONG ystop, CONST UBYTE *array, LONG bytesperrow );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_GRAPHICS_PROTOS_H */
