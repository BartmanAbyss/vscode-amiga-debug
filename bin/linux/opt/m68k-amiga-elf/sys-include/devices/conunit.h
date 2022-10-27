#ifndef DEVICES_CONUNIT_H
#define DEVICES_CONUNIT_H
/*
**	$VER: conunit.h 36.15 (20.11.1990)
**	Includes Release 45.1
**
**	Console device unit definitions
**
**	(C) Copyright 1986-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	EXEC_TYPES_H
#include	<exec/types.h>
#endif

#ifndef EXEC_PORTS_H
#include	<exec/ports.h>
#endif

#ifndef DEVICES_CONSOLE_H
#include	<devices/console.h>
#endif

#ifndef DEVICES_KEYMAP_H
#include	<devices/keymap.h>
#endif

#ifndef DEVICES_INPUTEVENT_H
#include	<devices/inputevent.h>
#endif

/* ----	console unit numbers for OpenDevice() */
#define	CONU_LIBRARY	-1	/* no unit, just fill in IO_DEVICE field */
#define	CONU_STANDARD	0	/* standard unmapped console */

/* ---- New unit numbers for OpenDevice() - (V36) */

#define	CONU_CHARMAP	1	/* bind character map to console */
#define	CONU_SNIPMAP	3	/* bind character map w/ snip to console */

/* ---- New flag defines for OpenDevice() - (V37) */

#define CONFLAG_DEFAULT			0
#define CONFLAG_NODRAW_ON_NEWSIZE	1


#define	PMB_ASM		(M_LNM+1)	/* internal storage bit for AS flag */
#define	PMB_AWM		(PMB_ASM+1)	/* internal storage bit for AW flag */
#define	MAXTABS		80


struct	ConUnit {
    struct  MsgPort cu_MP;
    /* ---- read only variables */
    struct  Window *cu_Window;	/* intuition window bound to this unit */
    WORD    cu_XCP;		/* character position */
    WORD    cu_YCP;
    WORD    cu_XMax;		/* max character position */
    WORD    cu_YMax;
    WORD    cu_XRSize;		/* character raster size */
    WORD    cu_YRSize;
    WORD    cu_XROrigin;	/* raster origin */
    WORD    cu_YROrigin;
    WORD    cu_XRExtant;	/* raster maxima */
    WORD    cu_YRExtant;
    WORD    cu_XMinShrink;	/* smallest area intact from resize process */
    WORD    cu_YMinShrink;
    WORD    cu_XCCP;		/* cursor position */
    WORD    cu_YCCP;

    /* ---- read/write variables (writes must must be protected) */
    /* ---- storage for AskKeyMap and SetKeyMap */
    struct  KeyMap cu_KeyMapStruct;
    /* ---- tab stops */
    UWORD   cu_TabStops[MAXTABS]; /* 0 at start, 0xffff at end of list */

    /* ---- console rastport attributes */
    BYTE    cu_Mask;
    BYTE    cu_FgPen;
    BYTE    cu_BgPen;
    BYTE    cu_AOLPen;
    BYTE    cu_DrawMode;
    BYTE    cu_Obsolete1;	/* was cu_AreaPtSz -- not used in V36 */
    APTR    cu_Obsolete2;	/* was cu_AreaPtrn -- not used in V36 */
    UBYTE   cu_Minterms[8];	/* console minterms */
    struct  TextFont *cu_Font;
    UBYTE   cu_AlgoStyle;
    UBYTE   cu_TxFlags;
    UWORD   cu_TxHeight;
    UWORD   cu_TxWidth;
    UWORD   cu_TxBaseline;
    WORD    cu_TxSpacing;

    /* ---- console MODES and RAW EVENTS switches */
    UBYTE   cu_Modes[(PMB_AWM+7)/8];	/* one bit per mode */
    UBYTE   cu_RawEvents[(IECLASS_MAX+8)/8];
};

#endif	/* DEVICES_CONUNIT_H */
