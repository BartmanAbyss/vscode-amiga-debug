/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_LAYERS_H
#define _INLINE_LAYERS_H

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

#ifndef LAYERS_BASE_NAME
#define LAYERS_BASE_NAME LayersBase
#endif /* !LAYERS_BASE_NAME */

#define InitLayers(___li) \
      LP1NR(0x1e, InitLayers , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define CreateUpfrontLayer(___li, ___bm, ___x0, ___y0, ___x1, ___y1, ___flags, ___bm2) \
      LP8(0x24, struct Layer *, CreateUpfrontLayer , struct Layer_Info *, ___li, a0, struct BitMap *, ___bm, a1, LONG, ___x0, d0, LONG, ___y0, d1, LONG, ___x1, d2, LONG, ___y1, d3, LONG, ___flags, d4, struct BitMap *, ___bm2, a2,\
      , LAYERS_BASE_NAME)

#define CreateBehindLayer(___li, ___bm, ___x0, ___y0, ___x1, ___y1, ___flags, ___bm2) \
      LP8(0x2a, struct Layer *, CreateBehindLayer , struct Layer_Info *, ___li, a0, struct BitMap *, ___bm, a1, LONG, ___x0, d0, LONG, ___y0, d1, LONG, ___x1, d2, LONG, ___y1, d3, LONG, ___flags, d4, struct BitMap *, ___bm2, a2,\
      , LAYERS_BASE_NAME)

#define UpfrontLayer(___dummy, ___layer) \
      LP2(0x30, LONG, UpfrontLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1,\
      , LAYERS_BASE_NAME)

#define BehindLayer(___dummy, ___layer) \
      LP2(0x36, LONG, BehindLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1,\
      , LAYERS_BASE_NAME)

#define MoveLayer(___dummy, ___layer, ___dx, ___dy) \
      LP4(0x3c, LONG, MoveLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1, LONG, ___dx, d0, LONG, ___dy, d1,\
      , LAYERS_BASE_NAME)

#define SizeLayer(___dummy, ___layer, ___dx, ___dy) \
      LP4(0x42, LONG, SizeLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1, LONG, ___dx, d0, LONG, ___dy, d1,\
      , LAYERS_BASE_NAME)

#define ScrollLayer(___dummy, ___layer, ___dx, ___dy) \
      LP4NR(0x48, ScrollLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1, LONG, ___dx, d0, LONG, ___dy, d1,\
      , LAYERS_BASE_NAME)

#define BeginUpdate(___l) \
      LP1(0x4e, LONG, BeginUpdate , struct Layer *, ___l, a0,\
      , LAYERS_BASE_NAME)

#define EndUpdate(___layer, ___flag) \
      LP2NR(0x54, EndUpdate , struct Layer *, ___layer, a0, UWORD, ___flag, d0,\
      , LAYERS_BASE_NAME)

#define DeleteLayer(___dummy, ___layer) \
      LP2(0x5a, LONG, DeleteLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1,\
      , LAYERS_BASE_NAME)

#define LockLayer(___dummy, ___layer) \
      LP2NR(0x60, LockLayer , LONG, ___dummy, a0, struct Layer *, ___layer, a1,\
      , LAYERS_BASE_NAME)

#define UnlockLayer(___layer) \
      LP1NR(0x66, UnlockLayer , struct Layer *, ___layer, a0,\
      , LAYERS_BASE_NAME)

#define LockLayers(___li) \
      LP1NR(0x6c, LockLayers , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define UnlockLayers(___li) \
      LP1NR(0x72, UnlockLayers , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define LockLayerInfo(___li) \
      LP1NR(0x78, LockLayerInfo , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define SwapBitsRastPortClipRect(___rp, ___cr) \
      LP2NR(0x7e, SwapBitsRastPortClipRect , struct RastPort *, ___rp, a0, struct ClipRect *, ___cr, a1,\
      , LAYERS_BASE_NAME)

#define WhichLayer(___li, ___x, ___y) \
      LP3(0x84, struct Layer *, WhichLayer , struct Layer_Info *, ___li, a0, WORD, ___x, d0, WORD, ___y, d1,\
      , LAYERS_BASE_NAME)

#define UnlockLayerInfo(___li) \
      LP1NR(0x8a, UnlockLayerInfo , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define NewLayerInfo() \
      LP0(0x90, struct Layer_Info *, NewLayerInfo ,\
      , LAYERS_BASE_NAME)

#define DisposeLayerInfo(___li) \
      LP1NR(0x96, DisposeLayerInfo , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define FattenLayerInfo(___li) \
      LP1(0x9c, LONG, FattenLayerInfo , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define ThinLayerInfo(___li) \
      LP1NR(0xa2, ThinLayerInfo , struct Layer_Info *, ___li, a0,\
      , LAYERS_BASE_NAME)

#define MoveLayerInFrontOf(___layer_to_move, ___other_layer) \
      LP2(0xa8, LONG, MoveLayerInFrontOf , struct Layer *, ___layer_to_move, a0, struct Layer *, ___other_layer, a1,\
      , LAYERS_BASE_NAME)

#define InstallClipRegion(___layer, ___region) \
      LP2(0xae, struct Region *, InstallClipRegion , struct Layer *, ___layer, a0, const struct Region *, ___region, a1,\
      , LAYERS_BASE_NAME)

#define MoveSizeLayer(___layer, ___dx, ___dy, ___dw, ___dh) \
      LP5(0xb4, LONG, MoveSizeLayer , struct Layer *, ___layer, a0, LONG, ___dx, d0, LONG, ___dy, d1, LONG, ___dw, d2, LONG, ___dh, d3,\
      , LAYERS_BASE_NAME)

#define CreateUpfrontHookLayer(___li, ___bm, ___x0, ___y0, ___x1, ___y1, ___flags, ___hook, ___bm2) \
      LP9(0xba, struct Layer *, CreateUpfrontHookLayer , struct Layer_Info *, ___li, a0, struct BitMap *, ___bm, a1, LONG, ___x0, d0, LONG, ___y0, d1, LONG, ___x1, d2, LONG, ___y1, d3, LONG, ___flags, d4, struct Hook *, ___hook, a3, struct BitMap *, ___bm2, a2,\
      , LAYERS_BASE_NAME)

#define CreateBehindHookLayer(___li, ___bm, ___x0, ___y0, ___x1, ___y1, ___flags, ___hook, ___bm2) \
      LP9(0xc0, struct Layer *, CreateBehindHookLayer , struct Layer_Info *, ___li, a0, struct BitMap *, ___bm, a1, LONG, ___x0, d0, LONG, ___y0, d1, LONG, ___x1, d2, LONG, ___y1, d3, LONG, ___flags, d4, struct Hook *, ___hook, a3, struct BitMap *, ___bm2, a2,\
      , LAYERS_BASE_NAME)

#define InstallLayerHook(___layer, ___hook) \
      LP2(0xc6, struct Hook *, InstallLayerHook , struct Layer *, ___layer, a0, struct Hook *, ___hook, a1,\
      , LAYERS_BASE_NAME)

#define InstallLayerInfoHook(___li, ___hook) \
      LP2(0xcc, struct Hook *, InstallLayerInfoHook , struct Layer_Info *, ___li, a0, const struct Hook *, ___hook, a1,\
      , LAYERS_BASE_NAME)

#define SortLayerCR(___layer, ___dx, ___dy) \
      LP3NR(0xd2, SortLayerCR , struct Layer *, ___layer, a0, WORD, ___dx, d0, WORD, ___dy, d1,\
      , LAYERS_BASE_NAME)

#define DoHookClipRects(___hook, ___rport, ___rect) \
      LP3NR(0xd8, DoHookClipRects , struct Hook *, ___hook, a0, struct RastPort *, ___rport, a1, const struct Rectangle *, ___rect, a2,\
      , LAYERS_BASE_NAME)

#endif /* !_INLINE_LAYERS_H */
