#ifndef REACTION_REACTION_PREFS_H
#define REACTION_REACTION_PREFS_H
/*
**	$VER: reaction_prefs.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Reaction preferences definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif

/*
 * Obtain this semaphore while reading the preferences
 */
#define RAPREFSSEMAPHORE "REACTION-PREFS"

/* WARNING: This structure has been changing, and will continue to change.
 * In the future, this structure might possible be accesssed at a higher
 * level via a tag list. For now, except for class authors wishing our
 * support in handling prefs, this is data is to be considered off limits.
 */

#define ClassActPrefs UIPrefs

struct UIPrefs
{
	/* Set PrefsVersion to 1 */
	struct SignalSemaphore	 cap_Semaphore;
	UWORD					 cap_PrefsVersion;
	UWORD					 cap_PrefsSize;
	UBYTE					 cap_BevelType;
	UWORD					 cap_LayoutSpacing;
	BOOL					 cap_3DLook;
	UWORD					 cap_LabelPen;
	UBYTE					 cap_LabelPlace;
	UBYTE					 cap_3DLabel;
	ULONG					*cap_Reserved1;
	BOOL					 cap_SimpleRefresh;
	UBYTE					 cap_Pattern[256];
	ULONG					*cap_Reserved2;

	BOOL					 cap_3DProp;
	BOOL					 cap_Reserved3;

	UBYTE					 cap_GlyphType;	/* currently unsupported/unused!! */
	UBYTE					 cap_Reserved4;

	struct TextAttr			*cap_FallbackAttr;
	struct TextAttr			*cap_LabelAttr;
};


/* Bevel Types */
#define BVT_GT      0	/* GadTools style 2:1 bevels */
#define BVT_THIN    1	/* CA 1:1 bevels */
#define BVT_THICK   2	/* CA 2:1 4 color thick bevels */
#define BVT_XEN     3	/* 4 color Xen-Style inspired 1/2 shine bevels */
#define BVT_XENTHIN 4	/* 3 color Xen-Style inspired thin 1/2 shine 1:1 bevels */

/* Glyph Types */
#define GLT_GT    0
#define GLT_FLAT  1
#define GLT_3D    2

#endif /* REACTION_REACTION_PREFS_H */
