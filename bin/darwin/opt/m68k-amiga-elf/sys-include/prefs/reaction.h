#ifndef PREFS_REACTION_H
#define PREFS_REACTION_H
/*
**	$VER: reaction.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Reaction preferences file definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif

#ifndef GRAPHICS_TEXT_H
#include <graphics/text.h>
#endif


/*****************************************************************************/

#define ID_RACT MAKE_ID('R','A','C','T')

#define FONTNAMESIZE (128)

struct ReactionPrefs
{
	UWORD     rp_BevelType; /* see <reaction/reaction_prefs.h> */
	UWORD     rp_GlyphType; /* see (reaction/reaction_prefs.h> */
	UWORD     rp_LayoutSpacing;
	BOOL      rp_3DProp;
	UWORD     rp_LabelPen;
	UWORD     rp_LabelPlace;
	BOOL      rp_3DLabel;
	BOOL      rp_SimpleRefresh;
	BOOL      rp_3DLook;
	struct TextAttr rp_FallbackAttr;
	struct TextAttr rp_LabelAttr;
	UBYTE     rp_FallbackName[FONTNAMESIZE];
	UBYTE     rp_LabelName[FONTNAMESIZE];
	UBYTE     rp_Pattern[256];
};

#endif /* PREFS_REACTION_H */
