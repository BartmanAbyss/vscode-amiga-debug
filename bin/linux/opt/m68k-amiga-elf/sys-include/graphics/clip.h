#ifndef	GRAPHICS_CLIP_H
#define	GRAPHICS_CLIP_H
/*
**	$VER: clip.h 39.0 (2.12.1991)
**	Includes Release 45.1
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
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

struct Layer
{
    struct  Layer *front,*back;
    struct  ClipRect	*ClipRect;  /* read by roms to find first cliprect */
    struct  RastPort	*rp;
    struct  Rectangle	bounds;
    UBYTE   reserved[4];
    UWORD   priority;		    /* system use only */
    UWORD   Flags;		    /* obscured ?, Virtual BitMap? */
    struct  BitMap *SuperBitMap;
    struct  ClipRect *SuperClipRect; /* super bitmap cliprects if VBitMap != 0*/
				  /* else damage cliprect list for refresh */
    APTR    Window;		  /* reserved for user interface use */
    WORD    Scroll_X,Scroll_Y;
    struct  ClipRect *cr,*cr2,*crnew;	/* used by dedice */
    struct  ClipRect *SuperSaveClipRects; /* preallocated cr's */
    struct  ClipRect *_cliprects;	/* system use during refresh */
    struct  Layer_Info	*LayerInfo;	/* points to head of the list */
    struct  SignalSemaphore Lock;
    struct  Hook *BackFill;
    ULONG   reserved1;
    struct  Region *ClipRegion;
    struct  Region *saveClipRects;	/* used to back out when in trouble*/
    WORD    Width,Height;		/* system use */
    UBYTE   reserved2[18];
    /* this must stay here */
    struct  Region  *DamageList;    /* list of rectangles to refresh
				       through */
};

struct ClipRect
{
    struct  ClipRect *Next;	    /* roms used to find next ClipRect */
    struct  ClipRect *prev;	    /* Temp use in layers (private) */
    struct  Layer   *lobs;	    /* Private use for layers */
    struct  BitMap  *BitMap;	    /* Bitmap for layers private use */
    struct  Rectangle	bounds;     /* bounds of cliprect */
    void    *_p1;		    /* Layers private use!!! */
    void    *_p2;		    /* Layers private use!!! */
    LONG    reserved;		    /* system use (Layers private) */
#ifdef NEWCLIPRECTS_1_1
    LONG    Flags;		    /* Layers private field for cliprects */
				    /* that layers allocates... */
#endif				    /* MUST be multiple of 8 bytes to buffer */
};

/* internal cliprect flags */
#define CR_NEEDS_NO_CONCEALED_RASTERS  1
#define CR_NEEDS_NO_LAYERBLIT_DAMAGE   2

/* defines for code values for getcode */
#define ISLESSX 1
#define ISLESSY 2
#define ISGRTRX 4
#define ISGRTRY 8

#endif	/* GRAPHICS_CLIP_H */
