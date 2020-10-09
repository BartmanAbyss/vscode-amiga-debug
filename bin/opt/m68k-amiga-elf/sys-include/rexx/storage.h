#ifndef REXX_STORAGE_H
#define REXX_STORAGE_H
/*
**	$VER: storage.h 1.4 (8.11.1991)
**	Includes Release 45.1
**
**	Header file to define ARexx data structures.
**
**	(C) Copyright 1986,1987,1988,1989,1990 William S. Hawes
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif

#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* The NexxStr structure is used to maintain the internal strings in REXX.
 * It includes the buffer area for the string and associated attributes.
 * This is actually a variable-length structure; it is allocated for a
 * specific length string, and the length is never modified thereafter
 * (since it's used for recycling).
 */

struct NexxStr {
   LONG     ns_Ivalue;		       /* integer value		*/
   UWORD    ns_Length;		       /* length in bytes (excl null)	*/
   UBYTE    ns_Flags;		       /* attribute flags		*/
   UBYTE    ns_Hash;		       /* hash code			*/
   BYTE     ns_Buff[8];	       /* buffer area for strings	*/
   };				       /* size: 16 bytes (minimum)	*/

#define NXADDLEN 9		       /* offset plus null byte	*/
#define IVALUE(nsPtr) (nsPtr->ns_Ivalue)

/* String attribute flag bit definitions				*/
#define NSB_KEEP     0		       /* permanent string?		*/
#define NSB_STRING   1		       /* string form valid?		*/
#define NSB_NOTNUM   2		       /* non-numeric?			*/
#define NSB_NUMBER   3		       /* a valid number?		*/
#define NSB_BINARY   4		       /* integer value saved?		*/
#define NSB_FLOAT    5		       /* floating point format?	*/
#define NSB_EXT      6		       /* an external string?		*/
#define NSB_SOURCE   7		       /* part of the program source?	*/

/* The flag form of the string attributes				*/
#define NSF_KEEP     (1 << NSB_KEEP  )
#define NSF_STRING   (1 << NSB_STRING)
#define NSF_NOTNUM   (1 << NSB_NOTNUM)
#define NSF_NUMBER   (1 << NSB_NUMBER)
#define NSF_BINARY   (1 << NSB_BINARY)
#define NSF_FLOAT    (1 << NSB_FLOAT )
#define NSF_EXT      (1 << NSB_EXT   )
#define NSF_SOURCE   (1 << NSB_SOURCE)

/* Combinations of flags						*/
#define NSF_INTNUM   (NSF_NUMBER | NSF_BINARY | NSF_STRING)
#define NSF_DPNUM    (NSF_NUMBER | NSF_FLOAT)
#define NSF_ALPHA    (NSF_NOTNUM | NSF_STRING)
#define NSF_OWNED    (NSF_SOURCE | NSF_EXT    | NSF_KEEP)
#define KEEPSTR      (NSF_STRING | NSF_SOURCE | NSF_NOTNUM)
#define KEEPNUM      (NSF_STRING | NSF_SOURCE | NSF_NUMBER | NSF_BINARY)

/* The RexxArg structure is identical to the NexxStr structure, but
 * is allocated from system memory rather than from internal storage.
 * This structure is used for passing arguments to external programs.
 * It is usually passed as an "argstring", a pointer to the string buffer.
 */

struct RexxArg {
   LONG     ra_Size;		       /* total allocated length	*/
   UWORD    ra_Length;		       /* length of string		*/
   UBYTE    ra_Flags;		       /* attribute flags		*/
   UBYTE    ra_Hash;		       /* hash code			*/
   BYTE     ra_Buff[8];	       /* buffer area			*/
   };				       /* size: 16 bytes (minimum)	*/

/* The RexxMsg structure is used for all communications with REXX
 * programs.  It is an EXEC message with a parameter block appended.
 */

struct RexxMsg {
   struct Message rm_Node;	       /* EXEC message structure	*/
   APTR     rm_TaskBlock;	       /* global structure (private)	*/
   APTR     rm_LibBase;	       /* library base (private)	*/
   LONG     rm_Action;		       /* command (action) code	*/
   LONG     rm_Result1;	       /* primary result (return code)	*/
   LONG     rm_Result2;	       /* secondary result		*/
   STRPTR   rm_Args[16];	       /* argument block (ARG0-ARG15)	*/

   struct MsgPort *rm_PassPort;        /* forwarding port		*/
   STRPTR   rm_CommAddr;	       /* host address (port name)	*/
   STRPTR   rm_FileExt;	       /* file extension		*/
   LONG     rm_Stdin;		       /* input stream (filehandle)	*/
   LONG     rm_Stdout;		       /* output stream (filehandle)	*/
   LONG     rm_avail;		       /* future expansion		*/
   };				       /* size: 128 bytes		*/

/* Field definitions							*/
#define ARG0(rmp) (rmp->rm_Args[0])    /* start of argblock		*/
#define ARG1(rmp) (rmp->rm_Args[1])    /* first argument		*/
#define ARG2(rmp) (rmp->rm_Args[2])    /* second argument		*/

#define MAXRMARG  15		       /* maximum arguments		*/

/* Command (action) codes for message packets				*/
#define RXCOMM	  0x01000000	       /* a command-level invocation	*/
#define RXFUNC	  0x02000000	       /* a function call		*/
#define RXCLOSE   0x03000000	       /* close the REXX server	*/
#define RXQUERY   0x04000000	       /* query for information	*/
#define RXADDFH   0x07000000	       /* add a function host		*/
#define RXADDLIB  0x08000000	       /* add a function library	*/
#define RXREMLIB  0x09000000	       /* remove a function library	*/
#define RXADDCON  0x0A000000	       /* add/update a ClipList string	*/
#define RXREMCON  0x0B000000	       /* remove a ClipList string	*/
#define RXTCOPN   0x0C000000	       /* open the trace console	*/
#define RXTCCLS   0x0D000000	       /* close the trace console	*/

/* Command modifier flag bits						*/
#define RXFB_NOIO    16	       /* suppress I/O inheritance?	*/
#define RXFB_RESULT  17	       /* result string expected?	*/
#define RXFB_STRING  18	       /* program is a "string file"?	*/
#define RXFB_TOKEN   19	       /* tokenize the command line?	*/
#define RXFB_NONRET  20	       /* a "no-return" message?	*/

/* The flag form of the command modifiers				*/
#define RXFF_NOIO    (1L << RXFB_NOIO  )
#define RXFF_RESULT  (1L << RXFB_RESULT)
#define RXFF_STRING  (1L << RXFB_STRING)
#define RXFF_TOKEN   (1L << RXFB_TOKEN )
#define RXFF_NONRET  (1L << RXFB_NONRET)

#define RXCODEMASK   0xFF000000
#define RXARGMASK    0x0000000F

/* The RexxRsrc structure is used to manage global resources.  Each node
 * has a name string created as a RexxArg structure, and the total size
 * of the node is saved in the "rr_Size" field.  The REXX systems library
 * provides functions to allocate and release resource nodes.  If special
 * deletion operations are required, an offset and base can be provided in
 * "rr_Func" and "rr_Base", respectively.  This "autodelete" function will
 * be called with the base in register A6 and the node in A0.
 */

struct RexxRsrc {
   struct Node rr_Node;
   WORD     rr_Func;		       /* "auto-delete" offset		*/
   APTR     rr_Base;		       /* "auto-delete" base		*/
   LONG     rr_Size;		       /* total size of node		*/
   LONG     rr_Arg1;		       /* available ...		*/
   LONG     rr_Arg2;		       /* available ...		*/
   };				       /* size: 32 bytes		*/

/* Resource node types							*/
#define RRT_ANY      0		       /* any node type ...		*/
#define RRT_LIB      1		       /* a function library		*/
#define RRT_PORT     2		       /* a public port		*/
#define RRT_FILE     3		       /* a file IoBuff		*/
#define RRT_HOST     4		       /* a function host		*/
#define RRT_CLIP     5		       /* a Clip List node		*/

/* The RexxTask structure holds the fields used by REXX to communicate with
 * external processes, including the client task.  It includes the global
 * data structure (and the base environment).  The structure is passed to
 * the newly-created task in its "wake-up" message.
 */

#define GLOBALSZ  200		       /* total size of GlobalData	*/

struct RexxTask {
   BYTE     rt_Global[GLOBALSZ];       /* global data structure	*/
   struct MsgPort rt_MsgPort;	       /* global message port		*/
   UBYTE    rt_Flags;		       /* task flag bits		*/
   BYTE     rt_SigBit;		       /* signal bit			*/

   APTR     rt_ClientID;	       /* the client's task ID		*/
   APTR     rt_MsgPkt;		       /* the packet being processed	*/
   APTR     rt_TaskID;		       /* our task ID			*/
   APTR     rt_RexxPort;	       /* the REXX public port		*/

   APTR     rt_ErrTrap;	       /* Error trap address		*/
   APTR     rt_StackPtr;	       /* stack pointer for traps	*/

   struct List rt_Header1;	       /* Environment list		*/
   struct List rt_Header2;	       /* Memory freelist		*/
   struct List rt_Header3;	       /* Memory allocation list	*/
   struct List rt_Header4;	       /* Files list			*/
   struct List rt_Header5;	       /* Message Ports List		*/
   };

/* Definitions for RexxTask flag bits					*/
#define RTFB_TRACE   0		       /* external trace flag		*/
#define RTFB_HALT    1		       /* external halt flag		*/
#define RTFB_SUSP    2		       /* suspend task?		*/
#define RTFB_TCUSE   3		       /* trace console in use?	*/
#define RTFB_WAIT    6		       /* waiting for reply?		*/
#define RTFB_CLOSE   7		       /* task completed?		*/

/* Definitions for memory allocation constants				*/
#define MEMQUANT  16L		       /* quantum of memory space	*/
#define MEMMASK   0xFFFFFFF0	       /* mask for rounding the size	*/

#define MEMQUICK  (1L << 0 )	       /* EXEC flags: MEMF_PUBLIC	*/
#define MEMCLEAR  (1L << 16)	       /* EXEC flags: MEMF_CLEAR	*/

/* The SrcNode is a temporary structure used to hold values destined for
 * a segment array.  It is also used to maintain the memory freelist.
 */

struct SrcNode {
   struct SrcNode *sn_Succ;	       /* next node			*/
   struct SrcNode *sn_Pred;	       /* previous node		*/
   APTR     sn_Ptr;		       /* pointer value		*/
   LONG     sn_Size;		       /* size of object		*/
   };				       /* size: 16 bytes		*/

#endif
