#ifndef	DISKFONT_DISKFONT_H
#define	DISKFONT_DISKFONT_H
/*
**	$VER: diskfont.h 38.0 (18.6.1992)
**	Includes Release 45.1
**
**	diskfont library definitions
**
**	(C) Copyright 1990 Robert R. Burns
**	    All Rights Reserved
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef     EXEC_NODES_H
#include <exec/nodes.h>
#endif
#ifndef     EXEC_LISTS_H
#include <exec/lists.h>
#endif
#ifndef     GRAPHICS_TEXT_H
#include <graphics/text.h>
#endif

#define     MAXFONTPATH 256   /* including null terminator */

struct FontContents {
    char    fc_FileName[MAXFONTPATH];
    UWORD   fc_YSize;
    UBYTE   fc_Style;
    UBYTE   fc_Flags;
};

struct TFontContents {
    char    tfc_FileName[MAXFONTPATH-2];
    UWORD   tfc_TagCount;	/* including the TAG_DONE tag */
    /*
     *	if tfc_TagCount is non-zero, tfc_FileName is overlayed with
     *	Text Tags starting at:	(struct TagItem *)
     *	    &tfc_FileName[MAXFONTPATH-(tfc_TagCount*sizeof(struct TagItem))]
     */
    UWORD   tfc_YSize;
    UBYTE   tfc_Style;
    UBYTE   tfc_Flags;
};


#define  FCH_ID		0x0f00	/* FontContentsHeader, then FontContents */
#define  TFCH_ID	0x0f02	/* FontContentsHeader, then TFontContents */
#define  OFCH_ID	0x0f03	/* FontContentsHeader, then TFontContents,
				 * associated with outline font */

struct FontContentsHeader {
    UWORD   fch_FileID;		/* FCH_ID */
    UWORD   fch_NumEntries;	/* the number of FontContents elements */
    /* struct FontContents fch_FC[], or struct TFontContents fch_TFC[]; */
};


#define  DFH_ID		0x0f80
#define  MAXFONTNAME	32	/* font name including ".font\0" */

struct DiskFontHeader {
    /* the following 8 bytes are not actually considered a part of the	*/
    /* DiskFontHeader, but immediately preceed it. The NextSegment is	*/
    /* supplied by the linker/loader, and the ReturnCode is the code	*/
    /* at the beginning of the font in case someone runs it...		*/
    /*	 ULONG dfh_NextSegment;			\* actually a BPTR	*/
    /*	 ULONG dfh_ReturnCode;			\* MOVEQ #0,D0 : RTS	*/
    /* here then is the official start of the DiskFontHeader...		*/
    struct Node dfh_DF;		/* node to link disk fonts */
    UWORD   dfh_FileID;		/* DFH_ID */
    UWORD   dfh_Revision;	/* the font revision */
    LONG    dfh_Segment;	/* the segment address when loaded */
    char    dfh_Name[MAXFONTNAME]; /* the font name (null terminated) */
    struct TextFont dfh_TF;	/* loaded TextFont structure */
};

/* unfortunately, this needs to be explicitly typed */
/* used only if dfh_TF.tf_Style FSB_TAGGED bit is set */
#define	dfh_TagList	dfh_Segment	/* destroyed during loading */


#define     AFB_MEMORY	0
#define     AFF_MEMORY	0x0001
#define     AFB_DISK	1
#define     AFF_DISK	0x0002
#define     AFB_SCALED	2
#define     AFF_SCALED	0x0004
#define     AFB_BITMAP	3
#define     AFF_BITMAP	0x0008

#define     AFB_TAGGED	16	/* return TAvailFonts */
#define     AFF_TAGGED	0x10000L

struct AvailFonts {
    UWORD   af_Type;		/* MEMORY, DISK, or SCALED */
    struct TextAttr af_Attr;	/* text attributes for font */
};

struct TAvailFonts {
    UWORD   taf_Type;		/* MEMORY, DISK, or SCALED */
    struct TTextAttr taf_Attr;	/* text attributes for font */
};

struct AvailFontsHeader {
    UWORD   afh_NumEntries;	 /* number of AvailFonts elements */
    /* struct AvailFonts afh_AF[], or struct TAvailFonts afh_TAF[]; */
};

#endif	/* DISKFONT_DISKFONT_H */
