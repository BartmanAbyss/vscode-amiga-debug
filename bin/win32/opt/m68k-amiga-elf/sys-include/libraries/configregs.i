	IFND	LIBRARIES_CONFIGREGS_I
LIBRARIES_CONFIGREGS_I	SET	1
**
**	$VER: configregs.i 36.11 (3.11.1990)
**	Includes Release 45.1
**
**	AutoConfig (tm) hardware register and bit definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC	;EXEC_TYPES_I

**
** AutoConfig (tm) boards each contain a 32 byte "ExpansionRom" area that is
** read by the system software at configuration time.  Configuration of each
** board starts when the ConfigIn* signal is passed from the previous board
** (or from the system for the first board).  Each board will present it's
** ExpansionRom structure at location $00E80000 to be read by the system.
** This file defines the appearance of the ExpansionRom area.
**
** Expansion boards are actually organized such that only one nybble per
** 16 bit word contains valid information.  The low nybbles of each
** word are combined to fill the structure below. (This table is structured
** as LOGICAL information.  This means that it never corresponds exactly
** with a physical implementation.)
**
** The ExpansionRom space is further split into two regions:  The first 16
** bytes are read-only.  Except for the er_type field, this area is inverted
** by the system software when read in.  The second 16 bytes contain the
** control portion, where all read/write registers are located.
**
** The system builds one "ConfigDev" structure for each board found.  The
** list of boards can be examined using the expansion.library/FindConfigDev
** function.
**
** A special "hacker" Manufacturer ID number is reserved for test use:
** 2011 ($7DB).  When inverted this will look like $F824.
**

 STRUCTURE ExpansionRom,0	;-First 16 bytes of the expansion ROM
    UBYTE	er_Type 	;Board type, size and flags
    UBYTE	er_Product	;Product number, assigned by manufacturer
    UBYTE	er_Flags	;Flags
    UBYTE	er_Reserved03	;Must be zero ($ff inverted)
    UWORD	er_Manufacturer ;Unique ID,ASSIGNED BY AMIGA, INC.!
    ULONG	er_SerialNumber ;Available for use by manufacturer
    UWORD	er_InitDiagVec	;Offset to optional "DiagArea" structure
    UBYTE	er_Reserved0c
    UBYTE	er_Reserved0d
    UBYTE	er_Reserved0e
    UBYTE	er_Reserved0f
    LABEL	ExpansionRom_SIZEOF


**
** Note that use of the ec_BaseAddress register is tricky.  The system
** will actually write twice.  First the low order nybble is written
** to the ec_BaseAddress register+2 (D15-D12).  Then the entire byte is
** written to ec_BaseAddress (D15-D8).  This allows writing of a byte-wide
** address to nybble size registers.
**

 STRUCTURE ExpansionControl,0	;-Second 16 bytes of the expansion ROM
    UBYTE	ec_Interrupt	;Optional interrupt control register
    UBYTE	ec_Z3_HighBase	;Zorro III   : Bits 24-31 of config address
    UBYTE	ec_BaseAddress	;Zorro II/III: Bits 16-23 of config address
    UBYTE	ec_Shutup	;The system writes here to shut up a board
    UBYTE	ec_Reserved14
    UBYTE	ec_Reserved15
    UBYTE	ec_Reserved16
    UBYTE	ec_Reserved17
    UBYTE	ec_Reserved18
    UBYTE	ec_Reserved19
    UBYTE	ec_Reserved1a
    UBYTE	ec_Reserved1b
    UBYTE	ec_Reserved1c
    UBYTE	ec_Reserved1d
    UBYTE	ec_Reserved1e
    UBYTE	ec_Reserved1f
    LABEL	ExpansionControl_SIZEOF

**
** many of the constants below consist of a triplet of equivalent
** definitions: xxMASK is a bit mask of those bits that matter.
** xxBIT is the starting bit number of the field.  xxSIZE is the
** number of bits that make up the definition.	This method is
** used when the field is larger than one bit.
**
** If the field is only one bit wide then the xxB_xx and xxF_xx convention
** is used (xxB_xx is the bit number, and xxF_xx is mask of the bit).
**

** manifest constants **
E_SLOTSIZE		EQU	$10000
E_SLOTMASK		EQU	$ffff
E_SLOTSHIFT		EQU	16


** these define the free regions of Zorro memory space.
** THESE MAY WELL CHANGE FOR FUTURE PRODUCTS!
E_EXPANSIONBASE 	EQU	$00e80000	;Zorro II  config address
EZ3_EXPANSIONBASE	EQU	$ff000000	;Zorro III config address

E_EXPANSIONSIZE 	EQU	$00080000	;Zorro II  I/O type cards
E_EXPANSIONSLOTS	EQU	8

E_MEMORYBASE		EQU	$00200000	;Zorro II  8MB space
E_MEMORYSIZE		EQU	$00800000
E_MEMORYSLOTS		EQU	128

EZ3_CONFIGAREA		EQU	$40000000	;Zorro III space
EZ3_CONFIGAREAEND	EQU	$7FFFFFFF	;Zorro III space
EZ3_SIZEGRANULARITY	EQU	$00080000	;512K increments


***** er_Type definitions (ttldcmmm) ****************************************

** er_Type board type bits -- the OS ignores "old style" boards **
ERT_TYPEMASK		EQU	$c0	;Bits 7-6
ERT_TYPEBIT		EQU	6
ERT_TYPESIZE		EQU	2
ERT_NEWBOARD		EQU	$c0
ERT_ZORROII		EQU	ERT_NEWBOARD
ERT_ZORROIII		EQU	$80

** other bits defined in er_Type **
	BITDEF	ERT,MEMLIST,5		; Link RAM into free memory list
	BITDEF	ERT,DIAGVALID,4 	; ROM vector is valid
	BITDEF	ERT,CHAINEDCONFIG,3	; Next config is part of the same card

** er_Type field memory size bits **
ERT_MEMMASK		EQU	$07	;Bits 2-0
ERT_MEMBIT		EQU	0
ERT_MEMSIZE		EQU	3



***** er_Flags byte -- for those things that didn't fit into the type byte ****
***** the hardware stores this byte in inverted form			   ****
	BITDEF	ERF,MEMSPACE,7		; Wants to be in 8 meg space.
					; (NOT IMPLEMENTED)

	BITDEF	ERF,NOSHUTUP,6		; Board can't be shut up.

	BITDEF	ERF,EXTENDED,5		; Zorro III: Use extended size table
					;	     for bits 0-2 of er_Type.
					; Zorro II : Must be 0

	BITDEF	ERF,ZORRO_III,4 	; Zorro III: must be 1
					; Zorro II : must be 0

ERT_Z3_SSMASK		EQU	$0F	; Bits 3-0.  Zorro III Sub-Size.  How
ERT_Z3_SSBIT		EQU	0	; much space the card actually uses
ERT_Z3_SSSIZE		EQU	4	; (regardless of config granularity)
					; Zorro II : must be 0


** ec_Interrupt register (unused) *********************************************
	BITDEF	ECI,INTENA,1
	BITDEF	ECI,RESET,3
	BITDEF	ECI,INT2PEND,4
	BITDEF	ECI,INT6PEND,5
	BITDEF	ECI,INT7PEND,6
	BITDEF	ECI,INTERRUPTING,7


**************************************************************************
**
** these are the specifications for the diagnostic area.  If the Diagnostic
** Address Valid bit is set in the Board Type byte (the first byte in
** expansion space) then the Diag Init vector contains a valid offset.
**
** The Diag Init vector is actually a word offset from the base of the
** board.  The resulting address points to the base of the DiagArea
** structure.  The structure may be physically implemented either four,
** eight, or sixteen bits wide.  The code will be copied out into
** ram first before being called.
**
** The da_Size field, and both code offsets (da_DiagPoint and da_BootPoint)
** are offsets from the diag area AFTER it has been copied into ram, and
** "de-nybbleized" (if needed). (In other words, the byte size is the size of
** the actual information, not how much address space is required to
** store it.)
**
** All bits are encoded with uninverted logic (e.g. 5 volts on the bus
** is a logic one).
**
** If your board is to make use of the boot facility then it must leave
** its config area available even after it has been configured.  Your
** boot vector will be called AFTER your board's final address has been
** set.
**
**************************************************************************

 STRUCTURE DiagArea,0
    UBYTE	da_Config	; see below for definitions
    UBYTE	da_Flags	; see below for definitions
    UWORD	da_Size	; the size (in bytes) of the total diag area
    UWORD	da_DiagPoint	; where to start for diagnostics, or zero
    UWORD	da_BootPoint	; where to start for booting
    UWORD	da_Name	; offset in diag area where a string
				;   identifier can be found (or zero if no
				;   identifier is present).

    UWORD	da_Reserved01	; two words of reserved data.  must be zero.
    UWORD	da_Reserved02
    LABEL	DiagArea_SIZEOF

; da_Config definitions
**
** DAC_BYTEWIDE can be simulated using DAC_NIBBLEWIDE.
**
DAC_BUSWIDTH	EQU	$C0	; two bits for bus width
DAC_NIBBLEWIDE	EQU	$00	; (indicates information is nybble wide)
DAC_BYTEWIDE	EQU	$40	; BUG: Will not work under V34 Kickstart!
DAC_WORDWIDE	EQU	$80

DAC_BOOTTIME	EQU	$30	; two bits for when to boot
DAC_NEVER	EQU	$00	; obvious
DAC_CONFIGTIME	EQU	$10	; call da_BootPoint when first configing
				;   the device
DAC_BINDTIME	EQU	$20	; run when binding drivers to boards

**
** These are the calling conventions for the diagnostic callback
** (from da_DiagPoint).
**
** A7 -- points to at least 2K of stack
** A6 -- ExecBase
** A5 -- ExpansionBase
** A3 -- your board's ConfigDev structure
** A2 -- Base of diag/init area that was copied
** A0 -- Base of your board
**
** Your board must return a value in D0.  If this value is NULL, then
** the diag/init area that was copied in will be returned to the free
** memory pool.
**

	ENDC	;LIBRARIES_CONFIGREGS_I
