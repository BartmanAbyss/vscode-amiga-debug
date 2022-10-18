	IFND INTUITION_CLASSES_I
INTUITION_CLASSES_I SET 1
**
**  $VER: classes.i 40.0 (15.2.1994)
**  Includes Release 45.1
**
**  Only used by class implementors
**
**  (C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**

;******************************************************************************

    IFND EXEC_TYPES_I
    INCLUDE "exec/types.i"
    ENDC

    IFND EXEC_LIBRARIES_I
    INCLUDE "exec/libraries.i"
    ENDC

    IFND UTILITY_HOOKS_I
    INCLUDE "utility/hooks.i"
    ENDC

    IFND INTUITION_CLASSUSR_I
    INCLUDE "intuition/classusr.i"
    ENDC

;******************************************************************************
;***************** "White Box" access to struct IClass ************************
;******************************************************************************

 STRUCTURE ICLASS,0
    STRUCT	 cl_Dispatcher,h_SIZEOF		; Class dispatcher
    ULONG	 cl_Reserved			; Must be 0
    APTR	 cl_Super			; Pointer to superclass
    APTR	 cl_ID				; Class ID

    UWORD	 cl_InstOffset			; Offset of instance data
    UWORD	 cl_InstSize			; Size of instance data

    ULONG	 cl_UserData			; Class global data
    ULONG	 cl_SubclassCount		; Number of subclasses
    ULONG	 cl_ObjectCount			; Number of objects
    ULONG	 cl_Flags

    ; no iclass_SIZEOF because only Intuition allocates these

;******************************************************************************

; defined values of cl_Flags
CLB_INLIST EQU 0
CLF_INLIST EQU $00000001	; class in in public class list

; see classes.h for common calculations (sorry, no macros yet)

;*****************************************************************************
;***************** "White box" access to struct _Object **********************
;*****************************************************************************

; We have this, the instance data of the root class, PRECEDING the "object".
; This is so that Gadget objects are Gadget pointers, and so on.  If this
; structure grows, it will always have o_Class at the end, so the macro
; OCLASS(o) will always have the same offset back from the pointer returned
; from NewObject().
;
; This data structure is subject to change.  Do not use the o_Node embedded
; structure.

 STRUCTURE _Object,0
    STRUCT	 o_Node,MLN_SIZE
    APTR	 o_Class

    ; this value may change but difference between it and offset of o_Class
    ; will remain constant
    LABEL	 _object_SIZEOF

;******************************************************************************

; BOOPSI class libraries should use this structure as the base for their
; library data.  This allows developers to obtain the class pointer for
; performing object-less inquiries.

  STRUCTURE ClassLibrary,0
    STRUCT	 cl_Lib,LIB_SIZE	; Embedded library
    UWORD	 cl_Pad			; Align the structure
    APTR	 cl_Class		; Class pointer
    LABEL	 ClassLibrary_SIZEOF

;******************************************************************************

    ENDC
