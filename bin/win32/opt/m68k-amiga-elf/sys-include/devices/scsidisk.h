#ifndef	DEVICES_SCSIDISK_H
#define	DEVICES_SCSIDISK_H
/*
**	$VER: scsidisk.h 44.1 (17.04.1999)
**	Includes Release 45.1
**
**	SCSI exec-level device command
**
**	(C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
**
**	(C) Copyright 1999 by Joanne Dow, Wizardess Designs, licensed to
**		Amiga Inc.
**		All Rights Reserved
*/

/*
**	Changes:
**		Added new numbering scheme for handling WIDE SCSI devices.
**		Note that at this time only support for up to 16 IDs is
**		contemplated in most designs although this numbering system
**		can consider far far more.
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif /* EXEC_TYPES_H */

/*--------------------------------------------------------------------
 *
 *   SCSI Command
 *	Several Amiga SCSI controller manufacturers are converging on
 *	standard ways to talk to their controllers.  This include
 *	file describes an exec-device command (e.g. for hddisk.device)
 *	that can be used to issue SCSI commands
 *
 *   UNIT NUMBERS
 *	Unit numbers to the OpenDevice call have encoded in them which
 *	SCSI device is being referred to.  The three decimal digits of
 *	the unit number refer to the SCSI Target ID (bus address) in
 *	the 1's digit, the SCSI logical unit (LUN) in the 10's digit,
 *	and the controller board in the 100's digit.
 *
 *	Examples:
 *		  0	drive at address 0
 *		 12	LUN 1 on multiple drive controller at address 2
 *		104	second controller board, address 4
 *		 88	not valid: both logical units and addresses
 *			range from 0..7.
 *
 *   CAVEATS
 *	Original 2090 code did not support this command.
 *
 *	Commodore 2090/2090A unit numbers are different.  The SCSI
 *	logical unit is the 100's digit, and the SCSI Target ID
 *	is a permuted 1's digit: Target ID 0..6 maps to unit 3..9
 *	(7 is reserved for the controller).
 *
 *	    Examples:
 *		  3	drive at address 0
 *		109	drive at address 6, logical unit 1
 *		  1	not valid: this is not a SCSI unit.  Perhaps
 *			it's an ST506 unit.
 *
 *	Some controller boards generate a unique name (e.g. 2090A's
 *	iddisk.device) for the second controller board, instead of
 *	implementing the 100's digit.
 *
 *	With the advent of wide SCSI the scheme above fails miserably.
 *	A new scheme was adopted by Phase V, who appear to be the only
 *	source of wide SCSI for the Amiga at this time. Thus their
 *	numbering system kludge is adopted here. When the ID or LUN is
 *	above 7 the new numbering scheme is used.
 *
 *	Unit =
 *		Board * 10 * 1000 * 1000 +
 *		LUN	  * 10 * 1000		 +
 *		ID	  * 10				 +
 *		HD_WIDESCSI;
 *
 *	There are optional restrictions on the alignment, bus
 *	accessability, and size of the data for the data phase.
 *	Be conservative to work with all manufacturer's controllers.
 *
 *------------------------------------------------------------------*/

#define HD_WIDESCSI	8	/* Wide SCSI detection bit. */
#define	HD_SCSICMD	28	/* issue a SCSI command to the unit */
				/* io_Data points to a SCSICmd */
				/* io_Length is sizeof(struct SCSICmd) */
				/* io_Actual and io_Offset are not used */

struct SCSICmd {
    UWORD  *scsi_Data;		/* word aligned data for SCSI Data Phase */
				/* (optional) data need not be byte aligned */
				/* (optional) data need not be bus accessable */
    ULONG   scsi_Length;	/* even length of Data area */
				/* (optional) data can have odd length */
				/* (optional) data length can be > 2**24 */
    ULONG   scsi_Actual;	/* actual Data used */
    UBYTE  *scsi_Command;	/* SCSI Command (same options as scsi_Data) */
    UWORD   scsi_CmdLength;	/* length of Command */
    UWORD   scsi_CmdActual;	/* actual Command used */
    UBYTE   scsi_Flags;		/* includes intended data direction */
    UBYTE   scsi_Status;	/* SCSI status of command */
    UBYTE  *scsi_SenseData;	/* sense data: filled if SCSIF_[OLD]AUTOSENSE */
				/* is set and scsi_Status has CHECK CONDITION */
				/* (bit 1) set */
    UWORD   scsi_SenseLength;	/* size of scsi_SenseData, also bytes to */
				/* request w/ SCSIF_AUTOSENSE, must be 4..255 */
    UWORD   scsi_SenseActual;	/* amount actually fetched (0 means no sense) */
};


/*----- scsi_Flags -----*/
#define	SCSIF_WRITE		0	/* intended data direction is out */
#define	SCSIF_READ		1	/* intended data direction is in */
#define	SCSIB_READ_WRITE	0	/* (the bit to test) */

#define	SCSIF_NOSENSE		0	/* no automatic request sense */
#define	SCSIF_AUTOSENSE		2	/* do standard extended request sense */
					/* on check condition */
#define	SCSIF_OLDAUTOSENSE	6	/* do 4 byte non-extended request */
					/* sense on check condition */
#define	SCSIB_AUTOSENSE		1	/* (the bit to test) */
#define	SCSIB_OLDAUTOSENSE	2	/* (the bit to test) */

/*----- SCSI io_Error values -----*/
#define	HFERR_SelfUnit		40	/* cannot issue SCSI command to self */
#define	HFERR_DMA		41	/* DMA error */
#define	HFERR_Phase		42	/* illegal or unexpected SCSI phase */
#define	HFERR_Parity		43	/* SCSI parity error */
#define	HFERR_SelTimeout	44	/* Select timed out */
#define	HFERR_BadStatus		45	/* status and/or sense error */

/*----- OpenDevice io_Error values -----*/
#define	HFERR_NoBoard		50	/* Open failed for non-existant board */

#endif	/* DEVICES_SCSIDISK_H */
