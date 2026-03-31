/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_MATHFFP_PROTOS_H
#define CLIB_MATHFFP_PROTOS_H

/*
**   $VER: mathffp_protos.h $VER: mathffp_lib.sfd 47.1 (30.11.2021) $VER: mathffp_lib.sfd 47.1 (30.11.2021)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <exec/libraries.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */


/* "mathffp.library" */
LONG SPFix(FLOAT parm);
FLOAT SPFlt(LONG integer);
LONG SPCmp(FLOAT leftParm, FLOAT rightParm);
LONG SPTst(FLOAT parm);
FLOAT SPAbs(FLOAT parm);
FLOAT SPNeg(FLOAT parm);
FLOAT SPAdd(FLOAT leftParm, FLOAT rightParm);
FLOAT SPSub(FLOAT leftParm, FLOAT rightParm);
FLOAT SPMul(FLOAT leftParm, FLOAT rightParm);
FLOAT SPDiv(FLOAT leftParm, FLOAT rightParm);

/*--- functions in V33 or higher ---*/
FLOAT SPFloor(FLOAT parm);
FLOAT SPCeil(FLOAT parm);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_MATHFFP_PROTOS_H */
