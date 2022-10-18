/*
 * :ts=8
 *
 * 'Roadshow' -- Amiga TCP/IP stack
 * Copyright © 2001-2016 by Olaf Barthel.
 * All Rights Reserved.
 *
 * Amiga specific TCP/IP 'C' header files;
 * Freely Distributable
 */

#ifndef _SYS_NETINCLUDE_TYPES_H
#define _SYS_NETINCLUDE_TYPES_H

/****************************************************************************/

/* The type definitions below mirror those in <exec/types.h>, which may
   clash with local type definitions. Hence, replacements are used which
   are rather unlikely to cause similar conflicts. Note that the definition
   of the __TEXT and __STRPTR types currently support only SAS/C and the
   GNU 'C' compiler. */

/****************************************************************************/

#ifdef __cplusplus
extern "C" {
#endif

/****************************************************************************/

typedef long		__LONG;     /* signed 32-bit quantity */
typedef unsigned long	__ULONG;    /* unsigned 32-bit quantity */
typedef short		__WORD;     /* signed 16-bit quantity */
typedef unsigned short	__UWORD;    /* unsigned 16-bit quantity */
typedef signed char	__BYTE;     /* signed 8-bit quantity */
typedef unsigned char	__UBYTE;    /* unsigned 8-bit quantity */

/****************************************************************************/

typedef void * __APTR; /* 32-bit untyped pointer */

/****************************************************************************/

#if (defined(__GNUC__) && defined(__CHAR_UNSIGNED__)) || (defined(__SASC) && defined(_UNSCHAR))
typedef          char * __STRPTR; /* string pointer (NULL terminated) */
#else
typedef unsigned char * __STRPTR; /* string pointer (NULL terminated) */
#endif

#if (defined(__GNUC__) && defined(__CHAR_UNSIGNED__)) || (defined(__SASC) && defined(_UNSCHAR))
typedef          char __TEXT; /* Non-negative character */
#else
typedef unsigned char __TEXT; /* Non-negative character */
#endif

/****************************************************************************/

#ifdef __cplusplus
}
#endif

/****************************************************************************/

#endif /* !_SYS_NETINCLUDE_TYPES_H */
