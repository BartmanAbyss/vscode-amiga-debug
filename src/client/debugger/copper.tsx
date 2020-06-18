import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './copper.module.css';

import { IProfileModel } from '../model';
declare const MODEL: IProfileModel;

import { CopperDisassembler } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper } from '../dma';

export const CopperList: FunctionComponent<{
	time: number
}> = ({ time }) => {
	const copper = useMemo(() => GetCopper(MODEL.memory.chipMem, MODEL.amiga.dmaRecords), [MODEL]);

	return (<div class={styles.container}>
		{copper.map((c) => 'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ' $' + c.address.toString(16).padStart(8, '0') + ': ' + c.insn.toString()).join('\n')}
	</div>);
};
