#ifndef LIBRARIES_NONVOLATILE_H
#define LIBRARIES_NONVOLATILE_H

/*
**	$VER: nonvolatile.h 40.8 (30.7.1993)
**	Includes Release 45.1
**
**	nonvolatile.library interface structures and defintions.
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif


/*****************************************************************************/


struct NVInfo
{
    ULONG nvi_MaxStorage;
    ULONG nvi_FreeStorage;
};


/*****************************************************************************/


struct NVEntry
{
    struct MinNode nve_Node;
    STRPTR	   nve_Name;
    ULONG	   nve_Size;
    ULONG	   nve_Protection;
};

/* bit definitions for mask in SetNVProtection().  Also used for
 * NVEntry.nve_Protection.
 */
#define NVEB_DELETE  0
#define NVEB_APPNAME 31

#define NVEF_DELETE  (1<<NVEB_DELETE)
#define NVEF_APPNAME (1<<NVEB_APPNAME)


/*****************************************************************************/


/* errors from StoreNV() */
#define NVERR_BADNAME	1
#define NVERR_WRITEPROT 2
#define NVERR_FAIL	3
#define NVERR_FATAL	4


/*****************************************************************************/


/* determine the size of data returned by this library */
#define SizeNVData(DataPtr) ((((ULONG *) DataPtr)[-1]) - 4)


/*****************************************************************************/


#endif /* LIBRARIES_NONVOLATILE_H */
