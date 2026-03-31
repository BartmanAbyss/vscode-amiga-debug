/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_RAMDRIVE_PROTOS_H
#define CLIB_RAMDRIVE_PROTOS_H

/*
**   $VER: ramdrive_protos.h $VER: ramdrive_lib.sfd 47.1 (30.11.2021) $VER: ramdrive_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/devices.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/*--- functions in V34 or higher ---*/

/* "ramdrive.device" */
STRPTR KillRAD0(void);

/*--- functions in V36 or higher ---*/
STRPTR KillRAD(ULONG unit);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_RAMDRIVE_PROTOS_H */
