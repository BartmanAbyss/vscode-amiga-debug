#ifndef GRAPHICS_CLIP_H
#define GRAPHICS_CLIP_H
/*
**	$VER: clip.h 47.1 (30.7.2019)
**
**	Layer and cliprect definitions
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif
#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif
#ifndef UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif

#define NEWLOCKS

/*
 * Thor says: Keep hands off this structure. Layers builds it for you,
 * and keeps and adminstrates it for you. What's documented here is
 * only of interest for graphics and intuition. Especially, you may
 * only look at the front/back pointer of this layer while keeping the
 * layers list locked, or at the (Super)ClipRect singly (!) linked 
 * list while keeping this layer locked. Bounds are the bounds of this 
 * layer, rp its rastport whose layer is, surprise, surprise, this here.
 * Lock is the access lock you please lock by LockLayer() or 
 * LockLayerRom().
 * Everything else is completely off-limits and for private use only.
 */

struct Layer
{
    struct  Layer       *front,*back;
    struct  ClipRect    *ClipRect;      /* singly linked list of active cliprects */
    struct  RastPort    *rp;            /* rastport to draw into. Its layer is me */
    struct  Rectangle   bounds;         /* screen bounds of this layer */
    struct  Layer       *nlink;         /* new in V45:
                                         * next back layer for display
                                         * reorganization
                                         */
    UWORD   priority;                   /* internal use: on layer front/back move,
                                         * relative priority of the layers.
                                         * Topmost layer has lowest priority.
                                         */
    UWORD   Flags;                      /* see <graphics/layers.h> */
    struct  BitMap      *SuperBitMap;   /* if non-NULL, superbitmap layer */
    struct  ClipRect    *SuperClipRect; /* super bitmap cliprects if VBitMap != 0*/
                                        /* else damage cliprect list for refresh */
    APTR    Window;                     /* Intuition keeps its window here */
    WORD    Scroll_X,Scroll_Y;          /* layer displacement */
    struct  ClipRect *OnScreen;         /* temporary list of on-screen cliprects */
    struct  ClipRect *OffScreen;        /* temporary list of off-screen cliprects */
    struct  ClipRect *Backup;           /* temporary copy of un-damaged clips */
    struct  ClipRect *SuperSaveClipRects; /* five preallocated super cr's */
    struct  ClipRect *Undamaged;        /* undamaged, un-user clipped version
                                         * of the cliprect, restored on EndUpdate()
                                         */
    struct  Layer_Info  *LayerInfo;     /* points to head of the list */
    struct  SignalSemaphore Lock;       /* access to this layer */
    struct  Hook *BackFill;             /* backfill hook */
    ULONG   reserved1;
    struct  Region *ClipRegion;         /* user InstallClipRegion()'d region */
    struct  ClipRect *clipped;          /* clipped away by damage list or
                                         * user clip rect
                                         */
    WORD    Width,Height;               /* system use */
    UBYTE   reserved2[18];              /* more reserved fields */
    struct  Region  *DamageList;        /* list of rectangles to refresh */
};

/*
 * Describes one graphic rectangle of this layer, may it
 * be drawable or not. 
 * The meaning of some fields in here changed in the past,
 * and will remain changing. Chaining is done by Next, and
 * if obscured is non-NULL, BitMap *may* point to a backing
 * store bitmap aligned to multiples of 16 pixels. 
 * Everything else is private, and may change.
 * Especially, note that this structure grew in v33(!!!)
 * and has now been documented to be of this size in
 * v44. NEWCLIPRECTS_1_1 is really, really obsolete.
 * Do *never* allocate this yourself as layers handles them
 * internally more efficiently than AllocMem() could.
 */

struct ClipRect
{
    struct  ClipRect   *Next;           /* roms used to find next ClipRect */
    struct  ClipRect   *reservedlink;   /* Currently unused */
    LONG                obscured;       /* If non-zero, this is a backing store
                                         * cliprect that is currently obscured.
                                         * NEW: In V45, this is no longer a
                                         * valid pointer since a cliprect
                                         * can be obscured by more than one
                                         * layer. Just test for zero or non-
                                         * zero, do *NOT* dereference.
                                         */
	struct  BitMap     *BitMap;         /* backing store bitmap if obscured != NULL */
    struct  Rectangle   bounds;         /* bounds of this cliprect */
    struct  ClipRect   *vlink;          /* Layers private use!!! */
    struct  Layer_Info *home;           /* where this cliprect belongs to.
                                         * If you *MUST* hack in your private
                                         * cliprects, ensure that you set this
                                         * field to NULL. If you don't, layers
                                         * will pool your cliprect and will
                                         * release it when it "feels like".
                                         * For NULL, V40 behaivour is
                                         * re-established.
                                         */
    APTR                reserved;
#ifdef NEWCLIPRECTS_1_1
    LONG                Flags;          /* Layers private field for cliprects */
#endif				    /* MUST be multiple of 8 bytes to buffer */
};

/* internal cliprect flags */
#define CR_USERCLIPPED                  16      /* out of user clip rectangle */
#define CR_DAMAGECLIPPED                32      /* out of damage cliprects */

/* defines for code values for getcode 
 * this really belongs to graphics, and is of no
 * use for layers. It's here only for traditional
 * reasons.
 */
#define ISLESSX 1
#define ISLESSY 2
#define ISGRTRX 4
#define ISGRTRY 8

#endif  /* GRAPHICS_CLIP_H */
