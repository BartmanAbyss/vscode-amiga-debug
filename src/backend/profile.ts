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
		try {
			let str: string = "";
			for(let i = 0; i < this.codeSize; i += 2) {
				str += i.toString(16) + ' ';
			}
			const tmp = path.join(os.tmpdir(), `amiga-sourcemap-${new Date().getTime()}`);
			fs.writeFileSync(tmp, str);

			const objdump = childProcess.spawnSync(this.addr2linePath, ['--addresses', '--inlines', '--functions', `--exe=${this.executable}`, `@${tmp}`]);
			const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
			const uniqueLinesMap: Map<string, number> = new Map();
			let addr = 0;
			let i = 0;

			const getCallFrame = () => {
				const frames: SourceLine[] = [];
				while(!outputs[i].startsWith('0x')) {
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
		} catch(e) { }
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

		const getNode = (callFrame: CallFrame, depth: number): ProfileNode => {
			const key = getNodeKey(callFrame, depth);
			let node = nodeMap.get(key);
			if(node === undefined) {
				const pp = getNode(callFrame, depth - 1);
				const fr = callFrame.frames[depth - 1];
				node = {
					id: nextNodeId++,
					callFrame: {
						scriptId: fr.file,
						functionName: fr.func,
						url: "file:///" + fr.file.replace(/\\/g, "/"),
						lineNumber: fr.line - 1,
						columnNumber: 0
					},
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
			node.hitCount = ticks;
			node.positionTicks.push(tick);
			samples.push(node.id);
			timeDeltas.push(ticks);
			endTime += ticks;
		}
		timeDeltas.push(0);

		const out: Profile = { nodes, startTime, endTime, samples, timeDeltas };
		return JSON.stringify(out);
	}

	public profileAsm(): string {
		const cyclesPerInstr: number[] = [];
		const locations: CallFrame[] = [];
		for(let i = 0; i < this.profileArray.length; i++) {
			cyclesPerInstr.push(this.profileArray[i]);
			locations.push({ frames: [ {
				file: `profile_offset=${(i*4).toString(16)},instr_offset=${(i*2).toString(16)}`,
				line: 1
			}]});
		}

		return this.profileCommon(cyclesPerInstr, locations);
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
		for(let i = 0; i < this.profileArray.length; i++) {
			if(this.profileArray[i] === 0)
				continue;
			const callFrame = this.sourceMap.uniqueLines[this.sourceMap.lines[i]];
			const key = getCallFrameKey(callFrame);
			let functionId = functionMap.get(key);
			if(functionId === undefined) {
				functionId = locations.push(callFrame) - 1;
				cyclesPerFunction.push(0);
				functionMap.set(key, functionId);
			}
			cyclesPerFunction[functionId] += this.profileArray[i];
		}

		return this.profileCommon(cyclesPerFunction, locations);
	}
}
