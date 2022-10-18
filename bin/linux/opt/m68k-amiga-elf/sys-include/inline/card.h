/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_CARD_H
#define _INLINE_CARD_H

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

#ifndef CARD_BASE_NAME
#define CARD_BASE_NAME CardResource
#endif /* !CARD_BASE_NAME */

#define OwnCard(___handle) \
      LP1(0x6, struct CardHandle *, OwnCard , struct CardHandle *, ___handle, a1,\
      , CARD_BASE_NAME)

#define ReleaseCard(___handle, ___flags) \
      LP2NR(0xc, ReleaseCard , struct CardHandle *, ___handle, a1, ULONG, ___flags, d0,\
      , CARD_BASE_NAME)

#define GetCardMap() \
      LP0(0x12, struct CardMemoryMap *, GetCardMap ,\
      , CARD_BASE_NAME)

#define BeginCardAccess(___handle) \
      LP1(0x18, BOOL, BeginCardAccess , struct CardHandle *, ___handle, a1,\
      , CARD_BASE_NAME)

#define EndCardAccess(___handle) \
      LP1(0x1e, BOOL, EndCardAccess , struct CardHandle *, ___handle, a1,\
      , CARD_BASE_NAME)

#define ReadCardStatus() \
      LP0(0x24, UBYTE, ReadCardStatus ,\
      , CARD_BASE_NAME)

#define CardResetRemove(___handle, ___flag) \
      LP2(0x2a, BOOL, CardResetRemove , struct CardHandle *, ___handle, a1, ULONG, ___flag, d0,\
      , CARD_BASE_NAME)

#define CardMiscControl(___handle, ___control_bits) \
      LP2(0x30, UBYTE, CardMiscControl , struct CardHandle *, ___handle, a1, UBYTE, ___control_bits, d1,\
      , CARD_BASE_NAME)

#define CardAccessSpeed(___handle, ___nanoseconds) \
      LP2(0x36, ULONG, CardAccessSpeed , struct CardHandle *, ___handle, a1, ULONG, ___nanoseconds, d0,\
      , CARD_BASE_NAME)

#define CardProgramVoltage(___handle, ___voltage) \
      LP2(0x3c, LONG, CardProgramVoltage , struct CardHandle *, ___handle, a1, ULONG, ___voltage, d0,\
      , CARD_BASE_NAME)

#define CardResetCard(___handle) \
      LP1(0x42, BOOL, CardResetCard , struct CardHandle *, ___handle, a1,\
      , CARD_BASE_NAME)

#define CopyTuple(___handle, ___buffer, ___tuplecode, ___size) \
      LP4(0x48, BOOL, CopyTuple , const struct CardHandle *, ___handle, a1, UBYTE *, ___buffer, a0, ULONG, ___tuplecode, d1, ULONG, ___size, d0,\
      , CARD_BASE_NAME)

#define DeviceTuple(___tuple_data, ___storage) \
      LP2(0x4e, ULONG, DeviceTuple , const UBYTE *, ___tuple_data, a0, struct DeviceTData *, ___storage, a1,\
      , CARD_BASE_NAME)

#define IfAmigaXIP(___handle) \
      LP1(0x54, struct Resident *, IfAmigaXIP , const struct CardHandle *, ___handle, a2,\
      , CARD_BASE_NAME)

#define CardForceChange() \
      LP0(0x5a, BOOL, CardForceChange ,\
      , CARD_BASE_NAME)

#define CardChangeCount() \
      LP0(0x60, ULONG, CardChangeCount ,\
      , CARD_BASE_NAME)

#define CardInterface() \
      LP0(0x66, ULONG, CardInterface ,\
      , CARD_BASE_NAME)

#endif /* !_INLINE_CARD_H */
