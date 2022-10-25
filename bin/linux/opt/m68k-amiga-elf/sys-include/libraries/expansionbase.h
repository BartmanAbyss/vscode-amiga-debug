#ifndef LIBRARIES_EXPANSIONBASE_H
#define LIBRARIES_EXPANSIONBASE_H
/*
**	$VER: expansionbase.h 36.15 (21.10.1991)
**	Includes Release 45.1
**
**	Definitions for the expansion library base
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif	/* EXEC_TYPES_H */

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif	/* EXEC_LIBRARIES_H */

#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif	/* EXEC_SEMAPHORES_H */

#ifndef LIBRARIES_CONFIGVARS_H
#include <libraries/configvars.h>
#endif	/* LIBRARIES_CONFIGVARS_H */


/* BootNodes are scanned by dos.library at startup.  Items found on the
   list are started by dos. BootNodes are added with the AddDosNode() or
   the V36 AddBootNode() calls. */
struct BootNode
{
	struct Node bn_Node;
	UWORD	bn_Flags;
	APTR	bn_DeviceNode;
};


/* expansion.library has functions to manipulate most of the information in
   ExpansionBase.  Direct access is not permitted.  Use FindConfigDev()
   to scan the board list. */
struct	ExpansionBase
{
	struct Library	LibNode;
	UBYTE	Flags;				/* read only (see below) */
	UBYTE	eb_Private01;			/* private */
	ULONG	eb_Private02;			/* private */
	ULONG	eb_Private03;			/* private */
	struct	CurrentBinding	eb_Private04;	/* private */
	struct	List	eb_Private05;		/* private */
	struct	List	MountList;	/* contains struct BootNode entries */
	/* private */
};

/* error codes */
#define EE_OK		0
#define EE_LASTBOARD	40  /* could not shut him up */
#define EE_NOEXPANSION	41  /* not enough expansion mem; board shut up */
#define EE_NOMEMORY	42  /* not enough normal memory */
#define EE_NOBOARD	43  /* no board at that address */
#define EE_BADMEM	44  /* tried to add bad memory card */

/* Flags */
#define EBB_CLOGGED	0	/* someone could not be shutup */
#define EBF_CLOGGED	(1<<0)
#define EBB_SHORTMEM	1	/* ran out of expansion mem */
#define EBF_SHORTMEM	(1<<1)
#define EBB_BADMEM	2	/* tried to add bad memory card */
#define EBF_BADMEM	(1<<2)
#define EBB_DOSFLAG	3	/* reserved for use by AmigaDOS */
#define EBF_DOSFLAG	(1<<3)
#define EBB_KICKBACK33	4	/* reserved for use by AmigaDOS */
#define EBF_KICKBACK33	(1<<4)
#define EBB_KICKBACK36	5	/* reserved for use by AmigaDOS */
#define EBF_KICKBACK36	(1<<5)
/* If the following flag is set by a floppy's bootblock code, the initial
   open of the initial shell window will be delayed until the first output
   to that shell.  Otherwise the 1.3 compatible behavior applies. */
#define EBB_SILENTSTART	6
#define EBF_SILENTSTART	(1<<6)

/* Magic kludge for CC0 use */
#define	EBB_START_CC0	7
#define	EBF_START_CC0	(1<<7)


#endif	/* LIBRARIES_EXPANSIONBASE_H */
