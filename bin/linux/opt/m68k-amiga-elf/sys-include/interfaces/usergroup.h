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

#ifndef USERGROUP_INTERFACE_DEF_H
#define USERGROUP_INTERFACE_DEF_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef EXEC_EXEC_H
#include <exec/exec.h>
#endif
#ifndef EXEC_INTERFACES_H
#include <exec/interfaces.h>
#endif

#ifndef LIBRARIES_USERGROUP_H
#include <libraries/usergroup.h>
#endif
#ifndef _PWD_H
#include <pwd.h>
#endif
#ifndef _GRP_H
#include <grp.h>
#endif

struct UserGroupIFace
{
	struct InterfaceData Data;

	ULONG APICALL (*Obtain)(struct UserGroupIFace *Self);
	ULONG APICALL (*Release)(struct UserGroupIFace *Self);
	void APICALL (*Expunge)(struct UserGroupIFace *Self);
	struct Interface * APICALL (*Clone)(struct UserGroupIFace *Self);
	LONG APICALL (*ug_SetupContextTagList)(struct UserGroupIFace *Self, STRPTR name, struct TagItem * tags);
	LONG APICALL (*ug_SetupContextTags)(struct UserGroupIFace *Self, STRPTR name, ...);
	LONG APICALL (*ug_GetErr)(struct UserGroupIFace *Self);
	STRPTR APICALL (*ug_StrError)(struct UserGroupIFace *Self, LONG err);
	LONG APICALL (*getuid)(struct UserGroupIFace *Self);
	LONG APICALL (*geteuid)(struct UserGroupIFace *Self);
	LONG APICALL (*setreuid)(struct UserGroupIFace *Self, LONG real, LONG effective);
	LONG APICALL (*setuid)(struct UserGroupIFace *Self, LONG uid);
	LONG APICALL (*getgid)(struct UserGroupIFace *Self);
	LONG APICALL (*getegid)(struct UserGroupIFace *Self);
	LONG APICALL (*setregid)(struct UserGroupIFace *Self, LONG real, LONG effective);
	LONG APICALL (*setgid)(struct UserGroupIFace *Self, LONG gid);
	LONG APICALL (*getgroups)(struct UserGroupIFace *Self, LONG gidsetlen, LONG * gidset);
	LONG APICALL (*setgroups)(struct UserGroupIFace *Self, LONG gidsetlen, LONG * gidset);
	LONG APICALL (*initgroups)(struct UserGroupIFace *Self, STRPTR name, LONG basegid);
	struct passwd * APICALL (*getpwnam)(struct UserGroupIFace *Self, STRPTR login);
	struct passwd * APICALL (*getpwuid)(struct UserGroupIFace *Self, LONG uid);
	VOID APICALL (*setpwent)(struct UserGroupIFace *Self);
	struct passwd * APICALL (*getpwent)(struct UserGroupIFace *Self);
	VOID APICALL (*endpwent)(struct UserGroupIFace *Self);
	struct group * APICALL (*getgrnam)(struct UserGroupIFace *Self, STRPTR name);
	struct group * APICALL (*getgrgid)(struct UserGroupIFace *Self, LONG gid);
	VOID APICALL (*setgrent)(struct UserGroupIFace *Self);
	struct group * APICALL (*getgrent)(struct UserGroupIFace *Self);
	VOID APICALL (*endgrent)(struct UserGroupIFace *Self);
	UBYTE * APICALL (*crypt)(struct UserGroupIFace *Self, UBYTE * key, UBYTE * set);
	UBYTE * APICALL (*ug_GetSalt)(struct UserGroupIFace *Self, struct passwd * user, UBYTE * buf, ULONG size);
	STRPTR APICALL (*getpass)(struct UserGroupIFace *Self, STRPTR prompt);
	ULONG APICALL (*umask)(struct UserGroupIFace *Self, UWORD mask);
	ULONG APICALL (*getumask)(struct UserGroupIFace *Self);
	LONG APICALL (*setsid)(struct UserGroupIFace *Self);
	LONG APICALL (*getpgrp)(struct UserGroupIFace *Self);
	STRPTR APICALL (*getlogin)(struct UserGroupIFace *Self);
	LONG APICALL (*setlogin)(struct UserGroupIFace *Self, STRPTR name);
	VOID APICALL (*setutent)(struct UserGroupIFace *Self);
	struct utmp * APICALL (*getutent)(struct UserGroupIFace *Self);
	VOID APICALL (*endutent)(struct UserGroupIFace *Self);
	struct lastlog * APICALL (*getlastlog)(struct UserGroupIFace *Self, LONG uid);
	LONG APICALL (*setlastlog)(struct UserGroupIFace *Self, LONG uid, STRPTR name, STRPTR host);
	struct UserGroupCredentials * APICALL (*getcredentials)(struct UserGroupIFace *Self, struct Task * task);
};

#endif /* USERGROUP_INTERFACE_DEF_H */
