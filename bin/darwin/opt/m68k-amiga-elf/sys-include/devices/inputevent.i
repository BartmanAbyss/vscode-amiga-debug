	IFND	DEVICES_INPUTEVENT_I
DEVICES_INPUTEVENT_I	SET	1
**
**	$VER: inputevent.i 36.8 (22.4.1992)
**	Includes Release 45.1
**
**	input event definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	 DEVICES_TIMER_I
	INCLUDE  "devices/timer.i"
	ENDC

	IFND	 UTILITY_HOOKS_I
	INCLUDE	"utility/hooks.i"
	ENDC

	IFND	 UTILITY_TAGITEM_I
	INCLUDE	"utility/tagitem.i"
	ENDC

;------ constants ----------------------------------------------------

;   --- InputEvent.ie_Class ---
; A NOP input event
IECLASS_NULL			EQU	$00
; A raw keycode from the keyboard device
IECLASS_RAWKEY			EQU	$01
; A raw mouse report from the game port device
IECLASS_RAWMOUSE		EQU	$02
; A private console event
IECLASS_EVENT			EQU	$03
; A Pointer Position report
IECLASS_POINTERPOS		EQU	$04
; A timer event
IECLASS_TIMER			EQU	$06
; select button pressed down over a Gadget (address in ie_EventAddress)
IECLASS_GADGETDOWN		EQU	$07
; select button released over the same Gadget (address in ie_EventAddress)
IECLASS_GADGETUP		EQU	$08
; some Requester activity has taken place.  See Codes REQCLEAR and REQSET
IECLASS_REQUESTER		EQU	$09
; this is a Menu Number transmission (Menu number is in ie_Code)
IECLASS_MENULIST		EQU	$0A
; User has selected the active Window's Close Gadget
IECLASS_CLOSEWINDOW		EQU	$0B
; this Window has a new size
IECLASS_SIZEWINDOW		EQU	$0C
; the Window pointed to by ie_EventAddress needs to be refreshed
IECLASS_REFRESHWINDOW		EQU	$0D
; new preferences are available
IECLASS_NEWPREFS		EQU	$0E
; the disk has been removed
IECLASS_DISKREMOVED		EQU	$0F
; the disk has been inserted
IECLASS_DISKINSERTED		EQU	$10
; the window is about to be been made active
IECLASS_ACTIVEWINDOW		EQU	$11
; the window is about to be made inactive
IECLASS_INACTIVEWINDOW		EQU	$12
; extended-function pointer position report (V36)
IECLASS_NEWPOINTERPOS		EQU	$13
; Help key report during Menu session (V36)
IECLASS_MENUHELP		EQU	$14
; the Window has been modified with move, size, zoom, or change (V36)
IECLASS_CHANGEWINDOW		EQU	$15

; the last class
IECLASS_MAX			EQU	$15


;   --- InputEvent.ie_SubClass ---
;  IECLASS_NEWPOINTERPOS
;	like IECLASS_POINTERPOS
IESUBCLASS_COMPATIBLE		EQU	$00
;	ie_EventAddress points to struct IEPointerPixel
IESUBCLASS_PIXEL		EQU	$01
;	ie_EventAddress points to struct IEPointerTablet
IESUBCLASS_TABLET		EQU	$02
;       ie_EventAddress points to struct IENewTablet
IESUBCLASS_NEWTABLET		EQU	$03

; pointed to by ie_EventAddress for IECLASS_NEWPOINTERPOS,
; and IESUBCLASS_PIXEL.
;
; You specify a screen and pixel coordinates in that screen
; at which you'd like the mouse to be positioned.
; Intuition will try to oblige, but there will be restrictions
; to positioning the pointer over offscreen pixels.
;
; IEQUALIFIER_RELATIVEMOUSE is supported for IESUBCLASS_PIXEL.

 STRUCTURE	IEPointerPixel,0
    APTR    iepp_Screen		; pointer to an open screen
    LABEL   iepp_Position	; pixel coordinates in iepp_Screen
    WORD    iepp_PositionX
    WORD    iepp_PositionY
    LABEL   IEPointerPixel_SIZEOF

; pointed to by ie_EventAddress for IECLASS_NEWPOINTERPOS,
; and IESUBCLASS_TABLET.
;
; You specify a range of values and a value within the range
; independently for each of X and Y (the minimum value of
; the ranges is always normalized to 0).
;
; Intuition will position the mouse proportionally within its
; natural mouse position rectangle limits.
;
; IEQUALIFIER_RELATIVEMOUSE is not supported for IESUBCLASS_TABLET.

 STRUCTURE	IEPointerTablet,0
    LABEL   iept_Range		; 0 is min, these are max
    UWORD   iept_RangeX
    UWORD   iept_RangeY
    LABEL   iept_Value		; between 0 and iept_Range
    UWORD   iept_ValueX
    UWORD   iept_ValueY
    WORD    iept_Pressure	; -128 to 127 (unused, set to 0)
    LABEL   IEPointerTablet_SIZEOF


; The ie_EventAddress of an IECLASS_NEWPOINTERPOS event of subclass
; IESUBCLASS_NEWTABLET points at an IENewTablet structure.
;
;
; IEQUALIFIER_RELATIVEMOUSE is not supported for IESUBCLASS_NEWTABLET.
;
; See inputevent.h for comments

 STRUCTURE	IENewTablet,0
	APTR	ient_CallBack
	UWORD	ient_ScaledX
	UWORD	ient_ScaledY
	UWORD	ient_ScaledXFraction
	UWORD	ient_ScaledYFraction
	ULONG	ient_TabletX
	ULONG	ient_TabletY
	ULONG	ient_RangeX
	ULONG	ient_RangeY
	APTR	ient_TagList
	LABEL	IENewTablet_SIZEOF


;   --- InputEvent.ie_Code ---
;   IECLASS_RAWKEY
IECODE_UP_PREFIX		EQU	$80
IECODEB_UP_PREFIX		EQU	7
IECODE_KEY_CODE_FIRST		EQU	$00
IECODE_KEY_CODE_LAST		EQU	$77
IECODE_COMM_CODE_FIRST		EQU	$78
IECODE_COMM_CODE_LAST		EQU	$7F

;   IECLASS_ANSI
IECODE_C0_FIRST			EQU	$00
IECODE_C0_LAST			EQU	$1F
IECODE_ASCII_FIRST		EQU	$20
IECODE_ASCII_LAST		EQU	$7E
IECODE_ASCII_DEL		EQU	$7F
IECODE_C1_FIRST			EQU	$80
IECODE_C1_LAST			EQU	$9F
IECODE_LATIN1_FIRST		EQU	$A0
IECODE_LATIN1_LAST		EQU	$FF

;   IECLASS_RAWMOUSE
IECODE_LBUTTON			EQU	$68	; also uses IECODE_UP_PREFIX
IECODE_RBUTTON			EQU	$69	;
IECODE_MBUTTON			EQU	$6A	;
IECODE_NOBUTTON			EQU	$FF

;   IECLASS_EVENT (V36)
IECODE_NEWACTIVE		EQU	$01	; new active input window
IECODE_NEWSIZE			EQU	$02	; resize of specified window
IECODE_REFRESH			EQU	$03	; refresh of specified window

;   IECLASS_REQUESTER Codes
;	broadcast when the first Requester (not subsequent ones) opens in
;	the Window
IECODE_REQSET			EQU	$01
;	broadcast when the last Requester clears out of the Window
IECODE_REQCLEAR			EQU	$00


*   --- InputEvent.ie_Qualifier ---
IEQUALIFIER_LSHIFT		EQU	$0001
IEQUALIFIER_RSHIFT		EQU	$0002
IEQUALIFIER_CAPSLOCK		EQU	$0004
IEQUALIFIER_CONTROL		EQU	$0008
IEQUALIFIER_LALT		EQU	$0010
IEQUALIFIER_RALT		EQU	$0020
IEQUALIFIER_LCOMMAND		EQU	$0040
IEQUALIFIER_RCOMMAND		EQU	$0080
IEQUALIFIER_NUMERICPAD		EQU	$0100
IEQUALIFIER_REPEAT		EQU	$0200
IEQUALIFIER_INTERRUPT		EQU	$0400
IEQUALIFIER_MULTIBROADCAST	EQU	$0800
IEQUALIFIER_MIDBUTTON		EQU	$1000
IEQUALIFIER_RBUTTON		EQU	$2000
IEQUALIFIER_LEFTBUTTON		EQU	$4000
IEQUALIFIER_RELATIVEMOUSE	EQU	$8000

IEQUALIFIERB_LSHIFT		EQU	0
IEQUALIFIERB_RSHIFT		EQU	1
IEQUALIFIERB_CAPSLOCK		EQU	2
IEQUALIFIERB_CONTROL		EQU	3
IEQUALIFIERB_LALT		EQU	4
IEQUALIFIERB_RALT		EQU	5
IEQUALIFIERB_LCOMMAND		EQU	6
IEQUALIFIERB_RCOMMAND		EQU	7
IEQUALIFIERB_NUMERICPAD		EQU	8
IEQUALIFIERB_REPEAT		EQU	9
IEQUALIFIERB_INTERRUPT		EQU	10
IEQUALIFIERB_MULTIBROADCAST	EQU	11
IEQUALIFIERB_MIDBUTTON		EQU	12
IEQUALIFIERB_RBUTTON		EQU	13
IEQUALIFIERB_LEFTBUTTON		EQU	14
IEQUALIFIERB_RELATIVEMOUSE	EQU	15


;------ InputEvent ---------------------------------------------------

 STRUCTURE	InputEvent,0
    APTR    ie_NextEvent	; the chronologically next event
    UBYTE   ie_Class		; the input event class
    UBYTE   ie_SubClass		; optional subclass of the class
    UWORD   ie_Code		; the input event code
    UWORD   ie_Qualifier	; qualifiers in effect for the event
    LABEL   ie_EventAddress	; the event address
    LABEL   ie_X		; the pointer position for the event
    UBYTE   ie_Prev1DownCode	; previous down keys for dead key translation
    UBYTE   ie_Prev1DownQual
    LABEL   ie_Y
    UBYTE   ie_Prev2DownCode
    UBYTE   ie_Prev2DownQual
    STRUCT  ie_TimeStamp,TV_SIZE ; the system tick at the event
    LABEL   ie_SIZEOF

	ENDC	; DEVICES_INPUTEVENT_I
