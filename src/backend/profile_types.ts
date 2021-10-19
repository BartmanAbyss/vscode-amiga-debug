export interface SourceLine {
	func?: string;
	file: string;
	line: number;
}

export interface CallFrame {
	frames: SourceLine[];
}

export interface DmaRecord {
	reg?: number; // & 0x1000 => CPU
	dat?: number; // 16, 32 or 64 bit
	size?: number; // 2 = 16 bit, 4 = 32 bit, 8 = 64 bit
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

// needs to match gcc8_c_support.h
export enum GfxResourceFlags {
	bitmap_interleaved = 1 << 0,
	bitmap_masked = 1 << 1, 
	bitmap_ham = 1 << 2, 
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
