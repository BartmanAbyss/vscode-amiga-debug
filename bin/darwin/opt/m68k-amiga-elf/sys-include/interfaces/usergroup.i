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

#include <exec/types.i>
#include <exec/exec.i>
#include <exec/interfaces.i>

STRUCTURE UserGroupIFace, InterfaceData_SIZE
	    FPTR IUserGroup_Obtain
	    FPTR IUserGroup_Release
	    FPTR IUserGroup_Expunge
	    FPTR IUserGroup_Clone
	    FPTR IUserGroup_ug_SetupContextTagList
	    FPTR IUserGroup_ug_SetupContextTags
	    FPTR IUserGroup_ug_GetErr
	    FPTR IUserGroup_ug_StrError
	    FPTR IUserGroup_getuid
	    FPTR IUserGroup_geteuid
	    FPTR IUserGroup_setreuid
	    FPTR IUserGroup_setuid
	    FPTR IUserGroup_getgid
	    FPTR IUserGroup_getegid
	    FPTR IUserGroup_setregid
	    FPTR IUserGroup_setgid
	    FPTR IUserGroup_getgroups
	    FPTR IUserGroup_setgroups
	    FPTR IUserGroup_initgroups
	    FPTR IUserGroup_getpwnam
	    FPTR IUserGroup_getpwuid
	    FPTR IUserGroup_setpwent
	    FPTR IUserGroup_getpwent
	    FPTR IUserGroup_endpwent
	    FPTR IUserGroup_getgrnam
	    FPTR IUserGroup_getgrgid
	    FPTR IUserGroup_setgrent
	    FPTR IUserGroup_getgrent
	    FPTR IUserGroup_endgrent
	    FPTR IUserGroup_crypt
	    FPTR IUserGroup_ug_GetSalt
	    FPTR IUserGroup_getpass
	    FPTR IUserGroup_umask
	    FPTR IUserGroup_getumask
	    FPTR IUserGroup_setsid
	    FPTR IUserGroup_getpgrp
	    FPTR IUserGroup_getlogin
	    FPTR IUserGroup_setlogin
	    FPTR IUserGroup_setutent
	    FPTR IUserGroup_getutent
	    FPTR IUserGroup_endutent
	    FPTR IUserGroup_getlastlog
	    FPTR IUserGroup_setlastlog
	    FPTR IUserGroup_getcredentials
	LABEL UserGroupIFace_SIZE

#endif
