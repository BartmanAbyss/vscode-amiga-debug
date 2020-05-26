/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { FunctionComponent, h } from 'preact';
import { useCallback } from 'preact/hooks';
import styles from './unit-select.css';
import { DisplayUnit } from './display';

export const UnitSelect: FunctionComponent<{
	value: DisplayUnit;
	onChange?: (value: DisplayUnit) => void;
}> = ({ value, onChange }) => {
	const toggle = useCallback((event) => {
		const u = DisplayUnit[event.target.value as string];
		onChange?.(u);
	}, [onChange]);

	return (
		<select
			className={styles.unit_select}
			alt="Display Unit"
			aria-label="Display Unit"
			value={DisplayUnit[value]}
			onChange={toggle}
		>
			<option value={DisplayUnit[DisplayUnit.Microseconds]}>Microseconds</option>
			<option value={DisplayUnit[DisplayUnit.Cycles]}>Cycles</option>
			<option value={DisplayUnit[DisplayUnit.Lines]}>Rasterlines</option>
			<option value={DisplayUnit[DisplayUnit.PercentFrame]}>% of Frame</option>
			<option value={DisplayUnit[DisplayUnit.Bytes]}>Bytes</option>
			<option value={DisplayUnit[DisplayUnit.Percent]}>Percent</option>
		</select>
	);
};
