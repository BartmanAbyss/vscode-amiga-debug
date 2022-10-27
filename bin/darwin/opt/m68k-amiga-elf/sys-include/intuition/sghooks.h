#ifndef INTUITION_SGHOOKS_H
#define INTUITION_SGHOOKS_H TRUE
/*
**  $VER: sghooks.h 38.1 (11.11.1991)
**  Includes Release 45.1
**
**  string gadget extensions and hooks
**
**  (C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

struct StringExtend {
    /* display specifications	*/
    struct TextFont *Font;	/* must be an open Font (not TextAttr)	*/
    UBYTE	Pens[2];	/* color of text/backgroun		*/
    UBYTE	ActivePens[2];	/* colors when gadget is active		*/

    /* edit specifications	*/
    ULONG	InitialModes;	/* initial mode flags, below		*/
    struct Hook *EditHook;	/* if non-NULL, must supply WorkBuffer	*/
    UBYTE	*WorkBuffer;	/* must be as large as StringInfo.Buffer*/

    ULONG	Reserved[4];	/* set to 0				*/
};

struct SGWork	{
    /* set up when gadget is first activated	*/
    struct Gadget	*Gadget;	/* the contestant itself	*/
    struct StringInfo	*StringInfo;	/* easy access to sinfo		*/
    UBYTE		*WorkBuffer;	/* intuition's planned result	*/
    UBYTE		*PrevBuffer;	/* what was there before	*/
    ULONG		Modes;		/* current mode			*/

    /* modified for each input event	*/
    struct InputEvent	*IEvent;	/* actual event: do not change	*/
    UWORD		Code;		/* character code, if one byte	*/
    WORD		BufferPos;	/* cursor position		*/
    WORD		NumChars;
    ULONG		Actions;	/* what Intuition will do	*/
    LONG		LongInt;	/* temp storage for longint	*/

    struct GadgetInfo	*GadgetInfo;	/* see cghooks.h		*/
    UWORD		EditOp;		/* from constants below		*/
};

/* SGWork.EditOp -
 * These values indicate what basic type of operation the global
 * editing hook has performed on the string before your gadget's custom
 * editing hook gets called.  You do not have to be concerned with the
 * value your custom hook leaves in the EditOp field, only if you
 * write a global editing hook.
 *
 * For most of these general edit operations, you'll want to compare
 * the BufferPos and NumChars of the StringInfo (before global editing)
 * and SGWork (after global editing).
 */

#define EO_NOOP		(0x0001)
	/* did nothing							*/
#define EO_DELBACKWARD	(0x0002)
	/* deleted some chars (maybe 0).				*/
#define EO_DELFORWARD	(0x0003)
	/* deleted some characters under and in front of the cursor	*/
#define EO_MOVECURSOR	(0x0004)
	/* moved the cursor						*/
#define EO_ENTER	(0x0005)
	/* "enter" or "return" key, terminate				*/
#define EO_RESET	(0x0006)
	/* current Intuition-style undo					*/
#define EO_REPLACECHAR	(0x0007)
	/* replaced one character and (maybe) advanced cursor		*/
#define EO_INSERTCHAR	(0x0008)
	/* inserted one char into string or added one at end		*/
#define EO_BADFORMAT	(0x0009)
	/* didn't like the text data, e.g., Bad LONGINT			*/
#define EO_BIGCHANGE	(0x000A)	/* unused by Intuition	*/
	/* complete or major change to the text, e.g. new string	*/
#define EO_UNDO		(0x000B)	/* unused by Intuition	*/
	/* some other style of undo					*/
#define EO_CLEAR	(0x000C)
	/* clear the string						*/
#define EO_SPECIAL	(0x000D)	/* unused by Intuition	*/
	/* some operation that doesn't fit into the categories here	*/


/* Mode Flags definitions (ONLY first group allowed as InitialModes)	*/
#define SGM_REPLACE	(1L << 0)	/* replace mode			*/
/* please initialize StringInfo with in-range value of BufferPos
 * if you are using SGM_REPLACE mode.
 */

#define SGM_FIXEDFIELD	(1L << 1)	/* fixed length buffer		*/
					/* always set SGM_REPLACE, too	*/
#define SGM_NOFILTER	(1L << 2)	/* don't filter control chars	*/

/* SGM_EXITHELP is new for V37, and ignored by V36: */
#define SGM_EXITHELP	(1L << 7)	/* exit with code = 0x5F if HELP hit */


/* These Mode Flags are for internal use only				*/
#define SGM_NOCHANGE	(1L << 3)	/* no edit changes yet		*/
#define SGM_NOWORKB	(1L << 4)	/* Buffer == PrevBuffer		*/
#define SGM_CONTROL	(1L << 5)	/* control char escape mode	*/
#define SGM_LONGINT	(1L << 6)	/* an intuition longint gadget	*/

/* String Gadget Action Flags (put in SGWork.Actions by EditHook)	*/
#define SGA_USE		(0x1L)	/* use contents of SGWork		*/
#define SGA_END		(0x2L)	/* terminate gadget, code in Code field	*/
#define SGA_BEEP	(0x4L)	/* flash the screen for the user	*/
#define SGA_REUSE	(0x8L)	/* reuse input event			*/
#define SGA_REDISPLAY	(0x10L)	/* gadget visuals changed		*/

/* New for V37: */
#define SGA_NEXTACTIVE	(0x20L)	/* Make next possible gadget active.	*/
#define SGA_PREVACTIVE	(0x40L)	/* Make previous possible gadget active.*/

/* function id for only existing custom string gadget edit hook	*/

#define SGH_KEY		(1L)	/* process editing keystroke		*/
#define SGH_CLICK	(2L)	/* process mouse click cursor position	*/

/* Here's a brief summary of how the custom string gadget edit hook works:
 *	You provide a hook in StringInfo.Extension.EditHook.
 *	The hook is called in the standard way with the 'object'
 *	a pointer to SGWork, and the 'message' a pointer to a command
 *	block, starting either with (longword) SGH_KEY, SGH_CLICK,
 *	or something new.
 *
 *	You return 0 if you don't understand the command (SGH_KEY is
 *	required and assumed).	Return non-zero if you implement the
 *	command.
 *
 *   SGH_KEY:
 *	There are no parameters following the command longword.
 *
 *	Intuition will put its idea of proper values in the SGWork
 *	before calling you, and if you leave SGA_USE set in the
 *	SGWork.Actions field, Intuition will use the values
 *	found in SGWork fields WorkBuffer, NumChars, BufferPos,
 *	and LongInt, copying the WorkBuffer back to the StringInfo
 *	Buffer.
 *
 *	NOTE WELL: You may NOT change other SGWork fields.
 *
 *	If you clear SGA_USE, the string gadget will be unchanged.
 *
 *	If you set SGA_END, Intuition will terminate the activation
 *	of the string gadget.  If you also set SGA_REUSE, Intuition
 *	will reuse the input event after it deactivates your gadget.
 *
 *	In this case, Intuition will put the value found in SGWork.Code
 *	into the IntuiMessage.Code field of the IDCMP_GADGETUP message it
 *	sends to the application.
 *
 *	If you set SGA_BEEP, Intuition will call DisplayBeep(); use
 *	this if the user has typed in error, or buffer is full.
 *
 *	Set SGA_REDISPLAY if the changes to the gadget warrant a
 *	gadget redisplay.  Note: cursor movement requires a redisplay.
 *
 *	Starting in V37, you may set SGA_PREVACTIVE or SGA_NEXTACTIVE
 *	when you set SGA_END.  This tells Intuition that you want
 *	the next or previous gadget with GFLG_TABCYCLE to be activated.
 *
 *   SGH_CLICK:
 *	This hook command is called when Intuition wants to position
 *	the cursor in response to a mouse click in the string gadget.
 *
 *	Again, here are no parameters following the command longword.
 *
 *	This time, Intuition has already calculated the mouse position
 *	character cell and put it in SGWork.BufferPos.	The previous
 *	BufferPos value remains in the SGWork.StringInfo.BufferPos.
 *
 *	Intuition will again use the SGWork fields listed above for
 *	SGH_KEY.  One restriction is that you are NOT allowed to set
 *	SGA_END or SGA_REUSE for this command.	Intuition will not
 *	stand for a gadget which goes inactive when you click in it.
 *
 *	You should always leave the SGA_REDISPLAY flag set, since Intuition
 *	uses this processing when activating a string gadget.
 */

#endif
