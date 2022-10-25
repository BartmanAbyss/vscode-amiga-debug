	IFND	DEVICES_CLIPBOARD_I
DEVICES_CLIPBOARD_I  EQU   1
**
**	$VER: clipboard.i 36.5 (2.11.1990)
**	Includes Release 45.1
**
**	clipboard.device structure definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC
	IFND	EXEC_NODES_I
	INCLUDE	"exec/nodes.i"
	ENDC
	IFND	EXEC_LISTS_I
	INCLUDE	"exec/lists.i"
	ENDC
	IFND	EXEC_PORTS_I
	INCLUDE	"exec/ports.i"
	ENDC
	IFND	EXEC_IO_I
	INCLUDE	"exec/io.i"
	ENDC

	DEVINIT

	DEVCMD	CBD_POST
	DEVCMD	CBD_CURRENTREADID
	DEVCMD	CBD_CURRENTWRITEID
	DEVCMD	CBD_CHANGEHOOK

CBERR_OBSOLETEID	EQU	1


 STRUCTURE  ClipboardUnitPartial,0
    STRUCT  cu_Node,LN_SIZE	; list of units
    ULONG   cu_UnitNum		; unit number for this unit
    ; the remaining unit data is private to the device


 STRUCTURE  IOClipReq,0
    STRUCT  io_Message,MN_SIZE
    APTR    io_Device		; device node pointer
    APTR    io_Unit		; unit node pointer (ClipboardUnitPartial)
    UWORD   io_Command		; device command
    UBYTE   io_Flags		; including QUICK and SATISFY
    BYTE    io_Error		; error or warning num
    ULONG   io_Actual		; number of bytes transferred
    ULONG   io_Length		; number of bytes requested
    APTR    io_Data		; either clip stream or post port
    ULONG   io_Offset		; offset in clip stream
    LONG    io_ClipID		; ordinal clip identifier
    LABEL   iocr_SIZEOF



PRIMARY_CLIP	EQU	0	; primary clip unit

 STRUCTURE  SatisfyMsg,0
    STRUCT  sm_Msg,MN_SIZE	; the length will be 6
    UWORD   sm_Unit		; which clip unit this is
    LONG    sm_ClipID		; the clip identifier of the post
    LABEL   satisfyMsg_SIZEOF

 STRUCTURE  ClipHookMsg,0
    ULONG   chm_Type		; zero for this structure format
    LONG    chm_ChangeCmd;	; command that caused this hook invocation:
				;   either CMD_UPDATE or CBD_POST
    LONG    chm_ClipID		; the clip identifier of the new data

	ENDC	; DEVICES_CLIPBOARD_I
