#ifndef PREFS_LOCALE_H
#define PREFS_LOCALE_H
/*
**	$VER: locale.h 38.4 (5.12.1991)
**	Includes Release 45.1
**
**	File format for locale preferences
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


#define ID_LCLE MAKE_ID('L','C','L','E')
#define ID_CTRY MAKE_ID('C','T','R','Y')


struct CountryPrefs
{
    ULONG cp_Reserved[4];
    ULONG cp_CountryCode;
    ULONG cp_TelephoneCode;
    UBYTE cp_MeasuringSystem;

    char  cp_DateTimeFormat[80];
    char  cp_DateFormat[40];
    char  cp_TimeFormat[40];

    char  cp_ShortDateTimeFormat[80];
    char  cp_ShortDateFormat[40];
    char  cp_ShortTimeFormat[40];

    /* for numeric values */
    char  cp_DecimalPoint[10];
    char  cp_GroupSeparator[10];
    char  cp_FracGroupSeparator[10];
    UBYTE cp_Grouping[10];
    UBYTE cp_FracGrouping[10];

    /* for monetary values */
    char  cp_MonDecimalPoint[10];
    char  cp_MonGroupSeparator[10];
    char  cp_MonFracGroupSeparator[10];
    UBYTE cp_MonGrouping[10];
    UBYTE cp_MonFracGrouping[10];
    UBYTE cp_MonFracDigits;
    UBYTE cp_MonIntFracDigits;

    /* for currency symbols */
    char  cp_MonCS[10];
    char  cp_MonSmallCS[10];
    char  cp_MonIntCS[10];

    /* for positive monetary values */
    char  cp_MonPositiveSign[10];
    UBYTE cp_MonPositiveSpaceSep;
    UBYTE cp_MonPositiveSignPos;
    UBYTE cp_MonPositiveCSPos;

    /* for negative monetary values */
    char  cp_MonNegativeSign[10];
    UBYTE cp_MonNegativeSpaceSep;
    UBYTE cp_MonNegativeSignPos;
    UBYTE cp_MonNegativeCSPos;

    UBYTE cp_CalendarType;
};


struct LocalePrefs
{
    ULONG		lp_Reserved[4];
    char		lp_CountryName[32];
    char		lp_PreferredLanguages[10][30];
    LONG		lp_GMTOffset;
    ULONG		lp_Flags;
    struct CountryPrefs lp_CountryData;
};


/*****************************************************************************/


#endif /* PREFS_LOCALE_H */
