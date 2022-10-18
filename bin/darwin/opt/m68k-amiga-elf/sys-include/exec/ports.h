#ifndef	EXEC_PORTS_H
#define	EXEC_PORTS_H
/*
**	$VER: ports.h 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Message ports and Messages.
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

#ifndef EXEC_TASKS_H
#include <exec/tasks.h>
#endif /* EXEC_TASKS_H */


/****** MsgPort *****************************************************/

struct MsgPort {
    struct  Node mp_Node;
    UBYTE   mp_Flags;
    UBYTE   mp_SigBit;		/* signal bit number	*/
    void   *mp_SigTask;		/* object to be signalled */
    struct  List mp_MsgList;	/* message linked list	*/
};

#define mp_SoftInt mp_SigTask	/* Alias */

/* mp_Flags: Port arrival actions (PutMsg) */
#define PF_ACTION	3	/* Mask */
#define PA_SIGNAL	0	/* Signal task in mp_SigTask */
#define PA_SOFTINT	1	/* Signal SoftInt in mp_SoftInt/mp_SigTask */
#define PA_IGNORE	2	/* Ignore arrival */


/****** Message *****************************************************/

struct Message {
    struct  Node mn_Node;
    struct  MsgPort *mn_ReplyPort;  /* message reply port */
    UWORD   mn_Length;		    /* total message length, in bytes */
				    /* (include the size of the Message */
				    /* structure in the length) */
};

#endif	/* EXEC_PORTS_H */
