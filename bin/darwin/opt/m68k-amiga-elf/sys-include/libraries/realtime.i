	IFND	LIBRARIES_REALTIME_I
LIBRARIES_REALTIME_I	  SET	  1
**
**	$VER: realtime.i 40.3 (5.4.1993)
**	Includes Release 45.1
**
**	realtime.library timing and syncing system
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC

    IFND EXEC_LISTS_I
    INCLUDE "exec/lists.i"
    ENDC

    IFND EXEC_LIBRARIES_I
    INCLUDE "exec/libraries.i"
    ENDC

    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

;---------------------------------------------------------------------------

; realtime.library's idea of time is based on a clock which emits a pulse
; 1200 times a second (1.2kHz). All time values maintained by realtime.library
; are based on this number. For example, the field RealTimeBase->rtb_Time
; expresses an amount of time equivalent to (RealTimeBase->rtb_Time/TICK_FREQ)
; seconds.
;
TICK_FREQ equ 1200

;---------------------------------------------------------------------------

; Each Conductor represents a group of applications which wish to remain
; synchronized together.
;
; This structure must only be allocated by realtime.library and is
; READ-ONLY!
;
   STRUCTURE Conductor,LN_SIZE
	UWORD	cdt_Reserved0
	STRUCT  cdt_Players,MLH_SIZE	; this conductor's players
	ULONG	cdt_ClockTime		; current time of this sequence
	ULONG	cdt_StartTime		; start time of this sequence
	ULONG	cdt_ExternalTime	; time from external unit
	ULONG	cdt_MaxExternalTime	; upper limit on sync'd time
	ULONG	cdt_Metronome		; MetricTime highest pri node
 	UWORD	cdt_Reserved1
	UWORD	cdt_Flags		; conductor flags
	UBYTE	cdt_State		; playing or stopped
   LABEL Conductor_SIZEOF

; Flag bits for Conductor.cdt_Flags
    BITDEF  CONDUCT,EXTERNAL,0		; clock is externally driven
    BITDEF  CONDUCT,GOTTICK,1		; received 1st external tick
    BITDEF  CONDUCT,METROSET,2		; cdt_Metronome filled in
    BITDEF  CONDUCT,PRIVATE,3		; conductor is private

; constants for Conductor.cdt_State and SetConductorState()
CONDSTATE_STOPPED EQU      0		; clock is stopped
CONDSTATE_PAUSED  EQU      1		; clock is paused
CONDSTATE_LOCATE  EQU      2		; go to 'running' when ready
CONDSTATE_RUNNING EQU      3		; run clock NOW

; These do not actually exist as Conductor states, but are used as additional
; arguments to SetConductorState()
CONDSTATE_METRIC  EQU     -1		; ask high node to locate
CONDSTATE_SHUTTLE EQU     -2		; time changing but not running
CONDSTATE_LOCATE_SET EQU  -3		; maestro done locating

;---------------------------------------------------------------------------

; The Player is the connection between a Conductor and an application.
;
; This structure must only be allocated by realtime.library and is
; READ-ONLY!
;
   STRUCTURE Player,LN_SIZE
	BYTE    pl_Reserved0
	BYTE    pl_Reserved1
	APTR    pl_Hook			; player's hook function
	APTR	pl_Source		; pointer to parent context
	APTR	pl_Task			; task to signal for changes
	LONG	pl_MetricTime		; current time in app's metric
    	LONG	pl_AlarmTime		; time to wake up
    	APTR	pl_UserData		; for application use
    	UWORD	pl_PlayerID		; for application use
    	UWORD	pl_Flags		; general Player flags
   LABEL Player_SIZEOF

; Flag bits for the Player.pl_Flags
    BITDEF  PLAYER,READY,0		; player is ready to go!
    BITDEF  PLAYER,ALARMSET,1		; alarm is set
    BITDEF  PLAYER,QUIET,2		; a dummy player, used for sync
    BITDEF  PLAYER,CONDUCTED,3		; give me metered time
    BITDEF  PLAYER,EXTSYNC,4		; granted external sync

;---------------------------------------------------------------------------

; Tags for CreatePlayer(), SetPlayerAttrs(), and GetPlayerAttrs()
PLAYER_Base         EQU TAG_USER + 64
PLAYER_Hook	    EQU PLAYER_Base + 1    ; set address of hook function
PLAYER_Name         EQU PLAYER_Base + 2    ; name of player
PLAYER_Priority     EQU PLAYER_Base + 3    ; priority of player
PLAYER_Conductor    EQU PLAYER_Base + 4    ; set conductor for player
PLAYER_Ready        EQU PLAYER_Base + 5    ; the "ready" flag
PLAYER_AlarmTime    EQU PLAYER_Base + 12   ; alarm time (sets PLAYERF_ALARMSET)
PLAYER_Alarm        EQU PLAYER_Base + 13   ; sets/clears PLAYERF_ALARMSET flag
PLAYER_AlarmSigTask EQU PLAYER_Base + 6    ; task to signal for alarm/state change
PLAYER_AlarmSigBit  EQU PLAYER_Base + 8    ; signal bit for alarm (or -1)
PLAYER_Conducted    EQU PLAYER_Base + 7    ; sets/clears PLAYERF_CONDUCTED flag
PLAYER_Quiet        EQU PLAYER_Base + 9    ; don't process time thru this
PLAYER_UserData     EQU PLAYER_Base + 10
PLAYER_ID	    EQU PLAYER_Base + 11
PLAYER_ExtSync	    EQU PLAYER_Base + 14   ; attempt/release to ext sync
PLAYER_ErrorCode    EQU PLAYER_Base + 15   ; error return code

;---------------------------------------------------------------------------

; Method types for messages sent via a Player's hook
PM_TICK      EQU 0
PM_STATE     EQU 1
PM_POSITION  EQU 2
PM_SHUTTLE   EQU 3

; used for PM_TICK, PM_POSITION and PM_SHUTTLE methods
   STRUCTURE pmTime,0
	ULONG pmt_Method	; PM_TICK, PM_POSITION, or PM_SHUTTLE
	ULONG pmt_Time
   LABEL pmTime_SIZEOF

; used for the PM_STATE method
   STRUCTURE pmState,0
	ULONG pms_Method	; PM_STATE
	ULONG pms_OldState
   LABEL pmState_SIZEOF

;---------------------------------------------------------------------------

; possible lock types for LockRealTime()
RT_CONDUCTORS EQU 0  ; conductor list

;---------------------------------------------------------------------------

; realtime.library error codes
RTE_NOMEMORY    EQU 801       ; memory allocation failed
RTE_NOCONDUCTOR EQU 802       ; player needs a conductor
RTE_NOTIMER     EQU 803       ; timer (CIA) allocation failed
RTE_PLAYING     EQU 804       ; can't shuttle while playing

;---------------------------------------------------------------------------

; OpenLibrary("realtime.library",0) returns a pointer to this structure.
; All fields are READ-ONLY.
;
   STRUCTURE RealTimeBase,LIB_SIZE
	STRUCT rtb_Reserved0,2

	ULONG  rtb_Time		; current time
	ULONG  rtb_TimeFrac	; fixed-point fractional part of  time
	WORD   rtb_Reserved1
	WORD   rtb_TickErr	; nanosecond error from ideal Tick length to
   LABEL RealTimeBase_SIZEOF	      ; real tick length

; Actual tick length is: 1/TICK_FREQ + rtb_TickErr/1e9

RealTime_TickErr_Min EQU -705
RealTime_TickErr_Max EQU  705

;---------------------------------------------------------------------------

	ENDC	; LIBRARIES_REALTIME_I
