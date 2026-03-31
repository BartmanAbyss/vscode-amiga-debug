#ifndef DOS_SHELL_H
#define DOS_SHELL_H
/*
**
**	$VER: shell.h 47.2 (16.11.2021)
**
**	DOS structures for the shell interface
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif
#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif

/* DOS Processes started from the CLI via RUN or NEWCLI have this additional
 * set to data associated with them. This is the extended structure that
 * includes additional interfaces to communicate with the shell
 */

struct ExtendedCommandLineInterface {
    LONG   cle_Result2;	       /* Value of IoErr from last command	  */
    BSTR   cle_SetName;	       /* Name of current directory		  */
    BPTR   cle_CommandDir;     /* Head of the path locklist		  */
    LONG   cle_ReturnCode;     /* Return code from last command		  */
    BSTR   cle_CommandName;    /* Name of current command		  */
    LONG   cle_FailLevel;      /* Fail level (set by FAILAT)		  */
    BSTR   cle_Prompt;	       /* Current prompt (set by PROMPT)	  */
    BPTR   cle_StandardInput;  /* Default (terminal) CLI input		  */
    BPTR   cle_CurrentInput;   /* Current CLI input			  */
    BSTR   cle_CommandFile;    /* Name of EXECUTE command file		  */
    LONG   cle_Interactive;    /* Boolean; True if prompts required	  */
    LONG   cle_Background;     /* Boolean; True if CLI created by RUN	  */
    BPTR   cle_CurrentOutput;  /* Current CLI output			  */
    LONG   cle_DefaultStack;   /* Stack size to be obtained in long words */
    BPTR   cle_StandardOutput; /* Default (terminal) CLI output		  */
    BPTR   cle_Module;	       /* SegList of currently loaded command	  */
    struct Hook cle_Hook;      /* For requesting shell functions          */
    struct ExtendedCommandLineInterface *cle_This; /* pointer to itself   */
    LONG   cle_Version;        /* Version of the interface. V47 currently */
};  /* CommandLineInterface */

/*
** A line in the history.
** Never allocate yourself, go through the shell methods.
*/
struct HistoryNode {
  struct MinNode  hn_Node;
  STRPTR          hn_Line;
};

/*
 * Tags used by the shell
 */
#define SHELL_DUMMY              (TAG_USER + 3000)

/* for FGetShell: If TRUE, a string including a command is
** requested. Otherwise, only arguments. */
#define SHELL_FGETS_FULL         (SHELL_DUMMY + 1)

/*
** For ADDHIST: The line to add
*/
#define SHELL_ADDH_LINE          (SHELL_DUMMY + 2)

/*
 * Shell methods
 */
#ifndef MAKE_SID
#define MAKE_SID(a,b,c,d)        \
        ((ULONG) (a)<<24 | (ULONG) (b)<<16 | (ULONG) (c)<<8 | (ULONG) (d))
#endif

/* Get the list of all supported methods, as a pointer to a
** 0L terminated array of LONGs.
*/
#define SHELL_METH_METHODS        MAKE_SID('L','I','S','T')

/* Get * to struct MinList with history nodes */
#define SHELL_METH_GETHIST        MAKE_SID('G','E','T','H')

/* Erase the history */
#define SHELL_METH_CLRHIST        MAKE_SID('C','L','R','H')

/* Add a line to the history */
#define SHELL_METH_ADDHIST        MAKE_SID('A','D','D','H')

/* Read a string, with TAB expansion, from the console */
#define SHELL_METH_FGETS          MAKE_SID('G','E','T','S')

#endif	/* DOS_SHELL_H */
