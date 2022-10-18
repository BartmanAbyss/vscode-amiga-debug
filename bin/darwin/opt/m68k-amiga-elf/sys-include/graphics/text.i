	IFND	GRAPHICS_TEXT_I
GRAPHICS_TEXT_I	SET	1
**
**	$VER: text.i 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	graphics library text structures
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	EXEC_PORTS_I
	INCLUDE	"exec/ports.i"
	ENDC	; EXEC_PORTS_I

	IFND	UTILITY_TAGITEM_I
	INCLUDE	"utility/tagitem.i"
	ENDC	; UTILITY_TAGITEM_I

*------ Font Styles --------------------------------------------------
FS_NORMAL	EQU	0	; normal text (no style attributes set)
    BITDEF  FS,UNDERLINED,0	; underlined (under baseline)
    BITDEF  FS,BOLD,1		; bold face text (ORed w/ shifted right 1)
    BITDEF  FS,ITALIC,2		; italic (slanted 1:2 right)
    BITDEF  FS,EXTENDED,3	; extended face (must be designed)

    BITDEF  FS,COLORFONT,6	; this uses ColorTextFont structure
    BITDEF  FS,TAGGED,7		; the TextAttr is really an TTextAttr,

*------ Font Flags ---------------------------------------------------
    BITDEF  FP,ROMFONT,0	; font is in rom
    BITDEF  FP,DISKFONT,1	; font is from diskfont.library
    BITDEF  FP,REVPATH,2	; designed path is reversed (e.g. left)
    BITDEF  FP,TALLDOT,3	; designed for hires non-interlaced
    BITDEF  FP,WIDEDOT,4	; designed for lores interlaced
    BITDEF  FP,PROPORTIONAL,5	; character sizes vary from tf_XSize
    BITDEF  FP,DESIGNED,6	; size is "designed", not constructed
*				; note: if you do not set this bit in your
*				; textattr, then a font may be constructed
*				; for you by scaling an existing rom or disk
*				; font (under V36 and above).
    ;-- bit 7 is always clear for fonts on the graphics font list
    BITDEF  FP,REMOVED,7	; the font has been removed


******* TextAttr node ************************************************
 STRUCTURE  TextAttr,0
    APTR    ta_Name		; name of the desired font
    UWORD   ta_YSize		; height of the desired font
    UBYTE   ta_Style		; desired font style
    UBYTE   ta_Flags		; font preferences flags
    LABEL   ta_SIZEOF

 STRUCTURE  TTextAttr,0
    APTR    tta_Name		; name of the desired font
    UWORD   tta_YSize		; height of the desired font
    UBYTE   tta_Style		; desired font style
    UBYTE   tta_Flags		; font preferences flags
    APTR    tta_Tags		; extended attributes
    LABEL   tta_SIZEOF

******* Text Tags ****************************************************
TA_DeviceDPI	EQU	1!TAG_USER	; Tag value is Point union:
					; Hi word XDPI, Lo word YDPI


MAXFONTMATCHWEIGHT	EQU	32767	; perfect match from WeighTAMatch


******* TextFont node ************************************************
 STRUCTURE	TextFont,MN_SIZE ; reply message for font removal
				; font name in LN_NAME	\ used in this
    UWORD   tf_YSize		; font height		| order to best
    UBYTE   tf_Style		; font style		| match a font
    UBYTE   tf_Flags		; preference attributes	/ request.
    UWORD   tf_XSize		; nominal font width
    UWORD   tf_Baseline		; distance from the top of char to baseline
    UWORD   tf_BoldSmear	; smear to affect a bold enhancement

    UWORD   tf_Accessors	; access count

    UBYTE   tf_LoChar		; the first character described here
    UBYTE   tf_HiChar		; the last character described here
    APTR    tf_CharData		; the bit character data

    UWORD   tf_Modulo		; the row modulo for the strike font data
    APTR    tf_CharLoc		; ptr to location data for the strike font
				;   2 words: bit offset then size
    APTR    tf_CharSpace	; ptr to words of proportional spacing data
    APTR    tf_CharKern		; ptr to words of kerning data
    LABEL   tf_SIZEOF

tf_Extension	EQU	MN_REPLYPORT

;------	tfe_Flags0 (partial definition) ------------------------------
    BITDEF  TE0,NOREMFONT,0	; disallow RemFont for this font

 STRUCTURE	TextFontExtension,0	; this structure is read-only
    UWORD   tfe_MatchWord	; a magic cookie for the extension
    UBYTE   tfe_Flags0		; (system private flags)
    UBYTE   tfe_Flags1		; (system private flags)
    APTR    tfe_BackPtr		; validation of compilation
    APTR    tfe_OrigReplyPort	; original value in tf_Extension
    APTR    tfe_Tags		; Text Tags for the font
    APTR    tfe_OFontPatchS	; (system private use)
    APTR    tfe_OFontPatchK	; (system private use)
    ; this space is reserved for future expansion
    LABEL   tfe_SIZEOF		; (but allocated only by the system)


*******	ColorTextFont node *******************************************
;------	ctf_Flags ----------------------------------------------------
CT_COLORFONT	EQU	$0001	; color map contains designer's colors
CT_GREYFONT	EQU	$0002	; color map describes even-stepped brightnesses
				; from low to high
CT_ANTIALIAS	EQU	$0004	; zero background thru fully saturated char

	BITDEF	CT,MAPCOLOR,0	; map ctf_FgColor to the rp_FgPen if the former
				; is a valid color within ctf_Low..ctf_High

;------ ColorFontColors ----------------------------------------------
 STRUCTURE	ColorFontColors,0
    UWORD   cfc_Reserved	; must be zero
    UWORD   cfc_Count		; number of entries in cfc_ColorTable
    APTR    cfc_ColorTable	; 4 bit per component color map packed xRGB
    LABEL   cfc_SIZEOF

;------	ColorTextFont ------------------------------------------------
 STRUCTURE	ColorTextFont,tf_SIZEOF
    UWORD   ctf_Flags		; extended flags
    UBYTE   ctf_Depth		; number of bit planes
    UBYTE   ctf_FgColor		; color that is remapped to FgPen
    UBYTE   ctf_Low		; lowest color represented here
    UBYTE   ctf_High		; highest color represented here
    UBYTE   ctf_PlanePick	; PlanePick ala Images
    UBYTE   ctf_PlaneOnOff	; PlaneOnOff ala Images
    APTR    ctf_ColorFontColors	; struct ColorFontColors * for font
    STRUCT  ctf_CharData,8*4	; pointers to bit planes ala tf_CharData
    LABEL   ctf_SIZEOF

******* TextExtent node **********************************************
 STRUCTURE	TextExtent,0
    UWORD   te_Width		; same as TextLength
    UWORD   te_Height		; same as tf_YSize
    STRUCT  te_Extent,8		; WORD MinX, MinY, MaxX, MaxY relative to CP
    LABEL   te_SIZEOF

	ENDC	; GRAPHICS_TEXT_I
