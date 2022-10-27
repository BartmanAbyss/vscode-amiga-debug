/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_COMMODITIES_H
#define _INLINE_COMMODITIES_H

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

#ifndef COMMODITIES_BASE_NAME
#define COMMODITIES_BASE_NAME CxBase
#endif /* !COMMODITIES_BASE_NAME */

#define CreateCxObj(___type, ___arg1, ___arg2) \
      LP3(0x1e, CxObj *, CreateCxObj , ULONG, ___type, d0, LONG, ___arg1, a0, LONG, ___arg2, a1,\
      , COMMODITIES_BASE_NAME)

#define CxBroker(___nb, ___error) \
      LP2(0x24, CxObj *, CxBroker , const struct NewBroker *, ___nb, a0, LONG *, ___error, d0,\
      , COMMODITIES_BASE_NAME)

#define ActivateCxObj(___co, ___doIt) \
      LP2(0x2a, LONG, ActivateCxObj , CxObj *, ___co, a0, LONG, ___doIt, d0,\
      , COMMODITIES_BASE_NAME)

#define DeleteCxObj(___co) \
      LP1NR(0x30, DeleteCxObj , CxObj *, ___co, a0,\
      , COMMODITIES_BASE_NAME)

#define DeleteCxObjAll(___co) \
      LP1NR(0x36, DeleteCxObjAll , CxObj *, ___co, a0,\
      , COMMODITIES_BASE_NAME)

#define CxObjType(___co) \
      LP1(0x3c, ULONG, CxObjType , const CxObj *, ___co, a0,\
      , COMMODITIES_BASE_NAME)

#define CxObjError(___co) \
      LP1(0x42, LONG, CxObjError , const CxObj *, ___co, a0,\
      , COMMODITIES_BASE_NAME)

#define ClearCxObjError(___co) \
      LP1NR(0x48, ClearCxObjError , CxObj *, ___co, a0,\
      , COMMODITIES_BASE_NAME)

#define SetCxObjPri(___co, ___pri) \
      LP2(0x4e, LONG, SetCxObjPri , CxObj *, ___co, a0, LONG, ___pri, d0,\
      , COMMODITIES_BASE_NAME)

#define AttachCxObj(___headObj, ___co) \
      LP2NR(0x54, AttachCxObj , CxObj *, ___headObj, a0, CxObj *, ___co, a1,\
      , COMMODITIES_BASE_NAME)

#define EnqueueCxObj(___headObj, ___co) \
      LP2NR(0x5a, EnqueueCxObj , CxObj *, ___headObj, a0, CxObj *, ___co, a1,\
      , COMMODITIES_BASE_NAME)

#define InsertCxObj(___headObj, ___co, ___pred) \
      LP3NR(0x60, InsertCxObj , CxObj *, ___headObj, a0, CxObj *, ___co, a1, CxObj *, ___pred, a2,\
      , COMMODITIES_BASE_NAME)

#define RemoveCxObj(___co) \
      LP1NR(0x66, RemoveCxObj , CxObj *, ___co, a0,\
      , COMMODITIES_BASE_NAME)

#define SetTranslate(___translator, ___events) \
      LP2NR(0x72, SetTranslate , CxObj *, ___translator, a0, struct InputEvent *, ___events, a1,\
      , COMMODITIES_BASE_NAME)

#define SetFilter(___filter, ___text) \
      LP2NR(0x78, SetFilter , CxObj *, ___filter, a0, CONST_STRPTR, ___text, a1,\
      , COMMODITIES_BASE_NAME)

#define SetFilterIX(___filter, ___ix) \
      LP2NR(0x7e, SetFilterIX , CxObj *, ___filter, a0, const IX *, ___ix, a1,\
      , COMMODITIES_BASE_NAME)

#define ParseIX(___description, ___ix) \
      LP2(0x84, LONG, ParseIX , CONST_STRPTR, ___description, a0, IX *, ___ix, a1,\
      , COMMODITIES_BASE_NAME)

#define CxMsgType(___cxm) \
      LP1(0x8a, ULONG, CxMsgType , const CxMsg *, ___cxm, a0,\
      , COMMODITIES_BASE_NAME)

#define CxMsgData(___cxm) \
      LP1(0x90, APTR, CxMsgData , const CxMsg *, ___cxm, a0,\
      , COMMODITIES_BASE_NAME)

#define CxMsgID(___cxm) \
      LP1(0x96, LONG, CxMsgID , const CxMsg *, ___cxm, a0,\
      , COMMODITIES_BASE_NAME)

#define DivertCxMsg(___cxm, ___headObj, ___returnObj) \
      LP3NR(0x9c, DivertCxMsg , CxMsg *, ___cxm, a0, CxObj *, ___headObj, a1, CxObj *, ___returnObj, a2,\
      , COMMODITIES_BASE_NAME)

#define RouteCxMsg(___cxm, ___co) \
      LP2NR(0xa2, RouteCxMsg , CxMsg *, ___cxm, a0, CxObj *, ___co, a1,\
      , COMMODITIES_BASE_NAME)

#define DisposeCxMsg(___cxm) \
      LP1NR(0xa8, DisposeCxMsg , CxMsg *, ___cxm, a0,\
      , COMMODITIES_BASE_NAME)

#define InvertKeyMap(___ansiCode, ___event, ___km) \
      LP3(0xae, BOOL, InvertKeyMap , ULONG, ___ansiCode, d0, struct InputEvent *, ___event, a0, const struct KeyMap *, ___km, a1,\
      , COMMODITIES_BASE_NAME)

#define AddIEvents(___events) \
      LP1NR(0xb4, AddIEvents , struct InputEvent *, ___events, a0,\
      , COMMODITIES_BASE_NAME)

#define MatchIX(___event, ___ix) \
      LP2(0xcc, BOOL, MatchIX , const struct InputEvent *, ___event, a0, const IX *, ___ix, a1,\
      , COMMODITIES_BASE_NAME)

#endif /* !_INLINE_COMMODITIES_H */
