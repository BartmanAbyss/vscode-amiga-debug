#ifndef	GRAPHICS_GELS_H
#define	GRAPHICS_GELS_H
/*
**	$VER: gels.h 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	include file for AMIGA GELS (Graphics Elements)
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

/* VSprite flags */
/* user-set VSprite flags: */
#define SUSERFLAGS  0x00FF    /* mask of all user-settable VSprite-flags */
#define VSPRITE     0x0001    /* set if VSprite, clear if Bob */
#define SAVEBACK    0x0002    /* set if background is to be saved/restored */
#define OVERLAY     0x0004    /* set to mask image of Bob onto background */
#define MUSTDRAW    0x0008    /* set if VSprite absolutely must be drawn */
/* system-set VSprite flags: */
#define BACKSAVED   0x0100    /* this Bob's background has been saved */
#define BOBUPDATE   0x0200    /* temporary flag, useless to outside world */
#define GELGONE     0x0400    /* set if gel is completely clipped (offscreen) */
#define VSOVERFLOW  0x0800    /* VSprite overflow (if MUSTDRAW set we draw!) */

/* Bob flags */
/* these are the user flag bits */
#define BUSERFLAGS  0x00FF    /* mask of all user-settable Bob-flags */
#define SAVEBOB     0x0001    /* set to not erase Bob */
#define BOBISCOMP   0x0002    /* set to identify Bob as AnimComp */
/* these are the system flag bits */
#define BWAITING    0x0100    /* set while Bob is waiting on 'after' */
#define BDRAWN	    0x0200    /* set when Bob is drawn this DrawG pass*/
#define BOBSAWAY    0x0400    /* set to initiate removal of Bob */
#define BOBNIX	    0x0800    /* set when Bob is completely removed */
#define SAVEPRESERVE 0x1000   /* for back-restore during double-buffer*/
#define OUTSTEP     0x2000    /* for double-clearing if double-buffer */

/* defines for the animation procedures */
#define ANFRACSIZE  6
#define ANIMHALF    0x0020
#define RINGTRIGGER 0x0001


/* UserStuff definitions
 *  the user can define these to be a single variable or a sub-structure
 *  if undefined by the user, the system turns these into innocuous variables
 *  see the manual for a thorough definition of the UserStuff definitions
 *
 */
#ifndef VUserStuff	      /* VSprite user stuff */
#define VUserStuff WORD
#endif

#ifndef BUserStuff	      /* Bob user stuff */
#define BUserStuff WORD
#endif

#ifndef AUserStuff	      /* AnimOb user stuff */
#define AUserStuff WORD
#endif




/*********************** GEL STRUCTURES ***********************************/

struct VSprite
{
/* --------------------- SYSTEM VARIABLES ------------------------------- */
/* GEL linked list forward/backward pointers sorted by y,x value */
    struct VSprite   *NextVSprite;
    struct VSprite   *PrevVSprite;

/* GEL draw list constructed in the order the Bobs are actually drawn, then
 *  list is copied to clear list
 *  must be here in VSprite for system boundary detection
 */
    struct VSprite   *DrawPath;     /* pointer of overlay drawing */
    struct VSprite   *ClearPath;    /* pointer for overlay clearing */

/* the VSprite positions are defined in (y,x) order to make sorting
 *  sorting easier, since (y,x) as a long integer
 */
    WORD OldY, OldX;	      /* previous position */

/* --------------------- COMMON VARIABLES --------------------------------- */
    WORD Flags;	      /* VSprite flags */


/* --------------------- USER VARIABLES ----------------------------------- */
/* the VSprite positions are defined in (y,x) order to make sorting
 *  sorting easier, since (y,x) as a long integer
 */
    WORD Y, X;		      /* screen position */

    WORD Height;
    WORD Width;	      /* number of words per row of image data */
    WORD Depth;	      /* number of planes of data */

    WORD MeMask;	      /* which types can collide with this VSprite*/
    WORD HitMask;	      /* which types this VSprite can collide with*/

    WORD *ImageData;	      /* pointer to VSprite image */

/* borderLine is the one-dimensional logical OR of all
 *  the VSprite bits, used for fast collision detection of edge
 */
    WORD *BorderLine;	      /* logical OR of all VSprite bits */
    WORD *CollMask;	      /* similar to above except this is a matrix */

/* pointer to this VSprite's color definitions (not used by Bobs) */
    WORD *SprColors;

    struct Bob *VSBob;	      /* points home if this VSprite is part of
				   a Bob */

/* planePick flag:  set bit selects a plane from image, clear bit selects
 *  use of shadow mask for that plane
 * OnOff flag: if using shadow mask to fill plane, this bit (corresponding
 *  to bit in planePick) describes whether to fill with 0's or 1's
 * There are two uses for these flags:
 *	- if this is the VSprite of a Bob, these flags describe how the Bob
 *	  is to be drawn into memory
 *	- if this is a simple VSprite and the user intends on setting the
 *	  MUSTDRAW flag of the VSprite, these flags must be set too to describe
 *	  which color registers the user wants for the image
 */
    BYTE PlanePick;
    BYTE PlaneOnOff;

    VUserStuff VUserExt;      /* user definable:  see note above */
};

struct Bob
/* blitter-objects */
{
/* --------------------- SYSTEM VARIABLES --------------------------------- */

/* --------------------- COMMON VARIABLES --------------------------------- */
    WORD Flags;	/* general purpose flags (see definitions below) */

/* --------------------- USER VARIABLES ----------------------------------- */
    WORD *SaveBuffer;	/* pointer to the buffer for background save */

/* used by Bobs for "cookie-cutting" and multi-plane masking */
    WORD *ImageShadow;

/* pointer to BOBs for sequenced drawing of Bobs
 *  for correct overlaying of multiple component animations
 */
    struct Bob *Before; /* draw this Bob before Bob pointed to by before */
    struct Bob *After;	/* draw this Bob after Bob pointed to by after */

    struct VSprite   *BobVSprite;   /* this Bob's VSprite definition */

    struct AnimComp  *BobComp;	    /* pointer to this Bob's AnimComp def */

    struct DBufPacket *DBuffer;     /* pointer to this Bob's dBuf packet */

    BUserStuff BUserExt;	    /* Bob user extension */
};

struct AnimComp
{
/* --------------------- SYSTEM VARIABLES --------------------------------- */

/* --------------------- COMMON VARIABLES --------------------------------- */
    WORD Flags;		    /* AnimComp flags for system & user */

/* timer defines how long to keep this component active:
 *  if set non-zero, timer decrements to zero then switches to nextSeq
 *  if set to zero, AnimComp never switches
 */
    WORD Timer;

/* --------------------- USER VARIABLES ----------------------------------- */
/* initial value for timer when the AnimComp is activated by the system */
    WORD TimeSet;

/* pointer to next and previous components of animation object */
    struct AnimComp  *NextComp;
    struct AnimComp  *PrevComp;

/* pointer to component component definition of next image in sequence */
    struct AnimComp  *NextSeq;
    struct AnimComp  *PrevSeq;

/* address of special animation procedure */
    WORD (*AnimCRoutine) __CLIB_PROTOTYPE((struct AnimComp *));

    WORD YTrans;     /* initial y translation (if this is a component) */
    WORD XTrans;     /* initial x translation (if this is a component) */

    struct AnimOb    *HeadOb;

    struct Bob	     *AnimBob;
};

struct AnimOb
{
/* --------------------- SYSTEM VARIABLES --------------------------------- */
    struct AnimOb    *NextOb, *PrevOb;

/* number of calls to Animate this AnimOb has endured */
    LONG Clock;

    WORD AnOldY, AnOldX;	    /* old y,x coordinates */

/* --------------------- COMMON VARIABLES --------------------------------- */
    WORD AnY, AnX;		    /* y,x coordinates of the AnimOb */

/* --------------------- USER VARIABLES ----------------------------------- */
    WORD YVel, XVel;		    /* velocities of this object */
    WORD YAccel, XAccel;	    /* accelerations of this object */

    WORD RingYTrans, RingXTrans;    /* ring translation values */

    				    /* address of special animation
				       procedure */
    WORD (*AnimORoutine) __CLIB_PROTOTYPE((struct AnimOb *));

    struct AnimComp  *HeadComp;     /* pointer to first component */

    AUserStuff AUserExt;	    /* AnimOb user extension */
};

/* dBufPacket defines the values needed to be saved across buffer to buffer
 *  when in double-buffer mode
 */
struct DBufPacket
{
    WORD BufY, BufX;		    /* save the other buffers screen coordinates */
    struct VSprite   *BufPath;	    /* carry the draw path over the gap */

/* these pointers must be filled in by the user */
/* pointer to other buffer's background save buffer */
    WORD *BufBuffer;
};



/* ************************************************************************ */

/* these are GEL functions that are currently simple enough to exist as a
 *  definition.  It should not be assumed that this will always be the case
 */
#define InitAnimate(animKey) {*(animKey) = NULL;}
#define RemBob(b) {(b)->Flags |= BOBSAWAY;}


/* ************************************************************************ */

#define B2NORM	    0
#define B2SWAP	    1
#define B2BOBBER    2

/* ************************************************************************ */

/* a structure to contain the 16 collision procedure addresses */
struct collTable
{
    /* NOTE: This table actually consists of two different types of
     *       pointers. The first table entry is for collision testing,
     *       the other are for reporting collisions. The first function
     *       pointer looks like this:
     *
     *          LONG (*collPtrs[0])(struct VSprite *,WORD);
     *
     *       The remaining 15 function pointers look like this:
     *
     *          VOID (*collPtrs[1..15])(struct VSprite *,struct VSprite *);
     */
    LONG (*collPtrs[16]) __CLIB_PROTOTYPE((struct VSprite *,struct VSprite *));
};

#endif	/* GRAPHICS_GELS_H */
