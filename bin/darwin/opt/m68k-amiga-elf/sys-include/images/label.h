#ifndef IMAGES_LABEL_H
#define IMAGES_LABEL_H
/*
**	$VER: label.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the Label BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTRION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_GADGETCLASS_H
#include <intuition/imageclass.h>
#endif


/*****************************************************************************/

/* Justification modes.
 */
#define LJ_LEFT 0
#define LJ_CENTRE 1
#define LJ_RIGHT 2

/* For those that can't spell :)
 */
#define LJ_CENTER LJ_CENTRE

/* Obsolete, DON'T USE THESE!
 */
#define LABEL_LEFT LJ_LEFT
#define LABEL_CENTRE LJ_CENTRE
#define LABEL_CENTER LJ_CENTRE
#define LABEL_RIGHT LJ_RIGHT

/*****************************************************************************/

/* Additional attributes defined by the Label class
 */
#define LABEL_Dummy					(REACTION_Dummy+0x0006000)

#define	LABEL_DrawInfo				SYSIA_DrawInfo

#define	LABEL_Text					(LABEL_Dummy+1)
	/* (STRPTR) Text to print in the label. */

#define	LABEL_Image					(LABEL_Dummy+2)
	/* (struct Image *) Image to print in the label. */

#define	LABEL_Mapping				(LABEL_Dummy+3)
	/* (UWORD *) Mapping array for the next image. */

#define	LABEL_Justification			(LABEL_Dummy+4)
	/* (UWORD) Justification modes (see above) */

#define	LABEL_Key					(LABEL_Dummy+5)
	/* (UWORD) Returns the underscored key (if any) */

#define	LABEL_Underscore			(LABEL_Dummy+6)
	/* (UBYTE) Defaults to '_'. */

#define	LABEL_DisposeImage			(LABEL_Dummy+7)
	/* (BOOL) Defaults to FALSE. */

#define	LABEL_SoftStyle				(LABEL_Dummy+8)
	/* (UBYTE) Defaults to none. */

#define	LABEL_VerticalSpacing		(LABEL_Dummy+9)
	/* (UWORD) Vertical spacing between text/image nodes/lines. Defaults to 0. */

/*****************************************************************************/

#endif /* IMAGES_LABEL_H */
