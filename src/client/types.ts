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

export interface IAmigaProfileExtra {
	objdump?: string; // disassembly from objdump, only in frame[0]
	chipMem?: string; // base64 encoded binary data, only in frame[0]
	bogoMem?: string; // base64 encoded binary data, only in frame[0]
	baseClock?: number;
	cpuCycleUnit?: number;
	screenshot?: string; // base64 encoded jpeg, ready to use (only present for multi-frame captures)
	dmacon: number;
	customRegs: number[];
	dmaRecords: DmaRecord[];
	gfxResources: GfxResource[];
	idleCycles: number;
	symbols: SymbolInformation[];
	sections: Section[];
	systemStackLower: number;
	systemStackUpper: number;
	stackLower: number;
	stackUpper: number;
	uniqueCallFrames: CallFrame[];
	callFrames: number[]; // 1 entry per word in .text section, indexes uniqueCallFrames
	pcTrace: number[]; // 1 entry: PC relative to .text, number of cycles
}

// extra information for shrinklerstats to track uncompressed data
export interface IShrinklerProfileExtra {
	origTimeDeltas: number[];
}

export interface ICpuProfileRaw extends Cdp.Profiler.Profile {
	$shrinkler?: IShrinklerProfileExtra;
	$vscode?: IJsDebugAnnotations;
	$amiga?: IAmigaProfileExtra;
	nodes: IProfileNode[];
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

export type Message = IOpenDocumentMessage | ISetCodeLenses;
