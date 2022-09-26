import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as childProcess from 'child_process';
import { print_insn_m68k } from './client/68k-dis';
import { GetJump, JumpType } from './client/68k';

// https://5e7b2c0d467b5.site123.me/
// https://wandel.ca/homepage/execdis/exec_disassembly.txt
// https://github.com/jotd666/amiga68ktools/blob/master/tools/LVOs.i
// Structure Offsets http://amigadev.elowar.com/read/ADCD_2.1/Includes_and_Autodocs_2._guide/node0551.html
// BCPL stuff (for dos.library) http://aminet.net/package/dev/misc/dosgv

interface LibraryFunction {
	lvo: number;
	name: string;
	minVersion: number;
}

export class FD {
	public functions: LibraryFunction[] = [];

	constructor(private path: string) {
		const data = fs.readFileSync(path).toString().replace(/\r/g, '').split('\n');
		let bias = 0;
		let minVersion = 0;
		let isPublic = true;
		for(const line of data) {
			if(line.startsWith('##')) {
				const cmd = line.substring(2);
				if(cmd.startsWith('bias'))
					bias = parseInt(cmd.substring(5));
				else if(cmd === 'public')
					isPublic = true;
				else if(cmd === 'private')
					isPublic = false;
				else if(cmd === 'end')
					break;
			} else if(line.startsWith('*')) {
				const match = line.match(/functions in V([0-9]+) or higher/);
				if(match)
					minVersion = parseInt(match[1]);
			} else {
				if(isPublic) {
					const func = line.split('(', 1)[0] || line;
					this.functions.push({ lvo: bias, name: func, minVersion });
				}
				bias += 6;
			}
		}
	}
}

const RTC_MATCHWORD = 0x4AFC; // from exec/resident.h
const RTF_AUTOINIT = 1<<7; // rt_Init points to data structure
const RTF_AFTERDOS = 1<<2;
const RTF_SINGLETASK = 1<<1;
const RTF_COLDSTART = 1<<0;
const NT_LIBRARY = 9; // from exec/nodes.h

interface Library {
	name: string;
	version: number;
	offset: number;
	id: string;
}

enum LvoFlags {
	long = 0, // [1] 32-bit pointers to functions
	short = 1, // [1] 16-bit offsets to functions
	dos = 2, // [1] seglists, [2] gvindices
}

const libraryVectors: { [x: string]: { [x: string]: number[] } } = {
	// Kickstart v1.2 r33.180 (1986)(Commodore)(A500-A1000-A2000)[!].rom
	'11f9e62cf299f72184835b7b2a70a16333fc0d88': {
		'exec 33.192 (8 Oct 1986)': [ LvoFlags.short, 0xFC1A40 ],
		'graphics 33.97 (8 Oct 1986)': [ LvoFlags.long, 0xFCB0A6 ],
		'layers 33.33 (2 Oct 1986)': [ LvoFlags.short, 0xFE0F38 ],
		'dos 33.124 (11 Sep 1986)': [ LvoFlags.dos, 0xFF421C, 0xFF43E0 ],
	},

	// Kickstart v1.3 r34.5 (1987)(Commodore)(A500-A1000-A2000-CDTV)[!].rom
	'891e9a547772fe0c6c19b610baf8bc4ea7fcb785': {
		'exec 34.2 (28 Oct 1987)': [ LvoFlags.short, 0xFC1A7C ],
		'graphics 34.1 (18 Aug 1987)': [ LvoFlags.long, 0xFCB05A ],
		'layers 34.1 (18 Aug 1987)': [ LvoFlags.short, 0xFE0B4C ],
		'romboot 34.1 (18 Aug 1987)': [ LvoFlags.long, 0xFEB114 ],
		'dos 34.3 (9 Dec 1987)': [ LvoFlags.dos, 0xFF3E24, 0xFF4060 ],
	},

	// Kickstart v2.04 r37.175 (1991)(Commodore)(A500+)[!].rom
	'c5839f5cb98a7a8947065c3ed2f14f5f42e334a1': {
		'exec 37.132 (23.5.91)': [ LvoFlags.short, 0xF81F84 ],
		'expansion 37.44 (23.5.91)': [ LvoFlags.short, 0xF83CA6],
		'dos 37.44 (22.5.91)': [ LvoFlags.short, 0xF91544],
		'graphics 37.35 (23.5.91)': [ LvoFlags.long, 0xFA8E64 ],
		'layers 37.7 (13.3.91)': [ LvoFlags.short, 0xFC272C ],
		'mathieeesingbas 37.3 (9.5.91)': [ LvoFlags.short, 0xFC66BC ],
	},

	// Kickstart v2.05 r37.299 (1991)(Commodore)(A600)[!].rom
	'87508de834dc7eb47359cede72d2e3c8a2e5d8db': {
		'exec 37.151 (1.11.91)': [ LvoFlags.short, 0xF81FB0],
		'expansion 37.50 (28.10.91)': [ LvoFlags.short, 0xF83CAA ],
		'mathieeesingbas 37.3 (9.5.91)': [ LvoFlags.short, 0xF848AC ],
		'dos 37.45 (21.10.91)': [ LvoFlags.short, 0xF95A40 ],
		'graphics 37.41 (31.10.91)': [ LvoFlags.long, 0xFB2624 ],
	},

	// Kickstart v3.0 r39.106 (1992)(Commodore)(A1200)[!].rom
	'70033828182fffc7ed106e5373a8b89dda76faa5': {
		'exec 39.47 (28.8.92)': [ LvoFlags.short, 0xF82280 ],
		'expansion 39.7 (7.6.92)': [ LvoFlags.short, 0xF8378E ],
		'mathieeesingbas 37.3 (9.5.91)': [ LvoFlags.short, 0xF86740 ],
		'dos 39.23 (8.9.92)': [ LvoFlags.short, 0xF971EC ],
		'graphics 39.89 (1.9.92)': [ LvoFlags.long, 0xFBCA7C ],
	},

	// Kickstart v3.1 r40.68 (1993)(Commodore)(A1200)[!].rom
	'e21545723fe8374e91342617604f1b3d703094f1': {
		'exec 40.10 (15.7.93)': [ LvoFlags.short, 0xF8236C ],
		'expansion 40.2 (9.3.93)': [ LvoFlags.short, 0xF83842 ],
		'graphics 40.24 (18.5.93)': [ LvoFlags.long, 0xF9D460 ],
		'dos 40.3 (1.4.93)': [ LvoFlags.short, 0xFA034C ],
		'mathieeesingbas 40.4 (16.3.93)': [ LvoFlags.short, 0xFC1B9C ], // <- for AFF_68881; also: 0xFC1B78 (when no FPU)
	},
};

interface KickFunction {
	name: string;
	addr: number;
	size: number;
}

export class Kickstart {
	private data: Buffer;
	private hash = '';
	private base = 0xfc0000;
	private idc = '';
	private ghidra = '';
	private libraries: Library[] = [];
	private functions: KickFunction[] = [];

	constructor(private kickPath: string, private fdPath = '') {
		this.data = fs.readFileSync(kickPath);
		this.hash = crypto.createHash('sha1').update(this.data).digest('hex');
		if(this.data.length === 512*1024)
			this.base -= 256*1024;

		//console.log(`${path.basename(kickPath)}: ${this.hash}`);

		// scan libraries
		for(let offset = 0; offset < this.data.byteLength; offset += 2) {
			if(this.data.readInt16BE(offset) === RTC_MATCHWORD && this.data.readInt32BE(offset + 2) === this.base + offset && this.data[offset + 12] === NT_LIBRARY) {
				const version = this.data[offset + 11];
				const getString = (offset: number) => {
					let str = '';
					for(let s = 0; this.data[offset + s] !== 0 && this.data[offset + s] !== 0xd && this.data[offset + s] !== 0xa; s++)
						str += String.fromCharCode(this.data[offset + s]);
					return str;
				};
				const name = getString(this.data.readInt32BE(offset + 14) - this.base);
				const id = getString(this.data.readInt32BE(offset + 18) - this.base);
				this.libraries.push({ name, version, offset, id });
			}
		}
	}

	public getId = () => this.hash;

	public getBase = () => this.base;

	public parseLibraries() {
		this.idc = '#include <idc.idc>\n';
		this.idc += `
static Structures(void) {
	auto id;
	begin_type_updating(UTP_STRUCT);
	auto mid;
	id = add_struc(-1,"Resident",0);
	id = get_struc_id("Resident");
	mid = add_struc_member(id,"rt_MatchWord",	0,	0x10000400,	-1,	2);
	mid = add_struc_member(id,"rt_MatchTag",	0X2,	0x20500400,	0,	4,	0XFFFFFFFFFFFFFFFF,	0,	0x000002);
	mid = add_struc_member(id,"rt_EndSkip",	0X6,	0x20500400,	0,	4,	0XFFFFFFFFFFFFFFFF,	0,	0x000002);
	mid = add_struc_member(id,"rt_Flags",	0XA,	0x000400,	-1,	1);
	mid = add_struc_member(id,"rt_Version",	0XB,	0x100400,	-1,	1);
	mid = add_struc_member(id,"rt_Type",	0XC,	0x000400,	-1,	1);
	mid = add_struc_member(id,"rt_Pri",	0XD,	0x000400,	-1,	1);
	mid = add_struc_member(id,"rt_Name",	0XE,	0x20500400,	0,	4,	0XFFFFFFFFFFFFFFFF,	0,	0x000002);
	mid = add_struc_member(id,"rt_IdString",	0X12,	0x20500400,	0,	4,	0XFFFFFFFFFFFFFFFF,	0,	0x000002);
	mid = add_struc_member(id,"rt_Init",	0X16,	0x20500400,	0,	4,	0XFFFFFFFFFFFFFFFF,	0,	0x000002);
	end_type_updating(UTP_STRUCT);
}`;
		this.idc += '\nstatic main(void) {\n\tStructures();\n';
		for(const lib of this.libraries) {
			this.parseLibrary(lib);
		}
		this.idc += '}\n';
	}

	public writeIdc() {
		this.parseLibraries();
		fs.writeFileSync(this.kickPath + '.idc', this.idc);
	}

	public writeGhidra() {
		this.parseLibraries();
		fs.writeFileSync(this.kickPath + '.syms', this.ghidra);
	}

	public writeSymbols(binDir: string, outDir: string) {
		this.functions.sort((a, b) => a.addr - b.addr);
		// fix overlapping functions
		for(let i = 0; i < this.functions.length - 1; i++)
			if(this.functions[i].addr + this.functions[i].size > this.functions[i+1].addr)
				this.functions[i].size = this.functions[i+1].addr - this.functions[i].addr;

		let addr = this.base;
		let asm = '';
		asm += `\t.section .kick, "ax", @nobits\n`;
		for(const func of this.functions) {
			if(func.addr - addr > 0)
				asm += `\t.nop ${func.addr - addr}\n`;
			asm += `\t.type ${func.name},function\n\t.globl ${func.name}\n${func.name}:\n\t.size ${func.name}, ${func.size}\n`;
			addr = func.addr;
		}
		asm += `\t.nop ${0x1000000 - addr}\n`; // pad kickstart section
		fs.writeFileSync(this.kickPath + '.asm', asm);
		const elfPath = path.join(outDir, `kick_${this.hash}.elf`);
		const as = childProcess.spawnSync(
			path.join(binDir, "m68k-amiga-elf-as.exe"), 
			[
				'-', // input from stdin
				'-o', elfPath, // no object output
				'--register-prefix-optional', 
				'-g', // debug info
			], 
			{
				input: asm,
			});
		if (as.status !== 0)
			throw as.error;
	}

	private parseLibrary(lib: Library) {
		this.idc += `\t// ${lib.id}\n`;
		this.idc += `\tMakeStruct(0x${(lib.offset + this.base).toString(16)}, "Resident");\n`;
		this.idc += `\tMakeName(0x${(lib.offset + this.base).toString(16)}, "${lib.name}");\n`;
		const vectors: number[] = [];
		if(this.data[lib.offset + 10] & RTF_AUTOINIT) {
			const initOffset = this.data.readInt32BE(lib.offset + 22) - this.base;
			const vectorsOffset = this.data.readInt32BE(initOffset + 4) - this.base;
			if(this.data.readInt16BE(vectorsOffset) === -1) { // relative
				for(let v = 2; this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
			} else { // absolute
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
			}
		} else if(libraryVectors[this.hash] && libraryVectors[this.hash][lib.id]) { // lookup
			switch(libraryVectors[this.hash][lib.id][0]) {
			case LvoFlags.long: {
				const vectorsOffset = libraryVectors[this.hash][lib.id][1] - this.base;
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
				break;
			}
			case LvoFlags.short: {
				const vectorsOffset = libraryVectors[this.hash][lib.id][1] - this.base;
				for(let v = 0; v === 0 || this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
				break;
			}
			case LvoFlags.dos: {
				const seglistsOffset = libraryVectors[this.hash][lib.id][1] - this.base;
				const gvIndicesOffset = libraryVectors[this.hash][lib.id][2] - this.base;
				const gvMap: Map<number, number> = new Map();
				const numSeglists = this.data.readInt32BE(seglistsOffset);
				//console.log(`numSeglists: ${numSeglists}`);
				for(let s = 0; s < numSeglists; s++) {
					//console.log(`seglist: ${s}`);
					let seglistAddr = (this.data.readInt32BE(seglistsOffset + (1 + s) * 4) << 2);
					while(seglistAddr !== 0) {
						const nextSeglistAddr = this.data.readInt32BE(seglistAddr - this.base) << 2;
						let tableOffset = this.data.readInt32BE(seglistAddr + 4 - this.base) << 2;
						//console.log(`  seglistAddr: ${seglistAddr.toString(16)} tableOffset: ${tableOffset.toString(16)}`);
						for(;;) {
							const funcOffset = this.data.readInt32BE(seglistAddr - this.base + tableOffset - 4);
							if(funcOffset === 0)
								break;
							const funcAddr = funcOffset + seglistAddr + 4;
							const gvIndex = this.data.readInt32BE(seglistAddr - this.base + tableOffset - 8);
							gvMap.set(gvIndex, funcAddr);
							let name = gvo.get(gvIndex);
							if(!name) {
								if(gvIndex >= 0)
									name = `gv_${gvIndex}`;
								else
									name = `gv_n${-gvIndex}`;
							}
							//console.log(`    funcAddr: ${funcAddr.toString(16)} gvIndex: ${gvIndex} name: ${name}`);
							if(name) {
								const funcSize = this.getFunctionSize(funcAddr);
								//console.log(`  0x${funcAddr.toString(16)}: ${name} GV ${gvIndex} size ${funcSize}`);
								this.functions.push({ name, addr: funcAddr, size: funcSize });
								this.idc += `\tMakeName(0x${funcAddr.toString(16)}, "${name}"); // GV ${gvIndex}\n`;
								this.idc += `\tMakeFunction(0x${funcAddr.toString(16)}, BADADDR);\n`;
								this.ghidra += `${name} 0x${funcAddr.toString(16)} f\n`;
							}
							tableOffset -= 8;
						}
						seglistAddr = nextSeglistAddr;
					}
				}
				for(let v = 0; this.data.readInt8(gvIndicesOffset + v) !== 0; v++) {
					const gvIndex = this.data.readInt8(gvIndicesOffset + v);
					vectors.unshift(gvMap.get(gvIndex));
				}
				vectors.unshift(0, 0, 0, 0); // 4 reserved vectors
				break;
			}
			} // switch
		}
		//console.log(`Found library @ ${(lib.offset + this.base).toString(16)}: ${lib.name} V${lib.version} [${lib.id}] flags: ${this.data[lib.offset + 10].toString(16)}; ${vectors.length} LVOs`);
		if(this.fdPath !== '') {
			const fdPath = path.join(this.fdPath, lib.name.replace('.library', '_lib.fd'));
			if(fs.existsSync(fdPath)) {
				const fd = new FD(fdPath);
				for(const func of fd.functions) {
					const index = func.lvo / 6 - 1;
					if(lib.version >= func.minVersion && vectors.length > index) {
						const funcSize = this.getFunctionSize(vectors[index]);
						//console.log(`  0x${vectors[index].toString(16)}: ${func.name} LVO -${func.lvo} size ${funcSize}`);
						this.functions.push({ name: func.name, addr: vectors[index], size: funcSize });
						this.idc += `\tMakeName (0x${vectors[index].toString(16)}, "${func.name}"); // LVO -${func.lvo}\n`;
						this.idc += `\tMakeFunction(0x${vectors[index].toString(16)}, BADADDR);\n`;
						this.ghidra += `${func.name} 0x${vectors[index].toString(16)} f\n`;
					}
				}
			}
		}

		//for(const v of vectors)
		//	console.log(`  ${v.toString(16)}`);
		//if(!vectors.length)
		//	console.log('  nopes');
	}

	public getFunctionSize(startAddress: number): number {
		const visited: Set<number> = new Set();
		const pcs: number[] = [];
		const queue: number[] = [];

		queue.push(startAddress);
		while(queue.length) {
			let address = queue.shift();
			if(visited.has(address))
				continue;
			visited.add(address);
			for(;;) {
				const insn = this.data.slice(address - this.base, address - this.base + 8);
				const dis = print_insn_m68k(insn, address);
				//console.log(`${address.toString(16)}: ${dis.text}`);
				const insn16 = new Uint16Array(dis.len >> 1);
				for(let i = 0; i < dis.len; i += 2)
					insn16[i >>> 1] = (insn[i] << 8) | insn[i + 1];
				const jump = GetJump(address, insn16); // GetJump() only returns jumps it can resolve (no indirect jumps)
				address += dis.len;
				pcs.push(address);
				if(dis.text === 'rts' || dis.text === 'rtd' || dis.text === 'rte' || dis.text === 'rtm' || dis.text === 'rtr' || dis.text.startsWith('jmp (a') || dis.len <= 0)
					break;
				if(jump?.type === JumpType.ConditionalBranch) {
					queue.push(jump.target);
					queue.push(address);
					break;
				} else if(jump?.type === JumpType.Branch) {
					if(address - dis.len !== startAddress) // ignore functions that only consist of a single branch
						queue.push(jump.target);
					break;
				}
/*					Jsr,
					ConditionalJsr*/
			}
		}
		const endAddress = Math.max(...pcs);
		//console.log(`start: ${startAddress.toString(16)} end: ${endAddress.toString(16)} size: ${(endAddress - startAddress).toString(16)}`);
		return endAddress - startAddress;
	}
}

// adapted from gvo.h "5/2018 -=ONIX=-" http://aminet.net/package/dev/misc/dosgv
const gvo: Map<number, string> = new Map([
	[ 0x00, 'g_globsize' ],
	[ 0x01, 'g_start' ],
	[ 0x02, 'g_stop' ],
	[ 0x03, 'g_mul' ],
	[ 0x04, 'g_div' ],
	[ 0x05, 'g_mod' ],
	[ 0x0a, 'g_res2' ],
	[ 0x0c, 'g_stackbase' ],
	[ 0x0e, 'g_findtask' ],
	[ 0x0f, 'g_getchar' ],
	[ 0x10, 'g_putchar' ],
	[ 0x11, 'g_frameptr' ],
	[ 0x1c, 'g_globin' ],
	[ 0x1d, 'g_getmem' ],
	[ 0x1e, 'g_freemem' ],
	[ 0x25, 'g_break' ],
	[ 0x26, 'g_alert' ],
	[ 0x27, 'g_findrootnode' ],
	[ 0x2e, 'g_endtask' ],
	[ 0x2f, 'g_delay' ],
	[ 0x34, 'g_sysrequest' ],
	[ 0x35, 'g_writepad' ],
	[ 0x3b, 'g_findinput' ],
	[ 0x3c, 'g_findoutput' ],
	[ 0x3d, 'g_selectinput' ],
	[ 0x3e, 'g_selectoutput' ],
	[ 0x44, 'g_newline' ],
	[ 0x45, 'g_writed' ],
	[ 0x46, 'g_writen' ],
	[ 0x47, 'g_writehex' ],
	[ 0x48, 'g_writeoct' ],
	[ 0x49, 'g_writes' ],
	[ 0x4a, 'g_writef' ],
	[ 0x4e, 'g_rdargs' ],
	[ 0x59, 'g_findseglist' ],
	[ 0x65, 'g_runcommand' ],
	[ 0x68, 'g_fault' ],
	[ 0x6b, 'g_copystring' ],
	[ 0x6e, 'g_putword' ],
	[ 0x6f, 'g_getword' ],
	[ 0x86, 'g_findcli' ], // OS 1.2+
	[ 0x21, 'g_newproc' ],
	[ 0x23, 'g_parentdir' ],
	[ 0x33, 'g_currdir' ],
	[ 0x41, 'g_input' ],
	[ 0x42, 'g_output' ],
	[ 0x52, 'g_unloadseg' ],
	[ 0x57, 'g_waitforchar' ],
	[ 0x5a, 'g_delete' ],
	[ 0x5b, 'g_rename' ],
	[ 0x5d, 'g_close' ],
	[ 0x6c, 'g_lock' ],
	[ 0x6d, 'g_unlock' ],
	[ 0x71, 'g_duplock' ],
	[ 0x7d, 'g_createdir' ],
	[ -27, 'g_execute' ],
	[ -26, 'g_isinteractive' ],
	[ -25, 'g_datestamp' ],
	[ -24, 'g_setprotect' ],
	[ -23, 'g_setcomment' ],
	[ -22, 'g_deviceproc' ],
	[ -21, 'g_queuepacket' ],
	[ -20, 'g_getpacket' ],
	[ -19, 'g_loadseg' ],
	[ -18, 'g_createproc' ],
	[ -17, 'g_ioerror' ],
	[ -16, 'g_currentdir' ],
	[ -15, 'g_doscreatedir' ],
	[ -14, 'g_info' ],
	[ -13, 'g_exnext' ],
	[ -12, 'g_examine' ],
	[ -11, 'g_doslock' ],
	[ -10, 'g_dosrename' ],
	[ -9, 'g_deletefile' ],
	[ -8, 'g_seek' ],
	[ -6, 'g_write' ],
	[ -3, 'g_read' ],
	[ -1, 'g_open' ],
]);