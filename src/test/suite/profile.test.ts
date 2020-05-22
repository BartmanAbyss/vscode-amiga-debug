import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Profiler, SourceMap, UnwindTable } from '../../backend/profile';
import { SymbolTable } from '../../backend/symbols';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");
const testOutDir = path.resolve(__dirname, "../../../src/test/suite/data/output");
const binDir = path.resolve(__dirname, "../../../bin/opt/bin");

function test_profile(base: string, elf: string) {
	const profileBuffer = fs.readFileSync(path.join(testDataDir, base));
	const profileArray = new Uint32Array(profileBuffer.buffer, profileBuffer.byteOffset, profileBuffer.length / Uint32Array.BYTES_PER_ELEMENT);
	const codeSize = fs.statSync(path.join(testDataDir, base) + '.unwind')['size'] >> 1;
	const sourceMap = new SourceMap(path.join(binDir, 'm68k-amiga-elf-addr2line.exe'), path.join(testDataDir, elf), codeSize);
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));

	const profiler = new Profiler(sourceMap, symbolTable, profileArray);
	//fs.writeFileSync(path.join(testOutDir, base + '.asm.amigaprofile'), profile.profileAsm());
	//fs.writeFileSync(path.join(testOutDir, base + '.line.amigaprofile'), profile.profileLine());
	fs.writeFileSync(path.join(testOutDir, base + '.func.amigaprofile'), profiler.profileFunction());

/*	const profilerTxt = new ProfilerTxt(sourceMap, symbolTable, profileArray);
	fs.writeFileSync(path.join(testOutDir, base) + '.txt', profilerTxt.profileFunction());

	const profilerSpeedscope = new ProfilerSpeedscope(sourceMap, symbolTable, profileArray);
	fs.writeFileSync(path.join(testOutDir, base) + '.speedscope.json', profilerSpeedscope.profileFunction());
*/	
}

suite("Profiler", () => {
	test("unwind test.elf", () => {
		const unwindTable = new UnwindTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, 'test.elf'));
	});
	test("unwind bitshmup.elf", () => {
		const unwindTable = new UnwindTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, 'private/bitshmup.elf'));
	});
	test("test.elf", () => {
		test_profile('amiga-profile-1589887581223', 'test.elf');
	});
	test("bitshmup.elf", () => {
		test_profile('amiga-profile-1589891749803', 'private/bitshmup.elf');
	});
});
