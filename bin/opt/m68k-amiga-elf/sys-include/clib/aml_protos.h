#ifndef  CLIB_AML_PROTOS_H
#define  CLIB_AML_PROTOS_H

/*
**	$VER: aml_protos.h 1.2 (6.10.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef  UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif
#ifndef  REXX_STORAGE_H
#include <rexx/storage.h>
#endif
#ifndef  LIBRARIES_AML_H
#include <libraries/aml.h>
#endif
LONG RexxDispatcher( struct RexxMsg *rxm );
APTR CreateServerA( struct TagItem *tags );
APTR CreateServer( Tag firstTag, ... );
VOID DisposeServer( APTR server );
ULONG SetServerAttrsA( APTR server, struct TagItem *tags );
ULONG SetServerAttrs( APTR server, ... );
ULONG GetServerAttrsA( APTR server, struct TagItem *tags );
ULONG GetServerAttrs( APTR server, ... );
ULONG GetServerHeaders( APTR server, ULONG flags );
LONG GetServerArticles( APTR server, APTR folder, struct Hook *hook, ULONG flags );
APTR CreateFolderA( APTR server, struct TagItem *tags );
APTR CreateFolder( APTR server, ... );
BOOL DisposeFolder( APTR folder );
APTR OpenFolderA( APTR server, struct TagItem *tags );
APTR OpenFolder( APTR server, ... );
BOOL SaveFolder( APTR folder );
BOOL RemFolder( APTR folder );
ULONG SetFolderAttrsA( APTR folder, struct TagItem *tags );
ULONG SetFolderAttrs( APTR folder, ... );
ULONG GetFolderAttrsA( APTR folder, struct TagItem *tags );
ULONG GetFolderAttrs( APTR folder, ... );
BOOL AddFolderArticle( APTR folder, ULONG type, APTR data );
BOOL RemFolderArticle( APTR folder, APTR article );
ULONG ReadFolderSpool( APTR folder, STRPTR importfile, ULONG flags );
ULONG WriteFolderSpool( APTR folder, STRPTR exportfile, ULONG flags );
ULONG ScanFolderIndex( APTR folder, struct Hook *hook, ULONG flags );
BOOL ExpungeFolder( APTR folder, APTR trash, struct Hook *hook );
ULONG CreateFolderIndex( APTR folder );
ULONG SortFolderIndex( APTR folder, ULONG field );
APTR CreateArticleA( APTR folder, struct TagItem *tags );
APTR CreateArticle( APTR folder, ... );
BOOL DisposeArticle( APTR article );
APTR OpenArticle( APTR server, APTR folder, ULONG msgID, ULONG flags );
BOOL CopyArticle( APTR folder, APTR article );
ULONG SetArticleAttrsA( APTR article, struct TagItem *tags );
ULONG SetArticleAttrs( APTR article, ... );
ULONG GetArticleAttrsA( APTR article, struct TagItem *tags );
ULONG GetArticleAttrs( APTR article, ... );
BOOL SendArticle( APTR server, APTR article, UBYTE *from_file );
BOOL AddArticlePartA( APTR article, APTR part, struct TagItem *tags );
BOOL AddArticlePart( APTR article, APTR part, ... );
VOID RemArticlePart( APTR article, APTR part );
APTR GetArticlePart( APTR article, ULONG partnum );
ULONG GetArticlePartAttrsA( APTR part, struct TagItem *tags );
ULONG GetArticlePartAttrs( APTR part, ... );
ULONG SetArticlePartAttrsA( APTR part, struct TagItem *tags );
ULONG SetArticlePartAttrs( APTR part, ... );
APTR CreateArticlePartA( APTR article, struct TagItem *tags );
APTR CreateArticlePart( APTR article, ... );
VOID DisposeArticlePart( APTR part );
BOOL GetArticlePartDataA( APTR article, APTR part, struct TagItem *tags );
BOOL GetArticlePartData( APTR article, APTR part, ... );
BOOL SetArticlePartDataA( APTR part, struct TagItem *tags );
BOOL SetArticlePartData( APTR part, ... );
APTR CreateAddressEntryA( struct TagItem *tags );
APTR CreateAddressEntry( Tag firstTag, ... );
BOOL DisposeAddressEntry( APTR addr );
APTR OpenAddressEntry( APTR server, ULONG fileid );
LONG SaveAddressEntry( APTR server, APTR addr );
BOOL RemAddressEntry( APTR server, APTR addr );
ULONG GetAddressEntryAttrsA( APTR addr, struct TagItem *tags );
ULONG GetAddressEntryAttrs( APTR addr, ... );
ULONG SetAddressEntryAttrsA( APTR addr, struct TagItem *tags );
ULONG SetAddressEntryAttrs( APTR addr, ... );
BOOL MatchAddressA( APTR addr, struct TagItem *tags );
BOOL MatchAddress( APTR addr, ... );
APTR FindAddressEntryA( APTR server, struct TagItem *tags );
APTR FindAddressEntry( APTR server, ... );
APTR HuntAddressEntryA( APTR server, struct TagItem *tags );
APTR HuntAddressEntry( APTR server, ... );
ULONG ScanAddressIndex( APTR server, struct Hook *hook, ULONG type, ULONG flags );
BOOL AddCustomField( APTR addr, STRPTR field, STRPTR data );
BOOL RemCustomField( APTR addr, STRPTR field );
STRPTR GetCustomFieldData( APTR addr, STRPTR field );
APTR CreateDecoderA( struct TagItem *tags );
APTR CreateDecoder( Tag firstTag, ... );
VOID DisposeDecoder( APTR dec );
ULONG GetDecoderAttrsA( APTR dec, struct TagItem *tags );
ULONG GetDecoderAttrs( APTR dec, ... );
ULONG SetDecoderAttrsA( APTR dec, struct TagItem *tags );
ULONG SetDecoderAttrs( APTR dec, ... );
LONG Decode( APTR dec, ULONG type );
LONG Encode( APTR dec, ULONG type );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_AML_PROTOS_H */
