import { Component, Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Cycles, GetCycles, GetJump, JumpType } from "./68k";
import { DropdownComponent, DropdownOptionProps } from './dropdown';
import { Icon } from './icons';
import * as ChevronDown from './icons/arrow-down.svg';
import * as ChevronUp from './icons/arrow-up.svg';
import * as Close from './icons/close.svg';
import * as SymbolMethod from './icons/symbol-method.svg';
import { IProfileModel } from './model';
import styles from './objdump.module.css';
import { Scrollable } from "./scrollable";
import './styles.css';
import { IOpenDocumentMessage } from './types';
import { useCssVariables } from './useCssVariables';
import { Absolute, VirtualList } from './virtual_list';
import { VsCodeApi } from "./vscodeApi";
import Highlighter from 'react-highlight-words';
import resolve from 'path-resolve';

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
	theoreticalCycles?: Cycles[];
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
		// based on binutils-gdb/binutils/objdump.c
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

		let lastJump = 0;
		let maxLevel = -1;
		while(lastJump < sortedJumps.length) {
			// The last jump is part of the next group
			const base = lastJump;
			// Increment level
			sortedJumps[base].level = ++maxLevel;
			// Find jumps that can be combined on the same level, with the largest jumps tested first.
			// This has the advantage that large jumps are on lower levels and do not intersect with small
			// jumps that get grouped on higher levels.
			let exchangeItem = lastJump + 1;
			for(let it = exchangeItem; it < sortedJumps.length; it++) {
				// test if the jump intersects with any jump from current group
				let ok = true;
				for(let itCollision = base; itCollision !== exchangeItem; itCollision++) {
					// this jump intersects so we leave it out
					if(jumpIntersects(sortedJumps[itCollision], sortedJumps[it])) {
						ok = false;
						break;
					}
				}
				// add jump to group
				if(ok) {
					// move current element to the front
					if(it !== exchangeItem) {
						// hmm.. this code is not good
						[sortedJumps[exchangeItem], sortedJumps[it]] = [sortedJumps[it], sortedJumps[exchangeItem]];
						lastJump = it;
					} else {
						lastJump = exchangeItem;
						exchangeItem++;
					}
					sortedJumps[lastJump].level = maxLevel;
				}
			}
			lastJump = exchangeItem; // move to next group
		}
		this.jumps.push(...sortedJumps);
	}

	constructor(objdump: string, traceHits?: number[], traceCycles?: number[]) {
		const lines = objdump.replace(/\r/g, '').split('\n');
		let loc: Location;
		let funcJumps: JumpInfo[] = [];

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
					end: 0x7fffffff
				});
			}

			const locMatch = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/); // C:/Users/Chuck/Documents/Visual_Studio_Code/amiga-debug/template/support/gcc8_c_support.c:62 (discriminator 1)
			if(locMatch) {
				loc = { file: locMatch[1], normalizedFile: resolve(locMatch[1]), line: parseInt(locMatch[2]) };
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
				hex.forEach((h, i) => { insn[i] = parseInt(h, 16); });
				const jump = GetJump(pc, insn);
				if(jump) {
					const jumpInfo = funcJumps.find((j) => j.end === jump.target && j.type === jump.type);
					if(jumpInfo)
						jumpInfo.start.push(pc);
					else
						funcJumps.push({ start: [pc], end: jump.target, level: -1, type: jump.type });
				}
				this.content.push({
					pc,
					text: `${pc.toString(16).padStart(8, ' ')}: ${opcode.padEnd(7, ' ')} ${rest}`,
					theoreticalCycles: GetCycles(insn),
					loc
				});
				loc = undefined;
			} else {
				this.content.push({ text: line });
			}
		}
		if(this.functions.length)
			this.addJumps(this.functions[this.functions.length - 1], funcJumps);
		if(traceHits && traceCycles) {
			this.content.forEach((l) => {
				if(l.pc !== undefined) {
					l.traceHits = traceHits[l.pc >> 1];
					l.traceCycles = traceCycles[l.pc >> 1];
				}
			});
		}
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
	frame?: number,
	time?: number
}> = ({ frame = -1, time = -1 }) => {
	const cssVariables = useCssVariables();
	const rowHeight = parseInt(cssVariables['editor-font-size']) + 3; // needs to match CSS

	const [content, functions, jumps] = useMemo(() => {
		const model = (() => {
			if(frame === -1)
				return new ObjdumpModel(OBJDUMP);

			const textSection = MODELS[0].amiga.sections.find((section) => section.name === '.text');
			const hits = new Array<number>(textSection.size >> 1).fill(0);
			const cycles = new Array<number>(textSection.size >> 1).fill(0);
			const pcTrace = MODELS[frame].amiga.pcTrace;
			for(let i = 0; i < pcTrace.length; i += 2) {
				if(pcTrace[i] >= 0 && pcTrace[i] < textSection.size) {
					hits[pcTrace[i] >> 1]++;
					cycles[pcTrace[i] >> 1] += pcTrace[i + 1];
				}
			}
			return new ObjdumpModel(MODELS[0].amiga.objdump, hits, cycles);
		})();
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
		//console.log(jumps);

		return [model.content, model.functions.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())), jumps];
	}, [frame, rowHeight]);

	const [curRow, setCurRow] = useState(0);

	const [find, setFind] = useState<{ text: string, internal: boolean }>({ text: '', internal: true });
	const [curFind, setCurFind] = useState(0);
	const findRef = useRef<HTMLDivElement>();
	const findResult = useMemo(() => {
		console.time("findResult");
		const result: number[] = [];
		if(find.text.length > 0) {
			if(find.internal) {
				content.forEach((line, index) => {
					if(line.text.includes(find.text))
						result.push(index);
				});
			} else {
				const findLoc = resolve(find.text.replace(/\\/g, '/')).toLowerCase();
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
	}, [frame, find]);

	const [row, pc, func] = useMemo(() => {
		const row = (() => {
			if(frame === -1)
				return curRow;
			const pcTrace = MODELS[frame].amiga.pcTrace;
			let t = 0;
			let pc = 0;
			for(let i = 0; i < pcTrace.length; i += 2) {
				pc = pcTrace[i];
				t += pcTrace[i + 1];
				if(t > time)
					break;
			}
			return content.findIndex((l) => l.pc === pc);
		})();
		const pc = (row !== -1 ? content[row].pc : undefined) || 0xffffffff;
		//console.log(pc.toString(16));
		let func = functions.find((f: Function) => pc >= f.pc && pc < f.end);
		if(pc === 0x7fffffff)
			func = { name: '[IRQ]', pc: 0x7fffffff, end: 0x7fffffff };
		if(pc === 0xffffffff)
			func = { name: '[External]', pc: 0xffffffff, end: 0xffffffff };
		return [row, pc, func];
	}, [frame, time, curRow]);

	const onClickLoc = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage<IOpenDocumentMessage>({
			type: 'openDocument',
			location: {
				lineNumber: (evt.srcElement as HTMLElement).attributes['data-line'].value,
				columnNumber: 0,
				source: { path: (evt.srcElement as HTMLElement).attributes['data-file'].value }
			},
			toSide: true,
		});
	}, []);

	const renderRow = useCallback((c: Line, index: number) => {
		const extra = [];
		if(index === row)
			extra.push(styles.cur);

		const text = (find.internal && findResult.length > 0) 
		? <Highlighter searchWords={[find.text]} autoEscape={true} highlightClassName={styles.find_hit} textToHighlight={c.text} />
		: c.text;

		return (c.pc === undefined
		? <div class={[styles.row, ...extra].join(' ')} data-row={index}>{text}{'\n'}</div>
		: <div class={[styles.row, c.traceCycles === 0 ? styles.zero : '', ...extra].join(' ')} data-row={index}>
			<div class={styles.duration}>{frame !== -1 ? <Fragment>
					{c.traceCycles > 0 ? (integerFormat.format(c.traceCycles).padStart(7, ' ') + 'cy') : ''.padStart(9, ' ')}
					<span class={styles.dim1}>{c.traceCycles > 0 ? (integerFormat.format(c.traceHits).padStart(6) + 'x ' + integerFormat.format(c.traceCycles / c.traceHits).padStart(3, ' ') + '⌀') : ''.padStart(8 + 4, ' ')}</span>
				</Fragment> : ''}
				<span class={styles.dim2}>{c.theoreticalCycles ? c.theoreticalCycles.map((c) => `${c.total}`).join('-').padStart(6, ' ') + 'T' : ''.padStart(7)}</span>
			</div>
			{text}
			{c.loc !== undefined ? <div class={styles.file}><a href='#' data-file={c.loc.file} data-line={c.loc.line} onClick={onClickLoc}>{c.loc.file}:{c.loc.line}</a></div> : ''}
			{'\n'}
		</div>);
	}, [onClickLoc, row, findResult, find, curFind]);

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
				if(loop.every((l) => l?.length > 0)) {
					const minCycles = loop.map((l) => Math.min(...l.map((c) => c.total))).reduce((p, c) => p + c);
					const maxCycles = loop.map((l) => Math.max(...l.map((c) => c.total))).reduce((p, c) => p + c);
					const text = minCycles === maxCycles ? `${minCycles}T` : `${minCycles}-${maxCycles}T`;
					return <text transform={`translate(${indent + 2}, ${endY + 3 + ((jump.start[0] - min) * rowHeight + rowMiddle - (endY + 3)) / 2}) rotate(-90)`} textAnchor="middle" dominant-baseline="hanging" class={styles.jumpduration} stroke="none">{text}</text>;
				}
			}
			return '';
		})();

		return (<svg class={[styles.jump, jump.type === JumpType.ConditionalBranch ? styles.jumpcond : styles.jumpalways, jump.start.map((l) => content[l].pc).find((a) => a === pc) ? styles.jumpcur : ''].join(' ')} style={{top: jump.top + 'px', height: jump.height + 'px'}}>
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
					return <Fragment>
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
					</Fragment>;
				}
			})}
			<path transform="translate(0,0.5)"  d={`M${right},${endY} l-4,-4 l0,8 z`} stroke="none" />
			{loopCycles}
		</svg>);
	}, [content, rowHeight, pc]);

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
	}, [row, scroller, rowHeight, listRef.current, find, findResult]);

	if(frame === -1) {
		// cursor navigation
		useEffect(() => {
			const listener = (evt: KeyboardEvent) => {
				// TODO: don't do anything if focus on find
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
				else if((evt.key === 'f' && evt.ctrlKey) || evt.key === 'F3') {
					// open search bar
					findRef.current.classList.remove(styles.find_hidden);
					findRef.current.classList.add(styles.find_visible);
					findRef.current.getElementsByTagName('input')[0].select();
				} else if(evt.key === 'Escape') {
					// close search bar
					findRef.current.classList.remove(styles.find_visible);
					findRef.current.classList.add(styles.find_hidden);
					setFind({ text: '', internal: true });
				} else
					return;
				evt.preventDefault();
			};
			document.addEventListener('keydown', listener);
			return () => document.removeEventListener('keydown', listener);
		}, [findRef, setFind]);
	}

	useEffect(() => {
		const listener = (e) => {
			const { type, body } = e.data;
			switch(type) {
			case 'findLocation': 
				console.log(type, body);
				const loc = `${body.file}:${body.line}`;
				// open search bar
				findRef.current.classList.remove(styles.find_hidden);
				findRef.current.classList.add(styles.find_visible);
				findRef.current.getElementsByTagName('input')[0].select();
				findRef.current.getElementsByTagName('input')[0].value = loc;
				setFind({ text: loc, internal: false });
				break;
			}
		};
		window.addEventListener('message', listener);
		return () => document.removeEventListener('message', listener);
	}, [findRef, setFind]);

	const onChangeFunction = useCallback((selected: Function) => { 
		const sel = content.findIndex((c: Line) => c.pc === selected.pc);
		if(frame === -1) {
			setCurRow(sel);
		} else {
			const scrollTo = (sel - 2) * rowHeight; // -2: function line
			scroller.setScrollPositionSmooth(scrollTo);
		}
	}, [scroller]);

	const onClickContainer = useCallback((evt: MouseEvent) => {
		if(frame === -1) {
			const elem = evt.srcElement as HTMLElement;
			for(let elem = evt.srcElement as HTMLElement; elem; elem = elem.parentElement) {
				if(elem.attributes['data-row']) {
					const row = parseInt(elem.attributes['data-row'].value);
					console.log(row);
					setCurRow(row);
					return;
				}
			}
		}
	}, []);

	const onFindPrev = useCallback(() => {
		if(findResult.length) {
			const n = (curFind + findResult.length - 1) % findResult.length;
			setCurFind(n);
			setCurRow(findResult[n]);
		}
	}, [curFind, findResult]);
	const onFindNext = useCallback(() => {
		if(findResult.length) {
			const n = (curFind + 1) % findResult.length;
			setCurFind(n);
			setCurRow(findResult[n]);
		}
	}, [curFind, findResult]);
	const onFindClick = useCallback((evt: Event) => {
		(evt.target as HTMLInputElement).select();
	}, []);
	const onFindPaste = useCallback((evt: Event) => {
		const find = (evt.target as HTMLInputElement).value;
		setFind({ text: find, internal: true });
	}, [setFind]);
	const onFindKeyUp = useCallback((evt: KeyboardEvent) => {
		if(evt.key === 'Enter' || evt.key === 'Escape')
			return;
		const find = (evt.target as HTMLInputElement).value;
		setFind({ text: find, internal: true });
	}, [setFind]);
	const onFindKeyDown = useCallback((evt: KeyboardEvent) => {
		if(evt.key === 'Enter')
			evt.shiftKey ? onFindPrev() : onFindNext();
	}, [onFindPrev, onFindNext]);
	const onFindClose = useCallback(() => {
		findRef.current.classList.remove(styles.find_visible);
		findRef.current.classList.add(styles.find_hidden);
		setFind({ text: '', internal: true });
	}, [findRef]);
	
	return <Fragment>
		<div style={{ fontSize: 'var(--vscode-editor-font-size)', marginBottom: '5px' }}>
			<div ref={findRef} class={[styles.find, styles.find_hidden].join(' ')} style={{ visibility: '' }}>
				<input placeholder="Find" onClick={onFindClick} onPaste={onFindPaste} onKeyUp={onFindKeyUp} onKeyDown={onFindKeyDown}></input>
				<span class={styles.find_result}>{findResult.length > 0 ? `${curFind % findResult.length + 1} of ${findResult.length}` : 'No results'}</span>
				<button class={styles.button} onMouseDown={onFindPrev} disabled={findResult.length === 0} type="button" title="Previous match (Shift+Enter)" dangerouslySetInnerHTML={{__html: ChevronUp}} />
				<button class={styles.button} onMouseDown={onFindNext} disabled={findResult.length === 0} type="button" title="Next match (Enter)" dangerouslySetInnerHTML={{__html: ChevronDown}} />
				<button class={styles.button} onMouseDown={onFindClose} type="button" title="Close (Escape)" dangerouslySetInnerHTML={{__html: Close}} />
			</div>
			Function:&nbsp;
			<FunctionDropdown alwaysChange={true} options={functions} value={func} onChange={onChangeFunction} />
		</div>
		<VirtualListLine ref={listRef} class={styles.container} rows={content} renderRow={renderRow} rowHeight={rowHeight} absolutes={jumps} renderAbsolute={renderJump} overscanCount={50} onclick={onClickContainer} />
	</Fragment>;
};
