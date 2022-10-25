#ifndef  DISKFONT_DISKFONTTAG_H
#define  DISKFONT_DISKFONTTAG_H
/*
**      $VER: diskfonttag.h 10.6 (28.12.2001)
**      Includes Release 45.1
**
**      diskfonttag.h -- tag definitions for .otag files
**
**      (C) Copyright 2001 Amiga Inc.
**
**      (C) Copyright 1990-1992 Robert R. Burns
**          All Rights Reserved
**
*/
#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/* Level 0 entries never appear in the .otag tag list, but appear in font
 * specifications */
#define  OT_Level0      TAG_USER
/* Level 1 entries are required to exist in the .otag tag list */
#define  OT_Level1      (TAG_USER | 0x1000)
/* Level 2 entries are optional typeface metric tags */
#define  OT_Level2      (TAG_USER | 0x2000)
/* Level 3 entries are required for some OT_Engines */
#define  OT_Level3      (TAG_USER | 0x3000)
/* Indirect entries are at (tag address + data offset) */
#define  OT_Indirect    0x8000


/********************************************************************/
/* font specification and inquiry tags */

/* !  tags flagged with an exclaimation mark are valid for
 *    specification.
 *  ? tags flagged with a question mark are valid for inquiry
 *
 * fixed binary numbers are encoded as 16 bits of integer and
 * 16 bits of fraction.  Negative values are indicated by twos
 * complement of all 32 bits.
 */

/* !  OT_DeviceDPI specifies the target device dots per inch -- X DPI is
 *    in the high word, Y DPI in the low word. */
#define  OT_DeviceDPI   (OT_Level0 | 0x01)      /* == TA_DeviceDPI */

/* !  OT_DotSize specifies the target device dot size as a percent of
 *    it's resolution-implied size -- X percent in high word, Y percent
 *    in low word. */
#define  OT_DotSize     (OT_Level0 | 0x02)

/* !  OT_PointHeight specifies the requested point height of a typeface,
 *    specifically, the height and nominal width of the em-square.
 *    The point referred to here is 1/72".  It is encoded as a fixed
 *    binary number. */
#define  OT_PointHeight (OT_Level0 | 0x08)

/* !  OT_SetFactor specifies the requested set width of a typeface.
 *    It distorts the width of the em-square from that specified by
 *    OT_PointHeight.  To compensate for a device with different
 *    horizontal and vertical resolutions, OT_DeviceDPI should be used
 *    instead.  For a normal aspect ratio, set to 1.0 (encoded as
 *    0x00010000).  This is the default value. */
#define  OT_SetFactor   (OT_Level0 | 0x09)

/* !  OT_Shear... specifies the Sine and Cosine of the vertical stroke
 *    angle, as two fixed point binary fractions.  Both must be specified:
 *    first the Sine and then the Cosine.  Setting the sine component
 *    changes the Shear to an undefined value, setting the cosine
 *    component completes the Shear change to the new composite value.
 *    For no shear, set to 0.0, 1.0 (encoded as 0x00000000, 0x00010000).
 *    This is the default value. */
#define  OT_ShearSin    (OT_Level0 | 0x0a)
#define  OT_ShearCos    (OT_Level0 | 0x0b)

/* !  OT_Rotate... specifies the Sine and Cosine of the baselin rotation
 *    angle, as two fixed point binary fractions.  Both must be specified:
 *    first the Sine and then the Cosine.  Setting the sine component
 *    changes the Shear to an undefined value, setting the cosine
 *    component completes the Shear change to the new composite value.
 *    For no shear, set to 0.0, 1.0 (encoded as 0x00000000, 0x00010000).
 *    This is the default value. */
#define  OT_RotateSin   (OT_Level0 | 0x0c)
#define  OT_RotateCos   (OT_Level0 | 0x0d)

/* !  OT_Embolden... specifies values to algorithimically embolden -- or,
 *    when negative, lighten -- the glyph.  It is encoded as a fixed point
 *    binary fraction of the em-square.  The X and Y components can be
 *    changed indendently.  For normal characters, set to 0.0, 0.0
 *    (encoded as 0x00000000, 0x00000000).  This is the default value. */
#define  OT_EmboldenX   (OT_Level0 | 0x0e)
#define  OT_EmboldenY   (OT_Level0 | 0x0f)

/* !  OT_PointSize is an old method of specifying the point size,
 *    encoded as (points * 16). */
#define  OT_PointSize   (OT_Level0 | 0x10)

/* !  OT_GlyphCode specifies the glyph (character) code to use with
 *    subsequent operations.  For example, this is the code for an
 *    OT_Glyph inquiry */
#define  OT_GlyphCode   (OT_Level0 | 0x11)

/* !  OT_GlyphCode2 specifies the second glyph code.  For example,
 *    this is the right glyph of the two glyphs of an OT_KernPair
 *    inquiry */
#define  OT_GlyphCode2  (OT_Level0 | 0x12)

/* !  OT_GlyphWidth specifies a specific width for a glyph.
 *    It sets a specific escapement (advance) width for subsequent
 *    glyphs.  It is encoded as a fixed binary fraction of the em-square.
 *    To revert to using the font-defined escapement for each glyph, set
 *    to 0.0 (encoded as 0x00000000).  This is the default value. */
#define  OT_GlyphWidth  (OT_Level0 | 0x13)

/* !  OT_OTagPath and
 * !  OT_OTagList specify the selected typeface.  Both must be specified:
 *    first the Path and then the List.  Setting the path name changes
 *    changes the typeface to an undefined value, providing the List
 *    completes the typeface selection to the new typeface.  OTagPath
 *    is the null terminated full file path of the .otag file associated
 *    with the typeface.  OTagList is a memory copy of the processed
 *    contents of that .otag file (i.e. with indirections resolved).
 *    There are no default values for the typeface. */
#define  OT_OTagPath    (OT_Level0 | OT_Indirect | 0x14)
#define  OT_OTagList    (OT_Level0 | OT_Indirect | 0x15)

/*  ? OT_GlyphMap supplies a read-only struct GlyphMap pointer that
 *    describes a bitmap for a glyph with the current attributes. */
#define  OT_GlyphMap    (OT_Level0 | OT_Indirect | 0x20)

/*  ? OT_WidthList supplies a read-only struct MinList of struct
 *    GlyphWidthEntry nodes for glyphs that are defined from GlyphCode
 *    to GlyphCode2, inclusive.  The widths are represented as fixed
 *    binary fractions of the em-square, ignoring any effect of
 *    SetFactor or GlyphWidth.  A width would need to be converted to
 *    a distance along the baseline in device units by the
 *    application. */
#define  OT_WidthList   (OT_Level0 | OT_Indirect | 0x21)

/*  ? OT_...KernPair supplies the kern adjustment to be added to the
 *    current position after placement of the GlyphCode glyph and
 *    before placement of the GlyphCode2 glyph.  Text kern pairs are
 *    for rendering body text.  Display kern pairs are generally
 *    tighter values for display (e.g. headline) purposes.  The
 *    adjustment is represented as a fixed binary fraction of the
 *    em-square, ignoring any effect of SetFactor.  This number would
 *    need to be converted to a distance along the baseline in device
 *    units by the application. */
#define  OT_TextKernPair (OT_Level0 | OT_Indirect | 0x22)
#define  OT_DesignKernPair (OT_Level0 | OT_Indirect | 0x23)

/*  ? OT_Underlined is an unsigned word which is used to request
 *    algorithimic underlining for the engine when rendering the glyph.
 *    Bullet.library currently does not support this tag, though it
 *    may be used by other engines in the future.  The default for
 *    any engine which supports this tag must be OTUL_None.  Engines which
 *    do not support this tag should return an appropriate OTERR value.
 *
 *    As of V39, diskfont.library will request underlining if specified
 *    in the TextAttr, or TTextAttr passed to OpenDiskFont().  Diskfont
 *    will first request Broken underlining (like the Text() function
 *    does when SetSoftStyle() is used), and then Solid underlining if
 *    the engine returns an error.  If the engine returns an error for
 *    both, then diskfont.library attempts to find, or create the best
 *    non-underlined font that it can. */
#define  OT_UnderLined          (OT_Level0 | 0x24)

#define  OTUL_None              0
#define  OTUL_Solid             1
#define  OTUL_Broken            2
#define  OTUL_DoubleSolid       3
#define  OUTL_DoubleBroken      4

/*  ? OT_StrikeThrough is a boolean which is used to request
 *    algorithimic strike through when rendering the glyph.
 *    Bullet.library currently does not support this tag, though it
 *    may be used by other engines in the future.  The default for
 *    any engined which supports this tag must be FALSE.  Engines which
 *    do not support this tag should return an appropriate OTERR value. */
#define  OT_StrikeThrough       (OT_Level0 | 0x25)


/********************************************************************/
/* .otag tags */

/* suffix for files in FONTS: that contain these tags */
#define  OTSUFFIX       ".otag"

/* OT_FileIdent both identifies this file and verifies its size.
 * It is required to be the first tag in the file. */
#define  OT_FileIdent   (OT_Level1 | 0x01)

/* OT_Engine specifies the font engine this file is designed to use */
#define  OT_Engine      (OT_Level1 | OT_Indirect | 0x02)
#define  OTE_Bullet     "bullet"

/* OT_Family is the family name of this typeface */
#define  OT_Family      (OT_Level1 | OT_Indirect | 0x03)

/* The name of this typeface is implicit in the name of the .otag file */
/* OT_BName is used to find the bold variant of this typeface */
#define  OT_BName       (OT_Level2 | OT_Indirect | 0x05)
/* OT_IName is used to find the italic variant of this typeface */
#define  OT_IName       (OT_Level2 | OT_Indirect | 0x06)
/* OT_BIName is used to find the bold italic variant of this typeface */
#define  OT_BIName      (OT_Level2 | OT_Indirect | 0x07)
/* OT_RName is used to find the Roman variant of this typeface */
#define  OT_RName	(OT_Level2 | OT_Indirect | 0x09)

/* OT_SymSet is used to select the symbol set that has the OT_YSizeFactor
 * described here.  Other symbol sets might have different extremes */
#define  OT_SymbolSet   (OT_Level1 | 0x10)

/* OT_YSizeFactor is a ratio to assist in calculating the Point height
 * to BlackHeight relationship -- high word: Point height term, low
 * word: Black height term -- pointSize = ysize*<high>/<low> */
#define  OT_YSizeFactor (OT_Level1 | 0x11)

/* OT_SpaceWidth specifies the width of the space character relative
 * to the character height */
#define  OT_SpaceWidth  (OT_Level2 | 0x12)

/* OT_IsFixed is a boolean indicating that all the characters in the
 * typeface are intended to have the same character advance */
#define  OT_IsFixed     (OT_Level2 | 0x13)

/* OT_SerifFlag is a boolean indicating if the character has serifs */
#define  OT_SerifFlag   (OT_Level1 | 0x14)

/* OT_StemWeight is an unsigned byte indicating the weight of the character */
#define  OT_StemWeight  (OT_Level1 | 0x15)

#define  OTS_UltraThin    8     /*   0- 15 */
#define  OTS_ExtraThin   24     /*  16- 31 */
#define  OTS_Thin        40     /*  32- 47 */
#define  OTS_ExtraLight  56     /*  48- 63 */
#define  OTS_Light       72     /*  64- 79 */
#define  OTS_DemiLight   88     /*  80- 95 */
#define  OTS_SemiLight  104     /*  96-111 */
#define  OTS_Book       120     /* 112-127 */
#define  OTS_Medium     136     /* 128-143 */
#define  OTS_SemiBold   152     /* 144-159 */
#define  OTS_DemiBold   168     /* 160-175 */
#define  OTS_Bold       184     /* 176-191 */
#define  OTS_ExtraBold  200     /* 192-207 */
#define  OTS_Black      216     /* 208-223 */
#define  OTS_ExtraBlack 232     /* 224-239 */
#define  OTS_UltraBlack 248     /* 240-255 */

/* OT_SlantStyle is an unsigned byte indicating the font posture */
#define  OT_SlantStyle  (OT_Level1 | 0x16)
#define  OTS_Upright    0
#define  OTS_Italic     1       /* Oblique, Slanted, etc. */
#define  OTS_LeftItalic 2       /* Reverse Slant */

/* OT_HorizStyle is an unsigned byte indicating the appearance width */
#define  OT_HorizStyle  (OT_Level1 | 0x17)
#define  OTH_UltraCompressed     16     /*   0- 31 */
#define  OTH_ExtraCompressed     48     /*  32- 63 */
#define  OTH_Compressed          80     /*  64- 95 */
#define  OTH_Condensed          112     /*  96-127 */
#define  OTH_Normal             144     /* 128-159 */
#define  OTH_SemiExpanded       176     /* 160-191 */
#define  OTH_Expanded           208     /* 192-223 */
#define  OTH_ExtraExpanded      240     /* 224-255 */

/* OT_SpaceFactor specifies the width of the space character relative
 * to the character height */
#define  OT_SpaceFactor (OT_Level2 | 0x18)

/* OT_InhibitAlgoStyle indicates which ta_Style bits, if any, should
 * be ignored even if the font does not already have that quality.
 * For example, if FSF_BOLD is set and the typeface is not bold but
 * the user specifies bold, the application or diskfont library is
 * not to use OT_Embolden to achieve a bold result. */
#define  OT_InhibitAlgoStyle (OT_Level2 | 0x19)

/* OT_AvailSizes is an indirect pointer to sorted UWORDs, 0th is count */
#define  OT_AvailSizes  (OT_Level1 | OT_Indirect | 0x20)
#define  OT_MAXAVAILSIZES       20      /* no more than 20 sizes allowed */

/* OT_SpecCount is the count number of parameters specified here */
#define  OT_SpecCount   (OT_Level1 | 0x100)

/* Specs can be created as appropriate for the engine by ORing in the
 * parameter number (1 is first, 2 is second, ... up to 15th) */
#define  OT_Spec        (OT_Level1 | 0x100)
/* OT_Spec1 is the (first) parameter to the font engine to select
 * this particular typeface */
#define  OT_Spec1       (OT_Level1 | 0x101)


/********************************************************************/
/* GetDiskFontCtrl and SetDiskFontCtrl tags */

#define DFCTRL_BASE     (TAG_USER + 0x0B000000)

/*
 * X and Y DPI device default settings for the bullet library font generator.
 * Default is 72 dpi.
 */

#define DFCTRL_XDPI     (DFCTRL_BASE + 1)
#define DFCTRL_YDPI     (DFCTRL_BASE + 2)

/*
 * X and Y DPI dot size settings for the font generator.
 * Default is 100dpi.
 */

#define DFCTRL_XDOTP    (DFCTRL_BASE + 3)
#define DFCTRL_YDOTP    (DFCTRL_BASE + 4)

/*
 * Default symbol set identifier. This is currently unused.
 */

#define DFCTRL_SYMSET   (DFCTRL_BASE + 4)

/*
 * AvailFonts cache enable flag. Either TRUE or FALSE.
 */

#define DFCTRL_CACHE    (DFCTRL_BASE + 5)

/*
 * Availfonts font sorting flag. See below for available values.
 */
#define DFCTRL_SORTMODE (DFCTRL_BASE + 6)

/* No sorting: Default. */
#define DFCTRL_SORT_OFF 0L

/* Asceding sort order, localized with default locale. */
#define DFCTRL_SORT_ASC 1L

/* Descending sort order, localized with default locale. */
#define DFCTRL_SORT_DES -1L

#endif   /* DISKFONT_DISKFONTTAG_H */
