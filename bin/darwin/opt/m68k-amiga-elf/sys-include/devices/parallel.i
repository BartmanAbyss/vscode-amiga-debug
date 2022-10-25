    IFND     DEVICES_PARALLEL_I
DEVICES_PARALLEL_I SET 1
**
**	$VER: parallel.i 34.9 (25.5.89)
**	Includes Release 45.1
**
**	external declarations for the parallel device
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**
    IFND     EXEC_IO_I
    include "exec/io.i"
    ENDC    !EXEC_IO_I

*--------------------------------------------------------------------
*
* Driver error definitions
*
*--------------------------------------------------------------------

ParErr_DevBusy		EQU	1
ParErr_BufTooBig		EQU	2
ParErr_InvParam		EQU	3
ParErr_LineErr		EQU	4
ParErr_NotOpen		EQU	5
ParErr_PortReset	EQU	6
ParErr_InitErr		EQU	7

*--------------------------------------------------------------------
*
* Useful constants
*
*--------------------------------------------------------------------
*
PDCMD_QUERY	   EQU	   CMD_NONSTD
PDCMD_SETPARAMS    EQU	   CMD_NONSTD+1
Par_DEVFINISH	   EQU	   10	     ; number of device comands
*
*--------------------------------------------------------------------
*
* Driver Specific Commands
*
*--------------------------------------------------------------------

PARALLELNAME:	MACRO
		dc.b	'parallel.device',0
		ds.w	0
		ENDM

	BITDEF	PAR,SHARED,5	  ; PARFLAGS non-exclusive access
	BITDEF	PAR,SLOWMODE,4	  ;    "     slow mode selected bit
	BITDEF	PAR,FASTMODE,3    ;    "     fast mode selected bit
	BITDEF	PAR,RAD_BOOGIE,3  ;    "     for backward compatibility
	BITDEF	PAR,ACKMODE,2     ;    "     ACK handshaking selected bit
	BITDEF	PAR,EOFMODE,1	  ;    "     EOF mode enabled bit
        BITDEF  IOPAR,QUEUED,6    ; IO_FLAGS rqst-queued bit
        BITDEF	IOPAR,ABORT,5     ;    "     rqst-aborted bit
	BITDEF	IOPAR,ACTIVE,4	  ;    "     rqst-qued-or-current bit
        BITDEF	IOPT,RWDIR,3      ; IO_STATUS read=0,write=1
        BITDEF	IOPT,PARSEL,2     ;    "     printer selected on the A1000
				  ; printer selected & serial "Ring Indicator" on
				  ; the A500/A2000.  Be careful when making cables.
	BITDEF	IOPT,PAPEROUT,1   ;    "     paper out
        BITDEF	IOPT,PARBUSY,0    ;    "     printer in busy toggle
;Note: Previous versions of this include file had bits 0 and 2 swapped
*
************************************************************************

 STRUCTURE PTERMARRAY,0
	ULONG	 PTERMARRAY_0
	ULONG	 PTERMARRAY_1
	LABEL	 PTERMARRAY_SIZE

*****************************************************************
*  CAUTION !!!	IF YOU ACCESS the parallel.device, you MUST (!!!!) use an
*  IOEXTPAR-sized structure or you may overlay innocent memory, okay ?!
*****************************************************************

 STRUCTURE IOEXTPAR,IOSTD_SIZE

*     STRUCT   MsgNode
*   0	APTR	 Succ
*   4	APTR	 Pred
*   8	UBYTE	 Type
*   9	UBYTE	 Pri
*   A	APTR	 Name
*   E	APTR	 ReplyPort
*  12	UWORD	 MNLength
*     STRUCT   IOExt
*  14	APTR	 IO_DEVICE
*  18	APTR	 IO_UNIT
*  1C	UWORD	 IO_COMMAND
*  1E	UBYTE	 IO_FLAGS
*  1F	UBYTE	 IO_ERROR
*     STRUCT   IOStdExt
*  20	ULONG	 IO_ACTUAL
*  24	ULONG	 IO_LENGTH
*  28	APTR	 IO_DATA
*  2C	ULONG	 IO_OFFSET
*

*
*  30
	ULONG	IO_PEXTFLAGS	; (not used) flag extension area
	UBYTE	IO_PARSTATUS	; device status (see bit defs above)
	UBYTE	IO_PARFLAGS	; see PARFLAGS bit definitions above
	STRUCT	IO_PTERMARRAY,PTERMARRAY_SIZE ; termination char array
	LABEL	IOEXTPar_SIZE

****************************************************************************

    ENDC    !DEVICES_PARALLEL_I
