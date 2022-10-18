	IFND	EXEC_LISTS_I
EXEC_LISTS_I	SET	1
**
**	$VER: lists.i 39.1 (28.5.1992)
**	Includes Release 45.1
**
**	Definitions and macros for use with Exec lists.  Most of the
**	macros require ownership or locking of the list before use.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND EXEC_NODES_I
	INCLUDE "exec/nodes.i"
	ENDC	; EXEC_NODES_I


*---------------------------------------------------------------------

*
* Full featured list header
*
   STRUCTURE	LH,0
	APTR	LH_HEAD
	APTR	LH_TAIL
	APTR	LH_TAILPRED
	UBYTE	LH_TYPE
	UBYTE	LH_pad
	LABEL	LH_SIZE ;word aligned

*
* Minimal List Header - no type checking (best for most applications)
*
   STRUCTURE	MLH,0
	APTR	MLH_HEAD
	APTR	MLH_TAIL
	APTR	MLH_TAILPRED
	LABEL	MLH_SIZE ;longword aligned

*---------------------------------------------------------------------

;Prepare a list header for use
NEWLIST     MACRO   ; list
	    MOVE.L  \1,LH_TAILPRED(\1)
	    ADDQ.L  #4,\1	;Get address of LH_TAIL
	    CLR.L   (\1)	;Clear LH_TAIL
	    MOVE.L  \1,-(\1)	;Address of LH_TAIL to LH_HEAD
	    ENDM

;Test if list is empty (list address in register)
;This operation is safe at any time - no list arbitration needed.
TSTLIST     MACRO   ; [list]
	    IFGT    NARG-1
	       FAIL    !!! TSTLIST - Too many arguments !!!
	    ENDC
	    IFC     '\1',''
	    CMP.L   LH_TAIL+LN_PRED(A0),A0
	    ENDC
	    IFNC    '\1',''
	    CMP.L   LH_TAIL+LN_PRED(\1),\1
	    ENDC
	    ENDM

;Test if list is empty (from effective address of list)
;list arbitration required.
TSTLST2     MACRO    ;EA of list,=node
	    MOVE.L   \1,\2
	    TST.L    (\2)
	    ENDM

;Get next in list
SUCC	    MACRO   ; node,=succ
	    MOVE.L  (\1),\2
	    ENDM

;Get previous in list
PRED	    MACRO   ; node,=pred
	    MOVE.L  LN_PRED(\1),\2
	    ENDM

;If empty, branch
IFEMPTY     MACRO   ; list,label
	    CMP.L   LH_TAIL+LN_PRED(\1),\1
	    BEQ     \2
	    ENDM

;If not empty, branch
IFNOTEMPTY  MACRO   ; list,label
	    CMP.L   LH_TAIL+LN_PRED(\1),\1
	    BNE     \2
	    ENDM

;Get next node, test if at end
TSTNODE     MACRO   ; node,=next
	    MOVE.L  (\1),\2
	    TST.L   (\2)
	    ENDM

;Get next, go to exit label if at end
NEXTNODE    MACRO   ; next=next,=current,exit_label ([.s],DX,AX,DISP16)
	    MOVE.L  \1,\2
	    MOVE.L  (\2),\1
	    IFC     '\0',''	;Check extension
	    BEQ     \3
	    ENDC
	    IFNC    '\0',''
	    BEQ.S   \3
	    ENDC
	    ENDM

;Add to head of list
ADDHEAD     MACRO   ; A0-list(destroyed) A1-node D0-(destroyed)
	    MOVE.L  (A0),D0
	    MOVE.L  A1,(A0)
	    MOVEM.L D0/A0,(A1)
	    MOVE.L  D0,A0
	    MOVE.L  A1,LN_PRED(A0)
	    ENDM

;Add to tail of list
ADDTAIL     MACRO   ; A0-list(destroyed) A1-node D0-(destroyed)
	    ADDQ.L  #LH_TAIL,A0
	    MOVE.L  LN_PRED(A0),D0
	    MOVE.L  A1,LN_PRED(A0)
	    EXG     D0,A0
	    MOVEM.L D0/A0,(A1)
	    MOVE.L  A1,(A0)
	    ENDM

;Remove node from whatever list it is in
REMOVE	    MACRO   ; A0-(destroyed)  A1-node(destroyed)
	    MOVE.L  (A1)+,A0
	    MOVE.L  (A1),A1	; LN_PRED
	    MOVE.L  A0,(A1)
	    MOVE.L  A1,LN_PRED(A0)
	    ENDM

;Remove node from head of list
REMHEAD     MACRO   ; A0-list A1-(destroyed) D0=node
	    MOVE.L  (A0),A1
	    MOVE.L  (A1),D0
	    BEQ.S   REMHEAD\@
	    MOVE.L  D0,(A0)
	    EXG.L   D0,A1
	    MOVE.L  A0,LN_PRED(A1)
REMHEAD\@
	    ENDM

;Remove head quickly
;	Useful when a scratch register is available, and
;	list is known to contain at least one node.
REMHEADQ    MACRO   ; list,=node,scratchReg-(destroyed)
	    MOVE.L  (\1),\2
	    MOVE.L  (\2),\3
	    MOVE.L  \3,(\1)
	    MOVE.L  \1,LN_PRED(\3)
	    ENDM

;Remove node from tail of list
REMTAIL     MACRO   ; A0-list A1-(destroyed) D0=node
	    MOVE.L  LH_TAIL+LN_PRED(A0),A1
	    MOVE.L  LN_PRED(A1),D0
	    BEQ.S   REMTAIL\@
	    MOVE.L  D0,LH_TAIL+LN_PRED(A0)
	    EXG.L   D0,A1
	    MOVE.L  A0,(A1)
	    ADDQ.L  #4,(A1)
REMTAIL\@
	    ENDM

	ENDC	; EXEC_LISTS_I
