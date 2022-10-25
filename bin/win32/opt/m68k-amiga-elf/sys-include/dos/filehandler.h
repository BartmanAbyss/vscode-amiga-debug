#ifndef DOS_FILEHANDLER_H
#define DOS_FILEHANDLER_H
/*
**	$VER: filehandler.h 44.1 (24.8.99)
**	Includes Release 45.1
**
**	device and file handler specific code for AmigaDOS
**
**	(C) Copyright 1986-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	  EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef	  DOS_DOS_H
#include <dos/dos.h>
#endif


/* The disk "environment" is a longword array that describes the
 * disk geometry.  It is variable sized, with the length at the beginning.
 * Here are the constants for a standard geometry.
 */

struct DosEnvec {
    ULONG de_TableSize;	     /* Size of Environment vector */
    ULONG de_SizeBlock;	     /* in longwords: Physical disk block size */
    ULONG de_SecOrg;	     /* not used; must be 0 */
    ULONG de_Surfaces;	     /* # of heads (surfaces). drive specific */
    ULONG de_SectorPerBlock; /* N de_SizeBlock sectors per logical block */
    ULONG de_BlocksPerTrack; /* blocks per track. drive specific */
    ULONG de_Reserved;	     /* DOS reserved blocks at start of partition. */
    ULONG de_PreAlloc;	     /* DOS reserved blocks at end of partition */
    ULONG de_Interleave;     /* usually 0 */
    ULONG de_LowCyl;	     /* starting cylinder. typically 0 */
    ULONG de_HighCyl;	     /* max cylinder. drive specific */
    ULONG de_NumBuffers;     /* Initial # DOS of buffers.  */
    ULONG de_BufMemType;     /* type of mem to allocate for buffers */
    ULONG de_MaxTransfer;    /* Max number of bytes to transfer at a time */
    ULONG de_Mask;	     /* Address Mask to block out certain memory */
    LONG  de_BootPri;	     /* Boot priority for autoboot */
    ULONG de_DosType;	     /* ASCII (HEX) string showing filesystem type;
			      * 0X444F5300 is old filesystem,
			      * 0X444F5301 is fast file system */
    ULONG de_Baud;	     /* Baud rate for serial handler */
    ULONG de_Control;	     /* Control word for handler/filesystem */
    ULONG de_BootBlocks;     /* Number of blocks containing boot code */

};

/* these are the offsets into the array */
/* DE_TABLESIZE is set to the number of longwords in the table minus 1 */

#define DE_TABLESIZE	0	/* minimum value is 11 (includes NumBuffers) */
#define DE_SIZEBLOCK	1	/* in longwords: standard value is 128 */
#define DE_SECORG	2	/* not used; must be 0 */
#define DE_NUMHEADS	3	/* # of heads (surfaces). drive specific */
#define DE_SECSPERBLK	4	/* not used; must be 1 */
#define DE_BLKSPERTRACK 5	/* blocks per track. drive specific */
#define DE_RESERVEDBLKS 6	/* unavailable blocks at start.	 usually 2 */
#define DE_PREFAC	7	/* not used; must be 0 */
#define DE_INTERLEAVE	8	/* usually 0 */
#define DE_LOWCYL	9	/* starting cylinder. typically 0 */
#define DE_UPPERCYL	10	/* max cylinder.  drive specific */
#define DE_NUMBUFFERS	11	/* starting # of buffers.  typically 5 */
#define DE_MEMBUFTYPE	12	/* type of mem to allocate for buffers. */
#define DE_BUFMEMTYPE	12	/* same as above, better name
				 * 1 is public, 3 is chip, 5 is fast */
#define DE_MAXTRANSFER	13	/* Max number bytes to transfer at a time */
#define DE_MASK		14	/* Address Mask to block out certain memory */
#define DE_BOOTPRI	15	/* Boot priority for autoboot */
#define DE_DOSTYPE	16	/* ASCII (HEX) string showing filesystem type;
				 * 0X444F5300 is old filesystem,
				 * 0X444F5301 is fast file system */
#define DE_BAUD		17	/* Baud rate for serial handler */
#define DE_CONTROL	18	/* Control word for handler/filesystem */
#define DE_BOOTBLOCKS	19	/* Number of blocks containing boot code */

/* The file system startup message is linked into a device node's startup
** field.  It contains a pointer to the above environment, plus the
** information needed to do an exec OpenDevice().
*/
struct FileSysStartupMsg {
    ULONG	fssm_Unit;	/* exec unit number for this device */
    BSTR	fssm_Device;	/* null terminated bstring to the device name */
    BPTR	fssm_Environ;	/* ptr to environment table (see above) */
    ULONG	fssm_Flags;	/* flags for OpenDevice() */
};


/* The include file "libraries/dosextens.h" has a DeviceList structure.
 * The "device list" can have one of three different things linked onto
 * it.	Dosextens defines the structure for a volume.  DLT_DIRECTORY
 * is for an assigned directory.  The following structure is for
 * a dos "device" (DLT_DEVICE).
*/

struct DeviceNode {
    BPTR	dn_Next;	/* singly linked list */
    ULONG	dn_Type;	/* always 0 for dos "devices" */
    struct MsgPort *dn_Task;	/* standard dos "task" field.  If this is
				 * null when the node is accesses, a task
				 * will be started up */
    BPTR	dn_Lock;	/* not used for devices -- leave null */
    BSTR	dn_Handler;	/* filename to loadseg (if seglist is null) */
    ULONG	dn_StackSize;	/* stacksize to use when starting task */
    LONG	dn_Priority;	/* task priority when starting task */
    BPTR	dn_Startup;	/* startup msg: FileSysStartupMsg for disks */
    BPTR	dn_SegList;	/* code to run to start new task (if necessary).
				 * if null then dn_Handler will be loaded. */
    BPTR	dn_GlobalVec;	/* BCPL global vector to use when starting
				 * a task.  -1 means that dn_SegList is not
				 * for a bcpl program, so the dos won't
				 * try and construct one.  0 tell the
				 * dos that you obey BCPL linkage rules,
				 * and that it should construct a global
				 * vector for you.
				 */
    BSTR	dn_Name;	/* the node name, e.g. '\3','D','F','3' */
};

#endif	/* DOS_FILEHANDLER_H */
