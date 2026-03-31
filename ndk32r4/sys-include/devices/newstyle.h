#ifndef	DEVICES_NEWSTYLE_H
#define DEVICES_NEWSTYLE_H
/*
**	$VER: newstyle.h 47.2 (29.9.2021)
**
**	Declarations for the NSD command interface.
**	For 64 bit extensions, see <devices/trackdisk.h>
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif


 #ifndef NSCMD_DEVICEQUERY

/* Simple additions that are missing from the global V40 "exec/io.h"
 * header file for support of the NewStyleDevice standard.
 * Both were introduced for V43.
 */

#define NSCMD_DEVICEQUERY	0x4000

/* The result */
struct NSDeviceQueryResult
{
	/* Standard information */
	ULONG	nsdqr_DevQueryFormat;		/* this is type 0 */
	ULONG	nsdqr_SizeAvailable;		/* bytes available */

	/* Common information (READ-ONLY!) */
	UWORD	nsdqr_DeviceType;			/* what the device does */
	UWORD	nsdqr_DeviceSubType;		/* depends on the main type */
	APTR	nsdqr_SupportedCommands;	/* 0 terminated list of cmds */

	/* May be extended in the future! Check SizeAvailable! */
};

/* For nsdqr_DeviceType */
#define NSDEVTYPE_UNKNOWN	0	/* No suitable category, anything */
#define NSDEVTYPE_GAMEPORT	1	/* like gameport.device */
#define NSDEVTYPE_TIMER		2	/* like timer.device */
#define NSDEVTYPE_KEYBOARD	3	/* like keyboard.device */
#define NSDEVTYPE_INPUT		4	/* like input.device */
#define NSDEVTYPE_TRACKDISK	5	/* like trackdisk.device */
#define NSDEVTYPE_CONSOLE	6	/* like console.device */
#define NSDEVTYPE_SANA2		7	/* A >=SANA2R2 networking device */
#define NSDEVTYPE_AUDIOARD	8	/* like audio.device */
#define NSDEVTYPE_CLIPBOARD	9	/* like clipboard.device */
#define NSDEVTYPE_PRINTER	10	/* like printer.device */
#define NSDEVTYPE_SERIAL	11	/* like serial.device */
#define NSDEVTYPE_PARALLEL	12	/* like parallel.device */

/*------------------------------------------------------------------------*/

  #ifndef NSCMD_TD_READ64

   /* Trackdisk specific new style device commands */
   #define NSCMD_TD_READ64		0xc000
   #define NSCMD_TD_WRITE64		0xc001
   #define NSCMD_TD_SEEK64		0xc002
   #define NSCMD_TD_FORMAT64	0xc003

   /* Alias to set the upper 32 bits for a 64 bit IOStdReq */
   #define io_HighOffset		io_Actual

  #endif /* NSCMD_TD_READ64 */

 #endif /* NSCMD_DEVICEQUERY */

#endif /* DEVICES_NEWSTYLE_H */
