    IFND    GRAPHICS_VIDEOCONTROL_I
GRAPHICS_VIDEOCONTROL_I SET 1
**
**	$VER: videocontrol.i 37.9 (31.5.1993)
**	Includes Release 45.1
**
**	graphics videocontrol definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include "exec/types.i"
    ENDC

    IFND    UTILITY_TAGITEM_I
    include "utility/tagitem.i"
    ENDC


VTAG_END_CM			equ	$00000000
VTAG_CHROMAKEY_CLR		equ	$80000000
VTAG_CHROMAKEY_SET		equ	$80000001
VTAG_BITPLANEKEY_CLR		equ	$80000002
VTAG_BITPLANEKEY_SET		equ	$80000003
VTAG_BORDERBLANK_CLR		equ	$80000004
VTAG_BORDERBLANK_SET		equ	$80000005
VTAG_BORDERNOTRANS_CLR		equ	$80000006
VTAG_BORDERNOTRANS_SET		equ	$80000007
VTAG_CHROMA_PEN_CLR		equ	$80000008
VTAG_CHROMA_PEN_SET		equ	$80000009
VTAG_CHROMA_PLANE_SET		equ	$8000000A
VTAG_ATTACH_CM_SET		equ	$8000000B
VTAG_NEXTBUF_CM			equ	$8000000C
VTAG_BATCH_CM_CLR		equ	$8000000D
VTAG_BATCH_CM_SET		equ	$8000000E
VTAG_NORMAL_DISP_GET		equ	$8000000F
VTAG_NORMAL_DISP_SET		equ	$80000010
VTAG_COERCE_DISP_GET		equ	$80000011
VTAG_COERCE_DISP_SET		equ	$80000012
VTAG_VIEWPORTEXTRA_GET		equ	$80000013
VTAG_VIEWPORTEXTRA_SET		equ	$80000014
VTAG_CHROMAKEY_GET		equ	$80000015
VTAG_BITPLANEKEY_GET		equ	$80000016
VTAG_BORDERBLANK_GET		equ	$80000017
VTAG_BORDERNOTRANS_GET		equ	$80000018
VTAG_CHROMA_PEN_GET		equ	$80000019
VTAG_CHROMA_PLANE_GET		equ	$8000001A
VTAG_ATTACH_CM_GET		equ	$8000001B
VTAG_BATCH_CM_GET		equ	$8000001C
VTAG_BATCH_ITEMS_GET		equ	$8000001D
VTAG_BATCH_ITEMS_SET		equ	$8000001E
VTAG_BATCH_ITEMS_ADD		equ	$8000001F
VTAG_VPMODEID_GET		equ	$80000020
VTAG_VPMODEID_SET		equ	$80000021
VTAG_VPMODEID_CLR		equ	$80000022
VTAG_USERCLIP_GET		equ	$80000023
VTAG_USERCLIP_SET		equ	$80000024
VTAG_USERCLIP_CLR		equ	$80000025
; the following tags are V39 specific. They will be ignored by earlier versions
VTAG_PF1_BASE_GET		equ	$80000026
VTAG_PF2_BASE_GET		equ	$80000027
VTAG_SPEVEN_BASE_GET		equ	$80000028
VTAG_SPODD_BASE_GET		equ	$80000029
VTAG_PF1_BASE_SET		equ	$8000002a
VTAG_PF2_BASE_SET		equ	$8000002b
VTAG_SPEVEN_BASE_SET		equ	$8000002c
VTAG_SPODD_BASE_SET		equ	$8000002d
VTAG_BORDERSPRITE_GET		equ	$8000002e
VTAG_BORDERSPRITE_SET		equ	$8000002f
VTAG_BORDERSPRITE_CLR		equ	$80000030
VTAG_SPRITERESN_SET		equ	$80000031
VTAG_SPRITERESN_GET		equ	$80000032
VTAG_PF1_TO_SPRITEPRI_SET	equ	$80000033
VTAG_PF1_TO_SPRITEPRI_GET	equ	$80000034
VTAG_PF2_TO_SPRITEPRI_SET	equ	$80000035
VTAG_PF2_TO_SPRITEPRI_GET	equ	$80000036
VTAG_IMMEDIATE			equ	$80000037
VTAG_FULLPALETTE_SET		equ	$80000038
VTAG_FULLPALETTE_GET		equ	$80000039
VTAG_FULLPALETTE_CLR		equ	$8000003A
VTAG_DEFSPRITERESN_SET		equ	$8000003B
VTAG_DEFSPRITERESN_GET		equ	$8000003C

; all the following tags follow the new, rational standard for videocontrol tags:
; VC_xxx,state		set the state of attribute 'xxx' to value 'state'
; VC_xxx_QUERY,&var	get the state of attribute 'xxx' and store it into the longword
;			pointed to by &var.
;
; The following are new for V40.

VC_IntermediateCLUpdate		equ	$80000080
; default=true. when set graphics will update the intermediate copper lists
; on color changes, etc. When false, it won't, and will be faster.
VC_IntermediateCLUpdate_Query	equ	$80000081

VC_NoColorPaletteLoad		equ	$80000082
; default = false. When set, graphics will only load color 0
; for this ViewPort, and so the ViewPort's colors will come
; from the previous ViewPort's.
;
; NB - Using this tag and VTAG_FULLPALETTE_SET together is undefined.
;
VC_NoColorPaletteLoad_Query	equ	$80000083

VC_DUALPF_Disable		equ	$80000084
; default = false. When this flag is set, the dual-pf bit
;   in Dual-Playfield screens will be turned off. Even bitplanes
;   will still come from the first BitMap and odd bitplanes
;   from the second BitMap, and both R[xy]Offsets will be
;   considered. This can be used (with appropriate palette
;   selection) for cross-fades between differently scrolling
;   images.
;   When this flag is turned on, colors will be loaded for
;   the viewport as if it were a single viewport of depth
;   depth1+depth2 */

VC_DUALPF_Disable_Query		equ	$80000085

    ENDC	; GRAPHICS_VIDEOCONTROL_I
