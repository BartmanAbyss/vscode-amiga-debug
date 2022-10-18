	IFND	LIBRARIES_CONFIGVARS_I
LIBRARIES_CONFIGVARS_I	SET	1
**
**	$VER: configvars.i 36.7 (9.4.1991)
**	Includes Release 45.1
**
**	Software structures used by AutoConfig (tm) boards
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_NODES_I
	INCLUDE	"exec/nodes.i"
	ENDC	;EXEC_NODES_I

	IFND	LIBRARIES_CONFIGREGS_I
	INCLUDE	"libraries/configregs.i"
	ENDC	;LIBRARIES_CONFIGREGS_I

**
** At early system startup time, one ConfigDev structure is created for
** each board found in the system.  Software may seach for ConfigDev
** structures by vendor & product ID number.  For debugging and diagnostic
** use, the entire list can be accessed.  See the expansion.library document
** for more information.
**
 STRUCTURE ConfigDev,0
    STRUCT	cd_Node,LN_SIZE
    UBYTE	cd_Flags	; (read/write)
    UBYTE	cd_Pad		; reserved
    STRUCT	cd_Rom,ExpansionRom_SIZEOF ; copy of board's expansion ROM
    APTR	cd_BoardAddr	; where in memory the board was placed
    ULONG	cd_BoardSize	; size of board in bytes
    UWORD	cd_SlotAddr	; which slot number (PRIVATE)
    UWORD	cd_SlotSize	; number of slots (PRIVATE)
    APTR	cd_Driver	; pointer to node of driver
    APTR 	cd_NextCD	; linked list of drivers to config 
    STRUCT	cd_Unused,4*4	; for whatever the driver wants!
    LABEL	ConfigDev_SIZEOF

; cd_Flags
	BITDEF	CD,SHUTUP,0	; this board has been shut up
	BITDEF	CD,CONFIGME,1	; this board needs a driver to claim it
	BITDEF	CD,BADMEMORY,2	; this board contains bad memory
	BITDEF	CD,PROCESSED,3	; private flag

**
** Boards are usually "bound" to software drivers.
** This structure is used by GetCurrentBinding() and SetCurrentBinding()
**
 STRUCTURE CurrentBinding,0
    APTR	cb_ConfigDev
    APTR	cb_FileName
    APTR 	cb_ProductString
    APTR	cb_ToolTypes
    LABEL	CurrentBinding_SIZEOF

	ENDC	;LIBRARIES_CONFIGVARS_I
