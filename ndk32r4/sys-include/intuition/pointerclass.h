#ifndef INTUITION_POINTERCLASS_H
#define INTUITION_POINTERCLASS_H
/*
**	$VER: pointerclass.h 47.1 (1.8.2019)
**
**	'boopsi' pointer class interface
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/* The following tags are recognized at NewObject() time by
 * pointerclass:
 *
 * POINTERA_BitMap (struct BitMap *) - Pointer to bitmap to
 *	get pointer imagery from.  Bitplane data need not be
 *	in chip RAM.
 * POINTERA_XOffset (LONG) - X-offset of the pointer hotspot.
 * POINTERA_YOffset (LONG) - Y-offset of the pointer hotspot.
 * POINTERA_WordWidth (ULONG) - designed width of the pointer in words
 * POINTERA_XResolution (ULONG) - one of the POINTERXRESN_ flags below
 * POINTERA_YResolution (ULONG) - one of the POINTERYRESN_ flags below
 *
 */

#define POINTERA_Dummy	(TAG_USER + 0x39000)

#define POINTERA_BitMap		(POINTERA_Dummy + 0x01)
#define POINTERA_XOffset	(POINTERA_Dummy + 0x02)
#define POINTERA_YOffset	(POINTERA_Dummy + 0x03)
#define POINTERA_WordWidth	(POINTERA_Dummy + 0x04)
#define POINTERA_XResolution	(POINTERA_Dummy + 0x05)
#define POINTERA_YResolution	(POINTERA_Dummy + 0x06)

/* These are the choices for the POINTERA_XResolution attribute which
 * will determine what resolution pixels are used for this pointer.
 *
 * POINTERXRESN_DEFAULT (ECS-compatible pointer width)
 *	= 70 ns if SUPERHIRES-type mode, 140 ns if not
 *
 * POINTERXRESN_SCREENRES
 *	= Same as pixel speed of screen
 *
 * POINTERXRESN_LORES (pointer always in lores-like pixels)
 *	= 140 ns in 15kHz modes, 70 ns in 31kHz modes
 *
 * POINTERXRESN_HIRES (pointer always in hires-like pixels)
 *	= 70 ns in 15kHz modes, 35 ns in 31kHz modes
 *
 * POINTERXRESN_140NS (pointer always in 140 ns pixels)
 *	= 140 ns always
 *
 * POINTERXRESN_70NS (pointer always in 70 ns pixels)
 *	= 70 ns always
 *
 * POINTERXRESN_35NS (pointer always in 35 ns pixels)
 *	= 35 ns always
 */

#define POINTERXRESN_DEFAULT	0
#define POINTERXRESN_140NS	1
#define POINTERXRESN_70NS	2
#define POINTERXRESN_35NS	3

#define POINTERXRESN_SCREENRES	4
#define POINTERXRESN_LORES	5
#define POINTERXRESN_HIRES	6

/* These are the choices for the POINTERA_YResolution attribute which
 * will determine what vertical resolution is used for this pointer.
 *
 * POINTERYRESN_DEFAULT
 *	= In 15 kHz modes, the pointer resolution will be the same
 *	  as a non-interlaced screen.  In 31 kHz modes, the pointer
 *	  will be doubled vertically.  This means there will be about
 *	  200-256 pointer lines per screen.
 *
 * POINTERYRESN_HIGH
 * POINTERYRESN_HIGHASPECT
 *	= Where the hardware/software supports it, the pointer resolution
 *	  will be high.  This means there will be about 400-480 pointer
 *	  lines per screen.  POINTERYRESN_HIGHASPECT also means that
 *	  when the pointer comes out double-height due to hardware/software
 *	  restrictions, its width would be doubled as well, if possible
 *	  (to preserve aspect).
 *
 * POINTERYRESN_SCREENRES
 * POINTERYRESN_SCREENRESASPECT
 *	= Will attempt to match the vertical resolution of the pointer
 *	  to the screen's vertical resolution.	POINTERYRESN_SCREENASPECT also
 *	  means that when the pointer comes out double-height due to
 *	  hardware/software restrictions, its width would be doubled as well,
 *	  if possible (to preserve aspect).
 *
 */

#define POINTERYRESN_DEFAULT		0
#define POINTERYRESN_HIGH		2
#define POINTERYRESN_HIGHASPECT		3
#define POINTERYRESN_SCREENRES		4
#define POINTERYRESN_SCREENRESASPECT	5

/* Compatibility note:
 *
 * The AA chipset supports variable sprite width and resolution, but
 * the setting of width and resolution is global for all sprites.
 * When no other sprites are in use, Intuition controls the sprite
 * width and sprite resolution for correctness based on pointerclass
 * attributes specified by the creator of the pointer.	Intuition
 * controls sprite resolution with the VTAG_DEFSPRITERESN_SET tag
 * to VideoControl().  Applications can override this on a per-viewport
 * basis with the VTAG_SPRITERESN_SET tag to VideoControl().
 *
 * If an application uses a sprite other than the pointer sprite,
 * Intuition will automatically regenerate the pointer sprite's image in
 * a compatible width.	This might involve BitMap scaling of the imagery
 * you supply.
 *
 * If any sprites other than the pointer sprite were obtained with the
 * old GetSprite() call, Intuition assumes that the owner of those
 * sprites is unaware of sprite resolution, hence Intuition will set the
 * default sprite resolution (VTAG_DEFSPRITERESN_SET) to ECS-compatible,
 * instead of as requested by the various pointerclass attributes.
 *
 * No resolution fallback occurs when applications use ExtSprites.
 * Such applications are expected to use VTAG_SPRITERESN_SET tag if
 * necessary.
 *
 * NB:	Under release V39, only sprite width compatibility is implemented.
 * Sprite resolution compatibility was added for V40.
 */
/* Pointer type definitions for GA_PointerType, WA_PointerType (OpenWindowTags() and
 * SetWindowPointer()) (V53.37)
 */
#define POINTERTYPE_NORMAL                   0
/* the well known normal pointer */

#define POINTERTYPE_BUSY                     1
/* the well known busy pointer */

#define POINTERTYPE_ALIAS                    2
/* use when dragging an item with the intent of creating a reference
 * to or virtual copy of it */

#define POINTERTYPE_CELL                     3
/* use to indicate that the pointer is hovering on top of a table
 * cell */

#define POINTERTYPE_COLUMNRESIZE             4
/* use to indicate that a column can be resized or is being resized */

#define POINTERTYPE_CONTEXTMENU              5
/* use to indicate that a menu or context menu can be opened at the
 * current location */

#define POINTERTYPE_COPY                     6
/* use to indicate that something is in a copy buffer or that a
 * drag&drop operation will result in a copy the the dragged item */

#define POINTERTYPE_CROSS                    7
/* use to indicate a precise selection, i.e. a precise area is being
 * selected or while drawing pixels in a paint program */

#define POINTERTYPE_DRAGANDDROP              8
/* use to indicate that an item is currently being dragged around */

#define POINTERTYPE_EASTRESIZE               9
/* use to indicate that the item can be resized on its right border,
 * i.e. a resize indication at the right border of a window */

#define POINTERTYPE_EASTWESTRESIZE           10
/* use to indicate that the selected item is currently being resized
 * either from its left or right border, i.e. the current window is
 * being resized in its left border */

#define POINTERTYPE_HAND                     11
/* use to indicate that the current item is drag&droppable or
 * moveable */

#define POINTERTYPE_HELP                     12
/* use to indicate that there is help available for the item the
 * pointer is hovering over */

#define POINTERTYPE_LINK                     13
/* use to indicate that the current context will be replaced, i.e. the
 * pointer is hovering over a hyperlink or a window tab */

#define POINTERTYPE_MENU                     14
/* use to indicate that a menu or context menu is active */

#define POINTERTYPE_NODROP                   15
/* use to indicate that a dragged item cannot be dropped at the current
 * location */

#define POINTERTYPE_NONE                     16
/* use to indicate that the pointer is deactivated */

#define POINTERTYPE_NORTHEASTRESIZE          17
/* use to indicate that the item can be resized on its top left corner,
 * i.e. a resize indication at the top left corner of a window */

#define POINTERTYPE_NORTHEASTSOUTHWESTRESIZE 18
/* use to indicate that the selected item is currently being resized
 * either from its top right or bottom left corner, i.e. the current
 * window is being resized in its top right corner */

#define POINTERTYPE_NORTHRESIZE              19
/* use to indicate that the item can be resized on its top border, i.e.
 * a resize indication at the top border of a window */

#define POINTERTYPE_NORTHSOUTHRESIZE         20
/* use to indicate that the selected item is currently being resized
 * from either its top or bottom border, i.e. the current window is
 * being resized in its bottom border */

#define POINTERTYPE_NORTHWESTRESIZE          21
/* use to indicate that the selected item is currently being resized
 * from its top left corner, i.e. the current window is being resized
 * in its top left corner */

#define POINTERTYPE_NORTHWESTSOUTHEASTRESIZE 22
/* use to indicate that the selected item is currently being resized
 * either from its top left or bottom right corner, i.e. the current
 * window is being resized in its top left corner */

#define POINTERTYPE_NOTALLOWED               23
/* use to indicate that the current operation is not allowed, i.e. the
 * pointer is hovering over a disabled button */

#define POINTERTYPE_PROGRESS                 24
/* use to indicate that the application is doing some background work
 * but still accepts user input, i.e. a web page is currently loading
 * in a browser application */

#define POINTERTYPE_ROWRESIZE                25
/* use to indicate that a row can be resized or is being resized */

#define POINTERTYPE_SCROLLALL                26
/* use to indicate that the item can be or is being moved, i.e. a
 * window is being moved while a hotkey for window move is pressed */

#define POINTERTYPE_SOUTHEASTRESIZE          27
/* use to indicate that the selected item is currently being resized
 * from its bottom right corner, i.e. the current window is being
 * resized in its bottom right corner */

#define POINTERTYPE_SOUTHRESIZE              28
/* use to indicate that the item can be resized on its bottom border,
 * i.e. a resize indication at the bottom border of a window */

#define POINTERTYPE_SOUTHWESTRESIZE          29
/* use to indicate that the selected item is currently being resized
 * from its bottom left corner, i.e. the current window is being
 * resized in its bottom left corner */

#define POINTERTYPE_TEXT                     30
/* use to indicate that horizontal text can be selected at the current
 * position */

#define POINTERTYPE_VERTICALTEXT             31
/* use to indicate that vertical text can be selected at the current
 * position */

#define POINTERTYPE_WESTRESIZE               32
/* use to indicate that the item can be resized on its left border,
 * i.e. a resize indication at the left border of a window */

#define POINTERTYPE_ZOOMIN                   33
/* use to indicate that a left click on the current item will result
 * in a zoom in */

#define POINTERTYPE_ZOOMOUT                  34
/* use to indicate that a left click on the current item will result
 * in a zoom out */

#define POINTERTYPE_PEN                      35
/* use to indicate a drawing action (V54.21) */

#define POINTERTYPE_ROTATE                   36
/* use to indicate something can be rotated at the current position
 * (V54.21) */

#define POINTERTYPE_RUBBER                   37
/* use to indicate an erasing action (V54.21) */

#define POINTERTYPE_SELECT                   38
/* use to indicate that something can be marked for selection at the
 * current position (V54.21) */

#define POINTERTYPE_SMUDGE                   39
/* use to indicate that something can be smudged/smeared at the
 * current position (V54.21) */

#define POINTERTYPE_COUNT                    40
/* just a counter for the number of available standard pointers */

#endif
