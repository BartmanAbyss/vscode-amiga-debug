	IFND	DOS_DOSTAGS_I
DOS_DOSTAGS_I SET	1
**
**	$VER: dostags.i 36.13 (29.4.1991)
**	Includes Release 45.1
**
**	Tag definitions for all Dos routines using tags
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**


     IFND  UTILITY_TAGITEM_I
     INCLUDE "utility/tagitem.i"
     ENDC

*****************************************************************************
* definitions for the System() call

SYS_Dummy	EQU	TAG_USER+32
SYS_Input	EQU	SYS_Dummy+1	; specifies the input filehandle
SYS_Output	EQU	SYS_Dummy+2	; specifies the output filehandle
SYS_Asynch	EQU	SYS_Dummy+3	; run asynch, close input/output(!)
SYS_UserShell	EQU	SYS_Dummy+4   ; send to user shell instead of boot shell
SYS_CustomShell	EQU	SYS_Dummy+5   ; send to a specific shell (data is name)
*SYS_Error	EQU	SYS_Dummy+?


*****************************************************************************
* definitions for the CreateNewProc() call
* you MUST specify one of NP_Seglist or NP_Entry.  All else is optional.

NP_Dummy	EQU TAG_USER+1000
NP_Seglist	EQU NP_Dummy+1	 ; seglist of code to run for the process
NP_FreeSeglist	EQU NP_Dummy+2	 ; free seglist on exit - only valid for
				 ; for NP_Seglist.  Default is TRUE.
NP_Entry	EQU NP_Dummy+3	 ; entry point to run - mutually exclusive
				 ; with NP_Seglist.
NP_Input	EQU NP_Dummy+4	 ; filehandle - default is Open("NIL:"...)
NP_Output	EQU NP_Dummy+5	 ; filehandle - default is Open("NIL:"...)
NP_CloseInput	EQU NP_Dummy+6	 ; close input filehandle on exit
				 ; default TRUE
NP_CloseOutput	EQU NP_Dummy+7	 ; close output filehandle on exit
				 ; default TRUE
NP_Error	EQU NP_Dummy+8	 ; filehandle - default is Open("NIL:"...)
NP_CloseError	EQU NP_Dummy+9	 ; close error filehandle on exit
				 ; default TRUE
NP_CurrentDir	EQU NP_Dummy+10	 ; lock - default is parent's current dir  
NP_StackSize	EQU NP_Dummy+11	 ; stacksize for process - default 4000    
NP_Name		EQU NP_Dummy+12	 ; name for process - default "New Process"
NP_Priority	EQU NP_Dummy+13	 ; priority - default same as parent
NP_ConsoleTask	EQU NP_Dummy+14	 ; consoletask - default same as parent    
NP_WindowPtr	EQU NP_Dummy+15	 ; window ptr - default is same as parent  
NP_HomeDir	EQU NP_Dummy+16	 ; home directory - default current home dir   
NP_CopyVars	EQU NP_Dummy+17	 ; boolean to copy local vars-default TRUE 
NP_Cli		EQU NP_Dummy+18	 ; create cli structure - default FALSE
NP_Path		EQU NP_Dummy+19	 ; path - default is copy of parents path  
				 ; only valid if a cli process!
NP_CommandName	EQU NP_Dummy+20  ; commandname - valid only for CLI
NP_Arguments	EQU NP_Dummy+21
; cstring of arguments - passed with str in a0, length in d0.
; (copied and freed on exit.)  Default is 0-length NULL ptr.
; NOTE: not operational until V37 - see BIX/TechNotes for
; more info/workaround.  In V36, the registers were random.
; You must NEVER use NP_Arguments with a NP_Input of NULL.

NP_NotifyOnDeath EQU NP_Dummy+22 ; notify parent on death - default FALSE
				 ; Not functional yet.
NP_Synchronous	EQU NP_Dummy+23	 ; don't return until process finishes -
				 ; default FALSE.
				 ; Not functional yet.
NP_ExitCode	EQU NP_Dummy+24	 ; code to be called on process exit
NP_ExitData	EQU NP_Dummy+25	 ; optional argument for NP_EndCode rtn -
				 ; default NULL

*****************************************************************************
* tags for AllocDosObject
ADO_Dummy	EQU	TAG_USER+2000
ADO_FH_Mode	EQU	ADO_Dummy+1	; for type DOS_FILEHANDLE only
				; sets up FH for the type of open being done
				; This can make a big difference for buffered
				; files.

	; The following are for DOS_CLI
	; If you do not specify these, dos will use it's preferred values
	; which may change from release to release.  The BPTRs to these
	; will be set up correctly for you.  Everything will be zero,
	; except cli_FailLevel (10) and cli_Background (DOSTRUE).
	; NOTE: you may also use these 4 tags with CreateNewProc.

ADO_DirLen	EQU	ADO_Dummy+2	; size in bytes for current dir buffer
ADO_CommNameLen	EQU	ADO_Dummy+3	; size in bytes for command name buffer
ADO_CommFileLen	EQU	ADO_Dummy+4	; size in bytes for command file buffer
ADO_PromptLen	EQU	ADO_Dummy+5	; size in bytes for the prompt buffer

* tags for NewLoadSeg
* no tags are defined yet for NewLoadSeg

	ENDC	; DOS_DOSTAGS_I
