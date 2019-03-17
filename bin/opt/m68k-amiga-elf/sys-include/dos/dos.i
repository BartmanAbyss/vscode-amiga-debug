	IFND	DOS_DOS_I
DOS_DOS_I SET	1
**	$VER: dos.i 36.27 (5.4.1992)
**	Includes Release 45.1
**
**	Standard asm header for AmigaDOS
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_TYPES_I
	INCLUDE	"exec/types.i"
	ENDC

DOSNAME	    MACRO
      DC.B  'dos.library',0
      ENDM

* Predefined Amiga DOS global constants

DOSTRUE	      EQU     -1
DOSFALSE      EQU      0

* Mode parameter to Open()
MODE_OLDFILE	     EQU   1005	  * Open existing file read/write
*				  * positioned at beginning of file.
MODE_NEWFILE	     EQU   1006	  * Open freshly created file (delete
*				  * old file) read/write
MODE_READWRITE	     EQU   1004	  * Open old file w/shared lock,
*				  * creates file if doesn't exist.

* Relative position to Seek() 
OFFSET_BEGINNING     EQU   -1	  * relative to Beginning Of File 
OFFSET_CURRENT	     EQU    0	  * relative to Current file position 
OFFSET_END	     EQU    1	  * relative to End Of File    

OFFSET_BEGINING	    EQU	  OFFSET_BEGINNING     * Ancient compatibility

BITSPERBYTE	     EQU   8
BYTESPERLONG	     EQU   4
BITSPERLONG	     EQU   32
MAXINT		     EQU   $7FFFFFFF
MININT		     EQU   $80000000

* Passed as type to Lock() 
SHARED_LOCK	     EQU   -2	; File is readable by others 
ACCESS_READ	     EQU   -2	; Synonym
EXCLUSIVE_LOCK	     EQU   -1	; No other access allowed    
ACCESS_WRITE	     EQU   -1	; Synonym


 STRUCTURE DateStamp,0 
   LONG	 ds_Days		; Number of days since Jan. 1, 1978
   LONG	 ds_Minute		; Number of minutes past midnight 
   LONG	 ds_Tick		; Number of ticks past minute 
   LABEL ds_SIZEOF		; DateStamp 

TICKS_PER_SECOND EQU 50		; Number of ticks in one second 

* Returned by Examine() and ExInfo() 
 STRUCTURE FileInfoBlock,0
   LONG	  fib_DiskKey
   LONG	  fib_DirEntryType	; Type of Directory. If < 0, then a plain file.
				; If > 0 a directory 
   STRUCT fib_FileName,108	; Null terminated. Max 30 chars used for now 
   LONG	  fib_Protection	; bit mask of protection, rwxd are 3-0.	     
   LONG	  fib_EntryType
   LONG	  fib_Size		; Number of bytes in file 
   LONG	  fib_NumBlocks		; Number of blocks in file 
   STRUCT fib_DateStamp,ds_SIZEOF ; Date file last changed.
   STRUCT fib_Comment,80	; Null terminated. Comment associated with file 

   ; Note: the following fields are not supported by all filesystems.
   ; They should be initialized to 0 sending an ACTION_EXAMINE packet.
   ; When Examine() is called, these are set to 0 for you.
   ; AllocDosObject() also initializes them to 0.
   UWORD  fib_OwnerUID		; owner's UID
   UWORD  fib_OwnerGID		; owner's GID

   STRUCT fib_Reserved,32
   LABEL  fib_SIZEOF		; FileInfoBlock 

* FIB stands for FileInfoBlock 
* FIBB are bit definitions, FIBF are field definitions 
* Regular RWED bits are 0 == allowed.
* NOTE: GRP and OTR RWED permissions are 0 == not allowed!
* Group and Other permissions are not directly handled by the filesystem
   BITDEF   FIB,OTR_READ,15	; Other: file is readable
   BITDEF   FIB,OTR_WRITE,14	; Other: file is writable
   BITDEF   FIB,OTR_EXECUTE,13	; Other: file is executable
   BITDEF   FIB,OTR_DELETE,12	; Other: prevent file from being deleted
   BITDEF   FIB,GRP_READ,11	; Group: file is readable
   BITDEF   FIB,GRP_WRITE,10	; Group: file is writable
   BITDEF   FIB,GRP_EXECUTE,9	; Group: file is executable
   BITDEF   FIB,GRP_DELETE,8	; Group: prevent file from being deleted

   BITDEF   FIB,SCRIPT,6	; program is an execute script
   BITDEF   FIB,PURE,5		; program is reentrant and reexecutable
   BITDEF   FIB,ARCHIVE,4	; cleared whenever file is changed
   BITDEF   FIB,READ,3		; ignored by old filesystem
   BITDEF   FIB,WRITE,2		; ignored by old filesystem
   BITDEF   FIB,EXECUTE,1	; ignored by system, used by Shell
   BITDEF   FIB,DELETE,0	; prevent file from being deleted

* Standard maximum length for an error string from fault.  However, most
* error strings should be kept under 60 characters if possible.  Don't
* forget space for the header you pass in.
FAULT_MAX	EQU	82

* All BCPL data must be long word aligned.  BCPL pointers are the long word
* address (i.e byte address divided by 4 (>>2))

* Macro to indicate BCPL pointers
BPTR	 MACRO			    * Long word pointer
	 LONG	  \1
	 ENDM
BSTR	 MACRO			    * Long word pointer to BCPL string.
	 LONG	  \1
	 ENDM

* #define BADDR( bptr ) (bptr << 2) * Convert BPTR to byte addressed pointer

* BCPL strings have a length in the first byte and then the characters.
* For example:	s[0]=3 s[1]=S s[2]=Y s[3]=S

* returned by Info()
 STRUCTURE InfoData,0
   LONG id_NumSoftErrors	* number of soft errors on disk
   LONG id_UnitNumber		* Which unit disk is (was) mounted on
   LONG id_DiskState		* See defines below
   LONG id_NumBlocks		* Number of blocks on disk
   LONG id_NumBlocksUsed	* Number of block in use
   LONG id_BytesPerBlock
   LONG id_DiskType		* Disk Type code
   BPTR id_VolumeNode		* BCPL pointer to volume node (see DosList)
   LONG id_InUse		* Flag, zero if not in use
   LABEL id_SIZEOF		* InfoData

* ID stands for InfoData
*	     Disk states
ID_WRITE_PROTECTED	EQU	80	* Disk is write protected
ID_VALIDATING		EQU	81	* Disk is currently being validated
ID_VALIDATED		EQU	82	* Disk is consistent and writeable

*	   Disk types
* ID_INTER_* use international case comparison routines for hashing
* Any other new filesystems should also use it, if possible
ID_NO_DISK_PRESENT	EQU -1
ID_UNREADABLE_DISK	EQU  ('B'<<24)!('A'<<16)!('D'<<8)
ID_NOT_REALLY_DOS	EQU  ('N'<<24)!('D'<<16)!('O'<<8)!('S')
ID_DOS_DISK		EQU  ('D'<<24)!('O'<<16)!('S'<<8)
ID_FFS_DISK		EQU  ('D'<<24)!('O'<<16)!('S'<<8)!(1)
ID_INTER_DOS_DISK	EQU  ('D'<<24)!('O'<<16)!('S'<<8)!(2)
ID_INTER_FFS_DISK	EQU  ('D'<<24)!('O'<<16)!('S'<<8)!(3)
ID_FASTDIR_DOS_DISK	EQU  ('D'<<24)!('O'<<16)!('S'<<8)!(4)
ID_FASTDIR_FFS_DISK	EQU  ('D'<<24)!('O'<<16)!('S'<<8)!(5)
ID_KICKSTART_DISK	EQU  ('K'<<24)!('I'<<16)!('C'<<8)!('K')
ID_MSDOS_DISK		EQU  ('M'<<24)!('S'<<16)!('D'<<8)

* Errors from IoErr(), etc.
ERROR_NO_FREE_STORE		  EQU  103
ERROR_TASK_TABLE_FULL		  EQU  105
ERROR_BAD_TEMPLATE		  EQU  114
ERROR_BAD_NUMBER		  EQU  115
ERROR_REQUIRED_ARG_MISSING	  EQU  116
ERROR_KEY_NEEDS_ARG		  EQU  117
ERROR_TOO_MANY_ARGS		  EQU  118
ERROR_UNMATCHED_QUOTES		  EQU  119
ERROR_LINE_TOO_LONG		  EQU  120
ERROR_FILE_NOT_OBJECT		  EQU  121
ERROR_INVALID_RESIDENT_LIBRARY	  EQU  122
ERROR_NO_DEFAULT_DIR		  EQU  201
ERROR_OBJECT_IN_USE		  EQU  202
ERROR_OBJECT_EXISTS		  EQU  203
ERROR_DIR_NOT_FOUND		  EQU  204
ERROR_OBJECT_NOT_FOUND		  EQU  205
ERROR_BAD_STREAM_NAME		  EQU  206
ERROR_OBJECT_TOO_LARGE		  EQU  207
ERROR_ACTION_NOT_KNOWN		  EQU  209
ERROR_INVALID_COMPONENT_NAME	  EQU  210
ERROR_INVALID_LOCK		  EQU  211
ERROR_OBJECT_WRONG_TYPE		  EQU  212
ERROR_DISK_NOT_VALIDATED	  EQU  213
ERROR_DISK_WRITE_PROTECTED	  EQU  214
ERROR_RENAME_ACROSS_DEVICES	  EQU  215
ERROR_DIRECTORY_NOT_EMPTY	  EQU  216
ERROR_TOO_MANY_LEVELS		  EQU  217
ERROR_DEVICE_NOT_MOUNTED	  EQU  218
ERROR_SEEK_ERROR		  EQU  219
ERROR_COMMENT_TOO_BIG		  EQU  220
ERROR_DISK_FULL			  EQU  221
ERROR_DELETE_PROTECTED		  EQU  222
ERROR_WRITE_PROTECTED		  EQU  223
ERROR_READ_PROTECTED		  EQU  224
ERROR_NOT_A_DOS_DISK		  EQU  225
ERROR_NO_DISK			  EQU  226
ERROR_NO_MORE_ENTRIES		  EQU  232
* added for 1.4
ERROR_IS_SOFT_LINK		  EQU  233
ERROR_OBJECT_LINKED		  EQU  234
ERROR_BAD_HUNK			  EQU  235
ERROR_NOT_IMPLEMENTED		  EQU  236
ERROR_RECORD_NOT_LOCKED		  EQU  240
ERROR_LOCK_COLLISION		  EQU  241
ERROR_LOCK_TIMEOUT		  EQU  242
ERROR_UNLOCK_ERROR		  EQU  243

* error codes 303-305 are defined in dosasl.i

* These are the return codes used by convention by AmigaDOS commands
* See FAILAT and IF for relvance to EXECUTE files
RETURN_OK			  EQU	 0  * No problems, success
RETURN_WARN			  EQU	 5  * A warning only
RETURN_ERROR			  EQU	10  * Something wrong
RETURN_FAIL			  EQU	20  * Complete or severe failure

* Bit numbers that signal you that a user has issued a break
* for example: if (SetSignal(0,0) & SIGBREAKF_CTRL_C) cleanup_and_exit();
	BITDEF	SIGBREAK,CTRL_C,12
	BITDEF	SIGBREAK,CTRL_D,13
	BITDEF	SIGBREAK,CTRL_E,14
	BITDEF	SIGBREAK,CTRL_F,15

* Values returned by SameLock()
LOCK_DIFFERENT		EQU	-1
LOCK_SAME		EQU	0
LOCK_SAME_VOLUME	EQU	1	; locks are on same volume
LOCK_SAME_HANDLER	EQU	LOCK_SAME_VOLUME
* LOCK_SAME_HANDLER was a misleading name, def kept for src compatibility

* types for ChangeMode()
CHANGE_LOCK	EQU	0
CHANGE_FH	EQU	1

* Values for MakeLink()
LINK_HARD	EQU	0
LINK_SOFT	EQU	1		; softlinks are not fully supported yet

* values returned by ReadItem
ITEM_EQUAL	EQU	-2		; "=" Symbol
ITEM_ERROR	EQU	-1		; error
ITEM_NOTHING	EQU	0		; *N, ;, endstreamch
ITEM_UNQUOTED	EQU	1		; unquoted item
ITEM_QUOTED	EQU	2		; quoted item

* types for AllocDosObject/FreeDosObject
DOS_FILEHANDLE		EQU	0	; few people should use this
DOS_EXALLCONTROL	EQU	1	; Must be used to allocate this!
DOS_FIB			EQU	2	; useful
DOS_STDPKT		EQU	3	; for doing packet-level I/O
DOS_CLI			EQU	4	; for shell-writers, etc
DOS_RDARGS		EQU	5	; for ReadArgs if you pass it in

	ENDC	; DOS_DOS_I
