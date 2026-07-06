#ifndef	COMPILER_SPECIFIC_H
#define	COMPILER_SPECIFIC_H
/*
**	$VER: compiler-specific.h 47.5 (24.11.2021)
**
**	Compiler-specific data and function attributes. Must
**	be included with operating system library and device
**	header files.
**
**	Copyright (C) 2019-2022 Hyperion Entertainment CVBA.
**	    Developed under license.
*/

/* Some structure definitions include prototypes for embedded function
 * pointers. This may not work with 'C' compilers that do not comply to
 * the ANSI standard, which we will have to work around.
 */
#if __STDC__
#define __CLIB_PROTOTYPE(a) a
#else
#define __CLIB_PROTOTYPE(a) ()
#endif /* __STDC__ */

/*
 * Some functions have special calling conventions that may be communicated
 * to the compiler through compiler-specific keywords. For the Lattice and SAS/C
 * compilers the #defines are given here. Otherwise, they should be defined
 * before including the OS functions.
 */

/*
 * Assembler call with arguments placed in registers. __ASM__ defines such a
 * function, with __REG__(r, p) defining the order of the arguments.
 */
#ifndef __ASM__
#ifdef __SASC
#define __ASM__ __asm
#else
#define __ASM__
#endif
#endif /* __ASM__ */

/*
 * The __REG__(r, p) macro uses two parameters, which cover the register
 * name and the parameter declaration itself. This is necessary because
 * the respective compiler syntax may require that the order in which the
 * register and the parameter are used is changed. This is the case for
 * the GNU 'C' compiler.
 */
#ifndef __REG__
#if defined(__SASC) || defined(__MAXON__) || defined(__STORM__)
#define __REG__(r, p) register __ ## r p
#elif defined(__VBCC__)
#define __REG__(r, p) __reg(#r) p
#elif defined(__GNUC__) && defined(AMIGA)
#define __REG__(r, p) p __asm(#r)
#elif defined(_DCC)
#define __REG__(r, p) __ ## r p
#else
#define __REG__(r, p) p
#endif
#endif /* __REG__ */

/*
 * Stack based calling conventions
 */
#ifndef __STDARGS__
#if (defined(__GNUC__) && defined(AMIGA)) || defined(__SASC)
#define __STDARGS__ __stdargs
#elif defined(_DCC)
#define __STDARGS__ __stkargs
#else
#define __STDARGS__
#endif
#endif /* __STDARGS__ */

/*
 * Small data model using A4-relative addressing needs to establish the
 * initial A4 register value.
 */
#ifndef __SAVE_DS__
#if defined(_DCC) || (defined(__GNUC__) && defined(AMIGA)) || defined(__SASC) || defined(__STORM__) || defined(__VBCC__)
#define __SAVE_DS__ __saveds
#else
#define __SAVE_DS__
#endif
#endif /* __SAVE_DS__ */

/*
 * Data or functions marked for absolute addressing rather than PC or
 * register-relative addressing.
 */
#ifndef __FAR__
#if defined(_DCC) || defined(__MAXON__) || defined(__SASC) || defined(__STORM__) || defined(__VBCC__)
#define __FAR__ __far
#else
#define __FAR__
#endif
#endif /* __FAR__ */

/*
 * Request that upon exit from a function the CPU condition codes should be
 * updated based upon whether or not the value of register D0 is non-zero.
 */
#ifndef __INTERRUPT__
#if defined(_DCC) || (defined(__GNUC__) && defined(AMIGA)) || defined(__MAXON__) || defined(__SASC) || defined(__STORM__)
#define __INTERRUPT__ __interrupt
#elif defined(__VBCC__)
#define __INTERRUPT__ __amigainterrupt
#else
#define __INTERRUPT__
#endif
#endif /* __INTERRUPT__ */

/*
 * Request that the object is placed into chip memory (see <exec/memory.h>).
 */
#ifndef __CHIP__
#if defined(_DCC) || (defined(__GNUC__) && defined(AMIGA)) || defined(__MAXON__) || defined(__SASC) || defined(__STORM__) || defined(__VBCC__)
#define __CHIP__ __chip
#else
#define __CHIP__
#endif
#endif /* __CHIP__ */

/*
 * Request that the object is placed into fast memory (see <exec/memory.h>).
 */
#ifndef __FAST__
#if defined(_DCC) || (defined(__GNUC__) && defined(AMIGA)) || defined(__MAXON__) || defined(__SASC) || defined(__STORM__) || defined(__VBCC__)
#define __FAST__ __fast
#else
#define __FAST__
#endif
#endif /* __FAST__ */

#endif /* COMPILER_SPECIFIC_H */
