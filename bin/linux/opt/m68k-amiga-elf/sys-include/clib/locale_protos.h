#ifndef  CLIB_LOCALE_PROTOS_H
#define  CLIB_LOCALE_PROTOS_H

/*
**	$VER: locale_protos.h 38.5 (18.6.1993)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  LIBRARIES_LOCALE_H
#include <libraries/locale.h>
#endif
#ifndef  DOS_DOS_H
#include <dos/dos.h>
#endif
#ifndef  UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef  REXX_STORAGE_H
#include <rexx/storage.h>
#endif
/*--- functions in V38 or higher (Release 2.1) ---*/
VOID CloseCatalog( struct Catalog *catalog );
VOID CloseLocale( struct Locale *locale );
ULONG ConvToLower( struct Locale *locale, ULONG character );
ULONG ConvToUpper( struct Locale *locale, ULONG character );
VOID FormatDate( struct Locale *locale, STRPTR fmtTemplate, struct DateStamp *date, struct Hook *putCharFunc );
APTR FormatString( struct Locale *locale, STRPTR fmtTemplate, APTR dataStream, struct Hook *putCharFunc );
STRPTR GetCatalogStr( struct Catalog *catalog, LONG stringNum, STRPTR defaultString );
STRPTR GetLocaleStr( struct Locale *locale, ULONG stringNum );
BOOL IsAlNum( struct Locale *locale, ULONG character );
BOOL IsAlpha( struct Locale *locale, ULONG character );
BOOL IsCntrl( struct Locale *locale, ULONG character );
BOOL IsDigit( struct Locale *locale, ULONG character );
BOOL IsGraph( struct Locale *locale, ULONG character );
BOOL IsLower( struct Locale *locale, ULONG character );
BOOL IsPrint( struct Locale *locale, ULONG character );
BOOL IsPunct( struct Locale *locale, ULONG character );
BOOL IsSpace( struct Locale *locale, ULONG character );
BOOL IsUpper( struct Locale *locale, ULONG character );
BOOL IsXDigit( struct Locale *locale, ULONG character );
struct Catalog *OpenCatalogA( struct Locale *locale, STRPTR name, struct TagItem *tags );
struct Catalog *OpenCatalog( struct Locale *locale, STRPTR name, Tag tag1, ... );
struct Locale *OpenLocale( STRPTR name );
BOOL ParseDate( struct Locale *locale, struct DateStamp *date, STRPTR fmtTemplate, struct Hook *getCharFunc );
ULONG StrConvert( struct Locale *locale, STRPTR string, APTR buffer, ULONG bufferSize, ULONG type );
LONG StrnCmp( struct Locale *locale, STRPTR string1, STRPTR string2, LONG length, ULONG type );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_LOCALE_PROTOS_H */
