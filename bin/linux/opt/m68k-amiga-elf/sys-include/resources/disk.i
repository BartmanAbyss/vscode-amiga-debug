	IFND	RESOURCES_DISK_I
RESOURCES_DISK_I	SET	1
**
**	$VER: disk.i 27.10 (21.11.1990)
**	Includes Release 45.1
**
**	disk.i -- external declarations for the disk resource
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC	!EXEC_TYPES_I

	IFND	EXEC_LISTS_I
	INCLUDE	"exec/lists.i"
	ENDC	!EXEC_LISTS_I

	IFND	EXEC_PORTS_I
	INCLUDE	"exec/ports.i"
	ENDC	!EXEC_PORTS_I

	IFND	EXEC_INTERRUPTS_I
	INCLUDE	"exec/interrupts.i"
	ENDC	!EXEC_INTERRUPTS_I

	IFND	EXEC_LIBRARIES_I
	INCLUDE	"exec/libraries.i"
	ENDC	!EXEC_LIBRARIES_I


*********************************************************************
*
* Resource structures
*
*********************************************************************

    STRUCTURE DISCRESOURCEUNIT,MN_SIZE
	STRUCT	DRU_DISCBLOCK,IS_SIZE
	STRUCT	DRU_DISCSYNC,IS_SIZE
	STRUCT	DRU_INDEX,IS_SIZE
	LABEL	DRU_SIZE



    STRUCTURE DISCRESOURCE,LIB_SIZE
	APTR	DR_CURRENT	; pointer to current unit structure
	UBYTE	DR_FLAGS
	UBYTE	DR_pad
	APTR	DR_SYSLIB
	APTR	DR_CIARESOURCE
	STRUCT	DR_UNITID,4*4
	STRUCT	DR_WAITING,LH_SIZE
	STRUCT	DR_DISCBLOCK,IS_SIZE
	STRUCT	DR_DISCSYNC,IS_SIZE
	STRUCT	DR_INDEX,IS_SIZE
	APTR	DR_CURRTASK	; pointer to owning task for GiveUnit
	LABEL	DR_SIZE

	BITDEF	DR,ALLOC0,0	; unit zero is allocated
	BITDEF	DR,ALLOC1,1	; unit one is allocated
	BITDEF	DR,ALLOC2,2	; unit two is allocated
	BITDEF	DR,ALLOC3,3	; unit three is allocated
	BITDEF	DR,ACTIVE,7	; is the disc currently busy?


*********************************************************************
*
* Hardware Magic
*
*********************************************************************


DSKDMAOFF	EQU	$4000	; idle command for dsklen register


*********************************************************************
*
* Resource specific commands
*
*********************************************************************

*-- DR_NAME is a generic macro to get the name of the resource.  This
*-- way if the name is ever changed you will pick up the change
*-- automatically.
*--
*-- Normal usage would be:
*--
*-- internalName:	DISKNAME
*--

DISKNAME:	MACRO
		DC.B	'disk.resource',0
		DS.W	0
		ENDM

	LIBINIT LIB_BASE
	LIBDEF	DR_ALLOCUNIT
	LIBDEF	DR_FREEUNIT
	LIBDEF	DR_GETUNIT
	LIBDEF	DR_GIVEUNIT
	LIBDEF	DR_GETUNITID
	LIBDEF	DR_READUNITID

DR_LASTCOMM	EQU	DR_READUNITID


*********************************************************************
*
* drive types
*
*********************************************************************

DRT_AMIGA	EQU	$00000000
DRT_37422D2S	EQU	$55555555
DRT_EMPTY	EQU	$FFFFFFFF
DRT_150RPM	EQU	$AAAAAAAA

	ENDC	; RESOURCES_DISK_I
