// ported from binutils-gdb/include/opcode/m68k.h, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3
// removed all references to coldfire

/* eslint-disable @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match, @typescript-eslint/naming-convention */

enum dis {
	noninsn,		/* Not a valid instruction.  */
	nonbranch,		/* Not a branch instruction.  */
	branch,			/* Unconditional branch.  */
	condbranch,		/* Conditional branch.  */
	jsr,			/* Jump to subroutine.  */
	condjsr,		/* Conditional jump to subroutine.  */
	dref,			/* Data reference instruction.  */
	dref2			/* Two data references in instruction.  */
}

const _m68k_undef = 0;
const m68000 = 0x001;
const m68010 = 0x002;
const m68020 = 0x004;
const m68030 = 0x008;
const m68040 = 0x010;
const m68060 = 0x020;
const m68881 = 0x040;
const m68851 = 0x080;
const m68k_mask = 0x3ff;

/* Handy aliases.  */
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

interface m68k_opcode_alias {
	alias: string;
	primary: string;
}

function one(x: number) { return x << 16 >>> 0; } // >>> 0: make unsigned
function two(x: number, y: number) { return ((x << 16) + y) >>> 0; }

const SCOPE_LINE = (0x1 << 3);
const SCOPE_PAGE = (0x2 << 3);
const SCOPE_ALL  = (0x3 << 3);

// ported from binutils-gdb/opcodes/m68k-opc.c, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3
// removed all coldfire opcodes, FPU opcodes missing

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

	/* The add opcode can generate the adda, addi, and addq instructions.  */
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

	/* The and opcode can generate the andi instruction.  */
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

	{ name: "jhi", size: 2,	opcode: one(0o0061000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jls", size: 2,	opcode: one(0o0061400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jcc", size: 2,	opcode: one(0o0062000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jcs", size: 2,	opcode: one(0o0062400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jne", size: 2,	opcode: one(0o0063000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jeq", size: 2,	opcode: one(0o0063400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jvc", size: 2,	opcode: one(0o0064000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jvs", size: 2,	opcode: one(0o0064400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jpl", size: 2,	opcode: one(0o0065000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jmi", size: 2,	opcode: one(0o0065400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jge", size: 2,	opcode: one(0o0066000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jlt", size: 2,	opcode: one(0o0066400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jgt", size: 2,	opcode: one(0o0067000),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },
	{ name: "jle", size: 2,	opcode: one(0o0067400),	match: one(0o0177400), args: "Bg", arch: m68000up, type: dis.condbranch },

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

	{ name: "cas2w", size: 6,   opcode:  two(0o0006374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5r1r4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2w", size: 6,   opcode:  two(0o0006374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5R1R4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2l", size: 6,   opcode:  two(0o0007374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5r1r4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2l", size: 6,   opcode:  two(0o0007374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5R1R4", arch: m68020up, type: dis.nonbranch },

	{ name: "casb", size: 4,	opcode: two(0o0005300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },
	{ name: "casw", size: 4,	opcode: two(0o0006300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },
	{ name: "casl", size: 4,	opcode: two(0o0007300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },

	{ name: "chk2b", size: 4, 	opcode: two(0o0000300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },
	{ name: "chk2w", size: 4, 	opcode: two(0o0001300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },
	{ name: "chk2l", size: 4, 	opcode: two(0o0002300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up, type: dis.nonbranch },

	{ name: "chkl", size: 2,	opcode: one(0o0040400),		match: one(0o0170700), args: ";lDd", arch: m68020up, type: dis.nonbranch },
	{ name: "chkw", size: 2,	opcode: one(0o0040600),		match: one(0o0170700), args: ";wDd", arch: m68020up, type: dis.nonbranch },

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

	/* The cmp opcode can generate the cmpa, cmpm, and cmpi instructions.  */
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

	{ name: "divsl.l", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lD3D1",arch: m68020up , type: dis.nonbranch },
	{ name: "divsl.l", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lDD",  arch: m68020up , type: dis.nonbranch },

	{ name: "divu.w", size: 2,	opcode: one(0o0100300),		match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },

	{ name: "divu.l", size: 4,	opcode: two(0o0046100,0o0002000),match: two(0o0177700,0o0107770), args:";lD3D1", arch: m68020up , type: dis.nonbranch },
	{ name: "divu.l", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lDD",   arch: m68020up , type: dis.nonbranch },
	
	{ name: "divul.l", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lD3D1",arch: m68020up , type: dis.nonbranch },
	{ name: "divul.l", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lDD",  arch: m68020up , type: dis.nonbranch },

	{ name: "eori.b", size: 4,	opcode: one(0o0005000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.b", size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.w", size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.w", size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori.l", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },

	/* The eor opcode can generate the eori instruction.  */
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

	// FLOAT here (or not)

	{ name: "halt", size: 2,	opcode: one(0o0045310),	match: one(0o0177777), args: "",     arch: m68060 , type: dis.nonbranch },

	{ name: "illegal", size: 2,	opcode: one(0o0045374),	match: one(0o0177777), args: "",     arch: m68000up , type: dis.nonbranch },

	{ name: "jmp", size: 2,		opcode: one(0o0047300),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.branch },

	{ name: "jra", size: 2,		opcode: one(0o0060000),	match: one(0o0177400), args: "Bb", arch: m68000up , type: dis.branch },
	{ name: "jra", size: 2,		opcode: one(0o0047300),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.branch },

	{ name: "jsr", size: 2,		opcode: one(0o0047200),	match: one(0o0177700), args: "!s", arch: m68000up , type: dis.jsr },

	{ name: "jbsr", size: 2,	opcode: one(0o0060400),	match: one(0o0177400), args: "Bs", arch: m68000up , type: dis.jsr },
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
	
	/* The move opcode can generate the movea and moveq instructions.  */
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
	
	/* The or opcode can generate the ori instruction.  */
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
	{ name: "or", size: 4,	opcode: one(0o0000074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 4,	opcode: one(0o0000100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 4,	opcode: one(0o0000174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 2,	opcode: one(0o0100100),	match: one(0o0170700), args: ";wDd", arch: m68000up , type: dis.nonbranch },
	{ name: "or", size: 2,	opcode: one(0o0100500),	match: one(0o0170700), args: "Dd~s", arch: m68000up , type: dis.nonbranch },

	{ name: "pack", size: 4, opcode:one(0o0100500),	match: one(0o0170770), args: "DsDd#w", arch: m68020up , type: dis.nonbranch },
	{ name: "pack", size: 4, opcode:one(0o0100510),	match: one(0o0170770), args: "-s-d#w", arch: m68020up , type: dis.nonbranch },

	// MMU opcodes missing here

	{ name: "pea", size: 2,	opcode:one(0o0044100),		match: one(0o0177700), args: "!s", arch: m68000up , type: dis.nonbranch },

	{ name: "pflusha", size: 2,	opcode:one(0xf518),		match: one(0xfff8), args: "", arch: m68040up , type: dis.nonbranch },
	{ name: "pflusha", size: 4,	opcode:two(0xf000,0x2400), match: two(0xffff,0xffff), args: "", arch: m68030 |m68851 , type: dis.nonbranch },
	
	{ name: "pflush", size: 4,   opcode:two(0xf000,0x3010), match: two(0xffc0,0xfe10), args: "T3T9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,   opcode:two(0xf000,0x3810), match: two(0xffc0,0xfe10), args: "T3T9&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,   opcode:two(0xf000,0x3008), match: two(0xffc0,0xfe18), args: "D3T9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,   opcode:two(0xf000,0x3808), match: two(0xffc0,0xfe18), args: "D3T9&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,   opcode:two(0xf000,0x3000), match: two(0xffc0,0xfe1e), args: "f3T9", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 4,   opcode:two(0xf000,0x3800), match: two(0xffc0,0xfe1e), args: "f3T9&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pflush", size: 2,	opcode:one(0xf508),		match: one(0xfff8), args: "as", arch: m68040up , type: dis.nonbranch },
	{ name: "pflush", size: 2,	opcode:one(0xf508),		match: one(0xfff8), args: "As", arch: m68040up , type: dis.nonbranch },
	
	{ name: "pflushan", size: 2,	opcode:one(0xf510),		match: one(0xfff8), args: "", arch: m68040up , type: dis.nonbranch },
	{ name: "pflushn", size: 2,	opcode:one(0xf500),		match: one(0xfff8), args: "as", arch: m68040up , type: dis.nonbranch },
	{ name: "pflushn", size: 2,	opcode:one(0xf500),		match: one(0xfff8), args: "As", arch: m68040up , type: dis.nonbranch },
	
	{ name: "ploadr", size: 4,   opcode:two(0xf000,0x2210), match: two(0xffc0,0xfff0), args: "T3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadr", size: 4,   opcode:two(0xf000,0x2208), match: two(0xffc0,0xfff8), args: "D3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadr", size: 4,   opcode:two(0xf000,0x2200), match: two(0xffc0,0xfffe), args: "f3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadw", size: 4,   opcode:two(0xf000,0x2010), match: two(0xffc0,0xfff0), args: "T3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadw", size: 4,   opcode:two(0xf000,0x2008), match: two(0xffc0,0xfff8), args: "D3&s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "ploadw", size: 4,   opcode:two(0xf000,0x2000), match: two(0xffc0,0xfffe), args: "f3&s", arch: m68030|m68851 , type: dis.nonbranch },
	
	{ name: "plpar", size: 2,	opcode:one(0xf5c8),		match: one(0xfff8), args: "as", arch: m68060 , type: dis.nonbranch },
	{ name: "plpaw", size: 2,	opcode:one(0xf588),		match: one(0xfff8), args: "as", arch: m68060 , type: dis.nonbranch },
	
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x4000), match: two(0xffc0,0xffff), args: "*l08", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x4200), match: two(0xffc0,0xffff), args: "08%s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x5e00), match: two(0xffc0,0xffff), args: "18%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x4200), match: two(0xffc0,0xe3ff), args: "28%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x4000), match: two(0xffc0,0xe3ff), args: "|sW8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x4200), match: two(0xffc0,0xe3ff), args: "W8~s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x6000), match: two(0xffc0,0xffff), args: "*wY8", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x6200), match: two(0xffc0,0xffff), args: "Y8%s", arch: m68030|m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x6600), match: two(0xffc0,0xffff), args: "Z8%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x6000), match: two(0xffc0,0xe3e3), args: "*wX3", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x6200), match: two(0xffc0,0xe3e3), args: "X3%s", arch: m68851 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x0800), match: two(0xffc0,0xfbff), args: "*l38", arch: m68030 , type: dis.nonbranch },
	{ name: "pmove", size: 4,    opcode:two(0xf000,0x0a00), match: two(0xffc0,0xfbff), args: "38%s", arch: m68030 , type: dis.nonbranch },

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
	
	{ name: "rtd", size: 4,	opcode:one(0o047164),		match: one(0o177777), args: "#w", arch: m68010up , type: dis.nonbranch },

	{ name: "rte", size: 2,	opcode:one(0o047163),		match: one(0o177777), args: "",   arch: m68000up , type: dis.nonbranch },

	{ name: "rtm", size: 2,	opcode:one(0o003300),		match: one(0o177760), args: "Rs", arch: m68020 , type: dis.nonbranch },

	{ name: "rtr", size: 2,	opcode:one(0o047167),		match: one(0o177777), args: "",   arch: m68000up , type: dis.nonbranch },

	{ name: "rts", size: 2,	opcode:one(0o047165),		match: one(0o177777), args: "",   arch: m68000up , type: dis.nonbranch },
	
	{ name: "sbcd", size: 2,	opcode:one(0o100400),		match: one(0o170770), args: "DsDd", arch: m68000up , type: dis.nonbranch },
	{ name: "sbcd", size: 2,	opcode:one(0o100410),		match: one(0o170770), args: "-s-d", arch: m68000up , type: dis.nonbranch },
	
	  /* Traps have to come before conditional sets, as they have a more
		 specific opcode.  */
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

	{ name: "trapcc.w", size: 4,	opcode:one(0o052372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapcs.w", size: 4,	opcode:one(0o052772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapeq.w", size: 4,	opcode:one(0o053772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapf.w", size: 4,	opcode:one(0o050772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapge.w", size: 4,	opcode:one(0o056372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapgt.w", size: 4,	opcode:one(0o057372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "traphi.w", size: 4,	opcode:one(0o051372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "traple.w", size: 4,	opcode:one(0o057772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapls.w", size: 4,	opcode:one(0o051772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "traplt.w", size: 4,	opcode:one(0o056772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapmi.w", size: 4,	opcode:one(0o055772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapne.w", size: 4,	opcode:one(0o053372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trappl.w", size: 4,	opcode:one(0o055372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapt.w", size: 4,	opcode:one(0o050372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvc.w", size: 4,	opcode:one(0o054372),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvs.w", size: 4,	opcode:one(0o054772),	match: one(0o177777), args: "#w", arch: m68020up, type: dis.nonbranch },

	{ name: "trapcc.l", size: 6,	opcode:one(0o052373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapcs.l", size: 6,	opcode:one(0o052773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapeq.l", size: 6,	opcode:one(0o053773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapf.l", size: 6,	opcode:one(0o050773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapge.l", size: 6,	opcode:one(0o056373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapgt.l", size: 6,	opcode:one(0o057373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "traphi.l", size: 6,	opcode:one(0o051373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "traple.l", size: 6,	opcode:one(0o057773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapls.l", size: 6,	opcode:one(0o051773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "traplt.l", size: 6,	opcode:one(0o056773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapmi.l", size: 6,	opcode:one(0o055773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapne.l", size: 6,	opcode:one(0o053373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trappl.l", size: 6,	opcode:one(0o055373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapt.l", size: 6,	opcode:one(0o050373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvc.l", size: 6,	opcode:one(0o054373),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },
	{ name: "trapvs.l", size: 6,	opcode:one(0o054773),	match: one(0o177777), args: "#l", arch: m68020up, type: dis.nonbranch },

	{ name: "trapv", size: 2,	opcode:one(0o047166),	match: one(0o177777), args: "", arch: m68000up , type: dis.nonbranch },
	
	{ name: "scc", size: 2,	opcode:one(0o052300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "scs", size: 2,	opcode:one(0o052700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "seq", size: 2,	opcode:one(0o053700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sf", size: 2,	opcode:one(0o050700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sge", size: 2,	opcode:one(0o056300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sgt", size: 2,	opcode:one(0o057300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "shi", size: 2,	opcode:one(0o051300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sle", size: 2,	opcode:one(0o057700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sls", size: 2,	opcode:one(0o051700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "slt", size: 2,	opcode:one(0o056700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "smi", size: 2,	opcode:one(0o055700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "sne", size: 2,	opcode:one(0o053300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "spl", size: 2,	opcode:one(0o055300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "st", size: 2,	opcode:one(0o050300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "svc", size: 2,	opcode:one(0o054300),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	{ name: "svs", size: 2,	opcode:one(0o054700),	match: one(0o177700), args: "$s", arch: m68000up , type: dis.nonbranch },
	
	{ name: "stop", size: 4,	opcode:one(0o047162),	match: one(0o177777), args: "#w", arch: m68000up, type: dis.nonbranch },

	{ name: "suba.l", size: 2,	opcode:one(0o110700),	match: one(0o170700), args: "*lAd", arch: m68000up , type: dis.nonbranch },
	{ name: "suba.w", size: 2,	opcode:one(0o110300),	match: one(0o170700), args: "*wAd", arch: m68000up , type: dis.nonbranch },

	{ name: "subi.b", size: 4,	opcode:one(0o002000),	match: one(0o177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "subi.w", size: 4,	opcode:one(0o002100),	match: one(0o177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "subi.l", size: 6,	opcode:one(0o002200),	match: one(0o177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },

	{ name: "subq.b", size: 2,	opcode:one(0o050400),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "subq.w", size: 2,	opcode:one(0o050500),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	{ name: "subq.l", size: 2,	opcode:one(0o050600),	match: one(0o170700), args: "Qd%s", arch: m68000up , type: dis.nonbranch },
	
	/* The sub opcode can generate the suba, subi, and subq instructions.  */
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

const m68k_opcode_aliases: m68k_opcode_alias[] = [
  { alias:"add",	primary:"add.w" },
  { alias:"adda",	primary:"adda.w" },
  { alias:"addi",	primary:"addi.w" },
  { alias:"addq",	primary:"addq.w" },
  { alias:"addx",	primary:"addx.w" },
  { alias:"asl",	primary:"asl.w" },
  { alias:"asr",	primary:"asr.w" },
  { alias:"bhi",	primary:"bhi.w" },
  { alias:"bls",	primary:"bls.w" },
  { alias:"bcc",	primary:"bcc.w" },
  { alias:"bcs",	primary:"bcs.w" },
  { alias:"bne",	primary:"bne.w" },
  { alias:"beq",	primary:"beq.w" },
  { alias:"bvc",	primary:"bvc.w" },
  { alias:"bvs",	primary:"bvs.w" },
  { alias:"bpl",	primary:"bpl.w" },
  { alias:"bmi",	primary:"bmi.w" },
  { alias:"bge",	primary:"bge.w" },
  { alias:"blt",	primary:"blt.w" },
  { alias:"bgt",	primary:"bgt.w" },
  { alias:"ble",	primary:"ble.w" },
  { alias:"bra",	primary:"bra.w" },
  { alias:"bsr",	primary:"bsr.w" },
  { alias:"bhib",	primary:"bhi.s" },
  { alias:"blsb",	primary:"bls.s" },
  { alias:"bccb",	primary:"bcc.s" },
  { alias:"bcsb",	primary:"bcs.s" },
  { alias:"bneb",	primary:"bne.s" },
  { alias:"beqb",	primary:"beq.s" },
  { alias:"bvcb",	primary:"bvc.s" },
  { alias:"bvsb",	primary:"bvs.s" },
  { alias:"bplb",	primary:"bpl.s" },
  { alias:"bmib",	primary:"bmi.s" },
  { alias:"bgeb",	primary:"bge.s" },
  { alias:"bltb",	primary:"blt.s" },
  { alias:"bgtb",	primary:"bgt.s" },
  { alias:"bleb",	primary:"ble.s" },
  { alias:"brab",	primary:"bra.s" },
  { alias:"bsrb",	primary:"bsr.s" },
  { alias:"bhs",	primary:"bcc.w" },
  { alias:"bhss",	primary:"bcc.s" },
  { alias:"bhsb",	primary:"bcc.s" },
  { alias:"bhsw",	primary:"bcc.w" },
  { alias:"bhsl",	primary:"bcc.l" },
  { alias:"blo",	primary:"bcs.w" },
  { alias:"blos",	primary:"bcs.s" },
  { alias:"blob",	primary:"bcs.s" },
  { alias:"blow",	primary:"bcs.w" },
  { alias:"blol",	primary:"bcs.l" },
  { alias:"br",		primary:"bra.w" },
  { alias:"brs",	primary:"bra.s" },
  { alias:"brb",	primary:"bra.s" },
  { alias:"brw",	primary:"bra.w" },
  { alias:"brl",	primary:"bra.l" },
  { alias:"jfnlt",	primary:"bcc" },	/* Apparently a sun alias.  */
  { alias:"jfngt",	primary:"ble" },	/* Apparently a sun alias.  */
  { alias:"jfeq",	primary:"beq.s" },	/* Apparently a sun alias.  */
  { alias:"bchgb",	primary:"bchg" },
  { alias:"bchgl",	primary:"bchg" },
  { alias:"bclrb",	primary:"bclr" },
  { alias:"bclrl",	primary:"bclr" },
  { alias:"bsetb",	primary:"bset" },
  { alias:"bsetl",	primary:"bset" },
  { alias:"btstb",	primary:"btst" },
  { alias:"btstl",	primary:"btst" },
  { alias:"cas2",	primary:"cas2.w" },
  { alias:"cas",	primary:"cas.w" },
  { alias:"chk2",	primary:"chk2.w" },
  { alias:"chk",	primary:"chk.w" },
  { alias:"clr",	primary:"clr.w" },
  { alias:"cmp2",	primary:"cmp2.w" },
  { alias:"cmpa",	primary:"cmpa.w" },
  { alias:"cmpi",	primary:"cmpi.w" },
  { alias:"cmpm",	primary:"cmpm.w" },
  { alias:"cmp",	primary:"cmp.w" },
  { alias:"dbccw",	primary:"dbcc" },
  { alias:"dbcsw",	primary:"dbcs" },
  { alias:"dbeqw",	primary:"dbeq" },
  { alias:"dbfw",	primary:"dbf" },
  { alias:"dbgew",	primary:"dbge" },
  { alias:"dbgtw",	primary:"dbgt" },
  { alias:"dbhiw",	primary:"dbhi" },
  { alias:"dblew",	primary:"dble" },
  { alias:"dblsw",	primary:"dbls" },
  { alias:"dbltw",	primary:"dblt" },
  { alias:"dbmiw",	primary:"dbmi" },
  { alias:"dbnew",	primary:"dbne" },
  { alias:"dbplw",	primary:"dbpl" },
  { alias:"dbtw",	primary:"dbt" },
  { alias:"dbvcw",	primary:"dbvc" },
  { alias:"dbvsw",	primary:"dbvs" },
  { alias:"dbhs",	primary:"dbcc" },
  { alias:"dbhsw",	primary:"dbcc" },
  { alias:"dbra",	primary:"dbf" },
  { alias:"dbraw",	primary:"dbf" },
  { alias:"tdivsl",	primary:"divsl.l" },
  { alias:"divs",	primary:"divs.w" },
  { alias:"divu",	primary:"divu.w" },
  { alias:"ext",	primary:"ext.w" },
  { alias:"extbw",	primary:"ext.w" },
  { alias:"extwl",	primary:"ext.l" },
  { alias:"fbneq",	primary:"fbne" },
  { alias:"fbsneq",	primary:"fbsne" },
  { alias:"fdbneq",	primary:"fdbne" },
  { alias:"fdbsneq",primary:"fdbsne" },
  { alias:"fmovecr",primary:"fmovecrx" },
  { alias:"fmovm",	primary:"fmovem" },
  { alias:"fsneq",	primary:"fsne" },
  { alias:"fssneq",	primary:"fssne" },
  { alias:"ftrapneq",primary:"ftrapne" },
  { alias:"ftrapsneq", primary:"ftrapsne" },
  { alias:"fjneq",	primary:"fjne" },
  { alias:"fjsneq",	primary:"fjsne" },
  { alias:"jmpl",	primary:"jmp" },
  { alias:"jmps",	primary:"jmp" },
  { alias:"jsrl",	primary:"jsr" },
  { alias:"jsrs",	primary:"jsr" },
  { alias:"leal",	primary:"lea" },
  { alias:"lsl",	primary:"lsl.w" },
  { alias:"lsr",	primary:"lsr.w" },
  { alias:"mac",	primary:"mac.w" },
  { alias:"movea",	primary:"movea.w" },
  { alias:"movem",	primary:"movem.w" },
  { alias:"movml",	primary:"movem.l" },
  { alias:"movmw",	primary:"movem.w" },
  { alias:"movm",	primary:"movem.w" },
  { alias:"movep",	primary:"movep.w" },
  { alias:"movpw",	primary:"movep.w" },
  { alias:"moves",	primary:"moves.w" },
  { alias:"muls",	primary:"muls.w" },
  { alias:"mulu",	primary:"mulu.w" },
  { alias:"msac",	primary:"msac.w" },
  { alias:"nbcdb",	primary:"nbcd" },
  { alias:"neg",	primary:"neg.w" },
  { alias:"negx",	primary:"negx.w" },
  { alias:"not",	primary:"not.w" },
  { alias:"peal",	primary:"pea" },
  { alias:"rol",	primary:"rol.w" },
  { alias:"ror",	primary:"ror.w" },
  { alias:"roxl",	primary:"roxl.w" },
  { alias:"roxr",	primary:"roxr.w" },
  { alias:"sats",	primary:"satsl" },
  { alias:"sbcdb",	primary:"sbcd" },
  { alias:"sccb",	primary:"scc" },
  { alias:"scsb",	primary:"scs" },
  { alias:"seqb",	primary:"seq" },
  { alias:"sfb",	primary:"sf" },
  { alias:"sgeb",	primary:"sge" },
  { alias:"sgtb",	primary:"sgt" },
  { alias:"shib",	primary:"shi" },
  { alias:"sleb",	primary:"sle" },
  { alias:"slsb",	primary:"sls" },
  { alias:"sltb",	primary:"slt" },
  { alias:"smib",	primary:"smi" },
  { alias:"sneb",	primary:"sne" },
  { alias:"splb",	primary:"spl" },
  { alias:"stb",	primary:"st" },
  { alias:"svcb",	primary:"svc" },
  { alias:"svsb",	primary:"svs" },
  { alias:"sfge",	primary:"sge" },
  { alias:"sfgt",	primary:"sgt" },
  { alias:"sfle",	primary:"sle" },
  { alias:"sflt",	primary:"slt" },
  { alias:"sfneq",	primary:"sne" },
  { alias:"suba",	primary:"suba.w" },
  { alias:"subi",	primary:"subi.w" },
  { alias:"subq",	primary:"subq.w" },
  { alias:"sub",	primary:"sub.w" },
  { alias:"subx",	primary:"subx.w" },
  { alias:"swapw",	primary:"swap" },
  { alias:"tasb",	primary:"tas" },
  { alias:"tpcc",	primary:"trapcc" },
  { alias:"tcc",	primary:"trapcc" },
  { alias:"tst",	primary:"tst.w" },
  { alias:"jbra",	primary:"jra" },
  { alias:"jbhi",	primary:"jhi" },
  { alias:"jbls",	primary:"jls" },
  { alias:"jbcc",	primary:"jcc" },
  { alias:"jbcs",	primary:"jcs" },
  { alias:"jbne",	primary:"jne" },
  { alias:"jbeq",	primary:"jeq" },
  { alias:"jbvc",	primary:"jvc" },
  { alias:"jbvs",	primary:"jvs" },
  { alias:"jbpl",	primary:"jpl" },
  { alias:"jbmi",	primary:"jmi" },
  { alias:"jbge",	primary:"jge" },
  { alias:"jblt",	primary:"jlt" },
  { alias:"jbgt",	primary:"jgt" },
  { alias:"jble",	primary:"jle" },
  { alias:"movql",	primary:"moveq" },
  { alias:"moveql",	primary:"moveq" },
  { alias:"movl",	primary:"movel" },
  { alias:"movq",	primary:"moveq" },
  { alias:"moval",	primary:"movea.l" },
  { alias:"movaw",	primary:"movea.w" },
  { alias:"movb",	primary:"moveb" },
  { alias:"movc",	primary:"movec" },
  { alias:"movecl",	primary:"movec" },
  { alias:"movpl",	primary:"movep.l" },
  { alias:"movw",	primary:"movew" },
  { alias:"movsb",	primary:"moves.b" },
  { alias:"movsl",	primary:"moves.l" },
  { alias:"movsw",	primary:"moves.w" },
  { alias:"mov3q",	primary:"mov3q.l" },

  { alias:"tdivul",	primary:"divul.l" },	/* For m68k-svr4.  */
  { alias:"fmovb",	primary:"fmoveb" },
  { alias:"fsmovb",	primary:"fsmoveb" },
  { alias:"fdmovb",	primary:"fdmoveb" },
  { alias:"fmovd",	primary:"fmoved" },
  { alias:"fsmovd",	primary:"fsmoved" },
  { alias:"fmovl",	primary:"fmovel" },
  { alias:"fsmovl",	primary:"fsmovel" },
  { alias:"fdmovl",	primary:"fdmovel" },
  { alias:"fmovp",	primary:"fmovep" },
  { alias:"fsmovp",	primary:"fsmovep" },
  { alias:"fdmovp",	primary:"fdmovep" },
  { alias:"fmovs",	primary:"fmoves" },
  { alias:"fsmovs",	primary:"fsmoves" },
  { alias:"fdmovs",	primary:"fdmoves" },
  { alias:"fmovw",	primary:"fmovew" },
  { alias:"fsmovw",	primary:"fsmovew" },
  { alias:"fdmovw",	primary:"fdmovew" },
  { alias:"fmovx",	primary:"fmovex" },
  { alias:"fsmovx",	primary:"fsmovex" },
  { alias:"fdmovx",	primary:"fdmovex" },
  { alias:"fmovcr",	primary:"fmovecr" },
  { alias:"fmovcrx",primary:"fmovecrx" },
  { alias:"ftestb",	primary:"ftstb" },
  { alias:"ftestd",	primary:"ftstd" },
  { alias:"ftestl",	primary:"ftstl" },
  { alias:"ftestp",	primary:"ftstp" },
  { alias:"ftests",	primary:"ftsts" },
  { alias:"ftestw",	primary:"ftstw" },
  { alias:"ftestx",	primary:"ftstx" },

  { alias:"bitrevl",  primary:"bitrev" },
  { alias:"byterevl", primary:"byterev" },
  { alias:"ff1l",     primary:"ff1" },
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

const reg_half_names: string[] = [
  "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7",
  "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7",
  "ps", "pc"
];

function fetch_arg(buffer: Uint8Array, code: string, bits: number): number {
	let val = 0;

	switch (code) {
	case '/': /* MAC/EMAC mask bit.  */
		val = buffer[3] >> 5;
		break;

	case 'G': /* EMAC ACC load.  */
		val = ((buffer[3] >> 3) & 0x2) | ((~buffer[1] >> 7) & 0x1);
		break;

	case 'H': /* EMAC ACC !load.  */
		val = ((buffer[3] >> 3) & 0x2) | ((buffer[1] >> 7) & 0x1);
		break;

	case ']': /* EMAC ACCEXT bit.  */
		val = buffer[0] >> 2;
		break;

	case 'I': /* MAC/EMAC scale factor.  */
		val = buffer[2] >> 1;
		break;

	case 'F': /* EMAC ACCx.  */
		val = buffer[0] >> 1;
		break;

	case 'f':
		val = buffer[1];
		break;

	case 's':
		val = buffer[1];
		break;

	case 'd':			/* Destination, for register or quick.  */
		val = (buffer[0] << 8) + buffer[1];
		val >>= 9;
		break;

	case 'x':			/* Destination, for general arg.  */
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

	/* bits is never too big.  */
	return val & ((1 << bits) - 1);
}

function m68k_valid_ea(code: string, val: number): boolean {
	let mask = 0;

	const M = (n0: number, n1: number, n2: number, n3: number, n4: number, n5: number, n6: number, n70: number, n71: number, n72: number, n73: number, n74: number) => 
		(n0 | n1 << 1 | n2 << 2 | n3 << 3 | n4 << 4 | n5 << 5 | n6 << 6 | n70 << 7 | n71 << 8 | n72 << 9 | n73 << 10 | n74 << 11);

	switch(code) {
	case '*':
		mask = M(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
		break;
	case '~':
		mask = M(0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0);
		break;
	case '%':
		mask = M(1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0);
		break;
	case ';':
		mask = M(1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
		break;
	case '@':
		mask = M(1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0);
		break;
	case '!':
		mask = M(0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0);
		break;
	case '&':
		mask = M(0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0);
		break;
	case '$':
		mask = M(1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0);
		break;
	case '?':
		mask = M(1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0);
		break;
	case '/':
		mask = M(1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0);
		break;
	case '|':
		mask = M(0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0);
		break;
	case '>':
		mask = M(0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0);
		break;
	case '<':
		mask = M(0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
		break;
	case 'm':
		mask = M(1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0);
		break;
	case 'n':
		mask = M(0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0);
		break;
	case 'o':
		mask = M(0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1);
		break;
	case 'p':
		mask = M(1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0);
		break;
	case 'q':
		mask = M(1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0);
		break;
	case 'v':
		mask = M(1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0);
		break;
	case 'b':
		mask = M(1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0);
		break;
	case 'w':
		mask = M(0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0);
		break;
	case 'y':
		mask = M(0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0);
		break;
	case 'z':
		mask = M(0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0);
		break;
	case '4':
		mask = M(0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0);
		break;
	default:
		throw new Error("abort");
	}

	let mode = (val >> 3) & 7;
	if (mode === 7)
		mode += val & 7;
	return (mask & (1 << mode)) !== 0;
}

function print_address(adr: number): string {
	return "$" + adr.toString(16);
}

function print_vma(b: number): string {
	return b.toString(); // needs to be signed
}

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
	let base_disp, outer_disp: number;
	[p, word] = NEXTWORD(buffer, p);

	let buf = `${reg_names[(word >> 12) & 0xf]}.${(word & 0x800) ? 'l' : 'w'}${scales[(word >> 9) & 3]}`;

	/* Handle the 68000 style of indexing.  */
	if((word & 0x100) === 0) {
		base_disp = word & 0xff;
		if ((base_disp & 0x80) !== 0)
			base_disp -= 0x100;
		if (basereg === -1)
			base_disp += addr;
		return ['(' + print_base(basereg, base_disp) + ',' + buf + ')', p];
	}

	/* Handle the generalized kind.  */
	/* First, compute the displacement to add to the base register.  */
	if(word & 0o200) {
		if (basereg === -1)
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

	/* Handle single-level case (not indirect).  */
	if((word & 7) === 0)
		return ['(' + print_base(basereg, base_disp) + ((buf !== '') ? (',' + buf) : '') + ')', p];

	/* Two level.  Compute displacement to add after indirection.  */
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

function print_insn_arg(d: string, buffer: Uint8Array, p0: number, addr: number): { text?: string, len: number } {
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
		console.log("not supported", d[0]);
		return { len: 0 };

	case 'Q':
		val = FETCH_ARG(3);
		/* 0 means 8, except for the bkpt instruction... */
		if(val === 0 && d[1] !== 's')
			val = 8;
		text = `#${val}`;
		break;

	case 'x':
		val = FETCH_ARG(3);
		/* 0 means -1 */
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
			if(val > 63)		/* This is a signed constant.  */
				val -= 128;
			text = `{#${val}}`;
		} else
			return { len: -1 };
		break;

	case '#':
	case '^':
		let p1 = d[0] === '#' ? 2 : 4;
		if (place === 's')
			val = FETCH_ARG(4);
		else if (place === 'C')
			val = FETCH_ARG(7);
		else if (place === '8')
			val = FETCH_ARG(3);
		else if (place === '3')
			val = FETCH_ARG(8);
		else if (place === 'b')
			[p1, val] = NEXTBYTE(buffer, p1);
		else if (place === 'w' || place === 'W')
			[p1, val] = NEXTWORD(buffer, p1);
		else if (place === 'l')
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
		if (place === 'd') {
			val = fetch_arg(buffer, 'x', 6);
			val = ((val & 7) << 3) + ((val >> 3) & 7);
		} else {
			val = fetch_arg(buffer, 's', 6);
		}

		/* If the <ea> is invalid for *d, then reject this match.  */
		if(!m68k_valid_ea(d[0], val))
			return { len: -1 };

		/* Get register number assuming address register.  */
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
		throw new Error("<invalid op_table>");
	}
	return { text, len: p - p0 };
}

function match_insn_m68k(buffer: Uint8Array, memaddr: number, best: m68k_opcode): { text: string, len: number } {
	let text = '';
	let d = 0;
	if(best.args[d] === '.')
		d++;
	let p = 2;
	for(; d < best.args.length; d += 2) {
		if(best.args[d] === '#') {
		  if(best.args[d + 1] === 'l' && p < 6)
			p = 6;
		  else if (p < 4 && best.args[d + 1] !== 'C' && best.args[d + 1] !== '8')
			p = 4;
		}
		if ((best.args[d] === 'L' || best.args[d] === 'l') && best.args[d + 1] === 'w' && p < 4)
			p = 4;
		switch (best.args[d + 1]) {
		case '1':
		case '2':
		case '3':
		case '7':
		case '8':
		case '9':
		case 'i':
			if (p < 4)
				p = 4;
			break;
		case '4':
		case '5':
		case '6':
			if (p < 6)
				p = 6;
			break;
		default:
			break;
		}
	}

	/* pflusha is an exceptions.  It takes no arguments but is two words
	   long.  Recognize it by looking at the lower 16 bits of the mask.  */
	if(p < 4 && (best.match & 0xffff) !== 0)
		p = 4;

	/* lpstop is another exception.  It takes a one word argument but is
	   three words long.  */
	if (p < 6
		&& (best.match & 0xffff) === 0xffff
		&& best.args[0] === '#'
		&& best.args[1] === 'w') {
		/* Copy the one word argument into the usual location for a one
	   word argument, to simplify printing it.  We can get away with
	   this because we know exactly what the second word is, and we
	   aren't going to print anything based on it.  */
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

		if (d < best.args.length && best.args[d - 2] !== 'I' && best.args[d] !== 'k')
			text += ",";
	}

	return { text, len: p };
}

function m68k_scan_mask(buffer: Uint8Array, memaddr: number, arch_mask: number): { text: string, len: number } {
	for(const opc of m68k_opcodes) {
		if (((0xff & buffer[0] & (opc.match >> 24)) === (0xff & (opc.opcode >> 24)))
		 && ((0xff & buffer[1] & (opc.match >> 16)) === (0xff & (opc.opcode >> 16)))
		 && (((0xffff & opc.match) === 0)
			  || (((0xff & buffer[2] & (opc.match >> 8)) === (0xff & (opc.opcode >> 8)))
			   && ((0xff & buffer[3] & opc.match) === (0xff & opc.opcode))))
		 && (opc.arch & arch_mask) !== 0) {
 			 // TODO: args for divul, divsl
			//console.log('match:', opc);
			const val = match_insn_m68k(buffer, memaddr, opc);
			if(val.len)
				return val;
		}
	}
	
	return { text: '', len: 0 };
}

export function print_insn_m68k(buffer: Uint8Array, memaddr: number): { text: string, len: number } {
	const ret = m68k_scan_mask(buffer, memaddr, m68k_mask);
	if(ret.len === 0) {
		return { text: `.short 0x${buffer[0].toString(16).padStart(2, '0')}${buffer[1].toString(16).padStart(2, '0')}`, len: 2 };
	}
	return ret;
}
