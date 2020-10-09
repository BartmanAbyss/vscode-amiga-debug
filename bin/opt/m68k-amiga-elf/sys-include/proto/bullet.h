/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_BULLET_H
#define PROTO_BULLET_H

#include <clib/bullet_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/bullet.h>
#  else
#   include <inline/bullet.h>
#  endif
# else
#  include <pragmas/bullet_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/bullet.h>
# ifndef __NOGLOBALIFACE__
   extern struct BulletIFace *IBullet;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  BulletBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_BULLET_H */
