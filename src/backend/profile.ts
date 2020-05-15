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

export class SourceMap {
	public uniqueLines: SourceLine[] = [];
	public lines: number[] = []; // index into uniqueLines

	constructor(private addr2linePath: string, private executable: string, private codeSize: number) {
		try {
			let str: string = "";
			for(let i = 0; i < this.codeSize; i += 2) {
				str += i.toString(16) + ' ';
			}
			const tmp = path.join(os.tmpdir(), `amiga-sourcemap-${new Date().getTime()}`);
			fs.writeFileSync(tmp, str);

			const objdump = childProcess.spawnSync(this.addr2linePath, [`--exe=${this.executable}`, `@${tmp}`]);
			const outputs = objdump.stdout.toString().split('\n');
			const uniqueLinesMap: Map<string, number> = new Map();
			for(const output of outputs) {
				let value = uniqueLinesMap.get(output);
				if(value === undefined) {
					const split = output.lastIndexOf(':');
					const file = output.substr(0, split);
					const line = parseInt(output.substr(split + 1));
					value = this.uniqueLines.push({ file, line }) - 1;
					uniqueLinesMap.set(output, value);
				}
				this.lines.push(value);
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

	private profileCommon(cyclesPerLocation: number[], sourceLocations: SourceLine[]): string {
		// generate JSON .cpuprofile
		const nodes: ProfileNode[] = [];
		const samples: number[] = [];
		const timeDeltas: number[] = [];
		const startTime = 0;
		let endTime = 0;
		let nextNodeId = 1;
		let nextLocationId = 0;

		// add root node
		nodes.push({
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
			locationId: nextLocationId++
		});
		samples.push(nodes[0].id);

		const cyclesPerMicroSecond = 7.093790;

		for(let i = 0; i < cyclesPerLocation.length; i++) {
			if(cyclesPerLocation[i] === 0)
				continue;

			const ticks = (cyclesPerLocation[i] / cyclesPerMicroSecond) | 0;

			const tick: ProfilePositionTick = {
				line: sourceLocations[i].line,
				ticks,
				startLocationId: nextLocationId++,
				endLocationId: nextLocationId++
			};

			const node: ProfileNode = {
				id: nextNodeId++,
				callFrame: {
					scriptId: sourceLocations[i].file,
					functionName: sourceLocations[i].func,
					url: "file:///" + sourceLocations[i].file.replace(/\\/g, "/"),
					lineNumber: sourceLocations[i].line - 1,
					columnNumber: 0
				},
				hitCount: ticks,
				locationId: nextLocationId++,
				positionTicks: [
					tick
				]
			};

			nodes[0].children.push(node.id); // add to root node
			nodes.push(node);
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
		const locations: SourceLine[] = [];
		for(let i = 0; i < this.profileArray.length; i++) {
			cyclesPerInstr.push(this.profileArray[i]);
			locations.push({
				file: `profile_offset=${(i*4).toString(16)},instr_offset=${(i*2).toString(16)}`,
				line: 1
			});
		}

		return this.profileCommon(cyclesPerInstr, locations);
	}

	public profileLine(): string {
		const cyclesPerLine = new Array<number>(this.sourceMap.lines.length).fill(0);
		for(let i = 0; i < this.profileArray.length; i++) {
			cyclesPerLine[this.sourceMap.lines[i]] += this.profileArray[i];
		}

		return this.profileCommon(cyclesPerLine, this.sourceMap.uniqueLines);
	}

	public profileFunction(): string {
		const functions = this.symbolTable.getFunctionSymbols();
		const cyclesPerFunction: number[] = [];
		const locations: SourceLine[] = [];
		const profileArrayCopy = new Uint32Array(this.profileArray);
		for(const func of functions) {
			let cycles = 0;
			for(let j = func.address >> 1; j < (func.address + func.length) >> 1; j++) {
				cycles += profileArrayCopy[j];
				profileArrayCopy[j] = 0;
			}
			const funcLine = this.sourceMap.uniqueLines[this.sourceMap.lines[func.address >> 1]];
			cyclesPerFunction.push(cycles);
			locations.push({
				func: func.name,
				file: funcLine.file,
				line: funcLine.line
			});
		}

		// not in any known function
		let cycles = 0;
		for(const p of profileArrayCopy) {
			cycles += p;
		}
		cyclesPerFunction.push(cycles);
		locations.push({
			file: "",
			line: -1
		});

		return this.profileCommon(cyclesPerFunction, locations);
	}
}
