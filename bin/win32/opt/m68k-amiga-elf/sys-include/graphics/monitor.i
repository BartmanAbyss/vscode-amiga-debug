    IFND    GRAPHICS_MONITOR_I
GRAPHICS_MONITOR_I SET 1
**
**	$VER: monitor.i 39.3 (8.6.1992)
**	Includes Release 45.1
**
**	graphics monitorspec definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include 'exec/types.i'
    ENDC

    IFND    GRAPHICS_GFX_I
    include 'graphics/gfx.i'
    ENDC

    IFND    GRAPHICS_GFXNODES_I
    include 'graphics/gfxnodes.i'
    ENDC

    IFND    GRAPHICS_VIEW_I
    include 'graphics/view.i'
    ENDC

    IFND    EXEC_SEMAPHORES_I
    include 'exec/semaphores.i'
    ENDC

    STRUCTURE	AnalogSignalInterval,0
    UWORD	asi_Start
    UWORD	asi_Stop
    LABEL	asi_SIZEOF

    STRUCTURE	SpecialMonitor,XLN_SIZE
    UWORD	spm_Flags
    APTR	spm_do_monitor
    APTR	spm_reserved1
    APTR	spm_reserved2
    APTR	spm_reserved3
    STRUCT	spm_hblank,asi_SIZEOF
    STRUCT	spm_vblank,asi_SIZEOF
    STRUCT	spm_hsync,asi_SIZEOF
    STRUCT	spm_vsync,asi_SIZEOF
    LABEL	spm_SIZEOF

    STRUCTURE	MonitorSpec,XLN_SIZE
    UWORD	ms_Flags
    LONG	ms_ratioh
    LONG	ms_ratiov
    UWORD	ms_total_rows
    UWORD	ms_total_colorclocks
    UWORD	ms_DeniseMaxDisplayColumn
    UWORD	ms_BeamCon0
    UWORD	ms_min_row
    APTR	ms_Special
    UWORD	ms_OpenCount
    APTR	ms_transform
    APTR	ms_translate
    APTR	ms_scale
    UWORD	ms_xoffset
    UWORD	ms_yoffset
    STRUCT	ms_LegalView,ra_SIZEOF
    APTR	ms_maxoscan
    APTR	ms_videoscan
    UWORD	ms_DeniseMinDisplayColumn
    ULONG	ms_DisplayCompatible
    STRUCT	ms_DisplayInfoDataBase,LH_SIZE
    STRUCT	ms_DIDBSemaphore,SS_SIZE
    ULONG	ms_MrgCop
    ULONG	ms_LoadView
    ULONG	ms_KillView
    LABEL	ms_SIZEOF


    BITDEF	MS,REQUEST_NTSC,0
    BITDEF	MS,REQUEST_PAL,1
    BITDEF	MS,REQUEST_SPECIAL,2
    BITDEF	MS,REQUEST_A2024,3
    BITDEF	MS,DOUBLE_SPRITES,4

STANDARD_VIEW_X	equ $81
STANDARD_VIEW_Y	equ $2C

    ENDC	; GRAPHICS_MONITOR_I
