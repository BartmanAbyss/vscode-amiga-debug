// ported from binutils-gdb/include/opcode/m68k.h, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3
// removed all references to coldfire
// some bugfixes from https://github.com/dirkwhoffmann/Moira/issues/10

// see https://github.com/BartmanAbyss/binutils-gdb/blob/master/opcodes/m68k-dis.c
// see https://github.com/BartmanAbyss/binutils-gdb/blob/master/opcodes/m68k-opc.c
// see https://github.com/BartmanAbyss/binutils-gdb/blob/master/include/opcode/m68k.h
// see http://www.xgc-tek.com/manuals/m68k-ada-gs/x1425.html for pseudo opcodes (jbsr, jra, jcc, dbcc, fjcc)

// 68000 programmer's manual: https://www.nxp.com/docs/en/reference-manual/M68000PRM.pdf
// 68000 user's manual: https://www.nxp.com/docs/en/reference-manual/MC68000UM.pdf
// 68020 user's manual: https://www.nxp.com/docs/en/data-sheet/MC68020UM.pdf
// 68030 user's manual: https://www.nxp.com/docs/en/reference-manual/MC68030UM-P1.pdf
// 68040 user's manual: https://www.nxp.com/docs/en/reference-manual/MC68040UM.pdf
// 68060 user's manual: https://www.nxp.com/docs/en/data-sheet/MC68060UM.pdf
// 68881/68882 user's manual: http://bitsavers.trailing-edge.com/components/motorola/68000/MC68881_MC68882_Floating-Point_Coprocessor_Users_Manual_1ed_1987.pdf

/* We store four bytes of opcode for all opcodes because that is the
   most any of them need.  The actual length of an instruction is
   always at least 2 bytes, and is as much longer as necessary to hold
   the operands it has.
   The match field is a mask saying which bits must match particular
   opcode in order for an instruction to be an instance of that
   opcode.
   The args field is a string containing two characters for each
   operand of the instruction.  The first specifies the kind of
   operand; the second, the place it is stored.
   If the first char of args is '.', it indicates that the opcode is
   two words.  This is only necessary when the match field does not
   have any bits set in the second opcode word.  Such a '.' is skipped
   for operand processing.  */

/* Kinds of operands:
   Characters used: AaBbCcDdEeFfGgHIiJjKkLlMmnOopQqRrSsTtUuVvWwXxYyZz01234|*~%;@!&$?/<>#^+-
   D  data register only.  Stored as 3 bits.
   A  address register only.  Stored as 3 bits.
   a  address register indirect only.  Stored as 3 bits.
   R  either kind of register.  Stored as 4 bits.
   r  either kind of register indirect only.  Stored as 4 bits.
      At the moment, used only for cas2 instruction.
   F  floating point coprocessor register only.   Stored as 3 bits.
   O  an offset (or width): immediate data 0-31 or data register.
      Stored as 6 bits in special format for BF... insns.
   +  autoincrement only.  Stored as 3 bits (number of the address register).
   -  autodecrement only.  Stored as 3 bits (number of the address register).
   Q  quick immediate data.  Stored as 3 bits.
      This matches an immediate operand only when value is in range 1 .. 8.
   M  moveq immediate data.  Stored as 8 bits.
      This matches an immediate operand only when value is in range -128..127
   T  trap vector immediate data.  Stored as 4 bits.
   k  K-factor for fmove.p instruction.   Stored as a 7-bit constant or
      a three bit register offset, depending on the field type.
   #  immediate data.  Stored in special places (b, w or l)
      which say how many bits to store.
   ^  immediate data for floating point instructions.   Special places
      are offset by 2 bytes from '#'...
   B  pc-relative address, converted to an offset
      that is treated as immediate data.
   d  displacement and register.  Stores the register as 3 bits
      and stores the displacement in the entire second word.
   C  the CCR.  No need to store it; this is just for filtering validity.
   S  the SR.  No need to store, just as with CCR.
   U  the USP.  No need to store, just as with CCR.
   E  the MAC ACC.  No need to store, just as with CCR.
   e  the EMAC ACC[0123].
   G  the MAC/EMAC MACSR.  No need to store, just as with CCR.
   g  the EMAC ACCEXT{01,23}.
   H  the MASK.  No need to store, just as with CCR.
   i  the MAC/EMAC scale factor.
   I  Coprocessor ID.   Not printed if 1.   The Coprocessor ID is always
      extracted from the 'd' field of word one, which means that an extended
      coprocessor opcode can be skipped using the 'i' place, if needed.
   s  System Control register for the floating point coprocessor.
   J  Misc register for movec instruction, stored in 'j' format.
        Possible values:
        0x000   SFC     Source Function Code reg        [60, 40, 30, 20, 10]
        0x001   DFC     Data Function Code reg          [60, 40, 30, 20, 10]
        0x002   CACR    Cache Control Register          [60, 40, 30, 20, mcf]
        0x003   TC      MMU Translation Control         [60, 40]
        0x004   ITT0    Instruction Transparent
                                Translation reg 0       [60, 40]
        0x005   ITT1    Instruction Transparent
                                Translation reg 1       [60, 40]
        0x006   DTT0    Data Transparent
                                Translation reg 0       [60, 40]
        0x007   DTT1    Data Transparent
                                Translation reg 1       [60, 40]
        0x008   BUSCR   Bus Control Register            [60]
        0x800   USP     User Stack Pointer              [60, 40, 30, 20, 10]
        0x801   VBR     Vector Base reg                 [60, 40, 30, 20, 10, mcf]
        0x802   CAAR    Cache Address Register          [        30, 20]
        0x803   MSP     Master Stack Pointer            [    40, 30, 20]
        0x804   ISP     Interrupt Stack Pointer         [    40, 30, 20]
        0x805   MMUSR   MMU Status reg                  [    40]
        0x806   URP     User Root Pointer               [60, 40]
        0x807   SRP     Supervisor Root Pointer         [60, 40]
        0x808   PCR     Processor Configuration reg     [60]
        0xC00   ROMBAR  ROM Base Address Register       [520X]
        0xC04   RAMBAR0 RAM Base Address Register 0     [520X]
        0xC05   RAMBAR1 RAM Base Address Register 0     [520X]
        0xC0F   MBAR0   RAM Base Address Register 0     [520X]
        0xC04   FLASHBAR FLASH Base Address Register    [mcf528x]
        0xC05   RAMBAR  Static RAM Base Address Register [mcf528x]
    L  Register list of the type d0-d7/a0-a7 etc.
       (New!  Improved!  Can also hold fp0-fp7, as well!)
       The assembler tries to see if the registers match the insn by
       looking at where the insn wants them stored.
    l  Register list like L, but with all the bits reversed.
       Used for going the other way. . .
    c  cache identifier which may be "nc" for no cache, "ic"
       for instruction cache, "dc" for data cache, or "bc"
       for both caches.  Used in cinv and cpush.  Always
       stored in position "d".
    u  Any register, with ``upper'' or ``lower'' specification.  Used
       in the mac instructions with size word.
 The remainder are all stored as 6 bits using an address mode and a
 register number; they differ in which addressing modes they match.
   *  all                                       (modes 0-6,7.0-4)
   ~  alterable memory                          (modes 2-6,7.0,7.1)
                                                (not 0,1,7.2-4)
   %  alterable                                 (modes 0-6,7.0,7.1)
                                                (not 7.2-4)
   ;  data                                      (modes 0,2-6,7.0-4)
                                                (not 1)
   @  data, but not immediate                   (modes 0,2-6,7.0-3)
                                                (not 1,7.4)
   !  control                                   (modes 2,5,6,7.0-3)
                                                (not 0,1,3,4,7.4)
   &  alterable control                         (modes 2,5,6,7.0,7.1)
                                                (not 0,1,3,4,7.2-4)
   $  alterable data                            (modes 0,2-6,7.0,7.1)
                                                (not 1,7.2-4)
   ?  alterable control, or data register       (modes 0,2,5,6,7.0,7.1)
                                                (not 1,3,4,7.2-4)
   /  control, or data register                 (modes 0,2,5,6,7.0-3)
                                                (not 1,3,4,7.4)
   >  *save operands                            (modes 2,4,5,6,7.0,7.1)
                                                (not 0,1,3,7.2-4)
   <  *restore operands                         (modes 2,3,5,6,7.0-3)
                                                (not 0,1,4,7.4)
   coldfire move operands:
   m                                            (modes 0-4)
   n                                            (modes 5,7.2)
   o                                            (modes 6,7.0,7.1,7.3,7.4)
   p                                            (modes 0-5)
   coldfire bset/bclr/btst/mulsl/mulul operands:
   q                                            (modes 0,2-5)
   v                                            (modes 0,2-5,7.0,7.1)
   b                                            (modes 0,2-5,7.2)
   w                                            (modes 2-5,7.2)
   y                                            (modes 2,5)
   z                                            (modes 2,5,7.2)
   x  mov3q immediate operand.
   j  coprocessor ET operand.
   K  coprocessor command number.
   4                                            (modes 2,3,4,5)
*/

/* For the 68851:  */
/* I didn't use much imagination in choosing the
   following codes, so many of them aren't very
   mnemonic. -rab
   0  32 bit pmmu register
        Possible values:
        000     TC      Translation Control Register (68030, 68851)
   1  16 bit pmmu register
        111     AC      Access Control (68851)
   2  8 bit pmmu register
        100     CAL     Current Access Level (68851)
        101     VAL     Validate Access Level (68851)
        110     SCC     Stack Change Control (68851)
   3  68030-only pmmu registers (32 bit)
        010     TT0     Transparent Translation reg 0
                        (aka Access Control reg 0 -- AC0 -- on 68ec030)
        011     TT1     Transparent Translation reg 1
                        (aka Access Control reg 1 -- AC1 -- on 68ec030)
   W  wide pmmu registers
        Possible values:
        001     DRP     Dma Root Pointer (68851)
        010     SRP     Supervisor Root Pointer (68030, 68851)
        011     CRP     Cpu Root Pointer (68030, 68851)
   f    function code register (68030, 68851)
        0       SFC
        1       DFC
   V    VAL register only (68851)
   X    BADx, BACx (16 bit)
        100     BAD     Breakpoint Acknowledge Data (68851)
        101     BAC     Breakpoint Acknowledge Control (68851)
   Y    PSR (68851) (MMUSR on 68030) (ACUSR on 68ec030)
   Z    PCSR (68851)
   |    memory          (modes 2-6, 7.*)
   t  address test level (68030 only)
      Stored as 3 bits, range 0-7.
      Also used for breakpoint instruction now.
*/

/* Places to put an operand, for non-general operands:
   Characters used: BbCcDdFfGgHhIijkLlMmNnostWw123456789/
   s  source, low bits of first word.
   d  dest, shifted 9 in first word
   1  second word, shifted 12
   2  second word, shifted 6
   3  second word, shifted 0
   4  third word, shifted 12
   5  third word, shifted 6
   6  third word, shifted 0
   7  second word, shifted 7
   8  second word, shifted 10
   9  second word, shifted 5
   E  second word, shifted 9
   D  store in both place 1 and place 3; for divul and divsl.
   B  first word, low byte, for branch displacements
   W  second word (entire), for branch displacements
   L  second and third words (entire), for branch displacements
      (also overloaded for move16)
   b  second word, low byte
   w  second word (entire) [variable word/long branch offset for dbra]
   W  second word (entire) (must be signed 16 bit value)
   l  second and third word (entire)
   g  variable branch offset for bra and similar instructions.
      The place to store depends on the magnitude of offset.
   t  store in both place 7 and place 8; for floating point operations
   c  branch offset for cpBcc operations.
      The place to store is word two if bit six of word one is zero,
      and words two and three if bit six of word one is one.
   i  Increment by two, to skip over coprocessor extended operands.   Only
      works with the 'I' format.
   k  Dynamic K-factor field.   Bits 6-4 of word 2, used as a register number.
      Also used for dynamic fmovem instruction.
   C  floating point coprocessor constant - 7 bits.  Also used for static
      K-factors...
   j  Movec register #, stored in 12 low bits of second word.
   m  For M[S]ACx; 4 bits split with MSB shifted 6 bits in first word
      and remaining 3 bits of register shifted 9 bits in first word.
      Indicate upper/lower in 1 bit shifted 7 bits in second word.
      Use with `R' or `u' format.
   n  `m' withouth upper/lower indication. (For M[S]ACx; 4 bits split
      with MSB shifted 6 bits in first word and remaining 3 bits of
      register shifted 9 bits in first word.  No upper/lower
      indication is done.)  Use with `R' or `u' format.
   o  For M[S]ACw; 4 bits shifted 12 in second word (like `1').
      Indicate upper/lower in 1 bit shifted 7 bits in second word.
      Use with `R' or `u' format.
   M  For M[S]ACw; 4 bits in low bits of first word.  Indicate
      upper/lower in 1 bit shifted 6 bits in second word.  Use with
      `R' or `u' format.
   N  For M[S]ACw; 4 bits in low bits of second word.  Indicate
      upper/lower in 1 bit shifted 6 bits in second word.  Use with
      `R' or `u' format.
   h  shift indicator (scale factor), 1 bit shifted 10 in second word
 Places to put operand, for general operands:
   d  destination, shifted 6 bits in first word
   b  source, at low bit of first word, and immediate uses one byte
   w  source, at low bit of first word, and immediate uses two bytes
   l  source, at low bit of first word, and immediate uses four bytes
   s  source, at low bit of first word.
      Used sometimes in contexts where immediate is not allowed anyway.
   f  single precision float, low bit of 1st word, immediate uses 4 bytes
   F  double precision float, low bit of 1st word, immediate uses 8 bytes
   x  extended precision float, low bit of 1st word, immediate uses 12 bytes
   p  packed float, low bit of 1st word, immediate uses 12 bytes
   G  EMAC accumulator, load  (bit 4 2nd word, !bit8 first word)
   H  EMAC accumulator, non load  (bit 4 2nd word, bit 8 first word)
   F  EMAC ACCx
   f  EMAC ACCy
   I  MAC/EMAC scale factor
   /  Like 's', but set 2nd word, bit 5 if trailing_ampersand set
   ]  first word, bit 10
*/

// eslint-disable @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match, @typescript-eslint/naming-convention 

enum dis {
	noninsn,		// Not a valid instruction.  
	nonbranch,		// Not a branch instruction.  
	branch,			// Unconditional branch.  
	condbranch,		// Conditional branch.  
	jsr,			// Jump to subroutine.  
	condjsr,		// Conditional jump to subroutine.  
	dref,			// Data reference instruction.  
	dref2			// Two data references in instruction.  
}

const m68000 = 0x001;
const m68010 = 0x002;
const m68020 = 0x004;
const m68030 = 0x008;
const m68040 = 0x010;
const m68060 = 0x020;
const m68881 = 0x040;
const m68851 = 0x080;
const m68k_mask = 0x3ff;

// Handy aliases.  
const m68040up = (m68040 | m68060);
const m68030up = (m68030 | m68040up);
const m68020up = (m68020 | m68030up);
const m68010up = (m68010 | m68020up);
const m68000up = (m68000 | m68010up);

const mfloat = (m68881 | m68040 | m68060);
const mmmu   = (m68851 | m68030 | m68040 | m68060);

interface m68k_opcode {
	name: string;
	size: number;
	opcode: number;
	match: number;
	args: string;
	arch: number;
	type: dis;
}

const one = (x: number) => x << 16 >>> 0; // >>> 0: make unsigned
const two = (x: number, y: number) => ((x << 16) + y) >>> 0;

const SCOPE_LINE = (0x1 << 3);
const SCOPE_PAGE = (0x2 << 3);
const SCOPE_ALL  = (0x3 << 3);

// ported from binutils-gdb/opcodes/m68k-opc.c, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3
// removed all coldfire opcodes

const m68k_opcodes: m68k_opcode[] = [
	{ name: "abcd",  size: 2,	opcode: one(0o0140400),	match: one(0o0170770), args: "DsDd", arch: m68000up, type: dis.nonbranch },
	{ name: "abcd",  size: 2,	opcode: one(0o0140410),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },

	{ name: "adda.w", size: 2,	opcode: one(0o0150300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "adda.l", size: 2,	opcode: one(0o0150700),	match: one(0o0170700), args: "*lAd", arch: m68000up, type: dis.nonbranch },

	{ name: "addi.b", size: 4,	opcode: one(0o0003000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addi.w", size: 4,	opcode: one(0o0003100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addi.l", size: 6,	opcode: one(0o0003200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },

	{ name: "addq.b", size: 2,	opcode: one(0o0050000),	match: one(0o0170700), args: "Qd$b", arch: m68000up, type: dis.nonbranch },
	{ name: "addq.w", size: 2,	opcode: one(0o0050100),	match: one(0o0170700), args: "Qd%w", arch: m68000up, type: dis.nonbranch },
	{ name: "addq.l", size: 2,	opcode: one(0o0050200),	match: one(0o0170700), args: "Qd%l", arch: m68000up, type: dis.nonbranch },

	// The add opcode can generate the adda, addi, and addq instructions.  
	{ name: "add.b", size: 2,	opcode: one(0o0050000),	match: one(0o0170700), args: "Qd$b", arch: m68000up, type: dis.nonbranch },
	{ name: "add.b", size: 4,	opcode: one(0o0003000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "add.b", size: 2,	opcode: one(0o0150000),	match: one(0o0170700), args: ";bDd", arch: m68000up, type: dis.nonbranch },
	{ name: "add.b", size: 2,	opcode: one(0o0150400),	match: one(0o0170700), args: "Dd~b", arch: m68000up, type: dis.nonbranch },
	{ name: "add.w", size: 2,	opcode: one(0o0050100),	match: one(0o0170700), args: "Qd%w", arch: m68000up, type: dis.nonbranch },
	{ name: "add.w", size: 2,	opcode: one(0o0150300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "add.w", size: 4,	opcode: one(0o0003100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "add.w", size: 2,	opcode: one(0o0150100),	match: one(0o0170700), args: "*wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "add.w", size: 2,	opcode: one(0o0150500),	match: one(0o0170700), args: "Dd~w", arch: m68000up, type: dis.nonbranch },
	{ name: "add.l", size: 2,	opcode: one(0o0050200),	match: one(0o0170700), args: "Qd%l", arch: m68000up, type: dis.nonbranch },
	{ name: "add.l", size: 6,	opcode: one(0o0003200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "add.l", size: 2,	opcode: one(0o0150700),	match: one(0o0170700), args: "*lAd", arch: m68000up, type: dis.nonbranch },
	{ name: "add.l", size: 2,	opcode: one(0o0150200),	match: one(0o0170700), args: "*lDd", arch: m68000up, type: dis.nonbranch },
	{ name: "add.l", size: 2,	opcode: one(0o0150600),	match: one(0o0170700), args: "Dd~l", arch: m68000up, type: dis.nonbranch },

	{ name: "addx.b", size: 2,	opcode: one(0o0150400),	match: one(0o0170770), args: "DsDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addx.b", size: 2,	opcode: one(0o0150410),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },
	{ name: "addx.w", size: 2,	opcode: one(0o0150500),	match: one(0o0170770), args: "DsDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addx.w", size: 2,	opcode: one(0o0150510),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },
	{ name: "addx.l", size: 2,	opcode: one(0o0150600),	match: one(0o0170770), args: "DsDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addx.l", size: 2,	opcode: one(0o0150610),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },

	{ name: "andi.b", size: 4,	opcode: one(0o0001000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andi.b", size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "andi.w", size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andi.w", size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },
	{ name: "andi.l", size: 6,	opcode: one(0o0001200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andi",  size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andi",  size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "andi",  size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },

	// The and opcode can generate the andi instruction.  
	{ name: "and.b", size: 4,	opcode: one(0o0001000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "and.b", size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "and.b", size: 2,	opcode: one(0o0140000),	match: one(0o0170700), args: ";bDd", arch: m68000up, type: dis.nonbranch },
	{ name: "and.b", size: 2,	opcode: one(0o0140400),	match: one(0o0170700), args: "Dd~b", arch: m68000up, type: dis.nonbranch },
	{ name: "and.w", size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "and.w", size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },
	{ name: "and.w", size: 2,	opcode: one(0o0140100),	match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "and.w", size: 2,	opcode: one(0o0140500),	match: one(0o0170700), args: "Dd~w", arch: m68000up, type: dis.nonbranch },
	{ name: "and.l", size: 6,	opcode: one(0o0001200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "and.l", size: 2,	opcode: one(0o0140200),	match: one(0o0170700), args: ";lDd", arch: m68000up, type: dis.nonbranch },
	{ name: "and.l", size: 2,	opcode: one(0o0140600),	match: one(0o0170700), args: "Dd~l", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$w", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 2,	opcode: one(0o0140100),	match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 2,	opcode: one(0o0140500),	match: one(0o0170700), args: "Dd~w", arch: m68000up, type: dis.nonbranch },

	{ name: "asl.b", size: 2,	opcode: one(0o0160400),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asl.b", size: 2,	opcode: one(0o0160440),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asl.w", size: 2,	opcode: one(0o0160500),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asl.w", size: 2,	opcode: one(0o0160540),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asl.w", size: 2,	opcode: one(0o0160700),	match: one(0o0177700), args: "~s",   arch: m68000up, type: dis.nonbranch },
	{ name: "asl.l", size: 2,	opcode: one(0o0160600),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asl.l", size: 2,	opcode: one(0o0160640),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },

	{ name: "asr.b", size: 2,	opcode: one(0o0160000),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asr.b", size: 2,	opcode: one(0o0160040),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asr.w", size: 2,	opcode: one(0o0160100),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asr.w", size: 2,	opcode: one(0o0160140),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asr.w", size: 2,	opcode: one(0o0160300),	match: one(0o0177700), args: "~s",   arch: m68000up, type: dis.nonbranch },
	{ name: "asr.l", size: 2,	opcode: one(0o0160200),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asr.l", size: 2,	opcode: one(0o0160240),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },

	{ name: "bhi.w", size: 2,	opcode: one(0o0061000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bls.w", size: 2,	opcode: one(0o0061400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bcc.w", size: 2,	opcode: one(0o0062000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bcs.w", size: 2,	opcode: one(0o0062400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bne.w", size: 2,	opcode: one(0o0063000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "beq.w", size: 2,	opcode: one(0o0063400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bvc.w", size: 2,	opcode: one(0o0064000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bvs.w", size: 2,	opcode: one(0o0064400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bpl.w", size: 2,	opcode: one(0o0065000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bmi.w", size: 2,	opcode: one(0o0065400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bge.w", size: 2,	opcode: one(0o0066000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "blt.w", size: 2,	opcode: one(0o0066400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "bgt.w", size: 2,	opcode: one(0o0067000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },
	{ name: "ble.w", size: 2,	opcode: one(0o0067400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.condbranch },

	{ name: "bhi.l", size: 2,	opcode: one(0o0061377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bls.l", size: 2,	opcode: one(0o0061777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bcc.l", size: 2,	opcode: one(0o0062377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bcs.l", size: 2,	opcode: one(0o0062777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bne.l", size: 2,	opcode: one(0o0063377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "beq.l", size: 2,	opcode: one(0o0063777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bvc.l", size: 2,	opcode: one(0o0064377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bvs.l", size: 2,	opcode: one(0o0064777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bpl.l", size: 2,	opcode: one(0o0065377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bmi.l", size: 2,	opcode: one(0o0065777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bge.l", size: 2,	opcode: one(0o0066377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "blt.l", size: 2,	opcode: one(0o0066777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "bgt.l", size: 2,	opcode: one(0o0067377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },
	{ name: "ble.l", size: 2,	opcode: one(0o0067777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.condbranch },

	{ name: "bhi.s", size: 2,	opcode: one(0o0061000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bls.s", size: 2,	opcode: one(0o0061400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bcc.s", size: 2,	opcode: one(0o0062000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bcs.s", size: 2,	opcode: one(0o0062400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bne.s", size: 2,	opcode: one(0o0063000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "beq.s", size: 2,	opcode: one(0o0063400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bvc.s", size: 2,	opcode: one(0o0064000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bvs.s", size: 2,	opcode: one(0o0064400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bpl.s", size: 2,	opcode: one(0o0065000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bmi.s", size: 2,	opcode: one(0o0065400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bge.s", size: 2,	opcode: one(0o0066000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "blt.s", size: 2,	opcode: one(0o0066400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "bgt.s", size: 2,	opcode: one(0o0067000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },
	{ name: "ble.s", size: 2,	opcode: one(0o0067400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.condbranch },

	{ name: "jhi", size: 2,		opcode: one(0o0061000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch }, // pseudo op
	{ name: "jls", size: 2,		opcode: one(0o0061400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jcc", size: 2,		opcode: one(0o0062000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jcs", size: 2,		opcode: one(0o0062400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jne", size: 2,		opcode: one(0o0063000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jeq", size: 2,		opcode: one(0o0063400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jvc", size: 2,		opcode: one(0o0064000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jvs", size: 2,		opcode: one(0o0064400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jpl", size: 2,		opcode: one(0o0065000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jmi", size: 2,		opcode: one(0o0065400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jge", size: 2,		opcode: one(0o0066000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jlt", size: 2,		opcode: one(0o0066400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jgt", size: 2,		opcode: one(0o0067000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jle", size: 2,		opcode: one(0o0067400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },

	{ name: "bchg", size: 2,	opcode: one(0o0000500),	match: one(0o0170700), args: "Dd$s", arch: m68000up, type: dis.nonbranch },
	{ name: "bchg", size: 4,	opcode: one(0o0004100),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },

	{ name: "bclr", size: 2,	opcode: one(0o0000600),	match: one(0o0170700), args: "Dd$s", arch: m68000up, type: dis.nonbranch },
	{ name: "bclr", size: 4,	opcode: one(0o0004200),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },

	{ name: "bfchg",  size: 4,	opcode: two(0o0165300, 0), match: two(0o0177700, 0o0170000),	args: "?sO2O3",   arch: m68020up, type: dis.nonbranch },
	{ name: "bfclr",  size: 4,	opcode: two(0o0166300, 0), match: two(0o0177700, 0o0170000),	args: "?sO2O3",   arch: m68020up, type: dis.nonbranch },
	{ name: "bfexts", size: 4,	opcode: two(0o0165700, 0), match: two(0o0177700, 0o0100000),	args: "/sO2O3D1", arch: m68020up, type: dis.nonbranch },
	{ name: "bfextu", size: 4,	opcode: two(0o0164700, 0), match: two(0o0177700, 0o0100000),	args: "/sO2O3D1", arch: m68020up, type: dis.nonbranch },
	{ name: "bfffo",  size: 4,	opcode: two(0o0166700, 0), match: two(0o0177700, 0o0100000),	args: "/sO2O3D1", arch: m68020up, type: dis.nonbranch },
	{ name: "bfins",  size: 4,	opcode: two(0o0167700, 0), match: two(0o0177700, 0o0100000),	args: "D1?sO2O3", arch: m68020up, type: dis.nonbranch },
	{ name: "bfset",  size: 4,	opcode: two(0o0167300, 0), match: two(0o0177700, 0o0170000),	args: "?sO2O3",   arch: m68020up, type: dis.nonbranch },
	{ name: "bftst",  size: 4,	opcode: two(0o0164300, 0), match: two(0o0177700, 0o0170000),	args: "/sO2O3",   arch: m68020up, type: dis.nonbranch },

	{ name: "bkpt", size: 2,	opcode: one(0o0044110),	match: one(0o0177770), args: "ts", arch: m68010up, type: dis.nonbranch },

	{ name: "bra.w", size: 2,	opcode: one(0o0060000),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.branch },
	{ name: "bra.l", size: 2,	opcode: one(0o0060377),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.branch },
	{ name: "bra.s", size: 2,	opcode: one(0o0060000),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.branch },

	{ name: "bset", size: 2,	opcode: one(0o0000700),	match: one(0o0170700), args: "Dd$s", arch: m68000up, type: dis.nonbranch },
	{ name: "bset", size: 4,	opcode: one(0o0004300),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },

	{ name: "bsr.w", size: 2,	opcode: one(0o0060400),	match: one(0o0177777), args: "BW", arch: m68000up, type: dis.jsr },
	{ name: "bsr.l", size: 2,	opcode: one(0o0060777),	match: one(0o0177777), args: "BL", arch: m68020up, type: dis.jsr },
	{ name: "bsr.s", size: 2,	opcode: one(0o0060400),	match: one(0o0177400), args: "BB", arch: m68000up, type: dis.jsr },

	{ name: "btst", size: 2,	opcode: one(0o0000400),	match: one(0o0170700), args: "Dd;b", arch: m68000up, type: dis.nonbranch },
	{ name: "btst", size: 4,	opcode: one(0o0004000),	match: one(0o0177700), args: "#b@s", arch: m68000up, type: dis.nonbranch },

	{ name: "callm", size: 4,	opcode: one(0o0003300),	match: one(0o0177700), args: "#b!s", arch: m68020, type: dis.nonbranch },

	{ name: "cas2.w", size: 6,  opcode: two(0o0006374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5r1r4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2.w", size: 6,  opcode: two(0o0006374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5R1R4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2.l", size: 6,  opcode: two(0o0007374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5r1r4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2.l", size: 6,  opcode: two(0o0007374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5R1R4", arch: m68020up, type: dis.nonbranch },

	{ name: "cas.b", size: 4,	opcode: two(0o0005300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },
	{ name: "cas.w", size: 4,	opcode: two(0o0006300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },
	{ name: "cas.l", size: 4,	opcode: two(0o0007300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },

	{ name: "chk2.b", size: 4, 	opcode: two(0o0000300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },
	{ name: "chk2.w", size: 4, 	opcode: two(0o0001300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },
	{ name: "chk2.l", size: 4, 	opcode: two(0o0002300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },

	{ name: "chk.l", size: 2,	opcode: one(0o0040400),		match: one(0o0170700), args: ";lDd", arch: m68020up, type: dis.nonbranch },
	{ name: "chk.w", size: 2,	opcode: one(0o0040600),		match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },

	{ name: "cinva", size: 2,	opcode: one(0xf400|SCOPE_ALL),  match: one(0xff38), args: "ce",   arch: m68040up, type: dis.nonbranch },
	{ name: "cinvl", size: 2,	opcode: one(0xf400|SCOPE_LINE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },
	{ name: "cinvp", size: 2,	opcode: one(0xf400|SCOPE_PAGE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },

	{ name: "cpusha", size: 2,	opcode: one(0xf420|SCOPE_ALL),  match: one(0xff38), args: "ce",   arch: m68040up, type: dis.nonbranch },
	{ name: "cpushl", size: 2,	opcode: one(0xf420|SCOPE_LINE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },
	{ name: "cpushp", size: 2,	opcode: one(0xf420|SCOPE_PAGE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },

	{ name: "clr.b", size: 2,	opcode: one(0o0041000),	match: one(0o0177700), args: "$s", arch: m68000up, type: dis.nonbranch },
	{ name: "clr.w", size: 2,	opcode: one(0o0041100),	match: one(0o0177700), args: "$s", arch: m68000up, type: dis.nonbranch },
	{ name: "clr.l", size: 2,	opcode: one(0o0041200),	match: one(0o0177700), args: "$s", arch: m68000up, type: dis.nonbranch },

	{ name: "cmp2.b", size: 4,	opcode: two(0o0000300,0),   match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },
	{ name: "cmp2.w", size: 4,	opcode: two(0o0001300,0),	match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },
	{ name: "cmp2.l", size: 4,	opcode: two(0o0002300,0),	match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },

	{ name: "cmpa.w", size: 2,	opcode: one(0o0130300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpa.l", size: 2,	opcode: one(0o0130700),	match: one(0o0170700), args: "*lAd", arch: m68000up, type: dis.nonbranch },

	{ name: "cmpi.b", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpi.b", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b@s", arch: m68020up, type: dis.nonbranch },
	{ name: "cmpi.w", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpi.w", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w@s", arch: m68020up, type: dis.nonbranch },
	{ name: "cmpi.l", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpi.l", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l@s", arch: m68020up, type: dis.nonbranch },

	{ name: "cmpm.b", size: 2,	opcode: one(0o0130410),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpm.w", size: 2,	opcode: one(0o0130510),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpm.l", size: 2,	opcode: one(0o0130610),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },

	// The cmp opcode can generate the cmpa, cmpm, and cmpi instructions.  
	{ name: "cmp.b", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmp.b", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b@s", arch: m68020up, type: dis.nonbranch },
	{ name: "cmp.b", size: 2,	opcode: one(0o0130410),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.b", size: 2,	opcode: one(0o0130000),	match: one(0o0170700), args: ";bDd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.w", size: 2,	opcode: one(0o0130300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.w", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w$s", arch: m68000 | m68010 , type: dis.nonbranch},
	{ name: "cmp.w", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w@s", arch: m68020up, type: dis.nonbranch },
	{ name: "cmp.w", size: 2,	opcode: one(0o0130510),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.w", size: 2,	opcode: one(0o0130100),	match: one(0o0170700), args: "*wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.l", size: 2,	opcode: one(0o0130700),	match: one(0o0170700), args: "*lAd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.l", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmp.l", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l@s", arch: m68020up, type: dis.nonbranch },
	{ name: "cmp.l", size: 2,	opcode: one(0o0130610),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmp.l", size: 2,	opcode: one(0o0130200),	match: one(0o0170700), args: "*lDd", arch: m68000up, type: dis.nonbranch },

	{ name: "dbcc", size: 2,	opcode: one(0o0052310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbcs", size: 2,	opcode: one(0o0052710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbeq", size: 2,	opcode: one(0o0053710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbf",  size: 2,	opcode: one(0o0050710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbge", size: 2,	opcode: one(0o0056310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbgt", size: 2,	opcode: one(0o0057310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbhi", size: 2,	opcode: one(0o0051310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dble", size: 2,	opcode: one(0o0057710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbls", size: 2,	opcode: one(0o0051710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dblt", size: 2,	opcode: one(0o0056710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbmi", size: 2,	opcode: one(0o0055710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbne", size: 2,	opcode: one(0o0053310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbpl", size: 2,	opcode: one(0o0055310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbt",  size: 2,	opcode: one(0o0050310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbvc", size: 2,	opcode: one(0o0054310),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },
	{ name: "dbvs", size: 2,	opcode: one(0o0054710),	match: one(0o0177770), args: "DsBw", arch: m68000up , type: dis.condbranch },

	{ name: "divs.w", size: 2,	opcode: one(0o0100700),	match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },

	{ name: "divs.l", size: 4, 	opcode: two(0o0046100,0o0006000),match: two(0o0177700,0o0107770), args: ";lD3D1", arch: m68020up , type: dis.nonbranch },
	{ name: "divs.l", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lDD",   arch: m68020up , type: dis.nonbranch },

	{ name: "divsl.l", size: 4, opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lD3D1",arch: m68020up , type: dis.nonbranch },
	{ name: "divsl.l", size: 4, opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lDD",  arch: m68020up , type: dis.nonbranch },

	{ name: "divu.w", size: 2,	opcode: one(0o0100300),		match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },

	{ name: "divu.l", size: 4,	opcode: two(0o0046100,0o0002000),match: two(0o0177700,0o0107770), args:";lD3D1", arch: m68020up , type: dis.nonbranch },
	{ name: "divu.l", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lDD",   arch: m68020up , type: dis.nonbranch },
	
	{ name: "divul.l", size: 4, opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lD3D1",arch: m68020up , type: dis.nonbranch },
	{ name: "divul.l", size: 4, opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lDD",  arch: m68020up , type: dis.nonbranch },

	{ name: "eori.b", size: 4,	opcode: one(0o0005000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.b", size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.w", size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.w", size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.l", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },

	// The eor opcode can generate the eori instruction.
	{ name: "eor.b", size: 4,	opcode: one(0o0005000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.b", size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.b", size: 2,	opcode: one(0o0130400),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.w", size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.w", size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.w", size: 2,	opcode: one(0o0130500),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.l", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor.l", size: 2,	opcode: one(0o0130600),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 2,	opcode: one(0o0130500),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },

	{ name: "exg", size: 2,	    opcode: one(0o0140500),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "exg", size: 2,	    opcode: one(0o0140510),	match: one(0o0170770), args: "AdAs", arch: m68000up , type: dis.nonbranch },
	{ name: "exg", size: 2,	    opcode: one(0o0140610),	match: one(0o0170770), args: "DdAs", arch: m68000up , type: dis.nonbranch },
	{ name: "exg", size: 2,	    opcode: one(0o0140610),	match: one(0o0170770), args: "AsDd", arch: m68000up , type: dis.nonbranch },

	{ name: "ext.w",  size: 2,	opcode: one(0o0044200),	match: one(0o0177770), args: "Ds", arch: m68000up , type: dis.nonbranch },
	{ name: "ext.l",  size: 2,	opcode: one(0o0044300),	match: one(0o0177770), args: "Ds", arch: m68000up , type: dis.nonbranch },
	{ name: "extb.l", size: 2,	opcode: one(0o0044700),	match: one(0o0177770), args: "Ds", arch: m68020up , type: dis.nonbranch },

	// FLOAT starts here
	{ name: "fabs.b", size: 4,	opcode: two(0xF000, 0x5818), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.d", size: 4,	opcode: two(0xF000, 0x5418), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.l", size: 4,	opcode: two(0xF000, 0x4018), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.p", size: 4,	opcode: two(0xF000, 0x4C18), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.s", size: 4,	opcode: two(0xF000, 0x4418), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.w", size: 4,	opcode: two(0xF000, 0x5018), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.x", size: 4,	opcode: two(0xF000, 0x0018), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.x", size: 4,	opcode: two(0xF000, 0x4818), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fabs.x", size: 4,	opcode: two(0xF000, 0x0018), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsabs.b", size: 4,	opcode: two(0xF000, 0x5858), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.d", size: 4,	opcode: two(0xF000, 0x5458), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.l", size: 4,	opcode: two(0xF000, 0x4058), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.p", size: 4,	opcode: two(0xF000, 0x4C58), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.s", size: 4,	opcode: two(0xF000, 0x4458), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.w", size: 4,	opcode: two(0xF000, 0x5058), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.x", size: 4,	opcode: two(0xF000, 0x0058), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.x", size: 4,	opcode: two(0xF000, 0x4858), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsabs.x", size: 4,	opcode: two(0xF000, 0x0058), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "fdabs.b", size: 4,	opcode: two(0xF000, 0x585c), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.d", size: 4,	opcode: two(0xF000, 0x545c), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.l", size: 4,	opcode: two(0xF000, 0x405c), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.p", size: 4,	opcode: two(0xF000, 0x4C5c), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.s", size: 4,	opcode: two(0xF000, 0x445c), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.w", size: 4,	opcode: two(0xF000, 0x505c), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.x", size: 4,	opcode: two(0xF000, 0x005c), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.x", size: 4,	opcode: two(0xF000, 0x485c), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up, type: dis.nonbranch },
	{ name: "fdabs.x", size: 4,	opcode: two(0xF000, 0x005c), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up, type: dis.nonbranch },
	
	{ name: "facos.b", size: 4,	opcode: two(0xF000, 0x581C), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.d", size: 4,	opcode: two(0xF000, 0x541C), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.l", size: 4,	opcode: two(0xF000, 0x401C), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.p", size: 4,	opcode: two(0xF000, 0x4C1C), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.s", size: 4,	opcode: two(0xF000, 0x441C), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.w", size: 4,	opcode: two(0xF000, 0x501C), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.x", size: 4,	opcode: two(0xF000, 0x001C), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.x", size: 4,	opcode: two(0xF000, 0x481C), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "facos.x", size: 4,	opcode: two(0xF000, 0x001C), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fadd.b", size: 4,	opcode: two(0xF000, 0x5822), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.d", size: 4,	opcode: two(0xF000, 0x5422), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.l", size: 4,	opcode: two(0xF000, 0x4022), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.p", size: 4,	opcode: two(0xF000, 0x4C22), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.s", size: 4,	opcode: two(0xF000, 0x4422), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.w", size: 4,	opcode: two(0xF000, 0x5022), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.x", size: 4,	opcode: two(0xF000, 0x0022), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fadd.x", size: 4,	opcode: two(0xF000, 0x4822), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsadd.b", size: 4,	opcode: two(0xF000, 0x5862), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.d", size: 4,	opcode: two(0xF000, 0x5462), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.l", size: 4,	opcode: two(0xF000, 0x4062), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.p", size: 4,	opcode: two(0xF000, 0x4C62), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.s", size: 4,	opcode: two(0xF000, 0x4462), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.w", size: 4,	opcode: two(0xF000, 0x5062), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.x", size: 4,	opcode: two(0xF000, 0x0062), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsadd.x", size: 4,	opcode: two(0xF000, 0x4862), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fdadd.b", size: 4,	opcode: two(0xF000, 0x5866), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.d", size: 4,	opcode: two(0xF000, 0x5466), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.l", size: 4,	opcode: two(0xF000, 0x4066), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.p", size: 4,	opcode: two(0xF000, 0x4C66), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.s", size: 4,	opcode: two(0xF000, 0x4466), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.w", size: 4,	opcode: two(0xF000, 0x5066), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.x", size: 4,	opcode: two(0xF000, 0x0066), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdadd.x", size: 4,	opcode: two(0xF000, 0x4866), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fasin.b", size: 4,	opcode: two(0xF000, 0x580C), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.d", size: 4,	opcode: two(0xF000, 0x540C), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.l", size: 4,	opcode: two(0xF000, 0x400C), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.p", size: 4,	opcode: two(0xF000, 0x4C0C), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.s", size: 4,	opcode: two(0xF000, 0x440C), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.w", size: 4,	opcode: two(0xF000, 0x500C), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.x", size: 4,	opcode: two(0xF000, 0x000C), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.x", size: 4,	opcode: two(0xF000, 0x480C), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fasin.x", size: 4,	opcode: two(0xF000, 0x000C), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fatan.b", size: 4,	opcode: two(0xF000, 0x580A), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.d", size: 4,	opcode: two(0xF000, 0x540A), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.l", size: 4,	opcode: two(0xF000, 0x400A), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.p", size: 4,	opcode: two(0xF000, 0x4C0A), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.s", size: 4,	opcode: two(0xF000, 0x440A), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.w", size: 4,	opcode: two(0xF000, 0x500A), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.x", size: 4,	opcode: two(0xF000, 0x000A), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.x", size: 4,	opcode: two(0xF000, 0x480A), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatan.x", size: 4,	opcode: two(0xF000, 0x000A), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fatanh.b", size: 4,opcode: two(0xF000, 0x580D), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.d", size: 4,opcode: two(0xF000, 0x540D), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.l", size: 4,opcode: two(0xF000, 0x400D), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.p", size: 4,opcode: two(0xF000, 0x4C0D), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.s", size: 4,opcode: two(0xF000, 0x440D), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.w", size: 4,opcode: two(0xF000, 0x500D), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.x", size: 4,opcode: two(0xF000, 0x000D), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.x", size: 4,opcode: two(0xF000, 0x480D), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fatanh.x", size: 4,opcode: two(0xF000, 0x000D), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	// This is the same as `fbf opcode: .+2'.
	{ name: "fnop", size: 4,	opcode: two(0xF280, 0x0000), match: two(0xFFFF, 0xFFFF), args: "Ii", arch: mfloat, type: dis.nonbranch },
	
	{ name: "fbeq", size: 2,	opcode: one(0xF081),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbf", size: 2,		opcode: one(0xF080),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbge", size: 2,	opcode: one(0xF093),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbgl", size: 2,	opcode: one(0xF096),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbgle", size: 2,	opcode: one(0xF097),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbgt", size: 2,	opcode: one(0xF092),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fble", size: 2,	opcode: one(0xF095),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fblt", size: 2,	opcode: one(0xF094),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbne", size: 2,	opcode: one(0xF08E),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbnge", size: 2,	opcode: one(0xF09C),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbngl", size: 2,	opcode: one(0xF099),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbngle", size: 2,	opcode: one(0xF098),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbngt", size: 2,	opcode: one(0xF09D),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbnle", size: 2,	opcode: one(0xF09A),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbnlt", size: 2,	opcode: one(0xF09B),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fboge", size: 2,	opcode: one(0xF083),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbogl", size: 2,	opcode: one(0xF086),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbogt", size: 2,	opcode: one(0xF082),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbole", size: 2,	opcode: one(0xF085),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbolt", size: 2,	opcode: one(0xF084),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbor", size: 2,	opcode: one(0xF087),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbseq", size: 2,	opcode: one(0xF091),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbsf", size: 2,	opcode: one(0xF090),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbsne", size: 2,	opcode: one(0xF09E),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbst", size: 2,	opcode: one(0xF09F),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbt", size: 2,		opcode: one(0xF08F),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbueq", size: 2,	opcode: one(0xF089),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbuge", size: 2,	opcode: one(0xF08B),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbugt", size: 2,	opcode: one(0xF08A),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbule", size: 2,	opcode: one(0xF08D),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbult", size: 2,	opcode: one(0xF08C),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	{ name: "fbun", size: 2,	opcode: one(0xF088),		match: one(0xF1FF), args: "IdBW", arch: mfloat, type: dis.nonbranch },
	
	{ name: "fbeq.l", size: 2,	opcode: one(0xF0C1),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbf.l", size: 2,	opcode: one(0xF0C0),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbge.l", size: 2,	opcode: one(0xF0D3),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbgl.l", size: 2,	opcode: one(0xF0D6),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbgle.l", size: 2,	opcode: one(0xF0D7),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbgt.l", size: 2,	opcode: one(0xF0D2),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fble.l", size: 2,	opcode: one(0xF0D5),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fblt.l", size: 2,	opcode: one(0xF0D4),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbne.l", size: 2,	opcode: one(0xF0CE),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbnge.l", size: 2,	opcode: one(0xF0DC),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbngl.l", size: 2,	opcode: one(0xF0D9),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbngle.l", size: 2,opcode: one(0xF0D8),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbngt.l", size: 2,	opcode: one(0xF0DD),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbnle.l", size: 2,	opcode: one(0xF0DA),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbnlt.l", size: 2,	opcode: one(0xF0DB),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fboge.l", size: 2,	opcode: one(0xF0C3),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbogl.l", size: 2,	opcode: one(0xF0C6),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbogt.l", size: 2,	opcode: one(0xF0C2),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbole.l", size: 2,	opcode: one(0xF0C5),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbolt.l", size: 2,	opcode: one(0xF0C4),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbor.l", size: 2,	opcode: one(0xF0C7),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbseq.l", size: 2,	opcode: one(0xF0D1),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbsf.l", size: 2,	opcode: one(0xF0D0),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbsne.l", size: 2,	opcode: one(0xF0DE),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbst.l", size: 2,	opcode: one(0xF0DF),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbt.l", size: 2,	opcode: one(0xF0CF),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbueq.l", size: 2,	opcode: one(0xF0C9),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbuge.l", size: 2,	opcode: one(0xF0CB),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbugt.l", size: 2,	opcode: one(0xF0CA),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbule.l", size: 2,	opcode: one(0xF0CD),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbult.l", size: 2,	opcode: one(0xF0CC),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	{ name: "fbun.l", size: 2,	opcode: one(0xF0C8),		match: one(0xF1FF), args: "IdBC", arch: mfloat, type: dis.nonbranch },
	
	{ name: "fjeq", size: 2,	opcode: one(0xF081),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjf", size: 2,		opcode: one(0xF080),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjge", size: 2,	opcode: one(0xF093),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjgl", size: 2,	opcode: one(0xF096),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjgle", size: 2,	opcode: one(0xF097),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjgt", size: 2,	opcode: one(0xF092),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjle", size: 2,	opcode: one(0xF095),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjlt", size: 2,	opcode: one(0xF094),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjne", size: 2,	opcode: one(0xF08E),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjnge", size: 2,	opcode: one(0xF09C),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjngl", size: 2,	opcode: one(0xF099),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjngle", size: 2,	opcode: one(0xF098),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjngt", size: 2,	opcode: one(0xF09D),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjnle", size: 2,	opcode: one(0xF09A),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjnlt", size: 2,	opcode: one(0xF09B),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjoge", size: 2,	opcode: one(0xF083),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjogl", size: 2,	opcode: one(0xF086),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjogt", size: 2,	opcode: one(0xF082),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjole", size: 2,	opcode: one(0xF085),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjolt", size: 2,	opcode: one(0xF084),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjor", size: 2,	opcode: one(0xF087),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjseq", size: 2,	opcode: one(0xF091),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjsf", size: 2,	opcode: one(0xF090),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjsne", size: 2,	opcode: one(0xF09E),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjst", size: 2,	opcode: one(0xF09F),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjt", size: 2,		opcode: one(0xF08F),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjueq", size: 2,	opcode: one(0xF089),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjuge", size: 2,	opcode: one(0xF08B),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjugt", size: 2,	opcode: one(0xF08A),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjule", size: 2,	opcode: one(0xF08D),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjult", size: 2,	opcode: one(0xF08C),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },
	{ name: "fjun", size: 2,	opcode: one(0xF088),		match: one(0xF1BF), args: "IdBc", arch: mfloat, type: dis.condbranch },

	{ name: "fcmp.b", size: 4,	opcode: two(0xF000, 0x5838), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.d", size: 4,	opcode: two(0xF000, 0x5438), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.l", size: 4,	opcode: two(0xF000, 0x4038), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.p", size: 4,	opcode: two(0xF000, 0x4C38), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.s", size: 4,	opcode: two(0xF000, 0x4438), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.w", size: 4,	opcode: two(0xF000, 0x5038), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.x", size: 4,	opcode: two(0xF000, 0x0038), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcmp.x", size: 4,	opcode: two(0xF000, 0x4838), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fcos.b", size: 4,	opcode: two(0xF000, 0x581D), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.d", size: 4,	opcode: two(0xF000, 0x541D), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.l", size: 4,	opcode: two(0xF000, 0x401D), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.p", size: 4,	opcode: two(0xF000, 0x4C1D), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.s", size: 4,	opcode: two(0xF000, 0x441D), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.w", size: 4,	opcode: two(0xF000, 0x501D), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.x", size: 4,	opcode: two(0xF000, 0x001D), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.x", size: 4,	opcode: two(0xF000, 0x481D), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcos.x", size: 4,	opcode: two(0xF000, 0x001D), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fcosh.b", size: 4,	opcode: two(0xF000, 0x5819), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.d", size: 4,	opcode: two(0xF000, 0x5419), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.l", size: 4,	opcode: two(0xF000, 0x4019), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.p", size: 4,	opcode: two(0xF000, 0x4C19), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.s", size: 4,	opcode: two(0xF000, 0x4419), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.w", size: 4,	opcode: two(0xF000, 0x5019), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.x", size: 4,	opcode: two(0xF000, 0x0019), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.x", size: 4,	opcode: two(0xF000, 0x4819), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fcosh.x", size: 4,	opcode: two(0xF000, 0x0019), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fdbeq", size: 4,	opcode: two(0xF048, 0x0001), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbf", size: 4,	opcode: two(0xF048, 0x0000), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbge", size: 4,	opcode: two(0xF048, 0x0013), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbgl", size: 4,	opcode: two(0xF048, 0x0016), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbgle", size: 4,	opcode: two(0xF048, 0x0017), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbgt", size: 4,	opcode: two(0xF048, 0x0012), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdble", size: 4,	opcode: two(0xF048, 0x0015), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdblt", size: 4,	opcode: two(0xF048, 0x0014), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbne", size: 4,	opcode: two(0xF048, 0x000E), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbnge", size: 4,	opcode: two(0xF048, 0x001C), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbngl", size: 4,	opcode: two(0xF048, 0x0019), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbngle", size: 4,	opcode: two(0xF048, 0x0018), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbngt", size: 4,	opcode: two(0xF048, 0x001D), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbnle", size: 4,	opcode: two(0xF048, 0x001A), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbnlt", size: 4,	opcode: two(0xF048, 0x001B), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdboge", size: 4,	opcode: two(0xF048, 0x0003), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbogl", size: 4,	opcode: two(0xF048, 0x0006), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbogt", size: 4,	opcode: two(0xF048, 0x0002), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbole", size: 4,	opcode: two(0xF048, 0x0005), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbolt", size: 4,	opcode: two(0xF048, 0x0004), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbor", size: 4,	opcode: two(0xF048, 0x0007), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbseq", size: 4,	opcode: two(0xF048, 0x0011), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbsf", size: 4,	opcode: two(0xF048, 0x0010), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbsne", size: 4,	opcode: two(0xF048, 0x001E), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbst", size: 4,	opcode: two(0xF048, 0x001F), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbt", size: 4,	opcode: two(0xF048, 0x000F), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbueq", size: 4,	opcode: two(0xF048, 0x0009), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbuge", size: 4,	opcode: two(0xF048, 0x000B), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbugt", size: 4,	opcode: two(0xF048, 0x000A), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbule", size: 4,	opcode: two(0xF048, 0x000D), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbult", size: 4,	opcode: two(0xF048, 0x000C), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	{ name: "fdbun", size: 4,	opcode: two(0xF048, 0x0008), match: two(0xF1F8, 0xFFFF), args: "IiDsBw", arch: mfloat , type: dis.condbranch },
	
	{ name: "fdiv.b", size: 4,	opcode: two(0xF000, 0x5820), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.d", size: 4,	opcode: two(0xF000, 0x5420), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.l", size: 4,	opcode: two(0xF000, 0x4020), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.p", size: 4,	opcode: two(0xF000, 0x4C20), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.s", size: 4,	opcode: two(0xF000, 0x4420), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.w", size: 4,	opcode: two(0xF000, 0x5020), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.x", size: 4,	opcode: two(0xF000, 0x0020), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fdiv.x", size: 4,	opcode: two(0xF000, 0x4820), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsdiv.b", size: 4,	opcode: two(0xF000, 0x5860), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.d", size: 4,	opcode: two(0xF000, 0x5460), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.l", size: 4,	opcode: two(0xF000, 0x4060), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.p", size: 4,	opcode: two(0xF000, 0x4C60), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.s", size: 4,	opcode: two(0xF000, 0x4460), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.w", size: 4,	opcode: two(0xF000, 0x5060), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.x", size: 4,	opcode: two(0xF000, 0x0060), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsdiv.x", size: 4,	opcode: two(0xF000, 0x4860), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fddiv.b", size: 4,	opcode: two(0xF000, 0x5864), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.d", size: 4,	opcode: two(0xF000, 0x5464), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.l", size: 4,	opcode: two(0xF000, 0x4064), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.p", size: 4,	opcode: two(0xF000, 0x4C64), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.s", size: 4,	opcode: two(0xF000, 0x4464), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.w", size: 4,	opcode: two(0xF000, 0x5064), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.x", size: 4,	opcode: two(0xF000, 0x0064), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fddiv.x", size: 4,	opcode: two(0xF000, 0x4864), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fetox.b", size: 4,	opcode: two(0xF000, 0x5810), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.d", size: 4,	opcode: two(0xF000, 0x5410), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.l", size: 4,	opcode: two(0xF000, 0x4010), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.p", size: 4,	opcode: two(0xF000, 0x4C10), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.s", size: 4,	opcode: two(0xF000, 0x4410), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.w", size: 4,	opcode: two(0xF000, 0x5010), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.x", size: 4,	opcode: two(0xF000, 0x0010), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.x", size: 4,	opcode: two(0xF000, 0x4810), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetox.x", size: 4,	opcode: two(0xF000, 0x0010), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fetoxm1.b", size:4,opcode: two(0xF000, 0x5808), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.d", size:4,opcode: two(0xF000, 0x5408), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.l", size:4,opcode: two(0xF000, 0x4008), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.p", size:4,opcode: two(0xF000, 0x4C08), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.s", size:4,opcode: two(0xF000, 0x4408), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.w", size:4,opcode: two(0xF000, 0x5008), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.x", size:4,opcode: two(0xF000, 0x0008), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.x", size:4,opcode: two(0xF000, 0x4808), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fetoxm1.x", size:4,opcode: two(0xF000, 0x0008), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.b", size:4,opcode: two(0xF000, 0x581E), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.d", size:4,opcode: two(0xF000, 0x541E), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.l", size:4,opcode: two(0xF000, 0x401E), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.p", size:4,opcode: two(0xF000, 0x4C1E), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.s", size:4,opcode: two(0xF000, 0x441E), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.w", size:4,opcode: two(0xF000, 0x501E), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.x", size:4,opcode: two(0xF000, 0x001E), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.x", size:4,opcode: two(0xF000, 0x481E), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetexp.x", size:4,opcode: two(0xF000, 0x001E), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.b", size:4,opcode: two(0xF000, 0x581F), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.d", size:4,opcode: two(0xF000, 0x541F), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.l", size:4,opcode: two(0xF000, 0x401F), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.p", size:4,opcode: two(0xF000, 0x4C1F), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.s", size:4,opcode: two(0xF000, 0x441F), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.w", size:4,opcode: two(0xF000, 0x501F), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.x", size:4,opcode: two(0xF000, 0x001F), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.x", size:4,opcode: two(0xF000, 0x481F), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fgetman.x", size:4,opcode: two(0xF000, 0x001F), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fint.b", size: 4,	opcode: two(0xF000, 0x5801), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.d", size: 4,	opcode: two(0xF000, 0x5401), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.l", size: 4,	opcode: two(0xF000, 0x4001), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.p", size: 4,	opcode: two(0xF000, 0x4C01), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.s", size: 4,	opcode: two(0xF000, 0x4401), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.w", size: 4,	opcode: two(0xF000, 0x5001), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.x", size: 4,	opcode: two(0xF000, 0x0001), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.x", size: 4,	opcode: two(0xF000, 0x4801), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fint.x", size: 4,	opcode: two(0xF000, 0x0001), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fintrz.b", size: 4,opcode: two(0xF000, 0x5803), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.d", size: 4,opcode: two(0xF000, 0x5403), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.l", size: 4,opcode: two(0xF000, 0x4003), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.p", size: 4,opcode: two(0xF000, 0x4C03), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.s", size: 4,opcode: two(0xF000, 0x4403), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.w", size: 4,opcode: two(0xF000, 0x5003), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.x", size: 4,opcode: two(0xF000, 0x0003), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.x", size: 4,opcode: two(0xF000, 0x4803), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fintrz.x", size: 4,opcode: two(0xF000, 0x0003), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },

	{ name: "flog10.b", size: 4,opcode: two(0xF000, 0x5815), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.d", size: 4,opcode: two(0xF000, 0x5415), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.l", size: 4,opcode: two(0xF000, 0x4015), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.p", size: 4,opcode: two(0xF000, 0x4C15), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.s", size: 4,opcode: two(0xF000, 0x4415), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.w", size: 4,opcode: two(0xF000, 0x5015), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.x", size: 4,opcode: two(0xF000, 0x0015), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.x", size: 4,opcode: two(0xF000, 0x4815), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog10.x", size: 4,opcode: two(0xF000, 0x0015), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "flog2.b", size: 4,	opcode: two(0xF000, 0x5816), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.d", size: 4,	opcode: two(0xF000, 0x5416), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.l", size: 4,	opcode: two(0xF000, 0x4016), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.p", size: 4,	opcode: two(0xF000, 0x4C16), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.s", size: 4,	opcode: two(0xF000, 0x4416), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.w", size: 4,	opcode: two(0xF000, 0x5016), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.x", size: 4,	opcode: two(0xF000, 0x0016), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.x", size: 4,	opcode: two(0xF000, 0x4816), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flog2.x", size: 4,	opcode: two(0xF000, 0x0016), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "flogn.b", size: 4,	opcode: two(0xF000, 0x5814), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.d", size: 4,	opcode: two(0xF000, 0x5414), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.l", size: 4,	opcode: two(0xF000, 0x4014), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.p", size: 4,	opcode: two(0xF000, 0x4C14), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.s", size: 4,	opcode: two(0xF000, 0x4414), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.w", size: 4,	opcode: two(0xF000, 0x5014), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.x", size: 4,	opcode: two(0xF000, 0x0014), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.x", size: 4,	opcode: two(0xF000, 0x4814), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flogn.x", size: 4,	opcode: two(0xF000, 0x0014), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "flognp1.b", size:4,opcode: two(0xF000, 0x5806), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.d", size:4,opcode: two(0xF000, 0x5406), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.l", size:4,opcode: two(0xF000, 0x4006), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.p", size:4,opcode: two(0xF000, 0x4C06), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.s", size:4,opcode: two(0xF000, 0x4406), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.w", size:4,opcode: two(0xF000, 0x5006), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.x", size:4,opcode: two(0xF000, 0x0006), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.x", size:4,opcode: two(0xF000, 0x4806), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "flognp1.x", size:4,opcode: two(0xF000, 0x0006), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fmod.b", size: 4,	opcode: two(0xF000, 0x5821), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.d", size: 4,	opcode: two(0xF000, 0x5421), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.l", size: 4,	opcode: two(0xF000, 0x4021), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.p", size: 4,	opcode: two(0xF000, 0x4C21), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.s", size: 4,	opcode: two(0xF000, 0x4421), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.w", size: 4,	opcode: two(0xF000, 0x5021), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.x", size: 4,	opcode: two(0xF000, 0x0021), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmod.x", size: 4,	opcode: two(0xF000, 0x4821), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fmove.b", size: 4,	opcode: two(0xF000, 0x5800), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.b", size: 4,	opcode: two(0xF000, 0x7800), match: two(0xF1C0, 0xFC7F), args: "IiF7$b", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.d", size: 4,	opcode: two(0xF000, 0x5400), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.d", size: 4,	opcode: two(0xF000, 0x7400), match: two(0xF1C0, 0xFC7F), args: "IiF7~F", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.l", size: 4,	opcode: two(0xF000, 0x4000), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.l", size: 4,	opcode: two(0xF000, 0x6000), match: two(0xF1C0, 0xFC7F), args: "IiF7$l", arch: mfloat , type: dis.nonbranch },
	// FIXME: the next two variants should not permit moving an address register to anything but the floating point instruction register.
	{ name: "fmove.l", size: 4,	opcode: two(0xF000, 0xA000), match: two(0xF1C0, 0xE3FF), args: "Iis8%s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.l", size: 4,	opcode: two(0xF000, 0x8000), match: two(0xF1C0, 0xE3FF), args: "Ii*ls8", arch: mfloat , type: dis.nonbranch },
	// Move the FP control registers.
	{ name: "fmove.p", size: 4,	opcode: two(0xF000, 0x4C00), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.p", size: 4,	opcode: two(0xF000, 0x6C00), match: two(0xF1C0, 0xFC00), args:"IiF7~pkC",arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.p", size: 4,	opcode: two(0xF000, 0x7C00), match: two(0xF1C0, 0xFC0F), args:"IiF7~pDk",arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.s", size: 4,	opcode: two(0xF000, 0x4400), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.s", size: 4,	opcode: two(0xF000, 0x6400), match: two(0xF1C0, 0xFC7F), args: "IiF7$f", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.w", size: 4,	opcode: two(0xF000, 0x5000), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.w", size: 4,	opcode: two(0xF000, 0x7000), match: two(0xF1C0, 0xFC7F), args: "IiF7$w", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.x", size: 4,	opcode: two(0xF000, 0x0000), match: two(0xF1FF, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.x", size: 4,	opcode: two(0xF000, 0x4800), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmove.x", size: 4,	opcode: two(0xF000, 0x6800), match: two(0xF1C0, 0xFC7F), args: "IiF7~x", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsmove.b", size: 4,opcode: two(0xF000, 0x5840), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.d", size: 4,opcode: two(0xF000, 0x5440), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.l", size: 4,opcode: two(0xF000, 0x4040), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.s", size: 4,opcode: two(0xF000, 0x4440), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.w", size: 4,opcode: two(0xF000, 0x5040), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.x", size: 4,opcode: two(0xF000, 0x0040), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.x", size: 4,opcode: two(0xF000, 0x4840), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmove.p", size: 4,opcode: two(0xF000, 0x4C40), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },

	{ name: "fdmove.b", size: 4,opcode: two(0xF000, 0x5844), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.d", size: 4,opcode: two(0xF000, 0x5444), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.l", size: 4,opcode: two(0xF000, 0x4044), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.s", size: 4,opcode: two(0xF000, 0x4444), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.w", size: 4,opcode: two(0xF000, 0x5044), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.x", size: 4,opcode: two(0xF000, 0x0044), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.x", size: 4,opcode: two(0xF000, 0x4844), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmove.p", size: 4,opcode: two(0xF000, 0x4C44), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fmovecrx", size:4,	opcode: two(0xF000, 0x5C00), match: two(0xF1FF, 0xFC00), args: "Ii#CF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fmovem.x", size: 4,opcode: two(0xF000, 0xF800), match: two(0xF1C0, 0xFF8F), args: "IiDk&s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF020, 0xE800), match: two(0xF1F8, 0xFF8F), args: "IiDk-s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF000, 0xD800), match: two(0xF1C0, 0xFF8F), args: "Ii&sDk", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF018, 0xD800), match: two(0xF1F8, 0xFF8F), args: "Ii+sDk", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF000, 0xF000), match: two(0xF1C0, 0xFF00), args: "Idl3&s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF000, 0xF000), match: two(0xF1C0, 0xFF00), args: "Id#3&s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF000, 0xD000), match: two(0xF1C0, 0xFF00), args: "Id&sl3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF000, 0xD000), match: two(0xF1C0, 0xFF00), args: "Id&s#3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF020, 0xE000), match: two(0xF1F8, 0xFF00), args: "IdL3-s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF020, 0xE000), match: two(0xF1F8, 0xFF00), args: "Id#3-s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF018, 0xD000), match: two(0xF1F8, 0xFF00), args: "Id+sl3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.x", size: 4,opcode: two(0xF018, 0xD000), match: two(0xF1F8, 0xFF00), args: "Id+s#3", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fmovem.l", size: 4,opcode: two(0xF000, 0xA000), match: two(0xF1C0, 0xE3FF), args: "Iis8%s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem.l", size: 4,opcode: two(0xF000, 0xA000), match: two(0xF1C0, 0xE3FF), args: "IiL8~s", arch: mfloat , type: dis.nonbranch },
	// FIXME: In the next instruction, we should only permit %dn if the target is a single register.  We should only permit %an if the target is a single %fpiar.
	{ name: "fmovem.l", size: 4,opcode: two(0xF000, 0x8000), match: two(0xF1C0, 0xE3FF), args: "Ii*lL8", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fmovem", size: 4,	opcode: two(0xF020, 0xE000), match: two(0xF1F8, 0xFF00), args: "IdL3-s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xF000), match: two(0xF1C0, 0xFF00), args: "Idl3&s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF018, 0xD000), match: two(0xF1F8, 0xFF00), args: "Id+sl3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xD000), match: two(0xF1C0, 0xFF00), args: "Id&sl3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF020, 0xE000), match: two(0xF1F8, 0xFF00), args: "Id#3-s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF020, 0xE800), match: two(0xF1F8, 0xFF8F), args: "IiDk-s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xF000), match: two(0xF1C0, 0xFF00), args: "Id#3&s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xF800), match: two(0xF1C0, 0xFF8F), args: "IiDk&s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF018, 0xD000), match: two(0xF1F8, 0xFF00), args: "Id+s#3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF018, 0xD800), match: two(0xF1F8, 0xFF8F), args: "Ii+sDk", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xD000), match: two(0xF1C0, 0xFF00), args: "Id&s#3", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xD800), match: two(0xF1C0, 0xFF8F), args: "Ii&sDk", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xA000), match: two(0xF1C0, 0xE3FF), args: "Iis8%s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0x8000), match: two(0xF1C0, 0xE3FF), args: "Ii*ss8", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0xA000), match: two(0xF1C0, 0xE3FF), args: "IiL8~s", arch: mfloat , type: dis.nonbranch },
	{ name: "fmovem", size: 4,	opcode: two(0xF000, 0x8000), match: two(0xF2C0, 0xE3FF), args: "Ii*sL8", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fmul.b", size: 4,	opcode: two(0xF000, 0x5823), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.d", size: 4,	opcode: two(0xF000, 0x5423), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.l", size: 4,	opcode: two(0xF000, 0x4023), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.p", size: 4,	opcode: two(0xF000, 0x4C23), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.s", size: 4,	opcode: two(0xF000, 0x4423), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.w", size: 4,	opcode: two(0xF000, 0x5023), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.x", size: 4,	opcode: two(0xF000, 0x0023), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fmul.x", size: 4,	opcode: two(0xF000, 0x4823), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsmul.b", size: 4,	opcode: two(0xF000, 0x5863), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.d", size: 4,	opcode: two(0xF000, 0x5463), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.l", size: 4,	opcode: two(0xF000, 0x4063), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.p", size: 4,	opcode: two(0xF000, 0x4C63), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.s", size: 4,	opcode: two(0xF000, 0x4463), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.w", size: 4,	opcode: two(0xF000, 0x5063), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.x", size: 4,	opcode: two(0xF000, 0x0063), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsmul.x", size: 4,	opcode: two(0xF000, 0x4863), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fdmul.b", size: 4,	opcode: two(0xF000, 0x5867), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.d", size: 4,	opcode: two(0xF000, 0x5467), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.l", size: 4,	opcode: two(0xF000, 0x4067), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.p", size: 4,	opcode: two(0xF000, 0x4C67), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.s", size: 4,	opcode: two(0xF000, 0x4467), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.w", size: 4,	opcode: two(0xF000, 0x5067), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.x", size: 4,	opcode: two(0xF000, 0x0067), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdmul.x", size: 4,	opcode: two(0xF000, 0x4867), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	
	{ name: "fneg.b", size: 4,	opcode: two(0xF000, 0x581A), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.d", size: 4,	opcode: two(0xF000, 0x541A), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.l", size: 4,	opcode: two(0xF000, 0x401A), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.p", size: 4,	opcode: two(0xF000, 0x4C1A), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.s", size: 4,	opcode: two(0xF000, 0x441A), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.w", size: 4,	opcode: two(0xF000, 0x501A), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.x", size: 4,	opcode: two(0xF000, 0x001A), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.x", size: 4,	opcode: two(0xF000, 0x481A), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fneg.x", size: 4,	opcode: two(0xF000, 0x001A), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsneg.b", size: 4,	opcode: two(0xF000, 0x585A), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.d", size: 4,	opcode: two(0xF000, 0x545A), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.l", size: 4,	opcode: two(0xF000, 0x405A), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.p", size: 4,	opcode: two(0xF000, 0x4C5A), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.s", size: 4,	opcode: two(0xF000, 0x445A), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.w", size: 4,	opcode: two(0xF000, 0x505A), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.x", size: 4,	opcode: two(0xF000, 0x005A), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.x", size: 4,	opcode: two(0xF000, 0x485A), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fsneg.x", size: 4,	opcode: two(0xF000, 0x005A), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "fdneg.b", size: 4,	opcode: two(0xF000, 0x585E), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.d", size: 4,	opcode: two(0xF000, 0x545E), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.l", size: 4,	opcode: two(0xF000, 0x405E), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.p", size: 4,	opcode: two(0xF000, 0x4C5E), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.s", size: 4,	opcode: two(0xF000, 0x445E), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.w", size: 4,	opcode: two(0xF000, 0x505E), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.x", size: 4,	opcode: two(0xF000, 0x005E), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.x", size: 4,	opcode: two(0xF000, 0x485E), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdneg.x", size: 4,	opcode: two(0xF000, 0x005E), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "frem.b", size: 4,	opcode: two(0xF000, 0x5825), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.d", size: 4,	opcode: two(0xF000, 0x5425), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.l", size: 4,	opcode: two(0xF000, 0x4025), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.p", size: 4,	opcode: two(0xF000, 0x4C25), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.s", size: 4,	opcode: two(0xF000, 0x4425), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.w", size: 4,	opcode: two(0xF000, 0x5025), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.x", size: 4,	opcode: two(0xF000, 0x0025), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "frem.x", size: 4,	opcode: two(0xF000, 0x4825), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "frestore", size:2,	opcode: one(0xF140),		 match: one(0xF1C0), args: "Id<s", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsave", size: 2,	opcode: one(0xF100),		 match: one(0xF1C0), args: "Id>s", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fscale.b", size: 4,opcode: two(0xF000, 0x5826), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.d", size: 4,opcode: two(0xF000, 0x5426), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.l", size: 4,opcode: two(0xF000, 0x4026), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.p", size: 4,opcode: two(0xF000, 0x4C26), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.s", size: 4,opcode: two(0xF000, 0x4426), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.w", size: 4,opcode: two(0xF000, 0x5026), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.x", size: 4,opcode: two(0xF000, 0x0026), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fscale.x", size: 4,opcode: two(0xF000, 0x4826), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	
	// $ is necessary to prevent the assembler from using PC-relative.If used, "label: fseq label" could produce "ftrapeq", size: 2, because "label" became "pc@label".
	{ name: "fseq", size: 4,	opcode: two(0xF040, 0x0001), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsf", size: 4,		opcode: two(0xF040, 0x0000), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsge", size: 4,	opcode: two(0xF040, 0x0013), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgl", size: 4,	opcode: two(0xF040, 0x0016), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgle", size: 4,	opcode: two(0xF040, 0x0017), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgt", size: 4,	opcode: two(0xF040, 0x0012), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsle", size: 4,	opcode: two(0xF040, 0x0015), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fslt", size: 4,	opcode: two(0xF040, 0x0014), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsne", size: 4,	opcode: two(0xF040, 0x000E), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsnge", size: 4,	opcode: two(0xF040, 0x001C), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsngl", size: 4,	opcode: two(0xF040, 0x0019), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsngle", size: 4,	opcode: two(0xF040, 0x0018), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsngt", size: 4,	opcode: two(0xF040, 0x001D), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsnle", size: 4,	opcode: two(0xF040, 0x001A), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsnlt", size: 4,	opcode: two(0xF040, 0x001B), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsoge", size: 4,	opcode: two(0xF040, 0x0003), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsogl", size: 4,	opcode: two(0xF040, 0x0006), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsogt", size: 4,	opcode: two(0xF040, 0x0002), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsole", size: 4,	opcode: two(0xF040, 0x0005), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsolt", size: 4,	opcode: two(0xF040, 0x0004), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsor", size: 4,	opcode: two(0xF040, 0x0007), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsseq", size: 4,	opcode: two(0xF040, 0x0011), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fssf", size: 4,	opcode: two(0xF040, 0x0010), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fssne", size: 4,	opcode: two(0xF040, 0x001E), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsst", size: 4,	opcode: two(0xF040, 0x001F), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fst", size: 4,		opcode: two(0xF040, 0x000F), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsueq", size: 4,	opcode: two(0xF040, 0x0009), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsuge", size: 4,	opcode: two(0xF040, 0x000B), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsugt", size: 4,	opcode: two(0xF040, 0x000A), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsule", size: 4,	opcode: two(0xF040, 0x000D), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsult", size: 4,	opcode: two(0xF040, 0x000C), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	{ name: "fsun", size: 4,	opcode: two(0xF040, 0x0008), match: two(0xF1C0, 0xFFFF), args: "Ii$s", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsgldiv.b", size:4,opcode: two(0xF000, 0x5824), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.d", size:4,opcode: two(0xF000, 0x5424), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.l", size:4,opcode: two(0xF000, 0x4024), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.p", size:4,opcode: two(0xF000, 0x4C24), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.s", size:4,opcode: two(0xF000, 0x4424), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.w", size:4,opcode: two(0xF000, 0x5024), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.x", size:4,opcode: two(0xF000, 0x0024), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.x", size:4,opcode: two(0xF000, 0x4824), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsgldiv.x", size:4,opcode: two(0xF000, 0x0024), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },

	{ name: "fsglmul.b", size:4,opcode: two(0xF000, 0x5827), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.d", size:4,opcode: two(0xF000, 0x5427), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.l", size:4,opcode: two(0xF000, 0x4027), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.p", size:4,opcode: two(0xF000, 0x4C27), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.s", size:4,opcode: two(0xF000, 0x4427), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.w", size:4,opcode: two(0xF000, 0x5027), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.x", size:4,opcode: two(0xF000, 0x0027), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.x", size:4,opcode: two(0xF000, 0x4827), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsglmul.x", size:4,opcode: two(0xF000, 0x0027), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsin.b", size: 4,	opcode: two(0xF000, 0x580E), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.d", size: 4,	opcode: two(0xF000, 0x540E), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.l", size: 4,	opcode: two(0xF000, 0x400E), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.p", size: 4,	opcode: two(0xF000, 0x4C0E), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.s", size: 4,	opcode: two(0xF000, 0x440E), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.w", size: 4,	opcode: two(0xF000, 0x500E), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.x", size: 4,	opcode: two(0xF000, 0x000E), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.x", size: 4,	opcode: two(0xF000, 0x480E), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsin.x", size: 4,	opcode: two(0xF000, 0x000E), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsincos.b", size:4,opcode: two(0xF000, 0x5830), match: two(0xF1C0, 0xFC78), args: "Ii;bF3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.d", size:4,opcode: two(0xF000, 0x5430), match: two(0xF1C0, 0xFC78), args: "Ii;FF3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.l", size:4,opcode: two(0xF000, 0x4030), match: two(0xF1C0, 0xFC78), args: "Ii;lF3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.p", size:4,opcode: two(0xF000, 0x4C30), match: two(0xF1C0, 0xFC78), args: "Ii;pF3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.s", size:4,opcode: two(0xF000, 0x4430), match: two(0xF1C0, 0xFC78), args: "Ii;fF3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.w", size:4,opcode: two(0xF000, 0x5030), match: two(0xF1C0, 0xFC78), args: "Ii;wF3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.x", size:4,opcode: two(0xF000, 0x0030), match: two(0xF1C0, 0xE078), args: "IiF8F3F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsincos.x", size:4,opcode: two(0xF000, 0x4830), match: two(0xF1C0, 0xFC78), args: "Ii;xF3F7", arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsinh.b", size: 4,	opcode: two(0xF000, 0x5802), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.d", size: 4,	opcode: two(0xF000, 0x5402), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.l", size: 4,	opcode: two(0xF000, 0x4002), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.p", size: 4,	opcode: two(0xF000, 0x4C02), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.s", size: 4,	opcode: two(0xF000, 0x4402), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.w", size: 4,	opcode: two(0xF000, 0x5002), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.x", size: 4,	opcode: two(0xF000, 0x0002), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.x", size: 4,	opcode: two(0xF000, 0x4802), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsinh.x", size: 4,	opcode: two(0xF000, 0x0002), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fsqrt.b", size: 4,	opcode: two(0xF000, 0x5804), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.d", size: 4,	opcode: two(0xF000, 0x5404), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.l", size: 4,	opcode: two(0xF000, 0x4004), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.p", size: 4,	opcode: two(0xF000, 0x4C04), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.s", size: 4,	opcode: two(0xF000, 0x4404), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.w", size: 4,	opcode: two(0xF000, 0x5004), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.x", size: 4,	opcode: two(0xF000, 0x0004), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.x", size: 4,	opcode: two(0xF000, 0x4804), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsqrt.x", size: 4,	opcode: two(0xF000, 0x0004), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fssqrt.b", size: 4,opcode: two(0xF000, 0x5841), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.d", size: 4,opcode: two(0xF000, 0x5441), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.l", size: 4,opcode: two(0xF000, 0x4041), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.p", size: 4,opcode: two(0xF000, 0x4C41), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.s", size: 4,opcode: two(0xF000, 0x4441), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.w", size: 4,opcode: two(0xF000, 0x5041), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.x", size: 4,opcode: two(0xF000, 0x0041), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.x", size: 4,opcode: two(0xF000, 0x4841), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssqrt.x", size: 4,opcode: two(0xF000, 0x0041), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "fdsqrt.b", size: 4,opcode: two(0xF000, 0x5845), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.d", size: 4,opcode: two(0xF000, 0x5445), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.l", size: 4,opcode: two(0xF000, 0x4045), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.p", size: 4,opcode: two(0xF000, 0x4C45), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.s", size: 4,opcode: two(0xF000, 0x4445), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.w", size: 4,opcode: two(0xF000, 0x5045), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.x", size: 4,opcode: two(0xF000, 0x0045), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.x", size: 4,opcode: two(0xF000, 0x4845), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsqrt.x", size: 4,opcode: two(0xF000, 0x0045), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "fsub.b", size: 4,	opcode: two(0xF000, 0x5828), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.d", size: 4,	opcode: two(0xF000, 0x5428), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.l", size: 4,	opcode: two(0xF000, 0x4028), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.p", size: 4,	opcode: two(0xF000, 0x4C28), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.s", size: 4,	opcode: two(0xF000, 0x4428), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.w", size: 4,	opcode: two(0xF000, 0x5028), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.x", size: 4,	opcode: two(0xF000, 0x0028), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.x", size: 4,	opcode: two(0xF000, 0x4828), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "fsub.x", size: 4,	opcode: two(0xF000, 0x0028), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "fssub.b", size: 4,	opcode: two(0xF000, 0x5868), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.d", size: 4,	opcode: two(0xF000, 0x5468), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.l", size: 4,	opcode: two(0xF000, 0x4068), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.p", size: 4,	opcode: two(0xF000, 0x4C68), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.s", size: 4,	opcode: two(0xF000, 0x4468), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.w", size: 4,	opcode: two(0xF000, 0x5068), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.x", size: 4,	opcode: two(0xF000, 0x0068), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.x", size: 4,	opcode: two(0xF000, 0x4868), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fssub.x", size: 4,	opcode: two(0xF000, 0x0068), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "fdsub.b", size: 4,	opcode: two(0xF000, 0x586c), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.d", size: 4,	opcode: two(0xF000, 0x546c), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.l", size: 4,	opcode: two(0xF000, 0x406c), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.p", size: 4,	opcode: two(0xF000, 0x4C6c), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.s", size: 4,	opcode: two(0xF000, 0x446c), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.w", size: 4,	opcode: two(0xF000, 0x506c), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.x", size: 4,	opcode: two(0xF000, 0x006c), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.x", size: 4,	opcode: two(0xF000, 0x486c), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: m68040up , type: dis.nonbranch },
	{ name: "fdsub.x", size: 4,	opcode: two(0xF000, 0x006c), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: m68040up , type: dis.nonbranch },
	
	{ name: "ftan.b", size: 4,	opcode: two(0xF000, 0x580F), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.d", size: 4,	opcode: two(0xF000, 0x540F), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.l", size: 4,	opcode: two(0xF000, 0x400F), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.p", size: 4,	opcode: two(0xF000, 0x4C0F), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.s", size: 4,	opcode: two(0xF000, 0x440F), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.w", size: 4,	opcode: two(0xF000, 0x500F), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.x", size: 4,	opcode: two(0xF000, 0x000F), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.x", size: 4,	opcode: two(0xF000, 0x480F), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftan.x", size: 4,	opcode: two(0xF000, 0x000F), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "ftanh.b", size: 4,	opcode: two(0xF000, 0x5809), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.d", size: 4,	opcode: two(0xF000, 0x5409), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.l", size: 4,	opcode: two(0xF000, 0x4009), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.p", size: 4,	opcode: two(0xF000, 0x4C09), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.s", size: 4,	opcode: two(0xF000, 0x4409), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.w", size: 4,	opcode: two(0xF000, 0x5009), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.x", size: 4,	opcode: two(0xF000, 0x0009), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.x", size: 4,	opcode: two(0xF000, 0x4809), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftanh.x", size: 4,	opcode: two(0xF000, 0x0009), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "ftentox.b", size:4,opcode: two(0xF000, 0x5812), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.d", size:4,opcode: two(0xF000, 0x5412), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.l", size:4,opcode: two(0xF000, 0x4012), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.p", size:4,opcode: two(0xF000, 0x4C12), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.s", size:4,opcode: two(0xF000, 0x4412), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.w", size:4,opcode: two(0xF000, 0x5012), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.x", size:4,opcode: two(0xF000, 0x0012), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.x", size:4,opcode: two(0xF000, 0x4812), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftentox.x", size:4,opcode: two(0xF000, 0x0012), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	
	{ name: "ftrapeq", size: 4,	opcode: two(0xF07C, 0x0001), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapf", size: 4,	opcode: two(0xF07C, 0x0000), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapge", size: 4,	opcode: two(0xF07C, 0x0013), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgl", size: 4,	opcode: two(0xF07C, 0x0016), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgle", size:4,	opcode: two(0xF07C, 0x0017), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgt", size: 4,	opcode: two(0xF07C, 0x0012), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftraple", size: 4,	opcode: two(0xF07C, 0x0015), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftraplt", size: 4,	opcode: two(0xF07C, 0x0014), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapne", size: 4,	opcode: two(0xF07C, 0x000E), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnge", size:4,	opcode: two(0xF07C, 0x001C), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngl", size:4,	opcode: two(0xF07C, 0x0019), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngle", size:4,opcode: two(0xF07C, 0x0018), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngt", size:4,	opcode: two(0xF07C, 0x001D), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnle", size:4,	opcode: two(0xF07C, 0x001A), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnlt", size:4,	opcode: two(0xF07C, 0x001B), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapoge", size:4,	opcode: two(0xF07C, 0x0003), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapogl", size:4,	opcode: two(0xF07C, 0x0006), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapogt", size:4,	opcode: two(0xF07C, 0x0002), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapole", size:4,	opcode: two(0xF07C, 0x0005), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapolt", size:4,	opcode: two(0xF07C, 0x0004), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapor", size: 4,	opcode: two(0xF07C, 0x0007), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapseq", size:4,	opcode: two(0xF07C, 0x0011), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapsf", size: 4,	opcode: two(0xF07C, 0x0010), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapsne", size:4,	opcode: two(0xF07C, 0x001E), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapst", size: 4,	opcode: two(0xF07C, 0x001F), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapt", size: 4,	opcode: two(0xF07C, 0x000F), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapueq", size:4,	opcode: two(0xF07C, 0x0009), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapuge", size:4,	opcode: two(0xF07C, 0x000B), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapugt", size:4,	opcode: two(0xF07C, 0x000A), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapule", size:4,	opcode: two(0xF07C, 0x000D), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapult", size:4,	opcode: two(0xF07C, 0x000C), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapun", size: 4,	opcode: two(0xF07C, 0x0008), match: two(0xF1FF, 0xFFFF), args: "Ii", arch: mfloat , type: dis.nonbranch },
	
	{ name: "ftrapeq.w", size:4,opcode: two(0xF07A, 0x0001), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapf.w", size: 4,opcode: two(0xF07A, 0x0000), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapge.w", size:4,opcode: two(0xF07A, 0x0013), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgl.w", size:4,opcode: two(0xF07A, 0x0016), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgle.w",size:4,opcode: two(0xF07A, 0x0017), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgt.w", size:4,opcode: two(0xF07A, 0x0012), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftraple.w", size:4,opcode: two(0xF07A, 0x0015), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftraplt.w", size:4,opcode: two(0xF07A, 0x0014), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapne.w", size:4,opcode: two(0xF07A, 0x000E), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnge.w",size:4,opcode: two(0xF07A, 0x001C), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngl.w",size:4,opcode: two(0xF07A, 0x0019), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngle.w",size:4,opcode: two(0xF07A, 0x0018), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngt.w",size:4,opcode: two(0xF07A, 0x001D), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnle.w",size:4,opcode: two(0xF07A, 0x001A), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnlt.w",size:4,opcode: two(0xF07A, 0x001B), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapoge.w",size:4,opcode: two(0xF07A, 0x0003), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapogl.w",size:4,opcode: two(0xF07A, 0x0006), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapogt.w",size:4,opcode: two(0xF07A, 0x0002), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapolew.",size:4,opcode: two(0xF07A, 0x0005), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapolt.w",size:4,opcode: two(0xF07A, 0x0004), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapor.w", size:4,opcode: two(0xF07A, 0x0007), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapseq.w", size:4,opcode: two(0xF07A, 0x0011), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapsf.w", size:4,opcode: two(0xF07A, 0x0010), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapsne.w", size:4,opcode: two(0xF07A, 0x001E), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapst.w", size:4,opcode: two(0xF07A, 0x001F), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapt.w", size: 4,opcode: two(0xF07A, 0x000F), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapueq.w",size:4,opcode: two(0xF07A, 0x0009), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapuge.w",size:4,opcode: two(0xF07A, 0x000B), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapugt.w",size:4,opcode: two(0xF07A, 0x000A), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapule.w",size:4,opcode: two(0xF07A, 0x000D), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapult.w",size:4,opcode: two(0xF07A, 0x000C), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapun.w", size:4,opcode: two(0xF07A, 0x0008), match: two(0xF1FF, 0xFFFF), args: "Ii^w", arch: mfloat , type: dis.nonbranch },
	
	{ name: "ftrapeq.l", size:4,opcode: two(0xF07B, 0x0001), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapf.l", size: 4,opcode: two(0xF07B, 0x0000), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapge.l", size:4,opcode: two(0xF07B, 0x0013), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgl.l", size:4,opcode: two(0xF07B, 0x0016), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgle.l",size:4,opcode: two(0xF07B, 0x0017), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapgt.l", size:4,opcode: two(0xF07B, 0x0012), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftraple.l", size:4,opcode: two(0xF07B, 0x0015), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftraplt.l", size:4,opcode: two(0xF07B, 0x0014), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapne.l", size:4,opcode: two(0xF07B, 0x000E), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnge.l",size:4,opcode: two(0xF07B, 0x001C), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngl.l",size:4,opcode: two(0xF07B, 0x0019), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngle.l",size:4,opcode: two(0xF07B, 0x0018), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapngt.l",size:4,opcode: two(0xF07B, 0x001D), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnle.l",size:4,opcode: two(0xF07B, 0x001A), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapnlt.l",size:4,opcode: two(0xF07B, 0x001B), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapoge.l",size:4,opcode: two(0xF07B, 0x0003), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapogl.l",size:4,opcode: two(0xF07B, 0x0006), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapogt.l",size:4,opcode: two(0xF07B, 0x0002), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapole.l",size:4,opcode: two(0xF07B, 0x0005), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapolt.l",size:4,opcode: two(0xF07B, 0x0004), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapor.l", size:4,opcode: two(0xF07B, 0x0007), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapseq.l",size:4,opcode: two(0xF07B, 0x0011), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapsf.l", size:4,opcode: two(0xF07B, 0x0010), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapsne.l",size:4,opcode: two(0xF07B, 0x001E), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapst.l", size:4,opcode: two(0xF07B, 0x001F), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapt.l", size:4,	opcode: two(0xF07B, 0x000F), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapueq.l",size:4,opcode: two(0xF07B, 0x0009), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapuge.l",size:4,opcode: two(0xF07B, 0x000B), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapugt.l",size:4,opcode: two(0xF07B, 0x000A), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapule.l",size:4,opcode: two(0xF07B, 0x000D), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapult.l",size:4,opcode: two(0xF07B, 0x000C), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftrapun.l", size:4,opcode: two(0xF07B, 0x0008), match: two(0xF1FF, 0xFFFF), args: "Ii^l", arch: mfloat , type: dis.nonbranch },
	
	{ name: "ftst.b", size: 4,	opcode: two(0xF000, 0x583A), match: two(0xF1C0, 0xFC7F), args: "Ii;b", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.d", size: 4,	opcode: two(0xF000, 0x543A), match: two(0xF1C0, 0xFC7F), args: "Ii;F", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.l", size: 4,	opcode: two(0xF000, 0x403A), match: two(0xF1C0, 0xFC7F), args: "Ii;l", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.p", size: 4,	opcode: two(0xF000, 0x4C3A), match: two(0xF1C0, 0xFC7F), args: "Ii;p", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.s", size: 4,	opcode: two(0xF000, 0x443A), match: two(0xF1C0, 0xFC7F), args: "Ii;f", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.w", size: 4,	opcode: two(0xF000, 0x503A), match: two(0xF1C0, 0xFC7F), args: "Ii;w", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.x", size: 4,	opcode: two(0xF000, 0x003A), match: two(0xF1C0, 0xE07F), args: "IiF8", arch: mfloat , type: dis.nonbranch },
	{ name: "ftst.x", size: 4,	opcode: two(0xF000, 0x483A), match: two(0xF1C0, 0xFC7F), args: "Ii;x", arch: mfloat , type: dis.nonbranch },

	{ name: "ftwotox.b", size:4,opcode: two(0xF000, 0x5811), match: two(0xF1C0, 0xFC7F), args: "Ii;bF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.d", size:4,opcode: two(0xF000, 0x5411), match: two(0xF1C0, 0xFC7F), args: "Ii;FF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.l", size:4,opcode: two(0xF000, 0x4011), match: two(0xF1C0, 0xFC7F), args: "Ii;lF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.p", size:4,opcode: two(0xF000, 0x4C11), match: two(0xF1C0, 0xFC7F), args: "Ii;pF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.s", size:4,opcode: two(0xF000, 0x4411), match: two(0xF1C0, 0xFC7F), args: "Ii;fF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.w", size:4,opcode: two(0xF000, 0x5011), match: two(0xF1C0, 0xFC7F), args: "Ii;wF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.x", size:4,opcode: two(0xF000, 0x0011), match: two(0xF1C0, 0xE07F), args: "IiF8F7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.x", size:4,opcode: two(0xF000, 0x4811), match: two(0xF1C0, 0xFC7F), args: "Ii;xF7", arch: mfloat , type: dis.nonbranch },
	{ name: "ftwotox.x", size:4,opcode: two(0xF000, 0x0011), match: two(0xF1C0, 0xE07F), args: "IiFt",   arch: mfloat , type: dis.nonbranch },
	// FLOAT ends here

	{ name: "halt", size: 2,	opcode: one(0o0045310),	match: one(0o0177777), args: "",     arch: m68060 , type: dis.nonbranch },

	{ name: "illegal", size: 2,	opcode: one(0o0045374),	match: one(0o0177777), args: "",     arch: m68000up , type: dis.nonbranch },

	{ name: "jmp", size: 2,		opcode: one(0o0047300),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.branch },

	{ name: "jra", size: 2,		opcode: one(0o0060000),	match: one(0o0177400), args: "Bb", arch: m68000up , type: dis.branch }, // pseudo op
	{ name: "jra", size: 2,		opcode: one(0o0047300),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.branch },

	{ name: "jsr", size: 2,		opcode: one(0o0047200),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.jsr },

	{ name: "jbsr", size: 2,	opcode: one(0o0060400),	match: one(0o0177400), args: "Bs", arch: m68000up , type: dis.jsr }, // pseudo op
	{ name: "jbsr", size: 2,	opcode: one(0o0047200),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.jsr },

	{ name: "lea", size: 2,		opcode: one(0o0040700),	match: one(0o0170700), args: "!sAd", arch: m68000up, type: dis.nonbranch },

	{ name: "lpstop", size: 6,	opcode: two(0o0174000,0o0000700),match: two(0o0177777,0o0177777), args: "#w", arch: m68060 , type: dis.nonbranch },

	{ name: "link.w", size: 4,	opcode: one(0o0047120),	match: one(0o0177770), args: "As#w", arch: m68000up , type: dis.nonbranch },
	{ name: "link.l", size: 6,	opcode: one(0o0044010),	match: one(0o0177770), args: "As#l", arch: m68020up , type: dis.nonbranch },
	{ name: "link", size: 4,	opcode: one(0o0047120),	match: one(0o0177770), args: "As#W", arch: m68000up , type: dis.nonbranch },
	{ name: "link", size: 6,	opcode: one(0o0044010),	match: one(0o0177770), args: "As#l", arch: m68020up , type: dis.nonbranch },

	{ name: "lsl.b", size: 2,	opcode: one(0o0160410),	match: one(0o0170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsl.b", size: 2,	opcode: one(0o0160450),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsl.w", size: 2,	opcode: one(0o0160510),	match: one(0o0170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsl.w", size: 2,	opcode: one(0o0160550),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsl.w", size: 2,	opcode: one(0o0161700),	match: one(0o0177700), args: "~s",   arch: m68000up , type: dis.nonbranch },
	{ name: "lsl.l", size: 2,	opcode: one(0o0160610),	match: one(0o0170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsl.l", size: 2,	opcode: one(0o0160650),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },

	{ name: "lsr.b", size: 2,	opcode: one(0o0160010),	match: one(0o0170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsr.b", size: 2,	opcode: one(0o0160050),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsr.w", size: 2,	opcode: one(0o0160110),	match: one(0o0170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsr.w", size: 2,	opcode: one(0o0160150),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsr.w", size: 2,	opcode: one(0o0161300),	match: one(0o0177700), args: "~s",   arch: m68000up , type: dis.nonbranch },
	{ name: "lsr.l", size: 2,	opcode: one(0o0160210),	match: one(0o0170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "lsr.l", size: 2,	opcode: one(0o0160250),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },

	{ name: "movea.l", size: 2,	opcode: one(0o0020100),	match: one(0o0170700), args: "*lAd", arch: m68000up , type: dis.nonbranch },
	{ name: "movea.w", size: 2,	opcode: one(0o0030100),	match: one(0o0170700), args: "*wAd", arch: m68000up , type: dis.nonbranch },

	{ name: "movec", size: 4,	opcode: one(0o0047173),	match: one(0o0177777), args: "R1Jj", arch: m68010up , type: dis.nonbranch },
	{ name: "movec", size: 4,	opcode: one(0o0047173),	match: one(0o0177777), args: "R1#j", arch: m68010up , type: dis.nonbranch },
	{ name: "movec", size: 4,	opcode: one(0o0047172),	match: one(0o0177777), args: "JjR1", arch: m68010up , type: dis.nonbranch },
	{ name: "movec", size: 4,	opcode: one(0o0047172),	match: one(0o0177777), args: "#jR1", arch: m68010up , type: dis.nonbranch },

	{ name: "movem.w", size: 4,	opcode: one(0o0044200),	match: one(0o0177700), args: "Lw&s", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.w", size: 4,	opcode: one(0o0044240),	match: one(0o0177770), args: "lw-s", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.w", size: 4,	opcode: one(0o0044200),	match: one(0o0177700), args: "#w>s", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.w", size: 4,	opcode: one(0o0046200),	match: one(0o0177700), args: "<sLw", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.w", size: 4,	opcode: one(0o0046200),	match: one(0o0177700), args: "<s#w", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.l", size: 4,	opcode: one(0o0044300),	match: one(0o0177700), args: "Lw&s", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.l", size: 4,	opcode: one(0o0044340),	match: one(0o0177770), args: "lw-s", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.l", size: 4,	opcode: one(0o0044300),	match: one(0o0177700), args: "#w>s", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.l", size: 4,	opcode: one(0o0046300),	match: one(0o0177700), args: "<sLw", arch: m68000up , type: dis.nonbranch },
	{ name: "movem.l", size: 4,	opcode: one(0o0046300),	match: one(0o0177700), args: "<s#w", arch: m68000up , type: dis.nonbranch },

	{ name: "movep.w", size: 2,	opcode: one(0o0000410),	match: one(0o0170770), args: "dsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "movep.w", size: 2,	opcode: one(0o0000610),	match: one(0o0170770), args: "Ddds", arch: m68000up , type: dis.nonbranch },
	{ name: "movep.l", size: 2,	opcode: one(0o0000510),	match: one(0o0170770), args: "dsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "movep.l", size: 2,	opcode: one(0o0000710),	match: one(0o0170770), args: "Ddds", arch: m68000up , type: dis.nonbranch },

	{ name: "moveq", size: 2,	opcode: one(0o0070000),	match: one(0o0170400), args: "MsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "moveq", size: 2,	opcode: one(0o0070000),	match: one(0o0170400), args: "#BDd", arch: m68000up , type: dis.nonbranch },
	
	// The move opcode can generate the movea and moveq instructions.  
	{ name: "move.b", size: 2,	opcode: one(0o0010000),	match: one(0o0170000), args: ";b$d", arch: m68000up , type: dis.nonbranch },

	{ name: "move.w", size: 2,	opcode: one(0o0030000),	match: one(0o0170000), args: "*w%d", arch: m68000up , type: dis.nonbranch },
	{ name: "move.w", size: 2,	opcode: one(0o0040300),	match: one(0o0177700), args: "Ss$s", arch: m68000up , type: dis.nonbranch },
	{ name: "move.w", size: 2,	opcode: one(0o0041300),	match: one(0o0177700), args: "Cs$s", arch: m68010up , type: dis.nonbranch },
	{ name: "move.w", size: 2,	opcode: one(0o0042300),	match: one(0o0177700), args: ";wCd", arch: m68000up , type: dis.nonbranch },
	{ name: "move.w", size: 2,	opcode: one(0o0043300),	match: one(0o0177700), args: ";wSd", arch: m68000up , type: dis.nonbranch },

	{ name: "move.l", size: 2,	opcode: one(0o0070000),	match: one(0o0170400), args: "MsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "move.l", size: 2,	opcode: one(0o0020000),	match: one(0o0170000), args: "*l%d", arch: m68000up , type: dis.nonbranch },
	{ name: "move.l", size: 2,	opcode: one(0o0047140),	match: one(0o0177770), args: "AsUd", arch: m68000up , type: dis.nonbranch },
	{ name: "move.l", size: 2,	opcode: one(0o0047150),	match: one(0o0177770), args: "UdAs", arch: m68000up , type: dis.nonbranch },

	{ name: "move", size: 2,	opcode: one(0o0030000),	match: one(0o0170000), args: "*w%d", arch: m68000up , type: dis.nonbranch },
	{ name: "move", size: 2,	opcode: one(0o0040300),	match: one(0o0177700), args: "Ss$s", arch: m68000up , type: dis.nonbranch },
	{ name: "move", size: 2,	opcode: one(0o0041300),	match: one(0o0177700), args: "Cs$s", arch: m68010up , type: dis.nonbranch },
	{ name: "move", size: 2,	opcode: one(0o0042300),	match: one(0o0177700), args: ";wCd", arch: m68000up , type: dis.nonbranch },
	{ name: "move", size: 2,	opcode: one(0o0043300),	match: one(0o0177700), args: ";wSd", arch: m68000up , type: dis.nonbranch },

	{ name: "move", size: 2,	opcode: one(0o0047140),	match: one(0o0177770), args: "AsUd", arch: m68000up , type: dis.nonbranch },
	{ name: "move", size: 2,	opcode: one(0o0047150),	match: one(0o0177770), args: "UdAs", arch: m68000up , type: dis.nonbranch },

	{ name: "moves.b", size: 4,	opcode: two(0o0007000, 0o0),     match: two(0o0177700, 0o07777), args: "~sR1", arch: m68010up , type: dis.nonbranch },
	{ name: "moves.b", size: 4,	opcode: two(0o0007000, 0o04000), match: two(0o0177700, 0o07777), args: "R1~s", arch: m68010up , type: dis.nonbranch },
	{ name: "moves.w", size: 4,	opcode: two(0o0007100, 0o0),     match: two(0o0177700, 0o07777), args: "~sR1", arch: m68010up , type: dis.nonbranch },
	{ name: "moves.w", size: 4,	opcode: two(0o0007100, 0o04000), match: two(0o0177700, 0o07777), args: "R1~s", arch: m68010up , type: dis.nonbranch },
	{ name: "moves.l", size: 4,	opcode: two(0o0007200, 0o0),     match: two(0o0177700, 0o07777), args: "~sR1", arch: m68010up , type: dis.nonbranch },
	{ name: "moves.l", size: 4,	opcode: two(0o0007200, 0o04000), match: two(0o0177700, 0o07777), args: "R1~s", arch: m68010up , type: dis.nonbranch },

	{ name: "move16", size: 4,	opcode: two(0xf620, 0x8000), match:two(0xfff8, 0x8fff), args: "+s+1", arch: m68040up , type: dis.nonbranch },
	{ name: "move16", size: 2,	opcode: one(0xf600),		match: one(0xfff8), args: "+s_L", arch: m68040up , type: dis.nonbranch },
	{ name: "move16", size: 2,	opcode: one(0xf608),		match: one(0xfff8), args: "_L+s", arch: m68040up , type: dis.nonbranch },
	{ name: "move16", size: 2,	opcode: one(0xf610),		match: one(0xfff8), args: "as_L", arch: m68040up , type: dis.nonbranch },
	{ name: "move16", size: 2,	opcode: one(0xf618),		match: one(0xfff8), args: "_Las", arch: m68040up , type: dis.nonbranch },

	{ name: "muls.w", size: 2,	opcode: one(0o0140700),		match: one(0o0170700), args: ";wDd", arch: m68000up , type: dis.nonbranch },
	{ name: "muls.l", size: 4,	opcode: two(0o0046000,0o004000), match: two(0o0177700,0o0107770), args: ";lD1", arch: m68020up , type: dis.nonbranch },
	{ name: "muls.l", size: 4,	opcode: two(0o0046000,0o006000), match: two(0o0177700,0o0107770), args: ";lD3D1",arch: m68020up, type: dis.nonbranch },

	{ name: "mulu.w", size: 2,	opcode: one(0o0140300),		   match: one(0o0170700), args: ";wDd", arch: m68000up , type: dis.nonbranch },
	{ name: "mulu.l", size: 4,	opcode: two(0o0046000,0o000000), match: two(0o0177700,0o0107770), args: ";lD1", arch: m68020up, type: dis.nonbranch },
	{ name: "mulu.l", size: 4,	opcode: two(0o0046000,0o002000), match: two(0o0177700,0o0107770), args: ";lD3D1",arch: m68020up, type: dis.nonbranch },

	{ name: "nbcd", size: 2,	opcode: one(0o0044000),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },

	{ name: "neg.b", size: 2,	opcode: one(0o0042000),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "neg.w", size: 2,	opcode: one(0o0042100),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "neg.l", size: 2,	opcode: one(0o0042200),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },

	{ name: "negx.b", size: 2,	opcode: one(0o0040000),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "negx.w", size: 2,	opcode: one(0o0040100),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "negx.l", size: 2,	opcode: one(0o0040200),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },

	{ name: "nop", size: 2,		opcode: one(0o0047161),	match: one(0o0177777), args: "", arch: m68000up, type: dis.nonbranch },

	{ name: "not.b", size: 2,	opcode: one(0o0043000),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "not.w", size: 2,	opcode: one(0o0043100),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "not.l", size: 2,	opcode: one(0o0043200),	match: one(0o0177700), args: "$s", arch: m68000up , type: dis.nonbranch },

	{ name: "ori.b", size: 4,	opcode: one(0o0000000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "ori.b", size: 4,	opcode: one(0o0000074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "ori.w", size: 4,	opcode: one(0o0000100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "ori.w", size: 4,	opcode: one(0o0000174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "ori.l", size: 6,	opcode: one(0o0000200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "ori", size: 4,		opcode: one(0o0000074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "ori", size: 4,		opcode: one(0o0000100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "ori", size: 4,		opcode: one(0o0000174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	
	// The or opcode can generate the ori instruction.  
	{ name: "or.b", size: 4,	opcode: one(0o0000000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "or.b", size: 4,	opcode: one(0o0000074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "or.b", size: 2,	opcode: one(0o0100000),	match: one(0o0170700), args: ";bDd", arch: m68000up , type: dis.nonbranch },
	{ name: "or.b", size: 2,	opcode: one(0o0100400),	match: one(0o0170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },
	{ name: "or.w", size: 4,	opcode: one(0o0000100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "or.w", size: 4,	opcode: one(0o0000174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "or.w", size: 2,	opcode: one(0o0100100),	match: one(0o0170700), args: ";wDd", arch: m68000up , type: dis.nonbranch },
	{ name: "or.w", size: 2,	opcode: one(0o0100500),	match: one(0o0170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },
	{ name: "or.l", size: 6,	opcode: one(0o0000200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "or.l", size: 2,	opcode: one(0o0100200),	match: one(0o0170700), args: ";lDd", arch: m68000up , type: dis.nonbranch },
	{ name: "or.l", size: 2,	opcode: one(0o0100600),	match: one(0o0170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 4,		opcode: one(0o0000074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 4,		opcode: one(0o0000100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 4,		opcode: one(0o0000174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 2,		opcode: one(0o0100100),	match: one(0o0170700), args: ";wDd", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 2,		opcode: one(0o0100500),	match: one(0o0170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },

	{ name: "pack", size: 4, 	opcode:one(0o0100500),	match: one(0o0170770), args: "DsDd#w", arch: m68020up , type: dis.nonbranch },
	{ name: "pack", size: 4, 	opcode:one(0o0100510),	match: one(0o0170770), args: "-s-d#w", arch: m68020up , type: dis.nonbranch },

	// MMU opcodes missing here

	{ name: "pea", size: 2,		opcode:one(0o0044100),		match: one(0o0177700), args: "!s", arch: m68000up , type: dis.nonbranch },

	{ name: "pflusha", size: 2,	opcode:one(0xf518),		match: one(0xfff8), args: "", arch: m68040up , type: dis.nonbranch },
	{ name: "pflusha", size: 4,	opcode:two(0xf000,0x2400), match: two(0xffff,0xffff), args: "", arch: m68030 |m68851 , type: dis.nonbranch },
	
	{ name: "pflush", size: 4,  opcode:two(0xf000,0x3010), match: two(0xffc0,0xfe10), args: "T3T9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,  opcode:two(0xf000,0x3810), match: two(0xffc0,0xfe10), args: "T3T9&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,  opcode:two(0xf000,0x3008), match: two(0xffc0,0xfe18), args: "D3T9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,  opcode:two(0xf000,0x3808), match: two(0xffc0,0xfe18), args: "D3T9&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,  opcode:two(0xf000,0x3000), match: two(0xffc0,0xfe1e), args: "f3T9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,  opcode:two(0xf000,0x3800), match: two(0xffc0,0xfe1e), args: "f3T9&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 2,	opcode:one(0xf508),		match: one(0xfff8), args: "as", arch: m68040up , type: dis.nonbranch },
	{ name: "pflush", size: 2,	opcode:one(0xf508),		match: one(0xfff8), args: "As", arch: m68040up , type: dis.nonbranch },
	
	{ name: "pflushan", size: 2,opcode:one(0xf510),		match: one(0xfff8), args: "", arch: m68040up , type: dis.nonbranch },
	{ name: "pflushn", size: 2,	opcode:one(0xf500),		match: one(0xfff8), args: "as", arch: m68040up , type: dis.nonbranch },
	{ name: "pflushn", size: 2,	opcode:one(0xf500),		match: one(0xfff8), args: "As", arch: m68040up , type: dis.nonbranch },
	
	{ name: "ploadr", size: 4,  opcode:two(0xf000,0x2210), match: two(0xffc0,0xfff0), args: "T3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadr", size: 4,  opcode:two(0xf000,0x2208), match: two(0xffc0,0xfff8), args: "D3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadr", size: 4,  opcode:two(0xf000,0x2200), match: two(0xffc0,0xfffe), args: "f3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadw", size: 4,  opcode:two(0xf000,0x2010), match: two(0xffc0,0xfff0), args: "T3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadw", size: 4,  opcode:two(0xf000,0x2008), match: two(0xffc0,0xfff8), args: "D3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadw", size: 4,  opcode:two(0xf000,0x2000), match: two(0xffc0,0xfffe), args: "f3&s", arch: m68030|m68851 , type: dis.nonbranch },
	
	{ name: "plpar", size: 2,	opcode:one(0xf5c8),		match: one(0xfff8), args: "as", arch: m68060 , type: dis.nonbranch },
	{ name: "plpaw", size: 2,	opcode:one(0xf588),		match: one(0xfff8), args: "as", arch: m68060 , type: dis.nonbranch },
	
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x4000), match: two(0xffc0,0xffff), args: "*l08", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x4200), match: two(0xffc0,0xffff), args: "08%s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x5e00), match: two(0xffc0,0xffff), args: "18%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x4200), match: two(0xffc0,0xe3ff), args: "28%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x4000), match: two(0xffc0,0xe3ff), args: "|sW8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x4200), match: two(0xffc0,0xe3ff), args: "W8~s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x6000), match: two(0xffc0,0xffff), args: "*wY8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x6200), match: two(0xffc0,0xffff), args: "Y8%s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x6600), match: two(0xffc0,0xffff), args: "Z8%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x6000), match: two(0xffc0,0xe3e3), args: "*wX3", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x6200), match: two(0xffc0,0xe3e3), args: "X3%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x0800), match: two(0xffc0,0xfbff), args: "*l38", arch: m68030 , type: dis.nonbranch },
	{ name: "pmove", size: 4,   opcode:two(0xf000,0x0a00), match: two(0xffc0,0xfbff), args: "38%s", arch: m68030 , type: dis.nonbranch },

	{ name: "pmovefd", size: 4,	opcode:two(0xf000, 0x4100),	match: two(0xffc0, 0xe3ff), args: "*l08", arch: m68030 , type: dis.nonbranch },
	{ name: "pmovefd", size: 4,	opcode:two(0xf000, 0x4100),	match: two(0xffc0, 0xe3ff), args: "|sW8", arch: m68030 , type: dis.nonbranch },
	{ name: "pmovefd", size: 4,	opcode:two(0xf000, 0x0900),	match: two(0xffc0, 0xfbff), args: "*l38", arch: m68030 , type: dis.nonbranch },

	{ name: "ptestr", size: 4, 	opcode:two(0xf000,0x8210), match: two(0xffc0, 0xe3f0), args: "T3&st8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestr", size: 4, 	opcode:two(0xf000,0x8310), match: two(0xffc0,0xe310), args: "T3&st8A9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestr", size: 4, 	opcode:two(0xf000,0x8208), match: two(0xffc0,0xe3f8), args: "D3&st8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestr", size: 4, 	opcode:two(0xf000,0x8308), match: two(0xffc0,0xe318), args: "D3&st8A9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestr", size: 4, 	opcode:two(0xf000,0x8200), match: two(0xffc0,0xe3fe), args: "f3&st8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestr", size: 4, 	opcode:two(0xf000,0x8300), match: two(0xffc0,0xe31e), args: "f3&st8A9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestr", size: 2,	opcode:one(0xf568),		match: one(0xfff8), args: "as", arch: m68040 , type: dis.nonbranch },

	{ name: "ptestw", size: 4, 	opcode:two(0xf000,0x8010), match: two(0xffc0,0xe3f0), args: "T3&st8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestw", size: 4, 	opcode:two(0xf000,0x8110), match: two(0xffc0,0xe310), args: "T3&st8A9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestw", size: 4, 	opcode:two(0xf000,0x8008), match: two(0xffc0,0xe3f8), args: "D3&st8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestw", size: 4, 	opcode:two(0xf000,0x8108), match: two(0xffc0,0xe318), args: "D3&st8A9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestw", size: 4, 	opcode:two(0xf000,0x8000), match: two(0xffc0,0xe3fe), args: "f3&st8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestw", size: 4, 	opcode:two(0xf000,0x8100), match: two(0xffc0,0xe31e), args: "f3&st8A9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ptestw", size: 2,	opcode:one(0xf548),		match: one(0xfff8), args: "as", arch: m68040 , type: dis.nonbranch },

	{ name: "ptrapac.w",size: 6,opcode: two(0xf07a, 0x0007),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapac.l",size: 6,opcode: two(0xf07b, 0x0007),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapac", size: 4,	opcode: two(0xf07c, 0x0007),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapas.w",size: 6,opcode: two(0xf07a, 0x0006),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapas.l",size: 6,opcode: two(0xf07b, 0x0006),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapas", size: 4,	opcode: two(0xf07c, 0x0006),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },

	{ name: "ptrapbc.w",size: 6,opcode: two(0xf07a, 0x0001),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapbc.l",size: 6,opcode: two(0xf07b, 0x0001),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapbc", size: 4,	opcode: two(0xf07c, 0x0001),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },

	{ name: "ptrapbs.w",size: 6,opcode: two(0xf07a, 0x0000),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapbs.l",size: 6,opcode: two(0xf07b, 0x0000),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapbs", size: 4,	opcode: two(0xf07c, 0x0000),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },

	{ name: "ptrapcc.w",size: 6,opcode: two(0xf07a, 0x000f),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapcc.l",size: 6,opcode: two(0xf07b, 0x000f),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapcc", size: 4,	opcode: two(0xf07c, 0x000f),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },

	{ name: "ptrapcs.w",size: 6,opcode: two(0xf07a, 0x000e),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapcs.l",size: 6,opcode: two(0xf07b, 0x000e),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapcs", size: 4,	opcode: two(0xf07c, 0x000e),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },

	{ name: "ptrapgc.w",size: 6,opcode: two(0xf07a, 0x000d),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapgc.l",size: 6,opcode: two(0xf07b, 0x000d),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapgc", size: 4,	opcode: two(0xf07c, 0x000d),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapgs.w",size: 6,opcode: two(0xf07a, 0x000c),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapgs.l",size: 6,opcode: two(0xf07b, 0x000c),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapgs", size: 4,	opcode: two(0xf07c, 0x000c),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapic.w",size: 6,opcode: two(0xf07a, 0x000b),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapic.l",size: 6,opcode: two(0xf07b, 0x000b),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapic", size: 4,	opcode: two(0xf07c, 0x000b),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapis.w",size: 6,opcode: two(0xf07a, 0x000a),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapis.l",size: 6,opcode: two(0xf07b, 0x000a),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapis", size: 4,	opcode: two(0xf07c, 0x000a),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptraplc.w",size: 6,opcode: two(0xf07a, 0x0003),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptraplc.l",size: 6,opcode: two(0xf07b, 0x0003),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptraplc", size: 4,	opcode: two(0xf07c, 0x0003),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapls.w",size: 6,opcode: two(0xf07a, 0x0002),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapls.l",size: 6,opcode: two(0xf07b, 0x0002),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapls", size: 4,	opcode: two(0xf07c, 0x0002),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapsc.w",size: 6,opcode: two(0xf07a, 0x0005),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapsc.l",size: 6,opcode: two(0xf07b, 0x0005),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapsc", size: 4,	opcode: two(0xf07c, 0x0005),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapss.w",size: 6,opcode: two(0xf07a, 0x0004),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapss.l",size: 6,opcode: two(0xf07b, 0x0004),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapss", size: 4,	opcode: two(0xf07c, 0x0004),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapwc.w",size: 6,opcode: two(0xf07a, 0x0009),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapwc.l",size: 6,opcode: two(0xf07b, 0x0009),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapwc", size: 4,	opcode: two(0xf07c, 0x0009),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },
	 
	{ name: "ptrapws.w",size: 6,opcode: two(0xf07a, 0x0008),	match: two(0xffff, 0xffff), args: "#w", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapws.l",size: 6,opcode: two(0xf07b, 0x0008),	match: two(0xffff, 0xffff), args: "#l", arch: m68851 , type: dis.nonbranch },
	{ name: "ptrapws", size: 4,	opcode: two(0xf07c, 0x0008),	match: two(0xffff, 0xffff), args: "",   arch: m68851 , type: dis.nonbranch },

	{ name: "pulse", size: 2,	opcode:one(0o045314),		match: one(0o177777), args: "", arch: m68060 , type: dis.nonbranch },

	{ name: "reset", size: 2,	opcode:one(0o047160),		match: one(0o177777), args: "", arch: m68000up , type: dis.nonbranch },

	{ name: "rol.b", size: 2,	opcode:one(0o160430),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "rol.b", size: 2,	opcode:one(0o160470),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "rol.w", size: 2,	opcode:one(0o160530),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "rol.w", size: 2,	opcode:one(0o160570),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "rol.w", size: 2,	opcode:one(0o163700),		match: one(0o177700), args: "~s",   arch: m68000up , type: dis.nonbranch },
	{ name: "rol.l", size: 2,	opcode:one(0o160630),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "rol.l", size: 2,	opcode:one(0o160670),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },

	{ name: "ror.b", size: 2,	opcode:one(0o160030),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "ror.b", size: 2,	opcode:one(0o160070),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "ror.w", size: 2,	opcode:one(0o160130),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "ror.w", size: 2,	opcode:one(0o160170),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "ror.w", size: 2,	opcode:one(0o163300),		match: one(0o177700), args: "~s",   arch: m68000up , type: dis.nonbranch },
	{ name: "ror.l", size: 2,	opcode:one(0o160230),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "ror.l", size: 2,	opcode:one(0o160270),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },

	{ name: "roxl.b", size: 2,	opcode:one(0o160420),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxl.b", size: 2,	opcode:one(0o160460),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxl.w", size: 2,	opcode:one(0o160520),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxl.w", size: 2,	opcode:one(0o160560),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxl.w", size: 2,	opcode:one(0o162700),		match: one(0o177700), args: "~s",   arch: m68000up , type: dis.nonbranch },
	{ name: "roxl.l", size: 2,	opcode:one(0o160620),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxl.l", size: 2,	opcode:one(0o160660),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },

	{ name: "roxr.b", size: 2,	opcode:one(0o160020),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxr.b", size: 2,	opcode:one(0o160060),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxr.w", size: 2,	opcode:one(0o160120),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxr.w", size: 2,	opcode:one(0o160160),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxr.w", size: 2,	opcode:one(0o162300),		match: one(0o177700), args: "~s",   arch: m68000up , type: dis.nonbranch },
	{ name: "roxr.l", size: 2,	opcode:one(0o160220),		match: one(0o170770), args: "QdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "roxr.l", size: 2,	opcode:one(0o160260),		match: one(0o170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	
	{ name: "rtd", size: 4,		opcode:one(0o047164),		match: one(0o177777), args: "#w", arch: m68010up , type: dis.nonbranch },

	{ name: "rte", size: 2,		opcode:one(0o047163),		match: one(0o177777), args: "",   arch: m68000up , type: dis.nonbranch },

	{ name: "rtm", size: 2,		opcode:one(0o003300),		match: one(0o177760), args: "Rs", arch: m68020 , type: dis.nonbranch },

	{ name: "rtr", size: 2,		opcode:one(0o047167),		match: one(0o177777), args: "",   arch: m68000up , type: dis.nonbranch },

	{ name: "rts", size: 2,		opcode:one(0o047165),		match: one(0o177777), args: "",   arch: m68000up , type: dis.nonbranch },
	
	{ name: "sbcd", size: 2,	opcode:one(0o100400),		match: one(0o170770), args: "DsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "sbcd", size: 2,	opcode:one(0o100410),		match: one(0o170770), args: "-s-d", arch: m68000up , type: dis.nonbranch },
	
	  // Traps have to come before conditional sets, as they have a more specific opcode.
	{ name: "trapcc", size: 2,	opcode:one(0o052374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapcs", size: 2,	opcode:one(0o052774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapeq", size: 2,	opcode:one(0o053774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapf", size: 2,	opcode:one(0o050774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapge", size: 2,	opcode:one(0o056374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapgt", size: 2,	opcode:one(0o057374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "traphi", size: 2,	opcode:one(0o051374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "traple", size: 2,	opcode:one(0o057774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapls", size: 2,	opcode:one(0o051774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "traplt", size: 2,	opcode:one(0o056774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapmi", size: 2,	opcode:one(0o055774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapne", size: 2,	opcode:one(0o053374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trappl", size: 2,	opcode:one(0o055374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapt", size: 2,	opcode:one(0o050374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvc", size: 2,	opcode:one(0o054374),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvs", size: 2,	opcode:one(0o054774),	match: one(0o177777), args: "", arch: m68020up, type: dis.nonbranch },

	{ name: "trapcc.w", size: 4,opcode:one(0o052372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapcs.w", size: 4,opcode:one(0o052772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapeq.w", size: 4,opcode:one(0o053772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapf.w", size: 4,	opcode:one(0o050772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapge.w", size: 4,opcode:one(0o056372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapgt.w", size: 4,opcode:one(0o057372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "traphi.w", size: 4,opcode:one(0o051372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "traple.w", size: 4,opcode:one(0o057772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapls.w", size: 4,opcode:one(0o051772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "traplt.w", size: 4,opcode:one(0o056772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapmi.w", size: 4,opcode:one(0o055772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapne.w", size: 4,opcode:one(0o053372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trappl.w", size: 4,opcode:one(0o055372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapt.w", size: 4,	opcode:one(0o050372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvc.w", size: 4,opcode:one(0o054372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvs.w", size: 4,opcode:one(0o054772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },

	{ name: "trapcc.l", size: 6,opcode:one(0o052373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapcs.l", size: 6,opcode:one(0o052773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapeq.l", size: 6,opcode:one(0o053773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapf.l", size: 6,	opcode:one(0o050773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapge.l", size: 6,opcode:one(0o056373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapgt.l", size: 6,opcode:one(0o057373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "traphi.l", size: 6,opcode:one(0o051373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "traple.l", size: 6,opcode:one(0o057773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapls.l", size: 6,opcode:one(0o051773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "traplt.l", size: 6,opcode:one(0o056773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapmi.l", size: 6,opcode:one(0o055773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapne.l", size: 6,opcode:one(0o053373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trappl.l", size: 6,opcode:one(0o055373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapt.l", size: 6,	opcode:one(0o050373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvc.l", size: 6,opcode:one(0o054373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvs.l", size: 6,opcode:one(0o054773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },

	{ name: "trapv", size: 2,	opcode:one(0o047166),	match: one(0o177777), args: "", arch: m68000up , type: dis.nonbranch },
	
	{ name: "scc", size: 2,		opcode:one(0o052300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "scs", size: 2,		opcode:one(0o052700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "seq", size: 2,		opcode:one(0o053700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sf", size: 2,		opcode:one(0o050700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sge", size: 2,		opcode:one(0o056300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sgt", size: 2,		opcode:one(0o057300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "shi", size: 2,		opcode:one(0o051300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sle", size: 2,		opcode:one(0o057700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sls", size: 2,		opcode:one(0o051700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "slt", size: 2,		opcode:one(0o056700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "smi", size: 2,		opcode:one(0o055700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sne", size: 2,		opcode:one(0o053300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "spl", size: 2,		opcode:one(0o055300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "st", size: 2,		opcode:one(0o050300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "svc", size: 2,		opcode:one(0o054300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "svs", size: 2,		opcode:one(0o054700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	
	{ name: "stop", size: 4,	opcode:one(0o047162),	match: one(0o177777), args: "#w", arch: m68000up, type: dis.nonbranch },

	{ name: "suba.l", size: 2,	opcode:one(0o110700),	match: one(0o170700), args: "*lAd", arch: m68000up , type: dis.nonbranch },
	{ name: "suba.w", size: 2,	opcode:one(0o110300),	match: one(0o170700), args: "*wAd", arch: m68000up , type: dis.nonbranch },

	{ name: "subi.b", size: 4,	opcode:one(0o002000),	match: one(0o177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "subi.w", size: 4,	opcode:one(0o002100),	match: one(0o177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "subi.l", size: 6,	opcode:one(0o002200),	match: one(0o177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },

	{ name: "subq.b", size: 2,	opcode:one(0o050400),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "subq.w", size: 2,	opcode:one(0o050500),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "subq.l", size: 2,	opcode:one(0o050600),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	
	// The sub opcode can generate the suba, subi, and subq instructions.  
	{ name: "sub.b", size: 2,	opcode:one(0o050400),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.b", size: 4,	opcode:one(0o002000),	match: one(0o177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.b", size: 2,	opcode:one(0o110000),	match: one(0o170700), args: ";bDd", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.b", size: 2,	opcode:one(0o110400),	match: one(0o170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.w", size: 2,	opcode:one(0o050500),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.w", size: 4,	opcode:one(0o002100),	match: one(0o177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.w", size: 2,	opcode:one(0o110300),	match: one(0o170700), args: "*wAd", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.w", size: 2,	opcode:one(0o110100),	match: one(0o170700), args: "*wDd", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.w", size: 2,	opcode:one(0o110500),	match: one(0o170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.l", size: 2,	opcode:one(0o050600),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.l", size: 6,	opcode:one(0o002200),	match: one(0o177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.l", size: 2,	opcode:one(0o110700),	match: one(0o170700), args: "*lAd", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.l", size: 2,	opcode:one(0o110200),	match: one(0o170700), args: "*lDd", arch: m68000up , type: dis.nonbranch },
	{ name: "sub.l", size: 2,	opcode:one(0o110600),	match: one(0o170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },

	{ name: "subx.b", size: 2,	opcode:one(0o110400),	match: one(0o170770), args: "DsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "subx.b", size: 2,	opcode:one(0o110410),	match: one(0o170770), args: "-s-d", arch: m68000up , type: dis.nonbranch },
	{ name: "subx.w", size: 2,	opcode:one(0o110500),	match: one(0o170770), args: "DsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "subx.w", size: 2,	opcode:one(0o110510),	match: one(0o170770), args: "-s-d", arch: m68000up , type: dis.nonbranch },
	{ name: "subx.l", size: 2,	opcode:one(0o110600),	match: one(0o170770), args: "DsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "subx.l", size: 2,	opcode:one(0o110610),	match: one(0o170770), args: "-s-d", arch: m68000up , type: dis.nonbranch },

	{ name: "swap", size: 2,	opcode:one(0o044100),	match: one(0o177770), args: "Ds", arch: m68000up , type: dis.nonbranch },

	{ name: "tas", size: 2,		opcode:one(0o045300),	match: one(0o177700), args: "$s", arch: m68000up, type: dis.nonbranch },

	{ name: "trap", size: 2,	opcode:one(0o047100),	match: one(0o177760), args: "Ts", arch: m68000up, type: dis.nonbranch },

	{ name: "tst.b", size: 2,	opcode:one(0o045000),	match: one(0o177700), args: ";b", arch: m68020up , type: dis.nonbranch },
	{ name: "tst.b", size: 2,	opcode:one(0o045000),	match: one(0o177700), args: "$b", arch: m68000up , type: dis.nonbranch },
	{ name: "tst.w", size: 2,	opcode:one(0o045100),	match: one(0o177700), args: "*w", arch: m68020up , type: dis.nonbranch },
	{ name: "tst.w", size: 2,	opcode:one(0o045100),	match: one(0o177700), args: "$w", arch: m68000up , type: dis.nonbranch },
	{ name: "tst.l", size: 2,	opcode:one(0o045200),	match: one(0o177700), args: "*l", arch: m68020up , type: dis.nonbranch },
	{ name: "tst.l", size: 2,	opcode:one(0o045200),	match: one(0o177700), args: "$l", arch: m68000up , type: dis.nonbranch },

	{ name: "unlk", size: 2,	opcode:one(0o047130),	match: one(0o177770), args: "As", arch: m68000up , type: dis.nonbranch },

	{ name: "unpk", size: 4,	opcode:one(0o100600),	match: one(0o170770), args: "DsDd#w", arch: m68020up , type: dis.nonbranch },
	{ name: "unpk", size: 4,	opcode:one(0o100610),	match: one(0o170770), args: "-s-d#w", arch: m68020up , type: dis.nonbranch },
];

// ported from binutils-gdb/opcodes/m68k-dis.c, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3

const fpcr_names: string[] = [
  "", "fpiar", "fpsr", "fpiar/fpsr", "fpcr",
  "fpiar/fpcr", "fpsr/fpcr", "fpiar/fpsr/fpcr"
];

const reg_names: string[] = [
  "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7",
  "a0", "a1", "a2", "a3", "a4", "a5", "a6", "sp",
  "ps", "pc"
];

const reg_names_J = {
	0x000: "sfc",
	0x001: "dfc",
	0x002: "cacr",
	0x003: "tc",
	0x004: "itt0",
	0x005: "itt1",
	0x006: "dtt0",
	0x007: "dtt1",
	0x008: "buscr",
	0x009: "rgpiobar", 
	0x00c: "acr4",
	0x00d: "acr5",
	0x00e: "acr6",
	0x00f: "acr7",
	0x800: "usp",
	0x801: "vbr",
	0x802: "caar",
	0x803: "msp", 
	0x804: "isp",
	0x80f: "pc",
	0xc04: "rambar0", // also called flashbar or rambar.
	0xc05: "rambar1", // also called rambar.

	0xc0e: "mbar0", // sometimes called mbar2 or secmbar.
	0xc0f: "mbar1", // sometimes called mbar.

	0x805: "mmusr", // Should we be calling this psr like we do in case 'Y'?
	0x806: "urp",
	0x807: "srp",
	0x808: "pcr",

	// Fido added these.
	0xffe: "cac",
	0xfff: "mbo",
};

function fetch_arg(buffer: Uint8Array, code: string, bits: number): number {
	let val = 0;

	switch (code) {
	case '/': // MAC/EMAC mask bit.  
		val = buffer[3] >> 5;
		break;

	case 'G': // EMAC ACC load.  
		val = ((buffer[3] >> 3) & 0x2) | ((~buffer[1] >> 7) & 0x1);
		break;

	case 'H': // EMAC ACC !load.  
		val = ((buffer[3] >> 3) & 0x2) | ((buffer[1] >> 7) & 0x1);
		break;

	case ']': // EMAC ACCEXT bit.  
		val = buffer[0] >> 2;
		break;

	case 'I': // MAC/EMAC scale factor.  
		val = buffer[2] >> 1;
		break;

	case 'F': // EMAC ACCx.  
		val = buffer[0] >> 1;
		break;

	case 'f':
		val = buffer[1];
		break;

	case 's':
		val = buffer[1];
		break;

	case 'd':			// Destination, for register or quick.  
		val = (buffer[0] << 8) + buffer[1];
		val >>= 9;
		break;

	case 'x':			// Destination, for general arg.  
		val = (buffer[0] << 8) + buffer[1];
		val >>= 6;
		break;

	case 'k':
		val = (buffer[3] >> 4);
		break;

	case 'C':
		val = buffer[3];
		break;

	case '1':
		val = (buffer[2] << 8) + buffer[3];
		val >>= 12;
		break;

	case '2':
		val = (buffer[2] << 8) + buffer[3];
		val >>= 6;
		break;

	case '3':
	case 'j':
		val = (buffer[2] << 8) + buffer[3];
		break;

	case '4':
		val = (buffer[4] << 8) + buffer[5];
		val >>= 12;
		break;

	case '5':
		val = (buffer[4] << 8) + buffer[5];
		val >>= 6;
		break;

	case '6':
		val = (buffer[4] << 8) + buffer[5];
		break;

	case '7':
		val = (buffer[2] << 8) + buffer[3];
		val >>= 7;
		break;

	case '8':
		val = (buffer[2] << 8) + buffer[3];
		val >>= 10;
		break;

	case '9':
		val = (buffer[2] << 8) + buffer[3];
		val >>= 5;
		break;

	case 'e':
		val = (buffer[1] >> 6);
		break;

	case 'E':
		val = (buffer[2] >> 1);
		break;

	case 'm':
		val = (buffer[1] & 0x40 ? 0x8 : 0)
			| ((buffer[0] >> 1) & 0x7)
			| (buffer[3] & 0x80 ? 0x10 : 0);
		break;

	case 'n':
		val = (buffer[1] & 0x40 ? 0x8 : 0) | ((buffer[0] >> 1) & 0x7);
		break;

	case 'o':
		val = (buffer[2] >> 4) | (buffer[3] & 0x80 ? 0x10 : 0);
		break;

	case 'M':
		val = (buffer[1] & 0xf) | (buffer[3] & 0x40 ? 0x10 : 0);
		break;

	case 'N':
		val = (buffer[3] & 0xf) | (buffer[3] & 0x40 ? 0x10 : 0);
		break;

	case 'h':
		val = buffer[2] >> 2;
		break;

	default:
		throw new Error("<internal error>");
	}

	// bits is never too big.  
	return val & ((1 << bits) - 1);
}

function m68k_valid_ea(code: string, val: number): boolean {
	let mask = 0;

	const M = (n0: number, n1: number, n2: number, n3: number, n4: number, n5: number, n6: number, n70: number, n71: number, n72: number, n73: number, n74: number) => 
		(n0 | n1 << 1 | n2 << 2 | n3 << 3 | n4 << 4 | n5 << 5 | n6 << 6 | n70 << 7 | n71 << 8 | n72 << 9 | n73 << 10 | n74 << 11);

	switch(code) {
	case '*': mask = M(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1); break;
	case '~': mask = M(0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0); break;
	case '%': mask = M(1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0); break;
	case ';': mask = M(1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1); break;
	case '@': mask = M(1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0); break;
	case '!': mask = M(0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0); break;
	case '&': mask = M(0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0); break;
	case '$': mask = M(1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0); break;
	case '?': mask = M(1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0); break;
	case '/': mask = M(1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0); break;
	case '|': mask = M(0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0); break;
	case '>': mask = M(0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0); break;
	case '<': mask = M(0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0); break;
	case 'm': mask = M(1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0); break;
	case 'n': mask = M(0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0); break;
	case 'o': mask = M(0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1); break;
	case 'p': mask = M(1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0); break;
	case 'q': mask = M(1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0); break;
	case 'v': mask = M(1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0); break;
	case 'b': mask = M(1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0); break;
	case 'w': mask = M(0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0); break;
	case 'y': mask = M(0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0); break;
	case 'z': mask = M(0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0); break;
	case '4': mask = M(0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0); break;
	default: throw new Error("abort");
	}

	let mode = (val >> 3) & 7;
	if(mode === 7)
		mode += val & 7;
	return (mask & (1 << mode)) !== 0;
}

const print_address = (adr: number): string => "$" + adr.toString(16);

const print_vma = (b: number): string => b.toString(); // needs to be signed;

function print_base(regno: number, disp: number): string {
	if(regno === -1)
		return print_address(disp) + ",pc";
	if(regno === -2)
		return disp.toString();
	if(regno === -3)
		return print_vma(disp) + ",zpc";
	else
		return print_vma(disp) + "," + reg_names[regno];
}

// COERCE: make signed
const COERCE8 = (x: number) => ((x ^ 0x80) & 0xff) - 128;
const COERCE16 = (x: number) => (x ^ 0x8000) - 0x8000;
const COERCE32 = (x: number) => (x >>> 0);
const NEXTBYTE = (buffer: Uint8Array, p: number) => { p += 2; return [p, COERCE8(buffer[p - 1])]; };
const NEXTWORD = (buffer: Uint8Array, p: number) => { p += 2; return [p, COERCE16((buffer[p - 2] << 8) + buffer[p - 1])]; };
const NEXTLONG = (buffer: Uint8Array, p: number) => { p += 4; return [p, COERCE32((((buffer[p - 4] << 8) + buffer[p - 3] << 8) + buffer[p - 2] << 8) + buffer[p - 1])]; };
const NEXTULONG= (buffer: Uint8Array, p: number) => { p += 4; return [p, (((buffer[p - 4] << 8) + buffer[p - 3] << 8) + buffer[p - 2] << 8) + buffer[p - 1]]; };

function print_indexed(basereg: number, buffer: Uint8Array, p: number, addr: number): [string, number] {
	const scales = [ "", "*2", "*4", "*8" ];
	let text = '';
	let word: number;
	let base_disp: number, outer_disp: number;
	[p, word] = NEXTWORD(buffer, p);

	let buf = `${reg_names[(word >> 12) & 0xf]}.${(word & 0x800) ? 'l' : 'w'}${scales[(word >> 9) & 3]}`;

	// Handle the 68000 style of indexing.  
	if((word & 0x100) === 0) {
		base_disp = word & 0xff;
		if((base_disp & 0x80) !== 0)
			base_disp -= 0x100;
		if(basereg === -1)
			base_disp += addr;
		return ['(' + print_base(basereg, base_disp) + ',' + buf + ')', p];
	}

	// Handle the generalized kind.  
	// First, compute the displacement to add to the base register.  
	if(word & 0o200) {
		if(basereg === -1)
			basereg = -3;
		else
			basereg = -2;
	}

	if(word & 0o100)
		buf = '';
	base_disp = 0;
	switch ((word >> 4) & 3) {
	case 2:
		[p, base_disp] = NEXTWORD(buffer, p);
		break;
	case 3:
		[p, base_disp] = NEXTLONG(buffer, p);
		break;
	}
	if(basereg === -1)
		base_disp += addr;

	// Handle single-level case (not indirect).  
	if((word & 7) === 0)
		return ['(' + print_base(basereg, base_disp) + ((buf !== '') ? (',' + buf) : '') + ')', p];

	// Two level.  Compute displacement to add after indirection.  
	outer_disp = 0;
	switch (word & 3) {
	case 2:
		[p, outer_disp] = NEXTWORD(buffer, p);
		break;
	case 3:
		[p, outer_disp] = NEXTLONG(buffer, p);
		break;
	}

	text = "([" + print_base(basereg, base_disp);
	if((word & 4) === 0 && buf !== '') {
		text += "," + buf;
		buf = '';
	}
	text += "]";
	if(buf !== '')
		text += "," + buf;
	text += "," + print_vma(outer_disp) + ")";
	return [text, p];
}

function print_insn_arg(d: string, buffer: Uint8Array, p0: number, addr: number): { text?: string; len: number } {
	let val = 0;
	let disp = 0;
	let regno = 0;
	let text = '';
	let place = d[1];
	let o = 0;
	let p = p0;

	const FETCH_ARG = (bits: number) => fetch_arg(buffer, place, bits);

	switch(d[0]) {
	case 'c': // Cache identifier.
		const cacheFieldName = [ "nc", "dc", "ic", "bc" ];
		val = FETCH_ARG(2);
		text = cacheFieldName[val];
		break;

	case 'a': // Address register indirect only. Cf. case '+'.
		val = FETCH_ARG(3);
		text = `(${reg_names[val + 8]})`;
		break;

	case '_': // 32-bit absolute address for move16.
		[p, val] = NEXTULONG(buffer, p);
		text = print_address(val);
		break;

	case 'C':
		text = "ccr";
		break;

	case 'S':
		text = "sr";
		break;

	case 'U':
		text = "usp";
		break;

	case 'E':
		text = "acc";
		break;

	case 'G':
		text = "macsr";
		break;

	case 'H':
		text = "mask";
		break;
	
	case 'J':
		val = FETCH_ARG(12);
		if(reg_names_J[val])
			text = reg_names_J[val] as string;
		else 
			text = `0x${val.toString(16)}`;
		break;

	case 'Q':
		val = FETCH_ARG(3);
		// 0 means 8, except for the bkpt instruction... 
		if(val === 0 && d[1] !== 's')
			val = 8;
		text = `#${val}`;
		break;

	case 'x':
		val = FETCH_ARG(3);
		// 0 means -1 
		if(val === 0)
			val = -1;
		text = `#${val}`;
		break;

	case 'j':
		val = FETCH_ARG(3);
		text = `#${val + 1}`;
		break;

	case 'K':
		val = FETCH_ARG(9);
		text = `#${val}`;
		break;

	case 'M':
		if(place === 'h') {
			text = "<not supported: Mh>";
		} else {
			val = FETCH_ARG(8);
			if(val & 0x80)
				val -= 0x100;
			text = `#${val}`;
		}
		break;

	case 'T':
		val = FETCH_ARG(4);
		text = `#${val}`;
		break;
	
	case 'D':
		val = FETCH_ARG(3);
		text += reg_names[val];
		break;

	case 'A':
		val = FETCH_ARG(3);
		text += reg_names[val + 0o010];
		break;

	case 'R':
		val = FETCH_ARG(4);
		text += reg_names[val];
		break;

	case 'r':
		regno = FETCH_ARG(4);
		text = `(${reg_names[regno]})`;
		break;

	case 'F':
		val = FETCH_ARG(3);
		text += `fp${val}`;
		break;
	
	case 'O':
		val = FETCH_ARG(6);
		if(val & 0x20)
			text = reg_names[val & 7];
		else
			text = val.toString();
		break;

	case '+':
		val = FETCH_ARG(3);
		text = `(${reg_names[val + 8]})+`;
		break;

	case '-':
		val = FETCH_ARG(3);
		text = `-(${reg_names[val + 8]})`;
		break;

	case 'k':
		if(place === 'k') {
			val = FETCH_ARG(3);
			text = `{${reg_names[val]}}`;
		} else if(place === 'C') {
			val = FETCH_ARG(7);
			if(val > 63)		// This is a signed constant.  
				val -= 128;
			text = `{#${val}}`;
		} else
			return { len: -1 };
		break;

	case '#':
	case '^':
		let p1 = d[0] === '#' ? 2 : 4;
		if(place === 's')
			val = FETCH_ARG(4);
		else if(place === 'C')
			val = FETCH_ARG(7);
		else if(place === '8')
			val = FETCH_ARG(3);
		else if(place === '3')
			val = FETCH_ARG(8);
		else if(place === 'b')
			[p1, val] = NEXTBYTE(buffer, p1);
		else if(place === 'w' || place === 'W')
			[p1, val] = NEXTWORD(buffer, p1);
		else if(place === 'l')
			[p1, val] = NEXTLONG(buffer, p1);
		else
			throw new Error("<invalid op_table>");
		text = `#${val}`;
		break;

	case 'B':
		if(place === 'b')
			[p, disp] = NEXTBYTE(buffer, p);
		else if(place === 'B')
			disp = COERCE8(buffer[1]);
		else if(place === 'w' || place === 'W')
			[p, disp] = NEXTWORD(buffer, p);
		else if(place === 'l' || place === 'L' || place === 'C')
			[p, disp] = NEXTLONG(buffer, p);
		else if(place === 'g') {
			[o, disp] = NEXTBYTE(buffer, o);
			if(disp === 0)
				[p, disp] = NEXTWORD(buffer, p);
			else if(disp === -1)
				[p, disp] = NEXTLONG(buffer, p);
		} else if(place === 'c') {
			if(buffer[1] & 0x40) // If bit six is one, long offset.
				[p, disp] = NEXTLONG(buffer, p);
			else
				[p, disp] = NEXTWORD(buffer, p);
		} else
			throw new Error("<invalid op_table>");
		text = print_address(addr + disp);
		break;

	case 'd':
		[p, val] = NEXTWORD(buffer, p);
		const val1 = FETCH_ARG(3);
		text = `${val}(${reg_names[val1 + 8]})`;
		break;

	case 's':
		val = FETCH_ARG(3);
		text = fpcr_names[val];
		break;

	case 'I':
		// Get coprocessor ID...
		val = fetch_arg(buffer, 'd', 3);
		if(val < 0)
			text = "<PRINT_INSN_ARG_MEMORY_ERROR>";
		if(val !== 1)				// Unusual coprocessor ID?
			text = `(cpid=${val}) `;
		break;		

	case '4':
	case '*':
	case '~':
	case '%':
	case ';':
	case '@':
	case '!':
	case '$':
	case '?':
	case '/':
	case '&':
	case '|':
	case '<':
	case '>':
	case 'm':
	case 'n':
	case 'o':
	case 'p':
	case 'q':
	case 'v':
	case 'b':
	case 'w':
	case 'y':
	case 'z':
		if(place === 'd') {
			val = fetch_arg(buffer, 'x', 6);
			val = ((val & 7) << 3) + ((val >> 3) & 7);
		} else {
			val = fetch_arg(buffer, 's', 6);
		}

		// If the <ea> is invalid for *d, then reject this match.  
		if(!m68k_valid_ea(d[0], val))
			return { len: -1 };

		// Get register number assuming address register.  
		regno = (val & 7) + 8;
		const regname = reg_names[regno];
		switch (val >> 3) {
		case 0: text = reg_names[val]; break;
		case 1: text = regname; break;
		case 2: text = `(${reg_names[regno]})`; break;
		case 3: text = `(${reg_names[regno]})+`; break;
		case 4: text = `-(${reg_names[regno]})`; break;
		case 5: 
			[p, val] = NEXTWORD(buffer, p);
			text = `${val}(${regname})`;
			break;
		case 6: 
			[text, p] = print_indexed(regno, buffer, p, addr);
			break;
		case 7:
			switch(val & 7) {
			case 0:
				[p, val] = NEXTWORD(buffer, p);
				text = print_address(val);
				break;
			case 1:
				[p, val] = NEXTULONG(buffer, p);
				text = print_address(val);
				break;
			case 2:
				[p, val] = NEXTWORD(buffer, p);
				text = print_address(addr + val) + "(pc)";
				break;
			case 3:
				[text, p] = print_indexed(-1, buffer, p, addr);
				break;
			case 4:
				switch(place) {
				case 'b':
					[p, val] = NEXTBYTE(buffer, p);
					break;
				case 'w':
					[p, val] = NEXTWORD(buffer, p);
					break;
				case 'l':
					[p, val] = NEXTLONG(buffer, p);
					break;
				default:
					console.log("float not supported");
					return { len: 0 };
				}
				text = `#${val}`;
				break;
			}
		}
		break;

	case 'L':
	case 'l':
		if(place === 'w') {
			let doneany = false;
			let p1 = 2;
			[p1, val] = NEXTWORD(buffer, p1);
			if(p1 > p)
				p = p1;
			if(val === 0) {
				text = '#0';
				break;
			}
			if(d[0] === 'l') {
				let newval = 0;

				for(regno = 0; regno < 16; ++regno)
					if(val & (0x8000 >> regno))
						newval |= 1 << regno;
				val = newval;
			}
			val &= 0xffff;
			doneany = false;
			for(regno = 0; regno < 16; ++regno)
				if(val & (1 << regno)) {
					if(doneany)
						text += "/";
					doneany = true;
					text += reg_names[regno];
					const first_regno = regno;
					while(val & (1 << (regno + 1)))
						++regno;
					if(regno > first_regno)
						text += `-${reg_names[regno]}`;
				}
		} else if(place === '3') {
			console.log("float not supported");
		} else if(place === '8') {
			val = FETCH_ARG(3);
			text = fpcr_names[val];
		} else
			throw new Error("<invalid op_table>");
		break;

	case 'X':
		place = '8';
		// fall through
	case 'Y':
	case 'Z':
	case 'W':
	case '0':
	case '1':
	case '2':
	case '3':
		val = FETCH_ARG(5);
		switch(val) {
		case 2: text = "tt0"; break;
		case 3: text = "tt1"; break;
		case 0x10: text = "tc"; break;
		case 0x11: text = "drp"; break;
		case 0x12: text = "srp"; break;
		case 0x13: text = "crp"; break;
		case 0x14: text = "cal"; break;
		case 0x15: text = "val"; break;
		case 0x16: text = "scc"; break;
		case 0x17: text = "ac"; break;
		case 0x18: text = "psr"; break;
		case 0x19: text = "pcsr"; break;
		case 0x1c:
		case 0x1d:
			const break_reg = ((buffer[3] >> 2) & 7);
			text = (val === 0x1c ? "bad" : "bac") + break_reg.toString();
			break;
		default:
			text = `<mmu register ${val}>`;
			break;
		}
	
	case 'f':
		const fc = FETCH_ARG(5);
		if(fc === 1)
			text = "dfc";
		else if(fc === 0)
			text = "sfc";
		else
			text = `<function code ${fc}>`;
		break;

	case 'V':
		text = "val";
		break;

	case 't':
		const level = FETCH_ARG(3);
		text = level.toString();
		break;

	default: 
		throw new Error(`<invalid op_table ${d[0]}>`);
	}
	return { text, len: p - p0 };
}

function match_insn_m68k(buffer: Uint8Array, memaddr: number, best: m68k_opcode): { text: string; len: number } {
	let text = '';
	let d = 0;
	if(best.args[d] === '.')
		d++;
	let p = 2;
	for(; d < best.args.length; d += 2) {
		if(best.args[d] === '#') {
		  if(best.args[d + 1] === 'l' && p < 6)
			p = 6;
		  else if(p < 4 && best.args[d + 1] !== 'C' && best.args[d + 1] !== '8')
			p = 4;
		}
		if((best.args[d] === 'L' || best.args[d] === 'l') && best.args[d + 1] === 'w' && p < 4)
			p = 4;
		switch (best.args[d + 1]) {
		case '1':
		case '2':
		case '3':
		case '7':
		case '8':
		case '9':
		case 'i':
			if(p < 4)
				p = 4;
			break;
		case '4':
		case '5':
		case '6':
			if(p < 6)
				p = 6;
			break;
		default:
			break;
		}
	}

	// pflusha is an exceptions.  It takes no arguments but is two words long.  Recognize it by looking at the lower 16 bits of the mask.  
	if(p < 4 && (best.match & 0xffff) !== 0)
		p = 4;

	// lpstop is another exception.  It takes a one word argument but is three words long.  
	if(p < 6 && (best.match & 0xffff) === 0xffff && best.args[0] === '#' && best.args[1] === 'w') {
		// Copy the one word argument into the usual location for a one word argument, to simplify printing it.
		// We can get away with this because we know exactly what the second word is, and we aren't going to print anything based on it.  
		p = 6;
		buffer[2] = buffer[4];
		buffer[3] = buffer[5];
	}

	d = 0;

	text += best.name;

	if(best.args.length > 0)
		text += ' ';

	while(d < best.args.length) {
		const arg_val = print_insn_arg(best.args.slice(d, d + 2), buffer, p, memaddr + p);
		if(arg_val.len === -1) // invalid argument, reject match
			return { text: '', len: 0 };
		p += arg_val.len;
		text += arg_val.text;
		d += 2;

		if(d < best.args.length && best.args[d - 2] !== 'I' && best.args[d] !== 'k')
			text += ",";
	}

	return { text, len: p };
}

function m68k_scan_mask(buffer: Uint8Array, memaddr: number, arch_mask: number): { text: string; len: number } {
	for(const opc of m68k_opcodes) {
		let a = 0, d = 0;
		if(opc.args[0] === '.')
			a++;
		if(((0xff & buffer[0] & (opc.match >> 24)) === (0xff & (opc.opcode >> 24)))
		 && ((0xff & buffer[1] & (opc.match >> 16)) === (0xff & (opc.opcode >> 16)))
		 && (((0xffff & opc.match) === 0) // Only fetch the next two bytes if we need to.
			  || (((0xff & buffer[2] & (opc.match >> 8)) === (0xff & (opc.opcode >> 8)))
			   && ((0xff & buffer[3] & opc.match) === (0xff & opc.opcode))))
		 && (opc.arch & arch_mask) !== 0) {
			// Don't use for printout the variants of divul and divsl that have the same register number in two places. The more general variants will match instead.
			for(d = a; d < opc.args.length; d += 2)
				if(opc.args[d + 1] === 'D')
					break;
			// Don't use for printout the variants of most floating point coprocessor instructions which use the same register number in two places, as above.
			if(d >= opc.args.length)
				for(d = a; d < opc.args.length; d += 2)
					if(opc.args[d + 1] === 't')
						break;
			// Don't match fmovel with more than one register; wait for fmoveml.
			if(d >= opc.args.length) {
				for(d = a; d < opc.args.length; d += 2) {
					if(opc.args[d + 0] === 's' && opc.args[d + 1] === '8') {
						const val = fetch_arg(buffer, opc.args[d + 1], 3);
						if(val < 0)
							return { text: '', len: 0 };
						if((val & (val - 1)) !== 0)
							break;
					}
				}
			}
			// Don't match FPU insns with non-default coprocessor ID.
			if(d >= opc.args.length) {
				for(d = a; d < opc.args.length; d += 2) {
					if(opc.args[d + 0] === 'I') {
						const val = fetch_arg(buffer, 'd', 3);
						if(val !== 1)
							break;
					}
				}
			}
			//console.log('match:', opc);
			if(d >= opc.args.length) {
				const val = match_insn_m68k(buffer, memaddr, opc);
				if(val.len)
					return val;
			}
		}
	}
	
	return { text: '', len: 0 };
}

export function print_insn_m68k(buffer: Uint8Array, memaddr: number): { text: string; len: number } {
	const ret = m68k_scan_mask(buffer, memaddr, m68k_mask);
	if(ret.len === 0) {
		return { text: `.short 0x${buffer[0].toString(16).padStart(2, '0')}${buffer[1].toString(16).padStart(2, '0')}`, len: 2 };
	}
	return ret;
}
