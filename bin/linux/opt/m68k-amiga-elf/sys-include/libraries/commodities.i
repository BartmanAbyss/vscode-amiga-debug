       IFND LIBRARIES_COMMODITIES_I
LIBRARIES_COMMODITIES_I SET 1
**	$VER: commodities.i 38.5 (20.10.1992)
**	Includes Release 45.1
**
**	Commodities definitions
**
**	(C) Copyright 1990-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND DEVICES_INPUTEVENT_I
    INCLUDE "devices/inputevent.i"
    ENDC

;---------------------------------------------------------------------------

   STRUCTURE NewBroker,0
	BYTE	nb_Version	 ; must be set to NB_VERSION
	BYTE	nb_Reserve1
	APTR	nb_Name
	APTR	nb_Title
	APTR	nb_Descr
	WORD	nb_Unique
	WORD	nb_Flags
	BYTE	nb_Pri
	BYTE	nb_Reserve2
	APTR	nb_Port
	WORD	nb_ReservedChannel
   LABEL NewBroker_SIZEOF

; constant for NewBroker.nb_Version
NB_VERSION equ 5 ; Version of NewBroker structure

; Sizes for various buffers
CBD_NAMELEN  equ 24
CBD_TITLELEN equ 40
CBD_DESCRLEN equ 40

; Flags for NewBroker.nb_Unique
NBU_DUPLICATE equ 0
NBU_UNIQUE    equ 1	   ; will not allow duplicates
NBU_NOTIFY    equ 2	   ; sends CXM_UNIQUE to existing broker

; Flags for NewBroker.nb_Flags
COF_SHOW_HIDE equ 4

;---------------------------------------------------------------------------

; Commodities object types
CX_INVALID    equ 0	; not a valid object (probably null)
CX_FILTER     equ 1	; input event messages only
CX_TYPEFILTER equ 2	; obsolete, do not use
CX_SEND       equ 3	; sends a message
CX_SIGNAL     equ 4	; sends a signal
CX_TRANSLATE  equ 5	; translates input event into chain
CX_BROKER     equ 6	; application representative
CX_DEBUG      equ 7	; dumps info to serial port
CX_CUSTOM     equ 8	; application provides function
CX_ZERO       equ 9	; system terminator node

;---------------------------------------------------------------------------

; Commodities message types
CXM_IEVENT  equ $20
CXM_COMMAND equ $40

;* Only CXM_IEVENT messages are passed through the input network. Other types
;* of messages are sent to an optional port in your broker. This means that
;* you must test the message type in your message handling, if input messages
;* an command messages come to the same port.
;*
;* CXM_IEVENT: Messages of this type rattle around the Commodities input
;*	       network. They are sent to you by a Sender object, and passed
;*	       to you as a synchronous function call by a Custom object.
;*
;*	       The message port or function entry point is stored in the
;*	       object, and the ID fied of the message will be set to what
;*	       you arrange issuing object.
;*
;*	       The data section of the message will point to the input event
;*	       triggering the message.
;*
;* CXM_COMMAND: These messages are sent to a port attached to your Broker.
;*		They are sent to you when the controller program ants your
;*		program to do something. The ID value identifies the command.
;*

; ID values associated with a message of type CXM_COMMAND
CXCMD_DISABLE	equ 15	; please disable yourself
CXCMD_ENABLE	equ 17	; please enable yourself
CXCMD_APPEAR	equ 19	; open your window, if you can
CXCMD_DISAPPEAR equ 21	; go dormant
CXCMD_KILL	equ 23	; go away for good
CXCMD_LIST_CHG	equ 27	; Someone changed the broker list
CXCMD_UNIQUE	equ 25	; someone tried to create a broker			  ; with your name. Suggest you appear.

;---------------------------------------------------------------------------

   STRUCTURE InputXpression,0
	UBYTE	ix_Version	; must be set to IX_VERSION
	UBYTE	ix_Class	; class must match exactly
	UWORD	ix_Code	; Bits that we want
	UWORD	ix_CodeMask	; Set bits here to indicate
				; which bits in ix_Code are
				; don't care bits.
        UWORD   ix_Qualifier    ; Bits that we want
        UWORD   ix_QualMask     ; Set bits here to indicate
                                ; which bits in ix_Qualifier
                                ; are don't care bits
	UWORD	ix_QualSame	; synonyms in qualifier
   LABEL ix_SIZEOF

; constant for InputXpression.ix_Version
IX_VERSION equ 2

; constants for InputXpression.ix_QualSame
IXSYM_SHIFT	equ 1	  ; left- and right- shift are equivalent
IXSYM_CAPS	equ 2	  ; either shift or caps lock are equivalent
IXSYM_ALT	equ 4	  ; left- and right- alt are equivalent

IXSYM_SHIFTMASK equ IEQUALIFIER_LSHIFT!IEQUALIFIER_RSHIFT
IXSYM_CAPSMASK	equ IXSYM_SHIFTMASK!IEQUALIFIER_CAPSLOCK
IXSYM_ALTMASK	equ IEQUALIFIER_LALT!IEQUALIFIER_RALT

; onstant for InputXpression.ix_QualMask
IX_NORMALQUALS	equ $7FFF  ; avoid RELATIVEMOUSE

;---------------------------------------------------------------------------

; Error returns from CxBroker()
CBERR_OK      equ 0  ; No error
CBERR_SYSERR  equ 1  ; System error, no memory, etc
CBERR_DUP     equ 2  ; uniqueness violation
CBERR_VERSION equ 3  ; didn't understand NewBroker.nb_Version

;--------------------------------------------------------------------------

; Return values from CxObjError()
COERR_ISNULL     equ 1   ; you called CxObjError(NULL)
COERR_NULLATTACH equ 2   ; someone attahed NULL to my list
COERR_BADFILTER  equ 4   ; a bad filter description was given
COERR_BADTYPE    equ 8   ; unmatched type-specific operation

;---------------------------------------------------------------------------

        ENDC    ; LIBRARIES_COMMODITIES_I
