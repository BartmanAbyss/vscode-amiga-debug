    IFND INTUITION_SGHOOKS_I
INTUITION_SGHOOKS_I SET 1
**
** $VER: sghooks.i 38.1 (11.11.1991)
** Includes Release 45.1
**
**  String gadget extensions and hooks
**
**  (C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

 STRUCTURE StringExtend,0
    ; display specifications
    APTR	sex_Font	; must be an open Font (not TextAttr)
    STRUCT	sex_Pens,2	; color of text/background
    STRUCT	sex_ActivePens,2 ; colors when gadget is active

    ; edit specifications
    ULONG	sex_InitialModes ; initial mode flags, below
    APTR	sex_EditHook	; if non-NULL, must supply WorkBuffer
    APTR	sex_WorkBuffer	; must be as large as StringInfo.Buffer

    STRUCT	sex_Reserved,16	; set to 0
 LABEL	sex_SIZEOF


 STRUCTURE SGWork,0
    ; set up when gadget is first activated
    APTR		sgw_Gadget	; the contestant itself
    APTR		sgw_StringInfo	; easy access to sinfo
    APTR		sgw_WorkBuffer	; intuition's planned result
    APTR		sgw_PrevBuffer	; what was there before
    ULONG		sgw_Modes	; current mode

    ; modified for each input event
    APTR		sgw_IEvent	; actual event: do not change
    UWORD		sgw_Code	; character code, if one byte
    WORD		sgw_BufferPos	; cursor position
    WORD		sgw_NumChars
    ULONG		sgw_Actions	; what Intuition will do
    LONG		sgw_LongInt	; temp storage for longint

    APTR		sgw_GadgetInfo	; see cghooks.h
    UWORD		sgw_EditOp	; from constants below
 LABEL	sgw_SIZEOF	; this may change as the structure is extended


* SGWork.EditOp -
* These values indicate what basic type of operation the global
* editing hook has performed on the string before your gadget's custom
* editing hook gets called.  You do not have to be concerned with the
* value your custom hook leaves in the sgw_EditOp field, only if you
* write a global editing hook.
*
* For most of these general edit operations, you'll want to compare
* the BufferPos and NumChars of the StringInfo (before global editing)
* and SGWork (after global editing).

EO_NOOP		EQU ($0001)
	; did nothing
EO_DELBACKWARD	EQU ($0002)
	; deleted some chars (maybe 0).
EO_DELFORWARD	EQU ($0003)
	; deleted some characters under and in front of the cursor
EO_MOVECURSOR	EQU ($0004)
	; moved the cursor
EO_ENTER	EQU ($0005)
    	; "enter" or "return" key, terminate
EO_RESET	EQU ($0006)
	; current Intuition-style undo	
EO_REPLACECHAR	EQU ($0007)
	; replaced one character and (maybe) advanced cursor
EO_INSERTCHAR	EQU ($0008)
	; inserted one char into string or added one at end
EO_BADFORMAT	EQU ($0009)
	; didn't like the text data, e.g., Bad LONGINT
EO_BIGCHANGE	EQU ($000A)	; unused by Intuition
	; complete or major change to the text, e.g. new string
EO_UNDO		EQU ($000B)	; unused by Intuition
	; some other style of undo
EO_CLEAR	EQU ($000C)
	; clear the string
EO_SPECIAL	EQU ($000D)	; unused by Intuition
	; some operation that doesn't fit into the categories here


; Mode Flags definitions (ONLY first group allowed as InitialModes)

SGM_REPLACE	EQU	1
SGMB_REPLACE	EQU	0
SGMF_REPLACE	EQU	1
; please initialize StringInfo with in-range value of BufferPos 
; if you are using SGM_REPLACE mode.

; fixed length buffer, always set SGM_REPLACE, too.
SGM_FIXEDFIELD	EQU $00000002
SGMB_FIXEDFIELD	EQU 1
SGMF_FIXEDFIELD	EQU 2

; don't filter control chars
SGM_NOFILTER	EQU $00000004
SGMB_NOFILTER	EQU 2
SGMF_NOFILTER	EQU 4

; SGM_EXITHELP is new for V37, and ignored by V36:
; exit with code = 0x5F if HELP hit
SGM_EXITHELP	EQU $00000080
SGMB_EXITHELP	EQU 7
SGMF_EXITHELP	EQU $80


; String Gadget Action Flags (put in SGWork.Actions by EditHook)
SGA_USE		EQU $1		; use contents of SGWork
SGAB_USE	EQU 0
SGAF_USE	EQU $1

SGA_END		EQU $2		; terminate gadget, code in Code field
SGAB_END	EQU 1
SGAF_END	EQU $2

SGA_BEEP	EQU $4		; flash the screen for the user
SGAB_BEEP	EQU 2
SGAF_BEEP	EQU $4

SGA_REUSE	EQU $8		; reuse input event
SGAB_REUSE	EQU 3
SGAF_REUSE	EQU $8

SGA_REDISPLAY	EQU $10		; gadget visuals changed
SGAB_REDISPLAY		EQU 4
SGAF_REDISPLAY		EQU $10

; New for V37:
SGA_NEXTACTIVE	EQU $20		; Make next possible gadget active.
SGAB_NEXTACTIVE	EQU 5
SGAF_NEXTACTIVE	EQU $20

; New for V37:
SGA_PREVACTIVE	EQU $40		; Make previous possible gadget active.
SGAB_PREVACTIVE	EQU 6
SGAF_PREVACTIVE	EQU $40


; function id for only existing custom string gadget edit hook
SGH_KEY		EQU	1	; process editing keystroke
SGH_CLICK	EQU	2	; process mouse click cursor position

* Here's a brief summary of how the custom string gadget edit hook works:
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

    ENDC
