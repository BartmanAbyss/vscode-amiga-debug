#ifndef REACTION_REACTION_H
#define REACTION_REACTION_H
/*
**	$VER: reaction.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Reaction definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef MAKE_ID
#define MAKE_ID(a,b,c,d) ((ULONG) (a)<<24 | (ULONG) (b)<<16 | (ULONG) (c)<<8 | (ULONG) (d))
#endif

/*****************************************************************************/

#ifndef REACTION_Dummy
#define REACTION_Dummy (TAG_USER + 0x5000000)
#endif

/* The Reaction tags below are used internally to layout and other
 * classes to make some magic happen. They are not intended for your
 * general usage.
 */

#define REACTION_TextAttr (REACTION_Dummy + 5)
 /* (struct TextAttr *) Class private tag set internally by layout
  * only. This tag sets a gadgets font, but does NOT override GA_TextAttr!
  */

#define REACTION_ChangePrefs (REACTION_Dummy + 6)
 /* (struct UIPrefs *) Signals classes of dynamic prefs change.
  */

#define REACTION_SpecialPens (REACTION_Dummy + 7)
 /* (strut SpecialPens *) Pens used for Xen-style shadowing, etc.
  */

/*****************************************************************************/

#ifdef ALL_REACTION_CLASSES

#include <proto/layout.h>
#include <gadgets/layout.h>

#include <proto/button.h>
#include <gadgets/button.h>

#include <proto/checkbox.h>
#include <gadgets/checkbox.h>

#include <proto/chooser.h>
#include <gadgets/chooser.h>

#include <proto/clicktab.h>
#include <gadgets/clicktab.h>

#include <proto/fuelgauge.h>
#include <gadgets/fuelgauge.h>

#include <proto/getfile.h>
#include <gadgets/getfile.h>

#include <proto/getfont.h>
#include <gadgets/getfont.h>

#include <proto/getscreenmode.h>
#include <gadgets/getscreenmode.h>

#include <proto/integer.h>
#include <gadgets/integer.h>

#include <proto/listbrowser.h>
#include <gadgets/listbrowser.h>

#include <proto/palette.h>
#include <gadgets/palette.h>

#include <proto/radiobutton.h>
#include <gadgets/radiobutton.h>

#include <proto/scroller.h>
#include <gadgets/scroller.h>

#include <proto/slider.h>
#include <gadgets/slider.h>

#include <proto/space.h>
#include <gadgets/space.h>

#include <proto/speedbar.h>
#include <gadgets/speedbar.h>

#include <proto/string.h>
#include <gadgets/string.h>

#include <proto/bevel.h>
#include <images/bevel.h>

#include <proto/bitmap.h>
#include <images/bitmap.h>

#include <proto/drawlist.h>
#include <images/drawlist.h>

#include <proto/glyph.h>
#include <images/glyph.h>

#include <proto/label.h>
#include <images/label.h>

#include <proto/penmap.h>
#include <images/penmap.h>

#include <proto/window.h>
#include <classes/window.h>

#include <classes/requester.h>
#include <proto/requester.h>

#include <proto/arexx.h>
#include <classes/arexx.h>

#endif /* ALL_REACTION_CLASSES */

/*****************************************************************************/

#ifdef ALL_REACTION_MACROS
#ifndef REACTION_MACROS_H
#include <reaction/reaction_macros.h>
#endif /* REACTION_MACROS_H */
#endif /* ALL_REACTION_MACROS */

/*****************************************************************************/

#endif /* REACTION_REACTION_H */
