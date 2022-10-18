	IFND DEVICES_NARRATOR_I
DEVICES_NARRATOR_I	SET 1
**
**	$VER: narrator.i 37.7 (12.3.1991)
**	Includes Release 45.1
**
**	V37 Narrator device ASM include file
**
**	Copyright 1990, 1991 Joseph Katz/Mark Barton.
**	All rights reserved.
**
**	This include file (narrator.i) may be freely distributed
**	as long as the above copyright notice remains intact.
**

	IFND	EXEC_IO_I
	INCLUDE "exec/io.i"
	ENDC


*		;------	Default values, user parms, and general constants

DEFPITCH	EQU	110		;DEFAULT PITCH
DEFRATE	EQU	150		;DEFAULT RATE
DEFVOL		EQU	64		;DEFAULT VOLUME (FULL)
DEFFREQ	EQU	22200		;DEFAULT SAMPLING FREQUENCY
NATURALF0	EQU	0		;NATURAL F0 CONTOURS
ROBOTICF0	EQU	1		;MONOTONE PITCH
MANUALF0	EQU	2		;MANUAL SETTING OF PITCH
MALE		EQU	0		;MALE SPEAKER
FEMALE		EQU	1		;FEMALE SPEAKER
DEFSEX		EQU	MALE		;DEFAULT SEX
DEFMODE	EQU	NATURALF0	;DEFAULT MODE
DEFARTIC	EQU	100		;DEFAULT ARTICULATION 100%
DEFCENTRAL	EQU	0		;DEFAULT PERCENTAGE OF CENTRALIZATION=0
DEFF0PERT	EQU	0		;DEFAULT F0 PERTURBATION
DEFF0ENTHUS	EQU	32		;DEFAULT F0 ENTHUSIASM (in 32nds)
DEFPRIORITY	EQU	100		;DEFAULT SPEAKING PRIORITY


*		;------	Parameter bounds

MINRATE	EQU	 40		;MINIMUM SPEAKING RATE
MAXRATE	EQU	400		;MAXIMUM SPEAKING RATE
MINPITCH	EQU	 65		;MINIMUM PITCH
MAXPITCH	EQU	320		;MAXIMUM PITCH
MINFREQ	EQU    5000		;MINIMUM SAMPLING FREQUENCY
MAXFREQ	EQU   28000		;MAXIMUM SAMPLING FREQUENCY
MINVOL		EQU	  0		;MINIMUM VOLUME
MAXVOL		EQU	 64		;MAXIMUM VOLUME
MINCENT	EQU	  0		;MINIMUM DEGREE OF CENTRALIZATION
MAXCENT	EQU	100		;MAXIMUM DEGREE OF CENTRALIZATION

*		;------	Driver error codes

ND_NotUsed	EQU	 -1		;
ND_NoMem	EQU	 -2		;Can't allocate memory
ND_NoAudLib	EQU	 -3		;Can't open audio device
ND_MakeBad	EQU	 -4		;Error in MakeLibrary call
ND_UnitErr	EQU	 -5		;Unit other than 0
ND_CantAlloc	EQU	 -6		;Can't allocate the audio channel
ND_Unimpl	EQU	 -7		;Unimplemented command
ND_NoWrite	EQU	 -8		;Read for mouth shape without write
ND_Expunged	EQU	 -9		;Can't open, deferred expunge bit set
ND_PhonErr	EQU	-20		;Phoneme code spelling error
ND_RateErr	EQU	-21		;Rate out of bounds
ND_PitchErr	EQU	-22		;Pitch out of bounds
ND_SexErr	EQU	-23		;Sex not valid
ND_ModeErr	EQU	-24		;Mode not valid
ND_FreqErr	EQU	-25		;Sampling freq out of bounds
ND_VolErr	EQU	-26		;Volume out of bounds
ND_DCentErr	EQU	-27		;Degree of centralization out of bounds
ND_CentPhonErr	EQU	-28		;Invalid central phon


*		;------ Bit/field definitions of "flags" field of IORB.

NDB_NEWIORB	EQU	0		;Use new IORB flag
NDB_WORDSYNC	EQU	1		;Generate word sync messages
NDB_SYLSYNC	EQU	2		;Generate syllable sync messages

NDF_NEWIORB	EQU	(1<<NDB_NEWIORB)
NDF_WORDSYNC	EQU	(1<<NDB_WORDSYNC)
NDF_SYLSYNC	EQU	(1<<NDB_SYLSYNC)


*		;------ Write IORequest block

 STRUCTURE NDI,IOSTD_SIZE
	UWORD	NDI_RATE		;Speaking rate in words/minute
	UWORD	NDI_PITCH		;Baseline pitch in Hertz
	UWORD	NDI_MODE		;F0 mode
	UWORD	NDI_SEX			;Speaker sex
	APTR	NDI_CHMASKS		;Pointer to audio channel masks
	UWORD	NDI_NUMMASKS		;Size of channel masks array
	UWORD	NDI_VOLUME		;Channel volume
	UWORD	NDI_SAMPFREQ		;Sampling frequency
	UBYTE	NDI_MOUTHS		;Generate mouths? (Boolean value)
	UBYTE	NDI_CHANMASK		;Actual channel mask used (internal use)
	UBYTE	NDI_NUMCHAN		;Number of channels used (internal use)
	UBYTE	NDI_FLAGS		;New feature flags
	UBYTE	NDI_F0ENTHUSIASM	;F0 excursion factor
	BYTE	NDI_F0PERTURB		;Amount of F0 perturbation
	BYTE	NDI_F1ADJ		;F1 adjustment in ±5% steps
	BYTE	NDI_F2ADJ		;F2 adjustment in ±5% steps
	BYTE	NDI_F3ADJ		;F3 adjustment in ±5% steps
	BYTE	NDI_A1ADJ		;A1 adjustment in decibels
	BYTE	NDI_A2ADJ		;A2 adjustment in decibels
	BYTE	NDI_A3ADJ		;A3 adjustment in decibels
	UBYTE	NDI_ARTICULATE		;Transition time multiplier
	UBYTE	NDI_CENTRALIZE		;Degree of vowel centralization
	APTR	NDI_CENTPHON		;Ptr to ASCII central phon code
	BYTE	NDI_AVBIAS		;AV bias
	BYTE	NDI_AFBIAS		;AF bias
	BYTE	NDI_PRIORITY		;Priority while speaking
	BYTE	NDI_PAD1		;For alignment
	LABEL	NDI_SIZE		;Size of Narrator IORequest block


*		;------	Mouth read IORB

 STRUCTURE MRB,NDI_SIZE
	UBYTE	MRB_WIDTH		;Mouth width
	UBYTE	MRB_HEIGHT		;Mouth height
	UBYTE	MRB_SHAPE		;Compressed shape (height/width)
	UBYTE	MRB_SYNC		;Sync events
	LABEL	MRB_SIZE


	ENDC	; DEVICES_NARRATOR_I

