#ifndef	HARDWARE_ADKBITS_H
#define	HARDWARE_ADKBITS_H
/*
**	$VER: adkbits.h 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	bit definitions for adkcon register
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#define  ADKB_SETCLR	15 /* standard set/clear bit */
#define  ADKB_PRECOMP1	14 /* two bits of precompensation */
#define  ADKB_PRECOMP0	13
#define  ADKB_MFMPREC	12 /* use mfm style precompensation */
#define  ADKB_UARTBRK	11 /* force uart output to zero */
#define  ADKB_WORDSYNC	10 /* enable DSKSYNC register matching */
#define  ADKB_MSBSYNC	9  /* (Apple GCR Only) sync on MSB for reading */
#define  ADKB_FAST	8  /* 1 -> 2 us/bit (mfm), 2 -> 4 us/bit (gcr) */
#define  ADKB_USE3PN	7  /* use aud chan 3 to modulate period of ?? */
#define  ADKB_USE2P3	6  /* use aud chan 2 to modulate period of 3 */
#define  ADKB_USE1P2	5  /* use aud chan 1 to modulate period of 2 */
#define  ADKB_USE0P1	4  /* use aud chan 0 to modulate period of 1 */
#define  ADKB_USE3VN	3  /* use aud chan 3 to modulate volume of ?? */
#define  ADKB_USE2V3	2  /* use aud chan 2 to modulate volume of 3 */
#define  ADKB_USE1V2	1  /* use aud chan 1 to modulate volume of 2 */
#define  ADKB_USE0V1	0  /* use aud chan 0 to modulate volume of 1 */

#define  ADKF_SETCLR	(1L<<15)
#define  ADKF_PRECOMP1	(1L<<14)
#define  ADKF_PRECOMP0	(1L<<13)
#define  ADKF_MFMPREC	(1L<<12)
#define  ADKF_UARTBRK	(1L<<11)
#define  ADKF_WORDSYNC	(1L<<10)
#define  ADKF_MSBSYNC	(1L<<9)
#define  ADKF_FAST	(1L<<8)
#define  ADKF_USE3PN	(1L<<7)
#define  ADKF_USE2P3	(1L<<6)
#define  ADKF_USE1P2	(1L<<5)
#define  ADKF_USE0P1	(1L<<4)
#define  ADKF_USE3VN	(1L<<3)
#define  ADKF_USE2V3	(1L<<2)
#define  ADKF_USE1V2	(1L<<1)
#define  ADKF_USE0V1	(1L<<0)

#define ADKF_PRE000NS	0			/* 000 ns of precomp */
#define ADKF_PRE140NS	(ADKF_PRECOMP0)	/* 140 ns of precomp */
#define ADKF_PRE280NS	(ADKF_PRECOMP1)	/* 280 ns of precomp */
#define ADKF_PRE560NS	(ADKF_PRECOMP0|ADKF_PRECOMP1) /* 560 ns of precomp */

#endif	/* HARDWARE_ADKBITS_H */
