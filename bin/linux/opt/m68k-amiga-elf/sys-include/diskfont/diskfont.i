	IFND	DISKFONT_DISKFONT_I
DISKFONT_DISKFONT_I	SET	1
**
**	$VER: diskfont.i 38.0 (18.6.1992)
**	Includes Release 45.1
**
**	diskfont library definitions
**
**	(C) Copyright 1990 Robert R. Burns
**	    All Rights Reserved
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_NODES_I
	INCLUDE	"exec/nodes.i"
	ENDC
	IFND	EXEC_LISTS_I
	INCLUDE	"exec/lists.i"
	ENDC
	IFND	GRAPHICS_TEXT_I
	INCLUDE	"graphics/text.i"
	ENDC

MAXFONTPATH	EQU	256	; including null terminator

 STRUCTURE  FC,0		; FontContents
    STRUCT  fc_FileName,MAXFONTPATH
    UWORD   fc_YSize
    UBYTE   fc_Style
    UBYTE   fc_Flags
    LABEL   fc_SIZEOF

 STRUCTURE  TFC,0		; TFontContents
    STRUCT  tfc_FileName,MAXFONTPATH-2
    UWORD   tfc_TagCount	; including the TAG_DONE tag
    ;
    ;	if tfc_TagCount is non-zero, tfc_FileName is overlayed with
    ;	Text Tags starting at:	(struct TagItem *)
    ;	    &tfc_FileName[MAXFONTPATH-(tfc_TagCount*sizeof(struct TagItem))]
    ;
    UWORD   tfc_YSize
    UBYTE   tfc_Style
    UBYTE   tfc_Flags
    LABEL   tfc_SIZEOF


FCH_ID		EQU	$0f00	; FontContentsHeader, then FontContents
TFCH_ID		EQU	$0f02	; FontContentsHeader, then TFontContents
OFCH_ID		EQU	$0f03	; FontContentsHeader, then TFontContents,
				; associated with outline font

 STRUCTURE  FCH,0		; FontContentsHeader
    UWORD   fch_FileID		; FCH_ID or TFCH_ID
    UWORD   fch_NumEntries	; the number of FontContents elements
    LABEL   fch_FC		; the [T]FontContents elements follow here


DFH_ID		EQU	$0f80
MAXFONTNAME	EQU	32	; font name including ".font\0"

 STRUCTURE  DiskFontHeader,0
    ; the following 8 bytes are not actually considered a part of the
    ; DiskFontHeader, but immediately preceed it.  The NextSegment is supplied
    ; by the linker/loader, and the ReturnCode is the code at the beginning
    ; of the font in case someone runs it...
    ; ULONG dfh_NextSegment	; actually a BPTR
    ; ULONG dfh_ReturnCode	; MOVEQ #0,D0 : RTS
    ; here then is the official start of the DiskFontHeader...
    STRUCT  dfh_DF,LN_SIZE	; node to link disk fonts
    UWORD   dfh_FileID		; DFH_ID
    UWORD   dfh_Revision	; the font revision in this version
    LONG    dfh_Segment		; the segment address when loaded
    STRUCT  dfh_Name,MAXFONTNAME ; the font name (null terminated)
    STRUCT  dfh_TF,tf_SIZEOF	; loaded TextFont structure
    LABEL   dfh_SIZEOF

; used only if dfh_TF.tf_Style FSB_TAGGED bit is set
dfh_TagList	EQU	dfh_Segment	; destroyed during loading


    BITDEF  AF,MEMORY,0
    BITDEF  AF,DISK,1
    BITDEF  AF,SCALED,2
    BITDEF  AF,BITMAP,3

    BITDEF  AF,TTATTR,16	; return TAvailFonts

 STRUCTURE  AF,0		; AvailFonts
    UWORD   af_Type		; MEMORY, DISK, or SCALED
    STRUCT  af_Attr,ta_SIZEOF	; text attributes for font
    LABEL   af_SIZEOF

 STRUCTURE  TAF,0		; TAvailFonts
    UWORD   taf_Type		; MEMORY, DISK, or SCALED
    STRUCT  taf_Attr,tta_SIZEOF	; text attributes for font
    LABEL   taf_SIZEOF

 STRUCTURE  AFH,0		; AvailFontsHeader
    UWORD   afh_NumEntries	; number of AvailFonts elements
    LABEL   afh_AF		; the [T]AvailFonts elements follow here

	ENDC	; DISKFONT_DISKFONT_I
