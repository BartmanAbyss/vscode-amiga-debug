#ifndef GRAPHICS_LAYERS_H
#define GRAPHICS_LAYERS_H
/*
**	$VER: layers.h 47.1 (31.7.2019)
**
**	Layer flags, and Layer_Info
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif

#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif

#ifndef GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif

/*
 * layer status flags. These really belong to
 * graphics/clip.h but are here for traditional reason
 * (and to confuse you).
 */

#define LAYERSIMPLE             1
#define LAYERSMART              2
#define LAYERSUPER              4
#define LAYERUPDATING           0x10
#define LAYERBACKDROP           0x40
#define LAYERREFRESH            0x80
#define LAYER_CLIPRECTS_LOST    0x100   /* during BeginUpdate */
                                        /* or during layerop */
                                        /* this happens if out of memory */
#define LAYERIREFRESH           0x200
#define LAYERIREFRESH2          0x400

#define LAYERSAVEBACK           0x800   /* New for V44: Set if clips are saved back */
#define LAYERHIDDEN             0x1000  /* New for V45: Layer is invisible */

/*
 * Thor says: Keep hands off this Layer_Info. There's really nothing in
 * here to play with. The only thing you possibly may be interested in
 * is the top_layer that points to the topmost layer of this layer_info,
 * and the Lock which locks this structure. Even that is quite private,
 * but everything else is really really private. Leave all this to
 * layers.library as some fields are likely to change their meaning
 * in the near future.
 */

struct Layer_Info
{
struct  Layer           *top_layer;             /* Frontmost layer */
        void            *resPtr1;               /* V45 spare */
        void            *resPtr2;               /* Another V45 spare */
struct  ClipRect        *FreeClipRects;         /* Implements a backing store
                                                 * of cliprects to avoid
                                                 * frequent re-allocation
                                                 * of cliprects. Private.
                                                 */
struct  Rectangle       bounds;                 /* clipping bounds of
                                                 * this layer info. All layers
                                                 * are clipped against this
                                                 */
struct  SignalSemaphore Lock;                   /* Layer_Info lock */
struct  MinList         gs_Head;                /* linked list of all semaphores of all
                                                 * layers within this layer info
                                                 */
        WORD            PrivateReserve3;        /* !! Private !! */
        void           *PrivateReserve4;        /* !! Private !! */
        UWORD           Flags;
        BYTE            res_count;              /* V45 spare, no longer used */
        BYTE            LockLayersCount;        /* Counts # times LockLayers
                                                 * has been called
                                                 */
        BYTE           PrivateReserve5;         /* !! Private !! */
        BYTE           UserClipRectsCount;      /* Also private */
        struct Hook    *BlankHook;              /* LayerInfo backfill hook */
        void           *resPtr5;                /* !! Private !! */
};

#define NEWLAYERINFO_CALLED 1

/*
 * Special backfill hook values you may want to install here.
 *
 * LAYERS_NOBACKFILL is the value needed to get no backfill hook
 * LAYERS_BACKFILL is the value needed to get the default backfill hook
 */
#define LAYERS_NOBACKFILL       ((struct Hook *)1)
#define LAYERS_BACKFILL         ((struct Hook *)0)

/*
 * Special codes for ShowLayer():
 * Give this as target layer where
 * to move your layer to.
 */
#define LAYER_BACKMOST          ((struct Layer *)0)
#define LAYER_FRONTMOST         ((struct Layer *)1)


#endif  /* GRAPHICS_LAYERS_H */
