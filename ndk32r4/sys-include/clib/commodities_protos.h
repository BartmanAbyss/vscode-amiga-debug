/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_COMMODITIES_PROTOS_H
#define CLIB_COMMODITIES_PROTOS_H

/*
**   $VER: commodities_protos.h $VER: commodities_lib.sfd 47.1 (30.11.2021) $VER: commodities_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <exec/nodes.h>
#include <libraries/commodities.h>
#include <devices/inputevent.h>
#include <devices/keymap.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V36 or higher ---*/

/* "commodities.library" */
/*
  OBJECT UTILITIES
*/

CxObj *CreateCxObj(ULONG type, LONG arg1, LONG arg2);
CxObj *CxBroker(CONST struct NewBroker *nb, LONG *error);
LONG ActivateCxObj(CxObj *co, LONG flag);
VOID DeleteCxObj(CxObj *co);
VOID DeleteCxObjAll(CxObj *co);
ULONG CxObjType(CONST CxObj *co);
LONG CxObjError(CONST CxObj *co);
VOID ClearCxObjError(CxObj *co);
LONG SetCxObjPri(CxObj *co, LONG pri);

/*  OBJECT ATTACHMENT */

VOID AttachCxObj(CxObj *headObj, CxObj *co);
VOID EnqueueCxObj(CxObj *headObj, CxObj *co);
VOID InsertCxObj(CxObj *headObj, CxObj *co, CxObj *pred);
VOID RemoveCxObj(CxObj *co);
VOID SetTranslate(CxObj *translator, struct InputEvent *events);
VOID SetFilter(CxObj *filter, CONST_STRPTR text);
VOID SetFilterIX(CxObj *filter, CONST IX *ix);
LONG ParseIX(CONST_STRPTR description, IX *ix);

/*  COMMON MESSAGE */

ULONG CxMsgType(CONST CxMsg *cxm);
APTR CxMsgData(CONST CxMsg *cxm);
LONG CxMsgID(CONST CxMsg *cxm);

/*  MESSAGE ROUTING */

VOID DivertCxMsg(CxMsg *cxm, CxObj *headObj, CxObj *returnObj);
VOID RouteCxMsg(CxMsg *cxm, CxObj *co);
VOID DisposeCxMsg(CxMsg *cxm);

/*  INPUT EVENT HANDLING */

BOOL InvertKeyMap(ULONG ansiCode, struct InputEvent *event, CONST struct KeyMap *km);
VOID AddIEvents(struct InputEvent *events);

/*--- functions in V38 or higher ---*/

/*  MORE INPUT EVENT HANDLING */
BOOL MatchIX(CONST struct InputEvent *event, CONST IX *ix);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_COMMODITIES_PROTOS_H */
