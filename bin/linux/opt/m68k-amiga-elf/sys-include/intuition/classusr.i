    IFND INTUITION_CLASSUSR_I
INTUITION_CLASSUSR_I SET 1
**
** $VER: classusr.i 38.1 (11.11.1991)
** Includes Release 45.1
**
** For application users of Intuition object classes
**
**  (C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**



    IFND UTILITY_HOOKS_I
    INCLUDE "utility/hooks.i"
    ENDC

* beginning of "method message" passed to class dispatchers
 STRUCTURE Msg,0
    ULONG msg_MethodID
    ; method-specific data follows, some examples below

* For now, see the class id's for Intuition basic classes
* defined in classusr.h.  Sorry there aren't macros for the strings yet.

* dispatched method ID's
* NOTE: Applications should use Intuition entry points, not these,
* for NewObject, DisposeObject, SetAttrs, SetGadgetAttrs, and GetAttr.

    ENUM $101
    EITEM OM_NEW		; 'object' parameter is "true class"
    EITEM OM_DISPOSE		; delete self (no parameters)
    EITEM OM_SET		; set attribute (list)
    EITEM OM_GET		; return single attribute value	
    EITEM OM_ADDTAIL		; add self to a List
    EITEM OM_REMOVE		; remove self from list (no parameters)
    EITEM OM_NOTIFY		; send to self: notify dependents
    EITEM OM_UPDATE		; notification message from someone
    EITEM OM_ADDMEMBER		; used by various classes with lists
    EITEM OM_REMMEMBER		; used by various classes with lists

* Parameter "Messages" passed to methods.
* NOTE: All of these parameter packets
* start off by the longword MethodID, but
* we don't redefine it for each structure.

* OM_NEW and OM_SET
 STRUCTURE opSet,4
    ; ULONG		MethodID
    APTR		ops_AttrList	; new attributes
    APTR		ops_GInfo	; always there for gadgets,
					; but will be NULL for OM_NEW

* OM_NOTIFY, and OM_UPDATE
 STRUCTURE opUpdate,4
    ; ULONG		MethodID
    APTR		opu_AttrList	; new attributes
    APTR		opu_GInfo	; always there for gadgets,
					; but will be NULL for OM_NEW
    ULONG		opu_Flags	; defined below

* this flag means that the update message is being issued from
* something like an active gadget, ala GACT_FOLLOWMOUSE.  When
* the gadget goes inactive, it will issue a final update
* message with this bit cleared.  Examples of use are for
* GACT_FOLLOWMOUSE equivalents for propgadclass, and repeat strobes
* for buttons.

OPUB_INTERIM	EQU	0
OPUF_INTERIM	EQU	1

* OM_GET
 STRUCTURE opGet,4
    ; ULONG		MethodID
    ULONG		opg_AttrID
    APTR		opg_Storage	; may be other types, but "int"
					; types are all ULONG

* OM_ADDTAIL
 STRUCTURE opAddTail,4
    ; ULONG		MethodID
    APTR		opat_List

* OM_ADDMEMBER, OM_REMMEMBER

 STRUCTURE opMember,4
    ; ULONG		MethodID
    APTR		opam_Object

 ENDC	; IFND INTUITION_CLASSUSR_I
