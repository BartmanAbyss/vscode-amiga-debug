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

#ifndef INLINE4_USERGROUP_H
#define INLINE4_USERGROUP_H

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

/* Inline macros for Interface "main" */
#define ug_SetupContextTagList(name, tags) IUserGroup->ug_SetupContextTagList(name, tags) 
#if (defined(__STDC_VERSION__) && __STDC_VERSION__ >= 199901L) || (__GNUC__ >= 3)
#define ug_SetupContextTags(...) IUserGroup->ug_SetupContextTags(__VA_ARGS__) 
#elif (__GNUC__ == 2 && __GNUC_MINOR__ >= 95)
#define ug_SetupContextTags(vargs...) IUserGroup->ug_SetupContextTags(## vargs) 
#endif
#define ug_GetErr() IUserGroup->ug_GetErr() 
#define ug_StrError(err) IUserGroup->ug_StrError(err) 
#define getuid() IUserGroup->getuid() 
#define geteuid() IUserGroup->geteuid() 
#define setreuid(real, effective) IUserGroup->setreuid(real, effective) 
#define setuid(uid) IUserGroup->setuid(uid) 
#define getgid() IUserGroup->getgid() 
#define getegid() IUserGroup->getegid() 
#define setregid(real, effective) IUserGroup->setregid(real, effective) 
#define setgid(gid) IUserGroup->setgid(gid) 
#define getgroups(gidsetlen, gidset) IUserGroup->getgroups(gidsetlen, gidset) 
#define setgroups(gidsetlen, gidset) IUserGroup->setgroups(gidsetlen, gidset) 
#define initgroups(name, basegid) IUserGroup->initgroups(name, basegid) 
#define getpwnam(login) IUserGroup->getpwnam(login) 
#define getpwuid(uid) IUserGroup->getpwuid(uid) 
#define setpwent() IUserGroup->setpwent() 
#define getpwent() IUserGroup->getpwent() 
#define endpwent() IUserGroup->endpwent() 
#define getgrnam(name) IUserGroup->getgrnam(name) 
#define getgrgid(gid) IUserGroup->getgrgid(gid) 
#define setgrent() IUserGroup->setgrent() 
#define getgrent() IUserGroup->getgrent() 
#define endgrent() IUserGroup->endgrent() 
#define crypt(key, set) IUserGroup->crypt(key, set) 
#define ug_GetSalt(user, buf, size) IUserGroup->ug_GetSalt(user, buf, size) 
#define getpass(prompt) IUserGroup->getpass(prompt) 
#define umask(mask) IUserGroup->umask(mask) 
#define getumask() IUserGroup->getumask() 
#define setsid() IUserGroup->setsid() 
#define getpgrp() IUserGroup->getpgrp() 
#define getlogin() IUserGroup->getlogin() 
#define setlogin(name) IUserGroup->setlogin(name) 
#define setutent() IUserGroup->setutent() 
#define getutent() IUserGroup->getutent() 
#define endutent() IUserGroup->endutent() 
#define getlastlog(uid) IUserGroup->getlastlog(uid) 
#define setlastlog(uid, name, host) IUserGroup->setlastlog(uid, name, host) 
#define getcredentials(task) IUserGroup->getcredentials(task) 

#endif /* INLINE4_USERGROUP_H */
