import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './customregs.module.css';

import { IProfileModel } from '../model';
declare const MODEL: IProfileModel;

import { CustomRegisters, CustomReadWrite } from '../customRegisters';
import { GetCustomRegsAfterDma } from '../dma';

export const CustomRegsView: FunctionComponent<{
	time: number
}> = ({ time }) => {
	const prevRegs = useMemo(() => GetCustomRegsAfterDma(MODEL.amiga.customRegs, MODEL.amiga.dmaRecords, Math.max(0, time / 2 - 1)), [time]);
	const customRegs = useMemo(() => GetCustomRegsAfterDma(MODEL.amiga.customRegs, MODEL.amiga.dmaRecords, time / 2), [time]);

	return (<div class={styles.container}>
		{customRegs.map((c, idx) => (CustomRegisters.getCustomReadWrite(0xdff000 + (idx << 1)) & CustomReadWrite.write) ? <div class={styles.fixed + ' ' + (c !== prevRegs[idx] ? styles.cur : '')}>
		{(CustomRegisters.getCustomName(0xdff000 + (idx << 1))).padEnd(8)} (${(idx << 1).toString(16).padStart(3, '0')}): ${c.toString(16).padStart(4, '0')}
		</div> : '')}
	</div>);
};
