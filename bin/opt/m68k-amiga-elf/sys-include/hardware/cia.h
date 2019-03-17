#ifndef	HARDWARE_CIA_H
#define	HARDWARE_CIA_H
/*
**	$VER: cia.h 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	registers and bits in the Complex Interface Adapter (CIA) chip
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/


#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif /* EXEC_TYPES_H */



/*
 * ciaa is on an ODD address (e.g. the low byte) -- $bfe001
 * ciab is on an EVEN address (e.g. the high byte) -- $bfd000
 *
 * do this to get the definitions:
 *    extern struct CIA ciaa, ciab;
 */


struct CIA {
    UBYTE   ciapra;
    UBYTE   pad0[0xff];
    UBYTE   ciaprb;
    UBYTE   pad1[0xff];
    UBYTE   ciaddra;
    UBYTE   pad2[0xff];
    UBYTE   ciaddrb;
    UBYTE   pad3[0xff];
    UBYTE   ciatalo;
    UBYTE   pad4[0xff];
    UBYTE   ciatahi;
    UBYTE   pad5[0xff];
    UBYTE   ciatblo;
    UBYTE   pad6[0xff];
    UBYTE   ciatbhi;
    UBYTE   pad7[0xff];
    UBYTE   ciatodlow;
    UBYTE   pad8[0xff];
    UBYTE   ciatodmid;
    UBYTE   pad9[0xff];
    UBYTE   ciatodhi;
    UBYTE   pad10[0xff];
    UBYTE   unusedreg;
    UBYTE   pad11[0xff];
    UBYTE   ciasdr;
    UBYTE   pad12[0xff];
    UBYTE   ciaicr;
    UBYTE   pad13[0xff];
    UBYTE   ciacra;
    UBYTE   pad14[0xff];
    UBYTE   ciacrb;
};


/* interrupt control register bit numbers */
#define CIAICRB_TA	0
#define CIAICRB_TB	1
#define CIAICRB_ALRM	2
#define CIAICRB_SP	3
#define CIAICRB_FLG	4
#define CIAICRB_IR	7
#define CIAICRB_SETCLR	7

/* control register A bit numbers */
#define CIACRAB_START	0
#define CIACRAB_PBON	1
#define CIACRAB_OUTMODE 2
#define CIACRAB_RUNMODE 3
#define CIACRAB_LOAD	4
#define CIACRAB_INMODE	5
#define CIACRAB_SPMODE	6
#define CIACRAB_TODIN	7

/* control register B bit numbers */
#define CIACRBB_START	0
#define CIACRBB_PBON	1
#define CIACRBB_OUTMODE 2
#define CIACRBB_RUNMODE 3
#define CIACRBB_LOAD	4
#define CIACRBB_INMODE0 5
#define CIACRBB_INMODE1 6
#define CIACRBB_ALARM	7

/* interrupt control register masks */
#define CIAICRF_TA	(1L<<CIAICRB_TA)
#define CIAICRF_TB	(1L<<CIAICRB_TB)
#define CIAICRF_ALRM	(1L<<CIAICRB_ALRM)
#define CIAICRF_SP	(1L<<CIAICRB_SP)
#define CIAICRF_FLG	(1L<<CIAICRB_FLG)
#define CIAICRF_IR	(1L<<CIAICRB_IR)
#define CIAICRF_SETCLR	(1L<<CIAICRB_SETCLR)

/* control register A register masks */
#define CIACRAF_START	(1L<<CIACRAB_START)
#define CIACRAF_PBON	(1L<<CIACRAB_PBON)
#define CIACRAF_OUTMODE (1L<<CIACRAB_OUTMODE)
#define CIACRAF_RUNMODE (1L<<CIACRAB_RUNMODE)
#define CIACRAF_LOAD	(1L<<CIACRAB_LOAD)
#define CIACRAF_INMODE	(1L<<CIACRAB_INMODE)
#define CIACRAF_SPMODE	(1L<<CIACRAB_SPMODE)
#define CIACRAF_TODIN	(1L<<CIACRAB_TODIN)

/* control register B register masks */
#define CIACRBF_START	(1L<<CIACRBB_START)
#define CIACRBF_PBON	(1L<<CIACRBB_PBON)
#define CIACRBF_OUTMODE (1L<<CIACRBB_OUTMODE)
#define CIACRBF_RUNMODE (1L<<CIACRBB_RUNMODE)
#define CIACRBF_LOAD	(1L<<CIACRBB_LOAD)
#define CIACRBF_INMODE0 (1L<<CIACRBB_INMODE0)
#define CIACRBF_INMODE1 (1L<<CIACRBB_INMODE1)
#define CIACRBF_ALARM	(1L<<CIACRBB_ALARM)

/* control register B INMODE masks */
#define CIACRBF_IN_PHI2 0
#define CIACRBF_IN_CNT	(CIACRBF_INMODE0)
#define CIACRBF_IN_TA	(CIACRBF_INMODE1)
#define CIACRBF_IN_CNT_TA  (CIACRBF_INMODE0|CIACRBF_INMODE1)

/*
 * Port definitions -- what each bit in a cia peripheral register is tied to
 */

/* ciaa port A (0xbfe001) */
#define CIAB_GAMEPORT1	(7)   /* gameport 1, pin 6 (fire button*) */
#define CIAB_GAMEPORT0	(6)   /* gameport 0, pin 6 (fire button*) */
#define CIAB_DSKRDY	(5)   /* disk ready* */
#define CIAB_DSKTRACK0	(4)   /* disk on track 00* */
#define CIAB_DSKPROT	(3)   /* disk write protect* */
#define CIAB_DSKCHANGE	(2)   /* disk change* */
#define CIAB_LED	(1)   /* led light control (0==>bright) */
#define CIAB_OVERLAY	(0)   /* memory overlay bit */

/* ciaa port B (0xbfe101) -- parallel port */

/* ciab port A (0xbfd000) -- serial and printer control */
#define CIAB_COMDTR	(7)   /* serial Data Terminal Ready* */
#define CIAB_COMRTS	(6)   /* serial Request to Send* */
#define CIAB_COMCD	(5)   /* serial Carrier Detect* */
#define CIAB_COMCTS	(4)   /* serial Clear to Send* */
#define CIAB_COMDSR	(3)   /* serial Data Set Ready* */
#define CIAB_PRTRSEL	(2)   /* printer SELECT */
#define CIAB_PRTRPOUT	(1)   /* printer paper out */
#define CIAB_PRTRBUSY	(0)   /* printer busy */

/* ciab port B (0xbfd100) -- disk control */
#define CIAB_DSKMOTOR	(7)   /* disk motorr* */
#define CIAB_DSKSEL3	(6)   /* disk select unit 3* */
#define CIAB_DSKSEL2	(5)   /* disk select unit 2* */
#define CIAB_DSKSEL1	(4)   /* disk select unit 1* */
#define CIAB_DSKSEL0	(3)   /* disk select unit 0* */
#define CIAB_DSKSIDE	(2)   /* disk side select* */
#define CIAB_DSKDIREC	(1)   /* disk direction of seek* */
#define CIAB_DSKSTEP	(0)   /* disk step heads* */

/* ciaa port A (0xbfe001) */
#define CIAF_GAMEPORT1	(1L<<7)
#define CIAF_GAMEPORT0	(1L<<6)
#define CIAF_DSKRDY	(1L<<5)
#define CIAF_DSKTRACK0	(1L<<4)
#define CIAF_DSKPROT	(1L<<3)
#define CIAF_DSKCHANGE	(1L<<2)
#define CIAF_LED	(1L<<1)
#define CIAF_OVERLAY	(1L<<0)

/* ciaa port B (0xbfe101) -- parallel port */

/* ciab port A (0xbfd000) -- serial and printer control */
#define CIAF_COMDTR	(1L<<7)
#define CIAF_COMRTS	(1L<<6)
#define CIAF_COMCD	(1L<<5)
#define CIAF_COMCTS	(1L<<4)
#define CIAF_COMDSR	(1L<<3)
#define CIAF_PRTRSEL	(1L<<2)
#define CIAF_PRTRPOUT	(1L<<1)
#define CIAF_PRTRBUSY	(1L<<0)

/* ciab port B (0xbfd100) -- disk control */
#define CIAF_DSKMOTOR	(1L<<7)
#define CIAF_DSKSEL3	(1L<<6)
#define CIAF_DSKSEL2	(1L<<5)
#define CIAF_DSKSEL1	(1L<<4)
#define CIAF_DSKSEL0	(1L<<3)
#define CIAF_DSKSIDE	(1L<<2)
#define CIAF_DSKDIREC	(1L<<1)
#define CIAF_DSKSTEP	(1L<<0)

#endif	/* HARDWARE_CIA_H */
