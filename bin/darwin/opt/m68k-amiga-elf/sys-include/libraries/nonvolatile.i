	IFND LIBRARIES_NONVOLATILE_I
LIBRARIES_NONVOLATILE_I SET 1
**
**	$VER: nonvolatile.i 40.10 (3.8.1993)
**	Includes Release 45.1
**
**	nonvolatile.library interface structures and definitions.
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC

;---------------------------------------------------------------------------

   STRUCTURE NVInfo,0
	ULONG	nvi_MaxStorage
	ULONG	nvi_FreeStorage
   LABEL NVINFO_SIZE

;---------------------------------------------------------------------------

   STRUCTURE NVEntry,0
	STRUCT	nve_Node,MLN_SIZE
	APTR	nve_Name
	ULONG	nve_Size
	ULONG	nve_Protection
   LABEL NVENTRY_SIZE

;---------------------------------------------------------------------------

; Bit definitions for mask in SetNVProtection(). Also used for
; NVEntry.nve_Protection.

	BITDEF	NVE,DELETE,0
	BITDEF	NVE,APPNAME,31

;---------------------------------------------------------------------------

; errors from StoreNV()
NVERR_BADNAME	equ 1
NVERR_WRITEPROT equ 2
NVERR_FAIL	equ 3
NVERR_FATAL	equ 4


;---------------------------------------------------------------------------

; determines the size of data returned by this library
SizeNVData	MACRO	;DataPtr SizeReg
		move.l	-4(/1),/2
		subq.l	#4,/2
		ENDM

;---------------------------------------------------------------------------

	ENDC ; LIBRARIES_NONVOLATILE_I
