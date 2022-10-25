#ifndef EXEC_AVL_H
#define EXEC_AVL_H
/*
**	$VER: avl.h 45.4 (27.2.2001)
**	Includes Release 45.1
**
**	AVL tree data structure definitions
**
**	(C) Copyright 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif /* EXEC_TYPES_H */

/* Don't even think about the contents of this structure. Just embed it
 * and reference it
 */
struct AVLNode
{
	ULONG reserved[4];
};

/* Note that this is really a totally abstract 32 bit value */
typedef void * AVLKey;

/* Callback functions for the AVL tree handling. They will have to return
 * strcmp like results for the given arguments (<0/0/>0).
 * You can compare to nodes or a node with a key.
 */
#ifdef __SASC
typedef LONG (* __asm AVLNODECOMP)(register __a0 struct AVLNode *avlnode1, register __a1 struct AVLNode *avlnode2);
typedef LONG (* __asm AVLKEYCOMP)(register __a0 struct AVLNode *avlnode1, register __a1 AVLKey avlkey);
#else
typedef APTR AVLNODECOMP;
typedef APTR AVLKEYCOMP;
#endif /* __SASC */

#endif /* EXEC_AVL_H */
