/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef _INLINE_TRACKFILE_H
#define _INLINE_TRACKFILE_H

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

#ifndef TRACKFILE_BASE_NAME
#define TRACKFILE_BASE_NAME TrackFileBase
#endif /* !TRACKFILE_BASE_NAME */

#define TFStartUnitTagList(___which_unit, ___tags) \
      LP2(0x2a, LONG, TFStartUnitTagList , LONG, ___which_unit, d0, CONST struct TagItem *, ___tags, a0,\
      , TRACKFILE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define TFStartUnitTags(___which_unit, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; TFStartUnitTagList((___which_unit), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define TFStopUnitTagList(___which_unit, ___tags) \
      LP2(0x30, LONG, TFStopUnitTagList , LONG, ___which_unit, d0, CONST struct TagItem *, ___tags, a0,\
      , TRACKFILE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define TFStopUnitTags(___which_unit, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; TFStopUnitTagList((___which_unit), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define TFInsertMediaTagList(___which_unit, ___tags) \
      LP2(0x36, LONG, TFInsertMediaTagList , LONG, ___which_unit, d0, CONST struct TagItem *, ___tags, a0,\
      , TRACKFILE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define TFInsertMediaTags(___which_unit, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; TFInsertMediaTagList((___which_unit), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define TFEjectMediaTagList(___which_unit, ___tags) \
      LP2(0x3c, LONG, TFEjectMediaTagList , LONG, ___which_unit, d0, CONST struct TagItem *, ___tags, a0,\
      , TRACKFILE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define TFEjectMediaTags(___which_unit, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; TFEjectMediaTagList((___which_unit), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define TFGetUnitData(___which_unit) \
      LP1(0x42, struct TrackFileUnitData *, TFGetUnitData , LONG, ___which_unit, d0,\
      , TRACKFILE_BASE_NAME)

#define TFFreeUnitData(___tfud) \
      LP1NR(0x48, TFFreeUnitData , struct TrackFileUnitData *, ___tfud, a0,\
      , TRACKFILE_BASE_NAME)

#define TFChangeUnitTagList(___which_unit, ___tags) \
      LP2(0x4e, LONG, TFChangeUnitTagList , LONG, ___which_unit, d0, CONST struct TagItem *, ___tags, a0,\
      , TRACKFILE_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define TFChangeUnitTags(___which_unit, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; TFChangeUnitTagList((___which_unit), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define TFExamineFileSize(___file_size) \
      LP1(0x54, LONG, TFExamineFileSize , LONG, ___file_size, d0,\
      , TRACKFILE_BASE_NAME)

#endif /* !_INLINE_TRACKFILE_H */
