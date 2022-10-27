#ifndef  CLIB_VIRTUAL_PROTOS_H
#define  CLIB_VIRTUAL_PROTOS_H

/*
**	$VER: virtual_protos.h 1.1 (6.10.1999)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Stephan Rupprecht
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif
#ifndef  INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif
#ifndef  GADGETS_LAYOUT_H
#include <gadgets/layout.h>
#endif
struct IClass *VIRTUAL_GetClass( VOID );
VOID RefreshVirtualGadget( struct Gadget *gadget, ULONG obj, struct Window *window, struct Requester *requester );
BOOL RethinkVirtualSize( ULONG virt_obj, ULONG rootlayout, struct TextFont *font, struct Screen *screen, struct LayoutLimits *layoutlimits );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_VIRTUAL_PROTOS_H */
