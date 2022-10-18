#ifndef	EXEC_TASKS_H
#define	EXEC_TASKS_H
/*
**	$VER: tasks.h 39.3 (18.9.1992)
**	Includes Release 45.1
**
**	Task Control Block, Signals, and Task flags.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif /* EXEC_NODES_H */

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif /* EXEC_LISTS_H */


/* Please use Exec functions to modify task structure fields, where available.
 */
struct Task {
    struct  Node tc_Node;
    UBYTE   tc_Flags;
    UBYTE   tc_State;
    BYTE    tc_IDNestCnt;	    /* intr disabled nesting*/
    BYTE    tc_TDNestCnt;	    /* task disabled nesting*/
    ULONG   tc_SigAlloc;	    /* sigs allocated */
    ULONG   tc_SigWait;	    /* sigs we are waiting for */
    ULONG   tc_SigRecvd;	    /* sigs we have received */
    ULONG   tc_SigExcept;	    /* sigs we will take excepts for */
    UWORD   tc_TrapAlloc;	    /* traps allocated */
    UWORD   tc_TrapAble;	    /* traps enabled */
    APTR    tc_ExceptData;	    /* points to except data */
    APTR    tc_ExceptCode;	    /* points to except code */
    APTR    tc_TrapData;	    /* points to trap data */
    APTR    tc_TrapCode;	    /* points to trap code */
    APTR    tc_SPReg;		    /* stack pointer	    */
    APTR    tc_SPLower;	    /* stack lower bound    */
    APTR    tc_SPUpper;	    /* stack upper bound + 2*/
    VOID    (*tc_Switch)();	    /* task losing CPU	  */
    VOID    (*tc_Launch)();	    /* task getting CPU  */
    struct  List tc_MemEntry;	    /* Allocated memory. Freed by RemTask() */
    APTR    tc_UserData;	    /* For use by the task; no restrictions! */
};

/*
 * Stack swap structure as passed to StackSwap()
 */
struct	StackSwapStruct {
	APTR	stk_Lower;	/* Lowest byte of stack */
	ULONG	stk_Upper;	/* Upper end of stack (size + Lowest) */
	APTR	stk_Pointer;	/* Stack pointer at switch point */
};

/*----- Flag Bits ------------------------------------------*/
#define TB_PROCTIME	0
#define TB_ETASK	3
#define TB_STACKCHK	4
#define TB_EXCEPT	5
#define TB_SWITCH	6
#define TB_LAUNCH	7

#define TF_PROCTIME	(1L<<0)
#define TF_ETASK	(1L<<3)
#define TF_STACKCHK	(1L<<4)
#define TF_EXCEPT	(1L<<5)
#define TF_SWITCH	(1L<<6)
#define TF_LAUNCH	(1L<<7)

/*----- Task States ----------------------------------------*/
#define TS_INVALID	0
#define TS_ADDED	1
#define TS_RUN		2
#define TS_READY	3
#define TS_WAIT	4
#define TS_EXCEPT	5
#define TS_REMOVED	6

/*----- Predefined Signals -------------------------------------*/
#define SIGB_ABORT	0
#define SIGB_CHILD	1
#define SIGB_BLIT	4	/* Note: same as SINGLE */
#define SIGB_SINGLE	4	/* Note: same as BLIT */
#define SIGB_INTUITION	5
#define	SIGB_NET	7
#define SIGB_DOS	8

#define SIGF_ABORT	(1L<<0)
#define SIGF_CHILD	(1L<<1)
#define SIGF_BLIT	(1L<<4)
#define SIGF_SINGLE	(1L<<4)
#define SIGF_INTUITION	(1L<<5)
#define	SIGF_NET	(1L<<7)
#define SIGF_DOS	(1L<<8)

#endif	/* EXEC_TASKS_H */
