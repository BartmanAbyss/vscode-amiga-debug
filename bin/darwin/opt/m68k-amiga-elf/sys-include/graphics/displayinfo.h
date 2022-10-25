#ifndef	GRAPHICS_DISPLAYINFO_H
#define	GRAPHICS_DISPLAYINFO_H
/*
**	$VER: displayinfo.h 39.13 (31.5.1993)
**	Includes Release 45.1
**
**	include define file for displayinfo database
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif /* EXEC_TYPES_H */

#ifndef GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif /* GRAPHICS_GFX_H */

#ifndef GRAPHICS_MONITOR_H
#include <graphics/monitor.h>
#endif /* GRAPHICS_MONITOR_H */

#ifndef GRAPHICS_MODEID_H
#include <graphics/modeid.h>
#endif /* GRAPHICS_MODEID_H */

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif /* UTILITY_TAGITEM_H */

/* the "public" handle to a DisplayInfoRecord */

typedef APTR DisplayInfoHandle;

/* datachunk type identifiers */

#define DTAG_DISP		0x80000000
#define DTAG_DIMS		0x80001000
#define DTAG_MNTR		0x80002000
#define DTAG_NAME		0x80003000
#define DTAG_VEC		0x80004000	/* internal use only */

struct QueryHeader
{
	ULONG	StructID;	/* datachunk type identifier */
	ULONG	DisplayID;	/* copy of display record key	*/
	ULONG	SkipID;		/* TAG_SKIP -- see tagitems.h */
	ULONG	Length;		/* length of local data in double-longwords */
};

struct DisplayInfo
{
	struct	QueryHeader Header;
	UWORD	NotAvailable;	/* if NULL available, else see defines */
	ULONG	PropertyFlags;	/* Properties of this mode see defines */
	Point	Resolution;	/* ticks-per-pixel X/Y		       */
	UWORD	PixelSpeed;	/* aproximation in nanoseconds	       */
	UWORD	NumStdSprites;	/* number of standard amiga sprites    */
	UWORD	PaletteRange;	/* OBSOLETE - use Red/Green/Blue bits instead */
	Point	SpriteResolution; /* std sprite ticks-per-pixel X/Y    */
	UBYTE	pad[4];		/* used internally */
	UBYTE	RedBits;	/* number of Red bits this display supports (V39) */
	UBYTE	GreenBits;	/* number of Green bits this display supports (V39) */
	UBYTE	BlueBits;	/* number of Blue bits this display supports (V39) */
	UBYTE	pad2[5];	/* find some use for this. */
	ULONG	reserved[2];	/* terminator */
};

/* availability */

#define DI_AVAIL_NOCHIPS	0x0001
#define DI_AVAIL_NOMONITOR	0x0002
#define DI_AVAIL_NOTWITHGENLOCK	0x0004

/* mode properties */

#define DIPF_IS_LACE		0x00000001
#define DIPF_IS_DUALPF		0x00000002
#define DIPF_IS_PF2PRI		0x00000004
#define DIPF_IS_HAM		0x00000008

#define DIPF_IS_ECS		0x00000010	/* note: ECS modes (SHIRES, VGA, and **
											** PRODUCTIVITY) do not support      **
											** attached sprites.		     **
											*/
#define DIPF_IS_AA		0x00010000	/* AA modes - may only be available
						** if machine has correct memory
						** type to support required
						** bandwidth - check availability.
						** (V39)
						*/
#define DIPF_IS_PAL		0x00000020
#define DIPF_IS_SPRITES		0x00000040
#define DIPF_IS_GENLOCK		0x00000080

#define DIPF_IS_WB		0x00000100
#define DIPF_IS_DRAGGABLE	0x00000200
#define DIPF_IS_PANELLED	0x00000400
#define DIPF_IS_BEAMSYNC	0x00000800

#define DIPF_IS_EXTRAHALFBRITE	0x00001000

/* The following DIPF_IS_... flags are new for V39 */
#define DIPF_IS_SPRITES_ATT		0x00002000	/* supports attached sprites */
#define DIPF_IS_SPRITES_CHNG_RES	0x00004000	/* supports variable sprite resolution */
#define DIPF_IS_SPRITES_BORDER		0x00008000	/* sprite can be displayed in the border */
#define DIPF_IS_SCANDBL			0x00020000	/* scan doubled */
#define DIPF_IS_SPRITES_CHNG_BASE	0x00040000
											/* can change the sprite base colour */
#define DIPF_IS_SPRITES_CHNG_PRI	0x00080000
											/* can change the sprite priority
											** with respect to the playfield(s).
											*/
#define DIPF_IS_DBUFFER		0x00100000	/* can support double buffering */
#define DIPF_IS_PROGBEAM	0x00200000	/* is a programmed beam-sync mode */
#define DIPF_IS_FOREIGN		0x80000000	/* this mode is not native to the Amiga */


struct DimensionInfo
{
	struct	QueryHeader Header;
	UWORD	MaxDepth;	      /* log2( max number of colors ) */
	UWORD	MinRasterWidth;       /* minimum width in pixels      */
	UWORD	MinRasterHeight;      /* minimum height in pixels     */
	UWORD	MaxRasterWidth;       /* maximum width in pixels      */
	UWORD	MaxRasterHeight;      /* maximum height in pixels     */
	struct	Rectangle   Nominal;  /* "standard" dimensions	      */
	struct	Rectangle   MaxOScan; /* fixed, hardware dependent    */
	struct	Rectangle VideoOScan; /* fixed, hardware dependent    */
	struct	Rectangle   TxtOScan; /* editable via preferences     */
	struct	Rectangle   StdOScan; /* editable via preferences     */
	UBYTE	pad[14];
	ULONG	reserved[2];	      /* terminator */
};

struct MonitorInfo
{
	struct	QueryHeader Header;
	struct	MonitorSpec  *Mspc;   /* pointer to monitor specification  */
	Point	ViewPosition;	      /* editable via preferences	   */
	Point	ViewResolution;       /* standard monitor ticks-per-pixel  */
	struct	Rectangle ViewPositionRange;  /* fixed, hardware dependent */
	UWORD	TotalRows;	      /* display height in scanlines	   */
	UWORD	TotalColorClocks;     /* scanline width in 280 ns units    */
	UWORD	MinRow;	      /* absolute minimum active scanline  */
	WORD	Compatibility;	      /* how this coexists with others	   */
	UBYTE	pad[32];
	Point	MouseTicks;
	Point	DefaultViewPosition;  /* original, never changes */
	ULONG	PreferredModeID;      /* for Preferences */
	ULONG	reserved[2];	      /* terminator */
};

/* monitor compatibility */

#define MCOMPAT_MIXED	0	/* can share display with other MCOMPAT_MIXED */
#define MCOMPAT_SELF	1	/* can share only within same monitor */
#define MCOMPAT_NOBODY -1	/* only one viewport at a time */

#define DISPLAYNAMELEN 32

struct NameInfo
{
	struct	QueryHeader Header;
	UBYTE	Name[DISPLAYNAMELEN];
	ULONG	reserved[2];	      /* terminator */
};

/******************************************************************************/

/* The following VecInfo structure is PRIVATE, for our use only
 * Touch these, and burn! (V39)
 */

struct VecInfo
{
	struct	QueryHeader   Header;
	APTR	Vec;
	APTR	Data;
	UWORD	Type;
	UWORD	pad[3];
	ULONG	reserved[2];
};

#endif	/* GRAPHICS_DISPLAYINFO_H */
