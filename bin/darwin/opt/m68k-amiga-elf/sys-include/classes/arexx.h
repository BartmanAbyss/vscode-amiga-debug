#ifndef CLASSES_AREXX_H
#define CLASSES_AREXX_H
/*
**	$VER: arexx.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	arexx.class definitions
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_MEMORY_H
#include <exec/memory.h>
#endif

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

#ifndef DOS_RDARGS_H
#include <dos/rdargs.h>
#endif

#ifndef REXX_STORAGE_H
#include <rexx/storage.h>
#endif

#ifndef REXX_RXSLIB_H
#include <rexx/rxslib.h>
#endif

#ifndef REXX_ERRORS_H
#include <rexx/errors.h>
#endif

#ifndef INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif

#ifndef INTUITION_CLASSUSR_H
#include <intuition/classusr.h>
#endif

#ifndef UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif

#ifndef REACTION_REACTION_H
#include <reaction/reaction.h>
#endif

/*****************************************************************************/

/* Tags supported by the arexx class
 */
#define AREXX_Dummy				(REACTION_Dummy+0x30000)

#define AREXX_HostName			(AREXX_Dummy+1)
	/* (STRPTR) */
#define AREXX_DefExtension		(AREXX_Dummy+2)
	/* (STRPTR) */
#define AREXX_Commands			(AREXX_Dummy+3)
	/* (struct ARexxCmd *) */
#define AREXX_ErrorCode			(AREXX_Dummy+4)
	/* (ULONG *) */
#define AREXX_SigMask			(AREXX_Dummy+5)
	/* (ULONG) */
#define AREXX_NoSlot			(AREXX_Dummy+6)
	/* (BOOL) */
#define AREXX_ReplyHook			(AREXX_Dummy+7)
	/* (struct Hook *) */
#define AREXX_MsgPort			(AREXX_Dummy+8)
	/* (struct MsgPort *) */

/* Possible error result codes
 */
#define RXERR_NO_COMMAND_LIST     (1L)
#define RXERR_NO_PORT_NAME        (2L)
#define RXERR_PORT_ALREADY_EXISTS (3L)
#define RXERR_OUT_OF_MEMORY       (4L)

/* I can't spell, don't use this.
 */
#define AREXX_DefExtention	AREXX_DefExtension

/*****************************************************************************/

/* Methods Supported by the ARexx Class.
 */
#define AM_HANDLEEVENT                (0x590001)
	/* ARexx class event-handler. */

#define AM_EXECUTE                    (0x590002)
	/* Execute a host command. */

#define AM_FLUSH                      (0x590003)
	/* Flush rexx port. */

/* AM_EXECUTE message.
 */
struct apExecute
{
	ULONG MethodID;				/* AM_EXECUTE */
	STRPTR ape_CommandString;	/* Command string to execute */
	STRPTR ape_PortName;		/* Port to send to (usually RXSDIR) */
	LONG *ape_RC;				/* RC pointer */
	LONG *ape_RC2;				/* RC2 pointer */
	STRPTR *ape_Result;			/* Result pointer */
	BPTR ape_IO;				/* I/O handle */
};


/*****************************************************************************/

/* An array of these structures must be passed at object-create time.
 */
struct ARexxCmd
{
	STRPTR ac_Name;			/* Command name */
	UWORD ac_ID;			/* Unique ID */

	/* NOTE: The function pointed to by ac_Func() will be called
	 *       with parameters in CPU registers. Register usage
	 *       is as follows:
	 *
	 *       VOID ac_Func(struct ARexxCmd * cmd, struct RexxMsg * rm)
	 *                                       A0                   A1
	 */
	VOID (*ac_Func)();

	STRPTR ac_ArgTemplate;	/* DOS-style argument template */
	ULONG ac_Flags;			/* Unused, make NULL */
	ULONG *ac_ArgList;		/* Result of ReadArgs() */
	LONG ac_RC;				/* Primary result */
	LONG ac_RC2;			/* Secondary result */
	STRPTR ac_Result;		/* RESULT variable */
};

#endif /* CLASSES_AREXX_H */
