#ifndef	DATATYPES_TEXTCLASS_H
#define	DATATYPES_TEXTCLASS_H
/*
**  $VER: textclass.h 39.3 (3.8.1992)
**  Includes Release 45.1
**
**  Interface definitions for DataType text objects.
**
**  (C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
*/

#ifndef	UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef	DATATYPES_DATATYPESCLASS_H
#include <datatypes/datatypesclass.h>
#endif

#ifndef	LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif

/*****************************************************************************/

#define	TEXTDTCLASS		"text.datatype"

/*****************************************************************************/

/* Text attributes */
#define	TDTA_Buffer		(DTA_Dummy + 300)
#define	TDTA_BufferLen		(DTA_Dummy + 301)
#define	TDTA_LineList		(DTA_Dummy + 302)
#define	TDTA_WordSelect		(DTA_Dummy + 303)
#define	TDTA_WordDelim		(DTA_Dummy + 304)
#define	TDTA_WordWrap		(DTA_Dummy + 305)
     /* Boolean. Should the text be word wrapped.  Defaults to false. */

/*****************************************************************************/

/* There is one Line structure for every line of text in our document.	*/
struct Line
{
    struct MinNode	 ln_Link;		/* to link the lines together */
    STRPTR		 ln_Text;		/* pointer to the text for this	line */
    ULONG		 ln_TextLen;		/* the character length of the text for this line */
    UWORD		 ln_XOffset;		/* where in the	line the text starts */
    UWORD		 ln_YOffset;		/* line the text is on */
    UWORD		 ln_Width;		/* Width of line in pixels */
    UWORD		 ln_Height;		/* Height of line in pixels */
    UWORD		 ln_Flags;		/* info	on the line */
    BYTE		 ln_FgPen;		/* foreground pen */
    BYTE		 ln_BgPen;		/* background pen */
    ULONG		 ln_Style;		/* Font style */
    APTR		 ln_Data;		/* Link data... */
};

/*****************************************************************************/

/* Line.ln_Flags */

/* Line Feed */
#define	LNF_LF		(1L << 0)

/* Segment is a link */
#define	LNF_LINK	(1L << 1)

/* ln_Data is a pointer to an DataTypes object */
#define	LNF_OBJECT	(1L << 2)

/* Object is selected */
#define	LNF_SELECTED	(1L << 3)

/*****************************************************************************/

/* IFF types that may be text */
#define	ID_FTXT		MAKE_ID('F','T','X','T')
#define	ID_CHRS		MAKE_ID('C','H','R','S')

/*****************************************************************************/

#endif	/* DATATYPES_TEXTCLASS_H */
