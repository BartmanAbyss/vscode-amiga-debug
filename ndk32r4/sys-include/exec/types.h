#ifndef	EXEC_TYPES_H
#define	EXEC_TYPES_H
/*
**	$VER: types.h 47.6 (2.8.2020)
**
**	Data typing. Must be included before any other Amiga include.
**
**	Copyright (C) 2020 Hyperion Entertainment CVBA.
**	    Developed under license.
*/


/* Version of the include files in use. Do not use this label for
 * OpenLibrary() calls!
 */
#define INCLUDE_VERSION 47


/*
 * The following definitions are intended to provide for backwards
 * compatibility with Amiga 'C' code written through the years 1985
 * and the decades which followed it. Compatibility with the state
 * of the 'C' language prior to ISO/IEC 9899:1990 (C90) is needed
 * for the sake of being able to build historic code. However, no
 * attempt is made to allow for 'C' code written to conform to
 * ANSI 'C'/C89/C90, etc. to build on older compilers which fail
 * to implement the required 'C' language features.
 */


/* Scalar types must be a specific size for Amiga data structures
 * and this requires knowledge of how the compiler defines them.
 * This information is available in standard 'C' header files
 * starting with ISO/IEC 9899:1999 (C99).
 */
#ifdef __STDC__
#if (__STDC_VERSION__ >= 199901) || defined(AMIGA_STDC_C99)

#include <stdint.h>

/* Type declarations for LONG, SHORT, BOOL, etc. will
 * build upon C99 integer types.
 */
#define __use_amiga_stdc_c99
#endif /* __STDC_VERSION__ || AMIGA_STDC_C99 */
#endif /* __STDC__ */


#define GLOBAL   extern		/* the declaratory use of an external */
#define IMPORT   extern		/* reference to an external */
#define STATIC   static		/* a local static variable */
#define REGISTER register	/* a (hopefully) register variable */


#ifndef VOID
#define VOID void
#endif

#ifdef __STDC__
#ifndef CONST
#define CONST const
#endif
#else
#ifndef CONST
#define CONST
#endif
#endif /* __STDC__ */


/* WARNING: APTR was redefined for the V36 Includes in 1989! APTR is a
 * 32-Bit Absolute Memory Pointer. 'C' pointer math will not operate on
 * APTR -- use "BYTE *" instead.
 */
#ifndef APTR_TYPEDEF
#define APTR_TYPEDEF
typedef void * APTR; /* 32-bit untyped pointer */
#endif

#ifndef CONST_APTR_TYPEDEF
#define CONST_APTR_TYPEDEF
typedef CONST void * CONST_APTR; /* 32-bit untyped pointer to constant data */
#endif

/* By default, the Kickstart/Workbench 1.x (1985) types will be used. */
#ifndef __use_amiga_stdc_c99

typedef long		LONG;		/* signed 32-bit quantity */
typedef unsigned long	ULONG;		/* unsigned 32-bit quantity */
typedef unsigned long	LONGBITS;	/* 32 bits manipulated individually */
typedef short		WORD;		/* signed 16-bit quantity */
typedef unsigned short	UWORD;		/* unsigned 16-bit quantity */
typedef unsigned short	WORDBITS;	/* 16 bits manipulated individually */
#if __STDC__
typedef signed char	BYTE;		/* signed 8-bit quantity */
#else
typedef char		BYTE;		/* signed 8-bit quantity */
#endif
typedef unsigned char	UBYTE;		/* unsigned 8-bit quantity */
typedef unsigned char	BYTEBITS;	/* 8 bits manipulated individually */
typedef unsigned short	RPTR;		/* unsigned relative pointer */

/* For compatibility with Kickstart/Workbench 1.x (1985) only!
 * Do not use these in newer code!
 */
typedef short		SHORT;		/* signed 16-bit quantity (use WORD) */
typedef unsigned short	USHORT;		/* unsigned 16-bit quantity (use UWORD) */
typedef short		COUNT;
typedef unsigned short	UCOUNT;
typedef ULONG		CPTR;

#else /* __use_amiga_stdc_c99 */

typedef int32_t		LONG;		/* signed 32-bit quantity */
typedef uint32_t	ULONG;		/* unsigned 32-bit quantity */
typedef uint32_t	LONGBITS;	/* 32 bits manipulated individually */
typedef int16_t		WORD;		/* signed 16-bit quantity */
typedef uint16_t	UWORD;		/* unsigned 16-bit quantity */
typedef uint16_t	WORDBITS;	/* 16 bits manipulated individually */
typedef int8_t		BYTE;		/* signed 8-bit quantity */
typedef uint8_t		UBYTE;		/* unsigned 8-bit quantity */
typedef uint8_t		BYTEBITS;	/* 8 bits manipulated individually */
typedef uint16_t	RPTR;		/* unsigned relative pointer */

/* For compatibility with Kickstart/Workbench 1.x (1985) only!
 * Do not use these in newer code!
 */
typedef int16_t		SHORT;		/* signed 16-bit quantity (use WORD) */
typedef uint16_t	USHORT;		/* unsigned 16-bit quantity (use UWORD) */
typedef int16_t		COUNT;
typedef uint16_t	UCOUNT;
typedef uint32_t	CPTR;

#endif /* !__use_amiga_stdc_c99 */

#ifdef __cplusplus
typedef char *		STRPTR;		/* string pointer (NUL-terminated) */
#else
typedef unsigned char *	STRPTR;		/* string pointer (NUL-terminated) */
#endif

/* Constant string pointer (NUL-terminated), which is most useful
 * in function prototypes and data structure definitions.
 */
#ifdef __cplusplus
typedef CONST char *		CONST_STRPTR;
#else
typedef CONST unsigned char *	CONST_STRPTR;
#endif

/* Types with specific semantics */
typedef float		FLOAT;
typedef double		DOUBLE;

#ifdef __cplusplus
typedef char		TEXT;
#else
typedef unsigned char	TEXT;
#endif

/* Please note that the BOOL type defined below is intended to
 * be used within data structure declarations and must be of a
 * specific size, i.e. sizeof(BOOL) == 2. It is not intended
 * to be a substitute for the 'C' <stdbool.h> header file
 * definitions or the C++ bool type.
 */
#ifndef __use_amiga_stdc_c99
typedef short	BOOL;
#else
typedef int16_t	BOOL;
#endif /* __use_amiga_stdc_c99 */

#ifndef TRUE
#define TRUE		1
#endif

#ifndef FALSE
#define FALSE		0
#endif

#ifndef NULL
#define NULL		0L
#endif

#define BYTEMASK	0xFF


/* The '#define LIBRARY_VERSION' has been obsolete since 1989. Please use
 * LIBRARY_MINIMUM or code the specific minimum library version you require.
 * Version 33 stands for Kickstart/Workbench 1.2 (1986).
 */
#define LIBRARY_MINIMUM	33 /* Lowest version supported */


/* Remove the local preprocessor symbol which indicated
 * that C99 integer types were to be used.
 */
#ifdef __use_amiga_stdc_c99
#undef __use_amiga_stdc_c99
#endif /* __use_amiga_stdc_c99 */


/* Compiler-specific data and function attributes are used
 * widely in both operating system header files as well as
 * operating system code itself. For convenience, these are
 * included through <exec/types.h>.
 */
#ifndef COMPILER_SPECIFIC_H
#include <clib/compiler-specific.h>
#endif /* COMPILER_SPECIFIC_H */

#endif	/* EXEC_TYPES_H */
