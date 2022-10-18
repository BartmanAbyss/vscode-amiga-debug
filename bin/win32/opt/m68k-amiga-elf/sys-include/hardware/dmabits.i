	IFND	HARDWARE_DMABITS_I
HARDWARE_DMABITS_I	SET	1
**
**	$VER: dmabits.i 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	include file for defining dma control stuff
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

* write definitions for dmaconw
DMAF_SETCLR    EQU   $8000
DMAF_AUDIO     EQU   $000F  * 4 bit mask
DMAF_AUD0      EQU   $0001
DMAF_AUD1      EQU   $0002
DMAF_AUD2      EQU   $0004
DMAF_AUD3      EQU   $0008
DMAF_DISK      EQU   $0010
DMAF_SPRITE    EQU   $0020
DMAF_BLITTER   EQU   $0040
DMAF_COPPER    EQU   $0080
DMAF_RASTER    EQU   $0100
DMAF_MASTER    EQU   $0200
DMAF_BLITHOG   EQU   $0400
DMAF_ALL       EQU   $01FF  * all dma channels

* read definitions for dmaconr
* bits 0-8 correspnd to dmaconw definitions
DMAF_BLTDONE   EQU   $4000
DMAF_BLTNZERO  EQU   $2000

DMAB_SETCLR    EQU   15
DMAB_AUD0      EQU   0
DMAB_AUD1      EQU   1
DMAB_AUD2      EQU   2
DMAB_AUD3      EQU   3
DMAB_DISK      EQU   4
DMAB_SPRITE    EQU   5
DMAB_BLITTER   EQU   6
DMAB_COPPER    EQU   7
DMAB_RASTER    EQU   8
DMAB_MASTER    EQU   9
DMAB_BLITHOG   EQU   10
DMAB_BLTDONE   EQU   14
DMAB_BLTNZERO  EQU   13

	ENDC	; HARDWARE_DMABITS_I
