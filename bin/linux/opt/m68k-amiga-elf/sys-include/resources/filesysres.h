#ifndef	RESOURCES_FILESYSRES_H
#define	RESOURCES_FILESYSRES_H
/*
**	$VER: filesysres.h 36.4 (3.5.1990)
**	Includes Release 45.1
**
**	FileSystem.resource description
**
**	(C) Copyright 1988-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	EXEC_NODES_H
#include	<exec/nodes.h>
#endif
#ifndef	EXEC_LISTS_H
#include	<exec/lists.h>
#endif
#ifndef	DOS_DOS_H
#include	<dos/dos.h>
#endif

#define	FSRNAME	"FileSystem.resource"

struct FileSysResource {
    struct Node fsr_Node;		/* on resource list */
    char   *fsr_Creator;		/* name of creator of this resource */
    struct List fsr_FileSysEntries;	/* list of FileSysEntry structs */
};

struct FileSysEntry {
    struct Node fse_Node;	/* on fsr_FileSysEntries list */
				/* ln_Name is of creator of this entry */
    ULONG   fse_DosType;	/* DosType of this FileSys */
    ULONG   fse_Version;	/* Version of this FileSys */
    ULONG   fse_PatchFlags;	/* bits set for those of the following that */
				/*   need to be substituted into a standard */
				/*   device node for this file system: e.g. */
				/*   0x180 for substitute SegList & GlobalVec */
    ULONG   fse_Type;		/* device node type: zero */
    CPTR    fse_Task;		/* standard dos "task" field */
    BPTR    fse_Lock;		/* not used for devices: zero */
    BSTR    fse_Handler;	/* filename to loadseg (if SegList is null) */
    ULONG   fse_StackSize;	/* stacksize to use when starting task */
    LONG    fse_Priority;	/* task priority when starting task */
    BPTR    fse_Startup;	/* startup msg: FileSysStartupMsg for disks */
    BPTR    fse_SegList;	/* code to run to start new task */
    BPTR    fse_GlobalVec;	/* BCPL global vector when starting task */
    /* no more entries need exist than those implied by fse_PatchFlags */
};

#endif	/* RESOURCES_FILESYSRES_H */
