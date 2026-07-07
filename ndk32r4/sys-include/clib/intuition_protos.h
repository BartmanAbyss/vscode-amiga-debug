/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_INTUITION_PROTOS_H
#define CLIB_INTUITION_PROTOS_H

/*
**   $VER: intuition_protos.h $VER: intuition_lib.sfd 47.1 (30.11.2021) $VER: intuition_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <intuition/intuitionbase.h>
#include <intuition/classes.h>
#include <intuition/cghooks.h>
#include <intuition/classusr.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "intuition.library" */
/* Public functions OpenIntuition() and Intuition() are intentionally */
/* not documented. */
VOID OpenIntuition(void);
VOID Intuition(struct InputEvent *iEvent);
UWORD AddGadget(struct Window *window, struct Gadget *gadget, UWORD position);
BOOL ClearDMRequest(struct Window *window);
VOID ClearMenuStrip(struct Window *window);
VOID ClearPointer(struct Window *window);
BOOL CloseScreen(struct Screen *screen);
VOID CloseWindow(struct Window *window);
LONG CloseWorkBench(void);
VOID CurrentTime(ULONG *seconds, ULONG *micros);
BOOL DisplayAlert(ULONG alertNumber, CONST_STRPTR string, UWORD height);
VOID DisplayBeep(struct Screen *screen);
BOOL DoubleClick(ULONG sSeconds, ULONG sMicros, ULONG cSeconds, ULONG cMicros);
VOID DrawBorder(struct RastPort *rp, CONST struct Border *border, WORD leftOffset, WORD topOffset);
VOID DrawImage(struct RastPort *rp, CONST struct Image *image, WORD leftOffset, WORD topOffset);
VOID EndRequest(struct Requester *requester, struct Window *window);
struct Preferences *GetDefPrefs(struct Preferences *preferences, WORD size);
struct Preferences *GetPrefs(struct Preferences *preferences, WORD size);
VOID InitRequester(struct Requester *requester);
struct MenuItem *ItemAddress(CONST struct Menu *menuStrip, UWORD menuNumber);
BOOL ModifyIDCMP(struct Window *window, ULONG flags);
VOID ModifyProp(struct Gadget *gadget, struct Window *window, struct Requester *requester, UWORD flags, UWORD horizPot, UWORD vertPot, UWORD horizBody, UWORD vertBody);
VOID MoveScreen(struct Screen *screen, WORD dx, WORD dy);
VOID MoveWindow(struct Window *window, WORD dx, WORD dy);
VOID OffGadget(struct Gadget *gadget, struct Window *window, struct Requester *requester);
VOID OffMenu(struct Window *window, UWORD menuNumber);
VOID OnGadget(struct Gadget *gadget, struct Window *window, struct Requester *requester);
VOID OnMenu(struct Window *window, UWORD menuNumber);
struct Screen *OpenScreen(CONST struct NewScreen *newScreen);
struct Window *OpenWindow(CONST struct NewWindow *newWindow);
ULONG OpenWorkBench(void);
VOID PrintIText(struct RastPort *rp, CONST struct IntuiText *iText, WORD left, WORD top);
VOID RefreshGadgets(struct Gadget *gadgets, struct Window *window, struct Requester *requester);
UWORD RemoveGadget(struct Window *window, struct Gadget *gadget);

/* The official calling sequence for ReportMouse is given below. */
/* Note the register order.  For the complete story, read the ReportMouse */
/* autodoc. */
VOID ReportMouse(BOOL flag, struct Window *window);
VOID ReportMouse1(struct Window *window, BOOL flag);
BOOL Request(struct Requester *requester, struct Window *window);
VOID ScreenToBack(struct Screen *screen);
VOID ScreenToFront(struct Screen *screen);
BOOL SetDMRequest(struct Window *window, struct Requester *requester);
BOOL SetMenuStrip(struct Window *window, struct Menu *menu);
VOID SetPointer(struct Window *window, UWORD *pointer, WORD height, WORD width, WORD xOffset, WORD yOffset);
VOID SetWindowTitles(struct Window *window, CONST_STRPTR windowTitle, CONST_STRPTR screenTitle);
VOID ShowTitle(struct Screen *screen, BOOL showIt);
VOID SizeWindow(struct Window *window, WORD dx, WORD dy);
struct View *ViewAddress(void);
struct ViewPort *ViewPortAddress(CONST struct Window *window);
VOID WindowToBack(struct Window *window);
VOID WindowToFront(struct Window *window);
BOOL WindowLimits(struct Window *window, LONG widthMin, LONG heightMin, ULONG widthMax, ULONG heightMax);

/*--- start of next generation of names -------------------------------------*/
struct Preferences *SetPrefs(CONST struct Preferences *preferences, LONG size, BOOL inform);

/*--- start of next next generation of names --------------------------------*/
LONG IntuiTextLength(CONST struct IntuiText *iText);
BOOL WBenchToBack(void);
BOOL WBenchToFront(void);

/*--- start of next next next generation of names ---------------------------*/
BOOL AutoRequest(struct Window *window, CONST struct IntuiText *body, CONST struct IntuiText *posText, CONST struct IntuiText *negText, ULONG pFlag, ULONG nFlag, UWORD width, UWORD height);
VOID BeginRefresh(struct Window *window);
struct Window *BuildSysRequest(struct Window *window, CONST struct IntuiText *body, CONST struct IntuiText *posText, CONST struct IntuiText *negText, ULONG flags, UWORD width, UWORD height);
VOID EndRefresh(struct Window *window, LONG complete);
VOID FreeSysRequest(struct Window *window);

/* The return codes for MakeScreen(), RemakeDisplay(), and RethinkDisplay() */
/* are only valid under V39 and greater.  Do not examine them when running */
/* on pre-V39 systems! */
LONG MakeScreen(struct Screen *screen);
LONG RemakeDisplay(void);
LONG RethinkDisplay(void);

/*--- start of next next next next generation of names ----------------------*/
APTR AllocRemember(struct Remember **rememberKey, ULONG size, ULONG flags);

/* Public function AlohaWorkbench() is intentionally not documented */
VOID AlohaWorkbench(LONG wbport);
VOID FreeRemember(struct Remember **rememberKey, BOOL reallyForget);

/*--- start of 15 Nov 85 names ------------------------*/
ULONG LockIBase(ULONG dontknow);
VOID UnlockIBase(ULONG ibLock);

/*--- functions in V33 or higher ---*/
LONG GetScreenData(APTR buffer, UWORD size, UWORD type, CONST struct Screen *screen);
VOID RefreshGList(struct Gadget *gadgets, struct Window *window, struct Requester *requester, WORD numGad);
UWORD AddGList(struct Window *window, struct Gadget *gadget, UWORD position, WORD numGad, struct Requester *requester);
UWORD RemoveGList(struct Window *remPtr, struct Gadget *gadget, WORD numGad);
VOID ActivateWindow(struct Window *window);
VOID RefreshWindowFrame(struct Window *window);
BOOL ActivateGadget(struct Gadget *gadgets, struct Window *window, struct Requester *requester);
VOID NewModifyProp(struct Gadget *gadget, struct Window *window, struct Requester *requester, UWORD flags, UWORD horizPot, UWORD vertPot, UWORD horizBody, UWORD vertBody, WORD numGad);

/*--- functions in V36 or higher ---*/
LONG QueryOverscan(ULONG displayID, struct Rectangle *rect, WORD oScanType);
VOID MoveWindowInFrontOf(struct Window *window, struct Window *behindWindow);
VOID ChangeWindowBox(struct Window *window, WORD left, WORD top, WORD width, WORD height);
struct Hook *SetEditHook(struct Hook *hook);
LONG SetMouseQueue(struct Window *window, UWORD queueLength);
VOID ZipWindow(struct Window *window);

/*--- public screens ---*/
struct Screen *LockPubScreen(CONST_STRPTR name);
VOID UnlockPubScreen(CONST_STRPTR name, struct Screen *screen);
struct List *LockPubScreenList(void);
VOID UnlockPubScreenList(void);
STRPTR NextPubScreen(CONST struct Screen *screen, STRPTR namebuf);
VOID SetDefaultPubScreen(CONST_STRPTR name);
UWORD SetPubScreenModes(UWORD modes);
UWORD PubScreenStatus(struct Screen *screen, UWORD statusFlags);
struct RastPort *ObtainGIRPort(struct GadgetInfo *gInfo);
VOID ReleaseGIRPort(struct RastPort *rp);
VOID GadgetMouse(struct Gadget *gadget, struct GadgetInfo *gInfo, WORD *mousePoint);
VOID GetDefaultPubScreen(STRPTR nameBuffer);
LONG EasyRequestArgs(struct Window *window, CONST struct EasyStruct *easyStruct, ULONG *idcmpPtr, CONST_APTR args);
LONG EasyRequest(struct Window *window, CONST struct EasyStruct *easyStruct, ULONG *idcmpPtr, ...);
struct Window *BuildEasyRequestArgs(struct Window *window, CONST struct EasyStruct *easyStruct, ULONG idcmp, CONST_APTR args);
struct Window *BuildEasyRequest(struct Window *window, CONST struct EasyStruct *easyStruct, ULONG idcmp, ...);
LONG SysReqHandler(struct Window *window, ULONG *idcmpPtr, BOOL waitInput);
struct Window *OpenWindowTagList(CONST struct NewWindow *newWindow, CONST struct TagItem *tagList);
struct Window *OpenWindowTags(CONST struct NewWindow *newWindow, ULONG tag1Type, ...);
struct Screen *OpenScreenTagList(CONST struct NewScreen *newScreen, CONST struct TagItem *tagList);
struct Screen *OpenScreenTags(CONST struct NewScreen *newScreen, ULONG tag1Type, ...);

/*	new Image functions	*/
VOID DrawImageState(struct RastPort *rp, CONST struct Image *image, WORD leftOffset, WORD topOffset, ULONG state, struct DrawInfo *drawInfo);
BOOL PointInImage(ULONG point, CONST struct Image *image);
VOID EraseImage(struct RastPort *rp, CONST struct Image *image, WORD leftOffset, WORD topOffset);
APTR NewObjectA(struct IClass *classPtr, CONST_STRPTR classID, CONST struct TagItem *tagList);
APTR NewObject(struct IClass *classPtr, CONST_STRPTR classID, ULONG tag1, ...);
VOID DisposeObject(APTR object);
ULONG SetAttrsA(APTR object, CONST struct TagItem *tagList);
ULONG SetAttrs(APTR object, ULONG tag1, ...);
ULONG GetAttr(ULONG attrID, APTR object, ULONG *storagePtr);

/* 	special set attribute call for gadgets */
ULONG SetGadgetAttrsA(struct Gadget *gadget, struct Window *window, struct Requester *requester, CONST struct TagItem *tagList);
ULONG SetGadgetAttrs(struct Gadget *gadget, struct Window *window, struct Requester *requester, ULONG tag1, ...);

/*	for class implementors only	*/
APTR NextObject(CONST_APTR objectPtrPtr);
struct IClass *MakeClass(CONST_STRPTR classID, CONST_STRPTR superClassID, CONST struct IClass *superClassPtr, UWORD instanceSize, ULONG flags);
VOID AddClass(struct IClass *classPtr);
struct DrawInfo *GetScreenDrawInfo(struct Screen *screen);
VOID FreeScreenDrawInfo(struct Screen *screen, struct DrawInfo *drawInfo);
BOOL ResetMenuStrip(struct Window *window, struct Menu *menu);
VOID RemoveClass(struct IClass *classPtr);
BOOL FreeClass(struct IClass *classPtr);

/*--- functions in V39 or higher ---*/

/* Six spare vectors */
struct ScreenBuffer *AllocScreenBuffer(struct Screen *sc, struct BitMap *bm, ULONG flags);
VOID FreeScreenBuffer(struct Screen *sc, struct ScreenBuffer *sb);
ULONG ChangeScreenBuffer(struct Screen *sc, struct ScreenBuffer *sb);
VOID ScreenDepth(struct Screen *screen, ULONG flags, APTR reserved);
VOID ScreenPosition(struct Screen *screen, ULONG flags, LONG x1, LONG y1, LONG x2, LONG y2);
VOID ScrollWindowRaster(struct Window *win, WORD dx, WORD dy, WORD xMin, WORD yMin, WORD xMax, WORD yMax);
VOID LendMenus(struct Window *fromwindow, struct Window *towindow);
ULONG DoGadgetMethodA(struct Gadget *gad, struct Window *win, struct Requester *req, Msg message);
ULONG DoGadgetMethod(struct Gadget *gad, struct Window *win, struct Requester *req, ULONG MethodID, ...);
VOID SetWindowPointerA(struct Window *win, CONST struct TagItem *taglist);
VOID SetWindowPointer(struct Window *win, ULONG tag1, ...);
BOOL TimedDisplayAlert(ULONG alertNumber, CONST_STRPTR string, UWORD height, ULONG time);
VOID HelpControl(struct Window *win, ULONG flags);

/*--- functions in V46 or higher ---*/
BOOL ShowWindow(struct Window *window, struct Window *other);
BOOL HideWindow(struct Window *window);

/*--- functions in V47 or higher ---*/
ULONG IntuitionControlA(APTR object, CONST struct TagItem *taglist);
ULONG IntuitionControl(APTR object, Tag _tag1, ...);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_INTUITION_PROTOS_H */
