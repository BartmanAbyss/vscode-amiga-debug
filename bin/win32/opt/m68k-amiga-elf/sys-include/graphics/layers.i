	IFND	GRAPHICS_LAYERS_I
GRAPHICS_LAYERS_I	SET	1
**
**	$VER: layers.i 39.4 (14.4.1992)
**	Includes Release 45.1
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_SEMAPHORES_I
       include "exec/semaphores.i"
    ENDC

    IFND  EXEC_LISTS_I
       include	"exec/lists.i"
    ENDC

* these should be clip.i/h but you know backwards compatibility etc.
LAYERSIMPLE		equ   1
LAYERSMART		equ   2
LAYERSUPER		equ   4
LAYERUPDATING		equ   $10
LAYERBACKDROP		equ   $40
LAYERREFRESH		equ   $80
LAYERIREFRESH		equ   $200
LAYERIREFRESH2		equ   $400

LAYER_CLIPRECTS_LOST	equ   $100

 STRUCTURE	Layer_Info,0
	APTR	li_top_layer
	APTR	li_check_lp			;* !! Private !! *
	APTR	li_obs
	APTR	li_FreeClipRects		;* !! Private !! *
	LONG	li_PrivateReserve1		;* !! Private !! *
	LONG	li_PrivateReserve2		;* !! Private !! *
	STRUCT	li_Lock,SS_SIZE			;* !! Private !! *
	STRUCT	li_gs_Head,MLH_SIZE		;* !! Private !! *
	WORD	li_PrivateReserve3		;* !! Private !! *
	APTR	li_PrivateReserve4		;* !! Private !! *
	WORD	li_Flags
	BYTE	li_fatten_count			;* !! Private !! *
	BYTE	li_LockLayersCount		;* !! Private !! *
	WORD	li_PrivateReserve5		;* !! Private !! *
	APTR	li_BlankHook			;* !! Private !! *
	APTR	li_LayerInfo_extra		;* !! Private !! *
	LABEL	li_SIZEOF

NEWLAYERINFO_CALLED	equ 1
ALERTLAYERSNOMEM	equ $83010000

*
* LAYERS_NOBACKFILL is the value needed to get no backfill hook
* LAYERS_BACKFILL is the value needed to get the default backfill hook
*
LAYERS_NOBACKFILL	equ	1
LAYERS_BACKFILL		equ	0

	ENDC	; GRAPHICS_LAYERS_I
