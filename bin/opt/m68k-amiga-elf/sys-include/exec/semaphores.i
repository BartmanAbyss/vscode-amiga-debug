	IFND	EXEC_SEMAPHORES_I
EXEC_SEMAPHORES_I	SET	1
**
**	$VER: semaphores.i 39.1 (7.2.1992)
**	Includes Release 45.1
**
**	Definitions for locking functions.
**
**	(C) Copyright 1986-2001 Amiga, Inc.
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
*   Signal Semaphore Structure
*
*----------------------------------------------------------------

** Private structure used by ObtainSemaphore()
 STRUCTURE  SSR,MLN_SIZE
    APTR    SSR_WAITER
    LABEL   SSR_SIZE

** Signal Semaphore data structure
 STRUCTURE  SS,LN_SIZE
    WORD    SS_NESTCOUNT
    STRUCT  SS_WAITQUEUE,MLH_SIZE
    STRUCT  SS_MULTIPLELINK,SSR_SIZE
    APTR    SS_OWNER
    WORD    SS_QUEUECOUNT
    LABEL   SS_SIZE

** Semaphore procure message (for use in V39 Procure/Vacate ****/
 STRUCTURE SemaphoreMessage,MN_SIZE
    APTR    SSM_SEMAPHORE
    LABEL   SSM_SIZEOF


*----------------------------------------------------------------
*
*   Semaphore Structure (Old Procure/Vacate type, not reliable)
*
*----------------------------------------------------------------


 STRUCTURE  SM,MP_SIZE		; Do not use these semaphores!
    WORD    SM_BIDS	      ; number of bids for lock
    LABEL   SM_SIZE

*------ unions:

SM_LOCKMSG    EQU  MP_SIGTASK


	ENDC	; EXEC_SEMAPHORES_I
