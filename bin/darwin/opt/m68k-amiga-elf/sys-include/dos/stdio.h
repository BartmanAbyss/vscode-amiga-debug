#ifndef DOS_STDIO_H
#define DOS_STDIO_H
/*
**
**	$VER: stdio.h 36.6 (1.11.1991)
**	Includes Release 45.1
**
**	ANSI-like stdio defines for dos buffered I/O
**
**	(C) Copyright 1989-2001 Amiga, Inc.
**	    All Rights Reserved
**
*/

#define ReadChar()		FGetC(Input())
#define WriteChar(c)		FPutC(Output(),(c))
#define UnReadChar(c)		UnGetC(Input(),(c))
/* next one is inefficient */
#define ReadChars(buf,num)	FRead(Input(),(buf),1,(num))
#define ReadLn(buf,len)		FGets(Input(),(buf),(len))
#define WriteStr(s)		FPuts(Output(),(s))
#define VWritef(format,argv)	VFWritef(Output(),(format),(argv))

/* types for SetVBuf */
#define BUF_LINE	0	/* flush on \n, etc */
#define BUF_FULL	1	/* never flush except when needed */
#define BUF_NONE	2	/* no buffering */

/* EOF return value */
#define ENDSTREAMCH	-1

#endif	/* DOS_STDIO_H */
