	IFND	RESOURCES_FILESYSRES_I
RESOURCES_FILESYSRES_I	SET	1
**
**	$VER: filesysres.i 36.4 (3.5.1990)
**	Includes Release 45.1
**
**	FileSystem.resource description
**
**	(C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_NODES_I
	INCLUDE	"exec/nodes.i"
	ENDC
	IFND	EXEC_LISTS_I
	INCLUDE	"exec/lists.i"
	ENDC
	IFND	DOS_DOS_I
	INCLUDE	"dos/dos.i"
	ENDC

FSRNAME	MACRO
		dc.b	'FileSystem.resource',0
	ENDM

 STRUCTURE  FileSysResource,LN_SIZE	; on resource list
    CPTR    fsr_Creator			; name of creator of this resource
    STRUCT  fsr_FileSysEntries,LH_SIZE	; list of FileSysEntry structs
    LABEL   FileSysResource_SIZEOF

 STRUCTURE  FileSysEntry,LN_SIZE	; on fsr_FileSysEntries list
					; LN_NAME is of creator of this entry
    ULONG   fse_DosType		; DosType of this FileSys
    ULONG   fse_Version		; Version of this FileSys
    ULONG   fse_PatchFlags	; bits set for those of the following that need
				;   to be substituted into a standard device
				;   node for this file system: e.g. $180
				;   for substitute SegList & GlobalVec
    ULONG   fse_Type		; device node type: zero
    CPTR    fse_Task		; standard dos "task" field
    BPTR    fse_Lock		; not used for devices: zero
    BSTR    fse_Handler		; filename to loadseg (if SegList is null)
    ULONG   fse_StackSize	; stacksize to use when starting task
    LONG    fse_Priority	; task priority when starting task
    BPTR    fse_Startup		; startup msg: FileSysStartupMsg for disks
    BPTR    fse_SegList		; code to run to start new task
    BPTR    fse_GlobalVec	; BCPL global vector when starting task
    ; no more entries need exist than those implied by fse_PatchFlags

	ENDC	; RESOURCES_FILESYSRES_I
