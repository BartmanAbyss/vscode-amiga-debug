#ifndef	EXEC_IO_H
#define	EXEC_IO_H
/*
**	$VER: io.h 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Message structures used for device communication
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif /* EXEC_PORTS_H */


struct IORequest {
    struct  Message io_Message;
    struct  Device  *io_Device;     /* device node pointer  */
    struct  Unit    *io_Unit;	    /* unit (driver private)*/
    UWORD   io_Command;	    /* device command */
    UBYTE   io_Flags;
    BYTE    io_Error;		    /* error or warning num */
};

struct IOStdReq {
    struct  Message io_Message;
    struct  Device  *io_Device;     /* device node pointer  */
    struct  Unit    *io_Unit;	    /* unit (driver private)*/
    UWORD   io_Command;	    /* device command */
    UBYTE   io_Flags;
    BYTE    io_Error;		    /* error or warning num */
    ULONG   io_Actual;		    /* actual number of bytes transferred */
    ULONG   io_Length;		    /* requested number bytes transferred*/
    APTR    io_Data;		    /* points to data area */
    ULONG   io_Offset;		    /* offset for block structured devices */
};

/* library vector offsets for device reserved vectors */
#define DEV_BEGINIO	(-30)
#define DEV_ABORTIO	(-36)

/* io_Flags defined bits */
#define IOB_QUICK	0
#define IOF_QUICK	(1<<0)


#define CMD_INVALID	0
#define CMD_RESET	1
#define CMD_READ	2
#define CMD_WRITE	3
#define CMD_UPDATE	4
#define CMD_CLEAR	5
#define CMD_STOP	6
#define CMD_START	7
#define CMD_FLUSH	8

#define CMD_NONSTD	9

#endif	/* EXEC_IO_H */
