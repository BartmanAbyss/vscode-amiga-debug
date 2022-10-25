	IFND	RESOURCES_CARD_I
RESOURCES_CARD_I	SET	1

**
**	$VER: card.i 36.8 (30.11.1992)
**	Includes Release 45.1
**
**	card.resource include file
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	    All Rights Reserved
**
**
**

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC


	IFND	EXEC_NODES_I
	INCLUDE	"exec/nodes.i"
	ENDC


* Macro - card resource name

CARDRESNAME	MACRO
		dc.b	'card.resource',0
		ds.w	0
		ENDM

* Structures used by the card.resource

 STRUCTURE	CardHandle,0
	STRUCT	cah_CardNode,LN_SIZE
	APTR	cah_CardRemoved
	APTR	cah_CardInserted
	APTR	cah_CardStatus
	UBYTE	cah_CardFlags
	ALIGNWORD
	LABEL	CardHandle_SIZEOF

 STRUCTURE	DeviceTData,0
	ULONG	dtd_DTsize			;Size of card (bytes)
	ULONG	dtd_DTspeed			;Speed of card in nanoseconds
	UBYTE	dtd_DTtype			;Type of card
	UBYTE	dtd_DTflags			;other flags
	ALIGNWORD
	LABEL	DeviceTData_SIZEOF


 STRUCTURE	CardMemoryMap,0
	APTR	cmm_CommonMemory
	APTR	cmm_AttributeMemory
	APTR	cmm_IOMemory

* Extended for V39 - These are the size of the memory spaces above

	ULONG	cmm_CommonMemSize;
	ULONG	cmm_AttributeMemSize;
	ULONG	cmm_IOMemSize;

	LABEL	CardMemoryMap_SIZEOF

* CardHandle.cah_CardFlags for OwnCard() function

	; The CARDB_RESETREMOVE flag means you want the machine to
	; perform a HARDWARE RESET if the card in the credit-card slot is
	; removed while you own the CardSemaphore.

	BITDEF	CARD,RESETREMOVE,0	;Hardware reset on card remove

	; The CARDB_IFAVAILABLE flag means you only want your CardHandle
	; structure enqueued IF the credit card can be owned immediately.

	BITDEF	CARD,IFAVAILABLE,1

	; The CARDB_DELAYOWNERSHIP flag means you never want a successful
	; return from OwnCard() even if the credit-card is available.  Rather
	; you will be notified of ownership via your cah_CardInserted
	; interrupt vector.

	BITDEF	CARD,DELAYOWNERSHIP,2

	; The CARDB_POSTSTATUS flag is new for card.resource V39 (check
	; VERSION in resource base before using).  It tells the resource
	; that you want your Status Change Interrupt (if provided) to
	; be called twice in a row.  See OwnCard() for details.
	;

	BITDEF	CARD,POSTSTATUS,3

* ReleaseCard() function flags

	; The CARDB_REMOVEHANDLE flag means you want to remove your
	; CardHandle structure from the list of CardHandle structures
	; whether or not you own the credit-card in the slot.

	BITDEF	CARD,REMOVEHANDLE,0

* ReadStatus() return flags

	BITDEF	CARD_STATUS,CCDET,6	; Credit CARD_STATUS detect (1 == detected)
	BITDEF	CARD_STATUS,BVD1,5	; Battery Voltage Detect 1
	BITDEF	CARD_STATUS,SC,5	; Credit-CARD_STATUS (internal) status change
	BITDEF	CARD_STATUS,BVD2,4	; Battery Voltage Detect 2
	BITDEF	CARD_STATUS,DA,4	; Digital audio
	BITDEF	CARD_STATUS,WR,3	; Write enable (1 == enabled)
	BITDEF	CARD_STATUS,BSY,2	; Credit CARD_STATUS Busy
	BITDEF	CARD_STATUS,IRQ,2	; Interrupt request

* CardProgramVoltage() defines

CARD_VOLTAGE_0V		EQU	0	; Set to default; maybe the same as 5V
CARD_VOLTAGE_5V		EQU	1
CARD_VOLTAGE_12V	EQU	2

* CardMiscControl() defines

	BITDEF	CARD_ENABLE,DIGAUDIO,1
	BITDEF	CARD_DISABLE,WP,3

* New CardMiscControl() bits for V39 card.resource.  Use these bits to set,
* or clear status change interrupts for BVD1/SC, BVD2/DA, and BSY/IRQ.
* Write-enable/protect change interrupts are always enabled.  The defaults
* are unchanged (BVD1/SC is enabled, BVD2/DA is disabled, and BSY/IRQ is enabled)
*
* IMPORTANT -- Only set these bits for V39 card.resource or greater (check
* resource base VERSION)
*
	BITDEF	CARD_INT,SETCLR,7

	BITDEF	CARD_INT,BVD1,5
	BITDEF	CARD_INT,SC,5

	BITDEF	CARD_INT,BVD2,4
	BITDEF	CARD_INT,DA,4

	BITDEF	CARD_INT,BSY,2
	BITDEF	CARD_INT,IRQ,2


* CardInterface() defines

CARD_INTERFACE_AMIGA_0	EQU	0

* Tuple for Amiga execute-in-place software (e.g., games, or other
* such software which want to use execute-in-place software stored
* on a credit-card, such as a ROM card).
*
* See documentation for IfAmigaXIP().

CISTPL_AMIGAXIP	EQU	$91	;Tuple code

 STRUCTURE	TP_AmigaXIP,0
	STRUCT	tp_AmigaXIP,2
	STRUCT	TP_XIPLOC,4
	STRUCT	TP_XIPFLAGS,1
	STRUCT	TP_XIPRESRV,1

	LABEL	TP_AmigaXIP_SIZEOF

*------ TP_BOOTFLAGS --------------------------------------------

	; The XIPFLAGF_AUTORUN bit means that you want the machine
	; to perform a reset if the execute-in-place card is inserted
	; after DOS has been started.  The machine will then reset,
	; and execute your execute-in-place code the next time around.
	;
	; NOTE -- this flag may be ignored on some machines, in which
	; case the user will have to manually reset the machine in the
	; usual way.

	BITDEF	XIPFLAG,AUTORUN,0

*------- For assembly modules to use if amiga.lib has not been updated

	IFD	CARD_INTERNAL_LVOS

*
* Resource Vector Offsets
*

RES_RESERVED	EQU	0
RES_USERDEF	EQU	LIB_BASE-(RES_RESERVED*LIB_VECTSIZE)
RES_NONSTD	EQU	RES_USERDEF

RESINIT		MACRO	; [baseOffset ]
		IFC	'\1',''
COUNT_RES	SET	RES_USERDEF
		ENDC
		IFNC	'\1',''
COUNT_RES	SET	\1
		ENDC
		ENDM


RESDEF		MACRO	; library Function Symbol
\1		EQU	COUNT_RES
COUNT_RES	SET	COUNT_RES-LIB_VECTSIZE
		ENDM

	RESINIT
	RESDEF	_LVOOwnCard
	RESDEF	_LVOReleaseCard
	RESDEF	_LVOGetCardMap
	RESDEF	_LVOBeginCardAccess
	RESDEF	_LVOEndCardAccess
	RESDEF	_LVOReadCardStatus
	RESDEF	_LVOCardResetRemove
	RESDEF	_LVOCardMiscControl
	RESDEF	_LVOCardAccessSpeed
	RESDEF	_LVOCardProgramVoltage
	RESDEF	_LVOCardResetCard
	RESDEF	_LVOCopyTuple
	RESDEF	_LVODeviceTuple
	RESDEF	_LVOIfAmigaXIP
	RESDEF	_LVOCardForceChange
	RESDEF	_LVOCardChangeCount
	RESDEF	_LVOCardInterface

	ENDC	; CARD_INTERNAL_LVOS
	ENDC	; RESOURCES_CARD_I
