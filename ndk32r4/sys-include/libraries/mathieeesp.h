#ifndef	LIBRARIES_MATHIEEESP_H
#define	LIBRARIES_MATHIEEESP_H
/*
**	$VER: mathieeesp.h 47.1 (29.7.2019)
**
**	Include file to use for <math.h>
**	for mathieeesingbas based floating point
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef PI
#define PI	((float)	3.141592653589793))
#endif

#define TWO_PI	(((float)	2)	* PI)
#define PI2	(PI/((float)2))
#define PI4	(PI/((float)4))

#ifndef	E
#define	E	((float)	2.718281828459045)
#endif

#define LOG10	((float)	2.302585092994046)
#define FPTEN	((float)	10.0)
#define	FPONE	((float)	1.0)
#define FPHALF	((float)	0.5)
#define FPZERO	((float)	0.0)
#define trunc(x)	((int)	(x))
#define round(x)	((int)	((x) + 0.5))
#define itof(i)		((float) (i))

#define	fabs	IEEESPAbs
#define floor	IEEESPFloor
#define	ceil	IEEESPCeil

#define	tan	IEEESPTan
#define	atan	IEEESPAtan
#define cos	IEEESPCos
#define acos	IEEESPAcos
#define sin	IEEESPSin
#define asin	IEEESPAsin
#define exp	IEEESPExp
#define pow(a,b)	IEEESPPow((b),(a))
#define log	IEEESPLog
#define log10	IEEESPLog10
#define sqrt	IEEESPSqrt

#define	sinh	IEEESPSinh
#define cosh	IEEESPCosh
#define tanh	IEEESPTanh

/*
** The prototypes for the above functions are
** found in clib/mathieeesingbas_protos.h and
** clib/mathieeesingtrans_protos.h
*/

#endif	/* LIBRARIES_MATHIEEESP_H */
