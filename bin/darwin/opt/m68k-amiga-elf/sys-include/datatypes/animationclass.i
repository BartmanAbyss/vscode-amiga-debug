	IFND	DATATYPES_ANIMATIONCLASS_I
DATATYPES_ANIMATIONCLASS_I	SET	1
**
**  $VER: animationclass.i 44.2 (27.3.1999)
**  Includes Release 45.1
**
**  Interface definitions for DataType animation objects.
**
**  (C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
**

    IFND	UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

    IFND	DATATYPES_DATATYPESCLASS_I
    INCLUDE "datatypes/datatypesclass.i"
    ENDC

    IFND	DATATYPES_PICTURECLASS_I
    INCLUDE "datatypes/pictureclass.i"
    ENDC

    IFND	DATATYPES_SOUNDCLASS_I
    INCLUDE "datatypes/soundclass.i"
    ENDC

    IFND	LIBRARIES_IFFPARSE_I
    INCLUDE "libraries/iffparse.i"
    ENDC

;------------------------------------------------------------------------------

ANIMATIONDTCLASS	MACRO
			DC.B	'animation.datatype',0
			ENDM

;------------------------------------------------------------------------------

; Animation attributes
ADTA_Dummy		equ	(DTA_Dummy+600)
ADTA_ModeID		equ	PDTA_ModeID
; (struct BitMap *) Key frame (first frame) bitmap
ADTA_KeyFrame		equ	PDTA_BitMap

ADTA_ColorRegisters	equ	PDTA_ColorRegisters
ADTA_CRegs		equ	PDTA_CRegs
ADTA_GRegs		equ	PDTA_GRegs
ADTA_ColorTable		equ	PDTA_ColorTable
ADTA_ColorTable2	equ	PDTA_ColorTable2
ADTA_Allocated		equ	PDTA_Allocated
ADTA_NumColors		equ	PDTA_NumColors
ADTA_NumAlloc		equ	PDTA_NumAlloc

; (BOOL) : Remap animation (defaults to TRUE)
ADTA_Remap		equ	PDTA_Remap

; (struct Screen *) Screen to remap to
ADTA_Screen		equ	PDTA_Screen

ADTA_Width		equ	(ADTA_Dummy+1)
ADTA_Height		equ	(ADTA_Dummy+2)
ADTA_Depth		equ	(ADTA_Dummy+3)
; (ULONG) Number of frames in the animation
ADTA_Frames		equ	(ADTA_Dummy+4)

; (ULONG) Current frame
ADTA_Frame		equ	(ADTA_Dummy+5)

; (ULONG) Frames per second
ADTA_FramesPerSecond	equ	(ADTA_Dummy+6)

; (LONG) Amount to change frame by when fast forwarding or
; rewinding.  Defaults to 10.
ADTA_FrameIncrement	equ	(ADTA_Dummy+7)

; (ULONG) Number of frames to preload; defaults to 10
ADTA_PreloadFrameCount	equ	(ADTA_Dummy+8)		; (V44)

; Sound attributes
ADTA_Sample		equ	SDTA_Sample
ADTA_SampleLength	equ	SDTA_SampleLength
ADTA_Period		equ	SDTA_Period
ADTA_Volume		equ	SDTA_Volume
ADTA_Cycles		equ	SDTA_Cycles

ADTA_LeftSample		equ	SDTA_LeftSample		; (V44)
ADTA_RightSample	equ	SDTA_RightSample	; (V44)
ADTA_SamplesPerSec	equ	SDTA_SamplesPerSec	; (V44)

;------------------------------------------------------------------------------

ID_ANIM         	equ 'ANIM'
ID_ANHD         	equ 'ANHD'
ID_DLTA         	equ 'DLTA'

;------------------------------------------------------------------------------

    STRUCTURE AnimHeader,0
	UBYTE		ah_Operation
	UBYTE		ah_Mask
	UWORD		ah_Width
	UWORD		ah_Height
	WORD		ah_Left
	WORD		ah_Top
	ULONG		ah_AbsTime
	ULONG		ah_RelTime
	UBYTE		ah_Interleave
	UBYTE		ah_Pad0
	ULONG		ah_Flags
	STRUCT		ah_Pad,16
    LABEL AnimHeader_SIZEOF

;------------------------------------------------------------------------------
;------------------------------------------------------------------------------
;------------------------------------------------------------------------------

; Animation methods
ADTM_Dummy		equ	$700

; Used to load a frame of the animation
ADTM_LOADFRAME		equ	$701

; Used to unload a frame of the animation
ADTM_UNLOADFRAME	equ	$702

; Used to start the animation
ADTM_START		equ	$703

; Used to pause the animation (don't reset the timer)
ADTM_PAUSE		equ	$704

; Used to stop the animation
ADTM_STOP		equ	$705

; Used to locate a frame in the animation (as set by a slider...)
ADTM_LOCATE		equ	$706

; Used to load a new format frame of the animation (V44)
ADTM_LOADNEWFORMATFRAME	equ	$707

; Used to unload a new format frame of the animation (V44)
ADTM_UNLOADNEWFORMATFRAME equ	$708

;------------------------------------------------------------------------------

; ADTM_LOADFRAME, ADTM_UNLOADFRAME

    STRUCTURE adtFrame,0
	ULONG		 alf_MethodID
	ULONG		 alf_TimeStamp		; Timestamp of frame to load

    ; The following fields are filled in by the ADTM_LOADFRAME method,
    ; and are read-only for any other methods.

	ULONG		 alf_Frame		; Frame number
	ULONG		 alf_Duration		; Duration of frame

	APTR	 	 alf_BitMap		; Loaded BitMap
	APTR		 alf_CMap		; Colormap, if changed

	APTR		 alf_Sample		; Sound data (BYTE *)
	ULONG		 alf_SampleLength
	ULONG		 alf_Period

	APTR		 alf_UserData		; Used by load frame for extra data
    LABEL adtFrame_SIZEOF

; ADTM_LOADNEWFORMATFRAME, ADTM_UNLOADNEWFORMATFRAME

    STRUCTURE adtFrame,0
	ULONG		alf_MethodID
	ULONG		alf_TimeStamp		; Timestamp of frame to load

    ; The following fields are filled in by the ADTM_LOADFRAME method,
    ; and are read-only for any other methods.

	ULONG		alf_Frame		; Frame number
	ULONG		alf_Duration		; Duration of frame

	APTR	 	alf_BitMap		; Loaded BitMap
	APTR		alf_CMap		; Colormap, if changed

	APTR		alf_Sample		; Sound data (BYTE *)
	ULONG		alf_SampleLength
	ULONG		alf_Period

	APTR		alf_UserData		; Used by load frame for extra data

	ULONG		alf_Size		; Size of this data structure (in bytes)

	APTR		alf_LeftSample		; Sound for left channel, or NULL if none
	APTR		alf_RightSample		; Sound for right channel, or NULL if none
	ULONG		alf_SamplesPerSec	; Replay speed; if > 0, this overrides alf_Period
    LABEL adtFrame_SIZEOF


; ADTM_START, ADTM_PAUSE, ADTM_STOP, ADTM_LOCATE
    STRUCTURE adtStart,0
	ULONG		 asa_MethodID;
	ULONG		 asa_Frame;		; Frame # to start at
    LABEL adtStart_SIZEOF

;------------------------------------------------------------------------------

    ENDC	; DATATYPES_ANIMATIONCLASS_I
