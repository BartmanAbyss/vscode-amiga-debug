*
    IFND    GRAPHICS_VIEW_I
GRAPHICS_VIEW_I SET 1
**
**	$VER: view.i 39.32 (12.3.1993)
**	Includes Release 45.1
**
**	graphics view/viewport definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include "exec/types.i"
    ENDC

	IFND	EXEC_SEMAPHORES_I
	include	"exec/semaphores.i"
	ENDC

    IFND    GRAPHICS_GFX_I
    include "graphics/gfx.i"
    ENDC

    IFND    GRAPHICS_COPPER_I
    include "graphics/copper.i"
    ENDC

    IFND    GRAPHICS_GFXNODES_I
    include "graphics/gfxnodes.i"
	ENDC

    IFND    GRAPHICS_DISPLAYINFO_I
    include "graphics/displayinfo.i"
    ENDC

GENLOCK_VIDEO		EQU	$2
V_LACE			EQU	$4
V_DOUBLESCAN		EQU	$8
V_SUPERHIRES		EQU	$20
V_PFBA			EQU	$40
V_EXTRA_HALFBRITE	EQU	$80
GENLOCK_AUDIO		EQU	$100
V_DUALPF		EQU	$400
V_HAM			EQU	$800
V_EXTENDED_MODE	EQU	$1000
V_VP_HIDE		EQU	$2000
V_SPRITES		EQU	$4000
V_HIRES		EQU	$8000

EXTEND_VSTRUCT		EQU	$1000

	BITDEF	VP,A2024,6
	BITDEF	VP,TENHZ,4

   STRUCTURE   ColorMap,0
	UBYTE	cm_Flags
	UBYTE	cm_Type
	UWORD	cm_Count
	APTR	cm_ColorTable
	APTR	cm_vpe
	APTR	cm_LowColorBits
	UBYTE	cm_TransparencyPlane
	UBYTE	cm_SpriteResolution
	UBYTE	cm_SpriteResDefault
	UBYTE	cm_AuxFlags
	APTR	cm_vp
	APTR	cm_NormalDisplayInfo
	APTR	cm_CoerceDisplayInfo
	APTR	cm_batch_items
	ULONG	cm_VPModeID
	APTR	cm_PalExtra
	UWORD	cm_SpriteBase_Even
	UWORD	cm_SpriteBase_Odd
	UWORD	cm_Bp_0_base
	UWORD	cm_Bp_1_base
   LABEL cm_SIZEOF

; if Type == 0 then ColorMap is V1.2/V1.3 compatible
; if Type != 0 then ColorMap is V38	  compatible
; the system will never create other than V39 type colormaps when running V39

cm_TransparenyPlane	EQU	cm_TransparencyPlane	; early typo

COLORMAP_TYPE_V1_2	EQU	$00
COLORMAP_TYPE_V1_4	EQU	$01
COLORMAP_TYPE_V36 EQU COLORMAP_TYPE_V1_4	; use this definition
COLORMAP_TYPE_V39	EQU	$02

COLORMAP_TRANSPARENCY	EQU	$01
COLORPLANE_TRANSPARENCY EQU	$02
BORDER_BLANKING		EQU	$04
BORDER_NOTRANSPARENCY	EQU	$08
VIDEOCONTROL_BATCH	EQU	$10
USER_COPPER_CLIP	EQU	$20
BORDER_SPRITES		equ	$40

	BITDEF	CM,CMTRANS,0
	BITDEF	CM,CPTRANS,1
	BITDEF	CM,BRDRBLNK,2
	BITDEF	CM,BRDNTRAN,3
	BITDEF	CM,BRDRSPRT,6

SPRITERESN_ECS		equ	0	; 140ns, except in 35ns viewport, where it is 70ns.
SPRITERESN_140NS	equ	1
SPRITERESN_70NS		equ	2
SPRITERESN_35NS		equ	3
SPRITERESN_DEFAULT	equ	-1

; aux flags:
	BITDEF	CMA,FULLPALETTE,0
	BITDEF	CMA,NO_INTERMED_UPDATE,1
	BITDEF	CMA,NO_COLOR_LOAD,2
	BITDEF	CMA,DUALPF_DISABLE,3

   STRUCTURE	PaletteExtra,0			; structure may be extended so watch out!
	STRUCT	pe_Semaphore,SS_SIZE		; semaphore for access
	UWORD	pe_FirstFree			; *private*
	UWORD	pe_NFree			; number of free colors
	UWORD	pe_FirstShared			; *private*
	UWORD	pe_NShared			; *private*
	APTR	pe_RefCnt			; *private*
	APTR	pe_AllocList			; *private*
	APTR	pe_ViewPort			; viewport pointer
	UWORD	pe_SharableColors		; max number of sharable colors.
   LABEL pe_SIZEOF

; precision values for ObtainBestPen :

PRECISION_EXACT	equ	-1
PRECISION_IMAGE	equ	 0
PRECISION_ICON	equ	16
PRECISION_GUI	equ	32


; tags for ObtainBestPen:
OBP_Precision equ	$84000000
OBP_FailIfBad	equ	$84000001

; flags for ObtainPen:

PEN_EXCLUSIVE	equ	1
PEN_NO_SETCOLOR	equ	2

	BITDEF	PEN,EXCLUSIVE,0
	BITDEF	PEN,NO_SETCOLOR,1


   STRUCTURE	  ViewPort,0
   LONG    vp_Next
   LONG    vp_ColorMap
   LONG    vp_DspIns
   LONG    vp_SprIns
   LONG    vp_ClrIns
   LONG    vp_UCopIns
   WORD    vp_DWidth
   WORD    vp_DHeight
   WORD    vp_DxOffset
   WORD    vp_DyOffset
   WORD    vp_Modes
   BYTE    vp_SpritePriorities
   BYTE    vp_ExtendedModes
   APTR    vp_RasInfo
   LABEL   vp_SIZEOF


   STRUCTURE View,0
   LONG    v_ViewPort
   LONG    v_LOFCprList
   LONG    v_SHFCprList
   WORD    v_DyOffset
   WORD    v_DxOffset
   WORD    v_Modes
   LABEL   v_SIZEOF


   STRUCTURE ViewExtra,XLN_SIZE
   APTR    ve_View
   APTR    ve_Monitor
   WORD    ve_TopLine
   LABEL   ve_SIZEOF

   STRUCTURE ViewPortExtra,XLN_SIZE
   APTR    vpe_ViewPort
   STRUCT  vpe_DisplayClip,ra_SIZEOF
   APTR    vpe_VecTable
   STRUCT  vpe_DriverData,8
   UWORD   vpe_Flags
   STRUCT  vpe_Origin,(tpt_SIZEOF<<1)
   ULONG   vpe_cop1ptr
   ULONG   vpe_cop2ptr
   LABEL   vpe_SIZEOF

VPXB_FREE_ME		equ	0
VPXF_FREE_ME		equ	1
VPXB_VP_LAST		equ	1
VPXF_VP_LAST		equ	2
VPXB_STRADDLES_256	equ	4
VPXF_STRADDLES_256	equ	16
VPXB_STRADDLES_512	equ	5
VPXF_STRADDLES_512	equ	32

   STRUCTURE  collTable,0
   LONG    cp_collPtrs,16
   LABEL   cp_SIZEOF


   STRUCTURE  RasInfo,0
   APTR    ri_Next
   LONG    ri_BitMap
   WORD    ri_RxOffset
   WORD    ri_RyOffset
   LABEL   ri_SIZEOF


MVP_OK		equ	0
MVP_NO_MEM	equ	1
MVP_NO_VPE	equ	2
MVP_NO_DSPINS	equ	3
MVP_NO_DISPLAY	equ	4
MVP_OFF_BOTTOM	equ	5

MCOP_OK		equ	0
MCOP_NO_MEM	equ	1
MCOP_NOP	equ	2

	STRUCTURE DBufInfo,0
	APTR	dbi_Link1
	ULONG	dbi_Count1
	STRUCT	dbi_SafeMessage,MN_SIZE
	APTR	dbi_UserData1
	APTR	dbi_Link2
	ULONG	dbi_Count2
	STRUCT	dbi_DispMessage,MN_SIZE
	APTR	dbi_UserData2
	ULONG	dbi_MatchLong
	APTR	dbi_CopPtr1
	APTR	dbi_CopPtr2
	APTR	dbi_CopPtr3
	UWORD	dbi_BeamPos1
	UWORD	dbi_BeamPos2
	LABEL	dbi_SIZEOF

	ENDC	; GRAPHICS_VIEW_I
