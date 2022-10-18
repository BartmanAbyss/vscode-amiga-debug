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

#ifndef PROTO_USERGROUP_H
#define PROTO_USERGROUP_H

#ifndef LIBRARIES_USERGROUP_H
#include <libraries/usergroup.h>
#endif
#ifndef PWD_H
#include <pwd.h>
#endif
#ifndef GRP_H
#include <grp.h>
#endif

/****************************************************************************/

#ifndef __NOLIBBASE__
extern struct Library * UserGroupBase;
#endif /* __NOLIBBASE__ */

/****************************************************************************/

#ifdef __amigaos4__
 #include <interfaces/usergroup.h>
 #ifdef __USE_INLINE__
  #include <inline4/usergroup.h>
 #endif /* __USE_INLINE__ */
 #ifndef CLIB_USERGROUP_PROTOS_H
  #define CLIB_USERGROUP_PROTOS_H 1
 #endif /* CLIB_USERGROUP_PROTOS_H */
 #ifndef __NOGLOBALIFACE__
  extern struct UserGroupIFace *IUserGroup;
 #endif /* __NOGLOBALIFACE__ */
#else /* __amigaos4__ */
 #ifndef CLIB_USERGROUP_PROTOS_H
  #include <clib/usergroup_protos.h>
 #endif /* CLIB_USERGROUP_PROTOS_H */
 #if defined(__GNUC__)
  #ifndef __PPC__
   #include <inline/usergroup.h>
  #else
   #include <ppcinline/usergroup.h>
  #endif /* __PPC__ */
 #elif defined(__VBCC__)
  #ifndef __PPC__
   #include <inline/usergroup_protos.h>
  #endif /* __PPC__ */
 #else
  #include <pragmas/usergroup_pragmas.h>
 #endif /* __GNUC__ */
#endif /* __amigaos4__ */

/****************************************************************************/

#endif /* PROTO_USERGROUP_H */
