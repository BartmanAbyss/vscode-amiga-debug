#ifndef	INTUITION_CLASSUSR_H
#define INTUITION_CLASSUSR_H	1
/*
**  $VER: classusr.h 38.2 (14.4.1992)
**  Includes Release 45.1
**
**  For application users of Intuition object classes
**
**  (C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
*/


#ifndef UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif

/*** User visible handles on objects, classes, messages ***/
typedef ULONG	Object;		/* abstract handle */

typedef	UBYTE	*ClassID;

/* you can use this type to point to a "generic" message,
 * in the object-oriented programming parlance.  Based on
 * the value of 'MethodID', you dispatch to processing
 * for the various message types.  The meaningful parameter
 * packet structure definitions are defined below.
 */
typedef struct {
    ULONG MethodID;
    /* method-specific data follows, some examples below */
}		*Msg;

/*
 * Class id strings for Intuition classes.
 * There's no real reason to use the uppercase constants
 * over the lowercase strings, but this makes a good place
 * to list the names of the built-in classes.
 */
#define ROOTCLASS	"rootclass"		/* classusr.h	  */
#define IMAGECLASS	"imageclass"		/* imageclass.h   */
#define FRAMEICLASS	"frameiclass"
#define SYSICLASS	"sysiclass"
#define FILLRECTCLASS	"fillrectclass"
#define GADGETCLASS	"gadgetclass"		/* gadgetclass.h  */
#define PROPGCLASS	"propgclass"
#define STRGCLASS	"strgclass"
#define BUTTONGCLASS	"buttongclass"
#define FRBUTTONCLASS	"frbuttonclass"
#define GROUPGCLASS	"groupgclass"
#define ICCLASS		"icclass"		/* icclass.h	  */
#define MODELCLASS	"modelclass"
#define ITEXTICLASS	"itexticlass"
#define POINTERCLASS	"pointerclass"		/* pointerclass.h */

/* Dispatched method ID's
 * NOTE: Applications should use Intuition entry points, not direct
 * DoMethod() calls, for NewObject, DisposeObject, SetAttrs,
 * SetGadgetAttrs, and GetAttr.
 */

#define OM_Dummy	(0x100)
#define OM_NEW		(0x101)	/* 'object' parameter is "true class"	*/
#define OM_DISPOSE	(0x102)	/* delete self (no parameters)		*/
#define OM_SET		(0x103)	/* set attributes (in tag list)		*/
#define OM_GET		(0x104)	/* return single attribute value	*/
#define OM_ADDTAIL	(0x105)	/* add self to a List (let root do it)	*/
#define OM_REMOVE	(0x106)	/* remove self from list		*/
#define OM_NOTIFY	(0x107)	/* send to self: notify dependents	*/
#define OM_UPDATE	(0x108)	/* notification message from somebody	*/
#define OM_ADDMEMBER	(0x109)	/* used by various classes with lists	*/
#define OM_REMMEMBER	(0x10A)	/* used by various classes with lists	*/

/* Parameter "Messages" passed to methods	*/

/* OM_NEW and OM_SET	*/
struct opSet {
    ULONG		MethodID;
    struct TagItem	*ops_AttrList;	/* new attributes	*/
    struct GadgetInfo	*ops_GInfo;	/* always there for gadgets,
					 * when SetGadgetAttrs() is used,
					 * but will be NULL for OM_NEW
					 */
};

/* OM_NOTIFY, and OM_UPDATE	*/
struct opUpdate {
    ULONG		MethodID;
    struct TagItem	*opu_AttrList;	/* new attributes	*/
    struct GadgetInfo	*opu_GInfo;	/* non-NULL when SetGadgetAttrs or
					 * notification resulting from gadget
					 * input occurs.
					 */
    ULONG		opu_Flags;	/* defined below	*/
};

/* this flag means that the update message is being issued from
 * something like an active gadget, a la GACT_FOLLOWMOUSE.  When
 * the gadget goes inactive, it will issue a final update
 * message with this bit cleared.  Examples of use are for
 * GACT_FOLLOWMOUSE equivalents for propgadclass, and repeat strobes
 * for buttons.
 */
#define OPUF_INTERIM	(1<<0)

/* OM_GET	*/
struct opGet {
    ULONG		MethodID;
    ULONG		opg_AttrID;
    ULONG		*opg_Storage;	/* may be other types, but "int"
					 * types are all ULONG
					 */
};

/* OM_ADDTAIL	*/
struct opAddTail {
    ULONG		MethodID;
    struct List		*opat_List;
};

/* OM_ADDMEMBER, OM_REMMEMBER	*/
#define  opAddMember opMember
struct opMember {
    ULONG		MethodID;
    Object		*opam_Object;
};


#endif
