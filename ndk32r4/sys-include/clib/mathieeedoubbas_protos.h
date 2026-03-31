/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_MATHIEEEDOUBBAS_PROTOS_H
#define CLIB_MATHIEEEDOUBBAS_PROTOS_H

/*
**   $VER: mathieeedoubbas_protos.h $VER: mathieeedoubbas_lib.sfd 47.1 (30.11.2021) $VER: mathieeedoubbas_lib.sfd 47.1 (30.11.2021)
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


/* "mathieeedoubbas.library" */
LONG IEEEDPFix(DOUBLE parm);
DOUBLE IEEEDPFlt(LONG integer);
LONG IEEEDPCmp(DOUBLE leftParm, DOUBLE rightParm);
LONG IEEEDPTst(DOUBLE parm);
DOUBLE IEEEDPAbs(DOUBLE parm);
DOUBLE IEEEDPNeg(DOUBLE parm);
DOUBLE IEEEDPAdd(DOUBLE leftParm, DOUBLE rightParm);
DOUBLE IEEEDPSub(DOUBLE leftParm, DOUBLE rightParm);
DOUBLE IEEEDPMul(DOUBLE factor1, DOUBLE factor2);
DOUBLE IEEEDPDiv(DOUBLE dividend, DOUBLE divisor);

/*--- functions in V33 or higher ---*/
DOUBLE IEEEDPFloor(DOUBLE parm);
DOUBLE IEEEDPCeil(DOUBLE parm);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_MATHIEEEDOUBBAS_PROTOS_H */
