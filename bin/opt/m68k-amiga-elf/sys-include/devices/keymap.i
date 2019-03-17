	IFND	DEVICES_KEYMAP_I
DEVICES_KEYMAP_I	SET	1
**
**	$VER: keymap.i 36.3 (13.4.1990)
**	Includes Release 45.1
**
**	key map definitions for keymap.resource, keymap.library, and
**	console.device
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

       IFND	EXEC_NODES_I
       INCLUDE	"exec/nodes.i"
       ENDC
       IFND	EXEC_LISTS_I
       INCLUDE	"exec/lists.i"
       ENDC

 STRUCTURE  KeyMap,0
   APTR  km_LoKeyMapTypes
   APTR  km_LoKeyMap
   APTR  km_LoCapsable
   APTR  km_LoRepeatable
   APTR  km_HiKeyMapTypes
   APTR  km_HiKeyMap
   APTR  km_HiCapsable
   APTR  km_HiRepeatable
   LABEL km_SIZEOF

 STRUCTURE	KeyMapNode,0
    STRUCT  kn_Node,LN_SIZE	; including name of keymap
    STRUCT  kn_KeyMap,km_SIZEOF
    LABEL   kn_SIZEOF

;------ the structure of keymap.resource
 STRUCTURE	KeyMapResource,0
    STRUCT  kr_Node,LN_SIZE
    STRUCT  kr_List,LH_SIZE	; a list of KeyMapNodes
    LABEL   kr_SIZEOF


KCB_NOP     EQU   7
KCF_NOP     EQU   $80

KC_NOQUAL   EQU   0
KC_VANILLA  EQU   7	      ; note that SHIFT+ALT+CTRL is VANILLA
KCB_SHIFT   EQU   0
KCF_SHIFT   EQU   $01
KCB_ALT     EQU   1
KCF_ALT     EQU   $02
KCB_CONTROL EQU   2
KCF_CONTROL EQU   $04
KCB_DOWNUP  EQU   3
KCF_DOWNUP  EQU   $08
KCB_DEAD    EQU   5		; may be dead or modified by dead key:
KCF_DEAD    EQU   $20		;   use dead prefix bytes

KCB_STRING  EQU   6
KCF_STRING  EQU   $40

;------ Dead Prefix Bytes
DPB_MOD	EQU	0
DPF_MOD	EQU	$01
DPB_DEAD	EQU	3
DPF_DEAD	EQU	$08

DP_2DINDEXMASK	EQU	$0F	; mask for index for 1st of two dead keys
DP_2DFACSHIFT	EQU	4	; shift for factor for 1st of two dead keys

	ENDC	; DEVICES_KEYMAP_I
