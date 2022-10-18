#ifndef	DATATYPES_DATATYPESCLASS_H
#define	DATATYPES_DATATYPESCLASS_H
/*
**  $VER: datatypesclass.h 44.1 (17.4.1999)
**  Includes Release 45.1
**
**  Interface definitions for DataType objects.
**
**  Copyright © 1992-2001 Amiga, Inc.
**	All Rights Reserved
*/

#ifndef	UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#ifndef	DATATYPES_DATATYPES_H
#include <datatypes/datatypes.h>
#endif

#ifndef	INTUITION_INTUITION_H
#include <intuition/intuition.h>
#endif

#ifndef	DEVICES_PRINTER_H
#include <devices/printer.h>
#endif

#ifndef	DEVICES_PRTBASE_H
#include <devices/prtbase.h>
#endif

/*****************************************************************************/

#define	DATATYPESCLASS		"datatypesclass"

/*****************************************************************************/

#define	DTA_Dummy		(TAG_USER+0x1000)

/*****************************************************************************/

/* Generic attributes */


/* (struct TextAttr *) Pointer to the default TextAttr to use for
 * the text within the object.
 */
#define	DTA_TextAttr		(DTA_Dummy+10)

/* (LONG) Current top vertical unit */
#define	DTA_TopVert		(DTA_Dummy+11)

/* (LONG) Number of visible vertical units */
#define	DTA_VisibleVert		(DTA_Dummy+12)

/* (LONG) Total number of vertical units */
#define	DTA_TotalVert		(DTA_Dummy+13)

/* (LONG) Number of pixels per vertical unit */
#define	DTA_VertUnit		(DTA_Dummy+14)

/* (LONG) Current top horizontal unit */
#define	DTA_TopHoriz		(DTA_Dummy+15)

/* (LONG)  Number of visible horizontal units */
#define	DTA_VisibleHoriz	(DTA_Dummy+16)

/* (LONG) Total number of horizontal units */
#define	DTA_TotalHoriz		(DTA_Dummy+17)

/* (LONG) Number of pixels per horizontal unit */
#define	DTA_HorizUnit		(DTA_Dummy+18)

/* (UBYTE *) Name of the current element within the object. */
#define	DTA_NodeName		(DTA_Dummy+19)

/* (UBYTE *) Title of the object. */
#define	DTA_Title		(DTA_Dummy+20)

/* (struct DTMethod *) Pointer to a NULL terminated array of
 * supported trigger methods.
 */
#define	DTA_TriggerMethods	(DTA_Dummy+21)

/* (APTR) Object specific data. */
#define	DTA_Data		(DTA_Dummy+22)

/* (struct TextFont *) Default font to use for text within the
 * object.
 */
#define	DTA_TextFont		(DTA_Dummy+23)

/* (ULONG *) Pointer to a ~0 terminated array of supported
 * methods.
 */
#define	DTA_Methods		(DTA_Dummy+24)

/* (LONG) Printer error message.  Error numbers are defined in
 * <devices/printer.h>
 */
#define	DTA_PrinterStatus	(DTA_Dummy+25)

/* PRIVATE (struct Process *) Pointer to the print process. */
#define	DTA_PrinterProc		(DTA_Dummy+26)

/* PRIVATE (struct Process *) Pointer to the layout process. */
#define	DTA_LayoutProc		(DTA_Dummy+27)

/* Used to turn the applications' busy pointer off and on */
#define	DTA_Busy		(DTA_Dummy+28)

/* Used to indicate that new information has been loaded into
 * an object.  This is for models that cache the DTA_TopVert-
 * like tags
 */
#define	DTA_Sync		(DTA_Dummy+29)

/* The base name of the class */
#define	DTA_BaseName		(DTA_Dummy+30)

/* Group that the object must belong in */
#define	DTA_GroupID		(DTA_Dummy+31)

/* Error level */
#define	DTA_ErrorLevel		(DTA_Dummy+32)

/* datatypes.library error number */
#define	DTA_ErrorNumber		(DTA_Dummy+33)

/* Argument for datatypes.library error */
#define	DTA_ErrorString		(DTA_Dummy+34)

/* New for V40. (UBYTE *) specifies the name of the
 * realtime.library conductor.	Defaults to "Main".
 */
#define	DTA_Conductor		(DTA_Dummy+35)

/* New for V40. (BOOL) Indicate whether a control panel should be
 * embedded within the object (in the animation datatype, for
 * example).  Defaults to TRUE.
 */
#define	DTA_ControlPanel	(DTA_Dummy+36)

/* New for V40. (BOOL) Indicate whether the object should
 * immediately begin playing.  Defaults to FALSE.
 */
#define	DTA_Immediate		(DTA_Dummy+37)

/* New for V40. (BOOL) Indicate that the object should repeat
 * playing.  Defaults to FALSE.
 */
#define	DTA_Repeat		(DTA_Dummy+38)

/* New for V44. Address of a DTST_MEMORY source type
 * object (APTR).
 */
#define DTA_SourceAddress	(DTA_Dummy+39)

/* New for V44. Size of a DTST_MEMORY source type
 * object (ULONG).
 */
#define DTA_SourceSize		(DTA_Dummy+40)

/* Reserved tag; DO NOT USE (V44) */
#define DTA_Reserved		(DTA_Dummy+41)

/* DTObject attributes */
#define	DTA_Name		(DTA_Dummy+100)
#define	DTA_SourceType		(DTA_Dummy+101)
#define	DTA_Handle		(DTA_Dummy+102)
#define	DTA_DataType		(DTA_Dummy+103)
#define	DTA_Domain		(DTA_Dummy+104)

/* DON'T USE THE FOLLOWING FOUR TAGS.  USE THE CORRESPONDING TAGS IN
 * <intuition/gadgetclass.h> */
#define	DTA_Left		(DTA_Dummy+105)
#define	DTA_Top			(DTA_Dummy+106)
#define	DTA_Width		(DTA_Dummy+107)
#define	DTA_Height		(DTA_Dummy+108)

#define	DTA_ObjName		(DTA_Dummy+109)
#define	DTA_ObjAuthor		(DTA_Dummy+110)
#define	DTA_ObjAnnotation	(DTA_Dummy+111)
#define	DTA_ObjCopyright	(DTA_Dummy+112)
#define	DTA_ObjVersion		(DTA_Dummy+113)
#define	DTA_ObjectID		(DTA_Dummy+114)
#define	DTA_UserData		(DTA_Dummy+115)
#define	DTA_FrameInfo		(DTA_Dummy+116)

/* DON'T USE THE FOLLOWING FOUR TAGS.  USE THE CORRESPONDING TAGS IN
 * <intuition/gadgetclass.h> */
#define	DTA_RelRight		(DTA_Dummy+117)
#define	DTA_RelBottom		(DTA_Dummy+118)
#define	DTA_RelWidth		(DTA_Dummy+119)
#define	DTA_RelHeight		(DTA_Dummy+120)

#define	DTA_SelectDomain	(DTA_Dummy+121)
#define	DTA_TotalPVert		(DTA_Dummy+122)
#define	DTA_TotalPHoriz		(DTA_Dummy+123)
#define	DTA_NominalVert		(DTA_Dummy+124)
#define	DTA_NominalHoriz	(DTA_Dummy+125)

/* Printing attributes */

/* (LONG) Destination X width */
#define	DTA_DestCols		(DTA_Dummy+400)

/* (LONG) Destination Y height */
#define	DTA_DestRows		(DTA_Dummy+401)

/* (UWORD) Option flags */
#define	DTA_Special		(DTA_Dummy+402)

/* (struct RastPort *) RastPort to use when printing. (V40) */
#define	DTA_RastPort		(DTA_Dummy+403)

/* (STRPTR) Pointer to base name for ARexx port (V40) */
#define	DTA_ARexxPortName	(DTA_Dummy+404)


/*****************************************************************************/

#define	DTST_RAM		1
#define	DTST_FILE		2
#define	DTST_CLIPBOARD		3
#define	DTST_HOTLINK		4
#define	DTST_MEMORY		5	/* New for V44 */

/*****************************************************************************/

/* Attached to the Gadget.SpecialInfo field of the gadget.  Don't access directly,
 * use the Get/Set calls instead.
 */
struct DTSpecialInfo
{
    struct SignalSemaphore	 si_Lock;	/* Locked while in DoAsyncLayout() */
    ULONG			 si_Flags;

    LONG			 si_TopVert;	/* Top row (in units) */
    LONG			 si_VisVert;	/* Number of visible rows (in units) */
    LONG			 si_TotVert;	/* Total number of rows (in units) */
    LONG			 si_OTopVert;	/* Previous top (in units) */
    LONG			 si_VertUnit;	/* Number of pixels in vertical unit */

    LONG			 si_TopHoriz;	/* Top column (in units) */
    LONG			 si_VisHoriz;	/* Number of visible columns (in units) */
    LONG			 si_TotHoriz;	/* Total number of columns (in units) */
    LONG			 si_OTopHoriz;	/* Previous top (in units) */
    LONG			 si_HorizUnit;	/* Number of pixels in horizontal unit */
};


/* Object is in layout processing */
#define	DTSIF_LAYOUT		(1L<<0)

/* Object needs to be layed out */
#define	DTSIF_NEWSIZE		(1L<<1)

#define	DTSIF_DRAGGING		(1L<<2)
#define	DTSIF_DRAGSELECT	(1L<<3)

#define	DTSIF_HIGHLIGHT		(1L<<4)

/* Object is being printed */
#define	DTSIF_PRINTING		(1L<<5)

/* Object is in layout process */
#define	DTSIF_LAYOUTPROC	(1L<<6)

/*****************************************************************************/

struct DTMethod
{
    STRPTR	 dtm_Label;
    STRPTR	 dtm_Command;
    ULONG	 dtm_Method;
};

/*****************************************************************************/

#define	DTM_Dummy		(0x600)

/* Inquire what environment an object requires */
#define	DTM_FRAMEBOX		(0x601)

/* Same as GM_LAYOUT except guaranteed to be on a process already */
#define	DTM_PROCLAYOUT		(0x602)

/* Layout that is occurring on a process */
#define	DTM_ASYNCLAYOUT		(0x603)

/* When a RemoveDTObject() is called */
#define	DTM_REMOVEDTOBJECT	(0x604)

#define	DTM_SELECT		(0x605)
#define	DTM_CLEARSELECTED	(0x606)

#define	DTM_COPY		(0x607)
#define	DTM_PRINT		(0x608)
#define	DTM_ABORTPRINT		(0x609)

#define	DTM_NEWMEMBER		(0x610)
#define	DTM_DISPOSEMEMBER	(0x611)

#define	DTM_GOTO		(0x630)
#define	DTM_TRIGGER		(0x631)

#define	DTM_OBTAINDRAWINFO	(0x640)
#define	DTM_DRAW		(0x641)
#define	DTM_RELEASEDRAWINFO	(0x642)

#define	DTM_WRITE		(0x650)

/* Used to ask the object about itself */
struct FrameInfo
{
    ULONG		 fri_PropertyFlags;		/* DisplayInfo (graphics/displayinfo.h) */
    Point		 fri_Resolution;		/* DisplayInfo */

    UBYTE		 fri_RedBits;
    UBYTE		 fri_GreenBits;
    UBYTE		 fri_BlueBits;

    struct
    {
	ULONG Width;
	ULONG Height;
	ULONG Depth;

    } fri_Dimensions;

    struct Screen	*fri_Screen;
    struct ColorMap	*fri_ColorMap;

    ULONG		 fri_Flags;
};

#define	FIF_SCALABLE	0x1
#define	FIF_SCROLLABLE	0x2
#define	FIF_REMAPPABLE	0x4

/* DTM_REMOVEDTOBJECT, DTM_CLEARSELECTED, DTM_COPY, DTM_ABORTPRINT */
struct dtGeneral
{
    ULONG		 MethodID;
    struct GadgetInfo	*dtg_GInfo;
};

/* DTM_SELECT */
struct dtSelect
{
    ULONG		 MethodID;
    struct GadgetInfo	*dts_GInfo;
    struct Rectangle	 dts_Select;
};

/* DTM_FRAMEBOX */
struct dtFrameBox
{
    ULONG		 MethodID;
    struct GadgetInfo	*dtf_GInfo;
    struct FrameInfo	*dtf_ContentsInfo;	/* Input */
    struct FrameInfo	*dtf_FrameInfo;		/* Output */
    ULONG		 dtf_SizeFrameInfo;
    ULONG		 dtf_FrameFlags;
};

#ifndef	FRAMEF_SPECIFY
#define FRAMEF_SPECIFY	(1<<0)	/* Make do with the dimensions of FrameBox provided. */
#endif

/* DTM_GOTO */
struct dtGoto
{
    ULONG		 MethodID;
    struct GadgetInfo	*dtg_GInfo;
    STRPTR		 dtg_NodeName;		/* Node to goto */
    struct TagItem	*dtg_AttrList;		/* Additional attributes */
};

/* DTM_TRIGGER */
struct dtTrigger
{
    ULONG		 MethodID;
    struct GadgetInfo	*dtt_GInfo;
    ULONG		 dtt_Function;
    APTR		 dtt_Data;
};

#define	STM_PAUSE		1
#define	STM_PLAY		2
#define	STM_CONTENTS		3
#define	STM_INDEX		4
#define	STM_RETRACE		5
#define	STM_BROWSE_PREV		6
#define	STM_BROWSE_NEXT		7

#define	STM_NEXT_FIELD		8
#define	STM_PREV_FIELD		9
#define	STM_ACTIVATE_FIELD	10

#define	STM_COMMAND		11

/* New for V40 */
#define	STM_REWIND		12
#define	STM_FASTFORWARD		13
#define	STM_STOP		14
#define	STM_RESUME		15
#define	STM_LOCATE		16

/* Printer IO request */
union printerIO
{
    struct IOStdReq ios;
    struct IODRPReq iodrp;
    struct IOPrtCmdReq iopc;
};

/* DTM_PRINT */
struct dtPrint
{
    ULONG		 MethodID;
    struct GadgetInfo	*dtp_GInfo;		/* Gadget information */
    union printerIO	*dtp_PIO;		/* Printer IO request */
    struct TagItem	*dtp_AttrList;		/* Additional attributes */
};

/* DTM_DRAW */
struct dtDraw
{
    ULONG		 MethodID;
    struct RastPort	*dtd_RPort;
    LONG		 dtd_Left;
    LONG		 dtd_Top;
    LONG		 dtd_Width;
    LONG		 dtd_Height;
    LONG		 dtd_TopHoriz;
    LONG		 dtd_TopVert;
    struct TagItem	*dtd_AttrList;		/* Additional attributes */
};

/* DTM_WRITE */
struct dtWrite
{
    ULONG		 MethodID;
    struct GadgetInfo	*dtw_GInfo;		/* Gadget information */
    BPTR		 dtw_FileHandle;	/* File handle to write to */
    ULONG		 dtw_Mode;
    struct TagItem	*dtw_AttrList;		/* Additional attributes */
};

/* Save data as IFF data */
#define	DTWM_IFF	0

/* Save data as local data format */
#define	DTWM_RAW	1

#endif /* DATATYPES_DATATYPESCLASS_H */
