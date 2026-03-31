#ifndef	LIBRARIES_MATHLIBRARY_H
#define	LIBRARIES_MATHLIBRARY_H
/*
**	$VER: mathlibrary.h 47.1 (29.7.2019)
**
**	Data structure returned by OpenLibrary of:
**	mathieeedoubbas.library,mathieeedoubtrans.library
**	mathieeesingbas.library,mathieeesingtrans.library
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

struct MathIEEEBase
{
	struct Library MathIEEEBase_LibNode;
	unsigned char	MathIEEEBase_reserved[18];
	int	(*MathIEEEBase_TaskOpenLib)();
	int	(*MathIEEEBase_TaskCloseLib)();
	/*	This structure may be extended in the future */
};
/*
* Math resources may need to know when a program opens or closes this
* library. The functions TaskOpenLib and TaskCloseLib are called when
* a task opens or closes this library. 
*/

#endif	/* LIBRARIES_MATHLIBRARY_H */
