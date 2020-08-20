import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';
import Markdown from 'markdown-to-jsx';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CopperDisassembler, CopperInstructionType, CopperMove } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper, Copper, CpuCyclesToDmaCycles } from '../dma';
import { createPortal } from 'preact/compat';
import { GetCustomRegDoc } from '../docs';

export const CopperView: FunctionComponent<{
	frame: number,
	time: number
}> = ({ frame, time }) => {
	const copper = useMemo(() => GetCopper(MODELS[frame].memory.chipMem, MODELS[frame].amiga.dmaRecords), [frame]);
	const containerRef = useRef<HTMLDivElement>();
	const [hovered, setHovered] = useState<{ index: number, x: number, y: number, justify: string}>({ index: -1, x: -1, y: -1, justify: '' });
	const tooltipRef = useRef<HTMLDivElement>();

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
		containerRef.current.children[Math.max(0, curInsn)].scrollIntoView({ behavior, block: 'center' });
	}, [curInsn, containerRef.current]);

	const onMouseEnter = useCallback((evt: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
		const h = parseInt(evt.currentTarget.attributes['data'].nodeValue);
		const rect = evt.currentTarget.getBoundingClientRect();
		if(copper[h].insn.instructionType === CopperInstructionType.MOVE) {
			const hov = { 
				index: h, 
				x: Math.min(rect.left, window.innerWidth - 530), 
				y: rect.bottom < window.innerHeight - 260 ? rect.bottom + 10 : rect.top - 260,
				justify: rect.bottom < window.innerHeight - 260 ? 'flex-start' : 'flex-end' 
			};
			setHovered(hov);
		}
	}, [copper]);
	const onMouseLeave = useCallback(() => {
		setHovered({ index: -1, x: -1, y: -1, justify: '' });
	}, []);
	const onWheel = useCallback((evt: WheelEvent) => {
		evt.preventDefault();
		// dunno how to make smooth scrolling that works when wheeling repeatedly
		tooltipRef.current.scrollTop += evt.deltaY;
	}, [tooltipRef.current]);

	return (<div ref={containerRef} class={styles.container}>
		{copper.map((c, i) => <div class={styles.fixed + ' ' + (curInsn !== -1 && c === copper[curInsn] ? styles.cur : (c.cycle > dmaTime ? styles.future : styles.past))}>
			{'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ': '}
			{'$' + c.address.toString(16).padStart(8, '0') + ': '} 
			{c.insn.instructionType === CopperInstructionType.MOVE ? <Fragment>
				{c.insn.getAsmInstruction()}; <span class={styles.reg} data={i.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{(c.insn as CopperMove).label}</span> = ${(c.insn as CopperMove).RD.toString(16).padStart(4, '0')}
				{(c.insn as CopperMove).label.startsWith('COLOR') ? <span style={{marginLeft: 4, background: `#${(c.insn as CopperMove).RD.toString(16).padStart(3, '0')}`}}>&nbsp;&nbsp;</span> : ''}
			</Fragment> : c.insn.toString()}
		</div>)}
		{hovered.index !== -1 && (createPortal(
			<div class={styles.tooltip_parent} style={{justifyContent: hovered.justify, left: hovered.x, top: hovered.y }}>
				<div ref={tooltipRef} class={styles.tooltip}>
					<Markdown>{GetCustomRegDoc((copper[hovered.index].insn as CopperMove).DA)}</Markdown>
				</div>
			</div>, document.body))}
	</div>);
};
