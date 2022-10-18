	IFND	EXEC_STRINGS_I
EXEC_STRINGS_I	SET	1
**
**	$VER: strings.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Macros for defining old style CR/LF terminated string constants
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

*------ Terminal Control:

EOS	EQU 0
BELL	EQU 7
LF	EQU 10
CR	EQU 13
BS	EQU 8
DEL	EQU $7F
NL	EQU LF


*----------------------------------------------------------------
*
*   String Support Macros
*
*----------------------------------------------------------------

STRING	MACRO
	dc.b	\1
	dc.b	0
	CNOP	0,2
	ENDM


STRINGL MACRO
	dc.b	13,10
	dc.b	\1
	dc.b	0
	CNOP	0,2
	ENDM


STRINGR MACRO
	dc.b	\1
	dc.b	13,10,0
	CNOP	0,2
	ENDM


STRINGLR MACRO
	dc.b	13,10
	dc.b	\1
	dc.b	13,10,0
	CNOP	0,2
	ENDM

	ENDC	; EXEC_STRINGS_I
