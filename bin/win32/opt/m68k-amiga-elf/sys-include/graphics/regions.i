	IFND	GRAPHICS_REGIONS_I
GRAPHICS_REGIONS_I	SET	1
**
**	$VER: regions.i 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include 'exec/types.i'
    ENDC

   IFND  GRAPHICS_GFX_I
   include  "graphics/gfx.i"
   ENDC

    STRUCTURE	Region,0
      STRUCT   rg_bounds,ra_SIZEOF
      APTR  rg_RegionRectangle
   LABEL    rg_SIZEOF

   STRUCTURE   RegionRectangle,0
      APTR  rr_Next
      APTR  rr_Prev
      STRUCT   rr_bounds,ra_SIZEOF
   LABEL    rr_SIZEOF

	ENDC	; GRAPHICS_REGIONS_I
