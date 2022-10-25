	IFND UTILITY_HOOKS_I
UTILITY_HOOKS_I SET 1
**
**	$VER: hooks.i 39.1 (20.1.1992)
**	Includes Release 45.1
**
**	Callback hooks
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC

;---------------------------------------------------------------------------

; Hook conventions
;	A0 - pointer to hook itself
;	A1 - pointer to parameter packet ("message")
;	A2 - Hook specific address data ("object," e.g, gadget )

   STRUCTURE HOOK,MLN_SIZE
	APTR h_Entry		; assembler entry point
	APTR h_SubEntry		; optional HLL entry point
	APTR h_Data		; owner specific
   LABEL h_SIZEOF


;---------------------------------------------------------------------------

	ENDC	; UTILITY_HOOKS_I
