import { suite, test } from 'mocha';
import * as assert from 'assert';
import * as path from 'path';
import { FD, Kickstart } from '../../kickstart';
import { profile } from '.';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");
const binDir = path.resolve(__dirname, "../../../bin/" + process.platform + "/opt/bin");
const symDir = path.resolve(__dirname, "../../../bin/symbols");

suite("kickstart", function () {
	test("1.2", function () {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v1.2 r33.180 (1986)(Commodore)(A500-A1000-A2000)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeGhidra();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("1.3", profile('kickstart', function () {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v1.3 r34.5 (1987)(Commodore)(A500-A1000-A2000-CDTV)[!].rom'), path.join(testDataDir, 'fd'));
		//assert.equal(kickstart.getFunctionSize(0xfc5634), 0x1c4); // Draw; overlapping with others
		assert.equal(kickstart.getFunctionSize(0xfc069e), 4); // RemDevice; only bra
		assert.equal(kickstart.getFunctionSize(0xff589c), 20); // Open
		assert.equal(kickstart.getFunctionSize(0xFF67EC), 0x340); // g_rdargs
		assert.equal(kickstart.getFunctionSize(0xFC0718), 0x72); // DoIO
		assert.equal(kickstart.getFunctionSize(0xFC1528), 0x8A); // MakeLibrary
		assert.equal(kickstart.getFunctionSize(0xFC14D4), 0x54); // SumLibrary
		assert.equal(kickstart.getFunctionSize(0xFC06A2), 0x4e); // OpenDevice
		kickstart.writeIdc();
		kickstart.writeGhidra();
		kickstart.writeSymbols(binDir, symDir);
	})).timeout(5000);
	test("2.04", function () {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v2.04 r37.175 (1991)(Commodore)(A500+)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeGhidra();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("2.05", function () {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v2.05 r37.299 (1991)(Commodore)(A600)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeGhidra();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("3.0", function () {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v3.0 r39.106 (1992)(Commodore)(A1200)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeGhidra();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("3.1", function () {
		const kickstart = new Kickstart(path.join(testDataDir, 'private/Kickstart v3.1 r40.68 (1993)(Commodore)(A1200)[!].rom'), path.join(testDataDir, 'fd'));
		kickstart.writeIdc();
		kickstart.writeGhidra();
		kickstart.writeSymbols(binDir, symDir);
	});
	test("FD", function () {
		const fd = new FD(path.join(testDataDir, 'fd/graphics_lib.fd'));
		assert.deepEqual(fd.functions.find((f) => f.lvo === 228), { lvo: 228, name: 'WaitBlit', minVersion: 0 });
		assert.deepEqual(fd.functions.find((f) => f.lvo === 828), { lvo: 828, name: 'CalcIVG', minVersion: 39 });
	});
});
