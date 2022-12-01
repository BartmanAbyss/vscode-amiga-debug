import { FunctionComponent, JSX } from 'preact';
import { StateUpdater, useCallback, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './customregs.module.css';
import * as ChevronLeft from '../icons/chevron-left.svg';
import * as ChevronRight from '../icons/chevron-right.svg';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CustomReadWrite, CustomSpecial, FormatCustomRegData, Custom } from '../custom';
import { GetCustomRegsAfterDma, SymbolizeAddress, GetPrevCustomRegWriteTime, GetNextCustomRegWriteTime, CpuCyclesToDmaCycles, DmaCyclesToCpuCycles } from '../dma';
import { GetCustomRegDoc } from '../docs';
import { createPortal } from 'preact/compat';
import { useWheelHack } from '../useWheelHack';
import { Scrollable } from '../scrollable';
import { StyledMarkdown } from '../styledMarkdown';

export const CustomRegsView: FunctionComponent<{
	frame: number;
	time: number;
	setTime: StateUpdater<number>;
}> = ({ frame, time, setTime }) => {
	const dmaTime = CpuCyclesToDmaCycles(time);
	const prevRegs = useMemo(() => GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmaRecords, Math.max(0, dmaTime - 1)), [dmaTime, frame]);
	const customRegs = useMemo(() => GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmaRecords, dmaTime), [dmaTime, frame]);

	const [hovered, setHovered] = useState<{ markdown: string; x: number; y: number; justify: string}>({ markdown: '', x: -1, y: -1, justify: '' });
	const tooltipRef = useRef<HTMLDivElement & { scroller: Scrollable }>();

	const onMouseEnter = useCallback((evt: JSX.TargetedMouseEvent<HTMLSpanElement>) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
		const index = parseInt(evt.currentTarget.attributes['data'].nodeValue);
		const rect = evt.currentTarget.getBoundingClientRect();
		let markdown = GetCustomRegDoc(index << 1);
		if(Custom.ByIndex(index).special & CustomSpecial.pth)
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
	const preventWheelDefault = useWheelHack(100);	
	const onWheel = useCallback((evt: WheelEvent) => {
		if(tooltipRef.current) {
			preventWheelDefault();
			tooltipRef.current.scroller ??= new Scrollable(tooltipRef.current, 135);
			tooltipRef.current.scroller.setScrollPositionSmooth(tooltipRef.current.scroller.getFutureScrollPosition() + evt.deltaY);
		}
	}, [tooltipRef.current, preventWheelDefault]);

	const renderReg = useCallback((index: number) => {
		const navPrev = useCallback(() => {
			let newCycle = GetPrevCustomRegWriteTime(index, dmaTime, MODELS[frame].amiga.dmaRecords);
			if(Custom.ByIndex(index).special & CustomSpecial.pth)
				newCycle = Math.max(newCycle || dmaTime, GetPrevCustomRegWriteTime(index + 1, dmaTime, MODELS[frame].amiga.dmaRecords));
			if(newCycle !== undefined)
				setTime(DmaCyclesToCpuCycles(newCycle));
		}, [dmaTime, frame]);
		const navNext = useCallback(() => {
			let newCycle = GetNextCustomRegWriteTime(index, dmaTime, MODELS[frame].amiga.dmaRecords);
			if(Custom.ByIndex(index).special & CustomSpecial.pth)
				newCycle = Math.min(newCycle || dmaTime, GetNextCustomRegWriteTime(index + 1, dmaTime, MODELS[frame].amiga.dmaRecords));
			if(newCycle !== undefined)
				setTime(DmaCyclesToCpuCycles(newCycle));
		}, [dmaTime, frame]);
	
		const Nav = <div class={styles.nav}>
			<button class={styles.button} onMouseDown={navPrev} type="button" dangerouslySetInnerHTML={{__html: ChevronLeft}} />
			<button class={styles.button} onMouseDown={navNext} type="button" dangerouslySetInnerHTML={{__html: ChevronRight}} />
		</div>;

		let regName = Custom.ByIndex(index).name;
		let regPad = ''.padEnd(8 - regName.length);

		if(Custom.ByIndex(index).special & CustomSpecial.pth) {
			regName = regName.slice(0, -1);
			regPad += ' ';
			return (<div class={styles.line}>
				<div class={styles.reg + ' ' + ((customRegs[index] !== prevRegs[index] || customRegs[index + 1] !== prevRegs[index + 1]) ? styles.cur : '')}>
					<span class={styles.help} data={index.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{regName}</span>{regPad} (${(index << 1).toString(16).padStart(3, '0')}):&nbsp;
					{SymbolizeAddress((customRegs[index] << 16) | customRegs[index + 1], MODELS[frame].amiga, MODELS[0].base)}
				</div>
				{Nav}
			</div>);
		} else {
			return (<div class={styles.line}>
				<div class={styles.reg + ' ' + (customRegs[index] !== prevRegs[index] ? styles.cur : '')}>
				<span class={styles.help} data={index.toString()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onWheel={onWheel}>{regName}</span>{regPad} (${(index << 1).toString(16).padStart(3, '0')}):
					{FormatCustomRegData(regName, customRegs[index])}
					{regName.startsWith('COLOR') ? <span style={{marginLeft: 4, background: `#${customRegs[index].toString(16).padStart(3, '0')}`}}>&nbsp;&nbsp;</span> : ''}
				</div>			
				{Nav}
			</div>);
		}
	}, [ frame, dmaTime, setTime, prevRegs, customRegs, onMouseEnter, onMouseLeave, onWheel ]);

	const wantCustom = (index: number) => {
		if(Custom.ByIndex(index).special & CustomSpecial.ptl)
			return false;
		if(!(Custom.ByIndex(index).rw & CustomReadWrite.write))
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
					<StyledMarkdown>{hovered.markdown}</StyledMarkdown>
				</div>
			</div>, document.body))}
	</>;
};
