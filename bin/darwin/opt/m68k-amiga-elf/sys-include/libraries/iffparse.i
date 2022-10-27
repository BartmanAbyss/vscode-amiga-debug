	IFND LIBRARIES_IFFPARSE_I
LIBRARIES_IFFPARSE_I	SET	1
**
**	$VER: iffparse.i 39.1 (1.6.1992)
**	Includes Release 45.1
**
**	iffparse.library structures and constants
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	(C) Copyright 1989-1990 Stuart Ferguson and Leo L. Schwab
**	All Rights Reserved
**

;---------------------------------------------------------------------------

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_LISTS_I
    INCLUDE "exec/lists.i"
    ENDC

    IFND EXEC_PORTS_I
    INCLUDE "exec/ports.i"
    ENDC

    IFND DEVICES_CLIPBOARD_I
    INCLUDE "devices/clipboard.i"
    ENDC

;---------------------------------------------------------------------------

; Structure associated with an active IFF stream.
; "iff_Stream" is a value used by the client's read/write/seek functions -
; it will not be accessed by the library itself and can have any value
; (could even be a pointer or a BPTR).
;
; This structure can only be allocated by iffparse.library
;
   STRUCTURE IFFHandle,0
        ULONG iff_Stream
        ULONG iff_Flags
        LONG  iff_Depth   ; Depth of context stack.
   LABEL iff_SIZEOF

; Bit masks for "iff_Flags" field
IFFF_READ       equ 0                     ; read mode - default
IFFF_WRITE      equ 1                     ; write mode
IFFF_RWBITS     equ IFFF_READ!IFFF_WRITE  ; read/write bits
IFFF_FSEEK      equ 1<<1                  ; forward seek only
IFFF_RSEEK      equ 1<<2                  ; random seek
IFFF_RESERVED   equ $FFFF0000             ; Don't touch these bits

;---------------------------------------------------------------------------

; When the library calls your stream handler, you'll be passed a pointer
; to this structure as the "message packet".
; NOTE:  ASSEMBLY PREFIX (isc_) DIFFERENT FROM C PREFIX (sc_).
;
   STRUCTURE IFFStreamCmd,0
        LONG isc_Command     ; Operation to be performed (IFFCMD_)
        APTR isc_Buf         ; Pointer to data buffer
        LONG isc_NBytes      ; Number of bytes to be affected
   LABEL isc_SIZEOF

;---------------------------------------------------------------------------

; A node associated with a context on the iff_Stack. Each node
; represents a chunk, the stack representing the current nesting
; of chunks in the open IFF file. Each context node has associated
; local context items in the (private) LocalItems list. The ID, type,
; size and scan values describe the chunk associated with this node.
;
; This structure can only be allocated by iffparse.library
;
   STRUCTURE ContextNode,MLN_SIZE
        LONG cn_ID
        LONG cn_Type
        LONG cn_Size         ; Size of this chunk
        LONG cn_Scan         ; # of bytes read/written so far
   LABEL cn_SIZEOF

;---------------------------------------------------------------------------

; Local context items live in the ContextNode's. Each class is identified
; by its lci_Ident code and has a (private) purge vector for when the
; parent context node is popped.
;
; This structure can only be allocated by iffparse.library
;
   STRUCTURE LocalContextItem,MLN_SIZE
	ULONG lci_ID
	ULONG lci_Type
	ULONG lci_Ident
   LABEL lci_SIZEOF

;---------------------------------------------------------------------------

; StoredProperty: a local context item containing the data stored
; from a previously encountered property chunk.
; NOTE:  ASSEMBLY PREFIX (spr_) DIFFERENT FROM C PREFIX (sp_).
;
   STRUCTURE StoredProperty,0
	LONG spr_Size
	APTR spr_Data
   LABEL spr_SIZEOF

;---------------------------------------------------------------------------

; Collection Item: the actual node in the collection list at which
; client will look. The next pointers cross context boundaries so
; that the complete list is accessable.
; NOTE:  ASSEMBLY PREFIX (cit_) DIFFERENT FROM C PREFIX (ci_).
;
   STRUCTURE CollectionItem,0
	APTR cit_Next
	LONG cit_Size
	APTR cit_Data
   LABEL cit_SIZEOF

;---------------------------------------------------------------------------

; Structure returned by OpenClipboard(). You may do CMD_POSTs and such
; using this structure. However, once you call OpenIFF(), you may not
; do any more of your own I/O to the clipboard until you call CloseIFF().
;
   STRUCTURE ClipboardHandle,iocr_SIZEOF   ; cbh_Reg
	STRUCT cbh_CBport,MP_SIZE
	STRUCT cbh_SatisfyPort,MP_SIZE
   LABEL cbh_SIZEOF

;---------------------------------------------------------------------------

; IFF return codes. Most functions return either zero for success or
; one of these codes. The exceptions are the read/write functions which
; return positive values for number of bytes or records read or written,
; or a negative error code. Some of these codes are not errors per sae,
; but valid conditions such as EOF or EOC (End of Chunk).
;
IFFERR_EOF	  equ -1      ; Reached logical end of file
IFFERR_EOC	  equ -2      ; About to leave context
IFFERR_NOSCOPE	  equ -3      ; No valid scope for property
IFFERR_NOMEM	  equ -4      ; Internal memory alloc failed
IFFERR_READ	  equ -5      ; Stream read error
IFFERR_WRITE	  equ -6      ; Stream write error
IFFERR_SEEK	  equ -7      ; Stream seek error
IFFERR_MANGLED	  equ -8      ; Data in file is corrupt
IFFERR_SYNTAX	  equ -9      ; IFF syntax error
IFFERR_NOTIFF	  equ -10     ; Not an IFF file
IFFERR_NOHOOK	  equ -11     ; No call-back hook provided
IFF_RETURN2CLIENT equ -12     ; Client handler normal return

;---------------------------------------------------------------------------

; Universal IFF identifiers
ID_FORM	     equ 'FORM'
ID_LIST	     equ 'LIST'
ID_CAT		     equ 'CAT '
ID_PROP	     equ 'PROP'
ID_NULL	     equ '    '

; Identifier codes for universally recognized local context items.
IFFLCI_PROP	     equ 'prop'
IFFLCI_COLLECTION    equ 'coll'
IFFLCI_ENTRYHANDLER  equ 'enhd'
IFFLCI_EXITHANDLER   equ 'exhd'

;---------------------------------------------------------------------------

; Control modes for ParseIFF() function
IFFPARSE_SCAN	 equ 0
IFFPARSE_STEP	 equ 1
IFFPARSE_RAWSTEP equ 2

;---------------------------------------------------------------------------

; Control modes for StoreLocalItem() function
IFFSLI_ROOT  equ 1	; Store in default context
IFFSLI_TOP   equ 2	; Store in current context
IFFSLI_PROP  equ 3	; Store in topmost FORM or LIST

;---------------------------------------------------------------------------

; Magic value for writing functions. If you pass this value in as a size
; to PushChunk() when writing a file, the parser will figure out the
; size of the chunk for you. If you know the size, is it better to
; provide as it makes things faster.
;
IFFSIZE_UNKNOWN equ -1

;---------------------------------------------------------------------------

; Possible call-back command values
;
IFFCMD_INIT	equ 0	; Prepare your stream for a session
IFFCMD_CLEANUP	equ 1	; Terminate stream session
IFFCMD_READ	equ 2	; Read bytes from stream
IFFCMD_WRITE	equ 3	; Write bytes to stream
IFFCMD_SEEK	equ 4	; Seek on stream
IFFCMD_ENTRY	equ 5	; You just entered a new context
IFFCMD_EXIT	equ 6	; You're about to leave a context
IFFCMD_PURGELCI equ 7   ; Purge a LocalContextItem


;---------------------------------------------------------------------------

; Obsolete IFFParse definitions, here for source code compatibility only.
; Please do NOT use in new code.
;
; Set IFFPARSE_V37_NAMES_ONLY to remove these older names
;
        IFND IFFPARSE_V37_NAMES_ONLY
IFFSCC_INIT     equ IFFCMD_INIT
IFFSCC_CLEANUP  equ IFFCMD_CLEANUP
IFFSCC_READ     equ IFFCMD_READ
IFFSCC_WRITE    equ IFFCMD_WRITE
IFFSCC_SEEK     equ IFFCMD_SEEK
        ENDC

;---------------------------------------------------------------------------

        ENDC    ; LIBRARIES_IFFPARSE_I
