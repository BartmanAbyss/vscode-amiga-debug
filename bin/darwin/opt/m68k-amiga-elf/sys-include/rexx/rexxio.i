	 IFND	  REXX_REXXIO_I
REXX_REXXIO_I SET      1
**
**	$VER: rexxio.i 36.8 (8.11.1991)
**	Includes Release 45.1
**
**	Include file for Input/Output related structures
**
**	(C) Copyright 1986,1987,1988,1989,1990 William S. Hawes.
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
**

	 IFND	  REXX_STORAGE_I
	 INCLUDE  "rexx/storage.i"
	 ENDC

RXBUFFSZ EQU	  204		       ; buffer length

* The IoBuff is a resource node used to maintain the File List.  Nodes are
* allocated and linked into the list whenever a file is opened.

	 STRUCTURE IoBuff,RRSIZEOF     ; structure for files/strings
	 APTR	  iobRpt	       ; read/write pointer
	 LONG	  iobRct	       ; character count
	 LONG	  iobDFH	       ; DOS filehandle
	 APTR	  iobLock	       ; DOS lock
	 LONG	  iobBct	       ; buffer length
	 STRUCT   iobArea,RXBUFFSZ     ; buffer area
	 LABEL	  iobSIZEOF	       ; size: 256 bytes

IOBNAME  EQU	  LN_NAME	       ; logical name
IOBMODE  EQU	  rr_Arg1	       ; access mode
IOBEOF	 EQU	  rr_Arg1+1	       ; EOF flag
IOBPOS	 EQU	  rr_Arg2	       ; current position

* Access mode definitions
RXIO_EXIST  EQU      -1	       ; an existing filehandle
RXIO_STRF   EQU      0		       ; a "string file"
RXIO_READ   EQU      1		       ; read-only access
RXIO_WRITE  EQU      2		       ; write mode
RXIO_APPEND EQU      3		       ; append mode (existing file)

* Offset anchors for SeekF()
RXIO_BEGIN  EQU      -1	       ; relative to start
RXIO_CURR   EQU      0		       ; relative to current position
RXIO_END    EQU      1		       ; relative to end

* The Library List contains just plain resource nodes.
LLOFFSET EQU	  rr_Arg1	       ; "Query" offset
LLVERS	 EQU	  rr_Arg2	       ; library version

* The RexxClipNode structure is used to maintain the Clip List.  The
* value string is stored as an argstring in the rr_Arg1 field.
CLVALUE  EQU	  rr_Arg1	       ; value string

* A message port structure, maintained as a resource node.
* The ReplyList holds packets that have been received but haven't been
* replied.

         STRUCTURE RexxMsgPort,RRSIZEOF
         STRUCT   rmp_Port,MP_SIZE           ; the message port
         STRUCT   rmp_ReplyList,LH_SIZE      ; messages awaiting reply
         LABEL    rmp_SIZEOF

* Device types
DT_DEV   EQU      0                    ; a device
DT_DIR   EQU      1                    ; an ASSIGNed directory
DT_VOL   EQU      2                    ; a volume

* Private packet types
ACTION_STACK   EQU   2002              ; stack a line
ACTION_QUEUE   EQU   2003              ; queue a line

         ENDC
