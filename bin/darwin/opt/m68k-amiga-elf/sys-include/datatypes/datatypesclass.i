	IFND DATATYPES_DATATYPESCLASS_I
DATATYPES_DATATYPESCLASS_I	SET	1
**
**	$VER: datatypesclass.i 44.1 (17.4.1999)
**	Includes Release 45.1
**
**	Copyright © 1992-2001 Amiga, Inc.
**	    All Rights Reserved
**

;------------------------------------------------------------------------------

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND DOS_DOS_I
	INCLUDE "dos/dos.i"
	ENDC

	IFND GRAPHICS_GFX_I
	INCLUDE 'graphics/gfx.i'
	ENDC

	IFND GRAPHICS_MONITOR_I
	INCLUDE 'graphics/monitor.i'
	ENDC

	IFND GRAPHICS_MODEID_I
	INCLUDE 'graphics/modeid.i'
	ENDC

	IFND UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

	IFND DATATYPES_DATATYPES_I
	INCLUDE "datatypes/datatypes.i"
	ENDC

	IFND INTUITION_INTUITION_I
	INCLUDE "intuition/intuition.i"
	ENDC

	IFND DEVICES_PRINTER_I
	INCLUDE "devices/printer.i"
	ENDC

	IFND DEVICES_PRTBASE_I
	INCLUDE "devices/prtbase.i"
	ENDC

;------------------------------------------------------------------------------

DATATYPESCLASS	MACRO
		DC.B	'datatypesclass',0
		ENDM

;------------------------------------------------------------------------------

DTA_Dummy	equ	(TAG_USER+$1000)

; Generic attributes
DTA_TextAttr		equ	(DTA_Dummy+10)
DTA_TopVert		equ	(DTA_Dummy+11)
DTA_VisibleVert		equ	(DTA_Dummy+12)
DTA_TotalVert		equ	(DTA_Dummy+13)
DTA_VertUnit		equ	(DTA_Dummy+14)
DTA_TopHoriz		equ	(DTA_Dummy+15)
DTA_VisibleHoriz	equ	(DTA_Dummy+16)
DTA_TotalHoriz		equ	(DTA_Dummy+17)
DTA_HorizUnit		equ	(DTA_Dummy+18)
DTA_NodeName		equ	(DTA_Dummy+19)
DTA_Title		equ	(DTA_Dummy+20)
DTA_TriggerMethods	equ	(DTA_Dummy+21)
DTA_Data		equ	(DTA_Dummy+22)
DTA_TextFont		equ	(DTA_Dummy+23)
DTA_Methods		equ	(DTA_Dummy+24)
DTA_PrinterStatus	equ	(DTA_Dummy+25)
DTA_PrinterProc		equ	(DTA_Dummy+26)
DTA_LayoutProc		equ	(DTA_Dummy+27)

; Used to turn the applications' busy pointer off and on.
DTA_Busy		equ	(DTA_Dummy+28)

; Used to indicate that new information has been loaded into
; an object.  This is for models that cache the DTA_TopVert-
; like tags
DTA_Sync		equ	(DTA_Dummy+29)

; The base name of the class
DTA_BaseName		equ	(DTA_Dummy+30)

; Group that the object must belong in
DTA_GroupID		equ	(DTA_Dummy+31)

; Error level
DTA_ErrorLevel		equ	(DTA_Dummy+32)

; datatypes.library error number
DTA_ErrorNumber		equ	(DTA_Dummy+33)

; Argument for datatypes.library error
DTA_ErrorString		equ	(DTA_Dummy+34)

; New for V40. (UBYTE *) specifies the name of the
; realtime.library conductor.
DTA_Conductor		equ	(DTA_Dummy+35)

; New for V40. (BOOL) Indicate whether a control panel should be
; embedded within the object (in the animation datatype, for
; example).  Defaults to TRUE.
DTA_ControlPanel	equ	(DTA_Dummy+36)

; New for V40. (BOOL) Indicate whether the object should
; immediately begin playing.  Defaults to FALSE.
DTA_Immediate		equ	(DTA_Dummy+37)

; New for V40. (BOOL) Indicate that the object should repeat
; playing.  Defaults to FALSE.
DTA_Repeat		equ	(DTA_Dummy+38)

; New for V44. Address of a DTST_MEMORY source type
; object (APTR).
DTA_SourceAddress	equ	(DTA_Dummy+39)

; New for V44. Size of a DTST_MEMORY source type
; object (ULONG).
DTA_SourceSize		equ	(DTA_Dummy+40)

; Reserved tag; DO NOT USE (V44)
DTA_Reserved		equ	(DTA_Dummy+41)

; DTObject attributes
DTA_Name		equ	(DTA_Dummy+100)
DTA_SourceType		equ	(DTA_Dummy+101)
DTA_Handle		equ	(DTA_Dummy+102)
DTA_DataType		equ	(DTA_Dummy+103)
DTA_Domain		equ	(DTA_Dummy+104)
DTA_Left		equ	(DTA_Dummy+105)
DTA_Top			equ	(DTA_Dummy+106)
DTA_Width		equ	(DTA_Dummy+107)
DTA_Height		equ	(DTA_Dummy+108)
DTA_ObjName		equ	(DTA_Dummy+109)
DTA_ObjAuthor		equ	(DTA_Dummy+110)
DTA_ObjAnnotation	equ	(DTA_Dummy+111)
DTA_ObjCopyright	equ	(DTA_Dummy+112)
DTA_ObjVersion		equ	(DTA_Dummy+113)
DTA_ObjectID		equ	(DTA_Dummy+114)
DTA_UserData		equ	(DTA_Dummy+115)
DTA_FrameInfo		equ	(DTA_Dummy+116)
DTA_RelRight		equ	(DTA_Dummy+117)
DTA_RelBottom		equ	(DTA_Dummy+118)
DTA_RelWidth		equ	(DTA_Dummy+119)
DTA_RelHeight		equ	(DTA_Dummy+120)
DTA_SelectDomain	equ	(DTA_Dummy+121)
DTA_TotalPVert		equ	(DTA_Dummy+122)
DTA_TotalPHoriz		equ	(DTA_Dummy+123)
DTA_NominalVert		equ	(DTA_Dummy+124)
DTA_NominalHoriz	equ	(DTA_Dummy+125)

; Printing attributes
DTA_DestCols		equ	(DTA_Dummy+400)
DTA_DestRows		equ	(DTA_Dummy+401)
DTA_Special		equ	(DTA_Dummy+402)

; (struct RastPort *) RastPort to use when printing. (V40)
DTA_RastPort		equ	(DTA_Dummy+403)

; (STRPTR) Pointer to base name for ARexx port (V40)
DTA_ARexxPortName	equ	(DTA_Dummy+404)


;------------------------------------------------------------------------------

DTST_RAM		equ	1
DTST_FILE		equ	2
DTST_CLIPBOARD		equ	3
DTST_HOTLINK		equ	4
DTST_MEMORY		equ	5	; New for V44

;------------------------------------------------------------------------------

; Attached to the Gadget.SpecialInfo field of the gadget.  Don't access directly,
;  use the Get/Set calls instead.

    STRUCTURE DTSpecialInfo,0
	STRUCT		si_Lock,SS_SIZE			; Locked while in DoAsyncLayout()
	ULONG		si_Flags

	LONG		si_TopVert			; Top row in units
	LONG		si_VisVert			; Number of visible rows in units
	LONG		si_TotVert			; Total number of rows in units
	LONG		si_OTopVert			; Previous top in units
	LONG		si_VertUnit			; Number of pixels per vertical unit

	LONG		si_TopHoriz			; Top column in units
	LONG		si_VisHoriz			; Number of visible columns in units
	LONG		si_TotHoriz			; Total number of columns in units
	LONG		si_OTopHoriz			; Previous top in units
	LONG		si_HorizUnit			; Number of pixels per horizontal unit

    LABEL DTSpecialInfo_SIZEOF

; si_Flag values
	BITDEF DTSI,LAYOUT,0
	BITDEF DTSI,NEWSIZE,1
	BITDEF DTSI,DRAGGING,2
	BITDEF DTSI,DRAGSELECT,3
	BITDEF DTSI,HIGHLIGHT,4
	BITDEF DTSI,PRINTING,5
	BITDEF DTSI,LAYOUTPROC,6

;------------------------------------------------------------------------------

    STRUCTURE DTMethod,0
	APTR	dtm_Label
	APTR	dtm_Command
	ULONG	dtm_Method
    LABEL DTMethod_SIZEOF

;------------------------------------------------------------------------------
; Methods

DTM_Dummy		equ	$600

; Inquire what environment an object requires
DTM_FRAMEBOX		equ	$0601

; Same as GM_LAYOUT except guaranteed to be on a process already
DTM_PROCLAYOUT		equ	$0602

; Layout that is occurring on a process
DTM_ASYNCLAYOUT		equ	$0603

; When a RemoveDTObject() is called
DTM_REMOVEDTOBJECT	equ	$0604

DTM_SELECT		equ	$0605
DTM_CLEARSELECTED	equ	$0606

DTM_COPY		equ	$0607
DTM_PRINT		equ	$0608
DTM_ABORTPRINT		equ	$0609

DTM_NEWMEMBER		equ	$0610
DTM_DISPOSEMEMBER	equ	$0611

DTM_GOTO		equ	$0630
DTM_TRIGGER		equ	$0631

DTM_OBTAINDRAWINFO	equ	$0640
DTM_DRAW		equ	$0641
DTM_RELEASEDRAWINFO	equ	$0642

DTM_WRITE		equ	$0650

; Used to ask the object about itself
    STRUCTURE FrameInfo,0
	ULONG		fri_PropertyFlags		; DisplayInfo (graphics/displayinfo.i)
	STRUCT		fri_Resolution,tpt_SIZEOF	; ticks-per-pixel X/Y
	UBYTE		fri_RedBits			; number of Red bits
	UBYTE		fri_GreenBits			; number of Green bits
	UBYTE		fri_BlueBits			; number of Blue bits
	BYTE		fri_Pad				; compiler inserts a padding byte here
	ULONG		fri_Width
	ULONG		fri_Height
	ULONG		fri_Depth
	APTR		fri_Screen
	APTR		fri_ColorMap
	ULONG		fri_Flags
    LABEL FrameInfo_SIZEOF

    BITDEF FI,SCALABLE,0
    BITDEF FI,SCROLLABLE,1
    BITDEF FI,REMAPPABLE,2

; DTM_REMOVEDTOBJECT, DTM_CLEARSELECTED, DTM_COPY, DTM_ABORTPRINT
    STRUCTURE dtGeneral,4
	; ULONG		MethodID
	APTR		dtg_GInfo

; DTM_SELECT
    STRUCTURE dtSelect,4
	; ULONG		MethodID
	APTR		dts_GInfo
	STRUCT		dts_Select,ra_SIZEOF

; DTM_FRAMEBOX
    STRUCTURE dtFrameBox,4
	; ULONG		MethodID
	APTR		dtf_GInfo
	APTR		dtf_ContentsInfo
	APTR		dtf_FrameInfo
	ULONG		dtf_SizeFrameInfo
	ULONG		dtf_FrameFlags

    IFND FRAMEF_SPECIFY
    BITDEF FRAME,SPECIFY,0
    ENDC

; DTM_GOTO
    STRUCTURE dtGoto,4
	; ULONG		MethodID
	APTR		dtgo_GInfo
	APTR		dtgo_NodeName			; Node to goto
	APTR		dtgo_AttrList			; Additional attributes

; DTM_TRIGGER
    STRUCTURE dtTrigger,4
	; ULONG		MethodID
	APTR		dtt_GInfo
	ULONG		dtt_Function
	APTR		dtt_Data

STM_PAUSE		equ	1
STM_PLAY		equ	2
STM_CONTENTS		equ	3
STM_INDEX		equ	4
STM_RETRACE		equ	5
STM_BROWSE_PREV		equ	6
STM_BROWSE_NEXT		equ	7

STM_NEXT_FIELD		equ	8
STM_PREV_FIELD		equ	9
STM_ACTIVATE_FIELD	equ	10
STM_COMMAND		equ	11

; DTM_DRAW
    STRUCTURE dtDraw,4
	; ULONG		MethodID
	APTR		dtd_RPort
	LONG		dtd_Left
	LONG		dtd_Top
	LONG		dtd_Width
	LONG		dtd_Height
	LONG		dtd_TopHoriz
	LONG		dtd_TopVert
	APTR		dtd_AttrList

; DTM_WRITE
    STRUCTURE dtWrite,4
	; ULONG		MethodID
	APTR		dtw_GInfo
	BPTR		dtw_FileHandle
	ULONG		dtw_Mode
	APTR		dtw_AttrList

DTWM_IFF	equ	0
DTWM_RAW	equ	1

;------------------------------------------------------------------------------

	ENDC	; DATATYPES_DATATYPESCLASS_I
