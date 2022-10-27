#ifndef  DISKFONT_GLYPH_H
#define  DISKFONT_GLYPH_H
/*
**	$VER: glyph.h 9.1 (19.6.1992)
**	Includes Release 45.1
**
**	glyph.h -- structures for glyph libraries
**
**	(C) Copyright 1991-1992 Robert R. Burns
**	    All Rights Reserved
*/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef  EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

#ifndef  EXEC_NODES_H
#include <exec/nodes.h>
#endif

/* A GlyphEngine must be acquired via OpenEngine and is read-only */
struct GlyphEngine {
    struct Library *gle_Library; /* engine library */
    char *gle_Name;		/* library basename: e.g. "bullet" */
    /* private library data follows... */
};

typedef LONG FIXED;		/* 32 bit signed w/ 16 bits of fraction */

struct GlyphMap {
    UWORD   glm_BMModulo;	/* # of bytes in row: always multiple of 4 */
    UWORD   glm_BMRows;		/* # of rows in bitmap */
    UWORD   glm_BlackLeft;	/* # of blank pixel columns at left */
    UWORD   glm_BlackTop;	/* # of blank rows at top */
    UWORD   glm_BlackWidth;	/* span of contiguous non-blank columns */
    UWORD   glm_BlackHeight;	/* span of contiguous non-blank rows */
    FIXED   glm_XOrigin;	/* distance from upper left corner of bitmap */
    FIXED   glm_YOrigin;	/*   to initial CP, in fractional pixels */
    WORD    glm_X0;		/* approximation of XOrigin in whole pixels */
    WORD    glm_Y0;		/* approximation of YOrigin in whole pixels */
    WORD    glm_X1;		/* approximation of XOrigin + Width */
    WORD    glm_Y1;		/* approximation of YOrigin + Width */
    FIXED   glm_Width;		/* character advance, as fraction of em width */
    UBYTE  *glm_BitMap;		/* actual glyph bitmap */
};

struct GlyphWidthEntry {
    struct MinNode gwe_Node;	/* on list returned by OT_WidthList inquiry */
    UWORD   gwe_Code;		/* entry's character code value */
    FIXED   gwe_Width;		/* character advance, as fraction of em width */
};
#endif	 /* DISKFONT_GLYPH_H */
