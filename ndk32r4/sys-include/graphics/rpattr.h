#ifndef GRAPHICS_RPATTR_H
#define GRAPHICS_RPATTR_H
/*
**	$VER: rpattr.h 47.1 (31.7.2019)
**
**	tag definitions for GetRPAttr, SetRPAttr
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
**
*/

#define RPTAG_Font 		0x80000000		/* get/set font */
#define RPTAG_APen 		0x80000002		/* get/set apen */
#define RPTAG_BPen 		0x80000003		/* get/set bpen */
#define RPTAG_DrMd 		0x80000004		/* get/set draw mode */
#define RPTAG_OutLinePen 	0x80000005	/* get/set outline pen */
#define RPTAG_OutlinePen 	0x80000005	/* get/set outline pen. corrected case. */
#define RPTAG_WriteMask 	0x80000006	/* get/set WriteMask */
#define RPTAG_MaxPen 		0x80000007	/* get/set maxpen */

#define RPTAG_DrawBounds	0x80000008	/* get only rastport draw bounds. pass &rect */

#endif	/* GRAPHICS_RPATTR_H */
