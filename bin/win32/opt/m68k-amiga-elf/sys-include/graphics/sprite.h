#ifndef	GRAPHICS_SPRITE_H
#define	GRAPHICS_SPRITE_H
/*
**	$VER: sprite.h 39.6 (16.6.1992)
**	Includes Release 45.1
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#define SPRITE_ATTACHED 0x80

struct SimpleSprite
{
    UWORD *posctldata;
    UWORD height;
    UWORD   x,y;    /* current position */
    UWORD   num;
};

struct ExtSprite
{
	struct SimpleSprite es_SimpleSprite;	/* conventional simple sprite structure */
	UWORD	es_wordwidth;			/* graphics use only, subject to change */
	UWORD	es_flags;			/* graphics use only, subject to change */
};



/* tags for AllocSpriteData() */
#define SPRITEA_Width		0x81000000
#define SPRITEA_XReplication	0x81000002
#define SPRITEA_YReplication	0x81000004
#define SPRITEA_OutputHeight	0x81000006
#define SPRITEA_Attached	0x81000008
#define SPRITEA_OldDataFormat	0x8100000a	/* MUST pass in outputheight if using this tag */

/* tags for GetExtSprite() */
#define GSTAG_SPRITE_NUM 0x82000020
#define GSTAG_ATTACHED	 0x82000022
#define GSTAG_SOFTSPRITE 0x82000024

/* tags valid for either GetExtSprite or ChangeExtSprite */
#define GSTAG_SCANDOUBLED	0x83000000	/* request "NTSC-Like" height if possible. */

#endif	/* GRAPHICS_SPRITE_H */
