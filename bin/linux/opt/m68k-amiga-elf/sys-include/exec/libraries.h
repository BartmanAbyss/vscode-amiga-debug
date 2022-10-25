#ifndef	EXEC_LIBRARIES_H
#define	EXEC_LIBRARIES_H
/*
**	$VER: libraries.h 39.2 (10.4.1992)
**	Includes Release 45.1
**
**	Definitions for use when creating or using Exec libraries
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif /* EXEC_NODES_H */


/*------ Special Constants ---------------------------------------*/
#define LIB_VECTSIZE	6	/* Each library entry takes 6 bytes */
#define LIB_RESERVED	4	/* Exec reserves the first 4 vectors */
#define LIB_BASE	(-LIB_VECTSIZE)
#define LIB_USERDEF	(LIB_BASE-(LIB_RESERVED*LIB_VECTSIZE))
#define LIB_NONSTD	(LIB_USERDEF)

/*------ Standard Functions --------------------------------------*/
#define LIB_OPEN	(-6)
#define LIB_CLOSE	(-12)
#define LIB_EXPUNGE	(-18)
#define LIB_EXTFUNC	(-24)	/* for future expansion */


/*------ Library Base Structure ----------------------------------*/
/* Also used for Devices and some Resources */
struct Library {
    struct  Node lib_Node;
    UBYTE   lib_Flags;
    UBYTE   lib_pad;
    UWORD   lib_NegSize;	    /* number of bytes before library */
    UWORD   lib_PosSize;	    /* number of bytes after library */
    UWORD   lib_Version;	    /* major */
    UWORD   lib_Revision;	    /* minor */
    APTR    lib_IdString;	    /* ASCII identification */
    ULONG   lib_Sum;		    /* the checksum itself */
    UWORD   lib_OpenCnt;	    /* number of current opens */
};	/* Warning: size is not a longword multiple! */

/* lib_Flags bit definitions (all others are system reserved) */
#define LIBF_SUMMING	(1<<0)	    /* we are currently checksumming */
#define LIBF_CHANGED	(1<<1)	    /* we have just changed the lib */
#define LIBF_SUMUSED	(1<<2)	    /* set if we should bother to sum */
#define LIBF_DELEXP	(1<<3)	    /* delayed expunge */


/* Temporary Compatibility */
#define lh_Node	lib_Node
#define lh_Flags	lib_Flags
#define lh_pad		lib_pad
#define lh_NegSize	lib_NegSize
#define lh_PosSize	lib_PosSize
#define lh_Version	lib_Version
#define lh_Revision	lib_Revision
#define lh_IdString	lib_IdString
#define lh_Sum		lib_Sum
#define lh_OpenCnt	lib_OpenCnt

#endif	/* EXEC_LIBRARIES_H */
