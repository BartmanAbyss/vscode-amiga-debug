#ifndef EXEC_ALERTS_H
#define EXEC_ALERTS_H
/*
**	$VER: alerts.h 39.3 (12.5.1992)
**	Includes Release 45.1
**
**	Alert numbers, as displayed by system crashes.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*********************************************************************
*
*  Format of the alert error number:
*
*    +-+-------------+----------------+--------------------------------+
*    |D|  SubSysId   |	General Error |    SubSystem Specific Error    |
*    +-+-------------+----------------+--------------------------------+
*     1    7 bits	   8 bits		   16 bits
*
*		     D:  DeadEnd alert
*	      SubSysId:  indicates ROM subsystem number.
*	 General Error:  roughly indicates what the error was
*	Specific Error:  indicates more detail
**********************************************************************/

/**********************************************************************
*
*  Hardware/CPU specific alerts:  They may show without the 8 at the
*  front of the number.  These are CPU/68000 specific.	See 680x0
*  programmer's manuals for more details.
*
**********************************************************************/
#define	ACPU_BusErr	0x80000002	/* Hardware bus fault/access error */
#define	ACPU_AddressErr	0x80000003	/* Illegal address access (ie: odd) */
#define	ACPU_InstErr	0x80000004	/* Illegal instruction */
#define	ACPU_DivZero	0x80000005	/* Divide by zero */
#define	ACPU_CHK	0x80000006	/* Check instruction error */
#define	ACPU_TRAPV	0x80000007	/* TrapV instruction error */
#define	ACPU_PrivErr	0x80000008	/* Privilege violation error */
#define	ACPU_Trace	0x80000009	/* Trace error */
#define	ACPU_LineA	0x8000000A	/* Line 1010 Emulator error */
#define	ACPU_LineF	0x8000000B	/* Line 1111 Emulator error */
#define	ACPU_Format	0x8000000E	/* Stack frame format error */
#define	ACPU_Spurious	0x80000018	/* Spurious interrupt error */
#define	ACPU_AutoVec1	0x80000019	/* AutoVector Level 1 interrupt error */
#define	ACPU_AutoVec2	0x8000001A	/* AutoVector Level 2 interrupt error */
#define	ACPU_AutoVec3	0x8000001B	/* AutoVector Level 3 interrupt error */
#define	ACPU_AutoVec4	0x8000001C	/* AutoVector Level 4 interrupt error */
#define	ACPU_AutoVec5	0x8000001D	/* AutoVector Level 5 interrupt error */
#define	ACPU_AutoVec6	0x8000001E	/* AutoVector Level 6 interrupt error */
#define	ACPU_AutoVec7	0x8000001F	/* AutoVector Level 7 interrupt error */

/*********************************************************************
*
*  General Alerts
*
*  For example: timer.device cannot open math.library would be 0x05038015
*
*	Alert(AN_TimerDev|AG_OpenLib|AO_MathLib);
*
*********************************************************************/

/*------ alert types */
#define AT_DeadEnd	0x80000000
#define AT_Recovery	0x00000000

/*------ general purpose alert codes */
#define AG_NoMemory	0x00010000
#define AG_MakeLib	0x00020000
#define AG_OpenLib	0x00030000
#define AG_OpenDev	0x00040000
#define AG_OpenRes	0x00050000
#define AG_IOError	0x00060000
#define AG_NoSignal	0x00070000
#define AG_BadParm	0x00080000
#define AG_CloseLib	0x00090000	/* usually too many closes */
#define AG_CloseDev	0x000A0000	/* or a mismatched close */
#define AG_ProcCreate	0x000B0000	/* Process creation failed */

/*------ alert objects: */
#define AO_ExecLib	0x00008001
#define AO_GraphicsLib	0x00008002
#define AO_LayersLib	0x00008003
#define AO_Intuition	0x00008004
#define AO_MathLib	0x00008005
#define AO_DOSLib	0x00008007
#define AO_RAMLib	0x00008008
#define AO_IconLib	0x00008009
#define AO_ExpansionLib 0x0000800A
#define AO_DiskfontLib	0x0000800B
#define AO_UtilityLib	0x0000800C
#define	AO_KeyMapLib	0x0000800D

#define AO_AudioDev	0x00008010
#define AO_ConsoleDev	0x00008011
#define AO_GamePortDev	0x00008012
#define AO_KeyboardDev	0x00008013
#define AO_TrackDiskDev 0x00008014
#define AO_TimerDev	0x00008015

#define AO_CIARsrc	0x00008020
#define AO_DiskRsrc	0x00008021
#define AO_MiscRsrc	0x00008022

#define AO_BootStrap	0x00008030
#define AO_Workbench	0x00008031
#define AO_DiskCopy	0x00008032
#define AO_GadTools	0x00008033
#define AO_Unknown	0x00008035

/*********************************************************************
*
*   Specific Alerts:
*
*   For example:   exec.library -- corrupted memory list
*
*	    ALERT  AN_MemCorrupt	;8100 0005
*
*********************************************************************/

/*------ exec.library */
#define AN_ExecLib	0x01000000
#define AN_ExcptVect	0x01000001 /* 68000 exception vector checksum (obs.) */
#define AN_BaseChkSum	0x01000002 /* Execbase checksum (obs.) */
#define AN_LibChkSum	0x01000003 /* Library checksum failure */

#define AN_MemCorrupt	0x81000005 /* Corrupt memory list detected in FreeMem */
#define AN_IntrMem	0x81000006 /* No memory for interrupt servers */
#define AN_InitAPtr	0x01000007 /* InitStruct() of an APTR source (obs.) */
#define AN_SemCorrupt	0x01000008 /* A semaphore is in an illegal state
				      at ReleaseSemaphore() */
#define AN_FreeTwice	0x01000009 /* Freeing memory already freed */
#define AN_BogusExcpt	0x8100000A /* illegal 68k exception taken (obs.) */
#define AN_IOUsedTwice	0x0100000B /* Attempt to reuse active IORequest */
#define AN_MemoryInsane 0x0100000C /* Sanity check on memory list failed
				      during AvailMem(MEMF_LARGEST) */
#define AN_IOAfterClose 0x0100000D /* IO attempted on closed IORequest */
#define AN_StackProbe	0x0100000E /* Stack appears to extend out of range */
#define AN_BadFreeAddr	0x0100000F /* Memory header not located. [ Usually an
				      invalid address passed to FreeMem() ] */
#define	AN_BadSemaphore	0x01000010 /* An attempt was made to use the old
				      message semaphores. */

/*------ graphics.library */
#define AN_GraphicsLib	0x02000000
#define AN_GfxNoMem	0x82010000	/* graphics out of memory */
#define AN_GfxNoMemMspc 0x82010001	/* MonitorSpec alloc, no memory */
#define AN_LongFrame	0x82010006	/* long frame, no memory */
#define AN_ShortFrame	0x82010007	/* short frame, no memory */
#define AN_TextTmpRas	0x02010009	/* text, no memory for TmpRas */
#define AN_BltBitMap	0x8201000A	/* BltBitMap, no memory */
#define AN_RegionMemory 0x8201000B	/* regions, memory not available */
#define AN_MakeVPort	0x82010030	/* MakeVPort, no memory */
#define AN_GfxNewError	0x0200000C
#define AN_GfxFreeError 0x0200000D

#define AN_GfxNoLCM	0x82011234	/* emergency memory not available */

#define AN_ObsoleteFont 0x02000401	/* unsupported font description used */

/*------ layers.library */
#define AN_LayersLib	0x03000000
#define AN_LayersNoMem	0x83010000	/* layers out of memory */

/*------ intuition.library */
#define AN_Intuition	0x04000000
#define AN_GadgetType	0x84000001	/* unknown gadget type */
#define AN_BadGadget	0x04000001	/* Recovery form of AN_GadgetType */
#define AN_CreatePort	0x84010002	/* create port, no memory */
#define AN_ItemAlloc	0x04010003	/* item plane alloc, no memory */
#define AN_SubAlloc	0x04010004	/* sub alloc, no memory */
#define AN_PlaneAlloc	0x84010005	/* plane alloc, no memory */
#define AN_ItemBoxTop	0x84000006	/* item box top < RelZero */
#define AN_OpenScreen	0x84010007	/* open screen, no memory */
#define AN_OpenScrnRast 0x84010008	/* open screen, raster alloc, no memory */
#define AN_SysScrnType	0x84000009	/* open sys screen, unknown type */
#define AN_AddSWGadget	0x8401000A	/* add SW gadgets, no memory */
#define AN_OpenWindow	0x8401000B	/* open window, no memory */
#define AN_BadState	0x8400000C	/* Bad State Return entering Intuition */
#define AN_BadMessage	0x8400000D	/* Bad Message received by IDCMP */
#define AN_WeirdEcho	0x8400000E	/* Weird echo causing incomprehension */
#define AN_NoConsole	0x8400000F	/* couldn't open the Console Device */
#define	AN_NoISem	0x04000010	/* Intuition skipped obtaining a sem */
#define	AN_ISemOrder	0x04000011	/* Intuition obtained a sem in bad order */

/*------ math.library */
#define AN_MathLib	0x05000000

/*------ dos.library */
#define AN_DOSLib	0x07000000
#define AN_StartMem	0x07010001 /* no memory at startup */
#define AN_EndTask	0x07000002 /* EndTask didn't */
#define AN_QPktFail	0x07000003 /* Qpkt failure */
#define AN_AsyncPkt	0x07000004 /* Unexpected packet received */
#define AN_FreeVec	0x07000005 /* Freevec failed */
#define AN_DiskBlkSeq	0x07000006 /* Disk block sequence error */
#define AN_BitMap	0x07000007 /* Bitmap corrupt */
#define AN_KeyFree	0x07000008 /* Key already free */
#define AN_BadChkSum	0x07000009 /* Invalid checksum */
#define AN_DiskError	0x0700000A /* Disk Error */
#define AN_KeyRange	0x0700000B /* Key out of range */
#define AN_BadOverlay	0x0700000C /* Bad overlay */
#define AN_BadInitFunc	0x0700000D /* Invalid init packet for cli/shell */
#define AN_FileReclosed 0x0700000E /* A filehandle was closed more than once */

/*------ ramlib.library */
#define AN_RAMLib	0x08000000
#define AN_BadSegList	0x08000001	/* no overlays in library seglists */

/*------ icon.library */
#define AN_IconLib	0x09000000

/*------ expansion.library */
#define AN_ExpansionLib 0x0A000000
#define AN_BadExpansionFree	0x0A000001 /* freeed free region */

/*------ diskfont.library */
#define AN_DiskfontLib	0x0B000000

/*------ audio.device */
#define AN_AudioDev	0x10000000

/*------ console.device */
#define AN_ConsoleDev	0x11000000
#define AN_NoWindow	0x11000001	/* Console can't open initial window */

/*------ gameport.device */
#define AN_GamePortDev	0x12000000

/*------ keyboard.device */
#define AN_KeyboardDev	0x13000000

/*------ trackdisk.device */
#define AN_TrackDiskDev 0x14000000
#define AN_TDCalibSeek	0x14000001	/* calibrate: seek error */
#define AN_TDDelay	0x14000002	/* delay: error on timer wait */

/*------ timer.device */
#define AN_TimerDev	0x15000000
#define AN_TMBadReq	0x15000001 /* bad request */
#define AN_TMBadSupply	0x15000002 /* power supply -- no 50/60Hz ticks */

/*------ cia.resource */
#define AN_CIARsrc	0x20000000

/*------ disk.resource */
#define AN_DiskRsrc	0x21000000
#define AN_DRHasDisk	0x21000001	/* get unit: already has disk */
#define AN_DRIntNoAct	0x21000002	/* interrupt: no active unit */

/*------ misc.resource */
#define AN_MiscRsrc	0x22000000

/*------ bootstrap */
#define AN_BootStrap	0x30000000
#define AN_BootError	0x30000001	/* boot code returned an error */

/*------ Workbench */
#define AN_Workbench			0x31000000
#define AN_NoFonts			0xB1000001
#define AN_WBBadStartupMsg1		0x31000001
#define AN_WBBadStartupMsg2		0x31000002
#define AN_WBBadIOMsg			0x31000003	/* Hacker code? */
#define AN_WBReLayoutToolMenu		0xB1010009	/* GadTools broke? */

/*------ DiskCopy */
#define AN_DiskCopy	0x32000000

/*------ toolkit for Intuition */
#define AN_GadTools	0x33000000

/*------ System utility library */
#define AN_UtilityLib	0x34000000

/*------ For use by any application that needs it */
#define AN_Unknown	0x35000000

#endif /* EXEC_ALERTS_H */
