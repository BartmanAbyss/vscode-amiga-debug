import { FunctionComponent, h, JSX, createContext, Component, Fragment } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import VirtualList from 'preact-virtual-list';
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

declare const MODELS: IProfileModel[];

interface Location {
	file: string;
	line: number;
}

const integerFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0
});

interface Line {
	pc?: number;
	hits?: number;
	cycles?: number;
	text: string;
	loc?: Location;
}

interface Function {
	name: string;
	pc: number;
	end: number;
}

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
	const [content, functions] = useMemo(() => {
		const content: Line[] = [];
		const functions: Function[] = [];
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

		const lines = MODELS[0].amiga.objdump.replace(/\r/g, '').split('\n');
		let loc;
		for(const line of lines) {
			const funcMatch = line.match(/([0-9a-f]+) <(.*)>:$/); // 00000000 <_start>:
			if(funcMatch) {
				const pc = parseInt(funcMatch[1], 16);
				if(functions.length)
					functions[functions.length - 1].end = pc;
				functions.push({
					name: funcMatch[2],
					pc,
					end: 0x7fffffff
				});
			}

			const locMatch = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/); // C:/Users/Chuck/Documents/Visual_Studio_Code/amiga-debug/template/support/gcc8_c_support.c:62 (discriminator 1)
			if(locMatch) {
				loc = { file: locMatch[1], line: parseInt(locMatch[2]) };
				continue;
			}

			const insnMatch = line.match(/^ *([0-9a-f]+):\t/); //      cce:	0c40 a00e      	cmpi.w #-24562,d0
			if(insnMatch) {
				const pc = parseInt(insnMatch[1], 16);
				content.push({
					pc,
					hits: hits[pc >> 1],
					cycles: cycles[pc >> 1],
					text: line,
					loc
				});
				loc = undefined;
			} else {
				content.push({ text: line });
			}
		}
		return [content, functions.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))];
	}, [frame]);

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

	const cssVariables = useCssVariables();
	const height = parseInt(cssVariables['editor-font-size']) + 3; // needs to match CSS

	const renderRow = useCallback((c: Line) => (
		c.pc === undefined
		? <div class={styles.row}>{c.text + '\n'}</div>
		: <div class={[styles.row, c.cycles === 0 ? styles.zero : '', c.pc === pc ? styles.cur : ''].join(' ')}>
			<span class={styles.duration}>{integerFormat.format(c.cycles).padStart(8) + 'cy (' + integerFormat.format(c.hits).padStart(6) + ') '}</span>
			{c.text}
			{c.loc !== undefined ? <div class={styles.file}><a href='#' data-file={c.loc.file} data-line={c.loc.line} onClick={onClick}>{c.loc.file}:{c.loc.line}</a></div> : ''}
			{'\n'}
		</div>		
	), [onClick, pc]);

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
		<VirtualList ref={listRef} className={styles.container} data={content} renderRow={renderRow} rowHeight={height} overscanCount={10} />
	</Fragment>;
};
