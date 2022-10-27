#ifndef  DATATYPES_DATATYPES_H
#define  DATATYPES_DATATYPES_H
/*
**	$VER: datatypes.h 39.6 (22.4.1993)
**	Includes Release 45.1
**
**	Copyright © 1991-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
#ifndef  EXEC_LISTS_H
#include <exec/lists.h>
#endif
#ifndef  EXEC_NODES_H
#include <exec/nodes.h>
#endif
#ifndef  EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif
#ifndef  LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif
#ifndef	DOS_DOS_H
#include <dos/dos.h>
#endif

/*****************************************************************************/

#define ID_DTYP MAKE_ID('D','T','Y','P')

/*****************************************************************************/

#define ID_DTHD MAKE_ID('D','T','H','D')

struct DataTypeHeader
{
    STRPTR	 dth_Name;				/* Descriptive name of the data type */
    STRPTR	 dth_BaseName;				/* Base name of the data type */
    STRPTR	 dth_Pattern;				/* Match pattern for file name. */
    WORD	*dth_Mask;				/* Comparision mask */
    ULONG	 dth_GroupID;				/* Group that the DataType is in */
    ULONG	 dth_ID;				/* ID for DataType (same as IFF FORM type) */
    WORD	 dth_MaskLen;				/* Length of comparision mask */
    WORD	 dth_Pad;				/* Unused at present (must be 0) */
    UWORD	 dth_Flags;				/* Flags */
    UWORD	 dth_Priority;				/* Priority */
};

#define	DTHSIZE	sizeof(struct DataTypeHeader)

/*****************************************************************************/

/* Basic type */
#define	DTF_TYPE_MASK	0x000F
#define	DTF_BINARY	0x0000
#define	DTF_ASCII	0x0001
#define	DTF_IFF		0x0002
#define	DTF_MISC	0x0003

/* Set if case is important */
#define	DTF_CASE	0x0010

/* Reserved for system use */
#define	DTF_SYSTEM1	0x1000

/*****************************************************************************
 *
 * GROUP ID and ID
 *
 * This is used for filtering out objects that you don't want.	For
 * example, you could make a filter for the ASL file requester so
 * that it only showed the files that were pictures, or even to
 * narrow it down to only show files that were ILBM pictures.
 *
 * Note that the Group ID's are in lower case, and always the first
 * four characters of the word.
 *
 * For ID's; If it is an IFF file, then the ID is the same as the
 * FORM type.  If it isn't an IFF file, then the ID would be the
 * first four characters of name for the file type.
 *
 *****************************************************************************/

/* System file, such as; directory, executable, library, device, font, etc. */
#define	GID_SYSTEM	MAKE_ID ('s','y','s','t')

/* Formatted or unformatted text */
#define	GID_TEXT	MAKE_ID ('t','e','x','t')

/* Formatted text with graphics or other DataTypes */
#define	GID_DOCUMENT	MAKE_ID ('d','o','c','u')

/* Sound */
#define	GID_SOUND	MAKE_ID ('s','o','u','n')

/* Musical instruments used for musical scores */
#define	GID_INSTRUMENT	MAKE_ID ('i','n','s','t')

/* Musical score */
#define	GID_MUSIC	MAKE_ID ('m','u','s','i')

/* Still picture */
#define	GID_PICTURE	MAKE_ID ('p','i','c','t')

/* Animated picture */
#define	GID_ANIMATION	MAKE_ID ('a','n','i','m')

/* Animation with audio track */
#define	GID_MOVIE	MAKE_ID ('m','o','v','i')

/*****************************************************************************/

/* A code chunk contains an embedded executable that can be loaded
 * with InternalLoadSeg. */
#define ID_CODE MAKE_ID('D','T','C','D')

/* DataTypes comparision hook context (Read-Only).  This is the
 * argument that is passed to a custom comparision routine. */
struct DTHookContext
{
    /* Libraries that are already opened for your use */
    struct Library		*dthc_SysBase;
    struct Library		*dthc_DOSBase;
    struct Library		*dthc_IFFParseBase;
    struct Library		*dthc_UtilityBase;

    /* File context */
    BPTR			 dthc_Lock;		/* Lock on the file */
    struct FileInfoBlock	*dthc_FIB;		/* Pointer to a FileInfoBlock */
    BPTR			 dthc_FileHandle;	/* Pointer to the file handle (may be NULL) */
    struct IFFHandle		*dthc_IFF;		/* Pointer to an IFFHandle (may be NULL) */
    STRPTR			 dthc_Buffer;		/* Buffer */
    ULONG			 dthc_BufferLength;	/* Length of the buffer */
};

/*****************************************************************************/

#define ID_TOOL MAKE_ID('D','T','T','L')

struct Tool
{
    UWORD	 tn_Which;				/* Which tool is this */
    UWORD	 tn_Flags;				/* Flags */
    STRPTR	 tn_Program;				/* Application to use */
};

#define	TSIZE	sizeof(struct Tool)

/* defines for tn_Which */
#define	TW_INFO			1
#define	TW_BROWSE		2
#define	TW_EDIT			3
#define	TW_PRINT		4
#define	TW_MAIL			5

/* defines for tn_Flags */
#define	TF_LAUNCH_MASK		0x000F
#define	TF_SHELL		0x0001
#define	TF_WORKBENCH		0x0002
#define	TF_RX			0x0003

/*****************************************************************************/

#define	ID_TAGS	MAKE_ID('D','T','T','G')

/*****************************************************************************/

#ifndef	DATATYPE
#define	DATATYPE
struct DataType
{
    struct Node			 dtn_Node1;		/* Reserved for system use */
    struct Node			 dtn_Node2;		/* Reserved for system use */
    struct DataTypeHeader	*dtn_Header;		/* Pointer to the DataTypeHeader */
    struct List			 dtn_ToolList;		/* List of tool nodes */
    STRPTR			 dtn_FunctionName;	/* Name of comparision routine */
    struct TagItem		*dtn_AttrList;		/* Object creation tags */
    ULONG			 dtn_Length;		/* Length of the memory block */
};
#endif

#define	DTNSIZE	sizeof(struct DataType)

/*****************************************************************************/

struct ToolNode
{
    struct Node	 tn_Node;				/* Embedded node */
    struct Tool  tn_Tool;				/* Embedded tool */
    ULONG	 tn_Length;				/* Length of the memory block */
};

#define	TNSIZE	sizeof(struct ToolNode)

/*****************************************************************************/

#ifndef	ID_NAME
#define	ID_NAME	MAKE_ID('N','A','M','E')
#endif

/*****************************************************************************/

/* Text ID's */
#define DTERROR_UNKNOWN_DATATYPE		2000
#define DTERROR_COULDNT_SAVE			2001
#define DTERROR_COULDNT_OPEN			2002
#define DTERROR_COULDNT_SEND_MESSAGE		2003

/* New for V40 */
#define	DTERROR_COULDNT_OPEN_CLIPBOARD		2004
#define	DTERROR_Reserved			2005
#define	DTERROR_UNKNOWN_COMPRESSION		2006
#define	DTERROR_NOT_ENOUGH_DATA			2007
#define	DTERROR_INVALID_DATA			2008

/* New for V44 */
#define	DTERROR_NOT_AVAILABLE			2009

/* Offset for types */
#define	DTMSG_TYPE_OFFSET			2100

/*****************************************************************************/

#endif	 /* DATATYPES_DATATYPES_H */
