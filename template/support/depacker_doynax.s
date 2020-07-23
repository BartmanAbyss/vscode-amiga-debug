|-------------------------------------------------------------------------------
|Lempel-Ziv decompressor by Johan "Doynax" Forslöf. Call doynamitedepack to decode the entire buffer in
|one go.
|
|This is a fork of the 68000 depacker by Michael Hillebrandt (Axis/Oxyron)
|for the 6502 Doynamite format, except with the encoding rearranged to take
|somewhat better advantage of the 68k architecture.
|
|The present version is 210 bytes long including the tables and should fit
|snugly in the 68020+ cache.
|
|Note that the scheme with a split input stream for odd literal bytes requires
|a significant safety buffer for forward in-place decompression (about 3% but
|dependent on the file to be processed)
|
|Parameters:
|a0 = Input buffer to be decompressed. Must be 16-bit aligned!
|a1 = Output buffer. Points to the end of the data at exit
|
|Register legend:
|d0 = 32-bit shift register terminated by a least-significant 1 bit.
|d1 = Run length.
|d2 = Match offset length in bits.
|d3 = Match offset bitmask.
|d4 = Constant offset type mask.
|d5 = Constant offset length bit mask.
|a0 = Bit-stream pointer.
|a1 = Continuous output pointer.
|a2 = Unaligned literal pointer ahead of the bit-stream. Points to the end of
|     the source buffer at exit.
|a3 = Mid-point where the literal buffer meets the bit-stream at EOF
|a4 = Match source pointer.
|-------------------------------------------------------------------------------
		|Ensure that the shift-register contains at least 16-bits of data by
		|checking whether the trailing word is zero, and if so filling up with
		|another word
		
.macro DOY_REFILL
	DOY_REFILL1 full\@
	DOY_REFILL2
.Lfull\@:
.endm

.macro DOY_REFILL1 label
	tst.w	d0
	bne.s	.L\label
.endm

.macro DOY_REFILL2					|This swaps in the new bits ahead of the
	move.w	(a0)+,d0				|old, but that's fine as long as the
	swap.w	d0						|encoder is in on the scheme
.endm

	|Entry point. Wind up the decruncher
	.type _doynaxdepack_asm,function
	.globl _doynaxdepack_asm
_doynaxdepack_asm:
	movea.l	(a0)+,a2				|Unaligned literal buffer at the end of
	adda.l	a0,a2					|the stream
	move.l	a2,a3
	move.l	(a0)+,d0				|Seed the shift register
	moveq	#0x38,d4				|Masks for match offset extraction
	moveq	#8,d5
	bra.s	.Lliteral

	|******** Copy a literal sequence ********

.Llcopy:							|Copy two bytes at a time, with the
	move.b	(a0)+,(a1)+				|deferral of the length LSB helping
	move.b	(a0)+,(a1)+				|slightly in the unrolling
	dbf		d1,.Llcopy

	lsl.l	#2,d0					|Copy odd bytes separately in order
	bcc.s	.Lmatch					|to keep the source aligned
.Llsingle:
	move.b	(a2)+,(a1)+


	|******** Process a match ********

	|Start by refilling the bit-buffer
.Lmatch:
	DOY_REFILL1 mprefix
	cmp.l	a0,a3					|Take the opportunity to test for the
	bls.s	.Lreturn				|end of the stream while refilling
.Lmrefill:
	DOY_REFILL2

.Lmprefix:
	|Fetch the first three bits identifying the match length, and look up
	|the corresponding table entry
	rol.l	#3+3,d0
	move.w	d0,d1
	and.w	d4,d1
	eor.w	d1,d0
	movem.w	doy_table(pc,d1.w),d2/d3/a4

	|Extract the offset bits and compute the relative source address from it
	rol.l	d2,d0					|Reduced by 3 to account for 8x offset
	and.w	d0,d3					|scaling
	eor.w	d3,d0
	suba.w	d3,a4
	adda.l	a1,a4

	|Decode the match length
	DOY_REFILL
	and.w	d5,d1					|Check the initial length bit from the
	beq.s	.Lmcopy					|type triple

	moveq	#1,d1					|This loops peeks at the next flag
	tst.l	d0						|through the sign bit bit while keeping
	bpl.s	.Lmendlen2				|the LSB in carry
	lsl.l	#2,d0
	bpl.s	.Lmendlen1
.Lmgetlen:
	addx.b	d1,d1
	lsl.l	#2,d0
	bmi.s	.Lmgetlen
.Lmendlen1:
	addx.b	d1,d1
.Lmendlen2:
	|Copy the match data a word at a time. Note that the minimum length is
	|two bytes
	lsl.l	#2,d0					|The trailing length payload bit is
	bcc.s	.Lmhalf					|stored out-of-order
.Lmcopy:
	move.b	(a4)+,(a1)+
.Lmhalf:
	move.b	(a4)+,(a1)+
	dbf		d1,.Lmcopy

	|Fetch a bit flag to see whether what follows is a literal run or
	|another match
	add.l	d0,d0
	bcc.s	.Lmatch


	|******** Process a run of literal bytes ********

	DOY_REFILL						|Replenish the shift-register
.Lliteral:
	|Extract delta-coded run length in the same swizzled format as the
	|matches above
	moveq	#0,d1
	add.l	d0,d0
	bcc.s	.Llsingle				|Single out the one-byte case
	bpl.s	.Llendlen
.Llgetlen:
	addx.b	d1,d1
	lsl.l	#2,d0
	bmi.s	.Llgetlen
.Llendlen:
	addx.b	d1,d1

	|Branch off to the main copying loop unless the run length is 256 bytes
	|or greater, in which case the sixteen guaranteed bits in the buffer
	|may have run out.
	|In the latter case simply give up and stuff the payload bits back onto
	|the stream before fetching a literal 16-bit run length instead
.Llcopy_near:
	dbvs	d1,.Llcopy

	add.l	d0,d0
	eor.w	d1,d0		
	ror.l	#7+1,d0					|Note that the constant MSB acts as a
	move.w	(a0)+,d1				|substitute for the unfetched stop bit
	bra.s	.Llcopy_near


	|******** Offset coding tables ********

.macro DOY_OFFSET bit, ofs
	dc.w	(\bit)-3				|Bit count, reduced by three
	dc.w	(1<<(\bit))-1			|Bit mask
	dc.w	-(\ofs)					|Base offset
	.endm

	.type doy_table,object
doy_table:
	DOY_OFFSET 3,1					|Short A
.Lreturn:
	rts
	DOY_OFFSET 4,1					|Long A
	dc.w	0						|(Empty hole)
	DOY_OFFSET 6,1+8				|Short B
	dc.w	0						|(Empty hole)
	DOY_OFFSET 7,1+16				|Long B
	dc.w	0						|(Empty hole)
	DOY_OFFSET 8,1+8+64				|Short C
	dc.w	0						|(Empty hole)
	DOY_OFFSET 10,1+16+128			|Long C
	dc.w	0						|(Empty hole)
	DOY_OFFSET 10,1+8+64+256		|Short D
	dc.w	0						|(Empty hole)
	DOY_OFFSET 13,1+16+128+1024		|Long D

.size _doynaxdepack_asm, .-_doynaxdepack_asm
