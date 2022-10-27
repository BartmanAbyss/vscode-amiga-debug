	IFND	EXEC_INTERRUPTS_I
EXEC_INTERRUPTS_I	SET	1
**
**	$VER: interrupts.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Callback structures used by hardware & software interrupts
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


*----------------------------------------------------------------
*
*   Interrupt Structure
*
*----------------------------------------------------------------

 STRUCTURE  IS,LN_SIZE
    APTR    IS_DATA
    APTR    IS_CODE
    LABEL   IS_SIZE


*---------------------------------------------------------------------
*
*   Exec Internal Interrupt Vectors
*
*---------------------------------------------------------------------

 STRUCTURE  IV,0
    APTR    IV_DATA
    APTR    IV_CODE
    APTR    IV_NODE
    LABEL   IV_SIZE


*------ System Flag bits (in SysBase.SysFlags )

    BITDEF  S,SAR,15	    ; scheduling attention required (TOP BIT)
    BITDEF  S,TQE,14	    ; time quantum expended -- time to resched
    BITDEF  S,SINT,13


*---------------------------------------------------------------------
*
*   Software Interrupt List Headers
*
*---------------------------------------------------------------------

 STRUCTURE  SH,LH_SIZE
    UWORD   SH_PAD
    LABEL   SH_SIZE

SIH_PRIMASK  EQU	$0F0
SIH_QUEUES   EQU	5

** this is a fake INT definition, used only for AddIntServer and the like
	BITDEF	INT,NMI,15

	ENDC	; EXEC_INTERRUPTS_I
