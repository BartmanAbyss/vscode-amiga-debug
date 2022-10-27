	IFND	EXEC_EXECBASE_I
EXEC_EXECBASE_I SET	1
**
**	$VER: execbase.i 39.4 (18.1.1993)
**	Includes Release 45.1
**
**	Definition of the exec.library base structure.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC	; EXEC_TYPES_I

    IFND EXEC_LISTS_I
    INCLUDE "exec/lists.i"
    ENDC	; EXEC_LISTS_I

    IFND EXEC_INTERRUPTS_I
    INCLUDE "exec/interrupts.i"
    ENDC	; EXEC_INTERRUPTS_I

    IFND EXEC_LIBRARIES_I
    INCLUDE "exec/libraries.i"
    ENDC	; EXEC_LIBRARIES_I



** Definition of the Exec library base structure (pointed to by location 4).
** Most fields are not to be viewed or modified by user programs.  Use
** extreme caution.
**
 STRUCTURE  ExecBase,LIB_SIZE		; Standard library node

******* Static System Variables *********************************************

	UWORD	SoftVer	; kickstart release number (obs.)
	WORD	LowMemChkSum	; checksum of 68000 trap vectors
	ULONG	ChkBase	; system base pointer complement
	APTR	ColdCapture	; coldstart soft capture vector
	APTR	CoolCapture	; coolstart soft capture vector
	APTR	WarmCapture	; warmstart soft capture vector
	APTR	SysStkUpper	; system stack base   (upper bound)
	APTR	SysStkLower	; top of system stack (lower bound)
	ULONG	MaxLocMem	; top of chip memory
	APTR	DebugEntry	; global debugger entry point
	APTR	DebugData	; global debugger data segment
	APTR	AlertData	; alert data segment
	APTR	MaxExtMem	; top of extended mem, or null if none

	WORD	ChkSum		; for all of the above (minus 2)


******* Interrupt Related ********************************************

	LABEL	IntVects
	STRUCT	IVTBE,IV_SIZE
	STRUCT	IVDSKBLK,IV_SIZE
	STRUCT	IVSOFTINT,IV_SIZE
	STRUCT	IVPORTS,IV_SIZE
	STRUCT	IVCOPER,IV_SIZE
	STRUCT	IVVERTB,IV_SIZE
	STRUCT	IVBLIT,IV_SIZE
	STRUCT	IVAUD0,IV_SIZE
	STRUCT	IVAUD1,IV_SIZE
	STRUCT	IVAUD2,IV_SIZE
	STRUCT	IVAUD3,IV_SIZE
	STRUCT	IVRBF,IV_SIZE
	STRUCT	IVDSKSYNC,IV_SIZE
	STRUCT	IVEXTER,IV_SIZE
	STRUCT	IVINTEN,IV_SIZE
	STRUCT	IVNMI,IV_SIZE


******* Dynamic System Variables *************************************

	APTR	ThisTask	; pointer to current task (readable)

	ULONG	IdleCount	; idle counter
	ULONG	DispCount	; dispatch counter
	UWORD	Quantum	; time slice quantum
	UWORD	Elapsed	; current quantum ticks
	UWORD	SysFlags	; misc internal system flags
	BYTE	IDNestCnt	; interrupt disable nesting count
	BYTE	TDNestCnt	; task disable nesting count

	UWORD	AttnFlags	; special attention flags (readable)

	UWORD	AttnResched	; rescheduling attention
	APTR	ResModules	; pointer to resident module array
	APTR	TaskTrapCode	; default task trap routine
	APTR	TaskExceptCode	; default task exception code
	APTR	TaskExitCode	; default task exit code
	ULONG	TaskSigAlloc	; preallocated signal mask
	UWORD	TaskTrapAlloc	; preallocated trap mask


******* System List Headers (private!) ********************************

	STRUCT	MemList,LH_SIZE
	STRUCT	ResourceList,LH_SIZE
	STRUCT	DeviceList,LH_SIZE
	STRUCT	IntrList,LH_SIZE
	STRUCT	LibList,LH_SIZE
	STRUCT	PortList,LH_SIZE
	STRUCT	TaskReady,LH_SIZE
	STRUCT	TaskWait,LH_SIZE

	STRUCT	SoftInts,SH_SIZE*5


******* Other Globals ******************************************************

	STRUCT	LastAlert,4*4

	;------ these next two variables are provided to allow
	;------ system developers to have a rough idea of the
	;------ period of two externally controlled signals --
	;------ the time between vertical blank interrupts and the
	;------ external line rate (which is counted by CIA A's
	;------ "time of day" clock).  In general these values
	;------ will be 50 or 60, and may or may not track each
	;------ other.  These values replace the obsolete AFB_PAL
	;------ and AFB_50HZ flags.
	UBYTE	VBlankFrequency 	;(readable)
	UBYTE	PowerSupplyFrequency	;(readable)

	STRUCT	SemaphoreList,LH_SIZE

	;------ these next two are to be able to kickstart into user ram.
	;------ KickMemPtr holds a singly linked list of MemLists which
	;------ will be removed from the memory list via AllocAbs.	If
	;------ all the AllocAbs's succeeded, then the KickTagPtr will
	;------ be added to the rom tag list.
	APTR	KickMemPtr	; ptr to queue of mem lists
	APTR	KickTagPtr	; ptr to rom tag queue
	APTR	KickCheckSum	; checksum for mem and tags


******* V36 Exec additions start here ***************************************

	UWORD	ex_Pad0		; Private internal use
	ULONG	ex_LaunchPoint	; Private to Launch/Switch
	APTR	ex_RamLibPrivate
	;* The next ULONG contains the system "E" clock frequency,
	;* expressed in Hertz.	The E clock is used as a timebase for
	;* the Amiga's 8520 I/O chips. (E is connected to "02").
	;* Typical values are 715909 for NTSC, or 709379 for PAL.
	;*
	ULONG	ex_EClockFrequency ;(readable)
	ULONG	ex_CacheControl	   ;Private to the CacheControl call
	ULONG	ex_TaskID	   ;Next available task ID

	STRUCT	ex_Reserved1,5*4

	APTR	ex_MMULock	   ;Private

	STRUCT	ex_Reserved2,3*4

******* V39 Exec additions start here ***************************************

	;* The following list and data element are used for
	;* V39 exec's low memory handler.
	STRUCT	ex_MemHandlers,MLH_SIZE		;* List of handlers
	APTR	ex_MemHandler			;* Handler pointer (PRIVATE!)

	LABEL	SYSBASESIZE


******* Bit defines for AttnFlags (see above) *******************************

*  Processors and Co-processors:
	BITDEF	AF,68010,0	; also set for 68020
	BITDEF	AF,68020,1	; also set for 68030
	BITDEF	AF,68030,2	; also set for 68040
	BITDEF	AF,68040,3
	BITDEF	AF,68881,4	; also set for 68882
	BITDEF	AF,68882,5
	BITDEF	AF,FPU40,6	; Set if 68040 FPU
;
; The AFB_FPU40 bit is set when a working 68040 FPU
; is in the system.  If this bit is set and both the
; AFB_68881 and AFB_68882 bits are not set, then the 68040
; math emulation code has not been loaded and only 68040
; FPU instructions are available.  This bit is valid *ONLY*
; if the AFB_68040 bit is set.
;
;	BITDEF	AF,RESERVED8,8
;	BITDEF	AF,RESERVED9,9
	BITDEF	AF,PRIVATE,15	; Just what it says


******* Selected bit definitions for Cache manipulation calls **************

	BITDEF	CACR,EnableI,0		;Enable instruction cache
	BITDEF	CACR,FreezeI,1		;Freeze instruction cache
	BITDEF	CACR,ClearI,3		;Clear instruction cache
	BITDEF	CACR,IBE,4		;Instruction burst enable
	BITDEF	CACR,EnableD,8		;68030 Enable data cache
	BITDEF	CACR,FreezeD,9		;68030 Freeze data cache
	BITDEF	CACR,ClearD,11		;68030 Clear data cache
	BITDEF	CACR,DBE,12		;68030 Data burst enable
	BITDEF	CACR,WriteAllocate,13	;68030 Write-Allocate mode (must
					;always be set)
	BITDEF	CACR,EnableE,30		;Master enable for external caches
					;External caches should track the
					;state of the internal caches
					;such that they do not cache anything
					;that the internal cache turned off
					;for.
	BITDEF	CACR,CopyBack,31	;Master enable for copyback caches


	BITDEF	DMA,Continue,1		;Continuation flag for CachePreDMA
	BITDEF	DMA,NoModify,2		;Set if DMA does not update memory
	BITDEF	DMA,ReadFromRAM,3	;Set if DMA goes *FROM* RAM to device

	ENDC	; EXEC_EXECBASE_I
