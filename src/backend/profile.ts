import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { SymbolTable } from './symbols';
import { ICpuProfileRaw, IProfileNode } from '../client/types';
import { SourceLine, CallFrame, DmaRecord, GfxResource, GfxResourceType, GfxResourceFlags } from './profile_types';
import { NR_DMA_REC_HPOS, NR_DMA_REC_VPOS } from '../client/dma';

function getCallFrameKey(callFrame: CallFrame): string {
	let key = "";
	for(let j = 0; j < callFrame.frames.length; j++) {
		if(j > 0)
			key += ':';
		key += callFrame.frames[j].func;
		if(j < callFrame.frames.length - 1)
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
		let str: string = "";
		for(let i = this.codeStart; i < this.codeStart + this.codeSize; i += 2) {
			str += i.toString(16) + ' ';
		}
		const tmp = path.join(os.tmpdir(), `amiga-sourcemap-${new Date().getTime()}`);
		fs.writeFileSync(tmp, str);

		const objdump = childProcess.spawnSync(this.addr2linePath, ['--addresses', '--inlines', '--functions', `--exe=${this.executable}`, `@${tmp}`], { maxBuffer: 100*1024*1024 });
		fs.unlinkSync(tmp);
		if(objdump.status !== 0)
			throw objdump.error;
		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		const uniqueLinesMap: Map<string, number> = new Map();
		let addr = 0;
		let i = 0;

		const getCallFrame = () => {
			const frames: SourceLine[] = [];
			while(i < outputs.length && outputs[i] !== "" && !outputs[i].startsWith('0x')) {
				const func = outputs[i++];
				const output = outputs[i++];
				const split = output.lastIndexOf(':');
				const file = output.substr(0, split);
				const line = parseInt(output.substr(split + 1));
				frames.unshift({ func, file, line });
			}
			return { frames };
		};

		while(i < outputs.length) {
			//assert.equal(outputs[i].startsWith('0x'), true);
			//assert.equal(parseInt(outputs[i].substr(2), 16), addr);
			i++;

			const callFrame = getCallFrame();
			const key = getCallFrameKey(callFrame);
			let value = uniqueLinesMap.get(key);
			if(value === undefined) {
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

export class UnwindTable {
	// for every possible code location
	//   struct unwind {
	//     uint16_t cfa; // (cfaReg << 12) | (u.cfaOfs)
	//     int16_t r13; // ofs from cfa
	//     int16_t ra; // ofs from cfa
	//   }
	public unwind: Int16Array;
	public codeSize: number;

	constructor(private objdumpPath: string, private executable: string, private symbols: SymbolTable) {
		const textSection = symbols.sections.find((section) => section.name === '.text');
		this.codeSize = textSection.size;
		const invalidUnwind: Unwind = {
			cfaOfs: -1,
			cfaReg: -1,
			r13: -1,
			ra: -1
		};
		const unwind: Unwind[] = new Array(this.codeSize).fill(invalidUnwind);

		const objdump = childProcess.spawnSync(this.objdumpPath, ['--dwarf=frames-interp', this.executable], { maxBuffer: 10*1024*1024 });
		if(objdump.status !== 0)
			throw objdump.error;
		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		const locStart = 0;
		let cfaStart = -1;
		let raStart = -1;
		let r13Start = -1;
		let line = 0;

		const cieMap: Map<number, Unwind> = new Map();

		const parseHeader = () => {
			if(outputs[line] === "")
				return;
			const l = outputs[line++];
			cfaStart = l.indexOf("CFA");
			r13Start = l.indexOf("r13");
			raStart = l.indexOf("ra");
		};

		const parseLine = (): { loc: number, unwind: Unwind } => {
			const l = outputs[line++];
			const loc = parseInt(l.substr(locStart, 8), 16);
			const cfaStr = l.substr(cfaStart, l.indexOf(" ", cfaStart) - cfaStart);
			const r13Str = l.substr(r13Start, l.indexOf(" ", r13Start) - r13Start);
			const raStr = l.substr(raStart, l.indexOf(" ", raStart) - raStart);
			const cfaMatch = cfaStr.match(/r([0-9]+)\+([0-9]+)/);
			const cfaReg = parseInt(cfaMatch[1]);
			const cfaOfs = parseInt(cfaMatch[2]);
			const r13 = (() => {
				if(r13Str.startsWith("c-"))
					return parseInt(r13Str.substr(1));
				else
					return -1;
			})();

			if(!(cfaReg === 13 || cfaReg === 15) || !raStr.startsWith("c-"))
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

			if(outputs[line] !== "")
				throw new Error("CIE with multiple entries not supported");
		};

		const parseFDE = () => {
			const match = outputs[line++].match(/[0-9a-f]{8} [0-9a-f]{8} [0-9a-f]{8} FDE cie=([0-9a-f]{8}) pc=([0-9a-f]{8})\.\.([0-9a-f]{8})/);
			const cie = parseInt(match[1], 16);
			const pcStart = parseInt(match[2], 16);
			const pcEnd = parseInt(match[3], 16);
			parseHeader();
			let unw = cieMap.get(cie);
			if(unw.cfaReg === undefined)
				throw new Error("unknown CIE reference");

			let pc = pcStart;
			while(line < outputs.length && outputs[line] !== "") {
				const next = parseLine();
				while(pc < next.loc) {
					if(unwind[pc >> 1] !== invalidUnwind) {
						//console.log("overlap at $" + pc.toString(16) + ". skipping rest of FDE");
						return;
					}
					unwind[pc >> 1] = unw;
					pc += 2;
				}
				pc = next.loc;
				unw = next.unwind;
			}
			while(pc < pcEnd) {
				if(unwind[pc >> 1] !== invalidUnwind) {
					//console.log("overlap at $" + pc.toString(16) + ". skipping rest of FDE");
					return;
				}
				unwind[pc >> 1] = unw;
				pc += 2;
			}
		};

		while(line < outputs.length) {
			if(outputs[line].match(/[0-9a-f]{8} [0-9a-f]{8} [0-9a-f]{8} CIE/))
				parseCIE();
			else if(outputs[line].match(/[0-9a-f]{8} [0-9a-f]{8} [0-9a-f]{8} FDE/))
				parseFDE();
			else
				line++;
		}
		this.unwind = new Int16Array(unwind.length * 3);
		let i = 0;
		for(const u of unwind) {
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
*/

/*
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

export class ProfileFile {
	public chipMemSize: number;
	public chipMem: Uint8Array;
	public bogoMemSize: number;
	public bogoMem: Uint8Array;
	public dmacon: number;
	public customRegs: Uint16Array;
	public dmaRecords: DmaRecord[] = [];
	public gfxResources: GfxResource[] = [];
	public profileArray: Uint32Array;
	public sectionBases: Uint32Array;
	public systemStackLower: number;
	public systemStackUpper: number;
	public stackLower: number;
	public stackUpper: number;

	// CPU cycles per frame: 142102 (according to winuae profiler)
	//   we get 142094 (8 missing), good enough for now?
	// DMA cycles per frame: 227*313*2=142101
	// http://eab.abime.net/showthread.php?t=51883 confirms 313 lines in PAL default

	private static sizeofDmaRec = 20;
	private static sizeofResource = 52;

	constructor(private filename: string) {
		const buffer = fs.readFileSync(filename);
		let bufferOffset = 0;
		this.dmacon = buffer.readUInt16LE(bufferOffset); bufferOffset += 2;
		this.customRegs = new Uint16Array(buffer.buffer, bufferOffset, 256); bufferOffset += 256 * 2;
		this.chipMemSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.chipMem = new Uint8Array(buffer.buffer, bufferOffset, this.chipMemSize); bufferOffset += this.chipMemSize;
		this.bogoMemSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.bogoMem = new Uint8Array(buffer.buffer, bufferOffset, this.bogoMemSize); bufferOffset += this.bogoMemSize;
		const dmaLen = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		const dmaCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		if(dmaLen !== ProfileFile.sizeofDmaRec)
			throw new Error("dmaLen mismatch");
		if(dmaCount !== NR_DMA_REC_HPOS * NR_DMA_REC_VPOS)
			throw new Error(`dmaCount mismatch (${dmaCount} != ${NR_DMA_REC_HPOS * NR_DMA_REC_VPOS})`);
		const dmaBuffer = Buffer.from(buffer.buffer, bufferOffset, dmaLen * dmaCount); bufferOffset += dmaLen * dmaCount;
		for(let i = 0; i < dmaCount; i++) {
			const reg = dmaBuffer.readUInt16LE(i * dmaLen + 0);
			const dat = dmaBuffer.readUInt32LE(i * dmaLen + 4);
			const addr = dmaBuffer.readUInt32LE(i * dmaLen + 8);
			const evt = dmaBuffer.readUInt16LE(i * dmaLen + 12);
			const type = dmaBuffer.readInt16LE(i * dmaLen + 14);
			const extra = dmaBuffer.readUInt16LE(i * dmaLen + 16);
			const intlev = dmaBuffer.readInt8(i * dmaLen + 18);

			if(reg !== 0xffff) {
				this.dmaRecords.push({ reg, dat, addr, evt, type, extra, intlev });
			} else if(evt) {
				this.dmaRecords.push({ evt });
			} else {
				this.dmaRecords.push({});
			}
		}
		const resourceLen = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		const resourceCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		if(resourceLen !== ProfileFile.sizeofResource)
			throw new Error("resourceLen mismatch");
		const resourceBuffer = Buffer.from(buffer.buffer, bufferOffset, resourceLen * resourceCount); bufferOffset += resourceLen * resourceCount;
		for(let i = 0; i < resourceCount; i++) {
			const address = resourceBuffer.readUInt32LE(i * resourceLen + 0);
			const size = resourceBuffer.readUInt32LE(i * resourceLen + 4);
			const name = resourceBuffer.toString('utf8', i * resourceLen + 8, resourceBuffer.indexOf(0, i * resourceLen + 8));
			const type = resourceBuffer.readUInt16LE(i * resourceLen + 40) as GfxResourceType;
			const flags = resourceBuffer.readUInt16LE(i * resourceLen + 42) as GfxResourceFlags;
			const resource: GfxResource = { address, size, name, type, flags };
			switch(type) {
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
			this.gfxResources.push(resource);
		}
		const sectionCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.sectionBases = new Uint32Array(sectionCount);
		for(let i = 0; i < sectionCount; i++, bufferOffset += 4)
			this.sectionBases[i] = buffer.readUInt32LE(bufferOffset);
		this.systemStackLower = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.systemStackUpper = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.stackLower = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		this.stackUpper = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		const profileCount = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;
		if(profileCount !== (buffer.length - bufferOffset) / Uint32Array.BYTES_PER_ELEMENT)
			throw new Error("profileCount mismatch");
		// profileArray may be unaligned, so manually read entries
		//this.profileArray = new Uint32Array(buffer.buffer, bufferOffset, (buffer.length - bufferOffset) / Uint32Array.BYTES_PER_ELEMENT);
		this.profileArray = new Uint32Array(profileCount);
		for(let i = 0; i < profileCount; i++)
			this.profileArray[i] = buffer.readUInt32LE(bufferOffset + i * 4);
	}
}

export function profileCommon(weightPerLocation: number[], sourceLocations: CallFrame[]): ICpuProfileRaw {
	// generate JSON .cpuprofile
	const nodes: IProfileNode[] = [];
	const nodeMap: Map<string, IProfileNode> = new Map();
	const samples: number[] = [];
	const timeDeltas: number[] = [];
	const startTime = 0;
	let endTime = 0;
	let nextNodeId = 1;
	let nextLocationId = 0;

	const getNodeKey = (callFrame: CallFrame, depth: number): string => {
		let key = "";
		for(let i = 0; i < depth; i++)
			key += callFrame.frames[i].func + ":";
		return key;
	};

	const getCallFrame = (callFrame: SourceLine) => {
		return {
			scriptId: callFrame.file,
			functionName: callFrame.func,
			url: callFrame.file.includes(':') ? "file:///" + callFrame.file.replace(/\\/g, "/") : callFrame.file,
			lineNumber: callFrame.line,
			columnNumber: 0
		};
	};

	const getNode = (callFrame: CallFrame, depth: number): IProfileNode => {
		const key = getNodeKey(callFrame, depth);
		let node = nodeMap.get(key);
		if(node === undefined) {
			const pp = getNode(callFrame, depth - 1);
			const fr = callFrame.frames[depth - 1];
			node = {
				id: nextNodeId++,
				callFrame: getCallFrame(fr),
				children: [],
				locationId: nextLocationId++,
				positionTicks: []
			};
			pp.children.push(node.id);
			nodes.push(node);
			nodeMap.set(key, node);
		}

		return node;
	};

	// add root node
	const rootNode: IProfileNode = {
		id: nextNodeId++,
		callFrame: {
			functionName: "(root)",
			scriptId: "0",
			url: "",
			lineNumber: -1,
			columnNumber: -1
		},
		hitCount: 0,
		children: [],
		locationId: nextLocationId++,
		positionTicks: []
	};
	nodes.push(rootNode);
	samples.push(rootNode.id);
	nodeMap.set("", rootNode);

	for(let i = 0; i < weightPerLocation.length; i++) {
		if(weightPerLocation[i] === 0)
			continue;

		const ticks = weightPerLocation[i];
		const loc = sourceLocations[i];
		const fr = sourceLocations[i].frames[sourceLocations[i].frames.length - 1];

		/*const tick: typeof rootNode.positionTicks[0] = {
			line: fr.line,
			ticks,
			startLocationId: nextLocationId++,
			endLocationId: nextLocationId++
		};*/

		const node = getNode(loc, loc.frames.length);
		node.hitCount = ticks;
		//node.positionTicks.push(tick);
		samples.push(node.id);
		timeDeltas.push(ticks);
		endTime += ticks;
	}
	timeDeltas.push(0);

	const out: ICpuProfileRaw = { nodes, startTime, endTime, samples, timeDeltas };
	return out;
}

export class Profiler {
	constructor(private sourceMap: SourceMap, private symbolTable: SymbolTable) {
	}

	public profileTime(profileFile: ProfileFile): string {
		const sameCallstack = (callstack1: CallFrame, callstack2: CallFrame) => {
			if(callstack1.frames.length !== callstack2.frames.length)
				return false;
			for(let i = 0; i < callstack1.frames.length; i++) {
				if(callstack1.frames[i] !== callstack2.frames[i])
					return false;
			}
			return true;
		};
		//const functionMap: Map<string, number> = new Map();

		// same index
		const cycles: number[] = [];
		const locations: CallFrame[] = [];
		let lastLocation = -1;

		const callstack: CallFrame = { frames: [] };
		const lastCallstack: CallFrame = { frames: [] };

		let totalCycles = 0;
		for(const p of profileFile.profileArray) {
			if(p < 0xffff0000) {
				if(p === 0x7fffffff) {
					// IRQ processing
					callstack.frames.push({ func: '[IRQ]', file: '', line: 0 });
				} else {
					let pc = p;
					if(callstack.frames.length)
						pc -= 2; // unwinding gets PC of next instruction, we want the previous!
					const l = this.sourceMap.uniqueLines[this.sourceMap.lines[pc >> 1]];
					for(let i = l.frames.length - 1; i >= 0; i--) {
						callstack.frames.unshift( { ...l.frames[i] });
						if(i !== 0)
							callstack.frames[0].func += " (inlined)";
					}
				}
			} else {
				if(callstack.frames.length === 1 && lastCallstack.frames.length > 1 && callstack.frames[0] === lastCallstack.frames[lastCallstack.frames.length - 1]) // glitches in unwind
					callstack.frames = [...lastCallstack.frames];

				if(callstack.frames.length === 0) // not in our code
					callstack.frames.push({ func: '[External]', file: '', line: 0 });

				if(sameCallstack(callstack, lastCallstack)) {
					cycles[lastLocation] += (0xffffffff - p) | 0;
				} else {
					const callstackCopy = { frames: [...callstack.frames] };
					lastLocation = locations.push(callstackCopy) - 1;
					cycles.push((0xffffffff - p) | 0);
				}
				totalCycles += (0xffffffff - p) | 0;

				lastCallstack.frames = [...callstack.frames];
				callstack.frames.length = 0;
			}
		}
		//console.log("totalCycles", totalCycles);

		// filter symbols
		const sections = this.symbolTable.sections.filter((section) => section.flags.find((f) => f === "ALLOC"));
		const symbols = this.symbolTable.symbols.filter((symbol) => symbol.size > 0 && sections.find((section) => symbol.section === section.name));

		const out: ICpuProfileRaw = { 
			...profileCommon(cycles, locations),
			$amiga: {
				chipMem: Buffer.from(profileFile.chipMem).toString('base64'),
				bogoMem: Buffer.from(profileFile.bogoMem).toString('base64'),
				dmacon: profileFile.dmacon,
				customRegs: Array.from(profileFile.customRegs), 
				dmaRecords: profileFile.dmaRecords,
				gfxResources: profileFile.gfxResources,
				symbols,
				sections,
				systemStackLower: profileFile.systemStackLower,
				systemStackUpper: profileFile.systemStackUpper,
				stackLower: profileFile.stackLower,
				stackUpper: profileFile.stackUpper,
				uniqueCallFrames: this.sourceMap.uniqueLines,
				callFrames: this.sourceMap.lines
			}
		};
		return JSON.stringify(out/*, null, 2*/);
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

		for(const section of this.symbolTable.sections) {
			if(!section.flags.includes('LOAD'))
				continue;

			if(section.name === '.text') {
				for(const line of this.sourceMap.lines) {
					const l = this.sourceMap.uniqueLines[line];
					const callstack: CallFrame = { frames: [] };
					for(let i = 0; i < l.frames.length; i++) {
						callstack.frames.push({ ...l.frames[i] });
						if(i !== 0)
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
				for(const symbol of this.symbolTable.symbols.filter((sym) => sym.section === section.name && sym.size > 0).sort((a, b) => a.address - b.address)) {
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
		const objdump = childProcess.spawnSync(objdumpPath, ['--reloc', '--section=.text', elfPath], { maxBuffer: 10*1024*1024 });
		if(objdump.status !== 0)
			throw objdump.error;
		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		for(const line of outputs) {
			// 00000006 R_68K_32          __preinit_array_end
			// 0000022c R_68K_32          .rodata+0x00000112
			const match = line.match(/^([0-9a-f]{8})\s\S+\s+(\..+)$/);
			if(match) {
				const addr = parseInt(match[1], 16);
				let section = match[2];
				let offset = 0;
				const add = section.indexOf('+0x');
				if(add !== -1) {
					offset = parseInt(section.substr(add + 3), 16);
					section = section.substr(0, add);
				}
				// ignore relocations to known symbols
				const sectionSymbols = sectionMap.get(section);
				if(sectionSymbols === undefined)
					continue;

				if(sectionSymbols.find((sym) => offset >= sym.address && offset < sym.address + sym.size))
					continue;

				const sourceLine = this.sourceMap.uniqueLines[this.sourceMap.lines[addr >> 1]];
				const sourceFrame = { ...sourceLine.frames[sourceLine.frames.length - 1] };
				sourceFrame.func = `${section}+\$${offset.toString(16)} (${sourceFrame.func})`;
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

		for(const sectionName of sectionMap.keys()) {
			const sectionSymbols = sectionMap.get(sectionName).sort((a, b) => a.address - b.address);
			const section = this.symbolTable.sections.find((sec) => sec.name === sectionName);
			let lastEmptySymbol: DataSymbol = null;
			let lastSymbol: DataSymbol = null;
			// guess size of reloc-referenced symbols
			for(const symbol of sectionSymbols) {
				if(lastSymbol && symbol.address === lastSymbol.address) {
					if(lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func !== symbol.callstack.frames[symbol.callstack.frames.length - 1].func)
						lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func += ", " + symbol.callstack.frames[symbol.callstack.frames.length - 1].func;
					continue;
				}
				if(lastEmptySymbol) {
					lastEmptySymbol.size = symbol.address - lastEmptySymbol.address;
					lastEmptySymbol = null;
				}
				if(symbol.size === 0)
					lastEmptySymbol = symbol;
				lastSymbol = symbol;
			}
			if(lastEmptySymbol)
				lastEmptySymbol.size = section.size - lastEmptySymbol.address;

			// add symbols to profile
			let lastAddress = section.lma;
			lastSymbol = null;
			for(const symbol of sectionSymbols) {
				if(lastSymbol && lastSymbol.address === symbol.address)
					continue;
				if(symbol.size === 0)
					continue;
				if(symbol.address > lastAddress) { // gap (unknown symbol)
					locations.push({ frames: [ { func: section.name, file: '', line: lastAddress } ] });
					sizePerFunction.push(symbol.address - lastAddress);
				}
				locations.push(symbol.callstack);
				sizePerFunction.push(symbol.size);
				lastAddress = symbol.address + symbol.size;
				lastSymbol = symbol;
			}
			if(lastAddress < section.size) {
				locations.push({ frames: [ { func: section.name, file: '', line: lastAddress } ] });
				sizePerFunction.push(section.size - lastAddress);
			}
		}
		const out: ICpuProfileRaw = profileCommon(sizePerFunction, locations);
		return JSON.stringify(out, null, 2);
	}
}
