/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_DISKFONT_H
#define _INLINE_DISKFONT_H

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

#ifndef DISKFONT_BASE_NAME
#define DISKFONT_BASE_NAME DiskfontBase
#endif /* !DISKFONT_BASE_NAME */

#define OpenDiskFont(___textAttr) \
      LP1(0x1e, struct TextFont *, OpenDiskFont , struct TextAttr *, ___textAttr, a0,\
      , DISKFONT_BASE_NAME)

#define AvailFonts(___buffer, ___bufBytes, ___flags) \
      LP3(0x24, LONG, AvailFonts , STRPTR, ___buffer, a0, LONG, ___bufBytes, d0, LONG, ___flags, d1,\
      , DISKFONT_BASE_NAME)

#define NewFontContents(___fontsLock, ___fontName) \
      LP2(0x2a, struct FontContentsHeader *, NewFontContents , BPTR, ___fontsLock, a0, STRPTR, ___fontName, a1,\
      , DISKFONT_BASE_NAME)

#define DisposeFontContents(___fontContentsHeader) \
      LP1NR(0x30, DisposeFontContents , struct FontContentsHeader *, ___fontContentsHeader, a1,\
      , DISKFONT_BASE_NAME)

#define NewScaledDiskFont(___sourceFont, ___destTextAttr) \
      LP2(0x36, struct DiskFont *, NewScaledDiskFont , struct TextFont *, ___sourceFont, a0, struct TextAttr *, ___destTextAttr, a1,\
      , DISKFONT_BASE_NAME)

#define GetDiskFontCtrl(___tagid) \
      LP1(0x3c, LONG, GetDiskFontCtrl , LONG, ___tagid, d0,\
      , DISKFONT_BASE_NAME)

#define SetDiskFontCtrlA(___taglist) \
      LP1NR(0x42, SetDiskFontCtrlA , struct TagItem *, ___taglist, a0,\
      , DISKFONT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetDiskFontCtrl(____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetDiskFontCtrlA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_DISKFONT_H */
