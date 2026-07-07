/* Automatically generated header (sfdc 1.12)! Do not edit! */

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
      LP3(0x24, LONG, AvailFonts , struct AvailFontsHeader *, ___buffer, a0, LONG, ___bufBytes, d0, ULONG, ___flags, d1,\
      , DISKFONT_BASE_NAME)

#define NewFontContents(___fontsLock, ___fontName) \
      LP2(0x2a, struct FontContentsHeader *, NewFontContents , BPTR, ___fontsLock, a0, CONST_STRPTR, ___fontName, a1,\
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
      LP1NR(0x42, SetDiskFontCtrlA , CONST struct TagItem *, ___taglist, a0,\
      , DISKFONT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetDiskFontCtrl(___tag1, ...) \
    ({_sfdc_vararg _tags[] = { ___tag1, __VA_ARGS__ }; SetDiskFontCtrlA((CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define EOpenEngine(___EEngine) \
      LP1(0x48, LONG, EOpenEngine , struct EGlyphEngine *, ___EEngine, a0,\
      , DISKFONT_BASE_NAME)

#define ECloseEngine(___EEngine) \
      LP1NR(0x4e, ECloseEngine , struct EGlyphEngine *, ___EEngine, a0,\
      , DISKFONT_BASE_NAME)

#define ESetInfoA(___EEngine, ___taglist) \
      LP2(0x54, ULONG, ESetInfoA , struct EGlyphEngine *, ___EEngine, a0, CONST struct TagItem *, ___taglist, a1,\
      , DISKFONT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ESetInfo(___EEngine, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; ESetInfoA((___EEngine), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define EObtainInfoA(___EEngine, ___taglist) \
      LP2(0x5a, ULONG, EObtainInfoA , struct EGlyphEngine *, ___EEngine, a0, CONST struct TagItem *, ___taglist, a1,\
      , DISKFONT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define EObtainInfo(___EEngine, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; EObtainInfoA((___EEngine), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define EReleaseInfoA(___EEngine, ___taglist) \
      LP2(0x60, ULONG, EReleaseInfoA , struct EGlyphEngine *, ___EEngine, a0, CONST struct TagItem *, ___taglist, a1,\
      , DISKFONT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define EReleaseInfo(___EEngine, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; EReleaseInfoA((___EEngine), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define OpenOutlineFont(___name, ___list, ___flags) \
      LP3(0x66, struct OutlineFont *, OpenOutlineFont , CONST_STRPTR, ___name, a0, struct List *, ___list, a1, ULONG, ___flags, d0,\
      , DISKFONT_BASE_NAME)

#define CloseOutlineFont(___olf, ___list) \
      LP2NR(0x6c, CloseOutlineFont , struct OutlineFont *, ___olf, a0, struct List *, ___list, a1,\
      , DISKFONT_BASE_NAME)

#define WriteFontContents(___fontsLock, ___fontName, ___fontContentsHeader) \
      LP3(0x72, LONG, WriteFontContents , BPTR, ___fontsLock, a0, CONST_STRPTR, ___fontName, a1, CONST struct FontContentsHeader *, ___fontContentsHeader, a2,\
      , DISKFONT_BASE_NAME)

#define WriteDiskFontHeaderA(___font, ___fileName, ___tagList) \
      LP3(0x78, LONG, WriteDiskFontHeaderA , CONST struct TextFont *, ___font, a0, CONST_STRPTR, ___fileName, a1, CONST struct TagItem *, ___tagList, a2,\
      , DISKFONT_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define WriteDiskFontHeader(___font, ___fileName, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; WriteDiskFontHeaderA((___font), (___fileName), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ObtainCharsetInfo(___knownTag, ___knownValue, ___wantedTag) \
      LP3(0x7e, ULONG, ObtainCharsetInfo , ULONG, ___knownTag, d0, ULONG, ___knownValue, d1, ULONG, ___wantedTag, d2,\
      , DISKFONT_BASE_NAME)

#endif /* !_INLINE_DISKFONT_H */
