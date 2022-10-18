/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_REALTIME_H
#define _INLINE_REALTIME_H

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

#ifndef REALTIME_BASE_NAME
#define REALTIME_BASE_NAME RealTimeBase
#endif /* !REALTIME_BASE_NAME */

#define LockRealTime(___lockType) \
      LP1(0x1e, APTR, LockRealTime , ULONG, ___lockType, d0,\
      , REALTIME_BASE_NAME)

#define UnlockRealTime(___lock) \
      LP1NR(0x24, UnlockRealTime , APTR, ___lock, a0,\
      , REALTIME_BASE_NAME)

#define CreatePlayerA(___tagList) \
      LP1(0x2a, struct Player *, CreatePlayerA , const struct TagItem *, ___tagList, a0,\
      , REALTIME_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreatePlayer(___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; CreatePlayerA((const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DeletePlayer(___player) \
      LP1NR(0x30, DeletePlayer , struct Player *, ___player, a0,\
      , REALTIME_BASE_NAME)

#define SetPlayerAttrsA(___player, ___tagList) \
      LP2(0x36, BOOL, SetPlayerAttrsA , struct Player *, ___player, a0, const struct TagItem *, ___tagList, a1,\
      , REALTIME_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetPlayerAttrs(___player, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; SetPlayerAttrsA((___player), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetConductorState(___player, ___state, ___time) \
      LP3(0x3c, LONG, SetConductorState , struct Player *, ___player, a0, ULONG, ___state, d0, LONG, ___time, d1,\
      , REALTIME_BASE_NAME)

#define ExternalSync(___player, ___minTime, ___maxTime) \
      LP3(0x42, BOOL, ExternalSync , struct Player *, ___player, a0, LONG, ___minTime, d0, LONG, ___maxTime, d1,\
      , REALTIME_BASE_NAME)

#define NextConductor(___previousConductor) \
      LP1(0x48, struct Conductor *, NextConductor , const struct Conductor *, ___previousConductor, a0,\
      , REALTIME_BASE_NAME)

#define FindConductor(___name) \
      LP1(0x4e, struct Conductor *, FindConductor , CONST_STRPTR, ___name, a0,\
      , REALTIME_BASE_NAME)

#define GetPlayerAttrsA(___player, ___tagList) \
      LP2(0x54, ULONG, GetPlayerAttrsA , const struct Player *, ___player, a0, const struct TagItem *, ___tagList, a1,\
      , REALTIME_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetPlayerAttrs(___player, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; GetPlayerAttrsA((___player), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_REALTIME_H */
