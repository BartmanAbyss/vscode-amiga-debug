#ifndef PREFS_SOUND_H
#define PREFS_SOUND_H
/*
**	$VER: sound.h 38.2 (20.6.1991)
**	Includes Release 45.1
**
**	File format for sound preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif


/*****************************************************************************/


#define ID_SOND MAKE_ID('S','O','N','D')


struct SoundPrefs
{
    LONG  sop_Reserved[4];	      /* System reserved	    */
    BOOL  sop_DisplayQueue;	      /* Flash the display?	    */
    BOOL  sop_AudioQueue;	      /* Make some sound?	    */
    UWORD sop_AudioType;	      /* Type of sound, see below   */
    UWORD sop_AudioVolume;	      /* Volume of sound, 0..64     */
    UWORD sop_AudioPeriod;	      /* Period of sound, 127..2500 */
    UWORD sop_AudioDuration;	      /* Length of simple beep	    */
    char  sop_AudioFileName[256];     /* Filename of 8SVX file	    */
};


/* constants for SoundPrefs.sop_AudioType */
#define SPTYPE_BEEP	0	/* simple beep sound */
#define SPTYPE_SAMPLE	1	/* sampled sound     */


/*****************************************************************************/


#endif /* PREFS_SOUND_H */
