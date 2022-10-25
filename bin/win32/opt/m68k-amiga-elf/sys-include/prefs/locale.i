	IFND	PREFS_LOCALE_I
PREFS_LOCALE_I	SET	1
**
**	$VER: locale.i 38.4 (5.12.1991)
**	Includes Release 45.1
**
**	File format for locale preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

;---------------------------------------------------------------------------

ID_LCLE equ "LCLE"
ID_CTRY equ "CTRY"

;---------------------------------------------------------------------------

   STRUCTURE CountryPrefs,0
	STRUCT	cp_Reserved,4*4
	ULONG	cp_CountryCode
	ULONG	cp_TelephoneCode
	UBYTE	cp_MeasuringSystem

	STRUCT	cp_DateTimeFormat,80
	STRUCT	cp_DateFormat,40
	STRUCT	cp_TimeFormat,40

	STRUCT	cp_ShortDateTimeFormat,80
	STRUCT	cp_ShortDateFormat,40
	STRUCT	cp_ShortTimeFormat,40

	; for numeric values
	STRUCT	cp_DecimalPoint,10
	STRUCT	cp_GroupSeparator,10
	STRUCT	cp_FracGroupSeparator,10
	STRUCT	cp_Grouping,10
	STRUCT	cp_FracGrouping,10

	; for monetary values
	STRUCT	cp_MonDecimalPoint,10
	STRUCT	cp_MonGroupSeparator,10
	STRUCT	cp_MonFracGroupSeparator,10
	STRUCT	cp_MonGrouping,10
	STRUCT	cp_MonFracGrouping,10
	UBYTE	cp_MonFracDigits
	UBYTE	cp_MonIntFracDigits

	; for currency symbols
	STRUCT	cp_MonCS,10
	STRUCT	cp_MonSmallCS,10
	STRUCT	cp_MonIntCS,10

	; for positive monetary values
	STRUCT	cp_MonPositiveSign,10
	UBYTE	cp_MonPositiveSpaceSep
	UBYTE	cp_MonPositiveSignPos
	UBYTE	cp_MonPositiveCSPos

	; for negative monetary values
	STRUCT	cp_MonNegativeSign,10
	UBYTE	cp_MonNegativeSpaceSep
	UBYTE	cp_MonNegativeSignPos
	UBYTE	cp_MonNegativeCSPos

	UBYTE	cp_CalendarType
   LABEL CountryPrefs_SIZEOF

;---------------------------------------------------------------------------

   STRUCTURE LocalePrefs,0
	STRUCT	lp_Reserved,4*4
	STRUCT	lp_CountryName,32
	STRUCT	lp_PreferredLanguages,10*30
	LONG	lp_GMTOffset
	ULONG	lp_Flags
	STRUCT	lp_CountryData,CountryPrefs_SIZEOF
   LABEL LocalePrefs_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_LOCALE_I
