/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_RESOURCE_H
#define _INLINE_RESOURCE_H

#ifndef _SFDC_VARARG_DEFINED
#define _SFDC_VARARG_DEFINED
#ifdef __HAVE_IPTR_ATTR__
typedef APTR _sfdc_vararg __attribute__((iptr));
#else
typedef ULONG _sfdc_vararg;
#endif /* __HAVE_IPTR_ATTR__ */
#endif /* _SFDC_VARARG_DEFINED */

#ifndef __INLINE_MACROS_H
#include <inline/macros.h>
#endif /* !__INLINE_MACROS_H */

#ifndef RESOURCE_BASE_NAME
#define RESOURCE_BASE_NAME ResourceBase
#endif /* !RESOURCE_BASE_NAME */

#define RL_OpenResource(___resource, ___screen, ___catalog) \
      LP3(0x1e, RESOURCEFILE, RL_OpenResource , APTR, ___resource, a0, struct Screen *, ___screen, a1, struct Catalog *, ___catalog, a2,\
      , RESOURCE_BASE_NAME)

#define RL_CloseResource(___resfile) \
      LP1NR(0x24, RL_CloseResource , RESOURCEFILE, ___resfile, a0,\
      , RESOURCE_BASE_NAME)

#define RL_NewObjectA(___resfile, ___resid, ___tags) \
      LP3(0x2a, Object *, RL_NewObjectA , RESOURCEFILE, ___resfile, a0, RESOURCEID, ___resid, d0, struct TagItem *, ___tags, a1,\
      , RESOURCE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define RL_NewObject(___resfile, ___resid, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; RL_NewObjectA((___resfile), (___resid), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RL_DisposeObject(___resfile, ___obj) \
      LP2NR(0x30, RL_DisposeObject , RESOURCEFILE, ___resfile, a0, Object *, ___obj, a1,\
      , RESOURCE_BASE_NAME)

#define RL_NewGroupA(___resfile, ___id, ___taglist) \
      LP3(0x36, Object **, RL_NewGroupA , RESOURCEFILE, ___resfile, a0, RESOURCEID, ___id, d0, struct TagItem *, ___taglist, a1,\
      , RESOURCE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define RL_NewGroup(___resfile, ___id, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; RL_NewGroupA((___resfile), (___id), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RL_DisposeGroup(___resfile, ___obj) \
      LP2NR(0x3c, RL_DisposeGroup , RESOURCEFILE, ___resfile, a0, Object **, ___obj, a1,\
      , RESOURCE_BASE_NAME)

#define RL_GetObjectArray(___resfile, ___obj, ___id) \
      LP3(0x42, Object **, RL_GetObjectArray , RESOURCEFILE, ___resfile, a0, Object *, ___obj, a1, RESOURCEID, ___id, d0,\
      , RESOURCE_BASE_NAME)

#define RL_SetResourceScreen(___resfile, ___screen) \
      LP2(0x48, BOOL, RL_SetResourceScreen , RESOURCEFILE, ___resfile, a0, struct Screen *, ___screen, a1,\
      , RESOURCE_BASE_NAME)

#endif /* !_INLINE_RESOURCE_H */
