	IFND	UTILITY_PACK_I
UTILITY_PACK_I	EQU	1
**
**	$VER: pack.i 39.4 (10.2.1993)
**	Includes Release 45.1
**
**	Control attributes for Pack/UnpackStructureTags()
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND EXEC_MACROS_I
	INCLUDE	"exec/macros.i"
	ENDC

	IFND UTILITY_TAGITEM_I
	INCLUDE	"utility/tagitem.i"
	ENDC

;---------------------------------------------------------------------------

; PackTable definition:
;
; The PackTable is a simple array of LONGWORDS that are then evaluated
; by PackStructureTags and UnpackStructureTags.
;
; The table contains compressed information such as the tag offset from
; the base tag.  The tag offset has a limited range so the base tag is
; defined in the first longword.
;
; After the first longword, the fields look as follows:
;
;	+--------- 1 = signed, 0 = unsigned (for bits, 1=inverted boolean)
;	|
;	|  +------ 00 = Pack/Unpack, 10 = Pack, 01 = Unpack, 11 = special
;	| / \
;	| | |  +-- 00 = Byte, 01 = Word, 10 = Long, 11 = Bit
;	| | | / \
;	| | | | | /----- For bit operations: 1 = TAG_EXISTS is TRUE
;	| | | | | |
;	| | | | | | /-------------------- Tag offset from base tag value
;	| | | | | | |		      \
;	m n n o o p q q q q q q q q q q r r r s s s s s s s s s s s s s
;					\   | |		      |
;	Bit offset (for bit operations) ----/ |		      |
;					      \ 		      |
;	Offset into data structure -----------------------------------/
;
; A -1 longword signifies that the next longword will be a new base tag
;
; A 0 longword signifies that it is the end of the pack table.
;
; What this implies is that there are only 13-bits of address offset
; and 10 bits for tag offsets from the base tag.  For most uses this
; should be enough, but when this is not, either multiple pack tables
; or a pack table with extra base tags would be able to do the trick.
; The goal here was to make the tables small and yet flexible enough to
; handle most cases.
;
	BITDEF	PST,SIGNED,31
	BITDEF	PST,UNPACK,30	; Note that these are active low...
	BITDEF	PST,PACK,29	; Note that these are active low...
	BITDEF	PST,EXISTS,26	; Tag exists bit true flag hack...

;---------------------------------------------------------------------------

	ENDC	; UTILITY_PACK_I
