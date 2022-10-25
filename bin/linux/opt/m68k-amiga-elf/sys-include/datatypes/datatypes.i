	IFND DATATYPES_DATATYPES_I
DATATYPES_DATATYPES_I	SET	1
**
**	$VER: datatypes.i 39.4 (22.4.1993)
**	Includes Release 45.1
**
**	Copyright © 1991-2001 Amiga, Inc.
**	    All Rights Reserved
**

;------------------------------------------------------------------------------

	IFND  EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC

	IFND  EXEC_LISTS_I
	INCLUDE "exec/lists.i"
	ENDC

	IFND  EXEC_NODES_I
	INCLUDE "exec/nodes.i"
	ENDC

	IFND  EXEC_LIBRARIES_I
	INCLUDE "exec/libraries.i"
	ENDC

	IFND  LIBRARIES_IFFPARSE_I
	INCLUDE "libraries/iffparse.i"
	ENDC

	IFND	DOS_DOS_I
	INCLUDE "dos/dos.i"
	ENDC

;------------------------------------------------------------------------------

ID_DTYP		equ	'DTYP'

;------------------------------------------------------------------------------

ID_DTHD		equ	'DTHD'

    STRUCTURE DataTypeHeader,0

	ULONG	dth_Name				; Descriptive name of the data type
	ULONG	dth_BaseName				; Base name of the data type
	ULONG	dth_Pattern				; Match pattern for the file name.
	APTR	dth_Mask				; Comparision mask
	ULONG	dth_GroupID				; Group that the data type is in
	ULONG	dth_ID					; ID for data type (same as IFF FORM type
	WORD	dth_MaskLen				; Length of comparision mask
	WORD	dth_Pad					; Unused at present (must be 0)
	UWORD	dth_Flags				; Flags
	UWORD	dth_Priority				; Priority

    LABEL DataTypeHeader_SIZEOF

; Basic data type
DTF_TYPE_MASK	equ	$000F
DTF_BINARY	equ	$0000
DTF_ASCII	equ	$0001
DTF_IFF		equ	$0002
DTF_MISC	equ	$0003

; Set if case in mask is important
DTF_CASE	equ	$0010

; Reserved for system use
DTF_SYSTEM1	equ	$1000

;------------------------------------------------------------------------------
;
; GROUP ID and ID
;
; This is used for filtering out objects that you don't want.  For
; example, you could make a filter for the ASL file requester so
; that it only showed the files that were pictures, or even to
; narrow it down to only show files that were ILBM pictures.
;
; Note that the Group ID's are in lower case, and always the first
; four characters of the word.
;
; For ID's; If it is an IFF file, then the ID is the same as the
; FORM type.  If it isn't an IFF file, then the ID would be the
; first four characters of name for the file type.
;
;------------------------------------------------------------------------------

; System file, such as; directory, executable, library, device, font, etc.
GID_SYSTEM	equ	'syst'

; Formatted or unformatted text
GID_TEXT	equ	'text'

; Formatted text with graphics or other DataTypes
GID_DOCUMENT	equ	'docu'

; Sound
GID_SOUND	equ	'soun'

; Musical instruments used for musical scores
GID_INSTRUMENT	equ	'inst'

; Musical score
GID_MUSIC	equ	'musi'

; Still picture
GID_PICTURE	equ	'pict'

; Animated picture
GID_ANIMATION	equ	'anim'

; Animation with audio track
GID_MOVIE	equ	'movi'

;------------------------------------------------------------------------------

; A code chunk contains an embedded executable that can be loaded with InternalLoadSeg.
ID_CODE		equ	'DTCD'

; DataTypes comparision hook context (Read-Only).  This is the
; argument that is passed to a custom comparision routine.
    STRUCTURE DTHookContext,0

	; Libraries that are already opened for your use
	APTR	dthc_SysBase				; exec.library
	APTR	dthc_DOSBase				; dos.library
	APTR	dthc_IFFParseBase			; iffparse.library
	APTR	dthc_UtilityBase			; utility.library

	; File context
	BPTR	dthc_Lock;				; Lock on the file
	APTR	dthc_FIB;				; Pointer to a FileInfoBlock
	BPTR	dthc_FileHandle				; Pointer to the file handle (may be NULL)
	APTR	dthc_IFF				; Pointer to an IFFHandle (may be NULL)
	APTR	dthc_Buffer				; Pointer to a prefilled buffer
	ULONG	dthc_BufferLength			; Length of the buffer

    LABEL DTHookContext_SIZEOF

;------------------------------------------------------------------------------

ID_TOOL		equ	'DTTL'

    STRUCTURE Tool,0
	UWORD	tn_Which				; Which tool is this
	UWORD	tn_Flags				; Flags
	APTR	tn_Program				; Application to use

    LABEL Tool_SIZEOF

TW_INFO		equ	1
TW_BROWSE	equ	2
TW_EDIT		equ	3
TW_PRINT	equ	4
TW_MAIL		equ	5

TF_LAUNCH_MASK	equ	$000F
TF_SHELL	equ	$0001
TF_WORKBENCH	equ	$0002
TF_RX		equ	$0003

;------------------------------------------------------------------------------

ID_TAGS		equ	'DTTG'

    STRUCTURE DataType,0
	STRUCT	dtn_Node1,(LN_SIZE)			; Reserved for system use
	STRUCT	dtn_Node2,(LN_SIZE)			; Reserved for system use
	APTR	dtn_Header				; Pointer to DataTypeHeader
	STRUCT	dtn_ToolList,(LH_SIZE)			; List of tool nodes
	APTR	dtn_FunctionName			; Name of comparision routine
	APTR	dtn_AttrList				; Object creation tags
	ULONG	dtn_Length				; Length of the memory block

    LABEL DataType_SIZEOF

;------------------------------------------------------------------------------

    STRUCTURE ToolNode,0
	STRUCT	tn_Node,(LN_SIZE)			; Embedded node
	STRUCT	tn_Tool,(Tool_SIZEOF)			; Embedded tool
	ULONG	tn_Length				; Length of memory block
    LABEL ToolNode_SIZEOF

;------------------------------------------------------------------------------

ID_NAME		equ	'NAME'

;------------------------------------------------------------------------------

; Text ID's
DTERROR_UNKNOWN_DATATYPE	equ	2000
DTERROR_COULDNT_SAVE		equ	2001
DTERROR_COULDNT_OPEN		equ	2002
DTERROR_COULDNT_SEND_MESSAGE	equ	2003

; New for V40
DTERROR_COULDNT_OPEN_CLIPBOARD	equ	2004
DTERROR_Reserved		equ	2005
DTERROR_UNKNOWN_COMPRESSION	equ	2006
DTERROR_NOT_ENOUGH_DATA		equ	2007
DTERROR_INVALID_DATA		equ	2008

; New for V44
DTERROR_NOT_AVAILABLE		equ	2009

; Offset for types
DTMSG_TYPE_OFFSET		equ	2100

;------------------------------------------------------------------------------

	ENDC	; DATATYPES_DATATYPES_I
