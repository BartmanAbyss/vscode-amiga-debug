/* ks13_compat.h
 *
 * Automatically generated compile-time compatibility warnings for
 * AmigaOS functions not available on Kickstart 1.3 (version 33).
 *
 * Include this header when building software that must run on KS 1.3:
 *
 *   #include <ks13_compat.h>
 *
 * Any call to a KS 2.0+ function will generate a compiler error (poison).
 * Generated from NDK 3.2R4 SFD files by gen_ks13_compat.py
 *
 * Each name is #undef'd immediately before it is poisoned. The NDK proto/
 * inline headers define many of these as function-like macros; poisoning a
 * name that is currently a macro otherwise emits a 'poisoning existing macro'
 * warning for every such name. #undef removes the macro first, so the poison
 * applies cleanly to the bare identifier (which is what catches a call) with
 * no warning.
 */

#ifndef KS13_COMPAT_H
#define KS13_COMPAT_H

#ifdef __GNUC__

/* asl.library — functions requiring KS 2.0+ */
#undef AllocAslRequest
#pragma GCC poison AllocAslRequest
#undef AllocAslRequestTags
#pragma GCC poison AllocAslRequestTags
#undef AslRequest
#pragma GCC poison AslRequest
#undef AslRequestTags
#pragma GCC poison AslRequestTags
#undef FreeAslRequest
#pragma GCC poison FreeAslRequest
#undef FreeFileRequest
#pragma GCC poison FreeFileRequest
#undef RequestFile
#pragma GCC poison RequestFile

/* chooser.library — functions requiring KS 2.0+ */
#undef FreeChooserNode
#pragma GCC poison FreeChooserNode
#undef GetChooserNodeAttrs
#pragma GCC poison GetChooserNodeAttrs
#undef GetChooserNodeAttrsA
#pragma GCC poison GetChooserNodeAttrsA
#undef HideChooser
#pragma GCC poison HideChooser
#undef SetChooserNodeAttrs
#pragma GCC poison SetChooserNodeAttrs
#undef SetChooserNodeAttrsA
#pragma GCC poison SetChooserNodeAttrsA
#undef ShowChooser
#pragma GCC poison ShowChooser

/* clicktab.library — functions requiring KS 2.0+ */
#undef FreeClickTabNode
#pragma GCC poison FreeClickTabNode
#undef GetClickTabNodeAttrs
#pragma GCC poison GetClickTabNodeAttrs
#undef GetClickTabNodeAttrsA
#pragma GCC poison GetClickTabNodeAttrsA
#undef SetClickTabNodeAttrs
#pragma GCC poison SetClickTabNodeAttrs
#undef SetClickTabNodeAttrsA
#pragma GCC poison SetClickTabNodeAttrsA

/* colorwheel.library — functions requiring KS 2.0+ */
#undef ConvertHSBToRGB
#pragma GCC poison ConvertHSBToRGB
#undef ConvertRGBToHSB
#pragma GCC poison ConvertRGBToHSB

/* commodities.library — functions requiring KS 2.0+ */
#undef ActivateCxObj
#pragma GCC poison ActivateCxObj
#undef AttachCxObj
#pragma GCC poison AttachCxObj
#undef ClearCxObjError
#pragma GCC poison ClearCxObjError
#undef CxObjError
#pragma GCC poison CxObjError
#undef CxObjType
#pragma GCC poison CxObjType
#undef DeleteCxObj
#pragma GCC poison DeleteCxObj
#undef DeleteCxObjAll
#pragma GCC poison DeleteCxObjAll
#undef EnqueueCxObj
#pragma GCC poison EnqueueCxObj
#undef InsertCxObj
#pragma GCC poison InsertCxObj
#undef MatchIX
#pragma GCC poison MatchIX
#undef RemoveCxObj
#pragma GCC poison RemoveCxObj
#undef SetCxObjPri
#pragma GCC poison SetCxObjPri

/* datebrowser.library — functions requiring KS 2.0+ */
#undef JulianLeapYear
#pragma GCC poison JulianLeapYear
#undef JulianMonthDays
#pragma GCC poison JulianMonthDays
#undef JulianWeekDay
#pragma GCC poison JulianWeekDay

/* disk.library — functions requiring KS 2.0+ */
#undef ReadUnitID
#pragma GCC poison ReadUnitID

/* diskfont.library — functions requiring KS 2.0+ */
#undef CloseOutlineFont
#pragma GCC poison CloseOutlineFont
#undef ECloseEngine
#pragma GCC poison ECloseEngine
#undef EObtainInfo
#pragma GCC poison EObtainInfo
#undef EObtainInfoA
#pragma GCC poison EObtainInfoA
#undef EOpenEngine
#pragma GCC poison EOpenEngine
#undef EReleaseInfo
#pragma GCC poison EReleaseInfo
#undef EReleaseInfoA
#pragma GCC poison EReleaseInfoA
#undef ESetInfo
#pragma GCC poison ESetInfo
#undef ESetInfoA
#pragma GCC poison ESetInfoA
#undef GetDiskFontCtrl
#pragma GCC poison GetDiskFontCtrl
#undef ObtainCharsetInfo
#pragma GCC poison ObtainCharsetInfo
#undef SetDiskFontCtrl
#pragma GCC poison SetDiskFontCtrl
#undef SetDiskFontCtrlA
#pragma GCC poison SetDiskFontCtrlA
#undef WriteDiskFontHeader
#pragma GCC poison WriteDiskFontHeader
#undef WriteDiskFontHeaderA
#pragma GCC poison WriteDiskFontHeaderA
#undef WriteFontContents
#pragma GCC poison WriteFontContents

/* dos.library — functions requiring KS 2.0+ */
#undef AbortPkt
#pragma GCC poison AbortPkt
#undef AddBuffers
#pragma GCC poison AddBuffers
#undef AddDosEntry
#pragma GCC poison AddDosEntry
#undef AddSegment
#pragma GCC poison AddSegment
#undef AllocDosObject
#pragma GCC poison AllocDosObject
#undef AllocDosObjectTagList
#pragma GCC poison AllocDosObjectTagList
#undef AllocDosObjectTags
#pragma GCC poison AllocDosObjectTags
#undef AssignAdd
#pragma GCC poison AssignAdd
#undef AssignLate
#pragma GCC poison AssignLate
#undef AssignLock
#pragma GCC poison AssignLock
#undef AssignPath
#pragma GCC poison AssignPath
#undef ChangeMode
#pragma GCC poison ChangeMode
#undef CheckSignal
#pragma GCC poison CheckSignal
#undef CompareDates
#pragma GCC poison CompareDates
#undef DateToStr
#pragma GCC poison DateToStr
#undef DoPkt
#pragma GCC poison DoPkt
#undef DoPkt0
#pragma GCC poison DoPkt0
#undef DoPkt1
#pragma GCC poison DoPkt1
#undef DoPkt2
#pragma GCC poison DoPkt2
#undef DoPkt3
#pragma GCC poison DoPkt3
#undef DoPkt4
#pragma GCC poison DoPkt4
#undef DupLockFromFH
#pragma GCC poison DupLockFromFH
#undef ErrorReport
#pragma GCC poison ErrorReport
#undef ExAll
#pragma GCC poison ExAll
#undef ExamineFH
#pragma GCC poison ExamineFH
#undef FGetC
#pragma GCC poison FGetC
#undef FGets
#pragma GCC poison FGets
#undef FPrintf
#pragma GCC poison FPrintf
#undef FPutC
#pragma GCC poison FPutC
#undef FPuts
#pragma GCC poison FPuts
#undef FRead
#pragma GCC poison FRead
#undef FWrite
#pragma GCC poison FWrite
#undef FWritef
#pragma GCC poison FWritef
#undef Fault
#pragma GCC poison Fault
#undef FindArg
#pragma GCC poison FindArg
#undef Flush
#pragma GCC poison Flush
#undef Format
#pragma GCC poison Format
#undef FreeDeviceProc
#pragma GCC poison FreeDeviceProc
#undef FreeDosEntry
#pragma GCC poison FreeDosEntry
#undef FreeDosObject
#pragma GCC poison FreeDosObject
#undef GetArgStr
#pragma GCC poison GetArgStr
#undef GetCurrentDirName
#pragma GCC poison GetCurrentDirName
#undef GetProgramDir
#pragma GCC poison GetProgramDir
#undef GetProgramName
#pragma GCC poison GetProgramName
#undef GetPrompt
#pragma GCC poison GetPrompt
#undef Inhibit
#pragma GCC poison Inhibit
#undef InternalLoadSeg
#pragma GCC poison InternalLoadSeg
#undef InternalUnLoadSeg
#pragma GCC poison InternalUnLoadSeg
#undef IsFileSystem
#pragma GCC poison IsFileSystem
#undef LockRecord
#pragma GCC poison LockRecord
#undef LockRecords
#pragma GCC poison LockRecords
#undef MakeLink
#pragma GCC poison MakeLink
#undef MatchEnd
#pragma GCC poison MatchEnd
#undef MatchFirst
#pragma GCC poison MatchFirst
#undef MatchNext
#pragma GCC poison MatchNext
#undef MatchPattern
#pragma GCC poison MatchPattern
#undef MaxCli
#pragma GCC poison MaxCli
#undef NameFromFH
#pragma GCC poison NameFromFH
#undef NameFromLock
#pragma GCC poison NameFromLock
#undef NewLoadSeg
#pragma GCC poison NewLoadSeg
#undef NewLoadSegTagList
#pragma GCC poison NewLoadSegTagList
#undef NewLoadSegTags
#pragma GCC poison NewLoadSegTags
#undef OpenFromLock
#pragma GCC poison OpenFromLock
#undef ParentOfFH
#pragma GCC poison ParentOfFH
#undef ParsePattern
#pragma GCC poison ParsePattern
#undef PrintFault
#pragma GCC poison PrintFault
#undef ReadItem
#pragma GCC poison ReadItem
#undef ReadLink
#pragma GCC poison ReadLink
#undef Relabel
#pragma GCC poison Relabel
#undef RemAssignList
#pragma GCC poison RemAssignList
#undef RemDosEntry
#pragma GCC poison RemDosEntry
#undef RemSegment
#pragma GCC poison RemSegment
#undef ReplyPkt
#pragma GCC poison ReplyPkt
#undef RunCommand
#pragma GCC poison RunCommand
#undef SameLock
#pragma GCC poison SameLock
#undef SelectInput
#pragma GCC poison SelectInput
#undef SelectOutput
#pragma GCC poison SelectOutput
#undef SendPkt
#pragma GCC poison SendPkt
#undef SetArgStr
#pragma GCC poison SetArgStr
#undef SetCurrentDirName
#pragma GCC poison SetCurrentDirName
#undef SetFileDate
#pragma GCC poison SetFileDate
#undef SetFileSize
#pragma GCC poison SetFileSize
#undef SetIoErr
#pragma GCC poison SetIoErr
#undef SetMode
#pragma GCC poison SetMode
#undef SetProgramDir
#pragma GCC poison SetProgramDir
#undef SetProgramName
#pragma GCC poison SetProgramName
#undef SetPrompt
#pragma GCC poison SetPrompt
#undef SetVBuf
#pragma GCC poison SetVBuf
#undef SplitName
#pragma GCC poison SplitName
#undef StrToDate
#pragma GCC poison StrToDate
#undef StrToLong
#pragma GCC poison StrToLong
#undef System
#pragma GCC poison System
#undef SystemTagList
#pragma GCC poison SystemTagList
#undef SystemTags
#pragma GCC poison SystemTags
#undef UnGetC
#pragma GCC poison UnGetC
#undef UnLockDosList
#pragma GCC poison UnLockDosList
#undef UnLockRecord
#pragma GCC poison UnLockRecord
#undef UnLockRecords
#pragma GCC poison UnLockRecords
#undef VFPrintf
#pragma GCC poison VFPrintf
#undef VFWritef
#pragma GCC poison VFWritef

/* exec.library — functions requiring KS 2.0+ */
#undef AddMemHandler
#pragma GCC poison AddMemHandler
#undef AllocPooled
#pragma GCC poison AllocPooled
#undef AllocVec
#pragma GCC poison AllocVec
#undef AttemptSemaphoreShared
#pragma GCC poison AttemptSemaphoreShared
#undef CacheClearE
#pragma GCC poison CacheClearE
#undef CacheClearU
#pragma GCC poison CacheClearU
#undef CacheControl
#pragma GCC poison CacheControl
#undef ColdReboot
#pragma GCC poison ColdReboot
#undef CreateIORequest
#pragma GCC poison CreateIORequest
#undef CreatePool
#pragma GCC poison CreatePool
#undef DeleteIORequest
#pragma GCC poison DeleteIORequest
#undef DeleteMsgPort
#pragma GCC poison DeleteMsgPort
#undef DeletePool
#pragma GCC poison DeletePool
#undef FreePooled
#pragma GCC poison FreePooled
#undef FreeVec
#pragma GCC poison FreeVec
#undef NewMinList
#pragma GCC poison NewMinList
#undef ObtainQuickVector
#pragma GCC poison ObtainQuickVector
#undef ObtainSemaphoreShared
#pragma GCC poison ObtainSemaphoreShared
#undef RemMemHandler
#pragma GCC poison RemMemHandler
#undef StackSwap
#pragma GCC poison StackSwap

/* expansion.library — functions requiring KS 2.0+ */
#undef AddBootNode
#pragma GCC poison AddBootNode

/* gadtools.library — functions requiring KS 2.0+ */
#undef DrawBevelBox
#pragma GCC poison DrawBevelBox
#undef DrawBevelBoxA
#pragma GCC poison DrawBevelBoxA
#undef FreeGadgets
#pragma GCC poison FreeGadgets
#undef FreeMenus
#pragma GCC poison FreeMenus
#undef FreeVisualInfo
#pragma GCC poison FreeVisualInfo
#undef GT_BeginRefresh
#pragma GCC poison GT_BeginRefresh
#undef GT_EndRefresh
#pragma GCC poison GT_EndRefresh
#undef GT_GetGadgetAttrs
#pragma GCC poison GT_GetGadgetAttrs
#undef GT_GetGadgetAttrsA
#pragma GCC poison GT_GetGadgetAttrsA
#undef GT_RefreshWindow
#pragma GCC poison GT_RefreshWindow
#undef GT_ReplyIMsg
#pragma GCC poison GT_ReplyIMsg
#undef GT_SetGadgetAttrs
#pragma GCC poison GT_SetGadgetAttrs
#undef GT_SetGadgetAttrsA
#pragma GCC poison GT_SetGadgetAttrsA
#undef GetVisualInfo
#pragma GCC poison GetVisualInfo
#undef GetVisualInfoA
#pragma GCC poison GetVisualInfoA
#undef LayoutMenuItems
#pragma GCC poison LayoutMenuItems
#undef LayoutMenuItemsA
#pragma GCC poison LayoutMenuItemsA
#undef LayoutMenus
#pragma GCC poison LayoutMenus
#undef LayoutMenusA
#pragma GCC poison LayoutMenusA
#undef ScaleGadgetRect
#pragma GCC poison ScaleGadgetRect
#undef ScaleGadgetRectA
#pragma GCC poison ScaleGadgetRectA
#undef SetDesignFont
#pragma GCC poison SetDesignFont
#undef SetDesignFontA
#pragma GCC poison SetDesignFontA

/* graphics.library — functions requiring KS 2.0+ */
#undef AttachPalExtra
#pragma GCC poison AttachPalExtra
#undef BitMapScale
#pragma GCC poison BitMapScale
#undef CalcIVG
#pragma GCC poison CalcIVG
#undef CloseMonitor
#pragma GCC poison CloseMonitor
#undef FindDisplayInfo
#pragma GCC poison FindDisplayInfo
#undef GfxAssociate
#pragma GCC poison GfxAssociate
#undef GfxFree
#pragma GCC poison GfxFree
#undef GfxLookUp
#pragma GCC poison GfxLookUp
#undef GfxNew
#pragma GCC poison GfxNew
#undef NextDisplayInfo
#pragma GCC poison NextDisplayInfo
#undef ObtainBestPen
#pragma GCC poison ObtainBestPen
#undef ObtainBestPenA
#pragma GCC poison ObtainBestPenA
#undef ScalerDiv
#pragma GCC poison ScalerDiv
#undef TextExtent
#pragma GCC poison TextExtent
#undef TextFit
#pragma GCC poison TextFit
#undef VideoControl
#pragma GCC poison VideoControl
#undef VideoControlTags
#pragma GCC poison VideoControlTags
#undef WriteChunkyPixels
#pragma GCC poison WriteChunkyPixels

/* icon.library — functions requiring KS 2.0+ */
#undef BumpRevisionLength
#pragma GCC poison BumpRevisionLength
#undef ChangeToSelectedIconColor
#pragma GCC poison ChangeToSelectedIconColor
#undef DeleteDiskObject
#pragma GCC poison DeleteDiskObject
#undef DrawIconState
#pragma GCC poison DrawIconState
#undef DrawIconStateA
#pragma GCC poison DrawIconStateA
#undef DupDiskObject
#pragma GCC poison DupDiskObject
#undef DupDiskObjectA
#pragma GCC poison DupDiskObjectA
#undef FreeFree
#pragma GCC poison FreeFree
#undef GetIconRectangle
#pragma GCC poison GetIconRectangle
#undef GetIconRectangleA
#pragma GCC poison GetIconRectangleA
#undef IconControl
#pragma GCC poison IconControl
#undef IconControlA
#pragma GCC poison IconControlA
#undef LayoutIcon
#pragma GCC poison LayoutIcon
#undef LayoutIconA
#pragma GCC poison LayoutIconA
#undef PutDefDiskObject
#pragma GCC poison PutDefDiskObject
#undef PutIconTagList
#pragma GCC poison PutIconTagList
#undef PutIconTags
#pragma GCC poison PutIconTags

/* iffparse.library — functions requiring KS 2.0+ */
#undef CloseClipboard
#pragma GCC poison CloseClipboard
#undef CloseIFF
#pragma GCC poison CloseIFF
#undef CollectionChunk
#pragma GCC poison CollectionChunk
#undef CollectionChunks
#pragma GCC poison CollectionChunks
#undef EntryHandler
#pragma GCC poison EntryHandler
#undef ExitHandler
#pragma GCC poison ExitHandler
#undef FreeIFF
#pragma GCC poison FreeIFF
#undef FreeLocalItem
#pragma GCC poison FreeLocalItem
#undef GoodID
#pragma GCC poison GoodID
#undef GoodType
#pragma GCC poison GoodType
#undef IDtoStr
#pragma GCC poison IDtoStr
#undef InitIFF
#pragma GCC poison InitIFF
#undef InitIFFasClip
#pragma GCC poison InitIFFasClip
#undef InitIFFasDOS
#pragma GCC poison InitIFFasDOS
#undef LocalItemData
#pragma GCC poison LocalItemData
#undef OpenIFF
#pragma GCC poison OpenIFF
#undef ParseIFF
#pragma GCC poison ParseIFF
#undef PopChunk
#pragma GCC poison PopChunk
#undef PropChunk
#pragma GCC poison PropChunk
#undef PropChunks
#pragma GCC poison PropChunks
#undef PushChunk
#pragma GCC poison PushChunk
#undef ReadChunkBytes
#pragma GCC poison ReadChunkBytes
#undef ReadChunkRecords
#pragma GCC poison ReadChunkRecords
#undef SetLocalItemPurge
#pragma GCC poison SetLocalItemPurge
#undef StopChunk
#pragma GCC poison StopChunk
#undef StopChunks
#pragma GCC poison StopChunks
#undef StopOnExit
#pragma GCC poison StopOnExit
#undef StoreItemInContext
#pragma GCC poison StoreItemInContext
#undef StoreLocalItem
#pragma GCC poison StoreLocalItem
#undef WriteChunkBytes
#pragma GCC poison WriteChunkBytes
#undef WriteChunkRecords
#pragma GCC poison WriteChunkRecords

/* input.library — functions requiring KS 2.0+ */
#undef PeekQualifier
#pragma GCC poison PeekQualifier

/* intuition.library — functions requiring KS 2.0+ */
#undef ChangeScreenBuffer
#pragma GCC poison ChangeScreenBuffer
#undef ChangeWindowBox
#pragma GCC poison ChangeWindowBox
#undef DoGadgetMethod
#pragma GCC poison DoGadgetMethod
#undef DoGadgetMethodA
#pragma GCC poison DoGadgetMethodA
#undef FreeScreenBuffer
#pragma GCC poison FreeScreenBuffer
#undef GadgetMouse
#pragma GCC poison GadgetMouse
#undef HelpControl
#pragma GCC poison HelpControl
#undef HideWindow
#pragma GCC poison HideWindow
#undef IntuitionControl
#pragma GCC poison IntuitionControl
#undef IntuitionControlA
#pragma GCC poison IntuitionControlA
#undef LendMenus
#pragma GCC poison LendMenus
#undef MoveWindowInFrontOf
#pragma GCC poison MoveWindowInFrontOf
#undef NextPubScreen
#pragma GCC poison NextPubScreen
#undef PubScreenStatus
#pragma GCC poison PubScreenStatus
#undef QueryOverscan
#pragma GCC poison QueryOverscan
#undef ReleaseGIRPort
#pragma GCC poison ReleaseGIRPort
#undef ScreenDepth
#pragma GCC poison ScreenDepth
#undef ScreenPosition
#pragma GCC poison ScreenPosition
#undef ScrollWindowRaster
#pragma GCC poison ScrollWindowRaster
#undef SetDefaultPubScreen
#pragma GCC poison SetDefaultPubScreen
#undef SetMouseQueue
#pragma GCC poison SetMouseQueue
#undef SetPubScreenModes
#pragma GCC poison SetPubScreenModes
#undef SetWindowPointer
#pragma GCC poison SetWindowPointer
#undef SetWindowPointerA
#pragma GCC poison SetWindowPointerA
#undef ShowWindow
#pragma GCC poison ShowWindow
#undef TimedDisplayAlert
#pragma GCC poison TimedDisplayAlert
#undef UnlockPubScreen
#pragma GCC poison UnlockPubScreen
#undef UnlockPubScreenList
#pragma GCC poison UnlockPubScreenList
#undef ZipWindow
#pragma GCC poison ZipWindow

/* keymap.library — functions requiring KS 2.0+ */
#undef MapANSI
#pragma GCC poison MapANSI
#undef MapRawKey
#pragma GCC poison MapRawKey
#undef SetKeyMapDefault
#pragma GCC poison SetKeyMapDefault

/* layers.library — functions requiring KS 2.0+ */
#undef DoHookClipRects
#pragma GCC poison DoHookClipRects
#undef HideLayer
#pragma GCC poison HideLayer
#undef LayerOccluded
#pragma GCC poison LayerOccluded
#undef SetLayerInfoBounds
#pragma GCC poison SetLayerInfoBounds
#undef ShowLayer
#pragma GCC poison ShowLayer
#undef SortLayerCR
#pragma GCC poison SortLayerCR

/* layout.library — functions requiring KS 2.0+ */
#undef ActivateLayoutGadget
#pragma GCC poison ActivateLayoutGadget
#undef FlushLayoutDomainCache
#pragma GCC poison FlushLayoutDomainCache
#undef LayoutLimits
#pragma GCC poison LayoutLimits
#undef RefreshPageGadget
#pragma GCC poison RefreshPageGadget
#undef RethinkLayout
#pragma GCC poison RethinkLayout
#undef SetPageGadgetAttrs
#pragma GCC poison SetPageGadgetAttrs
#undef SetPageGadgetAttrsA
#pragma GCC poison SetPageGadgetAttrsA

/* listbrowser.library — functions requiring KS 2.0+ */
#undef FreeLBColumnInfo
#pragma GCC poison FreeLBColumnInfo
#undef FreeListBrowserList
#pragma GCC poison FreeListBrowserList
#undef FreeListBrowserNode
#pragma GCC poison FreeListBrowserNode
#undef GetLBColumnInfoAttrs
#pragma GCC poison GetLBColumnInfoAttrs
#undef GetLBColumnInfoAttrsA
#pragma GCC poison GetLBColumnInfoAttrsA
#undef GetListBrowserNodeAttrs
#pragma GCC poison GetListBrowserNodeAttrs
#undef GetListBrowserNodeAttrsA
#pragma GCC poison GetListBrowserNodeAttrsA
#undef HideAllListBrowserChildren
#pragma GCC poison HideAllListBrowserChildren
#undef HideListBrowserNodeChildren
#pragma GCC poison HideListBrowserNodeChildren
#undef ListBrowserClearAll
#pragma GCC poison ListBrowserClearAll
#undef ListBrowserSelectAll
#pragma GCC poison ListBrowserSelectAll
#undef SetLBColumnInfoAttrs
#pragma GCC poison SetLBColumnInfoAttrs
#undef SetLBColumnInfoAttrsA
#pragma GCC poison SetLBColumnInfoAttrsA
#undef SetListBrowserNodeAttrs
#pragma GCC poison SetListBrowserNodeAttrs
#undef SetListBrowserNodeAttrsA
#pragma GCC poison SetListBrowserNodeAttrsA
#undef ShowAllListBrowserChildren
#pragma GCC poison ShowAllListBrowserChildren
#undef ShowListBrowserNodeChildren
#pragma GCC poison ShowListBrowserNodeChildren

/* lowlevel.library — functions requiring KS 2.0+ */
#undef GetLanguageSelection
#pragma GCC poison GetLanguageSelection
#undef ReadJoyPort
#pragma GCC poison ReadJoyPort

/* nonvolatile.library — functions requiring KS 2.0+ */
#undef DeleteNV
#pragma GCC poison DeleteNV
#undef FreeNVData
#pragma GCC poison FreeNVData
#undef GetCopyNV
#pragma GCC poison GetCopyNV
#undef SetNVProtection
#pragma GCC poison SetNVProtection
#undef StoreNV
#pragma GCC poison StoreNV

/* radiobutton.library — functions requiring KS 2.0+ */
#undef FreeRadioButtonNode
#pragma GCC poison FreeRadioButtonNode
#undef GetRadioButtonNodeAttrs
#pragma GCC poison GetRadioButtonNodeAttrs
#undef GetRadioButtonNodeAttrsA
#pragma GCC poison GetRadioButtonNodeAttrsA
#undef SetRadioButtonNodeAttrs
#pragma GCC poison SetRadioButtonNodeAttrs
#undef SetRadioButtonNodeAttrsA
#pragma GCC poison SetRadioButtonNodeAttrsA

/* ramdrive.library — functions requiring KS 2.0+ */
#undef KillRAD
#pragma GCC poison KillRAD

/* realtime.library — functions requiring KS 2.0+ */
#undef DeletePlayer
#pragma GCC poison DeletePlayer
#undef ExternalSync
#pragma GCC poison ExternalSync
#undef GetPlayerAttrs
#pragma GCC poison GetPlayerAttrs
#undef GetPlayerAttrsA
#pragma GCC poison GetPlayerAttrsA
#undef LockRealTime
#pragma GCC poison LockRealTime
#undef SetConductorState
#pragma GCC poison SetConductorState
#undef SetPlayerAttrs
#pragma GCC poison SetPlayerAttrs
#undef SetPlayerAttrsA
#pragma GCC poison SetPlayerAttrsA
#undef UnlockRealTime
#pragma GCC poison UnlockRealTime

/* speedbar.library — functions requiring KS 2.0+ */
#undef FreeSpeedButtonNode
#pragma GCC poison FreeSpeedButtonNode
#undef GetSpeedButtonNodeAttrs
#pragma GCC poison GetSpeedButtonNodeAttrs
#undef GetSpeedButtonNodeAttrsA
#pragma GCC poison GetSpeedButtonNodeAttrsA
#undef SetSpeedButtonNodeAttrs
#pragma GCC poison SetSpeedButtonNodeAttrs
#undef SetSpeedButtonNodeAttrsA
#pragma GCC poison SetSpeedButtonNodeAttrsA

/* texteditor.library — functions requiring KS 2.0+ */
#undef HighlightSetFormat
#pragma GCC poison HighlightSetFormat

/* utility.library — functions requiring KS 2.0+ */
#undef AddNamedObject
#pragma GCC poison AddNamedObject
#undef Amiga2Date
#pragma GCC poison Amiga2Date
#undef ApplyTagChanges
#pragma GCC poison ApplyTagChanges
#undef AttemptRemNamedObject
#pragma GCC poison AttemptRemNamedObject
#undef CallHookPkt
#pragma GCC poison CallHookPkt
#undef CheckDate
#pragma GCC poison CheckDate
#undef Date2Amiga
#pragma GCC poison Date2Amiga
#undef FilterTagChanges
#pragma GCC poison FilterTagChanges
#undef FilterTagItems
#pragma GCC poison FilterTagItems
#undef FreeNamedObject
#pragma GCC poison FreeNamedObject
#undef FreeTagItems
#pragma GCC poison FreeTagItems
#undef GetTagData
#pragma GCC poison GetTagData
#undef GetUniqueID
#pragma GCC poison GetUniqueID
#undef MapTags
#pragma GCC poison MapTags
#undef NamedObjectName
#pragma GCC poison NamedObjectName
#undef PackBoolTags
#pragma GCC poison PackBoolTags
#undef PackStructureTags
#pragma GCC poison PackStructureTags
#undef RefreshTagItemClones
#pragma GCC poison RefreshTagItemClones
#undef ReleaseNamedObject
#pragma GCC poison ReleaseNamedObject
#undef RemNamedObject
#pragma GCC poison RemNamedObject
#undef SDivMod32
#pragma GCC poison SDivMod32
#undef SDivMod64
#pragma GCC poison SDivMod64
#undef SMult32
#pragma GCC poison SMult32
#undef SMult64
#pragma GCC poison SMult64
#undef SNPrintf
#pragma GCC poison SNPrintf
#undef Stricmp
#pragma GCC poison Stricmp
#undef Strncat
#pragma GCC poison Strncat
#undef Strncpy
#pragma GCC poison Strncpy
#undef Strnicmp
#pragma GCC poison Strnicmp
#undef TagInArray
#pragma GCC poison TagInArray
#undef ToLower
#pragma GCC poison ToLower
#undef ToUpper
#pragma GCC poison ToUpper
#undef UDivMod32
#pragma GCC poison UDivMod32
#undef UDivMod64
#pragma GCC poison UDivMod64
#undef UMult32
#pragma GCC poison UMult32
#undef UMult64
#pragma GCC poison UMult64
#undef UnpackStructureTags
#pragma GCC poison UnpackStructureTags
#undef VSNPrintf
#pragma GCC poison VSNPrintf

/* virtual.library — functions requiring KS 2.0+ */
#undef RefreshVirtualGadget
#pragma GCC poison RefreshVirtualGadget
#undef RethinkVirtualSize
#pragma GCC poison RethinkVirtualSize

/* wb.library — functions requiring KS 2.0+ */
#undef AddAppWindowDropZone
#pragma GCC poison AddAppWindowDropZone
#undef AddAppWindowDropZoneA
#pragma GCC poison AddAppWindowDropZoneA
#undef ChangeWorkbenchSelection
#pragma GCC poison ChangeWorkbenchSelection
#undef ChangeWorkbenchSelectionA
#pragma GCC poison ChangeWorkbenchSelectionA
#undef CloseWorkbenchObject
#pragma GCC poison CloseWorkbenchObject
#undef CloseWorkbenchObjectA
#pragma GCC poison CloseWorkbenchObjectA
#undef MakeWorkbenchObjectVisible
#pragma GCC poison MakeWorkbenchObjectVisible
#undef MakeWorkbenchObjectVisibleA
#pragma GCC poison MakeWorkbenchObjectVisibleA
#undef OpenWorkbenchObject
#pragma GCC poison OpenWorkbenchObject
#undef OpenWorkbenchObjectA
#pragma GCC poison OpenWorkbenchObjectA
#undef RemoveAppWindowDropZone
#pragma GCC poison RemoveAppWindowDropZone
#undef UpdateWorkbench
#pragma GCC poison UpdateWorkbench
#undef WhichWorkbenchObject
#pragma GCC poison WhichWorkbenchObject
#undef WhichWorkbenchObjectA
#pragma GCC poison WhichWorkbenchObjectA
#undef WorkbenchControl
#pragma GCC poison WorkbenchControl
#undef WorkbenchControlA
#pragma GCC poison WorkbenchControlA

#endif /* __GNUC__ */
#endif /* KS13_COMPAT_H */
