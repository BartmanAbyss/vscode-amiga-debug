#ifndef	GRAPHICS_TEXT_H
#define	GRAPHICS_TEXT_H
/*
**	$VER: text.h 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	graphics library text structures
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	EXEC_PORTS_H
#include	<exec/ports.h>
#endif	/* EXEC_PORTS_H */

#ifndef	GRAPHICS_GFX_H
#include	<graphics/gfx.h>
#endif	/* GRAPHICS_GFX_H */

#ifndef	UTILITY_TAGITEM_H
#include	<utility/tagitem.h>
#endif	/* UTILITY_TAGITEM_H */

/*------ Font Styles ------------------------------------------------*/
#define	FS_NORMAL	0	/* normal text (no style bits set) */
#define	FSB_UNDERLINED	0	/* underlined (under baseline) */
#define	FSF_UNDERLINED	0x01
#define	FSB_BOLD	1	/* bold face text (ORed w/ shifted) */
#define	FSF_BOLD	0x02
#define	FSB_ITALIC	2	/* italic (slanted 1:2 right) */
#define	FSF_ITALIC	0x04
#define	FSB_EXTENDED	3	/* extended face (wider than normal) */
#define	FSF_EXTENDED	0x08

#define	FSB_COLORFONT	6	/* this uses ColorTextFont structure */
#define	FSF_COLORFONT	0x40
#define	FSB_TAGGED	7	/* the TextAttr is really an TTextAttr, */
#define	FSF_TAGGED	0x80

/*------ Font Flags -------------------------------------------------*/
#define	FPB_ROMFONT	0	/* font is in rom */
#define	FPF_ROMFONT	0x01
#define	FPB_DISKFONT	1	/* font is from diskfont.library */
#define	FPF_DISKFONT	0x02
#define	FPB_REVPATH	2	/* designed path is reversed (e.g. left) */
#define	FPF_REVPATH	0x04
#define	FPB_TALLDOT	3	/* designed for hires non-interlaced */
#define	FPF_TALLDOT	0x08
#define	FPB_WIDEDOT	4	/* designed for lores interlaced */
#define	FPF_WIDEDOT	0x10
#define	FPB_PROPORTIONAL 5	/* character sizes can vary from nominal */
#define	FPF_PROPORTIONAL 0x20
#define	FPB_DESIGNED	6	/* size explicitly designed, not constructed */
				/* note: if you do not set this bit in your */
				/* textattr, then a font may be constructed */
				/* for you by scaling an existing rom or disk */
				/* font (under V36 and above). */
#define	FPF_DESIGNED	0x40
    /* bit 7 is always clear for fonts on the graphics font list */
#define	FPB_REMOVED	7	/* the font has been removed */
#define	FPF_REMOVED	(1<<7)

/****** TextAttr node, matches text attributes in RastPort **********/
struct TextAttr {
    STRPTR  ta_Name;		/* name of the font */
    UWORD   ta_YSize;		/* height of the font */
    UBYTE   ta_Style;		/* intrinsic font style */
    UBYTE   ta_Flags;		/* font preferences and flags */
};

struct TTextAttr {
    STRPTR  tta_Name;		/* name of the font */
    UWORD   tta_YSize;		/* height of the font */
    UBYTE   tta_Style;		/* intrinsic font style */
    UBYTE   tta_Flags;		/* font preferences and flags */
    struct TagItem *tta_Tags;	/* extended attributes */
};


/****** Text Tags ***************************************************/
#define	TA_DeviceDPI	(1|TAG_USER)	/* Tag value is Point union: */
					/* Hi word XDPI, Lo word YDPI */

#define	MAXFONTMATCHWEIGHT	32767	/* perfect match from WeighTAMatch */


/****** TextFonts node **********************************************/
struct TextFont {
    struct Message tf_Message;	/* reply message for font removal */
				/* font name in LN	  \    used in this */
    UWORD   tf_YSize;		/* font height		  |    order to best */
    UBYTE   tf_Style;		/* font style		  |    match a font */
    UBYTE   tf_Flags;		/* preferences and flags  /    request. */
    UWORD   tf_XSize;		/* nominal font width */
    UWORD   tf_Baseline;	/* distance from the top of char to baseline */
    UWORD   tf_BoldSmear;	/* smear to affect a bold enhancement */

    UWORD   tf_Accessors;	/* access count */

    UBYTE   tf_LoChar;		/* the first character described here */
    UBYTE   tf_HiChar;		/* the last character described here */
    APTR    tf_CharData;	/* the bit character data */

    UWORD   tf_Modulo;		/* the row modulo for the strike font data */
    APTR    tf_CharLoc;		/* ptr to location data for the strike font */
				/*   2 words: bit offset then size */
    APTR    tf_CharSpace;	/* ptr to words of proportional spacing data */
    APTR    tf_CharKern;	/* ptr to words of kerning data */
};

/* unfortunately, this needs to be explicitly typed */
#define	tf_Extension	tf_Message.mn_ReplyPort

/*-----	tfe_Flags0 (partial definition) ----------------------------*/
#define TE0B_NOREMFONT	0	/* disallow RemFont for this font */
#define TE0F_NOREMFONT	0x01

struct TextFontExtension {	/* this structure is read-only */
    UWORD   tfe_MatchWord;		/* a magic cookie for the extension */
    UBYTE   tfe_Flags0;			/* (system private flags) */
    UBYTE   tfe_Flags1;			/* (system private flags) */
    struct TextFont *tfe_BackPtr;	/* validation of compilation */
    struct MsgPort *tfe_OrigReplyPort;	/* original value in tf_Extension */
    struct TagItem *tfe_Tags;		/* Text Tags for the font */
    UWORD  *tfe_OFontPatchS;		/* (system private use) */
    UWORD  *tfe_OFontPatchK;		/* (system private use) */
    /* this space is reserved for future expansion */
};

/******	ColorTextFont node ******************************************/
/*-----	ctf_Flags --------------------------------------------------*/
#define	CT_COLORMASK	0x000F	/* mask to get to following color styles */
#define	CT_COLORFONT	0x0001	/* color map contains designer's colors */
#define	CT_GREYFONT	0x0002	/* color map describes even-stepped */
				/* brightnesses from low to high */
#define	CT_ANTIALIAS	0x0004	/* zero background thru fully saturated char */

#define	CTB_MAPCOLOR	0	/* map ctf_FgColor to the rp_FgPen if it's */
#define	CTF_MAPCOLOR	0x0001	/* is a valid color within ctf_Low..ctf_High */

/*----- ColorFontColors --------------------------------------------*/
struct ColorFontColors {
    UWORD   cfc_Reserved;	/* *must* be zero */
    UWORD   cfc_Count;		/* number of entries in cfc_ColorTable */
    UWORD  *cfc_ColorTable;	/* 4 bit per component color map packed xRGB */
};

/*-----	ColorTextFont ----------------------------------------------*/
struct ColorTextFont {
    struct TextFont ctf_TF;
    UWORD   ctf_Flags;		/* extended flags */
    UBYTE   ctf_Depth;		/* number of bit planes */
    UBYTE   ctf_FgColor;	/* color that is remapped to FgPen */
    UBYTE   ctf_Low;		/* lowest color represented here */
    UBYTE   ctf_High;		/* highest color represented here */
    UBYTE   ctf_PlanePick;	/* PlanePick ala Images */
    UBYTE   ctf_PlaneOnOff;	/* PlaneOnOff ala Images */
    struct ColorFontColors *ctf_ColorFontColors; /* colors for font */
    APTR    ctf_CharData[8];	/*pointers to bit planes ala tf_CharData */
};

/****** TextExtent node *********************************************/
struct TextExtent {
    UWORD   te_Width;		/* same as TextLength */
    UWORD   te_Height;		/* same as tf_YSize */
    struct Rectangle te_Extent;	/* relative to CP */
};

#endif	/* GRAPHICS_TEXT_H */
