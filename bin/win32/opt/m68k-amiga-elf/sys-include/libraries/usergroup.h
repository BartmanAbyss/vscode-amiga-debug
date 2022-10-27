/*
 * :ts=8
 *
 * 'Roadshow' -- Amiga TCP/IP stack; "usergroup.library" API
 * Copyright © 2001-2016 by Olaf Barthel.
 * All Rights Reserved.
 *
 * Amiga specific TCP/IP 'C' header files;
 * Freely Distributable
 *
 * WARNING: The "usergroup.library" API must be considered obsolete and
 *          should not be used in new software. It is provided solely
 *          for backwards compatibility and legacy application software.
 */

/*
 * Copyright (c) 1989, 1993
 *	The Regents of the University of California.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *	This product includes software developed by the University of
 *	California, Berkeley and its contributors.
 * 4. Neither the name of the University nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 *	@(#)ucred.h	8.4 (Berkeley) 1/9/95
 */

#ifndef LIBRARIES_USERGROUP_H
#define LIBRARIES_USERGROUP_H

/****************************************************************************/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif /* EXEC_TYPES_H */

#ifndef _PWD_H
#include <pwd.h>
#endif /* _PWD_H */

#ifndef _GRP_H
#include <grp.h>
#endif /* _GRP_H */

#ifndef _UTMP_H
#include <utmp.h>
#endif /* _UTMP_H */

/****************************************************************************/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/****************************************************************************/

#ifdef __GNUC__
 #ifdef __PPC__
  #pragma pack(2)
 #endif
#elif defined(__VBCC__)
 #pragma amiga-align
#endif

/****************************************************************************/

#define USERGROUPNAME "usergroup.library"

/****************************************************************************/

#define	_PASSWORD_EFMT1	'_'	/* extended encryption format */
#define	_PASSWORD_LEN	128	/* max length, not counting NULL */

/****************************************************************************/

#define	NGROUPS		32	/* max number groups */

/****************************************************************************/

#define MAXLOGNAME      32	/* max length of login name */

/****************************************************************************/

/*
 * Credentials.
 */
struct UserGroupCredentials
{
	LONG	cr_ruid;
	LONG	cr_rgid;
	UWORD	cr_umask;
	LONG	cr_euid;
	WORD	cr_ngroups;
	LONG	cr_groups[NGROUPS];
	LONG	cr_session;
	TEXT	cr_login[MAXLOGNAME];
};

/****************************************************************************/

/*
 * ID conversion
 */
#define UG2MU(id) ((id) == 0 ? 65535 : (id) == -2 ? 0 : (id))
#define MU2UG(id) ((id) == 65535 ? 0L : (id) == 0 ? -2 : (id))

/****************************************************************************/

/*
 * Context tags
 */
#define UGT_ERRNOBPTR 0x80000001
#define UGT_ERRNOWPTR 0x80000002
#define UGT_ERRNOLPTR 0x80000004
#define UGT_ERRNOPTR(size) \
	((size == sizeof(long))		? UGT_ERRNOLPTR : \
	 (size == sizeof(short))	? UGT_ERRNOWPTR : \
	 (size == sizeof(char))		? UGT_ERRNOBPTR : 1)
#define UGT_OWNER     0x80000011
#define UGT_INTRMASK  0x80000010

/****************************************************************************/

#ifdef __GNUC__
 #ifdef __PPC__
  #pragma pack()
 #endif
#elif defined(__VBCC__)
 #pragma default-align
#endif

/****************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus */

/****************************************************************************/

#endif /* LIBRARIES_USERGROUP_H */
