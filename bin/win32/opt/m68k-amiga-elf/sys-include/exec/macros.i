	IFND	EXEC_MACROS_I
EXEC_MACROS_I	 SET	 1
**
**	$VER: macros.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Handy macros for assembly language programmers.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

		IFND	DEBUG_DETAIL
DEBUG_DETAIL	SET	0	;Detail level of debugging.  Zero for none.
		ENDC


JSRLIB		MACRO	;FunctionName
		XREF	_LVO\1
		jsr	_LVO\1(a6)
		ENDM

JMPLIB		MACRO	;FunctionName
		XREF	_LVO\1
		jmp	_LVO\1(a6)
		ENDM

BSRSELF	MACRO
		XREF	\1
		bsr	\1
		ENDM

BRASELF	MACRO
		XREF	\1
		bra	\1
		ENDM

BLINK		MACRO
		IFNE	DEBUG_DETAIL
		  bchg.b #1,$bfe001  ;Toggle the power LED
		ENDC
		ENDM

TRIGGER		MACRO	;<level> Trigger a hardware state analyzer
		IFGE	DEBUG_DETAIL-\1
		  move.w #$5555,$2fe
		ENDC
		ENDM

CLEAR		MACRO
		moveq.l #0,\1
		ENDM

CLEARA		MACRO
		suba.l	\1,\1	;Quick way to put zero in an address register
		ENDM

*************************************************************************
		IFND	PRINTF
PRINTF		MACRO	; level,<string>,...
		IFGE	DEBUG_DETAIL-\1
		XREF	kprint_macro
PUSHCOUNT	SET	0

		IFNC	'\9',''
		move.l	\9,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		IFNC	'\8',''
		move.l	\8,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		IFNC	'\7',''
		move.l	\7,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		IFNC	'\6',''
		move.l	\6,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		IFNC	'\5',''
		move.l	\5,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		IFNC	'\4',''
		move.l	\4,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		IFNC	'\3',''
		move.l	\3,-(sp)
PUSHCOUNT	SET	PUSHCOUNT+4
		ENDC

		movem.l a0/a1,-(sp)
		lea.l	PSS\@(pc),A0
		lea.l	4*2(SP),A1
		BSR	kprint_macro
		movem.l (sp)+,a0/a1
		bra.s	PSE\@

PSS\@		dc.b	\2
		IFEQ	(\1&1)	;If even, add CR/LF par...
		   dc.b 13,10
		ENDC
		dc.b	0
		ds.w	0
PSE\@
		lea.l	PUSHCOUNT(sp),sp
		ENDC	;IFGE	DEBUG_DETAIL-\1
		ENDM	;PRINTF	MACRO
		ENDC	;IFND	PRINTF


;----------------------------------------------------------------------------
;Push a set of registers onto the stack - undo with POPM.  This prevents
;the need to update or synchronize two MOVEM instructions.  These macros
;assume an optimizing assembler that will convert single register  MOVEM
;to MOVE.  Because the REG assignment can't be reset, these macros do
;not nest.
;
;	    PUSHM   d2/a2/a5
;	    ...code...
;	    POPM
;	    RTS
;
PUSHM_COUNT			SET	0
PUSHM				MACRO
				IFGT	NARG-1
				FAIL	!!!! TOO MANY ARGUMENTS TO PUSHM !!!!
				ENDC
PUSHM_COUNT			SET	PUSHM_COUNT+1
PUSHM_\*VALOF(PUSHM_COUNT)      REG     \1
				movem.l PUSHM_\*VALOF(PUSHM_COUNT),-(sp)
				ENDM

;
;Undo most recent PUSHM.  'POPM NOBUMP' allows multiple exit points.
;
POPM				MACRO
				movem.l (sp)+,PUSHM_\*VALOF(PUSHM_COUNT)
				IFNC	'\1','NOBUMP'
PUSHM_COUNT			SET	PUSHM_COUNT+1	;error if re-used
				ENDC
				ENDM
;----------------------------------------------------------------------------


	ENDC	; EXEC_MACROS_I
