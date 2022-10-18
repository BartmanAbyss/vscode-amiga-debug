	IFND	DOS_DOSHUNKS_I
DOS_DOSHUNKS_I	SET	1
**
**	$VER: doshunks.i 36.13 (12.8.1993)
**	Includes Release 45.1
**
**	Hunk definitions for object and load modules.
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**
	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC

* hunk types

HUNK_UNIT	EQU	999
HUNK_NAME	EQU	1000
HUNK_CODE	EQU	1001
HUNK_DATA	EQU	1002
HUNK_BSS	EQU	1003
HUNK_RELOC32	EQU	1004
HUNK_ABSRELOC32	EQU	HUNK_RELOC32
HUNK_RELOC16	EQU	1005
HUNK_RELRELOC16	EQU	HUNK_RELOC16
HUNK_RELOC8	EQU	1006
HUNK_RELRELOC8	EQU	HUNK_RELOC8
HUNK_EXT	EQU	1007
HUNK_SYMBOL	EQU	1008
HUNK_DEBUG	EQU	1009
HUNK_END	EQU	1010
HUNK_HEADER	EQU	1011

HUNK_OVERLAY	EQU	1013
HUNK_BREAK	EQU	1014

HUNK_DREL32	EQU	1015
HUNK_DREL16	EQU	1016
HUNK_DREL8	EQU	1017

HUNK_LIB	EQU	1018
HUNK_INDEX	EQU	1019

* Note: V37 LoadSeg uses 1015 (HUNK_DREL32) by mistake.  This will continue
* to be supported in future versions, since HUNK_DREL32 is illegal in load files
* anyways.  Future versions will support both 1015 and 1020, though anything
* that should be usable under V37 should use 1015.
HUNK_RELOC32SHORT EQU	1020

* see ext_xxx below.  New for V39 (note that LoadSeg only handles RELRELOC32).
HUNK_RELRELOC32	EQU	1021
HUNK_ABSRELOC16	EQU	1022

*
* Any hunks that have the HUNKB_ADVISORY bit set will be ignored if they
* aren't understood.  When ignored, they're treated like HUNK_DEBUG hunks.
* NOTE: this handling of HUNKB_ADVISORY started as of V39 dos.library!	If
* lading such executables is attempted under <V39 dos, it will fail with a
* bad hunk type.
*
	BITDEF	HUNK,ADVISORY,29
	BITDEF	HUNK,CHIP,30
	BITDEF	HUNK,FAST,31

* hunk_ext sub-types

EXT_SYMB	EQU	0	; symbol table
EXT_DEF		EQU	1	; relocatable definition
EXT_ABS		EQU	2	; Absolute definition
EXT_RES		EQU	3	; no longer supported
EXT_COMMONDEF	EQU	4	; Common definition (value is size in bytes)
EXT_REF32	EQU	129	; 32 bit absolute reference to symbol
EXT_ABSREF32	EQU	EXT_REF32
EXT_COMMON	EQU	130	; 32 bit absolute reference to COMMON block
EXT_ABSCOMMON	EQU	EXT_COMMON
EXT_REF16	EQU	131	; 16 bit PC-relative reference to symbol
EXT_RELREF16	EQU	EXT_REF16
EXT_REF8	EQU	132	;  8 bit PC-relative reference to symbol
EXT_RELREF8	EQU	EXT_REF8
EXT_DEXT32	EQU	133	; 32 bit data relative reference
EXT_DEXT16	EQU	134	; 16 bit data relative reference
EXT_DEXT8	EQU	135	;  8 bit data relative reference

* These are to support some of the '020 and up modes that are rarely used
EXT_RELREF32	EQU	136	; 32 bit PC-relative reference to symbol
EXT_RELCOMMON	EQU	137	; 32 bit PC-relative reference to COMMON block

* for completeness... All 680x0's support this
EXT_ABSREF16	EQU	138	; 16 bit absolute reference to symbol

* this only exists on '020's and above, in the (d8,An,Xn) address mode
EXT_ABSREF8	EQU	139	; 8 bit absolute reference to symbol

	ENDC	; DOS_DOSHUNKS_I
