import * as fs from 'fs';
import * as path from 'path';
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

const libraryVectors: { [x: string]: number[] } = {
	// Kickstart v1.2 r33.180 (1986)(Commodore)(A500-A1000-A2000)[!].rom
	'exec 33.192 (8 Oct 1986)': [LvoFlags.short, 0xFC1A40 ],
	'graphics 33.97 (8 Oct 1986)': [ LvoFlags.long, 0xFCB0A6 ],
	'layers 33.33 (2 Oct 1986)': [ LvoFlags.short, 0xFE0F38 ],
	'dos 33.124 (11 Sep 1986)': [ LvoFlags.dos, 0xFF421C, 0xFF43E0 ],

	// Kickstart v1.3 r34.5 (1987)(Commodore)(A500-A1000-A2000-CDTV)[!].rom
	'exec 34.2 (28 Oct 1987)': [ LvoFlags.short, 0xFC1A7C ],
	'graphics 34.1 (18 Aug 1987)': [ LvoFlags.long, 0xFCB05A ],
	'layers 34.1 (18 Aug 1987)': [ LvoFlags.short, 0xFE0B4C ],
	'romboot 34.1 (18 Aug 1987)': [ LvoFlags.long, 0xFEB114 ],
	'dos 34.3 (9 Dec 1987)': [ LvoFlags.dos, 0xFF3E24, 0xFF4060 ],
};

interface KickFunction {
	name: string;
	addr: number;
	size: number;
}

export class Kickstart {
	private data: Buffer;
	private base = 0xfc0000;
	private idc = '';
	private libraries: Library[] = [];
	private functions: KickFunction[] = [];

	constructor(private path: string, private fdPath = '') {
		this.data = fs.readFileSync(path);
		if(this.data.length === 512*1024)
			this.base -= 256*1024;

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

	public getId(): string {
		const exec = this.libraries.find((lib) => lib.name === 'exec.library');
		if(exec) {
			const match = exec.id.match(/([0-9]+\.[0-9]+)/);
			if(match && match.length >= 2)
				return match[1];
		}
		return '';
	}

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
		fs.writeFileSync(this.path + '.idc', this.idc);
	}

	public writeSymbols(binDir: string, outDir: string) {
		this.functions.sort((a, b) => a.addr - b.addr);
		let addr = this.base;
		let asm = '';
		asm += `\t.section .kick, "ax", @nobits\n`;
		for(const func of this.functions) {
			asm += `\t.nop ${func.addr - addr}\n\t.type ${func.name},function\n\t.globl ${func.name}\n${func.name}:\n\t.size ${func.name}, ${func.size}\n`;
			addr = func.addr;
		}
		asm += `\t.nop ${0x1000000 - addr}\n`; // pad kickstart section
		fs.writeFileSync(this.path + '.asm', asm);
		const elfPath = path.join(outDir, `kick${this.getId()}.elf`);
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
		} else if(libraryVectors[lib.id]) { // lookup
			switch(libraryVectors[lib.id][0]) {
			case LvoFlags.long: {
				const vectorsOffset = libraryVectors[lib.id][1] - this.base;
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
				break;
			}
			case LvoFlags.short: {
				const vectorsOffset = libraryVectors[lib.id][1] - this.base;
				for(let v = 0; v === 0 || this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
				break;
			}
			case LvoFlags.dos: {
				const seglistsOffset = libraryVectors[lib.id][1] - this.base;
				const gvIndicesOffset = libraryVectors[lib.id][2] - this.base;
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
		console.log(`Found library @ ${(lib.offset + this.base).toString(16)}: ${lib.name} V${lib.version} [${lib.id}] flags: ${this.data[lib.offset + 10].toString(16)}; ${vectors.length} LVOs`);
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
				if(dis.text === 'rts' || dis.text === 'rtd' || dis.text === 'rte' || dis.text === 'rtm' || dis.text === 'rtr' || dis.text.startsWith('jmp (a') || dis.len === 0)
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

// generated using manual disassembly
const kick34_2functions = `
AddDevice	0000000000FC0690	0000000E
RemDevice	0000000000FC069E	00000004
OpenDevice	0000000000FC06A2	0000004E
CloseDevice	0000000000FC06F0	00000016
SendIO	0000000000FC0706	00000012
DoIO	0000000000FC0718	00000072
CheckIO	0000000000FC078A	0000001C
AbortIO	0000000000FC07A6	0000000E
SumKickData	0000000000FC0A78	00000050
FindResident	0000000000FC0AFC	00000030
InitCode	0000000000FC0B2C	00000038
InitResident	0000000000FC0B64	00000058
InitStruct	0000000000FC0C04	00000072
SetSR	0000000000FC115E	0000000C
GetCC	0000000000FC117C	00000008
SuperState	0000000000FC1184	0000000C
UserState	0000000000FC11B0	0000000A
SetIntVector	0000000000FC11CA	00000046
AddIntServer	0000000000FC1210	00000040
RemIntServer	0000000000FC1250	00000048
Cause	0000000000FC135C	00000060
Disable	0000000000FC1428	0000000E
Enable	0000000000FC1436	00000010
AddLibrary	0000000000FC1448	0000000E
RemLibrary	0000000000FC1456	00000016
OldOpenLibrary	0000000000FC146C	00000008
OpenLibrary	0000000000FC1474	0000002E
CloseLibrary	0000000000FC14A2	00000014
SetFunction	0000000000FC14B6	0000001E
SumLibrary	0000000000FC14D4	00000054
MakeLibrary	0000000000FC1528	0000008A
MakeFunctions	0000000000FC15B2	00000036
Insert	0000000000FC15E8	0000002C
AddHead	0000000000FC1614	00000010
AddTail	0000000000FC1624	00000018
Remove	0000000000FC163C	0000000E
RemHead	0000000000FC164A	00000010
RemTail	0000000000FC165A	00000016
Enqueue	0000000000FC1670	00000026
FindName	0000000000FC1696	00000028
Allocate	0000000000FC16D8	00000052
Deallocate	0000000000FC1740	00000090
AllocMem	0000000000FC17D0	0000005C
FreeMem	0000000000FC182C	0000002A
TypeOfMem	0000000000FC1856	00000026
AllocAbs	0000000000FC187C	00000090
AvailMem	0000000000FC190C	0000004E
AllocEntry	0000000000FC195A	0000008E
FreeEntry	0000000000FC19E8	0000003E
AddMemList	0000000000FC1A26	00000054
GetMsg	0000000000FC1BEA	0000002E
ReplyMsg	0000000000FC1C18	0000001A
WaitPort	0000000000FC1C32	00000028
FindPort	0000000000FC1C5A	0000000A
AddResource	0000000000FC1C64	00000008
RemResource	0000000000FC1C6C	00000004
OpenResource	0000000000FC1C70	00000012
AddTask	0000000000FC1C84	000000A4
FindTask	0000000000FC1DB0	00000054
SetTaskPri	0000000000FC1E04	00000050
SetExcept	0000000000FC1E54	000000B8
Wait	0000000000FC1F0C	00000068
AllocTrap	0000000000FC1FCA	00000026
FreeTrap	0000000000FC1FF0	00000010
AllocSignal	0000000000FC2000	00000038
FreeSignal	0000000000FC2038	00000010
RawDoFmt	0000000000FC2124	00000080
Debug	0000000000FC236A	0000000A
Procure	0000000000FC2D98	00000016
Vacate	0000000000FC2DAE	00000022
InitSemaphore	0000000000FC2DD0	00000020
ObtainSemaphore	0000000000FC2DF0	00000050
ReleaseSemaphore	0000000000FC2E40	00000064
AttemptSemaphore	0000000000FC2EA4	00000030
ObtainSemaphoreList	0000000000FC2ED4	00000076
ReleaseSemaphoreList	0000000000FC2F4A	00000016
AddSemaphore	0000000000FC2F60	0000000C
RemSemaphore	0000000000FC2F6C	00000004
FindSemaphore	0000000000FC2F70	0000000A
CopyMemQuick	0000000000FC2F7C	00000004
CopyMem	0000000000FC2F80	00000070
ConfigBoard	0000000000FC4CDA	0000008E
ConfigChain	0000000000FC4E8A	00000056
AllocConfigDev	0000000000FC4EF8	00000016
FreeConfigDev	0000000000FC4F0E	00000012
AllocExpansionMem	0000000000FC4F20	0000004E
AllocBoardMem	0000000000FC4FBC	00000018
FreeBoardMem	0000000000FC4FD4	00000010
FreeExpansionMem	0000000000FC4FF0	00000038
AddConfigDev	0000000000FC5028	0000001C
RemConfigDev	0000000000FC5044	00000020
FindConfigDev	0000000000FC5064	00000036
ReadExpansionByte	0000000000FC509A	0000001C
WriteExpansionByte	0000000000FC50B6	00000014
ReadExpansionRom	0000000000FC50CA	0000005E
ObtainConfigBinding	0000000000FC517A	00000012
ReleaseConfigBinding	0000000000FC518C	00000012
SetCurrentBinding	0000000000FC519E	0000000C
GetCurrentBinding	0000000000FC51AA	00000010
MakeDosNode	0000000000FC51DC	000000D8
AddDosNode	0000000000FC52F0	00000060
AreaMove	0000000000FC5430	00000094
BltClear	0000000000FC54C4	000000E0
Draw	0000000000FC5634	000001C4
InitArea	0000000000FC57F8	0000001E
Move	0000000000FC5818	00000014
MrgCop	0000000000FC582C	0000000C
QBlit	0000000000FC5838	00000016
RectFill	0000000000FC5990	000000B4
SetRGB4	0000000000FC5A44	00000012
WaitBlit	0000000000FC5A58	00000024
WaitTOF	0000000000FC5A7C	00000006
Flood	0000000000FC5AD0	00000014
PolyDraw	0000000000FC5AE4	00000020
ScrollRaster	0000000000FC5B04	00000012
InitRastPort	0000000000FC5B40	0000000A
LoadRGB4	0000000000FC5B4C	00000012
SetRast	0000000000FC5B60	0000006A
BltPattern	0000000000FC5C70	0000003C
WaitBOVP	0000000000FC5E58	00000046
InitTmpRas	0000000000FC5EA0	0000000C
SetAPen	0000000000FC5EAC	00000006
SetBPen	0000000000FC5EB2	00000006
SetDrMd	0000000000FC5EB8	00000016
VBeamPos	0000000000FC5ECE	00000010
AreaDraw	0000000000FC5EE0	00000050
AreaEnd	0000000000FC5F36	000002F2
AndRectRegion	0000000000FC628C	00000010
OrRectRegion	0000000000FC629C	00000010
OrRegionRegion	0000000000FC62AC	00000010
XorRectRegion	0000000000FC62BC	00000010
ClearRegion	0000000000FC62CE	0000000C
DisposeRegion	0000000000FC62DA	0000000C
ClearRectRegion	0000000000FC62E6	00000010
AndRegionRegion	0000000000FC62F6	00000010
XorRegionRegion	0000000000FC6306	00000010
AllocRaster	0000000000FC6318	00000012
FreeRaster	0000000000FC6338	00000014
CopySBitMap	0000000000FC634C	0000000C
SyncSBitMap	0000000000FC6358	0000000C
InitView	0000000000FC6364	00000016
InitVPort	0000000000FC637C	00000010
LockLayerRom	0000000000FC638C	00000016
UnlockLayerRom	0000000000FC63A4	00000016
MakeVPort	0000000000FC63BC	00000010
LoadView	0000000000FC63CC	0000000C
QBSBlit	0000000000FC63D8	000000AA
InitBitMap	0000000000FC6484	00000016
FreeVPortCopLists	0000000000FC649C	0000000E
FreeCopList	0000000000FC64AC	0000000E
OwnBlitter	0000000000FC64BC	00000018
DisownBlitter	0000000000FC64D4	00000068
FreeCprList	0000000000FC653C	0000000E
GetColorMap	0000000000FC654C	00000058
FreeColorMap	0000000000FC65A4	00000024
GetRGB4	0000000000FC65C8	00000018
ScrollVPort	0000000000FC65E0	0000000C
ReadPixel	0000000000FC65EC	00000108
WritePixel	0000000000FC66F4	00000160
ClipBlit	0000000000FC6854	00000018
BltBitMapRastPort	0000000000FC686C	00000018
BltMaskBitMapRastPort	0000000000FC6884	0000001A
SetRGB4CM	0000000000FC6A8C	00000038
DrawEllipse	0000000000FC6AC4	00000016
AttemptLockLayerRom	0000000000FC6ADC	00000016
AreaEllipse	0000000000FC6AF4	000000BC
AddBob	0000000000FC72E0	0000000E
AddVSprite	0000000000FC72EE	0000000E
DoCollision	0000000000FC72FC	0000000C
DrawGList	0000000000FC7308	0000000E
InitGels	0000000000FC7316	00000012
InitMasks	0000000000FC7328	0000000C
RemIBob	0000000000FC7334	00000012
RemVSprite	0000000000FC7346	0000000C
SetCollision	0000000000FC7352	00000012
SortGList	0000000000FC7364	0000000C
AddAnimOb	0000000000FC7370	00000012
Animate	0000000000FC7382	0000000E
GetGBuffers	0000000000FC7390	00000012
InitGMasks	0000000000FC73A2	0000000C
FreeGBuffers	0000000000FC73AE	00000012
BltBitMap	0000000000FC74AA	00000132
BltTemplate	0000000000FC7A12	00000124
ClearEOL	0000000000FC7CC8	00000038
ClearScreen	0000000000FC7D00	00000042
OpenFont	0000000000FC7D84	0000012A
CloseFont	0000000000FC7EAE	0000001E
AddFont	0000000000FC7ECC	0000003A
RemFont	0000000000FC7F06	0000004E
AskFont	0000000000FC7F54	00000012
SetFont	0000000000FC7F66	0000001C
AskSoftStyle	0000000000FC7F82	00000024
SetSoftStyle	0000000000FC7FA6	00000032
TextLength	0000000000FC7FD8	00000060
Text	0000000000FC8038	00000404
CBump	0000000000FC9AB8	0000000C
UCopperListInit	0000000000FC9AC4	00000010
CMove	0000000000FC9AD4	00000012
CWait	0000000000FC9AE6	00000012
GetSprite	0000000000FC9AF8	0000000E
FreeSprite	0000000000FC9B06	0000000C
ChangeSprite	0000000000FC9B12	00000012
MoveSprite	0000000000FC9B24	00000014
NewRegion	0000000000FCF418	00000014
OpenIntuition	0000000000FDFB4C	0000000C
Intuition	0000000000FDFB58	00000006
AddGadget	0000000000FDFB5E	00000012
ClearDMRequest	0000000000FDFB70	0000000C
ClearMenuStrip	0000000000FDFB7C	0000000C
ClearPointer	0000000000FDFB88	0000000C
CloseScreen	0000000000FDFB94	0000000C
CloseWindow	0000000000FDFBA0	0000000C
CloseWorkBench	0000000000FDFBAC	00000006
CurrentTime	0000000000FDFBB2	0000000E
DisplayAlert	0000000000FDFBC0	00000012
DisplayBeep	0000000000FDFBD2	0000000C
DoubleClick	0000000000FDFBDE	00000010
DrawBorder	0000000000FDFBF0	00000014
DrawImage	0000000000FDFC04	00000014
EndRequest	0000000000FDFC18	0000000E
GetDefPrefs	0000000000FDFC26	0000000E
GetPrefs	0000000000FDFC34	0000000E
InitRequester	0000000000FDFC42	0000000C
ItemAddress	0000000000FDFC4E	0000000E
ModifyIDCMP	0000000000FDFC5C	0000000E
NewModifyProp	0000000000FDFC6A	00000004
ModifyProp	0000000000FDFC6E	0000001A
MoveScreen	0000000000FDFC88	00000012
MoveWindow	0000000000FDFC9A	00000012
OffGadget	0000000000FDFCAC	00000010
OffMenu	0000000000FDFCBC	0000000E
OnGadget	0000000000FDFCCA	00000010
OnMenu	0000000000FDFCDA	0000000E
OpenScreen	0000000000FDFCE8	0000000C
OpenWindow	0000000000FDFCF4	0000000C
OpenWorkBench	0000000000FDFD00	00000006
PrintIText	0000000000FDFD06	00000014
RefreshGadgets	0000000000FDFD1A	00000010
RemoveGadget	0000000000FDFD2A	0000000E
ReportMouse	0000000000FDFD38	0000000E
Request	0000000000FDFD46	0000000E
ScreenToBack	0000000000FDFD54	0000000C
ScreenToFront	0000000000FDFD60	0000000C
SetDMRequest	0000000000FDFD6C	0000000E
SetMenuStrip	0000000000FDFD7A	0000000E
SetPointer	0000000000FDFD88	00000014
SetWindowTitles	0000000000FDFD9C	00000010
ShowTitle	0000000000FDFDAC	0000000E
SizeWindow	0000000000FDFDBA	00000012
ViewAddress	0000000000FDFDCC	00000006
ViewPortAddress	0000000000FDFDD2	0000000C
WindowToBack	0000000000FDFDDE	0000000C
WindowToFront	0000000000FDFDEA	0000000C
WindowLimits	0000000000FDFDF6	00000012
SetPrefs	0000000000FDFE08	00000012
IntuiTextLength	0000000000FDFE1A	0000000C
WBenchToBack	0000000000FDFE26	00000006
WBenchToFront	0000000000FDFE2C	00000006
AutoRequest	0000000000FDFE32	00000014
BeginRefresh	0000000000FDFE46	0000000C
BuildSysRequest	0000000000FDFE52	00000014
EndRefresh	0000000000FDFE66	0000000E
FreeSysRequest	0000000000FDFE74	0000000C
MakeScreen	0000000000FDFE80	0000000C
RemakeDisplay	0000000000FDFE8C	00000006
RethinkDisplay	0000000000FDFE92	00000006
AllocRemember	0000000000FDFE98	00000012
sub_FDFEAA	0000000000FDFEAA	0000000C
FreeRemember	0000000000FDFEB6	0000000E
LockIBase	0000000000FDFEC4	0000000C
UnlockIBase	0000000000FDFED0	0000000C
GetScreenData	0000000000FDFEDC	00000012
RefreshGList	0000000000FDFEEE	00000012
AddGList	0000000000FDFF00	00000014
RemoveGList	0000000000FDFF14	00000012
ActivateWindow	0000000000FDFF26	0000000C
RefreshWindowFrame	0000000000FDFF32	0000000C
ActivateGadget	0000000000FDFF3E	00000010
SPFlt	0000000000FE3F28	00000038
SPCmp	0000000000FE3F60	0000003C
SPTst	0000000000FE3F9C	00000028
SPAbs	0000000000FE3FC4	00000006
SPNeg	0000000000FE3FCA	0000000A
SPSub	0000000000FE3FD4	0000010E
SPMul	0000000000FE40E4	0000009A
SPCeil	0000000000FE4228	0000000A
SPFloor	0000000000FE4232	00000056
`;

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