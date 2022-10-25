/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_ASL_H
#define _INLINE_ASL_H

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

#ifndef ASL_BASE_NAME
#define ASL_BASE_NAME AslBase
#endif /* !ASL_BASE_NAME */

#define AllocFileRequest() \
      LP0(0x1e, struct FileRequester *, AllocFileRequest ,\
      , ASL_BASE_NAME)

#define FreeFileRequest(___fileReq) \
      LP1NR(0x24, FreeFileRequest , struct FileRequester *, ___fileReq, a0,\
      , ASL_BASE_NAME)

#define RequestFile(___fileReq) \
      LP1(0x2a, BOOL, RequestFile , struct FileRequester *, ___fileReq, a0,\
      , ASL_BASE_NAME)

#define AllocAslRequest(___reqType, ___tagList) \
      LP2(0x30, APTR, AllocAslRequest , ULONG, ___reqType, d0, struct TagItem *, ___tagList, a0,\
      , ASL_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AllocAslRequestTags(___reqType, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; AllocAslRequest((___reqType), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define FreeAslRequest(___requester) \
      LP1NR(0x36, FreeAslRequest , APTR, ___requester, a0,\
      , ASL_BASE_NAME)

#define AslRequest(___requester, ___tagList) \
      LP2(0x3c, BOOL, AslRequest , APTR, ___requester, a0, struct TagItem *, ___tagList, a1,\
      , ASL_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AslRequestTags(___requester, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; AslRequest((___requester), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AbortAslRequest(___requester) \
      LP1NR(0x4e, AbortAslRequest , APTR, ___requester, a0,\
      , ASL_BASE_NAME)

#define ActivateAslRequest(___requester) \
      LP1NR(0x54, ActivateAslRequest , APTR, ___requester, a0,\
      , ASL_BASE_NAME)

#endif /* !_INLINE_ASL_H */
