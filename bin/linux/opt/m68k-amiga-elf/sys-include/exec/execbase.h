#ifndef EXEC_EXECBASE_H
#define EXEC_EXECBASE_H
/*
**	$VER: execbase.h 39.6 (18.1.1993)
**	Includes Release 45.1
**
**	Definition of the exec.library base structure.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif /* EXEC_LISTS_H */

#ifndef EXEC_INTERRUPTS_H
#include <exec/interrupts.h>
#endif /* EXEC_INTERRUPTS_H */

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif /* EXEC_LIBRARIES_H */

#ifndef EXEC_TASKS_H
#include <exec/tasks.h>
#endif /* EXEC_TASKS_H */


/* Definition of the Exec library base structure (pointed to by location 4).
** Most fields are not to be viewed or modified by user programs.  Use
** extreme caution.
*/
struct ExecBase {
	struct Library LibNode; /* Standard library node */

/******** Static System Variables ********/

	UWORD	SoftVer;	/* kickstart release number (obs.) */
	WORD	LowMemChkSum;	/* checksum of 68000 trap vectors */
	ULONG	ChkBase;	/* system base pointer complement */
	APTR	ColdCapture;	/* coldstart soft capture vector */
	APTR	CoolCapture;	/* coolstart soft capture vector */
	APTR	WarmCapture;	/* warmstart soft capture vector */
	APTR	SysStkUpper;	/* system stack base   (upper bound) */
	APTR	SysStkLower;	/* top of system stack (lower bound) */
	ULONG	MaxLocMem;	/* top of chip memory */
	APTR	DebugEntry;	/* global debugger entry point */
	APTR	DebugData;	/* global debugger data segment */
	APTR	AlertData;	/* alert data segment */
	APTR	MaxExtMem;	/* top of extended mem, or null if none */

	UWORD	ChkSum;	/* for all of the above (minus 2) */

/****** Interrupt Related ***************************************/

	struct	IntVector IntVects[16];

/****** Dynamic System Variables *************************************/

	struct	Task *ThisTask; /* pointer to current task (readable) */

	ULONG	IdleCount;	/* idle counter */
	ULONG	DispCount;	/* dispatch counter */
	UWORD	Quantum;	/* time slice quantum */
	UWORD	Elapsed;	/* current quantum ticks */
	UWORD	SysFlags;	/* misc internal system flags */
	BYTE	IDNestCnt;	/* interrupt disable nesting count */
	BYTE	TDNestCnt;	/* task disable nesting count */

	UWORD	AttnFlags;	/* special attention flags (readable) */

	UWORD	AttnResched;	/* rescheduling attention */
	APTR	ResModules;	/* resident module array pointer */
	APTR	TaskTrapCode;
	APTR	TaskExceptCode;
	APTR	TaskExitCode;
	ULONG	TaskSigAlloc;
	UWORD	TaskTrapAlloc;


/****** System Lists (private!) ********************************/

	struct	List MemList;
	struct	List ResourceList;
	struct	List DeviceList;
	struct	List IntrList;
	struct	List LibList;
	struct	List PortList;
	struct	List TaskReady;
	struct	List TaskWait;

	struct	SoftIntList SoftInts[5];

/****** Other Globals *******************************************/

	LONG	LastAlert[4];

	/* these next two variables are provided to allow
	** system developers to have a rough idea of the
	** period of two externally controlled signals --
	** the time between vertical blank interrupts and the
	** external line rate (which is counted by CIA A's
	** "time of day" clock).  In general these values
	** will be 50 or 60, and may or may not track each
	** other.  These values replace the obsolete AFB_PAL
	** and AFB_50HZ flags.
	*/
	UBYTE	VBlankFrequency;	/* (readable) */
	UBYTE	PowerSupplyFrequency;	/* (readable) */

	struct	List SemaphoreList;

	/* these next two are to be able to kickstart into user ram.
	** KickMemPtr holds a singly linked list of MemLists which
	** will be removed from the memory list via AllocAbs.  If
	** all the AllocAbs's succeeded, then the KickTagPtr will
	** be added to the rom tag list.
	*/
	APTR	KickMemPtr;	/* ptr to queue of mem lists */
	APTR	KickTagPtr;	/* ptr to rom tag queue */
	APTR	KickCheckSum;	/* checksum for mem and tags */

/****** V36 Exec additions start here **************************************/

	UWORD	ex_Pad0;		/* Private internal use */
	ULONG	ex_LaunchPoint;		/* Private to Launch/Switch */
	APTR	ex_RamLibPrivate;
	/* The next ULONG contains the system "E" clock frequency,
	** expressed in Hertz.	The E clock is used as a timebase for
	** the Amiga's 8520 I/O chips. (E is connected to "02").
	** Typical values are 715909 for NTSC, or 709379 for PAL.
	*/
	ULONG	ex_EClockFrequency;	/* (readable) */
	ULONG	ex_CacheControl;	/* Private to CacheControl calls */
	ULONG	ex_TaskID;		/* Next available task ID */

	ULONG	ex_Reserved1[5];

	APTR	ex_MMULock;		/* private */

	ULONG	ex_Reserved2[3];

/****** V39 Exec additions start here **************************************/

	/* The following list and data element are used
	 * for V39 exec's low memory handler...
	 */
	struct	MinList	ex_MemHandlers;	/* The handler list */
	APTR	ex_MemHandler;		/* Private! handler pointer */
};


/****** Bit defines for AttnFlags (see above) ******************************/

/*  Processors and Co-processors: */
#define AFB_68010	0	/* also set for 68020 */
#define AFB_68020	1	/* also set for 68030 */
#define AFB_68030	2	/* also set for 68040 */
#define AFB_68040	3	/* also set for 68060 */
#define AFB_68881	4	/* also set for 68882 */
#define AFB_68882	5
#define	AFB_FPU40	6	/* Set if 68040 FPU */
#define AFB_68060	7
/*
 * The AFB_FPU40 bit is set when a working 68040 FPU
 * is in the system.  If this bit is set and both the
 * AFB_68881 and AFB_68882 bits are not set, then the 68040
 * math emulation code has not been loaded and only 68040
 * FPU instructions are available.  This bit is valid *ONLY*
 * if the AFB_68040 bit is set.
 */

#define AFB_PRIVATE	15	/* Just what it says */

#define AFF_68010	(1L<<0)
#define AFF_68020	(1L<<1)
#define AFF_68030	(1L<<2)
#define AFF_68040	(1L<<3)
#define AFF_68881	(1L<<4)
#define AFF_68882	(1L<<5)
#define	AFF_FPU40	(1L<<6)
#define AFF_68060	(1L<<7)

#define AFF_PRIVATE	(1L<<15)

/* #define AFB_RESERVED8   8 */
/* #define AFB_RESERVED9   9 */


/****** Selected flag definitions for Cache manipulation calls **********/

#define CACRF_EnableI	    (1L<<0)  /* Enable instruction cache */
#define CACRF_FreezeI	    (1L<<1)  /* Freeze instruction cache */
#define CACRF_ClearI	    (1L<<3)  /* Clear instruction cache  */
#define CACRF_IBE	    (1L<<4)  /* Instruction burst enable */
#define CACRF_EnableD	    (1L<<8)  /* 68030 Enable data cache  */
#define CACRF_FreezeD	    (1L<<9)  /* 68030 Freeze data cache  */
#define CACRF_ClearD	    (1L<<11) /* 68030 Clear data cache	 */
#define CACRF_DBE	    (1L<<12) /* 68030 Data burst enable */
#define CACRF_WriteAllocate (1L<<13) /* 68030 Write-Allocate mode
					(must always be set!)	 */
#define	CACRF_EnableE	    (1L<<30) /* Master enable for external caches */
				     /* External caches should track the */
				     /* state of the internal caches */
				     /* such that they do not cache anything */
				     /* that the internal cache turned off */
				     /* for. */
#define CACRF_CopyBack	    (1L<<31) /* Master enable for copyback caches */

#define DMA_Continue	    (1L<<1)  /* Continuation flag for CachePreDMA */
#define DMA_NoModify	    (1L<<2)  /* Set if DMA does not update memory */
#define	DMA_ReadFromRAM     (1L<<3)  /* Set if DMA goes *FROM* RAM to device */


#endif	/* EXEC_EXECBASE_H */
