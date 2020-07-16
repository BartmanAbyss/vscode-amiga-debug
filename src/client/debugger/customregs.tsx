import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './customregs.module.css';
import * as ChevronLeft from '../icons/chevron-left.svg';
import * as ChevronRight from '../icons/chevron-right.svg';

import { IProfileModel } from '../model';
declare const MODELS: IProfileModel[];

import { CustomRegisters, CustomReadWrite, CustomSpecial } from '../customRegisters';
import { GetCustomRegsAfterDma, SymbolizeAddress, GetPrevCustomRegWriteTime, GetNextCustomRegWriteTime } from '../dma';

const CustomReg: FunctionComponent<{
	frame: number,
	time: number,
	setTime,
	index: number,
	prevRegs: number[],
	customRegs: number[],
}> = ({ frame, time, setTime, index, prevRegs, customRegs }) => {
	const navPrev = useCallback(() => {
		let newCycle = GetPrevCustomRegWriteTime(index, time >> 1, MODELS[frame].amiga.dmaRecords);
		if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth)
			newCycle = Math.max(newCycle || (time >> 1), GetPrevCustomRegWriteTime(index + 1, time >> 1, MODELS[frame].amiga.dmaRecords));
		if(newCycle !== undefined)
			setTime(newCycle << 1);
	}, [time, frame]);
	const navNext = useCallback(() => {
		let newCycle = GetNextCustomRegWriteTime(index, time >> 1, MODELS[frame].amiga.dmaRecords);
		if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth)
			newCycle = Math.min(newCycle || (time >> 1), GetNextCustomRegWriteTime(index + 1, time >> 1, MODELS[frame].amiga.dmaRecords));
		if(newCycle !== undefined)
			setTime(newCycle << 1);
	}, [time, frame]);

	const Nav = <div class={styles.nav}>
		<button class={styles.button} onMouseDown={navPrev} type="button" dangerouslySetInnerHTML={{__html: ChevronLeft}} />
		<button class={styles.button} onMouseDown={navNext} type="button" dangerouslySetInnerHTML={{__html: ChevronRight}} />
	</div>;

	if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.pth) {
		return (<div class={styles.line}>
			<div class={styles.reg + ' ' + ((customRegs[index] !== prevRegs[index] || customRegs[index + 1] !== prevRegs[index + 1]) ? styles.cur : '')}>
				{(CustomRegisters.getCustomName(0xdff000 + (index << 1))).slice(0, -1).padEnd(8)} (${(index << 1).toString(16).padStart(3, '0')}):&nbsp;
				{SymbolizeAddress((customRegs[index] << 16) | customRegs[index + 1], MODELS[frame].amiga)}
			</div>
			{Nav}
		</div>);
	} else {
		return (<div class={styles.line}>
			<div class={styles.reg + ' ' + (customRegs[index] !== prevRegs[index] ? styles.cur : '')}>
				{(CustomRegisters.getCustomName(0xdff000 + (index << 1))).padEnd(8)} (${(index << 1).toString(16).padStart(3, '0')}): ${customRegs[index].toString(16).padStart(4, '0')}
				{CustomRegisters.getCustomName(0xdff000 + (index << 1)).startsWith('COLOR') ? <span style={{marginLeft: 4, background: `#${customRegs[index].toString(16).padStart(3, '0')}`}}>&nbsp;&nbsp;</span> : ''}
			</div>			
			{Nav}
		</div>);
	}
};

export const CustomRegsView: FunctionComponent<{
	frame: number,
	time: number,
	setTime
}> = ({ frame, time, setTime }) => {
	const prevRegs = useMemo(() => GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmacon, MODELS[frame].amiga.dmaRecords, Math.max(0, (time >> 1) - 1)), [time, frame]);
	const customRegs = useMemo(() => GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmacon, MODELS[frame].amiga.dmaRecords, time >> 1), [time, frame]);

	const wantCustom = (index: number) => {
		if(CustomRegisters.getCustomSpecial(0xdff000 + (index << 1)) & CustomSpecial.ptl)
			return false;
		if(!(CustomRegisters.getCustomReadWrite(0xdff000 + (index << 1)) & CustomReadWrite.write))
			return false;
		return true;
	};

	return (<div class={styles.container}>
		{customRegs.map((c, index) => wantCustom(index) ? <CustomReg frame={frame} time={time} setTime={setTime} index={index} prevRegs={prevRegs} customRegs={customRegs} /> : '')}
	</div>);
};
