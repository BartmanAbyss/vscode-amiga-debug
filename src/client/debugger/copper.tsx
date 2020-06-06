import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { CopperDisassembler } from './copperDisassembler';

export const CopperVis: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	const chipMem = Uint8Array.from(atob(model.chipMem), (c) => c.charCodeAt(0));
	const copper1 = new CopperDisassembler(chipMem, 0x3721c); // TEST
	const copper2 = new CopperDisassembler(chipMem, 0x4021c); // TEST
	return (
		<Fragment>
			<div class={styles.container}>{copper1.toString() + "\n" + copper2.toString()}</div>
		</Fragment>
	);
};
