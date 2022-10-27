	IFND UTILITY_TAGITEM_I
UTILITY_TAGITEM_I SET	1
**
**	$VER: tagitem.i 40.1 (19.7.1993)
**	Includes Release 45.1
**
**	Extended specification mechanism
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

;---------------------------------------------------------------------------

; Tags are a general mechanism of extensible data arrays for parameter
; specification and property inquiry. In practice, tags are used in arrays,
; or chain of arrays.

   STRUCTURE TagItem,0
	ULONG	ti_Tag		; identifies the type of the data
	ULONG	ti_Data		; type-specific data
   LABEL ti_SIZEOF

; constants for Tag.ti_Tag, control tag values
TAG_DONE   equ 0  ; terminates array of TagItems. ti_Data unused
TAG_END	   equ 0  ; synonym for TAG_DONE
TAG_IGNORE equ 1  ; ignore this item, not end of array
TAG_MORE   equ 2  ; ti_Data is pointer to another array of TagItems
		  ; note that this tag terminates the current array
TAG_SKIP   equ 3  ; skip this and the next ti_Data items

; differentiates user tags from control tags
TAG_USER   equ $80000000

; If the TAG_USER bit is set in a tag number, it tells utility.library that
; the tag is not a control tag (like TAG_DONE, TAG_IGNORE, TAG_MORE) and is
; instead an application tag. "USER" means a client of utility.library in
; general, including system code like Intuition or ASL, it has nothing to do
; with user code.
;

;---------------------------------------------------------------------------

; Tag filter logic specifiers for use with FilterTagItems()
TAGFILTER_AND equ 0	; exclude everything but filter hits
TAGFILTER_NOT equ 1	; exclude only filter hits

;---------------------------------------------------------------------------

; Mapping types for use with MapTags()
MAP_REMOVE_NOT_FOUND equ 0	; remove tags that aren't in mapList
MAP_KEEP_NOT_FOUND   equ 1	; keep tags that aren't in mapList

;---------------------------------------------------------------------------

	ENDC	; UTILITY_TAGITEM_I
