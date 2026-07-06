#ifndef	EXEC_INITIALIZERS_H
#define	EXEC_INITIALIZERS_H
/*
**	$VER: initializers.h 47.1 (28.6.2019)
**
**	Macros for use with the InitStruct() function.
**
**	Copyright (C) 2019 Hyperion Entertainment CVBA.
**	    Developed under license.
**
*/

#define	OFFSET(structName, structEntry) \
				(&(((struct structName *) 0)->structEntry))
#define	INITBYTE(offset,value)	0xe000,(UWORD) (offset),(UWORD) ((value)<<8)
#define	INITWORD(offset,value)	0xd000,(UWORD) (offset),(UWORD) (value)
#define	INITLONG(offset,value)	0xc000,(UWORD) (offset), \
				(UWORD) ((value)>>16), \
				(UWORD) ((value) & 0xffff)
#define	INITSTRUCT(size,offset,value,count) \
				(UWORD) (0xc000|(size<<12)|(count<<8)| \
				((UWORD) ((offset)>>16)), \
				((UWORD) (offset)) & 0xffff)
#endif /* EXEC_INITIALIZERS_H */
