	IFND	GRAPHICS_RASTPORT_I
GRAPHICS_RASTPORT_I	SET	1
**
**	$VER: rastport.i 39.0 (21.8.1991)
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

*------ TR : TmpRas --------------------------------------------------

 STRUCTURE  TmpRas,0
   APTR     tr_RasPtr	      ; *WORD
   LONG     tr_Size
   LABEL    tr_SIZEOF

*------ GelsInfo

   STRUCTURE   GelsInfo,0
   BYTE     gi_sprRsrvd       * flag of which sprites to reserve from
*			      * vsprite system
   BYTE     gi_Flags	      * reserved for system use
   APTR     gi_gelHead
   APTR     gi_gelTail	      * dummy vSprites for list management
* pointer to array of 8 WORDS for sprite available lines
   APTR     gi_nextLine
* pointer to array of 8 pointers for color-last-assigned to vSprites
   APTR     gi_lastColor
   APTR     gi_collHandler    * addresses of collision routines
   WORD    gi_leftmost
   WORD    gi_rightmost
   WORD    gi_topmost
   WORD    gi_bottommost
   APTR     gi_firstBlissObj
   APTR     gi_lastBlissObj   * system use only
   LABEL    gi_SIZEOF

*------ RP_Flags ------
   BITDEF   RP,FRST_DOT,0     ; draw the first dot of this line ?
   BITDEF   RP,ONE_DOT,1      ; use one dot mode for drawing lines
   BITDEF   RP,DBUFFER,2      ; flag set when RastPorts are double-buffered
*			      ;   (only used for bobs)
   BITDEF   RP,AREAOUTLINE,3  ; used by areafiller
   BITDEF   RP,NOCROSSFILL,5  ; used by areafiller

*------ RP_DrawMode ------
RP_JAM1        EQU 0
RP_JAM2        EQU 1
RP_COMPLEMENT  EQU 2
RP_INVERSVID   EQU 4	      ; inverse video for drawing modes

*------ RP_TxFlags ------
   BITDEF  RP,TXSCALE,0

 STRUCTURE  RastPort,0
   LONG     rp_Layer
   LONG     rp_BitMap
   LONG     rp_AreaPtrn
   LONG     rp_TmpRas
   LONG     rp_AreaInfo
   LONG     rp_GelsInfo
   BYTE     rp_Mask
   BYTE     rp_FgPen
   BYTE     rp_BgPen
   BYTE     rp_AOLPen
   BYTE     rp_DrawMode
   BYTE     rp_AreaPtSz
   BYTE     rp_linpatcnt
   BYTE     rp_Dummy
   WORD     rp_Flags
   WORD     rp_LinePtrn
   WORD     rp_cp_x
   WORD     rp_cp_y
   STRUCT   rp_minterms,8
   WORD     rp_PenWidth
   WORD     rp_PenHeight
   LONG     rp_Font
   BYTE     rp_AlgoStyle
   BYTE     rp_TxFlags
   WORD     rp_TxHeight
   WORD     rp_TxWidth
   WORD     rp_TxBaseline
   WORD     rp_TxSpacing
   APTR     rp_RP_User
   STRUCT   rp_longreserved,8
	ifnd	GFX_RASTPORT_1_2
   STRUCT   rp_wordreserved,14
   STRUCT   rp_reserved,8
	endc
   LABEL    rp_SIZEOF

 STRUCTURE  AreaInfo,0
   LONG     ai_VctrTbl
   LONG     ai_VctrPtr
   LONG     ai_FlagTbl
   LONG     ai_FlagPtr
   WORD     ai_Count
   WORD     ai_MaxCount
   WORD     ai_FirstX
   WORD     ai_FirstY
   LABEL    ai_SIZEOF

ONE_DOTn    equ     1
ONE_DOT     equ     $2	    * 1<<ONE_DOTn
FRST_DOTn   equ     0
FRST_DOT    equ     1	    * 1<<FRST_DOTn

	ENDC	; GRAPHICS_RASTPORT_I
