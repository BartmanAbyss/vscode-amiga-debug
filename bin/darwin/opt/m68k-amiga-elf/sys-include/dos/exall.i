	IFND DOS_EXALL_I
DOS_EXALL_I SET 1
**
**	$VER: exall.i 36.6 (5.4.1992)
**	Includes Release 45.1
**
**	include file for ExAll() data structures
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**

     IFND  EXEC_TYPES_I
     INCLUDE "exec/types.i"
     ENDC

     IFND UTILITY_HOOKS_I
     INCLUDE "utility/hooks.i"
     ENDC

* NOTE: V37 dos.library, when doing ExAll() emulation, and V37 filesystems
* will return an error if passed ED_OWNER.  If you get ERROR_BAD_NUMBER,
* retry with ED_COMMENT to get everything but owner info.  All filesystems
* supporting ExAll() must support through ED_COMMENT, and must check Type
* and return ERROR_BAD_NUMBER if they don't support the type.

* values that can be passed for what data you want from ExAll()
* each higher value includes those below it (numerically)
* you MUST chose one of these values

ED_NAME		EQU	1
ED_TYPE		EQU	2
ED_SIZE		EQU	3
ED_PROTECTION	EQU	4
ED_DATE		EQU	5
ED_COMMENT	EQU	6
ED_OWNER	EQU	7

*
*   Structure in which exall results are returned in.  Note that only the
*   fields asked for will exist!
*

 STRUCTURE ExAllData,0
	APTR	ed_Next		; next struct ExAllData
	APTR	ed_Name		; to CSTR
	LONG	ed_Type		; type of file/dir
	ULONG	ed_Size		; size of file (if file) in bytes
	ULONG	ed_Prot		; protection bits
	ULONG	ed_Days		; datestamp - last modification
	ULONG	ed_Mins
	ULONG	ed_Ticks
	APTR	ed_Comment	; strings will be after last used field
	UWORD	ed_OwnerUID	; new for V39
	UWORD	ed_OwnerGID
	LABEL	ed_Strings	; strings will start after the last USED field
 LABEL ExAllData_SIZEOF

*
*   Control structure passed to ExAll.  Unused fields MUST be initialized to
*   0, expecially eac_LastKey.
*
*   eac_MatchFunc is a hook (see utility.library documentation for usage)
*   It should return true if the entry is to returned, false if it is to be
*   ignored.
*
*   This structure MUST be allocated by AllocDosObject()!
*

 STRUCTURE ExAllControl,0
	ULONG	eac_Entries	 ; number of entries returned in buffer
	ULONG	eac_LastKey	 ; Don't touch inbetween linked ExAll calls!
	APTR	eac_MatchString  ; wildcard CSTR for pattern match or NULL
	APTR	eac_MatchFunc	 ; optional private wildcard function hook
 LABEL ExAllControl_SIZEOF

	ENDC	; DOS_EXALL_I
