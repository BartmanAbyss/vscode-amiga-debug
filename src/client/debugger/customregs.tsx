import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { StateUpdater, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './customregs.module.css';
import * as ChevronLeft from '../icons/chevron-left.svg';
import * as ChevronRight from '../icons/chevron-right.svg';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CustomRegisters, CustomReadWrite, CustomSpecial } from '../customRegisters';
import { GetCustomRegsAfterDma, SymbolizeAddress, GetPrevCustomRegWriteTime, GetNextCustomRegWriteTime, CpuCyclesToDmaCycles, DmaCyclesToCpuCycles } from '../dma';
import { GetCustomRegDoc } from '../docs';
import { createPortal } from 'preact/compat';
import Markdown from 'markdown-to-jsx';

export const CustomRegsView: FunctionComponent<{
	frame: number;
	time: number;
	setTime: StateUpdater<number>;
}> = ({ frame, time, setTime }) => {
	const dmaTime = CpuCyclesToDmaCycles(time);
	const prevRegs = useMemo(() => GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmacon, MODELS[frame].amiga.dmaRecords, Math.max(0, dmaTime - 1)), [dmaTime, frame]);
	const customRegs = useMemo(() => GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmacon, MODELS[frame].amiga.dmaRecords, dmaTime), [dmaTime, frame]);

	const [hovered, setHovered] = useState<{ markdown: string; x: number; y: number; justify: string}>({ markdown: '', x: -1, y: -1, justify: '' });
	const tooltipRef = useRef<HTMLDivElement>();

	const onMouseEnter = useCallback((evt: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
		const index = parseInt(evt.currentTarget.attributes['data'].nodeValue);
		const rect = evt.currentTarget.getBoundingClientRect();
		let markdown = GetCustomRegDoc(index << 1);
		if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth)
			markdown += GetCustomRegDoc((index + 1) << 1);
		if(markdown) {
			const hov = { 
				markdown, 
				x: Math.min(rect.left, window.innerWidth - 530), 
				y: rect.bottom < window.innerHeight - 260 ? rect.bottom + 10 : rect.top - 260,
				justify: rect.bottom < window.innerHeight - 260 ? 'flex-start' : 'flex-end' 
			};
			setHovered(hov);
		}
	}, []);
	const onMouseLeave = useCallback(() => {
		setHovered({ markdown: '', x: -1, y: -1, justify: '' });
	}, []);
	const onWheel = useCallback((evt: WheelEvent) => {
		evt.preventDefault(); // <- doesn't work
		// dunno how to make smooth scrolling that works when wheeling repeatedly
		if(tooltipRef.current)
			tooltipRef.current.scrollTop += evt.deltaY;
	}, [tooltipRef.current]);

	const renderReg = useCallback((index: number) => {
		const navPrev = useCallback(() => {
			let newCycle = GetPrevCustomRegWriteTime(index, dmaTime, MODELS[frame].amiga.dmaRecords);
			if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth)
				newCycle = Math.max(newCycle || dmaTime, GetPrevCustomRegWriteTime(index + 1, dmaTime, MODELS[frame].amiga.dmaRecords));
			if(newCycle !== undefined)
				setTime(DmaCyclesToCpuCycles(newCycle));
		}, [dmaTime, frame]);
		const navNext = useCallback(() => {
			let newCycle = GetNextCustomRegWriteTime(index, dmaTime, MODELS[frame].amiga.dmaRecords);
			if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth)
				newCycle = Math.min(newCycle || dmaTime, GetNextCustomRegWriteTime(index + 1, dmaTime, MODELS[frame].amiga.dmaRecords));
			if(newCycle !== undefined)
				setTime(DmaCyclesToCpuCycles(newCycle));
		}, [dmaTime, frame]);
	
		const Nav = <div class={styles.nav}>
			<button class={styles.button} onMouseDown={navPrev} type="button" dangerouslySetInnerHTML={{__html: ChevronLeft}} />
			<button class={styles.button} onMouseDown={navNext} type="button" dangerouslySetInnerHTML={{__html: ChevronRight}} />
		</div>;

		let regName = CustomRegisters.getCustomName(0xdff000 + (index << 1));
		let regPad = ''.padEnd(8 - regName.length);

		if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth) {
			regName = regName.slice(0, -1);
			regPad += ' ';
			return (<div class={styles.line}>
				<div class={styles.reg + ' ' + ((customRegs[index] !== prevRegs[index] || customRegs[index + 1] !== prevRegs[index + 1]) ? styles.cur : '')}>
					<span class={styles.help} data={index.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{regName}</span>{regPad} (${(index << 1).toString(16).padStart(3, '0')}):&nbsp;
					{SymbolizeAddress((customRegs[index] << 16) | customRegs[index + 1], MODELS[frame].amiga)}
				</div>
				{Nav}
			</div>);
		} else {
			return (<div class={styles.line}>
				<div class={styles.reg + ' ' + (customRegs[index] !== prevRegs[index] ? styles.cur : '')}>
				<span class={styles.help} data={index.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{regName}</span>{regPad} (${(index << 1).toString(16).padStart(3, '0')}):
					${customRegs[index].toString(16).padStart(4, '0')}
					{regName.startsWith('COLOR') ? <span style={{marginLeft: 4, background: `#${customRegs[index].toString(16).padStart(3, '0')}`}}>&nbsp;&nbsp;</span> : ''}
				</div>			
				{Nav}
			</div>);
		}
	}, [ frame, dmaTime, setTime, prevRegs, customRegs, onMouseEnter, onMouseLeave, onWheel ]);

	const wantCustom = (index: number) => {
		if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.ptl)
			return false;
		if(!(CustomRegisters.getCustomReadWrite(0xdff000 + (index << 1)) & CustomReadWrite.write))
			return false;
		return true;
	};

	return <>
		<div class={styles.container}>
			{customRegs.map((c, index) => wantCustom(index) ? renderReg(index) : '')}
		</div>
		{hovered.markdown !== '' && (createPortal(
			<div class={styles.tooltip_parent} style={{justifyContent: hovered.justify, left: hovered.x, top: hovered.y }}>
				<div ref={tooltipRef} class={styles.tooltip}>
					<Markdown>{hovered.markdown}</Markdown>
				</div>
			</div>, document.body))}
	</>;
};
