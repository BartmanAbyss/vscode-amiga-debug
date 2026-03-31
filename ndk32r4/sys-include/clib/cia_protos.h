/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_CIA_PROTOS_H
#define CLIB_CIA_PROTOS_H

/*
**   $VER: cia_protos.h $VER: cia_lib.sfd 47.1 (30.11.2021) $VER: cia_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/interrupts.h>
#include <exec/libraries.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "ciaa.resource" and "ciab.resource" */
struct Interrupt *AddICRVector(struct Library *resource, WORD iCRBit, struct Interrupt *interrupt);
VOID RemICRVector(struct Library *resource, WORD iCRBit, struct Interrupt *interrupt);
WORD AbleICR(struct Library *resource, WORD mask);
WORD SetICR(struct Library *resource, WORD mask);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_CIA_PROTOS_H */
