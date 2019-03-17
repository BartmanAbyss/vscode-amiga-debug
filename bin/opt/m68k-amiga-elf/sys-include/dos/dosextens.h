#ifndef DOS_DOSEXTENS_H
#define DOS_DOSEXTENS_H
/*
**	$VER: dosextens.h 36.41 (14.5.1992)
**	Includes Release 45.1
**
**	DOS structures not needed for the casual AmigaDOS user
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TASKS_H
#include <exec/tasks.h>
#endif
#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif
#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif
#ifndef DEVICES_TIMER_H
#include <devices/timer.h>
#endif

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

/* All DOS processes have this structure */
/* Create and Device Proc returns pointer to the MsgPort in this structure */
/* dev_proc = (struct Process *) (DeviceProc(..) - sizeof(struct Task)); */

struct Process {
    struct  Task    pr_Task;
    struct  MsgPort pr_MsgPort; /* This is BPTR address from DOS functions  */
    WORD    pr_Pad;		/* Remaining variables on 4 byte boundaries */
    BPTR    pr_SegList;		/* Array of seg lists used by this process  */
    LONG    pr_StackSize;	/* Size of process stack in bytes	    */
    APTR    pr_GlobVec;		/* Global vector for this process (BCPL)    */
    LONG    pr_TaskNum;		/* CLI task number of zero if not a CLI	    */
    BPTR    pr_StackBase;	/* Ptr to high memory end of process stack  */
    LONG    pr_Result2;		/* Value of secondary result from last call */
    BPTR    pr_CurrentDir;	/* Lock associated with current directory   */
    BPTR    pr_CIS;		/* Current CLI Input Stream		    */
    BPTR    pr_COS;		/* Current CLI Output Stream		    */
    APTR    pr_ConsoleTask;	/* Console handler process for current window*/
    APTR    pr_FileSystemTask;	/* File handler process for current drive   */
    BPTR    pr_CLI;		/* pointer to CommandLineInterface	    */
    APTR    pr_ReturnAddr;	/* pointer to previous stack frame	    */
    APTR    pr_PktWait;		/* Function to be called when awaiting msg  */
    APTR    pr_WindowPtr;	/* Window for error printing		    */

    /* following definitions are new with 2.0 */
    BPTR    pr_HomeDir;		/* Home directory of executing program	    */
    LONG    pr_Flags;		/* flags telling dos about process	    */
    void    (*pr_ExitCode)();	/* code to call on exit of program or NULL  */
    LONG    pr_ExitData;	/* Passed as an argument to pr_ExitCode.    */
    UBYTE   *pr_Arguments;	/* Arguments passed to the process at start */
    struct MinList pr_LocalVars; /* Local environment variables		    */
    ULONG   pr_ShellPrivate;	/* for the use of the current shell	    */
    BPTR    pr_CES;		/* Error stream - if NULL, use pr_COS	    */
};  /* Process */

/*
 * Flags for pr_Flags
 */
#define	PRB_FREESEGLIST		0
#define	PRF_FREESEGLIST		1
#define	PRB_FREECURRDIR		1
#define	PRF_FREECURRDIR		2
#define	PRB_FREECLI		2
#define	PRF_FREECLI		4
#define	PRB_CLOSEINPUT		3
#define	PRF_CLOSEINPUT		8
#define	PRB_CLOSEOUTPUT		4
#define	PRF_CLOSEOUTPUT		16
#define	PRB_FREEARGS		5
#define	PRF_FREEARGS		32

/* The long word address (BPTR) of this structure is returned by
 * Open() and other routines that return a file.  You need only worry
 * about this struct to do async io's via PutMsg() instead of
 * standard file system calls */

struct FileHandle {
   struct Message *fh_Link;	 /* EXEC message	      */
   struct MsgPort *fh_Port;	 /* Reply port for the packet */
   struct MsgPort *fh_Type;	 /* Port to do PutMsg() to
				  * Address is negative if a plain file */
   LONG fh_Buf;
   LONG fh_Pos;
   LONG fh_End;
   LONG fh_Funcs;
#define fh_Func1 fh_Funcs
   LONG fh_Func2;
   LONG fh_Func3;
   LONG fh_Args;
#define fh_Arg1 fh_Args
   LONG fh_Arg2;
}; /* FileHandle */

/* This is the extension to EXEC Messages used by DOS */

struct DosPacket {
   struct Message *dp_Link;	 /* EXEC message	      */
   struct MsgPort *dp_Port;	 /* Reply port for the packet */
				 /* Must be filled in each send. */
   LONG dp_Type;		 /* See ACTION_... below and
				  * 'R' means Read, 'W' means Write to the
				  * file system */
   LONG dp_Res1;		 /* For file system calls this is the result
				  * that would have been returned by the
				  * function, e.g. Write ('W') returns actual
				  * length written */
   LONG dp_Res2;		 /* For file system calls this is what would
				  * have been returned by IoErr() */
/*  Device packets common equivalents */
#define dp_Action  dp_Type
#define dp_Status  dp_Res1
#define dp_Status2 dp_Res2
#define dp_BufAddr dp_Arg1
   LONG dp_Arg1;
   LONG dp_Arg2;
   LONG dp_Arg3;
   LONG dp_Arg4;
   LONG dp_Arg5;
   LONG dp_Arg6;
   LONG dp_Arg7;
}; /* DosPacket */

/* A Packet does not require the Message to be before it in memory, but
 * for convenience it is useful to associate the two.
 * Also see the function init_std_pkt for initializing this structure */

struct StandardPacket {
   struct Message   sp_Msg;
   struct DosPacket sp_Pkt;
}; /* StandardPacket */

/* Packet types */
#define ACTION_NIL		0
#define ACTION_STARTUP		0
#define ACTION_GET_BLOCK	2	/* OBSOLETE */
#define ACTION_SET_MAP		4
#define ACTION_DIE		5
#define ACTION_EVENT		6
#define ACTION_CURRENT_VOLUME	7
#define ACTION_LOCATE_OBJECT	8
#define ACTION_RENAME_DISK	9
#define ACTION_WRITE		'W'
#define ACTION_READ		'R'
#define ACTION_FREE_LOCK	15
#define ACTION_DELETE_OBJECT	16
#define ACTION_RENAME_OBJECT	17
#define ACTION_MORE_CACHE	18
#define ACTION_COPY_DIR		19
#define ACTION_WAIT_CHAR	20
#define ACTION_SET_PROTECT	21
#define ACTION_CREATE_DIR	22
#define ACTION_EXAMINE_OBJECT	23
#define ACTION_EXAMINE_NEXT	24
#define ACTION_DISK_INFO	25
#define ACTION_INFO		26
#define ACTION_FLUSH		27
#define ACTION_SET_COMMENT	28
#define ACTION_PARENT		29
#define ACTION_TIMER		30
#define ACTION_INHIBIT		31
#define ACTION_DISK_TYPE	32
#define ACTION_DISK_CHANGE	33
#define ACTION_SET_DATE		34

#define ACTION_SCREEN_MODE	994

#define ACTION_READ_RETURN	1001
#define ACTION_WRITE_RETURN	1002
#define ACTION_SEEK		1008
#define ACTION_FINDUPDATE	1004
#define ACTION_FINDINPUT	1005
#define ACTION_FINDOUTPUT	1006
#define ACTION_END		1007
#define ACTION_SET_FILE_SIZE	1022	/* fast file system only in 1.3 */
#define ACTION_WRITE_PROTECT	1023	/* fast file system only in 1.3 */

/* new 2.0 packets */
#define ACTION_SAME_LOCK	40
#define ACTION_CHANGE_SIGNAL	995
#define ACTION_FORMAT		1020
#define ACTION_MAKE_LINK	1021
/**/
/**/
#define ACTION_READ_LINK	1024
#define ACTION_FH_FROM_LOCK	1026
#define ACTION_IS_FILESYSTEM	1027
#define ACTION_CHANGE_MODE	1028
/**/
#define ACTION_COPY_DIR_FH	1030
#define ACTION_PARENT_FH	1031
#define ACTION_EXAMINE_ALL	1033
#define ACTION_EXAMINE_FH	1034

#define ACTION_LOCK_RECORD	2008
#define ACTION_FREE_RECORD	2009

#define ACTION_ADD_NOTIFY	4097
#define ACTION_REMOVE_NOTIFY	4098

/* Added in V39: */
#define ACTION_EXAMINE_ALL_END	1035
#define ACTION_SET_OWNER	1036

/* Tell a file system to serialize the current volume. This is typically
 * done by changing the creation date of the disk. This packet does not take
 * any arguments.  NOTE: be prepared to handle failure of this packet for
 * V37 ROM filesystems.
 */
#define	ACTION_SERIALIZE_DISK	4200

/*
 * A structure for holding error messages - stored as array with error == 0
 * for the last entry.
 */
struct ErrorString {
	LONG  *estr_Nums;
	UBYTE *estr_Strings;
};

/* DOS library node structure.
 * This is the data at positive offsets from the library node.
 * Negative offsets from the node is the jump table to DOS functions
 * node = (struct DosLibrary *) OpenLibrary( "dos.library" .. )	     */

struct DosLibrary {
    struct Library dl_lib;
    struct RootNode *dl_Root; /* Pointer to RootNode, described below */
    APTR    dl_GV;	      /* Pointer to BCPL global vector	      */
    LONG    dl_A2;	      /* BCPL standard register values	      */
    LONG    dl_A5;
    LONG    dl_A6;
    struct ErrorString *dl_Errors;	  /* PRIVATE pointer to array of error msgs */
    struct timerequest *dl_TimeReq;	  /* PRIVATE pointer to timer request */
    struct Library     *dl_UtilityBase;   /* PRIVATE ptr to utility library */
    struct Library     *dl_IntuitionBase; /* PRIVATE ptr to intuition library */
};  /*	DosLibrary */

/*			       */

struct RootNode {
    BPTR    rn_TaskArray;	     /* [0] is max number of CLI's
				      * [1] is APTR to process id of CLI 1
				      * [n] is APTR to process id of CLI n */
    BPTR    rn_ConsoleSegment; /* SegList for the CLI			   */
    struct  DateStamp rn_Time; /* Current time				   */
    LONG    rn_RestartSeg;     /* SegList for the disk validator process   */
    BPTR    rn_Info;	       /* Pointer to the Info structure		   */
    BPTR    rn_FileHandlerSegment; /* segment for a file handler	   */
    struct MinList rn_CliList; /* new list of all CLI processes */
			       /* the first cpl_Array is also rn_TaskArray */
    struct MsgPort *rn_BootProc; /* private ptr to msgport of boot fs	   */
    BPTR    rn_ShellSegment;   /* seglist for Shell (for NewShell)	   */
    LONG    rn_Flags;	       /* dos flags */
};  /* RootNode */

#define RNB_WILDSTAR	24
#define RNF_WILDSTAR	(1L<<24)
#define RNB_PRIVATE1	1	/* private for dos */
#define RNF_PRIVATE1	2

/* ONLY to be allocated by DOS! */
struct CliProcList {
	struct MinNode cpl_Node;
	LONG cpl_First;	     /* number of first entry in array */
	struct MsgPort **cpl_Array;
			     /* [0] is max number of CLI's in this entry (n)
			      * [1] is CPTR to process id of CLI cpl_First
			      * [n] is CPTR to process id of CLI cpl_First+n-1
			      */
};

struct DosInfo {
    BPTR    di_McName;	       /* PRIVATE: system resident module list	    */
#define di_ResList di_McName
    BPTR    di_DevInfo;	       /* Device List				    */
    BPTR    di_Devices;	       /* Currently zero			    */
    BPTR    di_Handlers;       /* Currently zero			    */
    APTR    di_NetHand;	       /* Network handler processid; currently zero */
    struct  SignalSemaphore di_DevLock;	   /* do NOT access directly! */
    struct  SignalSemaphore di_EntryLock;  /* do NOT access directly! */
    struct  SignalSemaphore di_DeleteLock; /* do NOT access directly! */
};  /* DosInfo */

/* structure for the Dos resident list.  Do NOT allocate these, use	  */
/* AddSegment(), and heed the warnings in the autodocs!			  */

struct Segment {
	BPTR seg_Next;
	LONG seg_UC;
	BPTR seg_Seg;
	UBYTE seg_Name[4];	/* actually the first 4 chars of BSTR name */
};

#define CMD_SYSTEM	-1
#define CMD_INTERNAL	-2
#define CMD_DISABLED	-999


/* DOS Processes started from the CLI via RUN or NEWCLI have this additional
 * set to data associated with them */

struct CommandLineInterface {
    LONG   cli_Result2;	       /* Value of IoErr from last command	  */
    BSTR   cli_SetName;	       /* Name of current directory		  */
    BPTR   cli_CommandDir;     /* Head of the path locklist		  */
    LONG   cli_ReturnCode;     /* Return code from last command		  */
    BSTR   cli_CommandName;    /* Name of current command		  */
    LONG   cli_FailLevel;      /* Fail level (set by FAILAT)		  */
    BSTR   cli_Prompt;	       /* Current prompt (set by PROMPT)	  */
    BPTR   cli_StandardInput;  /* Default (terminal) CLI input		  */
    BPTR   cli_CurrentInput;   /* Current CLI input			  */
    BSTR   cli_CommandFile;    /* Name of EXECUTE command file		  */
    LONG   cli_Interactive;    /* Boolean; True if prompts required	  */
    LONG   cli_Background;     /* Boolean; True if CLI created by RUN	  */
    BPTR   cli_CurrentOutput;  /* Current CLI output			  */
    LONG   cli_DefaultStack;   /* Stack size to be obtained in long words */
    BPTR   cli_StandardOutput; /* Default (terminal) CLI output		  */
    BPTR   cli_Module;	       /* SegList of currently loaded command	  */
};  /* CommandLineInterface */

/* This structure can take on different values depending on whether it is
 * a device, an assigned directory, or a volume.  Below is the structure
 * reflecting volumes only.  Following that is the structure representing
 * only devices. Following that is the unioned structure representing all
 * the values
 */

/* structure representing a volume */

struct DeviceList {
    BPTR		dl_Next;	/* bptr to next device list */
    LONG		dl_Type;	/* see DLT below */
    struct MsgPort *	dl_Task;	/* ptr to handler task */
    BPTR		dl_Lock;	/* not for volumes */
    struct DateStamp	dl_VolumeDate;	/* creation date */
    BPTR		dl_LockList;	/* outstanding locks */
    LONG		dl_DiskType;	/* 'DOS', etc */
    LONG		dl_unused;
    BSTR		dl_Name;	/* bptr to bcpl name */
};

/* device structure (same as the DeviceNode structure in filehandler.h) */

struct	      DevInfo {
    BPTR  dvi_Next;
    LONG  dvi_Type;
    APTR  dvi_Task;
    BPTR  dvi_Lock;
    BSTR  dvi_Handler;
    LONG  dvi_StackSize;
    LONG  dvi_Priority;
    LONG  dvi_Startup;
    BPTR  dvi_SegList;
    BPTR  dvi_GlobVec;
    BSTR  dvi_Name;
};

/* combined structure for devices, assigned directories, volumes */

struct DosList {
    BPTR		dol_Next;	 /* bptr to next device on list */
    LONG		dol_Type;	 /* see DLT below */
    struct MsgPort     *dol_Task;	 /* ptr to handler task */
    BPTR		dol_Lock;
    union {
	struct {
	BSTR	dol_Handler;	/* file name to load if seglist is null */
	LONG	dol_StackSize;	/* stacksize to use when starting process */
	LONG	dol_Priority;	/* task priority when starting process */
	ULONG	dol_Startup;	/* startup msg: FileSysStartupMsg for disks */
	BPTR	dol_SegList;	/* already loaded code for new task */
	BPTR	dol_GlobVec;	/* BCPL global vector to use when starting
				 * a process. -1 indicates a C/Assembler
				 * program. */
	} dol_handler;

	struct {
	struct DateStamp	dol_VolumeDate;	 /* creation date */
	BPTR			dol_LockList;	 /* outstanding locks */
	LONG			dol_DiskType;	 /* 'DOS', etc */
	} dol_volume;

	struct {
	UBYTE	*dol_AssignName;     /* name for non-or-late-binding assign */
	struct AssignList *dol_List; /* for multi-directory assigns (regular) */
	} dol_assign;

    } dol_misc;

    BSTR		dol_Name;	 /* bptr to bcpl name */
    };

/* structure used for multi-directory assigns. AllocVec()ed. */

struct AssignList {
	struct AssignList *al_Next;
	BPTR		   al_Lock;
};

/* definitions for dl_Type */
#define DLT_DEVICE	0
#define DLT_DIRECTORY	1	/* assign */
#define DLT_VOLUME	2
#define DLT_LATE	3	/* late-binding assign */
#define DLT_NONBINDING	4	/* non-binding assign */
#define DLT_PRIVATE	-1	/* for internal use only */

/* structure return by GetDeviceProc() */
struct DevProc {
	struct MsgPort *dvp_Port;
	BPTR		dvp_Lock;
	ULONG		dvp_Flags;
	struct DosList *dvp_DevNode;	/* DON'T TOUCH OR USE! */
};

/* definitions for dvp_Flags */
#define DVPB_UNLOCK	0
#define DVPF_UNLOCK	(1L << DVPB_UNLOCK)	/* PRIVATE! */
#define DVPB_ASSIGN	1
#define DVPF_ASSIGN	(1L << DVPB_ASSIGN)

/* Flags to be passed to LockDosList(), etc */
#define LDB_DEVICES	2
#define LDF_DEVICES	(1L << LDB_DEVICES)
#define LDB_VOLUMES	3
#define LDF_VOLUMES	(1L << LDB_VOLUMES)
#define LDB_ASSIGNS	4
#define LDF_ASSIGNS	(1L << LDB_ASSIGNS)
#define LDB_ENTRY	5
#define LDF_ENTRY	(1L << LDB_ENTRY)
#define LDB_DELETE	6
#define LDF_DELETE	(1L << LDB_DELETE)

/* you MUST specify one of LDF_READ or LDF_WRITE */
#define LDB_READ	0
#define LDF_READ	(1L << LDB_READ)
#define LDB_WRITE	1
#define LDF_WRITE	(1L << LDB_WRITE)

/* actually all but LDF_ENTRY (which is used for internal locking) */
#define LDF_ALL		(LDF_DEVICES|LDF_VOLUMES|LDF_ASSIGNS)

/* a lock structure, as returned by Lock() or DupLock() */
struct FileLock {
    BPTR		fl_Link;	/* bcpl pointer to next lock */
    LONG		fl_Key;		/* disk block number */
    LONG		fl_Access;	/* exclusive or shared */
    struct MsgPort *	fl_Task;	/* handler task's port */
    BPTR		fl_Volume;	/* bptr to DLT_VOLUME DosList entry */
};

/* error report types for ErrorReport() */
#define REPORT_STREAM		0	/* a stream */
#define REPORT_TASK		1	/* a process - unused */
#define REPORT_LOCK		2	/* a lock */
#define REPORT_VOLUME		3	/* a volume node */
#define REPORT_INSERT		4	/* please insert volume */

/* Special error codes for ErrorReport() */
#define ABORT_DISK_ERROR	296	/* Read/write error */
#define ABORT_BUSY		288	/* You MUST replace... */

/* types for initial packets to shells from run/newcli/execute/system. */
/* For shell-writers only */
#define RUN_EXECUTE		-1
#define RUN_SYSTEM		-2
#define RUN_SYSTEM_ASYNCH	-3

/* Types for fib_DirEntryType.	NOTE that both USERDIR and ROOT are	 */
/* directories, and that directory/file checks should use <0 and >=0.	 */
/* This is not necessarily exhaustive!	Some handlers may use other	 */
/* values as needed, though <0 and >=0 should remain as supported as	 */
/* possible.								 */
#define ST_ROOT		1
#define ST_USERDIR	2
#define ST_SOFTLINK	3	/* looks like dir, but may point to a file! */
#define ST_LINKDIR	4	/* hard link to dir */
#define ST_FILE		-3	/* must be negative for FIB! */
#define ST_LINKFILE	-4	/* hard link to file */
#define ST_PIPEFILE	-5	/* for pipes that support ExamineFH */

#endif	/* DOS_DOSEXTENS_H */
