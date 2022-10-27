/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_BULLET_H
#define _INLINE_BULLET_H

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

#ifndef BULLET_BASE_NAME
#define BULLET_BASE_NAME BulletBase
#endif /* !BULLET_BASE_NAME */

#define OpenEngine() \
      LP0(0x1e, struct GlyphEngine *, OpenEngine ,\
      , BULLET_BASE_NAME)

#define CloseEngine(___glyphEngine) \
      LP1NR(0x24, CloseEngine , struct GlyphEngine *, ___glyphEngine, a0,\
      , BULLET_BASE_NAME)

#define SetInfoA(___glyphEngine, ___tagList) \
      LP2(0x2a, ULONG, SetInfoA , struct GlyphEngine *, ___glyphEngine, a0, struct TagItem *, ___tagList, a1,\
      , BULLET_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetInfo(___glyphEngine, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; SetInfoA((___glyphEngine), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ObtainInfoA(___glyphEngine, ___tagList) \
      LP2(0x30, ULONG, ObtainInfoA , struct GlyphEngine *, ___glyphEngine, a0, struct TagItem *, ___tagList, a1,\
      , BULLET_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ObtainInfo(___glyphEngine, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; ObtainInfoA((___glyphEngine), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ReleaseInfoA(___glyphEngine, ___tagList) \
      LP2(0x36, ULONG, ReleaseInfoA , struct GlyphEngine *, ___glyphEngine, a0, struct TagItem *, ___tagList, a1,\
      , BULLET_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ReleaseInfo(___glyphEngine, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; ReleaseInfoA((___glyphEngine), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_BULLET_H */
