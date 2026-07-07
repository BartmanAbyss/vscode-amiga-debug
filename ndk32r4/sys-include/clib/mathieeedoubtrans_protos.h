/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_MATHIEEEDOUBTRANS_PROTOS_H
#define CLIB_MATHIEEEDOUBTRANS_PROTOS_H

/*
**   $VER: mathieeedoubtrans_protos.h $VER: mathieeedoubtrans_lib.sfd 47.1 (30.11.2021) $VER: mathieeedoubtrans_lib.sfd 47.1 (30.11.2021)
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


/* "mathieeedoubtrans.library" */
DOUBLE IEEEDPAtan(DOUBLE parm);
DOUBLE IEEEDPSin(DOUBLE parm);
DOUBLE IEEEDPCos(DOUBLE parm);
DOUBLE IEEEDPTan(DOUBLE parm);
DOUBLE IEEEDPSincos(DOUBLE *pf2, DOUBLE parm);
DOUBLE IEEEDPSinh(DOUBLE parm);
DOUBLE IEEEDPCosh(DOUBLE parm);
DOUBLE IEEEDPTanh(DOUBLE parm);
DOUBLE IEEEDPExp(DOUBLE parm);
DOUBLE IEEEDPLog(DOUBLE parm);
DOUBLE IEEEDPPow(DOUBLE exp, DOUBLE arg);
DOUBLE IEEEDPSqrt(DOUBLE parm);
FLOAT IEEEDPTieee(DOUBLE parm);
DOUBLE IEEEDPFieee(FLOAT single);
DOUBLE IEEEDPAsin(DOUBLE parm);
DOUBLE IEEEDPAcos(DOUBLE parm);
DOUBLE IEEEDPLog10(DOUBLE parm);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_MATHIEEEDOUBTRANS_PROTOS_H */
