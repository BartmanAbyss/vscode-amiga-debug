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
	locations: ReadonlyArray<IAnnotationLocation>;

	/**
	 * Optional cell data saved from previously opening the profile as a notebook.
	 */
	cellData?: {
		version: number;
	};
}

export interface IProfileNode extends Cdp.Profiler.ProfileNode {
	locationId?: number;
	positionTicks?: Array<Cdp.Profiler.PositionTickInfo & {
		startLocationId?: number;
		endLocationId?: number;
	}>;
}

export interface IAmigaProfileExtra {
	chipMem: string; // base64 encoded binary data
	bogoMem: string; // base64 encoded binary data
	dmacon: number;
	customRegs: number[];
	dmaRecords: DmaRecord[];
	gfxResources: GfxResource[];
	symbols: SymbolInformation[];
	sections: Section[];
	systemStackLower: number;
	systemStackUpper: number;
	stackLower: number;
	stackUpper: number;
	uniqueCallFrames: CallFrame[];
	callFrames: number[]; // 1 entry per word in .text section, indexes uniqueCallFrames
}

export interface ICpuProfileRaw extends Cdp.Profiler.Profile {
	$vscode?: IJsDebugAnnotations;
	$amiga?: IAmigaProfileExtra;
	nodes: IProfileNode[];
}

/**
 * Request from the webview to open a document
 */
export interface IOpenDocumentMessage {
	type: 'openDocument';
	location?: ISourceLocation;
	callFrame?: Cdp.Runtime.CallFrame;
	toSide: boolean;
}

/**
 * Reopens the current document with the given editor, optionally only if
 * the given extension is installed.
 */
export interface IReopenWithEditor {
	type: 'reopenWith';
	viewType: string;
	requireExtension?: string;
}

export type Message = IOpenDocumentMessage | IReopenWithEditor;
