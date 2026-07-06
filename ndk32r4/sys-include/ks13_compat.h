/* ks13_compat.h
 *
 * Automatically generated compile-time compatibility warnings for
 * AmigaOS functions not available on Kickstart 1.3 (version 33).
 *
 * Include this header when building software that must run on KS 1.3:
 *
 *   #include <ks13_compat.h>
 *
 * Any call to a KS 2.0+ function will generate a compiler warning.
 * Generated from NDK 3.2R4 SFD files by gen_ks13_compat.py
 */

#ifndef KS13_COMPAT_H
#define KS13_COMPAT_H

#ifdef __GNUC__

/* asl.library — functions requiring KS 2.0+ */
#pragma GCC poison AllocAslRequest
#pragma GCC poison AllocAslRequestTags
#pragma GCC poison AslRequest
#pragma GCC poison AslRequestTags
#pragma GCC poison FreeAslRequest
#pragma GCC poison FreeFileRequest
#pragma GCC poison RequestFile

/* chooser.library — functions requiring KS 2.0+ */
#pragma GCC poison FreeChooserNode
#pragma GCC poison GetChooserNodeAttrs
#pragma GCC poison GetChooserNodeAttrsA
#pragma GCC poison HideChooser
#pragma GCC poison SetChooserNodeAttrs
#pragma GCC poison SetChooserNodeAttrsA
#pragma GCC poison ShowChooser

/* clicktab.library — functions requiring KS 2.0+ */
#pragma GCC poison FreeClickTabNode
#pragma GCC poison GetClickTabNodeAttrs
#pragma GCC poison GetClickTabNodeAttrsA
#pragma GCC poison SetClickTabNodeAttrs
#pragma GCC poison SetClickTabNodeAttrsA

/* colorwheel.library — functions requiring KS 2.0+ */
#pragma GCC poison ConvertHSBToRGB
#pragma GCC poison ConvertRGBToHSB

/* commodities.library — functions requiring KS 2.0+ */
#pragma GCC poison ActivateCxObj
#pragma GCC poison AttachCxObj
#pragma GCC poison ClearCxObjError
#pragma GCC poison CxObjError
#pragma GCC poison CxObjType
#pragma GCC poison DeleteCxObj
#pragma GCC poison DeleteCxObjAll
#pragma GCC poison EnqueueCxObj
#pragma GCC poison InsertCxObj
#pragma GCC poison MatchIX
#pragma GCC poison RemoveCxObj
#pragma GCC poison SetCxObjPri

/* datebrowser.library — functions requiring KS 2.0+ */
#pragma GCC poison JulianLeapYear
#pragma GCC poison JulianMonthDays
#pragma GCC poison JulianWeekDay

/* disk.library — functions requiring KS 2.0+ */
#pragma GCC poison ReadUnitID

/* diskfont.library — functions requiring KS 2.0+ */
#pragma GCC poison CloseOutlineFont
#pragma GCC poison ECloseEngine
#pragma GCC poison EObtainInfo
#pragma GCC poison EObtainInfoA
#pragma GCC poison EOpenEngine
#pragma GCC poison EReleaseInfo
#pragma GCC poison EReleaseInfoA
#pragma GCC poison ESetInfo
#pragma GCC poison ESetInfoA
#pragma GCC poison GetDiskFontCtrl
#pragma GCC poison ObtainCharsetInfo
#pragma GCC poison SetDiskFontCtrl
#pragma GCC poison SetDiskFontCtrlA
#pragma GCC poison WriteDiskFontHeader
#pragma GCC poison WriteDiskFontHeaderA
#pragma GCC poison WriteFontContents

/* dos.library — functions requiring KS 2.0+ */
#pragma GCC poison AbortPkt
#pragma GCC poison AddBuffers
#pragma GCC poison AddDosEntry
#pragma GCC poison AddSegment
#pragma GCC poison AllocDosObject
#pragma GCC poison AllocDosObjectTagList
#pragma GCC poison AllocDosObjectTags
#pragma GCC poison AssignAdd
#pragma GCC poison AssignLate
#pragma GCC poison AssignLock
#pragma GCC poison AssignPath
#pragma GCC poison ChangeMode
#pragma GCC poison CheckSignal
#pragma GCC poison CompareDates
#pragma GCC poison DateToStr
#pragma GCC poison DoPkt
#pragma GCC poison DoPkt0
#pragma GCC poison DoPkt1
#pragma GCC poison DoPkt2
#pragma GCC poison DoPkt3
#pragma GCC poison DoPkt4
#pragma GCC poison DupLockFromFH
#pragma GCC poison ErrorReport
#pragma GCC poison ExAll
#pragma GCC poison ExamineFH
#pragma GCC poison FGetC
#pragma GCC poison FGets
#pragma GCC poison FPrintf
#pragma GCC poison FPutC
#pragma GCC poison FPuts
#pragma GCC poison FRead
#pragma GCC poison FWrite
#pragma GCC poison FWritef
#pragma GCC poison Fault
#pragma GCC poison FindArg
#pragma GCC poison Flush
#pragma GCC poison Format
#pragma GCC poison FreeDeviceProc
#pragma GCC poison FreeDosEntry
#pragma GCC poison FreeDosObject
#pragma GCC poison GetArgStr
#pragma GCC poison GetCurrentDirName
#pragma GCC poison GetProgramDir
#pragma GCC poison GetProgramName
#pragma GCC poison GetPrompt
#pragma GCC poison Inhibit
#pragma GCC poison InternalLoadSeg
#pragma GCC poison InternalUnLoadSeg
#pragma GCC poison IsFileSystem
#pragma GCC poison LockRecord
#pragma GCC poison LockRecords
#pragma GCC poison MakeLink
#pragma GCC poison MatchEnd
#pragma GCC poison MatchFirst
#pragma GCC poison MatchNext
#pragma GCC poison MatchPattern
#pragma GCC poison MaxCli
#pragma GCC poison NameFromFH
#pragma GCC poison NameFromLock
#pragma GCC poison NewLoadSeg
#pragma GCC poison NewLoadSegTagList
#pragma GCC poison NewLoadSegTags
#pragma GCC poison OpenFromLock
#pragma GCC poison ParentOfFH
#pragma GCC poison ParsePattern
#pragma GCC poison PrintFault
#pragma GCC poison ReadItem
#pragma GCC poison ReadLink
#pragma GCC poison Relabel
#pragma GCC poison RemAssignList
#pragma GCC poison RemDosEntry
#pragma GCC poison RemSegment
#pragma GCC poison ReplyPkt
#pragma GCC poison RunCommand
#pragma GCC poison SameLock
#pragma GCC poison SelectInput
#pragma GCC poison SelectOutput
#pragma GCC poison SendPkt
#pragma GCC poison SetArgStr
#pragma GCC poison SetCurrentDirName
#pragma GCC poison SetFileDate
#pragma GCC poison SetFileSize
#pragma GCC poison SetIoErr
#pragma GCC poison SetMode
#pragma GCC poison SetProgramDir
#pragma GCC poison SetProgramName
#pragma GCC poison SetPrompt
#pragma GCC poison SetVBuf
#pragma GCC poison SplitName
#pragma GCC poison StrToDate
#pragma GCC poison StrToLong
#pragma GCC poison System
#pragma GCC poison SystemTagList
#pragma GCC poison SystemTags
#pragma GCC poison UnGetC
#pragma GCC poison UnLockDosList
#pragma GCC poison UnLockRecord
#pragma GCC poison UnLockRecords
#pragma GCC poison VFPrintf
#pragma GCC poison VFWritef

/* exec.library — functions requiring KS 2.0+ */
#pragma GCC poison AddMemHandler
#pragma GCC poison AllocPooled
#pragma GCC poison AllocVec
#pragma GCC poison AttemptSemaphoreShared
#pragma GCC poison CacheClearE
#pragma GCC poison CacheClearU
#pragma GCC poison CacheControl
#pragma GCC poison ColdReboot
#pragma GCC poison CreateIORequest
#pragma GCC poison CreatePool
#pragma GCC poison DeleteIORequest
#pragma GCC poison DeleteMsgPort
#pragma GCC poison DeletePool
#pragma GCC poison FreePooled
#pragma GCC poison FreeVec
#pragma GCC poison NewMinList
#pragma GCC poison ObtainQuickVector
#pragma GCC poison ObtainSemaphoreShared
#pragma GCC poison RemMemHandler
#pragma GCC poison StackSwap

/* expansion.library — functions requiring KS 2.0+ */
#pragma GCC poison AddBootNode

/* gadtools.library — functions requiring KS 2.0+ */
#pragma GCC poison DrawBevelBox
#pragma GCC poison DrawBevelBoxA
#pragma GCC poison FreeGadgets
#pragma GCC poison FreeMenus
#pragma GCC poison FreeVisualInfo
#pragma GCC poison GT_BeginRefresh
#pragma GCC poison GT_EndRefresh
#pragma GCC poison GT_GetGadgetAttrs
#pragma GCC poison GT_GetGadgetAttrsA
#pragma GCC poison GT_RefreshWindow
#pragma GCC poison GT_ReplyIMsg
#pragma GCC poison GT_SetGadgetAttrs
#pragma GCC poison GT_SetGadgetAttrsA
#pragma GCC poison GetVisualInfo
#pragma GCC poison GetVisualInfoA
#pragma GCC poison LayoutMenuItems
#pragma GCC poison LayoutMenuItemsA
#pragma GCC poison LayoutMenus
#pragma GCC poison LayoutMenusA
#pragma GCC poison ScaleGadgetRect
#pragma GCC poison ScaleGadgetRectA
#pragma GCC poison SetDesignFont
#pragma GCC poison SetDesignFontA

/* graphics.library — functions requiring KS 2.0+ */
#pragma GCC poison AttachPalExtra
#pragma GCC poison BitMapScale
#pragma GCC poison CalcIVG
#pragma GCC poison CloseMonitor
#pragma GCC poison FindDisplayInfo
#pragma GCC poison GfxAssociate
#pragma GCC poison GfxFree
#pragma GCC poison GfxLookUp
#pragma GCC poison GfxNew
#pragma GCC poison NextDisplayInfo
#pragma GCC poison ObtainBestPen
#pragma GCC poison ObtainBestPenA
#pragma GCC poison ScalerDiv
#pragma GCC poison TextExtent
#pragma GCC poison TextFit
#pragma GCC poison VideoControl
#pragma GCC poison VideoControlTags
#pragma GCC poison WriteChunkyPixels

/* icon.library — functions requiring KS 2.0+ */
#pragma GCC poison BumpRevisionLength
#pragma GCC poison ChangeToSelectedIconColor
#pragma GCC poison DeleteDiskObject
#pragma GCC poison DrawIconState
#pragma GCC poison DrawIconStateA
#pragma GCC poison DupDiskObject
#pragma GCC poison DupDiskObjectA
#pragma GCC poison FreeFree
#pragma GCC poison GetIconRectangle
#pragma GCC poison GetIconRectangleA
#pragma GCC poison IconControl
#pragma GCC poison IconControlA
#pragma GCC poison LayoutIcon
#pragma GCC poison LayoutIconA
#pragma GCC poison PutDefDiskObject
#pragma GCC poison PutIconTagList
#pragma GCC poison PutIconTags

/* iffparse.library — functions requiring KS 2.0+ */
#pragma GCC poison CloseClipboard
#pragma GCC poison CloseIFF
#pragma GCC poison CollectionChunk
#pragma GCC poison CollectionChunks
#pragma GCC poison EntryHandler
#pragma GCC poison ExitHandler
#pragma GCC poison FreeIFF
#pragma GCC poison FreeLocalItem
#pragma GCC poison GoodID
#pragma GCC poison GoodType
#pragma GCC poison IDtoStr
#pragma GCC poison InitIFF
#pragma GCC poison InitIFFasClip
#pragma GCC poison InitIFFasDOS
#pragma GCC poison LocalItemData
#pragma GCC poison OpenIFF
#pragma GCC poison ParseIFF
#pragma GCC poison PopChunk
#pragma GCC poison PropChunk
#pragma GCC poison PropChunks
#pragma GCC poison PushChunk
#pragma GCC poison ReadChunkBytes
#pragma GCC poison ReadChunkRecords
#pragma GCC poison SetLocalItemPurge
#pragma GCC poison StopChunk
#pragma GCC poison StopChunks
#pragma GCC poison StopOnExit
#pragma GCC poison StoreItemInContext
#pragma GCC poison StoreLocalItem
#pragma GCC poison WriteChunkBytes
#pragma GCC poison WriteChunkRecords

/* input.library — functions requiring KS 2.0+ */
#pragma GCC poison PeekQualifier

/* intuition.library — functions requiring KS 2.0+ */
#pragma GCC poison ChangeScreenBuffer
#pragma GCC poison ChangeWindowBox
#pragma GCC poison DoGadgetMethod
#pragma GCC poison DoGadgetMethodA
#pragma GCC poison FreeScreenBuffer
#pragma GCC poison GadgetMouse
#pragma GCC poison HelpControl
#pragma GCC poison HideWindow
#pragma GCC poison IntuitionControl
#pragma GCC poison IntuitionControlA
#pragma GCC poison LendMenus
#pragma GCC poison MoveWindowInFrontOf
#pragma GCC poison NextPubScreen
#pragma GCC poison PubScreenStatus
#pragma GCC poison QueryOverscan
#pragma GCC poison ReleaseGIRPort
#pragma GCC poison ScreenDepth
#pragma GCC poison ScreenPosition
#pragma GCC poison ScrollWindowRaster
#pragma GCC poison SetDefaultPubScreen
#pragma GCC poison SetMouseQueue
#pragma GCC poison SetPubScreenModes
#pragma GCC poison SetWindowPointer
#pragma GCC poison SetWindowPointerA
#pragma GCC poison ShowWindow
#pragma GCC poison TimedDisplayAlert
#pragma GCC poison UnlockPubScreen
#pragma GCC poison UnlockPubScreenList
#pragma GCC poison ZipWindow

/* keymap.library — functions requiring KS 2.0+ */
#pragma GCC poison MapANSI
#pragma GCC poison MapRawKey
#pragma GCC poison SetKeyMapDefault

/* layers.library — functions requiring KS 2.0+ */
#pragma GCC poison DoHookClipRects
#pragma GCC poison HideLayer
#pragma GCC poison LayerOccluded
#pragma GCC poison SetLayerInfoBounds
#pragma GCC poison ShowLayer
#pragma GCC poison SortLayerCR

/* layout.library — functions requiring KS 2.0+ */
#pragma GCC poison ActivateLayoutGadget
#pragma GCC poison FlushLayoutDomainCache
#pragma GCC poison LayoutLimits
#pragma GCC poison RefreshPageGadget
#pragma GCC poison RethinkLayout
#pragma GCC poison SetPageGadgetAttrs
#pragma GCC poison SetPageGadgetAttrsA

/* listbrowser.library — functions requiring KS 2.0+ */
#pragma GCC poison FreeLBColumnInfo
#pragma GCC poison FreeListBrowserList
#pragma GCC poison FreeListBrowserNode
#pragma GCC poison GetLBColumnInfoAttrs
#pragma GCC poison GetLBColumnInfoAttrsA
#pragma GCC poison GetListBrowserNodeAttrs
#pragma GCC poison GetListBrowserNodeAttrsA
#pragma GCC poison HideAllListBrowserChildren
#pragma GCC poison HideListBrowserNodeChildren
#pragma GCC poison ListBrowserClearAll
#pragma GCC poison ListBrowserSelectAll
#pragma GCC poison SetLBColumnInfoAttrs
#pragma GCC poison SetLBColumnInfoAttrsA
#pragma GCC poison SetListBrowserNodeAttrs
#pragma GCC poison SetListBrowserNodeAttrsA
#pragma GCC poison ShowAllListBrowserChildren
#pragma GCC poison ShowListBrowserNodeChildren

/* lowlevel.library — functions requiring KS 2.0+ */
#pragma GCC poison GetLanguageSelection
#pragma GCC poison ReadJoyPort

/* nonvolatile.library — functions requiring KS 2.0+ */
#pragma GCC poison DeleteNV
#pragma GCC poison FreeNVData
#pragma GCC poison GetCopyNV
#pragma GCC poison SetNVProtection
#pragma GCC poison StoreNV

/* radiobutton.library — functions requiring KS 2.0+ */
#pragma GCC poison FreeRadioButtonNode
#pragma GCC poison GetRadioButtonNodeAttrs
#pragma GCC poison GetRadioButtonNodeAttrsA
#pragma GCC poison SetRadioButtonNodeAttrs
#pragma GCC poison SetRadioButtonNodeAttrsA

/* ramdrive.library — functions requiring KS 2.0+ */
#pragma GCC poison KillRAD

/* realtime.library — functions requiring KS 2.0+ */
#pragma GCC poison DeletePlayer
#pragma GCC poison ExternalSync
#pragma GCC poison GetPlayerAttrs
#pragma GCC poison GetPlayerAttrsA
#pragma GCC poison LockRealTime
#pragma GCC poison SetConductorState
#pragma GCC poison SetPlayerAttrs
#pragma GCC poison SetPlayerAttrsA
#pragma GCC poison UnlockRealTime

/* speedbar.library — functions requiring KS 2.0+ */
#pragma GCC poison FreeSpeedButtonNode
#pragma GCC poison GetSpeedButtonNodeAttrs
#pragma GCC poison GetSpeedButtonNodeAttrsA
#pragma GCC poison SetSpeedButtonNodeAttrs
#pragma GCC poison SetSpeedButtonNodeAttrsA

/* texteditor.library — functions requiring KS 2.0+ */
#pragma GCC poison HighlightSetFormat

/* utility.library — functions requiring KS 2.0+ */
#pragma GCC poison AddNamedObject
#pragma GCC poison Amiga2Date
#pragma GCC poison ApplyTagChanges
#pragma GCC poison AttemptRemNamedObject
#pragma GCC poison CallHookPkt
#pragma GCC poison CheckDate
#pragma GCC poison Date2Amiga
#pragma GCC poison FilterTagChanges
#pragma GCC poison FilterTagItems
#pragma GCC poison FreeNamedObject
#pragma GCC poison FreeTagItems
#pragma GCC poison GetTagData
#pragma GCC poison GetUniqueID
#pragma GCC poison MapTags
#pragma GCC poison NamedObjectName
#pragma GCC poison PackBoolTags
#pragma GCC poison PackStructureTags
#pragma GCC poison RefreshTagItemClones
#pragma GCC poison ReleaseNamedObject
#pragma GCC poison RemNamedObject
#pragma GCC poison SDivMod32
#pragma GCC poison SDivMod64
#pragma GCC poison SMult32
#pragma GCC poison SMult64
#pragma GCC poison SNPrintf
#pragma GCC poison Stricmp
#pragma GCC poison Strncat
#pragma GCC poison Strncpy
#pragma GCC poison Strnicmp
#pragma GCC poison TagInArray
#pragma GCC poison ToLower
#pragma GCC poison ToUpper
#pragma GCC poison UDivMod32
#pragma GCC poison UDivMod64
#pragma GCC poison UMult32
#pragma GCC poison UMult64
#pragma GCC poison UnpackStructureTags
#pragma GCC poison VSNPrintf

/* virtual.library — functions requiring KS 2.0+ */
#pragma GCC poison RefreshVirtualGadget
#pragma GCC poison RethinkVirtualSize

/* wb.library — functions requiring KS 2.0+ */
#pragma GCC poison AddAppWindowDropZone
#pragma GCC poison AddAppWindowDropZoneA
#pragma GCC poison ChangeWorkbenchSelection
#pragma GCC poison ChangeWorkbenchSelectionA
#pragma GCC poison CloseWorkbenchObject
#pragma GCC poison CloseWorkbenchObjectA
#pragma GCC poison MakeWorkbenchObjectVisible
#pragma GCC poison MakeWorkbenchObjectVisibleA
#pragma GCC poison OpenWorkbenchObject
#pragma GCC poison OpenWorkbenchObjectA
#pragma GCC poison RemoveAppWindowDropZone
#pragma GCC poison UpdateWorkbench
#pragma GCC poison WhichWorkbenchObject
#pragma GCC poison WhichWorkbenchObjectA
#pragma GCC poison WorkbenchControl
#pragma GCC poison WorkbenchControlA

#endif /* __GNUC__ */
#endif /* KS13_COMPAT_H */
