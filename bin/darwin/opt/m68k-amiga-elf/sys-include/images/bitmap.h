#ifndef IMAGES_BITMAP_H
#define IMAGES_BITMAP_H
/*
**	$VER: bitmap.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the bitmap.image BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTRION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_IMAGECLASS_H
#include <intuition/imageclass.h>
#endif

/*****************************************************************************/

#define BITMAP_Dummy		   (REACTION_Dummy + 0x19000)

/*****************************************************************************/

/* Additional attributes defined by the bitmap class
 */

#define BITMAP_SourceFile        (BITMAP_Dummy + 1)
   /* (STRPTR) Filename of datatype object */

#define BITMAP_Screen            (BITMAP_Dummy + 2)
   /* (struct Screen *) Screen to remap the datatype image to */

#define BITMAP_Precision         (BITMAP_Dummy + 3)
   /* (ULONG) OBP_PRECISION to use in remapping */

#define BITMAP_Masking           (BITMAP_Dummy + 4)
   /* (BOOL) Mask image */

#define BITMAP_BitMap            (BITMAP_Dummy + 5)
   /* (struct BitMap *) Ready-to-use bitmap */

#define BITMAP_Width             (BITMAP_Dummy + 6)
   /* (LONG) Width of bitmap */

#define BITMAP_Height            (BITMAP_Dummy + 7)
   /* (LONG) Height of bitmap */

#define BITMAP_MaskPlane         (BITMAP_Dummy + 8)
   /* (APTR) Masking plane */

#define BITMAP_SelectSourceFile  (BITMAP_Dummy + 9)
   /* (STRPTR) */

#define BITMAP_SelectBitMap      (BITMAP_Dummy + 10)
   /* (struct BitMap */

#define BITMAP_SelectWidth       (BITMAP_Dummy + 11)
   /* (LONG) */

#define BITMAP_SelectHeight      (BITMAP_Dummy + 12)
   /* (LONG) */

#define BITMAP_SelectMaskPlane   (BITMAP_Dummy + 13)
   /* (APTR) */

#define BITMAP_OffsetX           (BITMAP_Dummy + 14)
   /* (LONG) */

#define BITMAP_OffsetY           (BITMAP_Dummy + 15)
   /* (LONG) */

#define BITMAP_SelectOffsetX     (BITMAP_Dummy + 16)
   /* (LONG) */

#define BITMAP_SelectOffsetY     (BITMAP_Dummy + 17)
   /* (LONG) */

/*****************************************************************************/

#endif /* IMAGES_BITMAP_H */
