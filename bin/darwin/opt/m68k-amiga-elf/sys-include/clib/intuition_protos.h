#ifndef  CLIB_INTUITION_PROTOS_H
#define  CLIB_INTUITION_PROTOS_H

/*
**	$VER: intuition_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif
#ifndef  INTUITION_CGHOOKS_H
#include <intuition/cghooks.h>
#endif
#ifndef  INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif
/* Public functions OpenIntuition() and Intuition() are intentionally */
/* not documented. */
VOID OpenIntuition( VOID );
VOID Intuition( struct InputEvent *iEvent );
UWORD AddGadget( struct Window *window, struct Gadget *gadget, ULONG position );
BOOL ClearDMRequest( struct Window *window );
VOID ClearMenuStrip( struct Window *window );
VOID ClearPointer( struct Window *window );
BOOL CloseScreen( struct Screen *screen );
VOID CloseWindow( struct Window *window );
LONG CloseWorkBench( VOID );
VOID CurrentTime( ULONG *seconds, ULONG *micros );
BOOL DisplayAlert( ULONG alertNumber, CONST_STRPTR string, ULONG height );
VOID DisplayBeep( struct Screen *screen );
BOOL DoubleClick( ULONG sSeconds, ULONG sMicros, ULONG cSeconds, ULONG cMicros );
VOID DrawBorder( struct RastPort *rp, CONST struct Border *border, LONG leftOffset, LONG topOffset );
VOID DrawImage( struct RastPort *rp, struct Image *image, LONG leftOffset, LONG topOffset );
VOID EndRequest( struct Requester *requester, struct Window *window );
struct Preferences *GetDefPrefs( struct Preferences *preferences, LONG size );
struct Preferences *GetPrefs( struct Preferences *preferences, LONG size );
VOID InitRequester( struct Requester *requester );
struct MenuItem *ItemAddress( CONST struct Menu *menuStrip, ULONG menuNumber );
BOOL ModifyIDCMP( struct Window *window, ULONG flags );
VOID ModifyProp( struct Gadget *gadget, struct Window *window, struct Requester *requester, ULONG flags, ULONG horizPot, ULONG vertPot, ULONG horizBody, ULONG vertBody );
VOID MoveScreen( struct Screen *screen, LONG dx, LONG dy );
VOID MoveWindow( struct Window *window, LONG dx, LONG dy );
VOID OffGadget( struct Gadget *gadget, struct Window *window, struct Requester *requester );
VOID OffMenu( struct Window *window, ULONG menuNumber );
VOID OnGadget( struct Gadget *gadget, struct Window *window, struct Requester *requester );
VOID OnMenu( struct Window *window, ULONG menuNumber );
struct Screen *OpenScreen( CONST struct NewScreen *newScreen );
struct Window *OpenWindow( CONST struct NewWindow *newWindow );
ULONG OpenWorkBench( VOID );
VOID PrintIText( struct RastPort *rp, CONST struct IntuiText *iText, LONG left, LONG top );
VOID RefreshGadgets( struct Gadget *gadgets, struct Window *window, struct Requester *requester );
UWORD RemoveGadget( struct Window *window, struct Gadget *gadget );
/* The official calling sequence for ReportMouse is given below. */
/* Note the register order.  For the complete story, read the ReportMouse */
/* autodoc. */
VOID ReportMouse( LONG flag, struct Window *window );
VOID ReportMouse1( struct Window *window, LONG flag );
BOOL Request( struct Requester *requester, struct Window *window );
VOID ScreenToBack( struct Screen *screen );
VOID ScreenToFront( struct Screen *screen );
BOOL SetDMRequest( struct Window *window, struct Requester *requester );
BOOL SetMenuStrip( struct Window *window, struct Menu *menu );
VOID SetPointer( struct Window *window, UWORD *pointer, LONG height, LONG width, LONG xOffset, LONG yOffset );
VOID SetWindowTitles( struct Window *window, CONST_STRPTR windowTitle, CONST_STRPTR screenTitle );
VOID ShowTitle( struct Screen *screen, LONG showIt );
VOID SizeWindow( struct Window *window, LONG dx, LONG dy );
struct View *ViewAddress( VOID );
struct ViewPort *ViewPortAddress( CONST struct Window *window );
VOID WindowToBack( struct Window *window );
VOID WindowToFront( struct Window *window );
BOOL WindowLimits( struct Window *window, LONG widthMin, LONG heightMin, ULONG widthMax, ULONG heightMax );
/*--- start of next generation of names -------------------------------------*/
struct Preferences *SetPrefs( CONST struct Preferences *preferences, LONG size, LONG inform );
/*--- start of next next generation of names --------------------------------*/
LONG IntuiTextLength( CONST struct IntuiText *iText );
BOOL WBenchToBack( VOID );
BOOL WBenchToFront( VOID );
/*--- start of next next next generation of names ---------------------------*/
BOOL AutoRequest( struct Window *window, CONST struct IntuiText *body, CONST struct IntuiText *posText, CONST struct IntuiText *negText, ULONG pFlag, ULONG nFlag, ULONG width, ULONG height );
VOID BeginRefresh( struct Window *window );
struct Window *BuildSysRequest( struct Window *window, CONST struct IntuiText *body, CONST struct IntuiText *posText, CONST struct IntuiText *negText, ULONG flags, ULONG width, ULONG height );
VOID EndRefresh( struct Window *window, LONG complete );
VOID FreeSysRequest( struct Window *window );
/* The return codes for MakeScreen(), RemakeDisplay(), and RethinkDisplay() */
/* are only valid under V39 and greater.  Do not examine them when running */
/* on pre-V39 systems! */
LONG MakeScreen( struct Screen *screen );
LONG RemakeDisplay( VOID );
LONG RethinkDisplay( VOID );
/*--- start of next next next next generation of names ----------------------*/
APTR AllocRemember( struct Remember **rememberKey, ULONG size, ULONG flags );
VOID FreeRemember( struct Remember **rememberKey, LONG reallyForget );
/*--- start of 15 Nov 85 names ------------------------*/
ULONG LockIBase( ULONG dontknow );
VOID UnlockIBase( ULONG ibLock );
/*--- functions in V33 or higher (Release 1.2) ---*/
LONG GetScreenData( APTR buffer, ULONG size, ULONG type, CONST struct Screen *screen );
VOID RefreshGList( struct Gadget *gadgets, struct Window *window, struct Requester *requester, LONG numGad );
UWORD AddGList( struct Window *window, struct Gadget *gadget, ULONG position, LONG numGad, struct Requester *requester );
UWORD RemoveGList( struct Window *remPtr, struct Gadget *gadget, LONG numGad );
VOID ActivateWindow( struct Window *window );
VOID RefreshWindowFrame( struct Window *window );
BOOL ActivateGadget( struct Gadget *gadgets, struct Window *window, struct Requester *requester );
VOID NewModifyProp( struct Gadget *gadget, struct Window *window, struct Requester *requester, ULONG flags, ULONG horizPot, ULONG vertPot, ULONG horizBody, ULONG vertBody, LONG numGad );
/*--- functions in V36 or higher (Release 2.0) ---*/
LONG QueryOverscan( ULONG displayID, struct Rectangle *rect, LONG oScanType );
VOID MoveWindowInFrontOf( struct Window *window, struct Window *behindWindow );
VOID ChangeWindowBox( struct Window *window, LONG left, LONG top, LONG width, LONG height );
struct Hook *SetEditHook( struct Hook *hook );
LONG SetMouseQueue( struct Window *window, ULONG queueLength );
VOID ZipWindow( struct Window *window );
/*--- public screens ---*/
struct Screen *LockPubScreen( CONST_STRPTR name );
VOID UnlockPubScreen( CONST_STRPTR name, struct Screen *screen );
struct List *LockPubScreenList( VOID );
VOID UnlockPubScreenList( VOID );
STRPTR NextPubScreen( CONST struct Screen *screen, STRPTR namebuf );
VOID SetDefaultPubScreen( CONST_STRPTR name );
UWORD SetPubScreenModes( ULONG modes );
UWORD PubScreenStatus( struct Screen *screen, ULONG statusFlags );

struct RastPort *ObtainGIRPort( struct GadgetInfo *gInfo );
VOID ReleaseGIRPort( struct RastPort *rp );
VOID GadgetMouse( struct Gadget *gadget, struct GadgetInfo *gInfo, WORD *mousePoint );
VOID GetDefaultPubScreen( STRPTR nameBuffer );
LONG EasyRequestArgs( struct Window *window, CONST struct EasyStruct *easyStruct, ULONG *idcmpPtr, CONST APTR args );
LONG EasyRequest( struct Window *window, CONST struct EasyStruct *easyStruct, ULONG *idcmpPtr, ... );
struct Window *BuildEasyRequestArgs( struct Window *window, CONST struct EasyStruct *easyStruct, ULONG idcmp, CONST APTR args );
struct Window *BuildEasyRequest( struct Window *window, CONST struct EasyStruct *easyStruct, ULONG idcmp, ... );
LONG SysReqHandler( struct Window *window, ULONG *idcmpPtr, LONG waitInput );
struct Window *OpenWindowTagList( CONST struct NewWindow *newWindow, CONST struct TagItem *tagList );
struct Window *OpenWindowTags( CONST struct NewWindow *newWindow, ULONG tag1Type, ... );
struct Screen *OpenScreenTagList( CONST struct NewScreen *newScreen, CONST struct TagItem *tagList );
struct Screen *OpenScreenTags( CONST struct NewScreen *newScreen, ULONG tag1Type, ... );

/*	new Image functions */
VOID DrawImageState( struct RastPort *rp, struct Image *image, LONG leftOffset, LONG topOffset, ULONG state, CONST struct DrawInfo *drawInfo );
BOOL PointInImage( ULONG point, struct Image *image );
VOID EraseImage( struct RastPort *rp, struct Image *image, LONG leftOffset, LONG topOffset );

APTR NewObjectA( struct IClass *classPtr, CONST_STRPTR classID, CONST struct TagItem *tagList );
APTR NewObject( struct IClass *classPtr, CONST_STRPTR classID, ULONG tag1, ... );

VOID DisposeObject( APTR object );
ULONG SetAttrsA( APTR object, CONST struct TagItem *tagList );
ULONG SetAttrs( APTR object, ULONG tag1, ... );

ULONG GetAttr( ULONG attrID, APTR object, ULONG *storagePtr );

/* 	special set attribute call for gadgets */
ULONG SetGadgetAttrsA( struct Gadget *gadget, struct Window *window, struct Requester *requester, CONST struct TagItem *tagList );
ULONG SetGadgetAttrs( struct Gadget *gadget, struct Window *window, struct Requester *requester, ULONG tag1, ... );

/*	for class implementors only */
APTR NextObject( APTR objectPtrPtr );
struct IClass *MakeClass( CONST_STRPTR classID, CONST_STRPTR superClassID, CONST struct IClass *superClassPtr, ULONG instanceSize, ULONG flags );
VOID AddClass( struct IClass *classPtr );


struct DrawInfo *GetScreenDrawInfo( struct Screen *screen );
VOID FreeScreenDrawInfo( struct Screen *screen, struct DrawInfo *drawInfo );

BOOL ResetMenuStrip( struct Window *window, struct Menu *menu );
VOID RemoveClass( struct IClass *classPtr );
BOOL FreeClass( struct IClass *classPtr );
/*--- functions in V39 or higher (Release 3) ---*/
struct ScreenBuffer *AllocScreenBuffer( struct Screen *sc, struct BitMap *bm, ULONG flags );
VOID FreeScreenBuffer( struct Screen *sc, struct ScreenBuffer *sb );
ULONG ChangeScreenBuffer( struct Screen *sc, struct ScreenBuffer *sb );
VOID ScreenDepth( struct Screen *screen, ULONG flags, APTR reserved );
VOID ScreenPosition( struct Screen *screen, ULONG flags, LONG x1, LONG y1, LONG x2, LONG y2 );
VOID ScrollWindowRaster( struct Window *win, LONG dx, LONG dy, LONG xMin, LONG yMin, LONG xMax, LONG yMax );
VOID LendMenus( struct Window *fromwindow, struct Window *towindow );
ULONG DoGadgetMethodA( struct Gadget *gad, struct Window *win, struct Requester *req, Msg message );
ULONG DoGadgetMethod( struct Gadget *gad, struct Window *win, struct Requester *req, ULONG methodID, ... );
VOID SetWindowPointerA( struct Window *win, CONST struct TagItem *taglist );
VOID SetWindowPointer( struct Window *win, ULONG tag1, ... );
BOOL TimedDisplayAlert( ULONG alertNumber, CONST_STRPTR string, ULONG height, ULONG time );
VOID HelpControl( struct Window *win, ULONG flags );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_INTUITION_PROTOS_H */
