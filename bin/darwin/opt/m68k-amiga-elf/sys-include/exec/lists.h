#ifndef EXEC_LISTS_H
#define EXEC_LISTS_H
/*
**	$VER: lists.h 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Definitions and macros for use with Exec lists
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif /* EXEC_NODES_H */

/*
 *  Full featured list header.
 */
struct List {
   struct  Node *lh_Head;
   struct  Node *lh_Tail;
   struct  Node *lh_TailPred;
   UBYTE   lh_Type;
   UBYTE   l_pad;
};	/* word aligned */

/*
 * Minimal List Header - no type checking
 */
struct MinList {
   struct  MinNode *mlh_Head;
   struct  MinNode *mlh_Tail;
   struct  MinNode *mlh_TailPred;
};	/* longword aligned */


/*
 *	Check for the presence of any nodes on the given list.	These
 *	macros are even safe to use on lists that are modified by other
 *	tasks.	However; if something is simultaneously changing the
 *	list, the result of the test is unpredictable.
 *
 *	Unless you first arbitrated for ownership of the list, you can't
 *	_depend_ on the contents of the list.  Nodes might have been added
 *	or removed during or after the macro executes.
 *
 *		if( IsListEmpty(list) )		printf("List is empty\n");
 */
#define IsListEmpty(x) \
	( ((x)->lh_TailPred) == (struct Node *)(x) )

#define IsMsgPortEmpty(x) \
	( ((x)->mp_MsgList.lh_TailPred) == (struct Node *)(&(x)->mp_MsgList) )


#endif	/* EXEC_LISTS_H */
