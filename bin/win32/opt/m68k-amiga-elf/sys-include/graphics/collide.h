#ifndef	GRAPHICS_COLLIDE_H
#define	GRAPHICS_COLLIDE_H
/*
**	$VER: collide.h 37.0 (7.1.1991)
**	Includes Release 45.1
**
**	include file for collision detection and control
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/* These bit descriptors are used by the GEL collide routines.
 *  These bits are set in the hitMask and meMask variables of
 *  a GEL to describe whether or not these types of collisions
 *  can affect the GEL.  BNDRY_HIT is described further below;
 *  this bit is permanently assigned as the boundary-hit flag.
 *  The other bit GEL_HIT is meant only as a default to cover
 *  any GEL hitting any other; the user may redefine this bit.
 */
#define BORDERHIT 0

/* These bit descriptors are used by the GEL boundry hit routines.
 *  When the user's boundry-hit routine is called (via the argument
 *  set by a call to SetCollision) the first argument passed to
 *  the user's routine is the address of the GEL involved in the
 *  boundry-hit, and the second argument has the appropriate bit(s)
 *  set to describe which boundry was surpassed
 */
#define TOPHIT	  1
#define BOTTOMHIT 2
#define LEFTHIT   4
#define RIGHTHIT  8

#endif	/* GRAPHICS_COLLIDE_H */
