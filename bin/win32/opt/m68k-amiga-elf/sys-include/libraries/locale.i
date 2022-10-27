	IFND	LIBRARIES_LOCALE_I
LIBRARIES_LOCALE_I	SET	1
**
**	$VER: locale.i 38.10 (22.12.1992)
**	Includes Release 45.1
**
**	locale.library interface structures and definitions
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC

    IFND EXEC_LISTS_I
    INCLUDE "exec/lists.i"
    ENDC

    IFND EXEC_LIBRARIES_I
    INCLUDE "exec/libraries.i"
    ENDC

    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

;---------------------------------------------------------------------------

; constants for GetLocaleStr()
DAY_1	     equ 1	  ; Sunday
DAY_2	     equ 2	  ; Monday
DAY_3	     equ 3	  ; Tuesday
DAY_4	     equ 4	  ; Wednesday
DAY_5	     equ 5	  ; Thursday
DAY_6	     equ 6	  ; Friday
DAY_7	     equ 7	  ; Saturday

ABDAY_1      equ 8	  ; Sun
ABDAY_2      equ 9	  ; Mon
ABDAY_3      equ 10	  ; Tue
ABDAY_4      equ 11	  ; Wed
ABDAY_5      equ 12	  ; Thu
ABDAY_6      equ 13	  ; Fri
ABDAY_7      equ 14	  ; Sat

MON_1	     equ 15	  ; January
MON_2	     equ 16	  ; February
MON_3	     equ 17	  ; March
MON_4	     equ 18	  ; April
MON_5	     equ 19	  ; May
MON_6	     equ 20	  ; June
MON_7	     equ 21	  ; July
MON_8	     equ 22	  ; August
MON_9	     equ 23	  ; September
MON_10	     equ 24	  ; October
MON_11	     equ 25	  ; November
MON_12	     equ 26	  ; December

ABMON_1      equ 27	  ; Jan
ABMON_2      equ 28	  ; Feb
ABMON_3      equ 29	  ; Mar
ABMON_4      equ 30	  ; Apr
ABMON_5      equ 31	  ; May
ABMON_6      equ 32	  ; Jun
ABMON_7      equ 33	  ; Jul
ABMON_8      equ 34	  ; Aug
ABMON_9      equ 35	  ; Sep
ABMON_10     equ 36	  ; Oct
ABMON_11     equ 37	  ; Nov
ABMON_12     equ 38	  ; Dec

YESSTR	     equ 39	  ; affirmative response for yes/no queries
NOSTR	     equ 40	  ; negative response for yes/no queries

AM_STR	     equ 41	  ; AM
PM_STR	     equ 42	  ; PM

SOFTHYPHEN   equ 43	  ; soft hyphenation
HARDHYPHEN   equ 44	  ; hard hyphenation

OPENQUOTE    equ 45	  ; start of quoted block
CLOSEQUOTE   equ 46	  ; end of quoted block

YESTERDAYSTR equ 47	  ; Yesterday
TODAYSTR     equ 48	  ; Today
TOMORROWSTR  equ 49	  ; Tomorrow
FUTURESTR    equ 50	  ; Future

MAXSTRMSG    equ 51	  ; current number of defined strings

;---------------------------------------------------------------------------

; OpenLibrary("locale.library",0) returns a pointer to this structure
   STRUCTURE LocaleBase,LIB_SIZE
	BOOL lb_SysPatches	; TRUE if locale installed its patches

;---------------------------------------------------------------------------

; This structure must only be allocated by locale.library and is READ-ONLY!
   STRUCTURE Locale,0
	APTR   loc_LocaleName		       ; locale's name
        APTR   loc_LanguageName                ; language of this locale
        STRUCT loc_PrefLanguages,4*10          ; preferred languages
        ULONG  loc_Flags                       ; always 0 for now

        ULONG  loc_CodeSet                     ; always 0 for now
        ULONG  loc_CountryCode                 ; user's country code
	ULONG  loc_TelephoneCode	       ; country's telephone code
        LONG   loc_GMTOffset                   ; minutes from GMT
        UBYTE  loc_MeasuringSystem             ; what measuring system?
        UBYTE  loc_CalendarType                ; what calendar type?
        STRUCT loc_Reserved0,2

        APTR   loc_DateTimeFormat              ; regular date & time format
        APTR   loc_DateFormat                  ; date format by itself
        APTR   loc_TimeFormat                  ; time format by itself

        APTR   loc_ShortDateTimeFormat         ; short date & time format
        APTR   loc_ShortDateFormat             ; short date format by itself
        APTR   loc_ShortTimeFormat             ; short time format by itself

        ; for numeric values
        APTR   loc_DecimalPoint                ; character before the decimals
        APTR   loc_GroupSeparator              ; separates groups of digits
        APTR   loc_FracGroupSeparator          ; separates groups of digits
        APTR   loc_Grouping                    ; size of each group
        APTR   loc_FracGrouping                ; size of each group

        ; for monetary values
        APTR   loc_MonDecimalPoint
        APTR   loc_MonGroupSeparator
        APTR   loc_MonFracGroupSeparator
        APTR   loc_MonGrouping
        APTR   loc_MonFracGrouping
        UBYTE  loc_MonFracDigits            ; digits after the decimal point
        UBYTE  loc_MonIntFracDigits         ; for international representation
        STRUCT loc_Reserved1,2

        ; for currency symbols
        APTR   loc_MonCS                    ; currency symbol
        APTR   loc_MonSmallCS               ; symbol for small amounts
        APTR   loc_MonIntCS                 ; internationl (ISO 4217) code

        ; for positive monetary values
        APTR   loc_MonPositiveSign          ; indicate positive money value
        UBYTE  loc_MonPositiveSpaceSep      ; determine if separated by space
        UBYTE  loc_MonPositiveSignPos       ; position of positive sign
        UBYTE  loc_MonPositiveCSPos         ; position of currency symbol
        UBYTE  loc_Reserved2

        ; for negative monetary values
        APTR   loc_MonNegativeSign          ; indicate negative money value
        UBYTE  loc_MonNegativeSpaceSep      ; determine if separated by space
        UBYTE  loc_MonNegativeSignPos       ; position of negative sign
        UBYTE  loc_MonNegativeCSPos         ; position of currency symbol
        UBYTE  loc_Reserved3
   LABEL Locale_SIZEOF

; constants for Locale.loc_MeasuringSystem
MS_ISO      equ 0           ; international metric system
MS_AMERICAN equ 1           ; american system
MS_IMPERIAL equ 2           ; imperial system
MS_BRITISH  equ 3           ; british SYSTEM

; constants for Locale.loc_CalendarType */
CT_7SUN equ 0   ; 7 days a week, Sunday is the first day
CT_7MON equ 1   ; 7 days a week, Monday is the first day
CT_7TUE equ 2   ; 7 days a week, Tuesday is the first day
CT_7WED equ 3   ; 7 days a week, Wednesday is the first day
CT_7THU equ 4   ; 7 days a week, Thursday is the first day
CT_7FRI equ 5   ; 7 days a week, Friday is the first day
CT_7SAT equ 6   ; 7 days a week, Saturday is the first day

; constants for Locale.loc_MonPositiveSpaceSep and Locale.loc_MonNegativeSpaceSep
SS_NOSPACE equ 0  ; cur. symbol is NOT separated from value with a space
SS_SPACE   equ 1  ; cur. symbol IS separated from value with a space

; constants for Locale.loc_MonPositiveSignPos and Locale.loc_MonNegativeSignPos
SP_PARENS    equ 0  ; () surround the quantity and currency_symbol
SP_PREC_ALL  equ 1  ; sign string comes before amount and symbol
SP_SUCC_ALL  equ 2  ; sign string comes after amount and symbol
SP_PREC_CURR equ 3  ; sign string comes right before currency symbol
SP_SUCC_CURR equ 4  ; sign string comes right after currency symbol

; constants for Locale.loc_MonPositiveCSPos and Locale.loc_MonNegativeCSPos */
CSP_PRECEDES equ 0  ; currency symbol comes before value
CSP_SUCCEEDS equ 1  ; currency symbol comes after value

;* elements of the byte arrays pointed to by:
;*   Locale.loc_Grouping
;*   Locale.loc_FracGrouping
;*   Locale.loc_MonGrouping
;*   Locale.loc_MonFracGrouping
;* are interpreted as follows:
;*
;*    255     indicates that no further grouping is to be performed
;*    0       indicates that the previous element is to be repeatedly used
;*            for the remainder of the digits
;*    <other> the number of digits that comprises the current group

;---------------------------------------------------------------------------

; Tags for OpenCatalog()
OC_TagBase         EQU TAG_USER+$90000
OC_BuiltInLanguage EQU OC_TagBase+1     ; language of built-in strings
OC_BuiltInCodeSet  EQU OC_TagBase+2     ; code set of built-in strings
OC_Version         EQU OC_TagBase+3     ; catalog version number required
OC_Language        EQU OC_TagBase+4     ; preferred language of catalog

;---------------------------------------------------------------------------

; Comparison types for StrnCmp()
SC_ASCII    EQU 0
SC_COLLATE1 EQU 1
SC_COLLATE2 EQU 2

;---------------------------------------------------------------------------

; This structure must only be allocated by locale.library and is READ-ONLY!
   STRUCTURE Catalog,LN_SIZE            ; for internal linkage
        UWORD   cat_Pad                 ; to longword align
        APTR    cat_Language            ; language of the catalog
        ULONG   cat_CodeSet             ; currently always 0
        UWORD   cat_Version             ; version of the catalog
        UWORD   cat_Revision            ; revision of the catalog
   LABEL Catalog_SIZEOF

;---------------------------------------------------------------------------

        ENDC    ; LIBRARIES_LOCALE_I
