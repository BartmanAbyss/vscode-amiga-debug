/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_COLORWHEEL_PROTOS_H
#define CLIB_COLORWHEEL_PROTOS_H

/*
**   $VER: colorwheel_protos.h $VER: colorwheel_lib.sfd 47.1 (30.11.2021) $VER: colorwheel_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>
#include <gadgets/colorwheel.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V39 or higher ---*/

/* "colorwheel.gadget" */
/*
 Public entries
*/

VOID ConvertHSBToRGB(CONST struct ColorWheelHSB *hsb, struct ColorWheelRGB *rgb);
VOID ConvertRGBToHSB(CONST struct ColorWheelRGB *rgb, struct ColorWheelHSB *hsb);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_COLORWHEEL_PROTOS_H */
