	IFND	RESOURCES_BATTMEMBITSAMIGA_I
RESOURCES_BATTMEMBITSAMIGA_I	SET	1
**
**	$VER: battmembitsamiga.i 39.3 (14.9.1992)
**	Includes Release 45.1
**
**	BattMem Amiga specific bit definitions.
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**		All Rights Reserved
**


*
* Amiga specific bits in the battery-backed-up ram.
*
*	Bits 0 to 31, inclusive
*

*
* AMIGA_AMNESIA
*
*		The battery-backedup memory has had a memory loss.
*		This bit is used as a flag that the user should be
*		notified that all battery-backed bit have been
*		reset and that some attention is required. Zero
*		indicates that a memory loss has occured.
*

BATTMEM_AMIGA_AMNESIA_ADDR	EQU	0
BATTMEM_AMIGA_AMNESIA_LEN	EQU	1


*
* SCSI_TIMEOUT
*
*		adjusts the timeout value for SCSI device selection.  A
*		value of 0 will produce short timeouts (128 ms) while a
*		value of 1 produces long timeouts (2 sec).  This is used
*		for Seagate drives (and some Maxtors apparently) that
*		don`t respond to selection until they are fully spun up
*		and intialised.
*

BATTMEM_SCSI_TIMEOUT_ADDR	EQU	1
BATTMEM_SCSI_TIMEOUT_LEN	EQU	1


*
* SCSI_LUNS
*
*		Determines if the controller attempts to access logical
*		units above 0 at any given SCSI address.  This prevents
*		problems with drives that respond to ALL LUN addresses
*		(instead of only 0 like they should).  Default value is
*		0 meaning don't support LUNs.
*

BATTMEM_SCSI_LUNS_ADDR		EQU	2
BATTMEM_SCSI_LUNS_LEN		EQU	1

	ENDC	; RESOURCES_BATTMEMBITSAMIGA_I
