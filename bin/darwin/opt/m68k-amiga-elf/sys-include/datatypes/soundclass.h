#ifndef	DATATYPES_SOUNDCLASS_H
#define	DATATYPES_SOUNDCLASS_H
/*
**	$VER: soundclass.h 44.7 (6.6.1999)
**	Includes Release 45.1
**
**	Interface definitions for DataType sound objects.
**
**	Copyright © 1992-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef	DATATYPES_DATATYPESCLASS_H
#include <datatypes/datatypesclass.h>
#endif

#ifndef	LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif

#ifndef	DEVICES_TIMER_H
#include <devices/timer.h>
#endif

/*****************************************************************************/

#define	SOUNDDTCLASS		"sound.datatype"

/*****************************************************************************/

/* Sound attributes */
#define	SDTA_Dummy		(DTA_Dummy + 500)
#define	SDTA_VoiceHeader	(SDTA_Dummy + 1)

/* (BYTE *) Sample data */
#define	SDTA_Sample		(SDTA_Dummy + 2)

/* (ULONG) Length of the sample data in UBYTEs */
#define	SDTA_SampleLength	(SDTA_Dummy + 3)

/* (UWORD) Period */
#define	SDTA_Period		(SDTA_Dummy + 4)

/* (UWORD) Volume. Range from 0 to 64 */
#define	SDTA_Volume		(SDTA_Dummy + 5)

#define	SDTA_Cycles		(SDTA_Dummy + 6)

/* The following tags are new for V40 */

/* (struct Task *) Task to signal when sound is complete or next buffer needed. */
#define	SDTA_SignalTask		(SDTA_Dummy + 7)

/* (ULONG) Signal mask to use on completion or 0 to disable
 *
 *         NOTE: Due to a bug in sound.datatype V40 SDTA_SignalBit
 *               was actually implemented as a signal mask as opposed
 *               to a bit number. The documentation now reflects
 *               this. If you intend to use a signal bit number
 *               instead of the mask, use the new V44 tag
 *               SDTA_SignalBitNumber below.
 */
#define	SDTA_SignalBit		(SDTA_Dummy + 8)
#define	SDTA_SignalBitMask	SDTA_SignalBit

/* (BOOL) Playing a continuous stream of data.  Defaults to FALSE. */
#define	SDTA_Continuous		(SDTA_Dummy + 9)

/* The following tags are new for V44 */

/* (BYTE) Signal bit to use on completion or -1 to disable */
#define	SDTA_SignalBitNumber	(SDTA_Dummy + 10)

/* (UWORD) Samples per second */
#define	SDTA_SamplesPerSec	(SDTA_Dummy + 11)

/* (struct timeval *) Sample replay period */
#define	SDTA_ReplayPeriod	(SDTA_Dummy + 12)

/* (BYTE *) Sample data */
#define	SDTA_LeftSample		(SDTA_Dummy + 13)
#define	SDTA_RightSample	(SDTA_Dummy + 14)

/* (BYTE) Stereo panning */
#define	SDTA_Pan		(SDTA_Dummy + 15)

/* (BOOL) FreeVec() all sample data upon OM_DISPOSE. */
#define	SDTA_FreeSampleData	(SDTA_Dummy + 16)

/* (BOOL) Wait for the current sample to be played back before
 * switching to the new sample data.
 */
#define	SDTA_SyncSampleChange	(SDTA_Dummy + 17)

/*****************************************************************************/

/* Data compression methods */
#define CMP_NONE     0
#define CMP_FIBDELTA 1

/*****************************************************************************/

/* Unity = Fixed 1.0 = maximum volume */
#define Unity 0x10000UL

/*****************************************************************************/

struct VoiceHeader
{
	ULONG vh_OneShotHiSamples;	/* # samples in the high octave 1-shot part */
	ULONG vh_RepeatHiSamples;	/* # samples in the high octave repeat part */
	ULONG vh_SamplesPerHiCycle;	/* # samples/cycle in high octave, else 0 */
	UWORD vh_SamplesPerSec;		/* data sampling rate */
	UBYTE vh_Octaves;		/* # of octaves of waveforms */
	UBYTE vh_Compression;		/* data compression technique used */
	ULONG vh_Volume;		/* playback nominal volume from 0 to Unity
					 * (full volume). Map this value into
					 * the output hardware's dynamic range.
					 */
};

/*****************************************************************************/

/* Channel allocation */
#define SAMPLETYPE_Left		(2L)
#define SAMPLETYPE_Right	(4L)
#define SAMPLETYPE_Stereo	(6L)

typedef long SampleType;

/*****************************************************************************/

/* IFF types */
#define ID_8SVX	MAKE_ID('8','S','V','X')
#define ID_VHDR	MAKE_ID('V','H','D','R')
#define ID_CHAN	MAKE_ID('C','H','A','N')
#define ID_BODY	MAKE_ID('B','O','D','Y')

/*****************************************************************************/

#endif	/* DATATYPES_SOUNDCLASS_H */
