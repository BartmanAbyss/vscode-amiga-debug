#ifndef	EXEC_SEMAPHORES_H
#define	EXEC_SEMAPHORES_H
/*
**	$VER: semaphores.h 39.1 (7.2.1992)
**	Includes Release 45.1
**
**	Definitions for locking functions.
**
**	(C) Copyright 1986-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif /* EXEC_NODES_H */

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif /* EXEC_LISTS_H */

#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif /* EXEC_PORTS_H */

#ifndef EXEC_TASKS_H
#include <exec/tasks.h>
#endif /* EXEC_TASKS_H */


/****** SignalSemaphore *********************************************/

/* Private structure used by ObtainSemaphore() */
struct SemaphoreRequest
{
	struct MinNode	sr_Link;
	struct Task	*sr_Waiter;
};

/* Signal Semaphore data structure */
struct SignalSemaphore
{
	struct Node		ss_Link;
	WORD			ss_NestCount;
	struct MinList		ss_WaitQueue;
	struct SemaphoreRequest	ss_MultipleLink;
	struct Task		*ss_Owner;
	WORD			ss_QueueCount;
};

/****** Semaphore procure message (for use in V39 Procure/Vacate) ****/
struct SemaphoreMessage
{
	struct Message		ssm_Message;
	struct SignalSemaphore	*ssm_Semaphore;
};

#define	SM_SHARED	(1L)
#define	SM_EXCLUSIVE	(0L)

/****** Semaphore (Old Procure/Vacate type, not reliable) ***********/

struct Semaphore	/* Do not use these semaphores! */
{
	struct MsgPort	sm_MsgPort;
	WORD		sm_Bids;
};

#define sm_LockMsg mp_SigTask

#endif	/* EXEC_SEMAPHORES_H */
