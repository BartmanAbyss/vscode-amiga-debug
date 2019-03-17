#ifndef CLIB_PAGE_PROTOS_H
#define CLIB_PAGE_PROTOS_H
/*
**	$VER: page_protos.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	C prototypes. For use with 32 bit integers only.
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef INTUITION_CLASSES_H
#include <intuition/classes.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

Class * PAGE_GetClass(VOID);

#ifdef __cplusplus
}
#endif

#endif /* CLIB_PAGE_PROTOS_H */
