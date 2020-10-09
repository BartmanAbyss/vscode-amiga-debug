#ifndef PREFS_PREFHDR_H
#define PREFS_PREFHDR_H
/*
**	$VER: prefhdr.h 38.1 (19.6.1991)
**	Includes Release 45.1
**
**	File format for preferences header
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


#define ID_PREF	 MAKE_ID('P','R','E','F')
#define ID_PRHD	 MAKE_ID('P','R','H','D')


struct PrefHeader
{
    UBYTE ph_Version;	/* version of following data */
    UBYTE ph_Type;	/* type of following data    */
    ULONG ph_Flags;	/* always set to 0 for now   */
};


/*****************************************************************************/


#endif /* PREFS_PREFHDR_H */
