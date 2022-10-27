	IFND	EXEC_TYPES_I
EXEC_TYPES_I	SET	1
**
**	$VER: types.i 39.1 (24.2.1993)
**	Includes Release 45.1
**
**	Data storage macros.  Must be included before any other Amiga include.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**


INCLUDE_VERSION	EQU 40	;Version of the include files in use. (Do not
			;use this label for OpenLibrary() calls!)


EXTERN_LIB  MACRO
	    XREF    _LVO\1
	    ENDM

**
** Structure Building Macros
**
STRUCTURE   MACRO		; structure name, initial offset
\1	    EQU     0
SOFFSET     SET     \2
	    ENDM

FPTR	    MACRO		; function pointer (32 bits - all bits valid)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+4
	    ENDM

BOOL	    MACRO		; boolean (16 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+2
	    ENDM

BYTE	    MACRO		; byte (8 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+1
	    ENDM

UBYTE	    MACRO		; unsigned byte (8 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+1
	    ENDM

WORD	    MACRO		; word (16 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+2
	    ENDM

UWORD	    MACRO		; unsigned word (16 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+2
	    ENDM

SHORT	    MACRO		; obsolete - use WORD
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+2
	    ENDM

USHORT	    MACRO		; obsolete - use UWORD
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+2
	    ENDM

LONG	    MACRO		; long (32 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+4
	    ENDM

ULONG	    MACRO		; unsigned long (32 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+4
	    ENDM

FLOAT	    MACRO		; C float (32 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+4
	    ENDM

DOUBLE	    MACRO		; C double (64 bits)
\1	    EQU	    SOFFSET
SOFFSET	    SET	    SOFFSET+8
	    ENDM

APTR	    MACRO		; untyped pointer (32 bits - all bits valid)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+4
	    ENDM

CPTR	    MACRO		; obsolete
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+4
	    ENDM

RPTR	    MACRO		; unsigned relative pointer (16 bits)
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+2
	    ENDM

LABEL	    MACRO		; Define a label without bumping the offset
\1	    EQU     SOFFSET
	    ENDM

STRUCT	    MACRO		; Define a sub-structure
\1	    EQU     SOFFSET
SOFFSET     SET     SOFFSET+\2
	    ENDM

ALIGNWORD   MACRO		; Align structure offset to nearest word
SOFFSET     SET     (SOFFSET+1)&$fffffffe
	    ENDM

ALIGNLONG   MACRO		; Align structure offset to nearest longword
SOFFSET     SET     (SOFFSET+3)&$fffffffc
	    ENDM

**
** Enumerated variables.  Use ENUM to set a base number, and EITEM to assign
** incrementing values.  ENUM can be used to set a new base at any time.
**
ENUM	    MACRO   ;[new base]
	    IFC     '\1',''
EOFFSET	    SET	    0		; Default to zero
	    ENDC
	    IFNC    '\1',''
EOFFSET	    SET     \1
	    ENDC
	    ENDM

EITEM	    MACRO   ;label
\1	    EQU     EOFFSET
EOFFSET     SET     EOFFSET+1
	    ENDM

**
**  Bit Definition Macro
**
**  Given:
**	BITDEF	MEM,CLEAR,16
**
**  Yields:
**	MEMB_CLEAR  EQU 16			; Bit number
**	MEMF_CLEAR  EQU 1<<16			; Bit mask
**

BITDEF	    MACRO   ; prefix,&name,&bitnum
	    BITDEF0 \1,\2,B_,\3
\@BITDEF    SET     1<<\3
	    BITDEF0 \1,\2,F_,\@BITDEF
	    ENDM

BITDEF0     MACRO   ; prefix,&name,&type,&value
\1\3\2	    EQU     \4
	    ENDM

**
** LIBRARY_VERSION is now obsolete.  Please use LIBRARY_MINIMUM or code
** the specific minimum library version you require.
**		LIBRARY_VERSION EQU	36
**
LIBRARY_MINIMUM	EQU 33	;Lowest version supported

	ENDC	; EXEC_TYPES_I
