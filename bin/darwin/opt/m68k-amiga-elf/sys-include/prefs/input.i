	IFND	PREFS_INPUT_I
PREFS_INPUT_I	SET	1
**
**	$VER: input.i 38.2 (28.6.1991)
**	Includes Release 45.1
**
**	File format for input preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND DEVICES_TIMER_I
    INCLUDE "devices/timer.i"
    ENDC

;---------------------------------------------------------------------------

ID_INPT equ "INPT"


   STRUCTURE InputPrefs,0
	STRUCT ip_Keymap,16
	UWORD  ip_PointerTicks
	STRUCT ip_DoubleClick,TV_SIZE
	STRUCT ip_KeyRptDelay,TV_SIZE
	STRUCT ip_KeyRptSpeed,TV_SIZE
	WORD   ip_MouseAccel
   LABEL InputPrefs_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_INPUT_I
