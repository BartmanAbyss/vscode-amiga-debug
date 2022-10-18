	IFND	GRAPHICS_CLIP_I
GRAPHICS_CLIP_I	SET	1
**
**	$VER: clip.i 39.0 (2.12.1991)
**	Includes Release 45.1
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include 'exec/types.i'
    ENDC

    IFND    GRAPHICS_GFX_I
    include "graphics/gfx.i"
    ENDC

    IFND    EXEC_SEMAPHORES_I
    include "exec/semaphores.i"
    ENDC

NEWLOCKS	equ	1

 STRUCTURE  Layer,0
    LONG    lr_front
    LONG    lr_back
    LONG    lr_ClipRect
    LONG    lr_rp
    WORD    lr_MinX
    WORD    lr_MinY
    WORD    lr_MaxX
    WORD    lr_MaxY
	STRUCT	lr_reserved,4
	WORD	lr_priority
    WORD    lr_Flags
    LONG    lr_SuperBitMap
    LONG    lr_SuperClipRect
    APTR    lr_Window
    WORD    lr_Scroll_X
    WORD    lr_Scroll_Y
    APTR    lr_cr
    APTR    lr_cr2
    APTR    lr_crnew
    APTR    lr_SuperSaverClipRects
    APTR    lr__cliprects
    APTR    lr_LayerInfo
*			just by lucky coincidence
*			this is not confused with simplesprites
	STRUCT	lr_Lock,SS_SIZE
	APTR	lr_BackFill
	ULONG	lr_reserved1
	APTR	lr_ClipRegion
	APTR	lr_saveClipRects
	STRUCT	lr_reserved2,22
    APTR    lr_DamageList
    LABEL   lr_SIZEOF

 STRUCTURE  ClipRect,0
    LONG    cr_Next		* Point to next cliprect
    LONG    cr_prev		* Layers private use!!!
    LONG    cr_lobs		* Layers private use!!!
    LONG    cr_BitMap		* Bitmap for this cliprect (system private!!!)
    WORD    cr_MinX		* Bounds of the cliprect
    WORD    cr_MinY		*    "
    WORD    cr_MaxX		*    "
    WORD    cr_MaxY		*    "
    APTR    cr__p1		* Layers private use!!!
    APTR    cr__p2		* Layers private use!!!
    LONG    cr_reserved		* Layers private use!!!
    LONG    cr_Flags		* Layers private use!!!
 LABEL      cr_SIZEOF

* internal cliprect flags
CR_NEEDS_NO_CONCEALED_RASTERS   equ     1
CR_NEEDS_NO_LAYERBLIT_DAMAGE 	equ	2

* defines for clipping
ISLESSX equ 1
ISLESSY equ 2
ISGRTRX equ 4
ISGRTRY equ 8

* for ancient history reasons
        IFND    lr_Front
lr_Front        equ lr_front
lr_Back         equ lr_back
lr_RastPort     equ lr_rp
cr_Prev         equ cr_prev
cr_LObs         equ cr_lobs
        ENDC

	ENDC	; GRAPHICS_CLIP_I
