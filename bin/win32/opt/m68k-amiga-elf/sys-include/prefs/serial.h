#ifndef PREFS_SERIAL_H
#define PREFS_SERIAL_H
/*
**	$VER: serial.h 38.2 (10.7.1991)
**	Includes Release 45.1
**
**	File format for serial preferences
**
**	(C) Copyright 1991-2001 Amiga, Inc.
**	All Rights Reserved
*/

/*****************************************************************************/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef LIBRARIES_IFFPARSE_H
#include <libraries/iffparse.h>
#endif


/*****************************************************************************/


#define ID_SERL MAKE_ID('S','E','R','L')


struct SerialPrefs
{
    LONG  sp_Reserved[3];		/* System reserved		    */
    ULONG sp_Unit0Map;			/* What unit 0 really refers to     */
    ULONG sp_BaudRate;			/* Baud rate			    */

    ULONG sp_InputBuffer;		/* Input buffer: 0 - 65536	    */
    ULONG sp_OutputBuffer;		/* Future: Output: 0 - 65536	    */

    UBYTE sp_InputHandshake;		/* Input handshaking		    */
    UBYTE sp_OutputHandshake;		/* Future: Output handshaking	    */

    UBYTE sp_Parity;			/* Parity			    */
    UBYTE sp_BitsPerChar;		/* I/O bits per character	    */
    UBYTE sp_StopBits;			/* Stop bits			    */
};

/* constants for SerialPrefs.sp_Parity */
#define PARITY_NONE	0
#define PARITY_EVEN	1
#define PARITY_ODD	2
#define PARITY_MARK	3		/* Future enhancement */
#define PARITY_SPACE	4		/* Future enhancement */

/* constants for SerialPrefs.sp_Input/OutputHandshaking */
#define HSHAKE_XON	0
#define HSHAKE_RTS	1
#define HSHAKE_NONE	2


/*****************************************************************************/


#endif /* PREFS_SERIAL_H */
