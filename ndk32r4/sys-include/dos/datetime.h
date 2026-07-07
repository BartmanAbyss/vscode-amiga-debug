#ifndef DOS_DATETIME_H
#define DOS_DATETIME_H

/*
**	$VER: datetime.h 47.27 (2.12.2021)
**
**	Date and time conversion for AmigaDOS
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

/* Data structures and constants used by the AmigaDOS functions
 * StrtoDate() and DatetoStr(), first available in dos.library
 * V36 (V1.4)
 */

/* String/Date & Time conversion */
struct DateTime
{
	struct DateStamp	dat_Stamp;	/* DOS DateStamp */
	UBYTE			dat_Format;	/* controls appearance of dat_StrDate */
	UBYTE			dat_Flags;	/* see flags below */
	STRPTR			dat_StrDay;	/* day of the week string (see LEN_DATSTRING below) */
	STRPTR			dat_StrDate;	/* date string (see LEN_DATSTRING below) */
	STRPTR			dat_StrTime;	/* time string (see LEN_DATSTRING below) */
};

/* The DateTime.dat_StrDay/dat_StrDate/dat_StrTime members must
 * point to string buffers at least as large as this:
 */
#define	LEN_DATSTRING	16


/* Flags for dat_Flags */
#define DTB_SUBST	0	/* substitute Today, Tomorrow, etc. */
#define DTB_FUTURE	1	/* day of the week is in future */

#define DTF_SUBST	(1<<DTB_SUBST)
#define DTF_FUTURE	(1<<DTB_FUTURE)


/* Date format values */
#define FORMAT_DOS	0		/* dd-mmm-yy */
#define FORMAT_INT	1		/* yy-mm-dd */
#define FORMAT_USA	2		/* mm-dd-yy */
#define FORMAT_CDN	3		/* dd-mm-yy */
#define FORMAT_DEF	4		/* default format for locale */

/* NOTE: dos.library supports only four built-in formats for
 *       date and time conversion (FORMAT_DOS, FORMAT_INT, FORMAT_USA
 *       and FORMAT_CDN). This is why FORMAT_MAX is set to FORMAT_CDN.
 *       The use of FORMAT_DEF requires locale.library to be active,
 *       otherwise dos.library will fall back onto using FORMAT_DOS
 *       instead.
 */
#define FORMAT_MAX FORMAT_CDN

#endif /* DOS_DATETIME_H */
