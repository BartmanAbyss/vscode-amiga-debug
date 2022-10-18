#ifndef	LIBRARIES_MATHIEEEDP_H
#define	LIBRARIES_MATHIEEEDP_H
/*
**	$VER: mathieeedp.h 1.1 (13.7.1990)
**	Includes Release 45.1
**	Include file to use for <math.h>
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef PI
#define PI	((double)	3.141592653589793))
#endif

#define TWO_PI	(((double)	2)	* PI)
#define PI2	(PI/((double)2))
#define PI4	(PI/((double)4))

#ifndef	E
#define	E	((double)	2.718281828459045)
#endif

#define LOG10	((double)	2.302585092994046)
#define FPTEN	((double)	10.0)
#define	FPONE	((double)	1.0)
#define FPHALF	((double)	0.5)
#define FPZERO	((double)	0.0)
#define trunc(x)	((int)	(x))
#define round(x)	((int)	((x) + 0.5))
#define itof(i)		((double) (i))

#define	fabs	IEEEDPAbs
#define floor	IEEEDPFloor
#define	ceil	IEEEDPCeil

#define	tan	IEEEDPTan
#define	atan	IEEEDPAtan
#define cos	IEEEDPCos
#define acos	IEEEDPAcos
#define sin	IEEEDPSin
#define asin	IEEEDPAsin
#define exp	IEEEDPExp
#define pow(a,b)	IEEEDPPow((b),(a))
#define log	IEEEDPLog
#define log10	IEEEDPLog10
#define sqrt	IEEEDPSqrt

#define	sinh	IEEEDPSinh
#define cosh	IEEEDPCosh
#define tanh	IEEEDPTanh


#if 0 /* Use <clib/mathieeedoubbas_protos.h> and <clib/mathieeedoubtrans_protos.h> instead. */
double	IEEEDPTan(),IEEEDPAtan();
double	IEEEDPCos(),IEEEDPACos();
double	IEEEDPSin(),IEEEDPASin();
double	IEEEDPExp(),IEEEDPLog();
double	IEEEDPSqrt();
double	IEEEDPLog10(),IEEEDPPow();
double	IEEEDPSincos();
double	IEEEDPSinh(),IEEEDPCosh(),IEEEDPTanh();
float	IEEEDPTieee();
double	IEEEDPFieee();

int	IEEEDPFix();
int	IEEEDPCmp(),IEEEDPTst();
double	IEEEDPFlt();
double	IEEEDPAbs();
double	IEEEDPNeg();
double	IEEEDPAdd();
double	IEEEDPSub();
double	IEEEDPMul();
double	IEEEDPDiv();
double	IEEEDPFloor();
double	IEEEDPCeil();
#endif

#endif	/* LIBRARIES_MATHIEEEDP_H */
