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

#ifndef CLIB_USERGROUP_PROTOS_H
#define CLIB_USERGROUP_PROTOS_H

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  LIBRARIES_USERGROUP_H
#include <libraries/usergroup.h>
#endif
#ifndef  PWD_H
#include <pwd.h>
#endif
#ifndef  GRP_H
#include <grp.h>
#endif

LONG ug_SetupContextTagList( STRPTR name, struct TagItem *tags );
LONG ug_GetErr( VOID );
STRPTR ug_StrError( LONG err );
LONG getuid( VOID );
LONG geteuid( VOID );
LONG setreuid( LONG real, LONG effective );
LONG setuid( LONG uid );
LONG getgid( VOID );
LONG getegid( VOID );
LONG setregid( LONG real, LONG effective );
LONG setgid( LONG gid );
LONG getgroups( LONG gidsetlen, LONG *gidset );
LONG setgroups( LONG gidsetlen, LONG *gidset );
LONG initgroups( STRPTR name, LONG basegid );
struct passwd *getpwnam( const char * login );
struct passwd *getpwuid( uid_t uid );
VOID setpwent( VOID );
struct passwd *getpwent( VOID );
VOID endpwent( VOID );
struct group *getgrnam( STRPTR name );
struct group *getgrgid( LONG gid );
VOID setgrent( VOID );
struct group *getgrent( VOID );
VOID endgrent( VOID );
UBYTE *crypt( UBYTE *key, UBYTE *set );
UBYTE *ug_GetSalt( struct passwd *user, UBYTE *buf, ULONG size );
STRPTR getpass( STRPTR prompt );
ULONG umask( ULONG mask );
ULONG getumask( VOID );
LONG setsid( VOID );
LONG getpgrp( VOID );
STRPTR getlogin( VOID );
LONG setlogin( STRPTR name );
VOID setutent( VOID );
struct utmp *getutent( VOID );
VOID endutent( VOID );
struct lastlog *getlastlog( LONG uid );
LONG setlastlog( LONG uid, STRPTR name, STRPTR host );
struct UserGroupCredentials *getcredentials( struct Task *task );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_USERGROUP_PROTOS_H */
