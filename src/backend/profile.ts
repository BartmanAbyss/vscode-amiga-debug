import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { SymbolTable } from './symbols';

export interface SourceLine {
	func?: string;
	file: string;
	line: number;
}

export interface CallFrame {
	frames: SourceLine[];
}

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

	constructor(private addr2linePath: string, private executable: string, private codeSize: number) {
		let str: string = "";
		for(let i = 0; i < this.codeSize; i += 2) {
			str += i.toString(16) + ' ';
		}
		const tmp = path.join(os.tmpdir(), `amiga-sourcemap-${new Date().getTime()}`);
		fs.writeFileSync(tmp, str);

		const objdump = childProcess.spawnSync(this.addr2linePath, ['--addresses', '--inlines', '--functions', `--exe=${this.executable}`, `@${tmp}`], { maxBuffer: 10*1024*1024 });
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
		fs.unlinkSync(tmp);
	}
}

interface Unwind {
	cfaReg: number;
	cfaOfs: number;
	r13: number;
	ra: number;
}

export class UnwindTable {
	private getCodeSize() {
		const objdump = childProcess.spawnSync(this.objdumpPath, ['--headers', this.executable]);
		if(objdump.status !== 0)
			throw objdump.error;

		const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		for(const l of outputs) {
			if(l.indexOf(".text") !== -1) {
				return parseInt(l.substr(18, 8), 16);
			}
		}

		throw new Error("can't get size of .text section");
	}

	// for every possible code location
	//   struct unwind {
	//     uint16_t cfa; // (cfaReg << 12) | (u.cfaOfs)
	//     int16_t r13; // ofs from cfa
	//     int16_t ra; // ofs from cfa
	//   }
	public unwind: Int16Array;

	constructor(private objdumpPath: string, private executable: string) {
		const codeSize = this.getCodeSize();
		const invalidUnwind: Unwind= {
			cfaOfs: -1,
			cfaReg: -1,
			r13: -1,
			ra: -1
		};
		const unwind: Unwind[] = new Array(codeSize).fill(invalidUnwind);

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
					unwind[pc >> 1] = unw;
					pc += 2;
				}
				pc = next.loc;
				unw = next.unwind;
			}
			while(pc < pcEnd) {
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
		//console.log(JSON.stringify(unwind, null, 2));
		//console.log(JSON.stringify(this.unwind, null, 2));
	}
}

/**
 * A parsed .cpuprofile which can be generated from
 * chrome or https://nodejs.org/api/inspector.html#inspector_cpu_profiler
 *
 * https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-Profile
 */
export interface Profile {
	// The list of profile nodes. First item is the root node.
	nodes: ProfileNode[];
	// Profiling start timestamp in microseconds.
	startTime: number;
	// Profiling end timestamp in microseconds.
	endTime: number;
	// Ids of samples top nodes.
	samples: number[];
	// Time intervals between adjacent samples in microseconds.
	// The first delta is relative to the profile startTime.
	timeDeltas: number[];
}

export interface ProfilePositionTick {
	line: number;
	ticks: number;
	startLocationId?: number;
	endLocationId?: number;
}

/**
 * Profile node. Holds callsite information, execution statistics and child nodes.
 * https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ProfileNode
 */
export interface ProfileNode {
	// Unique id of the node.
	id: number;
	// Runtime.CallFrame
	// Function location
	callFrame: {
		// JavaScript function name.
		functionName?: string;
		// JavaScript script id.
		scriptId: string;
		// JavaScript script name or url.
		url: string;
		// JavaScript script line number (0-based).
		lineNumber: number;
		// JavaScript script column number (0-based).
		columnNumber: number;
	};
	// Number of samples where this node was on top of the call stack.
	hitCount?: number;
	// Child node ids.
	children?: number[];
	locationId?: number;
	positionTicks?: ProfilePositionTick[];
}

export class Profiler {
	constructor(private sourceMap: SourceMap, private symbolTable: SymbolTable, private profileArray: Uint32Array) {
	}

	private profileCommon(cyclesPerLocation: number[], sourceLocations: CallFrame[]): string {
		// generate JSON .cpuprofile
		const nodes: ProfileNode[] = [];
		const nodeMap: Map<string, ProfileNode> = new Map();
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
				url: "file:///" + callFrame.file.replace(/\\/g, "/"),
				lineNumber: callFrame.line,
				columnNumber: 0
			};
		};

		const getNode = (callFrame: CallFrame, depth: number): ProfileNode => {
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
		const rootNode: ProfileNode = {
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

		const cyclesPerMicroSecond = 7.093790;

		for(let i = 0; i < cyclesPerLocation.length; i++) {
			if(cyclesPerLocation[i] === 0)
				continue;

			const ticks = (cyclesPerLocation[i] / cyclesPerMicroSecond) | 0;
			const loc = sourceLocations[i];
			const fr = sourceLocations[i].frames[sourceLocations[i].frames.length - 1];

			const tick: ProfilePositionTick = {
				line: fr.line,
				ticks,
				startLocationId: nextLocationId++,
				endLocationId: nextLocationId++
			};

			const node = getNode(loc, loc.frames.length);
			/*if(loc.frames.length === 1)
				node.callFrame = getCallFrame(fr);
			else
				node.callFrame.functionName += " (inlined)";*/
			node.hitCount = ticks;
			//node.positionTicks.push(tick);
			samples.push(node.id);
			timeDeltas.push(ticks);
			endTime += ticks;
		}
		timeDeltas.push(0);

		const out: Profile = { nodes, startTime, endTime, samples, timeDeltas };
		return JSON.stringify(out, null, 2);
	}

	public profileAsm(): string {
		/*const cyclesPerInstr: number[] = [];
		const locations: CallFrame[] = [];
		for(let i = 0; i < this.profileArray.length; i++) {
			cyclesPerInstr.push(this.profileArray[i]);
			locations.push({ frames: [ {
				file: `profile_offset=${(i*4).toString(16)},instr_offset=${(i*2).toString(16)}`,
				line: 1
			}]});
		}

		return this.profileCommon(cyclesPerInstr, locations);*/
		return "";
	}

	public profileLine(): string {
		/*const cyclesPerLine = new Array<number>(this.sourceMap.lines.length).fill(0);
		for(let i = 0; i < this.profileArray.length; i++) {
			cyclesPerLine[this.sourceMap.lines[i]] += this.profileArray[i];
		}

		return this.profileCommon(cyclesPerLine, this.sourceMap.uniqueLines);*/
		return "";
	}

	public profileFunction(): string {
		const functionMap: Map<string, number> = new Map();
		const cyclesPerFunction: number[] = [];
		const locations: CallFrame[] = [];

		const callstack: CallFrame = { frames: [] };
		const lastCallstack: CallFrame = { frames: [] };
		for(const p of this.profileArray) {
			if(p < 0xffff0000) {
				let pc = p;
				if(callstack.frames.length)
					pc -= 2; // unwinding gets PC of next instruction, we want the previous!
				const l = this.sourceMap.uniqueLines[this.sourceMap.lines[pc >> 1]];
				for(let i = l.frames.length - 1; i >= 0; i--) {
					callstack.frames.unshift( { ...l.frames[i] });
					if(i !== 0)
						callstack.frames[0].func += " (inlined)";
				}
			} else {
				if(callstack.frames.length === 1 && lastCallstack.frames.length > 1 && callstack[0] === lastCallstack[lastCallstack.frames.length - 1]) // glitches in unwind
					callstack.frames = [...lastCallstack.frames];

				const key = getCallFrameKey(callstack);
				let functionId = functionMap.get(key);
				if(functionId === undefined) {
					const callstackCopy = { frames: [...callstack.frames] };
					functionId = locations.push(callstackCopy) - 1;
					cyclesPerFunction.push(0);
					functionMap.set(key, functionId);
				}
				cyclesPerFunction[functionId] += ((0xffffffff - p) | 0);

				lastCallstack.frames = [...callstack.frames];
				callstack.frames.length = 0;
			}
		}

		return this.profileCommon(cyclesPerFunction, locations);
	}
}

export class ProfilerTxt {
	constructor(private sourceMap: SourceMap, private symbolTable: SymbolTable, private profileArray: Uint32Array) {
	}

	public profileFunction(): string {
		let output: string = "";
		let callstack: string[] = [];
		let lastCallstack: string[] = [];
		for(const p of this.profileArray) {
			if(p < 0xffff0000) {
				let pc = p;
				if(callstack.length)
					pc -= 2; // unwinding gets PC of next instruction, we want the previous!
				const l = this.sourceMap.uniqueLines[this.sourceMap.lines[pc >> 1]];
				for(let i = l.frames.length - 1; i >= 0; i--)
					callstack.unshift(l.frames[i].func + (i !== 0 ? " (inlined)" : ""));
				//callstack.unshift(p.toString(16).padStart(8, '0') + "=>");
			} else {
				if(callstack.length === 1 && lastCallstack.length > 1 && callstack[0] === lastCallstack[lastCallstack.length - 1]) // glitches in unwind
					callstack = [...lastCallstack];
				output += callstack.join(';') + ' ' + ((0xffffffff - p) | 0) + '\n';
				lastCallstack = [...callstack];
				callstack.length = 0;
			}
		}
		return output;
	}
}

import { FileFormat } from '../client/speedscope/lib/file-format-spec';

export class ProfilerSpeedscope {
	constructor(private sourceMap: SourceMap, private symbolTable: SymbolTable, private profileArray: Uint32Array) {
	}

	public profileFunction(): string {
		const frames: FileFormat.Frame[] = [];
		const samples: number[][] = [];
		const weights: number[] = [];
		const framesMap: Map<string, number> = new Map();
		const getFrame = (sourceLine: SourceLine, inlined: boolean): number => {
			const key = sourceLine.func + '|' + sourceLine.file + '|' + sourceLine.line;
			let n = framesMap.get(key);
			if(n === undefined) {
				n = frames.push({
					name: sourceLine.func + (inlined ? " (inlined)" : ""),
					file: sourceLine.file,
					line: sourceLine.line
				}) - 1;
				framesMap.set(key, n);
			}
			return n;
		};

		let callstack: number[] = [];
		let lastCallstack: number[] = [];
		for(const p of this.profileArray) {
			if(p < 0xffff0000) {
				let pc = p;
				if(callstack.length)
					pc -= 2; // unwinding gets PC of next instruction, we want the previous!
				const l = this.sourceMap.uniqueLines[this.sourceMap.lines[pc >> 1]];
				for(let i = l.frames.length - 1; i >= 0; i--)
					callstack.unshift(getFrame(l.frames[i], i !== 0));
			} else {
				if(callstack.length === 1 && lastCallstack.length > 1 && callstack[0] === lastCallstack[lastCallstack.length - 1]) // glitches in unwind
					callstack = [...lastCallstack];
				samples.push([...callstack]);
				weights.push((0xffffffff - p) | 0);
				lastCallstack = [...callstack];
				callstack.length = 0;
			}
		}
		const profile: FileFormat.SampledProfile = {
			type: FileFormat.ProfileType.SAMPLED,
			name: '', // TODO
			unit: 'none', // TODO
			startValue: 0,
			endValue: 100000, // TODO
			samples,
			weights
		};
		const out: FileFormat.File = {
			$schema: 'https://www.speedscope.app/file-format-schema.json',
			shared: {
				frames
			},
			profiles: [
				profile
			],
			exporter: "amiga-debug"
		};
		return JSON.stringify(out, null, 2);
	}
}
