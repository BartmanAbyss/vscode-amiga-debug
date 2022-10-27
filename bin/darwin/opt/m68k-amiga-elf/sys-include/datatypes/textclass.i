	IFND DATATYPES_TEXTCLASS_I
DATATYPES_TEXTCLASS_I	SET	1
**
**  $VER: textclass.i 39.2 (24.6.1992)
**  Includes Release 45.1
**
**  Interface definitions for DataType text objects.
**
**  (C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
**

	IFND UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

	IFND DATATYPES_DATATYPESCLASS_I
	INCLUDE "datatypes/datatypesclass.i"
	ENDC

	IFND LIBRARIES_IFFPARSE_I
	INCLUDE "libraries/iffparse.i"
	ENDC

;------------------------------------------------------------------------------

TEXTDTCLASS	MACRO
	DC.B	'text.datatype',0
	ENDM

;------------------------------------------------------------------------------

; Text attributes
TDTA_Buffer	equ	(DTA_Dummy+300)
TDTA_BufferLen	equ	(DTA_Dummy+301)
TDTA_LineList	equ	(DTA_Dummy+302)

;------------------------------------------------------------------------------

; There is one Line structure for every line of text in our document.
    STRUCTURE Line,0
	STRUCT	ln_Link,MLN_SIZE		; to link the lines together
	APTR	ln_Text				; pointer to the text for this	line
	ULONG	ln_TextLen			; character length of the text for this line
	UWORD	ln_XOffset			; where in the	line the text starts
	UWORD	ln_YOffset			; line the text is on
	UWORD	ln_Width			; Width of line in pixels
	UWORD	ln_Height			; Height of line in pixels
	UWORD	ln_Flags			; info	on the line
	BYTE	ln_FgPen			; foreground pen
	BYTE	ln_BgPen			; background pen
	ULONG	ln_Style			; Font style
	APTR	ln_Data				; Link data...
    LABEL Line_SIZEOF

;------------------------------------------------------------------------------

; Line.ln_Flags

    BITDEF LN,LF,0				; Line Feed
    BITDEF LN,LINK,1				; Segment is a link
    BITDEF LN,OBJECT,2				; ln_Data is a pointer to an DataTypes object
    BITDEF LN,SELECTED,3			; Object is selected

;------------------------------------------------------------------------------

; IFF types that may be text
ID_FTXT		equ	'FTXT'
ID_CHRS		equ	'CHRS'

;------------------------------------------------------------------------------

	ENDC	; DATATYPES_TEXTCLASS_I
