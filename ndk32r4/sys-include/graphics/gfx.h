#ifndef	GRAPHICS_GFX_H
#define	GRAPHICS_GFX_H
/*
**	$VER: gfx.h 47.3 (13.11.2021)
**
**	Low level data structures, types, flags, Tags and macros used
**	by graphics.library for display and rendering operations
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
**
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/* For use with the Custom.dmacon and Custom.intena registers. */
#define BITSET 0x8000
#define BITCLR 0


/* The TOBB() macro serves no real purpose on modern Amiga systems,
 * post the development work which took place in 1984-1985.
 *
 * It can be used to cast addresses into 32 bit integers, to be
 * written into custom chip registers. You may find these in
 * legacy source code only.
 */
#define AGNUS
#ifdef AGNUS
#define TOBB(a) ((long)(a))
#else
#define TOBB(a) ((long)(a)>>1) /* convert Chip adr to Bread Board Adr */
#endif


struct Rectangle
{
	WORD MinX,MinY;
	WORD MaxX,MaxY;
};

struct Rect32
{
	LONG MinX,MinY;
	LONG MaxX,MaxY;
};

typedef struct tPoint
{
	WORD x,y;
} Point;


typedef UBYTE * PLANEPTR;

struct BitMap
{
	UWORD    BytesPerRow;
	UWORD    Rows;
	UBYTE    Flags;
	UBYTE    Depth;
	UWORD    pad;
	PLANEPTR Planes[8];
};


/* This macro is obsolete as of V39 and beyond if used for the purpose
 * of allocating memory for BitMap planes. AllocBitMap() should be used
 * for allocating BitMap data instead, since it is aware of the
 * machine's particular alignment requirements.
 */
#define RASSIZE(w,h) ((ULONG)(h) * ((((ULONG)(w) + 15) >> 3) & 0xFFFE))


/* Flags for AllocBitMap(), V39 and beyond */
#define BMB_CLEAR       0
#define BMB_DISPLAYABLE 1
#define BMB_INTERLEAVED 2
#define BMB_STANDARD    3
#define BMB_MINPLANES   4


/* Additional flags for AllocBitMap(), V45 and beyond */
#define BMB_HIJACKED     7 /* For TagItem list support: must be clear */
#define BMB_RTGTAGS      8 /* For TagItem list support: must be set */
#define BMB_RTGCHECK     9 /* For TagItem list support: must be set */
#define BMB_FRIENDISTAG 10 /* For TagItem list support: must be set */
#define BMB_INVALID     11 /* For TagItem list support: must be clear */

#define BMF_CLEAR       (1l<<BMB_CLEAR)
#define BMF_DISPLAYABLE (1l<<BMB_DISPLAYABLE)
#define BMF_INTERLEAVED (1l<<BMB_INTERLEAVED)
#define BMF_STANDARD    (1l<<BMB_STANDARD)
#define BMF_MINPLANES   (1l<<BMB_MINPLANES)

#define BMF_HIJACKED    (1L<<BMB_HIJACKED) /* aka BMF_SPECIALFMT */
#define BMF_RTGTAGS     (1L<<BMB_RTGTAGS)
#define BMF_RTGCHECK    (1L<<BMB_RTGCHECK)
#define BMF_FRIENDISTAG (1L<<BMB_FRIENDISTAG)
#define BMF_INVALID     (1L<<BMB_INVALID)

/* These bit combinations and the BITMAPFLAGS_ARE_EXTENDED() macro
 * below must be used to detect if AllocBitMap() has been invoked
 * with a 'struct TagItem *' argument in place of the 'struct BitMap *'
 * friend BitMap parameter.
 */
#define BMF_CHECKMASK  (BMF_HIJACKED    | BMF_RTGTAGS | BMF_RTGCHECK | \
                        BMF_FRIENDISTAG | BMF_INVALID)
#define BMF_CHECKVALUE (BMF_RTGTAGS | BMF_RTGCHECK | BMF_FRIENDISTAG)

#define BITMAPFLAGS_ARE_EXTENDED(a) (((a) & BMF_CHECKMASK) == BMF_CHECKVALUE)


/* The following attributes are used with GetBitMapAttr() */
#define BMA_HEIGHT  0
#define BMA_DEPTH   4
#define BMA_WIDTH   8
#define BMA_FLAGS  12


/* Tags for use with AllocBitMap(), for V45 and beyond only. */

/* Specify a friend BitMap by tags. Default is not to use a friend BitMap */
#define BMATags_Friend (TAG_USER+0)

/* Depth of the BitMap, which translates into the maximum number
 * of colors which may be used, e.g. depth=8 for 256 colors.
 * Default is the depth parameter of AllocBitMap().
 */
#define BMATags_Depth (TAG_USER+1)

/* Low level BitMap data format (see enPixelFormat below) */
#define BMATags_PixelFormat (TAG_USER+2)

/* Clear the BitMap? Default is the BMF_CLEAR flag specified value. */
#define BMATags_Clear (TAG_USER+3)

/* BitMap must be directly usable by display hardware?
 * Default is to follow whether the BMF_DISPLAYABLE flag is set or not.
 */
#define BMATags_Displayable (TAG_USER+4)

/* Do not provide memory for the BitMap, just allocate the structure
 * itself. Defaults to FALSE, i.e. memory will be provided.
 */
#define BMATags_NoMemory (TAG_USER+6)

/* Disallow generation of a sprite (for the mouse pointer).
 * Defaults to FALSE, i.e. the sprite is enabled.
 */
#define BMATags_NoSprite (TAG_USER+7)

/* Width of the display mode in pixels. Defaults to the width of the
 * DisplayID stored in the monitor database.
 */
#define BMATags_ModeWidth (TAG_USER+10)

/* Height of the display mode in pixels. Default is the height of the
 * DisplayID stored in the monitor database.
 */
#define BMATags_ModeHeight (TAG_USER+11)

/* Specify additional alignment requirements for the BitMap rows. This
 * must be a power of two (number of bytes). If this Tag is used then
 * bit plane rows are aligned to this boundary. Otherwise, the native
 * alignment restriction remains in effect.
 */
#define BMATags_Alignment (TAG_USER+15)

/* Set along with the BMATags_Alignment Tag to enforce alignment
 * for displayable screens
 */
#define BMATags_ConstantBytesPerRow (TAG_USER+16)

/* User BitMap which will never be stored in video memory */
#define BMATags_UserPrivate (TAG_USER+17)

/* A DisplayID from the monitor data base. The system will attempt to
 * extract all the necessary information to build a suitable BitMap.
 * This Tag ID is intentionally identical to intuition.library/SA_DisplayID
 */
#define BMATags_DisplayID (TAG_USER+0x32)

/* If set to TRUE, the BitMap is not allocated on the graphics
 * board directly, but may remain in an off-hardware location
 * if the screen is not visible. Defaults to FALSE, i.e. the
 * BitMap is allocated from the graphics board memory.
 * This Tag ID is intentionally identical to intuition.library/SA_Behind.
 */
#define BMATags_BitmapInvisible (TAG_USER+0x37)

/* Set the initial screen palette colors. ti_Data is an array of
 * "struct ColorSpec" entries, terminated by ColorSpec.ColorIndex = -1.
 * This Tag ID is intentionally identical to intuition.library/SA_Colors.
 */
#define BMATags_BitmapColors (TAG_USER+0x29)

/* Set the BitMaps's initial palette colors at 32 bits-per-gun. ti_Data is a
 * pointer to a table to be passed to the graphics.library/LoadRGB32()
 * function. This format supports both runs of color registers and sparse
 * registers. See the AutoDoc entry for that function for full details.
 * Any color set here has precedence over the same register set by
 * ABMA_BitmapColors.
 * This Tag is intentionally identical to intuition.library/SA_Colors32.
 */
#define BMATags_BitmapColors32 (TAG_USER+0x43)

/* Record an error in case AllocBitMap() fails to allocate a non-native
 * BitMap. The ti_Data value is a pointer to a ULONG in which the RTG
 * software will store the error code.
 * This Tag is intentionally identical to intuition.library/SA_ErrorCode.
 */
#define BMATags_BitmapErrorCode (TAG_USER+0x2A)

/* internal use only! */
#define BMATags_Private1 (TAG_USER+5)
#define BMATags_Private2 (TAG_USER+8)
#define BMATags_Private3 (TAG_USER+9)
#define BMATags_Private4 (TAG_USER+18)
#define BMATags_Private5 (TAG_USER+19)
#define BMATags_Private6 (TAG_USER+20)
#define BMATags_Private7 (TAG_USER+21)

/* Private. Do not use in new code. */
#define BMATags_RenderFunc (TAG_USER+12)
#define BMATags_SaveFunc (TAG_USER+13)
#define BMATags_UserData (TAG_USER+14)


/* Low level pixel formats as used by AllocBitMap() and
 * the BMATags_PixelFormat Tag.
 */
#ifdef USE_GRAPHICS_GFX_PIXELFORMATS

/* Multibyte formats are described by bit patterns for each color, i.e.
 * "A" stands for the alpha channel (transparency) and "R", "G" and "B"
 * stand for the respective color components. The "X" stands for a bit which
 * has no specific meaning but nevertheless is part of the pixel data.
 *
 * For example "XRRRRRGG GGGBBBBB" breaks down into one unused bit ("X")
 * and five bits each for the red ("RRRRR"), green ("GGGGG") and blue
 * ("BBBBB") components.
 */
enum enPixelFormat
{
	/* One byte per pixel, greyscale or palette-mapped */
	PIXFMT_LUT8,
	/* Two bytes per pixel, 5 bits per gun (XRRRRRGG GGGBBBBB) */
	PIXFMT_RGB15,
	/* Two bytes per pixel, 5 bits per gun (XBBBBBGG GGGRRRRR) */
	PIXFMT_BGR15,
	/* Same as PIXFMT_RGB15 but in little endian order (GGGBBBBB XRRRRRGG) */
	PIXFMT_RGB15PC,
	/* Same as PIXFMT_BGR15 but in little endian order (GGGRRRRR XBBBBBGG) */
	PIXFMT_BGR15PC,
	/* Two bytes per pixel, 5 bits for R/B, 6 for G (RRRRRGGG GGGBBBBB) */
	PIXFMT_RGB16,
	/* Two bytes per pixel, 5 bits for R/B, 6 for G (BBBBBGGG GGGRRRRR) */
	PIXFMT_BGR16,
	/* Same as PIXFMT_RGB16 but in little endian order (GGGBBBBB RRRRRGGG) */
	PIXFMT_RGB16PC,
	/* Same as PIXFMT_BGR16 but in little endian order (GGGRRRRR BBBBBGGG) */
	PIXFMT_BGR16PC,
	/* Three bytes per pixel (RRRRRRRR GGGGGGGG BBBBBBBB) */
	PIXFMT_RGB24,
	/* Three bytes per pixel (BBBBBBBB GGGGGGGG RRRRRRRR) */
	PIXFMT_BGR24,
	/* Four bytes per pixel with alpha channel (AAAAAAAA RRRRRRRR GGGGGGGG BBBBBBBB) */
	PIXFMT_ARGB32,
	/* Four bytes per pixel with alpha channel (BBBBBBBB GGGGGGGG RRRRRRRR AAAAAAAA) */
	PIXFMT_BGRA32,
	/* Four bytes per pixel with alpha channel (RRRRRRRR GGGGGGGG BBBBBBBB AAAAAAAA) */
	PIXFMT_RGBA32
};

#endif /* USE_GRAPHICS_GFX_PIXELFORMATS */

#endif	/* GRAPHICS_GFX_H */
