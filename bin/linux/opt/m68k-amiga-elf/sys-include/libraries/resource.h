#ifndef LIBRARIES_RESOURCE_H
#define LIBRARIES_RESOURCE_H
/*
**	$VER: resource.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	resource.library definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

typedef APTR RESOURCEFILE;
typedef ULONG RESOURCEID;

/* A gadget ID (Tag GA_ID) may contain the ID and the group ID
   ored together. The following definitions must be used to extract
   the original gadget ID (1024 different IDs are possible) and the
   group id (63 different group IDs are possible).
*/
#define RL_GADGETMASK 0x03FF
#define RL_GROUPMASK  0xFC00
#define RL_GADGETID(x) ((x) & RL_GADGETMASK)
#define RL_GROUPID(x) (((x) & RL_GROUPMASK) >> 10)

#endif /* LIBRARIES_RESOURCE_H */
