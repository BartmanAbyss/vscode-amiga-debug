/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef _INLINE_DATATYPES_H
#define _INLINE_DATATYPES_H

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

#ifndef DATATYPES_BASE_NAME
#define DATATYPES_BASE_NAME DataTypesBase
#endif /* !DATATYPES_BASE_NAME */

#define ObtainDataTypeA(___type, ___handle, ___attrs) \
      LP3(0x24, struct DataType, *ObtainDataTypeA , ULONG, ___type, d0, APTR, ___handle, a0, CONST struct TagItem *, ___attrs, a1,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ObtainDataType(___type, ___handle, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; *ObtainDataTypeA((___type), (___handle), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define ReleaseDataType(___dt) \
      LP1NR(0x2a, ReleaseDataType , struct DataType *, ___dt, a0,\
      , DATATYPES_BASE_NAME)

#define NewDTObjectA(___name, ___attrs) \
      LP2(0x30, Object, *NewDTObjectA , CONST_STRPTR, ___name, d0, CONST struct TagItem *, ___attrs, a0,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define NewDTObject(___name, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; *NewDTObjectA((___name), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeDTObject(___o) \
      LP1NR(0x36, DisposeDTObject , Object *, ___o, a0,\
      , DATATYPES_BASE_NAME)

#define SetDTAttrsA(___o, ___win, ___req, ___attrs) \
      LP4(0x3c, ULONG, SetDTAttrsA , Object *, ___o, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, CONST struct TagItem *, ___attrs, a3,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetDTAttrs(___o, ___win, ___req, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SetDTAttrsA((___o), (___win), (___req), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetDTAttrsA(___o, ___attrs) \
      LP2(0x42, ULONG, GetDTAttrsA , Object *, ___o, a0, CONST struct TagItem *, ___attrs, a2,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define GetDTAttrs(___o, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; GetDTAttrsA((___o), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AddDTObject(___win, ___req, ___o, ___pos) \
      LP4(0x48, LONG, AddDTObject , struct Window *, ___win, a0, struct Requester *, ___req, a1, Object *, ___o, a2, LONG, ___pos, d0,\
      , DATATYPES_BASE_NAME)

#define RefreshDTObjectA(___o, ___win, ___req, ___attrs) \
      LP4NR(0x4e, RefreshDTObjectA , Object *, ___o, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, CONST struct TagItem *, ___attrs, a3,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define RefreshDTObjects(___o, ___win, ___req, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; RefreshDTObjectA((___o), (___win), (___req), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#ifndef NO_INLINE_STDARG
#define RefreshDTObject(___o, ___win, ___req, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; RefreshDTObjectA((___o), (___win), (___req), (CONST struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DoAsyncLayout(___o, ___gpl) \
      LP2(0x54, ULONG, DoAsyncLayout , Object *, ___o, a0, struct gpLayout *, ___gpl, a1,\
      , DATATYPES_BASE_NAME)

#define DoDTMethodA(___o, ___win, ___req, ___msg) \
      LP4(0x5a, ULONG, DoDTMethodA , Object *, ___o, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, Msg, ___msg, a3,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define DoDTMethod(___o, ___win, ___req, ___data, ...) \
    ({_sfdc_vararg _message[] = { ___data, __VA_ARGS__ }; DoDTMethodA((___o), (___win), (___req), (Msg) _message); })
#endif /* !NO_INLINE_VARARGS */

#define RemoveDTObject(___win, ___o) \
      LP2(0x60, LONG, RemoveDTObject , struct Window *, ___win, a0, Object *, ___o, a1,\
      , DATATYPES_BASE_NAME)

#define GetDTMethods(___object) \
      LP1(0x66, ULONG, *GetDTMethods , CONST Object *, ___object, a0,\
      , DATATYPES_BASE_NAME)

#define GetDTTriggerMethods(___object) \
      LP1(0x6c, struct DTMethods, *GetDTTriggerMethods , Object *, ___object, a0,\
      , DATATYPES_BASE_NAME)

#define PrintDTObjectA(___o, ___w, ___r, ___msg) \
      LP4(0x72, ULONG, PrintDTObjectA , Object *, ___o, a0, struct Window *, ___w, a1, struct Requester *, ___r, a2, struct dtPrint *, ___msg, a3,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define PrintDTObject(___o, ___w, ___r, ___data, ...) \
    ({_sfdc_vararg _message[] = { ___data, __VA_ARGS__ }; PrintDTObjectA((___o), (___w), (___r), (struct dtPrint *) _message); })
#endif /* !NO_INLINE_VARARGS */

#define GetDTString(___id) \
      LP1(0x8a, STRPTR, GetDTString , ULONG, ___id, d0,\
      , DATATYPES_BASE_NAME)

#define FindMethod(___methods, ___searchmethodid) \
      LP2(0x102, ULONG, *FindMethod , CONST ULONG *, ___methods, a0, ULONG, ___searchmethodid, a1,\
      , DATATYPES_BASE_NAME)

#define FindTriggerMethod(___dtm, ___command, ___method) \
      LP3(0x108, struct DTMethod, *FindTriggerMethod , CONST struct DTMethod *, ___dtm, a0, CONST_STRPTR, ___command, a1, ULONG, ___method, d0,\
      , DATATYPES_BASE_NAME)

#define CopyDTMethods(___methods, ___include, ___exclude) \
      LP3(0x10e, ULONG, *CopyDTMethods , CONST ULONG *, ___methods, a0, CONST ULONG *, ___include, a1, CONST ULONG *, ___exclude, a2,\
      , DATATYPES_BASE_NAME)

#define CopyDTTriggerMethods(___methods, ___include, ___exclude) \
      LP3(0x114, struct DTMethod, *CopyDTTriggerMethods , CONST struct DTMethod *, ___methods, a0, CONST struct DTMethod *, ___include, a1, CONST struct DTMethod *, ___exclude, a2,\
      , DATATYPES_BASE_NAME)

#define FreeDTMethods(___methods) \
      LP1NR(0x11a, *FreeDTMethods , APTR, ___methods, a0,\
      , DATATYPES_BASE_NAME)

#define GetDTTriggerMethodDataFlags(___triggermethod) \
      LP1(0x120, ULONG, GetDTTriggerMethodDataFlags , ULONG, ___triggermethod, d0,\
      , DATATYPES_BASE_NAME)

#define SaveDTObjectA(___o, ___win, ___req, ___file, ___mode, ___saveicon, ___attrs) \
      LP7A4(0x126, ULONG, SaveDTObjectA , Object *, ___o, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, CONST_STRPTR, ___file, a3, ULONG, ___mode, d0, LONG, ___saveicon, d1, struct TagItem *, ___attrs, d7,\
      , DATATYPES_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SaveDTObject(___o, ___win, ___req, ___file, ___mode, ___saveicon, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; SaveDTObjectA((___o), (___win), (___req), (___file), (___mode), (___saveicon), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define StartDragSelect(___o) \
      LP1(0x12c, ULONG, StartDragSelect , Object *, ___o, a0,\
      , DATATYPES_BASE_NAME)

#endif /* !_INLINE_DATATYPES_H */
