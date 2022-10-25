	IFND	DOS_FILEHANDLER_I
DOS_FILEHANDLER_I SET	1
**
**	$VER: filehandler.i 36.5 (9.8.1992)
**	Includes Release 45.1
**
**	device and file handler specific code for AmigaDOS
**
**	(C) Copyright 1986-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	  EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC	; EXEC_TYPES_I

	IFND	  EXEC_PORTS_I
	INCLUDE "exec/ports.i"
	ENDC	; EXEC_PORTS_I

	IFND	  DOS_DOS_I
	INCLUDE "libraries/dos.i"
	ENDC	; DOS_DOS_I


* The disk "environment" is a longword array that describes the
* disk geometry.  It is variable sized, with the length at the beginning.
* Here are the constants for a standard geometry.



 STRUCTURE DosEnvec,0
    ULONG de_TableSize	     ; Size of Environment vector
    ULONG de_SizeBlock	     ; in longwords: standard value is 128
    ULONG de_SecOrg	     ; not used; must be 0
    ULONG de_Surfaces	     ; # of heads (surfaces). drive specific
    ULONG de_SectorPerBlock  ; not used; must be 1
    ULONG de_BlocksPerTrack  ; blocks per track. drive specific
    ULONG de_Reserved	     ; DOS reserved blocks at start of partition.
    ULONG de_PreAlloc	     ; DOS reserved blocks at end of partition
    ULONG de_Interleave	     ; usually 0
    ULONG de_LowCyl	     ; starting cylinder. typically 0
    ULONG de_HighCyl	     ; max cylinder. drive specific
    ULONG de_NumBuffers	     ; Initial # DOS of buffers.
    ULONG de_BufMemType	     ; type of mem to allocate for buffers
    ULONG de_MaxTransfer     ; Max number of bytes to transfer at a time
    ULONG de_Mask	     ; Address Mask to block out certain memory
    LONG  de_BootPri	     ; Boot priority for autoboot
    ULONG de_DosType	     ; ASCII (HEX) string showing filesystem type;
			     ; 0X444F5300 is old filesystem,
			     ; 0X444F5301 is fast file system
    ULONG de_Baud	     ; Baud rate for serial handler
    ULONG de_Control	     ; Control word for handler/filesystem
    ULONG de_BootBlocks      ; Number of blocks containing boot code

    LABEL DosEnvec_SIZEOF

* these are the offsets into the array
* DE_TABLESIZE is set to the number of longwords in the table minus 1

DE_TABLESIZE	EQU	0	; minimum value is 11 (includes NumBuffers)
DE_SIZEBLOCK	EQU	1	; in longwords: standard value is 128
DE_SECORG	EQU	2	; not used; must be 0
DE_NUMHEADS	EQU	3	; # of heads (surfaces). drive specific
DE_SECSPERBLK	EQU	4	; not used; must be 1
DE_BLKSPERTRACK EQU	5	; blocks per track. drive specific
DE_RESERVEDBLKS EQU	6	; unavailable blocks at start.	usually 2
DE_PREFAC	EQU	7	; not used; must be 0
DE_INTERLEAVE	EQU	8	; usually 0
DE_LOWCYL	EQU	9	; starting cylinder. typically 0
DE_UPPERCYL	EQU	10	; max cylinder.	 drive specific
DE_NUMBUFFERS	EQU	11	; starting # of buffers.  typically 5
DE_MEMBUFTYPE	EQU	12	; type of mem to allocate for buffers.
DE_BUFMEMTYPE	EQU	12	; same as above, better name
				; 1 is public, 3 is chip, 5 is fast
DE_MAXTRANSFER	EQU	13	; Maximum number of bytes to transfer at a time
DE_MASK		EQU	14	; Address Mask to block out certain memory
DE_BOOTPRI	EQU	15	; Boot priority for autoboot
DE_DOSTYPE	EQU	16	; ASCII (HEX) string showing filesystem type
				; 0X444F5300 is old filesystem,
				; 0X444F5301 is fast file system
DE_BAUD	EQU	17	; Baud rate for serial handler
DE_CONTROL	EQU	18	; Control word for handler/filesystem
DE_BOOTBLOCKS	EQU	19	; Number of blocks containing boot code

*
* The file system startup message is linked into a device node's startup
* field.  It contains a pointer to the above environment, plus the
* information needed to do an exec OpenDevice().
*

 STRUCTURE FileSysStartupMsg,0
    ULONG	fssm_Unit	; exec unit number for this device
    BSTR	fssm_Device	; null terminated bstring to the device name
    BPTR	fssm_Environ	; ptr to environment table (see above)
    ULONG	fssm_Flags	; flags for OpenDevice()
    LABEL	FileSysStartupMsg_SIZEOF


* The include file "dos/dosextens.h" has a DeviceList structure.
* The "device list" can have one of three different things linked onto
* it.  Dosextens defines the structure for a volume.  DLT_DIRECTORY
* is for an assigned directory.	 The following structure is for
* a dos "device" (DLT_DEVICE).

 STRUCTURE DeviceNode,0
    BPTR	dn_Next		; singly linked list
    ULONG	dn_Type		; always 0 for dos "devices"
    CPTR	dn_Task		; standard dos "task" field.  If this is
				;     null when the node is accesses, a task
				;     will be started up
    BPTR	dn_Lock		; not used for devices -- leave null
    BSTR	dn_Handler	; filename to loadseg (if seglist is null)
    ULONG	dn_StackSize	; stacksize to use when starting task
    LONG	dn_Priority	; task priority when starting task
    BPTR	dn_Startup	; startup msg: FileSysStartupMsg for disks
    BPTR	dn_SegList	; code to run to start new task (if necessary).
				;     if null then dn_Handler will be loaded.
    BPTR	dn_GlobalVec	; BCPL global vector to use when starting
				;     a task.  -1 means that dn_SegList is not
				;     for a bcpl program, so the dos won't
				;     try and construct one.  0 tell the
				;     dos that you obey BCPL linkage rules,
				;     and that it should construct a global
				;     vector for you.
    BSTR	dn_Name		; the node name, e.g. '\3','D','F','3'
    LABEL	DeviceNode_SIZEOF

	ENDC	; DOS_FILEHANDLER_I
