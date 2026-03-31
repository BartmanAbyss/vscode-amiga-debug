#ifndef DEVICES_BOOTBLOCK_H
#define DEVICES_BOOTBLOCK_H
/*
**	$VER: bootblock.h 47.1 (28.6.2019)
**
**	floppy BootBlock definition
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_TYPES_H
#include	<exec/types.h>
#endif

struct BootBlock {
	UBYTE	bb_id[4];		/* 4 character identifier */
	LONG	bb_chksum;		/* boot block checksum (balance) */
	LONG	bb_dosblock;		/* reserved for DOS patch */
};

#define		BOOTSECTS	2	/* 1K bootstrap */

#define BBID_DOS	{ 'D', 'O', 'S', '\0' }
#define BBID_KICK	{ 'K', 'I', 'C', 'K' }

#define BBNAME_DOS	0x444F5300	/* 'DOS\0' */
#define BBNAME_KICK	0x4B49434B	/* 'KICK' */

#endif	/* DEVICES_BOOTBLOCK_H */
