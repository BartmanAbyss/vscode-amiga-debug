#ifndef  DISKFONT_OTERRORS_H
#define  DISKFONT_OTERRORS_H
/*
**	$VER: oterrors.h 8.1 (19.6.1992)
**	Includes Release 45.1
**
**	oterrors.h -- error results from outline libraries
**
**	(C) Copyright 1991-1992 Robert R. Burns
**	    All Rights Reserved
*/

/* PRELIMINARY */
#define  OTERR_Failure		-1	/* catch-all for error */
#define  OTERR_Success		0	/* no error */
#define  OTERR_BadTag		1	/* inappropriate tag for function */
#define  OTERR_UnknownTag	2	/* unknown tag for function */
#define  OTERR_BadData		3	/* catch-all for bad tag data */
#define  OTERR_NoMemory		4	/* insufficient memory for operation */
#define  OTERR_NoFace		5	/* no typeface currently specified */
#define  OTERR_BadFace		6	/* typeface specification problem */
#define  OTERR_NoGlyph		7	/* no glyph specified */
#define  OTERR_BadGlyph		8	/* bad glyph code or glyph range */
#define  OTERR_NoShear		9	/* shear only partially specified */
#define  OTERR_NoRotate		10	/* rotate only partially specified */
#define  OTERR_TooSmall		11	/* typeface metrics yield tiny glyphs */
#define  OTERR_UnknownGlyph	12	/* glyph not known by engine */

#endif	 /* DISKFONT_OTERRORS_H */
