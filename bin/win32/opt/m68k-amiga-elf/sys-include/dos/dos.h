#ifndef DOS_DOS_H
#define DOS_DOS_H
/*
**	$VER: dos.h 36.27 (5.4.1992)
**	Includes Release 45.1
**
**	Standard C header for AmigaDOS
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif


#define	 DOSNAME  "dos.library"

/* Predefined Amiga DOS global constants */

#define DOSTRUE (-1L)
#define DOSFALSE (0L)

/* Mode parameter to Open() */
#define MODE_OLDFILE	     1005   /* Open existing file read/write
				     * positioned at beginning of file. */
#define MODE_NEWFILE	     1006   /* Open freshly created file (delete
				     * old file) read/write, exclusive lock. */
#define MODE_READWRITE	     1004   /* Open old file w/shared lock,
				     * creates file if doesn't exist. */

/* Relative position to Seek() */
#define OFFSET_BEGINNING    -1	    /* relative to Begining Of File */
#define OFFSET_CURRENT	     0	    /* relative to Current file position */
#define OFFSET_END	     1	    /* relative to End Of File	  */

#define OFFSET_BEGINING	    OFFSET_BEGINNING  /* ancient compatibility */

#define BITSPERBYTE	     8
#define BYTESPERLONG	     4
#define BITSPERLONG	     32
#define MAXINT		     0x7FFFFFFF
#define MININT		     0x80000000

/* Passed as type to Lock() */
#define SHARED_LOCK	     -2	    /* File is readable by others */
#define ACCESS_READ	     -2	    /* Synonym */
#define EXCLUSIVE_LOCK	     -1	    /* No other access allowed	  */
#define ACCESS_WRITE	     -1	    /* Synonym */

struct DateStamp {
   LONG	 ds_Days;	      /* Number of days since Jan. 1, 1978 */
   LONG	 ds_Minute;	      /* Number of minutes past midnight */
   LONG	 ds_Tick;	      /* Number of ticks past minute */
}; /* DateStamp */

#define TICKS_PER_SECOND      50   /* Number of ticks in one second */

/* Returned by Examine() and ExNext(), must be on a 4 byte boundary */
struct FileInfoBlock {
   LONG	  fib_DiskKey;
   LONG	  fib_DirEntryType;  /* Type of Directory. If < 0, then a plain file.
			      * If > 0 a directory */
   char	  fib_FileName[108]; /* Null terminated. Max 30 chars used for now */
   LONG	  fib_Protection;    /* bit mask of protection, rwxd are 3-0.	   */
   LONG	  fib_EntryType;
   LONG	  fib_Size;	     /* Number of bytes in file */
   LONG	  fib_NumBlocks;     /* Number of blocks in file */
   struct DateStamp fib_Date;/* Date file last changed */
   char	  fib_Comment[80];  /* Null terminated comment associated with file */

   /* Note: the following fields are not supported by all filesystems.	*/
   /* They should be initialized to 0 sending an ACTION_EXAMINE packet.	*/
   /* When Examine() is called, these are set to 0 for you.		*/
   /* AllocDosObject() also initializes them to 0.			*/
   UWORD  fib_OwnerUID;		/* owner's UID */
   UWORD  fib_OwnerGID;		/* owner's GID */

   char	  fib_Reserved[32];
}; /* FileInfoBlock */

/* FIB stands for FileInfoBlock */

/* FIBB are bit definitions, FIBF are field definitions */
/* Regular RWED bits are 0 == allowed. */
/* NOTE: GRP and OTR RWED permissions are 0 == not allowed! */
/* Group and Other permissions are not directly handled by the filesystem */
#define FIBB_OTR_READ	   15	/* Other: file is readable */
#define FIBB_OTR_WRITE	   14	/* Other: file is writable */
#define FIBB_OTR_EXECUTE   13	/* Other: file is executable */
#define FIBB_OTR_DELETE    12	/* Other: prevent file from being deleted */
#define FIBB_GRP_READ	   11	/* Group: file is readable */
#define FIBB_GRP_WRITE	   10	/* Group: file is writable */
#define FIBB_GRP_EXECUTE   9	/* Group: file is executable */
#define FIBB_GRP_DELETE    8	/* Group: prevent file from being deleted */

#define FIBB_SCRIPT    6	/* program is a script (execute) file */
#define FIBB_PURE      5	/* program is reentrant and rexecutable */
#define FIBB_ARCHIVE   4	/* cleared whenever file is changed */
#define FIBB_READ      3	/* ignored by old filesystem */
#define FIBB_WRITE     2	/* ignored by old filesystem */
#define FIBB_EXECUTE   1	/* ignored by system, used by Shell */
#define FIBB_DELETE    0	/* prevent file from being deleted */

#define FIBF_OTR_READ	   (1<<FIBB_OTR_READ)
#define FIBF_OTR_WRITE	   (1<<FIBB_OTR_WRITE)
#define FIBF_OTR_EXECUTE   (1<<FIBB_OTR_EXECUTE)
#define FIBF_OTR_DELETE    (1<<FIBB_OTR_DELETE)
#define FIBF_GRP_READ	   (1<<FIBB_GRP_READ)
#define FIBF_GRP_WRITE	   (1<<FIBB_GRP_WRITE)
#define FIBF_GRP_EXECUTE   (1<<FIBB_GRP_EXECUTE)
#define FIBF_GRP_DELETE    (1<<FIBB_GRP_DELETE)

#define FIBF_SCRIPT    (1<<FIBB_SCRIPT)
#define FIBF_PURE      (1<<FIBB_PURE)
#define FIBF_ARCHIVE   (1<<FIBB_ARCHIVE)
#define FIBF_READ      (1<<FIBB_READ)
#define FIBF_WRITE     (1<<FIBB_WRITE)
#define FIBF_EXECUTE   (1<<FIBB_EXECUTE)
#define FIBF_DELETE    (1<<FIBB_DELETE)

/* Standard maximum length for an error string from fault.  However, most */
/* error strings should be kept under 60 characters if possible.  Don't   */
/* forget space for the header you pass in. */
#define FAULT_MAX	82

/* All BCPL data must be long word aligned.  BCPL pointers are the long word
 *  address (i.e byte address divided by 4 (>>2)) */
typedef long  BPTR;		    /* Long word pointer */
typedef long  BSTR;		    /* Long word pointer to BCPL string	 */

/* Convert BPTR to typical C pointer */
#ifdef OBSOLETE_LIBRARIES_DOS_H
#define BADDR( bptr )	(((ULONG)bptr) << 2)
#else
/* This one has no problems with CASTing */
#define BADDR(x)	((APTR)((ULONG)(x) << 2))
#endif
/* Convert address into a BPTR */
#define MKBADDR(x)	(((LONG)(x)) >> 2)

/* BCPL strings have a length in the first byte and then the characters.
 * For example:	 s[0]=3 s[1]=S s[2]=Y s[3]=S				 */

/* returned by Info(), must be on a 4 byte boundary */
struct InfoData {
   LONG	  id_NumSoftErrors;	/* number of soft errors on disk */
   LONG	  id_UnitNumber;	/* Which unit disk is (was) mounted on */
   LONG	  id_DiskState;		/* See defines below */
   LONG	  id_NumBlocks;		/* Number of blocks on disk */
   LONG	  id_NumBlocksUsed;	/* Number of block in use */
   LONG	  id_BytesPerBlock;
   LONG	  id_DiskType;		/* Disk Type code */
   BPTR	  id_VolumeNode;	/* BCPL pointer to volume node (see DosList) */
   LONG	  id_InUse;		/* Flag, zero if not in use */
}; /* InfoData */

/* ID stands for InfoData */
	/* Disk states */
#define ID_WRITE_PROTECTED 80	 /* Disk is write protected */
#define ID_VALIDATING	   81	 /* Disk is currently being validated */
#define ID_VALIDATED	   82	 /* Disk is consistent and writeable */

	/* Disk types */
/* ID_INTER_* use international case comparison routines for hashing */
/* Any other new filesystems should also, if possible. */
#define ID_NO_DISK_PRESENT	(-1)
#define ID_UNREADABLE_DISK	(0x42414400L)	/* 'BAD\0' */
#define ID_DOS_DISK		(0x444F5300L)	/* 'DOS\0' */
#define ID_FFS_DISK		(0x444F5301L)	/* 'DOS\1' */
#define ID_INTER_DOS_DISK	(0x444F5302L)	/* 'DOS\2' */
#define ID_INTER_FFS_DISK	(0x444F5303L)	/* 'DOS\3' */
#define ID_FASTDIR_DOS_DISK	(0x444F5304L)	/* 'DOS\4' */
#define ID_FASTDIR_FFS_DISK	(0x444F5305L)	/* 'DOS\5' */
#define ID_NOT_REALLY_DOS	(0x4E444F53L)	/* 'NDOS'  */
#define ID_KICKSTART_DISK	(0x4B49434BL)	/* 'KICK'  */
#define ID_MSDOS_DISK		(0x4d534400L)	/* 'MSD\0' */

/* Errors from IoErr(), etc. */
#define ERROR_NO_FREE_STORE		  103
#define ERROR_TASK_TABLE_FULL		  105
#define ERROR_BAD_TEMPLATE		  114
#define ERROR_BAD_NUMBER		  115
#define ERROR_REQUIRED_ARG_MISSING	  116
#define ERROR_KEY_NEEDS_ARG		  117
#define ERROR_TOO_MANY_ARGS		  118
#define ERROR_UNMATCHED_QUOTES		  119
#define ERROR_LINE_TOO_LONG		  120
#define ERROR_FILE_NOT_OBJECT		  121
#define ERROR_INVALID_RESIDENT_LIBRARY	  122
#define ERROR_NO_DEFAULT_DIR		  201
#define ERROR_OBJECT_IN_USE		  202
#define ERROR_OBJECT_EXISTS		  203
#define ERROR_DIR_NOT_FOUND		  204
#define ERROR_OBJECT_NOT_FOUND		  205
#define ERROR_BAD_STREAM_NAME		  206
#define ERROR_OBJECT_TOO_LARGE		  207
#define ERROR_ACTION_NOT_KNOWN		  209
#define ERROR_INVALID_COMPONENT_NAME	  210
#define ERROR_INVALID_LOCK		  211
#define ERROR_OBJECT_WRONG_TYPE		  212
#define ERROR_DISK_NOT_VALIDATED	  213
#define ERROR_DISK_WRITE_PROTECTED	  214
#define ERROR_RENAME_ACROSS_DEVICES	  215
#define ERROR_DIRECTORY_NOT_EMPTY	  216
#define ERROR_TOO_MANY_LEVELS		  217
#define ERROR_DEVICE_NOT_MOUNTED	  218
#define ERROR_SEEK_ERROR		  219
#define ERROR_COMMENT_TOO_BIG		  220
#define ERROR_DISK_FULL			  221
#define ERROR_DELETE_PROTECTED		  222
#define ERROR_WRITE_PROTECTED		  223
#define ERROR_READ_PROTECTED		  224
#define ERROR_NOT_A_DOS_DISK		  225
#define ERROR_NO_DISK			  226
#define ERROR_NO_MORE_ENTRIES		  232
/* added for 1.4 */
#define ERROR_IS_SOFT_LINK		  233
#define ERROR_OBJECT_LINKED		  234
#define ERROR_BAD_HUNK			  235
#define ERROR_NOT_IMPLEMENTED		  236
#define ERROR_RECORD_NOT_LOCKED		  240
#define ERROR_LOCK_COLLISION		  241
#define ERROR_LOCK_TIMEOUT		  242
#define ERROR_UNLOCK_ERROR		  243

/* error codes 303-305 are defined in dosasl.h */

/* These are the return codes used by convention by AmigaDOS commands */
/* See FAILAT and IF for relvance to EXECUTE files		      */
#define RETURN_OK			    0  /* No problems, success */
#define RETURN_WARN			    5  /* A warning only */
#define RETURN_ERROR			   10  /* Something wrong */
#define RETURN_FAIL			   20  /* Complete or severe failure*/

/* Bit numbers that signal you that a user has issued a break */
#define SIGBREAKB_CTRL_C   12
#define SIGBREAKB_CTRL_D   13
#define SIGBREAKB_CTRL_E   14
#define SIGBREAKB_CTRL_F   15

/* Bit fields that signal you that a user has issued a break */
/* for example:	 if (SetSignal(0,0) & SIGBREAKF_CTRL_C) cleanup_and_exit(); */
#define SIGBREAKF_CTRL_C   (1<<SIGBREAKB_CTRL_C)
#define SIGBREAKF_CTRL_D   (1<<SIGBREAKB_CTRL_D)
#define SIGBREAKF_CTRL_E   (1<<SIGBREAKB_CTRL_E)
#define SIGBREAKF_CTRL_F   ((long)1<<SIGBREAKB_CTRL_F)

/* Values returned by SameLock() */
#define LOCK_DIFFERENT		-1
#define LOCK_SAME		0
#define LOCK_SAME_VOLUME	1	/* locks are on same volume */
#define LOCK_SAME_HANDLER	LOCK_SAME_VOLUME
/* LOCK_SAME_HANDLER was a misleading name, def kept for src compatibility */

/* types for ChangeMode() */
#define CHANGE_LOCK	0
#define CHANGE_FH	1

/* Values for MakeLink() */
#define LINK_HARD	0
#define LINK_SOFT	1	/* softlinks are not fully supported yet */

/* values returned by ReadItem */
#define	ITEM_EQUAL	-2		/* "=" Symbol */
#define ITEM_ERROR	-1		/* error */
#define ITEM_NOTHING	0		/* *N, ;, endstreamch */
#define ITEM_UNQUOTED	1		/* unquoted item */
#define ITEM_QUOTED	2		/* quoted item */

/* types for AllocDosObject/FreeDosObject */
#define DOS_FILEHANDLE		0	/* few people should use this */
#define DOS_EXALLCONTROL	1	/* Must be used to allocate this! */
#define	DOS_FIB			2	/* useful */
#define DOS_STDPKT		3	/* for doing packet-level I/O */
#define DOS_CLI			4	/* for shell-writers, etc */
#define DOS_RDARGS		5	/* for ReadArgs if you pass it in */

#endif	/* DOS_DOS_H */

