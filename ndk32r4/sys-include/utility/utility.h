#ifndef UTILITY_UTILITY_H
#define UTILITY_UTILITY_H
/*
**	$VER: utility.h 47.1 (3.8.2019)
**
**	utility.library include file
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
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
