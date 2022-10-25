/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_LOCALE_H
#define _INLINE_LOCALE_H

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

#ifndef LOCALE_BASE_NAME
#define LOCALE_BASE_NAME LocaleBase
#endif /* !LOCALE_BASE_NAME */

#define CloseCatalog(___catalog) \
      LP1NR(0x24, CloseCatalog , struct Catalog *, ___catalog, a0,\
      , LOCALE_BASE_NAME)

#define CloseLocale(___locale) \
      LP1NR(0x2a, CloseLocale , struct Locale *, ___locale, a0,\
      , LOCALE_BASE_NAME)

#define ConvToLower(___locale, ___character) \
      LP2(0x30, ULONG, ConvToLower , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define ConvToUpper(___locale, ___character) \
      LP2(0x36, ULONG, ConvToUpper , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define FormatDate(___locale, ___fmtTemplate, ___date, ___putCharFunc) \
      LP4NR(0x3c, FormatDate , struct Locale *, ___locale, a0, STRPTR, ___fmtTemplate, a1, struct DateStamp *, ___date, a2, struct Hook *, ___putCharFunc, a3,\
      , LOCALE_BASE_NAME)

#define FormatString(___locale, ___fmtTemplate, ___dataStream, ___putCharFunc) \
      LP4(0x42, APTR, FormatString , struct Locale *, ___locale, a0, STRPTR, ___fmtTemplate, a1, APTR, ___dataStream, a2, struct Hook *, ___putCharFunc, a3,\
      , LOCALE_BASE_NAME)

#define GetCatalogStr(___catalog, ___stringNum, ___defaultString) \
      LP3(0x48, STRPTR, GetCatalogStr , struct Catalog *, ___catalog, a0, LONG, ___stringNum, d0, STRPTR, ___defaultString, a1,\
      , LOCALE_BASE_NAME)

#define GetLocaleStr(___locale, ___stringNum) \
      LP2(0x4e, STRPTR, GetLocaleStr , struct Locale *, ___locale, a0, ULONG, ___stringNum, d0,\
      , LOCALE_BASE_NAME)

#define IsAlNum(___locale, ___character) \
      LP2(0x54, BOOL, IsAlNum , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsAlpha(___locale, ___character) \
      LP2(0x5a, BOOL, IsAlpha , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsCntrl(___locale, ___character) \
      LP2(0x60, BOOL, IsCntrl , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsDigit(___locale, ___character) \
      LP2(0x66, BOOL, IsDigit , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsGraph(___locale, ___character) \
      LP2(0x6c, BOOL, IsGraph , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsLower(___locale, ___character) \
      LP2(0x72, BOOL, IsLower , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsPrint(___locale, ___character) \
      LP2(0x78, BOOL, IsPrint , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsPunct(___locale, ___character) \
      LP2(0x7e, BOOL, IsPunct , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsSpace(___locale, ___character) \
      LP2(0x84, BOOL, IsSpace , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsUpper(___locale, ___character) \
      LP2(0x8a, BOOL, IsUpper , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define IsXDigit(___locale, ___character) \
      LP2(0x90, BOOL, IsXDigit , struct Locale *, ___locale, a0, ULONG, ___character, d0,\
      , LOCALE_BASE_NAME)

#define OpenCatalogA(___locale, ___name, ___tags) \
      LP3(0x96, struct Catalog *, OpenCatalogA , struct Locale *, ___locale, a0, STRPTR, ___name, a1, struct TagItem *, ___tags, a2,\
      , LOCALE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenCatalog(___locale, ___name, ___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; OpenCatalogA((___locale), (___name), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define OpenLocale(___name) \
      LP1(0x9c, struct Locale *, OpenLocale , STRPTR, ___name, a0,\
      , LOCALE_BASE_NAME)

#define ParseDate(___locale, ___date, ___fmtTemplate, ___getCharFunc) \
      LP4(0xa2, BOOL, ParseDate , struct Locale *, ___locale, a0, struct DateStamp *, ___date, a1, STRPTR, ___fmtTemplate, a2, struct Hook *, ___getCharFunc, a3,\
      , LOCALE_BASE_NAME)

#define StrConvert(___locale, ___string, ___buffer, ___bufferSize, ___type) \
      LP5(0xae, ULONG, StrConvert , struct Locale *, ___locale, a0, STRPTR, ___string, a1, APTR, ___buffer, a2, ULONG, ___bufferSize, d0, ULONG, ___type, d1,\
      , LOCALE_BASE_NAME)

#define StrnCmp(___locale, ___string1, ___string2, ___length, ___type) \
      LP5(0xb4, LONG, StrnCmp , struct Locale *, ___locale, a0, STRPTR, ___string1, a1, STRPTR, ___string2, a2, LONG, ___length, d0, ULONG, ___type, d1,\
      , LOCALE_BASE_NAME)

#endif /* !_INLINE_LOCALE_H */
