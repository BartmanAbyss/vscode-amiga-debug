/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { ILocation } from './model';

/**
 * Gets the human-readable label for the given location.
 */
export const getLocationText = (location: ILocation) => {
	if (!location.callFrame.url) {
		return; // 'virtual' frames like (program) or (idle)
	}

	if (!location.src?.source.path) {
		let text = `${location.callFrame.url}`;
		if (location.callFrame.lineNumber >= 0) {
			text += `:${location.callFrame.lineNumber}`;
		}

		return text;
	}

	if (location.src.relativePath) {
		return `${location.src.relativePath}:${location.src.lineNumber}`;
	}

	return `${location.src.source.path}:${location.src.lineNumber}`;
};

export enum DisplayUnit {
	Microseconds,
	Cycles,
	Lines,
	PercentFrame,
	Bytes,
	Percent
}

const decimalFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
});

const integerFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0
});


export const formatValue = (value: number, unit: DisplayUnit) => {
	const cyclesPerMicroSecond = 7.093790;
	switch(unit) {
	case DisplayUnit.Microseconds: return integerFormat.format(value / cyclesPerMicroSecond) + 'µs';
	case DisplayUnit.Cycles: return integerFormat.format(value) + 'cy';
	case DisplayUnit.Lines: return decimalFormat.format(value / cyclesPerMicroSecond / 200 * 312.5 / 100) + 'li';
	case DisplayUnit.PercentFrame: return decimalFormat.format(value / cyclesPerMicroSecond / 200) + '%';
	default: return decimalFormat.format(value);
	}
};
