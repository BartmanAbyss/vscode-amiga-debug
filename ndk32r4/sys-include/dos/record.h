#ifndef DOS_RECORD_H
#define DOS_RECORD_H
/*
**
**	$VER: record.h 47.1 (29.7.2019)
**
**	include file for record locking
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
**
*/

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

/* Modes for LockRecord/LockRecords() */
#define REC_EXCLUSIVE		0
#define REC_EXCLUSIVE_IMMED	1
#define REC_SHARED		2
#define REC_SHARED_IMMED	3

/* struct to be passed to LockRecords()/UnLockRecords() */

struct RecordLock {
	BPTR	rec_FH;		/* filehandle */
	ULONG	rec_Offset;	/* offset in file */
	ULONG	rec_Length;	/* length of file to be locked */
	ULONG	rec_Mode;	/* Type of lock */
};

#endif /* DOS_RECORD_H */
