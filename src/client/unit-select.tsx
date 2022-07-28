/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { FunctionComponent, h, Fragment, JSX } from 'preact';
import { useCallback } from 'preact/hooks';
import './styles.css';
import { DisplayUnit, DisplayUnitType } from './display';

export const UnitSelect: FunctionComponent<{
	value: DisplayUnit;
	type: DisplayUnitType;
	onChange?: (value: DisplayUnit) => void;
}> = ({ value, type, onChange }) => {
	const toggle = useCallback(({currentTarget}: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
		const u = DisplayUnit[currentTarget.value];
		onChange?.(u);
	}, [onChange]);

	return (
		<select
			className="select"
			alt="Display Unit"
			aria-label="Display Unit"
			value={DisplayUnit[value]}
			onInput={toggle}
		>
			{type === DisplayUnitType.Time && <>
				<option value={DisplayUnit[DisplayUnit.Microseconds]}>Microseconds</option>
				<option value={DisplayUnit[DisplayUnit.Cycles]}>Cycles</option>
				<option value={DisplayUnit[DisplayUnit.Lines]}>Rasterlines</option>
				<option value={DisplayUnit[DisplayUnit.PercentFrame]}>% of Frame</option>
			</>}
			{type === DisplayUnitType.Size && <>
				<option value={DisplayUnit[DisplayUnit.Bytes]}>Bytes</option>
				<option value={DisplayUnit[DisplayUnit.BytesHex]}>Bytes (Hex)</option>
				<option value={DisplayUnit[DisplayUnit.Percent]}>Percent</option>
			</>}
		</select>
	);
};
