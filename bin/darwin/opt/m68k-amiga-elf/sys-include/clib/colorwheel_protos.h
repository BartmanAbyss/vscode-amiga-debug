#ifndef  CLIB_COLORWHEEL_PROTOS_H
#define  CLIB_COLORWHEEL_PROTOS_H

/*
**	$VER: colorwheel_protos.h 39.1 (21.7.1992)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  GADGETS_COLORWHEEL_H
#include <gadgets/colorwheel.h>
#endif
/*--- functions in V39 or higher (Release 3) ---*/

/* Public entries */

VOID ConvertHSBToRGB( struct ColorWheelHSB *hsb, struct ColorWheelRGB *rgb );
VOID ConvertRGBToHSB( struct ColorWheelRGB *rgb, struct ColorWheelHSB *hsb );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_COLORWHEEL_PROTOS_H */
