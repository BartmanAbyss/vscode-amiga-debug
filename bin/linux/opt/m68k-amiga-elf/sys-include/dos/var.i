	IFND	DOS_VAR_I
DOS_VAR_I SET	1
**
**	$VER: var.i 36.13 (2.6.1992)
**	Includes Release 45.1
**
**	include file for dos local and environment variables
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**

     IFND  EXEC_NODES_I
     INCLUDE "exec/nodes.i"
     ENDC

* the structure in the pr_LocalVars list
* Do NOT allocate yourself, use SetVar()!!! This structure may grow in
* future releases!  The list should be left in alphabetical order, and
* may have multiple entries with the same name but different types.

 STRUCTURE LocalVar,0
	STRUCT	lv_Node,LN_SIZE
	UWORD	lv_Flags
	APTR	lv_Value
	ULONG	lv_Len
 LABEL LocalVar_SIZEOF

*
* The lv_Flags bits are available to the application.  The unused
* lv_Node.ln_Pri bits are reserved for system use.
*

* bit definitions for lv_Node.ln_Type:

LV_VAR		EQU	0		; a variable
LV_ALIAS	EQU	1		; an alias
* to be or'ed into type:
LVB_IGNORE	EQU	7		; ignore this entry on GetVar, etc
LVF_IGNORE	EQU	$80

* definitions of flags passed to GetVar()/SetVar()/DeleteVar()
* bit defs to be OR'ed with the type:
* item will be treated as a single line of text unless BINARY_VAR is used

	BITDEF	GV,GLOBAL_ONLY,8
	BITDEF	GV,LOCAL_ONLY,9
	BITDEF	GV,BINARY_VAR,10	; treat as binary variable
	BITDEF	GV,DONT_NULL_TERM,11	; only with GVF_BINARY_VAR

* this is only supported in >= V39 dos.  V37 dos ignores this.
* this causes SetVar to affect ENVARC: as well as ENV:.
	BITDEF	GV,SAVE_VAR,12		; only with GVF_GLOBAL_VAR


	ENDC	; DOS_VAR_I
