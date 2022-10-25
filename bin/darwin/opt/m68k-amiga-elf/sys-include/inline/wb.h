/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_WB_H
#define _INLINE_WB_H

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

#ifndef WB_BASE_NAME
#define WB_BASE_NAME WorkbenchBase
#endif /* !WB_BASE_NAME */

#define AddAppWindowA(___id, ___userdata, ___window, ___msgport, ___taglist) \
      LP5(0x30, struct AppWindow *, AddAppWindowA , ULONG, ___id, d0, ULONG, ___userdata, d1, struct Window *, ___window, a0, struct MsgPort *, ___msgport, a1, struct TagItem *, ___taglist, a2,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AddAppWindow(___id, ___userdata, ___window, ___msgport, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; AddAppWindowA((___id), (___userdata), (___window), (___msgport), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RemoveAppWindow(___appWindow) \
      LP1(0x36, BOOL, RemoveAppWindow , struct AppWindow *, ___appWindow, a0,\
      , WB_BASE_NAME)

#define AddAppIconA(___id, ___userdata, ___text, ___msgport, ___lock, ___diskobj, ___taglist) \
      LP7A4(0x3c, struct AppIcon *, AddAppIconA , ULONG, ___id, d0, ULONG, ___userdata, d1, UBYTE *, ___text, a0, struct MsgPort *, ___msgport, a1, BPTR, ___lock, a2, struct DiskObject *, ___diskobj, a3, struct TagItem *, ___taglist, d7,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AddAppIcon(___id, ___userdata, ___text, ___msgport, ___lock, ___diskobj, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; AddAppIconA((___id), (___userdata), (___text), (___msgport), (___lock), (___diskobj), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RemoveAppIcon(___appIcon) \
      LP1(0x42, BOOL, RemoveAppIcon , struct AppIcon *, ___appIcon, a0,\
      , WB_BASE_NAME)

#define AddAppMenuItemA(___id, ___userdata, ___text, ___msgport, ___taglist) \
      LP5(0x48, struct AppMenuItem *, AddAppMenuItemA , ULONG, ___id, d0, ULONG, ___userdata, d1, UBYTE *, ___text, a0, struct MsgPort *, ___msgport, a1, struct TagItem *, ___taglist, a2,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AddAppMenuItem(___id, ___userdata, ___text, ___msgport, ___taglist, ...) \
    ({_sfdc_vararg _tags[] = { ___taglist, __VA_ARGS__ }; AddAppMenuItemA((___id), (___userdata), (___text), (___msgport), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RemoveAppMenuItem(___appMenuItem) \
      LP1(0x4e, BOOL, RemoveAppMenuItem , struct AppMenuItem *, ___appMenuItem, a0,\
      , WB_BASE_NAME)

#define WBInfo(___lock, ___name, ___screen) \
      LP3NR(0x5a, WBInfo , BPTR, ___lock, a0, STRPTR, ___name, a1, struct Screen *, ___screen, a2,\
      , WB_BASE_NAME)

#define OpenWorkbenchObjectA(___name, ___tags) \
      LP2(0x60, BOOL, OpenWorkbenchObjectA , STRPTR, ___name, a0, struct TagItem *, ___tags, a1,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define OpenWorkbenchObject(___name, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; OpenWorkbenchObjectA((___name), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define CloseWorkbenchObjectA(___name, ___tags) \
      LP2(0x66, BOOL, CloseWorkbenchObjectA , STRPTR, ___name, a0, struct TagItem *, ___tags, a1,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define CloseWorkbenchObject(___name, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; CloseWorkbenchObjectA((___name), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define WorkbenchControlA(___name, ___tags) \
      LP2(0x6c, BOOL, WorkbenchControlA , STRPTR, ___name, a0, struct TagItem *, ___tags, a1,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define WorkbenchControl(___name, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; WorkbenchControlA((___name), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define AddAppWindowDropZoneA(___aw, ___id, ___userdata, ___tags) \
      LP4(0x72, struct AppWindowDropZone *, AddAppWindowDropZoneA , struct AppWindow *, ___aw, a0, ULONG, ___id, d0, ULONG, ___userdata, d1, struct TagItem *, ___tags, a1,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define AddAppWindowDropZone(___aw, ___id, ___userdata, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; AddAppWindowDropZoneA((___aw), (___id), (___userdata), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define RemoveAppWindowDropZone(___aw, ___dropZone) \
      LP2(0x78, BOOL, RemoveAppWindowDropZone , struct AppWindow *, ___aw, a0, struct AppWindowDropZone *, ___dropZone, a1,\
      , WB_BASE_NAME)

#define ChangeWorkbenchSelectionA(___name, ___hook, ___tags) \
      LP3(0x7e, BOOL, ChangeWorkbenchSelectionA , STRPTR, ___name, a0, struct Hook *, ___hook, a1, struct TagItem *, ___tags, a2,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define ChangeWorkbenchSelection(___name, ___hook, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; ChangeWorkbenchSelectionA((___name), (___hook), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#define MakeWorkbenchObjectVisibleA(___name, ___tags) \
      LP2(0x84, BOOL, MakeWorkbenchObjectVisibleA , STRPTR, ___name, a0, struct TagItem *, ___tags, a1,\
      , WB_BASE_NAME)

#ifndef NO_INLINE_STDARG
#define MakeWorkbenchObjectVisible(___name, ____tag1, ...) \
    ({_sfdc_vararg _tags[] = { ____tag1, __VA_ARGS__ }; MakeWorkbenchObjectVisibleA((___name), (struct TagItem *) _tags); })
#endif /* !NO_INLINE_STDARG */

#endif /* !_INLINE_WB_H */
