import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { CopperDisassembler } from '../copperDisassembler';
import { CustomRegisters } from '../customRegisters';
import { GetCopper } from '../dma';

export const CopperList: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	//const customRegs = new Uint16Array(model.customRegs);
	//const customRegL = (reg: number) => (customRegs[(reg - 0xdff000) >>> 1] << 16) | customRegs[(reg + 2 - 0xdff000) >>> 1];
	//const regCOP1LC = CustomRegisters.getCustomAddress("COP1LC");
	//const COP1LC = customRegL(regCOP1LC);
	const chipMem = Uint8Array.from(atob(model.chipMem), (c) => c.charCodeAt(0));
	//const copper1 = new CopperDisassembler(chipMem, COP1LC);
	const copper = GetCopper(chipMem, model.dmaRecords);
	return (
		<Fragment>
			<div class={styles.container}>{copper.map((c) => 'L' + c.vpos.toString().padStart(3, '0') + 'C' + c.hpos.toString().padStart(3, '0') + ' $' + c.address.toString(16).padStart(8, '0') + ': ' + c.insn.toString()).join('\n')}</div>
		</Fragment>
	);
};
