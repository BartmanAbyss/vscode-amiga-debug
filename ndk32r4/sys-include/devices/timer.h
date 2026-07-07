#ifndef DEVICES_TIMER_H
#define DEVICES_TIMER_H 1
/*
**	$VER: timer.h 47.2 (24.8.2019)
**
**	Timer device name and useful definitions.
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef EXEC_IO_H
#include <exec/io.h>
#endif

/* unit definitions */
#define UNIT_MICROHZ	0
#define UNIT_VBLANK	1
#define UNIT_ECLOCK	2
#define UNIT_WAITUNTIL	3
#define	UNIT_WAITECLOCK	4

#define TIMERNAME	"timer.device"

/* These are the default definitions for now. If you need a different
   definition of the timeval and timerequest data structures, see below. */

struct TimeVal {
	ULONG tv_secs;
	ULONG tv_micro;
};

struct TimeRequest {
	struct IORequest tr_node;
	struct TimeVal   tr_time;
};

/****************************************************************************/

/* The 'struct timeval' definition used by AmigaOS since its introduction in
 * the year 1985 was similar to a data structure of the same name as used in
 * the Unix domain. Similar, but not identical. This had consequences when
 * porting software to the Amiga which came from a Unix/POSIX system, as it
 * clashed with the Amiga definition of the 'struct timeval'.
 *
 * Rather than use compatibility workarounds, the 'struct timeval' and
 * 'struct timerequest' data structures were replaced with 'struct TimeVal'
 * and 'struct TimeRequest', respectively. The respective structure members
 * (tr_node and tr_time for the 'struct timerequest' and 'struct TimeRequest'
 * alike and tv_secs and tv_micro for the 'struct timeval' and also the
 * 'struct TimeVal') remain unchanged. Please note that macros which
 * redefine tr_node, tr_time, tv_secs or tv_micro are not used so as to avoid
 * side-effects when rebuilding existing code.
 *
 * New types will be defined as "TimeVal_Type" and "TimeRequest_Type" so that
 * you may use these for casts with function parameters and in data structures.
 *
 * To check if these new types are defined, check if the preprocessor
 * definition __TIME_TYPES_DEFINED__ has been defined. If so, check if
 * __USE_NEW_TIMEVAL__ is defined as well, which means that 'struct TimeVal'
 * and 'struct TimeRequest' are being used.
 *
 * When building code which defines its own (e.g. POSIX) 'timeval' please
 * use "#define __USE_NEW_TIMEVAL__" prior to including the operating system
 * header files.
 */

#ifndef __USE_NEW_TIMEVAL__

struct timeval {
	ULONG tv_secs;
	ULONG tv_micro;
};

struct timerequest {
	struct IORequest tr_node;
	struct timeval   tr_time;
};

typedef struct timeval     TimeVal_Type;
typedef struct timerequest TimeRequest_Type;

#else

typedef struct TimeVal     TimeVal_Type;
typedef struct TimeRequest TimeRequest_Type;

#endif /* __USE_NEW_TIMEVAL__ */

/* Take note that these two types are now defined
 * and may be used.
 */
#define __TIME_TYPES_DEFINED__


/* This is really a 64 bit integer value split into two 32 bit integers. */
struct EClockVal {
	ULONG ev_hi;
	ULONG ev_lo;
};


/* I/O command to use for adding a timer */
#define TR_ADDREQUEST	CMD_NONSTD

/* I/O commands for obtaining the current system time
 * and for setting it, respectively.
 */
#define TR_GETSYSTIME	(CMD_NONSTD+1)
#define TR_SETSYSTIME	(CMD_NONSTD+2)

#endif /* DEVICES_TIMER_H */
