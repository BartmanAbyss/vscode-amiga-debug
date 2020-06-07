import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { GetBlits } from '../dma';
import ReactJson from 'react-json-view'; // DEBUG only

export const BlitterVis: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	const blits = useMemo(() => {
		const customRegs = new Uint16Array(model.customRegs);
		return GetBlits(customRegs, model.dmaRecords);
	}, [model]);

	return (
		<Fragment>
			<div class={styles.container}>
				<ReactJson src={blits} name="blits" theme="monokai" enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
			</div>
		</Fragment>
	);
};
