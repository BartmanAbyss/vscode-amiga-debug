// ported from binutils-gdb/include/opcode/m68k.h, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3

// tslint:disable: variable-name class-name

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

// TODO: memaddr
function print_insn_arg(d: string, buffer: Uint8Array, p0: number): { text?: string, len: number } {
	let val = 0;
	let text = '';
	const place = d[1];
	let p = p0;

	const COERCE8 = (x: number) => ((x ^ 0x80) & 0xff) - 128;
	const COERCE16 = (x: number) => (x ^ 0x8000) - 0x8000;
	const COERCE32 = (x: number) => (x ^ 0x80000000) - 0x80000000;
	const FETCH_ARG = (bits: number) => fetch_arg(buffer, place, bits);
	const NEXTBYTE = (p: number) => { p += 2; return [p, COERCE8(buffer[p - 1])]; }
	const NEXTWORD = (p: number) => { p += 2; return [p, COERCE16((buffer[p - 2] << 8) + buffer[p - 1])]; }
	const NEXTLONG = (p: number) => { p += 4; return [p, COERCE32((((buffer[p - 4] << 8) + buffer[p - 3] << 8) + buffer[p - 2] << 8) + buffer[p - 1])]; }

	switch(d[0]) {
	// TODO: rest
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
			[p1, val] = NEXTBYTE(p1);
		else if (place === 'w' || place === 'W')
			[p1, val] = NEXTWORD(p1);
		else if (place === 'l')
			[p1, val] = NEXTLONG(p1);
		else
			throw new Error("<invalid op_table>");
		text = `#${val}`;
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
		const regno = (val & 7) + 8;
		const regname = reg_names[regno];
		switch (val >> 3) {
		case 0:
			text += reg_names[val];
			break;

		case 1:
			text += regname;
			break;

		// TODO
		}
		break;

	case 'D':
		val = fetch_arg(buffer, place, 3);
		text += reg_names[val];
		break;

	case 'A':
		val = fetch_arg(buffer, place, 3);
		text += reg_names[val + 0o010];
		break;
	  
	default: 
		console.log("not supported", d[0]);
		return { len: 0 };
	}
	return { text, len: p - p0 };
}

function match_insn_m68k(buffer: Uint8Array, best: m68k_opcode): { text: string, len: number } {
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

	// TODO: pflusha, lpstop

	d = 0;

	// TODO: add a . into movel and simila names.

	text += best.name;

	if(best.args.length > 0)
		text += ' ';

	while(d < best.args.length) {
		const arg_val = print_insn_arg(best.args.slice(d, d + 2), buffer, p);
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

function m68k_scan_mask(buffer: Uint8Array, arch_mask: number): { text: string, len: number } {
	for(const opc of m68k_opcodes) {
		if (((0xff & buffer[0] & (opc.match >> 24)) === (0xff & (opc.opcode >> 24)))
		 && ((0xff & buffer[1] & (opc.match >> 16)) === (0xff & (opc.opcode >> 16)))
		 && (((0xffff & opc.match) === 0)
			  || (((0xff & buffer[2] & (opc.match >> 8)) === (0xff & (opc.opcode >> 8)))
			   && ((0xff & buffer[3] & opc.match) === (0xff & opc.opcode))))
		 && (opc.arch & arch_mask) !== 0) {
			 // TODO: args!
			console.log('match:', opc);
			const val = match_insn_m68k(buffer, opc);
			if(val.len)
				return val;
		}
	}
	
	return { text: '', len: 0 };
}

export function print_insn_m68k(buffer: Uint8Array): { text: string, len: number } {
	const ret = m68k_scan_mask(buffer, m68k_mask);
	if(ret.len === 0) {
		return { text: `.short 0x${buffer[0].toString(16).padStart(2, '0')}${buffer[1].toString(16).padStart(2, '0')}`, len: 2 };
	}
	return ret;
}
