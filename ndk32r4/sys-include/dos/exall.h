#ifndef DOS_EXALL_H
#define DOS_EXALL_H
/*
**	$VER: exall.h 47.2 (16.11.2019)
**
**	include file for ExAll() data structures
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif

/* NOTE: V37 dos.library, when doing ExAll() emulation, and V37 filesystems  */
/* will return an error if passed ED_OWNER.  If you get ERROR_BAD_NUMBER,    */
/* retry with ED_COMMENT to get everything but owner info.  All filesystems  */
/* supporting ExAll() must support through ED_COMMENT, and must check Type   */
/* and return ERROR_BAD_NUMBER if they don't support the type.		     */

/* values that can be passed for what data you want from ExAll() */
/* each higher value includes those below it (numerically)	 */
/* you MUST chose one of these values */
#define	ED_NAME		1
#define	ED_TYPE		2
#define ED_SIZE		3
#define ED_PROTECTION	4
#define ED_DATE		5
#define ED_COMMENT	6
#define ED_OWNER	7

/*
 *   Structure in which exall results are returned in.	Note that only the
 *   fields asked for will exist!
 */

struct ExAllData {
	struct ExAllData *ed_Next;
	STRPTR	ed_Name;
	LONG	ed_Type;
	ULONG	ed_Size;
	ULONG	ed_Prot;
	ULONG	ed_Days;
	ULONG	ed_Mins;
	ULONG	ed_Ticks;
	STRPTR	ed_Comment;	/* strings will be after last used field */
	UWORD	ed_OwnerUID;	/* new for V39 */
	UWORD	ed_OwnerGID;
};

/*
 *   Control structure passed to ExAll.  Unused fields MUST be initialized to
 *   0, expecially eac_LastKey.
 *
 *   eac_MatchFunc is a hook (see utility.library documentation for usage)
 *   It should return true if the entry is to returned, false if it is to be
 *   ignored.
 *
 *   This structure MUST be allocated by AllocDosObject()!
 */

struct ExAllControl {
	ULONG	eac_Entries;	 /* number of entries returned in buffer      */
	ULONG	eac_LastKey;	 /* Don't touch inbetween linked ExAll calls! */
	STRPTR	eac_MatchString; /* wildcard string for pattern match or NULL */
	struct Hook *eac_MatchFunc; /* optional private wildcard function     */
};

#endif /* DOS_EXALL_H */
