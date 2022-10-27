	IFND EXEC_NODES_I
EXEC_NODES_I	SET 1
**
**	$VER: nodes.i 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Nodes & Node type identifiers.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC ; EXEC_TYPES_I


*
*   List Node Structure.  Each member in a list starts with a Node
*
   STRUCTURE	LN,0	; List Node
	APTR	LN_SUCC	; Pointer to next (successor)
	APTR	LN_PRED	; Pointer to previous (predecessor)
	UBYTE	LN_TYPE
	BYTE	LN_PRI	; Priority, for sorting
	APTR	LN_NAME	; ID string, null terminated
	LABEL	LN_SIZE	; Note: word aligned

; minimal node -- no type checking possible
   STRUCTURE	MLN,0	; Minimal List Node
	APTR	MLN_SUCC
	APTR	MLN_PRED
	LABEL	MLN_SIZE


**
** Note: Newly initialized IORequests, and software interrupt structures
** used with Cause(), should have type NT_UNKNOWN.  The OS will assign a type
** when they are first used.
**
;------ Node Types for LN_TYPE

NT_UNKNOWN	EQU 0
NT_TASK	EQU 1	; Exec task
NT_INTERRUPT	EQU 2
NT_DEVICE	EQU 3
NT_MSGPORT	EQU 4
NT_MESSAGE	EQU 5	; Indicates message currently pending
NT_FREEMSG	EQU 6
NT_REPLYMSG	EQU 7	; Message has been replied
NT_RESOURCE	EQU 8
NT_LIBRARY	EQU 9
NT_MEMORY	EQU 10
NT_SOFTINT	EQU 11	; Internal flag used by SoftInts
NT_FONT	EQU 12
NT_PROCESS	EQU 13	; AmigaDOS Process
NT_SEMAPHORE	EQU 14
NT_SIGNALSEM	EQU 15	; signal semaphores
NT_BOOTNODE	EQU 16
NT_KICKMEM	EQU 17
NT_GRAPHICS	EQU 18
NT_DEATHMESSAGE	EQU 19

NT_USER		EQU 254	; User node types work down from here
NT_EXTENDED	EQU 255

	ENDC	;EXEC_NODES_I
