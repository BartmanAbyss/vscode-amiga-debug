#ifndef DEVICES_GAMEPORT_H
#define DEVICES_GAMEPORT_H
/*
**	$VER: gameport.h 36.1 (5.11.1990)
**	Includes Release 45.1
**
**	GamePort device command definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef	EXEC_TYPES_H
#include	<exec/types.h>
#endif

#ifndef	EXEC_IO_H
#include	<exec/io.h>
#endif

/******	 GamePort commands ******/
#define	 GPD_READEVENT	   (CMD_NONSTD+0)
#define	 GPD_ASKCTYPE	   (CMD_NONSTD+1)
#define	 GPD_SETCTYPE	   (CMD_NONSTD+2)
#define	 GPD_ASKTRIGGER	   (CMD_NONSTD+3)
#define	 GPD_SETTRIGGER	   (CMD_NONSTD+4)

/******	 GamePort structures ******/

/* gpt_Keys */
#define	 GPTB_DOWNKEYS	   0
#define	 GPTF_DOWNKEYS	   (1<<0)
#define	 GPTB_UPKEYS	   1
#define	 GPTF_UPKEYS	   (1<<1)

struct GamePortTrigger {
   UWORD gpt_Keys;	   /* key transition triggers */
   UWORD gpt_Timeout;	   /* time trigger (vertical blank units) */
   UWORD gpt_XDelta;	   /* X distance trigger */
   UWORD gpt_YDelta;	   /* Y distance trigger */
};

/****** Controller Types ******/
#define	 GPCT_ALLOCATED	   -1	 /* allocated by another user */
#define	 GPCT_NOCONTROLLER 0

#define	 GPCT_MOUSE	   1
#define	 GPCT_RELJOYSTICK  2
#define	 GPCT_ABSJOYSTICK  3


/****** Errors ******/
#define	 GPDERR_SETCTYPE   1	 /* this controller not valid at this time */

#endif	/* DEVICES_GAMEPORT_H */
