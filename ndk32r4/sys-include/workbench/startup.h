#ifndef WORKBENCH_STARTUP_H
#define WORKBENCH_STARTUP_H

/*
**	$VER: startup.h 47.2 (16.11.2021)
**
**	workbench startup definitions
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_PORTS_H
#include <exec/ports.h>
#endif

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

struct WBStartup {
    struct Message	sm_Message;	/* a standard message structure */
    struct MsgPort *	sm_Process;	/* the process descriptor for you */
    BPTR		sm_Segment;	/* a descriptor for your code */
    LONG		sm_NumArgs;	/* the number of elements in ArgList */
    STRPTR		sm_ToolWindow;	/* description of window */
    struct WBArg *	sm_ArgList;	/* the arguments themselves */
};

struct WBArg {
    BPTR		wa_Lock;	/* a lock descriptor */
    STRPTR		wa_Name;	/* a string relative to that lock */
};

#endif  /* !WORKBENCH_STARTUP_H */
