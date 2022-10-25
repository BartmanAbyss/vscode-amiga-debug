	IFND	LIBRARIES_EXPANSIONBASE_I
LIBRARIES_EXPANSIONBASE_I	SET	1
**
**	$VER: expansionbase.i 36.18 (21.10.1991)
**	Includes Release 45.1
**
**	Definitions for the expansion library base
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
**
	IFND	EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC	; EXEC_TYPES_I

	IFND	EXEC_LIBRARIES_I
	INCLUDE "exec/libraries.i"
	ENDC	; EXEC_LIBRARIES_I

	IFND	EXEC_SEMAPHORES_I
	INCLUDE "exec/semaphores.i"
	ENDC	; EXEC_SEMAPHORES_I

	IFND	LIBRARIES_CONFIGVARS_I
	INCLUDE "libraries/configvars.i"
	ENDC	; LIBRARIES_CONFIGVARS_I

**
** BootNodes are scanned by dos.library at startup.  Items found on the
** list are started by dos. BootNodes are added with the AddDosNode() or
** the V36 AddBootNode() calls.
**
  STRUCTURE	BootNode,LN_SIZE
	UWORD	bn_Flags
	APTR	bn_DeviceNode
	LABEL	BootNode_SIZEOF

**
** expansion.library has functions to manipulate most of the information in
** ExpansionBase.  Direct access is not permitted.  Use FindConfigDev()
** to scan the board list.
**
  STRUCTURE	ExpansionBase,LIB_SIZE
	UBYTE	eb_Flags				;read only (see below)
	UBYTE	eb_Private01				;private
	ULONG	eb_Private02				;private
	ULONG	eb_Private03				;private
	STRUCT	eb_Private04,CurrentBinding_SIZEOF	;private
	STRUCT	eb_Private05,LH_SIZE			;private
	STRUCT	eb_MountList,LH_SIZE	; contains struct BootNode entries
	;...						;private


; error codes
EE_OK		EQU 0
EE_LASTBOARD	EQU 40	; could not shut him up
EE_NOEXPANSION	EQU 41	; not enough expansion mem; board shut up
EE_NOMEMORY	EQU 42	; not enough normal memory
EE_NOBOARD	EQU 43	; no board at that address
EE_BADMEM	EQU 44	; tried to add a bad memory card

; Flags
	BITDEF	EB,CLOGGED,0	; someone could not be shutup
	BITDEF	EB,SHORTMEM,1	; ran out of expansion mem
	BITDEF	EB,BADMEM,2	; tried to add a bad memory card
	BITDEF	EB,DOSFLAG,3	; reserved for use by AmigaDOS
	BITDEF	EB,KICKBACK33,4	; reserved for use by AmigaDOS
	BITDEF	EB,KICKBACK36,5	; reserved for use by AmigaDOS
** If the following flag is set by a floppy's bootblock code, the initial
** open of the initial shell window will be delayed until the first output
** to that shell.  Otherwise the 1.3 compatible behavior applies.
	BITDEF	EB,SILENTSTART,6

*
* Magic kludge to tell the system if CC0 was started or not...
*
	BITDEF	EB,START_CC0,7


	ENDC	; LIBRARIES_EXPANSIONBASE_I
