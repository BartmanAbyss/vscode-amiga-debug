import * as assert from 'assert';
import { GetCycles } from "../../client/68k";

suite("68k", () => {
	test("move1", () => {
		const insn = new Uint16Array([0x205a]); // movea.l (a2)+,a0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 12, read: 3, write: 0 });
	});
	test("move2", () => {
		const insn = new Uint16Array([0x23c0, 0x0001, 0x1c8e]); // move.l d0,$11c8e
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 20, read: 3, write: 2 });
	});
	test("movem1", () => {
		const insn = new Uint16Array([0x48e7, 0x3020]); // movem.l d2-d3/a2,-(sp)
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 32, read: 2, write: 6 });
	});
	test("movem2", () => {
		const insn = new Uint16Array([0x4cdf, 0x040c]); // movem.l (sp)+,d2-d3/a2
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 36, read: 9, write: 0 });
	});
	test("addi", () => {
		const insn = new Uint16Array([0x0680, 0x0000, 0x00c0]); // addi.l #192,d0
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 16, read: 3, write: 0 });
	});
	test("subi", () => {
		const insn = new Uint16Array([0x0483, 0x0000, 0x4000]); // subi.l #16384,d3
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 16, read: 3, write: 0 });
	});
	test("addq", () => {
		const insn = new Uint16Array([0x5282]); // addq.l #1,d2
		const cycles = GetCycles(insn);
		assert.deepEqual(cycles, { total: 8, read: 1, write: 0 });
	});
});
