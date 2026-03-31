#ifndef	DEVICES_KEYMAP_H
#define	DEVICES_KEYMAP_H
/*
**	$VER: keymap.h 47.1 (28.6.2019)
**
**	key map definitions for keymap.resource, keymap.library, and
**	console.device
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_NODES_H
#include	<exec/nodes.h>
#endif
#ifndef EXEC_LISTS_H
#include	<exec/lists.h>
#endif

/* This file was sort of misplaced here in devices - most content and more
 * is now in libraries drawer */

/* the structure of keymap.resource */
struct	KeyMapResource {
	struct Node kr_Node;
	struct List kr_List;	/* a list of KeyMapNodes */
};

#ifndef LIBRARIES_KEYMAP_H
#include	<libraries/keymap.h>
#endif

#endif	/* DEVICES_KEYMAP_H */
