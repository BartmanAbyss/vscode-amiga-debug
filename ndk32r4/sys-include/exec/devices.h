#ifndef	EXEC_DEVICES_H
#define	EXEC_DEVICES_H
/*
**	$VER: devices.h 47.1 (28.6.2019)
**
**	Include file for use by Exec device drivers
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
**
*/

#ifndef EXEC_LIBRARIES_H
#include "exec/libraries.h"
#endif /* EXEC_LIBRARIES_H */

#ifndef EXEC_PORTS_H
#include "exec/ports.h"
#endif /* EXEC_PORTS_H */


/****** Device ******************************************************/

struct Device { 
    struct  Library dd_Library;
};


/****** Unit ********************************************************/

struct Unit {
    struct  MsgPort unit_MsgPort;	/* queue for unprocessed messages */
					/* instance of msgport is recommended */
    UBYTE   unit_flags;
    UBYTE   unit_pad;
    UWORD   unit_OpenCnt;		/* number of active opens */
};


#define UNITF_ACTIVE	(1<<0)
#define UNITF_INTASK	(1<<1)

#endif	/* EXEC_DEVICES_H */
