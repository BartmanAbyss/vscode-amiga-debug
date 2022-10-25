#ifndef DOS_DOSTAGS_H
#define DOS_DOSTAGS_H
/*
**
**	$VER: dostags.h 36.11 (29.4.1991)
**	Includes Release 45.1
**
**	Tag definitions for all Dos routines using tags
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**
*/

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/*****************************************************************************/
/* definitions for the System() call */

#define SYS_Dummy	(TAG_USER + 32)
#define	SYS_Input	(SYS_Dummy + 1)
				/* specifies the input filehandle  */
#define	SYS_Output	(SYS_Dummy + 2)
				/* specifies the output filehandle */
#define	SYS_Asynch	(SYS_Dummy + 3)
				/* run asynch, close input/output on exit(!) */
#define	SYS_UserShell	(SYS_Dummy + 4)
				/* send to user shell instead of boot shell */
#define	SYS_CustomShell	(SYS_Dummy + 5)
				/* send to a specific shell (data is name) */
/*	SYS_Error, */


/*****************************************************************************/
/* definitions for the CreateNewProc() call */
/* you MUST specify one of NP_Seglist or NP_Entry.  All else is optional. */

#define	NP_Dummy (TAG_USER + 1000)
#define	NP_Seglist	(NP_Dummy + 1)
				/* seglist of code to run for the process  */
#define	NP_FreeSeglist	(NP_Dummy + 2)
				/* free seglist on exit - only valid for   */
				/* for NP_Seglist.  Default is TRUE.	   */
#define	NP_Entry	(NP_Dummy + 3)
				/* entry point to run - mutually exclusive */
				/* with NP_Seglist! */
#define	NP_Input	(NP_Dummy + 4)
				/* filehandle - default is Open("NIL:"...) */
#define	NP_Output	(NP_Dummy + 5)
				/* filehandle - default is Open("NIL:"...) */
#define	NP_CloseInput	(NP_Dummy + 6)
				/* close input filehandle on exit	   */
				/* default TRUE				   */
#define	NP_CloseOutput	(NP_Dummy + 7)
				/* close output filehandle on exit	   */
				/* default TRUE				   */
#define	NP_Error	(NP_Dummy + 8)
				/* filehandle - default is Open("NIL:"...) */
#define	NP_CloseError	(NP_Dummy + 9)
				/* close error filehandle on exit	   */
				/* default TRUE				   */
#define	NP_CurrentDir	(NP_Dummy + 10)
				/* lock - default is parent's current dir  */
#define	NP_StackSize	(NP_Dummy + 11)
				/* stacksize for process - default 4000    */
#define	NP_Name		(NP_Dummy + 12)
				/* name for process - default "New Process"*/
#define	NP_Priority	(NP_Dummy + 13)
				/* priority - default same as parent	   */
#define	NP_ConsoleTask	(NP_Dummy + 14)
				/* consoletask - default same as parent    */
#define	NP_WindowPtr	(NP_Dummy + 15)
				/* window ptr - default is same as parent  */
#define	NP_HomeDir	(NP_Dummy + 16)
				/* home directory - default curr home dir  */
#define	NP_CopyVars	(NP_Dummy + 17)
				/* boolean to copy local vars-default TRUE */
#define	NP_Cli		(NP_Dummy + 18)
				/* create cli structure - default FALSE    */
#define	NP_Path		(NP_Dummy + 19)
				/* path - default is copy of parents path  */
				/* only valid if a cli process!	   */
#define	NP_CommandName	(NP_Dummy + 20)
				/* commandname - valid only for CLI	   */
#define	NP_Arguments	(NP_Dummy + 21)
/* cstring of arguments - passed with str in a0, length in d0.	*/
/* (copied and freed on exit.)	Default is 0-length NULL ptr.	*/
/* NOTE: not operational until V37 - see BIX/TechNotes for	*/
/* more info/workaround.  In V36, the registers were random.	*/
/* You must NEVER use NP_Arguments with a NP_Input of NULL.	*/

/* FIX! should this be only for cli's? */
#define	NP_NotifyOnDeath (NP_Dummy + 22)
				/* notify parent on death - default FALSE  */
				/* Not functional yet. */
#define	NP_Synchronous	(NP_Dummy + 23)
				/* don't return until process finishes -   */
				/* default FALSE.			   */
				/* Not functional yet. */
#define	NP_ExitCode	(NP_Dummy + 24)
				/* code to be called on process exit	   */
#define	NP_ExitData	(NP_Dummy + 25)
				/* optional argument for NP_EndCode rtn -  */
				/* default NULL				   */


/*****************************************************************************/
/* tags for AllocDosObject */

#define ADO_Dummy	(TAG_USER + 2000)
#define	ADO_FH_Mode	(ADO_Dummy + 1)
				/* for type DOS_FILEHANDLE only		   */
				/* sets up FH for mode specified.
				   This can make a big difference for buffered
				   files.				   */
	/* The following are for DOS_CLI */
	/* If you do not specify these, dos will use it's preferred values */
	/* which may change from release to release.  The BPTRs to these   */
	/* will be set up correctly for you.  Everything will be zero,	   */
	/* except cli_FailLevel (10) and cli_Background (DOSTRUE).	   */
	/* NOTE: you may also use these 4 tags with CreateNewProc.	   */

#define	ADO_DirLen	(ADO_Dummy + 2)
				/* size in bytes for current dir buffer    */
#define	ADO_CommNameLen	(ADO_Dummy + 3)
				/* size in bytes for command name buffer   */
#define	ADO_CommFileLen	(ADO_Dummy + 4)
				/* size in bytes for command file buffer   */
#define	ADO_PromptLen	(ADO_Dummy + 5)
				/* size in bytes for the prompt buffer	   */

/*****************************************************************************/
/* tags for NewLoadSeg */
/* no tags are defined yet for NewLoadSeg */

#endif /* DOS_DOSTAGS_H */
