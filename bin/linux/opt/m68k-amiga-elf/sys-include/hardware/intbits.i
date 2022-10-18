	IFND	HARDWARE_INTBITS_I
HARDWARE_INTBITS_I	SET	1
**
**	$VER: intbits.i 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	bits in the interrupt enable (and interrupt request) register
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

INTB_SETCLR    EQU   (15)  ;Set/Clear control bit. Determines if bits
			   ;written with a 1 get set or cleared. Bits
			   ;written with a zero are allways unchanged.
INTB_INTEN     EQU   (14)  ;Master interrupt (enable only )
INTB_EXTER     EQU   (13)  ;External interrupt
INTB_DSKSYNC   EQU   (12)  ;Disk re-SYNChronized
INTB_RBF       EQU   (11)  ;serial port Receive Buffer Full
INTB_AUD3      EQU   (10)  ;Audio channel 3 block finished
INTB_AUD2      EQU   (9)   ;Audio channel 2 block finished
INTB_AUD1      EQU   (8)   ;Audio channel 1 block finished
INTB_AUD0      EQU   (7)   ;Audio channel 0 block finished
INTB_BLIT      EQU   (6)   ;Blitter finished
INTB_VERTB     EQU   (5)   ;start of Vertical Blank
INTB_COPER     EQU   (4)   ;Coprocessor
INTB_PORTS     EQU   (3)   ;I/O Ports and timers
INTB_SOFTINT   EQU   (2)   ;software interrupt request
INTB_DSKBLK    EQU   (1)   ;Disk Block done
INTB_TBE       EQU   (0)   ;serial port Transmit Buffer Empty



INTF_SETCLR    EQU   (1<<15)
INTF_INTEN     EQU   (1<<14)
INTF_EXTER     EQU   (1<<13)
INTF_DSKSYNC   EQU   (1<<12)
INTF_RBF       EQU   (1<<11)
INTF_AUD3      EQU   (1<<10)
INTF_AUD2      EQU   (1<<9)
INTF_AUD1      EQU   (1<<8)
INTF_AUD0      EQU   (1<<7)
INTF_BLIT      EQU   (1<<6)
INTF_VERTB     EQU   (1<<5)
INTF_COPER     EQU   (1<<4)
INTF_PORTS     EQU   (1<<3)
INTF_SOFTINT   EQU   (1<<2)
INTF_DSKBLK    EQU   (1<<1)
INTF_TBE       EQU   (1<<0)

	ENDC	; HARDWARE_INTBITS_I
