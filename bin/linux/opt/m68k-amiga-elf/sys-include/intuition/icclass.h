#ifndef INTUITION_ICCLASS_H
#define INTUITION_ICCLASS_H
/*
**  $VER: icclass.h 38.1 (11.11.1991)
**  Includes Release 45.1
**
**  Gadget/object interconnection classes
**
**  (C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
*/


#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

#define ICM_Dummy	(0x0401L)	/* used for nothing		*/
#define ICM_SETLOOP	(0x0402L)	/* set/increment loop counter	*/
#define ICM_CLEARLOOP	(0x0403L)	/* clear/decrement loop counter	*/
#define ICM_CHECKLOOP	(0x0404L)	/* set/increment loop		*/

/* no parameters for ICM_SETLOOP, ICM_CLEARLOOP, ICM_CHECKLOOP	*/

/* interconnection attributes used by icclass, modelclass, and gadgetclass */
#define ICA_Dummy	(TAG_USER+0x40000L)
#define ICA_TARGET	(ICA_Dummy + 1)
	/* interconnection target		*/
#define ICA_MAP		(ICA_Dummy + 2)
	/* interconnection map tagitem list	*/
#define ICSPECIAL_CODE	(ICA_Dummy + 3)
	/* a "pseudo-attribute", see below.	*/

/* Normally, the value for ICA_TARGET is some object pointer,
 * but if you specify the special value ICTARGET_IDCMP, notification
 * will be send as an IDCMP_IDCMPUPDATE message to the appropriate window's
 * IDCMP port.	See the definition of IDCMP_IDCMPUPDATE.
 *
 * When you specify ICTARGET_IDCMP for ICA_TARGET, the map you
 * specify will be applied to derive the attribute list that is
 * sent with the IDCMP_IDCMPUPDATE message.  If you specify a map list
 * which results in the attribute tag id ICSPECIAL_CODE, the
 * lower sixteen bits of the corresponding ti_Data value will
 * be copied into the Code field of the IDCMP_IDCMPUPDATE IntuiMessage.
 */
#define ICTARGET_IDCMP	(~0L)

#endif /* INTUITION_ICCLASS_H */
