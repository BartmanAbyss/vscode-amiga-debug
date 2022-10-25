#ifndef PREFS_WORKBENCH_H
#define PREFS_WORKBENCH_H
/*
**	$VER: workbench.h 45.1 (17.11.2000)
**	Includes Release 45.1
**
**	Workbench preferences file definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif

#ifndef GRAPHICS_GFX_H
#include <graphics/gfx.h>
#endif

/*****************************************************************************/

#define ID_WBNC MAKE_ID('W','B','N','C')

struct WorkbenchPrefs
{
    /* settings from workbench.library */
    ULONG		wbp_DefaultStackSize;	/* in bytes */
    ULONG		wbp_TypeRestartTime;	/* in seconds */
    /* settings from icon.library */
    ULONG		wbp_IconPrecision;	/* PRECISION_#? values */
    struct Rectangle	wbp_EmbossRect;
    BOOL		wbp_Borderless;
    LONG		wbp_MaxNameLength;
    BOOL		wbp_NewIconsSupport;
    BOOL		wbp_ColorIconSupport;
    /* new for V45 */
    ULONG		wbp_ImageMemType;
    BOOL		wbp_LockPens;
    BOOL		wbp_NoTitleBar;
    BOOL		wbp_NoGauge;
};

#define ID_WBHD MAKE_ID('W','B','H','D')

struct WorkbenchHiddenDevicePrefs
{
    UBYTE		whdp_Name[0];	/* C String including NULL char */
};

/*****************************************************************************/

#endif /* PREFS_WORKBENCH_H */
