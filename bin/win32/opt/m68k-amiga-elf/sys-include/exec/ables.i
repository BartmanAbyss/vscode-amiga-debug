	IFND	EXEC_ABLES_I
EXEC_ABLES_I	SET	1
**
**	$VER: ables.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Task switch and interrupt control macros
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC	; EXEC_TYPES_I

    IFND EXEC_EXECBASE_I
    INCLUDE "exec/execbase.i"
    ENDC	; EXEC_EXECBASE_I


*-------------------------------------------------------------------------
*
*   Interrupt Exclusion Macros.  Disable all tasks and interrupts.
*
*-------------------------------------------------------------------------

INT_ABLES   MACRO		; externals used by DISABLE and ENABLE
	    XREF    _intena
	    ENDM

;Disable interrupts.  Avoid use of DISABLE if at all possible.
;Please realize the danger of this macro!  Don't disable for long periods!
DISABLE     MACRO   ; [scratchReg],[NOFETCH] or have ExecBase in A6.
	    IFC     '\1',''             ;Case 1: Assume A6=ExecBase
	      MOVE.W  #$04000,_intena	;(NOT IF_SETCLR)+IF_INTEN
	      ADDQ.B  #1,IDNestCnt(A6)
	      MEXIT
	    ENDC
	    IFC     '\2','NOFETCH'      ;Case 2: Assume \1=ExecBase
	      MOVE.W  #$04000,_intena
	      ADDQ.B  #1,IDNestCnt(\1)
	      MEXIT
	    ENDC
	    IFNC    '\1',''             ;Case 3: Use \1 as scratch
	      MOVE.L  4,\1		;Get ExecBase
	      MOVE.W  #$04000,_intena
	      ADDQ.B  #1,IDNestCnt(\1)
	      MEXIT
	    ENDC
	    ENDM

;Enable interrupts.  Please realize the danger of this macro!
ENABLE	    MACRO   ; [scratchReg],[NOFETCH] or have ExecBase in A6.
	    IFC     '\1',''             ;Case 1: Assume A6=ExecBase
	      SUBQ.B  #1,IDNestCnt(A6)
	      BGE.S   ENABLE\@
	      MOVE.W  #$0C000,_intena	;IF_SETCLR+IF_INTEN
ENABLE\@:
	      MEXIT
	    ENDC
	    IFC     '\2','NOFETCH'      ;Case 2: Assume \1=ExecBase
	      SUBQ.B  #1,IDNestCnt(\1)
	      BGE.S   ENABLE\@
	      MOVE.W  #$0C000,_intena
ENABLE\@:
	      MEXIT
	    ENDC
	    IFNC    '\1',''             ;Case 3: Use \1 as scratch
	      MOVE.L  4,\1		;Get ExecBase
	      SUBQ.B  #1,IDNestCnt(\1)
	      BGE.S   ENABLE\@
	      MOVE.W  #$0C000,_intena
ENABLE\@:
	      MEXIT
	    ENDC
	    ENDM


*-------------------------------------------------------------------------
*
*   Tasking Exclusion Macros.  Forbid all other tasks (but not interrupts)
*
*-------------------------------------------------------------------------

TASK_ABLES  MACRO		; externals used by FORBID and PERMIT
	    XREF    _LVOPermit
	    ENDM

;Prevent task switching (disables reschedule)
FORBID	    MACRO   ; [scratchReg],[NOFETCH] or ExecBase in A6!
	    IFC     '\1',''             ;Case 1: Assume A6=ExecBase
	      ADDQ.B  #1,TDNestCnt(A6)
	      MEXIT
	    ENDC
	    IFC     '\2','NOFETCH'      ;Case 2: Assume \1=ExecBase
	      ADDQ.B  #1,TDNestCnt(\1)
	      MEXIT
	    ENDC
	    IFNC    '\1',''             ;Case 3: Use \1 as scratch
	      MOVE.L  4,\1	;Get ExecBase
	      ADDQ.B  #1,TDNestCnt(\1)
	      MEXIT
	    ENDC
	    ENDM

;Enable task switching
PERMIT	    MACRO   ; [saveFlag],[NOFETCH] or ExecBase in A6!
	    IFC     '\1',''             ;Case 1: Assume A6=ExecBase
	      JSR     _LVOPermit(A6)
	      MEXIT
	    ENDC
	    IFC     '\2','NOFETCH'      ;Case 2: Assume \1=ExecBase
	      EXG.L   A6,\1		;put execbase in A6
	      JSR     _LVOPermit(A6)    ;no registers touched.  A6=ExecBase
	      EXG.L   A6,\1
	      MEXIT
	    ENDC
	    IFNC    '\1',''             ;Case 2: save/restore A6
	      MOVE.L  A6,-(SP)
	      MOVE.L  4,A6
	      JSR     _LVOPermit(A6)
	      MOVE.L  (SP)+,A6
	      MEXIT
	    ENDC
	    ENDM

	ENDC	; EXEC_ABLES_I
