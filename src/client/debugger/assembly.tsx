import { FunctionComponent, h, JSX, createContext, Component, Fragment } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
//import VirtualList from 'preact-virtual-list';
import '../styles.css';
import styles from './assembly.module.css';
import { Scrollable } from "../scrollable";

import { IProfileModel } from '../model';
import { VsCodeApi } from '../vscodeApi';
import { IOpenDocumentMessage } from '../types';
import { useCssVariables } from '../useCssVariables';
import { DropdownOptionProps, DropdownComponent } from '../dropdown';

import { Icon } from '../icons';
import * as SymbolMethod from '../icons/symbol-method.svg';
import { ObjdumpModel, Line, Function, JumpInfo } from '../objdump';
import { JumpType } from '../68k';

// based on https://github.com/developit/preact-virtual-list/blob/master/src/index.js
// Copyright (c) 2016 Jason Miller. MIT License.

const STYLE_INNER = 'position:relative; overflow:hidden; width:100%; min-height:100%;';
const STYLE_CONTENT = 'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

interface Absolute {
	top: number;
	height: number;
}

interface VirtualListProps<R, A extends Absolute> {
	rows: R[];
	renderRow: (row: R) => JSX.Element;
	rowHeight: number;
	absolutes?: A[];
	renderAbsolute?: (absolute: A, top: number, bottom: number) => JSX.Element;
	overscanCount?: number;
	sync?: boolean;
	[x: string]: any; // passthrough properties
}

export default class VirtualList<R, A extends Absolute> extends Component<VirtualListProps<R, A>, { offset: number; height: number }> {
	private resize = () => {
		if (this.state.height !== (this.base as HTMLElement).offsetHeight) {
			this.setState({ height: (this.base as HTMLElement).offsetHeight });
		}
	}

	private handleScroll = () => {
		this.setState({ offset: (this.base as HTMLElement).scrollTop });
		if (this.props.sync) this.forceUpdate();
	}

	public componentDidUpdate() {
		this.resize();
	}

	public componentDidMount() {
		this.resize();
		addEventListener('resize', this.resize);
	}

	public componentWillUnmount() {
		removeEventListener('resize', this.resize);
	}

	public render({ rows, rowHeight, renderRow, absolutes, renderAbsolute, overscanCount=10, sync, ...props }: VirtualListProps<R, A>, { offset=0, height=0 }) {
		// first visible row index
		let start = (offset / rowHeight)|0;

		// actual number of visible rows (without overscan)
		let visibleRowCount = (height / rowHeight)|0;

		// Overscan: render blocks of rows modulo an overscan row count
		// This dramatically reduces DOM writes during scrolling
		if (overscanCount) {
			start = Math.max(0, start - (start % overscanCount));
			visibleRowCount += overscanCount;
		}

		// last visible + overscan row index
		const end = start + 1 + visibleRowCount;

		// data slice currently in viewport plus overscan items
		const selection = rows.slice(start, end);

		return (
			<div onScroll={this.handleScroll} {...props}>
				<div style={`${STYLE_INNER} height:${rows.length*rowHeight}px;`}>
					{absolutes && absolutes.filter((a) => a.top < end*rowHeight && a.top + a.height >= start*rowHeight).map((a) => renderAbsolute(a, start*rowHeight, end*rowHeight))}
					<div style={`${STYLE_CONTENT} top:${start*rowHeight}px;`}>
						{selection.map(renderRow)}
					</div>
				</div>
			</div>
		);
	}
}

interface JumpAbsolute extends JumpInfo, Absolute {}

class VirtualListLine extends VirtualList<Line, JumpAbsolute> {}

declare const MODELS: IProfileModel[];

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

export const AssemblyView: FunctionComponent<{
	frame: number,
	time: number
}> = ({ frame, time }) => {
	const cssVariables = useCssVariables();
	const height = parseInt(cssVariables['editor-font-size']) + 3; // needs to match CSS

	const [content, functions, jumps] = useMemo(() => {
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

		const model = new ObjdumpModel(MODELS[0].amiga.objdump, hits, cycles);
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
				top: min * height,
				height: (max - min + 1) * height
			};
		});
		console.log(jumps);

		return [model.content, model.functions.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())), jumps];
	}, [frame, height]);

	const [pc, func] = useMemo(() => {
		const pcTrace = MODELS[frame].amiga.pcTrace;
		let t = 0;
		let pc = 0;
		for(let i = 0; i < pcTrace.length; i += 2) {
			pc = pcTrace[i];
			t += pcTrace[i + 1];
			if(t > time)
				break;
		}
		console.log(pc.toString(16));
		let func = functions.find((f: Function) => pc >= f.pc && pc < f.end);
		if(pc === 0x7fffffff)
			func = { name: '[IRQ]', pc: 0x7fffffff, end: 0x7fffffff };
		if(pc === 0xffffffff)
			func = { name: '[External]', pc: 0xffffffff, end: 0xffffffff };
		return [pc, func];
	}, [frame, time]);

	const onClick = useCallback((evt: MouseEvent) => {
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

	const renderRow = useCallback((c: Line) => (
		c.pc === undefined
		? <div class={styles.row}>{c.text + '\n'}</div>
		: <div class={[styles.row, c.traceCycles === 0 ? styles.zero : '', c.pc === pc ? styles.cur : ''].join(' ')}>
			<div class={styles.duration}>{c.traceCycles > 0 ? (integerFormat.format(c.traceCycles).padStart(7, ' ') + 'cy') : ''.padStart(9, ' ')}
				<span class={styles.dim}>{c.traceCycles > 0 ? (integerFormat.format(c.traceHits).padStart(6) + 'x ' + integerFormat.format(c.traceCycles / c.traceHits).padStart(3, ' ') + '⌀') : ''.padStart(8 + 4, ' ')}</span>
			</div>
			{c.text}
			{c.loc !== undefined ? <div class={styles.file}><a href='#' data-file={c.loc.file} data-line={c.loc.line} onClick={onClick}>{c.loc.file}:{c.loc.line}</a></div> : ''}
			{'\n'}
		</div>		
	), [onClick, pc]);

	const renderJump = useCallback((jump: JumpAbsolute, top: number, bottom: number) => {
		const stroke = { fill: 'none' };
		const strokeConditional = { ...stroke, 'stroke-dasharray': '1' };
		const right = 150; // needs to match CSS
		const rowMiddle = 6;
		const levelIndent = 5;

		const min  = Math.min(...jump.start, jump.end);
		const max  = Math.max(...jump.start, jump.end);
		const end  = jump.end - min;
		const size = max - min + 1;
		const indent = right - 10 - jump.level * levelIndent;
		const endY = end * height + rowMiddle;

		return (<svg class={styles.jump} style={{top: jump.top + 'px', height: jump.height + 'px'}}>
			{jump.start.map((startRow) => {
				const start = startRow - min;
				const y = start * height + rowMiddle;
				
				return <polyline points={`${right},${y} ${indent},${y} ${indent},${endY} ${right - 4},${endY}`} {...stroke} {...(jump.type === JumpType.ConditionalBranch ? strokeConditional : {})} />;
			})}
			<path d={`M${right},${endY} l-4,-4 l0,8 z`} stroke="none" />
		</svg>);
	}, [content, height]);

	const listRef = useRef<Component>();
	const [scroller, setScroller] = useState<Scrollable>(null);
	useEffect(() => {
		if(scroller) {
			const sel = content.findIndex((c: Line) => c.pc === pc);
			if(sel >= 0) {
				const containerHeight = (listRef.current.base as HTMLElement).clientHeight;
				const slack = containerHeight / 10;
				const scrollTo = sel * height;
				const newTop = scrollTo - containerHeight / 2;
				if(scrollTo < scroller.getFutureScrollPosition() + slack || scrollTo > scroller.getFutureScrollPosition() + containerHeight - slack)
					scroller.setScrollPositionSmooth(newTop);
			}
		} else {
			setScroller(new Scrollable(listRef.current.base as HTMLElement, 135));
		}
	}, [pc, scroller, listRef.current]);

	const onChangeFunction = (selected: Function) => { 
		const sel = content.findIndex((c: Line) => c.pc === selected.pc);
		const scrollTo = (sel - 2) * height; // -2: function line
		scroller.setScrollPositionSmooth(scrollTo);
	};

	return <Fragment>
		<div style={{ fontSize: 'var(--vscode-editor-font-size)', marginBottom: '5px' }}>
			Function:&nbsp;
			<FunctionDropdown alwaysChange={true} options={functions} value={func} onChange={onChangeFunction} />
		</div>
		<VirtualListLine ref={listRef} class={styles.container} rows={content} renderRow={renderRow} rowHeight={height} absolutes={jumps} renderAbsolute={renderJump} overscanCount={10} />
	</Fragment>;
};
