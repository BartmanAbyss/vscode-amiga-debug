/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_AMIGAGUIDE_PROTOS_H
#define CLIB_AMIGAGUIDE_PROTOS_H

/*
**   $VER: amigaguide_protos.h $VER: amigaguide_lib.sfd 47.1 (30.11.2021) $VER: amigaguide_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <dos/dos.h>
#include <libraries/amigaguide.h>
#include <utility/tagitem.h>
#include <utility/hooks.h>
#include <rexx/storage.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V40 or higher ---*/

/* Public entries */

LONG LockAmigaGuideBase(APTR handle);
VOID UnlockAmigaGuideBase(LONG key);
APTR OpenAmigaGuideA(struct NewAmigaGuide *nag, CONST struct TagItem *attrs);
APTR OpenAmigaGuide(struct NewAmigaGuide *nag, Tag _tag1, ...);
APTR OpenAmigaGuideAsyncA(struct NewAmigaGuide *nag, CONST struct TagItem *attrs);
APTR OpenAmigaGuideAsync(struct NewAmigaGuide *nag, Tag _tag1, ...);
VOID CloseAmigaGuide(APTR cl);
ULONG AmigaGuideSignal(APTR cl);
struct AmigaGuideMsg *GetAmigaGuideMsg(APTR cl);
VOID ReplyAmigaGuideMsg(struct AmigaGuideMsg *amsg);
LONG SetAmigaGuideContextA(APTR cl, ULONG id, CONST struct TagItem *attrs);
LONG SetAmigaGuideContext(APTR cl, ULONG id, Tag _tag1, ...);
LONG SendAmigaGuideContextA(APTR cl, CONST struct TagItem *attrs);
LONG SendAmigaGuideContext(APTR cl, Tag _tag1, ...);
LONG SendAmigaGuideCmdA(APTR cl, STRPTR cmd, CONST struct TagItem *attrs);
LONG SendAmigaGuideCmd(APTR cl, CONST_STRPTR cmd, Tag _tag1, ...);
LONG SetAmigaGuideAttrsA(APTR cl, CONST struct TagItem *attrs);
LONG SetAmigaGuideAttrs(APTR cl, Tag _tag1, ...);
LONG GetAmigaGuideAttr(Tag tag1, APTR cl, ULONG *storage);
LONG LoadXRef(BPTR lock, STRPTR name);
VOID ExpungeXRef(void);
APTR AddAmigaGuideHostA(struct Hook *h, CONST_STRPTR name, CONST struct TagItem *attrs);
APTR AddAmigaGuideHost(struct Hook *h, CONST_STRPTR name, Tag _tag1, ...);
LONG RemoveAmigaGuideHostA(APTR hh, CONST struct TagItem *attrs);
LONG RemoveAmigaGuideHost(APTR hh, Tag _tag1, ...);
STRPTR GetAmigaGuideString(LONG id);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_AMIGAGUIDE_PROTOS_H */
