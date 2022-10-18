#ifndef IFF_IFFPARSE_H
#define IFF_IFFPARSE_H
/*
**	$VER: iffparse.h 39.1 (1.6.1992)
**	Includes Release 45.1
**
**	iffparse.library structures and constants
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	(C) Copyright 1989-1990 Stuart Ferguson and Leo L. Schwab
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif

#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef DEVICES_CLIPBOARD_H
#include <devices/clipboard.h>
#endif


/*****************************************************************************/


/* Structure associated with an active IFF stream.
 * "iff_Stream" is a value used by the client's read/write/seek functions -
 * it will not be accessed by the library itself and can have any value
 * (could even be a pointer or a BPTR).
 *
 * This structure can only be allocated by iffparse.library
 */
struct IFFHandle
{
    ULONG iff_Stream;
    ULONG iff_Flags;
    LONG  iff_Depth;	/*  Depth of context stack */
};

/* bit masks for "iff_Flags" field */
#define IFFF_READ	0L			 /* read mode - default    */
#define IFFF_WRITE	1L			 /* write mode		   */
#define IFFF_RWBITS	(IFFF_READ | IFFF_WRITE) /* read/write bits	   */
#define IFFF_FSEEK	(1L<<1)		 /* forward seek only	   */
#define IFFF_RSEEK	(1L<<2)		 /* random seek	   */
#define IFFF_RESERVED	0xFFFF0000L		 /* Don't touch these bits */


/*****************************************************************************/


/* When the library calls your stream handler, you'll be passed a pointer
 * to this structure as the "message packet".
 */
struct IFFStreamCmd
{
    LONG sc_Command;	/* Operation to be performed (IFFCMD_) */
    APTR sc_Buf;	/* Pointer to data buffer	       */
    LONG sc_NBytes;	/* Number of bytes to be affected      */
};


/*****************************************************************************/


/* A node associated with a context on the iff_Stack. Each node
 * represents a chunk, the stack representing the current nesting
 * of chunks in the open IFF file. Each context node has associated
 * local context items in the (private) LocalItems list.  The ID, type,
 * size and scan values describe the chunk associated with this node.
 *
 * This structure can only be allocated by iffparse.library
 */
struct ContextNode
{
    struct MinNode cn_Node;
    LONG	   cn_ID;
    LONG	   cn_Type;
    LONG	   cn_Size;	/*  Size of this chunk		   */
    LONG	   cn_Scan;	/*  # of bytes read/written so far */
};


/*****************************************************************************/


/* Local context items live in the ContextNode's.  Each class is identified
 * by its lci_Ident code and has a (private) purge vector for when the
 * parent context node is popped.
 *
 * This structure can only be allocated by iffparse.library
 */
struct LocalContextItem
{
    struct MinNode lci_Node;
    ULONG	   lci_ID;
    ULONG	   lci_Type;
    ULONG	   lci_Ident;
};


/*****************************************************************************/


/* StoredProperty: a local context item containing the data stored
 * from a previously encountered property chunk.
 */
struct StoredProperty
{
    LONG sp_Size;
    APTR sp_Data;
};


/*****************************************************************************/


/* Collection Item: the actual node in the collection list at which
 * client will look. The next pointers cross context boundaries so
 * that the complete list is accessable.
 */
struct CollectionItem
{
    struct CollectionItem *ci_Next;
    LONG		   ci_Size;
    APTR		   ci_Data;
};


/*****************************************************************************/


/* Structure returned by OpenClipboard(). You may do CMD_POSTs and such
 * using this structure. However, once you call OpenIFF(), you may not
 * do any more of your own I/O to the clipboard until you call CloseIFF().
 */
struct ClipboardHandle
{
    struct IOClipReq cbh_Req;
    struct MsgPort   cbh_CBport;
    struct MsgPort   cbh_SatisfyPort;
};


/*****************************************************************************/


/* IFF return codes. Most functions return either zero for success or
 * one of these codes. The exceptions are the read/write functions which
 * return positive values for number of bytes or records read or written,
 * or a negative error code. Some of these codes are not errors per sae,
 * but valid conditions such as EOF or EOC (End of Chunk).
 */
#define IFFERR_EOF	  -1L	/* Reached logical end of file	*/
#define IFFERR_EOC	  -2L	/* About to leave context	*/
#define IFFERR_NOSCOPE	  -3L	/* No valid scope for property	*/
#define IFFERR_NOMEM	  -4L	/* Internal memory alloc failed */
#define IFFERR_READ	  -5L	/* Stream read error		*/
#define IFFERR_WRITE	  -6L	/* Stream write error		*/
#define IFFERR_SEEK	  -7L	/* Stream seek error		*/
#define IFFERR_MANGLED	  -8L	/* Data in file is corrupt	*/
#define IFFERR_SYNTAX	  -9L	/* IFF syntax error		*/
#define IFFERR_NOTIFF	  -10L	/* Not an IFF file		*/
#define IFFERR_NOHOOK	  -11L	/* No call-back hook provided	*/
#define IFF_RETURN2CLIENT -12L	/* Client handler normal return */


/*****************************************************************************/


#define MAKE_ID(a,b,c,d)	\
	((ULONG) (a)<<24 | (ULONG) (b)<<16 | (ULONG) (c)<<8 | (ULONG) (d))

/* Universal IFF identifiers */
#define ID_FORM		MAKE_ID('F','O','R','M')
#define ID_LIST		MAKE_ID('L','I','S','T')
#define ID_CAT			MAKE_ID('C','A','T',' ')
#define ID_PROP		MAKE_ID('P','R','O','P')
#define ID_NULL		MAKE_ID(' ',' ',' ',' ')

/* Identifier codes for universally recognized local context items */
#define IFFLCI_PROP		MAKE_ID('p','r','o','p')
#define IFFLCI_COLLECTION	MAKE_ID('c','o','l','l')
#define IFFLCI_ENTRYHANDLER	MAKE_ID('e','n','h','d')
#define IFFLCI_EXITHANDLER	MAKE_ID('e','x','h','d')


/*****************************************************************************/


/* Control modes for ParseIFF() function */
#define IFFPARSE_SCAN	 0L
#define IFFPARSE_STEP	 1L
#define IFFPARSE_RAWSTEP 2L


/*****************************************************************************/


/* Control modes for StoreLocalItem() function */
#define IFFSLI_ROOT  1L  /* Store in default context	  */
#define IFFSLI_TOP   2L  /* Store in current context	  */
#define IFFSLI_PROP  3L  /* Store in topmost FORM or LIST */


/*****************************************************************************/


/* Magic value for writing functions. If you pass this value in as a size
 * to PushChunk() when writing a file, the parser will figure out the
 * size of the chunk for you. If you know the size, is it better to
 * provide as it makes things faster.
 */
#define IFFSIZE_UNKNOWN -1L


/*****************************************************************************/


/* Possible call-back command values */
#define IFFCMD_INIT	0	/* Prepare the stream for a session */
#define IFFCMD_CLEANUP	1	/* Terminate stream session	    */
#define IFFCMD_READ	2	/* Read bytes from stream	    */
#define IFFCMD_WRITE	3	/* Write bytes to stream	    */
#define IFFCMD_SEEK	4	/* Seek on stream		    */
#define IFFCMD_ENTRY	5	/* You just entered a new context   */
#define IFFCMD_EXIT	6	/* You're about to leave a context  */
#define IFFCMD_PURGELCI 7	/* Purge a LocalContextItem	    */


/*****************************************************************************/


/* Obsolete IFFParse definitions, here for source code compatibility only.
 * Please do NOT use in new code.
 *
 * #define IFFPARSE_V37_NAMES_ONLY to remove these older names
 */
#ifndef IFFPARSE_V37_NAMES_ONLY
#define IFFSCC_INIT	IFFCMD_INIT
#define IFFSCC_CLEANUP	IFFCMD_CLEANUP
#define IFFSCC_READ	IFFCMD_READ
#define IFFSCC_WRITE	IFFCMD_WRITE
#define IFFSCC_SEEK	IFFCMD_SEEK
#endif


/*****************************************************************************/


#endif /* IFFPARSE_H */
