	IFND	EXEC_RESIDENT_I
EXEC_RESIDENT_I	SET	1
**
**	$VER: resident.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Resident/ROMTag stuff.	Used to identify and initialize code modules.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC ; EXEC_TYPES_I


*----------------------------------------------------------------
*
*   Resident Module Tag
*
*----------------------------------------------------------------

 STRUCTURE RT,0
    UWORD RT_MATCHWORD			; word to match on (ILLEGAL)
    APTR  RT_MATCHTAG			; pointer to the above (RT_MATCHWORD)
    APTR  RT_ENDSKIP			; address to continue scan
    UBYTE RT_FLAGS			; various tag flags
    UBYTE RT_VERSION			; release version number
    UBYTE RT_TYPE			; type of module (NT_XXXXXX)
    BYTE  RT_PRI			; initialization priority
    APTR  RT_NAME			; pointer to node name
    APTR  RT_IDSTRING			; pointer to identification string
    APTR  RT_INIT			; pointer to init code
    LABEL RT_SIZE


;------ Match word definition:

RTC_MATCHWORD	EQU	$4AFC		; The 68000 "ILLEGAL" instruction


;------ RT_FLAGS bit and field definitions:

    BITDEF RT,COLDSTART,0
    BITDEF RT,SINGLETASK,1
    BITDEF RT,AFTERDOS,2
    BITDEF RT,AUTOINIT,7		; RT_INIT points to data structure

; Compatibility: (obsolete)
;RTM_WHEN	EQU	1		; field position in RT_FLAGS
RTW_NEVER	EQU	0		; never ever init
RTW_COLDSTART	EQU	1		; init at coldstart time

	ENDC	; EXEC_RESIDENT_I
