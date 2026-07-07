/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_MATHIEEESINGBAS_PROTOS_H
#define CLIB_MATHIEEESINGBAS_PROTOS_H

/*
**   $VER: mathieeesingbas_protos.h $VER: mathieeesingbas_lib.sfd 47.1 (30.11.2021) $VER: mathieeesingbas_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <libraries/mathlibrary.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "mathieeesingbas.library" */
LONG IEEESPFix(FLOAT parm);
FLOAT IEEESPFlt(LONG integer);
LONG IEEESPCmp(FLOAT leftParm, FLOAT rightParm);
LONG IEEESPTst(FLOAT parm);
FLOAT IEEESPAbs(FLOAT parm);
FLOAT IEEESPNeg(FLOAT parm);
FLOAT IEEESPAdd(FLOAT leftParm, FLOAT rightParm);
FLOAT IEEESPSub(FLOAT leftParm, FLOAT rightParm);
FLOAT IEEESPMul(FLOAT leftParm, FLOAT rightParm);
FLOAT IEEESPDiv(FLOAT dividend, FLOAT divisor);
FLOAT IEEESPFloor(FLOAT parm);
FLOAT IEEESPCeil(FLOAT parm);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_MATHIEEESINGBAS_PROTOS_H */
