	IFND	EXEC_IO_I
EXEC_IO_I	SET	1
**
**	$VER: io.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Message structures used for device communication
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_PORTS_I
    INCLUDE "exec/ports.i"
    ENDC	; EXEC_PORTS_I

    IFND EXEC_LIBRARIES_I
    INCLUDE "exec/libraries.i"
    ENDC	; EXEC_LIBRARIES_I


;----------------------------------------------------------------
;
;   IO Request Structures
;
;----------------------------------------------------------------

;------ Required portion of IO request:

 STRUCTURE  IO,MN_SIZE
    APTR    IO_DEVICE			; device node pointer
    APTR    IO_UNIT			; unit (driver private)
    UWORD   IO_COMMAND			; device command
    UBYTE   IO_FLAGS			; special flags
    BYTE    IO_ERROR			; error or warning code
    LABEL   IO_SIZE


;------ Standard IO request extension:

    ULONG   IO_ACTUAL			; actual # of bytes transfered
    ULONG   IO_LENGTH			; requested # of bytes transfered
    APTR    IO_DATA			; pointer to data area
    ULONG   IO_OFFSET			; offset for seeking devices
    LABEL   IOSTD_SIZE


;------ IO_FLAGS bit definitions:

    BITDEF  IO,QUICK,0			; complete IO quickly


;----------------------------------------------------------------
;
;   Standard Device Library Functions
;
;----------------------------------------------------------------

	    LIBINIT

	    LIBDEF  DEV_BEGINIO	; process IO request
	    LIBDEF  DEV_ABORTIO	; abort IO request


;----------------------------------------------------------------
;
;   IO Function Macros
;
;----------------------------------------------------------------

BEGINIO     MACRO
	    LINKLIB DEV_BEGINIO,IO_DEVICE(A1)
	    ENDM

ABORTIO     MACRO
	    LINKLIB DEV_ABORTIO,IO_DEVICE(A1)
	    ENDM


;----------------------------------------------------------------
;
;   Standard Device Command Definitions
;
;----------------------------------------------------------------

;------ Command definition macro:
DEVINIT     MACRO   ; [baseOffset]
	    IFC     '\1',''
CMD_COUNT   SET     CMD_NONSTD
	    ENDC
	    IFNC    '\1',''
CMD_COUNT   SET     \1
	    ENDC
	    ENDM

DEVCMD	    MACRO   ; cmdname
\1	    EQU     CMD_COUNT
CMD_COUNT   SET     CMD_COUNT+1
	    ENDM


;------ Standard device commands:

	    DEVINIT 0

	    DEVCMD  CMD_INVALID	; invalid command
	    DEVCMD  CMD_RESET		; reset as if just inited
	    DEVCMD  CMD_READ		; standard read
	    DEVCMD  CMD_WRITE		; standard write
	    DEVCMD  CMD_UPDATE		; write out all buffers
	    DEVCMD  CMD_CLEAR		; clear all buffers
	    DEVCMD  CMD_STOP		; hold current and queued
	    DEVCMD  CMD_START		; restart after stop
	    DEVCMD  CMD_FLUSH		; abort entire queue


;------ First non-standard device command value:

	    DEVCMD  CMD_NONSTD

	ENDC	; EXEC_IO_I
