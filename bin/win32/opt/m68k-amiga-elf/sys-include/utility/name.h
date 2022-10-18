#ifndef UTILITY_NAME_H
#define	UTILITY_NAME_H
/*
**	$VER: name.h 39.5 (11.8.1993)
**	Includes Release 45.1
**
**	Namespace definitions
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	All Rights Reserved
**/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif


/*****************************************************************************/


/* The named object structure */
struct NamedObject
{
    APTR no_Object;	/* Your pointer, for whatever you want */
};

/* Tags for AllocNamedObject() */
#define	ANO_NameSpace	4000	/* Tag to define namespace	*/
#define	ANO_UserSpace	4001	/* tag to define userspace	*/
#define	ANO_Priority	4002	/* tag to define priority	*/
#define	ANO_Flags	4003	/* tag to define flags		*/

/* Flags for tag ANO_Flags */
#define	NSB_NODUPS	0
#define	NSB_CASE	1

#define	NSF_NODUPS	(1L << NSB_NODUPS)	/* Default allow duplicates */
#define	NSF_CASE	(1L << NSB_CASE)	/* Default to caseless... */


/*****************************************************************************/


#endif /* UTILITY_NAME_H */
