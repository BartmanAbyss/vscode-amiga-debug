#ifndef REXX_RXSLIB_H
#define REXX_RXSLIB_H
/*
**	$VER: rxslib.h 1.6 (8.11.1991)
**	Includes Release 45.1
**
**	The header file for the REXX Systems Library
**
**	(C) Copyright 1987,1988,1989,1990 William S. Hawes
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
*/

#ifndef REXX_STORAGE_H
#include <rexx/storage.h>
#endif

#define RXSNAME  "rexxsyslib.library"
#define RXSDIR	 "REXX"
#define RXSTNAME "ARexx"

/* The REXX systems library structure.	This should be considered as	*/
/* semi-private and read-only, except for documented exceptions.	*/

struct RxsLib {
   struct Library rl_Node;	       /* EXEC library node		*/
   UBYTE    rl_Flags;		       /* global flags			*/
   UBYTE    rl_Shadow;		       /* shadow flags			*/
   APTR     rl_SysBase;	       /* EXEC library base		*/
   APTR     rl_DOSBase;	       /* DOS library base		*/
   APTR     rl_IeeeDPBase;	       /* IEEE DP math library base	*/
   LONG     rl_SegList;	       /* library seglist		*/
   LONG     rl_NIL;		       /* global NIL: filehandle	*/
   LONG     rl_Chunk;		       /* allocation quantum		*/
   LONG     rl_MaxNest;	       /* maximum expression nesting	*/
   struct NexxStr *rl_NULL;	       /* static string: NULL		*/
   struct NexxStr *rl_FALSE;	       /* static string: FALSE		*/
   struct NexxStr *rl_TRUE;	       /* static string: TRUE		*/
   struct NexxStr *rl_REXX;	       /* static string: REXX		*/
   struct NexxStr *rl_COMMAND;	       /* static string: COMMAND	*/
   struct NexxStr *rl_STDIN;	       /* static string: STDIN		*/
   struct NexxStr *rl_STDOUT;	       /* static string: STDOUT	*/
   struct NexxStr *rl_STDERR;	       /* static string: STDERR	*/
   STRPTR    rl_Version;	       /* version string		*/

   STRPTR    rl_TaskName;	       /* name string for tasks	*/
   LONG      rl_TaskPri;	       /* starting priority		*/
   LONG      rl_TaskSeg;	       /* startup seglist		*/
   LONG      rl_StackSize;	       /* stack size			*/
   STRPTR    rl_RexxDir;	       /* REXX directory		*/
   STRPTR    rl_CTABLE;	       /* character attribute table	*/
   STRPTR    rl_Notice;	       /* copyright notice		*/

   struct MsgPort rl_RexxPort;	       /* REXX public port		*/
   UWORD     rl_ReadLock;	       /* lock count			*/
   LONG      rl_TraceFH;	       /* global trace console		*/
   struct List rl_TaskList;	       /* REXX task list		*/
   WORD      rl_NumTask;	       /* task count			*/
   struct List rl_LibList;	       /* Library List header		*/
   WORD      rl_NumLib;	       /* library count		*/
   struct List rl_ClipList;	       /* ClipList header		*/
   WORD      rl_NumClip;	       /* clip node count		*/
   struct List rl_MsgList;	       /* pending messages		*/
   WORD      rl_NumMsg;	       /* pending count		*/
   struct List rl_PgmList;	       /* cached programs		*/
   WORD      rl_NumPgm;	       /* program count		*/

   UWORD     rl_TraceCnt;	       /* usage count for trace console */
   WORD      rl_avail;
   };

/* Global flag bit definitions for RexxMaster				*/
#define RLFB_TRACE RTFB_TRACE	       /* interactive tracing?		*/
#define RLFB_HALT  RTFB_HALT	       /* halt execution?		*/
#define RLFB_SUSP  RTFB_SUSP	       /* suspend execution?		*/
#define RLFB_STOP  6		       /* deny further invocations	*/
#define RLFB_CLOSE 7		       /* close the master		*/

#define RLFMASK    (1<<RLFB_TRACE) | (1<<RLFB_HALT) | (1<<RLFB_SUSP)

/* Initialization constants						*/
#define RXSCHUNK   1024	       /* allocation quantum		*/
#define RXSNEST    32		       /* expression nesting limit	*/
#define RXSTPRI    0		       /* task priority		*/
#define RXSSTACK   4096	       /* stack size			*/

/* Character attribute flag bits used in REXX.				*/
#define CTB_SPACE   0		       /* white space characters	*/
#define CTB_DIGIT   1		       /* decimal digits 0-9		*/
#define CTB_ALPHA   2		       /* alphabetic characters	*/
#define CTB_REXXSYM 3		       /* REXX symbol characters	*/
#define CTB_REXXOPR 4		       /* REXX operator characters	*/
#define CTB_REXXSPC 5		       /* REXX special symbols		*/
#define CTB_UPPER   6		       /* UPPERCASE alphabetic		*/
#define CTB_LOWER   7		       /* lowercase alphabetic		*/

/* Attribute flags							*/
#define CTF_SPACE   (1 << CTB_SPACE)
#define CTF_DIGIT   (1 << CTB_DIGIT)
#define CTF_ALPHA   (1 << CTB_ALPHA)
#define CTF_REXXSYM (1 << CTB_REXXSYM)
#define CTF_REXXOPR (1 << CTB_REXXOPR)
#define CTF_REXXSPC (1 << CTB_REXXSPC)
#define CTF_UPPER   (1 << CTB_UPPER)
#define CTF_LOWER   (1 << CTB_LOWER)

#endif
