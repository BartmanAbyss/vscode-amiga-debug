#ifndef	GRAPHICS_RASTPORT_H
#define	GRAPHICS_RASTPORT_H
/*
**	$VER: rastport.h 39.0 (21.8.1991)
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

struct AreaInfo
{
    WORD   *VctrTbl;	     /* ptr to start of vector table */
    WORD   *VctrPtr;	     /* ptr to current vertex */
    BYTE    *FlagTbl;	      /* ptr to start of vector flag table */
    BYTE    *FlagPtr;	      /* ptrs to areafill flags */
    WORD   Count;	     /* number of vertices in list */
    WORD   MaxCount;	     /* AreaMove/Draw will not allow Count>MaxCount*/
    WORD   FirstX,FirstY;    /* first point for this polygon */
};

struct TmpRas
{
    BYTE *RasPtr;
    LONG Size;
};

/* unoptimized for 32bit alignment of pointers */
struct GelsInfo
{
    BYTE sprRsrvd;	      /* flag of which sprites to reserve from
				 vsprite system */
    UBYTE Flags;	      /* system use */
    struct VSprite *gelHead, *gelTail; /* dummy vSprites for list management*/
    /* pointer to array of 8 WORDS for sprite available lines */
    WORD *nextLine;
    /* pointer to array of 8 pointers for color-last-assigned to vSprites */
    WORD **lastColor;
    struct collTable *collHandler;     /* addresses of collision routines */
    WORD leftmost, rightmost, topmost, bottommost;
    APTR firstBlissObj,lastBlissObj;    /* system use only */
};

struct RastPort
{
    struct  Layer *Layer;
    struct  BitMap   *BitMap;
    UWORD  *AreaPtrn;	     /* ptr to areafill pattern */
    struct  TmpRas *TmpRas;
    struct  AreaInfo *AreaInfo;
    struct  GelsInfo *GelsInfo;
    UBYTE   Mask;	      /* write mask for this raster */
    BYTE    FgPen;	      /* foreground pen for this raster */
    BYTE    BgPen;	      /* background pen  */
    BYTE    AOlPen;	      /* areafill outline pen */
    BYTE    DrawMode;	      /* drawing mode for fill, lines, and text */
    BYTE    AreaPtSz;	      /* 2^n words for areafill pattern */
    BYTE    linpatcnt;	      /* current line drawing pattern preshift */
    BYTE    dummy;
    UWORD  Flags;	     /* miscellaneous control bits */
    UWORD  LinePtrn;	     /* 16 bits for textured lines */
    WORD   cp_x, cp_y;	     /* current pen position */
    UBYTE   minterms[8];
    WORD   PenWidth;
    WORD   PenHeight;
    struct  TextFont *Font;   /* current font address */
    UBYTE   AlgoStyle;	      /* the algorithmically generated style */
    UBYTE   TxFlags;	      /* text specific flags */
    UWORD   TxHeight;	      /* text height */
    UWORD   TxWidth;	      /* text nominal width */
    UWORD   TxBaseline;       /* text baseline */
    WORD    TxSpacing;	      /* text spacing (per character) */
    APTR    *RP_User;
    ULONG   longreserved[2];
#ifndef GFX_RASTPORT_1_2
    UWORD   wordreserved[7];  /* used to be a node */
    UBYTE   reserved[8];      /* for future use */
#endif
};

/* drawing modes */
#define JAM1	    0	      /* jam 1 color into raster */
#define JAM2	    1	      /* jam 2 colors into raster */
#define COMPLEMENT  2	      /* XOR bits into raster */
#define INVERSVID   4	      /* inverse video for drawing modes */

/* these are the flag bits for RastPort flags */
#define FRST_DOT    0x01      /* draw the first dot of this line ? */
#define ONE_DOT     0x02      /* use one dot mode for drawing lines */
#define DBUFFER     0x04      /* flag set when RastPorts
				 are double-buffered */

	     /* only used for bobs */

#define AREAOUTLINE 0x08      /* used by areafiller */
#define NOCROSSFILL 0x20      /* areafills have no crossovers */

/* there is only one style of clipping: raster clipping */
/* this preserves the continuity of jaggies regardless of clip window */
/* When drawing into a RastPort, if the ptr to ClipRect is nil then there */
/* is no clipping done, this is dangerous but useful for speed */

#endif	/* GRAPHICS_RASTPORT_H */
