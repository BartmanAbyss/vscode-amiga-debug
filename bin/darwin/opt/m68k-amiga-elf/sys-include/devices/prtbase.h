#ifndef DEVICES_PRTBASE_H
#define DEVICES_PRTBASE_H
/*
**	$VER: prtbase.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	printer driver structure definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef  EXEC_DEVICES_H
#include <exec/devices.h>
#endif

#ifndef  DEVICES_PARALLEL_H
#include <devices/parallel.h>
#endif

#ifndef  DEVICES_SERIAL_H
#include <devices/serial.h>
#endif

#ifndef  DEVICES_TIMER_H
#include <devices/timer.h>
#endif

#ifndef  DOS_DOSEXTENS_H
#include <dos/dosextens.h>
#endif

#ifndef  INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

/****************************************************************************/

struct DeviceData
{
	struct Library	dd_Device;	/* standard library node */
	APTR		dd_Segment;	/* A0 when initialized */
	APTR		dd_ExecBase;	/* A6 for exec */
	APTR		dd_CmdVectors;	/* command table for device commands */
	APTR		dd_CmdBytes;	/* bytes describing which command queue */
	UWORD		dd_NumCommands;	/* the number of commands supported */
};

/****************************************************************************/

/* IO Flags */
#define IOB_QUEUED	4
#define IOB_CURRENT	5
#define IOB_SERVICING	6
#define IOB_DONE	7

#define IOF_QUEUED	(1L<<IOB_QUEUED)
#define IOF_CURRENT	(1L<<IOB_CURRENT)
#define IOF_SERVICING	(1L<<IOB_SERVICING)
#define IOF_DONE	(1L<<IOB_DONE)

/* pd_Flags */
#define PB_IOR0		0
#define PB_IOR1		1
#define PB_IOOPENED	2
#define PB_EXPUNGED	7

#define PBF_IOR0	(1L<<PB_IOR0)
#define PBF_IOR1	(1L<<PB_IOR1)
#define PBF_IOOPENDED	(1L<<PB_IOOPENED)
#define PBF_EXPUNGED	(1L<<PB_EXPUNGED)

/* du_Flags (actually placed in pd_Unit.mp_Node.ln_Pri) */
#define DUB_STOPPED	0

#define DUF_STOPPED	(1L<<DUB_STOPPED)

#define P_OLDSTKSIZE	0x0800	/* stack size for child task (OBSOLETE) */
#define P_STKSIZE	0x1000	/* stack size for child task */
#define P_BUFSIZE	256	/* size of internal buffers for text i/o */
#define P_SAFESIZE	128	/* safety margin for text output buffer */

/****************************************************************************/

/*
	"struct PrinterData" was a very bad concept in the old V1.0 days
	because it is both: the device and the unit.

	Starting with V44 PrinterData may be duplicated for many Units. But all
	new fields that are specific to the Unit  are now part of the new
	"struct PrinterUnit". Don't touch the private fields!

	A note on the function pointers in these data structure definitions:
	unless otherwise specified, all functions expect that their parameters
	are passed on the *stack* rather than in CPU registers. Every parameter
	must be passed a 32 bit long word, i.e. an "UWORD" will use the same
	stack space as an "ULONG".
*/

struct PrinterData
{
	struct DeviceData pd_Device;

	/* PRIVATE & OBSOLETE: the one and only unit */
	struct MsgPort pd_Unit;

	/* the printer specific segment */
	BPTR pd_PrinterSegment;

	/* the segment printer type */
	UWORD pd_PrinterType;

	/* the segment data structure */
	struct PrinterSegment * pd_SegmentData;

	/* the raster print buffer */
	UBYTE * pd_PrintBuf;

	/* the write function:
	 *
	 *	LONG PWrite(APTR data,
	 *	            LONG len);
	 */
	LONG (*pd_PWrite)();

	/* write function's done:
	 *
	 *	LONG PBothReady(VOID);
	 */
	LONG (*pd_PBothReady)();

	/* PRIVATE: port I/O request 0 */
	union {
		struct IOExtPar pd_p0;
		struct IOExtSer pd_s0;
	} pd_ior0;

	#define pd_PIOR0 pd_ior0.pd_p0
	#define pd_SIOR0 pd_ior0.pd_s0

	/* PRIVATE:  and 1 for double buffering */
	union {
		struct IOExtPar pd_p1;
		struct IOExtSer pd_s1;
	} pd_ior1;

	#define pd_PIOR1 pd_ior1.pd_p1
	#define pd_SIOR1 pd_ior1.pd_s1

	/* PRIVATE: timer I/O request */
	struct timerequest pd_TIOR;

	/* PRIVATE: and message reply port */
	struct MsgPort pd_IORPort;

	/* PRIVATE: write task */
	struct Task pd_TC;

	/* PRIVATE: and stack space (OBSOLETE) */
	UBYTE pd_OldStk[P_OLDSTKSIZE];

	/* PRIVATE: device flags */
	UBYTE pd_Flags;

	/* PRIVATE: padding */
	UBYTE pd_pad;

	/* the latest preferences */
	struct Preferences pd_Preferences;

	/* PRIVATE: wait function switch */
	UBYTE pd_PWaitEnabled;

	/**************************************************************
	 *
	 * New fields for V2.0:
	 *
	 *************************************************************/

	/* PRIVATE: padding */
	UBYTE pd_Flags1;

	/* PRIVATE: stack space (OBSOLETE) */
	UBYTE pd_Stk[P_STKSIZE];

	/**************************************************************
	 *
	 *  New fields for V3.5 (V44):
	 *
	 *************************************************************/

	/* PRIVATE: the Unit. pd_Unit is obsolete */
	struct PrinterUnit * pd_PUnit;

	/* the read function:
	 *
	 *	LONG pd_PRead(char * buffer,
	 *	              LONG * length,
	 *	              struct timeval * tv);
	 */
	LONG (*pd_PRead)();

	/* call application's error hook:
	 *
	 *	LONG pd_CallErrorHook(struct Hook * hook,
	 *	                      struct printerIO * ior,
	 *	                      struct PrtErrMsg * pem);
	 */
	LONG (*pd_CallErrHook)();

	/* unit number */
	ULONG pd_UnitNumber;

	/* name of loaded driver */
	STRPTR pd_DriverName;

	/* the query function:
	 *
	 *	LONG pd_PQuery(LONG * numofchars);
	 */
	LONG (*pd_PQuery)();
};

/****************************************************************************/

/* Printer Class */
#define PPCB_GFX	0	/* graphics (bit position) */
#define PPCF_GFX	0x1	/* graphics (and/or flag) */
#define PPCB_COLOR	1	/* color (bit position) */
#define PPCF_COLOR	0x2	/* color (and/or flag) */

#define PPC_BWALPHA	0x00	/* black&white alphanumerics */
#define PPC_BWGFX	0x01	/* black&white graphics */
#define PPC_COLORALPHA	0x02	/* color alphanumerics */
#define PPC_COLORGFX	0x03	/* color graphics */

#define PPCB_EXTENDED	2	/* extended PED structure (V44) */
#define PPCF_EXTENDED	0x4

/*
	Some printer drivers (PrinterPS) do not support
	strip printing. An application has to print a page
	using a single print request or through clever use
	of the PRD_DUMPRPORTTAGS printing callback hook.
*/
#define PPCB_NOSTRIP	3	/* no strip printing, please */
#define PPCF_NOSTRIP	0x8

/* Color Class */
#define	PCC_BW		0x01	/* black&white only */
#define	PCC_YMC		0x02	/* yellow/magenta/cyan only */
#define	PCC_YMC_BW	0x03	/* yellow/magenta/cyan or black&white */
#define	PCC_YMCB	0x04	/* yellow/magenta/cyan/black */
#define	PCC_4COLOR	0x04	/* a flag for YMCB and BGRW */
#define	PCC_ADDITIVE	0x08	/* not ymcb but blue/green/red/white */
#define	PCC_WB		0x09	/* black&white only, 0 == BLACK */
#define	PCC_BGR		0x0A	/* blue/green/red */
#define	PCC_BGR_WB	0x0B	/* blue/green/red or black&white */
#define	PCC_BGRW	0x0C	/* blue/green/red/white */

/*
	The picture must be scanned once for each color component, as the
	printer can only define one color at a time.  ie. If 'PCC_YMC' then
	first pass sends all 'Y' info to printer, second pass sends all 'M'
	info, and third pass sends all C info to printer.  The CalComp
	PlotMaster is an example of this type of printer.
*/
#define PCC_MULTI_PASS	0x10	/* see explanation above */

/****************************************************************************/

struct PrinterExtendedData
{
	/* printer name, null terminated */
	char * ped_PrinterName;

	/* called after LoadSeg:
	 *
	 *	LONG ped_Init(struct PrinterData * pd);
	 */
	VOID (*ped_Init)();

	/* called before UnLoadSeg:
	 *
	 *	VOID ped_Expunge(VOID);
	 */
	VOID (*ped_Expunge)();

	/* called at OpenDevice:
	 *
	 *	LONG ped_Open(struct printerIO * ior);
	 */
	LONG (*ped_Open)();

	/* called at CloseDevice:
	 *
	 *	VOID ped_Close(struct printerIO * ior);
	 */
	VOID (*ped_Close)();

	/* printer class */
	UBYTE ped_PrinterClass;

	/* color class */
	UBYTE ped_ColorClass;

	/* number of print columns available */
	UBYTE ped_MaxColumns;

	/* number of character sets */
	UBYTE ped_NumCharSets;

	/* number of 'pins' in print head */
	UWORD ped_NumRows;

	/* number of dots max in a raster dump */
	ULONG ped_MaxXDots;

	/* number of dots max in a raster dump */
	ULONG ped_MaxYDots;

	/* horizontal dot density */
	UWORD ped_XDotsInch;

	/* vertical dot density */
	UWORD ped_YDotsInch;

	/* printer text command table */
	STRPTR ** ped_Commands;

	/* special command handler:
	 *
	 *	LONG ped_DoSpecial(UWORD * command,
	 *	                   UBYTE output_buffer[],
	 *	                   BYTE * current_line_position,
	 *	                   BYTE * current_line_spacing,
	 *	                   BYTE * crlf_flag,
	 *	                   UBYTE params[]);
	 */
	LONG (*ped_DoSpecial)();

	/* raster render function:
	 *
	 *	LONG ped_Render(LONG ct,LONG x,LONG y,LONG status);
	 */
	LONG (*ped_Render)();

	/* good write timeout */
	LONG ped_TimeoutSecs;

	/**************************************************************
	 *
	 * The following only exists if the segment version is >= 33:
	 *
	 *************************************************************/

	/* Conversion strings for the extended font */
	STRPTR * ped_8BitChars;

	/* Set if text printed, otherwise 0 */
	LONG ped_PrintMode;

	/**************************************************************
	 *
	 * The following only exists if the segment version is >= 34:
	 *
	 *************************************************************/

	/* ptr to conversion function for all chars:
	 *
	 *	LONG ped_ConvFunc(UBYTE * buf,
	 *	                  UBYTE c,
	 *	                  LONG crlf_flag);
	 */
	LONG (*ped_ConvFunc)();

	/**************************************************************
	 *
	 * The following only exists if the segment version is >= 44
	 * AND PPCB_EXTENDED is set in ped_PrinterClass:
	 *
	 *************************************************************/

	/* Attributes and features */
	struct TagItem * ped_TagList;

	/* driver specific preferences:
	 *
	 *	LONG ped_DoPreferences(struct printerIO * ior,
	 *	                       LONG command);
	 */
	LONG (*ped_DoPreferences)();

	/* custom error handling:
	 *
	 *	VOID ped_CallErrHook(struct printerIO * ior,
	 *	                     struct Hook * hook);
	 */
	VOID (*ped_CallErrHook)();
};

/****************************************************************************/

/* The following tags are used to define more printer driver features */

#define PRTA_Dummy (TAG_USER + 0x50000)

/****************************************************************************/

/* V44 features */
#define PRTA_8BitGuns		(PRTA_Dummy + 1) /* LBOOL */
#define PRTA_ConvertSource	(PRTA_Dummy + 2) /* LBOOL */
#define PRTA_FloydDithering	(PRTA_Dummy + 3) /* LBOOL */
#define PRTA_AntiAlias		(PRTA_Dummy + 4) /* LBOOL */
#define PRTA_ColorCorrection	(PRTA_Dummy + 5) /* LBOOL */
#define PRTA_NoIO		(PRTA_Dummy + 6) /* LBOOL */
#define PRTA_NewColor		(PRTA_Dummy + 7) /* LBOOL */
#define PRTA_ColorSize		(PRTA_Dummy + 8) /* LONG */
#define PRTA_NoScaling		(PRTA_Dummy + 9) /* LBOOL */

/* User interface */
#define PRTA_DitherNames	(PRTA_Dummy + 20) /* STRPTR * */
#define PRTA_ShadingNames	(PRTA_Dummy + 21) /* STRPTR * */
#define PRTA_ColorCorrect	(PRTA_Dummy + 22) /* LBOOL */
#define PRTA_DensityInfo	(PRTA_Dummy + 23) /* STRPTR * */

/* Hardware page borders */
#define PRTA_LeftBorder		(PRTA_Dummy + 30) /* LONG, inches/1000 */
#define PRTA_TopBorder		(PRTA_Dummy + 31) /* LONG, inches/1000 */

#define PRTA_MixBWColor		(PRTA_Dummy + 32) /* LBOOL */

/* Driver Preferences */
#define PRTA_Preferences	(PRTA_Dummy + 40) /* LBOOL */

/****************************************************************************/

struct PrinterSegment
{
	BPTR				ps_NextSegment;
	ULONG				ps_runAlert;	/* MOVEQ #0,D0 : RTS */
	UWORD				ps_Version;	/* segment version */
	UWORD				ps_Revision;	/* segment revision */
	struct PrinterExtendedData	ps_PED;		/* printer extended data */
};

/****************************************************************************/

/*
	Driver specific preferences. This structure is device specific: every
	driver must base its preferences structure on this to allow version
	checking etc.

	The application will read/write this structure as an I/O buffer.
*/
struct PrtDriverPreferences
{
	UWORD    pdp_Version;				/* PRIVATE! driver specific version */
	UBYTE    pdp_PrinterID[32];			/* PRIVATE! driver specific id */
	char     pdp_PrefName[FILENAME_SIZE-16];
	ULONG    pdp_Length;				/* size of this structure */

	/* .. more driver private fields follow .. */
};

#endif /* DEVICES_PRTBASE_H */
