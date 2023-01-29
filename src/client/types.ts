/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Protocol as Cdp } from 'devtools-protocol';
import { ISourceLocation } from './location-mapping';
import { DmaRecord, GfxResource, CallFrame } from '../backend/profile_types';
import { SymbolInformation, Section } from '../symbols';

export const enum Constants {
	CurrentDataVersion = 1,
}

export interface IAnnotationLocation {
	callFrame: Cdp.Runtime.CallFrame;
	locations: ISourceLocation[];
}

/**
 * Extra annotations added by js-debug.
 */
export interface IJsDebugAnnotations {
	/**
	 * Workspace root path, if set.
	 */
	rootPath?: string;

	/**
	 * For each node in the profile, the list of locations in corresponds to
	 * in the workspace (if any).
	 */
	locations: readonly IAnnotationLocation[];

	/**
	 * Optional cell data saved from previously opening the profile as a notebook.
	 */
	cellData?: {
		version: number;
	};
}

export interface IProfileNode extends Cdp.Profiler.ProfileNode {
	locationId?: number;
	positionTicks?: (Cdp.Profiler.PositionTickInfo & {
		startLocationId?: number;
		endLocationId?: number;
	})[];
}

export enum Register {
	D0, D1, D2, D3, D4, D5, D6, D7,
	A0, A1, A2, A3, A4, A5, A6, A7,
	SR,
	_count // end marker
}

export interface IAmigaProfileBase {
	objdump: string; // disassembly from objdump
	chipMem: string; // base64 encoded binary data
	bogoMem: string; // base64 encoded binary data
	symbols: SymbolInformation[];
	sections: Section[];
	systemStackLower: number;
	systemStackUpper: number;
	stackLower: number;
	stackUpper: number;
	baseClock: number;
	cpuCycleUnit: number;
}

export interface IAmigaProfileExtra {
	chipsetFlags: number;
	customRegs: number[];
	agaColors: number[];
	dmaRecords: DmaRecord[];
	gfxResources: GfxResource[];
	idleCycles: number;
	uniqueCallFrames: CallFrame[];
	callFrames: number[]; // 1 entry per word in .text section, indexes uniqueCallFrames
	pcTrace: number[]; // 1 entry: PC relative to .text, number of cycles
	registerTrace?: number[]; // 1 entry: Register._count registers
}

// extra information for shrinklerstats to track uncompressed data
export interface IShrinklerProfileExtra {
	origTimeDeltas: number[];
}

export interface ICpuProfileRaw extends Cdp.Profiler.Profile {
	$shrinkler?: IShrinklerProfileExtra;
	$vscode?: IJsDebugAnnotations;
	$amiga?: IAmigaProfileExtra;
	$base?: IAmigaProfileBase; // only in frame[0]
	screenshot?: string; // base64 encoded jpeg, ready to use (only present for multi-frame captures)
	nodes: IProfileNode[];
}

export interface IAmigaProfileSplit {
	$id: 'IAmigaProfileSplit';
	numFrames: number;
	firstFrame: ICpuProfileRaw;
	screenshots: string[];
}

// messages from webview to vs code
export interface IOpenDocumentMessage {
	type: 'openDocument';
	location?: ISourceLocation;
	callFrame?: Cdp.Runtime.CallFrame;
	toSide: boolean;
}

export interface LensData { 
	self: number; 
	agg: number; 
	ticks: number; 
}

export interface Lens {
	file: string;
	line: number;
	data: LensData;
}

export interface ISetCodeLenses {
	type: 'setCodeLenses';
	lenses: Lens[];
}

export interface IErrorMessage {
	type: 'error';
	text: string;
}

export type Message = IOpenDocumentMessage | ISetCodeLenses | IErrorMessage;
