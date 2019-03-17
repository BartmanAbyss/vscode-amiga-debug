	IFND	EXEC_TASKS_I
EXEC_TASKS_I	SET	1
**
**	$VER: tasks.i 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	Task Control Block, Signals, and Task flags.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC	; EXEC_NODES_I

    IFND EXEC_LISTS_I
    INCLUDE "exec/lists.i"
    ENDC	; EXEC_LISTS_I

    IFND EXEC_PORTS_I
    INCLUDE "exec/ports.i"
    ENDC	; EXEC_PORTS_I


*----------------------------------------------------------------
*
*	Task Control Structure
*
*	Please use Exec functions to modify task structure fields,
*	where available.
*
*----------------------------------------------------------------

 STRUCTURE  TC_Struct,LN_SIZE	    ; was "TC"
    UBYTE   TC_FLAGS
    UBYTE   TC_STATE
    BYTE    TC_IDNESTCNT	    ; intr disabled nesting
    BYTE    TC_TDNESTCNT	    ; task disabled nesting
    ULONG   TC_SIGALLOC	    ; sigs allocated
    ULONG   TC_SIGWAIT		    ; sigs we are waiting for
    ULONG   TC_SIGRECVD	    ; sigs we have received
    ULONG   TC_SIGEXCEPT	    ; sigs we take as exceptions
    ;* Pointer to an extended task structure.  This structure is allocated
    ;* by V36 Exec if the proper flags in tc_ETaskFlags are set.  This
    ;* field was formerly defined as:
    ;*		UWORD	TC_TRAPALLOC	    ; traps allocated
    ;*		UWORD	TC_TRAPABLE	    ; traps enabled
    ;* Please see the Exec AllocTrap() and FreeTrap() calls.
    ;*
    APTR    tc_ETask		    ; pointer to extended task structure
    APTR    TC_EXCEPTDATA	    ; data for except proc
    APTR    TC_EXCEPTCODE	    ; exception procedure
    APTR    TC_TRAPDATA	    ; data for proc trap proc
    APTR    TC_TRAPCODE	    ; proc trap procedure
    APTR    TC_SPREG		    ; stack pointer
    APTR    TC_SPLOWER		    ; stack lower bound
    APTR    TC_SPUPPER		    ; stack upper bound + 2
    FPTR    TC_SWITCH		    ; task losing CPU (function pointer)
    FPTR    TC_LAUNCH		    ; task getting CPU (function pointer)
    STRUCT  TC_MEMENTRY,LH_SIZE     ; Allocated memory list.  Freed by RemTask()
    APTR    TC_Userdata		    ; For use by the task; no restrictions!
    LABEL   TC_SIZE


;Don't even _think_ about allocating one of these yourself.
 STRUCTURE	ETask,MN_SIZE
		APTR	et_Parent		;Pointer to task (TC)
		ULONG	et_UniqueID		;ID unique to this task
		STRUCT	et_Children,MLH_SIZE	;List of children
		UWORD	et_TRAPALLOC
		UWORD	et_TRAPABLE
		ULONG	et_Result1		;First result
		APTR	et_Result2		;Result data pointer (AllocVec)
		STRUCT	et_TaskMsgPort,MP_SIZE
		LABEL	ETask_SIZEOF	;_never_ depend on this size!


CHILD_NOTNEW	EQU	1	;function not called from a new style task
CHILD_NOTFOUND	EQU	2	;child not found
CHILD_EXITED	EQU	3	;child has exited
CHILD_ACTIVE	EQU	4	;child has exited


;Stack swap structure as passed to StackSwap()
;
 STRUCTURE	StackSwapStruct,0
		APTR	stk_Lower	;Lowest byte of stack
		ULONG	stk_Upper	;Upper end of stack (size + Lowest)
		APTR	stk_Pointer	;Stack pointer at switch point
		LABEL	StackSwapStruct_SIZEOF


;------ TC_FLAGS Bits:

    BITDEF  T,PROCTIME,0
    BITDEF  T,ETASK,3
    BITDEF  T,STACKCHK,4
    BITDEF  T,EXCEPT,5
    BITDEF  T,SWITCH,6		;Enable TC_SWITCH point
    BITDEF  T,LAUNCH,7		;Enable TC_LAUNCH point


;------ Task States:

TS_INVALID  EQU     0
TS_ADDED    EQU     TS_INVALID+1
TS_RUN	    EQU     TS_ADDED+1
TS_READY    EQU     TS_RUN+1
TS_WAIT     EQU     TS_READY+1
TS_EXCEPT   EQU     TS_WAIT+1
TS_REMOVED  EQU     TS_EXCEPT+1


;------ System Task Signals:

	BITDEF	SIG,ABORT,0
	BITDEF	SIG,CHILD,1
	BITDEF	SIG,BLIT,4	; Note: same as SINGLE
	BITDEF	SIG,SINGLE,4	; "single-threaded".  Note: same as BLIT
	BITDEF	SIG,INTUITION,5
	BITDEF	SIG,NET,7
	BITDEF	SIG,DOS,8


SYS_SIGALLOC	EQU	$0FFFF		; pre-allocated signals
SYS_TRAPALLOC	EQU	$08000		; pre-allocated traps

	ENDC	; EXEC_TASKS_I
