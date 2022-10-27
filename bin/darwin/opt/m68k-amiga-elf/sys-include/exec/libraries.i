	IFND	EXEC_LIBRARIES_I
EXEC_LIBRARIES_I	SET	1
**
**	$VER: libraries.i 39.2 (10.4.1992)
**	Includes Release 45.1
**
**	Definitions for use when creating or using Exec libraries
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC	; EXEC_NODES_I


*------ Special Constants ---------------------------------------
LIB_VECTSIZE	EQU	6		;Each library entry takes 6 bytes
LIB_RESERVED	EQU	4		;Exec reserves the first 4 vectors
LIB_BASE	EQU	-LIB_VECTSIZE
LIB_USERDEF	EQU	LIB_BASE-(LIB_RESERVED*LIB_VECTSIZE) ;First user func
LIB_NONSTD	EQU	LIB_USERDEF


*----------------------------------------------------------------
*
*   Library Definition Macros (for creating libraries)
*
*----------------------------------------------------------------

*------ LIBINIT initializes the base offset for using the "LIBDEF" macro:
LIBINIT     MACRO   ; [baseOffset]
	    IFC     '\1',''
COUNT_LIB   SET     LIB_USERDEF
	    ENDC
	    IFNC    '\1',''
COUNT_LIB   SET     \1
	    ENDC
	    ENDM

*------ LIBDEF is used to define each library function entry:
LIBDEF	    MACRO   ;libraryFunctionSymbol
\1	    EQU     COUNT_LIB
COUNT_LIB   SET     COUNT_LIB-LIB_VECTSIZE
	    ENDM

*------ FUNCDEF is used to parse library offset tables.  Many applications
*------ need a special version of FUNCDEF - you provide your own macro
*------ to match your needs.  Here is an example:
*
*	FUNCDEF		 MACRO
*	_LVO\1		 EQU	FUNC_CNT
*	FUNC_CNT	 SET	FUNC_CNT-6	* Standard offset-6 bytes each
*	FUNC_CNT	 EQU	LIB_USERDEF	* Skip 4 standard vectors
*			 ENDM

*----------------------------------------------------------------
*
*   Standard Library Functions
*
*----------------------------------------------------------------

    LIBINIT LIB_BASE

    LIBDEF  LIB_OPEN
    LIBDEF  LIB_CLOSE
    LIBDEF  LIB_EXPUNGE ; must exist in all libraries
    LIBDEF  LIB_EXTFUNC	; for future expansion - must return zero.


*----------------------------------------------------------------
*
*   Library Base Structure Definition
*   Also used for Devices and some Resources
*
*----------------------------------------------------------------

 STRUCTURE LIB,LN_SIZE
    UBYTE   LIB_FLAGS			; see below
    UBYTE   LIB_pad			; must be zero
    UWORD   LIB_NEGSIZE		; number of bytes before LIB
    UWORD   LIB_POSSIZE		; number of bytes after LIB
    UWORD   LIB_VERSION		; major
    UWORD   LIB_REVISION		; minor
    APTR    LIB_IDSTRING		; ASCII identification
    ULONG   LIB_SUM			; the system-calculated checksum
    UWORD   LIB_OPENCNT		; number of current opens
    LABEL   LIB_SIZE	;Warning: Size is not a longword multiple!

*------ LIB_FLAGS bit definitions (all others are system reserved)
    BITDEF  LIB,SUMMING,0  ; system is currently checksumming
    BITDEF  LIB,CHANGED,1  ; something has changed the library since last sum
    BITDEF  LIB,SUMUSED,2  ; indicates if the library allows checksumming
    BITDEF  LIB,DELEXP,3   ; delayed expunge flag (for use by library)
    BITDEF  LIB,EXP0CNT,4  ; special system expunge flag.


*---------------------------------------------------------------------------
*
*	Function Invocation Macros (for calling existing, opened, libraries)
*	Also see exec/macros.i
*
*---------------------------------------------------------------------------

*------ CALLLIB for calling functions where A6 is already correct:

CALLLIB     MACRO   ; functionOffset
	IFGT NARG-1
	    FAIL    !!! CALLLIB MACRO - too many arguments !!!
	ENDC
	    JSR     \1(A6)
	    ENDM


*------ LINKLIB for calling functions where A6 is incorrect:

LINKLIB     MACRO   ; functionOffset,libraryBase
	IFGT NARG-2
	    FAIL    !!! LINKLIB MACRO - too many arguments !!!
	ENDC
	    MOVE.L  A6,-(SP)
	    MOVE.L  \2,A6
	    JSR     \1(A6)
	    MOVE.L  (SP)+,A6
	    ENDM

	ENDC	; EXEC_LIBRARIES_I
