	IFND	DEVICES_KEYBOARD_I
DEVICES_KEYBOARD_I	SET	1
**
**	$VER: keyboard.i 36.0 (1.5.1990)
**	Includes Release 45.1
**
**	Keyboard device command definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

   IFND	    EXEC_IO_I
   INCLUDE     "exec/io.i"
   ENDC

   DEVINIT

   DEVCMD	KBD_READEVENT
   DEVCMD	KBD_READMATRIX
   DEVCMD	KBD_ADDRESETHANDLER
   DEVCMD	KBD_REMRESETHANDLER
   DEVCMD	KBD_RESETHANDLERDONE

	ENDC	; DEVICES_KEYBOARD_I
