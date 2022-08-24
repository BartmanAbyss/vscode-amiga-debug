import { FunctionComponent, JSX } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';
import Markdown from 'markdown-to-jsx';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CopperInstructionType, CopperMove } from '../copperDisassembler';
import { CpuCyclesToDmaCycles, GetAmigaColorCss } from '../dma';
import { createPortal } from 'preact/compat';
import { GetCustomRegDoc } from '../docs';
import { FormatCustomRegData } from '../customRegisters';
import { useWheelHack } from '../useWheelHack';
import { Scrollable } from '../scrollable';

export const CopperView: FunctionComponent<{
	frame: number;
	time: number;
}> = ({ frame, time }) => {
	const copper = MODELS[frame].copper;
	const containerRef = useRef<HTMLDivElement>();
	const [hovered, setHovered] = useState<{ markdown: string; x: number; y: number; justify: string}>({ markdown: '', x: -1, y: -1, justify: '' });
	const tooltipRef = useRef<HTMLDivElement & { scroller: Scrollable }>();

	// get copper instruction that is executing at 'time'
	const dmaTime = CpuCyclesToDmaCycles(time);
	let curInsn = -1;
	for(let i = 0; i < copper.length - 1; i++) {
		if(copper[i].cycle <= dmaTime && copper[i + 1].cycle > dmaTime) {
			curInsn = i;
			break;
		}
	}
	if(curInsn === -1) {
		// end of copperlist?
		if(copper.length > 0 && copper[copper.length - 1].cycle <= dmaTime)
			curInsn = copper.length - 1;
	}

	useEffect(() => {
		if(copper.length === 0 || !containerRef.current)
			return;

		// smooth scrolling if just clicking on the timeline, instant scrolling when dragging
		const now = performance.now();
		const behavior: ScrollBehavior = (now - containerRef.current['lastUpdate'] > 100) ? 'smooth' : 'auto';
		containerRef.current['lastUpdate'] = now;
		containerRef.current.children[Math.max(0, curInsn)].scrollIntoView({ behavior, block: 'nearest' }); // 'block' would be better, but scrolls whole page...
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

	return (<div ref={containerRef} class={styles.container}>
		{copper.map((c, i) => <div class={styles.fixed + ' ' + (curInsn !== -1 && c === copper[curInsn] ? styles.cur : (c.cycle > dmaTime ? styles.future : styles.past))}>
			{'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ': '}
			{'$' + c.address.toString(16).padStart(8, '0') + ': '} 
			{c.insn.instructionType === CopperInstructionType.MOVE ? <>
				{c.insn.getAsmInstruction()}; <span class={styles.reg} data={i.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{(c.insn as CopperMove).label}</span> = {FormatCustomRegData((c.insn as CopperMove).label, (c.insn as CopperMove).RD)}
				{(c.insn as CopperMove).label.startsWith('COLOR') ? <span style={{marginLeft: 4, background: GetAmigaColorCss((c.insn as CopperMove).RD)}}>&nbsp;&nbsp;</span> : ''}
			</> : c.insn.toString()}
		</div>)}
		{hovered.markdown !== '' && (createPortal(
			<div class={styles.tooltip_parent} style={{justifyContent: hovered.justify, left: hovered.x, top: hovered.y }}>
				<div ref={tooltipRef} class={styles.tooltip}>
					<Markdown>{hovered.markdown}</Markdown>
				</div>
			</div>, document.body))}
	</div>);
};
