#ifndef INTUITION_CGHOOKS_H
#define INTUITION_CGHOOKS_H 1
/*
**  $VER: cghooks.h 38.1 (11.11.1991)
**  Includes Release 45.1
**
**  Custom Gadget processing
**
**  (C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

/*
 * Package of information passed to custom and 'boopsi'
 * gadget "hook" functions.  This structure is READ ONLY.
 */
struct GadgetInfo {

    struct Screen		*gi_Screen;
    struct Window		*gi_Window;	/* null for screen gadgets */
    struct Requester		*gi_Requester;	/* null if not GTYP_REQGADGET */

    /* rendering information:
     * don't use these without cloning/locking.
     * Official way is to call ObtainRPort()
     */
    struct RastPort		*gi_RastPort;
    struct Layer		*gi_Layer;

    /* copy of dimensions of screen/window/g00/req(/group)
     * that gadget resides in.	Left/Top of this box is
     * offset from window mouse coordinates to gadget coordinates
     *		screen gadgets:			0,0 (from screen coords)
     *	window gadgets (no g00):	0,0
     *	GTYP_GZZGADGETs (borderlayer):		0,0
     *	GZZ innerlayer gadget:		borderleft, bordertop
     *	Requester gadgets:		reqleft, reqtop
     */
    struct IBox			gi_Domain;

    /* these are the pens for the window or screen	*/
    struct {
	UBYTE	DetailPen;
	UBYTE	BlockPen;
    }				gi_Pens;

    /* the Detail and Block pens in gi_DrInfo->dri_Pens[] are
     * for the screen.	Use the above for window-sensitive
     * colors.
     */
    struct DrawInfo		*gi_DrInfo;

    /* reserved space: this structure is extensible
     * anyway, but using these saves some recompilation
     */
    ULONG			gi_Reserved[6];
};

/*** system private data structure for now ***/
/* prop gadget extra info	*/
struct PGX	{
    struct IBox	pgx_Container;
    struct IBox	pgx_NewKnob;
};

/* this casts MutualExclude for easy assignment of a hook
 * pointer to the unused MutualExclude field of a custom gadget
 */
#define CUSTOM_HOOK( gadget ) ( (struct Hook *) (gadget)->MutualExclude)

#endif
