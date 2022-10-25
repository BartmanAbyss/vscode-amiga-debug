#ifndef DEVICES_KEYBOARD_H
#define DEVICES_KEYBOARD_H
/*
**	$VER: keyboard.h 36.0 (1.5.1990)
**	Includes Release 45.1
**
**	Keyboard device command definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	 EXEC_IO_H
#include <exec/io.h>
#endif

#define	 KBD_READEVENT	      (CMD_NONSTD+0)
#define	 KBD_READMATRIX	      (CMD_NONSTD+1)
#define	 KBD_ADDRESETHANDLER  (CMD_NONSTD+2)
#define	 KBD_REMRESETHANDLER  (CMD_NONSTD+3)
#define	 KBD_RESETHANDLERDONE (CMD_NONSTD+4)

#endif	/* DEVICES_KEYBOARD_H */
