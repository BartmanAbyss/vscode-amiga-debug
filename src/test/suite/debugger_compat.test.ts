import { suite, test } from 'mocha';
import * as assert from 'assert';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { bundledGccExecutables } from '../../backend/toolchain';
import { ProfileFile, Profiler, SourceMap, UnwindTable } from '../../backend/profile';
import { SymbolTable } from '../../backend/symbols';
import { ChipsetFlags, Copper, GetScreenFromCopper } from '../../client/dma';
import { CopperMove } from '../../client/copperDisassembler';
import { Custom } from '../../client/custom';
import { ICpuProfileRaw, Register } from '../../client/types';

suite('Debugger compatibility', () => {
	test('discovers every installed GCC version and ignores unrelated entries', () => {
		const binPath = fs.mkdtempSync(path.join(os.tmpdir(), 'amiga-toolchain-'));
		try {
			const root = path.join('opt', 'libexec', 'gcc', 'm68k-amiga-elf');
			for (const version of ['15.1.0', '15.2.0', 'unrelated']) {
				fs.mkdirSync(path.join(binPath, root, version), { recursive: true });
				if (version !== 'unrelated')
					fs.writeFileSync(path.join(binPath, root, version, 'cc1'), '');
			}
			fs.writeFileSync(path.join(binPath, root, 'README'), '');
			assert.deepStrictEqual(bundledGccExecutables(binPath),
				['15.1.0', '15.2.0'].flatMap((version) =>
					['cc1', 'cc1plus', 'collect2', 'lto-wrapper', 'lto1']
						.map((exe) => path.join(root, version, exe))));
		} finally {
			fs.rmSync(binPath, { recursive: true, force: true });
		}
	});

	test('bounds compact CFI to text words and stops Copperline at missing assembly CFI', () => {
		const originalSpawn = Object.getOwnPropertyDescriptor(childProcess, 'spawnSync');
		const cfi = `00000000 00000010 ffffffff CIE
   LOC   CFA      ra
00000000 r15+4   c-4

00000014 00000010 00000000 FDE cie=00000000 pc=00000000..00000004
   LOC   CFA      ra
00000000 r15+4   c-4
00000002 r15+8   c-4

`;
		Object.defineProperty(childProcess, 'spawnSync', {
			value: () => ({ status: 0, stdout: Buffer.from(cfi) })
		});
		try {
			const symbols = Object.assign(Object.create(SymbolTable.prototype), {
				sections: [{ name: '.text', size: 8 }]
			}) as SymbolTable;
			const legacy = new UnwindTable('objdump', 'test.elf', symbols);
			const copperline = new UnwindTable('objdump', 'test.elf', symbols, true);
			assert.strictEqual(copperline.codeSize, 8);
			assert.deepStrictEqual(Array.from(copperline.unwind), Array.from(new Int16Array([
				0xf004, -1, -4, 0xf008, -1, -4,
				0xf000, -1, -4, 0xf000, -1, -4
			])));
			assert.deepStrictEqual(Array.from(legacy.unwind), Array.from(new Int16Array([
				0xf004, -1, -4, 0xf008, -1, -4,
				0xf004, -1, -4, 0xf004, -1, -4
			])));
		} finally {
			Object.defineProperty(childProcess, 'spawnSync', originalSpawn);
		}
	});

	test('keeps cycles and register samples when either a caller or leaf is unmapped', () => {
		const sourceMap = Object.assign(Object.create(SourceMap.prototype), {
			lines: [0], uniqueLines: [{ frames: [{ func: 'known', file: 'main.c', line: 7 }] }]
		}) as SourceMap;
		const symbols = Object.assign(Object.create(SymbolTable.prototype), {
			sections: [], symbols: []
		}) as SymbolTable;
		const registers = Array.from({ length: Register._count }, (_, i) => i + 1);
		const file = Object.assign(Object.create(ProfileFile.prototype), {
			chipMem: new Uint8Array(), bogoMem: new Uint8Array(),
			baseClock: 28375160, cpuCycleUnit: 512,
			frames: [{
				customRegs: new Uint16Array(256), chipsetFlags: 0,
				profileArray: new Uint32Array([
					0, 0x4000, 0xffffffff - 3, ...registers,
					0x5000, 0xffffffff - 5, ...registers
				])
			}]
		}) as ProfileFile;
		const [frame] = JSON.parse(new Profiler(sourceMap, symbols).profileTime(file, '')) as ICpuProfileRaw[];
		assert.strictEqual(frame.endTime, 8);
		assert.deepStrictEqual(frame.timeDeltas, [3, 5, 0]);
		assert.deepStrictEqual(frame.$amiga.pcTrace, [0, 3, 0x5000, 5]);
		assert.deepStrictEqual(frame.$amiga.registerTrace, [...registers, ...registers]);
		const names = frame.nodes.map((node) => node.callFrame.functionName);
		assert.ok(names.includes('known'));
		assert.ok(names.includes('[Unmapped $3ffe]'));
		assert.ok(names.includes('[Unmapped $5000]'));
	});

	const registerIndex = (name: string) => (Custom.ByName(name).adr - 0xdff000) >>> 1;
	const snapshot = () => {
		const regs = new Uint16Array(256);
		for (const [name, value] of Object.entries({
			BPLCON0: 0x5000, DDFSTRT: 0x38, DDFSTOP: 0xd0,
			DIWSTRT: 0x2c81, DIWSTOP: 0x2cc1,
			BPL1PTH: 1, BPL1PTL: 0x4000, BPL1MOD: 160, BPL2MOD: 0xfffe
		}))
			regs[registerIndex(name)] = value;
		return regs;
	};
	const move = (name: string, value: number): Copper => ({
		cycle: 0, vpos: 20, hpos: 0, address: 0,
		insn: new CopperMove(registerIndex(name) * 2, value)
	});

	test('infers a full-width bitmap from display registers initialized outside the Copper list', () => {
		const regs = snapshot();
		const screen = GetScreenFromCopper([], ChipsetFlags.OCS, regs);
		assert.strictEqual(screen.width, 320);
		assert.strictEqual(screen.height, 256);
		assert.strictEqual(screen.planes.length, 5);
		assert.strictEqual(screen.planes[0], 0x14000);
		assert.deepStrictEqual(screen.modulos, [160, -2]);
		assert.strictEqual(screen.hires, false);
		assert.strictEqual(screen.ham, false);
	});

	test('Copper writes override the snapshot without modifying it', () => {
		const regs = snapshot();
		const screen = GetScreenFromCopper([
			move('DDFSTOP', 0xd8), move('BPL1PTL', 0x5000), move('BPL1MOD', 80)
		], ChipsetFlags.OCS, regs);
		assert.strictEqual(screen.width, 336);
		assert.strictEqual(screen.planes[0], 0x15000);
		assert.strictEqual(screen.modulos[0], 80);
		assert.deepStrictEqual(regs, snapshot());
	});

	test('retains inference from complete Copper lists when no snapshot is supplied', () => {
		const screen = GetScreenFromCopper([
			move('BPLCON0', 0x5000), move('DDFSTRT', 0x38), move('DDFSTOP', 0xd0),
			move('DIWSTRT', 0x2c81), move('DIWSTOP', 0x2cc1)
		], ChipsetFlags.OCS);
		assert.strictEqual(screen.width, 320);
		assert.strictEqual(screen.height, 256);
		assert.strictEqual(screen.planes.length, 5);
	});
});
