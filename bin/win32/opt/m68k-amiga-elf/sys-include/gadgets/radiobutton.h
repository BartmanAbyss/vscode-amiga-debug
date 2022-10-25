#ifndef GADGETS_RADIOBUTTON_H
#define GADGETS_RADIOBUTTON_H
/*
**	$VER: radiobutton.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the radiobutton.gadget BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

#ifndef INTUITION_GADGETCLASS_H
#include <intuition/gadgetclass.h>
#endif

/*****************************************************************************/

/* Defines for the radiobutton node attributes.
 */
#define RBNA_Dummy		(TAG_USER+0x020000)

#define RBNA_UserData	(RBNA_Dummy+1)
	/* (APTR) User Data. */

#define RBNA_Labels		(RBNA_Dummy+2)
	/* (STRPTR) Text string array of labels for MX buttons. */

/*****************************************************************************/

/* Additional attributes defined by the RadioButton class
 */
#define RADIOBUTTON_Dummy			(REACTION_Dummy + 0x14000)

#define	RADIOBUTTON_Labels			(RADIOBUTTON_Dummy+1)
	/* (struct List *) Radio Button Label List. */

#define	RADIOBUTTON_Strings			(RADIOBUTTON_Dummy+2)
	/* RESERVED - presently unsupported */

#define	RADIOBUTTON_Spacing			(RADIOBUTTON_Dummy+3)
	/* (WORD) Spacing between radio buttons */

#define	RADIOBUTTON_Selected		(RADIOBUTTON_Dummy+4)
	/* (WORD) selected radio button (OM_GET/OM_SET/OM_NOTIFY) */

#define	RADIOBUTTON_LabelPlace		(RADIOBUTTON_Dummy+5)
	/* (WORD) label location (OM_GET/OM_SET) */

/*****************************************************************************/

#endif /* GADGETS_RADIOBUTTON_H */
