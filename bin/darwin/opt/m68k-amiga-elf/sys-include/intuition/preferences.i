	IFND  INTUITION_PREFERENCES_I
INTUITION_PREFERENCES_I	SET  1
**
**	$VER: preferences.i 38.4 (16.9.1992)
**	Includes Release 45.1
**
**	Structure definition for old-style preferences
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND	DEVICES_TIMER_I
	INCLUDE	"devices/timer.i"
	ENDC

; ========================================================================
; === Preferences ========================================================
; ========================================================================

; these are the definitions for the printer configurations
FILENAME_SIZE EQU	30	; Filename size
DEVNAME_SIZE  EQU	16	; Device-name size

POINTERSIZE	EQU	(1+16+1)*2	; Size of Pointer data buffer

; These defines are for the default font size.	These actually describe the
; height of the defaults fonts.  The default font type is the topaz
; font, which is a fixed width font that can be used in either
; eighty-column or sixty-column mode.  The Preferences structure reflects
; which is currently selected by the value found in the variable FontSize,
; which may have either of the values defined below.  These values actually
; are used to select the height of the default font.  By changing the
; height, the resolution of the font changes as well.
TOPAZ_EIGHTY	EQU	8
TOPAZ_SIXTY	EQU	9

; ------------------------------------------------------------------------

* Note:  Starting with V36, and continuing with each new version of
* Intuition, an increasing number of fields of struct Preferences
* are ignored by SetPrefs().  (Some fields are obeyed only at the
* initial SetPrefs(), which comes from the devs:system-configuration
* file).  Elements are generally superseded as new hardware or software
* features demand more information than fits in struct Preferences.
* Parts of struct Preferences must be ignored so that applications
* calling GetPrefs(), modifying some other part of struct Preferences,
* then calling SetPrefs(), don't end up truncating the extended
* data.
*
* Consult the autodocs for SetPrefs() for further information as
* to which fields are not always respected.

 STRUCTURE Preferences,0

    ; the default font height
    BYTE pf_FontHeight		; height for system default font

    ; constant describing what's hooked up to the port
    BYTE pf_PrinterPort	; printer port connection

    ; the baud rate of the port
    WORD pf_BaudRate		; baud rate for the serial port

    ; various timing rates
    STRUCT pf_KeyRptSpeed,TV_SIZE ; repeat speed for keyboard
    STRUCT pf_KeyRptDelay,TV_SIZE ; Delay before keys repeat
    STRUCT pf_DoubleClick,TV_SIZE ; Interval allowed between clicks

    ; Intuition Pointer data
    STRUCT pf_PointerMatrix,POINTERSIZE*2 ; Definition of pointer sprite
    BYTE pf_XOffset		; X-Offset for active 'bit'
    BYTE pf_YOffset		; Y-Offset for active 'bit'
    WORD pf_color17		;********************************
    WORD pf_color18		; Colours for sprite pointer
    WORD pf_color19		;********************************
    WORD pf_PointerTicks	; Sensitivity of the pointer

    ; Workbench Screen colors
    WORD pf_color0		;********************************
    WORD pf_color1		;  Standard default colours
    WORD pf_color2		;   Used in the Workbench
    WORD pf_color3		;********************************

    ; positioning data for the Intuition View
    BYTE pf_ViewXOffset		; Offset for top lefthand corner
    BYTE pf_ViewYOffset		; X and Y dimensions
    WORD pf_ViewInitX		; View initial offsets at startup
    WORD pf_ViewInitY		; View initial offsets at startup

    BOOL EnableCLI		; CLI availability switch

    ; printer configurations
    WORD pf_PrinterType		; printer type
    STRUCT pf_PrinterFilename,FILENAME_SIZE ; file for printer

    ; print format and quality configurations
    WORD pf_PrintPitch			; print pitch
    WORD pf_PrintQuality	; print quality
    WORD pf_PrintSpacing	; number of lines per inch
    WORD pf_PrintLeftMargin	; left margin in characters
    WORD pf_PrintRightMargin	; right margin in characters
    WORD pf_PrintImage		; positive or negative
    WORD pf_PrintAspect		; horizontal or vertical
    WORD pf_PrintShade		; b&w, half-tone, or color
    WORD pf_PrintThreshold	; darkness ctrl for b/w dumps


    ; print paper description
    WORD pf_PaperSize		; paper size
    WORD pf_PaperLength		; paper length in lines
    WORD pf_PaperType		; continuous or single sheet

    ; Serial device settings: These are six nibble-fields in three bytes
    ; (these look a little strange so the defaults will map out to zero)
    BYTE pf_SerRWBits		; upper nibble = (8-number of read bits)
				    ; lower nibble = (8-number of write bits)
    BYTE pf_SerStopBuf		; upper nibble = (number of stop bits - 1)
				; lower nibble = (table value for BufSize)
    BYTE pf_SerParShk		; upper nibble = (value for Parity setting)
				; lower nibble = (value for Handshake mode)

    BYTE pf_LaceWB		; if workbench is to be interlaced

    STRUCT pf_Pad,12

    STRUCT pf_PrtDevName,DEVNAME_SIZE	; device used by printer.device
					; (omit the ".device")
    UBYTE pf_DefaultPrtUnit		; default unit opened by printer.device
    UBYTE pf_DefaultSerUnit		; default serial unit

    BYTE    pf_RowSizeChange	;
    BYTE    pf_ColumnSizeChange ;

    UWORD   pf_PrintFlags	; user preference flags
    WORD    pf_PrintMaxWidth	; max width of printed picture in 10ths/inch
    UWORD   pf_PrintMaxHeight	; max height of printed picture in 10ths/inch
    UBYTE   pf_PrintDensity	; print density
    UBYTE   pf_PrintXOffset	; offset of printed picture in 10ths/inch

    UWORD   pf_wb_Width		; override default workbench width
    UWORD   pf_wb_Height	; override default workbench height
    UBYTE   pf_wb_Depth		; override default workbench depth

    UBYTE   pf_ext_size		; extension information -- do not touch!
				; extension size in blocks of 64 bytes

    LABEL pf_SIZEOF


; === Preferences definitions ===========================================

; Workbench Interlace (use one bit)
LACEWB		EQU	$01


; Enable_CLI
SCREEN_DRAG	EQU	$4000
MOUSE_ACCEL	EQU	$8000

; PrinterPort
PARALLEL_PRINTER EQU	$00
SERIAL_PRINTER	EQU	$01

; BaudRate
BAUD_110	EQU	$00
BAUD_300	EQU	$01
BAUD_1200	EQU	$02
BAUD_2400	EQU	$03
BAUD_4800	EQU	$04
BAUD_9600	EQU	$05
BAUD_19200	EQU	$06
BAUD_MIDI	EQU	$07

; PaperType
FANFOLD	EQU	$00
SINGLE		EQU	$80

; PrintPitch
PICA		EQU	$000
ELITE		EQU	$400
FINE		EQU	$800

; PrintQuality
DRAFT		EQU	$000
LETTER		EQU	$100

; PrintSpacing
SIX_LPI		EQU	$000
EIGHT_LPI	EQU	$200

; Print Image
IMAGE_POSITIVE	EQU	$00
IMAGE_NEGATIVE	EQU	$01

; PrintAspect
ASPECT_HORIZ	EQU	$00
ASPECT_VERT	EQU	$01

; PrintShade
SHADE_BW	EQU	$00
SHADE_GREYSCALE	EQU	$01
SHADE_COLOR	EQU	$02

; PaperSize (all paper sizes have a zero in the lowest nybble)
US_LETTER	EQU	$00
US_LEGAL	EQU	$10
N_TRACTOR	EQU	$20
W_TRACTOR	EQU	$30
CUSTOM		EQU	$40

; New PaperSizes for V36:
EURO_A0	EQU	$50	       ; European size A0: 841 x 1189
EURO_A1	EQU	$60	       ; European size A1: 594 x 841
EURO_A2	EQU	$70	       ; European size A2: 420 x 594
EURO_A3	EQU	$80	       ; European size A3: 297 x 420
EURO_A4	EQU	$90	       ; European size A4: 210 x 297
EURO_A5	EQU	$A0	       ; European size A5: 148 x 210
EURO_A6	EQU	$B0	       ; European size A6: 105 x 148
EURO_A7	EQU	$C0	       ; European size A7: 74 x 105
EURO_A8	EQU	$D0	       ; European size A8: 52 x 74

; PrinterType
CUSTOM_NAME	EQU	$00
ALPHA_P_101	EQU	$01
BROTHER_15XL	EQU	$02
CBM_MPS1000	EQU	$03
DIAB_630	EQU	$04
DIAB_ADV_D25	EQU	$05
DIAB_C_150	EQU	$06
EPSON		EQU	$07
EPSON_JX_80	EQU	$08
OKIMATE_20	EQU	$09
QUME_LP_20	EQU	$0A
; new printer entries, 3 October 1985
HP_LASERJET	EQU	$0B
HP_LASERJET_PLUS EQU	$0C


; Serial Input Buffer Sizes
SBUF_512	EQU	$00
SBUF_1024	EQU	$01
SBUF_2048	EQU	$02
SBUF_4096	EQU	$03
SBUF_8000	EQU	$04
SBUF_16000	EQU	$05

; Serial Bit Masks
SREAD_BITS	EQU	$F0	; pf_SerRWBits
SWRITE_BITS	EQU	$0F

SSTOP_BITS	EQU	$F0	; pf_SerStopBuf
SBUFSIZE_BITS	EQU	$0F

SPARITY_BITS	EQU	$F0	; pf_SerParShk
SHSHAKE_BITS	EQU	$0F

; Serial Parity (high nibble, but here shifted right, as by C-macro SPARNUM)
SPARITY_NONE	EQU	$00
SPARITY_EVEN	EQU	$01
SPARITY_ODD	EQU	$02
; New parity definitions for V36:
SPARITY_MARK	EQU	$03
SPARITY_SPACE	EQU	$04

; Serial Handshake Mode (low nibble, mask by SHSHAKE_BITS)
SHSHAKE_XON	EQU	$00
SHSHAKE_RTS	EQU	$01
SHSHAKE_NONE	EQU	$02

; new defines for PrintFlags
CORRECT_RED	    EQU $0001	 ; color correct red shades
CORRECT_GREEN	    EQU $0002	 ; color correct green shades
CORRECT_BLUE	    EQU $0004	 ; color correct blue shades

CENTER_IMAGE	    EQU $0008	   ; center image on paper

IGNORE_DIMENSIONS   EQU $0000	 ; ignore max width/height settings
BOUNDED_DIMENSIONS  EQU $0010	 ; use max width/height as boundaries
ABSOLUTE_DIMENSIONS EQU $0020	 ; use max width/height as absolutes
PIXEL_DIMENSIONS    EQU $0040	 ; use max width/height as prt pixels
MULTIPLY_DIMENSIONS EQU $0080	 ; use max width/height as multipliers

INTEGER_SCALING     EQU $0100	 ; force integer scaling

ORDERED_DITHERING   EQU $0000	 ; ordered dithering
HALFTONE_DITHERING  EQU $0200	 ; halftone dithering
FLOYD_DITHERING     EQU $0400	 ; floyd-steinberg dithering

ANTI_ALIAS	    EQU $0800	 ; anti-alias image
GREY_SCALE2	    EQU $1000	 ; for use with hi-res monitor

CORRECT_RGB_MASK    EQU (CORRECT_RED+CORRECT_GREEN+CORRECT_BLUE)
DIMENSIONS_MASK     EQU (BOUNDED_DIMENSIONS+ABSOLUTE_DIMENSIONS+PIXEL_DIMENSIONS+MULTIPLY_DIMENSIONS)
DITHERING_MASK	    EQU (HALFTONE_DITHERING+FLOYD_DITHERING)

    ENDC
