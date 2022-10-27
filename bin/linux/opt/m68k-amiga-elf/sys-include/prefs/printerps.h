#ifndef PREFS_PRINTERPS_H
#define PREFS_PRINTERPS_H
/*
**	$VER: printerps.h 38.6 (6.5.1993)
**	Includes Release 45.1
**
**	File format for PostScript printer preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif


/*****************************************************************************/


#define ID_PSPD MAKE_ID('P','S','P','D')


struct PrinterPSPrefs
{
    LONG  ps_Reserved[4];		/* System reserved */

    /* Global printing attributes */
    UBYTE ps_DriverMode;
    UBYTE ps_PaperFormat;
    UBYTE ps_Reserved1[2];
    LONG  ps_Copies;
    LONG  ps_PaperWidth;
    LONG  ps_PaperHeight;
    LONG  ps_HorizontalDPI;
    LONG  ps_VerticalDPI;

    /* Text Options */
    UBYTE ps_Font;
    UBYTE ps_Pitch;
    UBYTE ps_Orientation;
    UBYTE ps_Tab;
    UBYTE ps_Reserved2[8];

    /* Text Dimensions */
    LONG  ps_LeftMargin;
    LONG  ps_RightMargin;
    LONG  ps_TopMargin;
    LONG  ps_BottomMargin;
    LONG  ps_FontPointSize;
    LONG  ps_Leading;
    UBYTE ps_Reserved3[8];

    /* Graphics Options */
    LONG  ps_LeftEdge;
    LONG  ps_TopEdge;
    LONG  ps_Width;
    LONG  ps_Height;
    UBYTE ps_Image;
    UBYTE ps_Shading;
    UBYTE ps_Dithering;
    UBYTE ps_Reserved4[9];

    /* Graphics Scaling */
    UBYTE ps_Aspect;
    UBYTE ps_ScalingType;
    UBYTE ps_Reserved5;
    UBYTE ps_Centering;
    UBYTE ps_Reserved6[8];
};

/* All measurements are in Millipoints which is 1/1000 of a point, or
 * in other words 1/72000 of an inch
 */

/* constants for PrinterPSPrefs.ps_DriverMode */
#define DM_POSTSCRIPT  0
#define DM_PASSTHROUGH 1

/* constants for PrinterPSPrefs.ps_PaperFormat */
#define PF_USLETTER 0
#define PF_USLEGAL  1
#define PF_A4	    2
#define PF_CUSTOM   3

/* constants for PrinterPSPrefs.ps_Font */
#define FONT_COURIER	  0
#define FONT_TIMES	  1
#define FONT_HELVETICA	  2
#define FONT_HELV_NARROW  3
#define FONT_AVANTGARDE   4
#define FONT_BOOKMAN	  5
#define FONT_NEWCENT	  6
#define FONT_PALATINO	  7
#define FONT_ZAPFCHANCERY 8

/* constants for PrinterPSPrefs.ps_Pitch */
#define PITCH_NORMAL	 0
#define PITCH_COMPRESSED 1
#define PITCH_EXPANDED	 2

/* constants for PrinterPSPrefs.ps_Orientation */
#define ORIENT_PORTRAIT  0
#define ORIENT_LANDSCAPE 1

/* constants for PrinterPSPrefs.ps_Tab */
#define TAB_4	  0
#define TAB_8	  1
#define TAB_QUART 2
#define TAB_HALF  3
#define TAB_INCH  4

/* constants for PrinterPSPrefs.ps_Image */
#define IM_POSITIVE 0
#define IM_NEGATIVE 1

/* constants for PrinterPSPrefs.ps_Shading */
#define SHAD_BW        0
#define SHAD_GREYSCALE 1
#define SHAD_COLOR     2

/* constants for PrinterPSPrefs.ps_Dithering */
#define DITH_DEFAULT 0
#define DITH_DOTTY   1
#define DITH_VERT    2
#define DITH_HORIZ   3
#define DITH_DIAG    4

/* constants for PrinterPSPrefs.ps_Aspect */
#define ASP_HORIZ 0
#define ASP_VERT  1

/* constants for PrinterPSPrefs.ps_ScalingType */
#define ST_ASPECT_ASIS	  0
#define ST_ASPECT_WIDE	  1
#define ST_ASPECT_TALL	  2
#define ST_ASPECT_BOTH	  3
#define ST_FITS_WIDE	  4
#define ST_FITS_TALL	  5
#define ST_FITS_BOTH	  6

/* constants for PrinterPSPrefs.ps_Centering */
#define CENT_NONE  0
#define CENT_HORIZ 1
#define CENT_VERT  2
#define CENT_BOTH  3


/*****************************************************************************/


#endif /* PREFS_PRINTERPS_H */
