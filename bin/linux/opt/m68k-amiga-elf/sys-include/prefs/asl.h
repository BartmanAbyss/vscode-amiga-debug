#ifndef PREFS_ASL_H
#define PREFS_ASL_H
/*
**	$VER: asl.h 45.1 (27.10.2000)
**	Includes Release 45.1
**
**	File format for ASL ("application support library") preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif

#ifndef LIBRARIES_ASL_H
#include <libraries/asl.h>
#endif


/*****************************************************************************/


#define ID_ASL MAKE_ID('A','S','L',' ')


struct AslPrefs
{
	LONG	ap_Reserved[4];

	/* These members correspond directly to the associated
	 * members of the 'AslSemaphore' data structure defined
	 * in the <libraries/asl.h> header file by the same names.
	 */
	UBYTE	ap_SortBy;
	UBYTE	ap_SortDrawers;
	UBYTE	ap_SortOrder;

	UBYTE	ap_SizePosition;

	WORD	ap_RelativeLeft;
	WORD	ap_RelativeTop;

	UBYTE	ap_RelativeWidth;
	UBYTE	ap_RelativeHeight;
};


/*****************************************************************************/


#endif /* PREFS_ASL_H */
