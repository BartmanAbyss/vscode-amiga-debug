    IFND EXEC_ALERTS_I
EXEC_ALERTS_I SET 1
**
**	$VER: alerts.i 39.4 (13.11.1992)
**	Includes Release 45.1
**
**	Alert numbers, as displayed by system crashes.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

**********************************************************************
*
*  Format of the alert error number:
*
*    +---------------+----------------+--------------------------------+
*    |D|  SubSysId   |	General Error |    SubSystem Specific Error    |
*    +---------------+----------------+--------------------------------+
*     1    7 bits	   8 bits		   16 bits
*
*		     D:  DeadEnd alert
*	      SubSysId:  indicates ROM subsystem number.
*	 General Error:  roughly indicates what the error was
*	Specific Error:  indicates more detail
***********************************************************************

*
*  Use this macro for causing an alert.  It is very sensitive to memory
*  corruption.... like stepping on location 4!	After the alert, it
*  will return.
*
*	A0/A1 and D0/D1 are destroyed
*
*
ALERT		MACRO	(alertNumber, [paramArray])
		movem.l d7/a5/a6,-(sp)
		move.l	#\1,d7
		IFNC	'\2',''
		  lea.l	\2,a5
		ENDC
		move.l	4,a6
		jsr	_LVOAlert(a6)
		movem.l	(sp)+,d7/a5/a6
		ENDM
*
*  Use this macro for dead end alerts that never return
*
DEADALERT	MACRO	(alertNumber, [paramArray])
		move.l	#\1,d7
		IFNC	'\2',''
		  lea.l \2,a5
		ENDC
		move.l	4,a6
		jsr	_LVOAlert(a6)	; never returns
		ENDM

**********************************************************************
*
*  Hardware/CPU specific alerts:  They may show without the 8 at the
*  front of the number.  These are CPU/68000 specific.	See 680x0
*  programmer's manuals for more details.
*
**********************************************************************
ACPU_BusErr	equ $80000002	; Hardware bus fault/access error
ACPU_AddressErr	equ $80000003	; Illegal address access (ie: odd)
ACPU_InstErr	equ $80000004	; Illegal instruction
ACPU_DivZero	equ $80000005	; Divide by zero
ACPU_CHK	equ $80000006	; Check instruction error
ACPU_TRAPV	equ $80000007	; TrapV instruction error
ACPU_PrivErr	equ $80000008	; Privilege violation error
ACPU_Trace	equ $80000009	; Trace error
ACPU_LineA	equ $8000000A	; Line 1010 Emulator error
ACPU_LineF	equ $8000000B	; Line 1111 Emulator error
ACPU_Format	equ $8000000E	; Stack frame format error
ACPU_Spurious	equ $80000018	; Spurious interrupt error
ACPU_AutoVec1	equ $80000019	; AutoVector Level 1 interrupt error
ACPU_AutoVec2	equ $8000001A	; AutoVector Level 2 interrupt error
ACPU_AutoVec3	equ $8000001B	; AutoVector Level 3 interrupt error
ACPU_AutoVec4	equ $8000001C	; AutoVector Level 4 interrupt error
ACPU_AutoVec5	equ $8000001D	; AutoVector Level 5 interrupt error
ACPU_AutoVec6	equ $8000001E	; AutoVector Level 6 interrupt error
ACPU_AutoVec7	equ $8000001F	; AutoVector Level 7 interrupt error

**********************************************************************
*
*  General Alerts
*
*  For example:  timer.device cannot open math.library:
*
*       ALERT  (AN_TimerDev!AG_OpenLib!AO_MathLib)	;0x05038015
*
**********************************************************************

;------ alert types
AT_DeadEnd	equ $80000000
AT_Recovery	equ $00000000

;------ general purpose alert codes
AG_NoMemory	equ $00010000
AG_MakeLib	equ $00020000
AG_OpenLib	equ $00030000
AG_OpenDev	equ $00040000
AG_OpenRes	equ $00050000
AG_IOError	equ $00060000
AG_NoSignal	equ $00070000
AG_BadParm	equ $00080000
AG_CloseLib	equ $00090000	;Usually too many closes
AG_CloseDev	equ $000A0000	;or a mismatched close
AG_ProcCreate	equ $000B0000	;Process creation failed

;------ alert objects:
AO_ExecLib	equ $00008001
AO_GraphicsLib	equ $00008002
AO_LayersLib	equ $00008003
AO_Intuition	equ $00008004
AO_MathLib	equ $00008005
AO_DOSLib	equ $00008007
AO_RAMLib	equ $00008008
AO_IconLib	equ $00008009
AO_ExpansionLib	equ $0000800A
AO_DiskfontLib	equ $0000800B
AO_UtilityLib	equ $0000800C
AO_KeyMapLib	equ $0000800D

AO_AudioDev	equ $00008010
AO_ConsoleDev	equ $00008011
AO_GamePortDev	equ $00008012
AO_KeyboardDev	equ $00008013
AO_TrackDiskDev equ $00008014
AO_TimerDev	equ $00008015

AO_CIARsrc	equ $00008020
AO_DiskRsrc 	equ $00008021
AO_MiscRsrc	equ $00008022

AO_BootStrap    equ $00008030
AO_Workbench    equ $00008031
AO_DiskCopy	equ $00008032
AO_GadTools	equ $00008033
AO_Unknown	equ $00008035

**********************************************************************
*
*   Specific Alerts:
*
*   For example:   exec.library -- corrupted memory list
*
*	    ALERT  AN_MemCorrupt	;8100 0005
*
**********************************************************************

;------ exec.library
AN_ExecLib	equ $01000000
AN_ExcptVect	equ $01000001   ; 68000 exception vector checksum (obs.)
AN_BaseChkSum	equ $01000002	; Execbase checksum bad (obs.)
AN_LibChkSum	equ $01000003	; Library checksum failure

AN_MemCorrupt	equ $81000005	; Corrupt memory list detected in FreeMem
AN_IntrMem	equ $81000006	; No memory for interrupt servers
AN_InitAPtr	equ $01000007	; InitStruct() of an APTR source (obs.)
AN_SemCorrupt	equ $01000008	; A semaphore is in an illegal state
				; at ReleaseSemaphore()
AN_FreeTwice	equ $01000009	; Freeing memory that is already free
AN_BogusExcpt	equ $8100000A	; Illegal 68k exception taken (obs.)
AN_IOUsedTwice	equ $0100000B	; Attempt to reuse active IORequest
AN_MemoryInsane	equ $0100000C	; Sanity check on memory list failed
				; during AvailMem(MEMF_LARGEST)
AN_IOAfterClose	equ $0100000D	; IO attempted on closed IORequest
AN_StackProbe	equ $0100000E	; Stack appears to extend out of range
AN_BadFreeAddr	equ $0100000F	; Memory header not located. [ Usually an
				; invalid address passed to FreeMem() ]
AN_BadSemaphore	equ $01000010	; An attempt was made to use the old
				; message semaphores.
AN_BadQuickInt	equ $810000FF	; A quick interrupt has happened to an
				; uninitialized vector.

;------ graphics.library
AN_GraphicsLib	equ $02000000
AN_GfxNoMem	equ $82010000	; graphics out of memory
AN_GfxNoMemMspc equ $82010001	; MonitorSpec alloc, no memory
AN_LongFrame	equ $82010006	; long frame, no memory
AN_ShortFrame	equ $82010007	; short frame, no memory
AN_TextTmpRas	equ $02010009	; text, no memory for TmpRas
AN_BltBitMap	equ $8201000A	; BltBitMap, no memory
AN_RegionMemory	equ $8201000B	; regions, memory not available
AN_MakeVPort	equ $82010030	; MakeVPort, no memory
AN_GfxNewError	equ $0200000C
AN_GfxFreeError equ $0200000D

AN_GfxNoLCM	equ $82011234	; emergency memory not available

AN_ObsoleteFont	equ $02000401	; unsupported font description used

;------ layers.library
AN_LayersLib	equ $03000000
AN_LayersNoMem	equ $83010000	; layers out of memory

;------ intuition.library
AN_Intuition	equ $04000000
AN_GadgetType	equ $84000001	; unknown gadget type
AN_BadGadget	equ $04000001	; Recovery form of AN_GadgetType
AN_CreatePort	equ $84010002	; create port, no memory
AN_ItemAlloc	equ $04010003	; item plane alloc, no memory
AN_SubAlloc	equ $04010004	; sub alloc, no memory
AN_PlaneAlloc	equ $84010005	; plane alloc, no memory
AN_ItemBoxTop	equ $84000006	; item box top < RelZero
AN_OpenScreen	equ $84010007	; open screen, no memory
AN_OpenScrnRast	equ $84010008	; open screen, raster alloc, no memory
AN_SysScrnType	equ $84000009	; open sys screen, unknown type
AN_AddSWGadget	equ $8401000A	; add SW gadgets, no memory
AN_OpenWindow	equ $8401000B	; open window, no memory
AN_BadState	equ $8400000C	; Bad State Return entering Intuition
AN_BadMessage	equ $8400000D	; Bad Message received by IDCMP
AN_WeirdEcho	equ $8400000E	; Weird echo causing incomprehension
AN_NoConsole	equ $8400000F	; couldn't open the Console Device
AN_NoISem	equ $04000010	; Intuition skipped obtaining a sem
AN_ISemOrder	equ $04000011	; Intuition obtained a sem in bad order

;------ math.library
AN_MathLib	equ $05000000

;------ dos.library
AN_DOSLib	equ $07000000
AN_StartMem	equ $07010001	; no memory at startup
AN_EndTask	equ $07000002	; EndTask didn't
AN_QPktFail	equ $07000003	; Qpkt failure
AN_AsyncPkt	equ $07000004	; Unexpected packet received
AN_FreeVec	equ $07000005	; Freevec failed
AN_DiskBlkSeq	equ $07000006	; Disk block sequence error
AN_BitMap	equ $07000007	; Bitmap corrupt
AN_KeyFree	equ $07000008	; Key already free
AN_BadChkSum	equ $07000009	; Invalid checksum
AN_DiskError	equ $0700000A	; Disk Error
AN_KeyRange	equ $0700000B	; Key out of range
AN_BadOverlay	equ $0700000C	; Bad overlay
AN_BadInitFunc	equ $0700000D	; Invalid init packet for cli/shell
AN_FileReclosed equ $0700000E	; A filehandle was closed more than once

;------ ramlib.library
AN_RAMLib	equ $08000000
AN_BadSegList	equ $08000001	; overlays are illegal for library segments

;------ icon.library
AN_IconLib	equ $09000000

;------ expansion.library
AN_ExpansionLib	equ $0A000000
AN_BadExpansionFree	equ $0A000001	;Freeed free region

;------ diskfont.library
AN_DiskfontLib	equ $0B000000

;------ audio.device
AN_AudioDev	equ $10000000

;------ console.device
AN_ConsoleDev	equ $11000000
AN_NoWindow	equ $11000001	; Console can't open initial window

;------ gameport.device
AN_GamePortDev	equ $12000000

;------ keyboard.device
AN_KeyboardDev	equ $13000000

;------ trackdisk.device
AN_TrackDiskDev equ $14000000
AN_TDCalibSeek	equ $14000001	; calibrate: seek error
AN_TDDelay	equ $14000002	; delay: error on timer wait

;------	timer.device
AN_TimerDev	equ $15000000
AN_TMBadReq	equ $15000001	; bad request
AN_TMBadSupply	equ $15000002	; power supply -- no 50/60hz ticks

;------ cia.resource
AN_CIARsrc	equ $20000000

;------	disk.resource
AN_DiskRsrc	equ $21000000
AN_DRHasDisk	equ $21000001	; get unit: already has disk
AN_DRIntNoAct	equ $21000002	; interrupt: no active unit

;------ misc.resource
AN_MiscRsrc	equ $22000000

;------ bootstrap
AN_BootStrap	equ $30000000
AN_BootError	equ $30000001	; boot code returned an error

;------ workbench
AN_Workbench			equ $31000000
AN_NoFonts			equ $B1000001
AN_WBBadStartupMsg1		equ $31000001
AN_WBBadStartupMsg2		equ $31000002
AN_WBBadIOMsg			equ $31000003	; Hacker code?
AN_WBReLayoutToolMenu		equ $B1010009	; GadTools broke?

;------ DiskCopy
AN_DiskCopy	equ $32000000

;------ toolkit for Intuition
AN_GadTools	equ $33000000

;------ System utility library
AN_UtilityLib	equ $34000000

;------ For use by any application that needs it
AN_Unknown	equ $35000000

    ENDC ;EXEC_ALERTS_I
