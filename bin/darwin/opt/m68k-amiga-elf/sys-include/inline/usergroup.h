/*
 * :ts=8
 *
 * 'Roadshow' -- Amiga TCP/IP stack; "usergroup.library" API
 * Copyright © 2001-2017 by Olaf Barthel.
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
 * This file was created with fd2pragma V2.164 using the following options:
 *
 * fd2pragma usergroup_lib.sfd to RAM:inline-46 special 46
 */

#ifndef _INLINE_USERGROUP_H
#define _INLINE_USERGROUP_H

#ifndef CLIB_USERGROUP_PROTOS_H
#define CLIB_USERGROUP_PROTOS_H
#endif

#ifndef  LIBRARIES_USERGROUP_H
#include <libraries/usergroup.h>
#endif
#ifndef  PWD_H
#include <pwd.h>
#endif
#ifndef  GRP_H
#include <grp.h>
#endif

#ifndef USERGROUP_BASE_NAME
#define USERGROUP_BASE_NAME UserGroupBase
#endif

#define ug_SetupContextTagList(name, tags) ({ \
  STRPTR _ug_SetupContextTagList_name = (name); \
  struct TagItem * _ug_SetupContextTagList_tags = (tags); \
  LONG _ug_SetupContextTagList__re = \
  ({ \
  register struct Library * const __ug_SetupContextTagList__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __ug_SetupContextTagList__re __asm("d0"); \
  register STRPTR __ug_SetupContextTagList_name __asm("a0") = (_ug_SetupContextTagList_name); \
  register struct TagItem * __ug_SetupContextTagList_tags __asm("a1") = (_ug_SetupContextTagList_tags); \
  __asm volatile ("jsr a6@(-30:W)" \
  : "=r"(__ug_SetupContextTagList__re) \
  : "r"(__ug_SetupContextTagList__bn), "r"(__ug_SetupContextTagList_name), "r"(__ug_SetupContextTagList_tags) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __ug_SetupContextTagList__re; \
  }); \
  _ug_SetupContextTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define ug_SetupContextTags(name, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; ug_SetupContextTagList(name, (struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define ug_GetErr() ({ \
  LONG _ug_GetErr__re = \
  ({ \
  register struct Library * const __ug_GetErr__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __ug_GetErr__re __asm("d0"); \
  __asm volatile ("jsr a6@(-36:W)" \
  : "=r"(__ug_GetErr__re) \
  : "r"(__ug_GetErr__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __ug_GetErr__re; \
  }); \
  _ug_GetErr__re; \
})

#define ug_StrError(err) ({ \
  LONG _ug_StrError_err = (err); \
  STRPTR _ug_StrError__re = \
  ({ \
  register struct Library * const __ug_StrError__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register STRPTR __ug_StrError__re __asm("d0"); \
  register LONG __ug_StrError_err __asm("d1") = (_ug_StrError_err); \
  __asm volatile ("jsr a6@(-42:W)" \
  : "=r"(__ug_StrError__re) \
  : "r"(__ug_StrError__bn), "r"(__ug_StrError_err) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __ug_StrError__re; \
  }); \
  _ug_StrError__re; \
})

#define getuid() ({ \
  LONG _getuid__re = \
  ({ \
  register struct Library * const __getuid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __getuid__re __asm("d0"); \
  __asm volatile ("jsr a6@(-48:W)" \
  : "=r"(__getuid__re) \
  : "r"(__getuid__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getuid__re; \
  }); \
  _getuid__re; \
})

#define geteuid() ({ \
  LONG _geteuid__re = \
  ({ \
  register struct Library * const __geteuid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __geteuid__re __asm("d0"); \
  __asm volatile ("jsr a6@(-54:W)" \
  : "=r"(__geteuid__re) \
  : "r"(__geteuid__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __geteuid__re; \
  }); \
  _geteuid__re; \
})

#define setreuid(real, effective) ({ \
  LONG _setreuid_real = (real); \
  LONG _setreuid_effective = (effective); \
  LONG _setreuid__re = \
  ({ \
  register struct Library * const __setreuid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setreuid__re __asm("d0"); \
  register LONG __setreuid_real __asm("d0") = (_setreuid_real); \
  register LONG __setreuid_effective __asm("d1") = (_setreuid_effective); \
  __asm volatile ("jsr a6@(-60:W)" \
  : "=r"(__setreuid__re) \
  : "r"(__setreuid__bn), "r"(__setreuid_real), "r"(__setreuid_effective) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setreuid__re; \
  }); \
  _setreuid__re; \
})

#define setuid(uid) ({ \
  LONG _setuid_uid = (uid); \
  LONG _setuid__re = \
  ({ \
  register struct Library * const __setuid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setuid__re __asm("d0"); \
  register LONG __setuid_uid __asm("d0") = (_setuid_uid); \
  __asm volatile ("jsr a6@(-66:W)" \
  : "=r"(__setuid__re) \
  : "r"(__setuid__bn), "r"(__setuid_uid) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setuid__re; \
  }); \
  _setuid__re; \
})

#define getgid() ({ \
  LONG _getgid__re = \
  ({ \
  register struct Library * const __getgid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __getgid__re __asm("d0"); \
  __asm volatile ("jsr a6@(-72:W)" \
  : "=r"(__getgid__re) \
  : "r"(__getgid__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getgid__re; \
  }); \
  _getgid__re; \
})

#define getegid() ({ \
  LONG _getegid__re = \
  ({ \
  register struct Library * const __getegid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __getegid__re __asm("d0"); \
  __asm volatile ("jsr a6@(-78:W)" \
  : "=r"(__getegid__re) \
  : "r"(__getegid__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getegid__re; \
  }); \
  _getegid__re; \
})

#define setregid(real, effective) ({ \
  LONG _setregid_real = (real); \
  LONG _setregid_effective = (effective); \
  LONG _setregid__re = \
  ({ \
  register struct Library * const __setregid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setregid__re __asm("d0"); \
  register LONG __setregid_real __asm("d0") = (_setregid_real); \
  register LONG __setregid_effective __asm("d1") = (_setregid_effective); \
  __asm volatile ("jsr a6@(-84:W)" \
  : "=r"(__setregid__re) \
  : "r"(__setregid__bn), "r"(__setregid_real), "r"(__setregid_effective) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setregid__re; \
  }); \
  _setregid__re; \
})

#define setgid(gid) ({ \
  LONG _setgid_gid = (gid); \
  LONG _setgid__re = \
  ({ \
  register struct Library * const __setgid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setgid__re __asm("d0"); \
  register LONG __setgid_gid __asm("d0") = (_setgid_gid); \
  __asm volatile ("jsr a6@(-90:W)" \
  : "=r"(__setgid__re) \
  : "r"(__setgid__bn), "r"(__setgid_gid) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setgid__re; \
  }); \
  _setgid__re; \
})

#define getgroups(gidsetlen, gidset) ({ \
  LONG _getgroups_gidsetlen = (gidsetlen); \
  LONG * _getgroups_gidset = (gidset); \
  LONG _getgroups__re = \
  ({ \
  register struct Library * const __getgroups__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __getgroups__re __asm("d0"); \
  register LONG __getgroups_gidsetlen __asm("d0") = (_getgroups_gidsetlen); \
  register LONG * __getgroups_gidset __asm("a1") = (_getgroups_gidset); \
  __asm volatile ("jsr a6@(-96:W)" \
  : "=r"(__getgroups__re) \
  : "r"(__getgroups__bn), "r"(__getgroups_gidsetlen), "r"(__getgroups_gidset) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getgroups__re; \
  }); \
  _getgroups__re; \
})

#define setgroups(gidsetlen, gidset) ({ \
  LONG _setgroups_gidsetlen = (gidsetlen); \
  LONG * _setgroups_gidset = (gidset); \
  LONG _setgroups__re = \
  ({ \
  register struct Library * const __setgroups__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setgroups__re __asm("d0"); \
  register LONG __setgroups_gidsetlen __asm("d0") = (_setgroups_gidsetlen); \
  register LONG * __setgroups_gidset __asm("a1") = (_setgroups_gidset); \
  __asm volatile ("jsr a6@(-102:W)" \
  : "=r"(__setgroups__re) \
  : "r"(__setgroups__bn), "r"(__setgroups_gidsetlen), "r"(__setgroups_gidset) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setgroups__re; \
  }); \
  _setgroups__re; \
})

#define initgroups(name, basegid) ({ \
  STRPTR _initgroups_name = (name); \
  LONG _initgroups_basegid = (basegid); \
  LONG _initgroups__re = \
  ({ \
  register struct Library * const __initgroups__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __initgroups__re __asm("d0"); \
  register STRPTR __initgroups_name __asm("a1") = (_initgroups_name); \
  register LONG __initgroups_basegid __asm("d0") = (_initgroups_basegid); \
  __asm volatile ("jsr a6@(-108:W)" \
  : "=r"(__initgroups__re) \
  : "r"(__initgroups__bn), "r"(__initgroups_name), "r"(__initgroups_basegid) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __initgroups__re; \
  }); \
  _initgroups__re; \
})

#define getpwnam(login) ({ \
  STRPTR _getpwnam_login = (login); \
  struct passwd * _getpwnam__re = \
  ({ \
  register struct Library * const __getpwnam__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct passwd * __getpwnam__re __asm("d0"); \
  register STRPTR __getpwnam_login __asm("a1") = (_getpwnam_login); \
  __asm volatile ("jsr a6@(-114:W)" \
  : "=r"(__getpwnam__re) \
  : "r"(__getpwnam__bn), "r"(__getpwnam_login) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getpwnam__re; \
  }); \
  _getpwnam__re; \
})

#define getpwuid(uid) ({ \
  LONG _getpwuid_uid = (uid); \
  struct passwd * _getpwuid__re = \
  ({ \
  register struct Library * const __getpwuid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct passwd * __getpwuid__re __asm("d0"); \
  register LONG __getpwuid_uid __asm("d0") = (_getpwuid_uid); \
  __asm volatile ("jsr a6@(-120:W)" \
  : "=r"(__getpwuid__re) \
  : "r"(__getpwuid__bn), "r"(__getpwuid_uid) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getpwuid__re; \
  }); \
  _getpwuid__re; \
})

#define setpwent() ({ \
  register struct Library * const __setpwent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  __asm volatile ("jsr a6@(-126:W)" \
  : \
  : "r"(__setpwent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getpwent() ({ \
  struct passwd * _getpwent__re = \
  ({ \
  register struct Library * const __getpwent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct passwd * __getpwent__re __asm("d0"); \
  __asm volatile ("jsr a6@(-132:W)" \
  : "=r"(__getpwent__re) \
  : "r"(__getpwent__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getpwent__re; \
  }); \
  _getpwent__re; \
})

#define endpwent() ({ \
  register struct Library * const __endpwent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  __asm volatile ("jsr a6@(-138:W)" \
  : \
  : "r"(__endpwent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getgrnam(name) ({ \
  STRPTR _getgrnam_name = (name); \
  struct group * _getgrnam__re = \
  ({ \
  register struct Library * const __getgrnam__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct group * __getgrnam__re __asm("d0"); \
  register STRPTR __getgrnam_name __asm("a1") = (_getgrnam_name); \
  __asm volatile ("jsr a6@(-144:W)" \
  : "=r"(__getgrnam__re) \
  : "r"(__getgrnam__bn), "r"(__getgrnam_name) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getgrnam__re; \
  }); \
  _getgrnam__re; \
})

#define getgrgid(gid) ({ \
  LONG _getgrgid_gid = (gid); \
  struct group * _getgrgid__re = \
  ({ \
  register struct Library * const __getgrgid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct group * __getgrgid__re __asm("d0"); \
  register LONG __getgrgid_gid __asm("d0") = (_getgrgid_gid); \
  __asm volatile ("jsr a6@(-150:W)" \
  : "=r"(__getgrgid__re) \
  : "r"(__getgrgid__bn), "r"(__getgrgid_gid) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getgrgid__re; \
  }); \
  _getgrgid__re; \
})

#define setgrent() ({ \
  register struct Library * const __setgrent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  __asm volatile ("jsr a6@(-156:W)" \
  : \
  : "r"(__setgrent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getgrent() ({ \
  struct group * _getgrent__re = \
  ({ \
  register struct Library * const __getgrent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct group * __getgrent__re __asm("d0"); \
  __asm volatile ("jsr a6@(-162:W)" \
  : "=r"(__getgrent__re) \
  : "r"(__getgrent__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getgrent__re; \
  }); \
  _getgrent__re; \
})

#define endgrent() ({ \
  register struct Library * const __endgrent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  __asm volatile ("jsr a6@(-168:W)" \
  : \
  : "r"(__endgrent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define crypt(key, set) ({ \
  UBYTE * _crypt_key = (key); \
  UBYTE * _crypt_set = (set); \
  UBYTE * _crypt__re = \
  ({ \
  register struct Library * const __crypt__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register UBYTE * __crypt__re __asm("d0"); \
  register UBYTE * __crypt_key __asm("a0") = (_crypt_key); \
  register UBYTE * __crypt_set __asm("a1") = (_crypt_set); \
  __asm volatile ("jsr a6@(-174:W)" \
  : "=r"(__crypt__re) \
  : "r"(__crypt__bn), "r"(__crypt_key), "r"(__crypt_set) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __crypt__re; \
  }); \
  _crypt__re; \
})

#define ug_GetSalt(user, buf, size) ({ \
  struct passwd * _ug_GetSalt_user = (user); \
  UBYTE * _ug_GetSalt_buf = (buf); \
  ULONG _ug_GetSalt_size = (size); \
  UBYTE * _ug_GetSalt__re = \
  ({ \
  register struct Library * const __ug_GetSalt__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register UBYTE * __ug_GetSalt__re __asm("d0"); \
  register struct passwd * __ug_GetSalt_user __asm("a0") = (_ug_GetSalt_user); \
  register UBYTE * __ug_GetSalt_buf __asm("a1") = (_ug_GetSalt_buf); \
  register ULONG __ug_GetSalt_size __asm("d0") = (_ug_GetSalt_size); \
  __asm volatile ("jsr a6@(-180:W)" \
  : "=r"(__ug_GetSalt__re) \
  : "r"(__ug_GetSalt__bn), "r"(__ug_GetSalt_user), "r"(__ug_GetSalt_buf), "r"(__ug_GetSalt_size) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __ug_GetSalt__re; \
  }); \
  _ug_GetSalt__re; \
})

#define getpass(prompt) ({ \
  STRPTR _getpass_prompt = (prompt); \
  STRPTR _getpass__re = \
  ({ \
  register struct Library * const __getpass__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register STRPTR __getpass__re __asm("d0"); \
  register STRPTR __getpass_prompt __asm("a1") = (_getpass_prompt); \
  __asm volatile ("jsr a6@(-186:W)" \
  : "=r"(__getpass__re) \
  : "r"(__getpass__bn), "r"(__getpass_prompt) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getpass__re; \
  }); \
  _getpass__re; \
})

#define umask(mask) ({ \
  ULONG _umask_mask = (mask); \
  ULONG _umask__re = \
  ({ \
  register struct Library * const __umask__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register ULONG __umask__re __asm("d0"); \
  register ULONG __umask_mask __asm("d0") = (_umask_mask); \
  __asm volatile ("jsr a6@(-192:W)" \
  : "=r"(__umask__re) \
  : "r"(__umask__bn), "r"(__umask_mask) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __umask__re; \
  }); \
  _umask__re; \
})

#define getumask() ({ \
  ULONG _getumask__re = \
  ({ \
  register struct Library * const __getumask__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register ULONG __getumask__re __asm("d0"); \
  __asm volatile ("jsr a6@(-198:W)" \
  : "=r"(__getumask__re) \
  : "r"(__getumask__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getumask__re; \
  }); \
  _getumask__re; \
})

#define setsid() ({ \
  LONG _setsid__re = \
  ({ \
  register struct Library * const __setsid__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setsid__re __asm("d0"); \
  __asm volatile ("jsr a6@(-204:W)" \
  : "=r"(__setsid__re) \
  : "r"(__setsid__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setsid__re; \
  }); \
  _setsid__re; \
})

#define getpgrp() ({ \
  LONG _getpgrp__re = \
  ({ \
  register struct Library * const __getpgrp__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __getpgrp__re __asm("d0"); \
  __asm volatile ("jsr a6@(-210:W)" \
  : "=r"(__getpgrp__re) \
  : "r"(__getpgrp__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getpgrp__re; \
  }); \
  _getpgrp__re; \
})

#define getlogin() ({ \
  STRPTR _getlogin__re = \
  ({ \
  register struct Library * const __getlogin__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register STRPTR __getlogin__re __asm("d0"); \
  __asm volatile ("jsr a6@(-216:W)" \
  : "=r"(__getlogin__re) \
  : "r"(__getlogin__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getlogin__re; \
  }); \
  _getlogin__re; \
})

#define setlogin(name) ({ \
  STRPTR _setlogin_name = (name); \
  LONG _setlogin__re = \
  ({ \
  register struct Library * const __setlogin__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setlogin__re __asm("d0"); \
  register STRPTR __setlogin_name __asm("a1") = (_setlogin_name); \
  __asm volatile ("jsr a6@(-222:W)" \
  : "=r"(__setlogin__re) \
  : "r"(__setlogin__bn), "r"(__setlogin_name) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setlogin__re; \
  }); \
  _setlogin__re; \
})

#define setutent() ({ \
  register struct Library * const __setutent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  __asm volatile ("jsr a6@(-228:W)" \
  : \
  : "r"(__setutent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getutent() ({ \
  struct utmp * _getutent__re = \
  ({ \
  register struct Library * const __getutent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct utmp * __getutent__re __asm("d0"); \
  __asm volatile ("jsr a6@(-234:W)" \
  : "=r"(__getutent__re) \
  : "r"(__getutent__bn) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getutent__re; \
  }); \
  _getutent__re; \
})

#define endutent() ({ \
  register struct Library * const __endutent__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  __asm volatile ("jsr a6@(-240:W)" \
  : \
  : "r"(__endutent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getlastlog(uid) ({ \
  LONG _getlastlog_uid = (uid); \
  struct lastlog * _getlastlog__re = \
  ({ \
  register struct Library * const __getlastlog__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct lastlog * __getlastlog__re __asm("d0"); \
  register LONG __getlastlog_uid __asm("d0") = (_getlastlog_uid); \
  __asm volatile ("jsr a6@(-246:W)" \
  : "=r"(__getlastlog__re) \
  : "r"(__getlastlog__bn), "r"(__getlastlog_uid) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getlastlog__re; \
  }); \
  _getlastlog__re; \
})

#define setlastlog(uid, name, host) ({ \
  LONG _setlastlog_uid = (uid); \
  STRPTR _setlastlog_name = (name); \
  STRPTR _setlastlog_host = (host); \
  LONG _setlastlog__re = \
  ({ \
  register struct Library * const __setlastlog__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register LONG __setlastlog__re __asm("d0"); \
  register LONG __setlastlog_uid __asm("d0") = (_setlastlog_uid); \
  register STRPTR __setlastlog_name __asm("a0") = (_setlastlog_name); \
  register STRPTR __setlastlog_host __asm("a1") = (_setlastlog_host); \
  __asm volatile ("jsr a6@(-252:W)" \
  : "=r"(__setlastlog__re) \
  : "r"(__setlastlog__bn), "r"(__setlastlog_uid), "r"(__setlastlog_name), "r"(__setlastlog_host) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __setlastlog__re; \
  }); \
  _setlastlog__re; \
})

#define getcredentials(task) ({ \
  struct Task * _getcredentials_task = (task); \
  struct UserGroupCredentials * _getcredentials__re = \
  ({ \
  register struct Library * const __getcredentials__bn __asm("a6") = (struct Library *) (USERGROUP_BASE_NAME);\
  register struct UserGroupCredentials * __getcredentials__re __asm("d0"); \
  register struct Task * __getcredentials_task __asm("a0") = (_getcredentials_task); \
  __asm volatile ("jsr a6@(-258:W)" \
  : "=r"(__getcredentials__re) \
  : "r"(__getcredentials__bn), "r"(__getcredentials_task) \
  : "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  __getcredentials__re; \
  }); \
  _getcredentials__re; \
})

#endif /*  _INLINE_USERGROUP_H  */
