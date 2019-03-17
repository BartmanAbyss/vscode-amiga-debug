#ifndef	INTUITION_CLASSES_H
#define INTUITION_CLASSES_H
/*
**  $VER: classes.h 40.0 (15.2.1994)
**  Includes Release 45.1
**
**  Used only by class implementors
**
**  (C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef	EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef	EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

#ifndef UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif

#ifndef	INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif

/*****************************************************************************/
/***************** "White Box" access to struct IClass ***********************/
/*****************************************************************************/

/* This structure is READ-ONLY, and allocated only by Intuition */
typedef struct IClass
{
    struct Hook		 cl_Dispatcher;		/* Class dispatcher */
    ULONG		 cl_Reserved;		/* Must be 0  */
    struct IClass	*cl_Super;		/* Pointer to superclass */
    ClassID		 cl_ID;			/* Class ID */

    UWORD		 cl_InstOffset;		/* Offset of instance data */
    UWORD		 cl_InstSize;		/* Size of instance data */

    ULONG		 cl_UserData;		/* Class global data */
    ULONG		 cl_SubclassCount;	/* Number of subclasses */
    ULONG		 cl_ObjectCount;	/* Number of objects */
    ULONG		 cl_Flags;

} Class;

#define	CLF_INLIST	0x00000001L
    /* class is in public class list */

/*****************************************************************************/

/* add offset for instance data to an object handle */
#define INST_DATA(cl,o)		((void *)(((UBYTE *)o)+cl->cl_InstOffset))

/*****************************************************************************/

/* sizeof the instance data for a given class */
#define SIZEOF_INSTANCE(cl)	((cl)->cl_InstOffset + (cl)->cl_InstSize \
			+ sizeof (struct _Object))

/*****************************************************************************/
/***************** "White box" access to struct _Object **********************/
/*****************************************************************************/

/* We have this, the instance data of the root class, PRECEDING the "object".
 * This is so that Gadget objects are Gadget pointers, and so on.  If this
 * structure grows, it will always have o_Class at the end, so the macro
 * OCLASS(o) will always have the same offset back from the pointer returned
 * from NewObject().
 *
 * This data structure is subject to change.  Do not use the o_Node embedded
 * structure. */
struct _Object
{
    struct MinNode	 o_Node;
    struct IClass	*o_Class;

};

/*****************************************************************************/

/* convenient typecast	*/
#define _OBJ(o)			((struct _Object *)(o))

/* get "public" handle on baseclass instance from real beginning of obj data */
#define BASEOBJECT(_obj)	((Object *)(_OBJ(_obj)+1))

/* get back to object data struct from public handle */
#define _OBJECT(o)		(_OBJ(o) - 1)

/* get class pointer from an object handle	*/
#define OCLASS(o)		((_OBJECT(o))->o_Class)

/*****************************************************************************/

/* BOOPSI class libraries should use this structure as the base for their
 * library data.  This allows developers to obtain the class pointer for
 * performing object-less inquiries. */
struct ClassLibrary
{
    struct Library	 cl_Lib;	/* Embedded library */
    UWORD		 cl_Pad;	/* Align the structure */
    Class		*cl_Class;	/* Class pointer */

};

/*****************************************************************************/

#endif
