/* ks13_compat.h
 *
 * Automatically generated compile-time compatibility guard for AmigaOS
 * functions not available on Kickstart 1.3 (exec/dos version 33).
 *
 * Include this header when building software that must run on KS 1.3:
 *
 *   #include <ks13_compat.h>
 *
 * Any call to a function introduced in Kickstart 2.0 (version 36) or
 * later becomes a hard compile error via #pragma GCC poison.
 *
 * Each name is #undef'd immediately before it is poisoned. The NDK proto/
 * inline headers define many of these as function-like macros; poisoning a
 * name that is currently a macro otherwise emits a 'poisoning existing macro'
 * warning for every such name. #undef removes the macro first, so the poison
 * applies cleanly to the bare identifier (which is what catches a call) with
 * no warning.
 *
 * Generated from the NDK 3.2R4 SFD files by gen_ks13_compat.py.
 */

#ifndef KS13_COMPAT_H
#define KS13_COMPAT_H

#ifdef __GNUC__

/* amigaguide.library — functions requiring KS 2.0+ */
#undef AddAmigaGuideHost
#pragma GCC poison AddAmigaGuideHost
#undef AddAmigaGuideHostA
#pragma GCC poison AddAmigaGuideHostA
#undef AmigaGuideSignal
#pragma GCC poison AmigaGuideSignal
#undef CloseAmigaGuide
#pragma GCC poison CloseAmigaGuide
#undef ExpungeXRef
#pragma GCC poison ExpungeXRef
#undef GetAmigaGuideAttr
#pragma GCC poison GetAmigaGuideAttr
#undef GetAmigaGuideMsg
#pragma GCC poison GetAmigaGuideMsg
#undef GetAmigaGuideString
#pragma GCC poison GetAmigaGuideString
#undef LoadXRef
#pragma GCC poison LoadXRef
#undef LockAmigaGuideBase
#pragma GCC poison LockAmigaGuideBase
#undef OpenAmigaGuide
#pragma GCC poison OpenAmigaGuide
#undef OpenAmigaGuideA
#pragma GCC poison OpenAmigaGuideA
#undef OpenAmigaGuideAsync
#pragma GCC poison OpenAmigaGuideAsync
#undef OpenAmigaGuideAsyncA
#pragma GCC poison OpenAmigaGuideAsyncA
#undef RemoveAmigaGuideHost
#pragma GCC poison RemoveAmigaGuideHost
#undef RemoveAmigaGuideHostA
#pragma GCC poison RemoveAmigaGuideHostA
#undef ReplyAmigaGuideMsg
#pragma GCC poison ReplyAmigaGuideMsg
#undef SendAmigaGuideCmd
#pragma GCC poison SendAmigaGuideCmd
#undef SendAmigaGuideCmdA
#pragma GCC poison SendAmigaGuideCmdA
#undef SendAmigaGuideContext
#pragma GCC poison SendAmigaGuideContext
#undef SendAmigaGuideContextA
#pragma GCC poison SendAmigaGuideContextA
#undef SetAmigaGuideAttrs
#pragma GCC poison SetAmigaGuideAttrs
#undef SetAmigaGuideAttrsA
#pragma GCC poison SetAmigaGuideAttrsA
#undef SetAmigaGuideContext
#pragma GCC poison SetAmigaGuideContext
#undef SetAmigaGuideContextA
#pragma GCC poison SetAmigaGuideContextA
#undef UnlockAmigaGuideBase
#pragma GCC poison UnlockAmigaGuideBase

/* arexx.library — functions requiring KS 2.0+ */
#undef AREXX_GetClass
#pragma GCC poison AREXX_GetClass

/* asl.library — functions requiring KS 2.0+ */
#undef AbortAslRequest
#pragma GCC poison AbortAslRequest
#undef ActivateAslRequest
#pragma GCC poison ActivateAslRequest
#undef AllocAslRequest
#pragma GCC poison AllocAslRequest
#undef AllocAslRequestTags
#pragma GCC poison AllocAslRequestTags
#undef AllocFileRequest
#pragma GCC poison AllocFileRequest
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

/* bevel.library — functions requiring KS 2.0+ */
#undef BEVEL_GetClass
#pragma GCC poison BEVEL_GetClass

/* bitmap.library — functions requiring KS 2.0+ */
#undef BITMAP_GetClass
#pragma GCC poison BITMAP_GetClass

/* button.library — functions requiring KS 2.0+ */
#undef BUTTON_GetClass
#pragma GCC poison BUTTON_GetClass

/* checkbox.library — functions requiring KS 2.0+ */
#undef CHECKBOX_GetClass
#pragma GCC poison CHECKBOX_GetClass

/* chooser.library — functions requiring KS 2.0+ */
#undef AllocChooserNode
#pragma GCC poison AllocChooserNode
#undef AllocChooserNodeA
#pragma GCC poison AllocChooserNodeA
#undef CHOOSER_GetClass
#pragma GCC poison CHOOSER_GetClass
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
#undef AllocClickTabNode
#pragma GCC poison AllocClickTabNode
#undef AllocClickTabNodeA
#pragma GCC poison AllocClickTabNodeA
#undef CLICKTAB_GetClass
#pragma GCC poison CLICKTAB_GetClass
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
#undef AddIEvents
#pragma GCC poison AddIEvents
#undef AttachCxObj
#pragma GCC poison AttachCxObj
#undef ClearCxObjError
#pragma GCC poison ClearCxObjError
#undef CreateCxObj
#pragma GCC poison CreateCxObj
#undef CxBroker
#pragma GCC poison CxBroker
#undef CxMsgData
#pragma GCC poison CxMsgData
#undef CxMsgID
#pragma GCC poison CxMsgID
#undef CxMsgType
#pragma GCC poison CxMsgType
#undef CxObjError
#pragma GCC poison CxObjError
#undef CxObjType
#pragma GCC poison CxObjType
#undef DeleteCxObj
#pragma GCC poison DeleteCxObj
#undef DeleteCxObjAll
#pragma GCC poison DeleteCxObjAll
#undef DisposeCxMsg
#pragma GCC poison DisposeCxMsg
#undef DivertCxMsg
#pragma GCC poison DivertCxMsg
#undef EnqueueCxObj
#pragma GCC poison EnqueueCxObj
#undef InsertCxObj
#pragma GCC poison InsertCxObj
#undef InvertKeyMap
#pragma GCC poison InvertKeyMap
#undef MatchIX
#pragma GCC poison MatchIX
#undef ParseIX
#pragma GCC poison ParseIX
#undef RemoveCxObj
#pragma GCC poison RemoveCxObj
#undef RouteCxMsg
#pragma GCC poison RouteCxMsg
#undef SetCxObjPri
#pragma GCC poison SetCxObjPri
#undef SetFilter
#pragma GCC poison SetFilter
#undef SetFilterIX
#pragma GCC poison SetFilterIX
#undef SetTranslate
#pragma GCC poison SetTranslate

/* datatypes.library — functions requiring KS 2.0+ */
#undef AddDTObject
#pragma GCC poison AddDTObject
#undef CopyDTMethods
#pragma GCC poison CopyDTMethods
#undef CopyDTTriggerMethods
#pragma GCC poison CopyDTTriggerMethods
#undef DisposeDTObject
#pragma GCC poison DisposeDTObject
#undef DoAsyncLayout
#pragma GCC poison DoAsyncLayout
#undef DoDTMethod
#pragma GCC poison DoDTMethod
#undef DoDTMethodA
#pragma GCC poison DoDTMethodA
#undef FindMethod
#pragma GCC poison FindMethod
#undef FindTriggerMethod
#pragma GCC poison FindTriggerMethod
#undef FreeDTMethods
#pragma GCC poison FreeDTMethods
#undef GetDTAttrs
#pragma GCC poison GetDTAttrs
#undef GetDTAttrsA
#pragma GCC poison GetDTAttrsA
#undef GetDTMethods
#pragma GCC poison GetDTMethods
#undef GetDTString
#pragma GCC poison GetDTString
#undef GetDTTriggerMethodDataFlags
#pragma GCC poison GetDTTriggerMethodDataFlags
#undef GetDTTriggerMethods
#pragma GCC poison GetDTTriggerMethods
#undef NewDTObject
#pragma GCC poison NewDTObject
#undef NewDTObjectA
#pragma GCC poison NewDTObjectA
#undef ObtainDataType
#pragma GCC poison ObtainDataType
#undef ObtainDataTypeA
#pragma GCC poison ObtainDataTypeA
#undef PrintDTObject
#pragma GCC poison PrintDTObject
#undef PrintDTObjectA
#pragma GCC poison PrintDTObjectA
#undef RefreshDTObject
#pragma GCC poison RefreshDTObject
#undef RefreshDTObjectA
#pragma GCC poison RefreshDTObjectA
#undef RefreshDTObjects
#pragma GCC poison RefreshDTObjects
#undef ReleaseDataType
#pragma GCC poison ReleaseDataType
#undef RemoveDTObject
#pragma GCC poison RemoveDTObject
#undef SaveDTObject
#pragma GCC poison SaveDTObject
#undef SaveDTObjectA
#pragma GCC poison SaveDTObjectA
#undef SetDTAttrs
#pragma GCC poison SetDTAttrs
#undef SetDTAttrsA
#pragma GCC poison SetDTAttrsA
#undef StartDragSelect
#pragma GCC poison StartDragSelect

/* datebrowser.library — functions requiring KS 2.0+ */
#undef DATEBROWSER_GetClass
#pragma GCC poison DATEBROWSER_GetClass
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
#undef NewScaledDiskFont
#pragma GCC poison NewScaledDiskFont
#undef ObtainCharsetInfo
#pragma GCC poison ObtainCharsetInfo
#undef OpenOutlineFont
#pragma GCC poison OpenOutlineFont
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
#undef AddPart
#pragma GCC poison AddPart
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
#undef AttemptLockDosList
#pragma GCC poison AttemptLockDosList
#undef ChangeMode
#pragma GCC poison ChangeMode
#undef CheckSignal
#pragma GCC poison CheckSignal
#undef Cli
#pragma GCC poison Cli
#undef CliInitNewcli
#pragma GCC poison CliInitNewcli
#undef CliInitRun
#pragma GCC poison CliInitRun
#undef CompareDates
#pragma GCC poison CompareDates
#undef CreateNewProc
#pragma GCC poison CreateNewProc
#undef CreateNewProcTagList
#pragma GCC poison CreateNewProcTagList
#undef CreateNewProcTags
#pragma GCC poison CreateNewProcTags
#undef DateToStr
#pragma GCC poison DateToStr
#undef DeleteVar
#pragma GCC poison DeleteVar
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
#undef DoShellMethod
#pragma GCC poison DoShellMethod
#undef DoShellMethodTagList
#pragma GCC poison DoShellMethodTagList
#undef DupLockFromFH
#pragma GCC poison DupLockFromFH
#undef EndNotify
#pragma GCC poison EndNotify
#undef ErrorOutput
#pragma GCC poison ErrorOutput
#undef ErrorReport
#pragma GCC poison ErrorReport
#undef ExAll
#pragma GCC poison ExAll
#undef ExAllEnd
#pragma GCC poison ExAllEnd
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
#undef FilePart
#pragma GCC poison FilePart
#undef FindArg
#pragma GCC poison FindArg
#undef FindCliProc
#pragma GCC poison FindCliProc
#undef FindDosEntry
#pragma GCC poison FindDosEntry
#undef FindSegment
#pragma GCC poison FindSegment
#undef FindVar
#pragma GCC poison FindVar
#undef Flush
#pragma GCC poison Flush
#undef Format
#pragma GCC poison Format
#undef FreeArgs
#pragma GCC poison FreeArgs
#undef FreeDeviceProc
#pragma GCC poison FreeDeviceProc
#undef FreeDosEntry
#pragma GCC poison FreeDosEntry
#undef FreeDosObject
#pragma GCC poison FreeDosObject
#undef GetArgStr
#pragma GCC poison GetArgStr
#undef GetConsoleTask
#pragma GCC poison GetConsoleTask
#undef GetCurrentDir
#pragma GCC poison GetCurrentDir
#undef GetCurrentDirName
#pragma GCC poison GetCurrentDirName
#undef GetDeviceProc
#pragma GCC poison GetDeviceProc
#undef GetFileSysTask
#pragma GCC poison GetFileSysTask
#undef GetProgramDir
#pragma GCC poison GetProgramDir
#undef GetProgramName
#pragma GCC poison GetProgramName
#undef GetPrompt
#pragma GCC poison GetPrompt
#undef GetVar
#pragma GCC poison GetVar
#undef Inhibit
#pragma GCC poison Inhibit
#undef InternalLoadSeg
#pragma GCC poison InternalLoadSeg
#undef InternalUnLoadSeg
#pragma GCC poison InternalUnLoadSeg
#undef IsFileSystem
#pragma GCC poison IsFileSystem
#undef LockDosList
#pragma GCC poison LockDosList
#undef LockRecord
#pragma GCC poison LockRecord
#undef LockRecords
#pragma GCC poison LockRecords
#undef MakeDosEntry
#pragma GCC poison MakeDosEntry
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
#undef MatchPatternNoCase
#pragma GCC poison MatchPatternNoCase
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
#undef NextDosEntry
#pragma GCC poison NextDosEntry
#undef OpenFromLock
#pragma GCC poison OpenFromLock
#undef ParentOfFH
#pragma GCC poison ParentOfFH
#undef ParsePattern
#pragma GCC poison ParsePattern
#undef ParsePatternNoCase
#pragma GCC poison ParsePatternNoCase
#undef PathPart
#pragma GCC poison PathPart
#undef PrintFault
#pragma GCC poison PrintFault
#undef Printf
#pragma GCC poison Printf
#undef PutErrStr
#pragma GCC poison PutErrStr
#undef PutStr
#pragma GCC poison PutStr
#undef ReadArgs
#pragma GCC poison ReadArgs
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
#undef SameDevice
#pragma GCC poison SameDevice
#undef SameLock
#pragma GCC poison SameLock
#undef ScanStackToken
#pragma GCC poison ScanStackToken
#undef SelectError
#pragma GCC poison SelectError
#undef SelectInput
#pragma GCC poison SelectInput
#undef SelectOutput
#pragma GCC poison SelectOutput
#undef SendPkt
#pragma GCC poison SendPkt
#undef SetArgStr
#pragma GCC poison SetArgStr
#undef SetConsoleTask
#pragma GCC poison SetConsoleTask
#undef SetCurrentDirName
#pragma GCC poison SetCurrentDirName
#undef SetFileDate
#pragma GCC poison SetFileDate
#undef SetFileSize
#pragma GCC poison SetFileSize
#undef SetFileSysTask
#pragma GCC poison SetFileSysTask
#undef SetIoErr
#pragma GCC poison SetIoErr
#undef SetMode
#pragma GCC poison SetMode
#undef SetOwner
#pragma GCC poison SetOwner
#undef SetProgramDir
#pragma GCC poison SetProgramDir
#undef SetProgramName
#pragma GCC poison SetProgramName
#undef SetPrompt
#pragma GCC poison SetPrompt
#undef SetVBuf
#pragma GCC poison SetVBuf
#undef SetVar
#pragma GCC poison SetVar
#undef SplitName
#pragma GCC poison SplitName
#undef StartNotify
#pragma GCC poison StartNotify
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
#undef VPrintf
#pragma GCC poison VPrintf
#undef VolumeRequestHook
#pragma GCC poison VolumeRequestHook
#undef WaitPkt
#pragma GCC poison WaitPkt
#undef WriteChars
#pragma GCC poison WriteChars

/* drawlist.library — functions requiring KS 2.0+ */
#undef DRAWLIST_GetClass
#pragma GCC poison DRAWLIST_GetClass

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
#undef CachePostDMA
#pragma GCC poison CachePostDMA
#undef CachePreDMA
#pragma GCC poison CachePreDMA
#undef ColdReboot
#pragma GCC poison ColdReboot
#undef CreateIORequest
#pragma GCC poison CreateIORequest
#undef CreateMsgPort
#pragma GCC poison CreateMsgPort
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

/* fuelgauge.library — functions requiring KS 2.0+ */
#undef FUELGAUGE_GetClass
#pragma GCC poison FUELGAUGE_GetClass

/* gadtools.library — functions requiring KS 2.0+ */
#undef CreateContext
#pragma GCC poison CreateContext
#undef CreateGadget
#pragma GCC poison CreateGadget
#undef CreateGadgetA
#pragma GCC poison CreateGadgetA
#undef CreateMenus
#pragma GCC poison CreateMenus
#undef CreateMenusA
#pragma GCC poison CreateMenusA
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
#undef GT_FilterIMsg
#pragma GCC poison GT_FilterIMsg
#undef GT_GetGadgetAttrs
#pragma GCC poison GT_GetGadgetAttrs
#undef GT_GetGadgetAttrsA
#pragma GCC poison GT_GetGadgetAttrsA
#undef GT_GetIMsg
#pragma GCC poison GT_GetIMsg
#undef GT_PostFilterIMsg
#pragma GCC poison GT_PostFilterIMsg
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

/* getcolor.library — functions requiring KS 2.0+ */
#undef GETCOLOR_GetClass
#pragma GCC poison GETCOLOR_GetClass

/* getfile.library — functions requiring KS 2.0+ */
#undef GETFILE_GetClass
#pragma GCC poison GETFILE_GetClass

/* getfont.library — functions requiring KS 2.0+ */
#undef GETFONT_GetClass
#pragma GCC poison GETFONT_GetClass

/* getscreenmode.library — functions requiring KS 2.0+ */
#undef GETSCREENMODE_GetClass
#pragma GCC poison GETSCREENMODE_GetClass

/* glyph.library — functions requiring KS 2.0+ */
#undef GLYPH_GetClass
#pragma GCC poison GLYPH_GetClass

/* graphics.library — functions requiring KS 2.0+ */
#undef AllocBitMap
#pragma GCC poison AllocBitMap
#undef AllocDBufInfo
#pragma GCC poison AllocDBufInfo
#undef AllocSpriteData
#pragma GCC poison AllocSpriteData
#undef AllocSpriteDataA
#pragma GCC poison AllocSpriteDataA
#undef AttachPalExtra
#pragma GCC poison AttachPalExtra
#undef BestModeID
#pragma GCC poison BestModeID
#undef BestModeIDA
#pragma GCC poison BestModeIDA
#undef BitMapScale
#pragma GCC poison BitMapScale
#undef CalcIVG
#pragma GCC poison CalcIVG
#undef ChangeExtSprite
#pragma GCC poison ChangeExtSprite
#undef ChangeExtSpriteA
#pragma GCC poison ChangeExtSpriteA
#undef ChangeVPBitMap
#pragma GCC poison ChangeVPBitMap
#undef CloseMonitor
#pragma GCC poison CloseMonitor
#undef CoerceMode
#pragma GCC poison CoerceMode
#undef EraseRect
#pragma GCC poison EraseRect
#undef ExtendFont
#pragma GCC poison ExtendFont
#undef ExtendFontTags
#pragma GCC poison ExtendFontTags
#undef FindColor
#pragma GCC poison FindColor
#undef FindDisplayInfo
#pragma GCC poison FindDisplayInfo
#undef FontExtent
#pragma GCC poison FontExtent
#undef FreeBitMap
#pragma GCC poison FreeBitMap
#undef FreeDBufInfo
#pragma GCC poison FreeDBufInfo
#undef FreeSpriteData
#pragma GCC poison FreeSpriteData
#undef GetAPen
#pragma GCC poison GetAPen
#undef GetBPen
#pragma GCC poison GetBPen
#undef GetBitMapAttr
#pragma GCC poison GetBitMapAttr
#undef GetDisplayInfoData
#pragma GCC poison GetDisplayInfoData
#undef GetDrMd
#pragma GCC poison GetDrMd
#undef GetExtSprite
#pragma GCC poison GetExtSprite
#undef GetExtSpriteA
#pragma GCC poison GetExtSpriteA
#undef GetOutlinePen
#pragma GCC poison GetOutlinePen
#undef GetRGB32
#pragma GCC poison GetRGB32
#undef GetRPAttrs
#pragma GCC poison GetRPAttrs
#undef GetRPAttrsA
#pragma GCC poison GetRPAttrsA
#undef GetVPModeID
#pragma GCC poison GetVPModeID
#undef GfxAssociate
#pragma GCC poison GfxAssociate
#undef GfxFree
#pragma GCC poison GfxFree
#undef GfxLookUp
#pragma GCC poison GfxLookUp
#undef GfxNew
#pragma GCC poison GfxNew
#undef LoadRGB32
#pragma GCC poison LoadRGB32
#undef ModeNotAvailable
#pragma GCC poison ModeNotAvailable
#undef NextDisplayInfo
#pragma GCC poison NextDisplayInfo
#undef ObtainBestPen
#pragma GCC poison ObtainBestPen
#undef ObtainBestPenA
#pragma GCC poison ObtainBestPenA
#undef ObtainPen
#pragma GCC poison ObtainPen
#undef OpenMonitor
#pragma GCC poison OpenMonitor
#undef ReadPixelArray8
#pragma GCC poison ReadPixelArray8
#undef ReadPixelLine8
#pragma GCC poison ReadPixelLine8
#undef ReleasePen
#pragma GCC poison ReleasePen
#undef ScalerDiv
#pragma GCC poison ScalerDiv
#undef ScrollRasterBF
#pragma GCC poison ScrollRasterBF
#undef SetABPenDrMd
#pragma GCC poison SetABPenDrMd
#undef SetChipRev
#pragma GCC poison SetChipRev
#undef SetMaxPen
#pragma GCC poison SetMaxPen
#undef SetOutlinePen
#pragma GCC poison SetOutlinePen
#undef SetRGB32
#pragma GCC poison SetRGB32
#undef SetRGB32CM
#pragma GCC poison SetRGB32CM
#undef SetRPAttrs
#pragma GCC poison SetRPAttrs
#undef SetRPAttrsA
#pragma GCC poison SetRPAttrsA
#undef SetWriteMask
#pragma GCC poison SetWriteMask
#undef StripFont
#pragma GCC poison StripFont
#undef TextExtent
#pragma GCC poison TextExtent
#undef TextFit
#pragma GCC poison TextFit
#undef VideoControl
#pragma GCC poison VideoControl
#undef VideoControlTags
#pragma GCC poison VideoControlTags
#undef WeighTAMatch
#pragma GCC poison WeighTAMatch
#undef WeighTAMatchTags
#pragma GCC poison WeighTAMatchTags
#undef WriteChunkyPixels
#pragma GCC poison WriteChunkyPixels
#undef WritePixelArray8
#pragma GCC poison WritePixelArray8
#undef WritePixelLine8
#pragma GCC poison WritePixelLine8

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
#undef GetDefDiskObject
#pragma GCC poison GetDefDiskObject
#undef GetDiskObjectNew
#pragma GCC poison GetDiskObjectNew
#undef GetIconRectangle
#pragma GCC poison GetIconRectangle
#undef GetIconRectangleA
#pragma GCC poison GetIconRectangleA
#undef GetIconTagList
#pragma GCC poison GetIconTagList
#undef GetIconTags
#pragma GCC poison GetIconTags
#undef IconControl
#pragma GCC poison IconControl
#undef IconControlA
#pragma GCC poison IconControlA
#undef LayoutIcon
#pragma GCC poison LayoutIcon
#undef LayoutIconA
#pragma GCC poison LayoutIconA
#undef NewDiskObject
#pragma GCC poison NewDiskObject
#undef PutDefDiskObject
#pragma GCC poison PutDefDiskObject
#undef PutIconTagList
#pragma GCC poison PutIconTagList
#undef PutIconTags
#pragma GCC poison PutIconTags

/* iffparse.library — functions requiring KS 2.0+ */
#undef AllocIFF
#pragma GCC poison AllocIFF
#undef AllocLocalItem
#pragma GCC poison AllocLocalItem
#undef CloseClipboard
#pragma GCC poison CloseClipboard
#undef CloseIFF
#pragma GCC poison CloseIFF
#undef CollectionChunk
#pragma GCC poison CollectionChunk
#undef CollectionChunks
#pragma GCC poison CollectionChunks
#undef CurrentChunk
#pragma GCC poison CurrentChunk
#undef EntryHandler
#pragma GCC poison EntryHandler
#undef ExitHandler
#pragma GCC poison ExitHandler
#undef FindCollection
#pragma GCC poison FindCollection
#undef FindLocalItem
#pragma GCC poison FindLocalItem
#undef FindProp
#pragma GCC poison FindProp
#undef FindPropContext
#pragma GCC poison FindPropContext
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
#undef OpenClipboard
#pragma GCC poison OpenClipboard
#undef OpenIFF
#pragma GCC poison OpenIFF
#undef ParentChunk
#pragma GCC poison ParentChunk
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

/* integer.library — functions requiring KS 2.0+ */
#undef INTEGER_GetClass
#pragma GCC poison INTEGER_GetClass

/* intuition.library — functions requiring KS 2.0+ */
#undef AddClass
#pragma GCC poison AddClass
#undef AllocScreenBuffer
#pragma GCC poison AllocScreenBuffer
#undef BuildEasyRequest
#pragma GCC poison BuildEasyRequest
#undef BuildEasyRequestArgs
#pragma GCC poison BuildEasyRequestArgs
#undef ChangeScreenBuffer
#pragma GCC poison ChangeScreenBuffer
#undef ChangeWindowBox
#pragma GCC poison ChangeWindowBox
#undef DisposeObject
#pragma GCC poison DisposeObject
#undef DoGadgetMethod
#pragma GCC poison DoGadgetMethod
#undef DoGadgetMethodA
#pragma GCC poison DoGadgetMethodA
#undef DrawImageState
#pragma GCC poison DrawImageState
#undef EasyRequest
#pragma GCC poison EasyRequest
#undef EasyRequestArgs
#pragma GCC poison EasyRequestArgs
#undef EraseImage
#pragma GCC poison EraseImage
#undef FreeClass
#pragma GCC poison FreeClass
#undef FreeScreenBuffer
#pragma GCC poison FreeScreenBuffer
#undef FreeScreenDrawInfo
#pragma GCC poison FreeScreenDrawInfo
#undef GadgetMouse
#pragma GCC poison GadgetMouse
#undef GetAttr
#pragma GCC poison GetAttr
#undef GetDefaultPubScreen
#pragma GCC poison GetDefaultPubScreen
#undef GetScreenDrawInfo
#pragma GCC poison GetScreenDrawInfo
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
#undef LockPubScreen
#pragma GCC poison LockPubScreen
#undef LockPubScreenList
#pragma GCC poison LockPubScreenList
#undef MakeClass
#pragma GCC poison MakeClass
#undef MoveWindowInFrontOf
#pragma GCC poison MoveWindowInFrontOf
#undef NewObject
#pragma GCC poison NewObject
#undef NewObjectA
#pragma GCC poison NewObjectA
#undef NextObject
#pragma GCC poison NextObject
#undef NextPubScreen
#pragma GCC poison NextPubScreen
#undef ObtainGIRPort
#pragma GCC poison ObtainGIRPort
#undef OpenScreenTagList
#pragma GCC poison OpenScreenTagList
#undef OpenScreenTags
#pragma GCC poison OpenScreenTags
#undef OpenWindowTagList
#pragma GCC poison OpenWindowTagList
#undef OpenWindowTags
#pragma GCC poison OpenWindowTags
#undef PointInImage
#pragma GCC poison PointInImage
#undef PubScreenStatus
#pragma GCC poison PubScreenStatus
#undef QueryOverscan
#pragma GCC poison QueryOverscan
#undef ReleaseGIRPort
#pragma GCC poison ReleaseGIRPort
#undef RemoveClass
#pragma GCC poison RemoveClass
#undef ResetMenuStrip
#pragma GCC poison ResetMenuStrip
#undef ScreenDepth
#pragma GCC poison ScreenDepth
#undef ScreenPosition
#pragma GCC poison ScreenPosition
#undef ScrollWindowRaster
#pragma GCC poison ScrollWindowRaster
#undef SetAttrs
#pragma GCC poison SetAttrs
#undef SetAttrsA
#pragma GCC poison SetAttrsA
#undef SetDefaultPubScreen
#pragma GCC poison SetDefaultPubScreen
#undef SetEditHook
#pragma GCC poison SetEditHook
#undef SetGadgetAttrs
#pragma GCC poison SetGadgetAttrs
#undef SetGadgetAttrsA
#pragma GCC poison SetGadgetAttrsA
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
#undef SysReqHandler
#pragma GCC poison SysReqHandler
#undef TimedDisplayAlert
#pragma GCC poison TimedDisplayAlert
#undef UnlockPubScreen
#pragma GCC poison UnlockPubScreen
#undef UnlockPubScreenList
#pragma GCC poison UnlockPubScreenList
#undef ZipWindow
#pragma GCC poison ZipWindow

/* keymap.library — functions requiring KS 2.0+ */
#undef AskKeyMapDefault
#pragma GCC poison AskKeyMapDefault
#undef MapANSI
#pragma GCC poison MapANSI
#undef MapRawKey
#pragma GCC poison MapRawKey
#undef SetKeyMapDefault
#pragma GCC poison SetKeyMapDefault

/* label.library — functions requiring KS 2.0+ */
#undef LABEL_GetClass
#pragma GCC poison LABEL_GetClass

/* layers.library — functions requiring KS 2.0+ */
#undef DoHookClipRects
#pragma GCC poison DoHookClipRects
#undef HideLayer
#pragma GCC poison HideLayer
#undef InstallLayerInfoHook
#pragma GCC poison InstallLayerInfoHook
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
#undef LAYOUT_GetClass
#pragma GCC poison LAYOUT_GetClass
#undef LayoutLimits
#pragma GCC poison LayoutLimits
#undef PAGE_GetClass
#pragma GCC poison PAGE_GetClass
#undef RefreshPageGadget
#pragma GCC poison RefreshPageGadget
#undef RethinkLayout
#pragma GCC poison RethinkLayout
#undef SetPageGadgetAttrs
#pragma GCC poison SetPageGadgetAttrs
#undef SetPageGadgetAttrsA
#pragma GCC poison SetPageGadgetAttrsA

/* listbrowser.library — functions requiring KS 2.0+ */
#undef AllocLBColumnInfo
#pragma GCC poison AllocLBColumnInfo
#undef AllocLBColumnInfoA
#pragma GCC poison AllocLBColumnInfoA
#undef AllocListBrowserNode
#pragma GCC poison AllocListBrowserNode
#undef AllocListBrowserNodeA
#pragma GCC poison AllocListBrowserNodeA
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
#undef LISTBROWSER_GetClass
#pragma GCC poison LISTBROWSER_GetClass
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

/* listview.library — functions requiring KS 2.0+ */
#undef LISTVIEW_GetClass
#pragma GCC poison LISTVIEW_GetClass

/* locale.library — functions requiring KS 2.0+ */
#undef CloseCatalog
#pragma GCC poison CloseCatalog
#undef CloseLocale
#pragma GCC poison CloseLocale
#undef ConvToLower
#pragma GCC poison ConvToLower
#undef ConvToUpper
#pragma GCC poison ConvToUpper
#undef FormatDate
#pragma GCC poison FormatDate
#undef FormatString
#pragma GCC poison FormatString
#undef GetCatalogStr
#pragma GCC poison GetCatalogStr
#undef GetLocaleStr
#pragma GCC poison GetLocaleStr
#undef IsAlNum
#pragma GCC poison IsAlNum
#undef IsAlpha
#pragma GCC poison IsAlpha
#undef IsCntrl
#pragma GCC poison IsCntrl
#undef IsDigit
#pragma GCC poison IsDigit
#undef IsGraph
#pragma GCC poison IsGraph
#undef IsLower
#pragma GCC poison IsLower
#undef IsPrint
#pragma GCC poison IsPrint
#undef IsPunct
#pragma GCC poison IsPunct
#undef IsSpace
#pragma GCC poison IsSpace
#undef IsUpper
#pragma GCC poison IsUpper
#undef IsXDigit
#pragma GCC poison IsXDigit
#undef OpenCatalog
#pragma GCC poison OpenCatalog
#undef OpenCatalogA
#pragma GCC poison OpenCatalogA
#undef OpenLocale
#pragma GCC poison OpenLocale
#undef ParseDate
#pragma GCC poison ParseDate
#undef StrConvert
#pragma GCC poison StrConvert
#undef StrnCmp
#pragma GCC poison StrnCmp

/* lowlevel.library — functions requiring KS 2.0+ */
#undef AddKBInt
#pragma GCC poison AddKBInt
#undef AddTimerInt
#pragma GCC poison AddTimerInt
#undef AddVBlankInt
#pragma GCC poison AddVBlankInt
#undef ElapsedTime
#pragma GCC poison ElapsedTime
#undef GetKey
#pragma GCC poison GetKey
#undef GetLanguageSelection
#pragma GCC poison GetLanguageSelection
#undef QueryKeys
#pragma GCC poison QueryKeys
#undef ReadJoyPort
#pragma GCC poison ReadJoyPort
#undef RemKBInt
#pragma GCC poison RemKBInt
#undef RemTimerInt
#pragma GCC poison RemTimerInt
#undef RemVBlankInt
#pragma GCC poison RemVBlankInt
#undef SetJoyPortAttrs
#pragma GCC poison SetJoyPortAttrs
#undef SetJoyPortAttrsA
#pragma GCC poison SetJoyPortAttrsA
#undef StartTimerInt
#pragma GCC poison StartTimerInt
#undef StopTimerInt
#pragma GCC poison StopTimerInt
#undef SystemControl
#pragma GCC poison SystemControl
#undef SystemControlA
#pragma GCC poison SystemControlA

/* nonvolatile.library — functions requiring KS 2.0+ */
#undef DeleteNV
#pragma GCC poison DeleteNV
#undef FreeNVData
#pragma GCC poison FreeNVData
#undef GetCopyNV
#pragma GCC poison GetCopyNV
#undef GetNVInfo
#pragma GCC poison GetNVInfo
#undef GetNVList
#pragma GCC poison GetNVList
#undef SetNVProtection
#pragma GCC poison SetNVProtection
#undef StoreNV
#pragma GCC poison StoreNV

/* palette.library — functions requiring KS 2.0+ */
#undef PALETTE_GetClass
#pragma GCC poison PALETTE_GetClass

/* penmap.library — functions requiring KS 2.0+ */
#undef PENMAP_GetClass
#pragma GCC poison PENMAP_GetClass

/* radiobutton.library — functions requiring KS 2.0+ */
#undef AllocRadioButtonNode
#pragma GCC poison AllocRadioButtonNode
#undef AllocRadioButtonNodeA
#pragma GCC poison AllocRadioButtonNodeA
#undef FreeRadioButtonNode
#pragma GCC poison FreeRadioButtonNode
#undef GetRadioButtonNodeAttrs
#pragma GCC poison GetRadioButtonNodeAttrs
#undef GetRadioButtonNodeAttrsA
#pragma GCC poison GetRadioButtonNodeAttrsA
#undef RADIOBUTTON_GetClass
#pragma GCC poison RADIOBUTTON_GetClass
#undef SetRadioButtonNodeAttrs
#pragma GCC poison SetRadioButtonNodeAttrs
#undef SetRadioButtonNodeAttrsA
#pragma GCC poison SetRadioButtonNodeAttrsA

/* ramdrive.library — functions requiring KS 2.0+ */
#undef KillRAD
#pragma GCC poison KillRAD

/* realtime.library — functions requiring KS 2.0+ */
#undef CreatePlayer
#pragma GCC poison CreatePlayer
#undef CreatePlayerA
#pragma GCC poison CreatePlayerA
#undef DeletePlayer
#pragma GCC poison DeletePlayer
#undef ExternalSync
#pragma GCC poison ExternalSync
#undef FindConductor
#pragma GCC poison FindConductor
#undef GetPlayerAttrs
#pragma GCC poison GetPlayerAttrs
#undef GetPlayerAttrsA
#pragma GCC poison GetPlayerAttrsA
#undef LockRealTime
#pragma GCC poison LockRealTime
#undef NextConductor
#pragma GCC poison NextConductor
#undef SetConductorState
#pragma GCC poison SetConductorState
#undef SetPlayerAttrs
#pragma GCC poison SetPlayerAttrs
#undef SetPlayerAttrsA
#pragma GCC poison SetPlayerAttrsA
#undef UnlockRealTime
#pragma GCC poison UnlockRealTime

/* requester.library — functions requiring KS 2.0+ */
#undef REQUESTER_GetClass
#pragma GCC poison REQUESTER_GetClass

/* scroller.library — functions requiring KS 2.0+ */
#undef SCROLLER_GetClass
#pragma GCC poison SCROLLER_GetClass

/* sketchboard.library — functions requiring KS 2.0+ */
#undef SKETCHBOARD_GetClass
#pragma GCC poison SKETCHBOARD_GetClass

/* slider.library — functions requiring KS 2.0+ */
#undef SLIDER_GetClass
#pragma GCC poison SLIDER_GetClass

/* space.library — functions requiring KS 2.0+ */
#undef SPACE_GetClass
#pragma GCC poison SPACE_GetClass

/* speedbar.library — functions requiring KS 2.0+ */
#undef AllocSpeedButtonNode
#pragma GCC poison AllocSpeedButtonNode
#undef AllocSpeedButtonNodeA
#pragma GCC poison AllocSpeedButtonNodeA
#undef FreeSpeedButtonNode
#pragma GCC poison FreeSpeedButtonNode
#undef GetSpeedButtonNodeAttrs
#pragma GCC poison GetSpeedButtonNodeAttrs
#undef GetSpeedButtonNodeAttrsA
#pragma GCC poison GetSpeedButtonNodeAttrsA
#undef SPEEDBAR_GetClass
#pragma GCC poison SPEEDBAR_GetClass
#undef SetSpeedButtonNodeAttrs
#pragma GCC poison SetSpeedButtonNodeAttrs
#undef SetSpeedButtonNodeAttrsA
#pragma GCC poison SetSpeedButtonNodeAttrsA

/* string.library — functions requiring KS 2.0+ */
#undef STRING_GetClass
#pragma GCC poison STRING_GetClass

/* texteditor.library — functions requiring KS 2.0+ */
#undef HighlightSetFormat
#pragma GCC poison HighlightSetFormat
#undef TEXTEDITOR_GetClass
#pragma GCC poison TEXTEDITOR_GetClass

/* utility.library — functions requiring KS 2.0+ */
#undef AddNamedObject
#pragma GCC poison AddNamedObject
#undef AllocNamedObject
#pragma GCC poison AllocNamedObject
#undef AllocNamedObjectA
#pragma GCC poison AllocNamedObjectA
#undef AllocateTagItems
#pragma GCC poison AllocateTagItems
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
#undef CloneTagItems
#pragma GCC poison CloneTagItems
#undef Date2Amiga
#pragma GCC poison Date2Amiga
#undef FilterTagChanges
#pragma GCC poison FilterTagChanges
#undef FilterTagItems
#pragma GCC poison FilterTagItems
#undef FindNamedObject
#pragma GCC poison FindNamedObject
#undef FindTagItem
#pragma GCC poison FindTagItem
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
#undef NextTagItem
#pragma GCC poison NextTagItem
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
#undef VIRTUAL_GetClass
#pragma GCC poison VIRTUAL_GetClass

/* wb.library — functions requiring KS 2.0+ */
#undef AddAppIcon
#pragma GCC poison AddAppIcon
#undef AddAppIconA
#pragma GCC poison AddAppIconA
#undef AddAppMenuItem
#pragma GCC poison AddAppMenuItem
#undef AddAppMenuItemA
#pragma GCC poison AddAppMenuItemA
#undef AddAppWindow
#pragma GCC poison AddAppWindow
#undef AddAppWindowA
#pragma GCC poison AddAppWindowA
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
#undef RemoveAppIcon
#pragma GCC poison RemoveAppIcon
#undef RemoveAppMenuItem
#pragma GCC poison RemoveAppMenuItem
#undef RemoveAppWindow
#pragma GCC poison RemoveAppWindow
#undef RemoveAppWindowDropZone
#pragma GCC poison RemoveAppWindowDropZone
#undef UpdateWorkbench
#pragma GCC poison UpdateWorkbench
#undef WBInfo
#pragma GCC poison WBInfo
#undef WhichWorkbenchObject
#pragma GCC poison WhichWorkbenchObject
#undef WhichWorkbenchObjectA
#pragma GCC poison WhichWorkbenchObjectA
#undef WorkbenchControl
#pragma GCC poison WorkbenchControl
#undef WorkbenchControlA
#pragma GCC poison WorkbenchControlA

/* window.library — functions requiring KS 2.0+ */
#undef WINDOW_GetClass
#pragma GCC poison WINDOW_GetClass

#endif /* __GNUC__ */
#endif /* KS13_COMPAT_H */
