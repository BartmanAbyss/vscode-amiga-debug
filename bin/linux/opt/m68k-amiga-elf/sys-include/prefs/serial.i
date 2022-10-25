	IFND	PREFS_SERIAL_I
PREFS_SERIAL_I	SET	1
**
**	$VER: serial.i 38.2 (10.7.1991)
**	Includes Release 45.1
**
**	File format for serial preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

;---------------------------------------------------------------------------

ID_SERL equ "SERL"


   STRUCTURE SerialPrefs,0
	STRUCT sp_Reserved,3*4		; System reserved
	ULONG  sp_Unit0Map		; What unit 0 really refers to
	ULONG  sp_BaudRate		; Baud rate

	ULONG  sp_InputBuffer		; Input buffer: 0 - 16000
	ULONG  sp_OutputBuffer		; Future: Output: 0 - 16000, def 0

	UBYTE  sp_InputHandshake	; Input handshaking
	UBYTE  sp_OutputHandshake	; Future: Output handshaking

	UBYTE  sp_Parity		; Parity
	UBYTE  sp_BitsPerChar		; I/O bits per character
	UBYTE  sp_StopBits		; Stop bits
   LABEL SerialPrefs_SIZEOF

; constants for SerialPrefs.sp_Parity
PARITY_NONE  equ 0
PARITY_EVEN  equ 1
PARITY_ODD   equ 2
PARITY_MARK  equ 3		; Future enhancement
PARITY_SPACE equ 4		; Future enhancement

; constants for SerialPrefs.sp_Input/OutputHandshaking
HSHAKE_XON  equ	0
HSHAKE_RTS  equ	1
HSHAKE_NONE equ	2

;---------------------------------------------------------------------------

	ENDC	; PREFS_SERIAL_I
