	IFND	PREFS_PRINTERTXT_I
PREFS_PRINTERTXT_I	SET	1
**
**	$VER: printertxt.i 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	File format for text printer preferences
**
**	(C) Copyright 1991-2001 Commodore-Amiga, Inc.
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

;---------------------------------------------------------------------------

ID_PTXT equ "PTXT"
ID_PUNT equ "PUNT"
ID_PDEV equ "PDEV"


DRIVERNAMESIZE equ 30	; Filename size
DEVICENAMESIZE equ 32	; .device name size
UNITNAMESIZE   equ 32


   STRUCTURE PrinterTxtPrefs,0
	STRUCT pt_Reserved,4*4		; System reserved
	STRUCT pt_Driver,DRIVERNAMESIZE	; printer driver filename
	UBYTE  pt_Port			; printer port connection

	UWORD  pt_PaperType
	UWORD  pt_PaperSize
	UWORD  pt_PaperLength		; Paper length in # of lines

	UWORD  pt_Pitch
	UWORD  pt_Spacing
	UWORD  pt_LeftMargin		; Left margin
	UWORD  pt_RightMargin		; Right margin
	UWORD  pt_Quality
   LABEL PrinterTxtPrefs_SIZEOF

; constants for PrinterTxtPrefs.pt_Port
PP_PARALLEL equ 0
PP_SERIAL   equ 1

; constants for PrinterTxtPrefs.pt_PaperType
PT_FANFOLD  equ 0
PT_SINGLE   equ 1

; constants for PrinterTxtPrefs.pt_PaperSize
PS_US_LETTER	equ 0
PS_US_LEGAL	equ 1
PS_N_TRACTOR	equ 2
PS_W_TRACTOR	equ 3
PS_CUSTOM	equ 4
PS_EURO_A0	equ 5		; European size A0: 841 x 1189
PS_EURO_A1	equ 6		; European size A1: 594 x 841
PS_EURO_A2	equ 7		; European size A2: 420 x 594
PS_EURO_A3	equ 8		; European size A3: 297 x 420
PS_EURO_A4	equ 9		; European size A4: 210 x 297
PS_EURO_A5	equ 10		; European size A5: 148 x 210
PS_EURO_A6	equ 11		; European size A6: 105 x 148
PS_EURO_A7	equ 12		; European size A7: 74 x 105
PS_EURO_A8	equ 13		; European size A8: 52 x 74

; constants for PrinterTxtPrefs.pt_PrintPitch
PP_PICA	 equ 0
PP_ELITE equ 1
PP_FINE	 equ 2

; constants for PrinterTxtPrefs.pt_PrintSpacing
PS_SIX_LPI   equ 0
PS_EIGHT_LPI equ 1

; constants for PrinterTxtPrefs.pt_PrintQuality
PQ_DRAFT  equ 0
PQ_LETTER equ 1


   STRUCTURE PrinterUnitPrefs,0
	LONG   pu_Reserved,4*4		     ; System reserved
	LONG   pu_UnitNum		     ; Unit number for OpenDevice()
	ULONG  pu_OpenDeviceFlags	     ; Flags for OpenDevice()
	STRUCT pu_DeviceName,DEVICENAMESIZE  ; Name for OpenDevice()
   LABEL PrinterUnitPrefs_SIZEOF

   STRUCTURE PrinterDeviceUnitPrefs,0
	LONG   pdu_Reserved,4*4
	LONG   pdu_UnitNum
	STRUCT pdu_UnitName,UNITNAMESIZE
   LABEL PrinterDeviceUnitPrefs_SIZEOF

;---------------------------------------------------------------------------

	ENDC	; PREFS_PRINTERTXT_I
