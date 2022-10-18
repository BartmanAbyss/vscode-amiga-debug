	IFND	DEVICES_SCSIDISK_I
DEVICES_SCSIDISK_I	EQU	1
**
**	$VER: scsidisk.i 36.2 (7.11.1990)
**	Includes Release 45.1
**
**	SCSI exec-level device command
**
**	(C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
**


    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC ; EXEC_TYPES_I


;---------------------------------------------------------------------
;
;   SCSI Command
;	Several Amiga SCSI controller manufacturers are converging on
;	standard ways to talk to their controllers.  This include
;	file describes an exec-device command (e.g. for hddisk.device)
;	that can be used to issue SCSI commands
;
;   UNIT NUMBERS
;	Unit numbers to the OpenDevice call have encoded in them which
;	SCSI device is being referred to.  The three decimal digits of
;	the unit number refer to the SCSI Target ID (bus address) in
;	the 1's digit, the SCSI logical unit (LUN) in the 10's digit,
;	and the controller board in the 100's digit.
;
;	Examples:
;		  0	drive at address 0
;		 12	LUN 1 on multiple drive controller at address 2
;		104	second controller board, address 4
;		 88	not valid: both logical units and addresses
;			range from 0..7.
;
;   CAVEATS
;	Original 2090 code did not support this command.
;
;	Commodore 2090/2090A unit numbers are different.  The SCSI
;	logical unit is the 100's digit, and the SCSI Target ID
;	is a permuted 1's digit: Target ID 0..6 maps to unit 3..9
;	(7 is reserved for the controller).
;
;	    Examples:
;		  3	drive at address 0
;		109	drive at address 6, logical unit 1
;		  1	not valid: this is not a SCSI unit.  Perhaps
;			it's an ST506 unit.
;
;	Some controller boards generate a unique name (e.g. 2090A's
;	iddisk.device) for the second controller board, instead of
;	implementing the 100's digit.
;
;	There are optional restrictions on the alignment, bus
;	accessability, and size of the data for the data phase.
;	Be conservative to work with all manufacturer's controllers.
;
;---------------------------------------------------------------------

HD_SCSICMD	EQU	28	; issue a SCSI command to the unit
				; io_Data points to a SCSICmd
				; io_Length is sizeof(struct SCSICmd)
				; io_Actual and io_Offset are not used

 STRUCTURE	SCSICmd,0
    APTR    scsi_Data		; word aligned data for SCSI Data Phase
				; (optional) data need not be byte aligned
				; (optional) data need not be bus accessable
    ULONG   scsi_Length		; even length of Data area
				; (optional) data can have odd length
				; (optional) data length can be > 2**24
    ULONG   scsi_Actual		; actual Data used
    APTR    scsi_Command	; SCSI Command (same options as scsi_Data)
    UWORD   scsi_CmdLength	; length of Command
    UWORD   scsi_CmdActual	; actual Command used
    UBYTE   scsi_Flags		; includes intended data direction
    UBYTE   scsi_Status		; SCSI status of command
    APTR    scsi_SenseData	; sense data: filled if SCSIF_[OLD]AUTOSENSE
				; is set and scsi_Status has CHECK CONDITION
				; (bit 1) set
    UWORD   scsi_SenseLength	; size of scsi_SenseData, also bytes to
				; request w/ SCSIF_AUTOSENSE, must be 4..255
    UWORD   scsi_SenseActual	; amount actually fetched (0 means no sense)
    LABEL   scsi_SIZEOF


;------ scsi_Flags ------
SCSIF_WRITE		EQU	0	; intended data direction is out
SCSIF_READ		EQU	1	; intended data direction is in
SCSIB_READ_WRITE	EQU	0	; (the bit to test)
 
SCSIF_NOSENSE		EQU	0	; no automatic request sense
SCSIF_AUTOSENSE		EQU	2	; do standard extended request sense
					; on check condition
SCSIF_OLDAUTOSENSE	EQU	6	; do 4 byte non-extended request
					; sense on check condition
SCSIB_AUTOSENSE		EQU	1	; (the bit to test)
SCSIB_OLDAUTOSENSE	EQU	2	; (the bit to test)

;------ SCSI io_Error values ------
HFERR_SelfUnit		EQU	40	; cannot issue SCSI command to self
HFERR_DMA		EQU	41	; DMA error
HFERR_Phase		EQU	42	; illegal or unexpected SCSI phase
HFERR_Parity		EQU	43	; SCSI parity error
HFERR_SelTimeout	EQU	44	; Select timed out
HFERR_BadStatus		EQU	45	; status and/or sense error

;------ OpenDevice io_Error values ------
HFERR_NoBoard		EQU	50	; Open failed for non-existant board

	ENDC	; DEVICES_SCSIDISK_I
