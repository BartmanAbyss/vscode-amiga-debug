	IFND DEVICES_SERIAL_I
DEVICES_SERIAL_I SET 1
**
**	$VER: serial.i 33.6 (6.11.1990)
**	Includes Release 45.1
**
**	external declarations for the serial device
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**
    IFND     EXEC_IO_I
    include "exec/io.i"
    ENDC    !EXEC_IO_I

*--------------------------------------------------------------------
*
* Useful constants
*
*--------------------------------------------------------------------
*
SER_DEFAULT_CTLCHAR EQU $11130000  ; default chars for xON,xOFF
; You may change these via SETPARAMS.  At this time, parity is not
; calculated for xON/xOFF characters.  You must supply them with the
; desired parity.

*
*--------------------------------------------------------------------
*
* Driver Specific Commands

SDCMD_QUERY	EQU	CMD_NONSTD	;$09
SDCMD_BREAK	EQU	CMD_NONSTD+1	;$0A
SDCMD_SETPARAMS EQU	CMD_NONSTD+2	;$0B

SER_DEVFINISH	EQU	CMD_NONSTD+2 ; number of device comands

*--------------------------------------------------------------------

SERIALNAME:	MACRO
		dc.b	'serial.device',0
		dc.w	0
		ENDM

	BITDEF	SER,XDISABLED,7	  ; SERFLAGS xOn-xOff feature disabled bit
	BITDEF	SER,EOFMODE,6	  ;    "     EOF mode enabled bit
	BITDEF	SER,SHARED,5	  ;    "     non-exclusive access
	BITDEF	SER,RAD_BOOGIE,4  ;    "     high-speed mode active
	BITDEF	SER,QUEUEDBRK,3	  ;    "     queue this Break ioRqst
	BITDEF	SER,7WIRE,2	  ;    "     RS232 7-wire protocol 
	BITDEF	SER,PARTY_ODD,1	  ;    "     use-odd-parity bit
	BITDEF	SER,PARTY_ON,0	  ;    "     parity-enabled bit 
;
;WARNING: The next series of BITDEFs refer to the HIGH order BYTE of
;IO_STATUS.  Example usage: "BTST.B #IOST_XOFFWRITE,IO_STATUS+1(AX)"
;
	BITDEF	IOST,XOFFREAD,4	  ; IOST_HOB receive currently xOFF'ed
	BITDEF	IOST,XOFFWRITE,3  ;	"    transmit currently xOFF'ed
	BITDEF	IOST,READBREAK,2  ;	"    break was latest input
	BITDEF	IOST,WROTEBREAK,1 ;	"    break was latest output
	BITDEF	IOST,OVERRUN,0	  ;	"    status word RBF overrun
;
;	BITDEF's in a longword field)
;	Example usage: BSET.B #SEXTB_MSPON,IO_EXTFLAGS+3(AX)
				;IO_EXTFLAGS (extended flag longword)
	BITDEF	SEXT,MSPON,1	;     "	   use mark-space parity,not odd-even
	BITDEF	SEXT,MARK,0	;     "	   if mark-space, use mark
*
******************************************************************************
 STRUCTURE TERMARRAY,0
	ULONG	 TERMARRAY_0
	ULONG	 TERMARRAY_1
	LABEL	 TERMARRAY_SIZE

*****************************************************************
* CAUTION !!  IF YOU ACCESS the serial.device, you MUST (!!!!) use an
* IOEXTSER-sized structure or you may overlay innocent memory, okay ?!
*****************************************************************

 STRUCTURE IOEXTSER,IOSTD_SIZE

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
*  1F	BYTE	 IO_ERROR
*     STRUCT   IOStdExt
*  20	ULONG	 IO_ACTUAL
*  24	ULONG	 IO_LENGTH
*  28	APTR	 IO_DATA
*  2C	ULONG	 IO_OFFSET
*
*  30
	ULONG	IO_CTLCHAR	; control char's (order = xON,xOFF,rsvd,rsvd)
	ULONG	IO_RBUFLEN	; length in bytes of serial port's read buffer
	ULONG	IO_EXTFLAGS	; additional serial flags (see bitdefs above)
	ULONG	IO_BAUD		; baud rate requested (true baud)
	ULONG	IO_BRKTIME	; duration of break signal in MICROseconds
	STRUCT	IO_TERMARRAY,TERMARRAY_SIZE ; termination character array
	UBYTE	IO_READLEN	; bits per read char (bit count)
	UBYTE	IO_WRITELEN	; bits per write char (bit count)
	UBYTE	IO_STOPBITS	; stopbits for read (count)
	UBYTE	IO_SERFLAGS	; see SERFLAGS bit definitions above
	UWORD	IO_STATUS	; status of serial port, as follows:
*
*		   BIT	ACTIVE	FUNCTION
*		    0	 ---	reserved
*		    1	 ---	reserved
*		    2	 high	Connected to parallel "select" on the A1000.
*				Connected to both the parallel "select" and
*				serial "ring indicator" pins on the A500
*				& A2000.  Take care when making cables.
*		    3	 low	Data Set Ready
*		    4	 low	Clear To Send
*		    5	 low	Carrier Detect
*		    6	 low	Ready To Send
*		    7	 low	Data Terminal Ready
*		    8	 high	read overrun
*		    9	 high	break sent
*		   10	 high	break received
*		   11	 high	transmit x-OFF'ed	
*		   12	 high	receive x-OFF'ed
*		13-15		reserved
*
	LABEL	IOEXTSER_SIZE

******************************************************************************

*--------------------------------------------------------------------
*
* Driver error definitions
*
*--------------------------------------------------------------------

SerErr_DevBusy		EQU	1
SerErr_BaudMismatch	EQU	2	;baud rate not supported by hardware
SerErr_BufErr		EQU	4	;Failed to allocate new read buffer
SerErr_InvParam		EQU	5
SerErr_LineErr		EQU	6
SerErr_ParityErr	EQU	9
SerErr_TimerErr		EQU    11	;(See the serial/OpenDevice autodoc)
SerErr_BufOverflow	EQU    12
SerErr_NoDSR		EQU    13
SerErr_DetectedBreak	EQU    15


 IFD	DEVICES_SERIAL_I_OBSOLETE
SER_DBAUD		EQU	9600	;unused
SerErr_InvBaud		EQU	3	;unused
SerErr_NotOpen		EQU	7	;unused
SerErr_PortReset	EQU	8	;unused
SerErr_InitErr		EQU    10	;unused
SerErr_NoCTS		EQU    14	;unused
	BITDEF	IOSER,QUEUED,6	  ; IO_FLAGS rqst-queued bit
	BITDEF	IOSER,ABORT,5	  ;	"    rqst-aborted bit
	BITDEF	IOSER,ACTIVE,4	  ;	"    rqst-qued-or-current bit
 ENDC


    ENDC    !DEVICES_SERIAL_I
