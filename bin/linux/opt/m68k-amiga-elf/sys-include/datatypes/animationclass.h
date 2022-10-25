#ifndef	DATATYPES_ANIMATIONCLASS_H
#define	DATATYPES_ANIMATIONCLASS_H
/*
**	$VER: animationclass.h 44.2 (27.3.1999)
**	Includes Release 45.1
**
**	Interface definitions for DataType animation objects.
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef	DATATYPES_DATATYPESCLASS_H
#include <datatypes/datatypesclass.h>
#endif

#ifndef	DATATYPES_PICTURECLASS_H
#include <datatypes/pictureclass.h>
#endif

#ifndef	DATATYPES_SOUNDCLASS_H
#include <datatypes/soundclass.h>
#endif

#ifndef	LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif

/*****************************************************************************/

#define	ANIMATIONDTCLASS		"animation.datatype"

/*****************************************************************************/

/* Animation attributes */
#define	ADTA_Dummy		(DTA_Dummy + 600)
#define	ADTA_ModeID		PDTA_ModeID

/* (struct BitMap *) Key frame (first frame) bitmap */
#define	ADTA_KeyFrame		PDTA_BitMap

#define	ADTA_ColorRegisters	PDTA_ColorRegisters
#define	ADTA_CRegs		PDTA_CRegs
#define	ADTA_GRegs		PDTA_GRegs
#define	ADTA_ColorTable		PDTA_ColorTable
#define	ADTA_ColorTable2	PDTA_ColorTable2
#define	ADTA_Allocated		PDTA_Allocated
#define	ADTA_NumColors		PDTA_NumColors
#define	ADTA_NumAlloc		PDTA_NumAlloc

/* (BOOL) : Remap animation (defaults to TRUE) */
#define	ADTA_Remap		PDTA_Remap

/* (struct Screen *) Screen to remap to */
#define	ADTA_Screen		PDTA_Screen

#define	ADTA_Width		(ADTA_Dummy + 1)
#define	ADTA_Height		(ADTA_Dummy + 2)
#define	ADTA_Depth		(ADTA_Dummy + 3)
/* (ULONG) Number of frames in the animation */
#define	ADTA_Frames		(ADTA_Dummy + 4)

/* (ULONG) Current frame */
#define	ADTA_Frame		(ADTA_Dummy + 5)

/* (ULONG) Frames per second */
#define	ADTA_FramesPerSecond	(ADTA_Dummy + 6)

/* (LONG) Amount to change frame by when fast forwarding or
 * rewinding.  Defaults to 10.
 */
#define	ADTA_FrameIncrement	(ADTA_Dummy + 7)

/* (ULONG) Number of frames to preload; defaults to 10 */
#define	ADTA_PreloadFrameCount	(ADTA_Dummy + 8)	/* (V44) */

/* Sound attributes */
#define	ADTA_Sample		SDTA_Sample
#define	ADTA_SampleLength	SDTA_SampleLength
#define	ADTA_Period		SDTA_Period
#define	ADTA_Volume		SDTA_Volume
#define	ADTA_Cycles		SDTA_Cycles

#define	ADTA_LeftSample		SDTA_LeftSample		/* (V44) */
#define	ADTA_RightSample	SDTA_RightSample	/* (V44) */
#define	ADTA_SamplesPerSec	SDTA_SamplesPerSec	/* (V44) */

/*****************************************************************************/

#define ID_ANIM         MAKE_ID('A','N','I','M')
#define ID_ANHD         MAKE_ID('A','N','H','D')
#define ID_DLTA         MAKE_ID('D','L','T','A')

/*****************************************************************************/

/*  Required ANHD structure describes an ANIM frame */
struct AnimHeader
{
    UBYTE	 ah_Operation;	/*  The compression method:
				     0	set directly (normal ILBM BODY),
				     1	XOR ILBM mode,
				     2	Long Delta mode,
				     3	Short Delta mode,
				     4	Generalized short/long Delta mode,
				     5	Byte Vertical Delta mode
				     6	Stereo op 5 (third party)
				    74	(ascii 'J') reserved for Eric Graham's
				        compression technique (details to be
				        released later). */

    UBYTE	 ah_Mask;	/* (XOR mode only - plane mask where each
				   bit is set =1 if there is data and =0
				   if not.) */

    UWORD	 ah_Width;      /* (XOR mode only - width and height of the */
    UWORD	 ah_Height;	/* area represented by the BODY to eliminate */
				/* unnecessary un-changed data) */


    WORD	 ah_Left;	/* (XOR mode only - position of rectangular */
    WORD	 ah_Top;	/* area representd by the BODY) */


    ULONG	 ah_AbsTime;	/* Timing for a frame relative to the time
				   the first frame was displayed, in
				   jiffies (1/60 sec) */

    ULONG	 ah_RelTime;	/* Timing for frame relative to time
                                   previous frame was displayed - in
				   jiffies (1/60 sec) */

    UBYTE	 ah_Interleave;	/* Indicates how may frames back this data is to
				   modify.  0 defaults to indicate two frames back
				   (for double buffering). n indicates n frames back.
				   The main intent here is to allow values
				   of 1 for special applications where
				   frame data would modify the immediately
				   previous frame. */

    UBYTE	 ah_Pad0;	/* Pad byte, not used at present. */

    ULONG	 ah_Flags;	/* 32 option bits used by options=4 and 5.
				   At present only 6 are identified, but the
				   rest are set =0 so they can be used to
				   implement future ideas.  These are defined
				   for option 4 only at this point.  It is
				   recommended that all bits be set =0 for
				   option 5 and that any bit settings
				   used in the future (such as for XOR mode)
				   be compatible with the option 4
				   bit settings.   Player code should check
				   undefined bits in options 4 and 5 to assure
				   they are zero.

				   The six bits for current use are:

				    bit #	set =0			set =1
				    ===============================================
				    0		short data		long data
				    1		set       		XOR
				    2		separate info		one info list
						for each plane		for all planes
				    3		not RLC			RLC (run length coded)
				    4		horizontal		vertical
				    5		short info offsets	long info offsets
				*/

    UBYTE	 ah_Pad[16];	/* This is a pad for future use for future
				   compression modes. */
};

/*****************************************************************************/

#define	ADTM_Dummy		(0x700)

/* Used to load a frame of the animation */
#define	ADTM_LOADFRAME		(0x701)

/* Used to unload a frame of the animation */
#define	ADTM_UNLOADFRAME	(0x702)

/* Used to start the animation */
#define	ADTM_START		(0x703)

/* Used to pause the animation (don't reset the timer) */
#define	ADTM_PAUSE		(0x704)

/* Used to stop the animation */
#define	ADTM_STOP		(0x705)

/* Used to locate a frame in the animation (as set by a slider...) */
#define	ADTM_LOCATE		(0x706)

/* Used to load a new format frame of the animation (V44) */
#define	ADTM_LOADNEWFORMATFRAME	(0x707)

/* Used to unload a new format frame of the animation (V44) */
#define	ADTM_UNLOADNEWFORMATFRAME (0x708)

/*****************************************************************************/

/* ADTM_LOADFRAME, ADTM_UNLOADFRAME */
struct adtFrame
{
    ULONG		 MethodID;
    ULONG		 alf_TimeStamp;		/* Timestamp of frame to load */

    /* The following fields are filled in by the ADTM_LOADFRAME method, */
    /* and are read-only for any other methods. */

    ULONG		 alf_Frame;		/* Frame number */
    ULONG		 alf_Duration;		/* Duration of frame */

    struct BitMap	*alf_BitMap;		/* Loaded BitMap */
    struct ColorMap	*alf_CMap;		/* Colormap, if changed */

    BYTE		*alf_Sample;		/* Sound data */
    ULONG		 alf_SampleLength;
    ULONG		 alf_Period;

    APTR		 alf_UserData;		/* Used by load frame for extra data */
};

/* ADTM_LOADNEWFORMATFRAME, ADTM_UNLOADNEWFORMATFRAME */
struct adtNewFormatFrame
{
    ULONG		MethodID;
    ULONG		alf_TimeStamp;		/* Timestamp of frame to load */

    /* The following fields are filled in by the ADTM_NEWLOADFRAME method, */
    /* and are read-only for any other methods. */

    ULONG		alf_Frame;		/* Frame number */
    ULONG		alf_Duration;		/* Duration of frame */

    struct BitMap *	alf_BitMap;		/* Loaded BitMap */
    struct ColorMap *	alf_CMap;		/* Colormap, if changed */

    BYTE *		alf_Sample;		/* Sound data */
    ULONG		alf_SampleLength;
    ULONG		alf_Period;

    APTR		alf_UserData;		/* Used by load frame for extra data */

    ULONG		alf_Size;		/* Size of this data structure (in bytes) */

    BYTE *		alf_LeftSample;		/* Sound for left channel, or NULL if none */
    BYTE *		alf_RightSample;	/* Sound for right channel, or NULL if none */
    ULONG		alf_SamplesPerSec;	/* Replay speed; if > 0, this overrides alf_Period */
};

/* ADTM_START, ADTM_PAUSE, ADTM_STOP, ADTM_LOCATE */
struct adtStart
{
    ULONG		 MethodID;
    ULONG		 asa_Frame;		/* Frame # to start at */
};

/*****************************************************************************/

#endif	/* DATATYPES_ANIMATIONCLASS_H */
