#ifndef	LIBRARIES_KEYMAP_H
#define	LIBRARIES_KEYMAP_H
/*
**	$VER: keymap.h 47.1 (28.6.2019)
**
**	key map definitions for keymap.library, and
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

/* Some useful definitions for rawkey codes which are assumed
 * to be the same on all keyboards so no call of MapRawKey()
 * is necessary. These are the keydown codes only.
 */
#define RAWKEY_SPACE     0x40
#define RAWKEY_BACKSPACE 0x41
#define RAWKEY_TAB       0x42
#define RAWKEY_ENTER     0x43 /* Numeric pad */
#define RAWKEY_RETURN    0x44
#define RAWKEY_ESC       0x45
#define RAWKEY_DEL       0x46
#define RAWKEY_INSERT    0x47 /* Not on classic keyboards */
#define RAWKEY_PAGEUP    0x48 /* Not on classic keyboards */
#define RAWKEY_PAGEDOWN  0x49 /* Not on classic keyboards */
#define RAWKEY_F11       0x4B /* Not on classic keyboards */
#define RAWKEY_CRSRUP    0x4C
#define RAWKEY_CRSRDOWN  0x4D
#define RAWKEY_CRSRRIGHT 0x4E
#define RAWKEY_CRSRLEFT  0x4F
#define RAWKEY_F1        0x50
#define RAWKEY_F2        0x51
#define RAWKEY_F3        0x52
#define RAWKEY_F4        0x53
#define RAWKEY_F5        0x54
#define RAWKEY_F6        0x55
#define RAWKEY_F7        0x56
#define RAWKEY_F8        0x57
#define RAWKEY_F9        0x58
#define RAWKEY_F10       0x59
#define RAWKEY_HELP      0x5F
#define RAWKEY_LSHIFT    0x60
#define RAWKEY_RSHIFT    0x61
#define RAWKEY_CAPSLOCK  0x62
#define RAWKEY_LCTRL     0x63 /* Right Ctrl is the same for now */
#define RAWKEY_LALT      0x64
#define RAWKEY_RALT      0x65
#define RAWKEY_LCOMMAND  0x66 /* LAmiga|LWin|LApple|LMeta */
#define RAWKEY_RCOMMAND  0x67 /* RAmiga|RWin|RApple|RMeta */
#define RAWKEY_MENU      0x6B /* Not on classic keyboards */
                              /* Menu|Win|Compose         */
                              /* Dont use, its reserved   */
#define RAWKEY_PRINTSCR  0x6D /* Not on classic keyboards */
#define RAWKEY_BREAK     0x6E /* Not on classic keyboards */
                              /* Pause/Break              */
#define RAWKEY_F12       0x6F /* Not on classic keyboards */
#define RAWKEY_HOME      0x70 /* Not on classic keyboards */
#define RAWKEY_END       0x71 /* Not on classic keyboards */

/* The following keys can exist on CDTV, CD32 and "multimedia" keyboards:
 *
 * Rawkey         |CD32 color&key     |CDTV key  |Comment
 * ---------------+-------------------+----------+-----------
 * 0x72 Stop      |Blue     Stop      |Stop      |
 * 0x73 Play/Pause|Grey     Play/Pause|Play/Pause|
 * 0x74 Prev Track|Charcoal Reverse   |<< REW    |
 * 0x75 Next Track|Charcoal Forward   |>> FF     |
 * 0x76 Shuffle   |Green    Shuffle   |          |Random Play
 * 0x77 Repeat    |Yellow   Repeat    |          |
 */
#define RAWKEY_MEDIA_STOP       0x72
#define RAWKEY_MEDIA_PLAY_PAUSE 0x73
#define RAWKEY_MEDIA_PREV_TRACK 0x74
#define RAWKEY_MEDIA_NEXT_TRACK 0x75
#define RAWKEY_MEDIA_SHUFFLE    0x76
#define RAWKEY_MEDIA_REPEAT     0x77

#define RAWKEY_WHEEL_UP         0x7A /* aka NM_WHEEL_UP */
#define RAWKEY_WHEEL_DOWN       0x7B /* aka NM_WHEEL_DOWN */
#define RAWKEY_WHEEL_LEFT       0x7C /* aka NM_WHEEL_LEFT */
#define RAWKEY_WHEEL_RIGHT      0x7D /* aka NM_WHEEL_RIGHT */

#endif	/* LIBRARIES_KEYMAP_H */
