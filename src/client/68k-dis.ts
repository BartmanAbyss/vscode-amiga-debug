// ported from binutils-gdb/include/opcode/m68k.h, Copyright (C) 1989-2021 Free Software Foundation, Inc. GPLv3

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
const cpu32	= 0x100;		/* e.g., 68332 */
const fido_a = 0x200;
const m68k_mask = 0x3ff;

const mcfmac    = 0x400	;	/* ColdFire MAC. */
const mcfemac   = 0x800	;	/* ColdFire EMAC. */
const cfloat    = 0x1000;	/* ColdFire FPU.  */
const mcfhwdiv  = 0x2000;	/* ColdFire hardware divide.  */

const mcfisa_a  = 0x4000;	/* ColdFire ISA_A.  */
const mcfisa_aa = 0x8000;	/* ColdFire ISA_A+.  */
const mcfisa_b  = 0x10000;	/* ColdFire ISA_B.  */
const mcfisa_c  = 0x20000;	/* ColdFire ISA_C.  */
const mcfusp    = 0x40000;	/* ColdFire USP instructions.  */
const mcf_mask  = 0x7e400;

/* Handy aliases.  */
const m68040up = (m68040 | m68060);
const m68030up = (m68030 | m68040up);
const m68020up = (m68020 | m68030up);
const m68010up = (m68010 | cpu32 | fido_a | m68020up);
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

	{ name: "addaw", size: 2,	opcode: one(0o0150300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "addal", size: 2,	opcode: one(0o0150700),	match: one(0o0170700), args: "*lAd", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "addib", size: 4,	opcode: one(0o0003000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addiw", size: 4,	opcode: one(0o0003100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addil", size: 6,	opcode: one(0o0003200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addil", size: 6,	opcode: one(0o0003200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a, type: dis.nonbranch },

	{ name: "addqb", size: 2,	opcode: one(0o0050000),	match: one(0o0170700), args: "Qd$b", arch: m68000up, type: dis.nonbranch },
	{ name: "addqw", size: 2,	opcode: one(0o0050100),	match: one(0o0170700), args: "Qd%w", arch: m68000up, type: dis.nonbranch },
	{ name: "addql", size: 2,	opcode: one(0o0050200),	match: one(0o0170700), args: "Qd%l", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	/* The add opcode can generate the adda, addi, and addq instructions.  */
	{ name: "addb", size: 2,	opcode: one(0o0050000),	match: one(0o0170700), args: "Qd$b", arch: m68000up, type: dis.nonbranch },
	{ name: "addb", size: 4,	opcode: one(0o0003000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addb", size: 2,	opcode: one(0o0150000),	match: one(0o0170700), args: ";bDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addb", size: 2,	opcode: one(0o0150400),	match: one(0o0170700), args: "Dd~b", arch: m68000up, type: dis.nonbranch },
	{ name: "addw", size: 2,	opcode: one(0o0050100),	match: one(0o0170700), args: "Qd%w", arch: m68000up, type: dis.nonbranch },
	{ name: "addw", size: 2,	opcode: one(0o0150300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "addw", size: 4,	opcode: one(0o0003100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addw", size: 2,	opcode: one(0o0150100),	match: one(0o0170700), args: "*wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addw", size: 2,	opcode: one(0o0150500),	match: one(0o0170700), args: "Dd~w", arch: m68000up, type: dis.nonbranch },
	{ name: "addl", size: 2,	opcode: one(0o0050200),	match: one(0o0170700), args: "Qd%l", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "addl", size: 6,	opcode: one(0o0003200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "addl", size: 6,	opcode: one(0o0003200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "addl", size: 2,	opcode: one(0o0150700),	match: one(0o0170700), args: "*lAd", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "addl", size: 2,	opcode: one(0o0150200),	match: one(0o0170700), args: "*lDd", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "addl", size: 2,	opcode: one(0o0150600),	match: one(0o0170700), args: "Dd~l", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "addxb", size: 2,	opcode: one(0o0150400),	match: one(0o0170770), args: "DsDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addxb", size: 2,	opcode: one(0o0150410),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },
	{ name: "addxw", size: 2,	opcode: one(0o0150500),	match: one(0o0170770), args: "DsDd", arch: m68000up, type: dis.nonbranch },
	{ name: "addxw", size: 2,	opcode: one(0o0150510),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },
	{ name: "addxl", size: 2,	opcode: one(0o0150600),	match: one(0o0170770), args: "DsDd", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "addxl", size: 2,	opcode: one(0o0150610),	match: one(0o0170770), args: "-s-d", arch: m68000up, type: dis.nonbranch },

	{ name: "andib", size: 4,	opcode: one(0o0001000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andib", size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "andiw", size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andiw", size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },
	{ name: "andil", size: 6,	opcode: one(0o0001200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andil", size: 6,	opcode: one(0o0001200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "andi",  size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andi",  size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "andi",  size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },

	/* The and opcode can generate the andi instruction.  */
	{ name: "andb", size: 4,	opcode: one(0o0001000),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andb", size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "andb", size: 2,	opcode: one(0o0140000),	match: one(0o0170700), args: ";bDd", arch: m68000up, type: dis.nonbranch },
	{ name: "andb", size: 2,	opcode: one(0o0140400),	match: one(0o0170700), args: "Dd~b", arch: m68000up, type: dis.nonbranch },
	{ name: "andw", size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andw", size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },
	{ name: "andw", size: 2,	opcode: one(0o0140100),	match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "andw", size: 2,	opcode: one(0o0140500),	match: one(0o0170700), args: "Dd~w", arch: m68000up, type: dis.nonbranch },
	{ name: "andl", size: 6,	opcode: one(0o0001200),	match: one(0o0177700), args: "#l$s", arch: m68000up, type: dis.nonbranch },
	{ name: "andl", size: 6,	opcode: one(0o0001200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "andl", size: 2,	opcode: one(0o0140200),	match: one(0o0170700), args: ";lDd", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "andl", size: 2,	opcode: one(0o0140600),	match: one(0o0170700), args: "Dd~l", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "and",  size: 4,	opcode: one(0o0001100),	match: one(0o0177700), args: "#w$w", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 4,	opcode: one(0o0001074),	match: one(0o0177777), args: "#bCs", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 4,	opcode: one(0o0001174),	match: one(0o0177777), args: "#wSs", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 2,	opcode: one(0o0140100),	match: one(0o0170700), args: ";wDd", arch: m68000up, type: dis.nonbranch },
	{ name: "and",  size: 2,	opcode: one(0o0140500),	match: one(0o0170700), args: "Dd~w", arch: m68000up, type: dis.nonbranch },

	{ name: "aslb", size: 2,	opcode: one(0o0160400),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "aslb", size: 2,	opcode: one(0o0160440),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "aslw", size: 2,	opcode: one(0o0160500),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "aslw", size: 2,	opcode: one(0o0160540),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "aslw", size: 2,	opcode: one(0o0160700),	match: one(0o0177700), args: "~s",   arch: m68000up, type: dis.nonbranch },
	{ name: "asll", size: 2,	opcode: one(0o0160600),	match: one(0o0170770), args: "QdDs", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "asll", size: 2,	opcode: one(0o0160640),	match: one(0o0170770), args: "DdDs", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "asrb", size: 2,	opcode: one(0o0160000),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asrb", size: 2,	opcode: one(0o0160040),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asrw", size: 2,	opcode: one(0o0160100),	match: one(0o0170770), args: "QdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asrw", size: 2,	opcode: one(0o0160140),	match: one(0o0170770), args: "DdDs", arch: m68000up, type: dis.nonbranch },
	{ name: "asrw", size: 2,	opcode: one(0o0160300),	match: one(0o0177700), args: "~s",   arch: m68000up, type: dis.nonbranch },
	{ name: "asrl", size: 2,	opcode: one(0o0160200),	match: one(0o0170770), args: "QdDs", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "asrl", size: 2,	opcode: one(0o0160240),	match: one(0o0170770), args: "DdDs", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "bhiw", size: 2,	opcode: one(0o0061000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "blsw", size: 2,	opcode: one(0o0061400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bccw", size: 2,	opcode: one(0o0062000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bcsw", size: 2,	opcode: one(0o0062400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bnew", size: 2,	opcode: one(0o0063000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "beqw", size: 2,	opcode: one(0o0063400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bvcw", size: 2,	opcode: one(0o0064000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bvsw", size: 2,	opcode: one(0o0064400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bplw", size: 2,	opcode: one(0o0065000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bmiw", size: 2,	opcode: one(0o0065400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bgew", size: 2,	opcode: one(0o0066000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bltw", size: 2,	opcode: one(0o0066400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bgtw", size: 2,	opcode: one(0o0067000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "blew", size: 2,	opcode: one(0o0067400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.condbranch },

	{ name: "bhil", size: 2,	opcode: one(0o0061377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "blsl", size: 2,	opcode: one(0o0061777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bccl", size: 2,	opcode: one(0o0062377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bcsl", size: 2,	opcode: one(0o0062777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bnel", size: 2,	opcode: one(0o0063377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "beql", size: 2,	opcode: one(0o0063777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bvcl", size: 2,	opcode: one(0o0064377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bvsl", size: 2,	opcode: one(0o0064777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bpll", size: 2,	opcode: one(0o0065377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bmil", size: 2,	opcode: one(0o0065777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bgel", size: 2,	opcode: one(0o0066377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bltl", size: 2,	opcode: one(0o0066777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "bgtl", size: 2,	opcode: one(0o0067377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },
	{ name: "blel", size: 2,	opcode: one(0o0067777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.condbranch },

	{ name: "bhis", size: 2,	opcode: one(0o0061000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "blss", size: 2,	opcode: one(0o0061400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bccs", size: 2,	opcode: one(0o0062000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bcss", size: 2,	opcode: one(0o0062400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bnes", size: 2,	opcode: one(0o0063000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "beqs", size: 2,	opcode: one(0o0063400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bvcs", size: 2,	opcode: one(0o0064000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bvss", size: 2,	opcode: one(0o0064400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bpls", size: 2,	opcode: one(0o0065000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bmis", size: 2,	opcode: one(0o0065400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bges", size: 2,	opcode: one(0o0066000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "blts", size: 2,	opcode: one(0o0066400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bgts", size: 2,	opcode: one(0o0067000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "bles", size: 2,	opcode: one(0o0067400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.condbranch },

	{ name: "jhi", size: 2,	opcode: one(0o0061000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jls", size: 2,	opcode: one(0o0061400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jcc", size: 2,	opcode: one(0o0062000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jcs", size: 2,	opcode: one(0o0062400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jne", size: 2,	opcode: one(0o0063000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jeq", size: 2,	opcode: one(0o0063400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jvc", size: 2,	opcode: one(0o0064000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jvs", size: 2,	opcode: one(0o0064400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jpl", size: 2,	opcode: one(0o0065000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jmi", size: 2,	opcode: one(0o0065400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jge", size: 2,	opcode: one(0o0066000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jlt", size: 2,	opcode: one(0o0066400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jgt", size: 2,	opcode: one(0o0067000),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },
	{ name: "jle", size: 2,	opcode: one(0o0067400),	match: one(0o0177400), args: "Bg", arch: m68000up | mcfisa_a, type: dis.condbranch },

	{ name: "bchg", size: 2,	opcode: one(0o0000500),	match: one(0o0170700), args: "Dd$s", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "bchg", size: 4,	opcode: one(0o0004100),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "bchg", size: 4,	opcode: one(0o0004100),	match: one(0o0177700), args: "#bqs", arch: mcfisa_a, type: dis.nonbranch },

	{ name: "bclr", size: 2,	opcode: one(0o0000600),	match: one(0o0170700), args: "Dd$s", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "bclr", size: 4,	opcode: one(0o0004200),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "bclr", size: 4,	opcode: one(0o0004200),	match: one(0o0177700), args: "#bqs", arch: mcfisa_a, type: dis.nonbranch },

	{ name: "bfchg",  size: 4,	opcode: two(0o0165300, 0), match: two(0o0177700, 0o0170000),	args: "?sO2O3",   arch: m68020up, type: dis.nonbranch },
	{ name: "bfclr",  size: 4,	opcode: two(0o0166300, 0), match: two(0o0177700, 0o0170000),	args: "?sO2O3",   arch: m68020up, type: dis.nonbranch },
	{ name: "bfexts", size: 4,	opcode: two(0o0165700, 0), match: two(0o0177700, 0o0100000),	args: "/sO2O3D1", arch: m68020up, type: dis.nonbranch },
	{ name: "bfextu", size: 4,	opcode: two(0o0164700, 0), match: two(0o0177700, 0o0100000),	args: "/sO2O3D1", arch: m68020up, type: dis.nonbranch },
	{ name: "bfffo",  size: 4,	opcode: two(0o0166700, 0), match: two(0o0177700, 0o0100000),	args: "/sO2O3D1", arch: m68020up, type: dis.nonbranch },
	{ name: "bfins",  size: 4,	opcode: two(0o0167700, 0), match: two(0o0177700, 0o0100000),	args: "D1?sO2O3", arch: m68020up, type: dis.nonbranch },
	{ name: "bfset",  size: 4,	opcode: two(0o0167300, 0), match: two(0o0177700, 0o0170000),	args: "?sO2O3",   arch: m68020up, type: dis.nonbranch },
	{ name: "bftst",  size: 4,	opcode: two(0o0164300, 0), match: two(0o0177700, 0o0170000),	args: "/sO2O3",   arch: m68020up, type: dis.nonbranch },

	{ name: "bgnd", size: 2,	opcode: one(0o0045372),	match: one(0o0177777), args: "", arch: cpu32 | fido_a, type: dis.nonbranch },

	{ name: "bitrev", size: 2,	opcode: one(0o0000300),	match: one(0o0177770), args: "Ds", arch: mcfisa_aa | mcfisa_c, type: dis.nonbranch },

	{ name: "bkpt", size: 2,	opcode: one(0o0044110),	match: one(0o0177770), args: "ts", arch: m68010up, type: dis.nonbranch },

	{ name: "braw", size: 2,	opcode: one(0o0060000),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.branch },
	{ name: "bral", size: 2,	opcode: one(0o0060377),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b, type: dis.branch },
	{ name: "bras", size: 2,	opcode: one(0o0060000),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.branch },

	{ name: "bset", size: 2,	opcode: one(0o0000700),	match: one(0o0170700), args: "Dd$s", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "bset", size: 2,	opcode: one(0o0000700),	match: one(0o0170700), args: "Ddvs", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "bset", size: 4,	opcode: one(0o0004300),	match: one(0o0177700), args: "#b$s", arch: m68000up, type: dis.nonbranch },
	{ name: "bset", size: 4,	opcode: one(0o0004300),	match: one(0o0177700), args: "#bqs", arch: mcfisa_a, type: dis.nonbranch },

	{ name: "bsrw", size: 2,	opcode: one(0o0060400),	match: one(0o0177777), args: "BW", arch: m68000up | mcfisa_a, type: dis.jsr },
	{ name: "bsrl", size: 2,	opcode: one(0o0060777),	match: one(0o0177777), args: "BL", arch: m68020up | cpu32 | fido_a | mcfisa_b | mcfisa_c, type: dis.jsr },
	{ name: "bsrs", size: 2,	opcode: one(0o0060400),	match: one(0o0177400), args: "BB", arch: m68000up | mcfisa_a, type: dis.jsr },

	{ name: "btst", size: 2,	opcode: one(0o0000400),	match: one(0o0170700), args: "Dd;b", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "btst", size: 4,	opcode: one(0o0004000),	match: one(0o0177700), args: "#b@s", arch: m68000up, type: dis.nonbranch },
	{ name: "btst", size: 4,	opcode: one(0o0004000),	match: one(0o0177700), args: "#bqs", arch: mcfisa_a, type: dis.nonbranch },

	{ name: "byterev", size: 2,	opcode: one(0o0001300),	match: one(0o0177770), args: "Ds", arch: mcfisa_aa | mcfisa_c, type: dis.nonbranch},

	{ name: "callm", size: 4,	opcode: one(0o0003300),	match: one(0o0177700), args: "#b!s", arch: m68020, type: dis.nonbranch },

	{ name: "cas2w", size: 6,   opcode:  two(0o0006374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5r1r4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2w", size: 6,   opcode:  two(0o0006374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5R1R4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2l", size: 6,   opcode:  two(0o0007374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5r1r4", arch: m68020up, type: dis.nonbranch },
	{ name: "cas2l", size: 6,   opcode:  two(0o0007374,0), match: two(0o0177777,0o0007070), args: "D3D6D2D5R1R4", arch: m68020up, type: dis.nonbranch },

	{ name: "casb", size: 4,	opcode: two(0o0005300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },
	{ name: "casw", size: 4,	opcode: two(0o0006300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },
	{ name: "casl", size: 4,	opcode: two(0o0007300, 0), match: two(0o0177700, 0o0177070),	args: "D3D2~s", arch: m68020up, type: dis.nonbranch },

	{ name: "chk2b", size: 4, 	opcode: two(0o0000300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "chk2w", size: 4, 	opcode: two(0o0001300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "chk2l", size: 4, 	opcode: two(0o0002300,0o0004000), match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },

	{ name: "chkl", size: 2,	opcode: one(0o0040400),		match: one(0o0170700), args: ";lDd", arch: m68020up, type: dis.nonbranch },
	{ name: "chkw", size: 2,	opcode: one(0o0040600),		match: one(0o0170700), args: ";wDd", arch: m68020up, type: dis.nonbranch },

	{ name: "cinva", size: 2,	opcode: one(0xf400|SCOPE_ALL),  match: one(0xff38), args: "ce",   arch: m68040up, type: dis.nonbranch },
	{ name: "cinvl", size: 2,	opcode: one(0xf400|SCOPE_LINE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },
	{ name: "cinvp", size: 2,	opcode: one(0xf400|SCOPE_PAGE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },

	{ name: "cpusha", size: 2,	opcode: one(0xf420|SCOPE_ALL),  match: one(0xff38), args: "ce",   arch: m68040up, type: dis.nonbranch },
	{ name: "cpushl", size: 2,	opcode: one(0xf420|SCOPE_LINE), match: one(0xff38), args: "ceas", arch: m68040up | mcfisa_a, type: dis.nonbranch },
	{ name: "cpushp", size: 2,	opcode: one(0xf420|SCOPE_PAGE), match: one(0xff38), args: "ceas", arch: m68040up, type: dis.nonbranch },

	{ name: "clrb", size: 2,	opcode: one(0o0041000),	match: one(0o0177700), args: "$s", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "clrw", size: 2,	opcode: one(0o0041100),	match: one(0o0177700), args: "$s", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "clrl", size: 2,	opcode: one(0o0041200),	match: one(0o0177700), args: "$s", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "cmp2b", size: 4,	opcode: two(0o0000300,0),   match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmp2w", size: 4,	opcode: two(0o0001300,0),	match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmp2l", size: 4,	opcode: two(0o0002300,0),	match: two(0o0177700,0o07777), args: "!sR1", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },

	{ name: "cmpaw", size: 2,	opcode: one(0o0130300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpal", size: 2,	opcode: one(0o0130700),	match: one(0o0170700), args: "*lAd", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "cmpib", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpib", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b@s", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmpib", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#bDs", arch: mcfisa_b | mcfisa_c, type: dis.nonbranch },
	{ name: "cmpiw", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpiw", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w@s", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmpiw", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#wDs", arch: mcfisa_b | mcfisa_c, type: dis.nonbranch },
	{ name: "cmpil", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpil", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l@s", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmpil", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a, type: dis.nonbranch },

	{ name: "cmpmb", size: 2,	opcode: one(0o0130410),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpmw", size: 2,	opcode: one(0o0130510),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpml", size: 2,	opcode: one(0o0130610),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },

	/* The cmp opcode can generate the cmpa, cmpm, and cmpi instructions.  */
	{ name: "cmpb", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpb", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#b@s", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmpb", size: 4,	opcode: one(0o0006000),	match: one(0o0177700), args: "#bDs", arch: mcfisa_b | mcfisa_c, type: dis.nonbranch },
	{ name: "cmpb", size: 2,	opcode: one(0o0130410),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpb", size: 2,	opcode: one(0o0130000),	match: one(0o0170700), args: ";bDd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpb", size: 2,	opcode: one(0o0130000),	match: one(0o0170700), args: "*bDd", arch: mcfisa_b | mcfisa_c, type: dis.nonbranch },
	{ name: "cmpw", size: 2,	opcode: one(0o0130300),	match: one(0o0170700), args: "*wAd", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpw", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w$s", arch: m68000 | m68010 , type: dis.nonbranch},
	{ name: "cmpw", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#w@s", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmpw", size: 4,	opcode: one(0o0006100),	match: one(0o0177700), args: "#wDs", arch: mcfisa_b | mcfisa_c, type: dis.nonbranch },
	{ name: "cmpw", size: 2,	opcode: one(0o0130510),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpw", size: 2,	opcode: one(0o0130100),	match: one(0o0170700), args: "*wDd", arch: m68000up | mcfisa_b | mcfisa_c, type: dis.nonbranch },
	{ name: "cmpl", size: 2,	opcode: one(0o0130700),	match: one(0o0170700), args: "*lAd", arch: m68000up | mcfisa_a, type: dis.nonbranch },
	{ name: "cmpl", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l$s", arch: m68000 | m68010, type: dis.nonbranch },
	{ name: "cmpl", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#l@s", arch: m68020up | cpu32 | fido_a, type: dis.nonbranch },
	{ name: "cmpl", size: 6,	opcode: one(0o0006200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cmpl", size: 2,	opcode: one(0o0130610),	match: one(0o0170770), args: "+s+d", arch: m68000up, type: dis.nonbranch },
	{ name: "cmpl", size: 2,	opcode: one(0o0130200),	match: one(0o0170700), args: "*lDd", arch: m68000up | mcfisa_a, type: dis.nonbranch },

	{ name: "cp0bcbusy",size: 2,opcode:  one (0o176300), match: one (0o01777770), args: "BW", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1bcbusy",size: 2,opcode:  one (0o177300), match: one (0o01777770), args: "BW", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0nop",   size: 4,opcode:  two (0o176000,0), match: two (0o01777477,0o0170777), args: "jE", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1nop",   size: 4,opcode:  two (0o177000,0), match: two (0o01777477,0o0170777), args: "jE", arch: mcfisa_a, type: dis.nonbranch },
	/* These all have 2 opcode words, but no fixed bits in the second
	word.  We use a leading ' ' in the args string to indicate the
	extra opcode word.  */
	{ name: "cp0ldb",   size: 6, opcode: one (0o0176000), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1ldb",   size: 6, opcode: one (0o0177000), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0ldw",   size: 6, opcode: one (0o0176100), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1ldw",   size: 6, opcode: one (0o0177100), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0ldl",   size: 6, opcode: one (0o0176200), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1ldl",   size: 6, opcode: one (0o0177200), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0ld",    size: 6, opcode: one (0o0176200), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1ld",    size: 6, opcode: one (0o0177200), match: one (0o01777700), args: ".pwR1jEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0stb",   size: 6, opcode: one (0o0176400), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1stb",   size: 6, opcode: one (0o0177400), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0stw",   size: 6, opcode: one (0o0176500), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1stw",   size: 6, opcode: one (0o0177500), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0stl",   size: 6, opcode: one (0o0176600), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1stl",   size: 6, opcode: one (0o0177600), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp0st",    size: 6, opcode: one (0o0176600), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },
	{ name: "cp1st",    size: 6, opcode: one (0o0177600), match: one (0o01777700), args: ".R1pwjEK3", arch: mcfisa_a, type: dis.nonbranch },

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

	{ name: "divsw", size: 2,	opcode: one(0o0100700),	match: one(0o0170700), args: ";wDd", arch: m68000up | mcfhwdiv , type: dis.nonbranch },

	{ name: "divsl", size: 4, 	opcode: two(0o0046100,0o0006000),match: two(0o0177700,0o0107770), args: ";lD3D1", arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },
	{ name: "divsl", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lDD",   arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },
	{ name: "divsl", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: "qsDD",   arch: mcfhwdiv , type: dis.nonbranch },

	{ name: "divsll", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lD3D1",arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },
	{ name: "divsll", size: 4, 	opcode: two(0o0046100,0o0004000),match: two(0o0177700,0o0107770), args: ";lDD",  arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },

	{ name: "divuw", size: 2,	opcode: one(0o0100300),		match: one(0o0170700), args: ";wDd", arch: m68000up | mcfhwdiv , type: dis.nonbranch },

	{ name: "divul", size: 4,	opcode: two(0o0046100,0o0002000),match: two(0o0177700,0o0107770), args:";lD3D1", arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },
	{ name: "divul", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lDD",   arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },
	{ name: "divul", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:"qsDD",   arch: mcfhwdiv , type: dis.nonbranch },
	
	{ name: "divull", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lD3D1",arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },
	{ name: "divull", size: 4,	opcode: two(0o0046100,0o0000000),match: two(0o0177700,0o0107770), args:";lDD",  arch: m68020up | cpu32 | fido_a , type: dis.nonbranch },

	{ name: "eorib", size: 4,	opcode: one(0o0005000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eorib", size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eoriw", size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eoriw", size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eoril", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eoril", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eori",  size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },

	/* The eor opcode can generate the eori instruction.  */
	{ name: "eorb", size: 4,	opcode: one(0o0005000),	match: one(0o0177700), args: "#b$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eorb", size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eorb", size: 2,	opcode: one(0o0130400),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eorw", size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eorw", size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eorw", size: 2,	opcode: one(0o0130500),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eorl", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#l$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eorl", size: 6,	opcode: one(0o0005200),	match: one(0o0177700), args: "#lDs", arch: mcfisa_a , type: dis.nonbranch },
	{ name: "eorl", size: 2,	opcode: one(0o0130600),	match: one(0o0170700), args: "Dd$s", arch: m68000up | mcfisa_a , type: dis.nonbranch },
	{ name: "eor",  size: 4,	opcode: one(0o0005074),	match: one(0o0177777), args: "#bCs", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 4,	opcode: one(0o0005174),	match: one(0o0177777), args: "#wSs", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 4,	opcode: one(0o0005100),	match: one(0o0177700), args: "#w$s", arch: m68000up , type: dis.nonbranch },
	{ name: "eor",  size: 2,	opcode: one(0o0130500),	match: one(0o0170700), args: "Dd$s", arch: m68000up , type: dis.nonbranch },

	{ name: "exg", size: 2,	    opcode: one(0o0140500),	match: one(0o0170770), args: "DdDs", arch: m68000up , type: dis.nonbranch },
	{ name: "exg", size: 2,	    opcode: one(0o0140510),	match: one(0o0170770), args: "AdAs", arch: m68000up , type: dis.nonbranch },
	{ name: "exg", size: 2,	    opcode: one(0o0140610),	match: one(0o0170770), args: "DdAs", arch: m68000up , type: dis.nonbranch },
	{ name: "exg", size: 2,	    opcode: one(0o0140610),	match: one(0o0170770), args: "AsDd", arch: m68000up , type: dis.nonbranch },

	{ name: "extw",  size: 2,	opcode: one(0o0044200),	match: one(0o0177770), args: "Ds", arch: m68000up|mcfisa_a , type: dis.nonbranch },
	{ name: "extl",  size: 2,	opcode: one(0o0044300),	match: one(0o0177770), args: "Ds", arch: m68000up|mcfisa_a , type: dis.nonbranch },
	{ name: "extbl", size: 2,	opcode: one(0o0044700),	match: one(0o0177770), args: "Ds", arch: m68020up | cpu32 | fido_a | mcfisa_a , type: dis.nonbranch },

	{ name: "ff1", size: 2,   	opcode: one(0o0002300), match: one(0o0177770), args: "Ds", arch: mcfisa_aa | mcfisa_c, type: dis.nonbranch },

	// TODO: rest
];

const m68k_opcode_aliases: m68k_opcode_alias[] = [
  { alias:"add",	primary:"addw" },
  { alias:"adda",	primary:"addaw" },
  { alias:"addi",	primary:"addiw" },
  { alias:"addq",	primary:"addqw" },
  { alias:"addx",	primary:"addxw" },
  { alias:"asl",	primary:"aslw" },
  { alias:"asr",	primary:"asrw" },
  { alias:"bhi",	primary:"bhiw" },
  { alias:"bls",	primary:"blsw" },
  { alias:"bcc",	primary:"bccw" },
  { alias:"bcs",	primary:"bcsw" },
  { alias:"bne",	primary:"bnew" },
  { alias:"beq",	primary:"beqw" },
  { alias:"bvc",	primary:"bvcw" },
  { alias:"bvs",	primary:"bvsw" },
  { alias:"bpl",	primary:"bplw" },
  { alias:"bmi",	primary:"bmiw" },
  { alias:"bge",	primary:"bgew" },
  { alias:"blt",	primary:"bltw" },
  { alias:"bgt",	primary:"bgtw" },
  { alias:"ble",	primary:"blew" },
  { alias:"bra",	primary:"braw" },
  { alias:"bsr",	primary:"bsrw" },
  { alias:"bhib",	primary:"bhis" },
  { alias:"blsb",	primary:"blss" },
  { alias:"bccb",	primary:"bccs" },
  { alias:"bcsb",	primary:"bcss" },
  { alias:"bneb",	primary:"bnes" },
  { alias:"beqb",	primary:"beqs" },
  { alias:"bvcb",	primary:"bvcs" },
  { alias:"bvsb",	primary:"bvss" },
  { alias:"bplb",	primary:"bpls" },
  { alias:"bmib",	primary:"bmis" },
  { alias:"bgeb",	primary:"bges" },
  { alias:"bltb",	primary:"blts" },
  { alias:"bgtb",	primary:"bgts" },
  { alias:"bleb",	primary:"bles" },
  { alias:"brab",	primary:"bras" },
  { alias:"bsrb",	primary:"bsrs" },
  { alias:"bhs",	primary:"bccw" },
  { alias:"bhss",	primary:"bccs" },
  { alias:"bhsb",	primary:"bccs" },
  { alias:"bhsw",	primary:"bccw" },
  { alias:"bhsl",	primary:"bccl" },
  { alias:"blo",	primary:"bcsw" },
  { alias:"blos",	primary:"bcss" },
  { alias:"blob",	primary:"bcss" },
  { alias:"blow",	primary:"bcsw" },
  { alias:"blol",	primary:"bcsl" },
  { alias:"br",	primary:"braw" },
  { alias:"brs",	primary:"bras" },
  { alias:"brb",	primary:"bras" },
  { alias:"brw",	primary:"braw" },
  { alias:"brl",	primary:"bral" },
  { alias:"jfnlt",	primary:"bcc" },	/* Apparently a sun alias.  */
  { alias:"jfngt",	primary:"ble" },	/* Apparently a sun alias.  */
  { alias:"jfeq",	primary:"beqs" },	/* Apparently a sun alias.  */
  { alias:"bchgb",	primary:"bchg" },
  { alias:"bchgl",	primary:"bchg" },
  { alias:"bclrb",	primary:"bclr" },
  { alias:"bclrl",	primary:"bclr" },
  { alias:"bsetb",	primary:"bset" },
  { alias:"bsetl",	primary:"bset" },
  { alias:"btstb",	primary:"btst" },
  { alias:"btstl",	primary:"btst" },
  { alias:"cas2",	primary:"cas2w" },
  { alias:"cas",	primary:"casw" },
  { alias:"chk2",	primary:"chk2w" },
  { alias:"chk",	primary:"chkw" },
  { alias:"clr",	primary:"clrw" },
  { alias:"cmp2",	primary:"cmp2w" },
  { alias:"cmpa",	primary:"cmpaw" },
  { alias:"cmpi",	primary:"cmpiw" },
  { alias:"cmpm",	primary:"cmpmw" },
  { alias:"cmp",	primary:"cmpw" },
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
  { alias:"tdivsl",	primary:"divsll" },
  { alias:"divs",	primary:"divsw" },
  { alias:"divu",	primary:"divuw" },
  { alias:"ext",	primary:"extw" },
  { alias:"extbw",	primary:"extw" },
  { alias:"extwl",	primary:"extl" },
  { alias:"fbneq",	primary:"fbne" },
  { alias:"fbsneq",	primary:"fbsne" },
  { alias:"fdbneq",	primary:"fdbne" },
  { alias:"fdbsneq",	primary:"fdbsne" },
  { alias:"fmovecr",	primary:"fmovecrx" },
  { alias:"fmovm",	primary:"fmovem" },
  { alias:"fsneq",	primary:"fsne" },
  { alias:"fssneq",	primary:"fssne" },
  { alias:"ftrapneq",	primary:"ftrapne" },
  { alias:"ftrapsneq", primary:"ftrapsne" },
  { alias:"fjneq",	primary:"fjne" },
  { alias:"fjsneq",	primary:"fjsne" },
  { alias:"jmpl",	primary:"jmp" },
  { alias:"jmps",	primary:"jmp" },
  { alias:"jsrl",	primary:"jsr" },
  { alias:"jsrs",	primary:"jsr" },
  { alias:"leal",	primary:"lea" },
  { alias:"lsl",	primary:"lslw" },
  { alias:"lsr",	primary:"lsrw" },
  { alias:"mac",	primary:"macw" },
  { alias:"movea",	primary:"moveaw" },
  { alias:"movem",	primary:"movemw" },
  { alias:"movml",	primary:"moveml" },
  { alias:"movmw",	primary:"movemw" },
  { alias:"movm",	primary:"movemw" },
  { alias:"movep",	primary:"movepw" },
  { alias:"movpw",	primary:"movepw" },
  { alias:"moves",	primary:"movesw" },
  { alias:"muls",	primary:"mulsw" },
  { alias:"mulu",	primary:"muluw" },
  { alias:"msac",	primary:"msacw" },
  { alias:"nbcdb",	primary:"nbcd" },
  { alias:"neg",	primary:"negw" },
  { alias:"negx",	primary:"negxw" },
  { alias:"not",	primary:"notw" },
  { alias:"peal",	primary:"pea" },
  { alias:"rol",	primary:"rolw" },
  { alias:"ror",	primary:"rorw" },
  { alias:"roxl",	primary:"roxlw" },
  { alias:"roxr",	primary:"roxrw" },
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
  { alias:"suba",	primary:"subaw" },
  { alias:"subi",	primary:"subiw" },
  { alias:"subq",	primary:"subqw" },
  { alias:"sub",	primary:"subw" },
  { alias:"subx",	primary:"subxw" },
  { alias:"swapw",	primary:"swap" },
  { alias:"tasb",	primary:"tas" },
  { alias:"tpcc",	primary:"trapcc" },
  { alias:"tcc",	primary:"trapcc" },
  { alias:"tst",	primary:"tstw" },
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
  { alias:"moval",	primary:"moveal" },
  { alias:"movaw",	primary:"moveaw" },
  { alias:"movb",	primary:"moveb" },
  { alias:"movc",	primary:"movec" },
  { alias:"movecl",	primary:"movec" },
  { alias:"movpl",	primary:"movepl" },
  { alias:"movw",	primary:"movew" },
  { alias:"movsb",	primary:"movesb" },
  { alias:"movsl",	primary:"movesl" },
  { alias:"movsw",	primary:"movesw" },
  { alias:"mov3q",	primary:"mov3ql" },

  { alias:"tdivul",	primary:"divull" },	/* For m68k-svr4.  */
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
  { alias:"fmovcrx",	primary:"fmovecrx" },
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

const fpcr_names : string[] = [
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

// TODO: memaddr
function print_insn_arg(d: string, buffer: Uint8Array, p0: number) : { text: string, len: number } {
	let val = 0;
	let text = '';
	const place = d[1];
	let p = p0;
	switch(d[0]) {
	// TODO: rest
	case '#':
	case '^':
		let p1 = d[0] === '#' ? 2 : 4;
		if (place === 's')
			val = fetch_arg(buffer.slice(p), place, 4);
		else if (place === 'C')
			val = fetch_arg(buffer.slice(p), place, 7);
		else if (place === '8')
			val = fetch_arg(buffer.slice(p), place, 3);
		else if (place === '3')
			val = fetch_arg(buffer.slice(p), place, 8);
		else if (place === 'b')
			p1 += 2, val = buffer[p1 - 1];
		else if (place === 'w' || place === 'W')
			p1 += 2, val = (buffer[p1 - 2] << 8) + buffer[p1 - 1];
		else if (place === 'l')
			p1 += 4, val = (((buffer[p1 - 4] << 8) + buffer[p1 - 3] << 8) + buffer[p1 - 2] << 8) + buffer[p1 - 1];
		else
			throw new Error("<internal error>");
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
		//if (!m68k_valid_ea(*d, val))
		//	return PRINT_INSN_ARG_INVALID_OPERAND;

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
	default: 
		console.log("not supported", d[0]);
		return { text: '', len: 0 };
	}
	return { text, len: p - p0 };
}

function match_insn_m68k(buffer: Uint8Array, best: m68k_opcode) : { text: string, len: number } {
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
		p += arg_val.len;
		text += arg_val.text;
		d += 2;

		if (d < best.args.length && best.args[d - 2] !== 'I' && best.args[d] !== 'k')
			text += ",";
	}

	return { text, len: p };
}

function m68k_scan_mask(buffer: Uint8Array, arch_mask: number) : { text: string, len: number } {
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
	const { text, len } = m68k_scan_mask(buffer, m68k_mask);
	if(len === 0) {
		return { text: `.short 0x${buffer[0].toString(16).padStart(2, '0')}${buffer[1].toString(16).padStart(2, '0')}`, len };
	}
	return { text: '', len: 2 };
}
