#ifndef	GRAPHICS_GRAPHINT_H
#define	GRAPHICS_GRAPHINT_H
/*
**	$VER: graphint.h 47.1 (28.7.2019)
**
**	include file for AddTOFTask
**      This is part of the amiga.lib and not
**      in the operating system.
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

/* structure used by AddTOFTask */
struct Isrvstr
{
    struct Node is_Node;
    struct Isrvstr *Iptr;   /* passed to srvr by os */
    LONG (*code)();         /* system private */
    LONG __STDARGS__ (*ccode) __CLIB_PROTOTYPE((APTR));
    APTR Carg;
};

#endif	/* GRAPHICS_GRAPHINT_H */
