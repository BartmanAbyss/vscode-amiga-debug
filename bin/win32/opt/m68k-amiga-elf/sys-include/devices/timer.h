#ifndef DEVICES_TIMER_H
#define DEVICES_TIMER_H 1
/*
**	$VER: timer.h 36.16 (25.1.1991)
**	Includes Release 45.1
**
**	Timer device name and useful definitions.
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**		All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_IO_H
#include <exec/io.h>
#endif

/* unit defintions */
#define UNIT_MICROHZ	0
#define UNIT_VBLANK	1
#define UNIT_ECLOCK	2
#define UNIT_WAITUNTIL	3
#define	UNIT_WAITECLOCK	4

#define TIMERNAME	"timer.device"

#ifndef _TIMEVAL_DEFINED
#define _TIMEVAL_DEFINED
struct timeval {
    union {
        ULONG          tv_sec;         /* seconds */
        ULONG          tv_secs;
    };
    union {
        ULONG     tv_usec;        /* and microseconds */
        ULONG     tv_micro;
    };
};
#endif

struct EClockVal {
    ULONG ev_hi;
    ULONG ev_lo;
};

struct timerequest {
    struct IORequest tr_node;
    struct timeval tr_time;
};

/* IO_COMMAND to use for adding a timer */
#define TR_ADDREQUEST	CMD_NONSTD
#define TR_GETSYSTIME	(CMD_NONSTD+1)
#define TR_SETSYSTIME	(CMD_NONSTD+2)

#endif /* DEVICES_TIMER_H */
