#ifndef GRAPHICS_VIEW_H
#define GRAPHICS_VIEW_H
/*
**	$VER: view.h 39.34 (31.5.1993)
**	Includes Release 45.1
**
**	graphics view/viewport definintions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#define ECS_SPECIFIC

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_SEMAPHORES_H
#include <exec/semaphores.h>
#endif

#ifndef GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif

#ifndef GRAPHICS_COPPER_H
#include <graphics/copper.h>
#endif

#ifndef GRAPHICS_GFXNODES_H
#include <graphics/gfxnodes.h>
#endif

#ifndef GRAPHICS_MONITOR_H
#include <graphics/monitor.h>
#endif

#ifndef GRAPHICS_DISPLAYINFO_H
#include <graphics/displayinfo.h>
#endif

#ifndef HARDWARE_CUSTOM_H
#include <hardware/custom.h>
#endif

struct ViewPort
{
	struct	ViewPort *Next;
	struct	ColorMap *ColorMap;	/* table of colors for this viewport */
					/* if this is nil, MakeVPort assumes default values */
	struct	CopList  *DspIns;	/* used by MakeVPort() */
	struct	CopList  *SprIns;	/* used by sprite stuff */
	struct	CopList  *ClrIns;	/* used by sprite stuff */
	struct	UCopList *UCopIns;	/* User copper list */
	WORD	DWidth,DHeight;
	WORD	DxOffset,DyOffset;
	UWORD	Modes;
	UBYTE	SpritePriorities;
	UBYTE	ExtendedModes;
	struct	RasInfo *RasInfo;
};

struct View
{
	struct	ViewPort *ViewPort;
	struct	cprlist *LOFCprList;   /* used for interlaced and noninterlaced */
	struct	cprlist *SHFCprList;   /* only used during interlace */
	WORD	DyOffset,DxOffset;   /* for complete View positioning */
				   /* offsets are +- adjustments to standard #s */
	UWORD	Modes;		   /* such as INTERLACE, GENLOC */
};

/* these structures are obtained via GfxNew */
/* and disposed by GfxFree */
struct ViewExtra
{
	struct ExtendedNode n;
	struct View *View;		/* backwards link */
	struct MonitorSpec *Monitor;	/* monitors for this view */
	UWORD TopLine;
};

/* this structure is obtained via GfxNew */
/* and disposed by GfxFree */
struct ViewPortExtra
{
	struct ExtendedNode n;
	struct ViewPort *ViewPort;	/* backwards link */
	struct Rectangle DisplayClip;	/* MakeVPort display clipping information */
	/* These are added for V39 */
	APTR   VecTable;		/* Private */
	APTR   DriverData[2];
	UWORD  Flags;
	Point  Origin[2];		/* First visible point relative to the DClip.
					 * One for each possible playfield.
					 */
	ULONG cop1ptr;			/* private */
	ULONG cop2ptr;			/* private */
};

/* All these VPXF_ flags are private */
#define VPXB_FREE_ME		0
#define VPXF_FREE_ME		(1 << VPXB_FREE_ME)
#define VPXB_LAST		1
#define VPXF_LAST		(1 << VPXB_LAST)
#define VPXB_STRADDLES_256	4
#define VPXF_STRADDLES_256	(1 << VPXB_STRADDLES_256)
#define VPXB_STRADDLES_512	5
#define VPXF_STRADDLES_512	(1 << VPXB_STRADDLES_512)


#define EXTEND_VSTRUCT	0x1000	/* unused bit in Modes field of View */

#define VPF_A2024	      0x40	/* VP?_ fields internal only */
#define VPF_TENHZ	      0x20
#define VPB_A2024	      6
#define VPB_TENHZ	      4

/* defines used for Modes in IVPargs */

#define GENLOCK_VIDEO	0x0002
#define LACE		0x0004
#define DOUBLESCAN	0x0008
#define SUPERHIRES	0x0020
#define PFBA		0x0040
#define EXTRA_HALFBRITE 0x0080
#define GENLOCK_AUDIO	0x0100
#define DUALPF		0x0400
#define HAM		0x0800
#define EXTENDED_MODE	0x1000
#define VP_HIDE	0x2000
#define SPRITES	0x4000
#define HIRES		0x8000

struct RasInfo	/* used by callers to and InitDspC() */
{
   struct   RasInfo *Next;	    /* used for dualpf */
   struct   BitMap *BitMap;
   WORD    RxOffset,RyOffset;	   /* scroll offsets in this BitMap */
};

struct ColorMap
{
	UBYTE	Flags;
	UBYTE	Type;
	UWORD	Count;
	APTR	ColorTable;
	struct	ViewPortExtra *cm_vpe;
	APTR	LowColorBits;
	UBYTE	TransparencyPlane;
	UBYTE	SpriteResolution;
	UBYTE	SpriteResDefault;	/* what resolution you get when you have set SPRITERESN_DEFAULT */
	UBYTE	AuxFlags;
	struct	ViewPort *cm_vp;
	APTR	NormalDisplayInfo;
	APTR	CoerceDisplayInfo;
	struct	TagItem *cm_batch_items;
	ULONG	VPModeID;
	struct	PaletteExtra *PalExtra;
	UWORD	SpriteBase_Even;
	UWORD	SpriteBase_Odd;
	UWORD	Bp_0_base;
	UWORD	Bp_1_base;

};

/* if Type == 0 then ColorMap is V1.2/V1.3 compatible */
/* if Type != 0 then ColorMap is V38	   compatible */
/* the system will never create other than V39 type colormaps when running V39 */

#define COLORMAP_TYPE_V1_2	0x00
#define COLORMAP_TYPE_V1_4	0x01
#define COLORMAP_TYPE_V36 COLORMAP_TYPE_V1_4	/* use this definition */
#define COLORMAP_TYPE_V39	0x02

/* Flags variable */
#define COLORMAP_TRANSPARENCY	0x01
#define COLORPLANE_TRANSPARENCY	0x02
#define BORDER_BLANKING		0x04
#define BORDER_NOTRANSPARENCY	0x08
#define VIDEOCONTROL_BATCH	0x10
#define USER_COPPER_CLIP	0x20
#define BORDERSPRITES	0x40

#define CMF_CMTRANS	0
#define CMF_CPTRANS	1
#define CMF_BRDRBLNK	2
#define CMF_BRDNTRAN	3
#define CMF_BRDRSPRT	6

#define SPRITERESN_ECS		0
/* ^140ns, except in 35ns viewport, where it is 70ns. */
#define SPRITERESN_140NS	1
#define SPRITERESN_70NS		2
#define SPRITERESN_35NS		3
#define SPRITERESN_DEFAULT	-1

/* AuxFlags : */
#define CMAB_FULLPALETTE 0
#define CMAF_FULLPALETTE (1<<CMAB_FULLPALETTE)
#define CMAB_NO_INTERMED_UPDATE 1
#define CMAF_NO_INTERMED_UPDATE (1<<CMAB_NO_INTERMED_UPDATE)
#define CMAB_NO_COLOR_LOAD 2
#define CMAF_NO_COLOR_LOAD (1 << CMAB_NO_COLOR_LOAD)
#define CMAB_DUALPF_DISABLE 3
#define CMAF_DUALPF_DISABLE (1 << CMAB_DUALPF_DISABLE)


struct PaletteExtra				/* structure may be extended so watch out! */
{
	struct SignalSemaphore pe_Semaphore;		/* shared semaphore for arbitration	*/
	UWORD	pe_FirstFree;				/* *private*				*/
	UWORD	pe_NFree;				/* number of free colors		*/
	UWORD	pe_FirstShared;				/* *private*				*/
	UWORD	pe_NShared;				/* *private*				*/
	UBYTE	*pe_RefCnt;				/* *private*				*/
	UBYTE	*pe_AllocList;				/* *private*				*/
	struct ViewPort *pe_ViewPort;			/* back pointer to viewport		*/
	UWORD	pe_SharableColors;			/* the number of sharable colors.	*/
};

/* flags values for ObtainPen */

#define PENB_EXCLUSIVE 0
#define PENB_NO_SETCOLOR 1

#define PENF_EXCLUSIVE (1l<<PENB_EXCLUSIVE)
#define PENF_NO_SETCOLOR (1l<<PENB_NO_SETCOLOR)

/* obsolete names for PENF_xxx flags: */

#define PEN_EXCLUSIVE PENF_EXCLUSIVE
#define PEN_NO_SETCOLOR PENF_NO_SETCOLOR

/* precision values for ObtainBestPen : */

#define PRECISION_EXACT	-1
#define PRECISION_IMAGE	0
#define PRECISION_ICON	16
#define PRECISION_GUI	32


/* tags for ObtainBestPen: */
#define OBP_Precision 0x84000000
#define OBP_FailIfBad 0x84000001

/* From V39, MakeVPort() will return an error if there is not enough memory,
 * or the requested mode cannot be opened with the requested depth with the
 * given bitmap (for higher bandwidth alignments).
 */

#define MVP_OK		0	/* you want to see this one */
#define MVP_NO_MEM	1	/* insufficient memory for intermediate workspace */
#define MVP_NO_VPE	2	/* ViewPort does not have a ViewPortExtra, and
				 * insufficient memory to allocate a temporary one.
				 */
#define MVP_NO_DSPINS	3	/* insufficient memory for intermidiate copper
				 * instructions.
				 */
#define MVP_NO_DISPLAY	4	/* BitMap data is misaligned for this viewport's
				 * mode and depth - see AllocBitMap().
				 */
#define MVP_OFF_BOTTOM	5	/* PRIVATE - you will never see this. */

/* From V39, MrgCop() will return an error if there is not enough memory,
 * or for some reason MrgCop() did not need to make any copper lists.
 */

#define MCOP_OK		0	/* you want to see this one */
#define MCOP_NO_MEM	1	/* insufficient memory to allocate the system
				 * copper lists.
				 */
#define MCOP_NOP	2	/* MrgCop() did not merge any copper lists
				 * (eg, no ViewPorts in the list, or all marked as
				 * hidden).
				 */

struct DBufInfo {
	APTR	dbi_Link1;
	ULONG	dbi_Count1;
	struct Message dbi_SafeMessage;		/* replied to when safe to write to old bitmap */
	APTR dbi_UserData1;			/* first user data */

	APTR	dbi_Link2;
	ULONG	dbi_Count2;
	struct Message dbi_DispMessage;	/* replied to when new bitmap has been displayed at least
							once */
	APTR	dbi_UserData2;			/* second user data */
	ULONG	dbi_MatchLong;
	APTR	dbi_CopPtr1;
	APTR	dbi_CopPtr2;
	APTR	dbi_CopPtr3;
	UWORD	dbi_BeamPos1;
	UWORD	dbi_BeamPos2;
};

#endif	/* GRAPHICS_VIEW_H */
