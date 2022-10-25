	IFND	DISKFONT_OTERRORS_I
DISKFONT_OTERRORS_I	SET	1

**	$VER: oterrors.i 38.0 (19.6.1992)
**	Includes Release 45.1
**
**	oterrors.i -- tag definitions for .otag files
**
**	Copyright 1992-2001 Amiga, Inc.
**	    All Rights Reserved

* PRELIMINARY
OTERR_Failure		EQU	-1	; catch-all for error
OTERR_Success		EQU	0	; no error
OTERR_BadTag		EQU	1	; inappropriate tag for function
OTERR_UnknownTag	EQU	2	; unknown tag for function
OTERR_BadData		EQU	3	; catch-all for bad tag data
OTERR_NoMemory		EQU	4	; insufficient memory for operation
OTERR_NoFace		EQU	5	; no typeface currently specified
OTERR_BadFace		EQU	6	; typeface specification problem
OTERR_NoGlyph		EQU	7	; no glyph specified
OTERR_BadGlyph		EQU	8	; bad glyph code or glyph range
OTERR_NoShear		EQU	9	; shear only partially specified
OTERR_NoRotate		EQU	10	; rotate only partially specified
OTERR_TooSmall		EQU	11	; typeface metrics yield tiny glyphs
OTERR_UnknownGlyph	EQU	12	; glyph not known by engine

	ENDC	; DISKFONT_OTERRORS_I
