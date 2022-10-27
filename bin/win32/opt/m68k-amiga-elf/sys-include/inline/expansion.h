/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_EXPANSION_H
#define _INLINE_EXPANSION_H

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

#ifndef EXPANSION_BASE_NAME
#define EXPANSION_BASE_NAME ExpansionBase
#endif /* !EXPANSION_BASE_NAME */

#define AddConfigDev(___configDev) \
      LP1NR(0x1e, AddConfigDev , struct ConfigDev *, ___configDev, a0,\
      , EXPANSION_BASE_NAME)

#define AddBootNode(___bootPri, ___flags, ___deviceNode, ___configDev) \
      LP4(0x24, BOOL, AddBootNode , LONG, ___bootPri, d0, ULONG, ___flags, d1, struct DeviceNode *, ___deviceNode, a0, struct ConfigDev *, ___configDev, a1,\
      , EXPANSION_BASE_NAME)

#define AllocBoardMem(___slotSpec) \
      LP1NR(0x2a, AllocBoardMem , ULONG, ___slotSpec, d0,\
      , EXPANSION_BASE_NAME)

#define AllocConfigDev() \
      LP0(0x30, struct ConfigDev *, AllocConfigDev ,\
      , EXPANSION_BASE_NAME)

#define AllocExpansionMem(___numSlots, ___slotAlign) \
      LP2(0x36, APTR, AllocExpansionMem , ULONG, ___numSlots, d0, ULONG, ___slotAlign, d1,\
      , EXPANSION_BASE_NAME)

#define ConfigBoard(___board, ___configDev) \
      LP2NR(0x3c, ConfigBoard , APTR, ___board, a0, struct ConfigDev *, ___configDev, a1,\
      , EXPANSION_BASE_NAME)

#define ConfigChain(___baseAddr) \
      LP1NR(0x42, ConfigChain , APTR, ___baseAddr, a0,\
      , EXPANSION_BASE_NAME)

#define FindConfigDev(___oldConfigDev, ___manufacturer, ___product) \
      LP3(0x48, struct ConfigDev *, FindConfigDev , const struct ConfigDev *, ___oldConfigDev, a0, LONG, ___manufacturer, d0, LONG, ___product, d1,\
      , EXPANSION_BASE_NAME)

#define FreeBoardMem(___startSlot, ___slotSpec) \
      LP2NR(0x4e, FreeBoardMem , ULONG, ___startSlot, d0, ULONG, ___slotSpec, d1,\
      , EXPANSION_BASE_NAME)

#define FreeConfigDev(___configDev) \
      LP1NR(0x54, FreeConfigDev , struct ConfigDev *, ___configDev, a0,\
      , EXPANSION_BASE_NAME)

#define FreeExpansionMem(___startSlot, ___numSlots) \
      LP2NR(0x5a, FreeExpansionMem , ULONG, ___startSlot, d0, ULONG, ___numSlots, d1,\
      , EXPANSION_BASE_NAME)

#define ReadExpansionByte(___board, ___offset) \
      LP2(0x60, UBYTE, ReadExpansionByte , const APTR, ___board, a0, ULONG, ___offset, d0,\
      , EXPANSION_BASE_NAME)

#define ReadExpansionRom(___board, ___configDev) \
      LP2NR(0x66, ReadExpansionRom , const APTR, ___board, a0, struct ConfigDev *, ___configDev, a1,\
      , EXPANSION_BASE_NAME)

#define RemConfigDev(___configDev) \
      LP1NR(0x6c, RemConfigDev , struct ConfigDev *, ___configDev, a0,\
      , EXPANSION_BASE_NAME)

#define WriteExpansionByte(___board, ___offset, ___byte) \
      LP3NR(0x72, WriteExpansionByte , APTR, ___board, a0, ULONG, ___offset, d0, UBYTE, ___byte, d1,\
      , EXPANSION_BASE_NAME)

#define ObtainConfigBinding() \
      LP0NR(0x78, ObtainConfigBinding ,\
      , EXPANSION_BASE_NAME)

#define ReleaseConfigBinding() \
      LP0NR(0x7e, ReleaseConfigBinding ,\
      , EXPANSION_BASE_NAME)

#define SetCurrentBinding(___currentBinding, ___bindingSize) \
      LP2NR(0x84, SetCurrentBinding , struct CurrentBinding *, ___currentBinding, a0, ULONG, ___bindingSize, d0,\
      , EXPANSION_BASE_NAME)

#define GetCurrentBinding(___currentBinding, ___bindingSize) \
      LP2(0x8a, ULONG, GetCurrentBinding , const struct CurrentBinding *, ___currentBinding, a0, ULONG, ___bindingSize, d0,\
      , EXPANSION_BASE_NAME)

#define MakeDosNode(___parmPacket) \
      LP1(0x90, struct DeviceNode *, MakeDosNode , const APTR, ___parmPacket, a0,\
      , EXPANSION_BASE_NAME)

#define AddDosNode(___bootPri, ___flags, ___deviceNode) \
      LP3(0x96, BOOL, AddDosNode , LONG, ___bootPri, d0, ULONG, ___flags, d1, struct DeviceNode *, ___deviceNode, a0,\
      , EXPANSION_BASE_NAME)

#endif /* !_INLINE_EXPANSION_H */
