import * as assert from 'assert';
import { GetCycles, GetJump, JumpType } from "../../client/68k";

import { print_insn_m68k } from '../../client/68k-dis';

suite("68k-cycles", () => {
	test("move1", () => {
		const insn = new Uint16Array([0x205a]); // movea.l (a2)+,a0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 12, read: 3, write: 0 } ]);
	});
	test("move2", () => {
		const insn = new Uint16Array([0x23c0, 0x0001, 0x1c8e]); // move.l d0,$11c8e
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 20, read: 3, write: 2 } ]);
	});
	test("movem1", () => {
		const insn = new Uint16Array([0x48e7, 0x3020]); // movem.l d2-d3/a2,-(sp)
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 32, read: 2, write: 6 } ]);
	});
	test("movem2", () => {
		const insn = new Uint16Array([0x4cdf, 0x040c]); // movem.l (sp)+,d2-d3/a2
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 36, read: 9, write: 0 } ]);
	});
	test("addi", () => {
		const insn = new Uint16Array([0x0680, 0x0000, 0x00c0]); // addi.l #192,d0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 16, read: 3, write: 0 } ]);
	});
	test("subi", () => {
		const insn = new Uint16Array([0x0483, 0x0000, 0x4000]); // subi.l #16384,d3
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 16, read: 3, write: 0 } ]);
	});
	test("suba", () => {
		const insn = new Uint16Array([0x93c9]); // suba.l a1,a1
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 8, read: 1, write: 0 } ]);
	});
	test("addq", () => {
		const insn = new Uint16Array([0x5282]); // addq.l #1,d2
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 8, read: 1, write: 0 } ]);
	});
	test("clr", () => {
		const insn = new Uint16Array([0x42b9, 0x0000, 0xa3b0]); // clr.l $a3b0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 28, read: 5, write: 2 } ]); // 12(1/2)+16(4/0)
	});
	test("exg", () => {
		const insn = new Uint16Array([0xcf8d]); // exg d7,a5
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 6, read: 1, write: 0 } ]);
	});
	test("or", () => {
		const insn = new Uint16Array([0x806a, 0x0008]); // or.w 8(a2),d0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 12, read: 3, write: 0 } ]);
	});
	test("eor", () => {
		const insn = new Uint16Array([0xb740]); // eor.w d3,d0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 4, read: 1, write: 0 } ]);
	});
	test("muls", () => {
		const insn = new Uint16Array([0xcfc2]); // muls.w d2,d7
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 42, read: 2, write: 0 }, { total: 74, read: 2, write: 0 } ]);
	});
	test("mulu", () => {
		const insn = new Uint16Array([0xc0ef, 0x000a]); // mulu.w 10(sp),d0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 54, read: 5, write: 0 }, { total: 86, read: 5, write: 0 } ]);
	});
	test("link", () => {
		const insn = new Uint16Array([0x4e55, 0xffc0]); // link.w a5,#-64
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 16, read: 2, write: 2 } ]);
	});
	test("unlk", () => {
		const insn = new Uint16Array([0x4e5d]); // unlk a5
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 12, read: 3, write: 0 } ]);
	});
	test("sc", () => {
		const insn = new Uint16Array([0x55c3]); // sc.s d3 ???
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 8, read: 2, write: 0 }, { total: 10, read: 2, write: 0 } ]);
	});
	test("neg", () => {
		const insn = new Uint16Array([0x4403]); // neg.b d3
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 4, read: 1, write: 0 } ]);
	});
	test("dbf", () => {
		const insn = new Uint16Array([0x51c9, 0xfffa]); // dbf d1,$11c2
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 10, read: 2, write: 0 }, { total: 14, read: 3, write: 0 } ]);
	});
	test("ext", () => {
		const insn = new Uint16Array([0x48c4]); // ext.l d4
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, [ { total: 4, read: 1, write: 0 } ]);
	});
});

suite("68k-jump", () => {
	test("jsr absolute long", () => {
		const insn = new Uint16Array([0x4eb9, 0x00f0, 0xff60]); // jsr $f0ff60
		const jump = GetJump(0xdb4, insn);
		assert.deepEqual(jump, { type: JumpType.Jsr, target: 0xf0ff60 });
	});
});

suite("68k-dis", () => {
	test("ext", () => {
		const insn = new Uint8Array([0x48, 0xc4]); // ext.l d4
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "ext.l d4");
	});
	test("cmp", () => {
		const insn = new Uint8Array([0x0c, 0x42, 0x00, 0x10]); // cmpi.w #16,d2
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "cmpi.w #16,d2");
	});
	test("neg", () => {
		const insn = new Uint8Array([0x44, 0x03]); // neg.b d3
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "neg.b d3");
	});
	test("link", () => {
		const insn = new Uint8Array([0x4e, 0x55, 0xff, 0xc0]); // link.w a5,#-64
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "link.w a5,#-64");
	});
	test("eor", () => {
		const insn = new Uint8Array([0xb7, 0x40]); // eor.w d3,d0
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "eor.w d3,d0");
	});
	test("mulu", () => {
		const insn = new Uint8Array([0xc0, 0xef, 0x00, 0x0a]); // mulu.w 10(sp),d0
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "mulu.w 10(sp),d0");
	});
	test("jsr", () => {
		const insn = new Uint8Array([0x4e, 0xb9, 0x00, 0xf0, 0xff, 0x60]); // jsr $f0ff60
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "jsr $f0ff60");
	});
	test("movem", () => {
		const insn = new Uint8Array([0x48, 0xe7, 0x30, 0x20]); // movem.l d2-d3/a2,-(sp)
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "movem.l d2-d3/a2,-(sp)");
	});
	test("bmi.w", () => {
		const insn = new Uint8Array([0x6b, 0x00, 0x03, 0xfa]);
		const dis = print_insn_m68k(insn, 0x108);
		assert.strictEqual(dis.text, "bmi.w $504");
	});
	test("bne.s", () => {
		const insn = new Uint8Array([0x66, 0xf8]);
		const dis = print_insn_m68k(insn, 0x42dfe);
		assert.strictEqual(dis.text, "bne.s $42df8");
	});
	test("btst", () => {
		const insn = new Uint8Array([0x01, 0x3a, 0x01, 0x9a]);
		const dis = print_insn_m68k(insn, 0x28de);
		assert.strictEqual(dis.text, "btst d0,$2a7a(pc)");
	});
	test("sf", () => {
		const insn = new Uint8Array([0x51, 0xd0]);
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "sf (a0)");
	});
	test("move.w", () => {
		const insn = new Uint8Array([0x33, 0xfc, 0x00, 0x20, 0x00, 0xdf, 0xf0, 0x9c]);
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "move.w #32,$dff09c");
	});
	test("move.l", () => {
		const insn = new Uint8Array([0x2d, 0x7c, 0x01, 0x00, 0x00, 0x00, 0x00, 0x40]);
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "move.l #16777216,64(a6)");
	});
	test("moveq", () => {
		const insn = new Uint8Array([0x72, 0x01]);
		const dis = print_insn_m68k(insn, 0);
		assert.strictEqual(dis.text, "moveq #1,d1");
	})
});
