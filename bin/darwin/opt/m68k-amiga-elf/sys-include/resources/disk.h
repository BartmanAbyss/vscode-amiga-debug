#ifndef	RESOURCES_DISK_H
#define RESOURCES_DISK_H
/*
**	$VER: disk.h 27.11 (21.11.1990)
**	Includes Release 45.1
**
**	disk.h -- external declarations for the disk resource
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef	EXEC_LISTS_H
#include <exec/lists.h>
#endif

#ifndef	EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef	EXEC_INTERRUPTS_H
#include <exec/interrupts.h>
#endif

#ifndef	EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif


/********************************************************************
*
* Resource structures
*
********************************************************************/


struct DiscResourceUnit {
    struct Message dru_Message;
    struct Interrupt dru_DiscBlock;
    struct Interrupt dru_DiscSync;
    struct Interrupt dru_Index;
};

struct DiscResource {
    struct Library		dr_Library;
    struct DiscResourceUnit	*dr_Current;
    UBYTE			dr_Flags;
    UBYTE			dr_pad;
    struct Library		*dr_SysLib;
    struct Library		*dr_CiaResource;
    ULONG			dr_UnitID[4];
    struct List		dr_Waiting;
    struct Interrupt		dr_DiscBlock;
    struct Interrupt		dr_DiscSync;
    struct Interrupt		dr_Index;
    struct Task			*dr_CurrTask;
};

/* dr_Flags entries */
#define DRB_ALLOC0	0	/* unit zero is allocated */
#define DRB_ALLOC1	1	/* unit one is allocated */
#define DRB_ALLOC2	2	/* unit two is allocated */
#define DRB_ALLOC3	3	/* unit three is allocated */
#define DRB_ACTIVE	7	/* is the disc currently busy? */

#define DRF_ALLOC0	(1<<0)	/* unit zero is allocated */
#define DRF_ALLOC1	(1<<1)	/* unit one is allocated */
#define DRF_ALLOC2	(1<<2)	/* unit two is allocated */
#define DRF_ALLOC3	(1<<3)	/* unit three is allocated */
#define DRF_ACTIVE	(1<<7)	/* is the disc currently busy? */



/********************************************************************
*
* Hardware Magic
*
********************************************************************/


#define	DSKDMAOFF	0x4000	/* idle command for dsklen register */


/********************************************************************
*
* Resource specific commands
*
********************************************************************/

/*
 * DISKNAME is a generic macro to get the name of the resource.
 * This way if the name is ever changed you will pick up the
 *  change automatically.
 */

#define DISKNAME	"disk.resource"


#define	DR_ALLOCUNIT	(LIB_BASE - 0*LIB_VECTSIZE)
#define	DR_FREEUNIT	(LIB_BASE - 1*LIB_VECTSIZE)
#define	DR_GETUNIT	(LIB_BASE - 2*LIB_VECTSIZE)
#define	DR_GIVEUNIT	(LIB_BASE - 3*LIB_VECTSIZE)
#define	DR_GETUNITID	(LIB_BASE - 4*LIB_VECTSIZE)
#define	DR_READUNITID	(LIB_BASE - 5*LIB_VECTSIZE)

#define	DR_LASTCOMM	(DR_READUNITID)

/********************************************************************
*
* drive types
*
********************************************************************/

#define	DRT_AMIGA	(0x00000000)
#define	DRT_37422D2S	(0x55555555)
#define DRT_EMPTY	(0xFFFFFFFF)
#define DRT_150RPM	(0xAAAAAAAA)

#endif /* RESOURCES_DISK_H */
