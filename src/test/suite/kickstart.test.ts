import * as path from 'path';
import * as assert from 'assert';
import { GetCycles, GetJump, JumpType } from "../../client/68k";

import { print_insn_m68k } from '../../client/68k-dis';
import { FD, Kickstart } from '../../kickstart';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");
const binDir = path.resolve(__dirname, "../../../bin/opt/bin");
const symDir = path.resolve(__dirname, "../../../bin/symbols");

suite("kickstart", () => {
/*	test("1.2", () => {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v1.2 r33.180 (1986)(Commodore)(A500-A1000-A2000)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("1.3", () => {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v1.3 r34.5 (1987)(Commodore)(A500-A1000-A2000-CDTV)[!].rom'), path.join(testDataDir, 'fd'));
		assert.equal(kickstart.getFunctionSize(0xfc069e), 4); // RemDevice; only bra
		assert.equal(kickstart.getFunctionSize(0xff589c), 20); // Open
		assert.equal(kickstart.getFunctionSize(0xFF67EC), 0x340); // g_rdargs
		assert.equal(kickstart.getFunctionSize(0xFC0718), 0x72); // DoIO
		assert.equal(kickstart.getFunctionSize(0xFC1528), 0x8A); // MakeLibrary
		assert.equal(kickstart.getFunctionSize(0xFC14D4), 0x54); // SumLibrary
		assert.equal(kickstart.getFunctionSize(0xFC06A2), 0x4e); // OpenDevice
		kickstart.writeIdc();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("FD", () => {
		const fd = new FD(path.join(testDataDir, 'fd/graphics_lib.fd'));
		assert.deepEqual(fd.functions.find((f) => f.lvo === 228), { lvo: 228, name: 'WaitBlit', minVersion: 0 });
		assert.deepEqual(fd.functions.find((f) => f.lvo === 828), { lvo: 828, name: 'CalcIVG', minVersion: 39 });
	});
*/	
	test("2.04", () => {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v2.04 r37.175 (1991)(Commodore)(A500+)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeSymbols(binDir, symDir);
	});
});
