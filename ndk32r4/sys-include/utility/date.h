#ifndef UTILITY_DATE_H
#define UTILITY_DATE_H
/*
**	$VER: date.h 47.1 (3.8.2019)
**
**	Date conversion routines ClockData definition.
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif


/*****************************************************************************/


struct ClockData
{
    UWORD sec;
    UWORD min;
    UWORD hour;
    UWORD mday;
    UWORD month;
    UWORD year;
    UWORD wday;
};


/*****************************************************************************/


#endif /* UTILITY_DATE_H */
