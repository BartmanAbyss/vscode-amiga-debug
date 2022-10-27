	IFND LIBRARIES_AMIGAGUIDE_I
LIBRARIES_AMIGAGUIDE_I	SET	1
**
**	$VER: amigaguide.i 44.1 (14.3.99)
**	Includes Release 45.1
**
**	Interface definitions for AmigaGuide(tm) hypertext system
**
**	Copyright © 1990-2001 Amiga, Inc.
**	    All Rights Reserved
**

;------------------------------------------------------------------------------

	IFND EXEC_TYPES_I
	INCLUDE "exec/types.i"
	ENDC ;* EXEC_TYPES_I

	IFND EXEC_LISTS_I
	INCLUDE "exec/lists.i"
	ENDC ;* EXEC_LISTS_I

	IFND EXEC_NODES_I
	INCLUDE "exec/nodes.i"
	ENDC ;* EXEC_NODES_I

	IFND EXEC_SEMAPHORES_I
	INCLUDE "exec/semaphores.i"
	ENDC

	IFND INTUITION_INTUITION_I
	INCLUDE "intuition/intuition.i"
	ENDC

	IFND INTUITION_SCREENS_I
	INCLUDE "intuition/screens.i"
	ENDC

	IFND DO_DOS_I
	INCLUDE "dos/dos.i"
	ENDC

	IFND UTILITY_TAGITEM_I
	INCLUDE "utility/tagitem.i"
	ENDC

	IFND UTILITY_HOOKS_I
	INCLUDE "utility/hooks.i"
	ENDC

;------------------------------------------------------------------------------

	IFND APSH_TOOL_ID
APSH_TOOL_ID		equ	11000
StartupMsgID		equ	(APSH_TOOL_ID+1)	; Startup message
LoginToolID		equ	(APSH_TOOL_ID+2)	; Login a tool SIPC port
LogoutToolID		equ	(APSH_TOOL_ID+3)	; Logout a tool SIPC port
ShutdownMsgID		equ	(APSH_TOOL_ID+4)	; Shutdown message
ActivateToolID		equ	(APSH_TOOL_ID+5)	; Activate tool
DeactivateToolID	equ	(APSH_TOOL_ID+6)	; Deactivate tool
ActiveToolID		equ	(APSH_TOOL_ID+7)	; Tool Active
InactiveToolID		equ	(APSH_TOOL_ID+8)	; Tool Inactive
ToolStatusID		equ	(APSH_TOOL_ID+9)	; Status message
ToolCmdID		equ	(APSH_TOOL_ID+10)	; Tool command message
ToolCmdReplyID		equ	(APSH_TOOL_ID+11)	; Reply to tool command
ShutdownToolID		equ	(APSH_TOOL_ID+12)	; Shutdown tool
	ENDC

;------------------------------------------------------------------------------

; Attributes accepted by GetAmigaGuideAttr()
AGA_Dummy		equ	(TAG_USER)
AGA_Path		equ	(AGA_Dummy+1)
AGA_XRefList		equ	(AGA_Dummy+2)
AGA_Activate		equ	(AGA_Dummy+3)
AGA_Context		equ	(AGA_Dummy+4)

AGA_HelpGroup		equ	(AGA_Dummy+5)
    ; (ULONG) unique window identifier

AGA_ARexxPort		equ	(AGA_Dummy+9)
    ; (struct MsgPort *) Pointer to the ARexx message port (V40)

AGA_ARexxPortName	equ	(AGA_Dummy+10)
   ; (STRPTR) Used to specify the ARexx port name (V40) (not copied)

AGA_Secure		equ	(AGA_Dummy+11)
   ; (BOOL) Disable "ONOPEN", "ONCLOSE" and "LINK RX", "LINK RXS", "LINK SYSTEM" commands (V41)

;------------------------------------------------------------------------------

    STRUCTURE AmigaGuideMsg,0
	STRUCT		agm_Msg,MN_SIZE			; Embedded Exec message structure
	ULONG		agm_Type;			; Type of message
	APTR		agm_Data;			; Pointer to message data
	ULONG		agm_DSize;			; Size of message data
	ULONG		agm_DType;			; Type of message data
	ULONG		agm_Pri_Ret;			; Primary return value
	ULONG		agm_Sec_Ret;			; Secondary return value
	APTR		agm_System1;
	APTR		agm_System2;
    LABEL AmigaGuideMsg_SIZEOF

;------------------------------------------------------------------------------

; Allocation description structure
    STRUCTURE NewAmigaGuide,0
	BPTR		nag_Lock			; Lock on the document directory
	APTR		nag_Name			; Name of document file
	APTR		nag_Screen			; Screen to place windows within
	APTR		nag_PubScreen			; Public screen name to open on
	APTR		nag_HostPort			; Application's ARexx port name
	APTR		nag_ClientPort			; Name to assign to the clients ARexx port
	APTR		nag_BaseName			; Base name of the application
	ULONG		nag_Flags			; Flags
	APTR		nag_Context			; NULL terminated context table
	APTR		nag_Node			; Node to align on first (defaults to Main)
	LONG		nag_Line			; Line to align on
	APTR		nag_Extens			; Tag array extens
	APTR		nag_Client			; Private! MUST be NULL
    LABEL NewAmigaGuide_SIZEOF

; nag_Flags
    BITDEF HT,LOAD_INDEX,0				; Force load the index at init time
    BITDEF HT,LOAD_ALL,1				; Force load the entire database at init
    BITDEF HT,CACHE_NODE,2				; Cache each node as visited
    BITDEF HT,CACHE_DB,3				; Keep the buffers around until expunge
    BITDEF HT,UNIQUE,4					; Unique ARexx port name
    BITDEF HT,NOACTIVATE,5				; Don't activate window

;------------------------------------------------------------------------------

HTFC_SYSGADS		equ	$80000000

;------------------------------------------------------------------------------

; Callback function ID's
HTH_OPEN		equ	0
HTH_CLOSE		equ	1

;------------------------------------------------------------------------------

; Error message ID's
HTERR_NOT_ENOUGH_MEMORY		equ	100
HTERR_CANT_OPEN_DATABASE	equ	101
HTERR_CANT_FIND_NODE		equ	102
HTERR_CANT_OPEN_NODE		equ	103
HTERR_CANT_OPEN_WINDOW		equ	104
HTERR_INVALID_COMMAND		equ	105
HTERR_CANT_COMPLETE		equ	106
HTERR_PORT_CLOSED		equ	107
HTERR_CANT_CREATE_PORT		equ	108
HTERR_KEYWORD_NOT_FOUND		equ	113

;------------------------------------------------------------------------------

; Cross reference node
    STRUCTURE XRef,0
	STRUCT		xr_Node,LN_SIZE			; Embedded node
	UWORD		xr_Pad				; Padding
	APTR		xr_DF				; Document defined in (not used)
	APTR		xr_File				; Name of document file
	APTR		xr_Name				; Name of item
	LONG		xr_Line				; Line defined at
    LABEL XRef_SIZEOF

;------------------------------------------------------------------------------

; Types of cross reference nodes
XR_GENERIC	equ	0
XR_FUNCTION	equ	1
XR_COMMAND	equ	2
XR_INCLUDE	equ	3
XR_MACRO	equ	4
XR_STRUCT	equ	5
XR_FIELD	equ	6
XR_TYPEDEF	equ	7
XR_DEFINE	equ	8

;------------------------------------------------------------------------------

; Callback handle
    STRUCTURE AmigaGuideHost,0
	STRUCT		agh_Dispatcher,h_SIZEOF		; Dispatcher
	ULONG		agh_Reserved			; Must be 0
	ULONG		agh_Flags			; Control flags
	ULONG		agh_UseCnt			; Number of open nodes
	APTR		agh_SystemData			; Reserved for system use
	APTR		agh_UserData			; Application use
    LABEL AmigaGuideHost_SIZEOF

;------------------------------------------------------------------------------

; Methods
HM_FINDNODE	equ	1
HM_OPENNODE	equ	2
HM_CLOSENODE	equ	3
HM_EXPUNGE	equ	10				; Expunge DataBase


;------------------------------------------------------------------------------

; HM_FINDNODE
    STRUCTURE opFindHost,0
	; ULONG		MethodID
	APTR		ofh_Attrs			; R: Additional attributes
	APTR		ofh_Node			; R: Name of node
	APTR		ofh_TOC				; W: Table of Contents
	APTR		ofh_Title			; W: Title to give to the node
	APTR		ofh_Next			; W: Next node to browse to
	APTR		ofh_Prev			; W: Previous node to browse to

;------------------------------------------------------------------------------

; HM_OPENNODE, HM_CLOSENODE
    STRUCTURE opNodeIO,0
	; ULONG		MethodID
	APTR		onm_Attrs			; R: Additional attributes
	APTR		onm_Node			; R: Node name and arguments
	APTR		onm_FileName			; W: File name buffer
	APTR		onm_DocBuffer			; W: Node buffer
	ULONG		onm_BuffLen			; W: Size of buffer
	ULONG		onm_Flags			; RW: Control flags

; onm_Flags
    BITDEF HTN,KEEP,0					; Don't flush this node until database is closed.
    BITDEF HTN,RESERVED1,1				; Reserved for system use
    BITDEF HTN,RESERVED2,2				; Reserved for system use
    BITDEF HTN,ASCII,3					; Node is straight ASCII
    BITDEF HTN,RESERVED3,4				; Reserved for system use
    BITDEF HTN,CLEAN,5					; Remove the node from the database
    BITDEF HTN,DONE,6					; Done with node

; onm_Attrs
HTNA_Screen	equ	(TAG_USER+1)			; Screen that window resides in
HTNA_Pens	equ	(TAG_USER+2)			; Pen array (from DrawInfo)
HTNA_Rectangle	equ	(TAG_USER+3)			; Window box

;------------------------------------------------------------------------------

; HM_EXPUNGE
    STRUCTURE opExpungeNode,0
	; ULONG		MethodID
	APTR		oen_Attrs			; R: Additional attributes

;------------------------------------------------------------------------------

	ENDC ;* LIBRARIES_AMIGAGUIDE_I
