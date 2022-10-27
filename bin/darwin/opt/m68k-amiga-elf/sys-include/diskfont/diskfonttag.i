	IFND	DISKFONT_DISKFONTTAG_I
DISKFONT_DISKFONTTAG_I	SET	1

**	$VER: diskfonttag.i 38.4 (14.7.1992)
**	Includes Release 45.1
**
**	diskfonttag.i -- tag definitions for .otag files
**
**	Copyright 1992-2001 Amiga, Inc.
**	    All Rights Reserved

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC

	IFND	UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

* Level 0 entries never appear in the .otag list, but appear in font
* specifications

OT_Level0	EQU	TAG_USER
* Level 1 entries are required to exist in the .otag tag list
OT_Level1	EQU	(TAG_USER!$1000)
* Level 2 entries are optional typeface metric tags
OT_Level2	EQU	(TAG_USER!$2000)
* Level 3 entries are required for some OT_Engines
OT_Level3	EQU	(TAG_USER!$3000)
* Indirect entries are at (tag address + data offset)
OT_Indirect	EQU	$8000

********************************************************************
* font specification and inquiry tags
*
*! tags flagged with an exclaimation mark are valid for
*    specification.
*  ? tags flagged with a question mark are valid for inquiry
*
* fixed binary numbers are encoded as 16 bits of integer and
* 16 bits of fraction.	Negative values are indicated by twos
* complement of all 32 bits.


*! OT_DeviceDPI specifies the target device dots per inch -- X DPI is
*    in the high word, Y DPI in the low word.  OT_DeviceDPI == TA_DeviceDPI.
OT_DeviceDPI	EQU	(OT_Level0!$01)

*! OT_DotSize specifies the target device dot size as a percent of
*    it's resolution-implied size -- X percent in high word, Y percent
*    in low word.
OT_DotSize	EQU	(OT_Level0!$02)

*! OT_PointHeight specifies the requested point height of a typeface,
*    specifically, the height and nominal width of the em-square.
*    The point referred to here is 1/72".  It is encoded as a fixed
*    binary number.
OT_PointHeight	EQU	(OT_Level0!$08)

*! OT_SetFactor specifies the requested set width of a typeface.
*    It distorts the width of the em-square from that specified by
*    OT_PointHeight.  To compensate for a device with different
*    horizontal and vertical resolutions, OT_DeviceDPI should be used
*    instead.  For a normal aspect ratio, set to 1.0 (encoded as
*    0x00010000).  This is the default value.
OT_SetFactor	EQU	(OT_Level0!$09)

*! OT_Shear... specifies the Sine and Cosine of the vertical stroke
*    angle, as two fixed point binary fractions.  Both must be specified:
*    first the Sine and then the Cosine.  Setting the sine component
*    changes the Shear to an undefined value, setting the cosine
*    component completes the Shear change to the new composite value.
*    For no shear, set to 0.0, 1.0 (encoded as 0x00000000, 0x00010000).
*    This is the default value.
OT_ShearSin	EQU	(OT_Level0!$0a)
OT_ShearCos	EQU	(OT_Level0!$0b)

*! OT_Rotate... specifies the Sine and Cosine of the baselin rotation
*    angle, as two fixed point binary fractions.  Both must be specified:
*    first the Sine and then the Cosine.  Setting the sine component
*    changes the Shear to an undefined value, setting the cosine
*    component completes the Shear change to the new composite value.
*    For no shear, set to 0.0, 1.0 (encoded as 0x00000000, 0x00010000).
*    This is the default value.
OT_RotateSin	EQU	(OT_Level0!$0c)
OT_RotateCos	EQU	(OT_Level0!$0d)

*! OT_Embolden... specifies values to algorithimically embolden -- or,
*    when negative, lighten -- the glyph.  It is encoded as a fixed point
*    binary fraction of the em-square.  The X and Y components can be
*    changed indendently.  For normal characters, set to 0.0, 0.0
*    (encoded as 0x00000000, 0x00000000).  This is the default value.
OT_EmboldenX	EQU	(OT_Level0!$0e)
OT_EmboldenY	EQU	(OT_Level0!$0f)

*! OT_PointSize is an old method of specifying the point size,
*    encoded as (points * 16).
OT_PointSize	EQU	(OT_Level0!$10)

*! OT_GlyphCode specifies the glyph (character) code to use with
*    subsequent operations.  For example, this is the code for an
*    OT_Glyph inquiry
OT_GlyphCode	EQU	(OT_Level0!$11)

*! OT_GlyphCode2 specifies the second glyph code.  For example,
*    this is the right glyph of the two glyphs of an OT_KernPair
*    inquiry
OT_GlyphCode2	EQU	(OT_Level0!$12)

*! OT_GlyphWidth specifies a specific width for a glyph.
*    It sets a specific escapement (advance) width for subsequent
*    glyphs.  It is encoded as a fixed binary fraction of the em-square.
*    To revert to using the font-defined escapement for each glyph, set
*    to 0.0 (encoded as 0x00000000).  This is the default value.
OT_GlyphWidth	EQU	(OT_Level0!$13)

*! OT_OTagPath and
*! OT_OTagList specify the selected typeface.  Both must be specified:
*    first the Path and then the List.  Setting the path name changes
*    changes the typeface to an undefined value, providing the List
*    completes the typeface selection to the new typeface.  OTagPath
*    is the null terminated full file path of the .otag file associated
*    with the typeface.  OTagList is a memory copy of the processed
*    contents of that .otag file (i.e. with indirections resolved).
*    There are no default values for the typeface.
OT_OTagPath	EQU	(OT_Level0!OT_Indirect!$14)
OT_OTagList	EQU	(OT_Level0!OT_Indirect!$15)

*  ? OT_GlyphMap supplies a read-only struct GlyphMap pointer that
*    describes a bitmap for a glyph with the current attributes.
OT_GlyphMap	EQU	(OT_Level0!OT_Indirect!$20)

*  ? OT_WidthList supplies a read-only struct MinList of struct
*    GlyphWidthEntry nodes for glyphs that are defined from GlyphCode
*    to GlyphCode2, inclusive.  The widths are represented as fixed
*    binary fractions of the em-square, ignoring any effect of
*    SetFactor or GlyphWidth.  A width would need to be converted to
*    a distance along the baseline in device units by the
*    application.
OT_WidthList	EQU	(OT_Level0!OT_Indirect!$21)

*  ? OT_...KernPair supplies the kern adjustment to be added to the
*    current position after placement of the GlyphCode glyph and
*    before placement of the GlyphCode2 glyph.  Text kern pairs are
*    for rendering body text.  Display kern pairs are generally
*    tighter values for display (e.g. headline) purposes.  The
*    adjustment is represented as a fixed binary fraction of the
*    em-square, ignoring any effect of SetFactor.  This number would
*    need to be converted to a distance along the baseline in device
*    units by the application.
OT_TextKernPair		EQU	(OT_Level0!OT_Indirect!$22)
OT_DesignKernPair	EQU	(OT_Level0!OT_Indirect!$23)

*  ? OT_Underlined is an unsigned word which is used to request
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
*    non-underlined font that it can.
OT_UnderLined		EQU	(OT_Level0!$24)

OTUL_None		EQU	0
OTUL_Solid		EQU	1
OTUL_Broken		EQU	2
OTUL_DoubleSolid	EQU	3
OUTL_DoubleBroken	EQU	4

*  ? OT_StrikeThrough is a boolean which is used to request
*    algorithimic strike through when rendering the glyph.
*    Bullet.library currently does not support this tag, though it
*    may be used by other engines in the future.  The default for
*    any engined which supports this tag must be FALSE.  Engines which
*    do not support this tag should return an appropriate OTERR value.
OT_StrikeThrough	EQU	(OT_Level0!$25)



********************************************************************
* .otag tags

* suffix for files in FONTS: that contain these tags
OTSUFFIX	MACRO	; ".otag" text
		dc.b	'.otag',0
		ds.w	0
		ENDM

* OT_FileIdent both identifies this file and verifies its size.
* It is required to be the first tag in the file.
OT_FileIdent	EQU	(OT_Level1!$01)

* OT_Engine specifies the font engine this file is designed to use
OT_Engine	EQU	(OT_Level1!OT_Indirect!$02)

OTE_Bullet	MACRO	; "bullet" text
		dc.b	'bullet',0
		ds.w	0
		ENDM

* OT_Family is the family name of this typeface
OT_Family	EQU	(OT_Level1!OT_Indirect!$03)

* The name of this typeface is implicit in the name of the .otag file
* OT_BName is used to find the bold variant of this typeface
OT_BName	EQU	(OT_Level2!OT_Indirect!$05)
* OT_IName is used to find the italic variant of this typeface
OT_IName	EQU	(OT_Level2!OT_Indirect!$06)
* OT_BIName is used to find the bold italic variant of this typeface
OT_BIName	EQU	(OT_Level2!OT_Indirect!$07)

* OT_SymSet is used to select the symbol set that has the OT_YSizeFactor
* described here.  Other symbol sets might have different extremes
OT_SymbolSet	EQU	(OT_Level1!$10)

* OT_YSizeFactor is a ratio to assist in calculating the Point height
* to BlackHeight relationship -- high word: Point height term, low
* word: Black height term -- pointSize = ysize*<high>/<low>
OT_YSizeFactor	EQU	(OT_Level1!$11)

* OT_SpaceWidth specifies the width of the space character relative
* to the character height
OT_SpaceWidth	EQU	(OT_Level2!$12)

* OT_IsFixed is a boolean indicating that all the characters in the
* typeface are intended to have the same character advance
OT_IsFixed	EQU	(OT_Level2!$13)

* OT_SerifFlag is a boolean indicating if the character has serifs
OT_SerifFlag	EQU	(OT_Level1!$14)

* OT_StemWeight is an unsigned byte indicating the weight of the character
OT_StemWeight	EQU	(OT_Level1!$15)

OTS_UltraThin	EQU	 8	;   0- 15
OTS_ExtraThin	EQU	 24	;  16- 31
OTS_Thin	EQU	 40	;  32- 47
OTS_ExtraLight	EQU	 56	;  48- 63
OTS_Light	EQU	 72	;  64- 79
OTS_DemiLight	EQU	 88	;  80- 95
OTS_SemiLight	EQU	104	;  96-111
OTS_Book	EQU	120	; 112-127
OTS_Medium	EQU	136	; 128-143
OTS_SemiBold	EQU	152	; 144-159
OTS_DemiBold	EQU	168	; 160-175
OTS_Bold	EQU	184	; 176-191
OTS_ExtraBold	EQU	200	; 192-207
OTS_Black	EQU	216	; 208-223
OTS_ExtraBlack	EQU	232	; 224-239
OTS_UltraBlack	EQU	248	; 240-255

* OT_SlantStyle is an unsigned byte indicating the font posture
OT_SlantStyle	EQU	(OT_Level1!$16)
OTS_Upright	EQU	0
OTS_Italic	EQU	1	; Oblique, Slanted, etc.
OTS_LeftItalic	EQU	2	; Reverse Slant

* OT_HorizStyle is an unsigned byte indicating the appearance width
OT_HorizStyle		EQU	(OT_Level1!$17)
OTH_UltraCompressed	EQU	 16	;   0- 31
OTH_ExtraCompressed	EQU	 48	;  32- 63
OTH_Compressed		EQU	 80	;  64- 95
OTH_Condensed		EQU	112	;  96-127
OTH_Normal		EQU	144	; 128-159
OTH_SemiExpanded	EQU	176	; 160-191
OTH_Expanded		EQU	208	; 192-223
OTH_ExtraExpanded	EQU	240	; 224-255

* OT_SpaceFactor specifies the width of the space character relative
* to the character height
OT_SpaceFactor		EQU	(OT_Level2!$18)

* OT_InhibitAlgoStyle indicates which ta_Style bits, if any, should
* be ignored even if the font does not already have that quality.
* For example, if FSF_BOLD is set and the typeface is not bold but
* the user specifies bold, the application or diskfont library is
* not to use OT_Embolden to achieve a bold result.
OT_InhibitAlgoStyle 	EQU	(OT_Level2!$19)

* OT_AvailSizes is an indirect pointer to sorted UWORDs, 0th is count
OT_AvailSizes		EQU	(OT_Level1!OT_Indirect!$20)

OT_MAXAVAILSIZES	EQU	20	; no more than 20 sizes allowed

* OT_SpecCount is the count number of parameters specified here
OT_SpecCount		EQU	(OT_Level1!$100)

* Specs can be created as appropriate for the engine by ORing in the
* parameter number (1 is first, 2 is second, ... up to 15th)
OT_Spec			EQU	(OT_Level1!$100)
* OT_Spec1 is the (first) parameter to the font engine to select
* this particular typeface
OT_Spec1		EQU	(OT_Level1!$101)


	ENDC	; DISKFONT_DISKFONTTAG_I
