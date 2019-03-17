#ifndef LIBRARIES_CONFIGVARS_H
#define LIBRARIES_CONFIGVARS_H
/*
**	$VER: configvars.h 36.14 (22.4.1991)
**	Includes Release 45.1
**
**	Software structures used by AutoConfig (tm) boards
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	EXEC_TYPES_H
#include <exec/types.h>
#endif	/* EXEC_TYPES_H */

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif /* EXEC_NODES_H */

#ifndef LIBRARIES_CONFIGREGS_H
#include <libraries/configregs.h>
#endif /* LIBRARIES_CONFIGREGS_H */

/*
** At early system startup time, one ConfigDev structure is created for
** each board found in the system.  Software may seach for ConfigDev
** structures by vendor & product ID number.  For debugging and diagnostic
** use, the entire list can be accessed.  See the expansion.library document
** for more information.
*/
struct ConfigDev {
    struct Node		cd_Node;
    UBYTE		cd_Flags;	/* (read/write) */
    UBYTE		cd_Pad;		/* reserved */
    struct ExpansionRom	cd_Rom;		/* copy of board's expansion ROM */
    APTR		cd_BoardAddr; /* where in memory the board was placed */
    ULONG		cd_BoardSize;	/* size of board in bytes */
    UWORD		cd_SlotAddr;	/* which slot number (PRIVATE) */
    UWORD		cd_SlotSize;	/* number of slots (PRIVATE) */
    APTR		cd_Driver;	/* pointer to node of driver */
    struct ConfigDev *	cd_NextCD;	/* linked list of drivers to config */
    ULONG		cd_Unused[4];	/* for whatever the driver wants */
};

/* cd_Flags */
#define	CDB_SHUTUP	0	/* this board has been shut up */
#define	CDB_CONFIGME	1	/* this board needs a driver to claim it */
#define	CDB_BADMEMORY	2	/* this board contains bad memory */
#define	CDB_PROCESSED	3	/* private flag */

#define	CDF_SHUTUP	0x01
#define	CDF_CONFIGME	0x02
#define	CDF_BADMEMORY	0x04
#define	CDF_PROCESSED	0x08

/*
** Boards are usually "bound" to software drivers.
** This structure is used by GetCurrentBinding() and SetCurrentBinding()
*/
struct CurrentBinding {
    struct ConfigDev *	cb_ConfigDev;		/* first configdev in chain */
    UBYTE *		cb_FileName;		/* file name of driver */
    UBYTE *		cb_ProductString;	/* product # string */
    UBYTE **		cb_ToolTypes;		/* tooltypes from disk object */
};


#endif /* LIBRARIES_CONFIGVARS_H */
