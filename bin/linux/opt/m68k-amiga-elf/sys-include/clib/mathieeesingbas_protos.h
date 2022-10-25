#ifndef  CLIB_MATHIEEESINGBAS_PROTOS_H
#define  CLIB_MATHIEEESINGBAS_PROTOS_H

/*
**	$VER: mathieeesingbas_protos.h 40.1 (17.5.1996)
**
**	C prototypes. For use with 32 bit integers only.
**
**	Copyright © 2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_TYPES_H
#include <exec/types.h>
#endif
LONG IEEESPFix( FLOAT parm );
FLOAT IEEESPFlt( LONG integer );
LONG IEEESPCmp( FLOAT leftParm, FLOAT rightParm );
LONG IEEESPTst( FLOAT parm );
FLOAT IEEESPAbs( FLOAT parm );
FLOAT IEEESPNeg( FLOAT parm );
FLOAT IEEESPAdd( FLOAT leftParm, FLOAT rightParm );
FLOAT IEEESPSub( FLOAT leftParm, FLOAT rightParm );
FLOAT IEEESPMul( FLOAT leftParm, FLOAT rightParm );
FLOAT IEEESPDiv( FLOAT dividend, FLOAT divisor );
FLOAT IEEESPFloor( FLOAT parm );
FLOAT IEEESPCeil( FLOAT parm );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_MATHIEEESINGBAS_PROTOS_H */
