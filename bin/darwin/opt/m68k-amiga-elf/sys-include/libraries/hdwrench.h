/* HDWrench.h: RigidDiskBlock preparation program include file.
 *
 *	$VER: HDWrench.h 44.6 (25.11.2000)
 *	Includes Release 44.1
 *
 *	Disk Prep Support Library API includes
 *
 *	Copyright © 1999 Joanne B. Dow, Wizardess Designs, for future
 *		license to Amiga Inc.
 *		All rights reserved.
 */
#ifndef HDWRENCH_H

struct HDWLibrary
{
        struct				 Library ml_Lib;
        ULONG				 ml_SegList;
        ULONG				 ml_Flags;
        APTR				 ml_ExecBase; /* pointer to exec base  */
        long				*ml_relocs;   /* pointer to relocs.    */
        struct HDWLibrary	*ml_origbase; /* pointer to original library base  */
        long				 ml_numjmps;
};

#define	 HDWBaseName	"hdwrench.library"

/* === General Constant Defines === */

/* Artificial unassigned value for the RDB structures. */
#define UNASSIGNED	(ULONG) -131L

/* End block number link within RDB structures */
#define RDBEND		(ULONG) -1L

#define	DEFAULT_RDBBLOCKSHI	63

/* === Structure & Typedefs === */

typedef struct
{
	USHORT	ready [ 16 ];	// Tests ready and first block read
	USHORT	there [ 16 ];	// Tests as "there" but fails other tests
} ValidIDstruct;


/* Actual disk read write return structure: */
struct rw_return
{
	USHORT	success;			// Error code
	USHORT	failed_word;		// 0 on reads.
	USHORT	block_written;		// 0 on reads.
};

enum rw_success_val				// Return values for rw_return.success field.
{
	success = 0,				// 0
	success_on_retry_write,		// 1
	success_on_retry_read,		// 2
	failed_on_write,			// 3
	failed_on_reread,			// 4
	illegal_command,			// 5
	io_command_failure,			// 6
	scsi_command_failure,		// 7
	out_of_memory,				// 8
	no_more_disk_blocks,		// 9
	rdsk_not_located,			// 10
	io_device_not_open,			// 11
	invalid_blocksize_found,	// 12
	no_callback_hook,			// 13
	user_aborted,				// 14
	operation_not_permitted		// 15
};

/* Internal bootblock structure. Create dummy structures to pass to read
 * and write functions as necessary. Be sure that bb_BlockNum is filled in
 * and that the actual size of the data area pointed to by the union is
 * sufficiently large to contain one disk block.
 */
typedef struct bootblock
{
	struct MinNode	 bb_Node;
	LONG			 allocsize;
	LONG			 bb_BlockNum;
	WORD			 bb_Changed;
	LONG			 unit;				// Unit number for THIS set of RDBs.
	char			 DeviceName [32];	// Device name
	struct rw_return bb_RWErrors;
	BOOL			 wflag;				// Written out flag.
	BYTE			 spares[4-sizeof(BOOL)];// Fill out short word

	union
	{
		struct		 RigidDiskBlock bd_RDB;
		struct		 PartitionBlock bd_PB;
		struct		 FileSysHeaderBlock bd_FHB;
		struct		 LoadSegBlock bd_LSB;
		struct		 BadBlockBlock bd_BB;
		UBYTE		 bd_Bytes[512];		// NB: This is the MINIMUM size we
		UWORD		 bd_Words[256];		// can have here. It MAY be extended
		ULONG		 bd_Longs[128];		// if actual block size is larger.
    } bb_Data;
} BootBlock;

/*	==== Error report values for other functions ==== */
#define E_NOERROR			0

#define E_ILLEGAL_SLASH		200
#define	E_EOF_IN_COMMENT	201
#define E_ILLEGAL_STAR		202
#define E_TOKEN_TO_LONG		203
#define E_MEMORY_PANIC		204
#define E_PREMATURE_EOF		205
#define E_MISSING_EQUALS	206
#define E_ILLEGAL_T_F		207
#define E_ILLEGAL_TOKEN		208
#define E_DUPLICATE_DISK	209
#define E_NOT_LEGAL_NAME	210
#define E_EXCEEDED_SIZE_LIM	211
#define E_FILE_WRITE_ERROR	212
#define E_TOOMANY_FS		213
#define E_FSAVE_CONFUSION   214
#define E_FS_CANNOT_OPEN	215
#define E_LOST_IN_RDB_SPACE	216
#define E_FS_WRITE_ERROR	217
#define E_MULTIPLE_RDSKS	218
#define E_RDSK_NOT_1ST		219
#define E_NO_RDBS_LOADED	220
#define E_RDBS_ALREADY_IN	221		// RDBs already loaded.
#define E_FAILED_FILEOPEN   222
#define E_FILE_READ_FAILED	223
#define E_FILE_NOT_RDBS		224
#define E_NO_BLOCKSIZE_SPEC 225
#define E_FILE_WRITE_FAILED	226
#define E_MEMORYP_NULL		227		// prospective "memp" is null
#define E_ILLEGAL_BLOCKSIZE	228
#define E_INSUFFICIENT_MEM  229
#define E_RENUMBER_FAILED	230
#define E_BLOCKS_EXCEEDED	231		// Too many RDB blocks
#define E_INCOMPLETE_FSDESC	232
#define E_FS_NOT_FOUND		233
#define	E_LIST_SCREWEDUP	234
#define E_NO_SUCH_DIR		235
#define E_EXALL_ERROR		236
#define E_UNIT_DIFFERS		237
#define E_CRIT_VALUE_UNDEF	238

#define T_RENUMBER_LEFT		300

#define W_DUPLICATE_FS		100
#define W_FS_NO_WRITE		101

/* Definitions for type field in FileSave */
#define DRIVEINIT	0
#define FILESYSTEM	1

struct DefaultsArray
{
	ULONG	TotalBlocks;
	UWORD	BytesPerBlock;
	UWORD	BlocksPerSurface;
	UWORD	Surfaces;
	UWORD	Cylinders;				// note: MaxCyl = Cylinders - 1;
	UWORD	UnusedBlocks;
};

// Defaults Array filling error bit array
#define DA_NOERRORS				0
#define DA_NO_CAPACITY_REPORT	1
#define DA_NO_OPTIMIZE			2
#define DA_BAD_MODESENSE_4		4
#define DA_BAD_MODESENSE_3		8
#define DA_FAILED				256
#define DA_NO_DRIVE_OPEN		DA_FAILED
#define DA_RIDICULOUS_VALUES	( DA_FAILED << 1 )

// Defaults Array filling "Optimize" Flags
#define DA_OPTIMIZE				1	/* Optimize storage if possible */
#define DA_HUGE					2	/* Allow partitioning huge disks */
#define DA_HF_WAY				4	/* Use the old HardFrame algorithm */
// Note: DA_HF_WAY is forces DA_OPTIMIZE and DA_HUGE off.
//       DA_BAD_MODESENSE_3 and DA_BAD_MODESENSE_4 only happen with DA_HF_WAY
//       Errors below DA_FAILED are informational.

/*	==== Mountfile Recognized Strings ==== */
#ifdef DONT_EVER_COMPILE_ME	// This stuff is for reference only, thank you.

#ifdef FORREAL
#define EXTERN
#else
#define EXTERN	extern
#endif

EXTERN const char	*_Tokens[]
#ifdef FORREAL
= {
	"/",					//0
	"#",
	"=",
	"device",
	"surfaces",
	"blockspertrack",
	"reserved",
	"prealloc",
	"interleave",
	"lowcyl",
	"highcyl",				// 10
	"buffers",
	"bufmemtype",
	"maxtransfer",
	"mask",
	"bootpri",
	"dostype",
	"unit",
	"flags",
	"stacksize",
	"priority",				// 20
	"globvec",
	"filesystem",
	"mount",
	"heads",
	"bytesperblock",
	"disk",
	"rdblow",
	"rdbhi",
	"reselect",
	"hilun",				// 30
	"hiid",
	"hidrive",
	"cylinders",
	"cylinderblocks",
	"mincyl",
	"maxcyl",
	"hicard",
	"blocksize",
	"bootable",
	"readonly",				// 40
	"driveinit",
	"baud",
	"control",
	"bootblocks",
	"synch",
	"sectorsperblock",
	"autoparkseconds",
	"\xff"
}
#endif
;

#define TSLASH			0
#define	THACK			1
#define	TEQUALS			2
#define TDEVICE  		3
#define TSURFACES 		4
#define	TBLOCKSPERTRACK	5
#define	TRESERVED		6
#define	TPREALLOC		7
#define	TINTERLEAVE		8
#define	TLOWCYL			9
#define	THICYL			10
#define	TBUFFERS		11
#define	TBUFMEMTYPE		12
#define	TMAXTRANSFER	13
#define	TMASK			14
#define	TBOOTPRI		15
#define	TDOSTYPE		16
#define	TUNIT			17
#define	TFLAGS			18
#define	TSTACKSIZE		19
#define	TPRIORITY		20
#define	TGLOBVEC		21
#define	TFILESYSTEM		22
#define	TMOUNT			23
#define	THEADS			24
#define	TBYTESPERBLOCK	25
#define TDISK			26
#define	TRDBLOW			27
#define	TRDBHI			28
#define	TRESELECT		29
#define	THILUN			30
#define	THIID			31
#define	TLASTDRIVE		32
#define	TCYLINDERS		33
#define	TCYLINDERBLOCKS 34
#define TMINCYL			35
#define	TMAXCYL			36
#define	THICARD			37
#define TBLOCKSIZE		38
#define TBOOTABLE		39
#define TREADONLY		40
#define TDRIVEINIT		41
#define TBAUD			42
#define TCONTROL		43
#define TBOOTBLOCKS		44
#define TSYNCH			45
#define TSECSPERBLOCK	46
#define TAUTOPARKSECS	47

#define TokenCount		47
#define TNOMATCH		TokenCount + 1

#endif // COMPILEME



typedef struct
{
	STRPTR	devicename;
	LONG	board;
	LONG	address;
	LONG	lun;
	STRPTR	messagestring;
	LONG	extra;
	LONG	param1;
	LONG	param2;
	LONG	param3;
} HDWCallbackMsg;

#define EXTRA_BEFORE_TEST       0
#define EXTRA_AFTER_TEST        1
#define EXTRA_BEFORE_FORMAT     2       /* with no way to stop once you start.*/
#define EXTRA_BEFORE_VERIFY     3       /* Setup the verify requester and
                                           return "go ahead" */
#define EXTRA_UPDATE_VERIFY     4       /* New string for requester - return
                                           any Abort received */
#define EXTRA_VERIFY_REASSIGN   5       /* New string - return "Yes" or "No" */
#define EXTRA_VERIFY_FINISHED   6       /* Notify user, accept OK, close */


/* Function Definitions */
BOOL __saveds __asm				 FindControllerID ( register __a0 char *devname,
													register __a1 ULONG *selfid );
ULONG __saveds __asm			 FindDefaults ( register __d0 USHORT Optimize,
												register __a0 struct DefaultsArray *Return );
BOOL __saveds __asm				 FindDiskName ( register __a0 char *diskname );
ULONG __saveds __asm			 FindLastSector ( void );
ULONG __saveds __asm			 InMemMountfile ( register __d0 ULONG unit,
												  register __a0 char * mfdata,
									 			  register __a1 char *controller );
ULONG __saveds __asm			 InMemRDBStructs ( register __a0 char *rdbp,
												   register __d0 ULONG sizerdb,
												   register __d1 ULONG unit );
void __saveds __asm				 HDWCloseDevice ( void );
BOOL __saveds __asm				 HDWOpenDevice ( register __a0 char *DevName,
												 register __d0 ULONG unit );
ULONG __saveds __asm			 OutMemMountfile ( register __a0 char *mfp,
												   register __a1 ULONG *sizew,
												   register __d0 ULONG sizeb,
												   register __d1 ULONG unit );
ULONG __saveds __asm			 OutMemRDBStructs ( register __a0 char * rdbp,
													register __a1 ULONG *sizew,
													register __d0 ULONG sizeb );
BOOL __saveds __asm 	 		 QueryCapacity ( register __a0 ULONG *totalblocks,
												 register __a1 ULONG *blocksize );
void __saveds __asm				 QueryFindValid ( register __a0 ValidIDstruct *ValidIDs,
												  register __a1 char * devicename,
												  register __d0 int board,
												  register __d1 ULONG types,
												  register __d2 BOOL wide_scsi,
												  register __a2 long ( * __asm CallBack)
																	   ( register __a0 HDWCallbackMsg *msg ));
BOOL __saveds __asm				 QueryInquiry ( register __a0 BYTE *inqbuf,	// 40 bytes
												register __a1 int *errorcode );
BOOL __saveds __asm				 QueryModeSense ( register __d0 BYTE page,
												  register __d1 int msbsize,
												  register __a0 BYTE *msbuf,
												  register __a1 int * errorcode );
BOOL __saveds __asm				 QueryReady ( register __a0 int * errorcode );
USHORT __saveds __asm			 RawRead ( register __a0 BootBlock *bbk,
                                           register __d0 USHORT size );
USHORT __saveds __asm			 RawWrite ( register __a0 BootBlock *bb );
ULONG __saveds __asm			 ReadMountfile ( register __d0 ULONG unit,
												 register __a0 char *filename,
												 register __a1 char * controller );
USHORT __saveds __asm			 ReadRDBs ( void );
ULONG __saveds __asm			 ReadRDBStructs ( register __a0 char *filename,
												  register __d0 ULONG unit );
USHORT __saveds __asm			 WriteBlock ( register __a0 BootBlock *bb );
ULONG __saveds __asm			 WriteMountfile ( register __a0 char* filename,
												  register __a1 char * ldir,
												  register __d0 ULONG unit );
USHORT __saveds __asm			 WriteRDBs ( void );
ULONG __saveds __asm			 WriteRDBStructs ( register __a0 char *filename );
ULONG __saveds __asm			 LowlevelFormat ( register __a0 long ( * __asm CallBack)
																	   ( register __a0 HDWCallbackMsg *msg ));
ULONG __saveds __asm			 VerifyDrive ( register __a0 long ( * __asm CallBack)
																	( register __a0 HDWCallbackMsg *msg ));



#define INQBUFSIZE	36			/* Standard size of Inquiry buffer */
#define MAGC_INQBUFSIZE	56	/* Special Inquiry Buffer Size. */

#define HDWRENCH_H
#endif	// HDWRENCH_H
