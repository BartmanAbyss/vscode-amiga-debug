   IFND  DEVICES_PRINTER_I
DEVICES_PRINTER_I EQU	1
**
**	$VER: printer.i 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	printer.device structure definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
**

   IFND  EXEC_TYPES_I
   INCLUDE  "exec/types.i"
   ENDC

   IFND  EXEC_NODES_I
   INCLUDE  "exec/nodes.i"
   ENDC

   IFND  EXEC_LISTS_I
   INCLUDE  "exec/lists.i"
   ENDC

   IFND  EXEC_PORTS_I
   INCLUDE  "exec/ports.i"
   ENDC

   IFND  EXEC_IO_I
   INCLUDE  "exec/io.i"
   ENDC

   DEVINIT

; V34-V40 commands
   DEVCMD   PRD_RAWWRITE
   DEVCMD   PRD_PRTCOMMAND
   DEVCMD   PRD_DUMPRPORT
   DEVCMD   PRD_QUERY
; V44 commands
   DEVCMD   PRD_RESETPREFS
   DEVCMD   PRD_LOADPREFS
   DEVCMD   PRD_USEPREFS
   DEVCMD   PRD_SAVEPREFS
   DEVCMD   PRD_READPREFS
   DEVCMD   PRD_WRITEPREFS
   DEVCMD   PRD_EDITPREFS
   DEVCMD   PRD_SETERRHOOK
   DEVCMD   PRD_DUMPRPORTTAGS

;****** printer definitions
aRIS	 EQU	0 ; ESCc  reset		      ISO
aRIN	 EQU	1 ; ESC#1 initialize		      +++
aIND	 EQU	2 ; ESCD  lf			      ISO
aNEL	 EQU	3 ; ESCE  return,lf		      ISO
aRI	 EQU	4 ; ESCM  reverse lf		      ISO

aSGR0	 EQU	5 ; ESC[0m normal char set	      ISO
aSGR3	 EQU	6 ; ESC[3m italics on		      ISO
aSGR23	 EQU	7 ; ESC[23m italics off	      ISO
aSGR4	 EQU	8 ; ESC[4m underline on	      ISO
aSGR24	 EQU	9 ; ESC[24m underline off	      ISO
aSGR1	 EQU   10 ; ESC[1m boldface on		      ISO
aSGR22	 EQU   11 ; ESC[22m boldface off	      ISO
aSFC	 EQU   12 ; SGR30-39  set foreground color    ISO
aSBC	 EQU   13 ; SGR40-49  set background color    ISO

aSHORP0  EQU   14 ; ESC[0w normal pitch	      DEC
aSHORP2  EQU   15 ; ESC[2w elite on		      DEC
aSHORP1  EQU   16 ; ESC[1w elite off		      DEC
aSHORP4  EQU   17 ; ESC[4w condensed fine on	      DEC
aSHORP3  EQU   18 ; ESC[3w condensed off	      DEC
aSHORP6  EQU   19 ; ESC[6w enlarged on		      DEC
aSHORP5  EQU   20 ; ESC[5w enlarged off	      DEC

aDEN6	 EQU   21 ; ESC[6"z shadow print on           DEC (sort of)
aDEN5    EQU   22 ; ESC[5"z shadow print off	      DEC
aDEN4	 EQU   23 ; ESC[4"z doublestrike on           DEC
aDEN3    EQU   24 ; ESC[3"z doublestrike off	      DEC
aDEN2	 EQU   25 ; ESC[2"z  NLQ on                   DEC
aDEN1    EQU   26 ; ESC[1"z  NLQ off		      DEC

aSUS2	 EQU   27 ; ESC[2v superscript on	      +++
aSUS1	 EQU   28 ; ESC[1v superscript off	      +++
aSUS4	 EQU   29 ; ESC[4v subscript on	      +++
aSUS3	 EQU   30 ; ESC[3v subscript off	      +++
aSUS0	 EQU   31 ; ESC[0v normalize the line	      +++
aPLU	 EQU   32 ; ESCL  partial line up	      ISO
aPLD	 EQU   33 ; ESCK  partial line down	      ISO

aFNT0	 EQU   34 ; ESC(B US char set	     or Typeface  0 (default)
aFNT1	 EQU   35 ; ESC(R French char set    or Typeface  1
aFNT2	 EQU   36 ; ESC(K German char set    or Typeface  2
aFNT3	 EQU   37 ; ESC(A UK char set	     or Typeface  3
aFNT4	 EQU   38 ; ESC(E Danish I char set  or Typeface  4
aFNT5	 EQU   39 ; ESC(H Sweden char set    or Typeface  5
aFNT6	 EQU   40 ; ESC(Y Italian char set   or Typeface  6
aFNT7	 EQU   41 ; ESC(Z Spanish char set   or Typeface  7
aFNT8	 EQU   42 ; ESC(J Japanese char set  or Typeface  8
aFNT9	 EQU   43 ; ESC(6 Norweign char set  or Typeface  9
aFNT10	 EQU   44 ; ESC(C Danish II char set or Typeface 10

;	Suggested typefaces are:
;
;	 0 - default typeface.
;	 1 - Line Printer or equiv.
;	 2 - Pica or equiv.
;	 3 - Elite or equiv.
;	 4 - Helvetica or equiv.
;	 5 - Times Roman or equiv.
;	 6 - Gothic or equiv.
;	 7 - Script or equiv.
;	 8 - Prestige or equiv.
;	 9 - Caslon or equiv.
;	10 - Orator or equiv.
;

aPROP2	 EQU   45 ; ESC[2p  proportional on	      +++
aPROP1	 EQU   46 ; ESC[1p  proportional off	      +++
aPROP0	 EQU   47 ; ESC[0p  proportional clear	      +++
aTSS	 EQU   48 ; ESC[n E set proportional offset   ISO
aJFY5	 EQU   49 ; ESC[5 F auto left justify	      ISO
aJFY7	 EQU   50 ; ESC[7 F auto right justiy	      ISO
aJFY6	 EQU   51 ; ESC[6 F auto full justify	      ISO
aJFY0	 EQU   52 ; ESC[0 F auto justify off	      ISO
aJFY2	 EQU   53 ; ESC[2 F  word space(auto center)  ISO (special)
aJFY3	 EQU   54 ; ESC[3 F letter space (justify)    ISO (special)

aVERP0	 EQU   55 ; ESC[0z  1/8" line spacing         +++
aVERP1   EQU   56 ; ESC[1z  1/6" line spacing	      +++
aSLPP	 EQU   57 ; ESC[nt  set form length n	      DEC
aPERF	 EQU   58 ; ESC[nq  perf skip n (n>0)	      +++
aPERF0	 EQU   59 ; ESC[0q  perf skip off	      +++

aLMS	 EQU   60 ; ESC#9  Left margin set	      +++
aRMS	 EQU   61 ; ESC#0  Right margin set	      +++
aTMS	 EQU   62 ; ESC#8  Top margin set	      +++
aBMS	 EQU   63 ; ESC#2  Bottom marg set	      +++
aSTBM	 EQU   64 ; ESC[Pn1;Pn2r  T&B margins	      DEC
aSLRM	 EQU   65 ; ESC[Pn1;Pn2s  L&R margin	      DEC
aCAM	 EQU   66 ; ESC#3  Clear margins	      +++

aHTS	 EQU   67 ; ESCH    Set horiz tab	      ISO
aVTS	 EQU   68 ; ESCJ    Set vertical tabs	      ISO
aTBC0	 EQU   69 ; ESC[0g  Clr horiz tab	      ISO
aTBC3	 EQU   70 ; ESC[3g  Clear all h tab	      ISO
aTBC1	 EQU   71 ; ESC[1g  Clr vertical tabs	      ISO
aTBC4	 EQU   72 ; ESC[4g  Clr all v tabs	      ISO
aTBCALL  EQU   73 ; ESC#4   Clr all h & v tabs	      +++
aTBSALL  EQU   74 ; ESC#5   Set default tabs	      +++
aEXTEND  EQU   75 ; ESC[Pn"x extended commands        +++

aRAW     EQU   76 ; ESC[Pn"r Next 'Pn' chars are raw  +++


 STRUCTURE IOPrtCmdReq,IO_SIZE
    UWORD   io_PrtCommand  ; printer command
    UBYTE   io_Parm0	; first command parameter
    UBYTE   io_Parm1	; second command parameter
    UBYTE   io_Parm2	; third command parameter
    UBYTE   io_Parm3	; fourth command parameter
    LABEL   iopcr_SIZEOF

 STRUCTURE  IODRPReq,IO_SIZE
    APTR    io_RastPort    ; raster port
    APTR    io_ColorMap    ; color map
    ULONG   io_Modes	   ; graphics viewport modes
    UWORD   io_SrcX	   ; source x origin
    UWORD   io_SrcY	   ; source y origin
    UWORD   io_SrcWidth    ; source x width
    UWORD   io_SrcHeight   ; source x height
    LONG    io_DestCols    ; destination x width
    LONG    io_DestRows    ; destination y height
    UWORD   io_Special	   ; option flags
    LABEL   iodrpr_SIZEOF

 STRUCTURE  IODRPTagsReq,IO_SIZE
    APTR    io_RastPort    ; raster port
    APTR    io_ColorMap    ; color map
    ULONG   io_Modes	   ; graphics viewport modes
    UWORD   io_SrcX	   ; source x origin
    UWORD   io_SrcY	   ; source y origin
    UWORD   io_SrcWidth    ; source x width
    UWORD   io_SrcHeight   ; source x height
    LONG    io_DestCols    ; destination x width
    LONG    io_DestRows    ; destination y height
    UWORD   io_Special	   ; option flags
    APTR    io_TagList	   ; tag list
    LABEL   iodrpr_SIZEOF

SPECIAL_MILCOLS		EQU	$0001	; DestCols specified in 1/1000"
SPECIAL_MILROWS		EQU	$0002	; DestRows specified in 1/1000"
SPECIAL_FULLCOLS	EQU	$0004	; make DestCols maximum possible
SPECIAL_FULLROWS	EQU	$0008	; make DestRows maximum possible
SPECIAL_FRACCOLS	EQU	$0010	; DestCols is fraction of FULLCOLS
SPECIAL_FRACROWS	EQU	$0020	; DestRows is fraction of FULLROWS
SPECIAL_CENTER		EQU	$0040	; center image on paper
SPECIAL_ASPECT		EQU	$0080	; ensure correct aspect ratio
SPECIAL_DENSITY1	EQU	$0100	; lowest resolution (dpi)
SPECIAL_DENSITY2	EQU	$0200	; next res
SPECIAL_DENSITY3	EQU	$0300	; next res
SPECIAL_DENSITY4	EQU	$0400	; next res
SPECIAL_DENSITY5	EQU	$0500	; next res
SPECIAL_DENSITY6	EQU	$0600	; next res
SPECIAL_DENSITY7	EQU	$0700	; highest res
SPECIAL_NOFORMFEED	EQU	$0800	; don't eject paper after gfx prints
SPECIAL_TRUSTME		EQU	$1000	; don't reset on gfx prints
;
;	Compute print size, set 'io_DestCols' and 'io_DestRows' in the calling
;	program's 'IODRPReq' structure and exit, don't print.  This allows the
;	calling program to see what the final print size would be in printer
;	pixels.  Note that it modifies the 'io_DestCols' and 'io_DestRows'
;	fields of your 'IODRPReq' structure.  Also, set the print density and
;	update the 'MaxXDots', 'MaxYDots', 'XDotsInch', and 'YDotsInch' fields
;	of the 'PrinterExtendedData' structure.
;
SPECIAL_NOPRINT		EQU	$2000	; see above

PDERR_NOERR		EQU	0	; clean exit, no errors
PDERR_CANCEL		EQU	1	; user cancelled print
PDERR_NOTGRAPHICS	EQU	2	; printer cannot output graphics
PDERR_INVERTHAM		EQU	3	; OBSOLETE
PDERR_BADDIMENSION	EQU	4	; print dimensions illegal
PDERR_DIMENSIONOVFLOW	EQU	5	; OBSOLETE
PDERR_INTERNALMEMORY	EQU	6	; no memory for internal variables
PDERR_BUFFERMEMORY	EQU	7	; no memory for print buffer
;
;	Note : this is an internal error that can be returned from the render
;	function to the printer device.  It is NEVER returned to the user.
;	If the printer device sees this error it converts it 'PDERR_NOERR'
;	and exits gracefully.  Refer to the document on
;	'How to Write a Graphics Printer Driver' for more info.
;
PDERR_TOOKCONTROL	EQU	8	; I took control in case 0 of render

PDERR_LASTSTANDARD	EQU	31
PDERR_FIRSTCUSTOM	EQU	32
PDERR_LASTCUSTOM	EQU	126

; internal use
SPECIAL_DENSITYMASK	EQU $0700	;  masks out density values
SPECIAL_DIMENSIONSMASK	EQU SPECIAL_MILCOLS!SPECIAL_MILROWS!SPECIAL_FULLCOLS!SPECIAL_FULLROWS!SPECIAL_FRACCOLS!SPECIAL_FRACROWS!SPECIAL_ASPECT


;	Tags for IODRPTagsReq
DRPA_Dummy		EQU	TAG_USER + $60000

DRPA_ICCProfile		EQU	DRPA_Dummy + 1 ; RESERVED
DRPA_ICCName		EQU	DRPA_Dummy + 2 ; RESERVED
DRPA_NoColCorrect	EQU	DRPA_Dummy + 3 ; RESERVED

;	Source Hook
DRPA_SourceHook		EQU	DRPA_Dummy + 4

  STRUCTURE DRPSourceMsg,0
    LONG drpsm_X
    LONG drpsm_Y
    LONG drpsm_Width
    LONG drpsm_Height
    APTR drpsm_Buf
    LABEL drpsm_SIZEOF

;	Source aspect
DRPA_AspectX		EQU	DRPA_Dummy + 5
DRPA_AspectY		EQU	DRPA_Dummy + 6

;	Tags for IOPrtPrefsReq
PPRA_Dummy		EQU	TAG_USER + $70000

  STRUCTURE IOPrtPrefsReq,IO_SIZE
    APTR ioppr_TagList
    LABEL ioppr_SIZEOF

PPRA_Window		EQU	PPRA_Dummy + 1
PPRA_Screen		EQU	PPRA_Dummy + 2
PPRA_PubScreen		EQU	PPRA_Dummy + 3

;	IOPrtErrReq
PDHOOK_NONE		EQU 0
PDHOOK_STD		EQU 1

  STRUCTURE IOPrtErrReq,IO_SIZE
    APTR ioper_Hook
    LABEL ioper_SIZEOF

  STRUCTURE PrtErrMsg,0
    ULONG pem_Version
    ULONG pem_ErrorLevel
    APTR pem_Window
    APTR pem_ES
    APTR pem_IDCMP
    APTR pem_ArgList
    LABEL pem_SIZEOF

PDHOOK_VERSION EQU 1

;	PRIVATE: change preferences temporary.
  STRUCTURE IOPrefsReq,IO_SIZE
    APTR iopr_TxtPrefs
    APTR iopr_UnitPrefs
    APTR iopr_DevUnitPrefs
    APTR iopr_GfxPrefs
    LABEL iopr_SIZEOF

   ENDC
