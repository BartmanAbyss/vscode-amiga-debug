#ifndef  CLIB_MATHTRANS_PROTOS_H
#define  CLIB_MATHTRANS_PROTOS_H

/*
**	$VER: mathtrans_protos.h 40.1 (17.5.1996)
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
FLOAT SPAtan( FLOAT parm );
FLOAT SPSin( FLOAT parm );
FLOAT SPCos( FLOAT parm );
FLOAT SPTan( FLOAT parm );
FLOAT SPSincos( FLOAT *cosResult, FLOAT parm );
FLOAT SPSinh( FLOAT parm );
FLOAT SPCosh( FLOAT parm );
FLOAT SPTanh( FLOAT parm );
FLOAT SPExp( FLOAT parm );
FLOAT SPLog( FLOAT parm );
FLOAT SPPow( FLOAT power, FLOAT arg );
FLOAT SPSqrt( FLOAT parm );
FLOAT SPTieee( FLOAT parm );
FLOAT SPFieee( FLOAT parm );
/*--- functions in V31 or higher (Release 1.1) ---*/
FLOAT SPAsin( FLOAT parm );
FLOAT SPAcos( FLOAT parm );
FLOAT SPLog10( FLOAT parm );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif   /* CLIB_MATHTRANS_PROTOS_H */
