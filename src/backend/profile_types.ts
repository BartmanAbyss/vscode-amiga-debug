export interface SourceLine {
	func?: string;
	file: string;
	line: number;
}

export interface CallFrame {
	frames: SourceLine[];
}

export interface DmaRecord {
	reg?: number;
	dat?: number;
	addr?: number;
	evt?: number;
	type?: number;
	extra?: number;
	intlev?: number;
}

export enum GfxResourceType {
	bitmap,
	palette,
	copperlist
}

export enum GfxResourceFlags {
	bitmap_interleaved = 1 << 0
}

export interface GfxResource {
	address: number;
	size: number;
	name: string;
	type: GfxResourceType;
	flags: GfxResourceFlags;
	bitmap?: {
		width: number;
		height: number;
		numPlanes: number;
	};
	palette?: {
		numEntries: number;
	};
}