/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_LAYERS_PROTOS_H
#define CLIB_LAYERS_PROTOS_H

/*
**   $VER: layers_protos.h $VER: layers_lib.sfd 47.1 (30.11.2021) $VER: layers_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <graphics/layers.h>
#include <graphics/clip.h>
#include <graphics/rastport.h>
#include <graphics/regions.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "layers.library" */
VOID InitLayers(struct Layer_Info *li);
struct Layer *CreateUpfrontLayer(struct Layer_Info *li, struct BitMap *bm, LONG x0, LONG y0, LONG x1, LONG y1, LONG flags, struct BitMap *bm2);
struct Layer *CreateBehindLayer(struct Layer_Info *li, struct BitMap *bm, LONG x0, LONG y0, LONG x1, LONG y1, LONG flags, struct BitMap *bm2);
LONG UpfrontLayer(LONG dummy, struct Layer *layer);
LONG BehindLayer(LONG dummy, struct Layer *layer);
LONG MoveLayer(LONG dummy, struct Layer *layer, LONG dx, LONG dy);
LONG SizeLayer(LONG dummy, struct Layer *layer, LONG dx, LONG dy);
VOID ScrollLayer(LONG dummy, struct Layer *layer, LONG dx, LONG dy);
LONG BeginUpdate(struct Layer *l);
VOID EndUpdate(struct Layer *layer, UWORD flag);
LONG DeleteLayer(LONG dummy, struct Layer *layer);
VOID LockLayer(LONG dummy, struct Layer *layer);
VOID UnlockLayer(struct Layer *layer);
VOID LockLayers(struct Layer_Info *li);
VOID UnlockLayers(struct Layer_Info *li);
VOID LockLayerInfo(struct Layer_Info *li);
VOID SwapBitsRastPortClipRect(struct RastPort *rp, struct ClipRect *cr);
struct Layer *WhichLayer(struct Layer_Info *li, WORD x, WORD y);
VOID UnlockLayerInfo(struct Layer_Info *li);
struct Layer_Info *NewLayerInfo(void);
VOID DisposeLayerInfo(struct Layer_Info *li);
LONG FattenLayerInfo(struct Layer_Info *li);
VOID ThinLayerInfo(struct Layer_Info *li);
LONG MoveLayerInFrontOf(struct Layer *layer_to_move, struct Layer *other_layer);
struct Region *InstallClipRegion(struct Layer *layer, struct Region *region);
LONG MoveSizeLayer(struct Layer *layer, LONG dx, LONG dy, LONG dw, LONG dh);
struct Layer *CreateUpfrontHookLayer(struct Layer_Info *li, struct BitMap *bm, LONG x0, LONG y0, LONG x1, LONG y1, LONG flags, struct Hook *hook, struct BitMap *bm2);
struct Layer *CreateBehindHookLayer(struct Layer_Info *li, struct BitMap *bm, LONG x0, LONG y0, LONG x1, LONG y1, LONG flags, struct Hook *hook, struct BitMap *bm2);
struct Hook *InstallLayerHook(struct Layer *layer, struct Hook *hook);

/*--- functions in V39 or higher ---*/
struct Hook *InstallLayerInfoHook(struct Layer_Info *li, struct Hook *hook);
VOID SortLayerCR(struct Layer *layer, WORD dx, WORD dy);
VOID DoHookClipRects(struct Hook *hook, struct RastPort *rport, CONST struct Rectangle *rect);

/*--- functions in V45 or higher ---*/
BOOL LayerOccluded(struct Layer *layer);
LONG HideLayer(struct Layer *layer);
LONG ShowLayer(struct Layer *layer, struct Layer *in_front_of);
BOOL SetLayerInfoBounds(struct Layer_Info *li, CONST struct Rectangle *bounds);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_LAYERS_PROTOS_H */
