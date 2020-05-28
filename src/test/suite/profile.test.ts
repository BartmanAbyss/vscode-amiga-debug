import * as fs from 'fs';
import * as path from 'path';
import { Profiler, SourceMap, UnwindTable, ProfileFile } from '../../backend/profile';
import { SymbolTable } from '../../backend/symbols';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");
const testOutDir = path.resolve(__dirname, "../../../src/test/suite/data/output");
const binDir = path.resolve(__dirname, "../../../bin/opt/bin");

function test_profile_time(base: string, elf: string) {
	const profileFile = new ProfileFile(path.join(testDataDir, base));
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	const sourceMap = new SourceMap(path.join(binDir, 'm68k-amiga-elf-addr2line.exe'), path.join(testDataDir, elf), symbolTable);

	const profiler = new Profiler(sourceMap, symbolTable);
	fs.writeFileSync(path.join(testOutDir, base + '.time.amigaprofile'), profiler.profileTime(profileFile));
}

function test_profile_size(base: string, elf: string) {
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	const sourceMap = new SourceMap(path.join(binDir, 'm68k-amiga-elf-addr2line.exe'), path.join(testDataDir, elf), symbolTable);
	const profiler = new Profiler(sourceMap, symbolTable);
	fs.writeFileSync(path.join(testOutDir, base + '.size.amigaprofile'), profiler.profileSize(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf)));
}

function test_unwind(elf: string) {
	const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf));
	const unwindTable = new UnwindTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, elf), symbolTable);
}

suite("Profiler", () => {
	test("unwind test.elf", () => {
		test_unwind('test.elf');
	});
	test("unwind bitshmup.elf", () => {
		test_unwind('private/bitshmup.elf');
	});
	test("Time: test.elf", () => {
		test_profile_time('amiga-profile-1590239270728', 'test.elf');
	});
	test("Time: test2.elf", () => {
		test_profile_time('amiga-profile-1590418304029', 'test2.elf');
	});
	test("Size: test3.elf", () => {
		test_profile_size('test3', 'test3.elf');
	});
	test("Size: bitshmup.elf", () => {
		test_profile_size('bitshmup', 'private/bitshmup.elf');
	});
	test("bitshmup.elf", () => {
		//test_profile('amiga-profile-1589891749803', 'private/bitshmup.elf');
	});
});
