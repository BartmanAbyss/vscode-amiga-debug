#ifndef DOS_RDARGS_H
#define DOS_RDARGS_H
/*
**
**	$VER: rdargs.h 36.6 (12.7.1990)
**	Includes Release 45.1
**
**	ReadArgs() structure definitions
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif

/**********************************************************************
 *
 * The CSource data structure defines the input source for "ReadItem()"
 * as well as the ReadArgs call.  It is a publicly defined structure
 * which may be used by applications which use code that follows the
 * conventions defined for access.
 *
 * When passed to the dos.library functions, the value passed as
 * struct *CSource is defined as follows:
 *	if ( CSource == 0)	Use buffered IO "ReadChar()" as data source
 *	else			Use CSource for input character stream
 *
 * The following two pseudo-code routines define how the CSource structure
 * is used:
 *
 * long CS_ReadChar( struct CSource *CSource )
 * {
 *	if ( CSource == 0 )	return ReadChar();
 *	if ( CSource->CurChr >= CSource->Length )	return ENDSTREAMCHAR;
 *	return CSource->Buffer[ CSource->CurChr++ ];
 * }
 *
 * BOOL CS_UnReadChar( struct CSource *CSource )
 * {
 *	if ( CSource == 0 )	return UnReadChar();
 *	if ( CSource->CurChr <= 0 )	return FALSE;
 *	CSource->CurChr--;
 *	return TRUE;
 * }
 *
 * To initialize a struct CSource, you set CSource->CS_Buffer to
 * a string which is used as the data source, and set CS_Length to
 * the number of characters in the string.  Normally CS_CurChr should
 * be initialized to ZERO, or left as it was from prior use as
 * a CSource.
 *
 **********************************************************************/

struct CSource {
	UBYTE	*CS_Buffer;
	LONG	CS_Length;
	LONG	CS_CurChr;
};

/**********************************************************************
 *
 * The RDArgs data structure is the input parameter passed to the DOS
 * ReadArgs() function call.
 *
 * The RDA_Source structure is a CSource as defined above;
 * if RDA_Source.CS_Buffer is non-null, RDA_Source is used as the input
 * character stream to parse, else the input comes from the buffered STDIN
 * calls ReadChar/UnReadChar.
 *
 * RDA_DAList is a private address which is used internally to track
 * allocations which are freed by FreeArgs().  This MUST be initialized
 * to NULL prior to the first call to ReadArgs().
 *
 * The RDA_Buffer and RDA_BufSiz fields allow the application to supply
 * a fixed-size buffer in which to store the parsed data.  This allows
 * the application to pre-allocate a buffer rather than requiring buffer
 * space to be allocated.  If either RDA_Buffer or RDA_BufSiz is NULL,
 * the application has not supplied a buffer.
 *
 * RDA_ExtHelp is a text string which will be displayed instead of the
 * template string, if the user is prompted for input.
 *
 * RDA_Flags bits control how ReadArgs() works.  The flag bits are
 * defined below.  Defaults are initialized to ZERO.
 *
 **********************************************************************/

struct RDArgs {
	struct	CSource RDA_Source;	/* Select input source */
	LONG	RDA_DAList;		/* PRIVATE. */
	UBYTE	*RDA_Buffer;		/* Optional string parsing space. */
	LONG	RDA_BufSiz;		/* Size of RDA_Buffer (0..n) */
	UBYTE	*RDA_ExtHelp;		/* Optional extended help */
	LONG	RDA_Flags;		/* Flags for any required control */
};

#define RDAB_STDIN	0	/* Use "STDIN" rather than "COMMAND LINE" */
#define RDAF_STDIN	1
#define RDAB_NOALLOC	1	/* If set, do not allocate extra string space.*/
#define RDAF_NOALLOC	2
#define RDAB_NOPROMPT	2	/* Disable reprompting for string input. */
#define RDAF_NOPROMPT	4

/**********************************************************************
 * Maximum number of template keywords which can be in a template passed
 * to ReadArgs(). IMPLEMENTOR NOTE - must be a multiple of 4.
 **********************************************************************/
#define MAX_TEMPLATE_ITEMS	100

/**********************************************************************
 * Maximum number of MULTIARG items returned by ReadArgs(), before
 * an ERROR_LINE_TOO_LONG.  These two limitations are due to stack
 * usage.  Applications should allow "a lot" of stack to use ReadArgs().
 **********************************************************************/
#define MAX_MULTIARGS		128

#endif /* DOS_RDARGS_H */
