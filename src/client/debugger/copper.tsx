import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';

import { IProfileModel } from '../model';
declare const MODEL: IProfileModel;

import { CopperDisassembler } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper, Copper } from '../dma';

export const CopperList: FunctionComponent<{
	time: number
}> = ({ time }) => {
	const copper = useMemo(() => GetCopper(MODEL.memory.chipMem, MODEL.amiga.dmaRecords), [MODEL]);
	const containerRef = useRef<HTMLDivElement>();

	let curInsn = -1;
	for(let i = 0; i < copper.length - 1; i++) {
		if(copper[i].cycle <= time / 2 && copper[i + 1].cycle > time / 2) {
			curInsn = i;
			break;
		}
	}
	if(curInsn === -1) {
		// end of copperlist
		if(copper.length > 0 && copper[copper.length - 1].cycle <= time / 2)
			curInsn = copper.length - 1;
	}

	useEffect(() => {
		if(curInsn === -1 || !containerRef.current)
			return;

		(containerRef.current.children[curInsn] as any).scrollIntoViewIfNeeded(true);
	}, [curInsn, containerRef.current]);

	return (<div ref={containerRef} class={styles.container}>
		{copper.map((c) => <div class={styles.fixed + ' ' + (curInsn !== -1 && c === copper[curInsn] ? styles.cur : (c.cycle > time / 2 ? styles.future : styles.past))}>
			{'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ': ' + c.insn.toString()}
		</div>)}
	</div>);
};
