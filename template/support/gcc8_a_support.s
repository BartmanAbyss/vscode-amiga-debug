#define __USER_LABEL_PREFIX__ 
#define __REGISTER_PREFIX__ %
#define __IMMEDIATE_PREFIX__ #

#define CONCAT1(a, b) CONCAT2(a, b)
#define CONCAT2(a, b) a ## b
#define SYM(x) CONCAT1 (__USER_LABEL_PREFIX__, x)
#define FUNC(x) .type SYM(x),function
#define REG(x) CONCAT1 (__REGISTER_PREFIX__, x)
#define IMM(x) CONCAT1 (__IMMEDIATE_PREFIX__, x)
#define d0 REG (d0)
#define d1 REG (d1)
#define d2 REG (d2)
#define d3 REG (d3)
#define d4 REG (d4)
#define d5 REG (d5)
#define d6 REG (d6)
#define d7 REG (d7)
#define a0 REG (a0)
#define a1 REG (a1)
#define a2 REG (a2)
#define a3 REG (a3)
#define a4 REG (a4)
#define a5 REG (a5)
#define a6 REG (a6)
#define fp REG (fp)
#define sp REG (sp)
#define pc REG (pc)

	.macro PICCALL addr
	jbsr	\addr
	.endm

	.cfi_sections .debug_frame
	.text
	FUNC(__mulsi3)
	.globl	SYM (__mulsi3)
SYM (__mulsi3):
	.cfi_startproc
	movew	sp@(4), d0	/* x0 -> d0 */
	muluw	sp@(10), d0	/* x0*y1 */
	movew	sp@(6), d1	/* x1 -> d1 */
	muluw	sp@(8), d1	/* x1*y0 */
	addw	d1, d0
	swap	d0
	clrw	d0
	movew	sp@(6), d1	/* x1 -> d1 */
	muluw	sp@(10), d1	/* x1*y1 */
	addl	d1, d0
	rts
	.cfi_endproc
	.size __mulsi3, .-__mulsi3

	.text
	FUNC(__udivsi3)
	.globl	SYM (__udivsi3)
SYM (__udivsi3):
	.cfi_startproc
	movel	d2, sp@-
	.cfi_adjust_cfa_offset 4
	movel	sp@(12), d1	/* d1 = divisor */
	movel	sp@(8), d0	/* d0 = dividend */

	cmpl	IMM (0x10000), d1 /* divisor >= 2 ^ 16 ?   */
	jcc	3f		/* then try next algorithm */
	movel	d0, d2
	clrw	d2
	swap	d2
	divu	d1, d2          /* high quotient in lower word */
	movew	d2, d0		/* save high quotient */
	swap	d0
	movew	sp@(10), d2	/* get low dividend + high rest */
	divu	d1, d2		/* low quotient */
	movew	d2, d0
	jra	6f

3:	movel	d1, d2		/* use d2 as divisor backup */
4:	lsrl	IMM (1), d1	/* shift divisor */
	lsrl	IMM (1), d0	/* shift dividend */
	cmpl	IMM (0x10000), d1 /* still divisor >= 2 ^ 16 ?  */
	jcc	4b
	divu	d1, d0		/* now we have 16-bit divisor */
	andl	IMM (0xffff), d0 /* mask out divisor, ignore remainder */

/* Multiply the 16-bit tentative quotient with the 32-bit divisor.  Because of
   the operand ranges, this might give a 33-bit product.  If this product is
   greater than the dividend, the tentative quotient was too large. */
	movel	d2, d1
	mulu	d0, d1		/* low part, 32 bits */
	swap	d2
	mulu	d0, d2		/* high part, at most 17 bits */
	swap	d2		/* align high part with low part */
	tstw	d2		/* high part 17 bits? */
	jne	5f		/* if 17 bits, quotient was too large */
	addl	d2, d1		/* add parts */
	jcs	5f		/* if sum is 33 bits, quotient was too large */
	cmpl	sp@(8), d1	/* compare the sum with the dividend */
	jls	6f		/* if sum > dividend, quotient was too large */
5:	subql	IMM (1), d0	/* adjust quotient */

6:	movel	sp@+, d2
	.cfi_adjust_cfa_offset -4
	rts
	.cfi_endproc
	.size __udivsi3, .-__udivsi3

	.text
	FUNC(__divsi3)
	.globl	SYM (__divsi3)
SYM (__divsi3):
	.cfi_startproc
	movel	d2, sp@-
	.cfi_adjust_cfa_offset 4

	moveq	IMM (1), d2	/* sign of result stored in d2 (=1 or =-1) */
	movel	sp@(12), d1	/* d1 = divisor */
	jpl	1f
	negl	d1
	negb	d2		/* change sign because divisor <0  */
1:	movel	sp@(8), d0	/* d0 = dividend */
	jpl	2f
	negl	d0
	negb	d2

2:	movel	d1, sp@-
	movel	d0, sp@-
	PICCALL	SYM (__udivsi3)	/* divide abs(dividend) by abs(divisor) */
	addql	IMM (8), sp

	tstb	d2
	jpl	3f
	negl	d0

3:	movel	sp@+, d2
	.cfi_adjust_cfa_offset -4
	rts
	.cfi_endproc
	.size __divsi3, .-__divsi3

	.text
	FUNC(__modsi3)
	.globl	SYM (__modsi3)
SYM (__modsi3):
	.cfi_startproc
	movel	sp@(8), d1	/* d1 = divisor */
	movel	sp@(4), d0	/* d0 = dividend */
	movel	d1, sp@-
	.cfi_adjust_cfa_offset 4
	movel	d0, sp@-
	.cfi_adjust_cfa_offset 4
	PICCALL	SYM (__divsi3)
	addql	IMM (8), sp
	.cfi_adjust_cfa_offset -8
	movel	sp@(8), d1	/* d1 = divisor */
	movel	d1, sp@-
	.cfi_adjust_cfa_offset 4
	movel	d0, sp@-
	.cfi_adjust_cfa_offset 4
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
	addql	IMM (8), sp
	.cfi_adjust_cfa_offset -8
	movel	sp@(4), d1	/* d1 = dividend */
	subl	d0, d1		/* d1 = a - (a/b)*b */
	movel	d1, d0
	rts
	.cfi_endproc
	.size __modsi3, .-__modsi3

	.text
	FUNC(__umodsi3)
	.globl	SYM (__umodsi3)
SYM (__umodsi3):
	.cfi_startproc
	movel	sp@(8), d1	/* d1 = divisor */
	movel	sp@(4), d0	/* d0 = dividend */
	movel	d1, sp@-
	.cfi_adjust_cfa_offset 4
	movel	d0, sp@-
	.cfi_adjust_cfa_offset 4
	PICCALL	SYM (__udivsi3)
	addql	IMM (8), sp
	.cfi_adjust_cfa_offset -8
	movel	sp@(8), d1	/* d1 = divisor */
	movel	d1, sp@-
	.cfi_adjust_cfa_offset 4
	movel	d0, sp@-
	.cfi_adjust_cfa_offset 4
	PICCALL	SYM (__mulsi3)	/* d0 = (a/b)*b */
	addql	IMM (8), sp
	.cfi_adjust_cfa_offset -8
	movel	sp@(4), d1	/* d1 = dividend */
	subl	d0, d1		/* d1 = a - (a/b)*b */
	movel	d1, d0
	rts
	.cfi_endproc
	.size __umodsi3, .-__umodsi3

	
	.text
	FUNC(KPutCharX)
	.globl	SYM (KPutCharX)

SYM(KPutCharX):
	.cfi_startproc
    move.l  a6, -(sp)
	.cfi_adjust_cfa_offset 4
    move.l  4.w, a6
    jsr     -0x204(a6)
    movea.l (sp)+, a6
	.cfi_adjust_cfa_offset -4
    rts
	.cfi_endproc
	.size KPutCharX, .-KPutCharX

	.text
	FUNC(PutChar)
	.globl	SYM (PutChar)

SYM(PutChar):
	.cfi_startproc
	move.b d0, (a3)+
	rts
	.cfi_endproc
	.size PutChar, .-PutChar
