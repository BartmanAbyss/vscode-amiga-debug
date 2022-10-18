	 IFND	  REXX_RXSLIB_I
REXX_RXSLIB_I  SET   1
**
**	$VER: rxslib.i 36.15 (8.11.1991)
**	Includes Release 45.1
**
**	Include file for the REXX Systems Library
**
**	(C) Copyright 1986,1987,1988,1989,1990 William S. Hawes.
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
**

	 IFND	  REXX_STORAGE_I
	 INCLUDE  "rexx/storage.i"
	 ENDC

	 ; Macro definitions

RXSLIBNAME MACRO
	 dc.b	  'rexxsyslib.library',0
	 ENDM

RXSDIR	 MACRO			       ; public port name
	 dc.b	  'REXX',0
	 ENDM

RXSTNAME MACRO			       ; name for tasks
	 dc.b	  'ARexx',0
	 ENDM

	 ; Structure definition for the REXX systems library

	 STRUCTURE RxsLib,LIB_SIZE     ; EXEC library node
	 UBYTE	  rl_Flags	       ; global flags
	 UBYTE	  rl_Shadow	       ; shadow flags
	 APTR	  rl_SysBase	       ; EXEC library base
	 APTR	  rl_DOSBase	       ; DOS library base
	 APTR	  rl_IeeeDPBase        ; IEEE DP math library base
	 LONG	  rl_SegList	       ; library seglist
	 LONG	  rl_NIL	       ; NIL: stream
	 LONG	  rl_Chunk	       ; allocation quantum
	 LONG	  rl_MaxNest	       ; maximum expression nesting

	 APTR	  rl_NULL	       ; static string: NULL
	 APTR	  rl_FALSE	       ; static string: FALSE
	 APTR	  rl_TRUE	       ; static string: TRUE
	 APTR	  rl_REXX	       ; static string: REXX
	 APTR	  rl_COMMAND	       ; static string: COMMAND
	 APTR	  rl_STDIN	       ; static string: STDIN
	 APTR	  rl_STDOUT	       ; static string: STDOUT
	 APTR	  rl_STDERR	       ; static string: STDERR
	 APTR	  rl_Version	       ; version string

	 APTR	  rl_TaskName	       ; name string for tasks
	 LONG	  rl_TaskPri	       ; starting priority
	 LONG	  rl_TaskSeg	       ; startup seglist
	 LONG	  rl_StackSize	       ; stack size
	 APTR	  rl_RexxDir	       ; REXX directory
	 APTR	  rl_CTABLE	       ; character attribute table
	 APTR	  rl_Notice	       ; copyright notice

	 STRUCT   rl_RexxPort,MP_SIZE  ; public port
	 UWORD	  rl_ReadLock	       ; lock count
	 APTR	  rl_TraceFH	       ; global trace console

	 STRUCT   rl_TaskList,LH_SIZE  ; REXX task list
	 WORD	  rl_NumTask
	 STRUCT   rl_LibList,LH_SIZE   ; Library List header
	 WORD	  rl_NumLib
	 STRUCT   rl_ClipList,LH_SIZE  ; ClipList header
	 WORD	  rl_NumClip
	 STRUCT   rl_MsgList,LH_SIZE   ; pending messages
	 WORD	  rl_NumMsg
	 STRUCT   rl_PgmList,LH_SIZE   ; cached programs
	 WORD	  rl_NumPgm	       ; cache count

	 UWORD	  rl_TraceCnt	       ; trace console usage count
	 WORD	  rl_avail
	 LABEL	  rl_SIZEOF

* Global flag bit definitions for RexxMaster
RLFB_TRACE EQU	  RTFB_TRACE	       ; interactive tracing?
RLFB_HALT  EQU	  RTFB_HALT	       ; halt execution?
RLFB_SUSP  EQU	  RTFB_SUSP	       ; suspend execution?
RLFB_STOP  EQU	  6		       ; deny further invocations
RLFB_CLOSE EQU	  7		       ; close the master

* Mask for control flags
RLFMASK  EQU	  1<<RLFB_TRACE!1<<RLFB_HALT!1<<RLFB_SUSP

	 ; Initialization constants

RXSCHUNK EQU	  1024		       ; allocation quantum
RXSNEST  EQU	  32		       ; expression nesting limit
RXSTPRI  EQU	  0		       ; task priority
RXSSTACK EQU	  4096		       ; stack size

	 ; The library entry point offsets

	 LIBINIT
	 LIBDEF   _LVORexx	       ; Main entry point
	 LIBDEF   _LVOrxParse	       ; (private)
	 LIBDEF   _LVOrxInstruct       ; (private)
	 LIBDEF   _LVOrxSuspend        ; (private)
	 LIBDEF   _LVOEvalOp	       ; (private)

	 LIBDEF   _LVOAssignValue      ; (private)
	 LIBDEF   _LVOEnterSymbol      ; (private)
	 LIBDEF   _LVOFetchValue       ; (private)
	 LIBDEF   _LVOLookUpValue      ; (private)
	 LIBDEF   _LVOSetValue	       ; (private)
	 LIBDEF   _LVOSymExpand        ; (private)

	 LIBDEF   _LVOErrorMsg
	 LIBDEF   _LVOIsSymbol
	 LIBDEF   _LVOCurrentEnv
	 LIBDEF   _LVOGetSpace
	 LIBDEF   _LVOFreeSpace

	 LIBDEF   _LVOCreateArgstring
	 LIBDEF   _LVODeleteArgstring
	 LIBDEF   _LVOLengthArgstring
	 LIBDEF   _LVOCreateRexxMsg
	 LIBDEF   _LVODeleteRexxMsg
	 LIBDEF   _LVOClearRexxMsg
	 LIBDEF   _LVOFillRexxMsg
	 LIBDEF   _LVOIsRexxMsg

	 LIBDEF   _LVOAddRsrcNode
	 LIBDEF   _LVOFindRsrcNode
	 LIBDEF   _LVORemRsrcList
	 LIBDEF   _LVORemRsrcNode
	 LIBDEF   _LVOOpenPublicPort
	 LIBDEF   _LVOClosePublicPort
	 LIBDEF   _LVOListNames

	 LIBDEF   _LVOClearMem
	 LIBDEF   _LVOInitList
	 LIBDEF   _LVOInitPort
	 LIBDEF   _LVOFreePort

	 LIBDEF   _LVOCmpString
	 LIBDEF   _LVOStcToken
	 LIBDEF   _LVOStrcmpN
	 LIBDEF   _LVOStrcmpU
	 LIBDEF   _LVOStrcpyA	       ; obsolete
	 LIBDEF   _LVOStrcpyN
	 LIBDEF   _LVOStrcpyU
	 LIBDEF   _LVOStrflipN
	 LIBDEF   _LVOStrlen
	 LIBDEF   _LVOToUpper

	 LIBDEF   _LVOCVa2i
	 LIBDEF   _LVOCVi2a
	 LIBDEF   _LVOCVi2arg
	 LIBDEF   _LVOCVi2az
	 LIBDEF   _LVOCVc2x
	 LIBDEF   _LVOCVx2c

	 LIBDEF   _LVOOpenF
	 LIBDEF   _LVOCloseF
	 LIBDEF   _LVOReadStr
	 LIBDEF   _LVOReadF
	 LIBDEF   _LVOWriteF
	 LIBDEF   _LVOSeekF
	 LIBDEF   _LVOQueueF
	 LIBDEF   _LVOStackF
	 LIBDEF   _LVOExistF

	 LIBDEF   _LVODOSCommand
	 LIBDEF   _LVODOSRead
	 LIBDEF   _LVODOSWrite
	 LIBDEF   _LVOCreateDOSPkt     ; obsolete
	 LIBDEF   _LVODeleteDOSPkt     ; obsolete
	 LIBDEF   _LVOSendDOSPkt       ; (private)
	 LIBDEF   _LVOWaitDOSPkt       ; (private)
	 LIBDEF   _LVOFindDevice       ; (private)

	 LIBDEF   _LVOAddClipNode
	 LIBDEF   _LVORemClipNode
	 LIBDEF   _LVOLockRexxBase
	 LIBDEF   _LVOUnlockRexxBase
	 LIBDEF   _LVOCreateCLI        ; (private)
	 LIBDEF   _LVODeleteCLI        ; (private)
	 LIBDEF   _LVOCVs2i

* Character attribute flag bits used in REXX.
CTB_SPACE   EQU   0		       ; white space characters
CTB_DIGIT   EQU   1		       ; decimal digits 0-9
CTB_ALPHA   EQU   2		       ; alphabetic characters
CTB_REXXSYM EQU   3		       ; REXX symbol characters
CTB_REXXOPR EQU   4		       ; REXX operator characters
CTB_REXXSPC EQU   5		       ; REXX special symbols
CTB_UPPER   EQU   6		       ; UPPERCASE alphabetic
CTB_LOWER   EQU   7		       ; lowercase alphabetic

* The flag form of the character attributes
CTF_SPACE   EQU   1<<CTB_SPACE
CTF_DIGIT   EQU   1<<CTB_DIGIT
CTF_ALPHA   EQU   1<<CTB_ALPHA
CTF_REXXSYM EQU   1<<CTB_REXXSYM
CTF_REXXOPR EQU   1<<CTB_REXXOPR
CTF_REXXSPC EQU   1<<CTB_REXXSPC
CTF_UPPER   EQU   1<<CTB_UPPER
CTF_LOWER   EQU   1<<CTB_LOWER

	 ENDC
