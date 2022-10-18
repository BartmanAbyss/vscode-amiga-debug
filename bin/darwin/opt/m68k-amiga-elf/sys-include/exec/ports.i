	IFND	EXEC_PORTS_I
EXEC_PORTS_I	SET	1
**
**	$VER: ports.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Message ports and Messages.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC	; EXEC_NODES_I

    IFND EXEC_LISTS_I
    INCLUDE "exec/lists.i"
    ENDC	; EXEC_LISTS_I


*----------------------------------------------------------------
*
*   Message Port Structure
*
*----------------------------------------------------------------

 STRUCTURE  MP,LN_SIZE
    UBYTE   MP_FLAGS
    UBYTE   MP_SIGBIT		    ; signal bit number
    APTR    MP_SIGTASK		    ; object to be signalled
    STRUCT  MP_MSGLIST,LH_SIZE	    ; message linked list
    LABEL   MP_SIZE


*------ unions:
MP_SOFTINT	EQU  MP_SIGTASK


*------ MP_FLAGS: Port arrival actions (PutMsg)
PF_ACTION	EQU  3	; Mask
PA_SIGNAL	EQU  0	; Signal task in MP_SIGTASK
PA_SOFTINT	EQU  1	; Signal SoftInt in MP_SOFTINT/MP_SIGTASK
PA_IGNORE	EQU  2	; Ignore arrival


*----------------------------------------------------------------
*
*   Message Structure
*
*----------------------------------------------------------------

 STRUCTURE  MN,LN_SIZE
    APTR    MN_REPLYPORT	; message reply port
    UWORD   MN_LENGTH		; total message length in bytes
				; (include MN_SIZE in the length)
    LABEL   MN_SIZE

	ENDC	; EXEC_PORTS_I
