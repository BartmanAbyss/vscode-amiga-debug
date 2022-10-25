	IFND	EXEC_INITIALIZERS_I
EXEC_INITIALIZERS_I	SET	1
**
**	$VER: initializers.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Macros for creating InitStruct() tables
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

INITBYTE	MACRO	; &offset,&value
		IFLE	(\1)-255	;If offset <=255
		DC.B	$a0,\1		;use byte offset
		DC.B	\2,0
		MEXIT			;exit early
		ENDC
		DC.B	$e0,0
		DC.W	\1
		DC.B	\2,0
		ENDM

INITWORD	MACRO	; &offset,&value
		IFLE	(\1)-255	;If offset <=255
		DC.B	$90,\1		;use byte offset
		DC.W	\2
		MEXIT			;exit early
		ENDC
		DC.B	$d0,0
		DC.W	\1
		DC.W	\2
		ENDM

INITLONG	MACRO	; &offset,&value
		IFLE	(\1)-255	;If offset <=255
		DC.B	$80,\1		;use byte offset
		DC.L	\2
		MEXIT			;exit early
		ENDC
		DC.B	$c0,0
		DC.W	\1
		DC.L	\2
		ENDM

;size=source size 0=long, 1=word, 2=byte, 3=illegal.
;offset=offset from memory base to put data
;value=unused
;count=number of source items to copy, minus one
;follow this macro with the proper sized data (dc.b,dc.w,dc.l,etc.)
INITSTRUCT	MACRO	; &size,&offset,&value,&count
		DS.W	0
		IFC	'\4',''
COUNT\@	SET	0
		ENDC
		IFNC	'\4',''
COUNT\@	SET	\4
		ENDC
CMD\@		SET	(((\1)<<4)!COUNT\@)
		IFLE	(\2)-255	;byte offset large enough?
		DC.B	(CMD\@)!$80
		DC.B	\2
		MEXIT
		ENDC
		DC.B	CMD\@!$0C0	;byte too small, use 24-bit offset.
		DC.B	(((\2)>>16)&$0FF)
		DC.W	((\2)&$0FFFF)
		ENDM

	ENDC	; EXEC_INITIALIZERS_I
