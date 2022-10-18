    IFND    GRAPHICS_GFXBASE_I
GRAPHICS_GFXBASE_I  SET 1
**
**	$VER: gfxbase.i 39.33 (21.4.1993)
**	Includes Release 45.1
**
**	graphics base definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_LISTS_I
    include 'exec/lists.i'
    ENDC
    IFND    EXEC_LIBRARIES_I
    include 'exec/libraries.i'
    ENDC
    IFND    EXEC_INTERRUPTS_I
    include 'exec/interrupts.i'
    ENDC
    IFND    GRAPHICS_MONITOR_I
    include 'graphics/monitor.i'
    ENDC

 STRUCTURE  GfxBase,LIB_SIZE
	APTR	gb_ActiView		; struct *View
	APTR	gb_copinit		; struct *copinit; ptr to copper start up list
	APTR	gb_cia			; for 6526 resource use
	APTR	gb_blitter		; for blitter resource use
	APTR	gb_LOFlist		; current copper list being run
	APTR	gb_SHFlist		; current copper list being run
	APTR	gb_blthd		; struct *bltnode
	APTR	gb_blttl
	APTR	gb_bsblthd
	APTR	gb_bsblttl
	STRUCT	gb_vbsrv,IS_SIZE
	STRUCT	gb_timsrv,IS_SIZE
	STRUCT	gb_bltsrv,IS_SIZE
	STRUCT	gb_TextFonts,LH_SIZE
	APTR	gb_DefaultFont
	UWORD	gb_Modes		; copy of bltcon0
	BYTE	gb_VBlank
	BYTE	gb_Debug
	UWORD	gb_BeamSync
	WORD	gb_system_bplcon0
	BYTE	gb_SpriteReserved
	BYTE	gb_bytereserved

	WORD	gb_Flags
	WORD	gb_BlitLock
	WORD	gb_BlitNest
	STRUCT	gb_BlitWaitQ,LH_SIZE
	APTR	gb_BlitOwner
	STRUCT	gb_TOF_WaitQ,LH_SIZE

	WORD	gb_DisplayFlags
	APTR	gb_SimpleSprites
	WORD	gb_MaxDisplayRow
	WORD	gb_MaxDisplayColumn
	WORD	gb_NormalDisplayRows
	WORD	gb_NormalDisplayColumns
	WORD	gb_NormalDPMX
	WORD	gb_NormalDPMY

	APTR	gb_LastChanceMemory
	APTR	gb_LCMptr

	WORD	gb_MicrosPerLine	; usecs per line times 256
	WORD	gb_MinDisplayColumn

	UBYTE	gb_ChipRevBits0		; agnus/denise new features
	UBYTE	gb_MemType
	STRUCT	gb_crb_reserved,4

	STRUCT	gb_monitor_id,2		; normally null
	STRUCT	gb_hedley,4*8
	STRUCT	gb_hedley_sprites,4*8
	STRUCT	gb_hedley_sprites1,4*8
	WORD	gb_hedley_count
	WORD	gb_hedley_flags
	WORD	gb_hedley_tmp
	APTR	gb_hash_table
	UWORD	gb_current_tot_rows
	UWORD	gb_current_tot_cclks
	UBYTE	gb_hedley_hint
	UBYTE	gb_hedley_hint2
	STRUCT	gb_nreserved,4*4
	APTR	gb_a2024_sync_raster
	UWORD	gb_control_delta_pal
	UWORD	gb_control_delta_ntsc
	APTR	gb_current_monitor
	STRUCT	gb_MonitorList,LH_SIZE
	APTR	gb_default_monitor
	APTR	gb_MonitorListSemaphore
	APTR	gb_DisplayInfoDataBase
	UWORD	gb_TopLine
	APTR	gb_ActiViewCprSemaphore
	APTR	gb_UtilBase
	APTR	gb_ExecBase
	APTR	gb_bwshifts
	APTR	gb_StrtFetchMasks
	APTR	gb_StopFetchMasks
	APTR	gb_Overrun
	APTR	gb_RealStops
	WORD	gb_SpriteWidth
	WORD	gb_SpriteFMode
	BYTE	gb_SoftSprites
	BYTE	gb_arraywidth					; need 2 more bytes to be lword aligned
	WORD	gb_DefaultSpriteWidth			; what sprite width intuiton wants.
	BYTE	gb_SprMoveDisable
	BYTE	gb_WantChips
	UBYTE	gb_BoardMemType
	UBYTE	gb_Bugs
	ULONG	gb_LayersBase
	ULONG	gb_ColorMask
	APTR	gb_IVector
	APTR	gb_IData
	ULONG	gb_SpecialCounter
	APTR	gb_DBList
	UWORD	gb_MonitorFlags
	BYTE	gb_ScanDoubledSprites
	BYTE	gb_BP3Bits
	STRUCT	gb_MonitorVBlank,asi_SIZEOF
	APTR	gb_natural_monitor
	APTR	gb_ProgData
	BYTE	gb_ExtSprites
	UBYTE	gb_pad3
	WORD	gb_GfxFlags
	ULONG	gb_VBCounter
	APTR	gb_HashTableSemaphore
	STRUCT		gb_HWEmul,9*4
	LABEL	gb_SIZE

gb_ChunkyToPlanarPtr	equ	gb_HWEmul

* bits for dalestuff, which may go away when blitter becomes a resource
OWNBLITTERn equ 0   * blitter owned bit
QBOWNERn    equ 1   * blitter owned by blit queuer
BLITMSG_FAULTn	equ 2

BLITMSG_FAULT	equ 1<<BLITMSG_FAULTn
QBOWNER		equ 1<<QBOWNERn

	BITDEF	GBFLAGS,TIMER,6
	BITDEF	GBFLAGS,LASTBLIT,7

* flag bits for ChipRevBits
	BITDEF	GFX,BIG_BLITS,0
	BITDEF	GFX,HR_AGNUS,0
	BITDEF	GFX,HR_DENISE,1
	BITDEF	GFX,AA_ALICE,2
	BITDEF	GFX,AA_LISA,3
	BITDEF	GFX,AA_MLISA,4		; internal use only

* For SetChipRev()
SETCHIPREV_A	equ	GFXF_HR_AGNUS
SETCHIPREV_ECS	equ	(GFXF_HR_AGNUS!GFXF_HR_DENISE)
SETCHIPREV_AA	equ	(GFXF_AA_ALICE!GFXF_AA_LISA!SETCHIPREV_ECS)
SETCHIPREV_BEST	equ	$ffffffff

* memory type
BUS_16		equ	0
NML_CAS		equ	0
BUS_32		equ	1
DBL_CAS		equ	2
BANDWIDTH_1X	equ	(BUS_16!NML_CAS)
BANDWIDTH_2XNML	equ	BUS_32
BANDWIDTH_2XDBL	equ	DBL_CAS
BANDWIDTH_4X	equ	(BUS_32!DBL_CAS)


* flag bits for DisplayFlags

NTSCn		equ 0
NTSC		equ 1<<NTSCn

GENLOCn		equ 1
GENLOC		equ 1<<GENLOCn

PALn		equ 2
PAL		equ 1<<PALn


TODA_SAFEn	equ 3
TODA_SAFE	equ 1<<TODA_SAFEn

REALLY_PALn	equ	4
; what is actual crystal frequency (as opposed to what bootmenu set the agnus to)?
REALLY_PAL	equ	1<<REALLY_PALn

LPEN_SWAP_FRAMESn	equ	5
LPEN_SWAP_FRAMES	equ	1<<LPEN_SWAP_FRAMESn

* handy name macro

GRAPHICSNAME	MACRO
		DC.B  'graphics.library',0
		ENDM

    ENDC	; GRAPHICS_GFXBASE_I
