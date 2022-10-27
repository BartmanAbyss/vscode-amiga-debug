#ifndef  CLIB_MATHIEEEDOUBBAS_PROTOS_H
#define  CLIB_MATHIEEEDOUBBAS_PROTOS_H

/*
**	$VER: mathieeedoubbas_protos.h 40.1 (17.5.1996)
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
LONG IEEEDPFix( DOUBLE parm );
DOUBLE IEEEDPFlt( LONG integer );
LONG IEEEDPCmp( DOUBLE leftParm, DOUBLE rightParm );
LONG IEEEDPTst( DOUBLE parm );
DOUBLE IEEEDPAbs( DOUBLE parm );
DOUBLE IEEEDPNeg( DOUBLE parm );
DOUBLE IEEEDPAdd( DOUBLE leftParm, DOUBLE rightParm );
DOUBLE IEEEDPSub( DOUBLE leftParm, DOUBLE rightParm );
DOUBLE IEEEDPMul( DOUBLE factor1, DOUBLE factor2 );
DOUBLE IEEEDPDiv( DOUBLE dividend, DOUBLE divisor );
/*--- functions in V33 or higher (Release 1.2) ---*/
DOUBLE IEEEDPFloor( DOUBLE parm );
DOUBLE IEEEDPCeil( DOUBLE parm );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_MATHIEEEDOUBBAS_PROTOS_H */
