#ifndef	GRAPHICS_GFX_H
#define	GRAPHICS_GFX_H
/*
**	$VER: gfx.h 39.5 (19.3.1992)
**	Includes Release 45.1
**
**	general include file for application programs
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#define BITSET	0x8000
#define BITCLR	0

#define AGNUS
#ifdef AGNUS
#define TOBB(a)      ((long)(a))
#else
#define TOBB(a)      ((long)(a)>>1)  /* convert Chip adr to Bread Board Adr */
#endif

struct Rectangle
{
    WORD   MinX,MinY;
    WORD   MaxX,MaxY;
};

struct Rect32
{
    LONG    MinX,MinY;
    LONG    MaxX,MaxY;
};

typedef struct tPoint
{
    WORD x,y;
} Point;

typedef UBYTE *PLANEPTR;

struct BitMap
{
    UWORD   BytesPerRow;
    UWORD   Rows;
    UBYTE   Flags;
    UBYTE   Depth;
    UWORD   pad;
    PLANEPTR Planes[8];
};

/* This macro is obsolete as of V39. AllocBitMap() should be used for allocating
   bitmap data, since it knows about the machine's particular alignment
   restrictions.
*/
#define RASSIZE(w,h)	((ULONG)(h)*( ((ULONG)(w)+15)>>3&0xFFFE))

/* flags for AllocBitMap, etc. */
#define BMB_CLEAR 0
#define BMB_DISPLAYABLE 1
#define BMB_INTERLEAVED 2
#define BMB_STANDARD 3
#define BMB_MINPLANES 4

#define BMF_CLEAR (1l<<BMB_CLEAR)
#define BMF_DISPLAYABLE (1l<<BMB_DISPLAYABLE)
#define BMF_INTERLEAVED (1l<<BMB_INTERLEAVED)
#define BMF_STANDARD (1l<<BMB_STANDARD)
#define BMF_MINPLANES (1l<<BMB_MINPLANES)

/* the following are for GetBitMapAttr() */
#define BMA_HEIGHT 0
#define BMA_DEPTH 4
#define BMA_WIDTH 8
#define BMA_FLAGS 12

#endif	/* GRAPHICS_GFX_H */
