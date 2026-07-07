#ifndef	GRAPHICS_GFXNODES_H
#define	GRAPHICS_GFXNODES_H
/*
**	$VER: gfxnodes.h 47.1 (31.7.2019)
**
**	graphics extended node definintions
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif


struct  ExtendedNode    {
  struct  Node   *xln_Succ;
  struct  Node   *xln_Pred;
  UBYTE           xln_Type;
  BYTE            xln_Pri;
  char           *xln_Name;
  UBYTE           xln_Subsystem;
  UBYTE           xln_Subtype;
  struct GfxBase *xln_Library;
  /*
  ** The following function shall only be used internally, the
  ** calling convention is with registers populated below.
  */
  LONG (* __ASM__ xln_Init) __CLIB_PROTOTYPE((__REG__(a0, struct ExtendedNode *),__REG__(d0, UWORD)));
};

#define SS_GRAPHICS     0x02

#define	VIEW_EXTRA_TYPE		1
#define	VIEWPORT_EXTRA_TYPE	2
#define	SPECIAL_MONITOR_TYPE	3
#define	MONITOR_SPEC_TYPE	4

#endif	/* GRAPHICS_GFXNODES_H */
