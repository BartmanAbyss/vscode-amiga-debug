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
	dat?: number; // 16, 32 or 64 bit (lower 32 bit)
	datHi?: number; // 64 bit (upper 32 bit)
	size?: number; // 2 = 16 bit, 4 = 32 bit, 8 = 64 bit
	addr?: number;
	evt?: number;
	type?: number;
	extra?: number;
	intlev?: number;
	end?: boolean;
}

// needs to match gcc8_c_support.h
export enum GfxResourceType {
	bitmap,
	palette,
	copperlist,
	sprite,
}

// needs to match gcc8_c_support.h
export enum GfxResourceFlags {
	none = 0,
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
	sprite?: {
		index: number;
	};
}
