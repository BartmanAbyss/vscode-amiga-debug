    IFND INTUITION_ICCLASS_I
INTUITION_ICCLASS_I SET 1
**
**  $VER: icclass.i 38.2 (7.6.1993)
**  Includes Release 45.1
**
**  Gadget/object interconnection classes
**
**  (C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**


    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

ICM_SETLOOP   EQU $402	; set/increment loop counter
ICM_CLEARLOOP EQU $403	; clear/decrement loop counter
ICM_CHECKLOOP EQU $404	; set/increment loop

* no arguments for ICM_SETLOOP, ICM_CLEARLOOP, ICM_CHECKLOOP

* interconnection attributes used by icclass, modelclass, and gadgetclass

ICA_Dummy EQU		TAG_USER+$40000
ICA_TARGET EQU		(ICA_Dummy+1)	; interconnection target
ICA_MAP EQU		(ICA_Dummy+2)	; interconnection map tagitem list
ICSPECIAL_CODE EQU	(ICA_Dummy+3)	; a "pseudo-attribute",  see below.

* Normally, the value for ICA_TARGET is some object pointer,
* but if you specify the special value ICTARGET_IDCMP, notification
* will be send as an IDCMP_IDCMPUPDATE message to the appropriate window's
* IDCMP port.  See the definition of IDCMP_IDCMPUPDATE. 
*
* When you specify ICTARGET_IDCMP for ICA_TARGET, the map you
* specify will be applied to derive the attribute list that is
* sent with the IDCMP_IDCMPUPDATE message.  If you specify a map list
* which results in the attribute tag id ICSPECIAL_CODE, the
* lower sixteen bits of the corresponding ti_Data value will
* be copied into the Code field of the IDCMP_IDCMPUPDATE IntuiMessage.

ICTARGET_IDCMP	EQU $ffffffff

    ENDC
