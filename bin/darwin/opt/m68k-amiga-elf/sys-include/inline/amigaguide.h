/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_AMIGAGUIDE_H
#define _INLINE_AMIGAGUIDE_H

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

#ifndef AMIGAGUIDE_BASE_NAME
#define AMIGAGUIDE_BASE_NAME AmigaGuideBase
#endif /* !AMIGAGUIDE_BASE_NAME */

#define LockAmigaGuideBase(___handle) \
      LP1(0x24, LONG, LockAmigaGuideBase , APTR, ___handle, a0,\
      , AMIGAGUIDE_BASE_NAME)

#define UnlockAmigaGuideBase(___key) \
      LP1NR(0x2a, UnlockAmigaGuideBase , LONG, ___key, d0,\
      , AMIGAGUIDE_BASE_NAME)

#define OpenAmigaGuideA(___nag, ___tags) \
      LP2(0x36, APTR, OpenAmigaGuideA , struct NewAmigaGuide *, ___nag, a0, struct TagItem *, ___tags, a1,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenAmigaGuide(___nag, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; OpenAmigaGuideA((___nag), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define OpenAmigaGuideAsyncA(___nag, ___attrs) \
      LP2(0x3c, APTR, OpenAmigaGuideAsyncA , struct NewAmigaGuide *, ___nag, a0, struct TagItem *, ___attrs, d0,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenAmigaGuideAsync(___nag, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; OpenAmigaGuideAsyncA((___nag), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define CloseAmigaGuide(___cl) \
      LP1NR(0x42, CloseAmigaGuide , APTR, ___cl, a0,\
      , AMIGAGUIDE_BASE_NAME)

#define AmigaGuideSignal(___cl) \
      LP1(0x48, ULONG, AmigaGuideSignal , APTR, ___cl, a0,\
      , AMIGAGUIDE_BASE_NAME)

#define GetAmigaGuideMsg(___cl) \
      LP1(0x4e, struct AmigaGuideMsg *, GetAmigaGuideMsg , APTR, ___cl, a0,\
      , AMIGAGUIDE_BASE_NAME)

#define ReplyAmigaGuideMsg(___amsg) \
      LP1NR(0x54, ReplyAmigaGuideMsg , struct AmigaGuideMsg *, ___amsg, a0,\
      , AMIGAGUIDE_BASE_NAME)

#define SetAmigaGuideContextA(___cl, ___id, ___attrs) \
      LP3(0x5a, LONG, SetAmigaGuideContextA , APTR, ___cl, a0, ULONG, ___id, d0, struct TagItem *, ___attrs, d1,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetAmigaGuideContext(___cl, ___id, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; SetAmigaGuideContextA((___cl), (___id), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SendAmigaGuideContextA(___cl, ___attrs) \
      LP2(0x60, LONG, SendAmigaGuideContextA , APTR, ___cl, a0, struct TagItem *, ___attrs, d0,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SendAmigaGuideContext(___cl, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; SendAmigaGuideContextA((___cl), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SendAmigaGuideCmdA(___cl, ___cmd, ___attrs) \
      LP3(0x66, LONG, SendAmigaGuideCmdA , APTR, ___cl, a0, STRPTR, ___cmd, d0, struct TagItem *, ___attrs, d1,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SendAmigaGuideCmd(___cl, ___cmd, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; SendAmigaGuideCmdA((___cl), (___cmd), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetAmigaGuideAttrsA(___cl, ___attrs) \
      LP2(0x6c, LONG, SetAmigaGuideAttrsA , APTR, ___cl, a0, struct TagItem *, ___attrs, a1,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetAmigaGuideAttrs(___cl, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; SetAmigaGuideAttrsA((___cl), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetAmigaGuideAttr(___tag, ___cl, ___storage) \
      LP3(0x72, LONG, GetAmigaGuideAttr , Tag, ___tag, d0, APTR, ___cl, a0, ULONG *, ___storage, a1,\
      , AMIGAGUIDE_BASE_NAME)

#define LoadXRef(___lock, ___name) \
      LP2(0x7e, LONG, LoadXRef , BPTR, ___lock, a0, STRPTR, ___name, a1,\
      , AMIGAGUIDE_BASE_NAME)

#define ExpungeXRef() \
      LP0NR(0x84, ExpungeXRef ,\
      , AMIGAGUIDE_BASE_NAME)

#define AddAmigaGuideHostA(___h, ___name, ___attrs) \
      LP3(0x8a, APTR, AddAmigaGuideHostA , struct Hook *, ___h, a0, STRPTR, ___name, d0, struct TagItem *, ___attrs, a1,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AddAmigaGuideHost(___h, ___name, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; AddAmigaGuideHostA((___h), (___name), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RemoveAmigaGuideHostA(___hh, ___attrs) \
      LP2(0x90, LONG, RemoveAmigaGuideHostA , APTR, ___hh, a0, struct TagItem *, ___attrs, a1,\
      , AMIGAGUIDE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define RemoveAmigaGuideHost(___hh, ___attrs, ...) \
    ({_sfdc_vararg _tags[] = { ___attrs, __VA_ARGS__ }; RemoveAmigaGuideHostA((___hh), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetAmigaGuideString(___id) \
      LP1(0xd2, STRPTR, GetAmigaGuideString , LONG, ___id, d0,\
      , AMIGAGUIDE_BASE_NAME)

#endif /* !_INLINE_AMIGAGUIDE_H */
