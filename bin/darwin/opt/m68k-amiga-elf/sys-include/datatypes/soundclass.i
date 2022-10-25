	IFND	DATATYPES_SOUNDCLASS_I
DATATYPES_SOUNDCLASS_I	SET	1
**
**	$VER: soundclass.i 44.7 (6.6.1999)
**
**	Interface definitions for DataType sound objects.
**	Includes Release 45.1
**
**	Copyright © 1992-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND	UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

    IFND	DATATYPES_DATATYPESCLASS_I
    INCLUDE "datatypes/datatypesclass.i"
    ENDC

    IFND	LIBRARIES_IFFPARSE_I
    INCLUDE "libraries/iffparse.i"
    ENDC

    IFND	DEVICES_TIMER_I
    INCLUDE "devices/timer.i"
    ENDC

;------------------------------------------------------------------------------

SOUNDDTCLASS	MACRO
		DC.B	'sound.datatype',0
		ENDM

;------------------------------------------------------------------------------

; Sound attributes
SDTA_Dummy		equ	(DTA_Dummy+500)
SDTA_VoiceHeader	equ	(SDTA_Dummy+1)
; (BYTE *) Sample data
SDTA_Sample		equ	(SDTA_Dummy+2)

; (ULONG) Length of the sample data in UBYTEs
SDTA_SampleLength	equ	(SDTA_Dummy+3)

; (UWORD) Period
SDTA_Period		equ	(SDTA_Dummy+4)

; (UWORD) Volume.  Range from 0 to 64
SDTA_Volume		equ	(SDTA_Dummy+5)

SDTA_Cycles		equ	(SDTA_Dummy+6)

; The following tags are new for V40

; (struct Task *) Task to signal when sound is complete or next buffer needed.
SDTA_SignalTask		equ	(SDTA_Dummy+7)

; (ULONG) Signal mask to use on completion or 0 to disable
;
;         NOTE: Due to a bug in sound.datatype V40 SDTA_SignalBit
;               was actually implemented as a signal mask as opposed
;               to a bit number. The documentation now reflects
;               this. If you intend to use a signal bit number
;               instead of the mask, use the new V44 tag
;               SDTA_SignalBitNumber below.
SDTA_SignalBit		equ	(SDTA_Dummy+8)
SDTA_SignalBitMask	equ	SDTA_SignalBit

; (BOOL) Playing a continuous stream of data.  Defaults to FALSE.
SDTA_Continuous		equ	(SDTA_Dummy+9)

; The following tags are new for V44

; (BYTE) Signal bit to use on completion or -1 to disable
SDTA_SignalBitNumber	equ	(SDTA_Dummy+10)

; (UWORD) Samples per second
SDTA_SamplesPerSec	equ	(SDTA_Dummy+11)

; (struct timeval *) Sample replay period
SDTA_ReplayPeriod	equ	(SDTA_Dummy+12)

; (BYTE *) Sample data
SDTA_LeftSample		equ	(SDTA_Dummy+13)
SDTA_RightSample	equ	(SDTA_Dummy+14)

; (BYTE) Stereo panning
SDTA_Pan		equ	(SDTA_Dummy+15)

; (BOOL) FreeVec() all sample data upon OM_DISPOSE
SDTA_FreeSampleData	equ	(SDTA_Dummy+16)

; (BOOL) Wait for the current sample to be played back before
; switching to the new sample data.
SDTA_SyncSampleChange	equ	(SDTA_Dummy+17)

;------------------------------------------------------------------------------

    STRUCTURE VoiceHeader,0
	ULONG	vh_OneShotHiSamples	; # samples in the high octave 1-shot part
	ULONG	vh_RepeatHiSamples	; # samples in the high octave repeat part
	ULONG	vh_SamplesPerHiCycle	; # samples/cycle in high octave, else 0
	UWORD	vh_SamplesPerSec	; data sampling rate
	UBYTE	vh_Octaves		; # of octaves of waveforms
	UBYTE	vh_Compression		; data compression technique used
	ULONG	vh_Volume		; playback nominal volume from 0 to Unity
    LABEL VoiceHeader_SIZEOF

;------------------------------------------------------------------------------

; Channel allocation
SAMPLETYPE_Left		equ	2
SAMPLETYPE_Right	equ	4
SAMPLETYPE_Stereo	equ	6

;------------------------------------------------------------------------------

; Data compression methods
CMP_NONE		equ	 0
CMP_FIBDELTA		equ	 1

;------------------------------------------------------------------------------

; Unity = Fixed 1.0 = maximum volume
Unity	equ 10000

;------------------------------------------------------------------------------

; IFF types
ID_8SVX	equ	'8SVX'
ID_VHDR	equ	'VHDR'
ID_CHAN	equ	'CHAN'

	IFND	ID_BODY
ID_BODY	equ	'BODY'
	ENDC

;------------------------------------------------------------------------------

    ENDC	; DATATYPES_SOUNDCLASS_I
