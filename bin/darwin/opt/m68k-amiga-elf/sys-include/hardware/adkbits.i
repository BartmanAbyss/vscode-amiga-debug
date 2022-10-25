	IFND	HARDWARE_ADKBITS_I
HARDWARE_ADKBITS_I	SET	1
**
**	$VER: adkbits.i 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	bit definitions for adkcon register
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

ADKB_SETCLR    EQU   15 ; standard set/clear bit
ADKB_PRECOMP1  EQU   14 ; two bits of precompensation
ADKB_PRECOMP0  EQU   13
ADKB_MFMPREC   EQU   12 ; use mfm style precompensation
ADKB_UARTBRK   EQU   11 ; force uart output to zero
ADKB_WORDSYNC  EQU   10 ; enable DSKSYNC register matching
ADKB_MSBSYNC   EQU   9	; (Apple GCR Only) sync on MSB for reading
ADKB_FAST      EQU   8	; 1 -> 2 us/bit (mfm), 2 -> 4 us/bit (gcr)
ADKB_USE3PN    EQU   7	; use aud chan 3 to modulate period of ??
ADKB_USE2P3    EQU   6	; use aud chan 2 to modulate period of 3
ADKB_USE1P2    EQU   5	; use aud chan 1 to modulate period of 2
ADKB_USE0P1    EQU   4	; use aud chan 0 to modulate period of 1
ADKB_USE3VN    EQU   3	; use aud chan 3 to modulate volume of ??
ADKB_USE2V3    EQU   2	; use aud chan 2 to modulate volume of 3
ADKB_USE1V2    EQU   1	; use aud chan 1 to modulate volume of 2
ADKB_USE0V1    EQU   0	; use aud chan 0 to modulate volume of 1

ADKF_SETCLR    EQU   (1<<15)
ADKF_PRECOMP1  EQU   (1<<14)
ADKF_PRECOMP0  EQU   (1<<13)
ADKF_MFMPREC   EQU   (1<<12)
ADKF_UARTBRK   EQU   (1<<11)
ADKF_WORDSYNC  EQU   (1<<10)
ADKF_MSBSYNC   EQU   (1<<9)
ADKF_FAST      EQU   (1<<8)
ADKF_USE3PN    EQU   (1<<7)
ADKF_USE2P3    EQU   (1<<6)
ADKF_USE1P2    EQU   (1<<5)
ADKF_USE0P1    EQU   (1<<4)
ADKF_USE3VN    EQU   (1<<3)
ADKF_USE2V3    EQU   (1<<2)
ADKF_USE1V2    EQU   (1<<1)
ADKF_USE0V1    EQU   (1<<0)

ADKF_PRE000NS  EQU   0			     ; 000 ns of precomp
ADKF_PRE140NS  EQU   (ADKF_PRECOMP0)	     ; 140 ns of precomp
ADKF_PRE280NS  EQU   (ADKF_PRECOMP1)	     ; 280 ns of precomp
ADKF_PRE560NS  EQU   (ADKF_PRECOMP0!ADKF_PRECOMP1) ; 560 ns of precomp

	ENDC	; HARDWARE_ADKBITS_I
