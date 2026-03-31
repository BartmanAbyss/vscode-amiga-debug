#ifndef	EXEC_INTERRUPTS_H
#define	EXEC_INTERRUPTS_H
/*
**	$VER: interrupts.h 47.1 (28.6.2019)
**
**	Callback structures used by hardware & software interrupts
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_NODES_H
#include <exec/nodes.h>
#endif /* EXEC_NODES_H */

#ifndef EXEC_LISTS_H
#include <exec/lists.h>
#endif /* EXEC_LISTS_H */


struct Interrupt {
    struct  Node is_Node;
    APTR    is_Data;		    /* server data segment  */
    VOID    (*is_Code)();	    /* server code entry    */
};


struct IntVector {		/* For EXEC use ONLY! */
    APTR    iv_Data;
    VOID    (*iv_Code)();
    struct  Node *iv_Node;
};


struct SoftIntList {		/* For EXEC use ONLY! */
    struct List sh_List;
    UWORD  sh_Pad;
};

#define SIH_PRIMASK (0xf0)

/* this is a fake INT definition, used only for AddIntServer and the like */
#define INTB_NMI	15
#define INTF_NMI	(1L<<15)

#endif	/* EXEC_INTERRUPTS_H */
