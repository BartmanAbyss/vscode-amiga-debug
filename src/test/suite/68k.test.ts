import * as assert from 'assert';
import { GetCycles, GetJump, JumpType } from "../../client/68k";

import * as unravel from '../../../src/client/68k-unravel.js';

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
	test("unravel", () => {
		const insn = new Uint8Array([0x48, 0xc4]); // ext.l d4
		try {
			const ret = unravel(insn, 0);
			console.log(JSON.stringify(ret, null, 4));
		} catch(e) {
			console.log(e);
		}
	});
});
