	IFND	DOS_DATETIME_I
DOS_DATETIME_I SET 1

**
**	$VER: datetime.i 36.7 (12.7.1990)
**	Includes Release 45.1
**
**	Date and time assembler header for AmigaDOS
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND DOS_DOS_I
	INCLUDE "dos/dos.i"
	ENDC

*
*	Data structures and equates used by the V1.4 DOS functions
* StrtoDate() and DatetoStr()
*
*

*--------- String/Date structures etc
    STRUCTURE	DateTime,0
	STRUCT	dat_Stamp,ds_SIZEOF	;DOS DateStamp
	UBYTE	dat_Format		;controls appearance of dat_StrDate
	UBYTE	dat_Flags		;see BITDEF's below
	CPTR	dat_StrDay		;day of the week string
	CPTR	dat_StrDate		;date string
	CPTR	dat_StrTime		;time string
	LABEL	dat_SIZEOF
*
* You need this much room for each of the DateTime strings:
LEN_DATSTRING	EQU	16

*	flags for dat_Flags
*
	BITDEF	DT,SUBST,0		;substitute Today, Tomorrow, etc.
	BITDEF	DT,FUTURE,1		;day of the week is in future
*
*	date format values
*
FORMAT_DOS	equ	0		; dd-mmm-yy
FORMAT_INT	equ	1		; yy-mm-dd
FORMAT_USA	equ	2		; mm-dd-yy
FORMAT_CDN	equ	3		; dd-mm-yy
FORMAT_MAX	equ	FORMAT_CDN

	ENDC	; DOS_DATETIME_I
