/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef _INLINE_CHOOSER_H
#define _INLINE_CHOOSER_H

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

#ifndef CHOOSER_BASE_NAME
#define CHOOSER_BASE_NAME ChooserBase
#endif /* !CHOOSER_BASE_NAME */

#define CHOOSER_GetClass() \
      LP0(0x1e, Class *, CHOOSER_GetClass ,\
      , CHOOSER_BASE_NAME)

#define AllocChooserNodeA(___tags) \
      LP1(0x24, struct Node *, AllocChooserNodeA , struct TagItem *, ___tags, a0,\
      , CHOOSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocChooserNode(___firstTag, ...) \
    ({_sfdc_vararg _tags[] = { ___firstTag, __VA_ARGS__ }; *AllocChooserNodeA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeChooserNode(___node) \
      LP1NR(0x2a, FreeChooserNode , struct Node *, ___node, a0,\
      , CHOOSER_BASE_NAME)

#define SetChooserNodeAttrsA(___node, ___tags) \
      LP2NR(0x30, SetChooserNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , CHOOSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetChooserNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetChooserNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetChooserNodeAttrsA(___node, ___tags) \
      LP2NR(0x36, GetChooserNodeAttrsA , struct Node *, ___node, a0, struct TagItem *, ___tags, a1,\
      , CHOOSER_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetChooserNodeAttrs(___node, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetChooserNodeAttrsA((___node), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ShowChooser(___o, ___w, ___xpos, ___ypos) \
      LP4(0x3c, ULONG, ShowChooser , Object *, ___o, a0, struct Window *, ___w, a1, ULONG, ___xpos, d0, ULONG, ___ypos, d1,\
      , CHOOSER_BASE_NAME)

#define HideChooser(___o, ___w) \
      LP2NR(0x42, HideChooser , Object *, ___o, a0, struct Window *, ___w, a1,\
      , CHOOSER_BASE_NAME)

#endif /* !_INLINE_CHOOSER_H */
