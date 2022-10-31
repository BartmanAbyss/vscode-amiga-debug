import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { GetJump, JumpType } from '../client/68k';
import { print_insn_m68k } from '../client/68k-dis';
import { NR_DMA_REC_HPOS, NR_DMA_REC_VPOS } from '../client/dma';
import { IAmigaProfileSplit, ICpuProfileRaw, Register } from '../client/types';
import { profileCommon } from './profile_common';
import { CallFrame, DmaRecord, GfxResource, GfxResourceFlags, GfxResourceType, SourceLine } from './profile_types';
import { SymbolTable } from './symbols';

function getCallFrameKey(callFrame: CallFrame): string {
	let key = "";
	for (let j = 0; j < callFrame.frames.length; j++) {
		if (j > 0)
			key += ':';
		key += callFrame.frames[j].func;
		if (j < callFrame.frames.length - 1)
			key += `(${callFrame.frames[j].file},${callFrame.frames[j].line})`;
	}
	return key;
}

export class SourceMap {
	public uniqueLines: CallFrame[] = [];
	public lines: number[] = []; // index into uniqueLines
	public codeStart: number;
	public codeSize: number;

	constructor(private addr2linePath: string, private executable: string, private symbols: SymbolTable) {
		const textSection = symbols.sections.find((section) => section.name === '.text');
		this.codeStart = textSection.vma;
		this.codeSize = textSection.size;
		let str = "";
		for (let i = this.codeStart; i < this.codeStart + this.codeSize; i += 2) {
			str += i.toString(16) + ' ';
		}
		const tmp = path.join(os.tmpdir(), `amiga-sourcemap-${new Date().getTime()}`);
		fs.writeFileSync(tmp, str);

		const objdump = childProcess.spawnSync(this.addr2linePath, ['--addresses', '--inlines', '--functions', '--demangle', `--exe=${this.executable}`, `@${tmp}`], { maxBuffer: 100 * 1024 * 1024 });
		fs.unlinkSync(tmp);
		if (objdump.status !== 0)
			throw objdump.error;
		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		const uniqueLinesMap: Map<string, number> = new Map();
		let addr = 0;
		let i = 0;

		const getCallFrame = () => {
			const frames: SourceLine[] = [];
			while (i < outputs.length && outputs[i] !== "" && !outputs[i].startsWith('0x')) {
				const func = outputs[i++];
				const output = outputs[i++];
				const split = output.lastIndexOf(':');
				const file = output.substr(0, split);
				const line = parseInt(output.substr(split + 1));
				frames.unshift({ func, file, line });
			}
			return { frames };
		};

		while (i < outputs.length) {
			//assert.equal(outputs[i].startsWith('0x'), true);
			//assert.equal(parseInt(outputs[i].substr(2), 16), addr);
			i++;

			const callFrame = getCallFrame();
			const key = getCallFrameKey(callFrame);
			let value = uniqueLinesMap.get(key);
			if (value === undefined) {
				value = this.uniqueLines.push(callFrame) - 1;
				uniqueLinesMap.set(key, value);
			}
			this.lines.push(value);
			addr += 2;
		}
	}
}

interface Unwind {
	cfaReg: number;
	cfaOfs: number;
	r13: number; // a5 (fp)
	ra: number;
}

export function Disassemble(objdumpPath: string, elfPath: string) {
	const objdump = childProcess.spawnSync(objdumpPath, [
		'--disassemble',
		'--demangle',
		'-l', // include lines
		'-w', // wide output
		elfPath],
		{ maxBuffer: 10 * 1024 * 1024 });
	if (objdump.status !== 0)
		throw objdump.error;
	return objdump.stdout.toString();
}

export class UnwindTable {
	// for every possible code location
	//   struct unwind {
	//     uint16_t cfa; // (cfaReg << 12) | (u.cfaOfs)
	//     int16_t r13; // ofs from cfa
	//     int16_t ra; // ofs from cfa
	//   }
	public unwind: Int16Array;
	public codeSize: number;

	constructor(private objdumpPath: string, private elfPath: string, private symbols: SymbolTable) {
		const textSection = symbols.sections.find((section) => section.name === '.text');
		this.codeSize = textSection.size;
		const invalidUnwind: Unwind = {
			cfaOfs: -1,
			cfaReg: -1,
			r13: -1,
			ra: -1
		};
		let unwind = new Array<Unwind>(this.codeSize).fill(invalidUnwind);

		const objdump = childProcess.spawnSync(this.objdumpPath, ['--dwarf=frames-interp', this.elfPath], { maxBuffer: 10 * 1024 * 1024 });
		if (objdump.status !== 0)
			throw objdump.error;
		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		const locStart = 0;
		let cfaStart = -1;
		let raStart = -1;
		let r13Start = -1;
		let line = 0;

		const cieMap: Map<number, Unwind> = new Map();

		const parseHeader = () => {
			if (outputs[line] === "")
				return;
			const l = outputs[line++];
			cfaStart = l.indexOf("CFA");
			r13Start = l.indexOf("r13");
			raStart = l.indexOf("ra");
		};

		const parseLine = (): { loc: number; unwind: Unwind } => {
			const l = outputs[line++];
			const loc = parseInt(l.substr(locStart, 8), 16);
			const cfaStr = l.substr(cfaStart, l.indexOf(" ", cfaStart) - cfaStart);
			const r13Str = l.substr(r13Start, l.indexOf(" ", r13Start) - r13Start);
			const raStr = l.substr(raStart, l.indexOf(" ", raStart) - raStart);
			const cfaMatch = cfaStr.match(/r([0-9]+)\+([0-9]+)/);
			const cfaReg = parseInt(cfaMatch[1]);
			const cfaOfs = parseInt(cfaMatch[2]);
			const r13 = (() => {
				if (r13Str.startsWith("c-"))
					return parseInt(r13Str.substr(1));
				else
					return -1;
			})();

			if (!(cfaReg === 13 || cfaReg === 15) || !raStr.startsWith("c-"))
				throw new Error(`error parsing UnwindTable in line ${line}: ${l}`);
			const ra = parseInt(raStr.substr(1));
			return { loc, unwind: { cfaReg, cfaOfs, r13, ra } };
		};

		const parseCIE = () => {
			const addr = parseInt(outputs[line++].substr(0, 8), 16);
			parseHeader();
			// only 1 entry
			const { loc, unwind } = parseLine();
			cieMap.set(addr, unwind);

			if (outputs[line] !== "")
				throw new Error("CIE with multiple entries not supported");
		};

		const parseFDE = () => {
			const match = outputs[line++].match(/[0-9a-f]{8} [0-9a-f]{8} [0-9a-f]{8} FDE cie=([0-9a-f]{8}) pc=([0-9a-f]{8})\.\.([0-9a-f]{8})/);
			const cie = parseInt(match[1], 16);
			const pcStart = parseInt(match[2], 16);
			const pcEnd = parseInt(match[3], 16);
			parseHeader();
			let unw = cieMap.get(cie);
			if (unw.cfaReg === undefined)
				throw new Error("unknown CIE reference");

			let pc = pcStart;
			while (line < outputs.length && outputs[line] !== "") {
				const next = parseLine();
				while (pc < next.loc) {
					if (unwind[pc >> 1] !== invalidUnwind) {
						//console.log("overlap at $" + pc.toString(16) + ". skipping rest of FDE");
						return;
					}
					unwind[pc >> 1] = unw;
					pc += 2;
				}
				pc = next.loc;
				unw = next.unwind;
			}
			while (pc < pcEnd) {
				if (unwind[pc >> 1] !== invalidUnwind) {
					//console.log("overlap at $" + pc.toString(16) + ". skipping rest of FDE");
					return;
				}
				unwind[pc >> 1] = unw;
				pc += 2;
			}
		};

		while (line < outputs.length) {
			if (outputs[line].match(/[0-9a-f]{8} [0-9a-f]{8} [0-9a-f]{8} CIE/))
				parseCIE();
			else if (outputs[line].match(/[0-9a-f]{8} [0-9a-f]{8} [0-9a-f]{8} FDE/))
				parseFDE();
			else
				line++;
		}

		// Replace remaining invalid unwinds with default values
		const defaultUnwind: Unwind = {
			cfaOfs: 4,
			cfaReg: 15,
			r13: -1,
			ra: -4
		};
		unwind = unwind.map((uw) => {
			return uw === invalidUnwind
				? defaultUnwind
				: uw;
		});

		this.unwind = new Int16Array(unwind.length * 3);
		let i = 0;
		for (const u of unwind) {
			this.unwind[i++] = (u.cfaReg << 12) | (u.cfaOfs);
			this.unwind[i++] = u.r13;
			this.unwind[i++] = u.ra;
		}
		//console.log(unwind[0x3de>>1]);
		//console.log(unwind[0x3e0>>1]);
		//console.log(unwind[0x3e4>>1]);
		//console.log(JSON.stringify(unwind, null, 2));
		//console.log(JSON.stringify(this.unwind, null, 2));
	}
}

/*
struct dma_rec {
	uae_u16 reg;
	uae_u32 dat;
	uae_u32 addr;
	uae_u16 evt;
	uae_s16 type;
	uae_u16 extra;
	uae_s8 intlev;
};

struct barto_debug_resource {
	unsigned int address;
	unsigned int size;
	char name[32];
	unsigned short enum debug_resource_type type;
	unsigned short enum debug_resource_flags flags;
	union {
		struct bitmap {
			short width;
			short height;
			short numPlanes;
		} bitmap;
		struct palette {
			short numEntries;
		} palette;
	};
};
*/

// represents 1 frame worth of profiling data
export class ProfileFrame {
	public chipsetFlags: number; // see dma.ts@ChipsetFlags
	public customRegs: Uint16Array;
	public dmaRecords: DmaRecord[] = [];
	public gfxResources: GfxResource[] = [];
	public profileCycles: number;
	public idleCycles: number;
	public profileArray: Uint32Array; // format is: pc [pc...] ~0-cycles 16*register
	public screenshot: Uint8Array;
	public screenshotType: string; // 'jpg', 'png'

	// CPU cycles per frame: 142102 (according to winuae profiler)
	//   we get 142094 (8 missing), good enough for now?
	// DMA cycles per frame: 227*313*2=142101
	// http://eab.abime.net/showthread.php?t=51883 confirms 313 lines in PAL default
}

export class ProfileFile {
	public sectionBases: Uint32Array;
	public systemStackLower: number;
	public systemStackUpper: number;
	public stackLower: number;
	public stackUpper: number;

	public kickRomSize: number;
	public kickRom: Uint8Array;
	public chipMemSize: number;
	public chipMem: Uint8Array;
	public bogoMemSize: number;
	public bogoMem: Uint8Array;

	public baseClock: number;
	public cpuCycleUnit: number;

	public frames: ProfileFrame[] = [];

	private static customRegsLen = 256 * 2 + 4 /*chipsetFlags*/ + 4/*RefPtr*/;
	private static sizeofDmaRec = 49;
	private static sizeofResource = 52;

	constructor(private buffer: Buffer) {
		let bufferOffset = 0;
		const numFrames = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		const sectionCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.sectionBases = new Uint32Array(sectionCount);
		for (let i = 0; i < sectionCount; i++, bufferOffset += 4)
			this.sectionBases[i] = buffer.readUInt32LE(bufferOffset);
		this.systemStackLower = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.systemStackUpper = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.stackLower = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.stackUpper = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;

		// kickstart
		this.kickRomSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.kickRom = new Uint8Array(buffer.buffer, bufferOffset, this.kickRomSize); bufferOffset += this.kickRomSize;

		// memory
		this.chipMemSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.chipMem = new Uint8Array(buffer.buffer, bufferOffset, this.chipMemSize); bufferOffset += this.chipMemSize;
		this.bogoMemSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.bogoMem = new Uint8Array(buffer.buffer, bufferOffset, this.bogoMemSize); bufferOffset += this.bogoMemSize;

		// CPU info
		this.baseClock = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.cpuCycleUnit = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		console.log("baseclock", this.baseClock, "cpucycleunit", this.cpuCycleUnit);

		for (let i = 0; i < numFrames; i++) {
			const frame = new ProfileFrame();
			// custom registers
			const customRegsLen = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			const customRegsOffset = bufferOffset;
			frame.chipsetFlags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
			if (customRegsLen !== ProfileFile.customRegsLen)
				throw new Error(`<internal error> customRegsLen mismatch (want ${ProfileFile.customRegsLen}, got ${customRegsLen})`);
			//frame.customRegs = new Uint16Array(buffer.buffer, bufferOffset, 256); bufferOffset += 256 * 2;
			// maybe unaligned, so read manually
			frame.customRegs = new Uint16Array(256);
			for (let i = 0; i < 256; i++) {
				frame.customRegs[i] = buffer.readUInt16BE(bufferOffset); bufferOffset += 2;
			}
			bufferOffset = customRegsOffset + customRegsLen;

			// DMA
			const dmaLen = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			const dmaCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			if (dmaLen !== ProfileFile.sizeofDmaRec)
				throw new Error(`<internal error> dmaLen mismatch (want ${ProfileFile.sizeofDmaRec}, got ${dmaLen})`);
			if (dmaCount !== NR_DMA_REC_HPOS * NR_DMA_REC_VPOS)
				throw new Error(`<internal error> dmaCount mismatch (${dmaCount} != ${NR_DMA_REC_HPOS * NR_DMA_REC_VPOS})`);
			const dmaBuffer = Buffer.from(buffer.buffer, bufferOffset, dmaLen * dmaCount); bufferOffset += dmaLen * dmaCount;
			for (let i = 0; i < dmaCount; i++) {
				const reg = dmaBuffer.readUInt16LE(i * dmaLen + 0);
				const dat = dmaBuffer.readUInt32LE(i * dmaLen + 2);
				const datHi = dmaBuffer.readUInt32LE(i * dmaLen + 2 + 4);
				const size = dmaBuffer.readUInt16LE(i * dmaLen + 10);
				const addr = dmaBuffer.readUInt32LE(i * dmaLen + 12);
				const evt = dmaBuffer.readUInt32LE(i * dmaLen + 16);
				const evtdata = dmaBuffer.readUInt32LE(i * dmaLen + 20);
				const evtdataset = dmaBuffer.readInt8(i * dmaLen + 24);
				const type = dmaBuffer.readInt16LE(i * dmaLen + 25);
				const extra = dmaBuffer.readUInt16LE(i * dmaLen + 27);
				const intlev = dmaBuffer.readInt8(i * dmaLen + 29);
				const ipl = dmaBuffer.readInt8(i * dmaLen + 30);
				const cf_reg = dmaBuffer.readUInt16LE(i * dmaLen + 31);
				const cf_dat = dmaBuffer.readUInt16LE(i * dmaLen + 33);
				const cf_addr = dmaBuffer.readUInt16LE(i * dmaLen + 35);
				const ciareg = dmaBuffer.readUInt32LE(i * dmaLen + 37);
				const ciamask = dmaBuffer.readUInt32LE(i * dmaLen + 41);
				const ciarw = dmaBuffer.readInt8(i * dmaLen + 45);
				const ciavalue = dmaBuffer.readUInt16LE(i * dmaLen + 46);
				const end = dmaBuffer.readInt8(i * dmaLen + 48);

				if (reg !== 0xffff) {
					frame.dmaRecords.push({ reg, dat, datHi, size, addr, evt, type, extra, intlev });
				} else if (evt) {
					frame.dmaRecords.push({ evt });
				} else {
					frame.dmaRecords.push({});
				}
			}

			// resources
			const resourceLen = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			const resourceCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			if (resourceLen !== ProfileFile.sizeofResource)
				throw new Error("resourceLen mismatch");
			const resourceBuffer = Buffer.from(buffer.buffer, bufferOffset, resourceLen * resourceCount); bufferOffset += resourceLen * resourceCount;
			for (let i = 0; i < resourceCount; i++) {
				const address = resourceBuffer.readUInt32LE(i * resourceLen + 0);
				const size = resourceBuffer.readUInt32LE(i * resourceLen + 4);
				const name = resourceBuffer.toString('utf8', i * resourceLen + 8, resourceBuffer.indexOf(0, i * resourceLen + 8));
				const type = resourceBuffer.readUInt16LE(i * resourceLen + 40) as GfxResourceType;
				const flags = resourceBuffer.readUInt16LE(i * resourceLen + 42) as GfxResourceFlags;
				const resource: GfxResource = { address, size, name, type, flags };
				switch (type) {
					case GfxResourceType.bitmap:
						const width = resourceBuffer.readUInt16LE(i * resourceLen + 44);
						const height = resourceBuffer.readUInt16LE(i * resourceLen + 46);
						const numPlanes = resourceBuffer.readUInt16LE(i * resourceLen + 48);
						resource.bitmap = { width, height, numPlanes };
						break;
					case GfxResourceType.palette:
						const numEntries = resourceBuffer.readUInt16LE(i * resourceLen + 44);
						resource.palette = { numEntries };
						break;
				}
				frame.gfxResources.push(resource);
			}

			frame.profileCycles = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			frame.idleCycles = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			//console.log("profileCycles", frame.profileCycles, "idleCycles", frame.idleCycles);

			// profiles
			const profileCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			// profileArray may be unaligned, so manually read entries
			//frame.profileArray = new Uint32Array(buffer.buffer, bufferOffset, (buffer.length - bufferOffset) / Uint32Array.BYTES_PER_ELEMENT);
			frame.profileArray = new Uint32Array(profileCount);
			for (let i = 0; i < profileCount; i++) {
				frame.profileArray[i] = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			}
			const screenshotSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			const screenshotType = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
			if(screenshotType === 0)
				frame.screenshotType = 'jpg';
			else
				frame.screenshotType = 'png';
			frame.screenshot = new Uint8Array(buffer.buffer, bufferOffset, screenshotSize); bufferOffset += screenshotSize;

			this.frames.push(frame);
		}
	}
}

export class Profiler {
	constructor(private sourceMap: SourceMap, private symbolTable: SymbolTable, private kickstartSymbols?: SymbolTable) {
	}

	public profileSavestate(profileFile: ProfileFile): string {
		const out: ICpuProfileRaw[] = [];

		for (const frame of profileFile.frames)
			out.push(this.profileSavestateFrame(profileFile, frame));

		const pcTrace: number[] = [];
		for(const frame of out)
			for(let i = 0; i < frame.$amiga.pcTrace.length; i += 2)
				pcTrace.push(frame.$amiga.pcTrace[i]);

		// store memory only for first frame, will later be reconstructed via dmaRecords for other frames
		out[0].$base = {
			chipMem: Buffer.from(profileFile.chipMem).toString('base64'),
			bogoMem: Buffer.from(profileFile.bogoMem).toString('base64'),
			objdump: this.disassemblePcTrace(profileFile, pcTrace),
			baseClock: profileFile.baseClock,
			cpuCycleUnit: profileFile.cpuCycleUnit,
			symbols: [],
			sections: [],
			systemStackLower: profileFile.systemStackLower,
			systemStackUpper: profileFile.systemStackUpper,
			stackLower: profileFile.stackLower,
			stackUpper: profileFile.stackUpper
		};

		return JSON.stringify(out); //, null, 2);
	}

	private disassemblePcTrace(profileFile: ProfileFile, pcTrace: number[], functions?: Map<number, string>): string {
		pcTrace.sort((a, b) => a - b);
		let disasm = '\n';
		if(!functions) {
			functions = new Map<number, string>();
			disasm = '00000000 <_start>:\n';
		}

		const processBranch = (mem: Uint8Array, addr: number, offset: number) => {
			const mem16 = new Uint16Array(4);
			for(let i = 0; i < 8 && offset + i < mem.length; i += 2) {
				mem16[i >>> 1] = (mem[offset + i] << 8) | mem[offset + i + 1];
			}
			const jump = GetJump(addr, mem16);
			if(jump?.type === JumpType.Jsr)
				functions.set(jump.target, `_${jump.target.toString(16).padStart(8, '0')}`);
		};

		const disasmInsn = (mem: Uint8Array, addr: number, offset: number) => {
			const insn = print_insn_m68k(mem.slice(offset, Math.min(offset + 16, mem.length)), addr);
			if(insn.len > 0) {
				if(functions.has(addr))
					disasm += `${addr.toString(16).padStart(8, '0')} <${functions.get(addr)}>:\n`;
				disasm += ` ${addr.toString(16)}:\t`;
				for(let i = 0; i < insn.len; i += 2)
					disasm += ((mem[offset + i] << 8) | mem[offset + i + 1]).toString(16).padStart(4, '0') + ' ';
				disasm += insn.text + '\n';
				if(insn.text === 'rts' || insn.text === 'rte')
					disasm += '\n';
			}
		};

		const process = (fn: (mem: Uint8Array, addr: number, offset: number) => void) => {
			let lastPC = 0xffff_ffff;
			const kickBase = profileFile.kickRomSize === 512 * 1024 ? 0xf8_0000 : 0xfc_0000;
			for(const pc of pcTrace) {
				if(pc !== lastPC) {
					if(pc > 0 && pc < profileFile.chipMemSize)
						fn(profileFile.chipMem, pc, pc - 0);
					else if(pc >= 0xc0_0000 && pc < 0xc0_0000 + profileFile.bogoMemSize)
						fn(profileFile.bogoMem, pc, pc - 0xc0_0000);
					else if(pc >= kickBase && pc < 0x100_0000)
						fn(profileFile.kickRom, pc, pc - kickBase);
					lastPC = pc;
				}
			}
		};

		process(processBranch);
		process(disasmInsn);

		return disasm;
	}

	private profileSavestateFrame(profileFile: ProfileFile, frame: ProfileFrame): ICpuProfileRaw {
		const pcTrace: number[] = [];
		const registerTrace: number[] = [];

		let lastPC: number;
		let totalCycles = 0;
		for(let i = 0; i < frame.profileArray.length; i++) {
			const p = frame.profileArray[i];
			if (p < 0xffff_0000) {
				if (lastPC === undefined)
					lastPC = p;
			} else {
				const cyc = (0xffff_ffff - p) | 0;

				if (lastPC === undefined)
					lastPC = 0xffff_ffff;
				const registers = frame.profileArray.slice(i + 1, i + 1 + Register._count);
				i += Register._count;
				pcTrace.push(lastPC, cyc);
				registerTrace.push(...registers);
				lastPC = undefined;
				totalCycles += cyc;
			}
		}
		//console.log("totalCycles", totalCycles);

		const out: ICpuProfileRaw = {
			nodes: [],
			startTime: 0,
			endTime: totalCycles,
			$amiga: {
				customRegs: Array.from(frame.customRegs),
				dmaRecords: frame.dmaRecords,
				gfxResources: frame.gfxResources,
				idleCycles: frame.idleCycles,
				chipsetFlags: frame.chipsetFlags,
				uniqueCallFrames: [],
				callFrames: [],
				pcTrace,
				registerTrace
			}
		};
		if (frame.screenshot.length)
			out.screenshot = 'data:image/' + frame.screenshotType + ';base64,' + Buffer.from(frame.screenshot).toString('base64');
		return out;
	}

	public profileTime(profileFile: ProfileFile, disassembly: string): string {
		return JSON.stringify(this.profileTimeInternal(profileFile, disassembly)/*, null, 2*/);
	}

	public async profileTimeSplit(path: string, profileFile: ProfileFile, disassembly: string, callback: (curFrame: number, numFrames: number) => void) {
		const frames = this.profileTimeInternal(profileFile, disassembly);
		const screenshots = frames.map((frame) => frame.screenshot);
		frames.forEach((frame) => { 
			frame.screenshot = undefined; 
		});
		const out: IAmigaProfileSplit = {
			$id: 'IAmigaProfileSplit',
			numFrames: frames.length,
			firstFrame: frames.shift(),
			screenshots
		};
		const writeFile = util.promisify(fs.writeFile);
		callback(0, out.numFrames);
		await writeFile(`${path}.amigaprofile`, JSON.stringify(out));
		for(let i = 0; i < frames.length; i++) {
			callback(i + 1, out.numFrames);
			await writeFile(`${path}_${(i+1).toString().padStart(2, '0')}.amigaprofile`, JSON.stringify(frames[i]));
		}
	}

	private profileTimeInternal(profileFile: ProfileFile, disassembly: string): ICpuProfileRaw[] {
		const out: ICpuProfileRaw[] = [];

		for (const frame of profileFile.frames)
			out.push(this.profileTimeFrame(profileFile, frame));

		// disassemble kickstart
		const kickTrace: number[] = [];
		for(const frame of out)
			for(let i = 0; i < frame.$amiga.pcTrace.length; i += 2)
				if(frame.$amiga.pcTrace[i] >= 0xf8_0000 && frame.$amiga.pcTrace[i] < 0x100_0000)
					kickTrace.push(frame.$amiga.pcTrace[i]);
		const kickFunctions = new Map<number, string>();
		if(this.kickstartSymbols) {
			for(const f of this.kickstartSymbols.getFunctionSymbols())
				kickFunctions.set(f.base + f.address, '[Kick]' + f.name);
		}

		// filter symbols
		const sections = this.symbolTable.sections.filter((section) => section.flags.find((f) => f === "ALLOC"));
		const symbols = this.symbolTable.symbols.filter((symbol) => symbol.size > 0 && sections.find((section) => symbol.section === section.name));
		
		// store memory only for first frame, will later be reconstructed via dmaRecords for other frames
		out[0].$base = {
			chipMem: Buffer.from(profileFile.chipMem).toString('base64'),
			bogoMem: Buffer.from(profileFile.bogoMem).toString('base64'),
			objdump: disassembly + this.disassemblePcTrace(profileFile, kickTrace, kickFunctions),
			baseClock: profileFile.baseClock,
			cpuCycleUnit: profileFile.cpuCycleUnit,
			symbols, 
			sections,
			systemStackLower: profileFile.systemStackLower,
			systemStackUpper: profileFile.systemStackUpper,
			stackLower: profileFile.stackLower,
			stackUpper: profileFile.stackUpper
		};

		return out;
	}

	private profileTimeFrame(profileFile: ProfileFile, frame: ProfileFrame): ICpuProfileRaw {
		const sameCallstack = (callstack1: CallFrame, callstack2: CallFrame) => {
			if (callstack1.frames.length !== callstack2.frames.length)
				return false;
			for (let i = 0; i < callstack1.frames.length; i++) {
				if (callstack1.frames[i] !== callstack2.frames[i])
					return false;
			}
			return true;
		};

		// same index
		const cycles: number[] = [];
		const locations: CallFrame[] = [];
		let lastLocation = -1;

		const callstack: CallFrame = { frames: [] };
		const lastCallstack: CallFrame = { frames: [] };
		const pcTrace: number[] = [];
		const registerTrace: number[] = [];
		let lastPC: number;

		let totalCycles = 0;
		for(let i = 0; i < frame.profileArray.length; i++) {
			const p = frame.profileArray[i];
			if (p < 0xffff_0000) { // PC
				if(lastPC === undefined)
					lastPC = p;
				if(p === 0x7fff_ffff) {
					// IRQ processing
					callstack.frames.push({ func: '[IRQ]', file: '', line: 0 });
				} else if(p >= 0xf8_0000 && p < 0x100_0000) {
					// in Kickstart
					for(const f of lastCallstack.frames)
						if(f.file !== '')
							callstack.frames.push(f);
					let func = '[Kickstart]';
					if(this.kickstartSymbols) {
						const sym = this.kickstartSymbols.getFunctionAtAddress(p, true);
						if(sym)
							func = '[Kick]' + sym.name;
					}
					callstack.frames.push({ func, file: '', line: 0 });
				} else {
					let pc = p;
					if (callstack.frames.length)
						pc -= 2; // unwinding gets PC of next instruction, we want the previous!
					const l = this.sourceMap.uniqueLines[this.sourceMap.lines[pc >> 1]];
					for (let i = l.frames.length - 1; i >= 0; i--) {
						callstack.frames.unshift({ ...l.frames[i] });
						if (i !== 0)
							callstack.frames[0].func += " (inlined)";
					}
				}
			} else { // #Cycles
				const cyc = (0xffff_ffff - p) | 0;
				if (lastPC === undefined)
					lastPC = 0xffff_ffff;
				const registers = frame.profileArray.slice(i + 1, i + 1 + Register._count);
				i += Register._count;
				pcTrace.push(lastPC, cyc);
				registerTrace.push(...registers);
				lastPC = undefined;

				if(callstack.frames.length === 0) { // not in our code
					callstack.frames.push(...lastCallstack.frames);
					if(callstack.frames.length === 0 || callstack.frames[callstack.frames.length - 1].func !== '[External]')
						callstack.frames.push({ func: '[External]', file: '', line: 0 });
				}

				if (sameCallstack(callstack, lastCallstack)) {
					cycles[lastLocation] += cyc;
				} else {
					const callstackCopy = { frames: [...callstack.frames] };
					lastLocation = locations.push(callstackCopy) - 1;
					cycles.push(cyc);
				}
				totalCycles += cyc;

				lastCallstack.frames = [...callstack.frames];
				callstack.frames.length = 0;
			}
		}
		//console.log("totalCycles", totalCycles);


		const out: ICpuProfileRaw = {
			...profileCommon(cycles, locations),
			$amiga: {
				chipsetFlags: frame.chipsetFlags,
				customRegs: Array.from(frame.customRegs),
				dmaRecords: frame.dmaRecords,
				gfxResources: frame.gfxResources,
				idleCycles: frame.idleCycles,
				uniqueCallFrames: this.sourceMap.uniqueLines,
				callFrames: this.sourceMap.lines,
				pcTrace,
				registerTrace
			}
		};
		if (frame.screenshot)
			out.screenshot = 'data:image/jpg;base64,' + Buffer.from(frame.screenshot).toString('base64');
		return out;
	}

	public profileSize(objdumpPath: string, elfPath: string) {
		interface DataSymbol {
			callstack: CallFrame;
			address: number;
			size: number;
		}
		type SymbolMap = DataSymbol[];
		const sectionMap: Map<string, SymbolMap> = new Map();

		const sizePerFunction: number[] = [];
		const locations: CallFrame[] = [];

		for (const section of this.symbolTable.sections) {
			if (!section.flags.includes('LOAD'))
				continue;

			if (section.name === '.text') {
				for (const line of this.sourceMap.lines) {
					const l = this.sourceMap.uniqueLines[line];
					const callstack: CallFrame = { frames: [] };
					for (let i = 0; i < l.frames.length; i++) {
						callstack.frames.push({ ...l.frames[i] });
						if (i !== 0)
							callstack.frames[callstack.frames.length - 1].func += " (inlined)";
					}

					// section node
					callstack.frames.unshift({
						func: ".text",
						file: '',
						line: 0
					});
					locations.push(callstack);
					sizePerFunction.push(2);
				}
			} else {
				const symbols: SymbolMap = [];
				for (const symbol of this.symbolTable.symbols.filter((sym) => sym.section === section.name && sym.size > 0).sort((a, b) => a.address - b.address)) {
					const callstack: CallFrame = {
						frames: [
							{
								func: section.name,
								file: '',
								line: 0
							},
							{
								func: symbol.name,
								file: section.name,
								line: symbol.address
							}
						]
					};
					symbols.push({
						callstack,
						address: symbol.address,
						size: symbol.size
					});
				}
				sectionMap.set(section.name, symbols);
			}
		}

		// for unknown symbols, try to infer usage from relocations
		const objdump = childProcess.spawnSync(objdumpPath, ['--reloc', '--section=.text', elfPath], { maxBuffer: 10 * 1024 * 1024 });
		if (objdump.status !== 0)
			throw objdump.error;
		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		for (const line of outputs) {
			// 00000006 R_68K_32          __preinit_array_end
			// 0000022c R_68K_32          .rodata+0x00000112
			const match = line.match(/^([0-9a-f]{8})\s\S+\s+(\..+)$/);
			if (match) {
				const addr = parseInt(match[1], 16);
				let section = match[2];
				let offset = 0;
				const add = section.indexOf('+0x');
				if (add !== -1) {
					offset = parseInt(section.substr(add + 3), 16);
					section = section.substr(0, add);
				}
				// ignore relocations to known symbols
				const sectionSymbols = sectionMap.get(section);
				if (sectionSymbols === undefined)
					continue;

				if (sectionSymbols.find((sym) => offset >= sym.address && offset < sym.address + sym.size))
					continue;

				const sourceLine = this.sourceMap.uniqueLines[this.sourceMap.lines[addr >> 1]];
				const sourceFrame = { ...sourceLine.frames[sourceLine.frames.length - 1] };
				sourceFrame.func = `${section}+$${offset.toString(16)} (${sourceFrame.func})`;
				const callstack: CallFrame = {
					frames: [
						{
							func: section,
							file: '',
							line: 0
						},
						sourceFrame
					]
				};
				sectionSymbols.push({
					callstack,
					address: offset,
					size: 0
				});
			}
		}

		for (const sectionName of sectionMap.keys()) {
			const sectionSymbols = sectionMap.get(sectionName).sort((a, b) => a.address - b.address);
			const section = this.symbolTable.sections.find((sec) => sec.name === sectionName);
			let lastEmptySymbol: DataSymbol = null;
			let lastSymbol: DataSymbol = null;
			// guess size of reloc-referenced symbols
			for (const symbol of sectionSymbols) {
				if (lastSymbol && symbol.address === lastSymbol.address) {
					if (lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func !== symbol.callstack.frames[symbol.callstack.frames.length - 1].func)
						lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func += ", " + symbol.callstack.frames[symbol.callstack.frames.length - 1].func;
					continue;
				}
				if (lastEmptySymbol) {
					lastEmptySymbol.size = symbol.address - lastEmptySymbol.address;
					lastEmptySymbol = null;
				}
				if (symbol.size === 0)
					lastEmptySymbol = symbol;
				lastSymbol = symbol;
			}
			if (lastEmptySymbol)
				lastEmptySymbol.size = section.size - lastEmptySymbol.address;

			// add symbols to profile
			let lastAddress = section.lma;
			lastSymbol = null;
			for (const symbol of sectionSymbols) {
				if (lastSymbol && lastSymbol.address === symbol.address)
					continue;
				if (symbol.size === 0)
					continue;
				if (symbol.address > lastAddress) { // gap (unknown symbol)
					locations.push({ frames: [{ func: section.name, file: '', line: lastAddress }] });
					sizePerFunction.push(symbol.address - lastAddress);
				}
				locations.push(symbol.callstack);
				sizePerFunction.push(symbol.size);
				lastAddress = symbol.address + symbol.size;
				lastSymbol = symbol;
			}
			if (lastAddress < section.size) {
				locations.push({ frames: [{ func: section.name, file: '', line: lastAddress }] });
				sizePerFunction.push(section.size - lastAddress);
			}
		}
		const out: ICpuProfileRaw[] = [profileCommon(sizePerFunction, locations)];
		return JSON.stringify(out, null, 2);
	}
}
