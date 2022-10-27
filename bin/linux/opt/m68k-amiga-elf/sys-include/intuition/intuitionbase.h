#ifndef INTUITION_INTUITIONBASE_H
#define INTUITION_INTUITIONBASE_H 1
/*
**  $VER: intuitionbase.h 38.0 (12.6.1991)
**  Includes Release 45.1
**
**  Public part of IntuitionBase structure and supporting structures
**
**  (C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif


#ifndef EXEC_INTERRUPTS_H
#include <exec/interrupts.h>
#endif

/* these are the display modes for which we have corresponding parameter
 *  settings in the config arrays
 */
#define DMODECOUNT	0x0002	/* how many modes there are */
#define HIRESPICK	0x0000
#define LOWRESPICK	0x0001

#define EVENTMAX 10		/* size of event array */

/* these are the system Gadget defines */
#define RESCOUNT	2
#define HIRESGADGET	0
#define LOWRESGADGET	1

#define GADGETCOUNT	8
#define UPFRONTGADGET	0
#define DOWNBACKGADGET	1
#define SIZEGADGET	2
#define CLOSEGADGET	3
#define DRAGGADGET	4
#define SUPFRONTGADGET	5
#define SDOWNBACKGADGET	6
#define SDRAGGADGET	7

/* ======================================================================== */
/* === IntuitionBase ====================================================== */
/* ======================================================================== */
/*
 * Be sure to protect yourself against someone modifying these data as
 * you look at them.  This is done by calling:
 *
 * lock = LockIBase(0), which returns a ULONG.	When done call
 * UnlockIBase(lock) where lock is what LockIBase() returned.
 */

/* This structure is strictly READ ONLY */
struct IntuitionBase
{
    struct Library LibNode;

    struct View ViewLord;

    struct Window *ActiveWindow;
    struct Screen *ActiveScreen;

    /* the FirstScreen variable points to the frontmost Screen.  Screens are
     * then maintained in a front to back order using Screen.NextScreen
     */
    struct Screen *FirstScreen; /* for linked list of all screens */

    ULONG Flags;	/* values are all system private */
    WORD	MouseY, MouseX;
			/* note "backwards" order of these		*/

    ULONG Seconds;	/* timestamp of most current input event */
    ULONG Micros;	/* timestamp of most current input event */

    /* I told you this was private.
     * The data beyond this point has changed, is changing, and
     * will continue to change.
     */
};

#endif

