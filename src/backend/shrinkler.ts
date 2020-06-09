import { ICpuProfileRaw } from '../client/types';
import { CallFrame } from './profile_types';
import { profileCommon } from './profile';

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

export function profileShrinkler(stats: Stats) {
	interface DataSymbol {
		callstack: CallFrame;
		address: number;
		size: number;
	}
	type SymbolMap = DataSymbol[];
	const sectionMap: SymbolMap[] = [];

	const sizePerFunction: number[] = [];
	const locations: CallFrame[] = [];

	for(const hunk of stats.hunks) {
		const symbols: SymbolMap = [];
		for(const symbol of hunk.symbols) {
			const callstack: CallFrame = {
				frames: [
					{
						func: hunk.name,
						file: '',
						line: 0
					},
					{
						func: symbol.name,
						file: '',
						line: symbol.compressedPos
					}
				]
			};
			symbols.push({
				callstack,
				address: symbol.compressedPos,
				size: symbol.compressedSize
			});
		}
		sectionMap.push(symbols);
	}

	for(let i = 0; i < stats.hunks.length; i++) {
		const section = sectionMap[i];
		const hunk = stats.hunks[i];
		const sectionSymbols = section.sort((a, b) => a.address - b.address);
		let lastEmptySymbol: DataSymbol = null;
		let lastSymbol: DataSymbol = null;
		// guess size of reloc-referenced symbols
		for(const symbol of sectionSymbols) {
			if(lastSymbol && symbol.address === lastSymbol.address) {
				if(lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func !== symbol.callstack.frames[symbol.callstack.frames.length - 1].func)
					lastSymbol.callstack.frames[lastSymbol.callstack.frames.length - 1].func += ", " + symbol.callstack.frames[symbol.callstack.frames.length - 1].func;
				continue;
			}
			if(lastEmptySymbol) {
				lastEmptySymbol.size = symbol.address - lastEmptySymbol.address;
				lastEmptySymbol = null;
			}
			if(symbol.size === 0)
				lastEmptySymbol = symbol;
			lastSymbol = symbol;
		}
		if(lastEmptySymbol)
			lastEmptySymbol.size = hunk.compressedSize - lastEmptySymbol.address;

		// add symbols to profile
		let lastAddress = 0;
		lastSymbol = null;
		for(const symbol of sectionSymbols) {
			if(lastSymbol && lastSymbol.address === symbol.address)
				continue;
			if(symbol.size === 0)
				continue;
			if(symbol.address > lastAddress) { // gap (unknown symbol)
				locations.push({ frames: [ { func: hunk.name, file: '', line: lastAddress } ] });
				sizePerFunction.push(symbol.address - lastAddress);
			}
			locations.push(symbol.callstack);
			sizePerFunction.push(symbol.size);
			lastAddress = symbol.address + symbol.size;
			lastSymbol = symbol;
		}
		if(lastAddress < hunk.compressedSize) {
			locations.push({ frames: [ { func: hunk.name, file: '', line: lastAddress } ] });
			sizePerFunction.push(hunk.compressedSize - lastAddress);
		}
	}
	const out: ICpuProfileRaw = profileCommon(sizePerFunction, locations);
	return out;
}
