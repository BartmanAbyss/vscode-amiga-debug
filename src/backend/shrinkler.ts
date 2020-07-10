import { ICpuProfileRaw } from '../client/types';
import { CallFrame } from './profile_types';
import { profileCommon } from "./profile_common";

interface Symbol {
	origPos: number;
	origSize: number;
	compressedPos: number;
	compressedSize: number;
	name: string;
}

interface Hunk {
	index: number;
	name: string;
	origSize: number;
	compressedSize: number;
	symbols: Symbol[];
}

interface Stats {
	hunks: Hunk[];
}

export function profileShrinkler(stats: Stats): ICpuProfileRaw {
	interface DataSymbol {
		callstack: CallFrame;
		pos: number;
		size: number;
		origPos: number;
		origSize: number;
	}
	type SymbolMap = DataSymbol[];
	const sectionMap: SymbolMap[] = [];

	const origSizes: number[] = [];
	const sizes: number[] = [];
	const locations: CallFrame[] = [];

	for(const hunk of stats.hunks) {
		const symbols: SymbolMap = [];
		const seen = new Map<string, number>();
		for(const symbol of hunk.symbols) {
			let name = symbol.name;
			const prev = seen.get(name);
			if(prev) {
				name += ` (${prev + 1})`;
				seen.set(name, prev + 1);
			} else {
				seen.set(name, 1);
			}
			const callstack: CallFrame = {
				frames: [
					{
						func: hunk.name,
						file: '',
						line: 0
					},
					{
						func: name,
						file: '',
						line: symbol.origPos
					}
				]
			};
			symbols.push({
				callstack,
				pos: symbol.compressedPos,
				size: Math.max(0, symbol.compressedSize),
				origPos: symbol.origPos,
				origSize: symbol.origSize,
			});
		}
		sectionMap.push(symbols);
	}

	for(let i = 0; i < stats.hunks.length; i++) {
		const section = sectionMap[i];
		const hunk = stats.hunks[i];
		if(hunk.name.startsWith("BSS"))
			continue;
		const sectionSymbols = section.sort((a, b) => a.origPos - b.origPos);
		let lastEmptySymbol: DataSymbol = null;
		let lastSymbol: DataSymbol = null;
		// guess size of reloc-referenced symbols
		for(const symbol of sectionSymbols) {
			if(lastSymbol && symbol.pos === lastSymbol.pos) {
				if(lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func !== symbol.callstack.frames[symbol.callstack.frames.length - 1].func)
					lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func += ", " + symbol.callstack.frames[symbol.callstack.frames.length - 1].func;
				continue;
			}
			if(lastEmptySymbol) {
				lastEmptySymbol.size = symbol.pos - lastEmptySymbol.pos;
				lastEmptySymbol.origSize = symbol.origPos - lastEmptySymbol.origPos;
				lastEmptySymbol = null;
			}
//			if(symbol.size <= 0)
//				lastEmptySymbol = symbol;
			lastSymbol = symbol;
		}
		if(lastEmptySymbol) {
			lastEmptySymbol.size = hunk.compressedSize - lastEmptySymbol.pos;
			lastEmptySymbol.origSize = hunk.origSize - lastEmptySymbol.origPos;
		}

		// add symbols to profile
		let lastAddress = 0;
		let lastOrigAddress = 0;
		lastSymbol = null;
		for(const symbol of sectionSymbols) {
			if(symbol.pos > lastAddress + 1) { // gap (unknown symbol), +1 because there may be rounding errors
				locations.push({ frames: [ { func: hunk.name, file: '', line: lastAddress }, { func: '[Unknown]', file:'', line: lastAddress } ] });
				sizes.push(symbol.pos - lastAddress);
				origSizes.push(symbol.origPos - lastOrigAddress);
			}
			locations.push(symbol.callstack);
			sizes.push(symbol.size);
			origSizes.push(symbol.origSize);
			if(symbol.pos >= 0)
				lastAddress = symbol.pos + symbol.size;
			lastOrigAddress = symbol.origPos + symbol.origSize;
			lastSymbol = symbol;
		}
		if(lastAddress + 1 < hunk.compressedSize) {
			locations.push({ frames: [ { func: hunk.name, file: '', line: lastAddress }, { func: '[Unknown]', file:'', line: lastAddress } ] });
			sizes.push(hunk.compressedSize - lastAddress);
			origSizes.push(hunk.origSize - lastOrigAddress);
}
	}
	const out: ICpuProfileRaw = profileCommon(sizes, locations, origSizes);
	return out;
}
