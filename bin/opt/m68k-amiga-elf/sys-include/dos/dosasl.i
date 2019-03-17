	IFND DOS_DOSASL_I
DOS_DOSASL_I	SET	1
**
**	$VER: dosasl.i 36.19 (2.5.1991)
**	Includes Release 45.1
**
**	pattern-matching structure definitions
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND EXEC_LIBRARIES_I
	INCLUDE "exec/libraries.i"
	ENDC

	IFND EXEC_LISTS_I
	INCLUDE "exec/lists.i"
	ENDC

	IFND DOS_DOS_I
	INCLUDE "dos/dos.i"
	ENDC

************************************************************************
************************ PATTERN MATCHING ******************************
************************************************************************

* structure expected by MatchFirst, MatchNext.
* Allocate this structure and initialize it as follows:
*
* Set ap_BreakBits to the signal bits (CDEF) that you want to take a
* break on, or NULL, if you don't want to convenience the user.
*
* If you want to have the FULL PATH NAME of the files you found,
* allocate a buffer at the END of this structure, and put the size of
* it into ap_Strlen.  If you don't want the full path name, make sure
* you set ap_Strlen to zero.  In this case, the name of the file, and stats
* are available in the ap_Info, as per usual.
*
* Then call MatchFirst() and then afterwards, MatchNext() with this structure.
* You should check the return value each time (see below) and take the
* appropriate action, ultimately calling MatchEnd() when there are
* no more files and you are done.  You can tell when you are done by
* checking for the normal AmigaDOS return code ERROR_NO_MORE_ENTRIES.
*

	STRUCTURE AnchorPath,0
		LABEL	ap_First
		CPTR	ap_Base	; pointer to first anchor
		LABEL	ap_Current
		CPTR	ap_Last	; pointer to last anchor
		LONG	ap_BreakBits	; Bits we want to break on
		LONG	ap_FoundBreak	; Bits we broke on. Also returns ERROR_BREAK
		LABEL	ap_Length	; Old compatability for LONGWORD ap_Length
		BYTE	ap_Flags	; New use for extra word.
		BYTE	ap_Reserved
		WORD	ap_Strlen	; This is what ap_Length used to be
		STRUCT	ap_Info,fib_SIZEOF	; FileInfoBlock
		LABEL	ap_Buf		; Buffer for path name, allocated by user
		LABEL	ap_SIZEOF


	BITDEF	AP,DOWILD,0		; User option ALL
	BITDEF	AP,ITSWILD,1		; Set by MatchFirst, used by MatchNext
					; Application can test APB_ITSWILD,
					; too (means that there's a wildcard
					; in the pattern after calling
					; MatchFirst).
	BITDEF	AP,DODIR,2		; Bit is SET if a DIR node should be
					; entered. Application can RESET this
					; bit after MatchFirst/MatchNext to
					; AVOID entering a dir.
	BITDEF	AP,DIDDIR,3		; Bit is SET for an "expired" dir node.
	BITDEF	AP,NOMEMERR,4		; Set on memory error
	BITDEF	AP,DODOT,5		; If set, allow conversion of '.' to
					; CurrentDir
	BITDEF	AP,DirChanged,6		; ap_Current->an_Lock changed
					; since last MatchNext call

	BITDEF	AP,FollowHLinks,7      ; follow hardlinks on DODIR - defaults
				       ; to not following hardlinks on a DODIR.

	STRUCTURE	AChain,0
		CPTR	an_Child
		CPTR	an_Parent
		LONG	an_Lock
		STRUCT	an_Info,fib_SIZEOF	; FileInfoBlock
		BYTE	an_Flags
		LABEL	an_String
		LABEL	an_SIZEOF

	BITDEF	DD,PatternBit,0
	BITDEF	DD,ExaminedBit,1
	BITDEF	DD,Completed,2
	BITDEF	DD,AllBit,3
	BITDEF	DD,SINGLE,4

* Constants used by wildcard routines, these are the pre-parsed tokens
* referred to by pattern match.  It is not necessary for you to do
* anything about these, MatchFirst() MatchNext() handle all these for you.

P_ANY		EQU	$80	; Token for '*' or '#?
P_SINGLE	EQU	$81	; Token for '?'
P_ORSTART	EQU	$82	; Token for '('
P_ORNEXT	EQU	$83	; Token for '|'
P_OREND	EQU	$84	; Token for ')'
P_NOT		EQU	$85	; Token for '~'
P_NOTEND	EQU	$86	; Token for
P_NOTCLASS	EQU	$87	; Token for '^'
P_CLASS	EQU	$88	; Token for '[]'
P_REPBEG	EQU	$89	; Token for '['
P_REPEND	EQU	$8A	; Token for ']'
P_STOP		EQU	$8B	; token to force end of evaluation

* Values for an_Status, NOTE: These are the actual bit numbers

COMPLEX_BIT	EQU	1	; Parsing complex pattern
EXAMINE_BIT	EQU	2	; Searching directory

* Returns from MatchFirst(), MatchNext()
* You can also get dos error returns, such as ERROR_NO_MORE_ENTRIES,
* these are in the dos.h file.
*
ERROR_BUFFER_OVERFLOW	EQU	303	; User or internal buffer overflow
ERROR_BREAK		EQU	304	; A break character was received
ERROR_NOT_EXECUTABLE	EQU	305	; A file has E bit cleared

	ENDC	; DOS_DOSASL_I
