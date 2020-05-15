import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Profiler, SourceMap } from '../../backend/profile';
import { SymbolTable } from '../../backend/symbols';

const testDataDir = path.resolve(__dirname, "../../../src/test/suite/data");
const binDir = path.resolve(__dirname, "../../../bin/opt/bin");

suite("Profiler", () => {
	test("Profiler", () => {
		const profileBuffer = fs.readFileSync(path.join(testDataDir, 'amiga-profile-1589535143558'));
		const profileArray = new Uint32Array(profileBuffer.buffer, profileBuffer.byteOffset, profileBuffer.length / Uint32Array.BYTES_PER_ELEMENT);
		const codeSize = profileArray.length * 2;
		const sourceMap = new SourceMap(path.join(binDir, 'm68k-amiga-elf-addr2line.exe'), path.join(testDataDir, 'a.mingw.elf'), codeSize);
		const symbolTable = new SymbolTable(path.join(binDir, 'm68k-amiga-elf-objdump.exe'), path.join(testDataDir, 'a.mingw.elf'));

		const profile = new Profiler(sourceMap, symbolTable, profileArray);
		fs.writeFileSync(path.join(testDataDir, 'amiga-profile-1589535143558.asm.cpuprofile'), profile.profileAsm());
		fs.writeFileSync(path.join(testDataDir, 'amiga-profile-1589535143558.line.cpuprofile'), profile.profileLine());
		fs.writeFileSync(path.join(testDataDir, 'amiga-profile-1589535143558.func.cpuprofile'), profile.profileFunction());
	});
});
