#ifndef UTILITY_UTILITY_H
#define UTILITY_UTILITY_H
/*
**	$VER: utility.h 39.2 (18.9.1992)
**	Includes Release 45.1
**
**	utility.library include file
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif


/*****************************************************************************/


#define UTILITYNAME "utility.library"


struct UtilityBase
{
    struct Library ub_LibNode;
    UBYTE	   ub_Language;
    UBYTE	   ub_Reserved;
};


/*****************************************************************************/


#endif /* UTILITY_UTILITY_H */
