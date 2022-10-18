	IFND	LIBRARIES_LOWLEVEL_I
LIBRARIES_LOWLEVEL_I  SET 1
**
**	$VER: lowlevel.i 40.7 (30.7.1993)
**	Includes Release 45.1
**
**	lowlevel.library interface structures and definitions
**
**	(C) Copyright 2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

;---------------------------------------------------------------------------

; structure for use with QueryKeys()
   STRUCTURE KeyQuery,0
	UWORD kq_KeyCode
	UWORD kq_Pressed
   LABEL KeyQuery_SIZEOF

;---------------------------------------------------------------------------

; bits in the return value of GetKey()
	BITDEF	LLK,LSHIFT,16
	BITDEF	LLK,RSHIFT,17
	BITDEF	LLK,CAPSLOCK,18
	BITDEF	LLK,CONTROL,19
	BITDEF	LLK,LALT,20
	BITDEF	LLK,RALT,21
	BITDEF	LLK,LAMIGA,22
	BITDEF	LLK,RAMIGA,23

;---------------------------------------------------------------------------

; Tags for SetJoyPortAttrs()
;
SJA_Dummy	  equ (TAG_USER+$00C00100)
SJA_Type	  equ (SJA_Dummy+1) ; force type to mouse, joy, game cntrlr
SJA_Reinitialize  equ (SJA_Dummy+2) ; free potgo bits, reset to autosense

; Controller types for SJA_Type tag
SJA_TYPE_AUTOSENSE equ 0
SJA_TYPE_GAMECTLR  equ 1
SJA_TYPE_MOUSE	   equ 2
SJA_TYPE_JOYSTK    equ 3

;---------------------------------------------------------------------------

; ReadJoyPort() retunr value definitions

; Port types
JP_TYPE_NOTAVAIL equ (00<<28)	     ; port data unavailable
JP_TYPE_GAMECTLR equ (01<<28)	     ; port has game controller
JP_TYPE_MOUSE	 equ (02<<28)	     ; port has mouse
JP_TYPE_JOYSTK	 equ (03<<28)	     ; port has joystick
JP_TYPE_UNKNOWN  equ (04<<28)	     ; port has unknown device
JP_TYPE_MASK	 equ (15<<28)	     ; controller type

; Button types, valid for all types except JP_TYPE_NOTAVAIL
	BITDEF	JP,BUTTON_BLUE,23     ; Blue - Stop; Right Mouse
	BITDEF	JP,BUTTON_RED,22      ; Red - Select; Left Mouse; Joystick Fire
	BITDEF	JP,BUTTON_YELLOW,21   ; Yellow - Repeat
	BITDEF	JP,BUTTON_GREEN,20    ; Green - Shuffle
	BITDEF	JP,BUTTON_FORWARD,19  ; Charcoal - Forward
	BITDEF	JP,BUTTON_REVERSE,18  ; Charcoal - Reverse
	BITDEF	JP,BUTTON_PLAY,17     ; Grey - Play/Pause; Middle Mouse

JP_BUTTON_MASK equ (JPF_BUTTON_BLUE!JPF_BUTTON_RED!JPF_BUTTON_YELLOW!JPF_BUTTON_GREEN!JPF_BUTTON_FORWARD!JPF_BUTTON_REVERSE!JPF_BUTTON_PLAY)

; Direction types, valid for JP_TYPE_GAMECTLR and JP_TYPE_JOYSTK
	BITDEF	JP,JOY_UP,3
	BITDEF	JP,JOY_DOWN,2
	BITDEF	JP,JOY_LEFT,1
	BITDEF	JP,JOY_RIGHT,0

JP_DIRECTION_MASK equ (JPF_JOY_UP!JPF_JOY_DOWN!JPF_JOY_LEFT!JPF_JOY_RIGHT)

; Mouse position reports, valid for JP_TYPE_MOUSE
JP_MHORZ_MASK equ (255<<0)	  ; horizontal position
JP_MVERT_MASK equ (255<<8)	  ; vertical position
JP_MOUSE_MASK equ (JP_MHORZ_MASK!JP_MVERT_MASK)

; Obsolete ReadJoyPort() definitions, here for source code compatibility only.
; Please do NOT use in new code.
	BITDEF	JP,BTN1,JPB_BUTTON_BLUE
	BITDEF	JP,BTN2,JPB_BUTTON_RED
	BITDEF	JP,BTN3,JPB_BUTTON_YELLOW
	BITDEF	JP,BTN4,JPB_BUTTON_GREEN
	BITDEF	JP,BTN5,JPB_BUTTON_FORWARD
	BITDEF	JP,BTN6,JPB_BUTTON_REVERSE
	BITDEF	JP,BTN7,JPB_BUTTON_PLAY
	BITDEF	JP,UP,JPB_JOY_UP
	BITDEF	JP,DOWN,JPB_JOY_DOWN
	BITDEF	JP,LEFT,JPB_JOY_LEFT
	BITDEF	JP,RIGHT,JPB_JOY_RIGHT

;---------------------------------------------------------------------------

; Tags for SystemControl()
SCON_Dummy	   equ (TAG_USER+$00C00000)
SCON_TakeOverSys   equ (SCON_Dummy+0)
SCON_KillReq	   equ (SCON_Dummy+1)
SCON_CDReboot	   equ (SCON_Dummy+2)
SCON_StopInput	   equ (SCON_Dummy+3)
SCON_AddCreateKeys equ (SCON_Dummy+4)
SCON_RemCreateKeys equ (SCON_Dummy+5)

; Reboot control values for use with the SCON_CDReboot tag
CDReboot_On	 equ 1
CDReboot_Off	 equ 0
CDReboot_Default equ 2

;---------------------------------------------------------------------------

; Rawkey codes returned when using SCON_AddCreateKeys with SystemControl()

RAWKEY_PORT0_BUTTON_BLUE	equ	$72
RAWKEY_PORT0_BUTTON_RED	equ	$78
RAWKEY_PORT0_BUTTON_YELLOW	equ	$77
RAWKEY_PORT0_BUTTON_GREEN	equ	$76
RAWKEY_PORT0_BUTTON_FORWARD	equ	$75
RAWKEY_PORT0_BUTTON_REVERSE	equ	$74
RAWKEY_PORT0_BUTTON_PLAY	equ	$73
RAWKEY_PORT0_JOY_UP		equ	$79
RAWKEY_PORT0_JOY_DOWN		equ	$7A
RAWKEY_PORT0_JOY_LEFT		equ	$7C
RAWKEY_PORT0_JOY_RIGHT		equ	$7B

RAWKEY_PORT1_BUTTON_BLUE	equ	$172
RAWKEY_PORT1_BUTTON_RED	equ	$178
RAWKEY_PORT1_BUTTON_YELLOW	equ	$177
RAWKEY_PORT1_BUTTON_GREEN	equ	$176
RAWKEY_PORT1_BUTTON_FORWARD	equ	$175
RAWKEY_PORT1_BUTTON_REVERSE	equ	$174
RAWKEY_PORT1_BUTTON_PLAY	equ	$173
RAWKEY_PORT1_JOY_UP		equ	$179
RAWKEY_PORT1_JOY_DOWN		equ	$17A
RAWKEY_PORT1_JOY_LEFT		equ	$17C
RAWKEY_PORT1_JOY_RIGHT		equ	$17B

RAWKEY_PORT2_BUTTON_BLUE	equ	$272
RAWKEY_PORT2_BUTTON_RED	equ	$278
RAWKEY_PORT2_BUTTON_YELLOW	equ	$277
RAWKEY_PORT2_BUTTON_GREEN	equ	$276
RAWKEY_PORT2_BUTTON_FORWARD	equ	$275
RAWKEY_PORT2_BUTTON_REVERSE	equ	$274
RAWKEY_PORT2_BUTTON_PLAY	equ	$273
RAWKEY_PORT2_JOY_UP		equ	$279
RAWKEY_PORT2_JOY_DOWN		equ	$27A
RAWKEY_PORT2_JOY_LEFT		equ	$27C
RAWKEY_PORT2_JOY_RIGHT		equ	$27B

RAWKEY_PORT3_BUTTON_BLUE	equ	$372
RAWKEY_PORT3_BUTTON_RED	equ	$378
RAWKEY_PORT3_BUTTON_YELLOW	equ	$377
RAWKEY_PORT3_BUTTON_GREEN	equ	$376
RAWKEY_PORT3_BUTTON_FORWARD	equ	$375
RAWKEY_PORT3_BUTTON_REVERSE	equ	$374
RAWKEY_PORT3_BUTTON_PLAY	equ	$373
RAWKEY_PORT3_JOY_UP		equ	$379
RAWKEY_PORT3_JOY_DOWN		equ	$37A
RAWKEY_PORT3_JOY_LEFT		equ	$37C
RAWKEY_PORT3_JOY_RIGHT		equ	$37B

;---------------------------------------------------------------------------

; return value for GetLanguageSelection()
LANG_UNKNOWN	equ 0
LANG_AMERICAN	equ 1	; American English
LANG_ENGLISH	equ 2	; British English
LANG_GERMAN	equ 3
LANG_FRENCH	equ 4
LANG_SPANISH	equ 5
LANG_ITALIAN	equ 6
LANG_PORTUGUESE equ 7
LANG_DANISH	equ 8
LANG_DUTCH	equ 9
LANG_NORWEGIAN	equ 10
LANG_FINNISH	equ 11
LANG_SWEDISH	equ 12
LANG_JAPANESE	equ 13
LANG_CHINESE	equ 14
LANG_ARABIC	equ 15
LANG_GREEK	equ 16
LANG_HEBREW	equ 17
LANG_KOREAN	equ 18

;---------------------------------------------------------------------------

	ENDC	; LIBRARIES_LOWLEVEL_I
