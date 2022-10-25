	 IFND REXX_STORAGE_I
REXX_STORAGE_I SET    1
**
**	$VER: storage.i 36.8 (8.11.1991)
**	Includes Release 45.1
**
**	Include file for REXX data structures and memory/storage management.
**
**	(C) Copyright 1986,1987,1988,1989,1990 William S. Hawes.
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
**

	 IFND EXEC_TYPES_I
	 INCLUDE "exec/types.i"
	 ENDC

	 IFND EXEC_NODES_I
	 INCLUDE "exec/nodes.i"
	 ENDC

	 IFND EXEC_LISTS_I
	 INCLUDE "exec/lists.i"
	 ENDC

	 IFND EXEC_PORTS_I
	 INCLUDE "exec/ports.i"
	 ENDC

	 IFND EXEC_LIBRARIES_I
	 INCLUDE "exec/libraries.i"
	 ENDC

* The NexxStr structure is used to maintain the internal strings in REXX.
* It includes the buffer area for the string and associated attributes.
* This is actually a variable-length structure; it is allocated for a
* specific length string, and the length is never modified thereafter
* (since it's used for recycling).

         STRUCTURE NexxStr,0
         LONG     ns_Ivalue            ; integer value
         UWORD    ns_Length            ; length in bytes (excl null byte)
         UBYTE    ns_Flags             ; attribute flags
         UBYTE    ns_Hash              ; sum-of-characters hash code
         STRUCT   ns_Buff,8            ; buffer area for strings
         LABEL    NSMINSIZE            ; 16 bytes (minimum)

NXADDLEN EQU      ns_Buff+1            ; structure offset plus null byte
IVALUE   EQU      ns_Ivalue            ; integer value

* String attribute flag bit definitions
NSB_KEEP    EQU   0                    ; permanent string? (in Symbol Table)
NSB_STRING  EQU   1                    ; string form valid?
NSB_NOTNUM  EQU   2                    ; non-numeric?
NSB_NUMBER  EQU   3                    ; a valid number?
NSB_BINARY  EQU   4                    ; integer value saved?
NSB_FLOAT   EQU   5                    ; floating point format?
NSB_EXT     EQU   6                    ; an external string?
NSB_SOURCE  EQU   7                    ; part of the program source?

* The flag form of the string attributes
NSF_KEEP    EQU   1<<NSB_KEEP
NSF_STRING  EQU   1<<NSB_STRING
NSF_NOTNUM  EQU   1<<NSB_NOTNUM
NSF_NUMBER  EQU   1<<NSB_NUMBER
NSF_BINARY  EQU   1<<NSB_BINARY
NSF_FLOAT   EQU   1<<NSB_FLOAT
NSF_EXT     EQU   1<<NSB_EXT
NSF_SOURCE  EQU   1<<NSB_SOURCE

* Combinations of flags
NSF_INTNUM  EQU   (NSF_NUMBER!NSF_BINARY!NSF_STRING)
NSF_DPNUM   EQU   (NSF_NUMBER!NSF_FLOAT)
NSF_ALPHA   EQU   (NSF_NOTNUM!NSF_STRING)
NSF_OWNED   EQU   (NSF_SOURCE!NSF_EXT!NSF_KEEP)
KEEPSTR     EQU   (NSF_STRING!NSF_SOURCE!NSF_NOTNUM)
KEEPNUM     EQU   (NSF_STRING!NSF_SOURCE!NSF_NUMBER!NSF_BINARY)

* The RexxArg structure is identical to the NexxStr structure, but
* is allocated from system memory rather than from internal storage.
* This structure is used for passing arguments to external programs.
* It is usually passed as an "argstring", a pointer to the string buffer.

         STRUCTURE RexxArg,0
         LONG     ra_Size              ; total allocated length
         UWORD    ra_Length            ; length of string
         UBYTE    ra_Flags             ; attribute flags
         UBYTE    ra_Hash              ; hash code
         STRUCT   ra_Buff,8            ; buffer area
         LABEL    RexxArg_SIZEOF       ; size: 16 bytes
; Changed to RexxArg_SIZEOF from ra_SIZEOF

* The RexxMsg structure is used for all communications with Rexx programs.
* It is an EXEC message with a parameter block appended.

         STRUCTURE RexxMsg,MN_SIZE
         APTR     rm_TaskBlock         ; pointer to RexxTask structure
         APTR     rm_LibBase           ; library pointer
         LONG     rm_Action            ; command (action) code
         LONG     rm_Result1           ; return code
         LONG     rm_Result2           ; secondary result
         STRUCT   rm_Args,16*4         ; argument block (ARG0-ARG15)
         APTR     rm_PassPort          ; forwarding port
         APTR     rm_CommAddr          ; host address (port name)
         APTR     rm_FileExt           ; file extension
         LONG     rm_Stdin             ; input stream
         LONG     rm_Stdout            ; output stream
         LONG     rm_avail             ; future expansion
         LABEL    RMSIZEOF             ; size: 128 bytes
; Ranamed from rm_SIZEOF

* Field definitions
ACTION   EQU      rm_Action            ; action code
RESULT1  EQU      rm_Result1           ; primary return/error level
RESULT2  EQU      rm_Result2           ; secondary return/result string
ARG0     EQU      rm_Args              ; start of argblock
ARG1     EQU      rm_Args+4            ; first argument
ARG2     EQU      rm_Args+8            ; second argument

MAXRMARG EQU      15                   ; maximum arguments

* Command (action) codes for message packets
RXCOMM   EQU      $01000000            ; a command-level invocation
RXFUNC   EQU      $02000000            ; a function call
RXCLOSE  EQU      $03000000            ; close the port
RXQUERY  EQU      $04000000            ; query for information
RXADDFH  EQU      $07000000            ; add a function host
RXADDLIB EQU      $08000000            ; add a function library
RXREMLIB EQU      $09000000            ; remove a function library
RXADDCON EQU      $0A000000            ; add/update a ClipList string
RXREMCON EQU      $0B000000            ; remove a ClipList string
RXTCOPN  EQU      $0C000000            ; open the trace console
RXTCCLS  EQU      $0D000000            ; close the trace console

* Command modifier flag bits
RXFB_NOIO   EQU   16                   ; suppress I/O inheritance?
RXFB_RESULT EQU   17                   ; result string expected?
RXFB_STRING EQU   18                   ; program is a "string file"?
RXFB_TOKEN  EQU   19                   ; tokenize the command line?
RXFB_NONRET EQU   20                   ; a "no-return" message?

* Modifier flags
RXFF_RESULT EQU   1<<RXFB_RESULT
RXFF_STRING EQU   1<<RXFB_STRING
RXFF_TOKEN  EQU   1<<RXFB_TOKEN
RXFF_NONRET EQU   1<<RXFB_NONRET

RXCODEMASK  EQU   $FF000000
RXARGMASK   EQU   $0000000F

* The RexxRsrc structure is used to manage global resources.
* The name string for each node is created as a RexxArg structure,
* and the total size of the node is saved in the "rr_Size" field.
* Functions are provided to allocate and release resource nodes.
* If special deletion operations are required, an offset and base can
* be provided in "rr_Func" and "rr_Base", respectively.  This function
* will be called with the base in register A6 and the node in A0.

         STRUCTURE RexxRsrc,LN_SIZE
         WORD     rr_Func              ; "auto-delete" offset
         APTR     rr_Base              ; "auto-delete" base
         LONG     rr_Size              ; total size of node
         LONG     rr_Arg1              ; available ...
         LONG     rr_Arg2              ; available ...
         LABEL    RRSIZEOF             ; size: 32 bytes
; Changed from rr_SIZEOF to RRSIZEOF

* Field definitions
RRTYPE   EQU      LN_TYPE              ; node type
RRNAME   EQU      LN_NAME              ; node name (argstring)
RRSIZE   EQU      rr_Size              ; total size of node

* Resource node types
RRT_ANY  EQU      0                    ; any node type ...
RRT_LIB  EQU      1                    ; a function library
RRT_PORT EQU      2                    ; a public port
RRT_FILE EQU      3                    ; a file IoBuff
RRT_HOST EQU      4                    ; a function host
RRT_CLIP EQU      5                    ; a Clip List node

* The RexxTask structure holds the fields used by REXX to communicate with
* external processes, including the client task.  It includes the global
* data structure (and the base environment).  The structure is passed to
* the newly-created task in its "wake-up" message.

GLOBALSZ EQU      200                  ; space for the Global Data structure

         STRUCTURE RexxTask,GLOBALSZ   ; global data structure
         STRUCT   rt_MsgPort,MP_SIZE   ; message port
         UBYTE    rt_Flags             ; task flag bits
         BYTE     rt_SigBit            ; signal bit

         APTR     rt_ClientID          ; the client's task ID
	 APTR	  rt_MsgPkt	       ; the packet being processed
	 APTR	  rt_TaskID	       ; our task ID
	 APTR	  rt_RexxPort	       ; the REXX public port

	 APTR	  rt_ErrTrap	       ; Error trap address
	 APTR	  rt_StackPtr	       ; stack pointer for traps

	 STRUCT   rt_Header1,LH_SIZE
	 STRUCT   rt_Header2,LH_SIZE
	 STRUCT   rt_Header3,LH_SIZE
	 STRUCT   rt_Header4,LH_SIZE
	 STRUCT   rt_Header5,LH_SIZE
	 LABEL	  rt_SIZEOF

ENVLIST  EQU	  rt_Header1	       ; environment list (internal)
FREELIST EQU	  rt_Header2	       ; freelist (internal)
MEMLIST  EQU	  rt_Header3	       ; allocation list (external)
FILELIST EQU	  rt_Header4	       ; I/O files list (external)
PORTLIST EQU	  rt_Header5	       ; message ports list (external)
NUMLISTS EQU	  5

* Definitions for RexxTask flag bits
RTFB_TRACE  EQU      0		       ; external trace flag
RTFB_HALT   EQU      1		       ; external halt flag
RTFB_SUSP   EQU      2		       ; suspend task?
RTFB_TCUSE  EQU      3		       ; trace console in use?
RTFB_WAIT   EQU      6		       ; waiting for reply?
RTFB_CLOSE  EQU      7		       ; task completed?

* Definitions for memory allocation constants
MEMQUANT EQU	  16		       ; quantum of memory space
MEMMASK  EQU	  $FFFFFFF0	       ; mask for rounding the size

MEMQUICK EQU	  (1<<0)	       ; EXEC flags: MEMF_PUBLIC
MEMCLEAR EQU	  (1<<16)	       ; EXEC flags: MEMF_CLEAR

* The SrcNode is a temporary structure used to hold values destined for a
* segment array.  It is also used to maintain the memory freelist.

	 STRUCTURE SrcNode,0	       ; temporary source data structure
	 APTR	  sn_Succ
	 APTR	  sn_Pred
	 APTR	  sn_Ptr	       ; pointer value
	 LONG	  sn_Size	       ; size of object
	 LABEL	  sn_SIZEOF	       ; size: 16 bytes

	 ENDC
