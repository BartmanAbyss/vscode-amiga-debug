#ifndef INTUITION_PREFERENCES_H
#define INTUITION_PREFERENCES_H TRUE
/*
**  $VER: preferences.h 38.2 (16.9.1992)
**  Includes Release 45.1
**
**  Structure definition for old-style preferences
**
**  (C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef DEVICES_TIMER_H
#include <devices/timer.h>
#endif

/* ======================================================================== */
/* === Preferences ======================================================== */
/* ======================================================================== */

/* these are the definitions for the printer configurations */
#define	FILENAME_SIZE	30	/* Filename size */
#define DEVNAME_SIZE	16	/* Device-name size */

#define	POINTERSIZE (1 + 16 + 1) * 2	/* Size of Pointer data buffer */

/* These defines are for the default font size.  These actually describe the
 * height of the defaults fonts.  The default font type is the topaz
 * font, which is a fixed width font that can be used in either
 * eighty-column or sixty-column mode.	The Preferences structure reflects
 * which is currently selected by the value found in the variable FontSize,
 * which may have either of the values defined below.  These values actually
 * are used to select the height of the default font.  By changing the
 * height, the resolution of the font changes as well.
 */
#define TOPAZ_EIGHTY 8
#define TOPAZ_SIXTY 9

/* Note:  Starting with V36, and continuing with each new version of
 * Intuition, an increasing number of fields of struct Preferences
 * are ignored by SetPrefs().  (Some fields are obeyed only at the
 * initial SetPrefs(), which comes from the devs:system-configuration
 * file).  Elements are generally superseded as new hardware or software
 * features demand more information than fits in struct Preferences.
 * Parts of struct Preferences must be ignored so that applications
 * calling GetPrefs(), modifying some other part of struct Preferences,
 * then calling SetPrefs(), don't end up truncating the extended
 * data.
 *
 * Consult the autodocs for SetPrefs() for further information as
 * to which fields are not always respected.
 */

struct Preferences
{
    /* the default font height */
    BYTE FontHeight;			/* height for system default font  */

    /* constant describing what's hooked up to the port */
    UBYTE PrinterPort;			/* printer port connection	   */

    /* the baud rate of the port */
    UWORD BaudRate;			/* baud rate for the serial port   */

    /* various timing rates */
    struct timeval KeyRptSpeed;		/* repeat speed for keyboard	   */
    struct timeval KeyRptDelay;		/* Delay before keys repeat	   */
    struct timeval DoubleClick;		/* Interval allowed between clicks */

    /* Intuition Pointer data */
    UWORD PointerMatrix[POINTERSIZE];	/* Definition of pointer sprite    */
    BYTE XOffset;			/* X-Offset for active 'bit'	   */
    BYTE YOffset;			/* Y-Offset for active 'bit'	   */
    UWORD color17;			/***********************************/
    UWORD color18;			/* Colours for sprite pointer	   */
    UWORD color19;			/***********************************/
    UWORD PointerTicks;			/* Sensitivity of the pointer	   */

    /* Workbench Screen colors */
    UWORD color0;			/***********************************/
    UWORD color1;			/*  Standard default colours	   */
    UWORD color2;			/*   Used in the Workbench	   */
    UWORD color3;			/***********************************/

    /* positioning data for the Intuition View */
    BYTE ViewXOffset;			/* Offset for top lefthand corner  */
    BYTE ViewYOffset;			/* X and Y dimensions		   */
    WORD ViewInitX, ViewInitY;		/* View initial offset values	   */

    BOOL EnableCLI;			/* CLI availability switch */

    /* printer configurations */
    UWORD PrinterType;			/* printer type		   */
    UBYTE PrinterFilename[FILENAME_SIZE];/* file for printer	   */

    /* print format and quality configurations */
    UWORD PrintPitch;			/* print pitch			   */
    UWORD PrintQuality;			/* print quality		   */
    UWORD PrintSpacing;			/* number of lines per inch	   */
    UWORD PrintLeftMargin;		/* left margin in characters	   */
    UWORD PrintRightMargin;		/* right margin in characters	   */
    UWORD PrintImage;			/* positive or negative		   */
    UWORD PrintAspect;			/* horizontal or vertical	   */
    UWORD PrintShade;			/* b&w, half-tone, or color	   */
    WORD PrintThreshold;		/* darkness ctrl for b/w dumps	   */

    /* print paper descriptors */
    UWORD PaperSize;			/* paper size			   */
    UWORD PaperLength;			/* paper length in number of lines */
    UWORD PaperType;			/* continuous or single sheet	   */

    /* Serial device settings: These are six nibble-fields in three bytes */
    /* (these look a little strange so the defaults will map out to zero) */
    UBYTE   SerRWBits;	 /* upper nibble = (8-number of read bits)	*/
			 /* lower nibble = (8-number of write bits)	*/
    UBYTE   SerStopBuf;  /* upper nibble = (number of stop bits - 1)	*/
			 /* lower nibble = (table value for BufSize)	*/
    UBYTE   SerParShk;	 /* upper nibble = (value for Parity setting)	*/
			 /* lower nibble = (value for Handshake mode)	*/
    UBYTE   LaceWB;	 /* if workbench is to be interlaced		*/

    UBYTE   Pad[ 12 ];
    UBYTE   PrtDevName[DEVNAME_SIZE];	/* device used by printer.device
					 * (omit the ".device")
					 */
    UBYTE   DefaultPrtUnit;	/* default unit opened by printer.device */
    UBYTE   DefaultSerUnit;	/* default serial unit */

    BYTE    RowSizeChange;	/* affect NormalDisplayRows/Columns	*/
    BYTE    ColumnSizeChange;

    UWORD    PrintFlags;	/* user preference flags */
    UWORD    PrintMaxWidth;	/* max width of printed picture in 10ths/in */
    UWORD    PrintMaxHeight;	/* max height of printed picture in 10ths/in */
    UBYTE    PrintDensity;	/* print density */
    UBYTE    PrintXOffset;	/* offset of printed picture in 10ths/inch */

    UWORD    wb_Width;		/* override default workbench width  */
    UWORD    wb_Height;		/* override default workbench height */
    UBYTE    wb_Depth;		/* override default workbench depth  */

    UBYTE    ext_size;		/* extension information -- do not touch! */
			    /* extension size in blocks of 64 bytes */
};


/* Workbench Interlace (use one bit) */
#define LACEWB			(1<< 0)
#define LW_RESERVED	1		/* internal use only */

/* Enable_CLI	*/
#define SCREEN_DRAG	(1<<14)
#define MOUSE_ACCEL	(1L<<15)

/* PrinterPort */
#define PARALLEL_PRINTER 0x00
#define SERIAL_PRINTER	0x01

/* BaudRate */
#define BAUD_110	0x00
#define BAUD_300	0x01
#define BAUD_1200	0x02
#define BAUD_2400	0x03
#define BAUD_4800	0x04
#define BAUD_9600	0x05
#define BAUD_19200	0x06
#define BAUD_MIDI	0x07

/* PaperType */
#define FANFOLD	0x00
#define SINGLE		0x80

/* PrintPitch */
#define PICA		0x000
#define ELITE		0x400
#define FINE		0x800

/* PrintQuality */
#define DRAFT		0x000
#define LETTER		0x100

/* PrintSpacing */
#define SIX_LPI		0x000
#define EIGHT_LPI	0x200

/* Print Image */
#define IMAGE_POSITIVE	0x00
#define IMAGE_NEGATIVE	0x01

/* PrintAspect */
#define ASPECT_HORIZ	0x00
#define ASPECT_VERT	0x01

/* PrintShade */
#define SHADE_BW	0x00
#define SHADE_GREYSCALE	0x01
#define SHADE_COLOR	0x02

/* PaperSize (all paper sizes have a zero in the lowest nybble) */
#define US_LETTER	0x00
#define US_LEGAL	0x10
#define N_TRACTOR	0x20
#define W_TRACTOR	0x30
#define CUSTOM		0x40

/* New PaperSizes for V36: */
#define EURO_A0	0x50		/* European size A0: 841 x 1189 */
#define EURO_A1	0x60		/* European size A1: 594 x 841 */
#define EURO_A2	0x70		/* European size A2: 420 x 594 */
#define EURO_A3	0x80		/* European size A3: 297 x 420 */
#define EURO_A4	0x90		/* European size A4: 210 x 297 */
#define EURO_A5	0xA0		/* European size A5: 148 x 210 */
#define EURO_A6	0xB0		/* European size A6: 105 x 148 */
#define EURO_A7	0xC0		/* European size A7: 74 x 105 */
#define EURO_A8	0xD0		/* European size A8: 52 x 74 */


/* PrinterType */
#define CUSTOM_NAME		0x00
#define	ALPHA_P_101		0x01
#define BROTHER_15XL		0x02
#define CBM_MPS1000		0x03
#define DIAB_630		0x04
#define DIAB_ADV_D25		0x05
#define DIAB_C_150		0x06
#define EPSON			0x07
#define EPSON_JX_80		0x08
#define OKIMATE_20		0x09
#define QUME_LP_20		0x0A
/* new printer entries, 3 October 1985 */
#define HP_LASERJET		0x0B
#define HP_LASERJET_PLUS	0x0C

/* Serial Input Buffer Sizes */
#define SBUF_512	0x00
#define SBUF_1024	0x01
#define SBUF_2048	0x02
#define SBUF_4096	0x03
#define SBUF_8000	0x04
#define SBUF_16000	0x05

/* Serial Bit Masks */
#define	SREAD_BITS	0xF0 /* for SerRWBits	*/
#define	SWRITE_BITS	0x0F

#define	SSTOP_BITS	0xF0 /* for SerStopBuf	*/
#define	SBUFSIZE_BITS	0x0F

#define	SPARITY_BITS	0xF0 /* for SerParShk	*/
#define SHSHAKE_BITS	0x0F

/* Serial Parity (upper nibble, after being shifted by
 * macro SPARNUM() )
 */
#define SPARITY_NONE	 0
#define SPARITY_EVEN	 1
#define SPARITY_ODD	 2
/* New parity definitions for V36: */
#define SPARITY_MARK	 3
#define SPARITY_SPACE	 4

/* Serial Handshake Mode (lower nibble, after masking using
 * macro SHANKNUM() )
 */
#define SHSHAKE_XON	 0
#define SHSHAKE_RTS	 1
#define SHSHAKE_NONE	 2

/* new defines for PrintFlags */

#define CORRECT_RED	    0x0001  /* color correct red shades */
#define CORRECT_GREEN	    0x0002  /* color correct green shades */
#define CORRECT_BLUE	    0x0004  /* color correct blue shades */

#define CENTER_IMAGE	    0x0008  /* center image on paper */

#define IGNORE_DIMENSIONS   0x0000 /* ignore max width/height settings */
#define BOUNDED_DIMENSIONS  0x0010  /* use max width/height as boundaries */
#define ABSOLUTE_DIMENSIONS 0x0020  /* use max width/height as absolutes */
#define PIXEL_DIMENSIONS    0x0040  /* use max width/height as prt pixels */
#define MULTIPLY_DIMENSIONS 0x0080 /* use max width/height as multipliers */

#define INTEGER_SCALING     0x0100  /* force integer scaling */

#define ORDERED_DITHERING   0x0000 /* ordered dithering */
#define HALFTONE_DITHERING  0x0200  /* halftone dithering */
#define FLOYD_DITHERING     0x0400 /* Floyd-Steinberg dithering */

#define ANTI_ALIAS	    0x0800 /* anti-alias image */
#define GREY_SCALE2	    0x1000 /* for use with hi-res monitor */

/* masks used for checking bits */

#define CORRECT_RGB_MASK    (CORRECT_RED|CORRECT_GREEN|CORRECT_BLUE)
#define DIMENSIONS_MASK     (BOUNDED_DIMENSIONS|ABSOLUTE_DIMENSIONS|PIXEL_DIMENSIONS|MULTIPLY_DIMENSIONS)
#define DITHERING_MASK	    (HALFTONE_DITHERING|FLOYD_DITHERING)

#endif
