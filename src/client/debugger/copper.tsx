import { Component, FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';
import Markdown from 'markdown-to-jsx';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CopperInstructionType, CopperMove } from '../copperDisassembler';
import { Copper, CpuCyclesToDmaCycles, GetAmigaColorCss } from '../dma';
import { createPortal } from 'preact/compat';
import { GetCustomRegDoc } from '../docs';
import { FormatCustomRegData } from '../customRegisters';
import { useWheelHack } from '../useWheelHack';
import { Scrollable } from '../scrollable';
import { VirtualList } from '../virtual_list';
import { useCssVariables } from '../useCssVariables';
import { Find, FindCallback } from '../find';
import Highlighter from 'react-highlight-words';
class VirtualListCopper extends VirtualList<Copper> {}

export const CopperView: FunctionComponent<{
	frame: number;
	time: number;
}> = ({ frame, time }) => {
	const copper = MODELS[frame].copper;
	const containerRef = useRef<Component & { scroller: Scrollable }>();
	const [hovered, setHovered] = useState<{ markdown: string; x: number; y: number; justify: string}>({ markdown: '', x: -1, y: -1, justify: '' });
	const tooltipRef = useRef<HTMLDivElement & { scroller: Scrollable }>();

	const cssVariables = useCssVariables();
	const rowHeight = parseInt(cssVariables['editor-font-size']) + 3; // needs to match CSS

	// get copper instruction that is executing at 'time'
	const dmaTime = CpuCyclesToDmaCycles(time);

	// find
	const renderRowText = useCallback((c: Copper) => {
		return `L${c.vpos.toString().padStart(3, '0')}C${c.hpos.toString().padStart(3, '0')}: $${c.address.toString(16).padStart(8, '0')}: ` + (
			c.insn.instructionType === CopperInstructionType.MOVE 
			? `${c.insn.getAsmInstruction()}; ${(c.insn as CopperMove).label} = ${FormatCustomRegData((c.insn as CopperMove).label, (c.insn as CopperMove).RD)}`
			: c.insn.toString());
	}, [frame]);

	const [find, setFind] = useState('');
	const [curFind, setCurFind] = useState(0);
	const findRef = useRef<FindCallback>();
	const findResult = useMemo(() => {
		console.time("findResult");
		const result: number[] = [];
		if(find.length > 0) {
			copper.forEach((c, i) => {
				const line = renderRowText(c);
				if(line.toLowerCase().includes(find.toLowerCase()))
					result.push(i);
			});
		}
		if(result.length > 0) {
			setCurFind(0);
		}
		console.timeEnd("findResult");
		return result;
	}, [copper, find]);
	const findCallback = useCallback((action: string, text?: string) => {
		if(action === 'prev') {
			if(findResult.length) {
				const n = (curFind + findResult.length - 1) % findResult.length;
				setCurFind(n);
			}
		} else if(action === 'next') {
			if(findResult.length) {
				const n = (curFind + 1) % findResult.length;
				setCurFind(n);
			}
		} else {
			setFind(text ?? '');
			if(action === 'close')
				(containerRef.current?.base as HTMLElement)?.focus();
		}
		return true;
	}, [setFind, containerRef.current, curFind, findResult]);

	const curInsn = useMemo(() => {
		if(findResult.length && curFind >= 0)
			return findResult[curFind];
		for(let i = 0; i < copper.length - 1; i++) {
			if(copper[i].cycle <= dmaTime && copper[i + 1].cycle > dmaTime)
				return i;
		}
		// end of copperlist?
		if(copper.length > 0 && copper[copper.length - 1].cycle <= dmaTime)
			return copper.length - 1;
		return -1;
	}, [dmaTime, curFind, findResult]);

	// cursor navigation
	useEffect(() => {
		const listener = (evt: KeyboardEvent) => {
			if((evt.key === 'f' && evt.ctrlKey) || evt.key === 'F3') {
				// open search bar
				findRef.current('open');
				evt.preventDefault();
			} else if(evt.key === 'Escape') {
				// close search bar
				findRef.current('close');
				evt.preventDefault();
			}
		};
		// make list accept keyboard events
		(containerRef.current.base as HTMLElement).tabIndex = -1;
		(containerRef.current?.base as HTMLElement)?.focus();
		containerRef.current?.base?.addEventListener('keydown', listener);
		return () => containerRef.current?.base?.removeEventListener('keydown', listener);
	}, []);

	useEffect(() => {
		if(copper.length === 0 || !containerRef.current)
			return;

		const list = containerRef.current.base as HTMLElement;
		containerRef.current.scroller ??= new Scrollable(list, 135);
		containerRef.current.scroller.scrollSmoothMinimum(Math.max(0, curInsn) * rowHeight);
	}, [curInsn, containerRef.current]);

	const onMouseEnter = useCallback((evt: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
		const h = parseInt(evt.currentTarget.attributes['data'].nodeValue);
		const rect = evt.currentTarget.getBoundingClientRect();
		if(copper[h].insn.instructionType === CopperInstructionType.MOVE) {
			const markdown = GetCustomRegDoc((copper[h].insn as CopperMove).DA);
			if(markdown) {
				const hov = { 
					markdown, 
					x: Math.min(rect.left, window.innerWidth - 530), 
					y: rect.bottom < window.innerHeight - 260 ? rect.bottom + 10 : rect.top - 260,
					justify: rect.bottom < window.innerHeight - 260 ? 'flex-start' : 'flex-end' 
				};
				setHovered(hov);
			}
		}
	}, [copper]);
	const onMouseLeave = useCallback(() => {
		setHovered({ markdown: '', x: -1, y: -1, justify: '' });
	}, []);
	const preventWheelDefault = useWheelHack(100);	
	const onWheel = useCallback((evt: WheelEvent) => {
		if(tooltipRef.current) {
			preventWheelDefault();
			tooltipRef.current.scroller ??= new Scrollable(tooltipRef.current, 135);
			tooltipRef.current.scroller.setScrollPositionSmooth(tooltipRef.current.scroller.getFutureScrollPosition() + evt.deltaY);
		}
	}, [tooltipRef.current, preventWheelDefault]);

	const renderRow = useCallback((c: Copper, i: number) => {
		const text = findResult.length > 0 
		? <Highlighter searchWords={[find]} autoEscape={true} highlightClassName={styles.find_hit} textToHighlight={renderRowText(c)} />
		: <>
			{'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ': '}
			{'$' + c.address.toString(16).padStart(8, '0') + ': '} 
			{c.insn.instructionType === CopperInstructionType.MOVE ? <>
				{c.insn.getAsmInstruction()}; <span class={styles.reg} data={i.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{(c.insn as CopperMove).label}</span> = {FormatCustomRegData((c.insn as CopperMove).label, (c.insn as CopperMove).RD)}
			</> : c.insn.toString()}
		</>;

		return <div class={styles.row + ' ' + (curInsn !== -1 && i === curInsn ? styles.cur : (c.cycle > dmaTime ? styles.future : styles.past))}>
			{text}
			{c.insn.instructionType === CopperInstructionType.MOVE && (c.insn as CopperMove).label.startsWith('COLOR') && <span style={{marginLeft: 4, background: GetAmigaColorCss((c.insn as CopperMove).RD)}}>&nbsp;&nbsp;</span>}
		</div>;
	}, [frame, onMouseEnter, onMouseLeave, onWheel, curInsn]);

	return <>
		<div class={styles.wrapper}>
			<Find ref={findRef} curFind={curFind} findResultLength={findResult.length} callback={findCallback}  />
		</div>
		<VirtualListCopper ref={containerRef} class={styles.container} rows={copper} renderRow={renderRow} rowHeight={rowHeight} overscanCount={50} />
		{hovered.markdown !== '' && (createPortal(
			<div class={styles.tooltip_parent} style={{justifyContent: hovered.justify, left: hovered.x, top: hovered.y }}>
				<div ref={tooltipRef} class={styles.tooltip}>
					<Markdown>{hovered.markdown}</Markdown>
				</div>
			</div>, document.body))}
	</>;
};
