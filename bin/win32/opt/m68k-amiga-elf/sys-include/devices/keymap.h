#ifndef	DEVICES_KEYMAP_H
#define	DEVICES_KEYMAP_H
/*
**	$VER: keymap.h 36.3 (13.4.1990)
**	Includes Release 45.1
**
**	key map definitions for keymap.resource, keymap.library, and
**	console.device
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif
#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif

struct	 KeyMap {
    UBYTE   *km_LoKeyMapTypes;
    ULONG   *km_LoKeyMap;
    UBYTE   *km_LoCapsable;
    UBYTE   *km_LoRepeatable;
    UBYTE   *km_HiKeyMapTypes;
    ULONG   *km_HiKeyMap;
    UBYTE   *km_HiCapsable;
    UBYTE   *km_HiRepeatable;
};

struct	KeyMapNode {
    struct Node kn_Node;	/* including name of keymap */
    struct KeyMap kn_KeyMap;
};

/* the structure of keymap.resource */
struct	KeyMapResource {
    struct Node kr_Node;
    struct List kr_List;	/* a list of KeyMapNodes */
};

/* Key Map Types */
#define  KC_NOQUAL   0
#define  KC_VANILLA  7		/* note that SHIFT+ALT+CTRL is VANILLA */
#define  KCB_SHIFT   0
#define  KCF_SHIFT   0x01
#define  KCB_ALT     1
#define  KCF_ALT     0x02
#define  KCB_CONTROL 2
#define  KCF_CONTROL 0x04
#define  KCB_DOWNUP  3
#define  KCF_DOWNUP  0x08

#define  KCB_DEAD    5		/* may be dead or modified by dead key: */
#define  KCF_DEAD    0x20	/*   use dead prefix bytes		*/

#define  KCB_STRING  6
#define  KCF_STRING  0x40

#define  KCB_NOP     7
#define  KCF_NOP     0x80


/* Dead Prefix Bytes */
#define DPB_MOD	0
#define DPF_MOD	0x01
#define DPB_DEAD	3
#define DPF_DEAD	0x08

#define DP_2DINDEXMASK	0x0f	/* mask for index for 1st of two dead keys */
#define DP_2DFACSHIFT	4	/* shift for factor for 1st of two dead keys */

#endif	/* DEVICES_KEYMAP_H */
