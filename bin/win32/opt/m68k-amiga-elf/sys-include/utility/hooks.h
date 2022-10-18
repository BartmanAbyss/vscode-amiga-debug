#ifndef UTILITY_HOOKS_H
#define UTILITY_HOOKS_H
/*
**	$VER: hooks.h 39.2 (16.6.1993)
**	Includes Release 45.1
**
**	Callback hooks
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif


/*****************************************************************************/


struct Hook
{
    struct MinNode h_MinNode;
    ULONG	   (*h_Entry)();	/* assembler entry point */
    ULONG	   (*h_SubEntry)();	/* often HLL entry point */
    APTR	   h_Data;		/* owner specific	 */
};

/* Useful definition for casting function pointers:
 * hook.h_SubEntry = (HOOKFUNC)AFunction
 */
typedef unsigned long (*HOOKFUNC)();

/* Hook calling conventions.
 *
 * The function pointed to by Hook.h_Entry is called with the following
 * parameters:
 *
 *	A0 - pointer to hook data structure itself
 *	A1 - pointer to parameter structure ("message")
 *	A2 - Hook specific address data ("object")
 *
 * Control will be passed to the routine h_Entry.  For many
 * High-Level Languages (HLL), this will be an assembly language
 * stub which pushes registers on the stack, does other setup,
 * and then calls the function at h_SubEntry.
 *
 * The standard C receiving code is:
 *
 *    HookFunc(struct Hook *hook, APTR object, APTR message)
 *
 * Note that register natural order differs from this convention for C
 * parameter order, which is A0,A2,A1.
 *
 * The assembly language stub for "vanilla" C parameter conventions
 * could be:
 *
 * _hookEntry:
 *	move.l	a1,-(sp)		; push message packet pointer
 *	move.l	a2,-(sp)		; push object pointer
 *	move.l	a0,-(sp)		; push hook pointer
 *	move.l	h_SubEntry(a0),a0	; fetch C entry point ...
 *	jsr	(a0)			; ... and call it
 *	lea	12(sp),sp		; fix stack
 *	rts
 *
 * With this function as your interface stub, you can write a Hook setup
 * function as:
 *
 * InitHook(struct Hook *hook, ULONG (*c_function)(), APTR userdata)
 * {
 * ULONG (*hookEntry)();
 *
 *     hook->h_Entry	= hookEntry;
 *     hook->h_SubEntry = c_function;
 *     hook->h_Data	= userdata;
 * }
 *
 * With a compiler capable of registerized parameters, such as SAS C, you
 * can put the C function in the h_Entry field directly. For example, for
 * SAS C:
 *
 *   ULONG __saveds __asm HookFunc(register __a0 struct Hook *hook,
 *				   register __a2 APTR	      object,
 *				   register __a1 APTR	      message);
 *
 */


/*****************************************************************************/


#endif /* UTILITY_HOOKS_H */
