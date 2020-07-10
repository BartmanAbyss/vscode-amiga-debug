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

export enum DisplayUnitType {
	Time,
	Size
}

export enum DisplayUnit {
	Microseconds,
	Cycles,
	Lines,
	PercentFrame,
	Bytes,
	BytesHex,
	Percent
}

const decimalFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
});

const integerFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0
});

export const dataName = (unit: DisplayUnit) => {
	switch(unit) {
		case DisplayUnit.Microseconds:
		case DisplayUnit.Cycles:
		case DisplayUnit.Lines:
		case DisplayUnit.PercentFrame:
			return 'Time';
		case DisplayUnit.Bytes:
		case DisplayUnit.BytesHex:
		case DisplayUnit.Percent:
			return 'Size';
		default:
			return '???';
	}
};

export const scaleValue = (value: number, total: number, unit: DisplayUnit) => {
	const cyclesPerMicroSecond = 7.093790;
	switch(unit) {
	case DisplayUnit.Microseconds: return value / cyclesPerMicroSecond;
	case DisplayUnit.Cycles: return value;
	case DisplayUnit.Lines: return value / cyclesPerMicroSecond / 200 * 312.5 / 100; // PAL defaults to 313 lines, if VPOSW LOF-bit is not set, it's 312 lines; 7.09MHz/50=312.5 lines
	case DisplayUnit.PercentFrame: return value / cyclesPerMicroSecond / 200;
	case DisplayUnit.Bytes: return Math.round(value);
	case DisplayUnit.BytesHex: return Math.round(value);
	case DisplayUnit.Percent: return value / total * 100;
	default: return value;
	}
};

export const formatValue = (value: number, total: number, unit: DisplayUnit) => {
	value = scaleValue(value, total, unit);
	switch(unit) {
	case DisplayUnit.Microseconds: return integerFormat.format(value) + 'µs';
	case DisplayUnit.Cycles: return integerFormat.format(value) + 'cy';
	case DisplayUnit.Lines: return decimalFormat.format(value) + 'li';
	case DisplayUnit.PercentFrame: return decimalFormat.format(value) + '%';
	case DisplayUnit.Bytes: return integerFormat.format(value) + 'b';
	case DisplayUnit.BytesHex: return '$' + value.toString(16);
	case DisplayUnit.Percent: return decimalFormat.format(value) + '%';
	default: return decimalFormat.format(value);
	}
};
