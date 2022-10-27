	IFND	DOS_NOTIFY_I
DOS_NOTIFY_I	SET	1
**
**	$VER: notify.i 36.5 (29.8.1990)
**	Includes Release 45.1
**
**	dos notification definitions
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_PORTS_I
	INCLUDE	"exec/ports.i"
	ENDC
	IFND	EXEC_TASKS_I
	INCLUDE	"exec/tasks.i"
	ENDC

* use of Class and code is discouraged for the time being - we might want to
* change things
*------ NotifyMessage Class ------------------------------------------
NOTIFY_CLASS	EQU	$40000000

*------ NotifyMessage Code --------------------------------------------
NOTIFY_CODE	EQU	$1234


* Sent to the application if SEND_MESSAGE is specified.

 STRUCTURE NotifyMessage,0
    STRUCT nm_ExecMessage,MN_SIZE
    ULONG  nm_Class
    UWORD  nm_Code
    APTR   nm_NReq			; don't modify the request!
    ULONG  nm_DoNotTouch		; like it says!  For use by handlers
    ULONG  nm_DoNotTouch2		; ditto
    LABEL  NotifyMessage_SIZEOF

* Do not modify or reuse the notifyrequest while it is active.

 STRUCTURE NotifyRequest,0
    CPTR   nr_Name			; Application sets this
    CPTR   nr_FullName			; fully expanded name created by Dos
					; (handlers need nr_FullName)
    ULONG  nr_UserData			; for the application's use
    ULONG  nr_Flags

    ;-- nr_Msg:
    APTR   nr_Port			; struct MsgPort * for SEND_MESSAGE

    ;-- nr_Signal:
nr_Task	EQU nr_Port			; struct Task * for SEND_SIGNAL
    UBYTE  nr_SignalNum			; for SEND_SIGNAL
    STRUCT nr_pad,3

    ;-- Reserved fields:
    STRUCT nr_Reserved,4*4

    ;-- internal for use by handlers/dos:
    ULONG  nr_MsgCount			; # of outstanding msgs
    APTR   nr_Handler			; handler sent to (for EndNotify)
    LABEL  NotifyRequest_SIZEOF


;------ NotifyRequest Flags ------------------------------------------
	BITDEF	NR,SEND_MESSAGE,0
	BITDEF	NR,SEND_SIGNAL,1
	BITDEF	NR,WAIT_REPLY,3
	BITDEF	NR,NOTIFY_INITIAL,4

* do NOT set or remove NRF_MAGIC!  Only for use by handlers!
	BITDEF	NR,MAGIC,31

* Flags reserved for private use by the handler:
NR_HANDLER_FLAGS	EQU	$ffff0000

	ENDC	; DOS_NOTIFY_I

