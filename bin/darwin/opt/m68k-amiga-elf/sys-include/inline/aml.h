/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_AML_H
#define _INLINE_AML_H

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

#ifndef AML_BASE_NAME
#define AML_BASE_NAME AmlBase
#endif /* !AML_BASE_NAME */

#define RexxDispatcher(___rxm) \
      LP1(0x1e, LONG, RexxDispatcher , struct RexxMsg *, ___rxm, a0,\
      , AML_BASE_NAME)

#define CreateServerA(___tags) \
      LP1(0x24, APTR, CreateServerA , struct TagItem *, ___tags, a0,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateServer(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; CreateServerA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeServer(___server) \
      LP1NR(0x2a, DisposeServer , APTR, ___server, a0,\
      , AML_BASE_NAME)

#define SetServerAttrsA(___server, ___tags) \
      LP2(0x30, ULONG, SetServerAttrsA , APTR, ___server, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetServerAttrs(___server, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetServerAttrsA((___server), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetServerAttrsA(___server, ___tags) \
      LP2(0x36, ULONG, GetServerAttrsA , APTR, ___server, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetServerAttrs(___server, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetServerAttrsA((___server), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetServerHeaders(___server, ___flags) \
      LP2(0x3c, ULONG, GetServerHeaders , APTR, ___server, a0, ULONG, ___flags, d0,\
      , AML_BASE_NAME)

#define GetServerArticles(___server, ___folder, ___hook, ___flags) \
      LP4(0x42, LONG, GetServerArticles , APTR, ___server, a0, APTR, ___folder, a1, struct Hook *, ___hook, a2, ULONG, ___flags, d0,\
      , AML_BASE_NAME)

#define CreateFolderA(___server, ___tags) \
      LP2(0x48, APTR, CreateFolderA , APTR, ___server, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateFolder(___server, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; CreateFolderA((___server), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeFolder(___folder) \
      LP1(0x4e, BOOL, DisposeFolder , APTR, ___folder, a0,\
      , AML_BASE_NAME)

#define OpenFolderA(___server, ___tags) \
      LP2(0x54, APTR, OpenFolderA , APTR, ___server, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenFolder(___server, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; OpenFolderA((___server), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SaveFolder(___folder) \
      LP1(0x5a, BOOL, SaveFolder , APTR, ___folder, a0,\
      , AML_BASE_NAME)

#define RemFolder(___folder) \
      LP1(0x60, BOOL, RemFolder , APTR, ___folder, a0,\
      , AML_BASE_NAME)

#define SetFolderAttrsA(___folder, ___tags) \
      LP2(0x66, ULONG, SetFolderAttrsA , APTR, ___folder, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetFolderAttrs(___folder, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetFolderAttrsA((___folder), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetFolderAttrsA(___folder, ___tags) \
      LP2(0x6c, ULONG, GetFolderAttrsA , APTR, ___folder, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetFolderAttrs(___folder, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetFolderAttrsA((___folder), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AddFolderArticle(___folder, ___type, ___data) \
      LP3(0x72, BOOL, AddFolderArticle , APTR, ___folder, a0, ULONG, ___type, d0, APTR, ___data, a1,\
      , AML_BASE_NAME)

#define RemFolderArticle(___folder, ___article) \
      LP2(0x78, BOOL, RemFolderArticle , APTR, ___folder, a0, APTR, ___article, a1,\
      , AML_BASE_NAME)

#define ReadFolderSpool(___folder, ___importfile, ___flags) \
      LP3(0x7e, ULONG, ReadFolderSpool , APTR, ___folder, a0, STRPTR, ___importfile, a1, ULONG, ___flags, d0,\
      , AML_BASE_NAME)

#define WriteFolderSpool(___folder, ___exportfile, ___flags) \
      LP3(0x84, ULONG, WriteFolderSpool , APTR, ___folder, a0, STRPTR, ___exportfile, a1, ULONG, ___flags, d0,\
      , AML_BASE_NAME)

#define ScanFolderIndex(___folder, ___hook, ___flags) \
      LP3(0x8a, ULONG, ScanFolderIndex , APTR, ___folder, a0, struct Hook *, ___hook, a1, ULONG, ___flags, d0,\
      , AML_BASE_NAME)

#define ExpungeFolder(___folder, ___trash, ___hook) \
      LP3(0x90, BOOL, ExpungeFolder , APTR, ___folder, a0, APTR, ___trash, a1, struct Hook *, ___hook, a2,\
      , AML_BASE_NAME)

#define CreateFolderIndex(___folder) \
      LP1(0x96, ULONG, CreateFolderIndex , APTR, ___folder, a0,\
      , AML_BASE_NAME)

#define SortFolderIndex(___folder, ___field) \
      LP2(0x9c, ULONG, SortFolderIndex , APTR, ___folder, a0, ULONG, ___field, d0,\
      , AML_BASE_NAME)

#define CreateArticleA(___folder, ___tags) \
      LP2(0xa2, APTR, CreateArticleA , APTR, ___folder, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateArticle(___folder, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; CreateArticleA((___folder), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeArticle(___article) \
      LP1(0xa8, BOOL, DisposeArticle , APTR, ___article, a0,\
      , AML_BASE_NAME)

#define OpenArticle(___server, ___folder, ___MsgID, ___Flags) \
      LP4(0xae, APTR, OpenArticle , APTR, ___server, a0, APTR, ___folder, a1, ULONG, ___MsgID, d0, ULONG, ___Flags, d1,\
      , AML_BASE_NAME)

#define CopyArticle(___folder, ___article) \
      LP2(0xb4, BOOL, CopyArticle , APTR, ___folder, a0, APTR, ___article, a1,\
      , AML_BASE_NAME)

#define SetArticleAttrsA(___article, ___tags) \
      LP2(0xba, ULONG, SetArticleAttrsA , APTR, ___article, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetArticleAttrs(___article, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetArticleAttrsA((___article), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetArticleAttrsA(___article, ___tags) \
      LP2(0xc0, ULONG, GetArticleAttrsA , APTR, ___article, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetArticleAttrs(___article, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetArticleAttrsA((___article), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SendArticle(___server, ___article, ___from_file) \
      LP3(0xc6, BOOL, SendArticle , APTR, ___server, a0, APTR, ___article, a1, UBYTE *, ___from_file, a2,\
      , AML_BASE_NAME)

#define AddArticlePartA(___article, ___part, ___tags) \
      LP3(0xcc, BOOL, AddArticlePartA , APTR, ___article, a0, APTR, ___part, a1, struct TagItem *, ___tags, a2,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AddArticlePart(___article, ___part, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; AddArticlePartA((___article), (___part), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RemArticlePart(___article, ___part) \
      LP2NR(0xd2, RemArticlePart , APTR, ___article, a0, APTR, ___part, d0,\
      , AML_BASE_NAME)

#define GetArticlePart(___article, ___partnum) \
      LP2(0xd8, APTR, GetArticlePart , APTR, ___article, a0, ULONG, ___partnum, d0,\
      , AML_BASE_NAME)

#define GetArticlePartAttrsA(___part, ___tags) \
      LP2(0xde, ULONG, GetArticlePartAttrsA , APTR, ___part, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetArticlePartAttrs(___part, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetArticlePartAttrsA((___part), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetArticlePartAttrsA(___part, ___tags) \
      LP2(0xe4, ULONG, SetArticlePartAttrsA , APTR, ___part, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetArticlePartAttrs(___part, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetArticlePartAttrsA((___part), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define CreateArticlePartA(___article, ___tags) \
      LP2(0xea, APTR, CreateArticlePartA , APTR, ___article, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateArticlePart(___article, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; CreateArticlePartA((___article), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeArticlePart(___part) \
      LP1NR(0xf0, DisposeArticlePart , APTR, ___part, a0,\
      , AML_BASE_NAME)

#define GetArticlePartDataA(___article, ___part, ___tags) \
      LP3(0xf6, BOOL, GetArticlePartDataA , APTR, ___article, a0, APTR, ___part, a1, struct TagItem *, ___tags, a2,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetArticlePartData(___article, ___part, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetArticlePartDataA((___article), (___part), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetArticlePartDataA(___part, ___tags) \
      LP2(0xfc, BOOL, SetArticlePartDataA , APTR, ___part, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetArticlePartData(___part, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetArticlePartDataA((___part), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define CreateAddressEntryA(___tags) \
      LP1(0x102, APTR, CreateAddressEntryA , struct TagItem *, ___tags, a0,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateAddressEntry(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; CreateAddressEntryA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeAddressEntry(___addr) \
      LP1(0x108, BOOL, DisposeAddressEntry , APTR, ___addr, a0,\
      , AML_BASE_NAME)

#define OpenAddressEntry(___server, ___fileid) \
      LP2(0x10e, APTR, OpenAddressEntry , APTR, ___server, a0, ULONG, ___fileid, d0,\
      , AML_BASE_NAME)

#define SaveAddressEntry(___server, ___addr) \
      LP2(0x114, LONG, SaveAddressEntry , APTR, ___server, a0, APTR, ___addr, a1,\
      , AML_BASE_NAME)

#define RemAddressEntry(___server, ___addr) \
      LP2(0x11a, BOOL, RemAddressEntry , APTR, ___server, a0, APTR, ___addr, a1,\
      , AML_BASE_NAME)

#define GetAddressEntryAttrsA(___addr, ___tags) \
      LP2(0x120, ULONG, GetAddressEntryAttrsA , APTR, ___addr, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetAddressEntryAttrs(___addr, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetAddressEntryAttrsA((___addr), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetAddressEntryAttrsA(___addr, ___tags) \
      LP2(0x126, ULONG, SetAddressEntryAttrsA , APTR, ___addr, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetAddressEntryAttrs(___addr, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetAddressEntryAttrsA((___addr), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define MatchAddressA(___addr, ___tags) \
      LP2(0x12c, BOOL, MatchAddressA , APTR, ___addr, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define MatchAddress(___addr, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; MatchAddressA((___addr), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FindAddressEntryA(___server, ___tags) \
      LP2(0x132, APTR, FindAddressEntryA , APTR, ___server, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define FindAddressEntry(___server, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; FindAddressEntryA((___server), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define HuntAddressEntryA(___server, ___tags) \
      LP2(0x138, APTR, HuntAddressEntryA , APTR, ___server, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define HuntAddressEntry(___server, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; HuntAddressEntryA((___server), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ScanAddressIndex(___server, ___hook, ___type, ___flags) \
      LP4(0x13e, ULONG, ScanAddressIndex , APTR, ___server, a0, struct Hook *, ___hook, a1, ULONG, ___type, d0, ULONG, ___flags, d1,\
      , AML_BASE_NAME)

#define AddCustomField(___addr, ___field, ___data) \
      LP3(0x144, BOOL, AddCustomField , APTR, ___addr, a0, STRPTR, ___field, a1, STRPTR, ___data, a2,\
      , AML_BASE_NAME)

#define RemCustomField(___addr, ___field) \
      LP2(0x14a, BOOL, RemCustomField , APTR, ___addr, a0, STRPTR, ___field, a1,\
      , AML_BASE_NAME)

#define GetCustomFieldData(___addr, ___field) \
      LP2(0x150, STRPTR, GetCustomFieldData , APTR, ___addr, a0, STRPTR, ___field, a1,\
      , AML_BASE_NAME)

#define CreateDecoderA(___tags) \
      LP1(0x156, APTR, CreateDecoderA , struct TagItem *, ___tags, a0,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CreateDecoder(___tags, ...) \
    ({_sfdc_vararg _tags[] = { ___tags, __VA_ARGS__ }; CreateDecoderA((struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeDecoder(___dec) \
      LP1NR(0x15c, DisposeDecoder , APTR, ___dec, a0,\
      , AML_BASE_NAME)

#define GetDecoderAttrsA(___dec, ___tags) \
      LP2(0x162, ULONG, GetDecoderAttrsA , APTR, ___dec, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetDecoderAttrs(___dec, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetDecoderAttrsA((___dec), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define SetDecoderAttrsA(___dec, ___tags) \
      LP2(0x168, ULONG, SetDecoderAttrsA , APTR, ___dec, a0, struct TagItem *, ___tags, a1,\
      , AML_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetDecoderAttrs(___dec, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetDecoderAttrsA((___dec), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define Decode(___dec, ___type) \
      LP2(0x16e, LONG, Decode , APTR, ___dec, a0, ULONG, ___type, d0,\
      , AML_BASE_NAME)

#define Encode(___dec, ___type) \
      LP2(0x174, LONG, Encode , APTR, ___dec, a0, ULONG, ___type, d0,\
      , AML_BASE_NAME)

#endif /* !_INLINE_AML_H */
