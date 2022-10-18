#ifndef	GRAPHICS_LAYERS_H
#define	GRAPHICS_LAYERS_H
/*
**	$VER: layers.h 39.4 (14.4.1992)
**	Includes Release 45.1
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif

#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif

#define LAYERSIMPLE		1
#define LAYERSMART		2
#define LAYERSUPER		4
#define LAYERUPDATING		0x10
#define LAYERBACKDROP		0x40
#define LAYERREFRESH		0x80
#define	LAYERIREFRESH		0x200
#define	LAYERIREFRESH2		0x400
#define LAYER_CLIPRECTS_LOST	0x100	/* during BeginUpdate */
					/* or during layerop */
					/* this happens if out of memory */

struct Layer_Info
{
	struct	Layer		*top_layer;
	struct	Layer		*check_lp;		/* !! Private !! */
	struct	ClipRect	*obs;
	struct	ClipRect	*FreeClipRects;		/* !! Private !! */
		LONG		PrivateReserve1;	/* !! Private !! */
		LONG		PrivateReserve2;	/* !! Private !! */
	struct	SignalSemaphore	Lock;			/* !! Private !! */
	struct	MinList		gs_Head;		/* !! Private !! */
		WORD		PrivateReserve3;	/* !! Private !! */
		VOID		*PrivateReserve4;	/* !! Private !! */
		UWORD		Flags;
		BYTE		fatten_count;		/* !! Private !! */
		BYTE		LockLayersCount;	/* !! Private !! */
		WORD		PrivateReserve5;	/* !! Private !! */
		VOID		*BlankHook;		/* !! Private !! */
		VOID		*LayerInfo_extra;	/* !! Private !! */
};

#define NEWLAYERINFO_CALLED 1

/*
 * LAYERS_NOBACKFILL is the value needed to get no backfill hook
 * LAYERS_BACKFILL is the value needed to get the default backfill hook
 */
#define	LAYERS_NOBACKFILL	((struct Hook *)1)
#define	LAYERS_BACKFILL		((struct Hook *)0)

#endif	/* GRAPHICS_LAYERS_H */
