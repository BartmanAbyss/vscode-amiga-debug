/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_MATHTRANS_PROTOS_H
#define CLIB_MATHTRANS_PROTOS_H

/*
**   $VER: mathtrans_protos.h $VER: mathtrans_lib.sfd 47.1 (30.11.2021) $VER: mathtrans_lib.sfd 47.1 (30.11.2021)
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


/* "mathtrans.library" */
FLOAT SPAtan(FLOAT parm);
FLOAT SPSin(FLOAT parm);
FLOAT SPCos(FLOAT parm);
FLOAT SPTan(FLOAT parm);
FLOAT SPSincos(FLOAT *cosResult, FLOAT parm);
FLOAT SPSinh(FLOAT parm);
FLOAT SPCosh(FLOAT parm);
FLOAT SPTanh(FLOAT parm);
FLOAT SPExp(FLOAT parm);
FLOAT SPLog(FLOAT parm);
FLOAT SPPow(FLOAT power, FLOAT arg);
FLOAT SPSqrt(FLOAT parm);
FLOAT SPTieee(FLOAT parm);
FLOAT SPFieee(FLOAT parm);

/*--- functions in V31 or higher ---*/
FLOAT SPAsin(FLOAT parm);
FLOAT SPAcos(FLOAT parm);
FLOAT SPLog10(FLOAT parm);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_MATHTRANS_PROTOS_H */
