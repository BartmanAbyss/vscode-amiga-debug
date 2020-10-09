/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_INTUITION_H
#define _INLINE_INTUITION_H

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

#ifndef INTUITION_BASE_NAME
#define INTUITION_BASE_NAME IntuitionBase
#endif /* !INTUITION_BASE_NAME */

#define OpenIntuition() \
      LP0NR(0x1e, OpenIntuition ,\
      , INTUITION_BASE_NAME)

#define Intuition(___iEvent) \
      LP1NR(0x24, Intuition , struct InputEvent *, ___iEvent, a0,\
      , INTUITION_BASE_NAME)

#define AddGadget(___window, ___gadget, ___position) \
      LP3(0x2a, UWORD, AddGadget , struct Window *, ___window, a0, struct Gadget *, ___gadget, a1, UWORD, ___position, d0,\
      , INTUITION_BASE_NAME)

#define ClearDMRequest(___window) \
      LP1(0x30, BOOL, ClearDMRequest , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define ClearMenuStrip(___window) \
      LP1NR(0x36, ClearMenuStrip , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define ClearPointer(___window) \
      LP1NR(0x3c, ClearPointer , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define CloseScreen(___screen) \
      LP1(0x42, BOOL, CloseScreen , struct Screen *, ___screen, a0,\
      , INTUITION_BASE_NAME)

#define CloseWindow(___window) \
      LP1NR(0x48, CloseWindow , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define CloseWorkBench() \
      LP0(0x4e, LONG, CloseWorkBench ,\
      , INTUITION_BASE_NAME)

#define CurrentTime(___seconds, ___micros) \
      LP2NR(0x54, CurrentTime , ULONG *, ___seconds, a0, ULONG *, ___micros, a1,\
      , INTUITION_BASE_NAME)

#define DisplayAlert(___alertNumber, ___string, ___height) \
      LP3(0x5a, BOOL, DisplayAlert , ULONG, ___alertNumber, d0, CONST_STRPTR, ___string, a0, UWORD, ___height, d1,\
      , INTUITION_BASE_NAME)

#define DisplayBeep(___screen) \
      LP1NR(0x60, DisplayBeep , struct Screen *, ___screen, a0,\
      , INTUITION_BASE_NAME)

#define DoubleClick(___sSeconds, ___sMicros, ___cSeconds, ___cMicros) \
      LP4(0x66, BOOL, DoubleClick , ULONG, ___sSeconds, d0, ULONG, ___sMicros, d1, ULONG, ___cSeconds, d2, ULONG, ___cMicros, d3,\
      , INTUITION_BASE_NAME)

#define DrawBorder(___rp, ___border, ___leftOffset, ___topOffset) \
      LP4NR(0x6c, DrawBorder , struct RastPort *, ___rp, a0, const struct Border *, ___border, a1, WORD, ___leftOffset, d0, WORD, ___topOffset, d1,\
      , INTUITION_BASE_NAME)

#define DrawImage(___rp, ___image, ___leftOffset, ___topOffset) \
      LP4NR(0x72, DrawImage , struct RastPort *, ___rp, a0, struct Image *, ___image, a1, WORD, ___leftOffset, d0, WORD, ___topOffset, d1,\
      , INTUITION_BASE_NAME)

#define EndRequest(___requester, ___window) \
      LP2NR(0x78, EndRequest , struct Requester *, ___requester, a0, struct Window *, ___window, a1,\
      , INTUITION_BASE_NAME)

#define GetDefPrefs(___preferences, ___size) \
      LP2(0x7e, struct Preferences *, GetDefPrefs , struct Preferences *, ___preferences, a0, WORD, ___size, d0,\
      , INTUITION_BASE_NAME)

#define GetPrefs(___preferences, ___size) \
      LP2(0x84, struct Preferences *, GetPrefs , struct Preferences *, ___preferences, a0, WORD, ___size, d0,\
      , INTUITION_BASE_NAME)

#define InitRequester(___requester) \
      LP1NR(0x8a, InitRequester , struct Requester *, ___requester, a0,\
      , INTUITION_BASE_NAME)

#define ItemAddress(___menuStrip, ___menuNumber) \
      LP2(0x90, struct MenuItem *, ItemAddress , const struct Menu *, ___menuStrip, a0, UWORD, ___menuNumber, d0,\
      , INTUITION_BASE_NAME)

#define ModifyIDCMP(___window, ___flags) \
      LP2(0x96, BOOL, ModifyIDCMP , struct Window *, ___window, a0, ULONG, ___flags, d0,\
      , INTUITION_BASE_NAME)

#define ModifyProp(___gadget, ___window, ___requester, ___flags, ___horizPot, ___vertPot, ___horizBody, ___vertBody) \
      LP8NR(0x9c, ModifyProp , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2, UWORD, ___flags, d0, UWORD, ___horizPot, d1, UWORD, ___vertPot, d2, UWORD, ___horizBody, d3, UWORD, ___vertBody, d4,\
      , INTUITION_BASE_NAME)

#define MoveScreen(___screen, ___dx, ___dy) \
      LP3NR(0xa2, MoveScreen , struct Screen *, ___screen, a0, WORD, ___dx, d0, WORD, ___dy, d1,\
      , INTUITION_BASE_NAME)

#define MoveWindow(___window, ___dx, ___dy) \
      LP3NR(0xa8, MoveWindow , struct Window *, ___window, a0, WORD, ___dx, d0, WORD, ___dy, d1,\
      , INTUITION_BASE_NAME)

#define OffGadget(___gadget, ___window, ___requester) \
      LP3NR(0xae, OffGadget , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2,\
      , INTUITION_BASE_NAME)

#define OffMenu(___window, ___menuNumber) \
      LP2NR(0xb4, OffMenu , struct Window *, ___window, a0, UWORD, ___menuNumber, d0,\
      , INTUITION_BASE_NAME)

#define OnGadget(___gadget, ___window, ___requester) \
      LP3NR(0xba, OnGadget , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2,\
      , INTUITION_BASE_NAME)

#define OnMenu(___window, ___menuNumber) \
      LP2NR(0xc0, OnMenu , struct Window *, ___window, a0, UWORD, ___menuNumber, d0,\
      , INTUITION_BASE_NAME)

#define OpenScreen(___newScreen) \
      LP1(0xc6, struct Screen *, OpenScreen , const struct NewScreen *, ___newScreen, a0,\
      , INTUITION_BASE_NAME)

#define OpenWindow(___newWindow) \
      LP1(0xcc, struct Window *, OpenWindow , const struct NewWindow *, ___newWindow, a0,\
      , INTUITION_BASE_NAME)

#define OpenWorkBench() \
      LP0(0xd2, ULONG, OpenWorkBench ,\
      , INTUITION_BASE_NAME)

#define PrintIText(___rp, ___iText, ___left, ___top) \
      LP4NR(0xd8, PrintIText , struct RastPort *, ___rp, a0, const struct IntuiText *, ___iText, a1, WORD, ___left, d0, WORD, ___top, d1,\
      , INTUITION_BASE_NAME)

#define RefreshGadgets(___gadgets, ___window, ___requester) \
      LP3NR(0xde, RefreshGadgets , struct Gadget *, ___gadgets, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2,\
      , INTUITION_BASE_NAME)

#define RemoveGadget(___window, ___gadget) \
      LP2(0xe4, UWORD, RemoveGadget , struct Window *, ___window, a0, struct Gadget *, ___gadget, a1,\
      , INTUITION_BASE_NAME)

#define ReportMouse(___flag, ___window) \
      LP2NR(0xea, ReportMouse , BOOL, ___flag, d0, struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define ReportMouse1(___flag, ___window) \
      LP2NR(0xea, ReportMouse1 , struct Window *, ___flag, d0, BOOL, ___window, a0,\
      , INTUITION_BASE_NAME)

#define Request(___requester, ___window) \
      LP2(0xf0, BOOL, Request , struct Requester *, ___requester, a0, struct Window *, ___window, a1,\
      , INTUITION_BASE_NAME)

#define ScreenToBack(___screen) \
      LP1NR(0xf6, ScreenToBack , struct Screen *, ___screen, a0,\
      , INTUITION_BASE_NAME)

#define ScreenToFront(___screen) \
      LP1NR(0xfc, ScreenToFront , struct Screen *, ___screen, a0,\
      , INTUITION_BASE_NAME)

#define SetDMRequest(___window, ___requester) \
      LP2(0x102, BOOL, SetDMRequest , struct Window *, ___window, a0, struct Requester *, ___requester, a1,\
      , INTUITION_BASE_NAME)

#define SetMenuStrip(___window, ___menu) \
      LP2(0x108, BOOL, SetMenuStrip , struct Window *, ___window, a0, struct Menu *, ___menu, a1,\
      , INTUITION_BASE_NAME)

#define SetPointer(___window, ___pointer, ___height, ___width, ___xOffset, ___yOffset) \
      LP6NR(0x10e, SetPointer , struct Window *, ___window, a0, UWORD *, ___pointer, a1, WORD, ___height, d0, WORD, ___width, d1, WORD, ___xOffset, d2, WORD, ___yOffset, d3,\
      , INTUITION_BASE_NAME)

#define SetWindowTitles(___window, ___windowTitle, ___screenTitle) \
      LP3NR(0x114, SetWindowTitles , struct Window *, ___window, a0, CONST_STRPTR, ___windowTitle, a1, CONST_STRPTR, ___screenTitle, a2,\
      , INTUITION_BASE_NAME)

#define ShowTitle(___screen, ___showIt) \
      LP2NR(0x11a, ShowTitle , struct Screen *, ___screen, a0, BOOL, ___showIt, d0,\
      , INTUITION_BASE_NAME)

#define SizeWindow(___window, ___dx, ___dy) \
      LP3NR(0x120, SizeWindow , struct Window *, ___window, a0, WORD, ___dx, d0, WORD, ___dy, d1,\
      , INTUITION_BASE_NAME)

#define ViewAddress() \
      LP0(0x126, struct View *, ViewAddress ,\
      , INTUITION_BASE_NAME)

#define ViewPortAddress(___window) \
      LP1(0x12c, struct ViewPort *, ViewPortAddress , const struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define WindowToBack(___window) \
      LP1NR(0x132, WindowToBack , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define WindowToFront(___window) \
      LP1NR(0x138, WindowToFront , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define WindowLimits(___window, ___widthMin, ___heightMin, ___widthMax, ___heightMax) \
      LP5(0x13e, BOOL, WindowLimits , struct Window *, ___window, a0, LONG, ___widthMin, d0, LONG, ___heightMin, d1, ULONG, ___widthMax, d2, ULONG, ___heightMax, d3,\
      , INTUITION_BASE_NAME)

#define SetPrefs(___preferences, ___size, ___inform) \
      LP3(0x144, struct Preferences  *, SetPrefs , const struct Preferences *, ___preferences, a0, LONG, ___size, d0, BOOL, ___inform, d1,\
      , INTUITION_BASE_NAME)

#define IntuiTextLength(___iText) \
      LP1(0x14a, LONG, IntuiTextLength , const struct IntuiText *, ___iText, a0,\
      , INTUITION_BASE_NAME)

#define WBenchToBack() \
      LP0(0x150, BOOL, WBenchToBack ,\
      , INTUITION_BASE_NAME)

#define WBenchToFront() \
      LP0(0x156, BOOL, WBenchToFront ,\
      , INTUITION_BASE_NAME)

#define AutoRequest(___window, ___body, ___posText, ___negText, ___pFlag, ___nFlag, ___width, ___height) \
      LP8(0x15c, BOOL, AutoRequest , struct Window *, ___window, a0, const struct IntuiText *, ___body, a1, const struct IntuiText *, ___posText, a2, const struct IntuiText *, ___negText, a3, ULONG, ___pFlag, d0, ULONG, ___nFlag, d1, UWORD, ___width, d2, UWORD, ___height, d3,\
      , INTUITION_BASE_NAME)

#define BeginRefresh(___window) \
      LP1NR(0x162, BeginRefresh , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define BuildSysRequest(___window, ___body, ___posText, ___negText, ___flags, ___width, ___height) \
      LP7(0x168, struct Window *, BuildSysRequest , struct Window *, ___window, a0, const struct IntuiText *, ___body, a1, const struct IntuiText *, ___posText, a2, const struct IntuiText *, ___negText, a3, ULONG, ___flags, d0, UWORD, ___width, d1, UWORD, ___height, d2,\
      , INTUITION_BASE_NAME)

#define EndRefresh(___window, ___complete) \
      LP2NR(0x16e, EndRefresh , struct Window *, ___window, a0, LONG, ___complete, d0,\
      , INTUITION_BASE_NAME)

#define FreeSysRequest(___window) \
      LP1NR(0x174, FreeSysRequest , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define MakeScreen(___screen) \
      LP1(0x17a, LONG, MakeScreen , struct Screen *, ___screen, a0,\
      , INTUITION_BASE_NAME)

#define RemakeDisplay() \
      LP0(0x180, LONG, RemakeDisplay ,\
      , INTUITION_BASE_NAME)

#define RethinkDisplay() \
      LP0(0x186, LONG, RethinkDisplay ,\
      , INTUITION_BASE_NAME)

#define AllocRemember(___rememberKey, ___size, ___flags) \
      LP3(0x18c, APTR, AllocRemember , struct Remember **, ___rememberKey, a0, ULONG, ___size, d0, ULONG, ___flags, d1,\
      , INTUITION_BASE_NAME)

#define FreeRemember(___rememberKey, ___reallyForget) \
      LP2NR(0x198, FreeRemember , struct Remember **, ___rememberKey, a0, BOOL, ___reallyForget, d0,\
      , INTUITION_BASE_NAME)

#define LockIBase(___dontknow) \
      LP1(0x19e, ULONG, LockIBase , ULONG, ___dontknow, d0,\
      , INTUITION_BASE_NAME)

#define UnlockIBase(___ibLock) \
      LP1NR(0x1a4, UnlockIBase , ULONG, ___ibLock, a0,\
      , INTUITION_BASE_NAME)

#define GetScreenData(___buffer, ___size, ___type, ___screen) \
      LP4(0x1aa, LONG, GetScreenData , APTR, ___buffer, a0, UWORD, ___size, d0, UWORD, ___type, d1, const struct Screen *, ___screen, a1,\
      , INTUITION_BASE_NAME)

#define RefreshGList(___gadgets, ___window, ___requester, ___numGad) \
      LP4NR(0x1b0, RefreshGList , struct Gadget *, ___gadgets, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2, WORD, ___numGad, d0,\
      , INTUITION_BASE_NAME)

#define AddGList(___window, ___gadget, ___position, ___numGad, ___requester) \
      LP5(0x1b6, UWORD, AddGList , struct Window *, ___window, a0, struct Gadget *, ___gadget, a1, UWORD, ___position, d0, WORD, ___numGad, d1, struct Requester *, ___requester, a2,\
      , INTUITION_BASE_NAME)

#define RemoveGList(___remPtr, ___gadget, ___numGad) \
      LP3(0x1bc, UWORD, RemoveGList , struct Window *, ___remPtr, a0, struct Gadget *, ___gadget, a1, WORD, ___numGad, d0,\
      , INTUITION_BASE_NAME)

#define ActivateWindow(___window) \
      LP1NR(0x1c2, ActivateWindow , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define RefreshWindowFrame(___window) \
      LP1NR(0x1c8, RefreshWindowFrame , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define ActivateGadget(___gadgets, ___window, ___requester) \
      LP3(0x1ce, BOOL, ActivateGadget , struct Gadget *, ___gadgets, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2,\
      , INTUITION_BASE_NAME)

#define NewModifyProp(___gadget, ___window, ___requester, ___flags, ___horizPot, ___vertPot, ___horizBody, ___vertBody, ___numGad) \
      LP9NR(0x1d4, NewModifyProp , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2, UWORD, ___flags, d0, UWORD, ___horizPot, d1, UWORD, ___vertPot, d2, UWORD, ___horizBody, d3, UWORD, ___vertBody, d4, WORD, ___numGad, d5,\
      , INTUITION_BASE_NAME)

#define QueryOverscan(___displayID, ___rect, ___oScanType) \
      LP3(0x1da, LONG, QueryOverscan , ULONG, ___displayID, a0, struct Rectangle *, ___rect, a1, WORD, ___oScanType, d0,\
      , INTUITION_BASE_NAME)

#define MoveWindowInFrontOf(___window, ___behindWindow) \
      LP2NR(0x1e0, MoveWindowInFrontOf , struct Window *, ___window, a0, struct Window *, ___behindWindow, a1,\
      , INTUITION_BASE_NAME)

#define ChangeWindowBox(___window, ___left, ___top, ___width, ___height) \
      LP5NR(0x1e6, ChangeWindowBox , struct Window *, ___window, a0, WORD, ___left, d0, WORD, ___top, d1, WORD, ___width, d2, WORD, ___height, d3,\
      , INTUITION_BASE_NAME)

#define SetEditHook(___hook) \
      LP1(0x1ec, struct Hook *, SetEditHook , struct Hook *, ___hook, a0,\
      , INTUITION_BASE_NAME)

#define SetMouseQueue(___window, ___queueLength) \
      LP2(0x1f2, LONG, SetMouseQueue , struct Window *, ___window, a0, UWORD, ___queueLength, d0,\
      , INTUITION_BASE_NAME)

#define ZipWindow(___window) \
      LP1NR(0x1f8, ZipWindow , struct Window *, ___window, a0,\
      , INTUITION_BASE_NAME)

#define LockPubScreen(___name) \
      LP1(0x1fe, struct Screen *, LockPubScreen , CONST_STRPTR, ___name, a0,\
      , INTUITION_BASE_NAME)

#define UnlockPubScreen(___name, ___screen) \
      LP2NR(0x204, UnlockPubScreen , CONST_STRPTR, ___name, a0, struct Screen *, ___screen, a1,\
      , INTUITION_BASE_NAME)

#define LockPubScreenList() \
      LP0(0x20a, struct List *, LockPubScreenList ,\
      , INTUITION_BASE_NAME)

#define UnlockPubScreenList() \
      LP0NR(0x210, UnlockPubScreenList ,\
      , INTUITION_BASE_NAME)

#define NextPubScreen(___screen, ___namebuf) \
      LP2(0x216, STRPTR, NextPubScreen , const struct Screen *, ___screen, a0, STRPTR, ___namebuf, a1,\
      , INTUITION_BASE_NAME)

#define SetDefaultPubScreen(___name) \
      LP1NR(0x21c, SetDefaultPubScreen , CONST_STRPTR, ___name, a0,\
      , INTUITION_BASE_NAME)

#define SetPubScreenModes(___modes) \
      LP1(0x222, UWORD, SetPubScreenModes , UWORD, ___modes, d0,\
      , INTUITION_BASE_NAME)

#define PubScreenStatus(___screen, ___statusFlags) \
      LP2(0x228, UWORD, PubScreenStatus , struct Screen *, ___screen, a0, UWORD, ___statusFlags, d0,\
      , INTUITION_BASE_NAME)

#define ObtainGIRPort(___gInfo) \
      LP1(0x22e, struct RastPort	*, ObtainGIRPort , struct GadgetInfo *, ___gInfo, a0,\
      , INTUITION_BASE_NAME)

#define ReleaseGIRPort(___rp) \
      LP1NR(0x234, ReleaseGIRPort , struct RastPort *, ___rp, a0,\
      , INTUITION_BASE_NAME)

#define GadgetMouse(___gadget, ___gInfo, ___mousePoint) \
      LP3NR(0x23a, GadgetMouse , struct Gadget *, ___gadget, a0, struct GadgetInfo *, ___gInfo, a1, WORD *, ___mousePoint, a2,\
      , INTUITION_BASE_NAME)

#define GetDefaultPubScreen(___nameBuffer) \
      LP1NR(0x246, GetDefaultPubScreen , STRPTR, ___nameBuffer, a0,\
      , INTUITION_BASE_NAME)

#define EasyRequestArgs(___window, ___easyStruct, ___idcmpPtr, ___args) \
      LP4(0x24c, LONG, EasyRequestArgs , struct Window *, ___window, a0, const struct EasyStruct *, ___easyStruct, a1, ULONG *, ___idcmpPtr, a2, const APTR, ___args, a3,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define EasyRequest(___window, ___easyStruct, ___idcmpPtr, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; EasyRequestArgs((___window), (___easyStruct), (___idcmpPtr), (const APTR) _args); })
#endif /* !NO_INLINE_VARARGS */

#define BuildEasyRequestArgs(___window, ___easyStruct, ___idcmp, ___args) \
      LP4(0x252, struct Window *, BuildEasyRequestArgs , struct Window *, ___window, a0, const struct EasyStruct *, ___easyStruct, a1, ULONG, ___idcmp, d0, const APTR, ___args, a3,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define BuildEasyRequest(___window, ___easyStruct, ___idcmp, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; BuildEasyRequestArgs((___window), (___easyStruct), (___idcmp), (const APTR) _args); })
#endif /* !NO_INLINE_VARARGS */

#define SysReqHandler(___window, ___idcmpPtr, ___waitInput) \
      LP3(0x258, LONG, SysReqHandler , struct Window *, ___window, a0, ULONG *, ___idcmpPtr, a1, BOOL, ___waitInput, d0,\
      , INTUITION_BASE_NAME)

#define OpenWindowTagList(___newWindow, ___tagList) \
      LP2(0x25e, struct Window *, OpenWindowTagList , const struct NewWindow *, ___newWindow, a0, const struct TagItem *, ___tagList, a1,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenWindowTags(___newWindow, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; OpenWindowTagList((___newWindow), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define OpenScreenTagList(___newScreen, ___tagList) \
      LP2(0x264, struct Screen *, OpenScreenTagList , const struct NewScreen *, ___newScreen, a0, const struct TagItem *, ___tagList, a1,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenScreenTags(___newScreen, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; OpenScreenTagList((___newScreen), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DrawImageState(___rp, ___image, ___leftOffset, ___topOffset, ___state, ___drawInfo) \
      LP6NR(0x26a, DrawImageState , struct RastPort *, ___rp, a0, struct Image *, ___image, a1, WORD, ___leftOffset, d0, WORD, ___topOffset, d1, ULONG, ___state, d2, const struct DrawInfo *, ___drawInfo, a2,\
      , INTUITION_BASE_NAME)

#define PointInImage(___point, ___image) \
      LP2(0x270, BOOL, PointInImage , ULONG, ___point, d0, struct Image *, ___image, a0,\
      , INTUITION_BASE_NAME)

#define EraseImage(___rp, ___image, ___leftOffset, ___topOffset) \
      LP4NR(0x276, EraseImage , struct RastPort *, ___rp, a0, struct Image *, ___image, a1, WORD, ___leftOffset, d0, WORD, ___topOffset, d1,\
      , INTUITION_BASE_NAME)

#define NewObjectA(___classPtr, ___classID, ___tagList) \
      LP3(0x27c, APTR, NewObjectA , struct IClass *, ___classPtr, a0, CONST_STRPTR, ___classID, a1, const struct TagItem *, ___tagList, a2,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define NewObject(___classPtr, ___classID, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; NewObjectA((___classPtr), (___classID), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define DisposeObject(___object) \
      LP1NR(0x282, DisposeObject , APTR, ___object, a0,\
      , INTUITION_BASE_NAME)

#define SetAttrsA(___object, ___tagList) \
      LP2(0x288, ULONG, SetAttrsA , APTR, ___object, a0, const struct TagItem *, ___tagList, a1,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetAttrs(___object, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; SetAttrsA((___object), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define GetAttr(___attrID, ___object, ___storagePtr) \
      LP3(0x28e, ULONG, GetAttr , ULONG, ___attrID, d0, APTR, ___object, a0, ULONG *, ___storagePtr, a1,\
      , INTUITION_BASE_NAME)

#define SetGadgetAttrsA(___gadget, ___window, ___requester, ___tagList) \
      LP4(0x294, ULONG, SetGadgetAttrsA , struct Gadget *, ___gadget, a0, struct Window *, ___window, a1, struct Requester *, ___requester, a2, const struct TagItem *, ___tagList, a3,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetGadgetAttrs(___gadget, ___window, ___requester, ___tagList, ...) \
    ({_sfdc_vararg _tags[] = { ___tagList, __VA_ARGS__ }; SetGadgetAttrsA((___gadget), (___window), (___requester), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define NextObject(___objectPtrPtr) \
      LP1(0x29a, APTR, NextObject , APTR, ___objectPtrPtr, a0,\
      , INTUITION_BASE_NAME)

#define MakeClass(___classID, ___superClassID, ___superClassPtr, ___instanceSize, ___flags) \
      LP5(0x2a6, struct IClass *, MakeClass , CONST_STRPTR, ___classID, a0, CONST_STRPTR, ___superClassID, a1, const struct IClass *, ___superClassPtr, a2, UWORD, ___instanceSize, d0, ULONG, ___flags, d1,\
      , INTUITION_BASE_NAME)

#define AddClass(___classPtr) \
      LP1NR(0x2ac, AddClass , struct IClass *, ___classPtr, a0,\
      , INTUITION_BASE_NAME)

#define GetScreenDrawInfo(___screen) \
      LP1(0x2b2, struct DrawInfo *, GetScreenDrawInfo , struct Screen *, ___screen, a0,\
      , INTUITION_BASE_NAME)

#define FreeScreenDrawInfo(___screen, ___drawInfo) \
      LP2NR(0x2b8, FreeScreenDrawInfo , struct Screen *, ___screen, a0, struct DrawInfo *, ___drawInfo, a1,\
      , INTUITION_BASE_NAME)

#define ResetMenuStrip(___window, ___menu) \
      LP2(0x2be, BOOL, ResetMenuStrip , struct Window *, ___window, a0, struct Menu *, ___menu, a1,\
      , INTUITION_BASE_NAME)

#define RemoveClass(___classPtr) \
      LP1NR(0x2c4, RemoveClass , struct IClass *, ___classPtr, a0,\
      , INTUITION_BASE_NAME)

#define FreeClass(___classPtr) \
      LP1(0x2ca, BOOL, FreeClass , struct IClass *, ___classPtr, a0,\
      , INTUITION_BASE_NAME)

#define AllocScreenBuffer(___sc, ___bm, ___flags) \
      LP3(0x300, struct ScreenBuffer *, AllocScreenBuffer , struct Screen *, ___sc, a0, struct BitMap *, ___bm, a1, ULONG, ___flags, d0,\
      , INTUITION_BASE_NAME)

#define FreeScreenBuffer(___sc, ___sb) \
      LP2NR(0x306, FreeScreenBuffer , struct Screen *, ___sc, a0, struct ScreenBuffer *, ___sb, a1,\
      , INTUITION_BASE_NAME)

#define ChangeScreenBuffer(___sc, ___sb) \
      LP2(0x30c, ULONG, ChangeScreenBuffer , struct Screen *, ___sc, a0, struct ScreenBuffer *, ___sb, a1,\
      , INTUITION_BASE_NAME)

#define ScreenDepth(___screen, ___flags, ___reserved) \
      LP3NR(0x312, ScreenDepth , struct Screen *, ___screen, a0, ULONG, ___flags, d0, APTR, ___reserved, a1,\
      , INTUITION_BASE_NAME)

#define ScreenPosition(___screen, ___flags, ___x1, ___y1, ___x2, ___y2) \
      LP6NR(0x318, ScreenPosition , struct Screen *, ___screen, a0, ULONG, ___flags, d0, LONG, ___x1, d1, LONG, ___y1, d2, LONG, ___x2, d3, LONG, ___y2, d4,\
      , INTUITION_BASE_NAME)

#define ScrollWindowRaster(___win, ___dx, ___dy, ___xMin, ___yMin, ___xMax, ___yMax) \
      LP7NR(0x31e, ScrollWindowRaster , struct Window *, ___win, a1, WORD, ___dx, d0, WORD, ___dy, d1, WORD, ___xMin, d2, WORD, ___yMin, d3, WORD, ___xMax, d4, WORD, ___yMax, d5,\
      , INTUITION_BASE_NAME)

#define LendMenus(___fromwindow, ___towindow) \
      LP2NR(0x324, LendMenus , struct Window *, ___fromwindow, a0, struct Window *, ___towindow, a1,\
      , INTUITION_BASE_NAME)

#define DoGadgetMethodA(___gad, ___win, ___req, ___message) \
      LP4(0x32a, ULONG, DoGadgetMethodA , struct Gadget *, ___gad, a0, struct Window *, ___win, a1, struct Requester *, ___req, a2, Msg, ___message, a3,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_VARARGS
#define DoGadgetMethod(___gad, ___win, ___req, ___message, ...) \
    ({_sfdc_vararg _message[] = { ___message, __VA_ARGS__ }; DoGadgetMethodA((___gad), (___win), (___req), (Msg) _message); })
#endif /* !NO_INLINE_VARARGS */

#define SetWindowPointerA(___win, ___taglist) \
      LP2NR(0x330, SetWindowPointerA , struct Window *, ___win, a0, const struct TagItem *, ___taglist, a1,\
      , INTUITION_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define SetWindowPointer(___win, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; SetWindowPointerA((___win), (const struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define TimedDisplayAlert(___alertNumber, ___string, ___height, ___time) \
      LP4(0x336, BOOL, TimedDisplayAlert , ULONG, ___alertNumber, d0, CONST_STRPTR, ___string, a0, UWORD, ___height, d1, ULONG, ___time, a1,\
      , INTUITION_BASE_NAME)

#define HelpControl(___win, ___flags) \
      LP2NR(0x33c, HelpControl , struct Window *, ___win, a0, ULONG, ___flags, d0,\
      , INTUITION_BASE_NAME)

#endif /* !_INLINE_INTUITION_H */
