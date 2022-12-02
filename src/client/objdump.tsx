import { Component, FunctionComponent, JSX, Ref } from 'preact';
import { StateUpdater, useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { GetJump, JumpType } from "./68k";
import { DropdownComponent, DropdownOptionProps } from './dropdown';
import { Icon } from './icons';
import * as SymbolMethod from './icons/symbol-method.svg';
import { IProfileModel } from './model';
import styles from './objdump.module.css';
import { Scrollable } from "./scrollable";
import './styles.css';
import { IOpenDocumentMessage, Register } from './types';
import { useCssVariables } from './useCssVariables';
import { Absolute, VirtualList } from './virtual_list';
import { VsCodeApi } from "./vscodeApi";
import Highlighter from 'react-highlight-words';
import { resolvePath } from './pathResolve';
import { GetCpuDoc } from './docs';
import { FindCallback, Find } from './find';
import { ToggleButton } from './button';
import { formatTimingTable, InstructionTiming, instructionTimings } from '../m68ktimings';
import { decodeInstruction } from 'm68kdecode';
import { StyledMarkdown } from './styledMarkdown';

// messages from webview to vs code
export interface IOpenDocumentMessageObjview {
	type: 'openDocument';
	file: string;
	line: number;
}

export interface Location {
	file: string;
	normalizedFile: string;
	line: number;
}

export interface JumpInfo {
	start: number[];
	end: number;
	level: number;
	type: JumpType;
}

export interface Line {
	pc?: number;
	traceHits?: number;
	traceCycles?: number;
	theoreticalCycles?: InstructionTiming;
	opcode?: string;
	rest?: string;
	text: string;
	loc?: Location;
}

export interface Function {
	name: string;
	pc: number;
	end: number;
}

export class ObjdumpModel {
	public content: Line[] = [];
	public functions: Function[] = [];
	public jumps: JumpInfo[] = [];

	private addJumps(func: Function, funcJumps: JumpInfo[]) {
		//console.time('addJumps');
		const sortedJumps = funcJumps.filter((j) => j.end >= func.pc && j.end < func.end).sort((a: JumpInfo, b: JumpInfo) => {
			const aMin  = Math.min(...a.start, a.end);
			const bMin  = Math.min(...b.start, b.end);
			const aSize = Math.max(...a.start, a.end) - aMin;
			const bSize = Math.max(...b.start, b.end) - bMin;
			if(aSize === bSize)
				return aMin - bMin;
			else
				return aSize - bSize;
		});

		function jumpIntersects(a: JumpInfo, b: JumpInfo): boolean {
			const aMin = Math.min(...a.start, a.end);
			const bMin = Math.min(...b.start, b.end);
			const aMax = Math.max(...a.start, a.end);
			const bMax = Math.max(...b.start, b.end);
			return aMax >= bMin && aMin <= bMax;
		}

		//console.log(`func: ${func.name}`);
		let maxLevel = -1;
		for(let i = 0; i < sortedJumps.length; i++) {
			if(sortedJumps[i].level !== -1)
				continue;
			sortedJumps[i].level = ++maxLevel;
			const currentGroup: number[] = [i];
			for(let j = i + 1; j < sortedJumps.length; j++) {
				if(sortedJumps[j].level !== -1)
					continue;
				if(currentGroup.every((e) => sortedJumps[j].level !== -1 || !jumpIntersects(sortedJumps[e], sortedJumps[j]))) {
					sortedJumps[j].level = maxLevel;
					currentGroup.push(j);
				}
			}
			//console.log(`  level ${maxLevel}: ${JSON.stringify(currentGroup)}`);
		}
		this.jumps.push(...sortedJumps);
		//console.timeEnd('addJumps');
	}

	constructor(objdump: string, theoreticalCycles = true, pcTrace: number[] = []) {
		const lines = objdump.replace(/\r/g, '').split('\n');
		let loc: Location;
		let funcJumps: JumpInfo[] = [];

		const hits = new Map<number, number>();
		const cycles = new Map<number, number>();
		for(let i = 0; i < pcTrace.length; i += 2) {
			hits.set(pcTrace[i], (hits.get(pcTrace[i]) || 0) + 1);
			cycles.set(pcTrace[i], (cycles.get(pcTrace[i]) || 0) + pcTrace[i + 1]);
		}

		for(const line of lines) {
			const funcMatch = line.match(/([0-9a-f]+) <(.*)>:$/); // 00000000 <_start>:
			if(funcMatch) {
				const pc = parseInt(funcMatch[1], 16);
				if(this.functions.length) {
					this.functions[this.functions.length - 1].end = pc;
					this.addJumps(this.functions[this.functions.length - 1], funcJumps);
					funcJumps = [];
				}
				this.functions.push({
					name: funcMatch[2],
					pc,
					end: 0x7fff_ffff
				});
			}

			const locMatch = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/); // C:/Users/Chuck/Documents/Visual_Studio_Code/amiga-debug/template/support/gcc8_c_support.c:62 (discriminator 1)
			if(locMatch) {
				loc = { file: locMatch[1], normalizedFile: resolvePath(locMatch[1]), line: parseInt(locMatch[2]) };
				continue;
			}

			//                                PC             HEX WORDS           OPCODE REST
			const insnMatch = line.match(/^ *([0-9a-f]+):\t((?:[0-9a-f]{4} )+)\s*(\S+)(?:\s(.*))?$/); //      cce:	0c40 a00e      	cmpi.w #-24562,d0
			if(insnMatch) {
				const pc = parseInt(insnMatch[1], 16);
				const hex = insnMatch[2].split(' ');
				const opcode = insnMatch[3];
				const rest = insnMatch[4] || '';
				const insn = new Uint16Array(hex.length);
				const bytes = new Uint8Array(hex.length * 2);
				hex.forEach((h, i) => {
					insn[i] = parseInt(h, 16);
					bytes[i * 2] = parseInt(h.substring(0, 2), 16);
					bytes[i * 2 + 1] = parseInt(h.substring(2, 4), 16);
				});
				const jump = GetJump(pc, insn);
				if(jump) {
					const jumpInfo = funcJumps.find((j) => j.end === jump.target && j.type === jump.type);
					if(jumpInfo)
						jumpInfo.start.push(pc);
					else
						funcJumps.push({ start: [pc], end: jump.target, level: -1, type: jump.type });
				}
				let timings: InstructionTiming | undefined;
				if (theoreticalCycles) {
					try {
						const decoded = decodeInstruction(bytes);
						timings = instructionTimings(decoded.instruction);
					} catch (err) {
						console.log(err);
					}
				}
				this.content.push({
					pc,
					text: `${pc.toString(16).padStart(8, ' ')}: ${opcode.padEnd(7, ' ')} ${rest}`,
					opcode,
					rest,
					theoreticalCycles: timings,
					loc,
					traceHits: hits.get(pc),
					traceCycles: cycles.get(pc)
				});
				loc = undefined;
			} else {
				this.content.push({ text: line });
			}
		}
		if(this.functions.length)
			this.addJumps(this.functions[this.functions.length - 1], funcJumps);
	}
}

interface JumpAbsolute extends JumpInfo, Absolute {}

class VirtualListLine extends VirtualList<Line, JumpAbsolute> {}

declare const MODELS: IProfileModel[]; // for profiling
declare const OBJDUMP: string; // for 'Disassemble ELF File'

const integerFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0
});

const FunctionItem: FunctionComponent<DropdownOptionProps<Function>> = ({ option, placeholder }) => {
	return <div class={styles.function} style={ placeholder ? {paddingRight: '20px'} : {}}><Icon i={SymbolMethod} />{option.name}</div>;
};

// do not move into 'AssemblyView' otherwise the Dropdown will be recreated on every render
class FunctionDropdown extends DropdownComponent<Function> {
	public static defaultProps = { optionComponent: FunctionItem, menuClassName: styles.gfxresource_menu, ...DropdownComponent.defaultProps };
}

// used with { frame, time } for profiling, frame === -1 for 'Disassemble ELF File'
export const ObjdumpView: FunctionComponent<{
	frame?: number;
	time?: number;
	setMemoryAddr?: StateUpdater<number>;
}> = ({ frame = -1, time = -1, setMemoryAddr }) => {
	const cssVariables = useCssVariables();
	const rowHeight = parseInt(cssVariables['editor-font-size']) + 3; // needs to match CSS
	const [model, setModel] = useState<ObjdumpModel>(() => {
		if(frame === -1)
			return new ObjdumpModel(OBJDUMP);

		return new ObjdumpModel(MODELS[0].base.objdump, MODELS[0].base.cpuCycleUnit === 256 ? true : false, MODELS[frame].amiga.pcTrace); // theoretical cycles only for 7MHz (68000)
	});
	const [opacity, setOpacity] = useState(1.0);
	const [showSource, setShowSource] = useState(false);
	const [showRegisters, setShowRegisters] = useState(true);

	const [content, functions, jumps] = useMemo(() => {
		const pcMap = new Map<number, number>(); // pc -> row index
		model.content.forEach((line, index) => {
			if(line.pc !== undefined)
				pcMap.set(line.pc, index);
		});


		const jumps: JumpAbsolute[] = model.jumps.filter((jump) =>
			[...jump.start, jump.end].every((pc) => pcMap.has(pc))
		).map((jump) => {
			const min  = pcMap.get(Math.min(...jump.start, jump.end));
			const max  = pcMap.get(Math.max(...jump.start, jump.end));
			return {
				start: jump.start.map((j) => pcMap.get(j)),
				end: pcMap.get(jump.end),
				level: jump.level,
				type: jump.type,
				top: min * rowHeight,
				height: (max - min + 1) * rowHeight
			};
		});
		return [model.content, model.functions.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())), jumps];
	}, [model, rowHeight]);

	const [curRow, setCurRow] = useState(0);

	// Find
	const [find, setFind] = useState<{ text: string; internal: boolean }>({ text: '', internal: true });
	const [curFind, setCurFind] = useState(0);
	const findRef = useRef<FindCallback>();
	const findResult = useMemo(() => {
		console.time("findResult");
		const result: number[] = [];
		if(find.text.length > 0) {
			if(find.internal) {
				content.forEach((line, index) => {
					if(line.text.toLowerCase().includes(find.text.toLowerCase()))
						result.push(index);
				});
			} else {
				const findLoc = resolvePath(find.text.replace(/\\/g, '/')).toLowerCase();
				content.forEach((line, index) => {
					if(line.loc) {
						const loc = `${line.loc.normalizedFile.toLowerCase()}:${line.loc.line}`;
						if(loc === findLoc)
							result.push(index);
					}
				});
			}
		}
		if(result.length > 0) {
			setCurFind(0);
			setCurRow(result[0]);
		}
		console.timeEnd("findResult");
		return result;
	}, [content, find]);

	const [row, pc, func, regs] = useMemo(() => {
		const [row, regs] = (() => {
			if(frame === -1 || findResult.length)
				return [curRow, []];
			const pcTrace = MODELS[frame].amiga.pcTrace;
			let t = 0;
			let pc = 0;
			let regs: number[];
			for(let i = 0; i < pcTrace.length; i += 2) {
				pc = pcTrace[i];
				t += pcTrace[i + 1];
				if(t > time) {
					if(MODELS[frame].amiga.registerTrace)
						regs = MODELS[frame].amiga.registerTrace.slice((i >> 1) * Register._count, ((i >> 1) + 1) * Register._count);
					break;
				}
			}
			return [content.findIndex((l) => l.pc === pc), regs];
		})();
		const pc = (row !== -1 ? content[row].pc : undefined) || 0xffff_ffff;
		//console.log(pc.toString(16));
		let func = functions.find((f: Function) => pc >= f.pc && pc < f.end);
		if(pc === 0x7fff_ffff)
			func = { name: '[IRQ]', pc: 0x7fff_ffff, end: 0x7fff_ffff };
		if(pc === 0xffff_ffff)
			func = { name: '[External]', pc: 0xffff_ffff, end: 0xffff_ffff };
		return [row, pc, func, regs];
	}, [frame, time, content, curRow, findResult.length]);

	const onClickLoc = useCallback((evt: JSX.TargetedMouseEvent<HTMLElement>) => {
		VsCodeApi.postMessage<IOpenDocumentMessage>({
			type: 'openDocument',
			location: {
				lineNumber: parseInt(evt.currentTarget.attributes.getNamedItem('data-line').value),
				columnNumber: 0,
				source: { path: evt.currentTarget.attributes.getNamedItem('data-file').value }
			},
			toSide: true,
		});
	}, []);

	const [hovered, setHovered] = useState<{ markdown: string; x: number; y: number; justify: string; width?: number; }>({ markdown: '', x: -1, y: -1, justify: '' });
	const [hoveredTimings, setHoveredTimings] = useState<{ markdown: string; x: number; y: number; justify: string; }>({ markdown: '', x: -1, y: -1, justify: '' });
	const tooltipRef = useRef<HTMLDivElement & { scroller: Scrollable }>();

	const onMouseEnterOpcode = useCallback((evt: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
		const opcode = evt.currentTarget.attributes['data'].nodeValue as string;
		const rect = evt.currentTarget.getBoundingClientRect();
		const markdown = GetCpuDoc(opcode);
		const width = 550;
		const maxHeight = 260;
		if(markdown) {
			const hov = {
				markdown,
				x: Math.min(rect.left, window.innerWidth - width + 30),
				y: rect.bottom < window.innerHeight - maxHeight ? rect.bottom + 10 : rect.top - maxHeight,
				justify: rect.bottom < window.innerHeight - maxHeight ? 'flex-start' : 'flex-end'
			};
			setHovered(hov);
		}
	}, []);
	const onMouseLeaveOpcode = useCallback(() => {
		setHovered({ markdown: '', x: -1, y: -1, justify: '' });
	}, []);
	const onWheelOpcode = useCallback((evt: WheelEvent) => {
		evt.preventDefault();
		tooltipRef.current.scroller ??= new Scrollable(tooltipRef.current, 135);
		tooltipRef.current.scroller.setScrollPositionSmooth(tooltipRef.current.scroller.getFutureScrollPosition() + evt.deltaY);
	}, [tooltipRef.current]);

	const onMouseEnterTiming = useCallback((evt: JSX.TargetedMouseEvent<HTMLSpanElement>, timings: InstructionTiming) => {
		const rect = evt.currentTarget.getBoundingClientRect();
		const markdown = formatTimingTable(timings);
		const maxHeight = 100;
		if(markdown) {
			const hov = {
				markdown,
				maxHeight,
				x: rect.left,
				y: rect.bottom < window.innerHeight - maxHeight ? rect.bottom + 10 : rect.top - maxHeight,
				justify: rect.bottom < window.innerHeight - maxHeight ? 'flex-start' : 'flex-end'
			};
			setHoveredTimings(hov);
		}
	}, []);
	const onMouseLeaveTiming = useCallback(() => {
		setHoveredTimings({ markdown: '', x: -1, y: -1, justify: '' });
	}, []);

	const renderRow = useCallback((c: Line, index: number) => {
		const extra: string[] = [];

		function getLoc(row: number) {
			for(let i = row; i > 0; i--) {
				if(content[i].loc !== undefined)
					return content[i].loc;
			}
		}

		if(index === row) {
			extra.push(styles.cur);
		} else if(row !== -1 && content[row].pc !== undefined && content[index].pc !== undefined) {
			// highlight rows with the same source location as the current row
			const curLoc = getLoc(row);
			if(curLoc) {
				const loc = getLoc(index);
				if(loc === curLoc)
					extra.push(styles.cur_same_loc);
			}
		}

		const text = (find.internal && findResult.length > 0)
		? <Highlighter searchWords={[find.text]} autoEscape={true} highlightClassName={styles.find_hit} textToHighlight={c.text} />
		: (c.opcode
			? <>
				<span>{c.pc.toString(16).padStart(8, ' ')}: </span>
				<span class={styles.opcode} data={c.opcode} onMouseEnter={onMouseEnterOpcode} onMouseLeave={onMouseLeaveOpcode} onWheel={onWheelOpcode}>{c.opcode}</span>
				<span>{' '.repeat(Math.max(0, 7 - c.opcode.length))} {c.rest}</span>
			</>
			: c.text);

		return (c.pc === undefined
		? <div class={[styles.row, ...extra].join(' ')} data-row={index}>{text}{'\n'}</div>
		: <div class={[styles.row, c.traceHits === 0 ? styles.zero : '', ...extra].join(' ')} data-row={index}>
			<div class={styles.duration}>{frame !== -1 ? <>
					{c.traceHits > 0 ? (integerFormat.format(c.traceCycles).padStart(7, ' ') + 'cy') : ''.padStart(9, ' ')}
					<span class={styles.dim1}>{c.traceHits > 0 ? (integerFormat.format(c.traceHits).padStart(6) + 'x ' + integerFormat.format(c.traceCycles / c.traceHits).padStart(3, ' ') + '⌀') : ''.padStart(8 + 4, ' ')}</span>
				</> : ''}
				<span class={styles.dim2} onMouseEnter={(e) => onMouseEnterTiming(e, c.theoreticalCycles)} onMouseLeave={onMouseLeaveTiming}>{c.theoreticalCycles ? c.theoreticalCycles.values.map((c) => c[0]).sort((a, b) => a - b).join('-').padStart(8, ' ') + 'T' : ''.padStart(9)}</span>
			</div>
			{text}
			{(c.loc !== undefined && frame !== -1) ? <div class={styles.file}><a href='#' data-file={c.loc.file} data-line={c.loc.line} onClick={onClickLoc}>{c.loc.file}:{c.loc.line}</a></div> : ''}
			{'\n'}
		</div>);
	}, [onClickLoc, row, content, frame, findResult, find, curFind, onMouseEnterOpcode, onMouseLeaveOpcode, onWheelOpcode]);

	const renderJump = useCallback((jump: JumpAbsolute) => {
		const right = 70; // needs to match CSS
		const rowMiddle = rowHeight >> 1;
		const levelIndent = 10;

		const min  = Math.min(...jump.start, jump.end);
		const max  = Math.max(...jump.start, jump.end);
		const end  = jump.end - min;
		const size = max - min + 1;
		const indent = right - 15 - jump.level * levelIndent;
		const endY = end * rowHeight + rowMiddle;

		const loopCycles = (() => {
			if(jump.level === 0 && jump.start.length === 1 && jump.end < jump.start[0]) {
				const loop = content.slice(jump.end, jump.start[0] + 1).map((l) => l.theoreticalCycles);
				if(loop.every((l) => l?.values.length > 0)) {
					const minCycles = loop.map((l) => Math.min(...l.values.map((c) => c[0]))).reduce((p, c) => p + c);
					const maxCycles = loop.map((l) => Math.max(...l.values.map((c) => c[0]))).reduce((p, c) => p + c);
					const text = minCycles === maxCycles ? `${minCycles}T` : `${minCycles}-${maxCycles}T`;
					return <text transform={`translate(${indent + 2}, ${endY + 3 + ((jump.start[0] - min) * rowHeight + rowMiddle - (endY + 3)) / 2}) rotate(-90)`} textAnchor="middle" dominant-baseline="hanging" class={styles.jumpduration} stroke="none">{text}</text>;
				}
			}/* else {
				// debug
				return <>
					<text transform={`translate(${Math.max(15, indent + 2)}, ${((0) * rowHeight + rowMiddle)})`} textAnchor="middle" dominant-baseline="hanging" class={styles.jumpduration} stroke="none">{jump.level}</text>
					<text transform={`translate(${indent + 2}, ${endY + 3 + ((jump.start[0] - min) * rowHeight + rowMiddle - (endY + 3)) / 2})`} textAnchor="middle" dominant-baseline="hanging" class={styles.jumpduration} stroke="none">{jump.level}</text>
					<text transform={`translate(${Math.max(15, indent + 2)}, ${end * rowHeight})`} textAnchor="middle" dominant-baseline="hanging" class={styles.jumpduration} stroke="none">{jump.level}</text>
				</>;
			}*/
			return '';
		})();

		return (<svg class={[styles.jump, jump.type === JumpType.ConditionalBranch ? styles.jumpcond : styles.jumpalways, jump.start.map((l) => content[l].pc).find((a) => a === pc) ? styles.jumpcur : ''].join(' ')} style={{top: `${jump.top}px`, height: `${jump.height}px`}}>
			{jump.start.map((startRow) => {
				const start = startRow - min;
				const y = start * rowHeight + rowMiddle;

				// 0.5px offsets so we get crisp lines
				if(indent > 5)
					return <polyline transform="translate(0.5,0.5)" points={`${right},${y} ${indent},${y} ${indent},${endY} ${right - 4},${endY}`} fill="none" />;
				else {
					const y1 = endY > y ? y + rowHeight - 5 : y - rowHeight + 5;
					const y2 = endY < y ? endY + rowHeight - 5 : endY - rowHeight + 5;
					const d = endY > y ? 1 : -1;
					const left = 5;
					return <>
						<g transform="translate(0.5,0.5)">
							<polyline points={`${right},${y} ${left},${y} ${left},${y1-5*d}`} fill="none" />
							<polyline points={`${left},${y2+5*d} ${left},${endY} ${right - 4},${endY}`} fill="none" />
						</g>
						<g transform="translate(0.5,0)">
							<path d={`M${left-2},${y1-3*d} l2,${2*d} l2,${-2*d}`} fill="none" />
							<path d={`M${left-2},${y1-5*d} l2,${2*d} l2,${-2*d}`} fill="none" />
							<path d={`M${left-2},${y2+2*d} l2,${2*d} l2,${-2*d}`} fill="none" />
							<path d={`M${left-2},${y2+0*d} l2,${2*d} l2,${-2*d}`} fill="none" />
						</g>
					</>;
				}
			})}
			<path transform="translate(0,0.5)"  d={`M${right},${endY} l-4,-4 l0,8 z`} stroke="none" />
			{loopCycles}
		</svg>);
	}, [content, rowHeight, pc]);

	// scroller
	const listRef = useRef<Component>();
	const [scroller, setScroller] = useState<Scrollable>(null);
	useEffect(() => {
		if(scroller) {
			if(row >= 0) {
				const containerHeight = (listRef.current.base as HTMLElement).clientHeight;
				const slack = containerHeight / 10;
				if(frame === -1) {
					// scroll to keep selection in center
					const scrollTo = row * rowHeight - document.documentElement.clientHeight / 2;
					if(Math.abs(scrollTo - scroller.getFutureScrollPosition()) > rowHeight * 2)
						scroller.setScrollPositionSmooth(scrollTo);
					else
						scroller.setScrollPositionNow(scrollTo);

					// show source location (not when searched from extern)
					if(find.text.length === 0 || find.internal) {
						if(content[row].pc !== undefined) {
							let r = row;
							while(content[r].loc === undefined && r > 0)
								r--;
							if(content[r].loc) {
								VsCodeApi.postMessage<IOpenDocumentMessageObjview>({
									type: 'openDocument',
									file: content[r].loc.file,
									line: content[r].loc.line
								});
							}
						}
					}
				} else {
					// only scroll when needed
					const scrollTo = row * rowHeight;
					const newTop = scrollTo - containerHeight / 2;
					if(scrollTo < scroller.getFutureScrollPosition() + slack || scrollTo > scroller.getFutureScrollPosition() + containerHeight - slack)
						scroller.setScrollPositionSmooth(newTop);
				}
			}
		} else {
			setScroller(new Scrollable(listRef.current.base as HTMLElement, 135));
		}
	}, [content, row, scroller, rowHeight, listRef.current, find, findResult]);

	// Open source file corresponding to row
	const openSource = useCallback((row: number) => {
		const firstWithSrc = content.findIndex((c) => c.loc);
		let r = row >= firstWithSrc ? row : firstWithSrc;

		while(content[r].loc === undefined && r > firstWithSrc)
			r--;
		if(content[r]?.loc) {
			VsCodeApi.postMessage<IOpenDocumentMessage>({
				type: 'openDocument',
				location: {
					lineNumber: content[r].loc.line,
					columnNumber: 0,
					source: { path: content[r].loc.file }
				},
				toSide: true,
			});
		}
	}, [content, row]);

	// Open source on row change
	useEffect(() => {
		if (frame >= 0 && showSource) {
			openSource(row);
		}
	}, [row, showSource, openSource]);

	// Close doc when source disabled
	useEffect(() => {
		if (frame >= 0 && !showSource) {
			VsCodeApi.postMessage({ type: 'closeDocument' });
		}
	}, [showSource]);

	// cursor navigation
	useEffect(() => {
		const navStack: number[] = [];
		const listener = (evt: KeyboardEvent) => {
			if((evt.key === 'f' && (evt.metaKey || evt.ctrlKey)) || evt.key === 'F3') {
				// open search bar
				findRef.current('open');
				evt.preventDefault();
			} else if(evt.key === 'Escape') {
				// close search bar
				findRef.current('close');
				evt.preventDefault();
			}
			if(frame === -1) {
				if(evt.key === 'ArrowDown')
					setCurRow((curRow) => Math.min(content.length - 1, curRow + 1));
				else if(evt.key === 'ArrowUp')
					setCurRow((curRow) => Math.max(0, curRow - 1));
				else if(evt.key === 'PageDown')
					setCurRow((curRow) => Math.min(content.length - 1, Math.floor(curRow + (window.innerHeight / rowHeight * 0.9))));
				else if(evt.key === 'PageUp')
					setCurRow((curRow) => Math.max(0, Math.floor(curRow - (window.innerHeight / rowHeight * 0.9))));
				else if(evt.key === 'Home')
					setCurRow(0);
				else if(evt.key === 'End')
					setCurRow(content.length - 1);
				else if(evt.key === 'ArrowRight') {
					setCurRow((curRow) => {
						const jump = jumps.find((j) => j.start.includes(curRow));
						if(jump) {
							navStack.push(curRow);
							return jump.end;
						}
						return curRow;
					});
				} else if(evt.key === 'ArrowLeft') {
					setCurRow((curRow) => {
						if(navStack.length)
							return navStack.pop();
						return curRow;
					});
				} else
					return;
				evt.preventDefault();
			}
		};
		// make list accept keyboard events
		(listRef.current.base as HTMLElement).tabIndex = -1;
		(listRef.current?.base as HTMLElement)?.focus();
		listRef.current?.base?.addEventListener('keydown', listener);
		return () => listRef.current?.base?.removeEventListener('keydown', listener);
	}, []);

	// messages
	useEffect(() => {
		if(frame === -1) {
			const listener = (e: MessageEvent) => {
				const { type, body } = e.data;
				switch(type) {
				case 'findLocation':
					console.log("Message", type, body);
					const loc = `${body.file}:${body.line}`;
					// open search bar
					if(findRef.current('open', loc))
						setFind({ text: loc, internal: false });
					break;
				case 'fileChanged':
					console.log("Message", type);
					setOpacity(0.5);
					break;
				case 'reload':
					console.log("Message", type);
					setOpacity(1.0);
					setModel(new ObjdumpModel(body));
					break;
				}
			};
			window.addEventListener('message', listener);
			return () => document.removeEventListener('message', listener);
		}
	}, [findRef, setFind, setModel, frame]);

	const onChangeFunction = useCallback((selected: Function) => {
		const sel = content.findIndex((c: Line) => c.pc === selected.pc);
		if(frame === -1) {
			setCurRow(sel);
		} else {
			const scrollTo = (sel - 2) * rowHeight; // -2: function line
			scroller.setScrollPositionSmooth(scrollTo);
			openSource(sel);
		}
	}, [content, scroller]);

	const onClickContainer = useCallback((evt: JSX.TargetedMouseEvent<HTMLElement>) => {
		if(frame === -1 || showSource) {
			for(let elem = evt.target as HTMLElement; elem; elem = elem.parentElement) {
				if(elem.getAttribute('data-row')) {
					const row = parseInt(elem.getAttribute('data-row'));
					setCurRow(row);
					return;
				}
			}
		}
	}, []);

	const findCallback = useCallback((action: string, text?: string) => {
		if(action === 'prev') {
			if(findResult.length) {
				const n = (curFind + findResult.length - 1) % findResult.length;
				setCurFind(n);
				setCurRow(findResult[n]);
			}
		} else if(action === 'next') {
			if(findResult.length) {
				const n = (curFind + 1) % findResult.length;
				setCurFind(n);
				setCurRow(findResult[n]);
			}
		} else {
			setFind({ text: text ?? '', internal: true });
			if(action === 'close')
				(listRef.current?.base as HTMLElement)?.focus();
		}
		return true;
	}, [setFind, listRef.current, curFind, findResult]);

	return <>
		<div class={styles.wrapper}>
			<Find ref={findRef} curFind={curFind} findResultLength={findResult.length} callback={findCallback}  />
			{regs?.length > 0 && showRegisters && <div class={styles.registers}>
					{[0, 1, 2, 3, 4, 5, 6, 7].map((_, i: number) => <>
						D{i}: <a href="#" onClick={() => setMemoryAddr(regs[Register.D0 + i])}>${regs[Register.D0 + i].toString(16).padStart(8, '0')}</a>&nbsp;
						A{i}: <a href="#" onClick={() => setMemoryAddr(regs[Register.A0 + i])}>${regs[Register.A0 + i].toString(16).padStart(8, '0')}</a>
					<br/></>)}
					SR: ${regs[Register.SR].toString(16).padStart(4, '0')}&nbsp;&nbsp;&nbsp;
					<span class={(regs[Register.SR] & (1 << 15)) ? styles.sr_on : styles.sr_off} title='Trace Enable'>T</span>
					<span class={(regs[Register.SR] & (1 << 14)) ? styles.sr_on : styles.sr_off} title='Trace Enable'>T</span>
					<span class={(regs[Register.SR] & (1 << 13)) ? styles.sr_on : styles.sr_off} title='Supervisor/User State'>S</span>
					<span class={(regs[Register.SR] & (1 << 12)) ? styles.sr_on : styles.sr_off} title='Master/Interrupt State'>M</span>
					<span class={styles.sr_off}>-</span><span class={styles.sr_on} title='Interrupt Priority Mask'>IP{(regs[Register.SR] & 0b111) >>> 8}</span>
					<span class={styles.sr_off}>---</span>
					<span class={(regs[Register.SR] & (1 << 4)) ? styles.sr_on : styles.sr_off} title='Extend'>X</span>
					<span class={(regs[Register.SR] & (1 << 3)) ? styles.sr_on : styles.sr_off} title='Negative'>N</span>
					<span class={(regs[Register.SR] & (1 << 2)) ? styles.sr_on : styles.sr_off} title='Zero'>Z</span>
					<span class={(regs[Register.SR] & (1 << 1)) ? styles.sr_on : styles.sr_off} title='Overflow'>V</span>
					<span class={(regs[Register.SR] & (1 << 0)) ? styles.sr_on : styles.sr_off} title='Carry'>C</span>
			</div>}
			<span>
			Function:&nbsp;
			<FunctionDropdown alwaysChange={true} options={functions} value={func} onChange={onChangeFunction} />
			</span>
			<span className={styles.toolbar}>
				{regs?.length > 0 && (
					<ToggleButton checked={showRegisters} onChange={setShowRegisters} icon="Registers" label="Show Registers" />
				)}
				{frame >= 0 && (
					<ToggleButton checked={showSource} onChange={setShowSource} icon="Source" label="Show Source" />
				)}
			</span>
		</div>
		<VirtualListLine ref={listRef} class={styles.container} style={{opacity}} rows={content} renderRow={renderRow} rowHeight={rowHeight} absolutes={jumps} renderAbsolute={renderJump} overscanCount={50} onclick={onClickContainer} />
		{hovered.markdown !== '' && (createPortal(
			<div class={styles.tooltip_parent} style={{justifyContent: hovered.justify, left: hovered.x, top: hovered.y }}>
				<div ref={tooltipRef} class={styles.tooltip}>
					<StyledMarkdown>{hovered.markdown}</StyledMarkdown>
				</div>
			</div>, document.body))}
		{hoveredTimings.markdown !== '' && (createPortal(
			<div class={styles.tooltip_parent} style={{justifyContent: hoveredTimings.justify, left: hoveredTimings.x, top: hoveredTimings.y, height: "100px" }}>
				<div class={[styles.tooltip, styles.timing_tooltip].join(" ")} style={{ maxHeight: "100px" }}>
					<StyledMarkdown>{hoveredTimings.markdown}</StyledMarkdown>
				</div>
			</div>, document.body))}
	</>;
};
