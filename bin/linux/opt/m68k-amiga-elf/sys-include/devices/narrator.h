#ifndef DEVICES_NARRATOR_H
#define DEVICES_NARRATOR_H
/*
**	$VER: narrator.h 1.7 (12.3.1991)
**	Includes Release 45.1
**
**	V37 Narrator device C language include file
**
**	Copyright 1990, 1991 Joseph Katz/Mark Barton.
**	All rights reserved.
**
**	This include file (narrator.h) may be freely distributed
**	as long as the above copyright notice remains intact.
**
*/


#ifndef EXEC_IO_H
#include <exec/io.h>
#endif


		/*	    Device Options	*/

#define NDB_NEWIORB	0	/* Use new extended IORB		*/
#define NDB_WORDSYNC	1	/* Generate word sync messages		*/
#define NDB_SYLSYNC	2	/* Generate syllable sync messages	*/


#define NDF_NEWIORB	(1 << NDB_NEWIORB)
#define NDF_WORDSYNC	(1 << NDB_WORDSYNC)
#define NDF_SYLSYNC	(1 << NDB_SYLSYNC)



		/*	    Error Codes		*/

#define ND_NoMem	-2	/* Can't allocate memory		*/
#define ND_NoAudLib	-3	/* Can't open audio device		*/
#define ND_MakeBad	-4	/* Error in MakeLibrary call		*/
#define ND_UnitErr	-5	/* Unit other than 0			*/
#define ND_CantAlloc	-6	/* Can't allocate audio channel(s)	*/
#define ND_Unimpl	-7	/* Unimplemented command		*/
#define ND_NoWrite	-8	/* Read for mouth without write first	*/
#define ND_Expunged	-9	/* Can't open, deferred expunge bit set	*/
#define ND_PhonErr     -20	/* Phoneme code spelling error			*/
#define ND_RateErr     -21	/* Rate out of bounds			*/
#define ND_PitchErr    -22	/* Pitch out of bounds				*/
#define ND_SexErr      -23	/* Sex not valid			*/
#define ND_ModeErr     -24	/* Mode not valid			*/
#define ND_FreqErr     -25	/* Sampling frequency out of bounds	*/
#define ND_VolErr      -26	/* Volume out of bounds		*/
#define ND_DCentErr    -27	/* Degree of centralization out of bounds */
#define ND_CentPhonErr -28	/* Invalid central phon			*/



		/* Input parameters and defaults */

#define DEFPITCH    110		/* Default pitch			*/
#define DEFRATE     150		/* Default speaking rate (wpm)			*/
#define DEFVOL	    64		/* Default volume (full)		*/
#define DEFFREQ     22200	/* Default sampling frequency (Hz)	*/
#define MALE	    0		/* Male vocal tract			*/
#define FEMALE	    1		/* Female vocal tract			*/
#define NATURALF0   0		/* Natural pitch contours		*/
#define ROBOTICF0   1		/* Monotone pitch			*/
#define MANUALF0    2		/* Manual setting of pitch contours	*/
#define DEFSEX	    MALE	/* Default sex					*/
#define DEFMODE     NATURALF0	/* Default mode			*/
#define	DEFARTIC    100		/* 100% articulation (normal)		*/
#define DEFCENTRAL  0		/* No centralization			*/
#define DEFF0PERT   0		/* No F0 Perturbation			*/
#define DEFF0ENTHUS 32		/* Default F0 enthusiasm (in 32nds)	*/
#define DEFPRIORITY 100		/* Default speaking priority		*/


			/*	Parameter bounds	*/

#define MINRATE     40		/* Minimum speaking rate		*/
#define MAXRATE     400		/* Maximum speaking rate		*/
#define MINPITCH    65		/* Minimum pitch			*/
#define MAXPITCH    320		/* Maximum pitch			*/
#define MINFREQ     5000	/* Minimum sampling frequency		*/
#define MAXFREQ     28000	/* Maximum sampling frequency		*/
#define MINVOL	    0		/* Minimum volume			*/
#define MAXVOL	    64		/* Maximum volume			*/
#define MINCENT      0		/* Minimum degree of centralization	*/
#define MAXCENT    100		/* Maximum degree of centralization	*/


		/*    Standard Write request	*/

struct narrator_rb {
	struct IOStdReq  message;	/* Standard IORB		*/
	UWORD	rate;			/* Speaking rate (words/minute) */
	UWORD	pitch;			/* Baseline pitch in Hertz		*/
	UWORD	mode;			/* Pitch mode			*/
	UWORD	sex;			/* Sex of voice			*/
	UBYTE	*ch_masks;		/* Pointer to audio alloc maps	*/
	UWORD	nm_masks;		/* Number of audio alloc maps	*/
	UWORD	volume;			/* Volume. 0 (off) thru 64	*/
	UWORD	sampfreq;		/* Audio sampling freq			*/
	UBYTE	mouths;			/* If non-zero, generate mouths */
	UBYTE	chanmask;		/* Which ch mask used (internal)*/
	UBYTE	numchan;		/* Num ch masks used (internal) */
	UBYTE	flags;			/* New feature flags		*/
	UBYTE	F0enthusiasm;		/* F0 excursion factor		*/
	UBYTE	F0perturb;		/* Amount of F0 perturbation	*/
	BYTE	F1adj;			/* F1 adjustment in ±5% steps	*/
	BYTE	F2adj;				/* F2 adjustment in ±5% steps	*/
	BYTE	F3adj;			/* F3 adjustment in ±5% steps	*/
	BYTE	A1adj;			/* A1 adjustment in decibels	*/
	BYTE	A2adj;			/* A2 adjustment in decibels	*/
	BYTE	A3adj;			/* A3 adjustment in decibels	*/
	UBYTE	articulate;		/* Transition time multiplier	*/
	UBYTE	centralize;		/* Degree of vowel centralization */
	char	*centphon;		/* Pointer to central ASCII phon  */
	BYTE	AVbias;			/* AV bias			*/
	BYTE	AFbias;			/* AF bias			*/
	BYTE	priority;		/* Priority while speaking	*/
	BYTE	pad1;			/* For alignment		*/
    };



		/*    Standard Read request	*/

struct mouth_rb {
	struct	narrator_rb voice;	/* Speech IORB			*/
	UBYTE	width;			/* Width (returned value)	*/
	UBYTE	height;			/* Height (returned value)	*/
	UBYTE	shape;			/* Internal use, do not modify	*/
	UBYTE	sync;			/* Returned sync events		*/
	};



#endif	/* DEVICES_NARRATOR_H */
