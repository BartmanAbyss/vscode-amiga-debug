#ifndef	GRAPHICS_REGIONS_H
#define	GRAPHICS_REGIONS_H
/*
**	$VER: regions.h 47.1 (31.7.2019)
**
**	damage region management
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

struct RegionRectangle
{
    struct RegionRectangle *Next,*Prev;
    struct Rectangle bounds;
};

struct Region
{
    struct Rectangle bounds;
    struct RegionRectangle *RegionRectangle;
};

#endif	/* GRAPHICS_REGIONS_H */
