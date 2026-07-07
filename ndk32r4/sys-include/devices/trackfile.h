#ifndef DEVICES_TRACKFILE_H
#define DEVICES_TRACKFILE_H

/*
** $VER: trackfile.h 2.10 (15.8.2020)
**
** A trackdisk.device which uses ADF disk image files
*/

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

#ifndef DEVICES_TRACKDISK_H
#include <devices/trackdisk.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/****************************************************************************/

/* You can always open the control unit in order to use
 * the device's library functions.
 */
#define TFUNIT_CONTROL (-1)

/****************************************************************************/

/* The name of the device. */
#define TRACKFILENAME "trackfile.device"

/****************************************************************************/

/* If you want TFStartUnitTagList() to pick the next unused
 * unit number instead of a specific unit number, use this
 * special unit number instead.
 */
#define TFSU_NextAvailableUnit (-1)

/****************************************************************************/

/* Errors that may be returned by TFStartUnitTagList(), TFStopUnitTagList(),
 * TFInsertMediaTagList() and TFEjectMediaTagList().
 */
#define TFERROR_UnitBusy		(-202041)
#define TFERROR_OutOfMemory		(-202042)
#define TFERROR_UnitNotFound		(-202043)
#define TFERROR_AlreadyInUse		(-202044)
#define TFERROR_UnitNotActive		(-202045)
#define TFERROR_InvalidFile		(-202046)
#define TFERROR_InvalidFileSize		(-202047)
#define TFERROR_NoFileGiven		(-202048)
#define TFERROR_Aborted			(-202049)
#define TFERROR_InvalidDriveType	(-202050)
#define TFERROR_ProcessFailed		(-202051)
#define TFERROR_NoMediumPresent		(-202052)
#define TFERROR_ReadOnlyVolume		(-202053)
#define TFERROR_ReadOnlyFile		(-202054)
#define TFERROR_DuplicateDisk		(-202055)
#define TFERROR_DuplicateVolume		(-202056)
#define TFERROR_Denied			(-202057)
#define TFERROR_NotSupported		(-202058)

/****************************************************************************/

#define TF_Dummy (TAG_USER + 0x20200400)

/****************************************************************************/

/* Tags for use with TFStartUnitTagList(), TFStopUnitTagList(),
 * TFInsertMediaTagList() and TFEjectMediaTagList().
 */
#define TF_ImageFileName	(TF_Dummy + 1)	/* (STRPTR) */
#define TF_ImageFileHandle	(TF_Dummy + 2)	/* (BPTR) */
#define TF_WriteProtected	(TF_Dummy + 3)	/* (BOOL) */
#define TF_DriveType		(TF_Dummy + 4)	/* (LONG) */
#define TF_Timeout		(TF_Dummy + 5)	/* (LONG) */
#define TF_EnableChecksums	(TF_Dummy + 6)	/* (BOOL) */
#define TF_TagItemFailed	(TF_Dummy + 7)	/* (struct TagItem **) */
#define TF_MaxCacheMemory	(TF_Dummy + 8)	/* (ULONG) */
#define TF_EnableUnitCache	(TF_Dummy + 9)	/* (ULONG) */
#define TF_PrefillUnitCache	(TF_Dummy + 10)	/* (BOOL) */

/***************************************************************************/

/* Ask TFGetUnitData() to return information about all units. */
#define TFGUD_AllUnits (-1)

/***************************************************************************/

/* TFExamineFileSize() will return the drive type (e.g. DRIVE3_5, from
 * <devices/trackdisk.h>) associated with the size of an Amiga disk image
 * file, if possible. In any other case it will indicate that the file size
 * does not match a supported drive type.
 */
#define TFEFS_Unsupported (-1)

/***************************************************************************/

/* The minimum cache size is 8 tracks, which comes down to about
 * 46,000 bytes and should be sufficient for the root directory,
 * the boot block area, the bitmap blocks or a few directory
 * entries.
 */
#define TF_MINIMUM_CACHE_SIZE (46000)

/***************************************************************************/

/* The disk checksum maintained (optionally) by trackfile.device
 * is a 64 bit unsigned integer.
 */
struct TrackFileChecksum
{
	ULONG tfc_high;
	ULONG tfc_low;
};

/***************************************************************************/

/* Forward declaration */
struct TrackFileUnitData;

/***************************************************************************/

/* Read-only linked list of unit information data
 * returned by TFGetUnitData(), and to be released
 * by TFFreeUnitData().
 */
struct TrackFileUnitData
{
	/* Information about the next unit, or NULL */
	struct TrackFileUnitData *	tfud_Next;
	/* Size of this structure; for future extension */
	ULONG				tfud_Size;

	/* Which number is associated with this unit */
	LONG				tfud_UnitNumber;
	/* Which type of drive is this? See <devices/trackdisk.h> */
	LONG				tfud_DriveType;

	/* The name of the AmigaDOS device, e.g. DA0; can be NULL */
	STRPTR				tfud_DeviceName;	
	/* The path and name of the disk image file; can be NULL */
	STRPTR				tfud_FileName;

	/* Is the unit Process active? */
	BOOL				tfud_IsActive;
	/* Is a writable medium present? */	
	BOOL				tfud_IsWritable;
	/* Is a storage medium present? */
	BOOL				tfud_MediumIsPresent;
	/* Is data being read or written right now? */
	BOOL				tfud_IsBusy;

	/* Are the disk and track checksums current? */
	BOOL				tfud_ChecksumsEnabled;
	/* Current disk checksum, if enabled. */
	struct TrackFileChecksum	tfud_Checksum;

	/* Are the volume attributes valid? */
	BOOL				tfud_VolumeValid;
	/* Name of the volume, if valid */
	TEXT				tfud_VolumeName[32];
	/* Volume creation date and time, if valid */
	struct DateStamp		tfud_VolumeDate;
	/* Disk file system signature, if valid and available; can be zero */
	ULONG				tfud_FileSysSignature;
	/* Disk boot block checksum, if valid and available; can be zero */
	ULONG				tfud_BootBlockChecksum;

	/* Is a cache enabled for this unit? */
	BOOL				tfud_CacheEnabled;
	/* Total number of cache accesses since unit was started */
	ULONG				tfud_CacheAccesses;
	/* Total number of cache misses since unit was started */
	ULONG				tfud_CacheMisses;
};

/***************************************************************************/

#endif /* DEVICES_TRACKFILE_H */
