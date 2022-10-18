#ifndef	EXEC_ERRORS_H
#define	EXEC_ERRORS_H
/*
**	$VER: errors.h 39.0 (15.10.1991)
**	Includes Release 45.1
**
**	Standard Device IO Errors (returned in io_Error)
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#define IOERR_OPENFAIL	 (-1) /* device/unit failed to open */
#define IOERR_ABORTED	 (-2) /* request terminated early [after AbortIO()] */
#define IOERR_NOCMD	 (-3) /* command not supported by device */
#define IOERR_BADLENGTH	 (-4) /* not a valid length (usually IO_LENGTH) */
#define IOERR_BADADDRESS (-5) /* invalid address (misaligned or bad range) */
#define IOERR_UNITBUSY	 (-6) /* device opens ok, but requested unit is busy */
#define IOERR_SELFTEST	 (-7) /* hardware failed self-test */

#endif	/* EXEC_ERRORS_H */
