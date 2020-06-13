/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { FunctionComponent, h, Fragment } from 'preact';
import { useCallback } from 'preact/hooks';
import './styles.css';
import { DisplayUnit, DisplayUnitType } from './display';

export const UnitSelect: FunctionComponent<{
	value: DisplayUnit;
	type: DisplayUnitType;
	onChange?: (value: DisplayUnit) => void;
}> = ({ value, type, onChange }) => {
	const toggle = useCallback((event) => {
		const u = DisplayUnit[event.target.value as string];
		onChange?.(u);
	}, [onChange]);

	return (
		<select
			className="select"
			alt="Display Unit"
			aria-label="Display Unit"
			value={DisplayUnit[value]}
			onChange={toggle}
		>
			{type === DisplayUnitType.Time && <Fragment>
				<option value={DisplayUnit[DisplayUnit.Microseconds]}>Microseconds</option>
				<option value={DisplayUnit[DisplayUnit.Cycles]}>Cycles</option>
				<option value={DisplayUnit[DisplayUnit.Lines]}>Rasterlines</option>
				<option value={DisplayUnit[DisplayUnit.PercentFrame]}>% of Frame</option>
			</Fragment>}
			{type === DisplayUnitType.Size && <Fragment>
				<option value={DisplayUnit[DisplayUnit.Bytes]}>Bytes</option>
				<option value={DisplayUnit[DisplayUnit.BytesHex]}>Bytes (Hex)</option>
				<option value={DisplayUnit[DisplayUnit.Percent]}>Percent</option>
			</Fragment>}
		</select>
	);
};
