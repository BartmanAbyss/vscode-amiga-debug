#ifndef GADGETS_TAPEDECK_H
#define GADGETS_TAPEDECK_H
/*
**	$VER: tapedeck.h 40.0 (12.3.1993)
**	Includes Release 45.1
**
**	Definitions for the tapedeck BOOPSI class
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/*****************************************************************************/

#define TDECK_Dummy		(TAG_USER+0x05000000)
#define	TDECK_Mode		(TDECK_Dummy + 1)
#define	TDECK_Paused		(TDECK_Dummy + 2)

#define	TDECK_Tape		(TDECK_Dummy + 3)
	/* (BOOL) Indicate whether tapedeck or animation controls.  Defaults
	 * to FALSE. */

#define	TDECK_Frames		(TDECK_Dummy + 11)
	/* (LONG) Number of frames in animation.  Only valid when using
	 * animation controls. */

#define	TDECK_CurrentFrame	(TDECK_Dummy + 12)
	/* (LONG) Current frame.  Only valid when using animation controls. */

/*****************************************************************************/

/* Possible values for TDECK_Mode */
#define	BUT_REWIND	0
#define	BUT_PLAY	1
#define	BUT_FORWARD	2
#define	BUT_STOP	3
#define	BUT_PAUSE	4
#define	BUT_BEGIN	5
#define	BUT_FRAME	6
#define	BUT_END		7

/*****************************************************************************/

#endif /* GADGETS_TAPEDECK_H */
